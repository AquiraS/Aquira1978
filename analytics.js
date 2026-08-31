(() => {
  const measurementId = document.documentElement.dataset.gaMeasurementId;
  const storageKey = "aquira1978.analytics-consent";
  const banner = document.querySelector("[data-analytics-banner]");
  const preferences = document.querySelectorAll("[data-analytics-preference]");

  if (!/^G-[A-Z0-9]+$/.test(measurementId)) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });

  function readConsent() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }

  function storeConsent(value) {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
      // Consent remains effective for the current page when storage is unavailable.
    }
  }

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  function loadAnalytics() {
    if (document.querySelector("script[data-aquira-ga]")) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.aquiraGa = "true";
    document.head.append(script);

    gtag("js", new Date());
    gtag("config", measurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
  }

  function applyConsent(value, { reload = false } = {}) {
    const granted = value === "granted";
    storeConsent(granted ? "granted" : "denied");
    window[`ga-disable-${measurementId}`] = !granted;
    gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });

    if (granted) loadAnalytics();
    hideBanner();
    if (reload) window.location.reload();
  }

  const consent = readConsent();
  if (consent === "granted") {
    applyConsent("granted");
  } else if (consent === "denied") {
    applyConsent("denied");
  } else if (banner) {
    banner.hidden = false;
  }

  document.querySelectorAll("[data-analytics-accept]").forEach((button) => {
    button.addEventListener("click", () => applyConsent("granted"));
  });

  document.querySelectorAll("[data-analytics-decline]").forEach((button) => {
    button.addEventListener("click", () => applyConsent("denied"));
  });

  preferences.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.analyticsPreference;
      if (value === "granted" || value === "denied") {
        applyConsent(value, { reload: true });
      }
    });
  });
})();
