// generated code for schema\input\example.ts
import { Rel, ECSID, ComponentInstance, ValidateObjectWithHashes, SchemaLibrary } from "../../lib/sm_primitives.ts"

import { ifc_buildingelement } from "./classifications.ts"
import { ifc_classification } from "./classifications.ts"
import { ifc_glazing } from "./classifications.ts"
import { ifc_space } from "./classifications.ts"
import { ifc_wall } from "./classifications.ts"
import { ifc_window } from "./classifications.ts"
import { ifc_windowframe } from "./classifications.ts"
import { ifc_geometry } from "./geometry.ts"
import { ifc_spaceboundary } from "./spaceboundary.ts"
import { ifc_transform } from "./transform.ts"

// generated code for example::childobject
export class example_childobject  implements ComponentInstance
{
	static hashGroup = [
		"4977798611a94ed0eb60c64dbd3b2d82a5941200287af78477512f7f84975722",
		"04cfe7c237883839449fddc1b08b3f017c6d36af26affe9a35c41f5e5172bc73"
	];
	
	GetSchemaName() {
		return "example::childobject"
	}
	
	// example::parentobject
	stringValue: string;
	floatValue: number;
	intValue: number;
	enumValue: ("option1"|"option2");
	composedValue: example_otherobject;
	relationship: Rel<typeof example_otherobject>;
	arrayOfStrings: string[];
	arrayOfFloats: number[];
	arrayOfInts: number[];
	arrayOfEnums: ("option1"|"option2")[];
	arrayOfComposed: example_otherobject[];
	arrayOfRelationShips: Rel<typeof example_otherobject>[];
	// example::childobject
	childValue: number;
	ToJSON(__export: any){
		// example::parentobject
		// 4977798611a94ed0eb60c64dbd3b2d82a5941200287af78477512f7f84975722
		{
			let __hash = "4977798611a94ed0eb60c64dbd3b2d82a5941200287af78477512f7f84975722"
			__export[__hash] = { name: "example::parentobject"}
			__export[__hash].stringValue = this.stringValue;
			__export[__hash].floatValue = this.floatValue;
			__export[__hash].intValue = this.intValue;
			__export[__hash].enumValue = this.enumValue;
			__export[__hash].composedValue = {};
			this.composedValue.ToJSON(__export[__hash].composedValue);
			__export[__hash].relationship = { ecsid: this.relationship.ecsid.ToString() };
			__export[__hash].arrayOfStrings = []
			this.arrayOfStrings.forEach((obj) => {
				let out;
				out = obj;
				__export[__hash].arrayOfStrings.push(out)
			}
			);
			__export[__hash].arrayOfFloats = []
			this.arrayOfFloats.forEach((obj) => {
				let out;
				out = obj;
				__export[__hash].arrayOfFloats.push(out)
			}
			);
			__export[__hash].arrayOfInts = []
			this.arrayOfInts.forEach((obj) => {
				let out;
				out = obj;
				__export[__hash].arrayOfInts.push(out)
			}
			);
			__export[__hash].arrayOfEnums = []
			this.arrayOfEnums.forEach((obj) => {
				let out;
				out = obj;
				__export[__hash].arrayOfEnums.push(out)
			}
			);
			__export[__hash].arrayOfComposed = []
			this.arrayOfComposed.forEach((obj) => {
				let out;
				out = {};
				obj.ToJSON(out);
				__export[__hash].arrayOfComposed.push(out)
			}
			);
			__export[__hash].arrayOfRelationShips = []
			this.arrayOfRelationShips.forEach((obj) => {
				let out;
				out = { ecsid: obj.ecsid.ToString() };
				__export[__hash].arrayOfRelationShips.push(out)
			}
			);
		}
		// example::childobject
		// 04cfe7c237883839449fddc1b08b3f017c6d36af26affe9a35c41f5e5172bc73
		{
			let __hash = "04cfe7c237883839449fddc1b08b3f017c6d36af26affe9a35c41f5e5172bc73"
			__export[__hash] = { name: "example::childobject"}
			__export[__hash].childValue = this.childValue;
		}
	}
	FromJSON(__import: any){
		let instance = this;//new example_childobject()
		// example::parentobject
		// 4977798611a94ed0eb60c64dbd3b2d82a5941200287af78477512f7f84975722
		{
			let _hash = "4977798611a94ed0eb60c64dbd3b2d82a5941200287af78477512f7f84975722";
			if (__import[_hash]) {
				instance.stringValue = __import[_hash].stringValue;
				instance.floatValue = __import[_hash].floatValue;
				instance.intValue = __import[_hash].intValue;
				instance.enumValue = __import[_hash].enumValue;
				instance.composedValue = new example_otherobject().FromJSON(__import[_hash].composedValue);
				instance.relationship = new Rel(example_otherobject, ECSID.FromString(__import[_hash].relationship.ecsid));
				instance.arrayOfStrings = []
				__import[_hash].arrayOfStrings.forEach((obj) => {
					let out;
					out = obj;
					instance.arrayOfStrings.push(out)
				}
				);
				instance.arrayOfFloats = []
				__import[_hash].arrayOfFloats.forEach((obj) => {
					let out;
					out = obj;
					instance.arrayOfFloats.push(out)
				}
				);
				instance.arrayOfInts = []
				__import[_hash].arrayOfInts.forEach((obj) => {
					let out;
					out = obj;
					instance.arrayOfInts.push(out)
				}
				);
				instance.arrayOfEnums = []
				__import[_hash].arrayOfEnums.forEach((obj) => {
					let out;
					out = obj;
					instance.arrayOfEnums.push(out)
				}
				);
				instance.arrayOfComposed = []
				__import[_hash].arrayOfComposed.forEach((obj) => {
					let out;
					out = new example_otherobject().FromJSON(obj);
					instance.arrayOfComposed.push(out)
				}
				);
				instance.arrayOfRelationShips = []
				__import[_hash].arrayOfRelationShips.forEach((obj) => {
					let out;
					out = new Rel(example_otherobject, ECSID.FromString(obj.ecsid));
					instance.arrayOfRelationShips.push(out)
				}
				);
			}
		}
		// example::childobject
		// 04cfe7c237883839449fddc1b08b3f017c6d36af26affe9a35c41f5e5172bc73
		{
			let _hash = "04cfe7c237883839449fddc1b08b3f017c6d36af26affe9a35c41f5e5172bc73";
			if (__import[_hash]) {
				instance.childValue = __import[_hash].childValue;
			}
		}
		return instance;
	}
	static ValidateJSON(library: SchemaLibrary, __import: any){
		ValidateObjectWithHashes(library, __import);
	}
	
	static schemaJSON = {
    "name": "example::childobject",
    "classes": [
        {
            "name": "example::parentobject",
            "hash": "4977798611a94ed0eb60c64dbd3b2d82a5941200287af78477512f7f84975722",
            "values": [
                {
                    "name": "stringValue",
                    "type": "string"
                },
                {
                    "name": "floatValue",
                    "type": "f32"
                },
                {
                    "name": "intValue",
                    "type": "i32"
                },
                {
                    "name": "enumValue",
                    "type": {
                        "type": "enum",
                        "options": [
                            "option1",
                            "option2"
                        ]
                    }
                },
                {
                    "name": "composedValue",
                    "type": {
                        "type": "composition",
                        "ofClasses": {
                            "name": "example::otherobject",
                            "classes": [
                                {
                                    "name": "example::otherobject",
                                    "hash": "c89840dbc86c0762101eb3437011ffe5f816cd9a59e8924365ce62f61fc0f78b",
                                    "values": []
                                }
                            ]
                        }
                    }
                },
                {
                    "name": "relationship",
                    "type": {
                        "type": "relationship",
                        "withClasses": {
                            "name": "example::otherobject",
                            "classes": [
                                {
                                    "name": "example::otherobject",
                                    "hash": "c89840dbc86c0762101eb3437011ffe5f816cd9a59e8924365ce62f61fc0f78b",
                                    "values": []
                                }
                            ]
                        }
                    }
                },
                {
                    "name": "arrayOfStrings",
                    "type": {
                        "type": "array",
                        "arrayType": "string"
                    }
                },
                {
                    "name": "arrayOfFloats",
                    "type": {
                        "type": "array",
                        "arrayType": "f32"
                    }
                },
                {
                    "name": "arrayOfInts",
                    "type": {
                        "type": "array",
                        "arrayType": "i32"
                    }
                },
                {
                    "name": "arrayOfEnums",
                    "type": {
                        "type": "array",
                        "arrayType": {
                            "type": "enum",
                            "options": [
                                "option1",
                                "option2"
                            ]
                        }
                    }
                },
                {
                    "name": "arrayOfComposed",
                    "type": {
                        "type": "array",
                        "arrayType": {
                            "type": "composition",
                            "ofClasses": {
                                "name": "example::otherobject",
                                "classes": [
                                    {
                                        "name": "example::otherobject",
                                        "hash": "c89840dbc86c0762101eb3437011ffe5f816cd9a59e8924365ce62f61fc0f78b",
                                        "values": []
                                    }
                                ]
                            }
                        }
                    }
                },
                {
                    "name": "arrayOfRelationShips",
                    "type": {
                        "type": "array",
                        "arrayType": {
                            "type": "relationship",
                            "withClasses": {
                                "name": "example::otherobject",
                                "classes": [
                                    {
                                        "name": "example::otherobject",
                                        "hash": "c89840dbc86c0762101eb3437011ffe5f816cd9a59e8924365ce62f61fc0f78b",
                                        "values": []
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        },
        {
            "name": "example::childobject",
            "hash": "04cfe7c237883839449fddc1b08b3f017c6d36af26affe9a35c41f5e5172bc73",
            "values": [
                {
                    "name": "childValue",
                    "type": "f32"
                }
            ]
        }
    ]
}
}
// generated code for example::otherobject
export class example_otherobject  implements ComponentInstance
{
	static hashGroup = [
		"c89840dbc86c0762101eb3437011ffe5f816cd9a59e8924365ce62f61fc0f78b"
	];
	
	GetSchemaName() {
		return "example::otherobject"
	}
	
	// example::otherobject
	ToJSON(__export: any){
		// example::otherobject
		// c89840dbc86c0762101eb3437011ffe5f816cd9a59e8924365ce62f61fc0f78b
		{
			let __hash = "c89840dbc86c0762101eb3437011ffe5f816cd9a59e8924365ce62f61fc0f78b"
			__export[__hash] = { name: "example::otherobject"}
		}
	}
	FromJSON(__import: any){
		let instance = this;//new example_otherobject()
		// example::otherobject
		// c89840dbc86c0762101eb3437011ffe5f816cd9a59e8924365ce62f61fc0f78b
		{
			let _hash = "c89840dbc86c0762101eb3437011ffe5f816cd9a59e8924365ce62f61fc0f78b";
			if (__import[_hash]) {
			}
		}
		return instance;
	}
	static ValidateJSON(library: SchemaLibrary, __import: any){
		ValidateObjectWithHashes(library, __import);
	}
	
	static schemaJSON = {
    "name": "example::otherobject",
    "classes": [
        {
            "name": "example::otherobject",
            "hash": "c89840dbc86c0762101eb3437011ffe5f816cd9a59e8924365ce62f61fc0f78b",
            "values": []
        }
    ]
}
}
// generated code for example::parentobject
export class example_parentobject  implements ComponentInstance
{
	static hashGroup = [
		"4977798611a94ed0eb60c64dbd3b2d82a5941200287af78477512f7f84975722"
	];
	
	GetSchemaName() {
		return "example::parentobject"
	}
	
	// example::parentobject
	stringValue: string;
	floatValue: number;
	intValue: number;
	enumValue: ("option1"|"option2");
	composedValue: example_otherobject;
	relationship: Rel<typeof example_otherobject>;
	arrayOfStrings: string[];
	arrayOfFloats: number[];
	arrayOfInts: number[];
	arrayOfEnums: ("option1"|"option2")[];
	arrayOfComposed: example_otherobject[];
	arrayOfRelationShips: Rel<typeof example_otherobject>[];
	ToJSON(__export: any){
		// example::parentobject
		// 4977798611a94ed0eb60c64dbd3b2d82a5941200287af78477512f7f84975722
		{
			let __hash = "4977798611a94ed0eb60c64dbd3b2d82a5941200287af78477512f7f84975722"
			__export[__hash] = { name: "example::parentobject"}
			__export[__hash].stringValue = this.stringValue;
			__export[__hash].floatValue = this.floatValue;
			__export[__hash].intValue = this.intValue;
			__export[__hash].enumValue = this.enumValue;
			__export[__hash].composedValue = {};
			this.composedValue.ToJSON(__export[__hash].composedValue);
			__export[__hash].relationship = { ecsid: this.relationship.ecsid.ToString() };
			__export[__hash].arrayOfStrings = []
			this.arrayOfStrings.forEach((obj) => {
				let out;
				out = obj;
				__export[__hash].arrayOfStrings.push(out)
			}
			);
			__export[__hash].arrayOfFloats = []
			this.arrayOfFloats.forEach((obj) => {
				let out;
				out = obj;
				__export[__hash].arrayOfFloats.push(out)
			}
			);
			__export[__hash].arrayOfInts = []
			this.arrayOfInts.forEach((obj) => {
				let out;
				out = obj;
				__export[__hash].arrayOfInts.push(out)
			}
			);
			__export[__hash].arrayOfEnums = []
			this.arrayOfEnums.forEach((obj) => {
				let out;
				out = obj;
				__export[__hash].arrayOfEnums.push(out)
			}
			);
			__export[__hash].arrayOfComposed = []
			this.arrayOfComposed.forEach((obj) => {
				let out;
				out = {};
				obj.ToJSON(out);
				__export[__hash].arrayOfComposed.push(out)
			}
			);
			__export[__hash].arrayOfRelationShips = []
			this.arrayOfRelationShips.forEach((obj) => {
				let out;
				out = { ecsid: obj.ecsid.ToString() };
				__export[__hash].arrayOfRelationShips.push(out)
			}
			);
		}
	}
	FromJSON(__import: any){
		let instance = this;//new example_parentobject()
		// example::parentobject
		// 4977798611a94ed0eb60c64dbd3b2d82a5941200287af78477512f7f84975722
		{
			let _hash = "4977798611a94ed0eb60c64dbd3b2d82a5941200287af78477512f7f84975722";
			if (__import[_hash]) {
				instance.stringValue = __import[_hash].stringValue;
				instance.floatValue = __import[_hash].floatValue;
				instance.intValue = __import[_hash].intValue;
				instance.enumValue = __import[_hash].enumValue;
				instance.composedValue = new example_otherobject().FromJSON(__import[_hash].composedValue);
				instance.relationship = new Rel(example_otherobject, ECSID.FromString(__import[_hash].relationship.ecsid));
				instance.arrayOfStrings = []
				__import[_hash].arrayOfStrings.forEach((obj) => {
					let out;
					out = obj;
					instance.arrayOfStrings.push(out)
				}
				);
				instance.arrayOfFloats = []
				__import[_hash].arrayOfFloats.forEach((obj) => {
					let out;
					out = obj;
					instance.arrayOfFloats.push(out)
				}
				);
				instance.arrayOfInts = []
				__import[_hash].arrayOfInts.forEach((obj) => {
					let out;
					out = obj;
					instance.arrayOfInts.push(out)
				}
				);
				instance.arrayOfEnums = []
				__import[_hash].arrayOfEnums.forEach((obj) => {
					let out;
					out = obj;
					instance.arrayOfEnums.push(out)
				}
				);
				instance.arrayOfComposed = []
				__import[_hash].arrayOfComposed.forEach((obj) => {
					let out;
					out = new example_otherobject().FromJSON(obj);
					instance.arrayOfComposed.push(out)
				}
				);
				instance.arrayOfRelationShips = []
				__import[_hash].arrayOfRelationShips.forEach((obj) => {
					let out;
					out = new Rel(example_otherobject, ECSID.FromString(obj.ecsid));
					instance.arrayOfRelationShips.push(out)
				}
				);
			}
		}
		return instance;
	}
	static ValidateJSON(library: SchemaLibrary, __import: any){
		ValidateObjectWithHashes(library, __import);
	}
	
	static schemaJSON = {
    "name": "example::parentobject",
    "classes": [
        {
            "name": "example::parentobject",
            "hash": "4977798611a94ed0eb60c64dbd3b2d82a5941200287af78477512f7f84975722",
            "values": [
                {
                    "name": "stringValue",
                    "type": "string"
                },
                {
                    "name": "floatValue",
                    "type": "f32"
                },
                {
                    "name": "intValue",
                    "type": "i32"
                },
                {
                    "name": "enumValue",
                    "type": {
                        "type": "enum",
                        "options": [
                            "option1",
                            "option2"
                        ]
                    }
                },
                {
                    "name": "composedValue",
                    "type": {
                        "type": "composition",
                        "ofClasses": {
                            "name": "example::otherobject",
                            "classes": [
                                {
                                    "name": "example::otherobject",
                                    "hash": "c89840dbc86c0762101eb3437011ffe5f816cd9a59e8924365ce62f61fc0f78b",
                                    "values": []
                                }
                            ]
                        }
                    }
                },
                {
                    "name": "relationship",
                    "type": {
                        "type": "relationship",
                        "withClasses": {
                            "name": "example::otherobject",
                            "classes": [
                                {
                                    "name": "example::otherobject",
                                    "hash": "c89840dbc86c0762101eb3437011ffe5f816cd9a59e8924365ce62f61fc0f78b",
                                    "values": []
                                }
                            ]
                        }
                    }
                },
                {
                    "name": "arrayOfStrings",
                    "type": {
                        "type": "array",
                        "arrayType": "string"
                    }
                },
                {
                    "name": "arrayOfFloats",
                    "type": {
                        "type": "array",
                        "arrayType": "f32"
                    }
                },
                {
                    "name": "arrayOfInts",
                    "type": {
                        "type": "array",
                        "arrayType": "i32"
                    }
                },
                {
                    "name": "arrayOfEnums",
                    "type": {
                        "type": "array",
                        "arrayType": {
                            "type": "enum",
                            "options": [
                                "option1",
                                "option2"
                            ]
                        }
                    }
                },
                {
                    "name": "arrayOfComposed",
                    "type": {
                        "type": "array",
                        "arrayType": {
                            "type": "composition",
                            "ofClasses": {
                                "name": "example::otherobject",
                                "classes": [
                                    {
                                        "name": "example::otherobject",
                                        "hash": "c89840dbc86c0762101eb3437011ffe5f816cd9a59e8924365ce62f61fc0f78b",
                                        "values": []
                                    }
                                ]
                            }
                        }
                    }
                },
                {
                    "name": "arrayOfRelationShips",
                    "type": {
                        "type": "array",
                        "arrayType": {
                            "type": "relationship",
                            "withClasses": {
                                "name": "example::otherobject",
                                "classes": [
                                    {
                                        "name": "example::otherobject",
                                        "hash": "c89840dbc86c0762101eb3437011ffe5f816cd9a59e8924365ce62f61fc0f78b",
                                        "values": []
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        }
    ]
}
}
