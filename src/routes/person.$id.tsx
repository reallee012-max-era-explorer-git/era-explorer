import { createFileRoute, notFound } from "@tanstack/react-router";
import { eventsOfPerson, formatYear, getPerson, osmEmbedUrl } from "@/lib/history";
import {
  BackBar,
  BulletList,
  EventCard,
  RegionChip,
  Section,
  TagLink,
} from "@/components/history-ui";
import type { RelationTag } from "@/data/types";

export const Route = createFileRoute("/person/$id")({
  loader: ({ params }) => {
    const person = getPerson(params.id);
    if (!person) throw notFound();
    return { person };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "찾을 수 없는 인물 — 모두의 역사" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.person;
    const title = `${p.name}${p.title ? ` · ${p.title}` : ""} — 모두의 역사`;
    return {
      meta: [
        { title },
        { name: "description", content: p.oneLiner },
        { property: "og:title", content: title },
        { property: "og:description", content: p.oneLiner },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: PersonDetail,
});

function RelationBlock({ label, tags }: { label: string; tags?: RelationTag[] | undefined }) {
  if (!tags?.length) return null;
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-xs font-semibold text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t, i) => (
          <TagLink key={i} personId={t.personId} name={t.name} note={t.note} />
        ))}
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-border bg-card p-3.5">{children}</div>;
}

function PersonDetail() {
  const { person: p } = Route.useLoaderData();
  const related = eventsOfPerson(p);

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl pb-16">
      <BackBar title={p.name} />
      <div className="px-4 py-4">
        <div className="flex items-start gap-3">
          <span className="text-4xl">{p.portraitEmoji ?? "🙂"}</span>
          <div className="min-w-0">
            <h1 className="font-title text-2xl font-bold">
              {p.name}
              {p.hanja ? <span className="ml-1.5 text-base text-muted-foreground">{p.hanja}</span> : null}
            </h1>
            {p.title ? <p className="text-sm text-muted-foreground">{p.title}</p> : null}
            <div className="mt-1.5">
              <RegionChip region={p.region} />
            </div>
          </div>
        </div>

        <p className="mt-3 text-[0.95rem] leading-relaxed">{p.oneLiner}</p>

        <Section title="생애" icon="🕰️">
          <Card>
            <dl className="space-y-1.5 text-sm">
              {p.birth || p.death ? (
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 text-muted-foreground">생몰</dt>
                  <dd>
                    {p.birth ? formatYear(p.birth) : "?"} ~ {p.death ? formatYear(p.death) : "?"}
                  </dd>
                </div>
              ) : null}
              {p.reignStart ? (
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 text-muted-foreground">재위/재임</dt>
                  <dd>
                    {formatYear(p.reignStart)} ~ {p.reignEnd ? formatYear(p.reignEnd) : "현재"}
                  </dd>
                </div>
              ) : null}
            </dl>
          </Card>
        </Section>

        {p.family ? (
          <Section title="가족 · 가계" icon="👪">
            <Card>
              <dl className="space-y-1.5 text-sm">
                {p.family.father ? (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-muted-foreground">아버지</dt>
                    <dd>{p.family.father}</dd>
                  </div>
                ) : null}
                {p.family.mother ? (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-muted-foreground">어머니</dt>
                    <dd>{p.family.mother}</dd>
                  </div>
                ) : null}
                {p.family.birthOrder ? (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-muted-foreground">서열·출신</dt>
                    <dd className="leading-relaxed">{p.family.birthOrder}</dd>
                  </div>
                ) : null}
                {p.family.spouses?.length ? (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-muted-foreground">배우자</dt>
                    <dd>{p.family.spouses.join(", ")}</dd>
                  </div>
                ) : null}
                {p.family.children?.length ? (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-muted-foreground">자녀</dt>
                    <dd>{p.family.children.join(", ")}</dd>
                  </div>
                ) : null}
              </dl>
            </Card>
          </Section>
        ) : null}

        {p.accession ? (
          <Section title="즉위 · 취임 경위" icon="🚪">
            <Card>
              <p className="text-sm leading-relaxed">{p.accession}</p>
            </Card>
          </Section>
        ) : null}

        {p.dynastyChange ? (
          <Section title="왕조 교체의 배경" icon="🔄">
            <div className="rounded-xl border border-border bg-accent p-3.5">
              <p className="text-sm leading-relaxed text-accent-foreground">{p.dynastyChange}</p>
            </div>
          </Section>
        ) : null}

        {p.merits?.length ? (
          <Section title="공(功) — 업적" icon="🏅">
            <Card>
              <BulletList items={p.merits} tone="good" />
            </Card>
          </Section>
        ) : null}

        {p.faults?.length ? (
          <Section title="과(過) — 논란과 실책" icon="⚠️">
            <Card>
              <BulletList items={p.faults} tone="bad" />
            </Card>
          </Section>
        ) : null}

        {p.achievements?.length ? (
          <Section title="분야별 업적" icon="📊">
            <div className="space-y-2">
              {p.achievements.map((g) => (
                <Card key={g.field}>
                  <p className="mb-1.5 text-sm font-bold">{g.field}</p>
                  <BulletList items={g.items} />
                </Card>
              ))}
            </div>
          </Section>
        ) : null}

        {p.privateLife?.length ? (
          <Section title="사생활 · 일화" icon="🍵">
            <Card>
              <BulletList items={p.privateLife} />
            </Card>
          </Section>
        ) : null}

        {p.relations ? (
          <Section title="인물 관계" icon="🕸️">
            <Card>
              <RelationBlock label="가족" tags={p.relations.family} />
              <RelationBlock label="신하 · 측근" tags={p.relations.allies} />
              <RelationBlock label="정적" tags={p.relations.rivals} />
              <RelationBlock label="영향을 받은 인물" tags={p.relations.influencedBy} />
              <RelationBlock label="영향을 준 인물" tags={p.relations.influenced} />
            </Card>
          </Section>
        ) : null}

        {p.comparedToPredecessor ? (
          <Section title="선대와의 비교" icon="⚖️">
            <Card>
              <p className="text-sm leading-relaxed">{p.comparedToPredecessor}</p>
            </Card>
          </Section>
        ) : null}

        {p.legacy ? (
          <Section title="후대에 끼친 영향" icon="🌱">
            <Card>
              <p className="text-sm leading-relaxed">{p.legacy}</p>
            </Card>
          </Section>
        ) : null}

        {p.places?.length ? (
          <Section title="관련 지명" icon="📍">
            <div className="space-y-2">
              {p.places.map((g) => (
                <div key={g.name}>
                  <p className="mb-1 text-xs text-muted-foreground">{g.name}</p>
                  <iframe
                    title={`${g.name} 지도`}
                    src={osmEmbedUrl(g.lat, g.lng)}
                    className="h-44 w-full rounded-xl border border-border"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {p.examPoints?.length ? (
          <Section title="시험 · 상식 포인트" icon="✅">
            <div className="rounded-xl border border-border bg-secondary p-3.5">
              <div className="flex flex-wrap gap-1.5">
                {p.examPoints.map((k) => (
                  <span key={k} className="rounded-md bg-card px-2 py-1 text-xs">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </Section>
        ) : null}

        {related.length > 0 ? (
          <Section title="관련 사건" icon="📜">
            <div className="space-y-2">
              {related.map((e) => (
                <EventCard key={e.id} event={e} compact />
              ))}
            </div>
          </Section>
        ) : null}

        <Section title="더 알아보기" icon="🔗">
          <div className="flex flex-wrap gap-2">
            {(p.links ?? []).map((l) => (
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
              href={`https://ko.wikipedia.org/w/index.php?search=${encodeURIComponent(p.name)}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs"
            >
              위키백과에서 찾기 ↗
            </a>
          </div>
        </Section>
      </div>
    </div>
  );
}
