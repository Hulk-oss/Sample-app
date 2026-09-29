const sum = values => values.reduce((total, value) => total + Number(value || 0), 0);

export function calculateSafeToSpend({ cashBalance, taxReserve, upcomingExpenses, emergencyReserve }) {
  return Math.max(0, cashBalance - taxReserve - upcomingExpenses - emergencyReserve);
}

export function calculateRunway({ availableCash, averageMonthlyExpenses }) {
  if (averageMonthlyExpenses <= 0) return Infinity;
  return Math.max(0, availableCash) / averageMonthlyExpenses;
}

export function calculateTaxReserve(relevantIncome, rate) {
  return Math.max(0, relevantIncome) * Math.max(0, Math.min(1, rate));
}

export function calculateCashBalance(openingCashBalance, transactions, now = new Date()) {
  const past = transactions.filter(t => new Date(t.date) <= now);
  return openingCashBalance
    + sum(past.filter(t => t.type === "Income").map(t => t.amount))
    - sum(past.filter(t => t.type === "Expense").map(t => t.amount));
}

export function getUpcomingExpenses(transactions, now = new Date(), days = 30) {
  const end = new Date(now);
  end.setDate(end.getDate() + days);
  return sum(
    transactions
      .filter(t => t.type === "Expense" && new Date(t.date) > now && new Date(t.date) <= end)
      .map(t => t.amount)
  );
}

export function getAverageMonthlyExpenses(transactions, baseline = 0, months = 3, now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
  const relevant = transactions.filter(t => t.type === "Expense" && new Date(t.date) >= start && new Date(t.date) <= now);
  if (!relevant.length) return baseline;
  return Math.max(baseline, sum(relevant.map(t => t.amount)) / months);
}

export function getAverageMonthlyIncome(transactions, goal = 0, months = 3, now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
  const relevant = transactions.filter(t => t.type === "Income" && new Date(t.date) >= start && new Date(t.date) <= now);
  if (!relevant.length) return goal;
  return Math.max(goal, sum(relevant.map(t => t.amount)) / months);
}

export function buildMonthlyCashFlow(transactions, openingCashBalance, months = 6, now = new Date()) {
  const result = [];
  const first = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
  let balance = openingCashBalance;
  for (let i = 0; i < months; i += 1) {
    const start = new Date(first.getFullYear(), first.getMonth() + i, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);
    const rows = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= start && date <= end && date <= now;
    });
    const income = sum(rows.filter(t => t.type === "Income").map(t => t.amount));
    const expenses = sum(rows.filter(t => t.type === "Expense").map(t => t.amount));
    balance += income - expenses;
    result.push({ month: start.toLocaleString("en-IN", { month: "short" }), income, expenses, balance });
  }
  return result;
}

export function buildForecast(cashBalance, averageMonthlyIncome, averageMonthlyExpenses, months = 3) {
  const rows = [];
  let balance = cashBalance;
  for (let i = 1; i <= months; i += 1) {
    balance += averageMonthlyIncome - averageMonthlyExpenses;
    rows.push({ month: "M+" + i, income: averageMonthlyIncome, expenses: averageMonthlyExpenses, balance, estimated: true });
  }
  return rows;
}

export function calculateDashboard({ profile, transactions, invoices, now = new Date() }) {
  const cashBalance = calculateCashBalance(profile.openingCashBalance, transactions, now);
  const upcomingExpenses = getUpcomingExpenses(transactions, now, 30);
  const taxReserve = profile.taxReservedAmount;
  const emergencyReserve = profile.emergencyReserveTarget;
  const averageMonthlyExpenses = getAverageMonthlyExpenses(transactions, profile.monthlyExpensesBaseline, 3, now);
  const safeToSpend = calculateSafeToSpend({ cashBalance, taxReserve, upcomingExpenses, emergencyReserve });
  const runwayMonths = calculateRunway({
    availableCash: cashBalance - taxReserve,
    averageMonthlyExpenses,
  });
  const outstandingInvoices = invoices.filter(i => i.status !== "Paid");
  const overdueInvoices = invoices.filter(i => i.status === "Overdue");
  const taxEstimate = calculateTaxReserve(profile.relevantTaxIncomeBase, profile.taxReserveRate);

  return {
    cashBalance,
    safeToSpend,
    taxReserve,
    taxEstimate,
    additionalTaxReserve: Math.max(0, taxEstimate - taxReserve),
    emergencyReserve,
    upcomingExpenses,
    receivables: sum(outstandingInvoices.map(i => i.amount)),
    overdueTotal: sum(overdueInvoices.map(i => i.amount)),
    overdueCount: overdueInvoices.length,
    runwayMonths,
    averageMonthlyExpenses,
    taxRate: profile.taxReserveRate,
    monthlyIncomeGoal: profile.monthlyIncomeGoal,
  };
}

function inr(amount) {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

export function explainQuestion(question, finance, invoices = []) {
  const lower = question.toLowerCase();
  const overdue = invoices.filter(i => i.status === "Overdue");
  const overdueTotal = sum(overdue.map(i => i.amount));

  if (lower.includes("overdue")) {
    return {
      answer: overdue.length + " invoices are overdue, totaling " + inr(overdueTotal) + ".",
      keyNumbers: [
        { label: "Overdue invoices", value: overdue.length },
        { label: "Overdue amount", value: inr(overdueTotal) },
      ],
      explanation: "These invoices are outside their due dates and reduce expected near-term cash availability.",
      nextAction: "Review the invoice register and create reminder drafts for each overdue client.",
    };
  }

  if (lower.includes("runway")) {
    return {
      answer: "Your current runway is " + finance.runwayMonths.toFixed(1) + " months.",
      keyNumbers: [{ label: "Runway", value: finance.runwayMonths.toFixed(1) + " months" }],
      explanation: "This uses cash after the stored tax reserve and the current expense baseline of " + inr(finance.averageMonthlyExpenses) + " per month.",
      nextAction: "Compare the Normal and Income −30% scenarios before increasing fixed spending.",
    };
  }

  if (lower.includes("30%")) {
    const stressedIncome = finance.monthlyIncomeGoal * 0.7;
    const stressedCashFlow = stressedIncome - finance.averageMonthlyExpenses;
    return {
      answer: stressedCashFlow >= 0 ? "A 30% income reduction still leaves a positive modeled monthly cash flow." : "A 30% income reduction creates negative modeled monthly cash flow.",
      keyNumbers: [
        { label: "Modeled income", value: inr(stressedIncome) + "/month" },
        { label: "Modeled expenses", value: inr(finance.averageMonthlyExpenses) + "/month" },
      ],
      explanation: "This is a planning scenario based on your stored income goal and expense baseline, not a forecast.",
      nextAction: "Review discretionary expenses and overdue receivables before reducing reserves.",
    };
  }

  if (lower.includes("reserve")) {
    return {
      answer: "The estimated tax reserve is " + inr(finance.taxEstimate) + "; " + inr(finance.additionalTaxReserve) + " more reaches that planning estimate.",
      keyNumbers: [
        { label: "Tax rate", value: Math.round(finance.taxRate * 100) + "%" },
        { label: "Estimated reserve", value: inr(finance.taxEstimate) },
      ],
      explanation: "The estimate uses the configured tax-reserve percentage and stored relevant-income base.",
      nextAction: "Review the percentage with a qualified tax professional before making tax decisions.",
    };
  }

  if (lower.includes("1.5") || lower.includes("150000")) {
    const amount = 150000;
    return {
      answer: amount <= finance.safeToSpend ? "₹1.5L is within the current safe-to-spend guardrail." : "₹1.5L is above the current safe-to-spend guardrail.",
      keyNumbers: [
        { label: "Requested", value: "₹1.50L" },
        { label: "Safe to spend", value: inr(finance.safeToSpend) },
      ],
      explanation: "The guardrail is derived from cash minus tax reserve, upcoming expenses, and emergency reserve.",
      nextAction: amount <= finance.safeToSpend ? "Keep the emergency reserve intact after the purchase." : "Reduce the amount or review which planned outflows can move.",
    };
  }

  return {
    answer: "Your current safe-to-spend is " + inr(finance.safeToSpend) + ".",
    keyNumbers: [
      { label: "Cash", value: inr(finance.cashBalance) },
      { label: "Receivables", value: inr(finance.receivables) },
      { label: "Runway", value: finance.runwayMonths.toFixed(1) + " months" },
    ],
    explanation: "Critical numbers come from the deterministic finance engine; the assistant only explains those stored results.",
    nextAction: "Open the Safe to Spend and Cash Flow views to inspect the underlying assumptions.",
  };
}
