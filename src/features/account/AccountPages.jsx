import { useState } from "react";
import { ArrowRight, CircleHelp, CreditCard, FileText, LockKeyhole, Mail, ShieldCheck, Bell, Check } from "lucide-react";
import { Button, Head } from "../components/ui/Primitives";
import { isUserFeatureEnabled } from "../pricing";

export function Billing({ user, setPage }) {
  const isPro = user?.plan === "pro";
  return <div className="page">
    <Head eyebrow="Account" title="Billing" text="Review your current plan and the features available to this account." action={<Button icon={CreditCard} onClick={() => setPage?.("pricing")}>View pricing</Button>} />
    <div className="billing-grid">
      <section className="card billing-card">
        <div className="billing-top"><span className="eyebrow">Current plan</span><strong>{isPro ? "Individual Pro" : "Individual"}</strong><Badge tone="success">{isPro ? "Pro" : "Free"}</Badge></div>
        <p>{isPro ? "Advanced planning, runway and AI CFO tools are enabled for this account." : "Core finance tracking is available. Upgrade when you need forecasting, reserve planning, runway or AI CFO."}</p>
        <div className="billing-features">
          {[
            ["Cash dashboard", true],
            ["Transactions", true],
            ["Invoices", true],
            ["Cash Flow", isUserFeatureEnabled(user, "cashflow")],
            ["Tax Reserve", isUserFeatureEnabled(user, "tax")],
            ["Runway", isUserFeatureEnabled(user, "runway")],
            ["AI CFO", isUserFeatureEnabled(user, "ai")],
          ].map(([label,enabled]) => <span key={label} className={enabled ? "enabled" : "disabled"}><Check size={13} />{label}</span>)}
        </div>
        {!isPro && <button className="public-primary" onClick={() => setPage?.("pricing")}>Review Pro</button>}
      </section>
      <section className="card billing-card">
        <div className="settings-title"><CreditCard size={18} /><div><h3>Subscription status</h3><p>Plan billing is currently managed at the product level.</p></div></div>
        <div className="billing-status-row"><span>Status</span><b>Active</b></div>
        <div className="billing-status-row"><span>Account</span><b>{user?.email}</b></div>
        <div className="billing-note"><LockKeyhole size={14} /> Online payment processing can be connected here without changing the finance workspace.</div>
      </section>
    </div>
  </div>;
}

export function Notifications({ finance, overdue, setPage }) {
  const notices = [];
  if (overdue?.length) notices.push({title:"Invoice follow-up needed",text:overdue.length+" invoice(s) are overdue.",tone:"warning",action:"invoices"});
  if (finance?.runwayMonths < 6) notices.push({title:"Runway below target",text:"Your current runway is below the 6-month planning target.",tone:"danger",action:"runway"});
  if (finance?.additionalTaxReserve > 0) notices.push({title:"Tax reserve needs attention",text:"Your current reserve is below the estimated amount.",tone:"info",action:"tax"});
  if (!notices.length) notices.push({title:"No urgent notifications",text:"Your current finance workspace has no calculated alerts.",tone:"success",action:"dashboard"});

  return <div className="page">
    <Head eyebrow="Account" title="Notifications" text="Important finance and workspace events calculated from your account." />
    <section className="card notification-list">
      {notices.map((notice,index)=><button key={index} className="notification-row" onClick={() => setPage(notice.action)}>
        <span className={"notification-dot "+notice.tone}><Bell size={13}/></span>
        <span><b>{notice.title}</b><small>{notice.text}</small></span>
        <ArrowRight size={15}/>
      </button>)}
    </section>
  </div>;
}

export function Help() {
  const [open,setOpen]=useState(null);
  const questions = [
    ["How does Safe to Spend work?","It uses your recorded cash, tax reserve, upcoming expenses and emergency reserve to calculate a spending guardrail."],
    ["Who can see my finance records?","Your finance records are scoped to your account. Company administrators manage membership and onboarding but do not receive employee transactions or invoices through the company portal."],
    ["What does the AI CFO use?","The AI CFO receives finance context calculated by the server from your stored records and explains those results."],
    ["Is the tax reserve tax advice?","No. Tax Reserve is an estimate for planning and is not tax advice."],
  ];
  return <div className="page">
    <Head eyebrow="Support" title="Help center" text="Practical answers about the workspace, privacy and financial calculations." />
    <div className="help-grid">
      <section className="card"><div className="settings-title"><CircleHelp size={18}/><div><h3>Common questions</h3><p>Product guidance without the jargon.</p></div></div>
        <div className="faq-list">{questions.map(([q,a],i)=><div className="faq-item" key={q}><button onClick={()=>setOpen(open===i?null:i)}><span>{q}</span><span>{open===i?"−":"+"}</span></button>{open===i&&<p>{a}</p>}</div>)}</div>
      </section>
      <section className="card support-card"><Mail size={19}/><h3>Support</h3><p>For account, organization, billing or privacy requests, use the support channel configured for your deployment.</p><p className="support-note">Use the public Contact page to reach the support channel configured for this deployment.</p></section>
    </div>
  </div>;
}

export function PasswordResetInfo({ onAuth }) {
  return <div className="page"><Head eyebrow="Account security" title="Password recovery" text="Request a password reset from the login screen. Reset delivery is managed by the product deployment." action={<Button icon={ShieldCheck} onClick={() => onAuth?.("login")}>Return to login</Button>} /><section className="card support-card"><FileText size={19}/><h3>Need a reset?</h3><p>Use “Forgot password?” in the login window. For production, connect the deployment email provider so reset links can be delivered securely.</p></section></div>;
}

function Badge({children,tone="neutral"}){return <span className={"badge "+tone}>{children}</span>}
