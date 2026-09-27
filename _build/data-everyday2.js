// FreeToolHub data batch: Everyday tools (batch 2) — 7 specs
//
// Module-scope copies of the unit-converter factor tables. They mirror the
// copies inside the unit-converter `pure` string (which is what the generated
// page evaluates); these exist only so the `lengthFactors` identifier used in
// that spec's `tests` args resolves when this file is required by Node.
const lengthFactors = { km: 1000, m: 1, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 };
const weightFactors = { kg: 1, g: 0.001, mg: 0.000001, lb: 0.45359237, oz: 0.028349523125, t: 1000 };
module.exports = [
{
  slug: "color-converter",
  title: "Color Converter – HEX to RGB to HSL",
  meta: "Convert colors between HEX, RGB and HSL instantly. Free color converter with live preview — type a color code and get every format at once.",
  h1: "Color Converter",
  category: "Everyday",
  cardDesc: "Convert HEX, RGB and HSL color codes instantly, with a live color preview.",
  intro: [
    "Working with colors on the web means juggling three different notations. HEX codes like #ff0000 are compact and used everywhere in CSS, RGB values like rgb(255, 0, 0) describe how much red, green and blue light to mix, and HSL values like hsl(0, 100%, 50%) describe a color by its hue, saturation and lightness — often the most intuitive way to tweak a shade.",
    "This converter translates between all three formats instantly as you type, with a live preview swatch so you can see exactly what the color looks like. It accepts both 6-digit HEX codes (#2456e6) and the 3-digit shorthand (#f00), and RGB inputs are clamped to the valid 0–255 range.",
    "Designers reach for HSL when they want to make a color lighter, darker or more muted without changing its basic hue; developers copy the HEX or RGB output straight into stylesheets, design tools or brand guidelines."
  ],
  faq: [
    ["What is the difference between HEX, RGB and HSL?", "HEX is a compact hexadecimal notation for the same red, green and blue values that RGB spells out as three numbers. HSL instead describes a color by hue (position on the color wheel, 0–360 degrees), saturation (how vivid it is) and lightness (how close to black or white). All three describe the exact same color — they are just different ways of writing it."],
    ["Can I use 3-digit HEX codes?", "Yes. A 3-digit code like #f80 is expanded automatically to its 6-digit form (#ff8800), following the same rule browsers use in CSS."],
    ["Why would I use HSL instead of RGB?", "HSL makes it easy to create variations of a color: keep the hue fixed and adjust lightness for tints and shades, or lower saturation for muted tones. With RGB you would have to guess how the three channels interact."],
    ["Are the conversions exact?", "Conversions between HEX and RGB are exact. RGB to HSL rounds hue to whole degrees and saturation/lightness to whole percentages, which can shift a color by less than one RGB step — invisible to the eye."]
  ],
  formHtml: `<div class="frow">
  <div class="field"><label for="hex">HEX color <span class="hint">3 or 6 digits</span></label><input id="hex" type="text" value="#2456e6" maxlength="7" spellcheck="false"></div>
</div>
<div class="frow cols3">
  <div class="field"><label for="r">Red (0–255)</label><input id="r" type="number" min="0" max="255" value="36"></div>
  <div class="field"><label for="g">Green (0–255)</label><input id="g" type="number" min="0" max="255" value="86"></div>
  <div class="field"><label for="b">Blue (0–255)</label><input id="b" type="number" min="0" max="255" value="230"></div>
</div>
<div class="frow">
  <button class="btn" id="convert" type="button">Convert</button>
</div>
<div class="colorprev" id="preview" style="background:#2456e6"></div>
<div class="result" id="result" hidden></div>`,
  pure: `function hexToRgb(hex) {
  var h = String(hex).trim().replace(/^#/, "");
  if (h.length === 3) { h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2); }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) { return null; }
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}
function rgbToHex(r, g, b) {
  function ch(n) { n = Math.max(0, Math.min(255, Math.round(n))); var s = n.toString(16); return s.length === 1 ? "0" + s : s; }
  return "#" + ch(r) + ch(g) + ch(b);
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  var mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  var h = 0, s = 0, l = (mx + mn) / 2;
  if (mx !== mn) {
    var d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) { h = (g - b) / d + (g < b ? 6 : 0); }
    else if (mx === g) { h = (b - r) / d + 2; }
    else { h = (r - g) / d + 4; }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  function f(n) { var k = (n + h / 30) % 12; var a = s * Math.min(l, 1 - l); return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1))); }
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
}
function rgbStr(hex) { var c = hexToRgb(hex); return c ? c.r + ", " + c.g + ", " + c.b : ""; }
function hslStr(hex) { var c = hexToRgb(hex); if (!c) { return ""; } var t = rgbToHsl(c.r, c.g, c.b); return t.h + ", " + t.s + "%, " + t.l + "%"; }`,
  wiring: `var prevEl = FTH.el("preview");
function clamp255(n) { if (isNaN(n)) { return 0; } return Math.max(0, Math.min(255, Math.round(n))); }
function showColor(r, g, b) {
  var hex = rgbToHex(r, g, b);
  var hsl = rgbToHsl(r, g, b);
  prevEl.style.backgroundColor = hex;
  FTH.el("hex").value = hex;
  FTH.el("r").value = r;
  FTH.el("g").value = g;
  FTH.el("b").value = b;
  FTH.setResult(
    '<div class="rrow"><span class="k">HEX</span><span class="v">' + hex + '</span></div>' +
    '<div class="rrow"><span class="k">RGB</span><span class="v">' + r + ', ' + g + ', ' + b + '</span></div>' +
    '<div class="rrow"><span class="k">HSL</span><span class="v">' + hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%</span></div>'
  );
}
function fromHex() {
  var c = hexToRgb(FTH.str("hex"));
  if (c) { showColor(c.r, c.g, c.b); }
  else { FTH.setResult('<div class="note">That HEX value is not valid. Use 3 or 6 hex digits, e.g. #f00 or #ff0000.</div>'); }
}
function fromRgb() {
  showColor(clamp255(FTH.num("r")), clamp255(FTH.num("g")), clamp255(FTH.num("b")));
}
FTH.el("hex").addEventListener("input", fromHex);
FTH.el("r").addEventListener("input", fromRgb);
FTH.el("g").addEventListener("input", fromRgb);
FTH.el("b").addEventListener("input", fromRgb);
FTH.el("convert").addEventListener("click", fromHex);
fromHex();`,
  tests: [
    { fn: "rgbStr", args: ["#ff0000"], expected: "255, 0, 0", tol: 0 },
    { fn: "hslStr", args: ["#ff0000"], expected: "0, 100%, 50%", tol: 0 },
    { fn: "rgbToHex", args: [255, 0, 0], expected: "#ff0000", tol: 0 },
    { fn: "rgbStr", args: ["#f00"], expected: "255, 0, 0", tol: 0 }
  ],
  extraHead: ""
},
{
  slug: "unit-converter",
  title: "Unit Converter – Length, Weight, Temperature",
  meta: "Convert length, weight and temperature units instantly — km to miles, kg to pounds, Celsius to Fahrenheit. Free, fast and accurate unit converter.",
  h1: "Unit Converter",
  category: "Everyday",
  cardDesc: "Convert length, weight and temperature units — km to miles, kg to lb, °C to °F.",
  intro: [
    "Whether you are following a recipe in ounces, checking a 5K run in miles, or reading a weather report in Fahrenheit, unit conversion comes up constantly. This tool converts length, weight and temperature between the metric and imperial units people actually use every day.",
    "Pick a category, enter a value, and choose the units to convert from and to — the result updates instantly as you change anything. Length and weight use exact international conversion factors, and temperature conversions handle the offset formulas between Celsius, Fahrenheit and Kelvin correctly."
  ],
  faq: [
    ["How accurate are the conversions?", "Length and weight use the internationally defined factors — for example, 1 inch is exactly 2.54 cm and 1 pound is exactly 0.45359237 kg — so results are as precise as your input. Displayed values are rounded to 6 decimal places."],
    ["Why does temperature need a different formula?", "Unlike length or weight, temperature scales do not share a common zero: 0 °C is 32 °F. So conversion is not a simple multiplication — the tool first converts to Celsius, then to the target scale."],
    ["What is the difference between a tonne and a ton?", "This converter uses the metric tonne (1,000 kg). The US short ton is 907.18 kg and the UK long ton is 1,016 kg — neither is included here to avoid confusion."],
    ["Does it work offline?", "Yes. Once the page has loaded, all conversions run locally in your browser with no network requests."]
  ],
  formHtml: `<div class="frow cols3">
  <div class="field"><label for="cat">Category</label><select id="cat"><option>Length</option><option>Weight</option><option>Temperature</option></select></div>
  <div class="field"><label for="fromU">From</label><select id="fromU"></select></div>
  <div class="field"><label for="toU">To</label><select id="toU"></select></div>
</div>
<div class="frow cols3">
  <div class="field"><label for="val">Value</label><input id="val" type="number" value="1" step="any"></div>
  <div class="field"><label>&nbsp;</label><button class="btn" id="uconvert" type="button">Convert</button></div>
</div>
<div class="result" id="result" hidden></div>`,
  pure: `const lengthFactors = { km: 1000, m: 1, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 };
const weightFactors = { kg: 1, g: 0.001, mg: 0.000001, lb: 0.45359237, oz: 0.028349523125, t: 1000 };
function convertLinear(v, from, to, factors) { return v * factors[from] / factors[to]; }
function convertTemp(v, from, to) {
  var c = from === "C" ? v : (from === "F" ? (v - 32) * 5 / 9 : v - 273.15);
  return to === "C" ? c : (to === "F" ? c * 9 / 5 + 32 : c + 273.15);
}`,
  wiring: `var UDEF = {
  Length: [["km", "Kilometers (km)"], ["m", "Meters (m)"], ["cm", "Centimeters (cm)"], ["mm", "Millimeters (mm)"], ["mi", "Miles (mi)"], ["yd", "Yards (yd)"], ["ft", "Feet (ft)"], ["in", "Inches (in)"]],
  Weight: [["kg", "Kilograms (kg)"], ["g", "Grams (g)"], ["mg", "Milligrams (mg)"], ["t", "Tonnes (t)"], ["lb", "Pounds (lb)"], ["oz", "Ounces (oz)"]],
  Temperature: [["C", "Celsius (°C)"], ["F", "Fahrenheit (°F)"], ["K", "Kelvin (K)"]]
};
var UDEFAULT = { Length: ["km", "mi"], Weight: ["kg", "lb"], Temperature: ["C", "F"] };
function fillUnits() {
  var cat = FTH.str("cat");
  var defs = UDEF[cat];
  var opts = defs.map(function (d) { return '<option value="' + d[0] + '">' + d[1] + '</option>'; }).join("");
  FTH.el("fromU").innerHTML = opts;
  FTH.el("toU").innerHTML = opts;
  FTH.el("fromU").value = UDEFAULT[cat][0];
  FTH.el("toU").value = UDEFAULT[cat][1];
}
function doConvert() {
  var cat = FTH.str("cat");
  var v = FTH.num("val");
  if (isNaN(v)) { FTH.setResult('<div class="note">Enter a number to convert.</div>'); return; }
  var from = FTH.str("fromU"), to = FTH.str("toU"), out;
  if (cat === "Temperature") { out = convertTemp(v, from, to); }
  else { out = convertLinear(v, from, to, cat === "Length" ? lengthFactors : weightFactors); }
  FTH.setResult('<div class="rbig">' + FTH.fmtIN(v, 6) + ' ' + from + ' = ' + FTH.fmtIN(out, 6) + ' ' + to + '</div>');
}
FTH.el("cat").addEventListener("change", function () { fillUnits(); doConvert(); });
FTH.el("val").addEventListener("input", doConvert);
FTH.el("fromU").addEventListener("change", doConvert);
FTH.el("toU").addEventListener("change", doConvert);
FTH.el("uconvert").addEventListener("click", doConvert);
fillUnits();
doConvert();`,
  tests: [
    { fn: "convertLinear", args: [1, "km", "mi", lengthFactors], expected: 0.621371, tol: 0.000001 },
    { fn: "convertLinear", args: [1, "mi", "km", lengthFactors], expected: 1.609344, tol: 0.000001 },
    { fn: "convertTemp", args: [0, "C", "F"], expected: 32, tol: 0 },
    { fn: "convertTemp", args: [100, "C", "K"], expected: 373.15, tol: 0 }
  ],
  extraHead: ""
},
{
  slug: "uuid-generator",
  title: "UUID Generator – Random v4 UUIDs",
  meta: "Generate random UUID v4 identifiers instantly. Create 1, 5 or 10 at a time and copy them all with one click — free online UUID generator.",
  h1: "UUID Generator",
  category: "Everyday",
  cardDesc: "Generate random UUID v4 identifiers — one or many — and copy them in one click.",
  intro: [
    "A UUID (universally unique identifier) is a 128-bit label written as 32 hexadecimal digits in five groups, like 550e8400-e29b-41d4-a716-446655440000. They are the standard way to generate IDs that will not collide — for database rows, API keys, session tokens and filenames.",
    "This generator creates version-4 UUIDs, where 122 of the 128 bits are random. Generate one, five or ten at a time and copy them all with a single click. Everything happens locally in your browser, so the IDs are never sent anywhere."
  ],
  faq: [
    ["What does version 4 mean?", "UUID version 4 means the identifier is generated from random numbers, with a few fixed bits marking the version and variant. Version 1 instead embeds a timestamp and MAC address, which can leak information — v4 is the safer default."],
    ["Are generated UUIDs guaranteed unique?", "Not mathematically guaranteed, but with 122 random bits the chance of a collision is astronomically small — you could generate billions per second for years without expecting a duplicate."],
    ["Is it safe to use these as passwords or tokens?", "They are fine as non-guessable identifiers, but for security tokens prefer your platform's cryptographic random generator. This tool uses the browser's Math.random, which is not cryptographically secure."],
    ["Do the UUIDs leave my computer?", "No. Generation and copying happen entirely in your browser; nothing is uploaded or logged."]
  ],
  formHtml: `<div class="frow">
  <div class="field"><label for="cnt">How many</label><select id="cnt"><option value="1">1</option><option value="5">5</option><option value="10">10</option></select></div>
</div>
<div class="frow">
  <button class="btn" id="gen" type="button">Generate UUID</button>
  <button class="btn-ghost" id="copyall" type="button">Copy All</button>
</div>
<div class="out" id="list"></div>
<p class="note">Each UUID is a random version-4 identifier, generated locally in your browser.</p>`,
  pure: `function uuidGen() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.floor(Math.random() * 16);
    var v = c === "x" ? r : (r & 3 | 8);
    return v.toString(16);
  });
}`,
  wiring: `function renderUuids() {
  var n = parseInt(FTH.str("cnt"), 10) || 1;
  var arr = [];
  for (var i = 0; i < n; i++) { arr.push(uuidGen()); }
  FTH.el("list").textContent = arr.join("\\n");
}
FTH.el("gen").addEventListener("click", renderUuids);
FTH.el("cnt").addEventListener("change", renderUuids);
FTH.el("copyall").addEventListener("click", function () { FTH.copyText(FTH.el("list").textContent, FTH.el("copyall")); });
renderUuids();`,
  tests: [],
  extraHead: ""
},
{
  slug: "date-difference-calculator",
  title: "Date Difference Calculator – Days Between Dates",
  meta: "Calculate the exact number of days between two dates, plus weeks and months. Free date difference calculator with calendar-day accuracy.",
  h1: "Date Difference Calculator",
  category: "Everyday",
  cardDesc: "Find the exact days, weeks and months between any two dates, instantly.",
  intro: [
    "Counting the days between two dates sounds simple until you try it by hand across month and year boundaries. This calculator gives you the exact number of calendar days between any two dates — useful for project deadlines, countdowns, age-in-days calculations, billing periods and travel planning.",
    "It also breaks the result into weeks and approximate months, and tells you which of the two dates comes first. Dates are compared at UTC midnight, so daylight-saving changes can never shift the count by a day."
  ],
  faq: [
    ["Does it count the start date, the end date, or both?", "It counts the number of midnights between the two dates — so the difference between Monday and Tuesday is 1 day. If you need an inclusive count (counting both endpoints), add 1 to the result."],
    ["How are months calculated?", "Months are approximate: total days divided by 30.44, the average month length. Use the exact day count for anything precise like contracts or interest."],
    ["Does it handle leap years?", "Yes. Because dates are compared as absolute UTC timestamps, leap days are counted automatically — for example, February 2024 contributes its 29th day."],
    ["Why might another calculator give a different answer?", "Some calculators count inclusively or use your local timezone, where a daylight-saving transition can add or lose an hour and shift the day count. This tool avoids both issues by comparing UTC midnights."]
  ],
  formHtml: `<div class="frow cols3">
  <div class="field"><label for="dateA">Start date</label><input id="dateA" type="date"></div>
  <div class="field"><label for="dateB">End date</label><input id="dateB" type="date"></div>
  <div class="field"><label>&nbsp;</label><button class="btn" id="calc" type="button">Calculate</button></div>
</div>
<div class="result" id="result" hidden></div>
<p class="note">Counts whole calendar days between the two dates (time of day is ignored).</p>`,
  pure: `function dateDiff(aISO, bISO) {
  function parts(s) { var p = String(s).split("-"); return [parseInt(p[0], 10), parseInt(p[1], 10), parseInt(p[2], 10)]; }
  var a = parts(aISO), b = parts(bISO);
  var ms = Date.UTC(b[0], b[1] - 1, b[2]) - Date.UTC(a[0], a[1] - 1, a[2]);
  return { days: Math.round(ms / 86400000) };
}
function daysStr(aISO, bISO) { return String(dateDiff(aISO, bISO).days); }`,
  wiring: `function isoOf(d) {
  function p(n) { return (n < 10 ? "0" : "") + n; }
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}
var todayD = new Date();
FTH.el("dateA").value = isoOf(todayD);
FTH.el("dateB").value = isoOf(new Date(todayD.getTime() + 30 * 86400000));
function doDiff() {
  var a = FTH.str("dateA"), b = FTH.str("dateB");
  if (!a || !b) { return; }
  var d = dateDiff(a, b).days;
  var earlier = d >= 0 ? a : b;
  var ad = Math.abs(d);
  var w = Math.floor(ad / 7), rd = ad % 7;
  FTH.setResult(
    '<div class="rbig">' + ad + ' day' + (ad === 1 ? '' : 's') + '</div>' +
    '<div class="rrow"><span class="k">Weeks</span><span class="v">' + w + ' week' + (w === 1 ? '' : 's') + ', ' + rd + ' day' + (rd === 1 ? '' : 's') + '</span></div>' +
    '<div class="rrow"><span class="k">Approx. months</span><span class="v">' + (ad / 30.44).toFixed(1) + '</span></div>' +
    '<div class="rrow"><span class="k">Earlier date</span><span class="v">' + earlier + '</span></div>'
  );
}
FTH.el("calc").addEventListener("click", doDiff);
FTH.el("dateA").addEventListener("change", doDiff);
FTH.el("dateB").addEventListener("change", doDiff);
doDiff();`,
  tests: [
    { fn: "daysStr", args: ["2026-01-01", "2026-09-27"], expected: "269", tol: 0 },
    { fn: "daysStr", args: ["2026-05-05", "2026-05-05"], expected: "0", tol: 0 },
    { fn: "daysStr", args: ["2024-02-28", "2024-03-01"], expected: "2", tol: 0 }
  ],
  extraHead: ""
},
{
  slug: "random-number-generator",
  title: "Random Number Generator – Pick a Number",
  meta: "Generate random numbers between any minimum and maximum — one or up to 100 at a time. Free random number generator for draws, games and picks.",
  h1: "Random Number Generator",
  category: "Everyday",
  cardDesc: "Generate random numbers in any range — perfect for draws, games and decisions.",
  intro: [
    "From picking a raffle winner to deciding who goes first in a board game, a quick random number settles it fairly. Enter a minimum and maximum, choose how many numbers you want (up to 100), and hit Generate.",
    "Both endpoints are included — a range of 1 to 100 can produce 1 or 100. Numbers are drawn with your browser's built-in random generator, which is perfectly fair for games, draws and everyday decisions."
  ],
  faq: [
    ["Are the numbers truly random?", "They come from your browser's Math.random, a pseudorandom generator that is statistically uniform and fine for games and draws. It is not cryptographically secure, so do not use it for passwords, encryption keys or real-money lotteries."],
    ["Can the minimum or maximum appear?", "Yes — the range is inclusive on both ends."],
    ["Can numbers repeat?", "Yes. Each number is drawn independently, so duplicates are possible — especially with a small range and a large count."],
    ["Does it work offline?", "Yes — once the page has loaded, everything runs locally in your browser."]
  ],
  formHtml: `<div class="frow cols3">
  <div class="field"><label for="mn">Minimum</label><input id="mn" type="number" value="1"></div>
  <div class="field"><label for="mx">Maximum</label><input id="mx" type="number" value="100"></div>
  <div class="field"><label for="cnt5">Count <span class="hint">max 100</span></label><input id="cnt5" type="number" value="1" min="1" max="100"></div>
</div>
<div class="frow">
  <button class="btn" id="rgen" type="button">Generate</button>
</div>
<div class="out" id="rlist"></div>
<p class="note">Numbers are drawn with your browser's built-in random generator (Math.random) — fair for games and draws, not for cryptography or lotteries.</p>`,
  pure: `function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }`,
  wiring: `function doRandom() {
  var mn = Math.floor(FTH.num("mn")), mx = Math.floor(FTH.num("mx"));
  var n = Math.floor(FTH.num("cnt5"));
  if (isNaN(mn) || isNaN(mx)) { FTH.el("rlist").textContent = "Enter a minimum and a maximum."; return; }
  if (mn > mx) { FTH.el("rlist").textContent = "Minimum must be less than or equal to maximum."; return; }
  if (isNaN(n) || n < 1) { n = 1; }
  if (n > 100) { n = 100; }
  var arr = [];
  for (var i = 0; i < n; i++) { arr.push(randomInt(mn, mx)); }
  FTH.el("rlist").textContent = arr.join(", ");
}
FTH.el("rgen").addEventListener("click", doRandom);
doRandom();`,
  tests: [],
  extraHead: ""
},
{
  slug: "stopwatch-timer",
  title: "Stopwatch & Timer – Free Online",
  meta: "Free online stopwatch with lap times and a countdown timer with an alarm beep. Accurate to the hundredth of a second — no download or signup needed.",
  h1: "Stopwatch & Timer",
  category: "Everyday",
  cardDesc: "Precise stopwatch with laps, plus a countdown timer with an alarm beep.",
  intro: [
    "A stopwatch for timing workouts, cooking, presentations or productivity sprints, and a countdown timer for anything with a deadline — together on one page, accurate to the hundredth of a second.",
    "The stopwatch supports pause and resume, lap times and reset; the countdown lets you set minutes and seconds, pause mid-way, and plays an audible beep when time runs out. Both are driven by the system clock rather than by counting timer ticks, so they stay accurate even if the browser slows down."
  ],
  faq: [
    ["How accurate is the stopwatch?", "It measures elapsed time with the system clock (millisecond precision) and displays hundredths of a second. Accurate enough for training and everyday timing, though not certified for official sports."],
    ["Will the countdown beep if the tab is in the background?", "The timer keeps tracking correctly using the system clock, but browsers throttle background tabs, so the display may freeze until you return. Keep the tab open for the most reliable alarm."],
    ["Do I need to install anything?", "No — it runs entirely in your browser with no downloads, accounts or permissions. The alarm sound is generated with WebAudio, so no audio files are needed either."],
    ["Why does the display update in small steps?", "The display refreshes about 20 times per second — plenty smooth for reading hundredths of a second while keeping CPU usage low."]
  ],
  formHtml: `<div class="frow">
  <button class="btn" id="tabSw" type="button">Stopwatch</button>
  <button class="btn-ghost" id="tabCd" type="button">Countdown</button>
</div>
<div id="swPane">
  <div class="sw-display" id="swDisp">00:00.00</div>
  <div class="sw-btns">
    <button class="btn" id="swStart" type="button">Start</button>
    <button class="btn-ghost" id="swLap" type="button">Lap</button>
    <button class="btn-ghost" id="swReset" type="button">Reset</button>
  </div>
  <ol class="laps" id="laps"></ol>
</div>
<div id="cdPane" hidden>
  <div class="frow cols3">
    <div class="field"><label for="cdMin">Minutes</label><input id="cdMin" type="number" value="5" min="0"></div>
    <div class="field"><label for="cdSec">Seconds</label><input id="cdSec" type="number" value="0" min="0" max="59"></div>
    <div class="field"><label>&nbsp;</label><button class="btn" id="cdStart" type="button">Start</button></div>
  </div>
  <div class="sw-display" id="cdDisp">05:00.00</div>
  <div class="sw-btns">
    <button class="btn-ghost" id="cdReset" type="button">Reset</button>
  </div>
  <p class="note">The timer plays a beep when it finishes. Keep the tab open — background tabs may update less often.</p>
</div>`,
  pure: `function formatTime(ms) {
  if (ms < 0) { ms = 0; }
  var cs = Math.round(ms / 10);
  var m = Math.floor(cs / 6000), s = Math.floor((cs % 6000) / 100), c = cs % 100;
  function p(n) { return (n < 10 ? "0" : "") + n; }
  return p(m) + ":" + p(s) + "." + p(c);
}`,
  wiring: `function showTab(sw) {
  FTH.el("swPane").hidden = !sw;
  FTH.el("cdPane").hidden = sw;
  FTH.el("tabSw").className = sw ? "btn" : "btn-ghost";
  FTH.el("tabCd").className = sw ? "btn-ghost" : "btn";
}
FTH.el("tabSw").addEventListener("click", function () { showTab(true); });
FTH.el("tabCd").addEventListener("click", function () { showTab(false); });
var swTimer = null, swAcc = 0, swT0 = 0, swOn = false, lapN = 0;
function swElapsed() { return swAcc + (swOn ? Date.now() - swT0 : 0); }
function swTick() { FTH.el("swDisp").textContent = formatTime(swElapsed()); }
function swToggle() {
  if (swOn) {
    swAcc = swElapsed(); swOn = false;
    clearInterval(swTimer); swTimer = null;
    FTH.el("swStart").textContent = "Resume";
  } else {
    swT0 = Date.now(); swOn = true;
    swTimer = setInterval(swTick, 47);
    FTH.el("swStart").textContent = "Pause";
  }
}
FTH.el("swStart").addEventListener("click", swToggle);
FTH.el("swLap").addEventListener("click", function () {
  if (!swOn && swAcc === 0) { return; }
  lapN++;
  FTH.el("laps").innerHTML += "<li>Lap " + lapN + " — " + formatTime(swElapsed()) + "</li>";
});
FTH.el("swReset").addEventListener("click", function () {
  if (swTimer) { clearInterval(swTimer); swTimer = null; }
  swOn = false; swAcc = 0; lapN = 0;
  FTH.el("swDisp").textContent = formatTime(0);
  FTH.el("laps").innerHTML = "";
  FTH.el("swStart").textContent = "Start";
});
var cdTimer = null, cdEnd = 0, cdLeft = 0, cdOn = false;
function cdInputsMs() {
  var m = Math.max(0, Math.floor(FTH.num("cdMin")) || 0);
  var s = Math.max(0, Math.min(59, Math.floor(FTH.num("cdSec")) || 0));
  return (m * 60 + s) * 1000;
}
function cdBeep() {
  try {
    var AC = window.AudioContext || window.webkitAudioContext;
    var ctx = new AC();
    var t = ctx.currentTime;
    for (var i = 0; i < 3; i++) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 880;
      o.start(t + i * 0.35); o.stop(t + i * 0.35 + 0.25);
    }
  } catch (e) {}
}
function cdTick() {
  var left = cdEnd - Date.now();
  if (left <= 0) { cdFinish(); return; }
  FTH.el("cdDisp").textContent = formatTime(left);
}
function cdFinish() {
  if (cdTimer) { clearInterval(cdTimer); cdTimer = null; }
  cdOn = false; cdLeft = 0;
  FTH.el("cdDisp").textContent = formatTime(0);
  FTH.el("cdStart").textContent = "Start";
  cdBeep();
}
function cdToggle() {
  if (cdOn) {
    cdLeft = cdEnd - Date.now(); cdOn = false;
    clearInterval(cdTimer); cdTimer = null;
    FTH.el("cdStart").textContent = "Resume";
    return;
  }
  if (cdLeft <= 0) {
    cdLeft = cdInputsMs();
    if (cdLeft <= 0) { return; }
  }
  cdEnd = Date.now() + cdLeft;
  cdOn = true;
  cdTimer = setInterval(cdTick, 47);
  FTH.el("cdStart").textContent = "Pause";
}
function cdShowIdle() {
  if (!cdOn && cdLeft === 0) { FTH.el("cdDisp").textContent = formatTime(cdInputsMs()); }
}
FTH.el("cdStart").addEventListener("click", cdToggle);
FTH.el("cdReset").addEventListener("click", function () {
  if (cdTimer) { clearInterval(cdTimer); cdTimer = null; }
  cdOn = false; cdLeft = 0;
  FTH.el("cdStart").textContent = "Start";
  FTH.el("cdDisp").textContent = formatTime(cdInputsMs());
});
FTH.el("cdMin").addEventListener("change", cdShowIdle);
FTH.el("cdSec").addEventListener("change", cdShowIdle);`,
  tests: [
    { fn: "formatTime", args: [61500], expected: "01:01.50", tol: 0 },
    { fn: "formatTime", args: [0], expected: "00:00.00", tol: 0 },
    { fn: "formatTime", args: [1234], expected: "00:01.23", tol: 0 }
  ],
  extraHead: ""
},
{
  slug: "text-to-speech",
  title: "Text to Speech – Read Text Aloud Free",
  meta: "Convert text to natural-sounding speech right in your browser. Pick a voice, adjust rate and pitch, and listen instantly — free text-to-speech tool.",
  h1: "Text to Speech",
  category: "Everyday",
  cardDesc: "Turn any text into spoken audio using your browser's built-in voices.",
  intro: [
    "Turn any text into spoken audio without installing anything. Paste an article, a paragraph you have written, or anything you want to proofread by ear, pick from the voices installed on your device, and press Speak.",
    "You can slow the rate down to catch every word or speed it up for skimming, and adjust the pitch to taste. Listening to your own writing read aloud is one of the fastest ways to catch awkward phrasing and typos."
  ],
  faq: [
    ["Which voices are available?", "The tool uses the voices built into your browser and operating system — that is why the list differs between Chrome, Edge, Safari and mobile devices. Installing additional system voices or language packs adds them here automatically."],
    ["Can I download the audio as an MP3?", "No. Playback happens live through your device's speech engine; this tool does not create audio files."],
    ["Is my text sent to a server?", "No. The browser's built-in speech synthesis processes everything locally on your device — your text never leaves your computer."],
    ["Why do some languages sound robotic?", "Voice quality depends on the speech engine your operating system provides. Desktop browsers generally offer the most natural voices; some mobile or Linux setups only include basic ones."]
  ],
  formHtml: `<div class="frow">
  <div class="field"><label for="ttsText">Text to speak</label><textarea id="ttsText" rows="4">Hello! This is a free text-to-speech demo running entirely in your browser.</textarea></div>
</div>
<div class="frow cols3">
  <div class="field"><label for="ttsVoice">Voice</label><select id="ttsVoice"></select></div>
  <div class="field"><label for="ttsRate">Rate <span class="hint" id="rateVal">1</span></label><input id="ttsRate" type="range" min="0.5" max="2" step="0.1" value="1"></div>
  <div class="field"><label for="ttsPitch">Pitch <span class="hint" id="pitchVal">1</span></label><input id="ttsPitch" type="range" min="0" max="2" step="0.1" value="1"></div>
</div>
<div class="frow">
  <button class="btn" id="speak" type="button">Speak</button>
  <button class="btn-ghost" id="ttsStop" type="button">Stop</button>
</div>
<div class="note" id="ttsNote" hidden></div>`,
  pure: ``,
  wiring: `if (!("speechSynthesis" in window)) {
  var ttsN = FTH.el("ttsNote");
  ttsN.hidden = false;
  ttsN.textContent = "Text to speech is not supported in this browser. Try Chrome, Edge or Safari.";
} else {
  var vSel = FTH.el("ttsVoice");
  var pickDefault = -1;
  function loadVoices() {
    var vs = window.speechSynthesis.getVoices();
    var html = "";
    for (var i = 0; i < vs.length; i++) {
      html += '<option value="' + i + '">' + vs[i].name + ' (' + vs[i].lang + ')</option>';
      if (pickDefault < 0 && vs[i].lang && vs[i].lang.toLowerCase().indexOf("en") === 0) { pickDefault = i; }
    }
    vSel.innerHTML = html || '<option value="-1">No voices found</option>';
    if (pickDefault >= 0) { vSel.value = String(pickDefault); }
  }
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
  FTH.el("ttsRate").addEventListener("input", function () { FTH.el("rateVal").textContent = FTH.str("ttsRate"); });
  FTH.el("ttsPitch").addEventListener("input", function () { FTH.el("pitchVal").textContent = FTH.str("ttsPitch"); });
  FTH.el("speak").addEventListener("click", function () {
    var txt = FTH.str("ttsText");
    if (!txt) { return; }
    var u = new SpeechSynthesisUtterance(txt);
    var vs = window.speechSynthesis.getVoices();
    var vi = parseInt(FTH.str("ttsVoice"), 10);
    if (vs[vi]) { u.voice = vs[vi]; }
    u.rate = parseFloat(FTH.str("ttsRate")) || 1;
    u.pitch = parseFloat(FTH.str("ttsPitch")) || 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  });
  FTH.el("ttsStop").addEventListener("click", function () { window.speechSynthesis.cancel(); });
}`,
  tests: [],
  extraHead: ""
}
];
