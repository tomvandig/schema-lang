import colors from "./shared/colors";
import { f32, $, str } from "./shared/primitives";
import { profile, profile2 } from "./otherschema";

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