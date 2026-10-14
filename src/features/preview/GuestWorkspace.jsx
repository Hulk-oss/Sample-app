import { useState } from "react";
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, Bot, CalendarDays,
  Check, ChevronRight, CircleHelp, CreditCard, FileText, Globe, Info, LockKeyhole, LogIn,
  Mail, ReceiptText, Search, Settings, ShieldCheck, Sparkles, Target, Users, Wallet,
  WalletCards
} from "lucide-react";
import { userNavigation } from "../../app/navigation";
import { featureLabels, getRequiredPlanName, isUserFeatureEnabled } from "../../pricing";

const sectionDescriptions = {
  dashboard: "Your financial picture, bringing cash, reserves, receivables and runway together.",
  transactions: "A clear ledger for income and expenses, organized by client, date and category.",
  invoices: "Create and track invoices, monitor due dates and keep follow-ups organized.",
  cashflow: "Follow historical cash movement and understand what may be coming next.",
  tax: "Keep your estimated tax reserve visible beside the money available to use.",
  runway: "Compare your available cash with the pace of your expenses.",
  ai: "Explore finance questions that can be answered from your own records.",
  settings: "Manage the profile and assumptions used by your finance workspace.",
  billing: "See how plan access is organized across individual and organization tiers.",
  notifications: "Keep important account events and financial follow-ups in view.",
  help: "Practical guidance on the workspace and the calculations it provides."
};

const visualImages = {
  dashboard: "https://images.unsplash.com/photo-1635186238046-40771478f17e?auto=format&fit=crop&q=85&w=1200",
  transactions: "https://images.unsplash.com/photo-1643395274037-6f0f86878aeb?auto=format&fit=crop&q=85&w=1200",
  invoices: "https://images.unsplash.com/photo-1758876020967-e5a80e49463a?auto=format&fit=crop&q=85&w=1200",
  cashflow: "https://miro.medium.com/v2/da%3Atrue/resize%3Afit%3A1200/0%2A2X3l0hm_1eGh5NWX",
  tax: "https://sanchisasesores.com/wp-content/uploads/2025/11/Gemini_Generated_Image_xj9iurxj9iurxj9i.png",
  runway: "https://assets.sc.hager.com/en-tr/-/media/project/hagerdeep/turkey/hager/turkey/003-inspiration-knowledge/iak-learning/aa-doorpage/learning03_landscape.jpg?h=720&hash=1E390EC61990AB7B3D66391BEA54B222&la=en&w=1080",
  ai: "https://assets.mondiatechnologies.com/images/Blog/entrepreneur-working-laptop.jpeg",
  settings: "https://images.unsplash.com/photo-1635186238046-40771478f17e?auto=format&fit=crop&q=85&w=1200",
};

function Brand() {
  return <div className="brand"><span className="brand-mark"><WalletCards size={17} /></span>Freelancer CFO</div>;
}

function PageHero({ eyebrow, title, description, image, tag, action }) {
  return <section className="guest-editorial-hero">
    <div className="guest-editorial-copy">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="guest-hero-description">{description}</p>
      {action && <div className="guest-editorial-action">{action}</div>}
    </div>
    <div className="guest-editorial-image">
      <img src={image || visualImages.dashboard} alt="" />
      {tag && <span className="guest-image-label"><Sparkles size={12} />{tag}</span>}
    </div>
  </section>;
}

function PreviewNotice({ locked, requiredPlan, onPricing }) {
  return <div className={"guest-preview-notice " + (locked ? "is-locked" : "")} role="status">
    {locked ? <LockKeyhole size={17} /> : <Info size={17} />}
    <div>
      <strong>{locked ? "Premium feature preview" : "Temporary preview mode"}</strong>
      <p>{locked
        ? "This feature is part of " + requiredPlan + ". You're viewing its layout only; the feature is not active and no account data is loaded."
        : "Authentication is temporarily skipped. Real account records and saved actions will appear when the database connection is available."}</p>
      {locked && <button type="button" className="guest-inline-link" onClick={onPricing}>Compare plans <ArrowRight size={13} /></button>}
    </div>
  </div>;
}

function MetricCard({ icon: Icon, label, detail }) {
  return <div className="guest-metric-card">
    <span className="guest-metric-icon"><Icon size={17} /></span>
    <span className="guest-metric-label">{label}</span>
    <strong>—</strong>
    <small>{detail}</small>
  </div>;
}

function EmptyPanel({ icon: Icon = WalletCards, title, detail, action, onAction }) {
  return <div className="guest-empty-panel">
    <span className="guest-empty-icon"><Icon size={21} /></span>
    <h2>{title}</h2>
    <p>{detail}</p>
    {action && <button type="button" className="button primary" onClick={onAction}>{action} <ArrowRight size={14} /></button>}
  </div>;
}

function DashboardPage({ onPricing, onSignIn, setPage }) {
  return <div className="guest-page-stack">
    <PageHero eyebrow="Your financial workspace" title="Make the next move with clarity." description="A calm, connected view of the numbers that guide your business. The layout is ready; financial values will stay blank until real account data is available." image={visualImages.dashboard} tag="FINANCE, IN FOCUS" action={<button className="button primary" onClick={onSignIn}>Sign in to your workspace <ArrowRight size={14} /></button>} />
    <div className="guest-metric-grid">
      <MetricCard icon={Wallet} label="Cash balance" detail="Available cash from your records" />
      <MetricCard icon={ShieldCheck} label="Safe to spend" detail="After reserves and planned outflows" />
      <MetricCard icon={ReceiptText} label="Receivables" detail="Unpaid invoices" />
      <MetricCard icon={Target} label="Runway" detail="Months at your current expense pace" />
    </div>
    <div className="guest-section-title"><div><p className="eyebrow">Explore the workspace</p><h2>Every tool has a clear purpose.</h2></div><button className="guest-inline-link" onClick={onPricing}>Compare plans <ArrowRight size={13} /></button></div>
    <div className="guest-feature-grid">
      {[
        ["transactions", "Transactions", "Keep income and expenses organized.", ReceiptText],
        ["invoices", "Invoices", "Track what you've billed and what's due.", FileText],
        ["cashflow", "Cash Flow", "See movement over time and look ahead.", Activity],
        ["tax", "Tax Reserve", "Separate estimated tax money from spendable cash.", ShieldCheck],
        ["runway", "Runway", "Understand the time your cash can support.", Target],
        ["ai", "AI CFO", "Ask questions grounded in your finance records.", Bot],
      ].map(([key, label, detail, Icon]) => <button type="button" className="guest-feature-card" key={key} onClick={() => setPage(key)}>
        <span className="guest-feature-icon"><Icon size={17} /></span><strong>{label}</strong><p>{detail}</p><span className="guest-feature-link">Explore <ArrowUpRight size={13} /></span>
      </button>)}
    </div>
  </div>;
}

function TransactionsPage({ onSignIn }) {
  return <div className="guest-page-stack">
    <PageHero eyebrow="Money in and out" title="A ledger that stays clear." description="Organize each payment and expense by date, client and category, then use the records to inform your wider financial picture." image={visualImages.transactions} tag="TRANSACTION HISTORY" />
    <div className="guest-metric-grid guest-metric-grid-three">
      <MetricCard icon={ArrowDownRight} label="Income" detail="Recorded incoming payments" />
      <MetricCard icon={ArrowUpRight} label="Expenses" detail="Recorded business outflows" />
      <MetricCard icon={Activity} label="Net movement" detail="Income less expenses" />
    </div>
    <section className="guest-content-card">
      <div className="guest-content-card-head"><div><p className="eyebrow">Your ledger</p><h2>Transactions</h2><p>Search and filter your own records.</p></div><button type="button" className="button primary" onClick={onSignIn}>Sign in to add records <ArrowRight size={14} /></button></div>
      <div className="guest-search-placeholder"><Search size={15} /><span>Search description, client or category</span></div>
      <div className="guest-table-scroll"><table className="guest-table"><thead><tr>{["Date","Description","Client","Category","Type","Amount"].map(x=><th key={x}>{x}</th>)}</tr></thead></table></div>
      <EmptyPanel icon={ReceiptText} title="Your ledger is waiting for your records" detail="No sample transactions are shown. Once connected, your own income and expenses will appear here." action="Sign in to continue" onAction={onSignIn} />
    </section>
  </div>;
}

function InvoicesPage({ onSignIn }) {
  return <div className="guest-page-stack">
    <PageHero eyebrow="Accounts receivable" title="Keep every invoice moving." description="Create a clear trail from invoice issue to payment. Due dates and follow-ups help you understand when revenue is likely to arrive." image={visualImages.invoices} tag="INVOICE CONTROL" />
    <div className="guest-status-strip"><span><i className="status-dot neutral" />Draft</span><span><i className="status-dot blue" />Sent</span><span><i className="status-dot amber" />Due soon</span><span><i className="status-dot green" />Paid</span><span><i className="status-dot red" />Overdue</span></div>
    <div className="guest-metric-grid guest-metric-grid-three">
      <MetricCard icon={FileText} label="Total invoiced" detail="From invoices you create" />
      <MetricCard icon={CalendarDays} label="Due soon" detail="Invoices approaching due date" />
      <MetricCard icon={Check} label="Collected" detail="Invoices marked as paid" />
    </div>
    <section className="guest-content-card">
      <div className="guest-content-card-head"><div><p className="eyebrow">Billing workflow</p><h2>Invoice register</h2><p>Keep client billing easy to review.</p></div><button type="button" className="button primary" onClick={onSignIn}>Create invoice <ArrowRight size={14} /></button></div>
      <div className="guest-table-scroll"><table className="guest-table"><thead><tr>{["Invoice","Client","Issue date","Due date","Status","Amount"].map(x=><th key={x}>{x}</th>)}</tr></thead></table></div>
      <EmptyPanel icon={FileText} title="No invoices loaded" detail="Your register will show your own invoices and payment status after the account connection is restored." action="Open workspace" onAction={onSignIn} />
    </section>
  </div>;
}

function CashFlowPage({ onPricing }) {
  return <div className="guest-page-stack">
    <PageHero eyebrow="Look ahead" title="See the cash story, not just the balance." description="Cash flow brings monthly movement and a forward view into one place, helping you plan for uneven income and upcoming outflows." image={visualImages.cashflow} tag="HISTORY + FORECAST" />
    <div className="guest-flow-illustration">
      <div className="guest-flow-label-row"><div><p className="eyebrow">Forecast workspace</p><h2>Cash flow over time</h2></div><span className="guest-preview-chip"><Activity size={12} /> Layout preview</span></div>
      <div className="guest-flow-steps"><div><span>01</span><b>Recorded income</b><p>Payments entered in your ledger.</p></div><ChevronRight size={17}/><div><span>02</span><b>Planned outflows</b><p>Expenses and commitments.</p></div><ChevronRight size={17}/><div><span>03</span><b>Projected balance</b><p>Forward view based on your records.</p></div></div>
      <p className="guest-illustration-caption">No chart values are generated in preview mode.</p>
    </div>
    <div className="guest-metric-grid guest-metric-grid-three"><MetricCard icon={ArrowDownRight} label="Monthly inflow" detail="Based on recorded income"/><MetricCard icon={ArrowUpRight} label="Monthly outflow" detail="Based on recorded expenses"/><MetricCard icon={Wallet} label="Projected balance" detail="Forecast ending position"/></div>
    <div className="guest-upsell-row"><div><LockKeyhole size={18}/><div><strong>Included in Individual Pro and Organization Growth or higher</strong><p>Paid feature access must be active on the account to use the forecast.</p></div></div><button className="button primary" onClick={onPricing}>Compare plans <ArrowRight size={14}/></button></div>
  </div>;
}

function TaxPage({ onPricing }) {
  return <div className="guest-page-stack">
    <PageHero eyebrow="Protect your reserves" title="Separate tax money before you spend." description="Keep estimated tax reserves visible as a distinct part of your cash plan, using the assumptions and income records you provide." image={visualImages.tax} tag="PLANNING WITH GUARDRAILS" />
    <div className="guest-reserve-layout">
      <section className="guest-reserve-card"><span className="guest-reserve-icon"><ShieldCheck size={19}/></span><p className="eyebrow">Reserve overview</p><h2>Tax reserve</h2><strong>—</strong><p>Calculated when your finance profile and actual records are available.</p><div className="guest-reserve-line"><span>Relevant income base</span><b>Not calculated</b></div><div className="guest-reserve-line"><span>Reserve rate</span><b>Not configured</b></div><div className="guest-reserve-line"><span>Additional amount needed</span><b>Not calculated</b></div></section>
      <section className="guest-content-card"><p className="eyebrow">Keep the calculation transparent</p><h2>What informs your reserve?</h2><div className="guest-check-list"><span><Check size={14}/> Income base entered into your profile</span><span><Check size={14}/> Tax reserve rate you choose</span><span><Check size={14}/> Tax amount already marked as reserved</span><span><Check size={14}/> A clear estimate disclaimer</span></div><p className="guest-small-note">This feature provides estimates for planning, not tax advice.</p></section>
    </div>
    <div className="guest-upsell-row"><div><LockKeyhole size={18}/><div><strong>Included in Individual Pro and Organization Growth or higher</strong><p>This is a read-only layout preview until the account has an eligible plan and connected data.</p></div></div><button className="button primary" onClick={onPricing}>Compare plans <ArrowRight size={14}/></button></div>
  </div>;
}

function RunwayPage({ onPricing }) {
  return <div className="guest-page-stack">
    <PageHero eyebrow="Plan for resilience" title="Know how much time your cash can buy." description="Runway turns available cash and your expense pace into a planning view, with scenarios that help you think beyond a single forecast." image={visualImages.runway} tag="SCENARIO PLANNING" />
    <div className="guest-metric-grid guest-metric-grid-three"><MetricCard icon={Wallet} label="Available cash" detail="After applicable reserves"/><MetricCard icon={CalendarDays} label="Monthly expense pace" detail="From your records and assumptions"/><MetricCard icon={Target} label="Current runway" detail="Calculated in months"/></div>
    <section className="guest-content-card"><div className="guest-content-card-head"><div><p className="eyebrow">Planning scenarios</p><h2>Compare possible paths</h2><p>Each scenario uses your workspace assumptions, not sample amounts.</p></div></div><div className="guest-scenario-grid">{[["Current pace","Use your average recorded expenses."],["Income slows","Understand a more conservative outlook."],["No new income","Review the expenses-only case."]].map(([title,detail],i)=><article key={title} className="guest-scenario-card"><span>0{i+1}</span><h3>{title}</h3><p>{detail}</p><strong>Awaiting account data</strong></article>)}</div></section>
    <div className="guest-upsell-row"><div><LockKeyhole size={18}/><div><strong>Included in Individual Pro and Organization Growth or higher</strong><p>Scenarios are unavailable without an eligible plan and workspace data.</p></div></div><button className="button primary" onClick={onPricing}>Compare plans <ArrowRight size={14}/></button></div>
  </div>;
}

function AICfoPage({ onPricing }) {
  return <div className="guest-page-stack">
    <PageHero eyebrow="Financial questions, in context" title="Ask better questions about your numbers." description="The AI CFO experience is designed to explain financial patterns using the records stored in your workspace, rather than generic examples." image={visualImages.ai} tag="AI CFO" />
    <section className="guest-ai-panel"><div className="guest-ai-heading"><span><Bot size={19}/></span><div><p className="eyebrow">AI CFO assistant</p><h2>Start with a useful question.</h2><p>Suggestions below are prompts only. No AI answer is generated in preview mode.</p></div></div><div className="guest-prompt-grid">{["How much cash is safe to spend?","What is changing my runway?","Which invoices need attention?","How much should I reserve for tax?"].map(prompt=><button key={prompt} onClick={onPricing} type="button"><span>{prompt}</span><ArrowUpRight size={14}/></button>)}</div><div className="guest-ai-compose"><span>Ask a question about your finances…</span><button type="button" onClick={onPricing}><LockKeyhole size={14}/> Preview only</button></div></section>
    <div className="guest-upsell-row"><div><LockKeyhole size={18}/><div><strong>AI CFO is included in Individual Pro and Organization Scale</strong><p>Responses require an eligible account and your actual finance context.</p></div></div><button className="button primary" onClick={onPricing}>Compare plans <ArrowRight size={14}/></button></div>
  </div>;
}

function SettingsPage({ onSignIn }) {
  return <div className="guest-page-stack">
    <PageHero eyebrow="Personalize your workspace" title="Set the assumptions behind your view." description="A good finance workspace should make its assumptions visible, understandable and easy to review." image={visualImages.settings} tag="WORKSPACE SETTINGS" />
    <div className="guest-settings-grid"><section className="guest-content-card"><div className="guest-setting-head"><span><Users size={17}/></span><div><h2>Profile</h2><p>Name, profession and account details.</p></div></div><div className="guest-setting-row"><span>Account profile</span><b>Not connected</b></div><div className="guest-setting-row"><span>Workspace type</span><b>Individual / organization</b></div></section><section className="guest-content-card"><div className="guest-setting-head"><span><Target size={17}/></span><div><h2>Financial assumptions</h2><p>Inputs that help explain your position.</p></div></div><div className="guest-setting-row"><span>Monthly income target</span><b>Not configured</b></div><div className="guest-setting-row"><span>Monthly expense baseline</span><b>Not configured</b></div><div className="guest-setting-row"><span>Reserve preferences</span><b>Not configured</b></div></section></div>
    <button type="button" className="button primary guest-standalone-action" onClick={onSignIn}>Sign in to manage settings <ArrowRight size={14}/></button>
  </div>;
}

function BillingPage({ onPricing }) {
  return <div className="guest-page-stack">
    <PageHero eyebrow="Plans and access" title="The right tools for your stage." description="Feature access is based on the plan assigned to an account. The cards below summarize what belongs to each tier; this preview does not activate a paid subscription." image={visualImages.dashboard} tag="PLAN OVERVIEW" />
    <div className="guest-plan-summary"><div><p className="eyebrow">Current preview</p><h2>Individual — Free</h2><p>Core finance tracking. Paid features remain locked in the preview.</p></div><span className="guest-preview-chip"><ShieldCheck size={12}/> Not a paid subscription</span></div>
    <div className="guest-plan-grid">{[
      ["Individual","₹0","Dashboard, Transactions, Invoices","Core tracking"],
      ["Individual Pro","₹499 / month","Cash Flow, Tax Reserve, Runway, AI CFO","Advanced planning"],
      ["Organization Starter","₹1,999 / month","Company workspace, members, invitations","5 seats"],
      ["Organization Growth / Scale","₹4,999 / month and custom","Growth adds forecasting and planning; Scale adds AI CFO","25 / 100 seats"],
    ].map(([name,price,features,caption])=><article className="guest-plan-card" key={name}><p className="eyebrow">{caption}</p><h3>{name}</h3><strong>{price}</strong><p>{features}</p><span><LockKeyhole size={13}/> Entitlement follows verified plan assignment</span></article>)}</div>
    <div className="guest-upsell-row"><div><CreditCard size={18}/><div><strong>Checkout is not enabled in this deployment</strong><p>Plan descriptions are visible, but selecting a paid price must not grant premium access until payment verification is connected.</p></div></div><button className="button primary" onClick={onPricing}>View full pricing <ArrowRight size={14}/></button></div>
  </div>;
}

function NotificationsPage() {
  return <div className="guest-page-stack"><PageHero eyebrow="Stay on top of the important things" title="The right alert, at the right time." description="Your notifications surface finance events that need attention, such as overdue invoices, runway pressure or reserve gaps." image={visualImages.invoices} tag="ACCOUNT NOTIFICATIONS"/><div className="guest-content-card"><div className="guest-content-card-head"><div><p className="eyebrow">Inbox</p><h2>Recent activity</h2><p>Only events calculated from your own workspace appear here.</p></div><Bell size={18}/></div><EmptyPanel icon={Bell} title="No account notifications" detail="There are no account events to display in preview mode. We do not create sample alerts." /></div></div>;
}

function HelpPage() {
  const [open, setOpen] = useState(0);
  const questions = [
    ["Where do the dashboard numbers come from?","Dashboard values are calculated from the cash, income, expenses, invoices and assumptions saved to your own workspace. This preview does not show sample financial amounts."],
    ["Which plan includes Cash Flow and Runway?","Individual Pro and Organization Growth or Scale include Cash Flow and Runway according to the product plan matrix."],
    ["When is AI CFO available?","AI CFO is included in Individual Pro and Organization Scale. It uses finance context from the signed-in workspace."],
    ["Can I use the preview to save my financial records?","No. Preview mode is for navigating and reviewing layouts. Account-backed actions require authentication and a working database connection."],
  ];
  return <div className="guest-page-stack"><PageHero eyebrow="Help center" title="A clearer answer, without the clutter." description="Guidance for the workspace, plan access and the way finance calculations are presented." image={visualImages.settings} tag="PRODUCT GUIDE"/><div className="guest-help-grid"><section className="guest-content-card"><p className="eyebrow">Frequently asked questions</p><h2>Common questions</h2><div className="guest-faq-list">{questions.map(([q,a],i)=><div className="guest-faq-item" key={q}><button onClick={()=>setOpen(open===i?-1:i)}><span>{q}</span><strong>{open===i?"−":"+"}</strong></button>{open===i&&<p>{a}</p>}</div>)}</div></section><section className="guest-help-side"><span><CircleHelp size={19}/></span><h3>Need a hand?</h3><p>Support details can be configured in the deployment. The Help Center remains available here for product guidance.</p></section></div></div>;
}

export default function GuestWorkspace({ page, setPage, onSignIn, onWebsite }) {
  const active = userNavigation.find(([key]) => key === page) || userNavigation[0];
  const entitledPages = { plan: "free" };
  const previewUser = { plan: entitledPages.plan };
  const locked = !isUserFeatureEnabled(previewUser, active[0]);
  const requiredPlan = getRequiredPlanName(previewUser, active[0]);
  const onPricing = () => onWebsite?.("pricing");
  const navigate = key => setPage(key);
  const modules = userNavigation.filter(([key]) => key !== "dashboard");

  const pageContent = {
    dashboard: <DashboardPage onPricing={onPricing} onSignIn={onSignIn} setPage={navigate}/>,
    transactions: <TransactionsPage onSignIn={onSignIn}/>,
    invoices: <InvoicesPage onSignIn={onSignIn}/>,
    cashflow: <CashFlowPage onPricing={onPricing}/>,
    tax: <TaxPage onPricing={onPricing}/>,
    runway: <RunwayPage onPricing={onPricing}/>,
    ai: <AICfoPage onPricing={onPricing}/>,
    settings: <SettingsPage onSignIn={onSignIn}/>,
    billing: <BillingPage onPricing={onPricing}/>,
    notifications: <NotificationsPage/>,
    help: <HelpPage/>,
  };

  return <div className="app-shell guest-workspace">
    <aside className="sidebar">
      <Brand />
      <div className="guest-sidebar-caption">WORKSPACE</div>
      <nav aria-label="Workspace preview navigation">
        {userNavigation.map(([key, label, Icon]) => {
          const isLocked = !isUserFeatureEnabled(previewUser, key);
          return <button key={key} type="button" className={page === key ? "active" : ""} onClick={() => navigate(key)} aria-current={page === key ? "page" : undefined}>
            <Icon size={15}/><span>{label}</span>{isLocked && <LockKeyhole className="guest-nav-lock" size={12}/>}
          </button>;
        })}
      </nav>
      <div className="guest-sidebar-plan"><p>YOUR PREVIEW</p><strong>Individual Free</strong><span>Upgrade to explore more features</span><button type="button" onClick={onPricing}>Compare plans <ArrowRight size={12}/></button></div>
      <div className="workspace"><span className="avatar">G</span><div><b>Guest preview</b><small>Temporary access</small></div></div>
    </aside>

    <main className="main">
      <header className="topbar guest-topbar">
        <div className="guest-breadcrumb"><span>Freelancer CFO</span><ChevronRight size={13}/><b>{active[1]}</b></div>
        <div className="top-actions"><span className="guest-status"><ShieldCheck size={13}/> Preview mode</span><button type="button" className="button secondary guest-site-button" onClick={()=>onWebsite?.() }><Globe size={14}/> Website</button><button type="button" className="button primary" onClick={()=>onSignIn?.("login")}><LogIn size={14}/> Sign in</button></div>
      </header>

      <div className="content guest-content">
        {locked && <PreviewNotice locked requiredPlan={requiredPlan} onPricing={onPricing}/>}
        {pageContent[page] || pageContent.dashboard}
        <footer className="guest-workspace-footer"><span>© 2026 Freelancer CFO</span><span>Private by design · Preview only</span></footer>
      </div>
    </main>

    <nav className="mobile-nav" aria-label="Mobile workspace preview navigation">
      {userNavigation.slice(0,5).map(([key,label,Icon])=><button type="button" className={page===key?"active":""} key={key} onClick={()=>navigate(key)}><Icon size={16}/><span>{label.split(" ")[0]}</span></button>)}
    </nav>
  </div>;
}
