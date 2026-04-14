/* ── Anchor highlight ── */
function clearHighlight() {
  var el = document.querySelector('.section.highlighted');
  if (el) el.classList.remove('highlighted');
}
function highlightSection(id) {
  clearHighlight();
  var s = document.getElementById(id);
  if (s) s.classList.add('highlighted');
}
document.querySelectorAll('.section h2 .anchor').forEach(function(a) {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    var href = a.getAttribute('href'), id = href.slice(1);
    if (location.hash === href) {
      clearHighlight();
      history.replaceState(null, '', location.pathname);
    } else {
      highlightSection(id);
      history.replaceState(null, '', href);
    }
  });
});
if (location.hash) highlightSection(location.hash.slice(1));

/* ── Scroll progress ── */
var bar = document.querySelector('.scroll-progress');
window.addEventListener('scroll', function() {
  var top = document.documentElement.scrollTop;
  var max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  if (max > 0) bar.style.width = (top / max * 100) + '%';
});

/* ── Section & subsection scroll-in ── */
document.querySelectorAll('.article-body .section').forEach(function(s) {
  if (s.id !== 'intro') s.classList.add('scroll-reveal');
});
document.querySelectorAll('.article-body .section > h3').forEach(function(h3) {
  var group = document.createElement('div');
  group.className = 'subsection scroll-reveal';
  h3.parentNode.insertBefore(group, h3);
  group.appendChild(h3);
  var next = group.nextElementSibling;
  while (next && next.tagName !== 'H3' && next.tagName !== 'H2') {
    var toMove = next;
    next = next.nextElementSibling;
    group.appendChild(toMove);
  }
});
var obs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  });
}, { rootMargin: "0px 0px 100px 0px", threshold: 0.05 });
document.querySelectorAll('.scroll-reveal').forEach(function(s) { obs.observe(s); });

/* ── Copy button on code blocks ── */
document.querySelectorAll('pre code').forEach(function(code) {
  var pre = code.parentElement;
  var btn = document.createElement('button');
  btn.className = 'copy-btn';
  btn.textContent = 'Copy';
  btn.addEventListener('click', function() {
    navigator.clipboard.writeText(code.textContent).then(function() {
      btn.textContent = '\u2713 Copied';
      btn.classList.add('copied');
      setTimeout(function() { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
    });
  });
  pre.appendChild(btn);
});
