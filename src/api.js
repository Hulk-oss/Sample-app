const API_BASE = import.meta.env.VITE_API_BASE_URL || (
  typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)
    ? "http://localhost:5000"
    : ""
);

async function request(path, options = {}, token = localStorage.getItem("cfo_token")) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = "Bearer " + token;
  const response = await fetch(API_BASE + path, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || "Request failed";
    throw new Error(message);
  }
  return payload;
}

export const api = {
  async companySignup(companyName, name, email, password) {
    const data = await request("/api/auth/company-signup", { method: "POST", body: JSON.stringify({ companyName, name, email, password }) }, null);
    localStorage.setItem("cfo_token", data.token);
    return data;
  },
  async login(email, password) {
    const data = await request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }, null);
    localStorage.setItem("cfo_token", data.token);
    return data;
  },
  async signup(name, email, password, inviteToken) {
    const data = await request("/api/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password, ...(inviteToken ? { inviteToken } : {}) }) }, null);
    localStorage.setItem("cfo_token", data.token);
    return data;
  },
  async me() {
    return request("/api/auth/me");
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
