import { useState } from "react";
import { AlertCircle, WalletCards, X } from "lucide-react";
import { api } from "../../api";
import { Button } from "../../components/ui/Primitives";

export default function Auth({ initialMode = "login", close, setAuth, onAuthenticated, notify }) {
  const inviteToken = new URLSearchParams(window.location.search).get("invite") || "";
  const [mode, setMode] = useState(inviteToken ? "signup" : initialMode === "company" ? "company-signup" : initialMode);
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
  }

  async function authenticate(action) {
    setBusy(true);
    setError("");
    try {
      const result = await action();
      setAuth(true);
      await onAuthenticated?.(result.user);
    } catch (error) {
      const message = error?.message || "Unable to complete authentication.";
      setError(message);
      notify?.(message);
    } finally {
      setBusy(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    const selectedPlan = localStorage.getItem(mode === "company-signup" ? "cfo_selected_company_plan" : "cfo_selected_plan")
      || (mode === "company-signup" ? "starter" : "free");
    await authenticate(async () => {
      const result = mode === "company-signup"
        ? await api.companySignup(companyName, name, email, password, selectedPlan)
        : await api.signup(name, email, password, inviteToken || undefined, selectedPlan);
      localStorage.removeItem("cfo_selected_plan");
      localStorage.removeItem("cfo_selected_company_plan");
      return result;
    });
  }

  async function login() {
    await authenticate(() => api.login(email, password));
  }

  async function forgot() {
    if (!email) return setError("Enter your email first.");
    setBusy(true);
    setError("");
    try {
      await api.forgotPassword(email);
      notify("If the account exists, a reset token has been created.");
    } catch (error) {
      const message = error?.message || "Unable to start password reset.";
      setError(message);
      notify(message);
    } finally {
      setBusy(false);
    }
  }

  const title = mode === "company-signup" ? "Create your company workspace" : mode === "signup" ? "Create your CFO workspace" : "Welcome back";
  const description = mode === "company-signup"
    ? "Create the company control center, then invite the users who need access."
    : inviteToken
      ? "Join the company using the invitation link you received."
      : "Your financial data stays tied to the account you sign in with.";

  return <div className="auth-shell landing-auth-overlay">
    <form className="auth-card" onSubmit={mode === "login" ? event => { event.preventDefault(); login(); } : submit}>
      <div className="auth-modal-top"><div className="brand"><span className="brand-mark"><WalletCards size={16} /></span>Freelancer CFO</div>{close && <button type="button" className="auth-close" onClick={close}><X size={17} /></button>}</div>
      <div className="auth-title"><p className="eyebrow">{mode === "company-signup" ? "Company control center" : "Private financial workspace"}</p><h1>{title}</h1><p>{description}</p></div>

      {!inviteToken && <div className="auth-switch auth-mode-switch"><button type="button" className={mode !== "company-signup" ? "active" : ""} onClick={() => changeMode("login")}>User</button><button type="button" className={mode === "company-signup" ? "active" : ""} onClick={() => changeMode("company-signup")}>Company</button></div>}
      {mode === "login" && <div className="auth-inline-choice"><button type="button" className="text-button" onClick={() => changeMode("signup")}>Create user account</button><button type="button" className="text-button" onClick={() => changeMode("company-signup")}>Create company</button></div>}

      {error && <div className="auth-error" role="alert"><AlertCircle size={15} /><span>{error}</span></div>}

      {(mode === "signup" || mode === "company-signup") && <label>Name<input value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" /></label>}
      {mode === "company-signup" && <label>Company name<input value={companyName} onChange={e => setCompanyName(e.target.value)} required placeholder="Your company" /></label>}
      <label>Email<input value={email} onChange={e => setEmail(e.target.value)} required type="email" placeholder="you@example.com" autoComplete="email" /></label>
      <label>Password<input value={password} onChange={e => setPassword(e.target.value)} required minLength={8} type="password" placeholder="At least 8 characters" autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>

      <Button type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "company-signup" ? "Create company" : mode === "signup" ? "Create account" : "Log in"}</Button>
      {mode === "login" && <button type="button" className="text-button" onClick={forgot} disabled={busy}>Forgot password?</button>}
      {mode === "signup" && <p className="auth-note">New users start with an empty finance workspace. You add your own data during onboarding.</p>}
      {mode === "company-signup" && <p className="auth-note">Company admins manage seats and membership. Individual user financial data stays private to each user.</p>}

      <p className="auth-switch">{mode === "company-signup" ? "Need the user portal?" : "Need the company portal?"} <button type="button" onClick={() => changeMode(mode === "company-signup" ? "login" : "company-signup")}>{mode === "company-signup" ? "Sign in" : "Create company"}</button></p>
    </form>
  </div>;
}
