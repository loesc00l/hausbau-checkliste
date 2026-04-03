/**
 * auth-guard.js – Hausbau Auth Guard
 * Muss NACH supabase-js geladen werden.
 * Versteckt die Seite sofort (html{visibility:hidden}) bis die Session geprüft ist.
 * Bei fehlender Session → Weiterleitung zu login.html
 */
(async function () {
  const SB_URL = atob("aHR0cHM6Ly9raW1vZ3N3Y29udXhpanN6cXBxei5zdXBhYmFzZS5jbw==");
  const SB_KEY = atob("ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW10cGJXOW5jM2RqYjI1MWVHbHFjM3B4Y0hGNklpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzTnpReE9UYzJNalVzSW1WNGNDSTZNakE0T1RjM016WXlOWDAuem1xbV9qUkcwWG5Edy1SYTRPZmZKWGxDclZQbkl5TlgtMEcwNmVUc2RvQQ==");

  try {
    const _sb = window.supabase.createClient(SB_URL, SB_KEY);
    window._sb = _sb;

    const { data: { session } } = await _sb.auth.getSession();

    if (!session) {
      const next = encodeURIComponent(location.href);
      location.replace("login.html?next=" + next);
      return;
    }

    // Session gültig → Seite anzeigen
    window._session = session;
    window._user    = session.user;

    // Anzeigename aus E-Mail ableiten (z. B. lucian@hausbau.local → Lucian)
    const raw  = (session.user.email || "").split("@")[0];
    window._displayName = raw.charAt(0).toUpperCase() + raw.slice(1);

    // Nav-Badge aktualisieren sobald DOM bereit ist
    function _applyNavUser() {
      var el = document.getElementById("navUser");
      if (el) el.textContent = "👤 " + window._displayName;
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", _applyNavUser);
    } else {
      _applyNavUser();
    }

    // Seite einblenden
    document.documentElement.style.visibility = "";

  } catch (err) {
    // Im Fehlerfall Seite trotzdem zur Login-Seite schicken
    console.error("Auth-Guard Fehler:", err);
    location.replace("login.html");
  }
})();

/** Globale Logout-Funktion – in allen geschützten Seiten verfügbar */
window.hausbauLogout = async function () {
  try { if (window._sb) await window._sb.auth.signOut(); } catch (_) {}
  location.replace("login.html");
};
