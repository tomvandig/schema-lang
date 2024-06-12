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
        if (typeof rawValue[0] === "string")
        {
            return {
                type: "enum",
                options: rawValue
            }
        }
        else
        {
            let arrayType = AnalyzeValue(rawValue[0]);
            return {
                type: "array",
                arrayType
            }
        }
    }
    if (typeof rawValue === "object")
    {
        if (!rawValue["_rel"])
        {
            let referencedClasses = AnalyzeExport(rawValue);

            return {
                type: "composition",
                ofClasses: referencedClasses["classes"][0].classes
            }
        }
        else
        {
            let referencedClasses = AnalyzeExport(rawValue["_rel"]);

            return {
                type: "relationship",
                withClasses: referencedClasses["classes"][0].classes
            }
        }
    }

    return null;
}

function AnalyzeClass(name: string, rawClassDef: any)
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
        let analyzedClass = AnalyzeTopExport(exportedName, exported[exportedName]);
        schemaDef.classes.push(analyzedClass);
    });

    return schemaDef;
}

function AnalyzeTopExport(name: string, exported: any)
{
    let schemaDef = {
        name,
        // inherits: [] as any,
        classes: [] as any
    };

    exported.forEach((export1) => {
        if (Array.isArray(export1))
        {
            // list of inherits
            export1.forEach((export2) => {
                let analyzedClass = AnalyzeExport(export2);
                schemaDef.classes.push(...analyzedClass["classes"][0].classes);
            })
        }
        else
        {
            // direct class def
            let cs = AnalyzeClass(`${name}`, export1);
            cs.hash = HashClass(cs);
            schemaDef.classes.push(cs);
        }
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
    outputSchema.roots = []; 

    rawSchema.forEach((exports) => {
        Object.keys(exports).forEach((key) => {
            let c = AnalyzeTopExport(key, exports[key]);
            outputSchema.roots.push(c);
        })
    })
    

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