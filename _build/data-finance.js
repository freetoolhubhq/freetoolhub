module.exports = [
{
  slug: "emi-calculator",
  title: "EMI Calculator – Calculate Loan EMI Online",
  meta: "Calculate your loan EMI, total interest and payable instantly. Free online EMI calculator for home, car and personal loans in India.",
  h1: "EMI Calculator",
  category: "Finance",
  cardDesc: "Work out your monthly loan EMI with total interest and payable amount.",
  intro: [
    "An EMI (Equated Monthly Instalment) is the fixed amount you pay your lender every month until your loan is fully repaid. Indian banks and NBFCs calculate EMIs on a reducing-balance basis, which means the interest portion is highest in the early months and shrinks as the principal gets paid down.",
    "This calculator uses the standard reducing-balance formula used by banks across India. Enter your loan amount, the annual interest rate and the tenure to see your monthly EMI, the total interest you will pay, and the total amount payable over the life of the loan — so you can compare home, car and personal loan offers before you sign."
  ],
  faq: [
    ["What is EMI?", "EMI stands for Equated Monthly Instalment — a fixed payment you make every month towards repaying a loan. Each EMI has two parts: interest on the outstanding balance and a repayment of the principal."],
    ["How is EMI calculated?", "Banks use the reducing-balance formula: EMI = P x r x (1+r)^n / ((1+r)^n - 1), where P is the loan amount, r is the monthly interest rate (annual rate / 12 / 100) and n is the number of monthly instalments."],
    ["Does a longer tenure always mean a lower EMI?", "A longer tenure lowers your monthly EMI but increases the total interest you pay, sometimes substantially. Compare the total payable, not just the EMI, when choosing between tenures."],
    ["Can I reduce my total interest?", "Yes. Making part-prepayments when you have surplus cash reduces the outstanding principal, which cuts future interest. Many Indian lenders allow prepayment with little or no charge on floating-rate home loans."]
  ],
  formHtml: `<div class="frow">
  <div class="field"><label for="ploan">Loan amount (₹)</label><input id="ploan" type="number" min="0" step="1000" value="500000"></div>
  <div class="field"><label for="rate">Annual interest rate (%)</label><input id="rate" type="number" min="0" max="30" step="0.1" value="9"></div>
  <div class="field"><label for="years">Loan tenure (years)</label><input id="years" type="number" min="1" max="30" step="1" value="5"></div>
</div>
<button class="btn" id="calcBtn" type="button">Calculate EMI</button>
<div class="result" id="result" hidden></div>`,
  pure: `function emiCalc(P, annualRatePct, months) {
  var r = annualRatePct / 1200;
  if (r === 0) return P / months;
  var f = Math.pow(1 + r, months);
  return P * r * f / (f - 1);
}`,
  wiring: `FTH.el('calcBtn').addEventListener('click', function() {
  var P = FTH.num('ploan');
  var rate = FTH.num('rate');
  var yrs = FTH.num('years');
  if (P <= 0 || yrs <= 0) { FTH.setResult('<p class="note">Please enter a loan amount greater than zero and a valid tenure.</p>'); return; }
  var n = Math.max(1, Math.round(yrs * 12));
  var emi = emiCalc(P, rate, n);
  var total = emi * n;
  var interest = total - P;
  FTH.setResult('<div class="rbig">' + FTH.inr(emi) + ' / month</div>' +
    '<div class="rrow"><span class="k">Total interest</span><span class="v">' + FTH.inr(interest) + '</span></div>' +
    '<div class="rrow"><span class="k">Total payable</span><span class="v">' + FTH.inr(total) + '</span></div>' +
    '<p class="note">Reducing-balance EMI over ' + n + ' months at ' + rate + '% p.a.</p>');
});`,
  tests: [
    {fn: "emiCalc", args: [100000, 10, 12], expected: 8791.59, tol: 0.05},
    {fn: "emiCalc", args: [500000, 0, 12], expected: 41666.67, tol: 0.01}
  ],
  extraHead: ""
},
{
  slug: "gst-calculator",
  title: "GST Calculator India – Inclusive & Exclusive",
  meta: "Free GST calculator for India: add or remove 5%, 12%, 18% or 28% GST, split CGST/SGST and find the base price instantly. Ideal for billing and shopping.",
  h1: "GST Calculator",
  category: "Finance",
  cardDesc: "Add or strip Indian GST (5–28%) with CGST/SGST split on any bill or price.",
  intro: [
    "GST (Goods and Services Tax) is India's unified indirect tax, levied in four main slabs — 5%, 12%, 18% and 28% — depending on the product or service. Prices you see in shops are usually GST-inclusive, while business quotations are often quoted GST-exclusive.",
    "This calculator works both ways: add GST to a base price to get the selling price, or strip GST out of an inclusive price to recover the base amount. For intra-state sales it also splits the tax equally into CGST and SGST, matching how Indian invoices are raised."
  ],
  faq: [
    ["What are the GST slabs in India?", "The main GST slabs are 5%, 12%, 18% and 28%. Essentials like food items attract 5% or nil, most goods and services fall under 12% or 18%, and luxury or sin goods attract 28% plus cess."],
    ["What is the difference between GST-inclusive and exclusive prices?", "An exclusive price does not include GST — tax is added on top. An inclusive price already contains GST — you divide by (1 + rate) to recover the base price. Shop MRPs are inclusive; B2B quotes are usually exclusive."],
    ["What are CGST and SGST?", "On sales within a state, GST is split equally between the Centre (CGST) and the State (SGST). So 18% GST becomes 9% CGST + 9% SGST on the invoice. Inter-state sales use IGST instead."],
    ["Is GST the same everywhere in India?", "Yes — GST rates are set nationally by the GST Council, so the same product attracts the same rate in every state, unlike the old VAT system."]
  ],
  formHtml: `<div class="frow cols3">
  <div class="field"><label for="gamount">Amount (₹)</label><input id="gamount" type="number" min="0" step="1" value="1000"></div>
  <div class="field"><label for="gslab">GST slab</label><select id="gslab"><option value="5">5%</option><option value="12">12%</option><option value="18" selected>18%</option><option value="28">28%</option></select></div>
  <div class="field"><label for="gmode">Amount is</label><select id="gmode"><option value="exclusive" selected>GST-exclusive (add tax)</option><option value="inclusive">GST-inclusive (remove tax)</option></select></div>
</div>
<button class="btn" id="gcalc" type="button">Calculate GST</button>
<div class="result" id="result" hidden></div>`,
  pure: `function gstCalc(amount, ratePct, mode) {
  if (mode === "exclusive") {
    var tax = amount * ratePct / 100;
    return { base: amount, tax: tax, total: amount + tax };
  }
  var base = amount / (1 + ratePct / 100);
  return { base: base, tax: amount - base, total: amount };
}`,
  wiring: `FTH.el('gcalc').addEventListener('click', function() {
  var amt = FTH.num('gamount');
  var slab = FTH.num('gslab');
  var mode = FTH.str('gmode');
  if (amt <= 0) { FTH.setResult('<p class="note">Please enter an amount greater than zero.</p>'); return; }
  var g = gstCalc(amt, slab, mode);
  var half = g.tax / 2;
  FTH.setResult('<div class="rbig">' + FTH.inr(g.total) + '</div>' +
    '<div class="rrow"><span class="k">Base amount</span><span class="v">' + FTH.inr(g.base) + '</span></div>' +
    '<div class="rrow"><span class="k">CGST (' + (slab / 2) + '%)</span><span class="v">' + FTH.inr(half) + '</span></div>' +
    '<div class="rrow"><span class="k">SGST (' + (slab / 2) + '%)</span><span class="v">' + FTH.inr(half) + '</span></div>' +
    '<div class="rrow"><span class="k">Total GST (' + slab + '%)</span><span class="v">' + FTH.inr(g.tax) + '</span></div>' +
    '<p class="note">' + (mode === 'exclusive' ? 'GST added on top of the base price.' : 'Base price recovered from the GST-inclusive price.') + ' Inter-state sales would show IGST instead of CGST + SGST.</p>');
});`,
  tests: [
    {fn: "gstCalc", args: [1000, 18, "exclusive"], expected: {base: 1000, tax: 180, total: 1180}, tol: 0.01},
    {fn: "gstCalc", args: [1180, 18, "inclusive"], expected: {base: 1000, tax: 180, total: 1180}, tol: 0.01}
  ],
  extraHead: ""
},
{
  slug: "fd-calculator",
  title: "FD Calculator – Fixed Deposit Maturity Online",
  meta: "Calculate fixed deposit maturity value and interest earned with yearly, half-yearly, quarterly or monthly compounding. Free FD calculator for Indian banks.",
  h1: "FD Calculator",
  category: "Finance",
  cardDesc: "Estimate fixed deposit maturity value and interest for any Indian bank.",
  intro: [
    "Fixed deposits remain the most popular safe investment in India — offered by banks, NBFCs and the post office, with senior citizens typically earning an extra 0.25–0.50% interest. Your money grows through compounding: interest earned each period starts earning interest itself.",
    "Most Indian banks compound FD interest quarterly, which is why quarterly is the default here. Enter your deposit amount, the annual rate quoted by your bank, and the tenure to see the maturity value and the total interest you will earn — handy for comparing offers from SBI, HDFC, ICICI and small finance banks."
  ],
  faq: [
    ["What does compounding frequency mean for an FD?", "It is how often earned interest is added to your principal. Quarterly compounding adds interest four times a year, so each quarter's interest earns interest in the next — giving a slightly higher return than yearly compounding at the same rate."],
    ["Which compounding do Indian banks use?", "Most Indian banks compound FD interest quarterly by default. Some NBFCs and company deposits use yearly or half-yearly compounding — always check the fine print before comparing rates."],
    ["Is FD interest taxable in India?", "Yes. FD interest is added to your income and taxed at your slab rate. Banks deduct 10% TDS if your interest exceeds Rs 40,000 in a year (Rs 50,000 for senior citizens)."],
    ["Why does quarterly compounding give more than yearly?", "Because interest starts earning interest sooner. The difference is small over one year but becomes meaningful over 5–10 year tenures."]
  ],
  formHtml: `<div class="frow">
  <div class="field"><label for="fprincipal">Deposit amount (₹)</label><input id="fprincipal" type="number" min="0" step="1000" value="100000"></div>
  <div class="field"><label for="frate">Annual interest rate (%)</label><input id="frate" type="number" min="0" max="20" step="0.1" value="7"></div>
  <div class="field"><label for="fyears">Tenure (years)</label><input id="fyears" type="number" min="0.25" max="30" step="0.25" value="5"></div>
</div>
<div class="frow">
  <div class="field"><label for="ffreq">Compounding</label><select id="ffreq"><option value="1">Yearly</option><option value="2">Half-yearly</option><option value="4" selected>Quarterly</option><option value="12">Monthly</option></select></div>
</div>
<button class="btn" id="fcalc" type="button">Calculate Maturity</button>
<div class="result" id="result" hidden></div>`,
  pure: `function fdCalc(P, ratePct, years, freq) {
  var r = ratePct / 100;
  var amount = P * Math.pow(1 + r / freq, freq * years);
  return { amount: amount, interest: amount - P };
}`,
  wiring: `FTH.el('fcalc').addEventListener('click', function() {
  var P = FTH.num('fprincipal');
  var rate = FTH.num('frate');
  var yrs = FTH.num('fyears');
  var freq = FTH.num('ffreq');
  if (P <= 0 || yrs <= 0) { FTH.setResult('<p class="note">Please enter a deposit amount and tenure greater than zero.</p>'); return; }
  var fd = fdCalc(P, rate, yrs, freq);
  FTH.setResult('<div class="rbig">' + FTH.inr(fd.amount) + '</div>' +
    '<div class="rrow"><span class="k">Invested amount</span><span class="v">' + FTH.inr(P) + '</span></div>' +
    '<div class="rrow"><span class="k">Interest earned</span><span class="v">' + FTH.inr(fd.interest) + '</span></div>' +
    '<p class="note">Maturity value at ' + rate + '% p.a. compounded per the selected frequency, before tax and TDS.</p>');
});`,
  tests: [
    {fn: "fdCalc", args: [100000, 7, 5, 4], expected: {amount: 141477.82, interest: 41477.82}, tol: 0.05}
  ],
  extraHead: ""
},
{
  slug: "rd-calculator",
  title: "RD Calculator – Recurring Deposit Returns India",
  meta: "Estimate your recurring deposit maturity value, total invested and interest earned. Free RD calculator for Indian banks with quarterly compounding.",
  h1: "RD Calculator",
  category: "Finance",
  cardDesc: "Project RD maturity value, invested amount and interest earned monthly.",
  intro: [
    "A recurring deposit lets you save a fixed sum every month — perfect for salaried earners who want to build a corpus without a lump sum. Indian banks and the post office compound RD interest quarterly, and the rate is usually close to the bank's FD rate for the same tenure.",
    "Enter your monthly deposit, the annual interest rate and the tenure to see how much you will have invested in total, the maturity value, and the interest earned. It is a useful reality check before committing to a 1, 3 or 5-year RD."
  ],
  faq: [
    ["How is RD interest calculated?", "Each monthly instalment earns interest from its deposit date, with interest compounded quarterly. The standard formula is M = R x ((1+i)^n - 1) / (1 - (1+i)^(-1/3)), where i is the quarterly rate and n the number of quarters."],
    ["What is the minimum RD amount in India?", "Most banks let you start an RD with as little as Rs 100–500 per month; the post office 5-year RD starts at Rs 100 per month. There is usually no upper limit."],
    ["Is RD interest taxable?", "Yes — RD interest is fully taxable as income from other sources at your slab rate, and TDS applies if it crosses the threshold, just like FD interest."],
    ["RD vs SIP — which is better?", "RDs give guaranteed, fixed returns and suit risk-averse savers. SIPs in mutual funds can deliver higher long-term returns but carry market risk. Many savers use both."]
  ],
  formHtml: `<div class="frow">
  <div class="field"><label for="rdep">Monthly deposit (₹)</label><input id="rdep" type="number" min="0" step="100" value="5000"></div>
  <div class="field"><label for="rrate">Annual interest rate (%)</label><input id="rrate" type="number" min="0" max="20" step="0.1" value="7"></div>
  <div class="field"><label for="ryears">Tenure (years)</label><input id="ryears" type="number" min="0.5" max="10" step="0.5" value="5"></div>
</div>
<button class="btn" id="rcalc" type="button">Calculate RD Returns</button>
<div class="result" id="result" hidden></div>`,
  pure: `function rdCalc(monthly, ratePct, years) {
  var i = ratePct / 100 / 4;
  var n = 4 * years;
  var M = monthly * (Math.pow(1 + i, n) - 1) / (1 - Math.pow(1 + i, -1 / 3));
  var invested = monthly * 12 * years;
  return { maturity: M, invested: invested, interest: M - invested };
}`,
  wiring: `FTH.el('rcalc').addEventListener('click', function() {
  var dep = FTH.num('rdep');
  var rate = FTH.num('rrate');
  var yrs = FTH.num('ryears');
  if (dep <= 0 || yrs <= 0) { FTH.setResult('<p class="note">Please enter a monthly deposit and tenure greater than zero.</p>'); return; }
  var rd = rdCalc(dep, rate, yrs);
  FTH.setResult('<div class="rbig">' + FTH.inr(rd.maturity) + '</div>' +
    '<div class="rrow"><span class="k">Total invested</span><span class="v">' + FTH.inr(rd.invested) + '</span></div>' +
    '<div class="rrow"><span class="k">Interest earned</span><span class="v">' + FTH.inr(rd.interest) + '</span></div>' +
    '<p class="note">Quarterly compounding at ' + rate + '% p.a., before tax. Assumes deposits are made at the start of each month.</p>');
});`,
  tests: [
    {fn: "rdCalc", args: [5000, 7, 5], expected: {maturity: 359663.95, invested: 300000, interest: 59663.95}, tol: 0.05}
  ],
  extraHead: ""
},
{
  slug: "sip-calculator",
  title: "SIP Calculator – Mutual Fund Returns Estimator",
  meta: "Estimate your mutual fund SIP growth: monthly investment, expected returns and years. See invested amount, gains and projected value instantly, free.",
  h1: "SIP Calculator",
  category: "Finance",
  cardDesc: "Project mutual fund SIP growth: invested amount, gains and total value.",
  intro: [
    "A Systematic Investment Plan (SIP) invests a fixed amount in a mutual fund every month, buying more units when markets fall and fewer when they rise — the rupee-cost averaging that has made SIPs India's favourite way to invest in equity. Over long periods, compounding does the heavy lifting.",
    "Enter your monthly SIP amount, an expected annual return and the investment horizon to project your invested amount, estimated gains and total value. Treat the result as an illustration, not a promise: equity returns vary, and past performance never guarantees future results."
  ],
  faq: [
    ["What annual return should I assume for a SIP?", "Long-term Indian equity funds have delivered roughly 10–14% annualised over long periods, but there is no guarantee. Many planners use 10–12% for equity SIPs and 7–8% for hybrid funds in projections."],
    ["Are SIP returns guaranteed?", "No. A SIP only fixes your investment schedule — the returns depend on market performance. Over 7–10+ years equity SIPs have historically smoothed out volatility, but short-term values can fall."],
    ["What is the difference between a SIP and a lump sum?", "A SIP spreads investment over time, reducing timing risk through rupee-cost averaging. A lump sum invested at a market peak can underperform; a lump sum at a trough can outperform. SIPs suit regular earners."],
    ["Are SIP gains taxable in India?", "Yes. Equity fund gains held over 12 months are long-term capital gains taxed at 12.5% above Rs 1.25 lakh per year; gains under 12 months are taxed at 20%. Debt fund taxation differs."]
  ],
  formHtml: `<div class="frow">
  <div class="field"><label for="smonthly">Monthly investment (₹)</label><input id="smonthly" type="number" min="0" step="500" value="10000"></div>
  <div class="field"><label for="srate">Expected annual return (%)</label><input id="srate" type="number" min="0" max="30" step="0.5" value="12"></div>
  <div class="field"><label for="syears">Time period (years)</label><input id="syears" type="number" min="1" max="40" step="1" value="10"></div>
</div>
<button class="btn" id="scalc" type="button">Calculate SIP Growth</button>
<div class="result" id="result" hidden></div>`,
  pure: `function sipCalc(monthly, ratePct, years) {
  var i = ratePct / 100 / 12;
  var n = 12 * years;
  var fv = monthly * (Math.pow(1 + i, n) - 1) / i * (1 + i);
  var invested = monthly * n;
  return { invested: invested, gains: fv - invested, total: fv };
}`,
  wiring: `FTH.el('scalc').addEventListener('click', function() {
  var m = FTH.num('smonthly');
  var rate = FTH.num('srate');
  var yrs = FTH.num('syears');
  if (m <= 0 || yrs <= 0) { FTH.setResult('<p class="note">Please enter a monthly investment and period greater than zero.</p>'); return; }
  var s = sipCalc(m, rate, yrs);
  FTH.setResult('<div class="rbig">' + FTH.inr(s.total) + '</div>' +
    '<div class="rrow"><span class="k">Invested amount</span><span class="v">' + FTH.inr(s.invested) + '</span></div>' +
    '<div class="rrow"><span class="k">Estimated gains</span><span class="v">' + FTH.inr(s.gains) + '</span></div>' +
    '<p class="note">Projection at ' + rate + '% p.a., not a guarantee. Mutual fund investments are subject to market risks.</p>');
});`,
  tests: [
    {fn: "sipCalc", args: [10000, 12, 10], expected: {invested: 1200000, gains: 1123390.76, total: 2323390.76}, tol: 0.05}
  ],
  extraHead: ""
},
{
  slug: "income-tax-calculator",
  title: "Income Tax Calculator – New Regime FY 2025-26",
  meta: "Calculate your income tax under India's New Regime for FY 2025-26 (AY 2026-27). Includes Rs 75,000 standard deduction, 87A rebate and marginal relief.",
  h1: "Income Tax Calculator",
  category: "Finance",
  cardDesc: "Estimate New Regime income tax for FY 2025-26 with rebate and cess included.",
  intro: [
    "This calculator estimates your income tax under India's New Regime for FY 2025-26 (Assessment Year 2026-27) — the default regime for individual taxpayers. The new regime taxes income in seven slabs from nil up to 30%, with no tax at all on taxable income up to Rs 12 lakh thanks to the Section 87A rebate.",
    "Salaried individuals get a Rs 75,000 standard deduction before slabs are applied, and marginal relief ensures that earning just over Rs 12 lakh does not trigger a disproportionately large tax bill. A 4% health and education cess is added on the final tax. Surcharge on very high incomes is not included here, so treat this as an estimate and verify your actual liability on incometax.gov.in or with a tax professional."
  ],
  faq: [
    ["Which financial year does this calculator use?", "FY 2025-26 (AY 2026-27) under the New Regime: nil up to Rs 4 lakh, then 5%, 10%, 15%, 20%, 25% and 30% slabs up to and beyond Rs 24 lakh."],
    ["What is the Section 87A rebate?", "If your taxable income is Rs 12 lakh or less, the 87A rebate wipes out your entire slab tax, so you pay zero tax. Salaried taxpayers effectively pay no tax up to Rs 12.75 lakh because of the Rs 75,000 standard deduction."],
    ["What is marginal relief?", "Without it, someone earning Rs 12.1 lakh would suddenly owe over Rs 60,000 in tax. Marginal relief caps the extra tax so you never pay more than the amount by which your income exceeds Rs 12 lakh."],
    ["Is surcharge included in this calculation?", "No. Surcharge on very high incomes (above Rs 50 lakh) is not included — this tool is for resident individuals with ordinary salary or other income. Check incometax.gov.in for the full computation."]
  ],
  formHtml: `<p class="note"><strong>New Regime</strong> slabs for <strong>FY 2025-26 (AY 2026-27)</strong>. Resident individuals only; surcharge on very high incomes is not included.</p>
<div class="frow">
  <div class="field"><label for="tincome">Gross annual income (₹)</label><input id="tincome" type="number" min="0" step="10000" value="1500000"></div>
  <div class="field"><label for="tsal"><input id="tsal" type="checkbox" checked style="width:auto"> I am salaried (Rs 75,000 standard deduction applies)</label></div>
</div>
<button class="btn" id="tcalc" type="button">Calculate Tax</button>
<div class="result" id="result" hidden></div>`,
  pure: `function taxNewRegime(grossAnnual, isSalaried) {
  var taxable = grossAnnual - (isSalaried ? 75000 : 0);
  if (taxable < 0) taxable = 0;
  var slabs = [[400000, 0], [800000, 0.05], [1200000, 0.10], [1600000, 0.15], [2000000, 0.20], [2400000, 0.25], [Infinity, 0.30]];
  var slabTax = 0, prev = 0, k;
  for (k = 0; k < slabs.length; k++) {
    var limit = slabs[k][0], rate = slabs[k][1];
    if (taxable > prev) slabTax += (Math.min(taxable, limit) - prev) * rate;
    prev = limit;
  }
  var rebate = 0, relief = 0, net = slabTax;
  if (taxable <= 1200000) { rebate = slabTax; net = 0; }
  else if (slabTax > taxable - 1200000) { relief = slabTax - (taxable - 1200000); net = taxable - 1200000; }
  var cess = net * 0.04;
  return { taxable: taxable, slabTax: slabTax, rebate: rebate, relief: relief, cess: cess, total: net + cess };
}`,
  wiring: `FTH.el('tcalc').addEventListener('click', function() {
  var gross = FTH.num('tincome');
  var sal = FTH.el('tsal').checked;
  var r = taxNewRegime(gross, sal);
  var html = '<div class="rbig">' + FTH.inr(r.total) + '</div>' +
    '<div class="rrow"><span class="k">Taxable income</span><span class="v">' + FTH.inr(r.taxable) + '</span></div>' +
    '<div class="rrow"><span class="k">Slab tax</span><span class="v">' + FTH.inr(r.slabTax) + '</span></div>';
  if (r.rebate > 0) html += '<div class="rrow"><span class="k">Rebate u/s 87A</span><span class="v">- ' + FTH.inr(r.rebate) + '</span></div>';
  if (r.relief > 0) html += '<div class="rrow"><span class="k">Marginal relief</span><span class="v">- ' + FTH.inr(r.relief) + '</span></div>';
  html += '<div class="rrow"><span class="k">Health & education cess (4%)</span><span class="v">' + FTH.inr(r.cess) + '</span></div>' +
    '<p class="note">New Regime, FY 2025-26 (AY 2026-27), resident individual. Surcharge not included — verify on incometax.gov.in.</p>';
  FTH.setResult(html);
});`,
  tests: [
    {fn: "taxNewRegime", args: [1000000, false], expected: {taxable: 1000000, slabTax: 40000, rebate: 40000, relief: 0, cess: 0, total: 0}, tol: 0.01},
    {fn: "taxNewRegime", args: [1500000, false], expected: {taxable: 1500000, slabTax: 105000, rebate: 0, relief: 0, cess: 4200, total: 109200}, tol: 0.01},
    {fn: "taxNewRegime", args: [1210000, false], expected: {taxable: 1210000, slabTax: 61500, rebate: 0, relief: 51500, cess: 400, total: 10400}, tol: 0.01},
    {fn: "taxNewRegime", args: [1275000, true], expected: {taxable: 1200000, slabTax: 60000, rebate: 60000, relief: 0, cess: 0, total: 0}, tol: 0.01}
  ],
  extraHead: ""
},
{
  slug: "percentage-calculator",
  title: "Percentage Calculator – X% of Y & % Change",
  meta: "Free percentage calculator: find X% of Y, what percent X is of Y, and percentage increase or decrease between two numbers — with steps shown.",
  h1: "Percentage Calculator",
  category: "Finance",
  cardDesc: "Solve X% of Y, X as a percent of Y, and % change between any two values.",
  intro: [
    "Percentages show up everywhere — discounts during a sale, GST on a bill, marks in an exam, or a salary hike. This tool handles the three calculations people need most: finding X% of a number, working out what percentage one number is of another, and measuring the percentage change between two values.",
    "Pick a mode, enter the two numbers and get the answer instantly. It is handy for shoppers checking discount prices, students converting marks, and anyone comparing prices, salaries or investment returns over time."
  ],
  faq: [
    ["How do I find X% of Y?", "Multiply: (X / 100) x Y. For example, 20% of 250 is (20 / 100) x 250 = 50."],
    ["How do I calculate percentage increase or decrease?", "Use ((New - Old) / Old) x 100. Going from 100 to 130 is a 30% increase; going from 100 to 80 is a 20% decrease."],
    ["What is the difference between percentage points and percent?", "If interest rises from 5% to 7%, that is a 2 percentage-point rise but a 40% relative increase. Mixing the two up is one of the most common percentage mistakes."],
    ["How do I reverse a percentage — find the original price?", "If Rs 90 is the price after a 10% discount, divide by (1 - 0.10): 90 / 0.9 = Rs 100. For a markup, divide by (1 + rate)."]
  ],
  formHtml: `<div class="frow">
  <div class="field"><label for="pmode">Calculation mode</label><select id="pmode"><option value="pctof" selected>X% of Y</option><option value="whatpct">X is what % of Y</option><option value="pctchange">% change from X to Y</option></select></div>
  <div class="field"><label for="px" id="plabelX">Percentage (X)</label><input id="px" type="number" step="any" value="20"></div>
  <div class="field"><label for="py" id="plabelY">Of value (Y)</label><input id="py" type="number" step="any" value="250"></div>
</div>
<button class="btn" id="pcalc" type="button">Calculate</button>
<div class="result" id="result" hidden></div>`,
  pure: `function pctOf(x, y) { return x / 100 * y; }
function whatPct(x, y) { return x / y * 100; }
function pctChange(x, y) { return (y - x) / x * 100; }`,
  wiring: `FTH.el('pmode').addEventListener('change', function() {
  var m = FTH.str('pmode');
  if (m === 'pctof') { FTH.el('plabelX').textContent = 'Percentage (X)'; FTH.el('plabelY').textContent = 'Of value (Y)'; }
  else if (m === 'whatpct') { FTH.el('plabelX').textContent = 'Value (X)'; FTH.el('plabelY').textContent = 'Total (Y)'; }
  else { FTH.el('plabelX').textContent = 'Old value (X)'; FTH.el('plabelY').textContent = 'New value (Y)'; }
});
FTH.el('pcalc').addEventListener('click', function() {
  var m = FTH.str('pmode');
  var x = FTH.num('px');
  var y = FTH.num('py');
  var out, note;
  if (m === 'pctof') { out = pctOf(x, y); note = FTH.fmtIN(x, 2) + '% of ' + FTH.fmtIN(y, 2) + ' = ' + FTH.fmtIN(out, 2); }
  else if (m === 'whatpct') {
    if (y === 0) { FTH.setResult('<p class="note">Y cannot be zero for this calculation.</p>'); return; }
    out = whatPct(x, y); note = FTH.fmtIN(x, 2) + ' is ' + FTH.fmtIN(out, 2) + '% of ' + FTH.fmtIN(y, 2);
  } else {
    if (x === 0) { FTH.setResult('<p class="note">X cannot be zero for a percentage change.</p>'); return; }
    out = pctChange(x, y);
    var dir = out >= 0 ? 'increase' : 'decrease';
    note = 'Change from ' + FTH.fmtIN(x, 2) + ' to ' + FTH.fmtIN(y, 2) + ' is a ' + FTH.fmtIN(Math.abs(out), 2) + '% ' + dir;
  }
  FTH.setResult('<div class="rbig">' + FTH.fmtIN(out, 2) + '%</div><p class="note">' + note + '.</p>');
});`,
  tests: [
    {fn: "pctOf", args: [20, 250], expected: 50, tol: 0.0001},
    {fn: "whatPct", args: [30, 120], expected: 25, tol: 0.0001},
    {fn: "pctChange", args: [100, 130], expected: 30, tol: 0.0001}
  ],
  extraHead: ""
},
{
  slug: "compound-interest-calculator",
  title: "Compound Interest Calculator – Growth Estimator",
  meta: "See how your money grows with compound interest: principal, rate, years and compounding frequency. Free calculator with maturity and interest split.",
  h1: "Compound Interest Calculator",
  category: "Finance",
  cardDesc: "Grow any principal with compound interest across compounding frequencies.",
  intro: [
    "Compound interest means you earn interest not just on your original principal but on all the interest accumulated so far — the snowball effect that makes long-term investing so powerful. It is the same maths behind FD growth, PPF balances and mutual fund projections.",
    "This calculator shows how a one-time investment grows over time at any compounding frequency — yearly, half-yearly, quarterly or monthly. Try increasing the years to see why starting early matters far more than chasing a slightly higher rate."
  ],
  faq: [
    ["What is compound interest?", "Interest calculated on both the initial principal and the accumulated interest of previous periods. Each compounding period, your balance grows a little faster than the last."],
    ["How does compounding frequency affect returns?", "More frequent compounding means interest starts earning interest sooner. At 8% for 10 years, Rs 1 lakh grows to about Rs 2,15,892 yearly vs Rs 2,21,964 monthly — frequency matters, though rate and time matter more."],
    ["What is the difference between compound and simple interest?", "Simple interest is calculated only on the original principal, so growth is linear. Compound interest grows exponentially because each period's interest joins the principal."],
    ["What is the Rule of 72?", "A quick mental shortcut: divide 72 by your annual rate to estimate the years needed to double your money. At 8%, money doubles in roughly 9 years."]
  ],
  formHtml: `<div class="frow">
  <div class="field"><label for="cprincipal">Principal amount (₹)</label><input id="cprincipal" type="number" min="0" step="1000" value="100000"></div>
  <div class="field"><label for="crate">Annual interest rate (%)</label><input id="crate" type="number" min="0" max="30" step="0.1" value="8"></div>
  <div class="field"><label for="cyears">Time period (years)</label><input id="cyears" type="number" min="0.25" max="50" step="0.25" value="10"></div>
</div>
<div class="frow">
  <div class="field"><label for="cfreq">Compounding frequency</label><select id="cfreq"><option value="1" selected>Yearly</option><option value="2">Half-yearly</option><option value="4">Quarterly</option><option value="12">Monthly</option></select></div>
</div>
<button class="btn" id="ccalc" type="button">Calculate Growth</button>
<div class="result" id="result" hidden></div>`,
  pure: `function ciCalc(P, ratePct, years, freq) {
  var r = ratePct / 100;
  var amount = P * Math.pow(1 + r / freq, freq * years);
  return { amount: amount, interest: amount - P };
}`,
  wiring: `FTH.el('ccalc').addEventListener('click', function() {
  var P = FTH.num('cprincipal');
  var rate = FTH.num('crate');
  var yrs = FTH.num('cyears');
  var freq = FTH.num('cfreq');
  if (P <= 0 || yrs <= 0) { FTH.setResult('<p class="note">Please enter a principal and period greater than zero.</p>'); return; }
  var c = ciCalc(P, rate, yrs, freq);
  FTH.setResult('<div class="rbig">' + FTH.inr(c.amount) + '</div>' +
    '<div class="rrow"><span class="k">Principal invested</span><span class="v">' + FTH.inr(P) + '</span></div>' +
    '<div class="rrow"><span class="k">Interest earned</span><span class="v">' + FTH.inr(c.interest) + '</span></div>' +
    '<p class="note">At ' + rate + '% p.a. with the selected compounding frequency, before tax.</p>');
});`,
  tests: [
    {fn: "ciCalc", args: [100000, 8, 10, 1], expected: {amount: 215892.5, interest: 115892.5}, tol: 0.05}
  ],
  extraHead: ""
}
];
