import { ECSID, ComponentInstance } from "./sm_primitives";

export class Component 
{
    classesByHash: Map<string, any>;
    constructor()
    {
        this.classesByHash = new Map();
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

        this.AddClasses(ecsid, classes);
    }

    AddClasses(ecsid: ECSID, componentClassesByHash: any)
    {
        if (this.components.get(ecsid))
        {
            throw new Error(`Setting duplicate component on name ${ECSID.toString()}`);   
        }

        let comp = new Component();
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
            let classes = component.classes;
            ecs.AddClasses(id, classes);
        });

        return ecs;
    }
}