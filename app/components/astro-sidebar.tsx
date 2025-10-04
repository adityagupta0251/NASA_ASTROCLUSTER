/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  Satellite,
  BrainCircuit,
  BarChart3,
  Orbit,
  Plane as Planet,
  LaptopMinimal as LaptopMinimalCheck,
  Rocket,
  BookOpen,
  Settings,
  Users,
  Github,
} from "lucide-react"
import { ParticleField } from "./particle-field"

export function AstroSidebar() {
  const pathname = usePathname()

  const items = [
    { key: "overview", label: "Event Overview", icon: Satellite, href: "/" },
    { key: "aiml", label: "AI/ML Challenge", icon: BrainCircuit, href: "/aiml" },
    { key: "data", label: "Data Analysis", icon: BarChart3, href: "/data" },
    { key: "exoplanets", label: "Exoplanets", icon: Orbit, href: "/exoplanets" },
    { key: "planets", label: "Planets & Moons", icon: Planet, href: "/planets" },
    { key: "tools", label: "Software Tools", icon: LaptopMinimalCheck, href: "/tools" },
    { key: "explore", label: "Space Exploration", icon: Rocket, href: "/explore" },
    { key: "resources", label: "Resources", icon: BookOpen, href: "/resources" },
  ]

  const extras = [
    { key: "settings", label: "Settings", icon: Settings, href: "/settings" },
    { key: "team", label: "Team: Astrocluter", icon: Users, href: "/team" },
    { key: "github", label: "GitHub Project", icon: Github, href: "https://github.com/" },
  ]

  return (
    <aside
      className="fixed left-0 top-0 z-40 h-dvh w-16 md:w-64 border-r border-border bg-(--color-sidebar) text-(--color-sidebar-foreground) shadow-xl"
      aria-label="Astrocluter primary navigation"
    >
      <div className="relative h-full overflow-hidden">
        {/* starfield background */}
        <ParticleField />

        {/* inner gradient sheen to enhance depth */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-accent/10"
          aria-hidden="true"
        />

        <div className="relative flex h-full flex-col gap-4 p-3 md:p-4 min-h-0">
          {/* Branding */}
          <div className="flex items-center gap-3 px-1 py-2">
            <div className="grid h-9 w-9 place-items-center rounded-md ring-1 ring-primary/40 bg-black/20 backdrop-blur">
              {/* simple emblem: orbit ring */}
              <Orbit className="h-5 w-5 text-primary drop-shadow-[0_0_8px_var(--color-primary)]" aria-hidden="true" />
              <span className="sr-only">Astrocluter</span>
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold uppercase tracking-widest text-primary">Astrocluter</div>
              <div className="text-xs text-muted-foreground">NASA Space Apps 2025</div>
            </div>
          </div>

          <hr className="border-border/50" />

          {/* Main nav */}
          <div className="flex-1 overflow-y-auto pr-1">
            <nav role="navigation" aria-label="Main">
              <ul className="flex flex-col gap-1">
                {items.map(({ key, label, icon: Icon, href }) => {
                  const isActive = pathname === href
                  return (
                    <li key={key}>
                      <Link
                        href={href}
                        aria-current={isActive ? "page" : undefined}
                        className={[
                          "group relative flex items-center gap-3 rounded-md px-2 py-2",
                          "focus:outline-none focus:ring-2 focus:ring-primary/40",
                          isActive
                            ? "bg-white/5 text-foreground shadow-[0_0_12px] shadow-primary/20"
                            : "hover:bg-white/5 text-foreground/80 hover:text-foreground",
                        ].join(" ")}
                      >
                        {/* active neon rail */}
                        <span
                          className={[
                            "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full",
                            isActive
                              ? "bg-primary shadow-[0_0_10px] shadow-primary/60"
                              : "bg-transparent group-hover:bg-accent/60",
                          ].join(" ")}
                          aria-hidden="true"
                        />
                        <span className="grid h-8 w-8 place-items-center rounded-md ring-1 ring-white/10 bg-black/20 group-hover:ring-accent/40 transition">
                          <Icon
                            className={[
                              "h-4 w-4",
                              isActive
                                ? "text-primary drop-shadow-[0_0_8px_var(--color-primary)]"
                                : "text-foreground/80 group-hover:text-accent",
                            ].join(" ")}
                            aria-hidden="true"
                          />
                        </span>
                        <span className="hidden md:block text-sm">{label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>

          {/* Extras */}
          <div className="mt-auto pt-2">
            <hr className="border-border/50 mb-2" />
            <nav role="navigation" aria-label="Extras">
              <ul className="flex flex-col gap-1">
                {extras.map(({ key, label, icon: Icon, href }) => (
                  <li key={key}>
                    <Link
                      href={href}
                      target={key === "github" ? "_blank" : undefined}
                      rel={key === "github" ? "noreferrer" : undefined}
                      className="group relative flex items-center gap-3 rounded-md px-2 py-2 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-md ring-1 ring-white/10 bg-black/20 group-hover:ring-accent/40 transition">
                        <Icon className="h-4 w-4 text-foreground/80 group-hover:text-accent" aria-hidden="true" />
                      </span>
                      <span className="hidden md:block text-sm">{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </aside>
  )
}