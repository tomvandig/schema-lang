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

    GenCodeForClass(schema: SchemaClass)
    {
        this.code.EmitCode(`static hash = "${schema.hash}";`);
        schema.values.forEach((value) => {
            this.code.EmitCode(`${value.name}: string;`);
        })
    }

    GenCodeForSchema(schema: Schema)
    {
        this.code.EmitCode(`// generated code for ${schema.name}`);

        this.code.EmitCode(`namespace ${this.CleanupSchemaName(schema.name)}`)
        this.code.StartBlock();

        schema.classes.forEach((schemaClass) => {
            this.code.EmitCode(`class ${this.CleanupSchemaName(schemaClass.name)} `, false);
            this.code.StartBlock();
            this.GenCodeForClass(schemaClass);
            this.code.EndBlock();
            this.code.NewLine();
        })

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