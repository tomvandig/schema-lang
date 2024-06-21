import { f32, $, str } from "./shared/primitives";

export const classification = {
    "ifc::classification": [
        {
        }
    ]
}

export const buildingelement = {
    "ifc::buildingelement": [
        [classification],
        {
        }
    ]
}

export const wall = {
    "ifc::wall": [
        [buildingelement],
        {
        }
    ]
}

export const window = {
    "ifc::window": [
        [buildingelement],
        {
        }
    ]
}

export const windowframe = {
    "ifc::windowframe": [
        [classification],
        {
        }
    ]
}

export const glazing = {
    "ifc::glazing": [
        [classification],
        {
        }
    ]
}

export const space = {
    "ifc::space": [
        [classification],
        {
        }
    ]
}