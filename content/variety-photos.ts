import type { StaticImageData } from "next/image";
import { VARIETIES, type Variety } from "./varieties";
import bullit1 from "@/assets/varieties/bullit_1.jpg";
import bullit2 from "@/assets/varieties/bullit_2.jpg";
import bullit3 from "@/assets/varieties/bullit_3.jpg";
import columbus1 from "@/assets/varieties/columbus_1.jpg";
import columbus2 from "@/assets/varieties/columbus_2.jpg";
import columbus3 from "@/assets/varieties/columbus_3.jpg";
import deltaStorm1 from "@/assets/varieties/delta-storm_1.jpg";
import deltaStorm2 from "@/assets/varieties/delta-storm_2.jpg";
import deltaStorm3 from "@/assets/varieties/delta-storm_3.jpg";
import firstStar3 from "@/assets/varieties/first-star_3.jpg";
import firstStar1 from "@/assets/varieties/first-star_1.jpg";
import firstStar2 from "@/assets/varieties/first-star_2.jpg";
import fortress1 from "@/assets/varieties/fortress_1.jpg";
import fortress2 from "@/assets/varieties/fortress_2.jpg";
import fortress3 from "@/assets/varieties/fortress_3.jpg";
import funForTwo1 from "@/assets/varieties/fun-for-two_1.jpg";
import funForTwo2 from "@/assets/varieties/fun-for-two_2.jpg";
import funForTwo3 from "@/assets/varieties/fun-for-two_3.jpg";
import hennieVanDerMost1 from "@/assets/varieties/hennie-van-der-most_1.jpg";
import hennieVanDerMost2 from "@/assets/varieties/hennie-van-der-most_2.jpg";
import hennieVanDerMost3 from "@/assets/varieties/hennie-van-der-most_3.jpg";
import icoon1 from "@/assets/varieties/icoon_1.jpg";
import icoon2 from "@/assets/varieties/icoon_2.jpg";
import icoon3 from "@/assets/varieties/icoon_3.jpg";
import mrsMedvedeva1 from "@/assets/varieties/mrs-medvedeva_1.jpg";
import mrsMedvedeva2 from "@/assets/varieties/mrs-medvedeva_2.jpg";
import mrsMedvedeva3 from "@/assets/varieties/mrs-medvedeva_3.jpg";
import pinkTwist1 from "@/assets/varieties/pink-twist_1.jpg";
import pinkTwist2 from "@/assets/varieties/pink-twist_2.jpg";
import polarBear1 from "@/assets/varieties/polar-bear_1.jpg";
import polarBear2 from "@/assets/varieties/polar-bear_2.jpg";
import polarBear3 from "@/assets/varieties/polar-bear_3.jpg";
import sissi1 from "@/assets/varieties/sissi_1.jpg";
import sissi2 from "@/assets/varieties/sissi_2.jpg";
import sissi3 from "@/assets/varieties/sissi_3.jpg";
import strongGold1 from "@/assets/varieties/strong-gold_1.jpg";
import strongGold2 from "@/assets/varieties/strong-gold_2.jpg";
import strongGold3 from "@/assets/varieties/strong-gold_3.jpg";
import strongLove1 from "@/assets/varieties/strong-love_1.jpg";
import strongLove2 from "@/assets/varieties/strong-love_2.jpg";
import strongLove3 from "@/assets/varieties/strong-love_3.jpg";
import tresor1 from "@/assets/varieties/tresor_1.jpg";
import tresor2 from "@/assets/varieties/tresor_2.jpg";
import tresor3 from "@/assets/varieties/tresor_3.jpg";

// Haakman Flowerbulbs' photos, used with their permission (Nikita, 25.10.2026). The close-up of the bud goes first:
// it is the card's photo. Varieties without photos keep the placeholder
export const VARIETY_PHOTOS: Record<string, StaticImageData[]> = {
  "bullit": [bullit1, bullit2, bullit3],
  "columbus": [columbus1, columbus2, columbus3],
  "delta-storm": [deltaStorm1, deltaStorm2, deltaStorm3],
  "first-star": [firstStar1, firstStar2, firstStar3],
  "fortress": [fortress1, fortress2, fortress3],
  "fun-for-two": [funForTwo1, funForTwo2, funForTwo3],
  "hennie-van-der-most": [hennieVanDerMost1, hennieVanDerMost2, hennieVanDerMost3],
  "icoon": [icoon1, icoon2, icoon3],
  "mrs-medvedeva": [mrsMedvedeva1, mrsMedvedeva2, mrsMedvedeva3],
  "pink-twist": [pinkTwist1, pinkTwist2],
  "polar-bear": [polarBear1, polarBear2, polarBear3],
  "sissi": [sissi1, sissi2, sissi3],
  "strong-gold": [strongGold1, strongGold2, strongGold3],
  "strong-love": [strongLove1, strongLove2, strongLove3],
  "tresor": [tresor1, tresor2, tresor3],
};

// A variety's photo for a whole group (a color tile, a stock line): the first matching variety that has photos
export const groupPhoto = (match: (v: Variety) => boolean, n = 0) => {
  const photos = VARIETIES.filter(match).map((v) => VARIETY_PHOTOS[v.slug]).find(Boolean);
  return photos && (photos[n] ?? photos[0]);
};
