import { ECS, Link } from "./ecs";
import { ComponentInstance, ECSID, Rel } from "./sm_primitives";

interface LayerLink {
    link: Link;
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

    GetComponentAs<T extends ComponentInstance>(type: { new(): T ;}, ecsid: ECSID, componentName: string): T | undefined
    {
        return undefined;
    }

    GetAs<T extends ComponentInstance>(type: { new(): T ;}, ecsid: ECSID): T | undefined
    {
        return undefined;
    }
    
    FollowRelation<T extends { new(): ComponentInstance; }>(rel: Rel<T>)
    {
        // TODO: allow relative relationship IDs
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