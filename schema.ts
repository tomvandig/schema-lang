import colors from "./colors";
import list from "./otherschema";
import { f32, $, str } from "./primitives";

export default {
    ...list,
    cartesianpoint: {
        x: f32,
        y: f32,
        z: f32,
        col: colors,
        str: str,
        indices: list,
        other: [$(list)],
        other2: [list],
    }
}