import { ECS } from "./lib/ecs";
import { LayeredECS } from "./lib/layered_ecs";
import { ECSID } from "./lib/sm_primitives";
import { ifc_space, ifc_transform, ifc_wall, ifc_window } from "./schema/output";

let lower = new ECS();
let upper = new ECS();

lower.Link(ECSID.FromString(""), "object1", ECSID.FromString("ref1"))
lower.Link(ECSID.FromString(""), "shared", ECSID.FromString("ref1"))
lower.Link(ECSID.FromString(""), "conflict", ECSID.FromString("ref1"))
upper.Link(ECSID.FromString(""), "object4", ECSID.FromString("ref2"))
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

lower.AddComponent(ECSID.FromString("conflict"), "cf", new ifc_window());
upper.AddComponent(ECSID.FromString("conflict"), "cf", new ifc_wall());

console.log(JSON.stringify(layered.ComponentIsOfType(ECSID.FromString("conflict.cf"), ifc_wall), null, 4));
console.log(JSON.stringify(layered.ComponentIsOfType(ECSID.FromString("conflict.cf"), ifc_window), null, 4));
