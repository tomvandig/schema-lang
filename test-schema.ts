import { ECS } from "./ecs";
import { ifc_profile_0 } from "./output/otherschema";
import { ifc_geometry_extrude_0, ifc_geometry_extrude_1 } from "./output/schema";
import { ECSID, Rel } from "./sm_primitives";
import * as fs from "fs";

let geom = new ifc_geometry_extrude_0();

{
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
}

let overridden_geom = new ifc_geometry_extrude_0();

{
    overridden_geom.col = "red";
    overridden_geom.contents = "overridden_contents";
    overridden_geom.indices = new ifc_profile_0();
    overridden_geom.indices.contents = "profile_contents";
    overridden_geom.other = [new Rel<string>(ECSID.FromString("other.entity.id"))];
    overridden_geom.other2 = [new ifc_profile_0()];
    overridden_geom.other2[0].contents = "profile_contents_2";
    overridden_geom.str = "bla";
    overridden_geom.x = 1;
    overridden_geom.y = 2;
    overridden_geom.z = 3;
}

console.log(geom);

let exported = {};
geom.ToJSON(exported);

console.log(exported);

let imported = new ifc_geometry_extrude_0().FromJSON(exported);

console.log(JSON.stringify(imported, null, 4));

let ecs = new ECS();

let sound_barrier = new ECSID(["sound_barrier"]);
let station1 = new ECSID(["station_1"]);
let station2 = new ECSID(["station_2"]);

ecs.AddParent(station1, new ECSID([]));
ecs.AddParent(station2, new ECSID([]));
ecs.AddParent(sound_barrier, station1);
ecs.AddParent(sound_barrier, station2);

ecs.AddComponent(sound_barrier, "geom", geom);
ecs.AddComponent(station1.PushOther(sound_barrier), "geom", overridden_geom);

let exportedECS = ecs.ExportToJSON();

fs.writeFileSync("model.ifc5.json", JSON.stringify(exportedECS, null, 4));

let importedECS = ECS.ImportFromJSON(exportedECS);
let expimportedECS = importedECS.ExportToJSON();

console.log(JSON.stringify(exportedECS) === JSON.stringify(expimportedECS));

let comp = ecs.GetAs(ifc_profile_0, sound_barrier);

console.log(comp);

let comps = ecs.QueryComponentsByType(ifc_geometry_extrude_0);

console.log(comps);

let compIds = ecs.QueryComponentIdsByType(ifc_geometry_extrude_0);

console.log(compIds.map((c) => c.ToString()));
