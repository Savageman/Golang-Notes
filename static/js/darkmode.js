/* ── Dark mode ── */
var toggle = document.querySelector('.dark-toggle');
function setDark(on) {
  document.body.classList.toggle('dark', on);
  toggle.textContent = on ? '\u2600\uFE0F' : '\uD83C\uDF19';
  localStorage.setItem('theme', on ? 'dark' : 'light');
}
toggle.addEventListener('click', function() {
  setDark(!document.body.classList.contains('dark'));
});
var saved = localStorage.getItem('theme');
if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  setDark(true);
}
