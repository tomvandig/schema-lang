import { Schema, SchemaClassValue } from "./schema-def";

const ECSID_DELIM = ".";

export interface ComponentInstance
{
    ToJSON(__export: any);
    FromJSON(__import: any);
    GetSchemaName(): string;
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

function assert(boolval: boolean, problem: string)
{
    if (!boolval)
    {
        throw new Error(problem);
    }
}

function ValidateValue(name: string, value: SchemaClassValue, obj: any)
{
    if (typeof value === "string")
    {
        if (value === "f32") 
        {
            assert(typeof obj === "number", `Expected number for number value ${name}`);
        }
        if (value === "i32") 
        {
            assert(typeof obj === "number", `Expected number for number value ${name}`);
        }
        if (value === "string")
        {
            assert(typeof obj === "string", `Expected string for string value ${name}`);
        } 
        assert(false, `Unknown primitive type ${value}`);
        return;
    }
    if (value.type === "enum")
    {
        assert(typeof obj === "string", `Expected string for enum value ${name}`);
        assert(value.options.indexOf(obj) !== -1, `Expected enum option [${value.options.join(",")}] but got "${obj}"`)
        return;
    }
    if (value.type === "composition")
    {
        assert(typeof obj === "object", `Expected object for composition value ${name}`);

        // TODO: recurse

        return;
    }
    if (value.type === "relationship")
    {
        assert(typeof obj === "object", `Expected object for relation value ${name}`);
        let escid = obj.ecsid;
        assert(typeof escid === "string", `Expected string for ecsid value ${name}`);
        return;
    }
    if (value.type === "array")
    {
        assert(Array.isArray(obj), `Expected array for array value ${name}`);

        obj.forEach((entry) => {
            ValidateValue(name, value.arrayType, entry);
        })

        return;
    }

    throw new Error(`Unknown type ${value}`);
}

export function ValidateObjectWithSchema(schema: Schema, object: any)
{
    schema.classes.forEach((schemaClass) => {
        let h = schemaClass.hash;
        let objClass = object[h];

        if (objClass)
        {
            schemaClass.values.forEach((value) => {
                let objValue = objClass[value.name];

                ValidateValue(value.name, value.type, objValue);
            })    
        }
    })
}