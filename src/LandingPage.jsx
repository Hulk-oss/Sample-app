import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Clock3, Instagram, Menu, WalletCards } from "lucide-react";

const webIcon = name => "https://api.iconify.design/" + name + ".svg?color=%23131312";

const photos = {
  hero: "https://images.unsplash.com/photo-1758876020967-e5a80e49463a?auto=format&fit=crop&q=85&w=1800",
  desk: "https://images.unsplash.com/photo-1635186238046-40771478f17e?auto=format&fit=crop&q=85&w=1400",
  notes: "https://images.unsplash.com/photo-1643395274037-6f0f86878aeb?auto=format&fit=crop&q=85&w=1400",
  planner: "https://images.unsplash.com/photo-1762341121210-6bd877d766b0?auto=format&fit=crop&q=85&w=1400",
  papers: "https://www.stuartco.ca/data/org/23396/media/img/cache/1152x640/3527981_1152x640.jpg",
  creative: "https://assets.mondiatechnologies.com/images/Blog/entrepreneur-working-laptop.jpeg",
  tax: "https://sanchisasesores.com/wp-content/uploads/2025/11/Gemini_Generated_Image_xj9iurxj9iurxj9i.png",
  plan: "https://miro.medium.com/v2/da%3Atrue/resize%3Afit%3A1200/0%2A2X3l0hm_1eGh5NWX",
  office: "https://assets.sc.hager.com/en-tr/-/media/project/hagerdeep/turkey/hager/turkey/003-inspiration-knowledge/iak-learning/aa-doorpage/learning03_landscape.jpg?h=720&hash=1E390EC61990AB7B3D66391BEA54B222&la=en&w=1080",
  laptop: "https://blog.soloist.ai/_next/image?q=75&url=https%3A%2F%2Fstorage.googleapis.com%2Fmoz-ocho-solo-blog.firebasestorage.app%2Fimages%2Fimported%2F1776299399195-how-to-write-a-business-plan-workspace-flatlay.jpg&w=2200"
};

const categoryData = [
  ["mdi:wallet-outline", "Cash", photos.desk, "mint"],
  ["mdi:receipt-text-outline", "Invoices", photos.hero, "peach"],
  ["mdi:shield-check-outline", "Tax Reserve", photos.tax, "lav"],
  ["mdi:target", "Goals", photos.plan, "yellow"],
  ["mdi:chart-line", "Runway", photos.office, "blue"],
  ["mdi:sparkles", "AI CFO", photos.creative, "rose"],
];

const cards = [
  [photos.desk, "See your cash clearly", "Cash position", "Know what is available before you make the next move.", "32 min"],
  [photos.creative, "Keep every invoice moving", "Invoices", "Create, track and follow up without a crowded finance screen.", "18 min"],
  [photos.tax, "Protect what is not yours to spend", "Tax Reserve", "Keep tax and emergency money visible before it gets used.", "24 min"],
  [photos.office, "Know how long you can operate", "Runway", "Understand your current pace and what changes the picture.", "20 min"],
  [photos.plan, "Turn activity into a plan", "Planning", "Compare what happened with what you want next month to look like.", "16 min"],
  [photos.notes, "Ask the number a better question", "AI CFO", "Get explanations grounded in your own finance workspace.", "8 min"],
  [photos.papers, "See upcoming outflows", "Cash Flow", "Keep the next 30 days visible without losing the bigger picture.", "14 min"],
  [photos.laptop, "Build your monthly target", "Income Goal", "Give your work a clear financial target and track it.", "12 min"],
  [photos.planner, "Make decisions with context", "Scenarios", "Use the runway and reserve view before committing to a spend.", "10 min"],
];

function Icon({ name, className = "" }) {
  return <img className={"foodie-icon " + className} src={webIcon(name)} alt="" aria-hidden="true" />;
}

function Brand() {
  return <div className="foodie-brand"><span className="foodie-brand-dot"><WalletCards size={13} /></span>Freelancer CFO</div>;
}

function LandingPage({ onAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  useEffect(() => {
    const nodes = document.querySelectorAll(".foodie-reveal");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const submitNewsletter = event => {
    event.preventDefault();
    if (!newsletterEmail.trim()) return;
    localStorage.setItem("cfo_newsletter_email", newsletterEmail.trim());
    setSubscribed(true);
  };

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
          <button className="foodie-social" aria-label="Open Instagram" onClick={() => window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer")}><Instagram size={14} /></button>
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
        <section className="foodie-hero foodie-reveal" id="home">
          <div className="foodie-hero-copy">
            <div className="foodie-hot-pill"><span /> HOT FINANCE</div>
            <h1>Simple financial clarity <em>for your business.</em></h1>
            <p>Track your cash, invoices, reserves and runway in one simple place. Make better money decisions without the finance clutter.</p>
            <div className="foodie-meta-row">
              <span><Clock3 size={12} /> Your own data</span>
              <span><Check size={12} /> No demo data</span>
            </div>
            <button className="foodie-black-btn foodie-hero-btn" onClick={() => onAuth("signup")}>View my finances <ArrowUpRight size={14} /></button>
            <div className="foodie-author">
              <div className="foodie-avatar">CF</div>
              <div><b>Your financial workspace</b><span>Built around the numbers you enter.</span></div>
            </div>
          </div>
          <div className="foodie-hero-photo">
            <img src={photos.hero} alt="Freelancer organizing receipts and finances at a desk" />
            <div className="foodie-photo-stamp"><Check size={11} /><span>FINANCE<br />MADE CALM</span></div>
          </div>
        </section>

        <section className="foodie-section foodie-categories foodie-reveal" id="categories">
          <div className="foodie-section-head">
            <h2>Categories</h2>
            <button className="foodie-outline-btn" onClick={() => onAuth("signup")}>View all features</button>
          </div>
          <div className="foodie-category-grid">
            {categoryData.map(([icon, title, image, tone]) => (
              <button className={"foodie-category-card foodie-reveal-item " + tone} key={title} onClick={() => onAuth("signup")}>
                <span className="foodie-category-image"><img src={image} alt="" /></span>
                <span className="foodie-category-icon"><Icon name={icon} /></span>
                <b>{title}</b>
              </button>
            ))}
          </div>
        </section>

        <section className="foodie-section foodie-reveal" id="recipes">
          <div className="foodie-centered-head">
            <h2>Simple and useful finance</h2>
            <p>Understand cash, invoices and planning with the same clean visual flow from one screen to the next.</p>
          </div>
          <div className="foodie-recipe-grid">
            {cards.map(([image, title, tag, text, time], index) => (
              <article className="foodie-recipe-card foodie-reveal-item" key={title}>
                <div className="foodie-recipe-image">
                  <button className="foodie-recipe-open" onClick={() => onAuth("signup")} aria-label={"Open " + title}>
                    <img src={image} alt="" />
                  </button>
                </div>
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

        <section className="foodie-chef foodie-reveal" id="about">
          <div className="foodie-chef-copy">
            <h2>Everyone can be a CFO in their own business</h2>
            <p>You do the work. Freelancer CFO turns your real numbers into a clear picture of cash, reserves, invoices and runway — so the next decision feels simpler.</p>
            <button className="foodie-black-btn" onClick={() => onAuth("signup")}>Learn more <ArrowRight size={14} /></button>
          </div>
          <div className="foodie-chef-photo">
            <img src={photos.desk} alt="Professional working through financial information" />
            <div className="foodie-overlay-card one"><Icon name="mdi:shield-check-outline" /><b>Safe to spend</b><span>After your reserves.</span></div>
            <div className="foodie-overlay-card two"><Icon name="mdi:chart-line" /><b>Runway</b><span>See the months ahead.</span></div>
          </div>
        </section>

        <section className="foodie-section foodie-instagram foodie-reveal" id="ai">
          <div className="foodie-centered-head">
            <h2>Check out @freelancerCFO</h2>
            <p>Cash, invoices, reserves and runway — presented with the same calm visual rhythm throughout your workspace.</p>
          </div>
          <div className="foodie-instagram-grid">
            {[
              [photos.desk, "Cash", "Know what is available."],
              [photos.hero, "Invoices", "Know what is due."],
              [photos.notes, "Reserves", "Know what stays protected."],
              [photos.planner, "Runway", "Know what comes next."],
            ].map(([image, title, text]) => (
              <button className="foodie-instagram-tile foodie-reveal-item" key={title} onClick={() => onAuth("signup")} aria-label={"Open " + title}>
                <img src={image} alt="" />
                <div className="foodie-instagram-caption"><b>{title}</b><span>{text}</span></div>
              </button>
            ))}
          </div>
          <button className="foodie-outline-btn foodie-center-btn" onClick={() => onAuth("signup")}>Open your workspace</button>
        </section>

        <section className="foodie-newsletter foodie-reveal">
          <div>
            <h2>Clarity to your <br />inbox.</h2>
            <p>Product updates, practical finance notes and new tools for independent professionals.</p>
          </div>
          <form className={"foodie-newsletter-form " + (subscribed ? "is-subscribed" : "")} onSubmit={submitNewsletter}>
            {!subscribed ? (
              <>
                <input type="email" placeholder="Your email address..." aria-label="Email address" required value={newsletterEmail} onChange={event => setNewsletterEmail(event.target.value)} />
                <button className="foodie-black-btn" type="submit">Subscribe <ArrowRight size={13} /></button>
              </>
            ) : (
              <div className="foodie-newsletter-success"><Check size={14} /> You're on the list.</div>
            )}
          </form>
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
