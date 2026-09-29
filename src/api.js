const isLocalHost = typeof window !== "undefined" && /^(localhost|127\\.0\\.0\\.1)$/.test(window.location.hostname);
const API_BASE = isLocalHost
  ? (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000")
  : "";

async function request(path, options = {}, token = localStorage.getItem("cfo_token")) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = "Bearer " + token;

  let response;
  try {
    response = await fetch(API_BASE + path, { ...options, headers });
  } catch (error) {
    const host = API_BASE || window.location.origin;
    throw new Error("Cannot reach the backend at " + host + ". Start the API server or configure the production backend.");
  }

  const raw = await response.text();
  let payload = {};
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const message = payload?.error?.message
      || ("Request failed (" + response.status + ") for " + API_BASE + path);
    throw new Error(message);
  }

  return payload;
}

export const api = {
  async companySignup(companyName, name, email, password, plan = "starter") {
    const data = await request("/api/auth/company-signup", { method: "POST", body: JSON.stringify({ companyName, name, email, password, plan }) }, null);
    localStorage.setItem("cfo_token", data.token);
    return data;
  },
  async login(email, password) {
    const data = await request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }, null);
    localStorage.setItem("cfo_token", data.token);
    return data;
  },
  async signup(name, email, password, inviteToken, plan = "free") {
    const data = await request("/api/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password, plan, ...(inviteToken ? { inviteToken } : {}) }) }, null);
    localStorage.setItem("cfo_token", data.token);
    return data;
  },
  async me() {
    return request("/api/auth/me");
  },
  async onboarding(values) {
    const data = await request("/api/auth/onboarding", {
      method: "POST",
      body: JSON.stringify(values),
    });
    return data;
  },
  async forgotPassword(email) {
    return request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }, null);
  },
  async resetPassword(token, password) {
    return request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }, null);
  },
  async companyOverview() {
    return request("/api/company/overview");
  },
  async inviteCompanyUser(email) {
    return request("/api/company/invites", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
  async revokeCompanyInvite(id) {
    return request("/api/company/invites/" + id, { method: "DELETE" });
  },
  async removeCompanyMember(id) {
    return request("/api/company/members/" + id, { method: "DELETE" });
  },
  async updateCompanyProfile(name) {
    return request("/api/company/profile", {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });
  },
  async adminOverview() {
    return request("/api/admin/overview");
  },
  async adminUsers() {
    return request("/api/admin/users");
  },
  async adminCompanies() {
    return request("/api/admin/companies");
  },
  async adminUserFinance(id) {
    return request("/api/admin/users/" + id + "/finance");
  },
  async adminAudit() {
    return request("/api/admin/audit");
  },
  async dashboard() {
    return request("/api/dashboard");
  },
  async transactions(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request("/api/transactions" + (query ? "?" + query : ""));
  },
  async createTransaction(transaction) {
    return request("/api/transactions", { method: "POST", body: JSON.stringify(transaction) });
  },
  async updateTransaction(id, transaction) {
    return request("/api/transactions/" + id, { method: "PATCH", body: JSON.stringify(transaction) });
  },
  async deleteTransaction(id) {
    return request("/api/transactions/" + id, { method: "DELETE" });
  },
  async createInvoice(invoice) {
    return request("/api/invoices", { method: "POST", body: JSON.stringify(invoice) });
  },
  async invoices() {
    return request("/api/invoices");
  },
  async updateInvoice(id, invoice) {
    return request("/api/invoices/" + id, { method: "PATCH", body: JSON.stringify(invoice) });
  },
  async deleteInvoice(id) {
    return request("/api/invoices/" + id, { method: "DELETE" });
  },
  async markInvoicePaid(id) {
    return request("/api/invoices/" + id + "/mark-paid", { method: "POST" });
  },
  async reminderDraft(id) {
    return request("/api/invoices/" + id + "/reminder-draft", { method: "POST" });
  },
  async cashFlow() {
    return request("/api/cash-flow");
  },
  async runway() {
    return request("/api/runway");
  },
  async taxReserve() {
    return request("/api/tax-reserve");
  },
  async askAI(question) {
    return request("/api/ai/ask", { method: "POST", body: JSON.stringify({ question }) });
  },
  async updateAssumptions(values) {
    return request("/api/assumptions", { method: "PATCH", body: JSON.stringify(values) });
  },
  logout() {
    localStorage.removeItem("cfo_token");
  },
};
