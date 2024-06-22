// generated code for schema\input\spaceboundary.ts
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
import { ifc_transform } from "./transform.ts"

// generated code for ifc::spaceboundary
export class ifc_spaceboundary  implements ComponentInstance
{
	static hashGroup = [
		"d3914454212f0693140f2a7bb662de1e64617a1c7a8d2d62ae08342fdf8e0d31"
	];
	
	GetSchemaName() {
		return "ifc::spaceboundary"
	}
	
	// ifc::spaceboundary
	relatedSpace: Rel<typeof ifc_space>;
	relatedBuildingElement: Rel<typeof ifc_buildingelement>;
	PhysicalOrVirtualBoundary: ("physical"|"virtual");
	InternalOrExternalBoundary: ("internal"|"external");
	ToJSON(__export: any){
		// ifc::spaceboundary
		// d3914454212f0693140f2a7bb662de1e64617a1c7a8d2d62ae08342fdf8e0d31
		{
			let __hash = "d3914454212f0693140f2a7bb662de1e64617a1c7a8d2d62ae08342fdf8e0d31"
			__export[__hash] = { name: "ifc::spaceboundary"}
			__export[__hash].relatedSpace = { ecsid: this.relatedSpace.ecsid.ToString() };
			__export[__hash].relatedBuildingElement = { ecsid: this.relatedBuildingElement.ecsid.ToString() };
			__export[__hash].PhysicalOrVirtualBoundary = this.PhysicalOrVirtualBoundary;
			__export[__hash].InternalOrExternalBoundary = this.InternalOrExternalBoundary;
		}
	}
	FromJSON(__import: any){
		let instance = this;//new ifc_spaceboundary()
		// ifc::spaceboundary
		// d3914454212f0693140f2a7bb662de1e64617a1c7a8d2d62ae08342fdf8e0d31
		{
			let _hash = "d3914454212f0693140f2a7bb662de1e64617a1c7a8d2d62ae08342fdf8e0d31";
			if (__import[_hash]) {
				instance.relatedSpace = new Rel(ifc_space, ECSID.FromString(__import[_hash].relatedSpace.ecsid));
				instance.relatedBuildingElement = new Rel(ifc_buildingelement, ECSID.FromString(__import[_hash].relatedBuildingElement.ecsid));
				instance.PhysicalOrVirtualBoundary = __import[_hash].PhysicalOrVirtualBoundary;
				instance.InternalOrExternalBoundary = __import[_hash].InternalOrExternalBoundary;
			}
		}
		return instance;
	}
	static ValidateJSON(__import: any){
		ValidateObjectWithSchema(ifc_spaceboundary.schemaJSON as any, __import);
	}
	
	static schemaJSON = {
    "name": "ifc::spaceboundary",
    "classes": [
        {
            "name": "ifc::spaceboundary",
            "hash": "d3914454212f0693140f2a7bb662de1e64617a1c7a8d2d62ae08342fdf8e0d31",
            "values": [
                {
                    "name": "relatedSpace",
                    "type": {
                        "type": "relationship",
                        "withClasses": {
                            "name": "ifc::space",
                            "classes": [
                                {
                                    "name": "ifc::classification",
                                    "hash": "8778ea91bc6bff390d377abe3d25eef7e223e50f2e8af45a8efaacb2aeb16c81",
                                    "values": []
                                },
                                {
                                    "name": "ifc::space",
                                    "hash": "5a97fcb57c99bd2e3a7643a8770b6240d7c84650414bd7965dff02ba76838440",
                                    "values": []
                                }
                            ]
                        }
                    }
                },
                {
                    "name": "relatedBuildingElement",
                    "type": {
                        "type": "relationship",
                        "withClasses": {
                            "name": "ifc::buildingelement",
                            "classes": [
                                {
                                    "name": "ifc::classification",
                                    "hash": "8778ea91bc6bff390d377abe3d25eef7e223e50f2e8af45a8efaacb2aeb16c81",
                                    "values": []
                                },
                                {
                                    "name": "ifc::buildingelement",
                                    "hash": "d86b75ce0ef826fdaf9112cabefa6a1470d2822935afde123c659b5c1bdad12c",
                                    "values": []
                                }
                            ]
                        }
                    }
                },
                {
                    "name": "PhysicalOrVirtualBoundary",
                    "type": {
                        "type": "enum",
                        "options": [
                            "physical",
                            "virtual"
                        ]
                    }
                },
                {
                    "name": "InternalOrExternalBoundary",
                    "type": {
                        "type": "enum",
                        "options": [
                            "internal",
                            "external"
                        ]
                    }
                }
            ]
        }
    ]
}
}
