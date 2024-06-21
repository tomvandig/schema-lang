import { f32, $, str, i32 } from "./shared/primitives";

export const other = {
    "example::otherobject": [
        {
        }
    ]
}

export const parent = {
    "example::parentobject": [
        {
            stringValue: str,
            floatValue: f32,
            intValue: i32,
            enumValue: ["option1", "option2"],
            composedValue: other,
            relationship: $(other),
            
            arrayOfStrings: [str],
            arrayOfFloats: [f32],
            arrayOfInts: [i32],
            arrayOfEnums: [["option1", "option2"]],
            arrayOfComposed: [other],
            arrayOfRelationShips: [$(other)],
        }
    ]
}

export const child = {
    "example::childobject": [
        [parent], // child receives all parent attributes
        {
            childValue: f32
        }
    ]
}