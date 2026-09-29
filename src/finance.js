export const calculateSafeToSpend=({cashBalance,taxReserve,upcomingExpenses,emergencyReserve})=>Math.max(0,cashBalance-taxReserve-upcomingExpenses-emergencyReserve);
export const calculateRunway=(availableCash,averageMonthlyExpenses)=>averageMonthlyExpenses>0?availableCash/averageMonthlyExpenses:0;
export const calculateTaxReserve=(income,taxRate)=>Math.max(0,income*taxRate);
export const formatINR=value=>{const a=Math.abs(value);if(a>=10000000)return `₹${(value/10000000).toFixed(2)}Cr`;if(a>=100000)return `₹${(value/100000).toFixed(2)}L`;if(a>=1000)return `₹${(value/1000).toFixed(1)}K`;return `₹${Math.round(value).toLocaleString("en-IN")}`};
export const formatFullINR=value=>`₹${Math.round(value).toLocaleString("en-IN")}`;
