import { Link } from "@tanstack/react-router";
import type { HistoryEvent, Person, Region } from "@/data/types";
import { categoryEmoji, categoryLabel, formatYear, regionLabel } from "@/lib/history";

export const regionClass: Record<Region, string> = {
  east: "region-east",
  korea: "region-korea",
  west: "region-west",
};

export function RegionChip({ region }: { region: Region }) {
  return <span className={`chip-region ${regionClass[region]}`}>{regionLabel[region]}</span>;
}

export function EventCard({ event, compact = false }: { event: HistoryEvent; compact?: boolean }) {
  return (
    <Link
      to="/event/$id"
      params={{ id: event.id }}
      className={`card-region ${regionClass[event.region]} block p-3`}
    >
      <div className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
        <span>{categoryEmoji[event.category]}</span>
        <span>{formatYear(event.year)}</span>
        {event.endYear ? <span>~{event.endYear}</span> : null}
      </div>
      <h3 className="mt-1 text-[0.95rem] leading-snug font-semibold">{event.title}</h3>
      {!compact && (
        <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {event.summary}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-1">
        <span className={`chip-region ${regionClass[event.region]}`}>{regionLabel[event.region]}</span>
        <span className="chip-region">{categoryLabel[event.category]}</span>
        {event.place ? <span className="chip-region">{event.place}</span> : null}
      </div>
    </Link>
  );
}

export function PersonRow({ person }: { person: Person }) {
  return (
    <Link
      to="/person/$id"
      params={{ id: person.id }}
      className={`card-region ${regionClass[person.region]} flex items-center gap-3 p-3`}
    >
      <span className="text-2xl">{person.portraitEmoji ?? "🙂"}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">
          {person.name}
          {person.title ? (
            <span className="ml-1.5 text-[0.7rem] font-normal text-muted-foreground">{person.title}</span>
          ) : null}
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{person.oneLiner}</span>
      </span>
      <span className="text-xs text-muted-foreground">›</span>
    </Link>
  );
}

export function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 flex items-center gap-1.5 text-base font-bold">
        {icon ? <span>{icon}</span> : null}
        {title}
      </h2>
      {children}
    </section>
  );
}

export function BulletList({ items, tone }: { items: string[]; tone?: "good" | "bad" }) {
  const dot = tone === "good" ? "•" : tone === "bad" ? "•" : "•";
  return (
    <ul className="space-y-1.5">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed">
          <span
            className={
              tone === "good"
                ? "text-east"
                : tone === "bad"
                  ? "text-destructive"
                  : "text-muted-foreground"
            }
          >
            {dot}
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function TagLink({ personId, name, note }: { personId?: string; name: string; note?: string }) {
  const label = (
    <>
      {name}
      {note ? <span className="ml-1 opacity-70">· {note}</span> : null}
    </>
  );
  if (!personId) {
    return (
      <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground">
        {label}
      </span>
    );
  }
  return (
    <Link
      to="/person/$id"
      params={{ id: personId }}
      className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
    >
      {label} ›
    </Link>
  );
}

export function BackBar({ title }: { title: string }) {
  return (
    <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
      <Link to="/" className="text-lg">
        ←
      </Link>
      <span className="truncate font-title text-base font-bold">{title}</span>
    </div>
  );
}
