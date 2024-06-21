const ECSID_DELIM = ".";

export interface ComponentInstance
{
    ToJSON(__export: any);
    GetComponentName(): string;
}

export class ECSID
{
    parts: string[];

    constructor(parts: string[])
    {
        this.parts = parts;
    }

    static FromString(str:string)
    {
        return new ECSID(str.split(ECSID_DELIM));
    }

    Push(part: string)
    {
        return new ECSID([...this.parts, part]);
    }

    PushOther(other: ECSID)
    {
        return new ECSID([...this.parts, ...other.parts]);
    }

    Pop()
    {
        return new ECSID([...this.parts.slice(0, -1)])
    }

    GetLast()
    {
        return this.parts[this.parts.length - 1];
    }

    ToString()
    {
        return this.parts.join(ECSID_DELIM);
    }

    IsRoot()
    {
        return this.parts.length === 0;
    }
}

export class Rel<T> {
    ecsid: ECSID;
    type: T;

    constructor(t: T, ecsid: ECSID)
    {
        this.type = t;
        this.ecsid = ecsid;
    }
}