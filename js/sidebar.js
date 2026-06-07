/*
 * Shared site sidebar — the single source of truth for the left column.
 * Edit this markup once; every page injects it into its
 * <aside id="site-sidebar"> shell. The active nav link is set automatically
 * from the current page's filename.
 *
 * Loaded as a classic <script src="js/sidebar.js"> (not fetch) so it also
 * works when a page is opened directly from disk via file://, not only http.
 */
(function () {
  var SIDEBAR_HTML = `
      <img
        class="site-avatar"
        src="images/me_48px.jpg"
        alt="Andrew C. Rausch, MD — headshot"
        width="80"
        height="80"
      >

      <div class="site-identity">
        <p class="site-name">Andrew C. Rausch, MD</p>
        <p class="site-tagline">Maternal-Fetal Medicine<br>University of Chicago</p>
      </div>

      <nav class="site-nav" aria-label="Primary">
        <a href="index.html">Home</a>
        <a href="publications.html">Publications</a>
        <a href="resume.html">Resume</a>
        <a href="apps.html">Apps</a>
      </nav>

      <div class="site-social" aria-label="Contact and profiles">
        <p class="site-social-label">Contact &amp; Profiles</p>

        <!-- Email -->
        <a href="mailto:ARausch@bsd.uchicago.edu" aria-label="Email Andrew Rausch">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M3 4a2 2 0 0 0-2 2v1.16l9 5.4 9-5.4V6a2 2 0 0 0-2-2H3Zm16 4.337-8.447 5.07a1 1 0 0 1-1.106 0L1 8.337V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.337Z"/>
          </svg>
          ARausch@bsd.uchicago.edu
        </a>

        <!-- PubMed -->
        <a href="https://pubmed.ncbi.nlm.nih.gov/?term=Rausch+AC%5BAuthor%5D&sort=date" target="_blank" rel="noopener noreferrer" aria-label="PubMed profile (opens in new tab)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0 1 12 2v5h4a1 1 0 0 1 .82 1.573l-7 10A1 1 0 0 1 8 18v-5H4a1 1 0 0 1-.82-1.573l7-10a1 1 0 0 1 1.12-.381Z" clip-rule="evenodd"/>
          </svg>
          PubMed
        </a>

        <!-- GitHub -->
        <a href="https://github.com/rauscha" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile (opens in new tab)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12Z"/>
          </svg>
          GitHub
        </a>

        <!-- Google Scholar -->
        <a href="https://scholar.google.com/citations?user=gYnuAhAAAAAJ" target="_blank" rel="noopener noreferrer" aria-label="Google Scholar profile (opens in new tab)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 10a8 8 0 0 1 7.162 3.44L24 9.5 12 0z"/></svg>
          Google Scholar
        </a>

        <!-- ORCID -->
        <a href="https://orcid.org/0000-0001-9545-6024" target="_blank" rel="noopener noreferrer" aria-label="ORCID profile (opens in new tab)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z"/></svg>
          ORCID
        </a>
      </div>

      <a
        class="btn-cv"
        href="Andrew_Rausch_CV.pdf"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download CV as PDF (opens in new tab)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 1a.75.75 0 0 1 .75.75v6.19l1.97-1.97a.75.75 0 1 1 1.06 1.06L8.53 10.28a.75.75 0 0 1-1.06 0L4.22 7.03a.75.75 0 0 1 1.06-1.06L7.25 7.94V1.75A.75.75 0 0 1 8 1ZM2 12.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"/>
        </svg>
        Download CV
      </a>
  `;

  function render() {
    var mount = document.getElementById('site-sidebar');
    if (!mount) return;
    mount.innerHTML = SIDEBAR_HTML;

    // Mark the current page's nav link as active.
    var page = location.pathname.split('/').pop();
    if (!page) page = 'index.html';
    var links = mount.querySelectorAll('.site-nav a');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('href') === page) {
        links[i].setAttribute('aria-current', 'page');
      }
    }
  }

  if (document.getElementById('site-sidebar')) {
    render();
  } else {
    document.addEventListener('DOMContentLoaded', render);
  }
})();
