(function (global) {
  "use strict";

  // Único ponto de ativação. Vazio mantém o site sem coleta externa.
  const GA4_MEASUREMENT_ID = "";

  global.CNPJ_ANALYTICS_ENABLED = false;
  if (!/^G-[A-Z0-9]+$/.test(GA4_MEASUREMENT_ID)) return;

  global.dataLayer = global.dataLayer || [];
  global.gtag = function () { global.dataLayer.push(arguments); };
  global.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });
  global.gtag("js", new Date());
  global.gtag("config", GA4_MEASUREMENT_ID, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    // Não transportar possíveis dados presentes em URL/referrer.
    page_location: "https://geradorcnpjalfanumerico.com.br/",
    page_referrer: ""
  });

  const script = global.document.createElement("script");
  script.async = true;
  script.referrerPolicy = "no-referrer";
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_MEASUREMENT_ID;
  script.onerror = function () {
    global.CNPJ_ANALYTICS_ENABLED = false;
    global.dataLayer.length = 0;
  };
  global.document.head.appendChild(script);
  global.CNPJ_ANALYTICS_ENABLED = true;
  const notice = global.document.getElementById("analytics-privacy");
  if (notice) notice.hidden = false;
})(window);
