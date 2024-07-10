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

# Layers

The concept of "layers" is borrowed from USD, and provides a form of conflict-free multi-author data composition. Layers work by combining multiple ECS objects into a single layered ECS, which can be queried much like a normal ECS.

In terms of code, this is how a layered ECS is built:

```ts
let lower = new ECS();
let upper = new ECS();

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
```

The resulting `LayeredECS` has two layers, with `upper` taking precedence in the composition over all data present in `lower`. By flipping the order of the layers in the constructor of `LayeredECS`, the reverse can be achieved. In general, layers with higher priority, or precedence, should have a higher index in the provided array.

As an example for how the composition works we can create four entities spread over the upper and lower layer, and see what the composition returns. The entities are:

* `object1` only in the `lower` layer
* `shared` in both the `lower` and `upper` layer
* `conflict` in both the `lower` and `upper` layer
* `object4` only in the `upper` layer

We can then ask the layered ECS for the composition tree using `layered.GetLayeredChildren("")` which will return:

```json
[
    [ <-- object1 only in the lower layer
        {
            "layers": [
                "lower_layer"
            ],
            "link": {
                "name": "object1",
                "reference": "ref1"
            }
        }
    ],
    [ <-- object shared is equal in both layers
        {
            "layers": [
                "lower_layer",
                "upper_layer"
            ],
            "link": {
                "name": "shared",
                "reference": "ref1"
            }
        }
    ],
    [ <-- conflicting object is different in the layers
        { <-- this is the version for the lower layer
            "layers": [
                "lower_layer"
            ],
            "link": {
                "name": "conflict",
                "reference": "ref1" <-- this is ref1
            }
        },
        { <-- this is the version for the upper layer
            "layers": [
                "upper_layer"
            ],
            "link": {
                "name": "conflict",
                "reference": "ref2" <-- this is ref2
            }
        }
    ],
    [ <-- object4 only in the upper layer
        {
            "layers": [
                "upper_layer"
            ],
            "link": {
                "name": "object4",
                "reference": "ref2"
            }
        }
    ]
]
```

This response shows the intermediate result of the composition with the given layers in the layeredECS. Note that the conflicting object describes the layers that conflict, even the layers that are overridden in the end.

A simplified view of the hierarchy can be requested with `layered.GetChildren("")` which will show the end result of the composition:

```json
[
    {
        "name": "object1",
        "reference": "ref1"
    },
    {
        "name": "shared",
        "reference": "ref1"
    },
    {
        "name": "conflict",
        "reference": "ref2"
    },
    {
        "name": "object4",
        "reference": "ref2"
    }
]
```

In the above snippet, the `conflict` object has been resolved to `ref2` as present in layer `upper`, and the data of layer `lower` is overridden and unavailable.

For individual components, similar function calls exist. For instance, to check the type of an object:

```ts
// lower layer classifies the object as window
lower.AddComponent(ECSID.FromString("conflict"), "cf", new ifc_window());
// upper layer classifies the object as wall
upper.AddComponent(ECSID.FromString("conflict"), "cf", new ifc_wall());

layered.ComponentIsOfType(ECSID.FromString("conflict.cf"), ifc_wall) // returns true
layered.ComponentIsOfType(ECSID.FromString("conflict.cf"), ifc_window) // returns false

// these return values would be opposite if the layers are reversed
```

In the above snippet, the layered ECS resolves the conflict between the components and can answer queries in a way that is consistent with the precedence of the contributing layers.