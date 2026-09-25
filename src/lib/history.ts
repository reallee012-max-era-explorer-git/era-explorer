import { events } from "@/data/events";
import { people } from "@/data/people";
import { dynasties } from "@/data/dynasties";
import { eras, eraOfYear, formatYear } from "@/data/eras";
import type { Category, HistoryEvent, Person, Region } from "@/data/types";

export { events, people, dynasties, eras, eraOfYear, formatYear };

export const sortedEvents: HistoryEvent[] = [...events].sort((a, b) => a.year - b.year);

const eventById = new Map(events.map((e) => [e.id, e]));
const personById = new Map(people.map((p) => [p.id, p]));

export const getEvent = (id: string) => eventById.get(id);
export const getPerson = (id: string) => personById.get(id);
export const getDynasty = (id: string) => dynasties.find((d) => d.id === id);

export const regionLabel: Record<Region, string> = {
  east: "동양",
  korea: "한국",
  west: "서양",
};

export const categoryLabel: Record<Category, string> = {
  war: "전쟁·전투",
  politics: "정치·제도",
  culture: "문화·종교",
  science: "과학·기술",
  economy: "경제·생활",
  founding: "건국·멸망",
  movement: "운동·혁명",
};

export const categoryEmoji: Record<Category, string> = {
  war: "⚔️",
  politics: "🏛️",
  culture: "🎎",
  science: "🔬",
  economy: "💰",
  founding: "🏳️",
  movement: "✊",
};

/** 시대별로 묶은 타임라인 */
export function timelineByEra() {
  return eras
    .map((era) => ({
      era,
      items: sortedEvents.filter((e) => e.year >= era.startYear && e.year <= era.endYear),
    }))
    .filter((g) => g.items.length > 0);
}

/** 같은 시기(기본 ±40년) 다른 문명 사건 */
export function contemporaries(event: HistoryEvent, span = 40) {
  return sortedEvents
    .filter(
      (e) => e.id !== event.id && Math.abs(e.year - event.year) <= span && e.region !== event.region,
    )
    .slice(0, 6);
}

export function eventsOfPerson(person: Person) {
  const direct = (person.eventIds ?? []).map((id) => eventById.get(id)).filter(Boolean) as HistoryEvent[];
  const linked = events.filter((e) => e.personIds?.includes(person.id));
  const all = [...direct, ...linked];
  return Array.from(new Map(all.map((e) => [e.id, e])).values()).sort((a, b) => a.year - b.year);
}

export interface SearchResult {
  kind: "event" | "person" | "dynasty";
  id: string;
  title: string;
  subtitle: string;
  region?: Region;
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "");

/** 연도·인물·지역·사건명 통합 검색 */
export function search(queryRaw: string): SearchResult[] {
  const query = norm(queryRaw.trim());
  if (!query) return [];
  const yearQuery = Number(queryRaw.replace(/[^0-9-]/g, ""));
  const hasYear = queryRaw.trim().length > 0 && !Number.isNaN(yearQuery) && /\d/.test(queryRaw);

  const results: SearchResult[] = [];

  for (const e of events) {
    const haystack = norm(
      [e.title, e.summary, e.detail ?? "", e.place ?? "", e.geo?.name ?? "", ...(e.keywords ?? [])].join(" "),
    );
    const yearHit = hasYear && (e.year === yearQuery || (e.endYear != null && yearQuery >= e.year && yearQuery <= e.endYear));
    if (haystack.includes(query) || yearHit) {
      results.push({
        kind: "event",
        id: e.id,
        title: e.title,
        subtitle: `${formatYear(e.year)} · ${regionLabel[e.region]}${e.place ? ` · ${e.place}` : ""}`,
        region: e.region,
      });
    }
  }

  for (const p of people) {
    const haystack = norm(
      [p.name, p.hanja ?? "", p.title ?? "", p.oneLiner, ...(p.examPoints ?? []), ...(p.places ?? []).map((g) => g.name)].join(" "),
    );
    const yearHit =
      hasYear &&
      ((p.birth != null && p.death != null && yearQuery >= p.birth && yearQuery <= p.death) ||
        (p.reignStart != null && yearQuery >= p.reignStart && yearQuery <= (p.reignEnd ?? 2100)));
    if (haystack.includes(query) || yearHit) {
      results.push({
        kind: "person",
        id: p.id,
        title: p.name,
        subtitle: p.title ?? p.oneLiner,
        region: p.region,
      });
    }
  }

  for (const d of dynasties) {
    const haystack = norm([d.name, d.summary, ...d.rulers.map((r) => r.name)].join(" "));
    if (haystack.includes(query)) {
      results.push({ kind: "dynasty", id: d.id, title: d.name, subtitle: d.period });
    }
  }

  return results.slice(0, 60);
}

/** 지리 탭용: 좌표가 있는 사건 목록을 지역명 기준으로 묶음 */
export function eventsByPlace() {
  const map = new Map<string, HistoryEvent[]>();
  for (const e of sortedEvents) {
    const key = e.place ?? e.geo?.name ?? "기타";
    map.set(key, [...(map.get(key) ?? []), e]);
  }
  return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
}

export function eventsByCategory() {
  const cats = Object.keys(categoryLabel) as Category[];
  return cats.map((c) => ({ category: c, items: sortedEvents.filter((e) => e.category === c) }));
}

export function osmEmbedUrl(lat: number, lng: number, delta = 1.2) {
  const bbox = [lng - delta, lat - delta / 2, lng + delta, lat + delta / 2].join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}
