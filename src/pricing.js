const individualFeatures = {
  free: new Set(["dashboard", "transactions", "invoices", "settings", "billing", "notifications", "help"]),
  pro: new Set(["dashboard", "transactions", "invoices", "cashflow", "tax", "runway", "ai", "settings", "billing", "notifications", "help"]),
};

const organizationFeatures = {
  starter: new Set(["dashboard", "transactions", "invoices", "settings"]),
  growth: new Set(["dashboard", "transactions", "invoices", "cashflow", "tax", "runway", "settings"]),
  scale: new Set(["dashboard", "transactions", "invoices", "cashflow", "tax", "runway", "ai", "settings"]),
};

export function isUserFeatureEnabled(user, key) {
  if (user?.companyId) {
    return (organizationFeatures[user.companyPlan] || organizationFeatures.starter).has(key);
  }
  return (individualFeatures[user?.plan] || individualFeatures.free).has(key);
}

export function filterUserNavigation(navigation, user) {
  return navigation.filter(([key]) => isUserFeatureEnabled(user, key));
}
