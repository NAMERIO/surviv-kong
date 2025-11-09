import type { AtlasDef } from "../atlasDefs";
import { BuildingSprites } from "./buildings";

export const ValentineAtlas: AtlasDef = {
    compress: true,
    images: [
        ...BuildingSprites.pavilion,
        ...BuildingSprites.bunker_eye,
        ...BuildingSprites.bunker_hatchet,

    ],
};
