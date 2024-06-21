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