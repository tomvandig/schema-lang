# TS schemas

WIP schema language, TS code generation, and JSON serialization of composable ECS.

A schema looks like this:
```ts
import { buildingelement, space } from "./classifications";
import { $ } from "./shared/primitives";

export const spaceboundary = {
    "ifc::spaceboundary": [
        {
            relatedSpace: $(space),
            relatedBuildingElement: $(buildingelement),
            PhysicalOrVirtualBoundary: ["physical", "virtual"],
            InternalOrExternalBoundary: ["internal", "external"]
        }
    ]
}
```

See the `/schema/input` folder for example schema files.

These schema files can be converted into a JSON representation, and also in `typescript` code. The JSON representation is used when the ECS is exported to JSON the `typescript` code can be found in `/schema/output` and is used to interface with the ECS.

Using this typescript code, a component can be constructed like this:

```ts
let boundaryComponent = new ifc_spaceboundary();
    {
        boundaryComponent.relatedSpace = new Rel(ifc_space, space);
        boundaryComponent.relatedBuildingElement = new Rel(ifc_wall, wall));
        boundaryComponent.PhysicalOrVirtualBoundary = "physical";
        boundaryComponent.InternalOrExternalBoundary = "external";
    }
```

On top of this, a composable ECS implementation is available in the `/lib` folder, and an example ECS can be built as shown in `hello_wall.ts`.

```ts
let ecs = new ECS();
let space = new ECSID(["space"]);
ecs.AddComponent(spaceboundary, "boundary", boundaryComponent);

```

In `hello_wall.ts` we construct a typical wall and instantiate it twice, once overriding the color of a subcomponent using:

```ts
// override northwall, left window, frame from green to red
AddGeom(north_wall.PushOther(typical_wall).Push("left_window").Push("window_frame"), "red");

```

The ECS built in `hello_wall.ts` is serialized to `hello_wall.ifc5.json`, to illustrate the working of the override, the file `hello_wall.geometrycolor.ifc5.json` is included which shows more clearly the ID prefixing and composition result for the geometry colors.