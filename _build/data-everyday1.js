/* FreeToolHub tool specs — batch 1: Everyday tools (7).
   Generated 2026-09-27. Each spec: SEO fields, copy, form markup,
   pure logic (DOM-free), DOM wiring, and known-answer tests. */
module.exports = [
{
  slug: "age-calculator",
  title: "Age Calculator – Calculate Your Exact Age",
  meta: "Find your exact age in years, months and days with our free age calculator. Enter your birth date and see total days and months too.",
  h1: "Age Calculator",
  category: "Everyday",
  cardDesc: "Find your exact age in years, months and days — plus total days lived.",
  intro: [
    "Birthdays tell you another year has passed, but they don't tell you exactly how old you are down to the day. Our free age calculator does the maths for you: enter your date of birth, pick the date you want to calculate against, and get your precise age in years, months and days — along with the total number of months and days you have been alive.",
    "It is useful for far more than curiosity. Parents use it to check a child's exact age for school admissions, travellers use it for visa forms that ask for age in years and months, and planners use it for retirement and insurance calculations. Everything runs instantly in your browser, and no personal data ever leaves your device."
  ],
  faq: [
    ["How is my age calculated?", "We subtract your birth date from the target date using standard calendar borrowing: if the day or month of the target date is smaller, we borrow from the month or year, just like manual date arithmetic. Leap years are handled automatically."],
    ["What is the \u2018as of\u2019 date for?", "It defaults to today, but you can set any past or future date — for example, to find out how old you will be on a wedding day, or how old someone was on a historical date."],
    ["What if I was born on 29 February?", "Leap-day birthdays are handled naturally: the calculator counts the real number of days between the two dates, so your age is always correct even across leap years."],
    ["Is my date of birth stored anywhere?", "No. The calculation happens entirely in your browser with JavaScript — nothing is sent to a server or saved."]
  ],
  formHtml: `<div class="frow">
  <div class="field"><label for="dob">Date of birth</label><input type="date" id="dob" value="1990-06-15"></div>
  <div class="field"><label for="asof">Calculate age as of <span class="hint">defaults to today</span></label><input type="date" id="asof"></div>
</div>
<button class="btn" id="agego">Calculate Age</button>
<div class="result" id="result" hidden></div>`,
  pure: `function ageCalc(dobISO, asOfISO) {
  var dob = new Date(dobISO + "T00:00:00");
  var asOf = new Date(asOfISO + "T00:00:00");
  var years = asOf.getFullYear() - dob.getFullYear();
  var months = asOf.getMonth() - dob.getMonth();
  var days = asOf.getDate() - dob.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  var totalDays = Math.round((asOf.getTime() - dob.getTime()) / 86400000);
  return { years: years, months: months, days: days, totalDays: totalDays };
}`,
  wiring: `var _t = new Date();
var _today = _t.getFullYear() + '-' + String(_t.getMonth() + 1).padStart(2, '0') + '-' + String(_t.getDate()).padStart(2, '0');
FTH.el('asof').value = _today;
FTH.el('agego').addEventListener('click', function () {
  var dob = FTH.str('dob');
  var asof = FTH.str('asof') || _today;
  if (!dob) { FTH.setResult('<div class="note">Please enter your date of birth.</div>'); return; }
  if (asof < dob) { FTH.setResult('<div class="note">The "as of" date must be after the date of birth.</div>'); return; }
  var a = ageCalc(dob, asof);
  var totalMonths = a.years * 12 + a.months;
  FTH.setResult('<div class="rbig">' + a.years + ' years, ' + a.months + ' months, ' + a.days + ' days</div>' +
    '<div class="rrow"><span class="k">Total months</span><span class="v">' + FTH.fmtIN(totalMonths, 0) + '</span></div>' +
    '<div class="rrow"><span class="k">Total days</span><span class="v">' + FTH.fmtIN(a.totalDays, 0) + '</span></div>');
});
FTH.el('agego').click();`,
  tests: [
    { fn: "ageCalc", args: ["1990-01-15", "2026-09-27"], expected: { years: 36, months: 8, days: 12, totalDays: 13404 } },
    { fn: "ageCalc", args: ["1990-03-30", "2026-09-27"], expected: { years: 36, months: 5, days: 28, totalDays: 13330 } }
  ],
  extraHead: ""
},
{
  slug: "bmi-calculator",
  title: "BMI Calculator – Check Your Body Mass Index",
  meta: "Calculate your Body Mass Index instantly with our free BMI calculator. Enter weight and height to get your score, category and healthy range.",
  h1: "BMI Calculator",
  category: "Everyday",
  cardDesc: "Check your Body Mass Index in seconds and see your healthy weight range.",
  intro: [
    "Body Mass Index (BMI) is the quickest widely-used way to see whether your weight is in a healthy range for your height. Enter your weight in kilograms and your height in centimetres, and this free calculator instantly shows your BMI score, your category — underweight, normal, overweight or obese — and the weight range considered healthy for your height.",
    "BMI is a screening tool, not a diagnosis: it does not distinguish muscle from fat, so very muscular people, athletes, pregnant women and older adults should interpret it with care. Use it as a starting point for a conversation with a health professional, not as a final verdict on your health."
  ],
  faq: [
    ["How is BMI calculated?", "BMI equals weight in kilograms divided by height in metres squared. For example, 70 kg at 175 cm gives 70 / (1.75 x 1.75) = 22.9, which is in the normal range."],
    ["What are the BMI categories?", "Below 18.5 is underweight, 18.5\u201324.9 is normal weight, 25\u201329.9 is overweight, and 30 or above is obese. These are the standard World Health Organization cut-offs for adults."],
    ["What is a healthy weight for my height?", "The calculator shows it automatically: we multiply 18.5 and 24.9 by your height in metres squared to give the kilogram range considered healthy for you."],
    ["Why might BMI be misleading?", "Because it ignores body composition. A muscular athlete can have a high BMI without excess fat, while an older adult can have a normal BMI but low muscle mass. A waist measurement adds useful context."]
  ],
  formHtml: `<div class="frow">
  <div class="field"><label for="weight">Weight <span class="hint">kilograms</span></label><input type="number" id="weight" value="70" min="1" step="any"></div>
  <div class="field"><label for="height">Height <span class="hint">centimetres</span></label><input type="number" id="height" value="175" min="1" step="any"></div>
</div>
<button class="btn" id="bmigo">Calculate BMI</button>
<div class="result" id="result" hidden></div>`,
  pure: `function bmiCalc(kg, cm) {
  var m = cm / 100;
  return kg / (m * m);
}
function bmiCat(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}
function bmiRange(cm) {
  var m = cm / 100;
  return { low: 18.5 * m * m, high: 24.9 * m * m };
}`,
  wiring: `FTH.el('bmigo').addEventListener('click', function () {
  var kg = FTH.num('weight');
  var cm = FTH.num('height');
  if (!(kg > 0) || !(cm > 0)) { FTH.setResult('<div class="note">Please enter a valid weight and height.</div>'); return; }
  var b = bmiCalc(kg, cm);
  var r = bmiRange(cm);
  FTH.setResult('<div class="rbig">' + b.toFixed(2) + '</div>' +
    '<div class="rrow"><span class="k">Category</span><span class="v">' + bmiCat(b) + '</span></div>' +
    '<div class="note">A healthy BMI for most adults is 18.5 \u2013 24.9, which for ' + cm + ' cm is roughly ' + r.low.toFixed(1) + ' \u2013 ' + r.high.toFixed(1) + ' kg.</div>');
});
FTH.el('bmigo').click();`,
  tests: [
    { fn: "bmiCalc", args: [70, 175], expected: 22.86, tol: 0.01 },
    { fn: "bmiCat", args: [17], expected: "Underweight" },
    { fn: "bmiCat", args: [22.86], expected: "Normal weight" },
    { fn: "bmiCat", args: [27.5], expected: "Overweight" },
    { fn: "bmiCat", args: [32], expected: "Obese" },
    { fn: "bmiRange", args: [175], expected: { low: 56.65625, high: 76.25625 } }
  ],
  extraHead: ""
},
{
  slug: "qr-code-generator",
  title: "QR Code Generator – Create QR Codes Free",
  meta: "Generate free QR codes for links, text and contact details. Pick a size, preview instantly and save the code — no sign-up required.",
  h1: "QR Code Generator",
  category: "Everyday",
  cardDesc: "Turn any link or text into a scannable QR code instantly — free, no sign-up.",
  intro: [
    "QR codes are the fastest way to share a link, a Wi-Fi password or contact details: one scan and the phone does the rest. Paste any text or URL below, choose a size, and this free generator renders a crisp, high-contrast QR code you can use on posters, packaging, business cards or slides.",
    "The code is generated entirely in your browser using a widely-used open-source library — nothing you type is uploaded or stored. For the best scan results, use larger sizes for print and keep some quiet space around the code when you place it in a design."
  ],
  faq: [
    ["Do these QR codes expire?", "No. A QR code is just a picture of your text or link — it never expires and needs no subscription. Only the destination page itself could change or go offline."],
    ["Why does the tool need an internet connection?", "The QR rendering library loads from a public CDN the first time you use the tool. Once it is loaded, code generation happens fully in your browser."],
    ["How do I save the QR code?", "Right-click (or long-press on mobile) the generated code and choose Save image. For print, pick the 400 px size for sharper output."],
    ["Can I use the codes commercially?", "Yes — QR codes you generate here are free for personal and commercial use, with no watermark."]
  ],
  formHtml: `<div class="field"><label for="qrtext">Text or URL</label><textarea id="qrtext" rows="3" placeholder="https://example.com">https://example.com</textarea></div>
<div class="frow">
  <div class="field"><label for="qrsize">Size</label><select id="qrsize"><option value="200">200 \u00d7 200 px</option><option value="300" selected>300 \u00d7 300 px</option><option value="400">400 \u00d7 400 px</option></select></div>
</div>
<button class="btn" id="qrgo">Generate QR Code</button>
<div class="result" id="result" hidden><div class="qrbox" id="qrbox"></div><div class="note" id="qrnote"></div></div>`,
  pure: ``,
  wiring: `FTH.el('qrgo').addEventListener('click', function () {
  var text = FTH.str('qrtext');
  var size = parseInt(FTH.el('qrsize').value, 10) || 300;
  var box = FTH.el('qrbox');
  var res = FTH.el('result');
  var note = FTH.el('qrnote');
  box.innerHTML = '';
  res.hidden = false;
  note.textContent = '';
  if (!text) { box.innerHTML = '<div class="note">Type some text or a URL first.</div>'; return; }
  if (typeof window.QRCode === 'undefined') { box.innerHTML = '<div class="note">The QR library could not load \u2014 this tool needs an internet connection the first time you use it.</div>'; return; }
  new QRCode(box, { text: text, width: size, height: size, correctLevel: QRCode.CorrectLevel.M });
  note.textContent = 'Right-click (or long-press on mobile) the code to save it as an image.';
});`,
  tests: [],
  extraHead: `<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>`
},
{
  slug: "password-generator",
  title: "Password Generator – Strong Random Passwords",
  meta: "Create strong random passwords up to 64 characters long. Mix uppercase, lowercase, numbers and symbols, then copy with one click.",
  h1: "Password Generator",
  category: "Everyday",
  cardDesc: "Generate strong random passwords with letters, numbers and symbols — free.",
  intro: [
    "Weak, reused passwords are still the most common way accounts get taken over. This free generator creates long, random passwords right in your browser — pick a length from 4 to 64 characters, choose which character sets to include, and copy the result straight into your password manager. A fresh password is generated every time you change any option.",
    "Longer is stronger: a 16-character password mixing all four character sets would take modern computers far longer than a human lifetime to brute-force. Passwords are generated locally on your device and are never sent, stored or logged anywhere."
  ],
  faq: [
    ["Are my generated passwords stored?", "No. Generation happens entirely in your browser's memory. When you close the tab, the password is gone — so save it in a password manager first."],
    ["How long should my password be?", "Use at least 16 characters for important accounts. Every extra character multiplies the guessing effort, so 20+ characters is even better and costs you nothing with a password manager."],
    ["Should I include symbols?", "Yes, when the site allows them. Symbols expand the character set from 62 to 88 characters, which makes every position of the password much harder to guess."],
    ["Is this safe for high-security accounts?", "This tool uses JavaScript's built-in random generator, which is fine for everyday logins. For the highest-security secrets — banking master passwords, crypto wallets — prefer your password manager's built-in generator, which uses cryptographic randomness."]
  ],
  formHtml: `<div class="frow">
  <div class="field"><label for="pwlen">Length <span class="hint">4 \u2013 64</span></label><input type="number" id="pwlen" value="16" min="4" max="64"></div>
</div>
<div class="frow">
  <div class="field"><label><input type="checkbox" id="pwUpper" checked> Uppercase (A\u2013Z)</label></div>
  <div class="field"><label><input type="checkbox" id="pwLower" checked> Lowercase (a\u2013z)</label></div>
  <div class="field"><label><input type="checkbox" id="pwNum" checked> Numbers (0\u20139)</label></div>
  <div class="field"><label><input type="checkbox" id="pwSym" checked> Symbols (!@#\u2026)</label></div>
</div>
<div class="frow">
  <div class="field"><button class="btn" id="pwgen">Generate Password</button></div>
  <div class="field"><button class="btn-ghost" id="pwcopy">Copy</button></div>
</div>
<div class="out" id="pwout"></div>
<div class="result" id="result" hidden></div>`,
  pure: `function buildCharset(opts) {
  var s = "";
  if (opts.upper) s += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (opts.lower) s += "abcdefghijklmnopqrstuvwxyz";
  if (opts.numbers) s += "0123456789";
  if (opts.symbols) s += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  return s;
}
function genPassword(len, charset) {
  var out = "";
  for (var i = 0; i < len; i++) {
    out += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return out;
}`,
  wiring: `function currentPwOpts() {
  return { upper: FTH.el('pwUpper').checked, lower: FTH.el('pwLower').checked, numbers: FTH.el('pwNum').checked, symbols: FTH.el('pwSym').checked };
}
function renderPw() {
  var len = Math.max(4, Math.min(64, FTH.num('pwlen') || 16));
  var cs = buildCharset(currentPwOpts());
  if (!cs) { FTH.el('pwout').textContent = ''; FTH.setResult('<div class="note">Select at least one character set.</div>'); return; }
  FTH.el('result').hidden = true;
  FTH.el('pwout').textContent = genPassword(len, cs);
}
FTH.el('pwgen').addEventListener('click', renderPw);
FTH.el('pwcopy').addEventListener('click', function () { FTH.copyText(FTH.el('pwout').textContent, FTH.el('pwcopy')); });
['pwlen', 'pwUpper', 'pwLower', 'pwNum', 'pwSym'].forEach(function (id) {
  FTH.el(id).addEventListener('input', renderPw);
  FTH.el(id).addEventListener('change', renderPw);
});
renderPw();`,
  tests: [
    { fn: "buildCharset", args: [{ upper: true, lower: true, numbers: true, symbols: true }], expected: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?" },
    { fn: "buildCharset", args: [{ upper: true, lower: false, numbers: false, symbols: false }], expected: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
    { fn: "buildCharset", args: [{ upper: false, lower: false, numbers: false, symbols: false }], expected: "" }
  ],
  extraHead: ""
},
{
  slug: "word-counter",
  title: "Word Counter – Count Words & Characters Online",
  meta: "Free online word counter: count words, characters, sentences and lines as you type, with estimated reading time. No sign-up needed.",
  h1: "Word Counter",
  category: "Everyday",
  cardDesc: "Count words, characters, sentences and lines live as you type — free tool.",
  intro: [
    "Whether you are staying under a social media limit, hitting an essay word count or trimming a draft, you need numbers you can trust. This free word counter updates live as you type: words, characters with and without spaces, sentences, lines, and an estimated reading time based on an average adult reading speed of 200 words per minute.",
    "Everything runs locally in your browser, so your text is never uploaded — safe for drafts, manuscripts and private notes. There are no length limits and no sign-up; just type or paste and watch the counts update instantly."
  ],
  faq: [
    ["What counts as a word?", "Anything separated by whitespace. A hyphenated compound like \u2018well-known\u2019 counts as one word, while \u2018well - known\u2019 with spaces counts as three — the same rule most editors and word processors use."],
    ["How is reading time estimated?", "We divide your word count by 200, the widely-cited average adult reading speed for English, and round to one decimal place. Dense or technical text usually takes longer in practice."],
    ["How are sentences counted?", "We split your text on full stops, exclamation marks and question marks, and count the non-empty pieces — so unusual text with lots of abbreviations can inflate the count slightly."],
    ["Is my text uploaded anywhere?", "No. Counting happens entirely with JavaScript in your browser — your words never leave your device."]
  ],
  formHtml: `<div class="field"><label for="wctext">Your text <span class="hint">counts update as you type</span></label><textarea id="wctext" rows="8">The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs!</textarea></div>
<button class="btn-ghost" id="wcclear">Clear</button>
<div class="result" id="result" hidden></div>`,
  pure: `function countStats(text) {
  var chars = text.length;
  var charsNoSpaces = text.replace(/\\s/g, "").length;
  var trimmed = text.trim();
  var words = trimmed === "" ? 0 : trimmed.split(/\\s+/).length;
  var sentences = text.split(/[.!?]+/).filter(function (s) { return s.trim().length > 0; }).length;
  var lines = text === "" ? 0 : text.split("\\n").length;
  var readMins = Math.round((words / 200) * 10) / 10;
  return { chars: chars, charsNoSpaces: charsNoSpaces, words: words, sentences: sentences, lines: lines, readMins: readMins };
}`,
  wiring: `function updateWC() {
  var s = countStats(FTH.el('wctext').value);
  FTH.setResult('<div class="rbig">' + s.words + ' words</div>' +
    '<div class="rrow"><span class="k">Characters</span><span class="v">' + s.chars + '</span></div>' +
    '<div class="rrow"><span class="k">Characters (no spaces)</span><span class="v">' + s.charsNoSpaces + '</span></div>' +
    '<div class="rrow"><span class="k">Sentences</span><span class="v">' + s.sentences + '</span></div>' +
    '<div class="rrow"><span class="k">Lines</span><span class="v">' + s.lines + '</span></div>' +
    '<div class="rrow"><span class="k">Reading time</span><span class="v">' + s.readMins + ' min</span></div>');
}
FTH.el('wctext').addEventListener('input', updateWC);
FTH.el('wcclear').addEventListener('click', function () { FTH.el('wctext').value = ''; updateWC(); FTH.el('wctext').focus(); });
updateWC();`,
  tests: [
    { fn: "countStats", args: ["Hello world. This is a test!"], expected: { chars: 28, charsNoSpaces: 23, words: 6, sentences: 2, lines: 1, readMins: 0 } },
    { fn: "countStats", args: ["First line.\nSecond line here!"], expected: { chars: 29, charsNoSpaces: 25, words: 5, sentences: 2, lines: 2, readMins: 0 } },
    { fn: "countStats", args: [""], expected: { chars: 0, charsNoSpaces: 0, words: 0, sentences: 0, lines: 0, readMins: 0 } }
  ],
  extraHead: ""
},
{
  slug: "case-converter",
  title: "Case Converter – Change Text Case Online Free",
  meta: "Convert text to UPPERCASE, lowercase, Title Case, Sentence case or aLtErNaTiNg case instantly. Free, fast and runs in your browser.",
  h1: "Case Converter",
  category: "Everyday",
  cardDesc: "Switch text between UPPERCASE, lowercase, Title Case, Sentence and more.",
  intro: [
    "Pasted text in ALL CAPS from a PDF? A headline that needs proper Title Case? This free case converter fixes text casing in one click: UPPERCASE, lowercase, Title Case, Sentence case, and aLtErNaTiNg case for playful effect. Your text is transformed instantly and stays in the box, ready to copy.",
    "Title Case capitalises the first letter of every word, while Sentence case lowercases everything first and then capitalises the start of each sentence — ideal for cleaning up pasted content. Like every FreeToolHub tool, conversion happens entirely in your browser; nothing is uploaded."
  ],
  faq: [
    ["What does each case style do?", "UPPERCASE makes every letter capital; lowercase makes every letter small; Title Case capitalises each word; Sentence case capitalises the first letter of each sentence; aLtErNaTiNg case alternates lower and upper letters."],
    ["Will it fix my document's formatting?", "It only changes letter casing — bold, italics, links and other rich formatting are not preserved, since the tool works with plain text."],
    ["Does Title Case handle small words like \u2018and\u2019?", "This converter capitalises every word including short ones, which suits most headlines. Formal title-casing rules vary by style guide, so give the result a quick read before publishing."],
    ["Is my text sent to a server?", "No — the conversion runs locally in your browser with JavaScript, so your text never leaves your device."]
  ],
  formHtml: `<div class="field"><label for="cctext">Your text</label><textarea id="cctext" rows="6">Type or paste your text here, then choose a case style.</textarea></div>
<div class="frow">
  <div class="field"><button class="btn-ghost" id="ccUpper">UPPERCASE</button></div>
  <div class="field"><button class="btn-ghost" id="ccLower">lowercase</button></div>
  <div class="field"><button class="btn-ghost" id="ccTitle">Title Case</button></div>
  <div class="field"><button class="btn-ghost" id="ccSentence">Sentence case</button></div>
  <div class="field"><button class="btn-ghost" id="ccAlt">aLtErNaTiNg</button></div>
  <div class="field"><button class="btn" id="ccCopy">Copy</button></div>
</div>`,
  pure: `function toUpperCase2(t) { return t.toUpperCase(); }
function toLower2(t) { return t.toLowerCase(); }
function toTitle(t) {
  return t.toLowerCase().replace(/\\b\\w+/g, function (w) { return w.charAt(0).toUpperCase() + w.slice(1); });
}
function toSentence(t) {
  return t.toLowerCase().replace(/(^\\s*[a-z])|([.!?]\\s*[a-z])/g, function (m) { return m.toUpperCase(); });
}
function toAlternating(t) {
  return t.split("").map(function (c, i) { return i % 2 === 1 ? c.toUpperCase() : c.toLowerCase(); }).join("");
}`,
  wiring: `function applyCase(fn) { FTH.el('cctext').value = fn(FTH.el('cctext').value); }
FTH.el('ccUpper').addEventListener('click', function () { applyCase(toUpperCase2); });
FTH.el('ccLower').addEventListener('click', function () { applyCase(toLower2); });
FTH.el('ccTitle').addEventListener('click', function () { applyCase(toTitle); });
FTH.el('ccSentence').addEventListener('click', function () { applyCase(toSentence); });
FTH.el('ccAlt').addEventListener('click', function () { applyCase(toAlternating); });
FTH.el('ccCopy').addEventListener('click', function () { FTH.copyText(FTH.el('cctext').value, FTH.el('ccCopy')); });`,
  tests: [
    { fn: "toUpperCase2", args: ["hello World 123"], expected: "HELLO WORLD 123" },
    { fn: "toLower2", args: ["HeLLo World"], expected: "hello world" },
    { fn: "toTitle", args: ["hello world"], expected: "Hello World" },
    { fn: "toTitle", args: ["tHE qUICK bROWN fOX"], expected: "The Quick Brown Fox" },
    { fn: "toSentence", args: ["hello world. this is a test!"], expected: "Hello world. This is a test!" },
    { fn: "toAlternating", args: ["hello"], expected: "hElLo" }
  ],
  extraHead: ""
},
{
  slug: "json-formatter-validator",
  title: "JSON Formatter & Validator – Format JSON Online",
  meta: "Validate and format JSON online for free. Pretty-print with 2 or 4 space indent, minify in one click, and spot syntax errors instantly.",
  h1: "JSON Formatter & Validator",
  category: "Everyday",
  cardDesc: "Validate, pretty-print and minify JSON with clear, helpful error messages.",
  intro: [
    "Debugging an API response or a config file? Paste your JSON below and this free validator will check it instantly. Valid JSON gets pretty-printed with your choice of 2- or 4-space indentation; invalid JSON gets a clear error message pointing at the problem — no more guessing where the missing comma is.",
    "The Minify button strips all unnecessary whitespace for production use, and Copy grabs the result in one click. All parsing happens locally in your browser, so sensitive API payloads and config files are never uploaded to any server."
  ],
  faq: [
    ["What are the most common JSON errors?", "Trailing commas after the last item, single quotes instead of double quotes, unquoted property names, and comments — none of these are valid JSON, and this tool flags each one with its position."],
    ["What is the difference between Format and Minify?", "Format (pretty-print) adds line breaks and indentation so humans can read the JSON; Minify removes all optional whitespace so the JSON is as small as possible for sending over the network."],
    ["Why does valid-looking JSON sometimes fail elsewhere?", "Strict parsers reject duplicate keys, numbers with leading zeros, and trailing data after the value. If our validator passes it, any spec-compliant parser should too."],
    ["Is my JSON data uploaded?", "No. Validation and formatting run entirely in your browser with the built-in JSON parser — your data never leaves your device."]
  ],
  formHtml: `<div class="field"><label for="jsontext">JSON input</label><textarea id="jsontext" rows="8" spellcheck="false">{
  "name": "FreeToolHub",
  "tools": 120,
  "free": true
}</textarea></div>
<div class="frow">
  <div class="field"><label for="jsonindent">Indent</label><select id="jsonindent"><option value="2" selected>2 spaces</option><option value="4">4 spaces</option></select></div>
</div>
<div class="frow">
  <div class="field"><button class="btn" id="jsonfmt">Format</button></div>
  <div class="field"><button class="btn-ghost" id="jsonmin">Minify</button></div>
  <div class="field"><button class="btn-ghost" id="jsoncopy">Copy</button></div>
</div>
<div class="out" id="jsonout"></div>
<div class="note" id="jsonerr" hidden style="color:#b3261e"></div>`,
  pure: `function formatJson(text, indent) {
  try {
    return { ok: true, pretty: JSON.stringify(JSON.parse(text), null, indent) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
function minifyJson(text) {
  try {
    return { ok: true, pretty: JSON.stringify(JSON.parse(text)) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}`,
  wiring: `function showJson(r) {
  var out = FTH.el('jsonout');
  var err = FTH.el('jsonerr');
  if (r.ok) { err.hidden = true; out.textContent = r.pretty; }
  else { out.textContent = ''; err.hidden = false; err.textContent = 'Invalid JSON: ' + r.error; }
}
FTH.el('jsonfmt').addEventListener('click', function () { showJson(formatJson(FTH.el('jsontext').value, parseInt(FTH.el('jsonindent').value, 10))); });
FTH.el('jsonmin').addEventListener('click', function () { showJson(minifyJson(FTH.el('jsontext').value)); });
FTH.el('jsoncopy').addEventListener('click', function () { FTH.copyText(FTH.el('jsonout').textContent, FTH.el('jsoncopy')); });
showJson(formatJson(FTH.el('jsontext').value, 2));`,
  tests: [
    { fn: "formatJson", args: ['{"b":2,"a":1}', 2], expected: { ok: true, pretty: '{\n  "b": 2,\n  "a": 1\n}' } },
    { fn: "minifyJson", args: ['{\n  "a": 1,\n  "b": [1, 2]\n}'], expected: { ok: true, pretty: '{"a":1,"b":[1,2]}' } },
    { fn: "formatJson", args: ['{bad json', 2], expected: { ok: false, error: "Expected property name or '}' in JSON at position 1 (line 1 column 2)" } }
  ],
  extraHead: ""
}
];
