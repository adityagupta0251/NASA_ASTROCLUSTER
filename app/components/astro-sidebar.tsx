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
  LaptopMinimal as LaptopMinimalCheck,
  Users,
  Github,
} from "lucide-react"


export function AstroSidebar() {
  const pathname = usePathname()

  const items = [
    { key: "overview", label: "Event Overview", icon: Satellite, href: "/" },
    { key: "aiml", label: "AI/ML Challenge", icon: BrainCircuit, href: "/aiml" },
    { key: "data", label: "Data Analysis", icon: BarChart3, href: "/data" },
    { key: "exoplanets", label: "Exoplanets", icon: Orbit, href: "/exoplanets" },
    { key: "tools", label: "Software Tools", icon: LaptopMinimalCheck, href: "/tools" },
  ]

  const extras = [
    { key: "team", label: "Team: Astrocluter", icon: Users, href: "https://github.com/AstroCluster" },
    { key: "github", label: "GitHub Project", icon: Github, href: "https://github.com/adityagupta0251/NASA_MLAPP" },
  ]

  return (
    <aside
      className="fixed left-0 top-0 z-40 h-dvh w-16 md:w-64 border-r-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white shadow-xl transition-colors duration-300"
      aria-label="Astrocluter primary navigation"
    >
      <div className="relative h-full overflow-hidden">
        {/* Starfield background */}
        <div className="fixed inset-0 opacity-10 dark:opacity-20 pointer-events-none">
          {[...Array(30)].map((_, i) => {
            return (
              <div
                key={i}
                className="absolute w-1 h-1 bg-black dark:bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }} />
            )
          })}
        </div>

        <div className="relative flex h-full flex-col gap-4 p-3 md:p-4 min-h-0">
          {/* Branding */}
          <div className="flex items-center gap-3 px-1 py-2">
            <div className="grid h-9 w-9 place-items-center rounded-md border-2 border-black dark:border-white bg-gray-100 dark:bg-gray-900">
              <Orbit className="h-5 w-5 animate-spin" style={{ animationDuration: '8s' }} aria-hidden="true" />
              <span className="sr-only">Astrocluter</span>
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold uppercase tracking-widest">Astrocluter</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">NASA Space Apps 2025</div>
            </div>
          </div>

          <hr className="border-gray-300 dark:border-gray-700" />

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
                          "focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors",
                          isActive
                            ? "bg-gray-200 dark:bg-gray-800 border border-black dark:border-white"
                            : "hover:bg-gray-100 dark:hover:bg-gray-900 border border-transparent",
                        ].join(" ")}
                      >
                        {/* active indicator */}
                        <span
                          className={[
                            "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full transition-colors",
                            isActive
                              ? "bg-black dark:bg-white"
                              : "bg-transparent group-hover:bg-gray-400 dark:group-hover:bg-gray-600",
                          ].join(" ")}
                          aria-hidden="true"
                        />
                        <span className="grid h-8 w-8 place-items-center rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 group-hover:border-black dark:group-hover:border-white transition-colors">
                          <Icon
                            className={[
                              "h-4 w-4 transition-colors",
                              isActive
                                ? "text-black dark:text-white"
                                : "text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white",
                            ].join(" ")}
                            aria-hidden="true"
                          />
                        </span>
                        <span className="hidden md:block text-sm font-medium">{label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>

          {/* Extras */}
          <div className="mt-auto pt-2">
            <hr className="border-gray-300 dark:border-gray-700 mb-2" />
            <nav role="navigation" aria-label="Extras">
              <ul className="flex flex-col gap-1">
                {extras.map(({ key, label, icon: Icon, href }) => (
                  <li key={key}>
                    <Link
                      href={href}
                      target={key === "github" ? "_blank" : undefined}
                      rel={key === "github" ? "noreferrer" : undefined}
                      className="group relative flex items-center gap-3 rounded-md px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 group-hover:border-black dark:group-hover:border-white transition-colors">
                        <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" aria-hidden="true" />
                      </span>
                      <span className="hidden md:block text-sm font-medium">{label}</span>
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