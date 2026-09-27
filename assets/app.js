/* FreeToolHub — shared helpers (vanilla JS, no dependencies) */
window.FTH = (function () {
  function el(id) { return document.getElementById(id); }
  function num(id) {
    var n = parseFloat(String(el(id).value).replace(/,/g, '').trim());
    return isNaN(n) ? 0 : n;
  }
  function str(id) { return String(el(id).value).trim(); }
  // Indian digit grouping: 1,00,000
  function fmtIN(n, dec) {
    dec = (dec === undefined) ? 2 : dec;
    if (!isFinite(n)) return '—';
    return Number(n).toLocaleString('en-IN', {
      minimumFractionDigits: dec, maximumFractionDigits: dec
    });
  }
  function inr(n) { return '₹' + fmtIN(Math.round(n), 0); }
  function show(id) { el(id).hidden = false; }
  function setResult(html) {
    var r = el('result');
    r.innerHTML = '<h3>Result</h3>' + html;
    r.hidden = false;
    r.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function copyText(text, btn) {
    function done() {
      if (!btn) return;
      var old = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(function () { btn.textContent = old; }, 1500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallback(); });
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta); done();
    }
  }
  return { el: el, num: num, str: str, fmtIN: fmtIN, inr: inr, show: show, setResult: setResult, copyText: copyText };
})();
