import { ECS } from "./ecs";
import { ifc_space, ifc_wall, ifc_window, ifc_windowframe } from "./output/classifications";
import { ifc_geometry } from "./output/geometry";
import { ifc_spaceboundary } from "./output/spaceboundary";
import { ifc_transform } from "./output/transform";
import { ECSID, Rel } from "./sm_primitives";

let ecs = new ECS();

function AddTransform(id: ECSID, x: number, y: number, z: number)
{
    let t = new ifc_transform();
    t.x = x;
    t.y = y;
    t.z = z;

    ecs.AddComponent(id, "transformation", t);
}

function AddGeom(id: ECSID, color: "red"|"green"|"blue")
{
   let geom = new ifc_geometry();
   geom.color = color;
   geom.vertices = [];
   geom.indices = [];
   ecs.AddComponent(id, "geometry", geom);
}

// define a typical
let typical_wall = new ECSID(["typical_wall"]);
{
    let left_window = new ECSID(["left_window"]);
    ecs.AddComponent(left_window, "classification", new ifc_window());
    AddTransform(left_window, 5, 0, 0);
    AddGeom(left_window, "red");
    let right_window = new ECSID(["right_window"]);
    ecs.AddComponent(right_window, "classification", new ifc_window());
    AddTransform(right_window, 10, 0, 0);
    AddGeom(right_window, "blue");
    let window_frame = new ECSID(["window_frame"]);
    ecs.AddComponent(window_frame, "classification", new ifc_windowframe());
    AddTransform(window_frame, 1, 1, 1);
    AddGeom(window_frame, "green");

    ecs.AddParent(left_window, typical_wall);
    ecs.AddParent(right_window, typical_wall);

    ecs.AddParent(window_frame, right_window);
    ecs.AddParent(window_frame, left_window);

    AddGeom(typical_wall, "green");
}

// define all elements
let south_wall = new ECSID(["south_wall"]);
ecs.AddComponent(south_wall, "classification", new ifc_wall());
let north_wall = new ECSID(["north_wall"]);
ecs.AddComponent(north_wall, "classification", new ifc_wall());
let space = new ECSID(["space"]);
ecs.AddComponent(space, "classification", new ifc_space());
{
    AddTransform(south_wall, 0, 0, 0);
    AddTransform(north_wall, 10, 0, 0);
    AddTransform(space, 5, 0, 0);


    ecs.AddParent(typical_wall, south_wall);
    ecs.AddParent(typical_wall, north_wall);

    // roots
    ecs.AddParent(south_wall, new ECSID([]));
    ecs.AddParent(north_wall, new ECSID([]));
    ecs.AddParent(space, new ECSID([]));
}

// override northwall, left window, frame from green to red
AddGeom(north_wall.PushOther(typical_wall).Push("left_window").Push("window_frame"), "red");

// construct relationships
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

require("fs").writeFileSync("hello_wall.geometrycolor.ifc5.json", JSON.stringify(ecs.FlattenToJSON(ifc_geometry), null, 4));
