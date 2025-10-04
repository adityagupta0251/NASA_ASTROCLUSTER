"use client"

import type React from "react"

interface PageWrapperProps {
  title: string
  description: string
  children: React.ReactNode
}

export function PageWrapper({ title, description, children }: PageWrapperProps) {
  return (
    <main className="p-6 md:p-10">
      <section className="mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-balance">{title}</h1>
        <p className="text-muted-foreground mt-2 max-w-prose">{description}</p>
      </section>
      {children}
    </main>
  )
}