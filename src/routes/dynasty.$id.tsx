import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getDynasty } from "@/lib/history";
import { BackBar } from "@/components/history-ui";

export const Route = createFileRoute("/dynasty/$id")({
  loader: ({ params }) => {
    const dynasty = getDynasty(params.id);
    if (!dynasty) throw notFound();
    return { dynasty };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "찾을 수 없는 왕조 — 모두의 역사" }, { name: "robots", content: "noindex" }] };
    }
    const d = loaderData.dynasty;
    const title = `${d.name} 계보 (${d.period}) — 모두의 역사`;
    return {
      meta: [
        { title },
        { name: "description", content: d.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: d.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: DynastyDetail,
});

function DynastyDetail() {
  const { dynasty } = Route.useLoaderData();

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl pb-16">
      <BackBar title={dynasty.name} />
      <div className="px-4 py-4">
        <h1 className="font-title text-2xl font-bold">{dynasty.name}</h1>
        <p className="text-sm text-muted-foreground">{dynasty.period}</p>
        <p className="mt-3 text-sm leading-relaxed">{dynasty.summary}</p>

        <ol className="mt-5 space-y-1.5">
          {dynasty.rulers.map((r) => {
            const body = (
              <>
                <span className="flex w-11 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-bold text-secondary-foreground">
                  {r.order}대
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{r.name}</span>
                  <span className="block text-[0.7rem] text-muted-foreground">
                    {[r.reign, r.note].filter(Boolean).join(" · ")}
                  </span>
                </span>
                {r.personId ? <span className="text-xs text-muted-foreground">상세 ›</span> : null}
              </>
            );
            return (
              <li key={`${r.order}-${r.name}`}>
                {r.personId ? (
                  <Link
                    to="/person/$id"
                    params={{ id: r.personId }}
                    className="card-region region-korea flex items-center gap-3 p-2.5"
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5 opacity-90">
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
