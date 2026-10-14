const individualFeatures = {
  free: new Set(["dashboard", "transactions", "invoices", "settings", "billing", "notifications", "help"]),
  pro: new Set(["dashboard", "transactions", "invoices", "cashflow", "tax", "runway", "ai", "settings", "billing", "notifications", "help"]),
};

const organizationFeatures = {
  starter: new Set(["dashboard", "transactions", "invoices", "settings"]),
  growth: new Set(["dashboard", "transactions", "invoices", "cashflow", "tax", "runway", "settings"]),
  scale: new Set(["dashboard", "transactions", "invoices", "cashflow", "tax", "runway", "ai", "settings"]),
};

export const planCatalog = {
  free: {
    id: "free",
    name: "Individual",
    price: "₹0",
    period: "forever",
    audience: "individual",
    features: individualFeatures.free,
  },
  pro: {
    id: "pro",
    name: "Individual Pro",
    price: "₹499",
    period: "per month",
    audience: "individual",
    features: individualFeatures.pro,
  },
  starter: {
    id: "starter",
    name: "Organization Starter",
    price: "₹1,999",
    period: "per month",
    audience: "organization",
    seatLimit: 5,
    features: organizationFeatures.starter,
  },
  growth: {
    id: "growth",
    name: "Organization Growth",
    price: "₹4,999",
    period: "per month",
    audience: "organization",
    seatLimit: 25,
    features: organizationFeatures.growth,
  },
  scale: {
    id: "scale",
    name: "Organization Scale",
    price: "Custom",
    period: "for your organization",
    audience: "organization",
    seatLimit: 100,
    features: organizationFeatures.scale,
  },
};

export const featureLabels = {
  dashboard: "Dashboard",
  transactions: "Transactions",
  invoices: "Invoices",
  cashflow: "Cash Flow forecast",
  tax: "Tax Reserve planning",
  runway: "Runway scenarios",
  ai: "AI CFO analysis",
  settings: "Workspace settings",
  billing: "Billing overview",
  notifications: "Notifications",
  help: "Help center",
};

const unlockPlan = {
  cashflow: { individual: "Individual Pro", organization: "Organization Growth" },
  tax: { individual: "Individual Pro", organization: "Organization Growth" },
  runway: { individual: "Individual Pro", organization: "Organization Growth" },
  ai: { individual: "Individual Pro", organization: "Organization Scale" },
};

export function isUserFeatureEnabled(user, key) {
  if (user?.companyId) {
    return (organizationFeatures[user.companyPlan] || organizationFeatures.starter).has(key);
  }
  return (individualFeatures[user?.plan] || individualFeatures.free).has(key);
}

export function getRequiredPlanName(user, key) {
  const audience = user?.companyId ? "organization" : "individual";
  return unlockPlan[key]?.[audience] || (audience === "organization" ? "your organization plan" : "Individual Pro");
}

export function filterUserNavigation(navigation, user) {
  return navigation.filter(([key]) => isUserFeatureEnabled(user, key));
}
