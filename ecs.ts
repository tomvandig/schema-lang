
export class component 
{
    name: string;
    payload: any;
    constructor(name: string, payload: any)
    {
        this.name = name;
        this.payload = payload;
    }
}

export class ComponentSet
{
    components: Map<string, component>;

    constructor()
    {
        this.components = new Map();
    }
}

export class ecs
{
    parents: Map<string, string[]>;
    entityToComponentSet: Map<string, ComponentSet>;

    constructor()
    {
        this.parents = new Map();
        this.entityToComponentSet = new Map();
    }

    AddComponent(entityId: string, componentName: string, component: any)
    {
        if (!this.entityToComponentSet.get(entityId))
        {
            this.entityToComponentSet.set(entityId, new ComponentSet());
        }
        let set = this.entityToComponentSet.get(entityId)!;

        if (set.components.get(componentName))
        {
            throw new Error(`Setting duplicate component on name ${componentName}`);   
        }

        set.components.set(componentName, component);
    }

    AddParent(entityId: string, parentEntityId: string)
    {
        if (!this.parents.get(entityId))
        {
            this.parents.set(entityId, []);
        }

        this.parents.get(entityId)?.push(parentEntityId);
    }
}