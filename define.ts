import * as esbuild from 'esbuild';
import * as fs from "fs";
import * as path from "path";
import shajs from "sha.js"

// Define the path to your tsconfig.json
const tspath = path.resolve(__dirname, 'schema.ts');

// Run esbuild

async function EvaluateSchemaFile(filename: string)
{
    let jscode = (await esbuild.build({
        entryPoints: [filename],
        bundle: true,
        platform: 'node',
        logLevel: 'info',
        write: false,
      })).outputFiles[0].text;

    jscode += 'output = JSON.stringify(Object.values(module.exports), null, 4);';
    
    let output;
    eval(jscode);

    return JSON.parse(output);
}

function AnalyzeValue(rawValue: any)
{
    if (typeof rawValue === "string")
    {
        return rawValue;
    } 
    if (Array.isArray(rawValue))
    {
        let arrayType = AnalyzeValue(rawValue[0]);
        return {
            type: "array",
            arrayType
        }
    }
    if (typeof rawValue === "object")
    {
        if (!rawValue["_rel"])
        {
            let referencedClasses = AnalyzeExport(rawValue);

            return {
                type: "reference",
                referencedType: referencedClasses["classes"][0]
            }
        }
        else
        {
            let referencedClasses = AnalyzeExport(rawValue["_rel"]);

            return {
                type: "relationship",
                referencedType: referencedClasses["classes"][0]
            }
        }
    }

    return null;
}

function AnalyzeClass(name:string, rawClassDef: any)
{
    let classDef = {
        name,
        hash: "", // this is stupid
        values: [] as any
    }

    Object.keys(rawClassDef).forEach((valueName) => {
        classDef.values.push({
            name: valueName,
            type: AnalyzeValue(rawClassDef[valueName])
        })
    });

    return classDef;
}

function AnalyzeExport(exported: any)
{
    let schemaDef = {
        hash: "", // this is stupid
        classes: [] as any
    };

    Object.keys(exported).forEach((exportedName) => {
        let analyzedClass = AnalyzeClass(exportedName, exported[exportedName]);
        analyzedClass.hash = HashClass(AnalyzeClass(exportedName, exported[exportedName]));
        schemaDef.classes.push(analyzedClass);
    });

    return schemaDef;
}

function HashClass(c)
{
    let bytes = JSON.stringify(c);
    return shajs('sha256').update(bytes).digest('hex');
}

function AnalyzeSchema(filename: string, rawSchema: any)
{
    let outputSchema: any = {};
    outputSchema.originalFileName = filename; 

    let c = AnalyzeExport(rawSchema[0]);
    c.hash = HashClass(c);
    outputSchema.root = c;

    return outputSchema;
}

async function ConvertSchemaTS(filename: string)
{
    let rawSchema = await EvaluateSchemaFile(filename);

    fs.writeFileSync("schema_ser_raw.json", JSON.stringify(rawSchema, null, 4));

    let outputSchema = AnalyzeSchema(filename, rawSchema);

    fs.writeFileSync("schema_ser.json", JSON.stringify(outputSchema, null, 4));
}

ConvertSchemaTS('./schema.ts');