import { ArrowUpRight, Globe, Info, LogIn, ShieldCheck, WalletCards } from "lucide-react";
import { userNavigation } from "../../app/navigation";

const sectionDescriptions = {
  dashboard: "A single view of cash position, safe-to-spend, receivables, runway and priority alerts.",
  transactions: "Record and review income and expenses, with search, categories and client details.",
  invoices: "Create invoices, follow payment status and prepare reminders for outstanding balances.",
  cashflow: "Review historical movement and a forecast based on your own transactions.",
  tax: "Plan a tax reserve using your own income and selected reserve assumptions.",
  runway: "Understand how long available cash may cover expenses and compare planning scenarios.",
  ai: "Ask finance questions grounded in the records and assumptions in your workspace.",
  settings: "Manage your profile and financial assumptions for calculations.",
  billing: "Review the plan associated with your workspace.",
  notifications: "Bring overdue invoices and important workspace alerts into one place.",
  help: "Find guidance for using the Freelancer CFO workspace.",
};

function Brand() {
  return <div className="brand"><span className="brand-mark"><WalletCards size={17} /></span>Freelancer CFO</div>;
}

export default function GuestWorkspace({ page, setPage, onSignIn, onWebsite }) {
  const active = userNavigation.find(([key]) => key === page) || userNavigation[0];
  const SectionIcon = active[2];
  const modules = userNavigation.filter(([key]) => key !== "dashboard");

  return <div className="app-shell guest-workspace">
    <aside className="sidebar">
      <Brand />
      <nav aria-label="Workspace preview navigation">
        {userNavigation.map(([key, label, Icon]) => (
          <button
            key={key}
            type="button"
            className={page === key ? "active" : ""}
            onClick={() => setPage(key)}
            aria-current={page === key ? "page" : undefined}
          >
            <Icon size={15} />{label}
          </button>
        ))}
      </nav>
      <div className="workspace">
        <span className="avatar">G</span>
        <div><b>Guest preview</b><small>Temporary access</small></div>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <b>{active[1]}</b>
        <div className="top-actions">
          <span className="guest-status"><ShieldCheck size={13} /> Preview mode</span>
          <button type="button" className="button secondary guest-site-button" onClick={onWebsite}><Globe size={14} /> Website</button>
          <button type="button" className="button primary" onClick={onSignIn}><LogIn size={14} /> Sign in</button>
        </div>
      </header>

      <div className="content">
        <div className="guest-preview-notice" role="status">
          <Info size={17} />
          <div>
            <strong>Temporary preview — authentication is being skipped.</strong>
            <p>No financial records or demo figures are loaded. Data entry and account-backed actions remain unavailable until the database connection is restored.</p>
          </div>
        </div>

        {page === "dashboard" ? (
          <div className="page">
            <div className="hero-row">
              <div>
                <p className="eyebrow">Freelancer CFO / Workspace preview</p>
                <h1>Explore your workspace</h1>
                <p>Browse the product areas while sign-in and database connectivity are being addressed. Your financial values are intentionally left blank rather than replaced with sample data.</p>
              </div>
            </div>

            <section className="card guest-preview-overview">
              <div className="section-head">
                <div><h2>Your workspace, ready for your data</h2><p>Each section remains available to explore.</p></div>
                <ShieldCheck size={19} />
              </div>
              <p>Once authentication and MongoDB are available, these sections can load the records tied to your account. Preview mode does not create an account, save records, or make up financial numbers.</p>
              <div className="guest-preview-actions">
                <button type="button" className="button primary" onClick={onSignIn}>Open sign-in <ArrowUpRight size={14} /></button>
                <button type="button" className="button secondary" onClick={onWebsite}>Back to website</button>
              </div>
            </section>

            <div className="guest-module-grid">
              {modules.map(([key, label, Icon]) => (
                <button type="button" className="guest-module-card" key={key} onClick={() => setPage(key)}>
                  <span className="guest-module-icon"><Icon size={17} /></span>
                  <span className="guest-module-title">{label}</span>
                  <span className="guest-module-description">{sectionDescriptions[key]}</span>
                  <span className="guest-module-open">Explore section <ArrowUpRight size={13} /></span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="page">
            <div className="hero-row">
              <div>
                <p className="eyebrow">Workspace preview</p>
                <h1>{active[1]}</h1>
                <p>{sectionDescriptions[page] || "Explore this area of Freelancer CFO."}</p>
              </div>
            </div>
            <section className="card guest-empty-panel">
              <div className="guest-empty-icon"><SectionIcon size={21} /></div>
              <h2>No account data loaded</h2>
              <p>This section is open in temporary preview mode. Real records are not available because authentication is being skipped and the database connection needs attention. No placeholder financial figures have been added.</p>
              <div className="guest-preview-actions">
                <button type="button" className="button secondary" onClick={() => setPage("dashboard")}>Back to overview</button>
                <button type="button" className="button primary" onClick={onSignIn}>Open sign-in</button>
              </div>
            </section>
            <section className="card guest-section-details">
              <div className="section-head"><div><h3>What belongs here</h3><p>{active[1]}</p></div><SectionIcon size={18} /></div>
              <p>{sectionDescriptions[page] || "Product tools and workspace controls."}</p>
            </section>
          </div>
        )}
      </div>
    </main>

    <nav className="mobile-nav" aria-label="Mobile workspace preview navigation">
      {userNavigation.slice(0, 5).map(([key, label, Icon]) => (
        <button type="button" className={page === key ? "active" : ""} key={key} onClick={() => setPage(key)}>
          <Icon size={16} /><span>{label.split(" ")[0]}</span>
        </button>
      ))}
    </nav>
  </div>;
}
