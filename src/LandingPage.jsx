import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, Sparkles } from "lucide-react";

const iconUrl = name => `https://api.iconify.design/${name}.svg?color=%23131312`;

const categories = [
  { icon: "mdi:wallet-outline", title: "Cash flow", text: "Know what is available now and what is coming next.", tone: "mint" },
  { icon: "mdi:receipt-text-outline", title: "Invoices", text: "Keep billing, due dates and follow-ups in one place.", tone: "peach" },
  { icon: "mdi:shield-check-outline", title: "Tax reserve", text: "Set aside what belongs to tax before you spend it.", tone: "lavender" },
  { icon: "mdi:target", title: "Runway", text: "See how long your current pace can carry you.", tone: "blue" },
  { icon: "mdi:chart-line", title: "Planning", text: "Compare your actual activity with your plan.", tone: "yellow" },
  { icon: "mdi:sparkles", title: "AI CFO", text: "Ask questions and get explanations grounded in your data.", tone: "rose" },
];

const productCards = [
  {
    tone: "blue",
    kicker: "Cash cockpit",
    title: "See the money before you make the move.",
    text: "A calm view of cash, reserves and upcoming outflows — designed for independent work.",
    icon: "mdi:chart-timeline-variant-shimmer",
  },
  {
    tone: "peach",
    kicker: "Invoice desk",
    title: "Keep every invoice moving.",
    text: "Create invoices, track what is paid and keep overdue work visible without clutter.",
    icon: "mdi:receipt-outline",
  },
  {
    tone: "mint",
    kicker: "Reserve planner",
    title: "Protect the money you should not spend.",
    text: "Tax and emergency reserves stay visible inside the same planning flow.",
    icon: "mdi:shield-lock-outline",
  },
  {
    tone: "lavender",
    kicker: "AI CFO",
    title: "Ask your finances a better question.",
    text: "The assistant explains calculations from your workspace instead of inventing numbers.",
    icon: "mdi:message-text-outline",
  },
];

function Icon({ name }) {
  return <img className="landing-icon-image" src={iconUrl(name)} alt="" aria-hidden="true" />;
}

function Brand() {
  return <div className="landing-brand"><span className="landing-brand-mark"><Sparkles size={15} /></span>Freelancer CFO</div>;
}

function FlowTag({ children, tone = "mint" }) {
  return <span className={`landing-flow-tag ${tone}`}><span />{children}</span>;
}

function LandingPage({ onAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="landing">
      <header className="landing-header">
        <Brand />
        <nav className="landing-nav" aria-label="Main navigation">
          <button onClick={() => scrollTo("landing-home")}>Home</button>
          <button onClick={() => scrollTo("landing-features")}>Features</button>
          <button onClick={() => scrollTo("landing-categories")}>How it works</button>
          <button onClick={() => scrollTo("landing-footer")}>About</button>
        </nav>
        <div className="landing-header-actions">
          <button className="landing-text-btn" onClick={() => onAuth("login")}>Log in</button>
          <button className="landing-dark-btn landing-small-btn" onClick={() => onAuth("signup")}>Get started <ArrowUpRight size={14} /></button>
        </div>
        <button className="landing-mobile-menu" aria-label="Open navigation" onClick={() => setMenuOpen(value => !value)}><Menu size={19} /></button>
        {menuOpen && <div className="landing-mobile-nav"><button onClick={() => { scrollTo("landing-home"); setMenuOpen(false); }}>Home</button><button onClick={() => { scrollTo("landing-features"); setMenuOpen(false); }}>Features</button><button onClick={() => { scrollTo("landing-categories"); setMenuOpen(false); }}>How it works</button><button onClick={() => { onAuth("login"); setMenuOpen(false); }}>Log in</button><button onClick={() => { onAuth("signup"); setMenuOpen(false); }}>Get started</button></div>}
      </header>

      <main>
        <section id="landing-home" className="landing-hero-section">
          <div className="landing-hero-copy">
            <FlowTag>Private finance, made simple</FlowTag>
            <h1>Run your money like you run your <span>business.</span></h1>
            <p className="landing-lede">Freelancer CFO gives independent professionals a clear place to understand cash, invoices, reserves and runway — without the noise of traditional finance software.</p>
            <div className="landing-hero-actions">
              <button className="landing-dark-btn" onClick={() => onAuth("signup")}>Start your workspace <ArrowRight size={15} /></button>
              <button className="landing-light-btn" onClick={() => scrollTo("landing-features")}>See how it works</button>
            </div>
            <div className="landing-hero-note"><Check size={14} /> Your data stays tied to your account.</div>
          </div>

          <div className="landing-hero-visual">
            <div className="landing-hero-card">
              <div className="landing-hero-card-top">
                <div><span className="landing-mini-label">Your finance plan</span><strong>Clear. Calm. Current.</strong></div>
                <span className="landing-circle-badge"><ArrowUpRight size={14} /></span>
              </div>
              <div className="landing-summary-chip-row">
                <span className="landing-summary-chip"><Icon name="mdi:wallet-outline" /> Cash</span>
                <span className="landing-summary-chip"><Icon name="mdi:receipt-text-outline" /> Invoices</span>
                <span className="landing-summary-chip"><Icon name="mdi:shield-check-outline" /> Reserves</span>
              </div>
              <div className="landing-visual-chart">
                <div className="landing-chart-head"><span>Cash position</span><span>90 day view</span></div>
                <div className="landing-bars">
                  <i style={{ height: "34%" }} /><i style={{ height: "47%" }} /><i style={{ height: "41%" }} /><i style={{ height: "63%" }} /><i style={{ height: "58%" }} /><i style={{ height: "78%" }} /><i style={{ height: "70%" }} /><i style={{ height: "88%" }} />
                </div>
              </div>
              <div className="landing-mini-grid">
                <div><span>Safe to spend</span><strong>Protected</strong><small>after reserves</small></div>
                <div><span>Runway</span><strong>Visible</strong><small>at your current pace</small></div>
                <div><span>Tax reserve</span><strong>Planned</strong><small>before you spend</small></div>
              </div>
              <div className="landing-float-card landing-float-one"><Icon name="mdi:receipt-outline" /><div><b>Invoice flow</b><span>Keep every due date visible.</span></div></div>
              <div className="landing-float-card landing-float-two"><Icon name="mdi:sparkles" /><div><b>AI CFO</b><span>Explain the numbers.</span></div></div>
            </div>
            <div className="landing-hero-doodle landing-doodle-left">✦</div>
            <div className="landing-hero-doodle landing-doodle-right">✳</div>
          </div>
        </section>

        <section className="landing-categories-section" id="landing-categories">
          <div className="landing-section-head compact">
            <div><span className="landing-kicker">Your financial ingredients</span><h2>Everything you need to keep the business side of life in order.</h2></div>
            <button className="landing-link-btn" onClick={() => onAuth("signup")}>Explore workspace <ArrowUpRight size={14} /></button>
          </div>
          <div className="landing-category-grid">
            {categories.map(item => (
              <article className={`landing-category-card ${item.tone}`} key={item.title}>
                <div className="landing-category-icon"><Icon name={item.icon} /></div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <ChevronDown size={15} className="landing-category-arrow" />
              </article>
            ))}
          </div>
        </section>

        <section className="landing-features-section" id="landing-features">
          <div className="landing-section-head centered">
            <span className="landing-kicker">Simple and useful</span>
            <h2>Finance should feel as easy as checking your recipe.</h2>
            <p>One visual system from first transaction to your next big decision.</p>
          </div>
          <div className="landing-product-grid">
            {productCards.map(card => (
              <article className={`landing-product-card ${card.tone}`} key={card.kicker}>
                <div className="landing-product-icon"><Icon name={card.icon} /></div>
                <span className="landing-product-kicker">{card.kicker}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <button onClick={() => onAuth("signup")}>Open workspace <ArrowUpRight size={14} /></button>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-chef-section">
          <div className="landing-chef-copy">
            <span className="landing-kicker">Built for independent work</span>
            <h2>Everyone can run the numbers with confidence.</h2>
            <p>You do the work. Freelancer CFO helps you understand the money behind it, with the same calm, visual experience across daily tracking and long-term planning.</p>
            <button className="landing-dark-btn" onClick={() => onAuth("signup")}>Create your workspace <ArrowRight size={15} /></button>
          </div>
          <div className="landing-chef-visual">
            <div className="landing-recipe-stack">
              <div className="landing-recipe-sheet first"><span>01</span><b>Know what is yours.</b><small>Cash · invoices · inflow</small></div>
              <div className="landing-recipe-sheet second"><span>02</span><b>Protect what is not.</b><small>Tax · emergency · reserves</small></div>
              <div className="landing-recipe-sheet third"><span>03</span><b>Decide what is next.</b><small>Runway · goals · scenarios</small></div>
            </div>
            <div className="landing-sprinkle one">✦</div>
            <div className="landing-sprinkle two">•</div>
          </div>
        </section>

        <section className="landing-instagram-section">
          <div className="landing-section-head centered">
            <span className="landing-kicker">A calmer way to plan</span>
            <h2>Clear screens. Softer edges. Better decisions.</h2>
            <p>Designed around the same visual rhythm as the food template you shared: simple navigation, bold headings, colorful category cards and focused content blocks.</p>
          </div>
          <div className="landing-photo-grid">
            <div className="landing-photo-tile tint-blue"><Icon name="mdi:wallet-outline" /><strong>Cash</strong><span>Know what is available.</span></div>
            <div className="landing-photo-tile tint-peach"><Icon name="mdi:receipt-outline" /><strong>Invoices</strong><span>Know what is due.</span></div>
            <div className="landing-photo-tile tint-mint"><Icon name="mdi:shield-check-outline" /><strong>Reserves</strong><span>Know what to protect.</span></div>
            <div className="landing-photo-tile tint-lavender"><Icon name="mdi:chart-line" /><strong>Runway</strong><span>Know what comes next.</span></div>
            <div className="landing-photo-tile tint-yellow"><Icon name="mdi:target" /><strong>Goals</strong><span>Know what you are building.</span></div>
            <div className="landing-photo-tile tint-rose"><Icon name="mdi:sparkles" /><strong>AI CFO</strong><span>Ask for an explanation.</span></div>
          </div>
        </section>

        <section className="landing-cta-section">
          <div>
            <span className="landing-kicker">Ready when you are</span>
            <h2>Make the money side feel simple again.</h2>
            <p>No demo account. No pre-filled finance history. Start with your own information.</p>
          </div>
          <button className="landing-dark-btn" onClick={() => onAuth("signup")}>Create your account <ArrowRight size={15} /></button>
        </section>
      </main>

      <footer className="landing-footer" id="landing-footer">
        <div className="landing-footer-main">
          <div><Brand /><p>Financial clarity for independent professionals.</p></div>
          <div className="landing-footer-links"><button onClick={() => scrollTo("landing-features")}>Features</button><button onClick={() => scrollTo("landing-categories")}>How it works</button><button onClick={() => onAuth("login")}>Log in</button><button onClick={() => onAuth("signup")}>Get started</button></div>
        </div>
        <div className="landing-footer-bottom"><span>Freelancer CFO</span><span>Private by design · Built for your own data</span></div>
      </footer>
    </div>
  );
}

export default LandingPage;
