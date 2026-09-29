import {
  Activity,
  Bot,
  CreditCard,
  LayoutDashboard,
  Mail,
  ReceiptText,
  Settings,\n  Bell,\n  CircleHelp,\n  CreditCard,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";

export const userNavigation = [
  ["dashboard", "Overview", LayoutDashboard],
  ["transactions", "Transactions", CreditCard],
  ["invoices", "Invoices", ReceiptText],
  ["cashflow", "Cash Flow", Activity],
  ["tax", "Tax Reserve", ShieldCheck],
  ["runway", "Runway", Target],
  ["ai", "AI CFO", Bot],
  ["settings", "Settings", Settings],\n  ["billing", "Billing", CreditCard],\n  ["notifications", "Notifications", Bell],\n  ["help", "Help", CircleHelp],
];

export const companyNavigation = [
  ["overview", "Overview", LayoutDashboard],
  ["team", "Team", Users],
  ["invites", "Invitations", Mail],
  ["settings", "Company settings", Settings],\n  ["billing", "Billing", CreditCard],
];
