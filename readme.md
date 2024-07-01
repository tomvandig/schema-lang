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

These schema files can be converted into a JSON representation, and also into `typescript` code. The JSON representation is used when the ECS is exported to JSON, the `typescript` code can be found in `/schema/output` and is used to interface with the ECS.

Using this typescript code, a component can be constructed like this using the generated code, including auto-complete support:

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
ecs.AddComponent("spaceEntity", "boundary", boundaryComponent);

```

In `hello_wall.ts` we construct a typical wall and instantiate it twice, once overriding the color of a subcomponent using:

```ts
// override northwall, left window, frame from green to red
ecs.AddComponent(["north_wall", "left_window", "window_frame"], redGeometryComponent);

```

This operation adds a component to an id prefix `north_wall.left_window.window_frame.geometry` which overrides the existing component present on `window_frame.geometry`.

The ECS built in `hello_wall.ts` is serialized to `hello_wall.ifc5.json` but is quite complex to read as a human. To illustrate the working of the override (and a possible user interface to the ecs data), the file `hello_wall.geometrycolor.ifc5.json` shows a partial view of the ECS applying the ID prefixing and geometry colors and serializing the result to json.

`hello_wall.geometrycolor.ifc5.json`:
```json
{
    "south_wall": { <-- id prefixing hierarchy
        "color": "green", <-- color info coming from geometry component
        "left_window": { <-- this prefix would be south_wall.left_window
            "color": "red",
            "frame": {
                "color": "green"
            }
        },
        "right_window": {
            "color": "blue",
            "frame": {
                "color": "green"
            }
        }
    },
    "north_wall": {
        "color": "green",
        "left_window": {
            "color": "red",
            "frame": {
                "color": "red" <-- overridden value
            }
        },
        "right_window": {
            "color": "blue",
            "frame": {
                "color": "green"
            }
        }
    },
    "space": {}
}
```

# Validation

A schema is transformed from `typescript` into JSON, the json representation is included in the generated code as `static schemaJSON` and registered with the ECS upon loading. The ECS can use the schema to validate any incoming components. The file `test_validate.ts` shows an example where all components inside `hello_wall.ifc5.json` are validated using the schemas defined in the file itself, this can be tested by running the script after tampering with the file.