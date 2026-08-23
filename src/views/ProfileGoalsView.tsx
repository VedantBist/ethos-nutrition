import React, { useState } from 'react';
import { UserProfile, ActiveTab } from '../types';

interface ProfileGoalsViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const ProfileGoalsView: React.FC<ProfileGoalsViewProps> = ({
  userProfile,
  onUpdateProfile,
  setActiveTab
}) => {
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [saveStatus, setSaveStatus] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profile);
    setSaveStatus(true);
    setTimeout(() => {
      setSaveStatus(false);
    }, 2500);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-12 animate-fade-in pb-32">
      {/* Header */}
      <header className="border-b border-[#444748]/20 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="font-label-caps text-xs text-[#bacbbc] uppercase tracking-widest block mb-2">
            Foundation Setup
          </span>
          <h2 className="font-display-lg text-3xl md:text-5xl text-[#e5e2e1] mb-2 font-light">
            Profile & Goals
          </h2>
          <p className="font-body-md text-[#c4c7c7] max-w-2xl font-light">
            Configure your personal details and fine-tune your daily nutritional targets.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('overview')}
          className="text-[#c4c7c7] hover:text-[#e5e2e1] font-label-caps text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">dashboard</span>
          <span>Back to Overview</span>
        </button>
      </header>

      <form onSubmit={handleSubmit} className="space-y-16">
        {/* Profile Identity Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <h3 className="text-xl text-[#e5e2e1] mb-1 font-medium">Identity</h3>
            <p className="text-[13px] text-[#8e9191] leading-relaxed">
              Your core biological parameters guiding your personalized intake calculations.
            </p>
          </div>

          <div className="md:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-1.5">
                <label className="font-label-caps text-[11px] text-[#8e9191] tracking-wider uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="bg-[#191818] border border-[#444748]/40 rounded-lg px-3.5 py-2.5 text-[14px] text-[#e5e2e1] focus:border-[#bacbbc] focus:outline-none"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-label-caps text-[11px] text-[#8e9191] tracking-wider uppercase">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="bg-[#191818] border border-[#444748]/40 rounded-lg px-3.5 py-2.5 text-[14px] text-[#e5e2e1] focus:border-[#bacbbc] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="font-label-caps text-[11px] text-[#8e9191] tracking-wider uppercase">
                  Age
                </label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                  className="bg-[#191818] border border-[#444748]/40 rounded-lg px-3.5 py-2.5 text-[14px] text-[#e5e2e1] focus:border-[#bacbbc] focus:outline-none"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-label-caps text-[11px] text-[#8e9191] tracking-wider uppercase">
                  Gender
                </label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="bg-[#191818] border border-[#444748]/40 rounded-lg px-3.5 py-2.5 text-[14px] text-[#e5e2e1] focus:border-[#bacbbc] focus:outline-none cursor-pointer"
                >
                  <option value="Female" className="bg-[#191818]">Female</option>
                  <option value="Male" className="bg-[#191818]">Male</option>
                  <option value="Non-binary" className="bg-[#191818]">Non-binary</option>
                  <option value="Prefer not to say" className="bg-[#191818]">Prefer not to say</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-label-caps text-[11px] text-[#8e9191] tracking-wider uppercase">
                  Height
                </label>
                <input
                  type="text"
                  value={profile.height}
                  onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                  className="bg-[#191818] border border-[#444748]/40 rounded-lg px-3.5 py-2.5 text-[14px] text-[#e5e2e1] focus:border-[#bacbbc] focus:outline-none"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="font-label-caps text-[11px] text-[#8e9191] tracking-wider uppercase">
                  Weight
                </label>
                <input
                  type="text"
                  value={profile.weight}
                  onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                  className="bg-[#191818] border border-[#444748]/40 rounded-lg px-3.5 py-2.5 text-[14px] text-[#e5e2e1] focus:border-[#bacbbc] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="font-label-caps text-[11px] text-[#8e9191] tracking-wider uppercase">
                Activity Level
              </label>
              <select
                value={profile.activityLevel}
                onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value })}
                className="bg-[#191818] border border-[#444748]/40 rounded-lg px-3.5 py-2.5 text-[14px] text-[#e5e2e1] focus:border-[#bacbbc] focus:outline-none w-full md:w-2/3 cursor-pointer"
              >
                <option value="Sedentary (desk work)" className="bg-[#191818]">Sedentary (desk work)</option>
                <option value="Lightly Active (1-3 days/week)" className="bg-[#191818]">Lightly Active (1-3 days/week)</option>
                <option value="Moderately Active (3-5 days/week)" className="bg-[#191818]">Moderately Active (3-5 days/week)</option>
                <option value="Highly Active (6-7 days/week)" className="bg-[#191818]">Highly Active (6-7 days/week)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Nutrition Goals Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-[#444748]/20 pt-10">
          <div className="md:col-span-4">
            <h3 className="text-xl text-[#e5e2e1] mb-1 font-medium">Nutritional Targets</h3>
            <p className="text-[13px] text-[#8e9191] leading-relaxed">
              Your daily macro goals. Modulating these dynamically recalibrates your dashboard and history metrics.
            </p>
          </div>

          <div className="md:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col space-y-2 bg-[#191818] p-4 rounded-xl border border-[#444748]/30">
                <label className="font-label-caps text-[10px] text-[#8e9191] tracking-wider uppercase">
                  Energy Target
                </label>
                <div className="flex items-baseline space-x-1.5">
                  <input
                    type="number"
                    value={profile.targetKcal}
                    onChange={(e) => setProfile({ ...profile, targetKcal: parseInt(e.target.value) || 0 })}
                    className="bg-transparent border-none font-data-highlight text-2xl text-[#e5e2e1] w-20 p-0 focus:ring-0"
                  />
                  <span className="text-[11px] text-[#8e9191] uppercase">kcal</span>
                </div>
              </div>

              <div className="flex flex-col space-y-2 bg-[#191818] p-4 rounded-xl border border-[#444748]/30">
                <label className="font-label-caps text-[10px] text-[#8e9191] tracking-wider uppercase">
                  Protein
                </label>
                <div className="flex items-baseline space-x-1.5">
                  <input
                    type="number"
                    value={profile.targetProtein}
                    onChange={(e) => setProfile({ ...profile, targetProtein: parseInt(e.target.value) || 0 })}
                    className="bg-transparent border-none font-data-highlight text-2xl text-[#e5e2e1] w-16 p-0 focus:ring-0"
                  />
                  <span className="text-[11px] text-[#8e9191] uppercase">g</span>
                </div>
              </div>

              <div className="flex flex-col space-y-2 bg-[#191818] p-4 rounded-xl border border-[#444748]/30">
                <label className="font-label-caps text-[10px] text-[#8e9191] tracking-wider uppercase">
                  Carbs
                </label>
                <div className="flex items-baseline space-x-1.5">
                  <input
                    type="number"
                    value={profile.targetCarbs}
                    onChange={(e) => setProfile({ ...profile, targetCarbs: parseInt(e.target.value) || 0 })}
                    className="bg-transparent border-none font-data-highlight text-2xl text-[#e5e2e1] w-16 p-0 focus:ring-0"
                  />
                  <span className="text-[11px] text-[#8e9191] uppercase">g</span>
                </div>
              </div>

              <div className="flex flex-col space-y-2 bg-[#191818] p-4 rounded-xl border border-[#444748]/30">
                <label className="font-label-caps text-[10px] text-[#8e9191] tracking-wider uppercase">
                  Fats
                </label>
                <div className="flex items-baseline space-x-1.5">
                  <input
                    type="number"
                    value={profile.targetFat}
                    onChange={(e) => setProfile({ ...profile, targetFat: parseInt(e.target.value) || 0 })}
                    className="bg-transparent border-none font-data-highlight text-2xl text-[#e5e2e1] w-16 p-0 focus:ring-0"
                  />
                  <span className="text-[11px] text-[#8e9191] uppercase">g</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences & System Settings */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-[#444748]/20 pt-12">
          <div className="md:col-span-4">
            <h3 className="font-headline-sm text-2xl text-[#e5e2e1] mb-2">Preferences</h3>
            <p className="font-body-md text-sm text-[#c4c7c7] font-light">
              System environment, measurement standards, and subtle reminders.
            </p>
          </div>

          <div className="md:col-span-8 space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-[#444748]/15">
              <div className="flex flex-col">
                <span className="font-body-md text-base text-[#e5e2e1]">Notifications & Insights</span>
                <span className="font-body-md text-xs text-[#c4c7c7] font-light">
                  Daily summaries and gentle nourishment guidance
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.notifications}
                  onChange={(e) => setProfile({ ...profile, notifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#201f1f] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#c8c6c5] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#bacbbc]" />
              </label>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-[#444748]/15">
              <div className="flex flex-col">
                <span className="font-body-md text-base text-[#e5e2e1]">Measurement Standard</span>
                <span className="font-body-md text-xs text-[#c4c7c7] font-light">
                  {profile.units === 'Metric' ? 'Metric (kg, cm, grams)' : 'Imperial (lbs, ft, oz)'}
                </span>
              </div>

              <select
                value={profile.units}
                onChange={(e) => setProfile({ ...profile, units: e.target.value as any })}
                className="input-ethos font-body-md text-sm text-[#e5e2e1] w-32 cursor-pointer"
              >
                <option value="Metric" className="bg-[#1c1b1b]">Metric</option>
                <option value="Imperial" className="bg-[#1c1b1b]">Imperial</option>
              </select>
            </div>
          </div>
        </section>

        {/* Save Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-[#141313]/95 backdrop-blur-xl border-t border-[#444748]/20 py-4 px-6 md:px-12 flex justify-end items-center z-40">
          <div className="flex items-center gap-4">
            {saveStatus && (
              <span className="font-body-md text-sm text-[#bacbbc] animate-fade-in flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Profile targets saved successfully.</span>
              </span>
            )}
            <button
              type="submit"
              className="bg-[#9E8E77] hover:bg-[#b0a08b] text-[#141313] font-label-caps text-xs tracking-widest px-8 py-3.5 rounded-full transition-all duration-300 shadow-md font-semibold"
            >
              SAVE CHANGES
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
