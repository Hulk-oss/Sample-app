import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Clock3, Heart, Instagram, Menu, Sparkles } from "lucide-react";

const webIcon = name => "https://api.iconify.design/" + name + ".svg?color=%23131312";

const photos = {
  hero: "https://images.pexels.com/photos/5900029/pexels-photo-5900029.jpeg?auto=compress&cs=tinysrgb&w=1500",
  desk: "https://images.unsplash.com/photo-1735825764485-93a381fd5779?auto=format&fit=crop&w=1400&q=80",
  notes: "https://images.pexels.com/photos/7681236/pexels-photo-7681236.jpeg?auto=compress&cs=tinysrgb&w=1200",
  planner: "https://images.pexels.com/photos/5387247/pexels-photo-5387247.jpeg?auto=compress&cs=tinysrgb&w=1200",
  papers: "https://images.unsplash.com/photo-1735825764485-93a381fd5779?auto=format&fit=crop&w=1100&q=80",
};

const categoryData = [
  ["mdi:wallet-outline", "Cash", photos.desk, "mint"],
  ["mdi:receipt-text-outline", "Invoices", photos.hero, "peach"],
  ["mdi:shield-check-outline", "Tax Reserve", photos.notes, "lav"],
  ["mdi:target", "Goals", photos.planner, "yellow"],
  ["mdi:chart-line", "Runway", photos.desk, "blue"],
  ["mdi:sparkles", "AI CFO", photos.notes, "rose"],
];

const cards = [
  [photos.desk, "See your cash clearly", "Cash position", "Know what is available before you make the next move.", "32 min"],
  [photos.hero, "Keep every invoice moving", "Invoices", "Create, track and follow up without a crowded finance screen.", "18 min"],
  [photos.notes, "Protect what is not yours to spend", "Tax Reserve", "Keep tax and emergency money visible before it gets used.", "24 min"],
  [photos.planner, "Know how long you can operate", "Runway", "Understand your current pace and what changes the picture.", "20 min"],
  [photos.papers, "Turn activity into a plan", "Planning", "Compare what happened with what you want next month to look like.", "16 min"],
  [photos.hero, "Ask the number a better question", "AI CFO", "Get explanations grounded in your own finance workspace.", "8 min"],
  [photos.notes, "See upcoming outflows", "Cash Flow", "Keep the next 30 days visible without losing the bigger picture.", "14 min"],
  [photos.planner, "Build your monthly target", "Income Goal", "Give your work a clear financial target and track it.", "12 min"],
  [photos.desk, "Make decisions with context", "Scenarios", "Use the runway and reserve view before committing to a spend.", "10 min"],
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
          <button onClick={() => jump("categories")}>Finance</button>
          <button onClick={() => jump("recipes")}>Planning</button>
          <button onClick={() => jump("ai")}>AI CFO</button>
          <button onClick={() => jump("about")}>About us</button>
        </nav>
        <div className="foodie-header-right">
          <button className="foodie-social" aria-label="Instagram"><Instagram size={14} /></button>
          <button className="foodie-social" aria-label="Favorites"><Heart size={13} /></button>
          <button className="foodie-login" onClick={() => onAuth("login")}>Log in</button>
          <button className="foodie-black-btn" onClick={() => onAuth("signup")}>Get started</button>
        </div>
        <button className="foodie-menu-btn" onClick={() => setMenuOpen(v => !v)} aria-label="Menu"><Menu size={18} /></button>
        {menuOpen && (
          <div className="foodie-mobile-menu">
            {["home", "categories", "recipes", "ai", "about"].map((id, i) => <button key={id} onClick={() => jump(id)}>{["Home", "Finance", "Planning", "AI CFO", "About us"][i]}</button>)}
            <button onClick={() => { onAuth("login"); setMenuOpen(false); }}>Log in</button>
            <button onClick={() => { onAuth("signup"); setMenuOpen(false); }}>Get started</button>
          </div>
        )}
      </header>

      <main>
        <section className="foodie-hero" id="home">
          <div className="foodie-hero-copy">
            <div className="foodie-hot-pill"><span /> PRIVATE FINANCE WORKSPACE</div>
            <h1>Simple, clear money management <em>for independent work.</em></h1>
            <p>Track cash, invoices, reserves and runway in one calm workspace. Built for freelancers, creators and small independent businesses.</p>
            <div className="foodie-meta-row">
              <span><Clock3 size={12} /> Your own data</span>
              <span><Check size={12} /> No demo data</span>
            </div>
            <button className="foodie-black-btn foodie-hero-btn" onClick={() => onAuth("signup")}>Start your workspace <ArrowUpRight size={14} /></button>
            <div className="foodie-author">
              <div className="foodie-avatar">CF</div>
              <div><b>Built around your numbers</b><span>Every screen uses the data from your account.</span></div>
            </div>
          </div>
          <div className="foodie-hero-photo">
            <img src={photos.hero} alt="Freelancer organizing receipts and finances at a desk" />
            <div className="foodie-photo-stamp"><Sparkles size={11} /><span>FINANCE<br />MADE CALM</span></div>
          </div>
        </section>

        <section className="foodie-section foodie-categories" id="categories">
          <div className="foodie-section-head">
            <h2>Categories</h2>
            <button className="foodie-outline-btn" onClick={() => onAuth("signup")}>View all features</button>
          </div>
          <div className="foodie-category-grid">
            {categoryData.map(([icon, title, image, tone]) => (
              <button className={"foodie-category-card " + tone} key={title} onClick={() => onAuth("signup")}>
                <span className="foodie-category-image"><img src={image} alt="" /></span>
                <span className="foodie-category-icon"><Icon name={icon} /></span>
                <b>{title}</b>
              </button>
            ))}
          </div>
        </section>

        <section className="foodie-section" id="recipes">
          <div className="foodie-centered-head">
            <h2>Everything you need for your money</h2>
            <p>A visual workspace for the recurring finance tasks behind an independent business.</p>
          </div>
          <div className="foodie-recipe-grid">
            {cards.map(([image, title, tag, text, time], index) => (
              <article className="foodie-recipe-card" key={title}>
                <button className="foodie-recipe-image" onClick={() => onAuth("signup")} aria-label={title}>
                  <img src={image} alt="" />
                  <span className="foodie-heart"><Heart size={13} /></span>
                </button>
                <h3>{title}</h3>
                <p>{text}</p>
                <div className="foodie-recipe-info">
                  <span><Clock3 size={10} /> {time}</span>
                  <span><Icon name="mdi:tag-outline" /> {tag}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="foodie-chef" id="about">
          <div className="foodie-chef-copy">
            <h2>Everyone can understand the money behind the work</h2>
            <p>No finance degree required. Freelancer CFO turns your real activity into a visual picture of cash, invoices, reserves, runway and next steps.</p>
            <button className="foodie-black-btn" onClick={() => onAuth("signup")}>Learn more <ArrowRight size={14} /></button>
          </div>
          <div className="foodie-chef-photo">
            <img src={photos.desk} alt="Professional working through financial information" />
            <div className="foodie-overlay-card one"><Icon name="mdi:shield-check-outline" /><b>Safe to spend</b><span>After your reserves.</span></div>
            <div className="foodie-overlay-card two"><Icon name="mdi:chart-line" /><b>Runway</b><span>See the months ahead.</span></div>
          </div>
        </section>

        <section className="foodie-section foodie-instagram" id="ai">
          <div className="foodie-centered-head">
            <h2>Make the money side feel simple</h2>
            <p>Clear screens, useful context and the same visual language from first transaction to next decision.</p>
          </div>
          <div className="foodie-instagram-grid">
            {[
              [photos.desk, "Cash", "Know what is available."],
              [photos.hero, "Invoices", "Know what is due."],
              [photos.notes, "Reserves", "Know what stays protected."],
              [photos.planner, "Runway", "Know what comes next."],
            ].map(([image, title, text]) => (
              <button className="foodie-instagram-tile" key={title} onClick={() => onAuth("signup")}>
                <img src={image} alt="" />
                <div className="foodie-instagram-caption"><b>{title}</b><span>{text}</span></div>
              </button>
            ))}
          </div>
          <button className="foodie-outline-btn foodie-center-btn" onClick={() => onAuth("signup")}>Open your workspace</button>
        </section>

        <section className="foodie-newsletter">
          <div>
            <h2>Financial clarity <br />in your inbox.</h2>
            <p>Product updates and practical finance notes for independent professionals.</p>
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
          <button onClick={() => jump("categories")}>Finance</button>
          <button onClick={() => jump("recipes")}>Planning</button>
          <button onClick={() => jump("ai")}>AI CFO</button>
          <button onClick={() => onAuth("login")}>Log in</button>
        </div>
        <div className="foodie-footer-bottom"><span>© 2026 Freelancer CFO</span><span>Private by design</span></div>
      </footer>
    </div>
  );
}

export default LandingPage;
