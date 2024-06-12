import colors from "./colors";
import profile from "./otherschema";
import { f32, $, str } from "./primitives";

export default {
    "ifc::geometry::extrude": [
        [profile],
        {
            x: f32,
            y: f32,
            z: f32,
            col: colors,
            str: str,
            indices: profile,
            other: [$(profile)],
            other2: [profile],
        },
        {
            newVersion: str
        }
    ]
}