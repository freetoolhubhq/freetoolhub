/* FreeToolHub test harness — verifies every tool's pure functions against known-answer tests.
   Run: node _build/run-tests.js  (from ~/workspace/freetoolhub) */
const vm = require('vm');
const path = require('path');

const dataFiles = ['data-finance.js', 'data-everyday1.js', 'data-everyday2.js'];
let pass = 0, fail = 0;
const failures = [];

function deepEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

// Tolerant deep comparison: numbers compared within tol, everything else strict.
// Handles objects/arrays containing floats (e.g. {amount: 141477.8196} vs {amount: 141477.82}).
function deepClose(a, b, tol) {
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) <= tol;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((x, i) => deepClose(x, b[i], tol));
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a), kb = Object.keys(b);
    return ka.length === kb.length && ka.every(k => deepClose(a[k], b[k], tol));
  }
  return a === b;
}

for (const f of dataFiles) {
  let specs;
  try {
    specs = require(path.join(__dirname, f));
  } catch (e) {
    fail++;
    failures.push(f + ': FAILED TO LOAD — ' + e.message);
    continue;
  }
  if (!Array.isArray(specs)) {
    fail++;
    failures.push(f + ': module.exports is not an array');
    continue;
  }
  for (const s of specs) {
    const label = (s && s.slug) || '(missing slug)';
    // required fields
    for (const k of ['slug', 'title', 'meta', 'h1', 'category', 'cardDesc', 'intro', 'faq', 'formHtml', 'pure', 'wiring', 'tests']) {
      if (!s || !(k in s)) { fail++; failures.push(label + ': missing field "' + k + '"'); }
    }
    if (s && s.title && s.title.length > 70) { fail++; failures.push(label + ': title too long (' + s.title.length + ')'); }
    if (s && s.meta && (s.meta.length < 100 || s.meta.length > 180)) { fail++; failures.push(label + ': meta length ' + s.meta.length + ' (want 120-160)'); }
    if (s && !Array.isArray(s.intro)) { fail++; failures.push(label + ': intro not an array'); }
    if (s && !Array.isArray(s.faq)) { fail++; failures.push(label + ': faq not an array'); }

    // run known-answer tests in a sandbox
    const sandbox = {};
    vm.createContext(sandbox);
    try {
      if (s.pure && String(s.pure).trim()) vm.runInContext(String(s.pure), sandbox, { filename: label + '-pure.js' });
    } catch (e) {
      fail++;
      failures.push(label + ': pure JS threw on load — ' + e.message);
      continue;
    }
    for (const t of (s.tests || [])) {
      const tlabel = label + ' :: ' + t.fn + '(' + (t.args || []).map(a => JSON.stringify(a)).join(', ') + ')';
      let got;
      try {
        const args = (t.args || []).map(a => JSON.stringify(a)).join(',');
        got = vm.runInContext(t.fn + '(' + args + ')', sandbox, { filename: label + '-test.js' });
      } catch (e) {
        fail++;
        failures.push(tlabel + ' THREW — ' + e.message);
        continue;
      }
      let ok;
      if (typeof t.expected === 'number') {
        ok = typeof got === 'number' && Math.abs(got - t.expected) <= (t.tol || 0);
      } else {
        ok = deepClose(got, t.expected, t.tol || 0);
      }
      if (ok) { pass++; }
      else {
        fail++;
        failures.push(tlabel + ' => got ' + JSON.stringify(got) + ', expected ' + JSON.stringify(t.expected));
      }
    }
  }
}

console.log('----------------------------------------');
console.log('PASS: ' + pass + '   FAIL: ' + fail);
if (failures.length) {
  console.log('FAILURES:');
  failures.forEach(f => console.log('  - ' + f));
  process.exit(1);
} else {
  console.log('All tests passed.');
}
