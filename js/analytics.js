/*
 * Shared Google Analytics (GA4) loader — single source of truth for the
 * tracking snippet that was previously copy-pasted into every page's <head>.
 * To change the measurement ID, edit MEASUREMENT_ID below once.
 *
 * Loaded as a classic <script src="js/analytics.js"> from each page's <head>.
 * Skips local/preview environments (file://, localhost) so that development
 * page views don't pollute the production analytics.
 */
(function () {
  var MEASUREMENT_ID = 'G-BWSX87WFZ6';

  // Only track real, hosted page views — never file:// opens or localhost.
  var host = location.hostname;
  if (location.protocol === 'file:' ||
      host === 'localhost' || host === '127.0.0.1' || host === '') {
    return;
  }

  // Standard GA4 bootstrap: set up the dataLayer queue, then load gtag.js.
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID);

  var loader = document.createElement('script');
  loader.async = true;
  loader.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(loader);
})();
