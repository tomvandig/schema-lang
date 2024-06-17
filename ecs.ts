import { ECSID, ComponentInstance } from "./sm_primitives";

export class Component 
{
    payload: ComponentInstance;
    constructor(payload: any)
    {
        this.payload = payload;
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
        if (this.components.get(ecsid))
        {
            throw new Error(`Setting duplicate component on name ${ECSID.toString()}`);   
        }

        this.components.set(ecsid, new Component(component));
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
            let output = {};
            component.payload.ToJSON(output);
            json.components.push({
                id: id.ToString(),
                component: output
            })
        } 
        
        return json;
    }
}