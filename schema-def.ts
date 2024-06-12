
export interface SchemaEnumValue
{
    type: "enum";
    options: string[];
}

export interface SchemaCompositionValue
{
    type: "composition";
    ofClasses: SchemaClass[];
}

export interface SchemaArrayValue
{
    type: "array";
    arrayType: SchemaClassValue[];
}


export interface SchemaRelationshipValue
{
    type: "relationship";
    withClasses: SchemaClass[];
}

export type SchemaClassValue =
string | SchemaEnumValue | SchemaRelationshipValue | SchemaArrayValue | SchemaCompositionValue;

export interface SchemaClassNamedValue
{
    name: string;
    type: SchemaClassValue;
}

export interface SchemaClass
{
    name: string;
    hash: string;
    values: SchemaClassValue[]; 
}

export interface Schema {
    name: string;
    classes: SchemaClass[];
}

export interface SchemaFile {
    originalFileName: string;
    roots: Schema[];
}