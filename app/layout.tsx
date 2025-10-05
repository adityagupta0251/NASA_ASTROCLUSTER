// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import './globals.css'
import { AstroSidebar } from "../app/components/astro-sidebar"
import SplashScreen from "../app/components/SplashScreen"

export const metadata: Metadata = {
  // Basic Metadata
  title: {
    default: "Astrocluter : A World Away : Hunting for Exoplanets with AI",
    template: "%s | Astrocluter"
  },
  description: "A Web Interface for AI, Data Analysis, and Space Exploration Modules for NASA Space Apps 2025. Discover exoplanets using cutting-edge artificial intelligence and machine learning.",
  generator: "Team Astrocluter",
  applicationName: "Astrocluter",
  keywords: [
    "exoplanets",
    "AI",
    "artificial intelligence",
    "NASA",
    "space exploration",
    "data analysis",
    "machine learning",
    "astronomy",
    "space apps",
    "exoplanet detection",
    "NASA Space Apps 2025"
  ],
  authors: [
    { name: "Team Astrocluter" }
  ],
  creator: "Team Astrocluter",
  publisher: "Team Astrocluter",
  
  // Alternate Languages (add as needed)
  alternates: {
    canonical: "https://ai.astrocluter.space"
  },

  // Open Graph Metadata
  openGraph: {
    title: "Astrocluter : A World Away : Hunting for Exoplanets with AI",
    description: "A Web Interface for AI, Data Analysis, and Space Exploration Modules for NASA Space Apps 2025. Discover exoplanets using cutting-edge artificial intelligence and machine learning.",
    url: "https://ai.astrocluter.space",
    siteName: "Astrocluter",
    images: [
      {
        url: "https://drive.google.com/file/d/1fpyAE32T9ASpQh-ECFzEjeQm7MwDRzfX/view?usp=drive_link",
        width: 800,
        height: 600,
        alt: "Astrocluter",
      },
    ],
    locale: "en-US",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* Splash Screen - Shows on initial load */}
        <SplashScreen />
        
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex min-h-dvh">
            <AstroSidebar />
            <main className="flex-1 pl-16 md:pl-64">{children}</main>
          </div>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}

/* 
SETUP INSTRUCTIONS:
1. Create the file: components/SplashScreen.tsx (use the component code provided)
2. Create the file: components/SplashScreen.css (use the CSS styles provided)
3. The splash screen is now integrated and will show on initial page load
4. It will automatically fade out after 3.5 seconds

The splash screen sits above everything with z-index: 9999, so it won't interfere 
with your sidebar or main content. Once it fades out, users will see your app normally.

OPTIONAL CUSTOMIZATIONS:
- To show splash only on first visit: Use localStorage to track if user has visited
- To change duration: Edit setTimeout value in SplashScreen.tsx
- To match your brand colors: Edit the gradient colors in SplashScreen.css
- To add your logo: Replace the planet animation with an Image component
*/