import colors from "./colors";
import { profile, profile2 } from "./otherschema";
import { f32, $, str } from "./primitives";

export const extrude = {
    "ifc::geometry::extrude::0": [
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
        }
    ]
}

export const extrude_v2 = {
    "ifc::geometry::extrude::1": [
        [extrude],
        {
            extended: profile2
        }
    ]
}