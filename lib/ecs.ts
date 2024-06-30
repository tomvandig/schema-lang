import { Schema, SchemaClass } from "./schema-def";
import { ECSID, ComponentInstance, Rel, ValidateObjectWithHashes } from "./sm_primitives";

export class Component 
{
    classesByHash: Map<string, any>;
    constructor()
    {
        this.classesByHash = new Map();
    }

    ContainsHashGroup(group: string[])
    {
        for (let i = 0; i < group.length; i++)
        {
            if (!this.classesByHash.has(group[i]))
            {
                return false;
            }   
        }

        return true;
    }

    ContainsAnyHashOfGroup(group: string[])
    {
        let count = 0;
        for (let i = 0; i < group.length; i++)
        {
            if (this.classesByHash.has(group[i]))
            {
                count++;
            }
            else
            {
                break;
            }   
        }

        return count > 0;
    }

    AsJSON()
    {
        let classes = {};

        for (let [hash, classtype] of this.classesByHash)
        {
            classes[hash] = classtype;   
        }
        
        return classes;
    }

    ConvertToConcreteComponent<T extends ComponentInstance>(type: { new(): T ;})
    {
        //@ts-ignore // TODO: fix typing
        if (!this.ContainsAnyHashOfGroup(type.hashGroup))
        {
            return undefined;
        }

        return new type().FromJSON(this.AsJSON());
    }
}

export class Link
{
    name: string;
    reference: string;
}

export class ECS
{
    children: Map<string, Link[]>;
    components: Map<string, Component>;
    schemas: Map<string, Schema>;
    schemaClasses: Map<string, SchemaClass>;

    constructor()
    {
        this.children = new Map();
        this.components = new Map();
        this.schemas = new Map();
        this.schemaClasses = new Map();
    }

    RegisterSchema(schema: Schema)
    {
        this.schemas.set(schema.name, schema);
        
        schema.classes.forEach((cl) => {
            this.schemaClasses.set(cl.hash, cl);
        })
    }

    GetSchemaForHash(hash: string)
    {
        if (!this.schemaClasses.has(hash))
        {
            return undefined;
        }

        return this.schemaClasses.get(hash)!;
    }

    AddComponent(ecsid: ECSID, componentName: string, component: ComponentInstance)
    {
        let classes = {};
        component.ToJSON(classes);

        this.AddClasses(ecsid, componentName, classes);
    }

    AddClasses(ecsid: ECSID, componentName: string, componentClassesByHash: any)
    {
        if (this.components.get(ecsid.ToString()))
        {
            throw new Error(`Setting duplicate component on name ${ECSID.toString()}`);   
        }

        let comp = new Component();
        Object.keys(componentClassesByHash).forEach((hash) => {
            comp.classesByHash.set(hash, componentClassesByHash[hash]);
        })
        this.components.set(ecsid.Push(componentName).ToString(), comp);
    }

    Link(parentECSID: ECSID, name: string, ecsid: ECSID, )
    {
        if (!this.children.get(parentECSID.ToString()))
        {
            this.children.set(parentECSID.ToString(), []);
        }

        this.children.get(parentECSID.ToString())?.push({name, reference: ecsid.ToString()});
    }

    GetComponent(ecsid: ECSID, componentName: string) : Component | undefined
    {
        if (ecsid.IsRoot())
            {
                return undefined;
            }
    
            // A.B.C.component: check for fully qualified component id, this gets precedence
            let component = this.components.get(ecsid.Push(componentName).ToString());
    
            if (component)
            {
                return component;
            }
            else if (!ecsid.IsLeaf())
            {
                // if fully qualified is not found, check up to leaf
                // B.C.component
                // C.component
                
                let sub = ecsid.Shift(); // B.C
                let component = this.GetComponent(sub, componentName);
                if (component)
                {
                    return component;
                }
                else
                {
                    // B might be a reference
                    let linkName = sub.GetFirst();
                    let children = this.children.get(ecsid.GetFirst());
                    let links = children?.filter((value) => value.name === linkName);
                    if (links && links.length === 1)
                    {
                        if (links[0].reference != links[0].name)
                        {
                            return this.GetComponent(sub.ReplaceFirst(links[0].reference), componentName);
                        }
                    }
                    return undefined;
                }
            }
            else
            {
                // if I am a leaf, but did not have a component
                // could still be a rooted renamed entity
                // TODO: duplicate code with above
                let linkName = ecsid.GetFirst();
                let children = this.children.get("");
                let links = children?.filter((value) => value.name === linkName);
                if (links && links.length === 1)
                {
                    if (links[0].reference != links[0].name)
                    {
                        return this.GetComponent(new ECSID([links[0].reference]), componentName);
                    }
                }
                return undefined;
            }
    }

    GetComponentAs<T extends ComponentInstance>(type: { new(): T ;}, ecsid: ECSID, componentName: string): T | undefined
    {
        let component = this.GetComponent(ecsid, componentName);
        return component?.ConvertToConcreteComponent(type);
    }

    GetAs<T extends ComponentInstance>(type: { new(): T ;}, ecsid: ECSID): T | undefined
    {
        let id = ecsid.Pop();
        let componentName = ecsid.GetLast();

        return this.GetComponentAs(type, id, componentName);
    }

    FollowRelation<T extends { new(): ComponentInstance; }>(rel: Rel<T>)
    {
        // TODO: allow relative relationship IDs
        return this.GetAs(rel.type, rel.ecsid);
    }

    QueryComponentIdsByType<T>(type: { new(): T ;}): ECSID[]
    {
        let returnValue: ECSID[] = [];
        this.components.forEach((component, id) => {
            //@ts-ignore // TODO
            if (component.ContainsHashGroup(type.hashGroup))
            {
                returnValue.push(ECSID.FromString(id));
            }
        });

        return returnValue;
    }

    QueryComponentsByType<T>(type: { new(): T ;}): T[]
    {
        let returnValue: T[] = [];
        this.components.forEach((component) => {
            //@ts-ignore // TODO
            if (component.ContainsHashGroup(type.hashGroup))
            {
                returnValue.push(
                    //@ts-ignore // TODO
                    new type().FromJSON(component.AsJSON())
                );
            }
        });

        return returnValue;
    }

    ExportToJSON()
    {
        let json = {
            tree: [] as any[],
            components: [] as any[],
            schemas: [] as Schema[]
        };

        for (let [entity, children] of this.children) {
            json.tree.push({
                id: entity,
                children: children.map((child) => child)
            })
        }

        for (let [id, component] of this.components) 
        {
            let exportedComponent = {};
            for (let [hash, comp] of component.classesByHash)
            {
                exportedComponent[hash] = comp;
            }
            let ecsid = ECSID.FromString(id);
            let entity = ecsid.Pop();
            json.components.push({
                id: entity.ToString(),
                name: ecsid.GetLast(),
                classes: exportedComponent
            })
        }

        for (let [name, schema] of this.schemas)
        {
            json.schemas.push(schema);   
        }
        
        return json;
    }

    GetChildren(id: string)
    {
        return this.children.get(id);
    }

    FlattenToJSONRecursive(type: {new(): ComponentInstance}, node: string, nodeID: ECSID, output: any)
    {
        // component
        let component = this.GetAs(type, nodeID.Push("geometry"));

        if (component)
        {
            //@ts-ignore
            output.color = component.color;
        }

        let children = this.GetChildren(node);

        if (children)
        {
            children?.forEach((child) => {
                output[child.name] = {};
                this.FlattenToJSONRecursive(type, child.reference, nodeID.Push(child.name), output[child.name]);
            });
        }
    }

    FlattenToJSON(type: {new(): ComponentInstance})
    {
        let output = {} as any;

        this.FlattenToJSONRecursive(type, "", new ECSID([]), output);

        return output;
    }

    static ImportFromJSON(json: any)
    {
        let ecs = new ECS();

        // first load schemas so the components can be validated
        json.schemas.forEach((schema) => {
            ecs.RegisterSchema(schema);
        });

        json.tree.forEach((item) => {
            let parent = ECSID.FromString(item.id);
            item.children.forEach((child) => {
                let name = child.name;
                let reference = child.reference;
                ecs.Link(parent, name, ECSID.FromString(reference));
            })
        });

        json.components.forEach((component) => {
            let id = ECSID.FromString(component.id);
            let name = component.name;
            let classes = component.classes;

            try {
                ValidateObjectWithHashes(ecs.GetSchemaForHash.bind(ecs), classes);
            } catch(e)
            {
                console.error(`Error validating component ${component.id}.${component.name}:`);
                throw e;
            }
            ecs.AddClasses(id, name, classes);
        });

        return ecs;
    }
}