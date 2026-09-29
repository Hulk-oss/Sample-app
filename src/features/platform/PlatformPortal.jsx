import { useEffect, useState } from "react";
import { Building2, Database, Eye, LogOut, Search, ShieldCheck, Users, WalletCards } from "lucide-react";
import { api } from "../../api";
import { Button, Kpi } from "../../components/ui/Primitives";

export default function PlatformPortal({ user, onLogout }) {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [finance, setFinance] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      const [summary, userData, companyData] = await Promise.all([
        api.adminOverview(),
        api.adminUsers(),
        api.adminCompanies(),
      ]);
      setOverview(summary.metrics);
      setUsers(userData.users);
      setCompanies(companyData.companies);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 30000);
    return () => window.clearInterval(timer);
  }, []);

  async function inspectUser(id) {
    try {
      setSelectedUser(id);
      setFinance(await api.adminUserFinance(id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (!overview) {
    return <div className="auth-shell"><div className="auth-card"><div className="brand"><span className="brand-mark"><ShieldCheck size={16} /></span>Platform owner</div><p>{error || "Loading product administration…"}</p></div></div>;
  }

  const filteredUsers = users.filter(item => {
    const value = [item.name, item.email, item.role, item.plan].join(" ").toLowerCase();
    return value.includes(query.toLowerCase());
  });

  return <div className="app-shell platform-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><ShieldCheck size={16} /></span>Product Admin</div>
      <div className="workspace"><span className="avatar"><ShieldCheck size={15} /></span><div><b>{user?.name || "Owner"}</b><small>Platform owner</small></div></div>
      <nav>
        <button className="active"><Database size={15} />Overview</button>
        <button onClick={() => document.getElementById("platform-users")?.scrollIntoView({behavior:"smooth"})}><Users size={15} />Users</button>
        <button onClick={() => document.getElementById("platform-companies")?.scrollIntoView({behavior:"smooth"})}><Building2 size={15} />Organizations</button>
      </nav>
      <div className="sidebar-bottom"><button onClick={onLogout}><LogOut size={16} />Logout</button></div>
    </aside>

    <main className="main">
      <header className="topbar"><b>Platform administration</b><div className="top-actions"><span className="company-role-pill"><ShieldCheck size={12} />Owner access</span></div></header>
      <div className="content">
        <div className="page">
          <div className="hero-row"><div><p className="eyebrow">Developer control plane</p><h1>Product overview</h1><p>Privileged operational access to accounts, organizations and stored finance records.</p></div><Button icon={Search} onClick={load}>Refresh data</Button></div>

          <section className="card platform-warning"><ShieldCheck size={18} /><div><b>Privileged access</b><p>This workspace can inspect customer and organization data. Keep this role limited to trusted product owners and maintain appropriate access controls.</p></div></section>

          <div className="kpi-grid">
            <Kpi label="Users" value={overview.users} sub="All platform accounts" icon={Users} />
            <Kpi label="Organizations" value={overview.companies} sub="Created workspaces" icon={Building2} />
            <Kpi label="Transactions" value={overview.transactions} sub="Stored finance records" icon={Database} />
            <Kpi label="Invoices" value={overview.invoices} sub="Stored billing records" icon={WalletCards} />
          </div>

          <section className="card" id="platform-users">
            <div className="section-head"><div><h3>Users</h3><p>Account identity, plan and organization membership.</p></div><div className="search"><Search size={14} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search users..." /></div></div>
            <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Plan</th><th>Onboarding</th><th>Finance</th></tr></thead><tbody>
              {filteredUsers.map(item => <tr key={item._id}><td>{item.name}</td><td>{item.email}</td><td>{item.role}</td><td>{item.plan || "free"}</td><td>{item.onboardingComplete ? "Complete" : "Pending"}</td><td><button className="table-action" title="Inspect finance" onClick={() => inspectUser(item._id)}><Eye size={14} /></button></td></tr>)}
            </tbody></table></div>
          </section>

          <section className="card" id="platform-companies">
            <div className="section-head"><div><h3>Organizations</h3><p>Plan, seats and employee count.</p></div></div>
            <div className="table-wrap"><table><thead><tr><th>Company</th><th>Plan</th><th>Members</th><th>Seat limit</th><th>Status</th></tr></thead><tbody>
              {companies.map(item => <tr key={item._id}><td>{item.name}</td><td>{item.plan}</td><td>{item.memberCount}</td><td>{item.seatLimit}</td><td>{item.status}</td></tr>)}
            </tbody></table></div>
          </section>
        </div>
      </div>
    </main>

    {finance && <div className="modal-backdrop" onMouseDown={() => { setFinance(null); setSelectedUser(null); }}><div className="modal" onMouseDown={e => e.stopPropagation()}>
      <div className="modal-head"><div><p className="eyebrow">Owner inspection</p><h3>{finance.user.name}</h3></div><button onClick={() => { setFinance(null); setSelectedUser(null); }}>×</button></div>
      <p className="modal-note">{finance.user.email} · {finance.user.role} · {finance.user.plan || "free"}</p>
      {finance.dashboard && <div className="kpi-grid"><Kpi label="Cash" value={"₹" + Number(finance.dashboard.cashBalance || 0).toLocaleString("en-IN")} sub="Stored finance context" icon={WalletCards} /><Kpi label="Receivables" value={"₹" + Number(finance.dashboard.receivables || 0).toLocaleString("en-IN")} sub="Outstanding invoices" icon={WalletCards} /></div>}
      <div className="owner-record-list"><b>Transactions: {finance.transactions.length}</b><b>Invoices: {finance.invoices.length}</b><span>Profile: {finance.profile ? "Configured" : "Not configured"}</span></div>
    </div></div>}
  </div>;
}
