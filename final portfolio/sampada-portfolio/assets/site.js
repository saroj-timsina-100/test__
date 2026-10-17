(function () {
  var nav = document.querySelector('.nav');
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  function setOpen(open) {
    btn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
  }
  btn.addEventListener('click', function () { setOpen(btn.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setOpen(false); btn.focus(); } });
  // Light / dark switch. The theme itself is applied by the inline script in <head> before paint.
  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  var meta = document.querySelector('meta[name="theme-color"]');
  function saved() { try { return localStorage.getItem('theme'); } catch (e) { return null; } }
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    toggle.setAttribute('aria-pressed', String(t === 'dark'));
    if (meta) meta.setAttribute('content', t === 'dark' ? '#09090b' : '#fafafa');
  }
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var follow = function (e) { if (!saved()) applyTheme(e.matches ? 'dark' : 'light'); };
    if (mq.addEventListener) mq.addEventListener('change', follow); else if (mq.addListener) mq.addListener(follow);
  }
  // Fade sections in as they scroll into view. Content stays visible without JS or with reduced motion.
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }
  // If a logo file fails to load, show the company name instead of a broken image.
  document.querySelectorAll('.logo-img').forEach(function (img) {
    img.addEventListener('error', function () {
      var t = document.createElement('span');
      t.className = 'logo-text';
      t.textContent = img.getAttribute('data-name') || '';
      img.replaceWith(t);
    });
  });
})();
