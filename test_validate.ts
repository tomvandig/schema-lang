import { ECS } from "./lib/ecs";

ECS.ImportFromJSON(JSON.parse(require("fs").readFileSync("hello_wall.ifc5.json")));
