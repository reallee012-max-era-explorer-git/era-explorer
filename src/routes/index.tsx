import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  categoryEmoji,
  categoryLabel,
  dynasties,
  eventsByCategory,
  eventsByPlace,
  formatYear,
  people,
  regionLabel,
  search,
  timelineByEra,
} from "@/lib/history";
import { EventCard, PersonRow, regionClass } from "@/components/history-ui";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Region } from "@/data/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "📚 모두의 역사 — 한국사와 세계사를 나란히" },
      {
        name: "description",
        content:
          "한국사를 기준으로 같은 시기 동양·서양 세계사를 나란히 비교하는 타임라인 역사 백과사전. 왕조 계보와 인물 상세 프로필까지.",
      },
      { property: "og:title", content: "📚 모두의 역사 — 한국사와 세계사를 나란히" },
      {
        property: "og:description",
        content: "동양·한국·서양 3열 타임라인으로 보는 역사 백과사전. 사건, 왕조, 인물을 한눈에.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const tabs = [
  { id: "time", label: "시간순" },
  { id: "dynasty", label: "왕조" },
  { id: "person", label: "인물" },
  { id: "geo", label: "지리" },
  { id: "category", label: "종류" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function Index() {
  const [tab, setTab] = useState<TabId>("time");
  const [query, setQuery] = useState("");
  const results = useMemo(() => search(query), [query]);

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl pb-16">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 pt-3">
          <h1 className="font-title text-xl font-bold">📚 모두의 역사</h1>
          <ThemeToggle />
        </div>
        <p className="px-4 pt-0.5 text-[0.7rem] text-muted-foreground">
          한국사 옆에 나란히 흐르는 동양·서양 이야기
        </p>
        <div className="px-4 py-2.5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="연도·인물·지역·사건 검색 (예: 1592, 세종, 강화도)"
            className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {!query && (
          <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full px-3.5 py-1.5 text-sm whitespace-nowrap transition-colors ${
                  tab === t.id
                    ? "bg-primary font-semibold text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      {query ? (
        <SearchResults results={results} />
      ) : tab === "time" ? (
        <TimelineTab />
      ) : tab === "dynasty" ? (
        <DynastyTab />
      ) : tab === "person" ? (
        <PersonTab />
      ) : tab === "geo" ? (
        <GeoTab />
      ) : (
        <CategoryTab />
      )}
    </div>
  );
}

function SearchResults({ results }: { results: ReturnType<typeof search> }) {
  if (results.length === 0) {
    return <p className="px-4 py-10 text-center text-sm text-muted-foreground">검색 결과가 없습니다.</p>;
  }
  return (
    <div className="space-y-2 px-4 py-4">
      <p className="text-xs text-muted-foreground">{results.length}건</p>
      {results.map((r) => {
        const cls = r.region ? regionClass[r.region] : "";
        const inner = (
          <>
            <span className="block text-sm font-semibold">
              {r.kind === "person" ? "🙂 " : r.kind === "dynasty" ? "🏯 " : "📜 "}
              {r.title}
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">{r.subtitle}</span>
          </>
        );
        const className = `card-region ${cls} block p-3`;
        if (r.kind === "event")
          return (
            <Link key={r.id} to="/event/$id" params={{ id: r.id }} className={className}>
              {inner}
            </Link>
          );
        if (r.kind === "person")
          return (
            <Link key={r.id} to="/person/$id" params={{ id: r.id }} className={className}>
              {inner}
            </Link>
          );
        return (
          <Link key={r.id} to="/dynasty/$id" params={{ id: r.id }} className={className}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}

const columns: Region[] = ["east", "korea", "west"];

function TimelineTab() {
  const groups = timelineByEra();
  return (
    <div>
      <div className="sticky top-[9.6rem] z-20 grid grid-cols-3 gap-1 border-b border-border bg-background/95 px-2 py-1.5 text-center text-[0.7rem] font-semibold backdrop-blur">
        {columns.map((r) => (
          <span key={r} className={`chip-region ${regionClass[r]}`}>
            {regionLabel[r]}
          </span>
        ))}
      </div>
      {groups.map(({ era, items }) => (
        <div key={era.id}>
          <div className="era-banner px-4 py-3">
            <h2 className="font-title text-lg font-bold">{era.name}</h2>
            <p className="text-xs text-muted-foreground">{era.subtitle}</p>
          </div>
          <div className="space-y-2 px-2 py-3">
            {items.map((e) => (
              <div key={e.id} className="grid grid-cols-3 gap-1.5">
                {columns.map((col) =>
                  col === e.region ? (
                    <EventCard key={col} event={e} />
                  ) : (
                    <div key={col} className="min-h-2" />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DynastyTab() {
  return (
    <div className="space-y-2 px-4 py-4">
      {dynasties.map((d) => (
        <Link
          key={d.id}
          to="/dynasty/$id"
          params={{ id: d.id }}
          className="card-region region-korea block p-3.5"
        >
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-title text-base font-bold">{d.name}</h3>
            <span className="text-[0.7rem] text-muted-foreground">{d.period}</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{d.summary}</p>
          <p className="mt-1.5 text-[0.7rem] text-muted-foreground">총 {d.rulers.length}명 수록 ›</p>
        </Link>
      ))}
    </div>
  );
}

function PersonTab() {
  const groups: { label: string; region: Region }[] = [
    { label: "한국 인물", region: "korea" },
    { label: "동양 인물", region: "east" },
    { label: "서양 인물", region: "west" },
  ];
  return (
    <div className="px-4 py-4">
      {groups.map((g) => {
        const list = people.filter((p) => p.region === g.region);
        if (list.length === 0) return null;
        return (
          <div key={g.region} className="mb-5">
            <h2 className="mb-2 text-sm font-bold text-muted-foreground">{g.label}</h2>
            <div className="space-y-2">
              {list.map((p) => (
                <PersonRow key={p.id} person={p} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GeoTab() {
  const groups = eventsByPlace();
  return (
    <div className="space-y-4 px-4 py-4">
      {groups.map(([place, items]) => (
        <div key={place}>
          <h2 className="mb-1.5 text-sm font-bold">
            📍 {place} <span className="text-xs font-normal text-muted-foreground">{items.length}건</span>
          </h2>
          <div className="space-y-1.5">
            {items.map((e) => (
              <Link
                key={e.id}
                to="/event/$id"
                params={{ id: e.id }}
                className={`card-region ${regionClass[e.region]} flex items-center gap-2 p-2.5`}
              >
                <span className="w-20 shrink-0 text-[0.7rem] text-muted-foreground">
                  {formatYear(e.year)}
                </span>
                <span className="truncate text-sm">{e.title}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoryTab() {
  return (
    <div className="space-y-5 px-4 py-4">
      {eventsByCategory().map(({ category, items }) => (
        <div key={category}>
          <h2 className="mb-1.5 text-sm font-bold">
            {categoryEmoji[category]} {categoryLabel[category]}{" "}
            <span className="text-xs font-normal text-muted-foreground">{items.length}건</span>
          </h2>
          <div className="space-y-1.5">
            {items.map((e) => (
              <Link
                key={e.id}
                to="/event/$id"
                params={{ id: e.id }}
                className={`card-region ${regionClass[e.region]} flex items-center gap-2 p-2.5`}
              >
                <span className="w-20 shrink-0 text-[0.7rem] text-muted-foreground">
                  {formatYear(e.year)}
                </span>
                <span className="truncate text-sm">{e.title}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
