export default function Page() {
  return (
    <main className="p-6 md:p-10">
      <section id="overview" className="mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-balance">Astrocluter Mission Control</h1>
        <p className="text-muted-foreground mt-2 max-w-prose">
          Navigate AI, data analysis, and space exploration modules using the left navigation. Sections include Event
          Overview, AI/ML Challenge, Data Analysis, Exoplanets, Planets & Moons, Software Tools, Space Exploration, and
          Resources.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section id="aiml" className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">AI/ML Challenge</h2>
          <p className="text-muted-foreground mt-2">Models, datasets, and evaluation criteria.</p>
        </section>

        <section id="data" className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Data Analysis</h2>
          <p className="text-muted-foreground mt-2">Pipelines, notebooks, and visualizations.</p>
        </section>

        <section id="exoplanets" className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Exoplanets</h2>
          <p className="text-muted-foreground mt-2">Targets of interest and detection methods.</p>
        </section>

        <section id="planets" className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Planets & Moons</h2>
          <p className="text-muted-foreground mt-2">In-situ data, missions, and findings.</p>
        </section>

        <section id="tools" className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Software Tools</h2>
          <p className="text-muted-foreground mt-2">Frameworks, libraries, and utilities.</p>
        </section>

        <section id="explore" className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Space Exploration</h2>
          <p className="text-muted-foreground mt-2">Missions, vehicles, and future horizons.</p>
        </section>

        <section id="resources" className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Resources</h2>
          <p className="text-muted-foreground mt-2">Docs, references, and datasets.</p>
        </section>
      </div>
    </main>
  )
}
