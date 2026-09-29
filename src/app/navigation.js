export const userNavigation = [
  ["dashboard", "Overview"],
  ["transactions", "Transactions"],
  ["invoices", "Invoices"],
  ["cashflow", "Cash Flow"],
  ["tax", "Tax Reserve"],
  ["runway", "Runway"],
  ["ai", "AI CFO"],
  ["settings", "Settings"],
];

export const companyNavigation = [
  ["overview", "Overview"],
  ["team", "Team"],
  ["invites", "Invitations"],
  ["settings", "Company settings"],
];

export function getUserNavigationLabel(page) {
  return userNavigation.find(row => row[0] === page)?.[1];
}

export function getCompanyNavigationLabel(page) {
  return companyNavigation.find(row => row[0] === page)?.[1];
}
