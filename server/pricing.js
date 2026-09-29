export const individualPlans = {
  free: {
    id: "free",
    name: "Individual",
    features: ["dashboard", "transactions", "invoices"],
    limits: { monthlyTransactions: 100, invoices: 25 },
  },
  pro: {
    id: "pro",
    name: "Individual Pro",
    features: ["dashboard", "transactions", "invoices", "cashflow", "taxReserve", "runway", "aiCfo"],
    limits: { monthlyTransactions: 1000, invoices: 500 },
  },
};

export const organizationPlans = {
  starter: {
    id: "starter",
    name: "Organization Starter",
    seatLimit: 5,
    features: ["companyOverview", "team", "invites", "companySettings", "employeeOnboarding"],
  },
  growth: {
    id: "growth",
    name: "Organization Growth",
    seatLimit: 25,
    features: ["companyOverview", "team", "invites", "companySettings", "employeeOnboarding", "advancedAdministration"],
  },
  scale: {
    id: "scale",
    name: "Organization Scale",
    seatLimit: 100,
    features: ["companyOverview", "team", "invites", "companySettings", "employeeOnboarding", "advancedAdministration", "prioritySupport"],
  },
};

export function getUserPlan(user) {
  if (user?.companyId) return null;
  return individualPlans[user?.plan] || individualPlans.free;
}

export function getCompanyPlan(company) {
  return organizationPlans[company?.plan] || organizationPlans.starter;
}

export function hasUserFeature(user, feature) {
  const plan = getUserPlan(user);
  return Boolean(plan?.features.includes(feature));
}

export function hasCompanyFeature(company, feature) {
  const plan = getCompanyPlan(company);
  return Boolean(plan?.features.includes(feature));
}
