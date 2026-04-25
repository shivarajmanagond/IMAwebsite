(function () {
  /* ── Year ── */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── Nav height CSS var ── */
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

  /* ── Sticky header shadow on scroll ── */
  function onScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── Mobile nav toggle ── */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
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
      link.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ── Active nav link on scroll (IntersectionObserver) ── */
  var navLinks = document.querySelectorAll(".site-nav a[href^='#']");
  function setActiveNav(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href").slice(1) === id);
    });
  }
  if ("IntersectionObserver" in window && navLinks.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveNav(entry.target.id);
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    navLinks.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var el = id && document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });
  }

  /* ── Scroll-reveal animations ── */
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("is-revealed");
    });
  }

  /* ── Contact form via Formspree ── */
  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");
  var submitBtn = document.getElementById("form-submit-btn");
  if (form && statusEl && submitBtn) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var action = form.getAttribute("action");
      if (action.indexOf("YOUR_FORM_ID") !== -1) {
        statusEl.textContent = "Please set up your Formspree form ID first.";
        statusEl.style.color = "#c0392b";
        return;
      }
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      statusEl.textContent = "";
      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            statusEl.textContent = "✓ Enquiry sent! We'll get back to you shortly.";
            statusEl.style.color = "#27ae60";
            form.reset();
          } else {
            throw new Error("failed");
          }
        })
        .catch(function () {
          statusEl.textContent = "✗ Something went wrong. Please email us directly.";
          statusEl.style.color = "#c0392b";
        })
        .finally(function () {
          submitBtn.textContent = "Send enquiry";
          submitBtn.disabled = false;
        });
    });
  }
})();
