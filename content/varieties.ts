import type { Lang } from "@/lib/i18n";
import type { ColorId, Shade, TulipType } from "./colors";

// Stock status is not stored here: it comes from the season source by color × type
export type Variety = {
  slug: string;
  name: string;
  color: ColorId; // the stock line
  shades: Shade[]; // the flower's own colors, main first; two of them = a two-tone variety
  type: TulipType;
  height?: string; // plant height in cm from the bulb exporters, "40–45"
  vaseLife?: number;
  description: Record<Lang, string>;
};

// Season 2027 bulb order (../bulb-order-2027.md). Height: Dutch bulb exporters (Haakman, Jan de Wit, P. Aker and others),
// checked 23.10.2026. Shades, type and descriptions: Haakman's props («красный/жёлтый») and photos, checked 25.10.2026.
// The main shade picks the stock line: cream sits under white, lilac-pink under pink, two-tone under its main color —
// Tatiana confirms the grouping.
const v = (slug: string, name: string, shades: Shade[], type: TulipType, height: string | undefined, ru: string, kz: string): Variety => {
  const [main] = shades;
  return { slug, name, color: main === "cream" ? "white" : main, shades, type, height, description: { ru, kz } };
};

export const VARIETIES: Variety[] = [
  v("strong-love", "Strong Love", ["red"], "classic", "40–50", "Глубокий тёмно-красный бокал с атласным блеском, цветок 8–10 см на прочном стебле.", "Атлас жылтыры бар терең қою қызыл тостаған, гүлі 8–10 см, сабағы берік."),
  v("first-star", "First Star", ["red"], "classic", "35", "Малиново-красный, лепестки заострённые, бутон плотно сомкнут.", "Таңқурай-қызыл, күлтелері үшкір, бүршігі тығыз жабық."),
  v("body-builder", "Body Builder", ["red", "yellow"], "classic", "50", "Красный бокал с жёлто-оранжевой каймой по краю лепестков, длинный стебель.", "Күлте шетінде сары-қызғылт сары жиегі бар қызыл тостаған, сабағы ұзын."),
  v("hennie-van-der-most", "Hennie van der Most", ["red", "yellow"], "classic", "30–50", "Красный с широкой золотисто-жёлтой каймой, бутон вытянутый.", "Кең алтын-сары жиекті қызыл гүл, бүршігі созылыңқы."),
  v("roman-empire", "Roman Empire", ["red", "white"], "classic", "55", "Ярко-красный с кремово-белым «пламенем» по краю лепестков, длинный стебель.", "Күлте шетінде кілегей-ақ «жалыны» бар ашық қызыл гүл, сабағы ұзын."),
  v("polar-bear", "Polar Bear", ["white"], "classic", "50", "Чисто-белый вытянутый бокал на длинном стебле.", "Ұзын сабақтағы таза ақ созылыңқы тостаған."),
  v("mrs-medvedeva", "Mrs. Medvedeva", ["white"], "classic", "45", "Белоснежный крупный бокал без оттенков.", "Реңксіз аппақ ірі тостаған."),
  v("creme-fraiche", "Crème Fraiche", ["cream"], "classic", "45", "Кремовый с лёгким жёлтым оттенком, крупный классический бокал.", "Сарғыштау кілегей түсті, ірі классикалық тостаған."),
  v("fondue", "Fondue", ["cream"], "classic", "40", "Раскрывается атласным нежно-жёлтым цветком и светлеет до цвета слоновой кости.", "Атлас тәрізді нәзік сары гүл болып ашылып, піл сүйегі түсіне дейін ағарады."),
  v("fun-for-two", "Fun For Two", ["cream"], "classic", "45", "Кремово-жёлтый, к краям лепестков светлее.", "Кілегей-сары, күлте шеттеріне қарай ағарады."),
  v("avant-garde", "Avant Garde", ["cream"], "double", "45–50", "Крупный пионовидный цветок нежного кремово-жёлтого цвета, края светлее; толстый прочный стебель, лёгкий аромат.", "Нәзік кілегей-сары ірі пион тәрізді гүл, шеттері ашығырақ; сабағы жуан әрі берік, жеңіл хош иісі бар."),
  v("argos", "Argos", ["pink"], "classic", "40–45", "Сиренево-розовый цветок со светлой каймой, классический бокал на прочном стебле.", "Ашық жиекті сиреньді-қызғылт гүл, берік сабақтағы классикалық тостаған."),
  v("barre-alta", "Barre Alta", ["pink"], "classic", "45", "Розовые лепестки к краю светлеют до нежно-розового с коралловым оттенком.", "Қызғылт күлтелер шетіне қарай маржан реңкті нәзік қызғылтқа ауысады."),
  v("first-class", "First Class", ["pink", "white"], "classic", "40–45", "Белое основание переходит в нежно-розовый верх; цветки долго держатся, стебель прочный.", "Ақ түбі нәзік қызғылт ұшына ауысады; гүлі ұзақ тұрады, сабағы берік."),
  v("gabriella", "Gabriella", ["pink"], "classic", "40–45", "Заострённые лепестки: нежно-розовое «пламя» переходит в кайму цвета слоновой кости.", "Үшкір күлтелер: нәзік қызғылт «жалын» піл сүйегі түсті жиекке ауысады."),
  v("light-pink-prince", "Light Pink Prince", ["pink"], "classic", "30–40", "Сиренево-розовый с жемчужным отливом, крупный бокаловидный бутон.", "Інжу жылтырлы сиреньді-қызғылт, бүршігі ірі тостаған тәрізді."),
  v("memphis", "Memphis", ["pink", "white"], "classic", "50–55", "Белое основание переходит в ярко-розовый верх, длинный прочный стебель.", "Ақ түбі ашық қызғылт ұшына ауысады, сабағы ұзын әрі берік."),
  v("mosni", "Mosni", ["pink"], "classic", "45", "Сиренево-розовый вытянутый бокал, к краю лепестков светлее.", "Сиреньді-қызғылт созылыңқы тостаған, күлте шетіне қарай ашығырақ."),
  v("pink-twist", "Pink Twist", ["pink"], "classic", "35–40", "Яркий насыщенно-розовый, плотный вытянутый бутон.", "Ашық әрі қанық қызғылт, бүршігі тығыз әрі созылыңқы."),
  v("sissi", "Sissi", ["pink"], "classic", "50–55", "Насыщенно-розовый со светлыми краями и основанием цвета слоновой кости, длинный прочный стебель.", "Жиегі ашық, түбі піл сүйегі түстес қанық қызғылт, сабағы ұзын әрі берік."),
  v("tresor", "Tresor", ["pink"], "classic", "50–60", "Чистый ярко-розовый бокал на длинном стебле.", "Ұзын сабақтағы таза ашық қызғылт тостаған."),
  v("columbus", "Columbus", ["pink", "white"], "double", "45–50", "Крупный пионовидный цветок малиново-розового цвета с белой каймой.", "Ақ жиекті таңқурай-қызғылт ірі пион тәрізді гүл."),
  v("mariage", "Mariage", ["pink"], "double", "45", "Нежно-розовый пионовидный цветок, бывает несколько цветков на стебле, стебель прочный.", "Нәзік қызғылт пион тәрізді гүл, кейде бір сабақта бірнеше гүл, сабағы берік."),
  v("strong-gold", "Strong Gold", ["yellow"], "classic", "45–55", "Насыщенный золотисто-жёлтый цветок 8–10 см на прочном стебле, один из главных сортов на срезку.", "Берік сабақтағы 8–10 см қанық алтын-сары гүл, кесуге арналған негізгі сорттардың бірі."),
  v("cheers", "Cheers", ["yellow"], "classic", "40–50", "Бледно-жёлтый цветок, к раскрытию светлеет до цвета слоновой кости.", "Бозғылт сары гүл, ашылған сайын піл сүйегі түсіне дейін ағарады."),
  v("novi-sun", "Novi Sun", ["yellow"], "classic", undefined, "Дарвинов гибрид: крупный бокал с ярко-жёлтыми лепестками.", "Дарвин гибриді: күлтелері ашық сары ірі тостаған."),
  v("cadenza", "Cadenza", ["yellow"], "double", "40", "Лимонно-жёлтый махровый цветок, плотный и округлый.", "Лимон-сары қос күлтелі гүл, тығыз әрі домалақ."),
  v("bullit", "Bullit", ["purple"], "classic", "45", "Насыщенно-фиолетовый с атласным блеском, плотный вытянутый бокал на прочном стебле.", "Атлас жылтырлы қанық күлгін, тығыз созылыңқы тостаған, сабағы берік."),
  v("fortress", "Fortress", ["purple"], "classic", "55", "Сиренево-фиолетовый с розовым отливом, крупный бокал, длинный стебель.", "Қызғылт реңкті сиреньді-күлгін, тостағаны ірі, сабағы ұзын."),
  v("delta-storm", "Delta Storm", ["orange"], "classic", "50–60", "Мягкий лососево-оранжевый с тонкой жёлто-оранжевой каймой, длинный стебель.", "Жіңішке сары-қызғылт сары жиекті жұмсақ қызғылт сары гүл, сабағы ұзын."),
  v("icoon", "Icoon", ["orange", "yellow"], "double", "45–50", "Крупные плотные пионовидные цветки 7–10 см: красно-оранжевые с более светлым краем, с ароматом.", "7–10 см тығыз ірі пион тәрізді гүлдер: шеті ашығырақ қызыл-қызғылт сары, хош иісті."),
];

// Varieties sold as one line (same color × type): they share the stock of that line
export const groupOf = (x: Pick<Variety, "color" | "type">) =>
  VARIETIES.filter((y) => y.color === x.color && y.type === x.type).map((y) => y.slug);

// A line's varieties as catalog filter values: their main shades (the white line also holds the cream ones)
export const shadesOf = (x: Pick<Variety, "color" | "type">) => [
  ...new Set(VARIETIES.filter((y) => y.color === x.color && y.type === x.type).map((y) => y.shades[0])),
];

// «Стебель от 50 см»: even the shortest plant of the range reaches 50 cm
export const isTall = (x: Pick<Variety, "height">) => Number.parseInt(x.height ?? "") >= 50;
