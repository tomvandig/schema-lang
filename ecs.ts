import { ECSID } from "./sm_primitives";

export class Component 
{
    name: string;
    payload: any;
    constructor(name: string, payload: any)
    {
        this.name = name;
        this.payload = payload;
    }
}

export class ECS
{
    parents: Map<ECSID, ECSID[]>;
    entityToComponentSet: Map<ECSID, Component>;

    constructor()
    {
        this.parents = new Map();
        this.entityToComponentSet = new Map();
    }

    AddComponent(ecsid: ECSID, component: any)
    {
        if (this.entityToComponentSet.get(ecsid))
        {
            throw new Error(`Setting duplicate component on name ${ECSID.toString()}`);   
        }

        this.entityToComponentSet.set(ecsid, component);
    }

    AddParent(ecsid: ECSID, parentECSID: ECSID)
    {
        if (!this.parents.get(ecsid))
        {
            this.parents.set(ecsid, []);
        }

        this.parents.get(ecsid)?.push(parentECSID);
    }
}