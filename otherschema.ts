import { f32, str } from "./primitives";

export const profile = {
    "ifc::profile::0": [{
        contents: str
    }]
}

export const profile2 = {
    "ifc::profile::1": [
        [profile],
        {
            color: f32
        }
    ]
}