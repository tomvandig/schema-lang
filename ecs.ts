import { ECSID, ComponentInstance } from "./sm_primitives";

export class Component 
{
    classesByHash: Map<string, any>;
    name: string;
    constructor(name: string)
    {
        this.classesByHash = new Map();
        this.name = name;
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
}

export class ECS
{
    parents: Map<ECSID, ECSID[]>;
    children: Map<ECSID, ECSID[]>;
    components: Map<ECSID, Component>;

    constructor()
    {
        this.parents = new Map();
        this.children = new Map();
        this.components = new Map();
    }

    AddComponent(ecsid: ECSID, component: ComponentInstance)
    {
        let classes = {};
        component.ToJSON(classes);

        this.AddClasses(ecsid, component.GetComponentName(), classes);
    }

    AddClasses(ecsid: ECSID, componentName: string, componentClassesByHash: any)
    {
        if (this.components.get(ecsid))
        {
            throw new Error(`Setting duplicate component on name ${ECSID.toString()}`);   
        }

        let comp = new Component(componentName);
        Object.keys(componentClassesByHash).forEach((hash) => {
            comp.classesByHash.set(hash, componentClassesByHash[hash]);
        })
        this.components.set(ecsid, comp);
    }

    AddParent(ecsid: ECSID, parentECSID: ECSID)
    {
        if (!this.parents.get(ecsid))
        {
            this.parents.set(ecsid, []);
        }
        if (!this.children.get(parentECSID))
        {
            this.children.set(parentECSID, []);
        }

        this.parents.get(ecsid)?.push(parentECSID);
        this.children.get(parentECSID)?.push(ecsid);
    }

    GetAs<T>(type: { new(): T ;}, ecsid: ECSID): T | undefined
    {
        let component = this.components.get(ecsid);

        if (!component) {
            return undefined;
        }

        //@ts-ignore // TODO
        if (!component.ContainsAnyHashOfGroup(type.hashGroup))
        {
            return undefined;
        }
        // TODO: check hash group

        //@ts-ignore // TODO
        return new type().FromJSON(component.AsJSON());
    }

    QueryComponentIdsByType<T>(type: { new(): T ;}): ECSID[]
    {
        let returnValue: ECSID[] = [];
        this.components.forEach((component, id) => {
            //@ts-ignore // TODO
            if (component.ContainsHashGroup(type.hashGroup))
            {
                returnValue.push(id);
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
            components: [] as any[]
        };

        for (let [entity, children] of this.children) {
            json.tree.push({
                id: entity.ToString(),
                children: children.map((child) => child.ToString())
            })
        }

        for (let [id, component] of this.components) 
        {
            let exportedComponent = {};
            for (let [hash, comp] of component.classesByHash)
            {
                exportedComponent[hash] = comp;
            }
            json.components.push({
                id: id.ToString(),
                name: component.name,
                classes: exportedComponent
            })
        } 
        
        return json;
    }

    static ImportFromJSON(json: any)
    {
        let ecs = new ECS();

        json.tree.forEach((item) => {
            let parent = ECSID.FromString(item.id);
            item.children.forEach((child) => {
                ecs.AddParent(ECSID.FromString(child), parent);
            })
        });

        json.components.forEach((component) => {
            let id = ECSID.FromString(component.id);
            let name = component.name;
            let classes = component.classes;
            ecs.AddClasses(id, name, classes);
        });

        return ecs;
    }
}