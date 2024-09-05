import { f32, $, str, i32 } from "./shared/primitives";

// changing an existing schema will create a backwards-incompatible new version
export const versioned_object = {
    "ifc::versionedobject": [
        {
            original_property: str
        }
    ]
}

// instead we create a new version by inherting the previous version
export const versioned_object_v2 = {
    "ifc::versionedobject::2": [
        [versioned_object], // inherit the previous version
        {
            // express your new property
            added_property: str
        }
    ]
}