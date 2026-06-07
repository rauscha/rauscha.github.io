/*
 * Shared site footer — single source of truth for the footer that was
 * previously duplicated on every page. Injected into the
 * <footer id="site-footer"> shell, mirroring js/sidebar.js, and also stamps
 * the current year in place of the old inline year script.
 *
 * Loaded as a classic <script src="js/footer.js"> (not fetch) so it also works
 * when a page is opened directly from disk via file://, not only http.
 */
(function () {
  var FOOTER_HTML = `
      <p>
        &copy; <span id="year"></span> Andrew C. Rausch, MD &mdash;
        Hosted on <a href="https://pages.github.com" target="_blank" rel="noopener noreferrer">GitHub Pages</a>
      </p>
  `;

  function render() {
    var mount = document.getElementById('site-footer');
    if (!mount) return;
    mount.innerHTML = FOOTER_HTML;

    var year = mount.querySelector('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  if (document.getElementById('site-footer')) {
    render();
  } else {
    document.addEventListener('DOMContentLoaded', render);
  }
})();
