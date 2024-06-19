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

    constructor(ecsid: ECSID)
    {
        this.ecsid = ecsid;
    }
}