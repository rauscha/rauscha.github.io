/*
 * Easter egg: the Konami code (↑↑↓↓←→←→BA) triggers a faux ultrasound
 * terminal readout. Single source of truth — this logic was previously
 * duplicated inline at the bottom of every page.
 *
 * Loaded as a classic <script src="js/konami.js"> at the end of <body>.
 */
(function () {
  const SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let idx = 0;

  document.addEventListener('keydown', function (e) {
    idx = (e.key === SEQ[idx]) ? idx + 1 : (e.key === SEQ[0] ? 1 : 0);
    if (idx === SEQ.length) { idx = 0; launch(); }
  });

  function launch() {
    if (document.getElementById('us-overlay')) return;

    if (!document.getElementById('us-style')) {
      const s = document.createElement('style');
      s.id = 'us-style';
      s.textContent = [
        '#us-overlay{position:fixed;inset:0;background:rgba(0,0,0,.93);display:flex;align-items:center;justify-content:center;z-index:9999;transition:opacity .35s ease}',
        '#us-box{width:min(520px,92vw);background:#030c06;border:1px solid #1c5228;border-radius:4px;padding:2rem 2.25rem;box-shadow:0 0 60px rgba(0,180,50,.1),0 0 0 1px #0b2415;position:relative;overflow:hidden}',
        '#us-box::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(0,180,50,.05) 0%,transparent 70%);pointer-events:none}',
        '#us-box::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.12) 3px,rgba(0,0,0,.12) 4px);pointer-events:none}',
        '#us-pre{font-family:"Courier New",Courier,monospace;font-size:.83rem;line-height:1.7;color:#3dff6e;text-shadow:0 0 8px rgba(61,255,110,.6);white-space:pre;margin:0}',
        '#us-hint{margin-top:1.5rem;font-family:"Courier New",Courier,monospace;font-size:.68rem;color:#195e28;text-align:center;letter-spacing:.06em}',
      ].join('');
      document.head.appendChild(s);
    }

    const overlay = document.createElement('div');
    overlay.id = 'us-overlay';
    overlay.innerHTML =
      '<div id="us-box">' +
        '<pre id="us-pre"></pre>' +
        '<p id="us-hint">[ press any key or click to dismiss ]</p>' +
      '</div>';
    document.body.appendChild(overlay);

    const pre = document.getElementById('us-pre');

    const LINES = [
      'RAUSCH ULTRASOUND  v2.0.26',
      '================================',
      '',
      'INITIATING SCAN...',
      '',
      '> Probe frequency : 2-5 MHz',
      '> Depth           : 16 cm',
      '> Gain            : optimized',
      '',
      '> Scanning...',
      '> Scanning...',
      '',
      '> BPD : 90 mm       HC : 320 mm',
      '> AC  : 310 mm      FL :  68 mm',
      '',
      '> EFW : 3,247 g  (AGA — 52nd %ile)',
      '> AFI : 13.2 cm',
      '> Placenta : anterior, grade 0',
      '> No anomalies detected.',
      '',
      '> ★ CHEAT CODE ACCEPTED ★',
    ];

    const LINE_PAUSE = [0,0,0,0,80,0,0,0,80,500,700,80,0,0,80,0,0,0,0,80,0];
    const CHAR_SPEED = 18;

    let li = 0, ci = 0, buf = [];

    function tick() {
      if (li >= LINES.length) return;
      const line = LINES[li];
      if (ci === 0) buf.push('');
      buf[li] = line.slice(0, ci);
      pre.textContent = buf.join('\n');
      if (ci < line.length) {
        ci++;
        setTimeout(tick, CHAR_SPEED);
      } else {
        li++; ci = 0;
        setTimeout(tick, LINE_PAUSE[li] !== undefined ? LINE_PAUSE[li] : 40);
      }
    }

    setTimeout(tick, 100);

    function close() {
      overlay.style.opacity = '0';
      setTimeout(function () { overlay.remove(); }, 350);
    }
    document.addEventListener('keydown', close, { once: true });
    overlay.addEventListener('click', close);
  }
})();
