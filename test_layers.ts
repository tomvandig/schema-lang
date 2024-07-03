import { ECS } from "./lib/ecs";
import { LayeredECS } from "./lib/layered_ecs";
import { ECSID } from "./lib/sm_primitives";

let lower = new ECS();
let upper = new ECS();

lower.Link(ECSID.FromString(""), "object1", ECSID.FromString("ref1"))
lower.Link(ECSID.FromString(""), "shared", ECSID.FromString("ref1"))
lower.Link(ECSID.FromString(""), "conflict", ECSID.FromString("ref1"))
upper.Link(ECSID.FromString(""), "object3", ECSID.FromString("ref2"))
upper.Link(ECSID.FromString(""), "shared", ECSID.FromString("ref1"))
upper.Link(ECSID.FromString(""), "conflict", ECSID.FromString("ref2"))

let layered = new LayeredECS([
    {
        ecs: lower,
        name: "lower_layer"
    },
    {
        ecs: upper,
        name: "upper_layer"
    }
]);

console.log(JSON.stringify(layered.GetLayeredChildren(""), null, 4));
console.log(JSON.stringify(layered.GetChildren(""), null, 4));
