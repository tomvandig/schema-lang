import { ECS } from "./ecs";
import { ifc_profile_0 } from "./output/otherschema";
import { ifc_geometry_extrude_0, ifc_geometry_extrude_1 } from "./output/schema";
import { ECSID, Rel } from "./sm_primitives";
import * as fs from "fs";

let geom = new ifc_geometry_extrude_0();

geom.col = "blue";
geom.contents = "contents";
geom.indices = new ifc_profile_0();
geom.indices.contents = "profile_contents";
geom.other = [new Rel<string>(ECSID.FromString("other.entity.id"))];
geom.other2 = [new ifc_profile_0()];
geom.other2[0].contents = "profile_contents_2";
geom.str = "bla";
geom.x = 1;
geom.y = 2;
geom.z = 3;

console.log(geom);

let exported = {};
geom.ToJSON(exported);

console.log(exported);

let imported = new ifc_geometry_extrude_0().FromJSON(exported);

console.log(JSON.stringify(imported, null, 4));


let entity1 = new ECSID(["entity1"]);
let ecs = new ECS();
ecs.AddComponent(entity1, geom);
ecs.AddParent(entity1, new ECSID([]))

let exportedECS = ecs.ExportToJSON();

fs.writeFileSync("ecs.json", JSON.stringify(exportedECS, null, 4));

let importedECS = ECS.ImportFromJSON(exportedECS);
let expimportedECS = importedECS.ExportToJSON();

console.log(JSON.stringify(exportedECS) === JSON.stringify(expimportedECS));

let comp = ecs.GetAs(ifc_profile_0, entity1);

console.log(comp);

let comps = ecs.QueryComponentsByType(ifc_geometry_extrude_0);

console.log(comps);

let compIds = ecs.QueryComponentIdsByType(ifc_geometry_extrude_0);

console.log(compIds.map((c) => c.ToString()));
