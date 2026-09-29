import { useEffect, useState } from "react";
import { Building2, Check, Copy, LayoutDashboard, LogOut, Mail, Menu, Settings, ShieldCheck, Sparkles, Trash2, Users, UserRound, X } from "lucide-react";
import { api } from "./api";

const sections = [
  ["overview", "Overview", LayoutDashboard],
  ["team", "Team", Users],
  ["invites", "Invitations", Mail],
  ["settings", "Company settings", Settings],
];

function Badge({ children, tone = "neutral" }) { return <span className={"badge " + tone}>{children}</span>; }
function Button({ children, onClick, variant = "primary", icon: Icon, type = "button" }) {
  return <button type={type} className={"button " + variant} onClick={onClick}>{Icon && <Icon size={14} />}{children}</button>;
}
function Metric({ label, value, text, icon: Icon }) {
  return <div className="kpi-card"><div className="kpi-top"><span>{label}</span><span className="icon-box"><Icon size={15} /></span></div><strong>{value}</strong><small>{text}</small></div>;
}
function Empty({ title, text }) {
  return <div className="empty-state"><div className="empty-icon"><Sparkles size={16} /></div><h3>{title}</h3><p>{text}</p></div>;
}

export default function CompanyPortal({ user, onLogout }) {
  const [page, setPage] = useState("overview");
  const [sidebar, setSidebar] = useState(false);
  const [data, setData] = useState(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const notify = message => {
    setToast(message);
    window.clearTimeout(window.__companyToast);
    window.__companyToast = window.setTimeout(() => setToast(null), 2600);
  };

  async function load() {
    try {
      const result = await api.companyOverview();
      setData(result);
      setCompanyName(result.company.name);
    } catch (error) {
      notify(error.message);
    }
  }

  useEffect(() => { load(); }, []);

  if (!data) {
    return <div className="auth-shell"><div className="auth-card"><div className="brand"><span className="brand-mark"><Building2 size={16} /></span>Company workspace</div><p>Loading your company workspace…</p></div></div>;
  }

  async function invite() {
    if (!inviteEmail.trim()) return notify("Enter an email address");
    try {
      const result = await api.inviteCompanyUser(inviteEmail);
      setModal({ type: "invite", invite: result.invite });
      setInviteEmail("");
      await load();
    } catch (error) {
      notify(error.message);
    }
  }

  async function removeMember(id) {
    try {
      await api.removeCompanyMember(id);
      await load();
      notify("Member removed from company");
    } catch (error) {
      notify(error.message);
    }
  }

  async function revokeInvite(id) {
    try {
      await api.revokeCompanyInvite(id);
      await load();
      notify("Invitation revoked");
    } catch (error) {
      notify(error.message);
    }
  }

  async function saveCompany() {
    try {
      const result = await api.updateCompanyProfile(companyName);
      setData(prev => ({ ...prev, company: { ...prev.company, ...result.company } }));
      notify("Company profile saved");
    } catch (error) {
      notify(error.message);
    }
  }

  const progress = data.metrics.totalUsers ? Math.round(data.metrics.onboardedUsers / data.metrics.totalUsers * 100) : 0;

  return <div className="app-shell company-shell">
    <aside className={"sidebar " + (sidebar ? "open" : "")}>
      <div className="brand"><span className="brand-mark"><Building2 size={16} /></span>Company CFO</div>
      <div className="workspace"><span className="avatar"><Building2 size={15} /></span><div><b>{data.company.name}</b><small>{data.company.plan} plan</small></div></div>
      <nav>{sections.map(([key, label, Icon]) => <button key={key} className={page === key ? "active" : ""} onClick={() => { setPage(key); setSidebar(false); }}><Icon size={15} />{label}</button>)}</nav>
      <div className="sidebar-bottom"><button onClick={onLogout}><LogOut size={16} />Logout</button></div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setSidebar(!sidebar)}><Menu size={19} /></button>
        <b>{sections.find(row => row[0] === page)?.[1]}</b>
        <div className="top-actions"><span className="company-role-pill"><ShieldCheck size={12} />Admin</span><span className="top-avatar">{String(user?.name || "").slice(0, 2).toUpperCase()}</span></div>
      </header>

      <div className="content">
        {page === "overview" && <div className="page">
          <div className="hero-row"><div><p className="eyebrow">Company workspace</p><h1>{data.company.name}</h1><p>Manage your customer workspace, users, seats, and account health from one operational view.</p></div><Button icon={Users} onClick={() => setPage("team")}>Manage team</Button></div>
          <div className="kpi-grid">
            <Metric label="Users" value={data.metrics.totalUsers} text="Active company members" icon={Users} />
            <Metric label="Onboarding" value={progress + "%"} text="Members with finance setup complete" icon={Check} />
            <Metric label="Pending invites" value={data.metrics.pendingInvites} text="Invitations awaiting signup" icon={Mail} />
            <Metric label="Available seats" value={data.metrics.availableSeats} text={"Out of " + data.company.seatLimit + " seats"} icon={ShieldCheck} />
          </div>
          <div className="company-grid">
            <section className="card"><div className="section-head"><div><h3>Team health</h3><p>User onboarding status</p></div></div>{data.members.length ? data.members.slice(0, 5).map(member => <div className="member-row" key={member._id}><span className="member-avatar">{String(member.name).slice(0, 1).toUpperCase()}</span><div><b>{member.name}</b><small>{member.email}</small></div><Badge tone={member.onboardingComplete ? "success" : "warning"}>{member.onboardingComplete ? "Ready" : "Setup needed"}</Badge></div>) : <Empty title="No users yet" text="Invite your first user to start the company workspace." />}</section>
            <section className="card"><div className="section-head"><div><h3>Plan</h3><p>Current company capacity</p></div><Badge tone="success">{data.company.plan}</Badge></div><div className="plan-card"><strong>{data.metrics.totalUsers} / {data.company.seatLimit}</strong><span>Seats used</span><div className="mini-bar"><i style={{ width: Math.min(100, data.metrics.totalUsers / data.company.seatLimit * 100) + "%" }} /></div></div><Button variant="secondary" onClick={() => setPage("settings")}>Company settings</Button></section>
          </div>
        </div>}

        {page === "team" && <div className="page"><div className="hero-row"><div><p className="eyebrow">People</p><h1>Team</h1><p>Control company membership and onboarding readiness.</p></div><Button icon={Mail} onClick={() => setModal({ type: "invite" })}>Invite user</Button></div><section className="card"><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Profession</th><th>Onboarding</th><th>Joined</th><th /></tr></thead><tbody>{data.members.map(member => <tr key={member._id}><td>{member.name}</td><td>{member.email}</td><td>{member.profession || "—"}</td><td><Badge tone={member.onboardingComplete ? "success" : "warning"}>{member.onboardingComplete ? "Complete" : "Pending"}</Badge></td><td>{new Date(member.createdAt).toLocaleDateString("en-IN")}</td><td><button className="table-action" title="Remove" onClick={() => removeMember(member._id)}><Trash2 size={14} /></button></td></tr>)}</tbody></table></div>{!data.members.length && <Empty title="No team members" text="Invite a user to create the first company membership." />}</section></div>}

        {page === "invites" && <div className="page"><div className="hero-row"><div><p className="eyebrow">Access</p><h1>Invitations</h1><p>Invite users without exposing one user's financial data to another.</p></div><Button icon={Mail} onClick={() => setModal({ type: "invite" })}>Create invite</Button></div><section className="card"><div className="invoice-list">{data.pendingInvites.map(invite => <div className="invoice-row" key={invite._id}><div className="invoice-main"><span className="invoice-logo"><Mail size={13} /></span><div><b>{invite.email}</b><small>Expires {new Date(invite.expiresAt).toLocaleDateString("en-IN")}</small></div></div><Badge tone="due">Pending</Badge><div className="invoice-actions"><button onClick={() => revokeInvite(invite._id)} title="Revoke"><Trash2 size={14} /></button></div></div>)}{!data.pendingInvites.length && <Empty title="No pending invitations" text="Create an invitation for a new company user." />}</div></section></div>}

        {page === "settings" && <div className="page"><div className="hero-row"><div><p className="eyebrow">Company</p><h1>Settings</h1><p>Update the company workspace identity and review account capacity.</p></div><Button icon={Check} onClick={saveCompany}>Save changes</Button></div><div className="settings-grid"><section className="card settings-card"><div className="settings-title"><Building2 size={18} /><div><h3>Company profile</h3><p>Visible to company members.</p></div></div><label>Company name<input value={companyName} onChange={e => setCompanyName(e.target.value)} /></label><label>Plan<input value={data.company.plan} readOnly /></label><label>Seat limit<input value={data.company.seatLimit} readOnly /></label></section><section className="card settings-card"><div className="settings-title"><UserRound size={18} /><div><h3>Admin</h3><p>Current company administrator.</p></div></div><label>Name<input value={user?.name || ""} readOnly /></label><label>Email<input value={user?.email || ""} readOnly /></label></section></div></div>}
      </div>
    </main>

    {modal?.type === "invite" && <div className="modal-backdrop" onMouseDown={() => setModal(null)}><form className="modal" onMouseDown={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); if (modal.invite) return; invite(); }}>
      <div className="modal-head"><div><p className="eyebrow">Company access</p><h3>{modal.invite ? "Invitation ready" : "Invite a user"}</h3></div><button type="button" onClick={() => setModal(null)}><X size={17} /></button></div>
      {!modal.invite ? <><p className="modal-note">The invite is for access to your company workspace. Financial records remain private to each user.</p><label>Email<input type="email" required value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="user@company.com" /></label><div className="modal-actions"><Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button><Button type="submit" icon={Mail}>Create invite</Button></div></> : <><p className="modal-note">Share this invitation link with the intended user.</p><div className="invite-link">{window.location.origin + modal.invite.inviteUrl}<button type="button" onClick={() => { navigator.clipboard?.writeText(window.location.origin + modal.invite.inviteUrl); notify("Invite link copied"); }}><Copy size={13} /></button></div><div className="modal-actions"><Button onClick={() => setModal(null)}>Done</Button></div></>}
    </form></div>}

    {toast && <div className="toast"><Check size={14} />{toast}</div>}
  </div>;
}
