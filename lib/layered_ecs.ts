import { ECS, Link } from "./ecs";
import { ComponentInstance, ECSID, Rel } from "./sm_primitives";

interface LayerLink {
    link: Link;
    layers: string[];        
}

interface LayerComponent<T extends ComponentInstance> {
    component: T;
    layers: string[];        
}

interface Layer
{
    ecs: ECS;
    name: string;
}

class LayeredECS
{
    // lower indices have lower priority, e.g layers[1] overrides layers[0]
    layers: Layer[];

    constructor(layers: Layer[])
    {
        this.layers = layers;
    }

    GetChildren(id: string)
    {
        let composedChildren: Map<string, LayerLink[]> = new Map();

        this.layers.forEach((layer) => {
            let layerChildren = layer.ecs.GetChildren(id);

            if (layerChildren)
            {
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

    GetComponentAs<T extends ComponentInstance>(type: { new(): T ;}, ecsid: ECSID, componentName: string): LayerComponent<T>[] | undefined
    {
        let composedComponents: LayerComponent<T>[] = [];

        this.layers.forEach((layer) => {
            let component = layer.ecs.GetComponentAs(type, ecsid, componentName);

            if (component)
            {
                let found = false;
                composedComponents.forEach((composedComponent) => {
                    // TODO: should probably do a value hash here
                    // check if equal, set found=true, append layer
                    // this is incorrect, need to merge all classes of the component and resolve duplicates
                    // --> need LayerClass, not LayerComponent
                })

                if (!found)
                {
                    composedComponents.push({
                        component,
                        layers: [layer.name]
                    });   
                }
            }
        })


        return composedComponents;
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
        return [];
    }

    QueryComponentsByType<T>(type: { new(): T ;}): T[]
    {
        return [] as T[];
    }
}