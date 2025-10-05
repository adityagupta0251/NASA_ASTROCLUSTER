"use client";

import { useState } from "react";
import { PageWrapper } from "../app/components/page-wrapper";
import { Github, Rocket, Target, Users, Award, ExternalLink } from "lucide-react";

export default function AboutPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const teamMembers = [
    {
      name: "S.B. Pruthvi",
      role: "Team Owner",
      username: "@sbpruthvi",
      location: "India",
      github: null,
    },
    {
      name: "Aditya Kumar Gupta",
      role: "Developer",
      username: "@adik.dev01",
      location: "India",
      github: "adityagupta0251",
    },
    {
      name: "Tawhid Bin Omar",
      role: "Team Member",
      username: "@tawhid",
      location: "Bangladesh",
      github: null,
    },
  ];

  return (
    <PageWrapper
      title="About AstroCluster"
      description="Meet our team tackling the 2025 NASA Space Apps Challenge: Hunting for Exoplanets with AI"
    >
      {/* Theme Toggle */}
      <div className="flex justify-end mb-6">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="space-y-12">
        {/* Hero Badge */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              2025 NASA Space Apps Challenge
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            AstroCluster
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Hunting for exoplanets using artificial intelligence and machine learning to automate the discovery of worlds beyond our solar system.
          </p>
        </div>

        {/* Challenge Section */}
        <section className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Our Challenge</h3>
              <p className="text-sm text-muted-foreground">
                A World Away: Hunting for Exoplanets with AI
              </p>
            </div>
          </div>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Data from space-based exoplanet surveying missions like Kepler, K2, and TESS have enabled the discovery of thousands of new planets outside our solar system. However, most of these exoplanets were identified manually by astrophysicists.
            </p>
            <p>
              Our mission is to create an AI/ML model trained on NASA&#39;s open-source exoplanet datasets that can automatically analyze new data to accurately identify exoplanets, complete with a web interface for researchers and enthusiasts.
            </p>
          </div>
        </section>

        {/* Objectives Section */}
        <section>
          <h3 className="text-2xl font-bold text-center mb-6">What We&lsquo;re Building</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Rocket className="h-6 w-6" />,
                title: "AI/ML Model",
                description: "Training models on Kepler, K2, and TESS datasets to identify exoplanets with high accuracy",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "User Interface",
                description: "Interactive web interface for researchers and novices to upload and analyze exoplanet data",
              },
              {
                icon: <Award className="h-6 w-6" />,
                title: "Real-time Analysis",
                description: "Live predictions with model statistics, confidence scores, and data visualizations",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border bg-card p-6 hover:bg-accent/5 transition-colors"
              >
                <div className="p-3 rounded-lg bg-primary/10 inline-block mb-4">
                  <div className="text-primary">{item.icon}</div>
                </div>
                <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Meet Our Team</h3>
            <p className="text-muted-foreground">
              Passionate individuals collaborating to advance exoplanet discovery
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border bg-card p-6 hover:bg-accent/5 transition-colors"
              >
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary mb-3">
                    {member.name.charAt(0)}
                  </div>
                  <h4 className="text-lg font-bold">{member.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {member.role}
                  </p>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{member.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍 {member.location}</span>
                  </div>
                  {member.github && (
                    <a
                      href={`https://github.com/${member.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Github className="h-4 w-4" />
                      {member.github}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Approach */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-xl font-bold mb-6">Our Technical Approach</h3>
          <div className="space-y-4">
            {[
              {
                title: "Data Processing",
                description: "Utilizing NASA's comprehensive datasets including orbital period, transit duration, planetary radius, and more from Kepler, K2, and TESS missions",
              },
              {
                title: "Model Training",
                description: "Implementing ensemble-based machine learning algorithms including Random Forest, XGBoost, and Logistic Regression for high-accuracy classification",
              },
              {
                title: "Real-time Interface",
                description: "Building an interactive web platform for CSV uploads, instant predictions, model statistics, and comprehensive data visualizations",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{idx + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border">
          <p className="text-muted-foreground">
            © 2025 AstroCluster | NASA Space Apps Challenge 2025
          </p>
          
        </footer>
      </div>
    </PageWrapper>
  );
}