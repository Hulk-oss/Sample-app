import { useState } from "react";
import {
  ArrowRight, ArrowUpRight, Check, Clock3, Heart, Instagram, Menu, Sparkles
} from "lucide-react";

const webIcon = name => "https://api.iconify.design/" + name + ".svg?color=%23131312";

const categories = [
  ["mdi:cash-multiple", "Cash", "mint"],
  ["mdi:receipt-text-outline", "Invoices", "peach"],
  ["mdi:shield-check-outline", "Tax", "lavender"],
  ["mdi:target", "Goals", "yellow"],
  ["mdi:chart-line", "Runway", "blue"],
  ["mdi:sparkles", "AI CFO", "rose"],
];

const recipes = [
  ["mdi:wallet-outline", "Know your cash", "30 minutes", "Cash"],
  ["mdi:file-document-check-outline", "Keep invoices moving", "15 minutes", "Invoices"],
  ["mdi:shield-lock-outline", "Build your tax reserve", "20 minutes", "Tax"],
  ["mdi:chart-timeline-variant", "Understand your runway", "20 minutes", "Runway"],
  ["mdi:target-arrow", "Set a monthly target", "10 minutes", "Goals"],
  ["mdi:scale-balance", "Compare income and spend", "15 minutes", "Planning"],
  ["mdi:message-text-outline", "Ask your AI CFO", "5 minutes", "AI"],
  ["mdi:calendar-check-outline", "Plan upcoming outflows", "10 minutes", "Planning"],
];

function Icon({ name, className = "" }) {
  return <img className={"foodie-icon " + className} src={webIcon(name)} alt="" aria-hidden="true" />;
}

function Brand() {
  return <div className="foodie-brand"><span className="foodie-brand-dot"><Sparkles size={13} /></span>Freelancer CFO</div>;
}

function LandingPage({ onAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const jump = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <div className="foodie-page">
      <header className="foodie-header">
        <Brand />
        <nav className="foodie-nav">
          <button onClick={() => jump("home")}>Home</button>
          <button onClick={() => jump("categories")}>Features</button>
          <button onClick={() => jump("recipes")}>Planning</button>
          <button onClick={() => jump("chef")}>About us</button>
        </nav>
        <div className="foodie-header-right">
          <button className="foodie-social" aria-label="Instagram"><Instagram size={14} /></button>
          <button className="foodie-social"><Heart size={13} /></button>
          <button className="foodie-login" onClick={() => onAuth("login")}>Log in</button>
          <button className="foodie-black-btn" onClick={() => onAuth("signup")}>Get started</button>
        </div>
        <button className="foodie-menu-btn" onClick={() => setMenuOpen(v => !v)} aria-label="Menu"><Menu size={18} /></button>
        {menuOpen && (
          <div className="foodie-mobile-menu">
            <button onClick={() => jump("home")}>Home</button>
            <button onClick={() => jump("categories")}>Features</button>
            <button onClick={() => jump("recipes")}>Planning</button>
            <button onClick={() => jump("chef")}>About us</button>
            <button onClick={() => { onAuth("login"); setMenuOpen(false); }}>Log in</button>
            <button onClick={() => { onAuth("signup"); setMenuOpen(false); }}>Get started</button>
          </div>
        )}
      </header>

      <main>
        <section className="foodie-hero" id="home">
          <div className="foodie-hero-copy">
            <div className="foodie-hot-pill"><span /> Private finance</div>
            <h1>Clear, simple money decisions <em>for your business.</em></h1>
            <p>Freelancer CFO helps you track cash, invoices, reserves and runway in one calm workspace — built for independent professionals.</p>
            <div className="foodie-meta-row">
              <span><Clock3 size={13} /> Your own data</span>
              <span><Check size={13} /> No demo numbers</span>
            </div>
            <button className="foodie-black-btn foodie-hero-btn" onClick={() => onAuth("signup")}>Start your workspace <ArrowUpRight size={14} /></button>
            <div className="foodie-author">
              <div className="foodie-avatar">CF</div>
              <div><b>Private by design</b><span>Financial context stays inside your account.</span></div>
            </div>
          </div>

          <div className="foodie-hero-art">
            <div className="foodie-art-top"><span>FINANCE DASHBOARD</span><ArrowUpRight size={14} /></div>
            <div className="foodie-art-title">Spending with clarity.</div>
            <div className="foodie-art-grid">
              <div className="foodie-art-main">
                <Icon name="mdi:wallet-bifold-outline" />
                <strong>Cash position</strong>
                <span>Available · reserves · outflows</span>
                <div className="foodie-spark-bars">
                  {[45, 65, 55, 82, 72, 93, 76].map((height, i) => <i key={i} style={{ height: height + "%" }} />)}
                </div>
              </div>
              <div className="foodie-art-side">
                <div><Icon name="mdi:receipt-outline" /><b>Invoices</b><small>paid · due · overdue</small></div>
                <div><Icon name="mdi:shield-check-outline" /><b>Reserves</b><small>tax · emergency</small></div>
                <div><Icon name="mdi:target" /><b>Runway</b><small>current pace</small></div>
              </div>
            </div>
            <div className="foodie-circle-stamp"><Sparkles size={12} /><span>YOUR DATA</span></div>
          </div>
        </section>

        <section className="foodie-section foodie-categories" id="categories">
          <div className="foodie-section-head">
            <h2>Categories</h2>
            <button className="foodie-outline-btn" onClick={() => onAuth("signup")}>View all features</button>
          </div>
          <div className="foodie-category-grid">
            {categories.map(([icon, title, tone]) => (
              <button className={"foodie-category-card " + tone} key={title} onClick={() => onAuth("signup")}>
                <div className="foodie-category-blob"><Icon name={icon} /></div>
                <b>{title}</b>
              </button>
            ))}
          </div>
        </section>

        <section className="foodie-section" id="recipes">
          <div className="foodie-centered-head">
            <h2>Simple and useful planning</h2>
            <p>Use the same calm flow for the daily money tasks that keep your independent business moving.</p>
          </div>
          <div className="foodie-recipe-grid">
            {recipes.map(([icon, title, duration, tag], index) => (
              <article className="foodie-recipe-card" key={title}>
                <div className={"foodie-recipe-image recipe-tone-" + ((index % 6) + 1)}>
                  <Icon name={icon} className="foodie-recipe-icon" />
                  <span className="foodie-heart"><Heart size={13} /></span>
                  <span className="foodie-recipe-mark">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3>{title}</h3>
                <div className="foodie-recipe-info"><span><Clock3 size={11} /> {duration}</span><span><Icon name="mdi:tag-outline" /> {tag}</span></div>
              </article>
            ))}
          </div>
        </section>

        <section className="foodie-chef" id="chef">
          <div className="foodie-chef-copy">
            <h2>Everyone can be a CFO in their own business</h2>
            <p>No finance degree required. Put your real numbers into a workspace that explains cash, reserves, invoices and runway in language you can use.</p>
            <button className="foodie-black-btn" onClick={() => onAuth("signup")}>Learn more <ArrowRight size={14} /></button>
          </div>
          <div className="foodie-chef-art">
            <div className="foodie-chef-circle"><Icon name="mdi:calculator-variant-outline" /></div>
            <div className="foodie-chef-card one"><Icon name="mdi:cash-check" /><b>Safe to spend</b><span>Know what is really available.</span></div>
            <div className="foodie-chef-card two"><Icon name="mdi:calendar-clock" /><b>Next 30 days</b><span>See upcoming outflows.</span></div>
            <div className="foodie-chef-card three"><Icon name="mdi:robot-outline" /><b>AI CFO</b><span>Ask for an explanation.</span></div>
          </div>
        </section>

        <section className="foodie-section foodie-instagram">
          <div className="foodie-centered-head">
            <h2>See the whole picture</h2>
            <p>One visual language across cash, invoices, planning and the next decision.</p>
          </div>
          <div className="foodie-instagram-grid">
            {[
              ["mdi:wallet-outline", "Cash", "What can I safely use?"],
              ["mdi:receipt-text-outline", "Invoices", "What is still due?"],
              ["mdi:shield-check-outline", "Reserves", "What should stay protected?"],
              ["mdi:chart-line", "Runway", "How long can I operate?"],
              ["mdi:target", "Goals", "What am I building toward?"],
              ["mdi:sparkles", "AI CFO", "What does the number mean?"],
            ].map(([icon, title, text], i) => (
              <div className={"foodie-instagram-tile tile-" + ((i % 6) + 1)} key={title}>
                <Icon name={icon} className="foodie-instagram-icon" />
                <b>{title}</b>
                <span>{text}</span>
              </div>
            ))}
          </div>
          <button className="foodie-outline-btn foodie-center-btn" onClick={() => onAuth("signup")}>Open your workspace</button>
        </section>

        <section className="foodie-newsletter">
          <div>
            <h2>Clear numbers <br />to your inbox</h2>
            <p>Product updates, finance tips and new tools for independent work.</p>
          </div>
          <div className="foodie-newsletter-form">
            <input type="email" placeholder="Your email address..." aria-label="Email address" />
            <button className="foodie-black-btn" onClick={() => onAuth("signup")}>Subscribe <ArrowRight size={13} /></button>
          </div>
        </section>
      </main>

      <footer className="foodie-footer">
        <div><Brand /><p>Financial clarity for independent professionals.</p></div>
        <div className="foodie-footer-nav">
          <button onClick={() => jump("categories")}>Features</button>
          <button onClick={() => jump("recipes")}>Planning</button>
          <button onClick={() => onAuth("login")}>Log in</button>
          <button onClick={() => onAuth("signup")}>Get started</button>
        </div>
        <div className="foodie-footer-bottom"><span>© 2026 Freelancer CFO</span><span>Private by design</span></div>
      </footer>
    </div>
  );
}

export default LandingPage;
