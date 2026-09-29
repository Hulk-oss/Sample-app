import { useEffect, useState } from "react";
import {
  Activity, AlertCircle, ArrowDownRight, ArrowUpRight, Bell, Bot, CalendarDays, Check,
  ChevronDown, CircleHelp, FileText, LogOut, Menu, MessageSquare, Plus, Search,
  Send, Settings as SettingsIcon, ShieldCheck, Target, TrendingDown, TrendingUp, Trash2, UserRound, Wallet,
  WalletCards, X
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import { calculateRunway, calculateSafeToSpend, calculateTaxReserve, formatFullINR, formatINR } from "./finance";
import { api } from "./api";
import CompanyPortal from "./features/company/CompanyPortal";
import PlatformPortal from "./features/platform/PlatformPortal";
import LandingPage from "./LandingPage";
import PublicPages from "./pages/PublicPages";
import Auth from "./features/auth/Auth";
import { userNavigation as nav } from "./app/navigation";
import { filterUserNavigation, isUserFeatureEnabled } from "./pricing";
import { Badge, Button, ChartCard, EmptyState, Head, Kpi } from "./components/ui/Primitives";
import { Billing, Help, Notifications } from "./features/account/AccountPages";

const money = formatINR;

function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebar, setSidebar] = useState(false);
  const [auth, setAuth] = useState(Boolean(localStorage.getItem("cfo_token")));
  const [authOpen, setAuthOpen] = useState(false);
  const [publicPage, setPublicPage] = useState(null);
  const [onboard, setOnboard] = useState(false);
  const [user, setUser] = useState(null);
  const [finance, setFinance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [cashData, setCashData] = useState([]);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const notify = message => {
    setToast(message);
    window.clearTimeout(window.__cfoToast);
    window.__cfoToast = window.setTimeout(() => setToast(null), 2400);
  };

  async function loadWorkspace() {
    if (!localStorage.getItem("cfo_token")) return;
    setLoading(true);
    try {
      const me = await api.me();
      setUser({ ...me.user, companyPlan: me.company?.plan || null });
      if (me.user.role === "company_admin") { setOnboard(false); return; }
      if (!me.user.onboardingComplete || !me.profile) {
        setOnboard(true);
        return;
      }
      const canUseCashFlow = isUserFeatureEnabled({ ...me.user, companyPlan: me.company?.plan || null }, "cashflow");
      const [dashboard, tx, inv, cashFlow] = await Promise.all([
        api.dashboard(),
        api.transactions(),
        api.invoices(),
        canUseCashFlow ? api.cashFlow() : Promise.resolve({ actual: [], forecast: [] }),
      ]);
      setFinance(dashboard.dashboard);
      setTransactions(tx.transactions);
      setInvoices(inv.invoices);
      setCashData([
        ...(cashFlow.actual || []),
        ...(cashFlow.forecast || []).map(row => ({ ...row, month: row.month + " est." })),
      ]);
      setOnboard(false);
    } catch (error) {
      api.logout();
      setAuth(false);
      setFinance(null);
      notify(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (auth) loadWorkspace();
  }, [auth]);

  async function finishOnboarding(values) {
    try {
      await api.onboarding(values);
      setOnboard(false);
      await loadWorkspace();
      notify("Your financial workspace is ready");
    } catch (error) {
      notify(error.message);
    }
  }

  function logout() {
    api.logout();
    setAuth(false);
    setUser(null);
    setFinance(null);
    setTransactions([]);
    setInvoices([]);
    setCashData([]);
  }

  function addTransaction() { setModal({ type: "transaction" }); }

  async function markPaid(id) {
    try {
      const result = await api.markInvoicePaid(id);
      setInvoices(rows => rows.map(row => (row._id || row.id) === id ? result.invoice : row));
      await loadWorkspace();
      notify("Invoice marked paid");
    } catch (error) {
      notify(error.message);
    }
  }

  if (!auth) {
    if (publicPage) {
      return <PublicPages
        page={publicPage}
        onNavigate={setPublicPage}
        onBack={() => setPublicPage(null)}
        onAuth={mode => { setPublicPage(null); setAuthOpen(mode); }}
      />;
    }
    return <>
      <LandingPage
        onAuth={mode => setAuthOpen(mode)}
        onNavigate={setPublicPage}
      />
      {authOpen && <Auth initialMode={authOpen} close={() => setAuthOpen(false)} setAuth={setAuth} onAuthenticated={loadWorkspace} notify={notify} />}
    </>;
  }
  if (user?.role === "platform_owner") return <PlatformPortal user={user} onLogout={logout} />;
  if (user?.role === "company_admin") return <CompanyPortal user={user} onLogout={logout} />;
  if (onboard || !finance) {
    if (loading && user && !onboard) {
      return <div className="auth-shell"><div className="auth-card"><div className="brand"><span className="brand-mark"><WalletCards size={16} /></span>Freelancer CFO</div><p>Loading your private workspace…</p></div></div>;
    }
    return <Onboarding finish={finishOnboarding} />;
  }

  const overdue = invoices.filter(row => row.status === "Overdue");
  const common = {
    finance, user, transactions, invoices, overdue, cashData, live: true,
    setPage, notify, reload: loadWorkspace, loading
  };
  const activeNav = filterUserNavigation(nav, user);

  return <div className="app-shell">
    <aside className={"sidebar " + (sidebar ? "open" : "")}>
      <div className="brand"><span className="brand-mark"><WalletCards size={17} /></span>Freelancer CFO</div>
      <div className="workspace">
        <span className="avatar">{String(user?.name || "").slice(0, 2).toUpperCase()}</span>
        <div><b>{user?.name}</b><small>{user?.profession || "Independent"}</small></div>
        <ChevronDown size={13} />
      </div>
      <nav>{activeNav.map(([key, label, Icon]) =>
        <button className={page === key ? "active" : ""} key={key} onClick={() => { setPage(key); setSidebar(false); }}>
          <Icon size={15} />{label}{key === "ai" && <i />}
        </button>
      )}</nav>
      <div className="sidebar-bottom"><button><CircleHelp size={16} />Help</button><button onClick={logout}><LogOut size={16} />Logout</button></div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setSidebar(!sidebar)}><Menu size={19} /></button>
        <b>{activeNav.find(row => row[0] === page)?.[1] || "Overview"}</b>
        <div className="top-actions">
          <select><option>90 days</option><option>This month</option><option>6 months</option></select>
          <button className="icon-button"><Bell size={15} /><i /></button>
          <span className="top-avatar">{String(user?.name || "").slice(0, 2).toUpperCase()}</span>
        </div>
      </header>

      <div className="content">
        {page === "dashboard" && <Dashboard {...common} />}
        {page === "transactions" && <Transactions data={transactions} query={query} setQuery={setQuery} add={addTransaction} setModal={setModal} reload={loadWorkspace} notify={notify} />}
        {page === "invoices" && <Invoices data={invoices} markPaid={markPaid} setModal={setModal} reload={loadWorkspace} notify={notify} />}
        {page === "cashflow" && <CashFlow data={cashData} />}
        {page === "tax" && <TaxReserve finance={finance} reload={loadWorkspace} notify={notify} />}
        {page === "runway" && <Runway finance={finance} />}
        {page === "ai" && <AICFO finance={finance} overdue={overdue} invoices={invoices} notify={notify} />}
        {page === "settings" && <Settings user={user} finance={finance} reload={loadWorkspace} notify={notify} />}
        {page === "billing" && <Billing user={user} setPage={setPage} />}
        {page === "notifications" && <Notifications finance={finance} overdue={overdue} setPage={setPage} />}
        {page === "help" && <Help />}
      </div>
    </main>

    <div className="mobile-nav">{activeNav.slice(0, 5).map(([key, label, Icon]) =>
      <button className={page === key ? "active" : ""} key={key} onClick={() => setPage(key)}>
        <Icon size={16} /><span>{label.split(" ")[0]}</span>
      </button>
    )}</div>

    {modal?.type === "transaction" && <TransactionModal close={() => setModal(null)} notify={notify} reload={loadWorkspace} transaction={modal.transaction} />}
    {modal?.type === "invoice" && <InvoiceModal close={() => setModal(null)} notify={notify} reload={loadWorkspace} invoice={modal.invoice} />}
    {modal?.type === "reminder" && <Reminder invoice={modal.invoice} close={() => setModal(null)} notify={notify} />}
    {toast && <div className="toast"><Check size={14} />{toast}</div>}
  </div>;
}

function Dashboard({ finance, user, transactions, overdue, cashData, setPage }) {
  const pct = finance.cashBalance > 0 ? Math.min(100, finance.safeToSpend / finance.cashBalance * 100) : 0;
  const upcoming = finance.upcomingExpenses > 0;
  const alerts = [];
  if (finance.overdueCount > 0) alerts.push({ tone: "warning", title: "Overdue invoices", text: finance.overdueCount + " invoice(s) need attention." });
  if (finance.runwayMonths < 6) alerts.push({ tone: "danger", title: "Runway target", text: "Your current runway is below the 6-month target." });
  if (finance.additionalTaxReserve > 0) alerts.push({ tone: "info", title: "Tax reserve", text: money(finance.additionalTaxReserve) + " is needed to reach the current estimate." });

  return <div className="page">
    <Head eyebrow={new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} title={"Good morning, " + (user?.name || "")} text="A private financial view built entirely from your own account data." action={<Button icon={Plus} onClick={() => setPage("transactions")}>Add transaction</Button>} />

    <div className="kpi-grid">
      <Kpi label="Cash Balance" value={money(finance.cashBalance)} sub="Available from your records" icon={Wallet} />
      <Kpi label="Safe to Spend" value={money(finance.safeToSpend)} sub="After reserves & planned outflows" icon={Wallet} />
      <Kpi label="Receivables" value={money(finance.receivables)} sub="Outstanding invoices" icon={ReceiptText} />
      <Kpi label="Runway" value={finance.runwayMonths.toFixed(1) + " mo"} sub="Target 6 months" icon={Target} tone={finance.runwayMonths < 6 ? "warning" : ""} />
    </div>

    <div className="dashboard-grid">
      <section className="card safe-card">
        <div className="safe-copy">
          <div className="section-head">
            <div><p className="eyebrow">Your financial guardrail</p><h2>Safe to spend</h2><p>What you can use without touching planned reserves.</p></div>
            <Badge tone="success">Live</Badge>
          </div>
          <div className="safe-number">{money(finance.safeToSpend)}</div>
          <div className="safe-progress"><i style={{ width: pct + "%" }} /></div>
          <div className="safe-meta"><span>{pct.toFixed(0)}% of current cash</span><button onClick={() => setPage("runway")}>Explore scenarios →</button></div>
        </div>
        <div className="formula">
          <div>Cash<strong>{money(finance.cashBalance)}</strong></div><b>−</b>
          <div>Tax reserve<strong>{money(finance.taxReserve)}</strong></div><b>−</b>
          <div>Upcoming<strong>{money(finance.upcomingExpenses)}</strong></div><b>−</b>
          <div>Emergency<strong>{money(finance.emergencyReserve)}</strong></div><b>=</b>
          <div className="result">Safe to spend<strong>{money(finance.safeToSpend)}</strong></div>
        </div>
      </section>

      <ChartCard title="Cash balance" subtitle="Calculated from your own transaction history" action={<Badge>90 day view</Badge>}>
        {cashData.length ? <CashChart data={cashData} /> : <EmptyState title="No cash-flow data yet" text="Add transactions to build your cash history." />}
      </ChartCard>
    </div>

    <div className="three-grid">
      <ChartCard title="Income vs expenses" subtitle="Your recorded activity">
        {transactions.length ? <BarChartSmall data={cashData} /> : <EmptyState title="No transactions yet" text="Your first income or expense will appear here." />}
      </ChartCard>
      <section className="card"><div className="section-head"><div><h3>Upcoming expenses</h3><p>Next 30 days</p></div><CalendarDays size={16} /></div>
        {upcoming ? <div className="row"><div><b>Planned expenses</b><small>Next 30 days</small></div><strong>{money(finance.upcomingExpenses)}</strong></div> : <EmptyState title="Nothing scheduled" text="No expenses are recorded for the next 30 days." />}
      </section>
      <section className="card"><div className="section-head"><div><h3>Needs attention</h3><p>Only from your account data</p></div><Bell size={16} /></div>
        {alerts.length ? alerts.map((row, i) => <div className="alert" key={i}><span className={row.tone}><AlertCircle size={13} /></span><div><b>{row.title}</b><small>{row.text}</small></div></div>) : <EmptyState title="Nothing urgent" text="No current alerts have been calculated." />}
      </section>
    </div>

    <section className="card ai-insight">
      <span className="ai-icon"><Bot size={18} /></span>
      <div><p className="eyebrow">AI CFO insight</p><h3>{overdue.length ? overdue.length + " invoice(s) need follow-up" : "Your workspace is ready"}</h3><p>{overdue.length ? money(overdue.reduce((a, row) => a + Number(row.amount), 0)) + " is outside the expected payment cycle." : "Add transactions and invoices to give the AI CFO real context to explain."}</p></div>
      <Button variant="secondary" onClick={() => setPage("ai")}>Ask AI CFO</Button>
    </section>
  </div>;
}

function CashChart({ data }) {
  return <ResponsiveContainer width="100%" height={245}><AreaChart data={data}><CartesianGrid stroke="#ebe7df" vertical={false} /><XAxis dataKey="month" stroke="#9a968d" tickLine={false} axisLine={false} /><YAxis stroke="#9a968d" tickLine={false} axisLine={false} tickFormatter={value => "₹" + Math.round(value / 100000) + "L"} width={38} /><Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e6e1d7", borderRadius: 12 }} formatter={value => formatFullINR(value)} /><Area dataKey="balance" type="monotone" stroke="#191816" fill="#f0eee8" fillOpacity={1} strokeWidth={2.5} /></AreaChart></ResponsiveContainer>;
}

function BarChartSmall({ data }) {
  return <ResponsiveContainer width="100%" height={200}><BarChart data={data}><CartesianGrid stroke="#ebe7df" vertical={false} /><XAxis dataKey="month" stroke="#9a968d" tickLine={false} axisLine={false} /><YAxis hide /><Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e6e1d7", borderRadius: 12 }} formatter={value => formatFullINR(value)} /><Bar dataKey="income" fill="#191816" radius={[8, 8, 0, 0]} /><Bar dataKey="expenses" fill="#c9c5bc" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer>;
}

function ListRow({ title, sub, value }) {
  return <div className="row"><div><b>{title}</b><small>{sub}</small></div><strong>{value}</strong></div>;
}

function Transactions({ data, query, setQuery, add, setModal, reload, notify }) {
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const categories = ["All", ...new Set(data.map(row => row.category).filter(Boolean))];
  const filtered = data.filter(row =>
    [row.description, row.client, row.category].join(" ").toLowerCase().includes(query.toLowerCase()) &&
    (typeFilter === "All" || row.type === typeFilter) &&
    (categoryFilter === "All" || row.category === categoryFilter)
  );
  const income = data.filter(row => row.type === "Income").reduce((a, row) => a + Number(row.amount), 0);
  const expense = data.filter(row => row.type === "Expense").reduce((a, row) => a + Number(row.amount), 0);

  async function remove(id) {
    try {
      await api.deleteTransaction(id);
      await reload();
      notify("Transaction deleted");
    } catch (error) { notify(error.message); }
  }

  return <div className="page">
    <Head eyebrow="Money in and out" title="Transactions" text="Every financial movement stays tied to the signed-in user." action={<Button icon={Plus} onClick={add}>Add transaction</Button>} />
    <div className="summary-grid"><Kpi label="Income" value={money(income)} sub="Your recorded period" icon={ArrowDownRight} /><Kpi label="Expenses" value={money(expense)} sub="Your recorded period" icon={ArrowUpRight} /><Kpi label="Net" value={money(income - expense)} sub="Income less expenses" icon={TrendingUp} /></div>
    <section className="card">
      <div className="toolbar">
        <div className="search"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search your transactions..." /></div>
        <div className="filters">
          <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}><option>All</option><option>Income</option><option>Expense</option></select>
          <select className="filter-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>{categories.map(category => <option key={category}>{category}</option>)}</select>
          <Button variant="secondary" onClick={() => { setQuery(""); setTypeFilter("All"); setCategoryFilter("All"); }}>Reset</Button>
        </div>
      </div>
      {filtered.length ? <DataTable headers={["Date", "Description", "Client", "Category", "Type", "Amount", "Actions"]} rows={filtered.map(row => [
        new Date(row.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        row.description, row.client || "—", row.category,
        <Badge tone={row.type === "Income" ? "success" : "neutral"}>{row.type}</Badge>, money(row.amount),
        <div className="table-actions"><button title="Edit" onClick={() => setModal({ type: "transaction", transaction: row })}>Edit</button><button title="Delete" onClick={() => remove(row._id || row.id)}>Delete</button></div>
      ])} /> : <EmptyState title="No transactions" text="Add your first income or expense to start building the financial history." action={<Button icon={Plus} onClick={add}>Add transaction</Button>} />}
    </section>
  </div>;
}
function DataTable({ headers, rows }) {
  return <div className="table-wrap"><table><thead><tr>{headers.map(header => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

function Invoices({ data, markPaid, setModal, reload, notify }) {
  const total = data.reduce((a, row) => a + Number(row.amount), 0);
  const paid = data.filter(row => row.status === "Paid").reduce((a, row) => a + Number(row.amount), 0);
  const overdue = data.filter(row => row.status === "Overdue").reduce((a, row) => a + Number(row.amount), 0);
  async function remove(id) {
    try { await api.deleteInvoice(id); await reload(); notify("Invoice deleted"); }
    catch (error) { notify(error.message); }
  }
  return <div className="page">
    <Head eyebrow="Accounts receivable" title="Invoices" text="Track the invoices that belong to your account." action={<Button icon={Plus} onClick={() => setModal({ type: "invoice" })}>Create invoice</Button>} />
    <div className="summary-grid"><Kpi label="Total invoiced" value={money(total)} sub={data.length + " invoices"} icon={FileText} /><Kpi label="Paid" value={money(paid)} sub="Collected" icon={Check} /><Kpi label="Outstanding" value={money(total - paid)} sub="Awaiting payment" icon={Wallet} /></div>
    <section className="card"><div className="section-head"><div><h3>Invoice register</h3><p>Your clients and payment status</p></div><Badge tone={overdue ? "warning" : "success"}>{overdue ? money(overdue) + " overdue" : "No overdue balance"}</Badge></div>
      {data.length ? <div className="invoice-list">{data.map(row => { const id = row._id || row.id; const invoiceNumber = row.invoiceNumber || row.id; return <div className="invoice-row" key={id}><div className="invoice-main"><span className="invoice-logo">{String(row.client).slice(0, 1).toUpperCase()}</span><div><b>{row.client}</b><small>{invoiceNumber} · Due {new Date(row.dueDate).toLocaleDateString("en-IN")}</small></div></div><strong>{money(row.amount)}</strong><Badge tone={String(row.status).toLowerCase()}>{row.status}</Badge><div className="invoice-actions"><button title="Edit" onClick={() => setModal({ type: "invoice", invoice: row })}><FileText size={14} /></button>{row.status !== "Paid" && <button title="Mark paid" onClick={() => markPaid(id)}><Check size={14} /></button>}<button title="Reminder draft" onClick={() => setModal({ type: "reminder", invoice: row })}><MessageSquare size={14} /></button><button title="Delete" onClick={() => remove(id)}><Trash2 size={14} /></button></div></div>; })}</div> : <EmptyState title="No invoices yet" text="Create your first invoice when you are ready to track receivables." />}
    </section>
  </div>;
}
function CashFlow({ data }) {
  const [mode, setMode] = useState("actual");
  const visible = mode === "actual" ? data.filter(row => !row.estimated) : data.filter(row => row.estimated);
  const projected = data.filter(row => row.estimated);
  const ending = projected.at(-1)?.balance ?? data.at(-1)?.balance ?? 0;
  const lowest = projected.length ? Math.min(...projected.map(row => row.balance)) : ending;
  const net = visible.reduce((a, row) => a + Number(row.income || 0), 0) - visible.reduce((a, row) => a + Number(row.expenses || 0), 0);
  return <div className="page"><Head eyebrow="Liquidity planning" title="Cash Flow" text="Historical movement and estimates generated from your own records." action={<div className="segmented"><button className={mode === "actual" ? "active" : ""} onClick={() => setMode("actual")}>Actual</button><button className={mode === "forecast" ? "active" : ""} onClick={() => setMode("forecast")}>Forecast</button></div>} />
    <div className="summary-grid"><Kpi label="Net cash flow" value={money(net)} sub={mode === "forecast" ? "Modeled" : "Recorded"} icon={Activity} /><Kpi label="Projected ending" value={money(ending)} sub="Estimated endpoint" icon={TrendingUp} /><Kpi label="Lowest projected" value={money(lowest)} sub="Forecast window" icon={TrendingDown} /></div>
    <ChartCard title="Balance trajectory" subtitle={mode === "forecast" ? "Estimated balances" : "Actual balances"} action={<Badge>{mode === "forecast" ? "Estimated" : "Actual"}</Badge>}>{visible.length ? <CashChart data={visible} /> : <EmptyState title="No forecast data" text="Add more financial activity to build a useful cash-flow forecast." />}</ChartCard>
    <div className="two-grid"><ChartCard title="Income / expenses" subtitle="Movement by month">{data.length ? <BarChartSmall data={data} /> : <EmptyState title="No activity yet" text="Your recorded monthly movement will appear here." />}</ChartCard><section className="card"><h3>Forecast notes</h3><div className="note-list"><p>✓ Actual rows are calculated from persisted transactions.</p><p>! Forecast values are estimates, not guarantees.</p><p>✓ Reserve targets remain visible as a planning floor.</p></div></section></div>
  </div>;
}

function TaxReserve({ finance, reload, notify }) {
  const [rate, setRate] = useState(Math.round(finance.taxRate * 100));
  const base = finance.taxRate > 0 ? finance.taxEstimate / finance.taxRate : 0;
  const estimate = calculateTaxReserve(base, rate / 100);
  async function save() {
    try { await api.updateAssumptions({ taxReserveRate: rate / 100 }); await reload(); notify("Tax reserve assumption saved"); }
    catch (error) { notify(error.message); }
  }
  return <div className="page"><Head eyebrow="Planning estimate" title="Tax Reserve" text="Use your own reserve percentage and keep the estimate clearly separate from tax advice." action={<Badge tone="warning">Estimate only</Badge>} />
    <div className="three-grid"><Kpi label="Estimated reserve" value={money(estimate)} sub={rate + "% of stored income base"} icon={ShieldCheck} /><Kpi label="Already reserved" value={money(finance.taxReserve)} sub="Current account reserve" icon={Wallet} /><Kpi label="Additional needed" value={money(Math.max(0, estimate - finance.taxReserve))} sub="To reach estimate" icon={Target} /></div>
    <section className="card tax-control"><div><p className="eyebrow">Assumption</p><h3>Tax reserve percentage</h3><p>Change this only to match your own planning assumption.</p></div><div className="rate-control"><strong>{rate}%</strong><input type="range" min="0" max="40" value={rate} onChange={e => setRate(Number(e.target.value))} /><div><span>0%</span><span>40%</span></div><Button onClick={save}>Save assumption</Button></div></section>
    <div className="disclaimer"><ShieldCheck size={15} /><span><b>Estimate only — not tax advice.</b> Consult a qualified professional for tax decisions.</span></div>
  </div>;
}

function Runway({ finance }) {
  const available = finance.cashBalance - finance.taxReserve;
  const normal = finance.runwayMonths;
  const income30 = calculateRunway(available, finance.averageMonthlyExpenses + finance.monthlyIncomeGoal * .3);
  const zeroIncome = calculateRunway(available, finance.averageMonthlyExpenses);
  const scenarios = [["Normal income", normal, "Current expense baseline"], ["Income −30%", income30, "Conservative planning scenario"], ["Income = 0", zeroIncome, "Expenses-only view"]];
  const pct = Math.min(100, normal / 6 * 100);
  const circumference = 2 * Math.PI * 68;
  return <div className="page"><Head eyebrow="Liquidity resilience" title="Runway" text="See how long your available cash can support your current cost base." action={<Badge tone={normal < 6 ? "warning" : "success"}>{normal.toFixed(1)} months</Badge>} />
    <section className="card runway-hero"><div className="runway-ring"><svg viewBox="0 0 160 160" aria-hidden="true"><circle className="runway-track" cx="80" cy="80" r="68" fill="none" /><circle className="runway-value" cx="80" cy="80" r="68" fill="none" strokeDasharray={circumference} strokeDashoffset={circumference - circumference * pct / 100} /></svg><div><strong>{normal.toFixed(1)}</strong><span>months</span></div></div><div><p className="eyebrow">Current runway</p><h2>{normal.toFixed(1)} months of modeled coverage</h2><p>Available cash <b>{money(available)}</b>. Average monthly expenses <b>{money(finance.averageMonthlyExpenses)}</b>.</p></div></section>
    <div className="three-grid">{scenarios.map(([title, value, note]) => <section className="card scenario" key={title}><span>{title}</span><strong>{value.toFixed(1)} mo</strong><p>{note}</p><div className="mini-bar"><i style={{ width: Math.min(100, value / 12 * 100) + "%" }} /></div></section>)}</div>
  </div>;
}

function AICFO({ finance, overdue, invoices, notify }) {
  const [messages, setMessages] = useState([{ role: "ai", text: "Your AI CFO is connected to this account's calculation context. Ask about your own numbers once you have transactions or invoices." }]);
  const [input, setInput] = useState("");
  const prompts = ["Can I spend ₹1.5L?", "Why is my safe-to-spend this amount?", "Which invoices are overdue?", "What is my runway?", "How much should I reserve?", "What if income falls 30%?"];

  async function send(question) {
    if (!question.trim()) return;
    setMessages(rows => [...rows, { role: "user", text: question }]);
    setInput("");
    try {
      const result = await api.askAI(question);
      setMessages(rows => [...rows, { role: "ai", text: result.response.answer + " " + result.response.explanation }]);
    } catch (error) {
      notify(error.message);
    }
  }

  return <div className="page"><Head eyebrow="Your financial copilot" title="AI CFO" text="The explanation layer uses server-side finance results from this account only." action={<Badge tone="success">Private context</Badge>} />
    <div className="ai-layout"><section className="card chat-card"><div className="chat-head"><span className="ai-icon"><Bot size={17} /></span><div><b>Freelancer CFO</b><small>Calculation-aware · estimates labeled</small></div></div><div className="messages">{messages.map((message, index) => <div className={"message " + message.role} key={index}><span className="message-avatar">{message.role === "ai" ? <Bot size={13} /> : <UserRound size={13} />}</span><div>{message.text}</div></div>)}</div><div className="suggestions">{prompts.map(prompt => <button key={prompt} onClick={() => send(prompt)}>{prompt}</button>)}</div><div className="chat-input"><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)} placeholder="Ask about your finances..." /><button onClick={() => send(input)}><Send size={15} /></button></div></section>
      <aside className="card context-card"><h3>Financial context</h3><p>Read-only results for this user</p><ListRow title="Safe to spend" sub="" value={money(finance.safeToSpend)} /><ListRow title="Receivables" sub="" value={money(finance.receivables)} /><ListRow title="Runway" sub="" value={finance.runwayMonths.toFixed(1) + " mo"} /><ListRow title="Overdue" sub="" value={money(finance.overdueTotal)} /><div className="context-note">AI explains stored results. It does not invent missing data or replace critical calculations.</div></aside>
    </div></div>;
}

function Settings({ user, finance, reload, notify }) {
  const [form, setForm] = useState({ profession: user?.profession || "", tax: Math.round(finance.taxRate * 100), emergency: finance.emergencyReserve, incomeGoal: finance.monthlyIncomeGoal });
  async function save() {
    try {
      await api.updateAssumptions({ taxReserveRate: Number(form.tax) / 100, emergencyReserveTarget: Number(form.emergency), monthlyIncomeGoal: Number(form.incomeGoal) });
      await reload();
      notify("Settings saved");
    } catch (error) { notify(error.message); }
  }
  return <div className="page"><Head eyebrow="Control center" title="Settings" text="Your personal profile and financial assumptions." action={<Button icon={Check} onClick={save}>Save changes</Button>} />
    <div className="settings-grid"><SettingsCard title="Profile" icon={<UserRound />}><label>Email<input value={user?.email || ""} readOnly /></label><label>Profession<input value={form.profession} onChange={e => setForm(v => ({ ...v, profession: e.target.value }))} /></label></SettingsCard><SettingsCard title="Financial assumptions" icon={<ShieldCheck />}><label>Tax reserve %<input type="number" value={form.tax} onChange={e => setForm(v => ({ ...v, tax: e.target.value }))} /></label><label>Emergency reserve<input type="number" value={form.emergency} onChange={e => setForm(v => ({ ...v, emergency: e.target.value }))} /></label><label>Monthly income goal<input type="number" value={form.incomeGoal} onChange={e => setForm(v => ({ ...v, incomeGoal: e.target.value }))} /></label></SettingsCard><SettingsCard title="Notifications" icon={<Bell />}><Toggle text="Overdue invoice alerts" on /><Toggle text="Low runway alerts" on /><Toggle text="Weekly finance summary" /></SettingsCard><SettingsCard title="Appearance & security" icon={<SettingsIcon />}><Toggle text="Light editorial theme" on /><Toggle text="Two-step verification" /><button className="danger-link">Log out of all devices</button></SettingsCard></div>
  </div>;
}

function SettingsCard({ title, icon, children }) {
  return <section className="card settings-card"><div className="settings-title">{icon}<div><h3>{title}</h3><p>Workspace preferences and controls.</p></div></div>{children}</section>;
}

function Toggle({ text, on: initial = false }) {
  const [on, setOn] = useState(initial);
  return <button className="toggle-row" onClick={() => setOn(!on)}><span>{text}</span><i className={on ? "on" : ""}><b /></i></button>;
}

function TransactionModal({ close, notify, reload, transaction }) {
  const [form, setForm] = useState(transaction ? {
    date: new Date(transaction.date).toISOString().slice(0, 10),
    description: transaction.description || "",
    client: transaction.client || "",
    category: transaction.category || "",
    type: transaction.type || "Income",
    amount: transaction.amount || ""
  } : { date: new Date().toISOString().slice(0,10), description: "", client: "", category: "", type: "Income", amount: "" });
  const editing = Boolean(transaction?._id);
  async function save(event) {
    event.preventDefault();
    try {
      if (editing) await api.updateTransaction(transaction._id, { ...form, amount: Number(form.amount) });
      else await api.createTransaction({ ...form, amount: Number(form.amount) });
      close(); await reload(); notify(editing ? "Transaction updated" : "Transaction added");
    } catch (error) { notify(error.message); }
  }
  return <div className="modal-backdrop" onMouseDown={close}><form className="modal" onMouseDown={e => e.stopPropagation()} onSubmit={save}>
    <div className="modal-head"><div><p className="eyebrow">Your data</p><h3>{editing ? "Edit transaction" : "Add transaction"}</h3></div><button type="button" onClick={close}><X size={17} /></button></div>
    <div className="modal-fields">
      <label>Date<input type="date" required value={form.date} onChange={e => setForm(v => ({...v,date:e.target.value}))}/></label>
      <label>Type<select value={form.type} onChange={e => setForm(v => ({...v,type:e.target.value}))}><option>Income</option><option>Expense</option></select></label>
      <label>Description<input required value={form.description} onChange={e => setForm(v => ({...v,description:e.target.value}))}/></label>
      <label>Client<input value={form.client} onChange={e => setForm(v => ({...v,client:e.target.value}))}/></label>
      <label>Category<input required value={form.category} onChange={e => setForm(v => ({...v,category:e.target.value}))}/></label>
      <label>Amount<input required min="0.01" type="number" step="0.01" value={form.amount} onChange={e => setForm(v => ({...v,amount:e.target.value}))}/></label>
    </div>
    <div className="modal-actions"><Button variant="secondary" onClick={close}>Cancel</Button><Button type="submit" icon={Check}>{editing ? "Save changes" : "Save transaction"}</Button></div>
  </form></div>;
}
function InvoiceModal({ close, notify, reload, invoice }) {
  const [form, setForm] = useState(invoice ? {
    invoiceNumber: invoice.invoiceNumber || invoice.id || "",
    client: invoice.client || "",
    amount: invoice.amount || "",
    issueDate: new Date(invoice.issueDate).toISOString().slice(0,10),
    dueDate: new Date(invoice.dueDate).toISOString().slice(0,10)
  } : { invoiceNumber: "", client: "", amount: "", issueDate: new Date().toISOString().slice(0,10), dueDate: "" });
  const editing = Boolean(invoice?._id);
  async function save(event) {
    event.preventDefault();
    try {
      if (editing) await api.updateInvoice(invoice._id, { ...form, amount: Number(form.amount) });
      else await api.createInvoice({ ...form, amount: Number(form.amount) });
      close(); await reload(); notify(editing ? "Invoice updated" : "Invoice created");
    } catch (error) { notify(error.message); }
  }
  return <div className="modal-backdrop" onMouseDown={close}><form className="modal" onMouseDown={e => e.stopPropagation()} onSubmit={save}>
    <div className="modal-head"><div><p className="eyebrow">Your data</p><h3>{editing ? "Edit invoice" : "Create invoice"}</h3></div><button type="button" onClick={close}><X size={17}/></button></div>
    <div className="modal-fields"><label>Invoice number<input required value={form.invoiceNumber} onChange={e=>setForm(v=>({...v,invoiceNumber:e.target.value}))}/></label><label>Client<input required value={form.client} onChange={e=>setForm(v=>({...v,client:e.target.value}))}/></label><label>Amount<input required min="0.01" type="number" step="0.01" value={form.amount} onChange={e=>setForm(v=>({...v,amount:e.target.value}))}/></label><label>Issue date<input required type="date" value={form.issueDate} onChange={e=>setForm(v=>({...v,issueDate:e.target.value}))}/></label><label>Due date<input required type="date" value={form.dueDate} onChange={e=>setForm(v=>({...v,dueDate:e.target.value}))}/></label></div>
    <div className="modal-actions"><Button variant="secondary" onClick={close}>Cancel</Button><Button type="submit" icon={Check}>{editing ? "Save changes" : "Create invoice"}</Button></div>
  </form></div>;
}
function Reminder({ invoice, close, notify }) {
  const invoiceNumber = invoice.invoiceNumber || invoice.id;
  const [text, setText] = useState("Hi " + invoice.client + ",\n\nJust a quick reminder that invoice " + invoiceNumber + " for " + money(invoice.amount) + " is now due or overdue. Could you share an expected payment date?\n\nThanks");
  async function saveDraft() {
    try {
      if (invoice._id) await api.reminderDraft(invoice._id);
      close(); notify("Reminder draft saved");
    } catch (error) { notify(error.message); }
  }
  return <div className="modal-backdrop" onMouseDown={close}><div className="modal" onMouseDown={e => e.stopPropagation()}><div className="modal-head"><div><p className="eyebrow">Draft only</p><h3>Payment reminder</h3></div><button onClick={close}><X size={17} /></button></div><p className="modal-note">AI-generated copy for review. Nothing will be sent.</p><textarea value={text} onChange={e => setText(e.target.value)} /><div className="modal-actions"><Button variant="secondary" onClick={close}>Cancel</Button><Button icon={Check} onClick={saveDraft}>Save draft</Button></div></div></div>;
}

function Onboarding({ finish }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", profession: "", monthlyIncome: "", monthlyExpenses: "", currentCash: "", taxReserveRate: "", emergencyReserveTarget: "", monthlyIncomeGoal: "" });
  const steps = [
    ["About you", [["name", "Name"], ["profession", "Profession"]]],
    ["Cash picture", [["monthlyIncome", "Monthly income"], ["monthlyExpenses", "Monthly expenses"], ["currentCash", "Current cash"]]],
    ["Reserves", [["taxReserveRate", "Tax reserve % (e.g. 22%)"], ["emergencyReserveTarget", "Emergency reserve target"]]],
    ["Goal", [["monthlyIncomeGoal", "Monthly income goal"]]],
  ];
  function setField(key, value) {
    setForm(values => ({ ...values, [key]: ["name", "profession"].includes(key) ? value : value }));
  }
  function next() {
    if (step < 3) return setStep(step + 1);
    const payload = {
      ...form,
      monthlyIncome: Number(form.monthlyIncome),
      monthlyExpenses: Number(form.monthlyExpenses),
      currentCash: Number(form.currentCash),
      taxReserveRate: Number(form.taxReserveRate) / 100,
      emergencyReserveTarget: Number(form.emergencyReserveTarget),
      monthlyIncomeGoal: Number(form.monthlyIncomeGoal),
    };
    finish(payload);
  }
  const current = steps[step];
  return <div className="onboarding"><div className="onboard-top"><div className="brand"><span className="brand-mark"><WalletCards size={16} /></span>Freelancer CFO</div><span>Step {step + 1} of 4</span></div><div className="progress"><i style={{ width: (step + 1) * 25 + "%" }} /></div><div className="onboard-card"><p className="eyebrow">Set up your guardrails</p><h1>{current[0]}</h1><p>These values belong only to your account and power your finance calculations.</p><div className="onboard-fields">{current[1].map(([key, label]) => <label key={key}>{label}<input value={form[key]} onChange={e => setField(key, e.target.value)} required type={["name", "profession"].includes(key) ? "text" : "number"} /></label>)}</div><div className="onboard-actions">{step > 0 && <Button variant="secondary" onClick={() => setStep(step - 1)}>Back</Button>}<Button onClick={next}>{step === 3 ? "Finish setup" : "Continue"}</Button></div></div></div>;
}

export default App;
