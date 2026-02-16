"use client";

import { ArrowLeft, ExternalLink, Coffee } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrefacePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="glow-ambient animate-pulse-slow" />

      <Header />

      {/* Main Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-32">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 animate-fade-up"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Title */}
        <div className="mb-12 animate-fade-up-delay-1">
          <h1 className="text-4xl md:text-5xl font-medium mb-4 tracking-tight text-foreground">
            Preface: The Genesis of Ektha
          </h1>
          <p className="text-muted-foreground text-lg">
            Eternal Knowledge & Truth Archives
          </p>
        </div>

        {/* Content */}
        <article className="prose prose-invert max-w-none animate-fade-up-delay-2">
          <section className="mb-12">
            <h2 className="text-xl font-medium text-foreground mb-4">What is Ektha?</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              <strong>Ektha (एकता)</strong> is a digital sanctuary—an ambitious archive designed to house the timeless wisdom of ancient civilizations within a modern, intuitive architecture. The name "Ektha" represents the <strong>Eternal Knowledge and Truth Archives</strong>, but it also resonates with the Sanskrit concept of <em>Ekata</em> (Oneness). Our mission is to strip away the barriers of time and language to reveal the singular, underlying truth that connects humanity’s greatest philosophical and spiritual heritage.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Managed by sophisticated AI and curated with reverence, Ektha is more than a library; it is a bridge built to help contemporary seekers explore, understand, and integrate ancient insights into modern life.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-medium text-foreground mb-4">Why This Archive?</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The scriptures of the past contain humanity’s most profound blueprints for living. However, much of this "Sanatana Gnan" (Eternal Knowledge) remains locked away—hidden in scattered fragments, obscured by archaic translations, or lost in digital noise.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              As a creator, I have always existed at the intersection of my roots and my passion for technology. I found myself asking: <em>How can we use the tools of the future to preserve the truths of the past?</em> This journey began with a simple dataset based on the Bhagavad Gita. Seeing the profound impact it had on people—how they engaged with it not just as a religious text, but as a practical guide—became my turning point. I realized that the world didn’t just need more information; it needed <strong>access</strong>. My vision evolved from a simple chatbot into a centralized "Eternal Archive" where original texts and AI-driven contextual assistance coexist to illuminate the path for every reader.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Inspired by the structural foundations of pioneers like Yash Bonde (Project Artha), I set out to build Ektha—a space where technology serves as a humble servant to ancient wisdom.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-medium text-foreground mb-4">The Symbol of Ektha: Our Identity</h2>
            <div className="flex justify-center my-8">
              <Image
                src="/logo.png"
                alt="Ektha Symbol"
                width={200}
                height={200}
                className="opacity-90 animate-fade-in drop-shadow-[0_0_50px_rgba(234,88,12,0.9)] dark:drop-shadow-[0_0_35px_rgba(234,88,12,0.8)]"
              />
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">
              The visual identity of <strong>Ektha</strong> is designed to be more than a logo; it is a digital manifestation of our mission to house the "Eternal Knowledge & Truth Archives." It serves as a bridge between the physical history of human thought and the weightless world of digital accessibility.
            </p>

            <h3 className="text-lg font-medium text-foreground mb-3 mt-8">The Sacred Archives (The Icon)</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At the heart of our symbol are three stacked <strong>manuscripts</strong>, representing the vast and layered repository of the world’s most profound wisdom.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
              <li><strong>The Trinity of Knowledge:</strong> The three scrolls signify the multi-dimensional nature of truth—physical, intellectual, and spiritual—organized within a single, unified archive.</li>
              <li><strong>The Inscribed Word:</strong> Each scroll is marked with stylized, ancient-inspired script, signifying that these are living texts filled with the "Sanatana Gnan" (Eternal Knowledge) that Ektha seeks to protect and share.</li>
              <li><strong>The Structural Support:</strong> The ornate frame and base holding the scrolls represent the <strong>modern technology and AI</strong> that provide the necessary foundation for these ancient works to be explored by contemporary readers.</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mb-3 mt-8">The Radiance of Truth (The Aura)</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The symbol is enveloped in a soft, sun-like amber glow, reflecting the "Sūrya" (Sun) philosophy.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
              <li><strong>Illumination:</strong> The radiance symbolizes the light of wisdom that dispels the darkness of ignorance, bringing the reader closer to a state of realization.</li>
              <li><strong>Active Wisdom:</strong> This glow suggests that the archives are not static or forgotten; they are vibrant, breathing, and ready to illuminate the path for any seeker who enters the digital sanctuary.</li>
            </ul>


          </section>

          <section className="mb-12" id="sources">
            <h2 className="text-xl font-medium text-foreground mb-4">The Source: Rescuing Wisdom</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The greatest challenge in building Ektha was the state of the source material. Much of our heritage is trapped in aging, blurred PDFs or physical manuscripts that are digitally "invisible."
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              To build these archives, we have meticulously gathered, cleaned, and structured digital texts from reliable sources. Through careful curation and web-scraping of scattered repositories, we have organized a growing library of texts—many of which are presented here in a searchable, readable format for the very first time. Every verse in the Ektha archive is anchored by proper references to its original source, ensuring that while we modernize the delivery, we never dilute the authority.
            </p>
            {/* Keeping existing links as they are useful */}
            <div className="space-y-4">
              <a
                href="https://www.sacred-texts.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#8B4513] dark:text-orange-400 hover:text-[#A0522D] dark:hover:text-orange-300 transition-colors font-medium border-b border-transparent hover:border-[#A0522D] dark:hover:border-orange-300 w-fit"
              >
                Sacred Texts Archive
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.wisdomlib.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#8B4513] dark:text-orange-400 hover:text-[#A0522D] dark:hover:text-orange-300 transition-colors font-medium border-b border-transparent hover:border-[#A0522D] dark:hover:border-orange-300 w-fit"
              >
                Wisdom Library
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://sanskritdocuments.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#8B4513] dark:text-orange-400 hover:text-[#A0522D] dark:hover:text-orange-300 transition-colors font-medium border-b border-transparent hover:border-[#A0522D] dark:hover:border-orange-300 w-fit"
              >
                Sanskrit Documents
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-medium text-foreground mb-4">About the Creator</h2>
            <div className="flex items-center gap-4 mb-6">
              <Image
                src="/dhruv-pfp.jpg"
                alt="Vikas Acharya"
                width={64}
                height={64}
                className="rounded-full border-2 border-primary/20"
              />
              <p className="text-muted-foreground leading-relaxed">
                Ektha is created and maintained by{" "}
                <a href="https://x.com/VikasAcharyaa" target="_blank" rel="noopener noreferrer" className="link-modern text-primary">@VikasAcharyaa</a> and AIBM chikkamagaluru Team.
              </p>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have suggestions or corrections, feel free to reach out.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              If you find value in this work and wish to support its continued development, your support would be greatly appreciated. Maintaining the project including domain costs and the time invested over many days and nights requires sustained effort. Sponsorships help ensure that Ektha remains accessible and continues to improve for everyone.
            </p>

            {/* Support Button */}
            <div className="flex justify-center mb-12">
              <a
                href="https://buymeacoffee.com/vikasdevopp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-full font-medium transition-transform hover:scale-105"
              >
                <Coffee className="w-5 h-5" />
                <span>Support Project</span>
              </a>
            </div>
          </section>

          <section className="mb-12 pt-12 border-t border-border/40">
            <h2 className="text-xl font-medium text-foreground mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-primary/30"></span>
              Supported by
              <span className="w-8 h-px bg-primary/30"></span>
            </h2>

            <div className="bg-muted/30 rounded-2xl p-8 border border-border/50">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="bg-white p-4 rounded-xl mb-6 shadow-sm">
                  <Image
                    src="/aibm.png"
                    alt="AIBM College Logo"
                    width={500}
                    height={150}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Adichunchanagiri Institute of Business Management (AIBM)
                </h3>
                <p className="text-sm text-primary font-medium tracking-wide uppercase mb-4">
                  Chikkamagaluru, Karnataka
                </p>
              </div>

              <div className="space-y-4 max-w-2xl mx-auto">
                <p className="text-muted-foreground leading-relaxed text-center italic">
                  "The mission of AIBM is to provide research-oriented, high-quality education in business management and to contribute to solving real-world challenges through excellence in teaching, research, and service."
                </p>

                <div className="flex justify-center pt-4">
                  <a
                    href="https://aibmckm.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#8B4513] dark:text-orange-400 hover:text-[#A0522D] dark:hover:text-orange-300 transition-colors font-medium border-b border-transparent hover:border-[#A0522D] dark:hover:border-orange-300"
                  >
                    Visit Official Website
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </article>

        <Footer />
      </main>
    </div>
  );
}

