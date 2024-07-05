import { Component, ECS, Link } from "./ecs";
import { ComponentInstance, ECSID, Rel } from "./sm_primitives";

interface LayerLink {
    link: Link;
    layers: string[];        
}

interface LayerClass
{
    classData: any;
    layers: string[];
}

interface LayerClasses {
    classLayersByHash: Map<string, LayerClass[]>;
}

interface Layer
{
    ecs: ECS;
    name: string;
}

// TODO: need to take type overrides into account for getting/querying comopnents
export class LayeredECS
{
    // lower indices have lower priority, e.g layers[1] overrides layers[0]
    layers: Layer[];

    constructor(layers: Layer[])
    {
        this.layers = layers;
    }

    GetLayeredChildren(id: string)
    {
        let composedChildren: Map<string, LayerLink[]> = new Map();

        this.layers.forEach((layer) => {
            let layerChildren = layer.ecs.GetChildren(id);

            if (layerChildren)
            {
                // TODO: simplify to keeping last layer only
                // this layer has children for the requested id
                layerChildren.forEach((layerChild) => {
                    let found = false;
                    let children = composedChildren.get(layerChild.name);
                    if (children)
                    {
                        // the output already has a children with this name
                        children.forEach((opinionChild) => {
                            if (opinionChild.link.reference === layerChild.reference)
                            {
                                // the output has this exact reference already
                                found = true;
                                opinionChild.layers.push(layer.name);
                            }
                        })
                    }
                    else
                    {
                        // the output has no children with this name
                        composedChildren.set(layerChild.name, []);
                    }

                    if (!found)
                    {
                        // if the output does not have this reference, add it
                        composedChildren.get(layerChild.name)?.push({
                            layers: [layer.name],
                            link: {...layerChild}
                        });
                    }
                });
            }
        });

        return [...composedChildren.values()];
    }

    GetChildren(id: string)
    {
        let layeredChildren = this.GetLayeredChildren(id);

        if (!layeredChildren) return undefined;

        let children: Link[] = [];
        for (let child of layeredChildren)
        {
            let lastLayer = child[child.length - 1];
            children.push(lastLayer.link);
        }

        return children;
    }

    GetLayeredComponent(ecsid: ECSID, componentName: string)
    {
        // if set to true, a layered component is the union of all component classes registered to the component name, subject to layer priority
        // this is nice in terms of data preservation, but also causes confusion as the idea of "component type" dilutes
        // a single component name can contain multiple component types in this way, from different layers
        // a merging like this has possible benefits but should be approached in a different way
        const MERGE_CLASSES_ACROSS_LAYERS = false;

        let layerClasses: LayerClasses = {
            classLayersByHash: new Map()
        };

        this.layers.forEach((layer) => {
            let component = layer.ecs.GetComponent(ecsid, componentName);

            if (component)
            {
                if (!MERGE_CLASSES_ACROSS_LAYERS)
                {
                    layerClasses.classLayersByHash.clear();
                }
                // this layer has a component for this ID/name
                // check if we already have a match
                for (let [hash, classObj] of component.classesByHash)
                {
                    if (!layerClasses.classLayersByHash.has(hash))
                    {
                        layerClasses.classLayersByHash.set(hash, [{
                            classData: classObj,
                            layers: []
                        }]);
                    }

                    let layerObj = layerClasses.classLayersByHash.get(hash);
                    let lastLayer = layerObj![layerObj!.length - 1];

                    // TODO: fix equal check
                    if (lastLayer.classData === classObj)
                    {
                        // contribute to layer
                        lastLayer.layers.push(layer.name); // append
                    }
                    else
                    {
                        // add layer
                        layerObj!.push({
                            classData: classObj,
                            layers: [layer.name]
                        });
                    }
                }
            }
        })

        return layerClasses;
    }

    GetComponent(ecsid: ECSID, componentName: string): Component | undefined
    {
        let layerClasses = this.GetLayeredComponent(ecsid, componentName);

        let component = new Component();

        for (let [hash, layerClass] of layerClasses.classLayersByHash)
        {
            let lastLayer = layerClass[layerClass.length - 1];
            component.classesByHash.set(hash, lastLayer.classData);
        }

        return component;
    }

    GetComponentAs<T extends ComponentInstance>(type: { new(): T ;}, ecsid: ECSID, componentName: string): T | undefined
    {
        return this.GetComponent(ecsid, componentName)?.ConvertToConcreteComponent(type);
    }
    
    ComponentIsOfType<T>(id: ECSID, type: { new(): T ;})
    {
        //@ts-ignore
        return this.GetComponent(id.Pop(), id.GetLast())?.ContainsHashGroup(type.hashGroup);
    }

    GetAs<T extends ComponentInstance>(type: { new(): T ;}, ecsid: ECSID): T | undefined
    {
        let id = ecsid.Pop();
        let componentName = ecsid.GetLast();

        return this.GetComponentAs(type, id, componentName);
    }
    
    FollowRelation<T extends { new(): ComponentInstance; }>(rel: Rel<T>)
    {
        return this.GetAs(rel.type, rel.ecsid);
    }

    QueryComponentIdsByType<T>(type: { new(): T ;}): ECSID[]
    {
        // TODO: this is terrible
        let ids: any = {};

        for (let i = this.layers.length - 1; i >= 0; i--)
        {
            let components = this.layers[i].ecs.QueryComponentIdsByType(type);

            components.forEach((id) => {

                // this ID is of the type, if higher layers did not override
                if (!ids[id.ToString()])
                {
                    let upperOverride = false;
                    for (let j = i + 1; j < this.layers.length; j++)
                    {
                        let componentOfUpperLayer = this.layers[j].ecs.ComponentIsOfType(id, type);
                        if (componentOfUpperLayer === false)
                        {
                            upperOverride = true;
                            break;
                        }   
                    }

                    if (!upperOverride)
                    {
                        ids[id.ToString()] = {
                            topEncounteredLayer: i
                        };
                    }
                }
            })
        }

        return Object.keys(ids).map((s) => ECSID.FromString(s));
    }
}