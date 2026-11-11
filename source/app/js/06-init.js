/* ============ init ============ */
applyTheme();
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (!store.get('theme', null)) applyTheme(); });
$('#skip').addEventListener('click', e => { e.preventDefault(); $('#main').focus(); });
if (!location.hash) location.replace('#/home');
route_();
