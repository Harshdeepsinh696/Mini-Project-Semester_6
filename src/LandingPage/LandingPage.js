// ══════════════════════════════════════════════════════════
//  LandingPage.jsx  |  src/LandingPage/LandingPage.jsx
// ══════════════════════════════════════════════════════════
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const FEATURES = [
  { icon: "⏰", tag: "REMINDERS",  title: "Smart Scheduling",     desc: "Adaptive alerts that learn your routine. Get reminded at exactly the right time — morning, noon, or night." },
  { icon: "📊", tag: "ANALYTICS",  title: "Adherence Tracking",   desc: "Weekly streaks and progress charts that turn daily compliance into a habit you actually want to keep." },
  { icon: "🔔", tag: "ALERTS",     title: "Refill Radar",         desc: "Know when you're running low before it becomes a problem. Predictive restocking alerts sent in advance." },
  { icon: "🛡️", tag: "PRIVACY",    title: "Zero-Knowledge Vault", desc: "End-to-end encrypted storage. Your health data is yours alone — never sold, never shared with anyone." },
  { icon: "📋", tag: "RECORDS",    title: "Instant History",      desc: "A clean, shareable log of every dose taken, skipped, or pending. One tap to export for your doctor." },
  { icon: "⚡", tag: "SPEED",      title: "30-Second Add",        desc: "Search by name, scan a barcode, or type manually. Any medicine on your schedule in under half a minute." },
  { icon: "👨‍👩‍👧", tag: "FAMILY",   title: "Family Profiles",      desc: "Manage medicines for your whole family from one account. Switch between profiles instantly." },
  { icon: "🩺", tag: "INSIGHTS",   title: "Doctor Reports",       desc: "Generate a clean PDF report of your adherence data — ready to share at your next appointment." },
  { icon: "🌐", tag: "SYNC",       title: "Cross-Device Sync",    desc: "Your schedule stays perfectly synced across all your devices. Change on one, update everywhere." },
];

const STEPS = [
  { n: "01", icon: "👤", title: "Create your profile",   desc: "Sign up in under 60 seconds. No credit card, no friction — just your name and email to get started." },
  { n: "02", icon: "💊", title: "Add your medicines",    desc: "Search from 10,000+ medicines or add a custom one. Set dosage, frequency, time, and any special notes." },
  { n: "03", icon: "📈", title: "Track and stay healthy",desc: "Smart reminders arrive on time. Log each dose in one tap. Watch your adherence streak grow every day." },
];

const TESTIMONIALS = [
  { name: "Priya Sharma",     role: "Managing Type 2 Diabetes",   avatar: "PS", color: "#22c55e", text: "My A1C improved significantly after starting MediCare. The streak system made insulin compliance feel like a game I actually wanted to win every day." },
  { name: "Rahul Mehta",      role: "Caregiver, 2 elderly parents",avatar: "RM", color: "#38bdf8", text: "I manage 14 medicines across two people. MediCare's history export saved a hospital visit by giving the ER doctor a complete, instant medication log." },
  { name: "Dr. Anjali Patel", role: "General Physician, 12 yrs",   avatar: "AP", color: "#f59e0b", text: "I actively recommend MediCare to patients. Those who use it show measurably better compliance and come to appointments much better prepared." },
];

const STATS = [
  { value: "500K+", label: "Active Patients" },
  { value: "98.2%", label: "Adherence Rate"  },
  { value: "4.9★",  label: "App Rating"      },
  { value: "< 30s", label: "Avg. Setup Time" },
];

const FAQ = [
  { q: "Is MediCare free to use?",             a: "Yes — MediCare is completely free for personal use. You can add unlimited medicines and track adherence at no cost, forever." },
  { q: "Is my health data private?",           a: "Absolutely. All data is end-to-end encrypted and stored only on your device and our secure servers. We never sell or share your data." },
  { q: "Can I manage medicines for my family?",a: "Yes. You can create separate profiles for family members and switch between them instantly from one account." },
  { q: "Does it work offline?",                a: "Core features like viewing schedules and logging doses work fully offline. Sync happens automatically when you reconnect." },
  { q: "Can I export my history for my doctor?",a: "Yes — generate a clean PDF report of your adherence history with one tap, ready to share at any appointment." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled]   = useState(false);
  const [activeT,  setActiveT]    = useState(0);
  const [openFaq,  setOpenFaq]    = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const statsRef      = useRef(null);
  const statsAnimated = useRef(false);
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  /* Navbar scroll detection */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Close mobile menu on scroll */
  useEffect(() => {
    if (mobileMenu) setMobileMenu(false);
  }, [scrolled]);

  /* Testimonial rotate */
  useEffect(() => {
    const t = setInterval(() => setActiveT(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  /* Scroll reveal */
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const d = parseInt(e.target.dataset.delay || 0);
          setTimeout(() => e.target.classList.add("lp-visible"), d);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Stats counter */
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !statsAnimated.current) {
        statsAnimated.current = true;
        const targets = [500, 98.2, 4.9, 30];
        targets.forEach((target, i) => {
          let v = 0;
          const step = target / 50;
          const timer = setInterval(() => {
            v = Math.min(v + step, target);
            setCounts(prev => { const n=[...prev]; n[i]=v; return n; });
            if (v >= target) clearInterval(timer);
          }, 20);
        });
      }
    }, { threshold: 0.4 });
    if (statsRef.current) io.observe(statsRef.current);
    return () => io.disconnect();
  }, []);

  const fmtCount = (v, i) => {
    if (i === 0) return `${Math.floor(v)}K+`;
    if (i === 1) return `${v.toFixed(1)}%`;
    if (i === 2) return `${v.toFixed(1)}★`;
    return `< ${Math.floor(v)}s`;
  };

  return (
    <div className="lp" style={{ background: "#0b1120", backgroundColor: "#0b1120", minHeight: "100vh" }}>

      {/* ══ NAVBAR ══ */}
      <header className={`lp-nav ${scrolled ? "lp-nav--solid" : ""}`}>
        <div className="lp-nav-inner">
          <div className="lp-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="lp-logo-mark">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M11 8h2v3h3v2h-3v3h-2v-3H8v-2h3z" fill="white"/>
              </svg>
            </div>
            <span className="lp-logo-text">Medi<em>Care</em></span>
          </div>

          <nav className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#reviews">Reviews</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="lp-nav-actions">
            <button className="lp-nav-login" onClick={() => navigate("/login")}>Log in</button>
            <button className="lp-nav-cta"   onClick={() => navigate("/signup")}>
              Get started free
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lp-hamburger"
            onClick={() => setMobileMenu(p => !p)}
            aria-label={mobileMenu ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenu}
          >
            <span className={mobileMenu ? "open" : ""} />
            <span className={mobileMenu ? "open" : ""} />
            <span className={mobileMenu ? "open" : ""} />
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenu && (
          <div className="lp-mobile-menu">
            <a href="#features"     onClick={() => setMobileMenu(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenu(false)}>How it works</a>
            <a href="#reviews"      onClick={() => setMobileMenu(false)}>Reviews</a>
            <a href="#faq"          onClick={() => setMobileMenu(false)}>FAQ</a>
            <div className="lp-mobile-btns">
              <button onClick={() => { navigate("/login");  setMobileMenu(false); }}>Log in</button>
              <button className="solid" onClick={() => { navigate("/signup"); setMobileMenu(false); }}>Get started free</button>
            </div>
          </div>
        )}
      </header>

      {/* ══ HERO ══ */}
      <section className="lp-hero" style={{ background: "#0b1120", backgroundColor: "#0b1120" }}>
        <div className="lp-hero-bg">
          <div className="lp-blob lp-blob-1" />
          <div className="lp-blob lp-blob-2" />
          <div className="lp-hero-grid" />
        </div>

        <div className="lp-hero-inner lp-grid lp-grid--center">
          {/* Copy */}
          <div className="lp-hero-copy">
            <div className="lp-tag-pill" data-reveal>
              <span className="lp-tag-dot" />
              Trusted by 500,000+ patients worldwide
            </div>

            <h1 className="lp-hero-h1" data-reveal data-delay="80">
              Your medication,<br />
              <span className="lp-hl">always on time.</span>
            </h1>

            <p className="lp-hero-p" data-reveal data-delay="160">
              MediCare helps you track every dose, build consistent habits,
              and stay in full control of your health — simply and reliably.
            </p>

            <div className="lp-hero-btns" data-reveal data-delay="240">
              <button className="lp-btn-green" onClick={() => navigate("/signup")}>
                Start for free
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="lp-btn-outline" onClick={() => navigate("/login")}>
                Sign in
              </button>
            </div>

            <div className="lp-hero-trust" data-reveal data-delay="300">
              <div className="lp-avatars">
                {["PS","RM","AP","KL","MN"].map((a, i) => (
                  <div key={i} className="lp-av" style={{ left: i * 26 }}>{a}</div>
                ))}
              </div>
              <span><strong>500K+</strong> patients joined this year</span>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="lp-mockup" data-reveal data-delay="100">
            <div className="lp-mockup-shell">
              <div className="lp-mockup-bar">
                <div className="lp-bar-dots"><span/><span/><span/></div>
                <div className="lp-bar-url">medicare.app/today</div>
              </div>
              <div className="lp-mockup-body">

                <div className="lp-mk-head">
                  <div>
                    <div className="lp-mk-greet">Good Morning 👋</div>
                    <div className="lp-mk-sub">3 medicines scheduled for today</div>
                  </div>
                  <div className="lp-mk-date">Thu · Feb 27</div>
                </div>

                <div className="lp-mk-stats">
                  {[
                    { ico:"💊", n:"3", l:"Total",   c:"blue"  },
                    { ico:"✅", n:"1", l:"Taken",   c:"green" },
                    { ico:"⏳", n:"2", l:"Pending", c:"amber" },
                  ].map(s => (
                    <div className={`lp-mk-stat lp-mk-stat--${s.c}`} key={s.l}>
                      <span>{s.ico}</span>
                      <div><div className="lp-mk-stat-n">{s.n}</div><div className="lp-mk-stat-l">{s.l}</div></div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="lp-mk-prog-label">
                    <span>Today's progress</span><span className="lp-mk-pct">33%</span>
                  </div>
                  <div className="lp-mk-track"><div className="lp-mk-fill" /></div>
                </div>

                <div className="lp-mk-card">
                  <div className="lp-mk-card-ico">💊</div>
                  <div className="lp-mk-card-info">
                    <div className="lp-mk-card-name">
                      Aspirin
                      <span className="lp-mk-badge lp-mk-badge--amber">Pending</span>
                      <span className="lp-mk-badge lp-mk-badge--blue">Once daily</span>
                    </div>
                    <div className="lp-mk-card-dose">500mg · 1 tablet · 12:00 PM</div>
                  </div>
                  <div className="lp-mk-card-btns">
                    <button className="lp-mk-skip">Skip</button>
                    <button className="lp-mk-take">Take ✓</button>
                  </div>
                </div>

                <div className="lp-mk-week">
                  <div className="lp-mk-week-label">Weekly adherence</div>
                  <div className="lp-mk-days">
                    {["M","T","W","T","F","S","S"].map((d,i) => (
                      <div key={i} className={`lp-mk-day ${i<4?"done":i===4?"today":""}`}>
                        <div className="lp-mk-dot" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lp-mk-streak">🔥 <strong>7-Day Streak!</strong> Keep it up!</div>
              </div>
            </div>

            {/* Floating pills */}
            <div className="lp-notif lp-notif-1">
              <span>🔔</span>
              <div><div className="lp-notif-t">Reminder</div><div className="lp-notif-s">Aspirin due in 30 min</div></div>
            </div>
            <div className="lp-notif lp-notif-2">
              <span>✅</span>
              <div><div className="lp-notif-t">Dose logged</div><div className="lp-notif-s">Metformin · 8:00 AM</div></div>
            </div>
            <div className="lp-notif lp-notif-3">
              <span>🛒</span>
              <div><div className="lp-notif-t">Refill alert</div><div className="lp-notif-s">14 pills remaining</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <div className="lp-stats" ref={statsRef}>
        <div className="lp-stats-inner container">
          {STATS.map((s, i) => (
            <div className="lp-stat" key={s.label} data-reveal data-delay={i * 60}>
              <div className="lp-stat-n">{statsAnimated.current ? fmtCount(counts[i], i) : s.value}</div>
              <div className="lp-stat-l">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ FEATURES ══ */}
      <section className="lp-features lp-grid-bg" id="features">
        <div className="lp-wrap">
          <div className="lp-section-label" data-reveal>Features</div>
          <h2 className="lp-section-h2" data-reveal data-delay="60">
            Everything you need,<br /><span className="lp-hl">nothing you don't.</span>
          </h2>
          <p className="lp-section-p" data-reveal data-delay="120">
            Built specifically for patients, caregivers, and anyone who takes
            medication seriously.
          </p>

          <div className="lp-feat-grid">
            {FEATURES.map((f, i) => (
              <div className="lp-feat" key={f.title} data-reveal data-delay={i * 40}>
                <div className="lp-feat-tag">{f.tag}</div>
                <div className="lp-feat-ico">{f.icon}</div>
                <h3 className="lp-feat-title">{f.title}</h3>
                <p className="lp-feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="lp-how lp-grid-bg" id="how-it-works">
        <div className="lp-wrap">
          <div className="lp-section-label" data-reveal>How it works</div>
          <h2 className="lp-section-h2" data-reveal data-delay="60">
            Up and running<br /><span className="lp-hl">in 3 steps.</span>
          </h2>

          <div className="lp-steps">
            {STEPS.map((s, i) => (
              <div className="lp-step" key={s.n} data-reveal data-delay={i * 100}>
                <div className="lp-step-n">{s.n}</div>
                <div className="lp-step-ico">{s.icon}</div>
                <h3 className="lp-step-title">{s.title}</h3>
                <p className="lp-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SOCIAL PROOF BANNER ══ */}
      <div className="lp-proof-banner">
        <div className="lp-proof-inner lp-grid">
          <div className="lp-proof-item lp-col-3">
            <span>💊</span> 2.4M+ doses logged this month
          </div>
          <div className="lp-proof-divider" />
          <div className="lp-proof-item lp-col-3">
            <span>🔥</span> 127K active streaks right now
          </div>
          <div className="lp-proof-divider" />
          <div className="lp-proof-item lp-col-3">
            <span>⭐</span> Rated #1 medication tracker on App Store
          </div>
          <div className="lp-proof-divider" />
          <div className="lp-proof-item lp-col-3">
            <span>🏥</span> Trusted by 3,200+ healthcare providers
          </div>
        </div>
      </div>

      {/* ══ TESTIMONIALS ══ */}
      <section className="lp-reviews lp-grid-bg" id="reviews">
        <div className="lp-wrap">
          <div className="lp-section-label" data-reveal>Reviews</div>
          <h2 className="lp-section-h2" data-reveal data-delay="60">
            Real people.<br /><span className="lp-hl">Real results.</span>
          </h2>

          <div className="lp-t-grid">
            {TESTIMONIALS.map((t, i) => (
              <div
                className={`lp-t-card ${i === activeT ? "lp-t-on" : ""}`}
                key={t.name}
                style={{ "--tc": t.color }}
                onClick={() => setActiveT(i)}
              >
                <div className="lp-t-stars">★★★★★</div>
                <p className="lp-t-body">"{t.text}"</p>
                <div className="lp-t-author">
                  <div className="lp-t-av" style={{ color: t.color, borderColor: t.color }}>{t.avatar}</div>
                  <div>
                    <div className="lp-t-name">{t.name}</div>
                    <div className="lp-t-role">{t.role}</div>
                  </div>
                </div>
                <div className="lp-t-bar" />
              </div>
            ))}
          </div>

          <div className="lp-t-dots">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} className={`lp-t-dot ${i === activeT ? "on" : ""}`} onClick={() => setActiveT(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="lp-faq lp-grid-bg" id="faq">
        <div className="lp-wrap lp-wrap--narrow">
          <div className="lp-section-label" data-reveal>FAQ</div>
          <h2 className="lp-section-h2" data-reveal data-delay="60">
            Common questions.
          </h2>

          <div className="lp-faq-list">
            {FAQ.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  style={{
                    borderBottom: i < FAQ.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                    background: isOpen ? "#131f35" : "#0f1a2e",
                    borderLeft: isOpen ? "3px solid #22c55e" : "3px solid transparent",
                    transition: "background 0.25s, border-left-color 0.25s",
                  }}
                >
                  {/* Question row */}
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "22px 24px",
                      background: "none",
                      border: "none",
                      color: isOpen ? "#22c55e" : "#f8fafc",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                      gap: "16px",
                      fontFamily: "inherit",
                      transition: "color 0.2s",
                    }}
                  >
                    <span>{item.q}</span>
                    <svg
                      width="18" height="18" viewBox="0 0 24 24" fill="none"
                      style={{
                        flexShrink: 0,
                        color: isOpen ? "#22c55e" : "#64748b",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease, color 0.2s",
                        minWidth: 18,
                      }}
                    >
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Answer — always in DOM, max-height animates */}
                  <div
                    style={{
                      maxHeight: isOpen ? "400px" : "0px",
                      overflow: "hidden",
                      transition: "max-height 0.4s ease",
                    }}
                  >
                    <div
                      style={{
                        padding: "0 24px 20px",
                        fontSize: "0.88rem",
                        color: "#94a3b8",
                        lineHeight: 1.8,
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                        paddingTop: "14px",
                      }}
                    >
                      {item.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="lp-cta">
        <div className="lp-cta-glow" />
        <div className="lp-cta-wrap">
          <div className="lp-cta-badge" data-reveal>Free forever · No credit card required</div>
          <h2 className="lp-cta-h2" data-reveal data-delay="60">
            Start your health<br />journey today.
          </h2>
          <p className="lp-cta-p" data-reveal data-delay="120">
            Join half a million patients who trust MediCare to keep them
            on track — every single day.
          </p>
          <div className="lp-cta-btns" data-reveal data-delay="180">
            <button className="lp-btn-green lp-btn-green--lg" onClick={() => navigate("/signup")}>
              Create free account
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="lp-btn-outline lp-btn-outline--lg" onClick={() => navigate("/login")}>
              Sign in instead
            </button>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-top">
            <div className="lp-footer-brand">
              <div className="lp-logo">
                <div className="lp-logo-mark">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M11 8h2v3h3v2h-3v3h-2v-3H8v-2h3z" fill="white"/>
                  </svg>
                </div>
                <span className="lp-logo-text">Medi<em>Care</em></span>
              </div>
              <p className="lp-footer-tagline">Your health companion, always on time.</p>
            </div>

            <div className="lp-footer-cols">
              <div className="lp-footer-col">
                <div className="lp-footer-col-hd">Product</div>
                <a href="#features">Features</a>
                <a href="#how-it-works">How it works</a>
                <a href="#reviews">Reviews</a>
                <a href="#faq">FAQ</a>
              </div>
              <div className="lp-footer-col">
                <div className="lp-footer-col-hd">Account</div>
                <button onClick={() => navigate("/login")}>Sign in</button>
                <button onClick={() => navigate("/signup")}>Create account</button>
              </div>
            </div>
          </div>

          <div className="lp-footer-bottom">
            <span>© 2025 MediCare. All rights reserved.</span>
            <span>Made with ❤️ for healthier lives</span>
          </div>
        </div>
      </footer>

    </div>
  );
}