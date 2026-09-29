import { ArrowLeft, Check, Mail, ShieldCheck, Users, WalletCards } from "lucide-react";

const individualPlans = [
  {
    id:"free",
    name:"Individual",
    price:"₹0",
    period:"forever",
    description:"A private starting point for independent professionals.",
    features:["Dashboard and cash position","Transactions and invoices","Basic financial profile","Personal workspace"],
    action:"Start free",
  },
  {
    id:"pro",
    name:"Individual Pro",
    price:"₹499",
    period:"per month",
    description:"Advanced planning and decision support for growing independent businesses.",
    features:["Everything in Individual","Cash-flow forecast","Tax reserve planning","Runway scenarios","AI CFO analysis"],
    action:"Start Pro",
  },
];

const organizationPlans = [
  {
    id:"starter",
    name:"Organization Starter",
    price:"₹1,999",
    period:"per month",
    description:"A professional workspace for small teams.",
    features:["Up to 5 employee seats","Employee invitations","Onboarding status","Company settings","Team administration"],
    action:"Start organization",
  },
  {
    id:"growth",
    name:"Organization Growth",
    price:"₹4,999",
    period:"per month",
    description:"More seats and stronger operational controls for growing teams.",
    features:["Up to 25 employee seats","Everything in Starter","Priority onboarding workflows","Advanced team administration","Expanded workspace capacity"],
    action:"Start organization",
  },
  {
    id:"scale",
    name:"Organization Scale",
    price:"Custom",
    period:"for your organization",
    description:"Enterprise-style capacity for larger organizations and custom requirements.",
    features:["Up to 100 employee seats by default","Custom capacity","Organization controls","Dedicated implementation path","Custom commercial agreement"],
    action:"Contact us",
  },
];

function Shell({ title, intro, active, onNavigate, children, onBack }) {
  const links = [["about","About us"],["pricing","Pricing"],["privacy","Privacy"],["security","Security"],["terms","Terms"],["contact","Contact"]];
  return <div className="public-page">
    <header className="public-page-header">
      <button className="public-brand" onClick={onBack}><span><WalletCards size={15} /></span>Freelancer CFO</button>
      <nav>{links.map(([id,label]) => <button key={id} className={active===id ? "active" : ""} onClick={() => onNavigate(id)}>{label}</button>)}</nav>
      <button className="public-back" onClick={onBack}><ArrowLeft size={14} /> Home</button>
    </header>
    <main className="public-page-content">
      <p className="eyebrow">{title}</p>
      <h1>{intro}</h1>
      {children}
    </main>
    <footer className="public-page-footer">
      <span>© 2026 Freelancer CFO</span>
      <span>Private by design</span>
    </footer>
  </div>;
}

export default function PublicPages({ page, onNavigate, onBack, onAuth }) {
  if(page === "pricing") {
    return <Shell title="Pricing" intro="Choose the workspace that matches how you work." active="pricing" onNavigate={onNavigate} onBack={onBack}>
      <div className="pricing-switch-copy">
        <p>Individual plans are designed for one professional. Organization plans are designed for a company managing employee access, seats and onboarding.</p>
      </div>
      <section className="pricing-group">
        <div className="pricing-group-head"><div><h2>For individuals</h2><p>Use your own account and your own financial records.</p></div><WalletCards size={20} /></div>
        <div className="pricing-grid">{individualPlans.map(plan => <article className="pricing-card" key={plan.id}>
          <div className="pricing-card-top"><span className="pricing-label">{plan.name}</span><strong>{plan.price}</strong><small>{plan.period}</small></div>
          <p>{plan.description}</p>
          <div className="pricing-features">{plan.features.map(feature => <span key={feature}><Check size={14} />{feature}</span>)}</div>
          <button className="public-primary" onClick={() => { localStorage.setItem("cfo_selected_plan", plan.id); onAuth("signup"); }}>{plan.action}</button>
        </article>)}</div>
      </section>
      <section className="pricing-group">
        <div className="pricing-group-head"><div><h2>For organizations</h2><p>Manage employee access and company operations from a dedicated admin workspace.</p></div><Users size={20} /></div>
        <div className="pricing-grid pricing-grid-three">{organizationPlans.map(plan => <article className="pricing-card" key={plan.id}>
          <div className="pricing-card-top"><span className="pricing-label">{plan.name}</span><strong>{plan.price}</strong><small>{plan.period}</small></div>
          <p>{plan.description}</p>
          <div className="pricing-features">{plan.features.map(feature => <span key={feature}><Check size={14} />{feature}</span>)}</div>
          <button className="public-primary" onClick={() => { localStorage.setItem("cfo_selected_company_plan", plan.id); onAuth("company"); }}>{plan.action}</button>
        </article>)}</div>
      </section>
    </Shell>;
  }

  if(page === "about") {
    return <Shell title="About us" intro="Freelancer CFO is built around a simple idea: financial software should make decisions clearer, not noisier." active="about" onNavigate={onNavigate} onBack={onBack}>
      <div className="public-copy-grid">
        <section><h2>Built for real numbers</h2><p>Every dashboard value is based on the data entered into the account. There is no sample finance history presented as if it belongs to you.</p></section>
        <section><h2>Built for people and teams</h2><p>Individuals get a private finance workspace. Organizations get a separate operational layer for employees, seats, invitations and onboarding.</p></section>
        <section><h2>Built to stay understandable</h2><p>Cash, invoices, reserves, runway and AI explanations stay connected to the underlying finance records instead of becoming another isolated reporting tool.</p></section>
      </div>
    </Shell>;
  }

  if(page === "privacy") {
    return <Shell title="Privacy policy" intro="Your financial workspace belongs to the account that created it." active="privacy" onNavigate={onNavigate} onBack={onBack}>
      <div className="legal-copy">
        <h2>Account data</h2><p>We use account information and financial records to provide the product features requested by that account. User financial records are scoped to the authenticated user.</p>
        <h2>Organization access</h2><p>Company administrators can manage company membership, invitations, seats and onboarding status. Employee financial records remain private to the employee account.</p>
        <h2>Privileged product access</h2><p>A designated platform owner account can access customer and organization records for product administration, support and development. Privileged inspections are authenticated and recorded in an administrative audit trail.</p>
        <h2>Security</h2><p>Passwords are stored as hashes, protected APIs use signed authentication tokens, and company operations are scoped to the authenticated organization.</p>
        <h2>Data requests</h2><p>Use the contact page to request account assistance, data correction or account deletion.</p>
      </div>
    </Shell>;
  }

  if(page === "security") {
    return <Shell title="Security" intro="Security controls are part of the product architecture, not an afterthought." active="security" onNavigate={onNavigate} onBack={onBack}>
      <div className="public-copy-grid">
        <section><ShieldCheck size={22} /><h2>Authentication</h2><p>Protected API routes use signed authentication tokens and role-based middleware.</p></section>
        <section><ShieldCheck size={22} /><h2>Data isolation</h2><p>Financial queries are scoped to the authenticated user. Organization queries are scoped to the authenticated company.</p></section>
        <section><ShieldCheck size={22} /><h2>Operations</h2><p>Company invitations expire, membership changes are persisted, and production configuration is validated rather than silently falling back to local resources.</p></section>
      </div>
    </Shell>;
  }

  if(page === "terms") {
    return <Shell title="Terms" intro="A clear baseline for using the Freelancer CFO platform." active="terms" onNavigate={onNavigate} onBack={onBack}>
      <div className="legal-copy">
        <h2>Use of the product</h2><p>You are responsible for the accuracy of the information entered into your workspace and for protecting your account credentials.</p>
        <h2>Financial information</h2><p>Tax reserve calculations and planning outputs are estimates for product use and are not tax, legal or investment advice.</p>
        <h2>Organizations</h2><p>Organization administrators are responsible for managing invitations, seats and employee access appropriately.</p>
      </div>
    </Shell>;
  }

  return <Shell title="Contact" intro="Need account, billing, privacy or organization help?" active="contact" onNavigate={onNavigate} onBack={onBack}>
    <div className="contact-card">
      <div><Mail size={22} /><h2>Product support</h2><p>For account, billing, organization or privacy requests, contact the product support address configured for your deployment.</p></div>
      <button className="public-primary" onClick={() => onAuth("login")}>Open your workspace</button>
    </div>
  </Shell>;
}
