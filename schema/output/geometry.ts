// generated code for schema\input\geometry.ts
import { Rel, ECSID, ComponentInstance, ValidateObjectWithHashes, SchemaLibrary } from "../../lib/sm_primitives.ts"

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
import { ifc_spaceboundary } from "./spaceboundary.ts"
import { ifc_transform } from "./transform.ts"

// generated code for ifc::geometry
export class ifc_geometry  implements ComponentInstance
{
	static hashGroup = [
		"d89484cf28772e03ab074e698121ee782c79096feba53171232fe248150da4b5"
	];
	
	GetSchemaName() {
		return "ifc::geometry"
	}
	
	// ifc::geometry
	vertices: number[];
	indices: number[];
	color: ("red"|"green"|"blue");
	ToJSON(__export: any){
		// ifc::geometry
		// d89484cf28772e03ab074e698121ee782c79096feba53171232fe248150da4b5
		{
			let __hash = "d89484cf28772e03ab074e698121ee782c79096feba53171232fe248150da4b5"
			__export[__hash] = { name: "ifc::geometry"}
			__export[__hash].vertices = []
			this.vertices.forEach((obj) => {
				let out;
				out = obj;
				__export[__hash].vertices.push(out)
			}
			);
			__export[__hash].indices = []
			this.indices.forEach((obj) => {
				let out;
				out = obj;
				__export[__hash].indices.push(out)
			}
			);
			__export[__hash].color = this.color;
		}
	}
	FromJSON(__import: any){
		let instance = this;//new ifc_geometry()
		// ifc::geometry
		// d89484cf28772e03ab074e698121ee782c79096feba53171232fe248150da4b5
		{
			let _hash = "d89484cf28772e03ab074e698121ee782c79096feba53171232fe248150da4b5";
			if (__import[_hash]) {
				instance.vertices = []
				__import[_hash].vertices.forEach((obj) => {
					let out;
					out = obj;
					instance.vertices.push(out)
				}
				);
				instance.indices = []
				__import[_hash].indices.forEach((obj) => {
					let out;
					out = obj;
					instance.indices.push(out)
				}
				);
				instance.color = __import[_hash].color;
			}
		}
		return instance;
	}
	static ValidateJSON(library: SchemaLibrary, __import: any){
		ValidateObjectWithHashes(library, __import);
	}
	
	static schemaJSON = {
    "name": "ifc::geometry",
    "classes": [
        {
            "name": "ifc::geometry",
            "hash": "d89484cf28772e03ab074e698121ee782c79096feba53171232fe248150da4b5",
            "values": [
                {
                    "name": "vertices",
                    "type": {
                        "type": "array",
                        "arrayType": "f32"
                    }
                },
                {
                    "name": "indices",
                    "type": {
                        "type": "array",
                        "arrayType": "i32"
                    }
                },
                {
                    "name": "color",
                    "type": {
                        "type": "enum",
                        "options": [
                            "red",
                            "green",
                            "blue"
                        ]
                    }
                }
            ]
        }
    ]
}
}
