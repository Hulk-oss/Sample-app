import { WalletCards } from "lucide-react";

export function Badge({ children, tone = "neutral" }) {
  return <span className={"badge " + tone}>{children}</span>;
}

export function Button({ children, onClick, variant = "primary", icon: Icon, type = "button", disabled = false }) {
  return <button type={type} className={"button " + variant} onClick={onClick} disabled={disabled}>
    {Icon && <Icon size={14} />} {children}
  </button>;
}

export function Kpi({ label, value, sub, icon: Icon, tone = "" }) {
  return <div className={"kpi-card " + tone}>
    <div className="kpi-top"><span>{label}</span><span className="icon-box"><Icon size={15} /></span></div>
    <strong>{value}</strong><small>{sub}</small>
  </div>;
}

export function EmptyState({ title, text, action }) {
  return <div className="empty-state"><div className="empty-icon"><WalletCards size={16} /></div><h3>{title}</h3><p>{text}</p>{action}</div>;
}

export function ChartCard({ title, subtitle, children, action }) {
  return <section className="card chart-card">
    <div className="section-head"><div><h3>{title}</h3><p>{subtitle}</p></div>{action}</div>
    {children}
  </section>;
}

export function Head({ eyebrow, title, text, action }) {
  return <div className="hero-row">
    <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{text}</p></div>
    {action}
  </div>;
}
