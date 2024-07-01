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
class LayeredECS
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

        return composedChildren.values();
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
        let layerClasses: LayerClasses = {
            classLayersByHash: new Map()
        };

        this.layers.forEach((layer) => {
            let component = layer.ecs.GetComponent(ecsid, componentName);

            if (component)
            {
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

    GetComponentAs<T extends ComponentInstance>(type: { new(): T ;}, ecsid: ECSID, componentName: string): LayerComponent<T>[] | undefined
    {
        let layerClasses = this.GetLayeredComponent(ecsid, componentName);

        let component = new Component();

        for (let [hash, layerClass] of layerClasses.classLayersByHash)
        {
            let lastLayer = layerClass[layerClass.length - 1];
            component.classesByHash.set(hash, lastLayer.classData);
        }

        return component.ConvertToConcreteComponent(type);
    }

    GetAs<T extends ComponentInstance>(type: { new(): T ;}, ecsid: ECSID): LayerComponent<T>[] | undefined
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