/**
 * auth-guard.js – Hausbau Auth Guard v2
 * Session via localStorage – kein Supabase Auth mehr.
 * window._sb wird nur noch fuer Daten-Tabellen benoetigt.
 *
 * Voraussetzung in jeder geschuetzten Seite:
 *   <style>html{visibility:hidden}</style>
 *   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 *   <script src="auth-guard.js"></script>
 */
(function () {
  var SB_URL = atob("aHR0cHM6Ly9raW1vZ3N3Y29udXhpanN6cXBxei5zdXBhYmFzZS5jbw==");
  var SB_KEY = atob("ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW10cGJXOW5jM2RqYjI1MWVHbHFjM3B4Y0hGNklpd2ljbTlzWlNJNkluTmxjblpwWTJWZmNtOXNaU0lzSW1saGRDSTZNVGMzTkRFNU56WXlOU3dpWlhod0lqb3lNRGc1Tnpjek5qSTFmUS56bXFtX2pSRzBYbkR3LVJhNE9mZkpYbENyVlBuSXlOWC0wRzA2ZVRzZG9B");
  var SESSION_KEY = "hb_user";

  // Session aus localStorage laden
  var session = null;
  try { session = JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (_) {}

  if (!session || !session.id) {
    // Nicht eingeloggt -> zur Login-Seite umleiten
    var next = encodeURIComponent(location.href);
    location.replace("login.html?next=" + next);
    return;
  }

  // Session gueltig – globale Variablen setzen
  window._user        = session;          // {id, name, farbe, initialen}
  window._displayName = session.name;
  // Supabase-Client nur fuer Daten (Tabellen lesen/schreiben, kein Auth)
  window._sb = window.supabase.createClient(SB_URL, SB_KEY);

  // Nav-Badge setzen
  function applyNavUser() {
    var el = document.getElementById("navUser");
    if (el) el.textContent = String.fromCodePoint(0x1F464) + " " + session.name;
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyNavUser);
  } else {
    applyNavUser();
  }

  // Seite einblenden
  document.documentElement.style.visibility = "";
})();

/** Globale Logout-Funktion – in allen geschuetzten Seiten verfuegbar */
window.hausbauLogout = function () {
  localStorage.removeItem("hb_user");
  location.replace("login.html");
};
