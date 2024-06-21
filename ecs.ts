import { ECSID, ComponentInstance, Rel } from "./sm_primitives";

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
}

export class ECS
{
    parents: Map<string, string[]>;
    children: Map<string, string[]>;
    components: Map<string, Component>;

    constructor()
    {
        this.parents = new Map();
        this.children = new Map();
        this.components = new Map();
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

    AddParent(ecsid: ECSID, parentECSID: ECSID)
    {
        if (!this.parents.get(ecsid.ToString()))
        {
            this.parents.set(ecsid.ToString(), []);
        }
        if (!this.children.get(parentECSID.ToString()))
        {
            this.children.set(parentECSID.ToString(), []);
        }

        this.parents.get(ecsid.ToString())?.push(parentECSID.ToString());
        this.children.get(parentECSID.ToString())?.push(ecsid.ToString());
    }

    GetAs<T extends ComponentInstance>(type: { new(): T ;}, ecsid: ECSID): T | undefined
    {
        let component = this.components.get(ecsid.ToString());

        if (!component)
        {
            let componentName = ecsid.GetLast();
            let entityName = ecsid.Pop().GetLast();
            component = this.components.get(new ECSID([entityName, componentName]).ToString());
        }

        if (!component) {
            return undefined;
        }

        //@ts-ignore // TODO: fix typing
        if (!component.ContainsAnyHashOfGroup(type.hashGroup))
        {
            return undefined;
        }

        return new type().FromJSON(component.AsJSON());
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
            schemas: [] as any[]
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

        // TODO: schemas
        
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

        // TODO: schemas

        return ecs;
    }
}