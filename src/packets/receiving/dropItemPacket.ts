import { ReceivingPacket } from "../receivingPacket";
import { IdToGameType, ItemSlot, type SurvivBitStream } from "../../utils";

export class DropItemPacket extends ReceivingPacket {

    deserialize(stream: SurvivBitStream): void {
        const itemId = stream.readGameType();
        const itemSlot = stream.readUint8();
        const item: string = IdToGameType[String(itemId)];

        const undroppableMeleeItems = [
            "fists",
            "red_gloves", "feral_gloves", "crab_gloves", "fist_split", "fist_blueVelvet", "fist_frostpunch", "fist_immolate", "fist_bulletbills",
            "fist_moss", "fist_blackholes", "fist_rainbowhands", "fist_darklets", "fist_scifi", "fist_poke", "fist_paws", "fist_dinoclaws",
            "fist_leaf", "fist_ranger", "fist_linedUp", "fist_lit", "fist_gift_punch", "fist_ember", "fist_santa", "fist_purptog",
            "fist_golden_lobster", "fist_pineFury", "fist_dreidel", "fist_bePresent", "fist_tropicana", "fist_spongeguy", "fist_rafflesia",
            "fist_golddrops", "fist_grizzly", "fist_coco_nut", "fist_101Spots", "fist_atnet", "fist_vitaminc", "fist_marblerun",
            "fist_beachballin", "fist_fritterpunch", "fist_dishsoap", "fist_watermelon", "fist_bloody", "fist_makeachoice", "fist_bologna",
            "fist_flashy", "fist_tigerseed", "fist_paddle", "fist_inkybusiness", "fist_theotherpong", "fist_getdowntonite", "fist_milestones",
            "fist_washilamps", "fist_ghostpoke", "fist_condimentium", "fist_shinyjello", "fist_graphbars", "fist_purpleshutter",
            "fist_orangeandlime", "fist_nopinenogain", "fist_bullseye", "fist_flamingnucleus", "fist_meteornite", "fist_orangemintstones",
            "fist_firsttool", "fist_stonedgy", "fist_bonkbonk", "fist_fuzzyhooves", "fist_retrhorizon", "fist_pixeldots", "fist_ranchchips",
            "fist_lolitapop", "fist_dizzielocs", "fist_q-fist", "fist_d-punch-pad", "fist_developtheserolls", "fist_squareycherry",
            "fist_tawget", "fist_boogiestripes", "fist_garbanjo", "fist_wreckedangle", "fist_woodyallan", "fist_cattlebattle",
            "fist_badmitten", "fist_milkshaked", "fist_horsepower", "fist_upandatom"
        ];

        switch(itemSlot) {
            case ItemSlot.Primary:
                this.p.dropItemInSlot(0, item);
                break;
            case ItemSlot.Secondary:
                this.p.dropItemInSlot(1, item);
                break;
            case ItemSlot.Melee:
                if (undroppableMeleeItems.includes(item)) break;
                this.p.dropItemInSlot(2, item);
                break;
            default:
                break;
        }

        stream.readBits(6); // Padding
    }
}
