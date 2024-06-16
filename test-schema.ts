import { ECS } from "./ecs";
import { ifc_profile_0 } from "./output/otherschema";
import { ifc_geometry_extrude_0 } from "./output/schema";
import { ECSID, Rel } from "./sm_primitives";

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

let imported = ifc_geometry_extrude_0.FromJSON(exported);

console.log(JSON.stringify(imported, null, 4));


let ecs = new ECS();
ecs.AddComponent(new ECSID(["object1"]), geom);
