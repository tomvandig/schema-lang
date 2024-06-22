// generated code for schema\input\transform.ts
import { Rel, ECSID, ComponentInstance, ValidateObjectWithSchema } from "../../lib/sm_primitives.ts"

import { ifc_buildingelement } from "./classifications.ts"
import { ifc_classification } from "./classifications.ts"
import { ifc_glazing } from "./classifications.ts"
import { ifc_space } from "./classifications.ts"
import { ifc_wall } from "./classifications.ts"
import { ifc_window } from "./classifications.ts"
import { ifc_windowframe } from "./classifications.ts"
import { example_childobject } from "./example.ts"
import { example_otherobject } from "./example.ts"
import { example_parentobject } from "./example.ts"
import { ifc_geometry } from "./geometry.ts"
import { ifc_spaceboundary } from "./spaceboundary.ts"

// generated code for ifc::transform
export class ifc_transform  implements ComponentInstance
{
	static hashGroup = [
		"7bfc250753ed2c8c626a7972c37cb11c0f6c3b5ee0a16be19aff76a7fde3b83f"
	];
	
	GetSchemaName() {
		return "ifc::transform"
	}
	
	// ifc::transform
	x: number;
	y: number;
	z: number;
	ToJSON(__export: any){
		// ifc::transform
		// 7bfc250753ed2c8c626a7972c37cb11c0f6c3b5ee0a16be19aff76a7fde3b83f
		{
			let __hash = "7bfc250753ed2c8c626a7972c37cb11c0f6c3b5ee0a16be19aff76a7fde3b83f"
			__export[__hash] = { name: "ifc::transform"}
			__export[__hash].x = this.x;
			__export[__hash].y = this.y;
			__export[__hash].z = this.z;
		}
	}
	FromJSON(__import: any){
		let instance = this;//new ifc_transform()
		// ifc::transform
		// 7bfc250753ed2c8c626a7972c37cb11c0f6c3b5ee0a16be19aff76a7fde3b83f
		{
			let _hash = "7bfc250753ed2c8c626a7972c37cb11c0f6c3b5ee0a16be19aff76a7fde3b83f";
			if (__import[_hash]) {
				instance.x = __import[_hash].x;
				instance.y = __import[_hash].y;
				instance.z = __import[_hash].z;
			}
		}
		return instance;
	}
	static ValidateJSON(__import: any){
		ValidateObjectWithSchema(ifc_transform.schemaJSON as any, __import);
	}
	
	static schemaJSON = {
    "name": "ifc::transform",
    "classes": [
        {
            "name": "ifc::transform",
            "hash": "7bfc250753ed2c8c626a7972c37cb11c0f6c3b5ee0a16be19aff76a7fde3b83f",
            "values": [
                {
                    "name": "x",
                    "type": "f32"
                },
                {
                    "name": "y",
                    "type": "f32"
                },
                {
                    "name": "z",
                    "type": "f32"
                }
            ]
        }
    ]
}
}
