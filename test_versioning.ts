import { ECS } from "./lib/ecs";
import { ECSID } from "./lib/sm_primitives";
import { ifc_versionedobject, ifc_versionedobject_2 } from "./schema/output/versioning";

let ecs = new ECS();
let entity = ECSID.FromString("");
let componentName = "component";

// add version 1 of object
{
    let original = new ifc_versionedobject();

    original.original_property = "original_value";

    ecs.AddComponent(entity, componentName, original);
}

// parse version 1 with new schema version 2, and overwrite
{
    console.log(ecs.ComponentIsOfType(entity.Push(componentName), ifc_versionedobject)); // prints "true"
    console.log(ecs.ComponentIsOfType(entity.Push(componentName), ifc_versionedobject_2)); // prints "false"
 
    let originalAsNew = ecs.GetComponentAs(ifc_versionedobject_2, entity, componentName);

    console.log(originalAsNew?.original_property); // prints "original_value"

    originalAsNew!.original_property = "new_value";
    originalAsNew!.added_property = "added_value_as_version_2";

    ecs.AddComponent(entity, componentName, originalAsNew!);
}

// parse version 2 with schema version 1, and overwrite again
{
    console.log(ecs.ComponentIsOfType(entity.Push(componentName), ifc_versionedobject)); // prints "true"
    console.log(ecs.ComponentIsOfType(entity.Push(componentName), ifc_versionedobject_2)); // prints "true"

    let newAsOriginal = ecs.GetComponentAs(ifc_versionedobject, entity, componentName);

    console.log(newAsOriginal?.original_property); // prints "new_value"

    newAsOriginal!.original_property = "overwritten_value";

    ecs.AddComponent(entity, componentName, newAsOriginal!);
}

// parse version 3 with schema version 2 again, observe that the unmodified property of v2 survived the read-edit loop of v1
{
    console.log(ecs.ComponentIsOfType(entity.Push(componentName), ifc_versionedobject)); // prints "true"
    console.log(ecs.ComponentIsOfType(entity.Push(componentName), ifc_versionedobject_2)); // prints "true"

    let newAsNew = ecs.GetComponentAs(ifc_versionedobject_2, entity, componentName);
    
    console.log(newAsNew?.original_property); // prints "overwritten_value"
    console.log(newAsNew?.added_property); // prints "added_value_as_version_2"
}

