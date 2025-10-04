"use client";
import React, { useState } from 'react';
import { Orbit, Telescope, Sparkles, Target, Waves, Eye, BookOpen, TrendingUp } from 'lucide-react';

export default function ExoplanetsPage() {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const toggleCard = (id: number) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const curiosities = [
    {
      id: 1,
      icon: Sparkles,
      title: "The Diamond Planet",
      front: "55 Cancri e is believed to be covered in diamonds",
      back: "This super-Earth is twice the size of Earth and may have a surface made of graphite and diamond. Its estimated worth? $26.9 nonillion - that's 26 followed by 30 zeros!"
    },
    {
      id: 2,
      icon: Waves,
      title: "Water Worlds",
      front: "Some exoplanets are entirely covered in oceans",
      back: "GJ 1214 b is thought to be a water world with oceans hundreds of kilometers deep, far deeper than Earth's. The immense pressure could create exotic forms of ice even at high temperatures."
    },
    {
      id: 3,
      icon: Target,
      title: "TRAPPIST-1 System",
      front: "7 Earth-sized planets orbit a single star",
      back: "Located 40 light-years away, this system has 7 rocky planets, 3 in the habitable zone. If you stood on one planet, the others would appear larger than our Moon in the sky!"
    },
    {
      id: 4,
      icon: Telescope,
      title: "Hot Jupiters",
      front: "Gas giants orbit closer than Mercury to their stars",
      back: "These massive planets complete orbits in just days, with surface temperatures exceeding 2,000°C. Some have winds reaching 2,000 mph and titanium oxide in their atmospheres."
    },
    {
      id: 5,
      icon: Orbit,
      title: "Rogue Planets",
      front: "Some planets drift alone through space",
      back: "These nomadic worlds were ejected from their solar systems and wander the galaxy untethered to any star. There may be billions of them, outnumbering stars in our galaxy."
    },
    {
      id: 6,
      icon: Eye,
      title: "The Fastest Planet",
      front: "K2-137 b completes an orbit in just 4.3 hours",
      back: "This ultra-short period planet is about 1.5 times Earth's size and orbits so close to its star that a year lasts less than a workday. Surface temperatures exceed 2,000°C."
    }
  ];

  const discoveryMethods = [
    {
      method: "Transit Method",
      count: "~75%",
      description: "Detecting dips in starlight as planets pass in front of their stars"
    },
    {
      method: "Radial Velocity",
      count: "~20%",
      description: "Measuring star wobbles caused by gravitational tugs from orbiting planets"
    },
    {
      method: "Direct Imaging",
      count: "~2%",
      description: "Capturing actual images of planets by blocking out starlight"
    },
    {
      method: "Microlensing",
      count: "~3%",
      description: "Using gravity to magnify light from background stars"
    }
  ];

  const stats = [
    { label: "Confirmed Exoplanets", value: "6,000+", icon: TrendingUp },
    { label: "Planetary Systems", value: "4,500+", icon: Orbit },
    { label: "Multiple-Planet Systems", value: "900+", icon: Target },
    { label: "Light-Years (Nearest)", value: "4.24", icon: Telescope }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Starfield Effect */}
      <div className="fixed inset-0 opacity-20 dark:opacity-30 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-black dark:bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <Orbit className="w-10 h-10 md:w-12 md:h-12 animate-spin" style={{ animationDuration: '8s' }} />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Exoplanets
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Worlds Beyond Our Solar System: Exploring the diverse and fascinating planets orbiting distant stars
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl p-4 md:p-6 hover:border-black dark:hover:border-white transition-all duration-300"
              >
                <Icon className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-3" />
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Main Content Section */}
        <div className="mb-12 md:mb-16 bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center gap-3">
            <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
            What Are Exoplanets?
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
            <p>
              An exoplanet is any planet beyond our solar system. Most orbit other stars, but some free-floating exoplanets, 
              called rogue planets, drift through the galaxy untethered to any star. We&#39;ve confirmed more than 6,000 exoplanets 
              out of the billions we believe exist.
            </p>
            <p>
              Most discovered exoplanets are in a relatively small region of our galaxy, the Milky Way. Even the closest known 
              exoplanet, Proxima Centauri b, is still about 4 light-years away. Scientists now know there are more planets than 
              stars in the galaxy.
            </p>
            <p>
              By measuring exoplanets&#39; sizes and masses, we can determine compositions ranging from rocky (like Earth) to gas-rich 
              (like Jupiter). We&#39;ve identified lava worlds covered in molten seas, puffy planets with the density of Styrofoam, 
              and super-Earths that might harbor conditions suitable for life.
            </p>
          </div>
        </div>

        {/* Curiosities Cards */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">
            Fascinating Exoplanet Discoveries
            <span className="block text-xs md:text-sm text-gray-600 dark:text-gray-400 font-normal mt-2">Click cards to explore more</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {curiosities.map((card) => {
              const Icon = card.icon;
              const isFlipped = flippedCards[card.id];
              
              return (
                <div
                  key={card.id}
                  className="h-56 md:h-64 cursor-pointer perspective-1000"
                  onClick={() => toggleCard(card.id)}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                  >
                    {/* Front */}
                    <div
                      className="absolute inset-0 bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl p-4 md:p-6 flex flex-col items-center justify-center text-center backface-hidden hover:border-black dark:hover:border-white transition-colors"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <Icon className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4" />
                      <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{card.title}</h3>
                      <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">{card.front}</p>
                      <div className="mt-3 md:mt-4 text-xs text-gray-600 dark:text-gray-400">Click to learn more</div>
                    </div>

                    {/* Back */}
                    <div
                      className="absolute inset-0 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white rounded-xl p-4 md:p-6 flex flex-col justify-center backface-hidden"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      <h3 className="text-base md:text-lg font-bold mb-2 md:mb-3">{card.title}</h3>
                      <p className="text-xs md:text-sm leading-relaxed">{card.back}</p>
                      <div className="mt-3 md:mt-4 text-xs opacity-70">Click to flip back</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Discovery Methods */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">How We Discover Exoplanets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {discoveryMethods.map((method, idx) => (
              <div
                key={idx}
                className="bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl p-4 md:p-6 hover:border-black dark:hover:border-white transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <h3 className="text-lg md:text-xl font-bold">{method.method}</h3>
                  <span className="text-xl md:text-2xl font-bold">{method.count}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">{method.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Missions */}
        <div className="bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center gap-3">
            <Telescope className="w-6 h-6 md:w-8 md:h-8" />
            Key Exoplanet Missions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="space-y-2 p-4 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg">
              <h3 className="text-base md:text-lg font-bold">Kepler (2009-2018)</h3>
              <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Discovered over 2,600 exoplanets by monitoring 150,000 stars for transit events.</p>
            </div>
            <div className="space-y-2 p-4 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg">
              <h3 className="text-base md:text-lg font-bold">TESS (2018-Present)</h3>
              <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Surveying 200,000 nearby stars to find transiting exoplanets around bright stars.</p>
            </div>
            <div className="space-y-2 p-4 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg">
              <h3 className="text-base md:text-lg font-bold">James Webb (2021-Present)</h3>
              <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Analyzing exoplanet atmospheres using advanced spectroscopy to search for biosignatures.</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 md:mt-12 text-center text-gray-500 dark:text-gray-600 text-xs md:text-sm">
          <p>Data source: NASA Exoplanet Archive | Updated October 2025</p>
        </div>
      </div>
    </div>
  );
}