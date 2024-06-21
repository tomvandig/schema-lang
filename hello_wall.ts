import { ECS } from "./ecs";
import { ifc_space, ifc_wall, ifc_window, ifc_windowframe } from "./output/classifications";
import { ifc_spaceboundary } from "./output/spaceboundary";
import { ECSID, Rel } from "./sm_primitives";

let ecs = new ECS();


let south_wall = new ECSID(["south_wall"]);
ecs.AddComponent(south_wall, "classification", new ifc_wall());

let typical_wall = new ECSID(["typical_wall"]);
let left_window = new ECSID(["left_window"]);
ecs.AddComponent(left_window, "classification", new ifc_window());
let right_window = new ECSID(["right_window"]);
ecs.AddComponent(right_window, "classification", new ifc_window());
let window_frame = new ECSID(["window_frame"]);
ecs.AddComponent(window_frame, "classification", new ifc_windowframe());
let space = new ECSID(["space"]);
ecs.AddComponent(space, "classification", new ifc_space());

{
    let spaceboundary = new ECSID(["spaceboundary"]);
    let boundaryComponent = new ifc_spaceboundary();
    {
        boundaryComponent.relatedSpace = new Rel(ifc_space, space.Push("classification"));
        boundaryComponent.relatedBuildingElement = new Rel(ifc_wall, south_wall.Push("classification"));
        boundaryComponent.InternalOrExternalBoundary = "external";
        boundaryComponent.PhysicalOrVirtualBoundary = "physical";
    }
    ecs.AddComponent(spaceboundary, "boundary", boundaryComponent);
}


require("fs").writeFileSync("hello_wall.ifc5.json", JSON.stringify(ecs.ExportToJSON(), null, 4));