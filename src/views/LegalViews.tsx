import React from "react";
import { ActiveTab } from "../types";

interface LegalViewsProps {
  type: "privacy" | "terms";
  setActiveTab: (tab: ActiveTab) => void;
}

export const LegalViews: React.FC<LegalViewsProps> = ({
  type,
  setActiveTab,
}) => {
  if (type === "privacy") {
    return (
      <div className="w-full max-w-[800px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-12 animate-fade-in pb-24">
        {/* Header */}
        <header className="border-b border-[#444748]/20 pb-6 flex items-center justify-between">
          <button
            onClick={() => setActiveTab("overview")}
            className="flex items-center gap-2 text-[#c4c7c7] hover:text-[#e5e2e1] font-label-caps text-xs uppercase tracking-widest transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">
              arrow_back
            </span>
            <span>Return to App</span>
          </button>
          <span className="font-label-caps text-[10px] text-[#bacbbc] uppercase tracking-widest">
            Sanctuary Standard
          </span>
        </header>

        <section>
          <p className="font-label-caps text-xs text-[#bacbbc] mb-2 uppercase tracking-widest">
            Legal
          </p>
          <h1 className="font-display-lg text-4xl md:text-5xl text-[#e5e2e1] mb-6 font-light">
            Privacy Policy
          </h1>
          <p className="font-body-lg text-lg text-[#c4c7c7] leading-relaxed font-light">
            At Ethos Nutrition, we consider your biometric data as sacred as
            your wellbeing. This document outlines our commitment to
            safeguarding your information, ensuring that your journey towards
            nourishment remains a private and secure ritual.
          </p>
        </section>

        <article className="space-y-12">
          {/* Data Collection */}
          <section className="border-t border-[#444748]/20 pt-8">
            <div className="flex items-start gap-4 mb-4">
              <span className="material-symbols-outlined text-[#bacbbc] text-2xl">
                database
              </span>
              <h2 className="font-headline-lg text-2xl text-[#e5e2e1]">
                Data Collection
              </h2>
            </div>
            <div className="ml-10 space-y-4 text-[#c4c7c7] font-light">
              <div>
                <h3 className="font-headline-sm text-lg text-[#e5e2e1] mb-1">
                  Account Information
                </h3>
                <p className="font-body-md text-sm leading-relaxed">
                  To create your personal sanctuary, we store basic identifiers
                  such as your name and email address. This allows us to
                  maintain the continuity of your journal across sessions.
                </p>
              </div>
              <div>
                <h3 className="font-headline-sm text-lg text-[#e5e2e1] mb-1">
                  Nutrition Insights
                </h3>
                <p className="font-body-md text-sm leading-relaxed">
                  The essence of our service relies on the dietary logs,
                  biometric data, and mindful reflections you choose to record.
                  This data is strictly utilized to provide you with tailored
                  nutritional guidance and is never sold to third parties.
                </p>
              </div>
            </div>
          </section>

          {/* Usage */}
          <section className="border-t border-[#444748]/20 pt-8">
            <div className="flex items-start gap-4 mb-4">
              <span className="material-symbols-outlined text-[#bacbbc] text-2xl">
                psychiatry
              </span>
              <h2 className="font-headline-lg text-2xl text-[#e5e2e1]">
                Mindful Usage
              </h2>
            </div>
            <div className="ml-10 text-[#c4c7c7] font-light">
              <p className="font-body-md text-sm leading-relaxed">
                We process your information exclusively to elevate your
                experience. This includes generating personalized insights in
                the Atelier, curating meal compositions in Nourish, and tracking
                your long-term vitality trends in Vitals. We believe in minimal
                data extraction—collecting only what is necessary to serve you.
              </p>
            </div>
          </section>

          {/* Security */}
          <section className="border-t border-[#444748]/20 pt-8">
            <div className="flex items-start gap-4 mb-4">
              <span className="material-symbols-outlined text-[#bacbbc] text-2xl">
                shield_lock
              </span>
              <h2 className="font-headline-lg text-2xl text-[#e5e2e1]">
                Sanctuary Security
              </h2>
            </div>
            <div className="ml-10">
              <p className="font-body-md text-sm text-[#c4c7c7] font-light leading-relaxed mb-6">
                Your trust is our foundation. We employ industry-leading
                encryption protocols to ensure that your personal reflections
                and biological data remain undisturbed and inaccessible to
                unauthorized entities.
              </p>
              <div className="bg-[#191818] border border-[#444748]/30 rounded-xl p-5 flex items-center justify-between">
                <div>
                  <p className="font-label-caps text-[10px] text-[#8e9191] uppercase tracking-wider mb-1">
                    Encryption Standard
                  </p>
                  <p className="text-base text-[#e5e2e1] font-medium">
                    AES-256 Client-Side Local Storage
                  </p>
                </div>
                <span className="material-symbols-outlined text-[#bacbbc] text-2xl">
                  verified_user
                </span>
              </div>
            </div>
          </section>

          {/* Autonomy */}
          <section className="border-t border-[#444748]/20 pt-8">
            <div className="flex items-start gap-4 mb-4">
              <span className="material-symbols-outlined text-[#bacbbc] text-2xl">
                tune
              </span>
              <h2 className="font-headline-lg text-2xl text-[#e5e2e1]">
                Your Autonomy
              </h2>
            </div>
            <div className="ml-10 text-[#c4c7c7] font-light">
              <p className="font-body-md text-sm leading-relaxed">
                You retain absolute sovereignty over your data. At any moment
                within your Settings, you may choose to export your journal,
                modify your tracking preferences, or completely erase your
                presence from our servers. We honor your choices without
                friction.
              </p>
            </div>
          </section>
        </article>

        <footer className="mt-8 pt-8 border-t border-[#444748]/20 text-center">
          <p className="font-body-md text-xs text-[#c4c7c7] italic">
            Last updated: October 24, 2024. For inquiries, please contact our
            stewardship team.
          </p>
        </footer>
      </div>
    );
  }

  // Terms of Service
  return (
    <div className="w-full max-w-[800px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-12 animate-fade-in pb-24">
      {/* Header */}
      <header className="border-b border-[#444748]/20 pb-6 flex items-center justify-between">
        <button
          onClick={() => setActiveTab("overview")}
          className="flex items-center gap-2 text-[#c4c7c7] hover:text-[#e5e2e1] font-label-caps text-xs uppercase tracking-widest transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">
            arrow_back
          </span>
          <span>Return to App</span>
        </button>
        <span className="font-label-caps text-[10px] text-[#bacbbc] uppercase tracking-widest">
          Terms & Guidelines
        </span>
      </header>

      <section>
        <h1 className="font-display-lg text-4xl md:text-5xl text-[#e5e2e1] mb-4 font-light">
          Terms of Service
        </h1>
        <p className="font-body-md text-base text-[#c4c7c7] font-light leading-relaxed">
          Last Updated: October 26, 2024. These Terms of Service outline the
          rules and regulations for the use of Ethos Nutrition's digital
          platform.
        </p>
      </section>

      {/* Critical Medical Disclaimer Box */}
      <section className="border border-[#444748]/30 bg-[#191818] p-6 rounded-xl">
        <div className="flex items-start gap-4">
          <span className="material-symbols-outlined text-[#bacbbc] text-2xl shrink-0 mt-0.5">
            health_and_safety
          </span>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-lg text-[#e5e2e1] font-medium">
              Critical Medical Disclaimer
            </h2>
            <p className="text-[13px] text-[#c4c7c7] leading-relaxed">
              Ethos Nutrition is a meal planning and nutrition tracking tool and
              is{" "}
              <strong className="text-[#e5e2e1] font-medium">
                NOT a medical diagnosis or treatment service
              </strong>
              . The content provided is for educational and informational
              purposes only. Always seek the advice of your physician or
              qualified health provider with any questions regarding medical
              conditions or clinical dietetics.
            </p>
          </div>
        </div>
      </section>

      {/* Sections */}
      <div className="space-y-8 text-[#c4c7c7] font-light">
        <section className="border-b border-[#444748]/15 pb-6">
          <h3 className="font-headline-lg text-xl text-[#e5e2e1] mb-2 font-normal">
            Acceptable Use
          </h3>
          <p className="font-body-md text-sm leading-relaxed">
            You agree not to use the platform in any way that violates
            applicable laws or regulations. Ethos Nutrition is intended solely
            for personal, mindful wellness exploration.
          </p>
        </section>

        <section className="border-b border-[#444748]/15 pb-6">
          <h3 className="font-headline-lg text-xl text-[#e5e2e1] mb-2 font-normal">
            Account Responsibilities
          </h3>
          <p className="font-body-md text-sm leading-relaxed">
            You are responsible for maintaining the confidentiality of your
            session and password. Ethos Nutrition provides client-side
            encryption and respects your sovereignty.
          </p>
        </section>

        <section className="pb-4">
          <h3 className="font-headline-lg text-xl text-[#e5e2e1] mb-2 font-normal">
            Intellectual Property
          </h3>
          <p className="font-body-md text-sm leading-relaxed">
            The platform design system, algorithms, visual layouts, and
            trademarked designations are protected by intellectual property
            rights.
          </p>
        </section>
      </div>

      <footer className="pt-6 border-t border-[#444748]/20 flex justify-between items-center text-xs font-label-caps text-[#c4c7c7]">
        <span>© 2026 Ethos Nutrition. All rights reserved.</span>
        <button
          onClick={() => setActiveTab("privacy")}
          className="hover:text-[#e5e2e1] underline"
        >
          View Privacy Policy
        </button>
      </footer>
    </div>
  );
};
