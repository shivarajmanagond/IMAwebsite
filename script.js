(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var header = document.querySelector(".site-header");
  function syncNavTop() {
    if (header) {
      document.documentElement.style.setProperty("--site-nav-top", header.offsetHeight + "px");
    }
  }
  syncNavTop();
  window.addEventListener("resize", syncNavTop);
  if (typeof ResizeObserver !== "undefined" && header) {
    new ResizeObserver(syncNavTop).observe(header);
  }

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", function () {
    syncNavTop();
    setOpen(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });

  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      var subject = form.querySelector('[name="subject"]');
      var body = form.querySelector('[name="body"]');
      if (!subject || !body) return;
      e.preventDefault();
      var href =
        "mailto:info@integratemindsautomation.com?subject=" +
        encodeURIComponent(subject.value) +
        "&body=" +
        encodeURIComponent(body.value);
      window.location.href = href;
    });
  }
})();
