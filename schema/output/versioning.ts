// generated code for schema\input\versioning.ts
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
import { ifc_geometry } from "./geometry.ts"
import { ifc_spaceboundary } from "./spaceboundary.ts"
import { ifc_transform } from "./transform.ts"

// generated code for ifc::versionedobject
export class ifc_versionedobject  implements ComponentInstance
{
	static hashGroup = [
		"6be3ac2278e714144157872d57d967a8a69abf0606d095725eafac506d585c6a"
	];
	
	GetSchemaName() {
		return "ifc::versionedobject"
	}
	
	// ifc::versionedobject
	original_property: string;
	ToJSON(__export: any){
		// ifc::versionedobject
		// 6be3ac2278e714144157872d57d967a8a69abf0606d095725eafac506d585c6a
		{
			let __hash = "6be3ac2278e714144157872d57d967a8a69abf0606d095725eafac506d585c6a"
			__export[__hash] = { name: "ifc::versionedobject"}
			__export[__hash].original_property = this.original_property;
		}
	}
	FromJSON(__import: any){
		let instance = this;//new ifc_versionedobject()
		// ifc::versionedobject
		// 6be3ac2278e714144157872d57d967a8a69abf0606d095725eafac506d585c6a
		{
			let _hash = "6be3ac2278e714144157872d57d967a8a69abf0606d095725eafac506d585c6a";
			if (__import[_hash]) {
				instance.original_property = __import[_hash].original_property;
			}
		}
		return instance;
	}
	static ValidateJSON(library: SchemaLibrary, __import: any){
		ValidateObjectWithHashes(library, __import);
	}
	
	static schemaJSON = {
    "name": "ifc::versionedobject",
    "classes": [
        {
            "name": "ifc::versionedobject",
            "hash": "6be3ac2278e714144157872d57d967a8a69abf0606d095725eafac506d585c6a",
            "values": [
                {
                    "name": "original_property",
                    "type": "string"
                }
            ]
        }
    ]
}
}
// generated code for ifc::versionedobject::2
export class ifc_versionedobject_2  implements ComponentInstance
{
	static hashGroup = [
		"6be3ac2278e714144157872d57d967a8a69abf0606d095725eafac506d585c6a",
		"30bcad138e512a08dcface361fe53e474a19f4af6ca46306d3da97be3c05f0f1"
	];
	
	GetSchemaName() {
		return "ifc::versionedobject::2"
	}
	
	// ifc::versionedobject
	original_property: string;
	// ifc::versionedobject::2
	added_property: string;
	ToJSON(__export: any){
		// ifc::versionedobject
		// 6be3ac2278e714144157872d57d967a8a69abf0606d095725eafac506d585c6a
		{
			let __hash = "6be3ac2278e714144157872d57d967a8a69abf0606d095725eafac506d585c6a"
			__export[__hash] = { name: "ifc::versionedobject"}
			__export[__hash].original_property = this.original_property;
		}
		// ifc::versionedobject::2
		// 30bcad138e512a08dcface361fe53e474a19f4af6ca46306d3da97be3c05f0f1
		{
			let __hash = "30bcad138e512a08dcface361fe53e474a19f4af6ca46306d3da97be3c05f0f1"
			__export[__hash] = { name: "ifc::versionedobject::2"}
			__export[__hash].added_property = this.added_property;
		}
	}
	FromJSON(__import: any){
		let instance = this;//new ifc_versionedobject_2()
		// ifc::versionedobject
		// 6be3ac2278e714144157872d57d967a8a69abf0606d095725eafac506d585c6a
		{
			let _hash = "6be3ac2278e714144157872d57d967a8a69abf0606d095725eafac506d585c6a";
			if (__import[_hash]) {
				instance.original_property = __import[_hash].original_property;
			}
		}
		// ifc::versionedobject::2
		// 30bcad138e512a08dcface361fe53e474a19f4af6ca46306d3da97be3c05f0f1
		{
			let _hash = "30bcad138e512a08dcface361fe53e474a19f4af6ca46306d3da97be3c05f0f1";
			if (__import[_hash]) {
				instance.added_property = __import[_hash].added_property;
			}
		}
		return instance;
	}
	static ValidateJSON(library: SchemaLibrary, __import: any){
		ValidateObjectWithHashes(library, __import);
	}
	
	static schemaJSON = {
    "name": "ifc::versionedobject::2",
    "classes": [
        {
            "name": "ifc::versionedobject",
            "hash": "6be3ac2278e714144157872d57d967a8a69abf0606d095725eafac506d585c6a",
            "values": [
                {
                    "name": "original_property",
                    "type": "string"
                }
            ]
        },
        {
            "name": "ifc::versionedobject::2",
            "hash": "30bcad138e512a08dcface361fe53e474a19f4af6ca46306d3da97be3c05f0f1",
            "values": [
                {
                    "name": "added_property",
                    "type": "string"
                }
            ]
        }
    ]
}
}
