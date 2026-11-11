/* ============ init ============ */
applyTheme();
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (!store.get('theme', null)) applyTheme(); });
$('#skip').addEventListener('click', e => { e.preventDefault(); $('#main').focus(); });
// A page file (e.g. practice.html) sets window.__PAGE__; render that view on load. Hash routing still works for navigation.
if (window.__PAGE__ && !location.hash) location.replace('#/' + window.__PAGE__);
route_();
