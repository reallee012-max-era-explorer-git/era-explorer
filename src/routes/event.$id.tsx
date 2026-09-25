import { createFileRoute, notFound } from "@tanstack/react-router";
import {
  categoryEmoji,
  categoryLabel,
  contemporaries,
  formatYear,
  getEvent,
  getPerson,
  osmEmbedUrl,
  regionLabel,
} from "@/lib/history";
import { BackBar, EventCard, PersonRow, RegionChip, Section, regionClass } from "@/components/history-ui";

export const Route = createFileRoute("/event/$id")({
  loader: ({ params }) => {
    const event = getEvent(params.id);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "찾을 수 없는 사건 — 모두의 역사" }, { name: "robots", content: "noindex" }] };
    }
    const e = loaderData.event;
    const title = `${e.title} (${formatYear(e.year)}) — 모두의 역사`;
    return {
      meta: [
        { title },
        { name: "description", content: e.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: e.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: EventDetail,
});

function EventDetail() {
  const { event } = Route.useLoaderData();
  const persons = (event.personIds ?? []).map(getPerson).filter(Boolean);
  const others = contemporaries(event);

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl pb-16">
      <BackBar title={event.title} />
      <div className="px-4 py-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <RegionChip region={event.region} />
          <span className="chip-region">
            {categoryEmoji[event.category]} {categoryLabel[event.category]}
          </span>
          {event.place ? <span className="chip-region">{event.place}</span> : null}
        </div>
        <h1 className="mt-2 font-title text-2xl font-bold">{event.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatYear(event.year)}
          {event.endYear ? ` ~ ${event.endYear}년` : ""} · {regionLabel[event.region]}
        </p>

        <p className="mt-4 text-[0.95rem] leading-relaxed">{event.summary}</p>
        {event.detail ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{event.detail}</p>
        ) : null}

        {event.keywords?.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {event.keywords.map((k) => (
              <span key={k} className={`chip-region ${regionClass[event.region]}`}>
                #{k}
              </span>
            ))}
          </div>
        ) : null}

        {event.geo ? (
          <Section title="관련 위치" icon="🗺️">
            <p className="mb-1.5 text-xs text-muted-foreground">
              {event.geo.name} ({event.geo.lat.toFixed(3)}, {event.geo.lng.toFixed(3)})
            </p>
            <iframe
              title={`${event.geo.name} 지도`}
              src={osmEmbedUrl(event.geo.lat, event.geo.lng)}
              className="h-56 w-full rounded-xl border border-border"
              loading="lazy"
            />
          </Section>
        ) : null}

        {persons.length > 0 ? (
          <Section title="관련 인물" icon="🙂">
            <div className="space-y-2">
              {persons.map((p) => (
                <PersonRow key={p!.id} person={p!} />
              ))}
            </div>
          </Section>
        ) : null}

        {event.youtubeId ? (
          <Section title="관련 영상" icon="▶️">
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-border">
              <iframe
                title={`${event.title} 영상`}
                src={`https://www.youtube.com/embed/${event.youtubeId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </Section>
        ) : null}

        {others.length > 0 ? (
          <Section title="같은 시기, 다른 세계에서는" icon="🌏">
            <div className="space-y-2">
              {others.map((e) => (
                <EventCard key={e.id} event={e} compact />
              ))}
            </div>
          </Section>
        ) : null}

        <Section title="더 알아보기" icon="🔗">
          <div className="flex flex-wrap gap-2">
            {(event.links ?? []).map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs"
              >
                {l.label} ↗
              </a>
            ))}
            <a
              href={`https://ko.wikipedia.org/w/index.php?search=${encodeURIComponent(event.title)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs"
            >
              위키백과에서 찾기 ↗
            </a>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(event.title)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs"
            >
              유튜브에서 더 보기 ↗
            </a>
          </div>
        </Section>
      </div>
    </div>
  );
}
