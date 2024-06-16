import * as fs from "fs";
import { Schema, SchemaClass, SchemaClassNamedValue, SchemaClassValue, SchemaFile } from "./schema-def";

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

function CleanupSchemaName(str: string)
{
    return str.replace(/::/g, "_");
}

class TSCodeGen
{
    code: CodeFormat;
    mainInclude: string;
    classToFileMap: any;

    constructor(mainInclude: string, classToFileMap: any)
    {
        this.mainInclude = mainInclude;
        this.classToFileMap = classToFileMap;
    }

    GenTypeForValue(value: SchemaClassValue)
    {
        if (typeof value === "string")
        {
            if (value === "f32") return "number";
            if (value === "string") return "string";
            return "<unknown primitive>";
        }
        if (value.type === "enum")
        {
            return `${value.options.map(option => `"${option}"`).join("|")}`;
        }
        if (value.type === "composition")
        {
            return `${CleanupSchemaName(value.ofClasses.name)}`;
        }
        if (value.type === "relationship")
        {
            return `Rel<${CleanupSchemaName(value.withClasses.name)}>`;
        }
        if (value.type === "array")
        {
            return `${this.GenTypeForValue(value.arrayType)}[]`;
        }
        return "<unknown>";
    }

    GenDefCodeForClass(schema: SchemaClass)
    {
        this.code.EmitCode(`// ${schema.name}`);
        schema.values.forEach((value) => {
            this.code.EmitCode(`${value.name}: ${this.GenTypeForValue(value.type)};`);
        })
    }

    GenExportCodeForValue(inputName: string, outputName: string, value: SchemaClassValue)
    {
        if (typeof value === "string")
        {
            this.code.EmitCode(`${outputName} = ${inputName};`);
            return;
        }
        if (value.type === "enum")
        {
            this.code.EmitCode(`${outputName} = ${inputName};`);
            return;
        }
        if (value.type === "composition")
        {
            this.code.EmitCode(`${outputName} = {};`);
            this.code.EmitCode(`${inputName}.ToJSON(${outputName});`);
            return;
        }
        if (value.type === "relationship")
        {
            this.code.EmitCode(`${outputName} = { rel: ${inputName}.entityId };`);
        }
        if (value.type === "array")
        {
            this.code.EmitCode(`${outputName} = []`);
            this.code.EmitCode(`${inputName}.forEach((obj) => `, false);
            this.code.StartBlock();
            this.code.EmitCode(`let out;`);
            this.GenExportCodeForValue("obj", "out", value.arrayType);
            this.code.EmitCode(`${outputName}.push(out)`);
            this.code.EndBlock();
            this.code.EmitCode(`);`);
            return;
        }
        return "<unknown_export_type>";
    }

    GenExportCodeForNamedValue(value: SchemaClassNamedValue)
    {
        this.GenExportCodeForValue(`this.${value.name}`, `__export.${value.name}`, value.type);
    }

    GenExportCodeForClass(schema: SchemaClass)
    {
        this.code.EmitCode(`// ${schema.name}`);
        this.code.EmitCode(`// ${schema.hash}`);
        schema.values.forEach((value) => {
            this.GenExportCodeForNamedValue(value);
        })
    }

    GenImportCodeForValue(inputName: string, outputName: string, value: SchemaClassValue)
    {
        if (typeof value === "string")
        {
            this.code.EmitCode(`${outputName} = ${inputName};`);
            return;
        }
        if (value.type === "enum")
        {
            this.code.EmitCode(`${outputName} = ${inputName};`);
            return;
        }
        if (value.type === "composition")
        {
            let className = CleanupSchemaName(value.ofClasses.name);
            this.code.EmitCode(`${outputName} = ${className}.FromJSON(${inputName});`);
            return;
        }
        if (value.type === "relationship")
        {
            let className = CleanupSchemaName(value.withClasses.name);
            this.code.EmitCode(`${outputName} = new Rel<${className}>(${inputName}.rel);`);
            return;
        }
        if (value.type === "array")
        {
            this.code.EmitCode(`${outputName} = []`);
            this.code.EmitCode(`${inputName}.forEach((obj) => `, false);
            this.code.StartBlock();
            this.code.EmitCode(`let out;`);
            this.GenImportCodeForValue("obj", "out", value.arrayType);
            this.code.EmitCode(`${outputName}.push(out)`);
            this.code.EndBlock();
            this.code.EmitCode(`);`);
            return;
        }
        return "<unknown_export_type>";
    }

    GenImportCodeForNamedValue(value: SchemaClassNamedValue)
    {
        this.GenImportCodeForValue(`__import.${value.name}`, `instance.${value.name}`, value.type);
    }

    GenImportCodeForClass(schema: SchemaClass)
    {
        this.code.EmitCode(`// ${schema.name}`);
        this.code.EmitCode(`// ${schema.hash}`);
        schema.values.forEach((value) => {
            this.GenImportCodeForNamedValue(value);
        })
    }

    GenCodeForSchema(schema: Schema)
    {
        this.code.EmitCode(`// generated code for ${schema.name}`);

        this.code.EmitCode(`export class ${CleanupSchemaName(schema.name)}`)
        this.code.StartBlock();

        schema.classes.forEach((schemaClass) => {
            this.GenDefCodeForClass(schemaClass);
        })

        this.code.EmitCode(`ToJSON(__export: any)`, false)
        this.code.StartBlock();
        schema.classes.forEach((schemaClass) => {
            this.GenExportCodeForClass(schemaClass);
        })
        this.code.EndBlock();

        
        this.code.EmitCode(`static FromJSON(__import)`, false)
        this.code.StartBlock();
        this.code.EmitCode(`let instance = new ${CleanupSchemaName(schema.name)}()`)
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
        this.code.EmitCode(`import { Rel } from "${this.mainInclude}"`);
        this.code.NewLine();

        // TODO: scan for relevant
        Object.keys(this.classToFileMap).forEach((className) => {
            let filename = this.classToFileMap[className];
            if (schemaFile.originalFileName.indexOf(filename.replace("./", "")) == -1)
            {
                this.code.EmitCode(`import { ${className} } from "${filename}"`);
            }
        })

        this.code.NewLine();

        schemaFile.roots.forEach((root) => {
            this.GenCodeForSchema(root);
        })

        return this.code.ToString();
    }
}

function GenCodeForSchemaFile(schema: SchemaFile, classToFileMap: {})
{
    let outputFileName = schema.originalFileName.replace(/.json/g, ".ts").replace("input", "output");

    let mainInclude = "../sm_primitives.ts";

    let codeGen = new TSCodeGen(mainInclude, classToFileMap);
    let code = codeGen.GenCodeForSchemaFile(schema);
    fs.writeFileSync(require("path").join(outputFileName), code);
}

function GetClassNames(schema: SchemaFile)
{
    return schema.roots.map(r => CleanupSchemaName(r.name));
}

function GetClassToFileMapping(schemas: SchemaFile[]) 
{
    let map = {};
    schemas.forEach((schema) => {
        GetClassNames(schema).forEach((classname) => {
            let filename = schema.originalFileName;
            filename = filename.replace("input\\", "");
            filename = `./${filename}`;
            map[classname] = filename;
        })
    });
    return map;
}

function GetSchemasInDir(dir: string)
{
    let schemas: SchemaFile[] = [];
    fs.readdirSync(dir).forEach((path) => {
        if (path.endsWith(".json")){
            const json = JSON.parse(fs.readFileSync(require("path").join(dir, path)).toString());
            schemas.push(json as SchemaFile);
        }
    })
    return schemas;
}

function GenCodeForSchemaDir(dir: string)
{
    let schemas = GetSchemasInDir(dir);
    let mapping = GetClassToFileMapping(schemas);

    schemas.forEach((schema) => {
        GenCodeForSchemaFile(schema, mapping);
    })
}
GenCodeForSchemaDir("input");