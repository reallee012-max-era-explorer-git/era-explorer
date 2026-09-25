import type { Era } from "./types";

export const eras: Era[] = [
  {
    id: "prehistory",
    name: "선사시대 · 고조선",
    subtitle: "구석기 ~ 기원전 108년",
    startYear: -100000,
    endYear: -108,
  },
  {
    id: "threekingdoms",
    name: "삼국시대",
    subtitle: "기원전 57년 ~ 668년",
    startYear: -107,
    endYear: 668,
  },
  {
    id: "northsouth",
    name: "남북국시대",
    subtitle: "통일신라와 발해, 668 ~ 918년",
    startYear: 669,
    endYear: 917,
  },
  {
    id: "goryeo",
    name: "고려시대",
    subtitle: "918 ~ 1392년",
    startYear: 918,
    endYear: 1391,
  },
  {
    id: "joseon",
    name: "조선시대",
    subtitle: "1392 ~ 1897년",
    startYear: 1392,
    endYear: 1896,
  },
  {
    id: "modern",
    name: "근대 · 개항기",
    subtitle: "대한제국과 일제강점기, 1897 ~ 1945년",
    startYear: 1897,
    endYear: 1945,
  },
  {
    id: "contemporary",
    name: "현대",
    subtitle: "1945년 광복 이후",
    startYear: 1946,
    endYear: 2100,
  },
];

export function eraOfYear(year: number): Era {
  const found = eras.find((e) => year >= e.startYear && year <= e.endYear);
  return found ?? (eras[0] as Era);
}

export function formatYear(year: number): string {
  return year < 0 ? `기원전 ${Math.abs(year)}년` : `${year}년`;
}
