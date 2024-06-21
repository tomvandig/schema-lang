// Generated code
import { ifc_buildingelement } from "./classifications.ts"
import { ifc_classification } from "./classifications.ts"
import { ifc_glazing } from "./classifications.ts"
import { ifc_space } from "./classifications.ts"
import { ifc_wall } from "./classifications.ts"
import { ifc_window } from "./classifications.ts"
import { ifc_windowframe } from "./classifications.ts"
import { example_childobject } from "./example.ts"
import { example_otherobject } from "./example.ts"
import { example_parentobject } from "./example.ts"
import { ifc_geometry } from "./geometry.ts"
import { ifc_spaceboundary } from "./spaceboundary.ts"
import { ifc_transform } from "./transform.ts"
export function Register(cb: (obj: any)=>void) {
	cb(ifc_buildingelement);
	cb(ifc_classification);
	cb(ifc_glazing);
	cb(ifc_space);
	cb(ifc_wall);
	cb(ifc_window);
	cb(ifc_windowframe);
	cb(example_childobject);
	cb(example_otherobject);
	cb(example_parentobject);
	cb(ifc_geometry);
	cb(ifc_spaceboundary);
	cb(ifc_transform);
}
export { ifc_buildingelement };
export { ifc_classification };
export { ifc_glazing };
export { ifc_space };
export { ifc_wall };
export { ifc_window };
export { ifc_windowframe };
export { example_childobject };
export { example_otherobject };
export { example_parentobject };
export { ifc_geometry };
export { ifc_spaceboundary };
export { ifc_transform };
