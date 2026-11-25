/* Pre-paint theme loader (avoids FOUC without inline scripts under strict CSP) */
(function () {
  var allowed = { dark: true, black: true, light: true };
  try {
    var saved = localStorage.getItem("mtb-theme");
    if (saved && allowed[saved]) {
      document.documentElement.setAttribute("data-theme", saved);
    }
  } catch (_) {
    /* Storage disabled; fall back to default dark theme in CSS */
  }
})();
