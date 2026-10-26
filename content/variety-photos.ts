import type { StaticImageData } from "next/image";
import { VARIETIES, type Variety } from "./varieties";
import argos1 from "@/assets/varieties/argos_1.jpg";
import argos2 from "@/assets/varieties/argos_2.jpg";
import argos3 from "@/assets/varieties/argos_3.jpg";
import argos4 from "@/assets/varieties/argos_4.jpg";
import argos5 from "@/assets/varieties/argos_5.jpg";
import avantGarde1 from "@/assets/varieties/avant-garde_1.jpg";
import avantGarde2 from "@/assets/varieties/avant-garde_2.jpg";
import avantGarde3 from "@/assets/varieties/avant-garde_3.jpg";
import barreAlta1 from "@/assets/varieties/barre-alta_1.jpg";
import barreAlta2 from "@/assets/varieties/barre-alta_2.jpg";
import barreAlta3 from "@/assets/varieties/barre-alta_3.jpg";
import bodyBuilder1 from "@/assets/varieties/body-builder_1.jpg";
import bullit1 from "@/assets/varieties/bullit_1.jpg";
import bullit2 from "@/assets/varieties/bullit_2.jpg";
import bullit3 from "@/assets/varieties/bullit_3.jpg";
import cadenza1 from "@/assets/varieties/cadenza_1.jpg";
import cadenza2 from "@/assets/varieties/cadenza_2.jpg";
import columbus1 from "@/assets/varieties/columbus_1.jpg";
import columbus2 from "@/assets/varieties/columbus_2.jpg";
import columbus3 from "@/assets/varieties/columbus_3.jpg";
import cremeFraiche1 from "@/assets/varieties/creme-fraiche_1.jpg";
import deltaStorm1 from "@/assets/varieties/delta-storm_1.jpg";
import deltaStorm2 from "@/assets/varieties/delta-storm_2.jpg";
import deltaStorm3 from "@/assets/varieties/delta-storm_3.jpg";
import firstClass1 from "@/assets/varieties/first-class_1.jpg";
import firstClass2 from "@/assets/varieties/first-class_2.jpg";
import firstClass3 from "@/assets/varieties/first-class_3.jpg";
import firstStar1 from "@/assets/varieties/first-star_1.jpg";
import firstStar2 from "@/assets/varieties/first-star_2.jpg";
import firstStar3 from "@/assets/varieties/first-star_3.jpg";
import fondue1 from "@/assets/varieties/fondue_1.jpg";
import fondue2 from "@/assets/varieties/fondue_2.jpg";
import fondue3 from "@/assets/varieties/fondue_3.jpg";
import fondue4 from "@/assets/varieties/fondue_4.jpg";
import fortress1 from "@/assets/varieties/fortress_1.jpg";
import fortress2 from "@/assets/varieties/fortress_2.jpg";
import fortress3 from "@/assets/varieties/fortress_3.jpg";
import funForTwo1 from "@/assets/varieties/fun-for-two_1.jpg";
import funForTwo2 from "@/assets/varieties/fun-for-two_2.jpg";
import funForTwo3 from "@/assets/varieties/fun-for-two_3.jpg";
import gabriella1 from "@/assets/varieties/gabriella_1.jpg";
import gabriella2 from "@/assets/varieties/gabriella_2.jpg";
import gabriella3 from "@/assets/varieties/gabriella_3.jpg";
import hennieVanDerMost1 from "@/assets/varieties/hennie-van-der-most_1.jpg";
import hennieVanDerMost2 from "@/assets/varieties/hennie-van-der-most_2.jpg";
import hennieVanDerMost3 from "@/assets/varieties/hennie-van-der-most_3.jpg";
import icoon1 from "@/assets/varieties/icoon_1.jpg";
import icoon2 from "@/assets/varieties/icoon_2.jpg";
import icoon3 from "@/assets/varieties/icoon_3.jpg";
import lightPinkPrince1 from "@/assets/varieties/light-pink-prince_1.jpg";
import lightPinkPrince2 from "@/assets/varieties/light-pink-prince_2.jpg";
import lightPinkPrince3 from "@/assets/varieties/light-pink-prince_3.jpg";
import mariage1 from "@/assets/varieties/mariage_1.jpg";
import mariage2 from "@/assets/varieties/mariage_2.jpg";
import mariage3 from "@/assets/varieties/mariage_3.jpg";
import memphis1 from "@/assets/varieties/memphis_1.jpg";
import memphis2 from "@/assets/varieties/memphis_2.jpg";
import memphis3 from "@/assets/varieties/memphis_3.jpg";
import mosni1 from "@/assets/varieties/mosni_1.jpg";
import mosni3 from "@/assets/varieties/mosni_3.jpg";
import mrsMedvedeva1 from "@/assets/varieties/mrs-medvedeva_1.jpg";
import mrsMedvedeva2 from "@/assets/varieties/mrs-medvedeva_2.jpg";
import mrsMedvedeva3 from "@/assets/varieties/mrs-medvedeva_3.jpg";
import noviSun1 from "@/assets/varieties/novi-sun_1.jpg";
import pinkTwist1 from "@/assets/varieties/pink-twist_1.jpg";
import pinkTwist2 from "@/assets/varieties/pink-twist_2.jpg";
import polarBear1 from "@/assets/varieties/polar-bear_1.jpg";
import polarBear2 from "@/assets/varieties/polar-bear_2.jpg";
import polarBear3 from "@/assets/varieties/polar-bear_3.jpg";
import romanEmpire1 from "@/assets/varieties/roman-empire_1.jpg";
import romanEmpire2 from "@/assets/varieties/roman-empire_2.jpg";
import romanEmpire3 from "@/assets/varieties/roman-empire_3.jpg";
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
  "argos": [argos1, argos2, argos3, argos4, argos5],
  "avant-garde": [avantGarde1, avantGarde2, avantGarde3],
  "barre-alta": [barreAlta1, barreAlta2, barreAlta3],
  "body-builder": [bodyBuilder1],
  "bullit": [bullit1, bullit2, bullit3],
  "cadenza": [cadenza1, cadenza2],
  "columbus": [columbus1, columbus2, columbus3],
  "creme-fraiche": [cremeFraiche1],
  "delta-storm": [deltaStorm1, deltaStorm2, deltaStorm3],
  "first-class": [firstClass1, firstClass2, firstClass3],
  "first-star": [firstStar1, firstStar2, firstStar3],
  "fondue": [fondue1, fondue2, fondue3, fondue4],
  "fortress": [fortress1, fortress2, fortress3],
  "fun-for-two": [funForTwo1, funForTwo2, funForTwo3],
  "gabriella": [gabriella1, gabriella2, gabriella3],
  "hennie-van-der-most": [hennieVanDerMost1, hennieVanDerMost2, hennieVanDerMost3],
  "icoon": [icoon1, icoon2, icoon3],
  "light-pink-prince": [lightPinkPrince1, lightPinkPrince2, lightPinkPrince3],
  "mariage": [mariage1, mariage2, mariage3],
  "memphis": [memphis1, memphis2, memphis3],
  "mosni": [mosni1, mosni3], // photos/mosni_2.png is a copy of memphis_3; Haakman's own one still has their watermark
  "mrs-medvedeva": [mrsMedvedeva1, mrsMedvedeva2, mrsMedvedeva3],
  "novi-sun": [noviSun1],
  "pink-twist": [pinkTwist1, pinkTwist2],
  "polar-bear": [polarBear1, polarBear2, polarBear3],
  "roman-empire": [romanEmpire1, romanEmpire2, romanEmpire3],
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
