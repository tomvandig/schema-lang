// generated code for input\spaceboundary.ts
import { Rel, ECSID, ComponentInstance } from "../lib/sm_primitives.ts"

import { ifc_buildingelement } from "./classifications.ts"
import { ifc_classification } from "./classifications.ts"
import { ifc_glazing } from "./classifications.ts"
import { ifc_space } from "./classifications.ts"
import { ifc_wall } from "./classifications.ts"
import { ifc_window } from "./classifications.ts"
import { ifc_windowframe } from "./classifications.ts"
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
	PhysicalOrVirtualBoundary: "physical"|"virtual";
	InternalOrExternalBoundary: "internal"|"external";
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
	FromJSON(__import){
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
}
