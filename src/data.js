export const profile={name:"Alex Morgan",profession:"Independent Product Designer",monthlyIncomeGoal:300000,taxRate:.22,emergencyReserveTarget:150000};
export const transactions=[
{id:1,date:"2026-09-28",description:"Acme Labs — Retainer",client:"Acme Labs",category:"Client income",type:"Income",amount:180000},
{id:2,date:"2026-09-26",description:"Workspace",client:"—",category:"Operations",type:"Expense",amount:18000},
{id:3,date:"2026-09-24",description:"Northstar — Brand sprint",client:"Northstar",category:"Client income",type:"Income",amount:95000},
{id:4,date:"2026-09-22",description:"Software subscriptions",client:"—",category:"Software",type:"Expense",amount:12400},
{id:5,date:"2026-09-19",description:"Cloud hosting",client:"—",category:"Software",type:"Expense",amount:8600},
{id:6,date:"2026-09-15",description:"Brightside — UX audit",client:"Brightside",category:"Client income",type:"Income",amount:72000},
{id:7,date:"2026-09-12",description:"Travel & client meeting",client:"—",category:"Travel",type:"Expense",amount:9800},
{id:8,date:"2026-09-07",description:"Accounting",client:"—",category:"Professional",type:"Expense",amount:7500}
];
export const invoices=[
{id:"INV-1042",client:"Acme Labs",amount:120000,issueDate:"2026-08-25",dueDate:"2026-09-10",status:"Overdue"},
{id:"INV-1043",client:"Northstar",amount:110000,issueDate:"2026-09-03",dueDate:"2026-10-03",status:"Due"},
{id:"INV-1038",client:"Brightside",amount:72000,issueDate:"2026-08-01",dueDate:"2026-08-31",status:"Paid"},
{id:"INV-1044",client:"Atlas Studio",amount:55000,issueDate:"2026-09-08",dueDate:"2026-09-22",status:"Overdue"},
{id:"INV-1045",client:"Kiteworks",amount:35000,issueDate:"2026-09-17",dueDate:"2026-09-24",status:"Overdue"}
];
export const cashFlow=[
{month:"Jul",income:310000,expenses:168000,balance:604000},
{month:"Aug",income:382000,expenses:176000,balance:810000},
{month:"Sep",income:347000,expenses:176000,balance:981000},
{month:"Oct",income:260000,expenses:190000,balance:1051000},
{month:"Nov",income:285000,expenses:198000,balance:1138000},
{month:"Dec",income:220000,expenses:215000,balance:1143000}
];
export const alerts=[
{tone:"warning",title:"Overdue invoices",text:"3 invoices worth ₹2.1L need attention."},
{tone:"info",title:"Income trend",text:"Income is 14% below your 3-month peak."},
{tone:"danger",title:"Runway target",text:"Your runway is below the 6-month target."}
];
