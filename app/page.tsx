import { PageWrapper } from "../app/components/page-wrapper"

export default function Page() {
  return (
    <PageWrapper
      title="Astrocluter Mission Control"
      description="Navigate AI, data analysis, and space exploration modules using the left navigation. Sections include Event Overview, AI/ML Challenge, Data Analysis, Exoplanets, Planets & Moons, Software Tools, Space Exploration, and Resources."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Welcome to Astrocluter</h2>
          <p className="text-muted-foreground mt-2">Your mission control for NASA Space Apps 2025.</p>
        </section>
      </div>
    </PageWrapper>
  )
}