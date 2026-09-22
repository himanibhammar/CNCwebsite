"use client";

import { useState } from "react";
import { BRAND } from "@/lib/brand";
import { Button } from "@/components/ui/Button";
import { Mail, MapPin, Share2, Check } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    event: "HACKSUMMIT",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full min-h-screen pt-32 pb-28 px-6 sm:px-10 lg:px-16 bg-[#07090e] text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header Title */}
        <div className="border-b border-white/[0.08] pb-14 mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-blue-400">
              COMMUNICATIONS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="font-mono text-xs tracking-widest text-neutral-400">
              INQUIRIES & PARTNERSHIPS
            </span>
          </div>

          <h1 className="font-sans text-4xl sm:text-6xl lg:text-8xl font-light tracking-tight text-white uppercase leading-[0.98] mb-6">
            CONNECT WITH
            <br />
            THE ORGANIZERS.
          </h1>

          <p className="font-sans text-base sm:text-lg text-neutral-400 font-light max-w-2xl leading-relaxed">
            Direct channels for participant inquiries, institutional delegations, event sponsorships, and technical coordination.
          </p>
        </div>

        {/* Two-Column Minimal Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Official Contact Metadata */}
          <div className="lg:col-span-5 space-y-12">
            {/* Email Channel */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-mono text-xs tracking-widest uppercase">
                <Mail className="w-3.5 h-3.5" />
                <span>OFFICIAL INBOX</span>
              </div>
              <p className="font-mono text-sm sm:text-base text-neutral-200 hover:text-white transition-colors cursor-pointer select-all">
                {BRAND.contact.email}
              </p>
              <p className="font-sans text-xs text-neutral-400 font-light">
                General inquiries, press accreditation, and partnership proposals.
              </p>
            </div>

            {/* Physical Headquarters */}
            <div className="space-y-3 border-t border-white/[0.06] pt-8">
              <div className="flex items-center gap-2 text-blue-400 font-mono text-xs tracking-widest uppercase">
                <MapPin className="w-3.5 h-3.5" />
                <span>COORDINATION OFFICE</span>
              </div>
              <p className="font-mono text-sm sm:text-base text-neutral-200">
                {BRAND.contact.office}
              </p>
              <p className="font-sans text-xs text-neutral-400 font-light">
                Competition control room, paddock staging, and physical hardware check-in.
              </p>
            </div>

            {/* Social Network Links */}
            <div className="space-y-4 border-t border-white/[0.06] pt-8">
              <div className="flex items-center gap-2 text-blue-400 font-mono text-xs tracking-widest uppercase">
                <Share2 className="w-3.5 h-3.5" />
                <span>NETWORK DISPATCH</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {BRAND.contact.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full border border-white/[0.08] hover:border-white/[0.3] bg-white/[0.02] text-xs font-mono tracking-wider text-neutral-300 hover:text-white transition-all"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Clean Editorial Inquiry Form */}
          <div className="lg:col-span-7 bg-[#0b0e17] p-8 sm:p-12 rounded-sm border border-white/[0.08]">
            <h2 className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase mb-8 pb-3 border-b border-white/[0.06]">
              {"// DIRECT INQUIRY DISPATCH"}
            </h2>

            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-sans text-2xl font-light text-white uppercase">
                  DISPATCH TRANSMITTED
                </h3>
                <p className="font-sans text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto font-light">
                  Thank you for reaching out. The Challenges & Championships event committee will respond to your dispatch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-mono text-[11px] tracking-widest text-neutral-400 uppercase mb-2">
                    FULL NAME / DELEGATION LEAD
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.g., Dr. Jane Doe / Team Horizon"
                    className="w-full px-4 py-3 bg-[#07090e] border border-white/10 rounded-sm font-sans text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] tracking-widest text-neutral-400 uppercase mb-2">
                    OFFICIAL EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="delegate@institution.edu"
                    className="w-full px-4 py-3 bg-[#07090e] border border-white/10 rounded-sm font-sans text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] tracking-widest text-neutral-400 uppercase mb-2">
                    EVENT INITIATIVE OF INTEREST
                  </label>
                  <select
                    value={formData.event}
                    onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                    className="w-full px-4 py-3 bg-[#07090e] border border-white/10 rounded-sm font-sans text-sm text-white focus:outline-none focus:border-blue-400 transition-colors"
                  >
                    <option value="HACKSUMMIT">01 / HACKSUMMIT (Hackathon)</option>
                    <option value="TURBODRIFT">02 / TURBODRIFT (RC & Telemetry)</option>
                    <option value="QUADCOPTER">03 / QUADCOPTER (Autonomous Flight)</option>
                    <option value="NASA SPACE APPS CHALLENGE">04 / NASA SPACE APPS CHALLENGE</option>
                    <option value="GENERAL">GENERAL INQUIRY / SPONSORSHIP</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] tracking-widest text-neutral-400 uppercase mb-2">
                    INQUIRY / TRANSMISSION BRIEF
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Specify questions regarding team eligibility, hardware parameters, or rules..."
                    className="w-full px-4 py-3 bg-[#07090e] border border-white/10 rounded-sm font-sans text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <Button variant="solid" size="md">
                    TRANSMIT INQUIRY
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
