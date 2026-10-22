import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  Mail, 
  Send, 
  ChevronDown, 
  CheckCircle, 
  AlertTriangle, 
  Cpu, 
  Zap, 
  Award,
  Globe
} from 'lucide-react';

export const AboutFAQPage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Vehicle Owner',
    message: '',
  });

  const faqs = [
    {
      q: 'Can a portable 48V battery module directly power or charge an electric 4-wheeler?',
      a: 'No. Electric passenger cars (such as the Tata Nexon EV, MG ZS EV, and Tesla) run on high-voltage traction buses between 300V and 800V DC. Plugging a 48V module directly into a 400V car is technically unfeasible and hazardous. For 4-wheelers, VoltShare stations dispatch or reserve the "VoltRescue DC Mobile Unit"—a high-voltage 16kWh–25kWh DC booster with a CCS2 coupler that conducts an ISO 15118 handshake and delivers emergency energy at 45 kW.',
    },
    {
      q: 'How does the network guarantee electrical safety and prevent short circuits during swaps?',
      a: 'All VoltPack modules feature IP67-rated, touch-safe recessed terminal connectors with galvanic isolation. Modules do not energize their power pins until an encrypted CAN-bus digital handshake verifies that the host vehicle polarity, contactor readiness, and ground insulation resistance are within strict tolerances.',
    },
    {
      q: 'What happens if a battery pack is damaged or degraded before I receive it?',
      a: 'Every station bay runs an automated impedance and State of Health (SoH) diagnostics sweep before releasing a pack. Only modules testing above 95% SoH with balanced cell voltages and optimal core temperatures (18°C–32°C) are unlocked for customer pickup. Degraded packs are automatically quarantined by the BMS.',
    },
    {
      q: 'Can I return my borrowed battery to a different station than where I picked it up?',
      a: 'Yes! The network is built on the universal "LPG cylinder exchange" model. You may borrow a module in Downtown and return it to any participating hub across the city. Automated dropoff bays verify return telemetry and immediately release your held security deposit.',
    },
    {
      q: 'Is it safe to swap batteries during heavy rain or monsoon conditions?',
      a: 'Yes. Swappable modules utilize sealed IP67/IP69K enclosures with water-shedding connector shrouds. Stations feature covered canopy bays, and zero-spark optical interlocks prevent moisture-induced arc faults.',
    },
    {
      q: 'How does the pricing and security deposit refund work?',
      a: 'When reserving a module, a nominal energy fee is charged based on the kWh requested (approx. ₹14–₹18 / kWh), alongside a refundable security deposit. When you dock the module into any return bay, automated diagnostics confirm cell integrity and your deposit is immediately refunded.',
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setContactSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      
      {/* 1. PROJECT MISSION & PROBLEM STATEMENT */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          PROJECT MISSION & ENGINEERING SPECIFICATION
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Pioneering Resilient, Decentralized <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Emergency Electromobility
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-300 text-sm leading-relaxed">
          <p>
            The global transition to electric vehicles faces a critical vulnerability: unexpected mid-journey battery depletion. Unlike conventional internal combustion vehicles where a stranded driver can carry a small fuel can, EV drivers face high towing costs, hours-long waits for roadside trucks, or unusable stranded time at occupied chargers.
          </p>
          <p>
            <strong>VoltShare</strong> solves this through a smart, distributed battery-sharing grid. Inspired by the universal convenience of replacing an empty domestic LPG cylinder with a filled one, we provide modular, compatibility-validated swappable battery packs for 2-wheelers and 3-wheelers, coupled with mobile DC rapid-boosters for high-voltage 4-wheelers.
          </p>
        </div>
      </div>

      {/* 2. TECHNICAL ARCHITECTURE STANDARDS */}
      <div className="p-8 rounded-3xl glass-panel border border-cyan-500/30 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
          <Award className="w-6 h-6 text-cyan-400" />
          <span>Automotive Safety & Battery Compliance Standards</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-space-950/80 border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">ISO 26262 ASIL-C</span>
            <h3 className="text-base font-bold text-white">Functional Safety</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fail-safe digital interlocks, redundant contactor monitoring, and automated high-voltage isolation in under 10 milliseconds.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-space-950/80 border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">UN 38.3 & AIS-156</span>
            <h3 className="text-base font-bold text-white">Thermal & Crash Integrity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rigorous drop-shock testing, altitude simulation, vibration resistance, and multi-cell thermal runaway propagation barriers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-space-950/80 border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-indigo-400 font-bold uppercase">IP67 & IP69K</span>
            <h3 className="text-base font-bold text-white">Enclosure Protection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete dust ingress protection and continuous water submersion resistance up to 1 meter depth for all-weather urban reliability.
            </p>
          </div>
        </div>
      </div>

      {/* 3. FREQUENTLY ASKED QUESTIONS */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            Technical Inquiries
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm">
            Everything you need to know about battery compatibility, safety protocols, and return operations.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-space-900/80 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-white hover:text-cyan-300 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-cyan-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. CONTACT & PARTNERSHIP FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Get In Touch</span>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Connect With the VoltShare Team
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Interested in deploying a VoltShare station at your commercial property, integrating your EV fleet, or inquiring about technical licensing?
          </p>
          <div className="p-4 rounded-xl bg-space-950 border border-slate-800 text-xs font-mono text-slate-400 space-y-2">
            <div>Emergency Grid Operations: support@voltshare.network</div>
            <div>Station Operator Hotline: +91 (800) 555-VOLT</div>
            <div>Headquarters: 42 Silicon Avenue, Metro Hub</div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-space-900/80 p-6 sm:p-8 rounded-3xl border border-cyan-500/30">
          {!contactSubmitted ? (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. alex@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">I am inquiring as a:</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Vehicle Owner">EV Vehicle Driver / Commuter</option>
                  <option value="Station Host">Prospective Station Host / Property Owner</option>
                  <option value="Fleet Operator">Fleet Operator (Logistics, Delivery, Cabs)</option>
                  <option value="OEM Partner">EV OEM / Battery Manufacturer</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Message / Inquiry</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry, vehicle model, or proposed station location..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Transmission</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-3 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Inquiry Received</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Thank you, {formData.name}. Our electromobility engineering team will respond within 4 hours.
              </p>
              <button
                onClick={() => setContactSubmitted(false)}
                className="text-xs text-cyan-400 hover:underline pt-2"
              >
                Send another message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. ENGINEERING DISCLAIMER */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-2">
        <div className="font-bold text-slate-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Technical & Safety Engineering Disclaimer</span>
        </div>
        <p>
          VoltShare operates as an emergency modular power ecosystem. Swappable battery configurations are strictly governed by nominal system voltage, discharge limits, and vehicle connector compatibility. For four-wheelers, emergency energy is dispatched via specialized high-voltage DC units with standard CCS2 communication protocols. Range estimates presented throughout this interface are calculated based on 90% usable Depth of Discharge and a 15% emergency reserve margin under standard urban test cycles.
        </p>
      </div>

    </div>
  );
};
