export type Grad = "Enkel" | "Middels" | "Krevende";
export type Category = "trips" | "cabins" | "places" | "groups";
export interface Tur {
  id: number;
  tittel: string;
  omrade: string;
  grad: Grad;
  km: number;
  hours: number;
  category: Category;
  activity: "walk" | "bike" | "ski";
  lat: number;
  lng: number;
  image: string;
  description: string;
  facilities?: string[];
  price?: number;
  staffed?: boolean;
  dates?: string[];
  capacity?: number;
  booked?: number;
}
const mountain = "/images/mountains.jpg";
const lake = "/images/landscape.jpg";
const forest = "/images/forest.jpg";
export const turer: Tur[] = [
  {
    id: 1,
    tittel: "Besseggen",
    omrade: "Jotunheimen",
    grad: "Krevende",
    km: 14,
    hours: 7,
    category: "trips",
    activity: "walk",
    lat: 61.497,
    lng: 8.81,
    image: mountain,
    description:
      "En luftig vandring mellom Gjende og Bessvatnet. Bratte partier krever godt fottøy og erfaring. Planlegg transport og sjekk forholdene før avreise.",
  },
  {
    id: 2,
    tittel: "Sognsvann rundt",
    omrade: "Nordmarka · Oslo",
    grad: "Enkel",
    km: 3.3,
    hours: 1,
    category: "trips",
    activity: "walk",
    lat: 59.974,
    lng: 10.728,
    image: lake,
    description:
      "En rolig runde langs vannet, med rasteplasser og gode muligheter for en pause i skogen.",
  },
  {
    id: 3,
    tittel: "Gaustatoppen",
    omrade: "Telemark",
    grad: "Middels",
    km: 8.6,
    hours: 5,
    category: "trips",
    activity: "walk",
    lat: 59.854,
    lng: 8.65,
    image: mountain,
    description:
      "Fra Stavsro følger du en steinete sti opp mot vid utsikt. Ta med varme klær også på sommerdager.",
  },
  {
    id: 4,
    tittel: "På sykkel gjennom Nordmarka",
    omrade: "Nordmarka · Oslo",
    grad: "Middels",
    km: 24,
    hours: 3,
    category: "trips",
    activity: "bike",
    lat: 60.043,
    lng: 10.69,
    image: forest,
    description:
      "Grusveier gjennom skog og forbi stille vann. En fin dagstur med tid til matpause.",
  },
  {
    id: 5,
    tittel: "Vinterspor på Sjusjøen",
    omrade: "Innlandet",
    grad: "Enkel",
    km: 10,
    hours: 2,
    category: "trips",
    activity: "ski",
    lat: 61.153,
    lng: 10.699,
    image: lake,
    description:
      "En lett skitur i åpent terreng. Undersøk løype- og snøforhold før du legger ut.",
  },
  {
    id: 6,
    tittel: "Gjendesheim",
    omrade: "Jotunheimen",
    grad: "Enkel",
    km: 0,
    hours: 0,
    category: "cabins",
    activity: "walk",
    lat: 61.495,
    lng: 8.811,
    image: lake,
    description:
      "Et utgangspunkt for fjellturer ved Gjende. Her viser vi eksempel på en egen presentasjonsside for et overnattingssted.",
    staffed: true,
    price: 850,
    facilities: ["food", "shower", "electricity"],
  },
  {
    id: 7,
    tittel: "Skogstua",
    omrade: "Nordmarka",
    grad: "Enkel",
    km: 0,
    hours: 0,
    category: "cabins",
    activity: "walk",
    lat: 60.067,
    lng: 10.65,
    image: forest,
    description:
      "En fiktiv, ubetjent hytte i skogen. Ta med egen mat og sovepose.",
    staffed: false,
    price: 350,
    facilities: ["fireplace"],
  },
  {
    id: 8,
    tittel: "Utsikten ved Gjende",
    omrade: "Jotunheimen",
    grad: "Enkel",
    km: 2,
    hours: 1,
    category: "places",
    activity: "walk",
    lat: 61.49,
    lng: 8.76,
    image: lake,
    description: "Et fint sted for en rast med utsikt over vann og fjell.",
  },
  {
    id: 9,
    tittel: "Sammen over Besseggen",
    omrade: "Jotunheimen",
    grad: "Krevende",
    km: 14,
    hours: 7,
    category: "groups",
    activity: "walk",
    lat: 61.497,
    lng: 8.8,
    image: mountain,
    description:
      "Bli med turleder på en sosial fjelltur. Vi velger én av tre startdatoer etter forholdene. Datoene og plassene er demonstrasjonsdata.",
    dates: ["2027-07-20", "2027-07-21", "2027-07-22"],
    capacity: 12,
    booked: 6,
  },
  {
    id: 10,
    tittel: "Søndagstur rundt Sognsvann",
    omrade: "Nordmarka · Oslo",
    grad: "Enkel",
    km: 3.3,
    hours: 1,
    category: "groups",
    activity: "walk",
    lat: 59.973,
    lng: 10.73,
    image: forest,
    description:
      "En lavterskeltur med turleder. Ta med niste og noe varmt å drikke.",
    dates: ["2027-06-13"],
    capacity: 15,
    booked: 15,
  },
];
