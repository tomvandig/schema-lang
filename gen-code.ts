import * as fs from "fs";
import { Schema, SchemaClass, SchemaFile } from "./schema-def";

function Indent(str: string, indent: number)
{
    let out = "";

    for (let i = 0; i < indent; i++)
    {
        out += "\t";
    }

    return out + str;
}

class Block {
    parent: Block;
    children: (Line|Block)[] = [];

    ToString(str: string[], indent: number)
    {
        str.push("{\r\n");

        this.children.forEach((child) => {
            child.ToString(str, indent + 1);
        })

        str.push(Indent("}\r\n", indent));
    }
}

class Line {
    code: string;

    constructor(c: string){
        this.code = c;
    }
    
    ToString(str: string[], indent: number)
    {
        str.push(Indent(this.code, indent));
    }
}

class CodeFormat
{
    currentBlock: Block;
    code: Block;

    constructor()
    {
        this.StartBlock();
        this.code = this.currentBlock;
    }

    EmitCode(code: string, nl = true)
    {
        if (this.currentBlock)
        {
            this.currentBlock.children.push(new Line(code + (nl ? "\r\n" : "")));
        }
    }

    NewLine()
    {
        this.EmitCode("");
    }

    StartBlock()
    {
        let newBlock = new Block();
        newBlock.parent = this.currentBlock;
        if (this.currentBlock)
        {
            this.currentBlock.children.push(newBlock);
        }
        this.currentBlock = newBlock
    }

    EndBlock()
    {
        this.currentBlock = this.currentBlock.parent;
    }

    ToString()
    {
        let str = [];
        
        this.code.children.forEach((code) => {
            code.ToString(str, 0);
        })
        return str.join("");
    }
}

class TSCodeGen
{
    code: CodeFormat;

    CleanupSchemaName(str: string)
    {
        return str.replace(/::/g, "_");
    }

    GenDefCodeForClass(schema: SchemaClass)
    {
        this.code.EmitCode(`// ${schema.name}`);
        schema.values.forEach((value) => {
            this.code.EmitCode(`${value.name}: string;`);
        })
    }
    GenExportCodeForClass(schema: SchemaClass)
    {
        this.code.EmitCode(`// ${schema.name}`);
        this.code.EmitCode(`// ${schema.hash}`);
        schema.values.forEach((value) => {
            this.code.EmitCode(`__export.${value.name} = this.${value.name};`);
        })
    }
    GenImportCodeForClass(schema: SchemaClass)
    {
        this.code.EmitCode(`// ${schema.name}`);
        this.code.EmitCode(`// ${schema.hash}`);
        schema.values.forEach((value) => {
            this.code.EmitCode(`instance.${value.name} = __import.${value.name};`);
        })
    }

    GenCodeForSchema(schema: Schema)
    {
        this.code.EmitCode(`// generated code for ${schema.name}`);

        this.code.EmitCode(`class ${this.CleanupSchemaName(schema.name)}`)
        this.code.StartBlock();

        schema.classes.forEach((schemaClass) => {
            this.GenDefCodeForClass(schemaClass);
        })

        this.code.EmitCode(`Export()`, false)
        this.code.StartBlock();
        this.code.EmitCode(`let __export = {} as any;`)
        schema.classes.forEach((schemaClass) => {
            this.GenExportCodeForClass(schemaClass);
        })
        this.code.EmitCode(`return __export;`)
        this.code.EndBlock();

        
        this.code.EmitCode(`static Import(__import)`, false)
        this.code.StartBlock();
        this.code.EmitCode(`let instance = new ${this.CleanupSchemaName(schema.name)}()`)
        schema.classes.forEach((schemaClass) => {
            this.GenImportCodeForClass(schemaClass);
        })
        this.code.EmitCode(`return instance;`)
        this.code.EndBlock();

        this.code.EndBlock();
    }

    GenCodeForSchemaFile(schemaFile: SchemaFile)
    {
        this.code = new CodeFormat();

        this.code.EmitCode(`// generated code for ${schemaFile.originalFileName}`);

        schemaFile.roots.forEach((root) => {
            this.GenCodeForSchema(root);
        })

        return this.code.ToString();
    }
}

function GenCodeForSchemaFile(file)
{
    const json = JSON.parse(fs.readFileSync(file).toString());

    // TODO: validate
    const schema = json as SchemaFile;

    let codeGen = new TSCodeGen();
    let code = codeGen.GenCodeForSchemaFile(schema);
    fs.writeFileSync("output.ts", code);
}

GenCodeForSchemaFile("schema_ser.json");