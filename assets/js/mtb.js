/* mtb.js — Minimal FMHY-inspired resource directory & item details */
(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";
  var ALLOWED_THEMES = ["dark", "black", "light"];
  var THEME_LABELS = { dark: "Dark", black: "Black", light: "Light" };
  var ALLOWED_VIEWS = ["grid", "list"];

  var rawSite = window.MTB_SITE && typeof window.MTB_SITE === "object" ? window.MTB_SITE : {};
  var SITE = {
    name: asText(rawSite.name, "mtb.com.np"),
    title: asText(rawSite.title, "Resources"),
    subtitle: asText(rawSite.subtitle, ""),
    githubUrl: sanitizeUrl(rawSite.githubUrl, false) || "https://github.com/mtbcomnp",
    email: asText(rawSite.email, "info@mtb.com.np"),
  };

  var RESOURCES = normalizeResources(window.MTB_RESOURCES);

  // DOM references (shared + page-specific)
  var dom = {
    pageTitle: document.getElementById("page-title"),
    pageSub: document.getElementById("page-sub"),
    sidebar: document.getElementById("sidebar"),
    sidebarBackdrop: document.getElementById("sidebar-backdrop"),
    sidebarClose: document.getElementById("sidebar-close"),
    navMenuBtn: document.getElementById("nav-menu-btn"),
    sidebarBrowse: document.getElementById("sidebar-browse"),
    sidebarCategories: document.getElementById("sidebar-categories"),
    mobilePills: document.getElementById("mobile-pills"),
    sortSelect: document.getElementById("sort-select"),
    resultsSummary: document.getElementById("results-summary"),
    resetFilterBtn: document.getElementById("reset-filter-btn"),
    itemsContainer: document.getElementById("items-container"),
    emptyState: document.getElementById("empty-state"),
    emptyResetBtn: document.getElementById("empty-reset-btn"),
    viewGridBtn: document.getElementById("view-grid-btn"),
    viewListBtn: document.getElementById("view-list-btn"),
    detailRoot: document.getElementById("detail-root"),
    detailMissing: document.getElementById("detail-missing"),
    themeToggle: document.getElementById("theme-toggle"),
    themeLabel: document.getElementById("theme-label"),
    searchTrigger: document.getElementById("search-trigger"),
    searchOverlay: document.getElementById("search-overlay"),
    searchInput: document.getElementById("search-input"),
    searchClose: document.getElementById("search-close"),
    searchResults: document.getElementById("search-results"),
    footerYear: document.getElementById("footer-year"),
    footerName: document.getElementById("footer-name"),
  };

  var isDirectoryPage = Boolean(dom.itemsContainer);
  var isDetailPage = Boolean(dom.detailRoot);

  // App state
  var state = {
    category: "All",
    sort: "featured",
    view: readStorage("mtb-view", ALLOWED_VIEWS, "grid"),
    theme: readStorage("mtb-theme", ALLOWED_THEMES, "dark"),
    searchActiveIndex: -1,
    searchItems: [],
  };

  // ── Utilities & Sanitization ──────────────────────────────────
  function asText(value, fallback) {
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
  }

  function sanitizeUrl(raw, allowMailto) {
    if (typeof raw !== "string") return "";
    var trimmed = raw.trim();
    if (!trimmed || trimmed === "#") return "";
    try {
      var parsed = new URL(trimmed, window.location.href);
      var proto = parsed.protocol;
      if (proto === "https:" || proto === "http:") return parsed.href;
      if (allowMailto && proto === "mailto:") return parsed.href;
      return "";
    } catch (_) {
      return "";
    }
  }

  function formatHost(url) {
    if (!url) return "";
    try {
      return new URL(url).hostname;
    } catch (_) {
      return "";
    }
  }

  function parseDateMs(dateStr) {
    if (typeof dateStr !== "string" || !dateStr.trim()) return 0;
    var ms = Date.parse(dateStr);
    return Number.isFinite(ms) ? ms : 0;
  }

  function slugify(value, fallbackIndex) {
    var base = String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return base || "item-" + String(fallbackIndex + 1);
  }

  function normalizeStringList(raw) {
    if (Array.isArray(raw)) {
      return raw.map(function (v) { return asText(String(v || ""), ""); }).filter(Boolean);
    }
    if (typeof raw === "string" && raw.trim()) {
      return raw.split(",").map(function (v) { return v.trim(); }).filter(Boolean);
    }
    return [];
  }

  function normalizeResources(list) {
    if (!Array.isArray(list)) return [];
    var usedSlugs = new Set();

    return list
      .filter(function (item) {
        return item && typeof item === "object" && asText(item.title, "");
      })
      .map(function (item, index) {
        var title = asText(item.title, "Untitled");
        var baseSlug = slugify(asText(item.slug, title), index);
        var slug = baseSlug;
        var suffix = 2;
        while (usedSlugs.has(slug)) {
          slug = baseSlug + "-" + String(suffix++);
        }
        usedSlugs.add(slug);

        var desc = asText(item.desc || item.description, "");
        var details = asText(item.details, "") || desc;
        var features = Array.isArray(item.features)
          ? item.features.map(function (f) { return asText(String(f || ""), ""); }).filter(Boolean)
          : [];

        return {
          index: index,
          slug: slug,
          title: title,
          desc: desc,
          details: details,
          features: features,
          category: asText(item.category, "General"),
          tags: normalizeStringList(item.tags),
          downloadUrl: sanitizeUrl(item.downloadUrl || item.url || "", false),
          previewUrl: sanitizeUrl(item.previewUrl || item.preview || "", false),
          date: asText(item.date, ""),
          dateMs: parseDateMs(item.date),
          featured: Boolean(item.featured),
          note: asText(item.note || item.version, ""),
        };
      });
  }

  function detailPageUrl(slug) {
    return "details.html?id=" + encodeURIComponent(slug);
  }

  function readStorage(key, allowed, fallback) {
    try {
      var val = localStorage.getItem(key);
      return allowed.indexOf(val) !== -1 ? val : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_) {
      /* Ignore storage quota or privacy-mode failures */
    }
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  // Declarative inline SVG icons
  var ICON_PATHS = {
    star: [
      { tag: "polygon", attrs: { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" } },
    ],
    download: [
      { tag: "path", attrs: { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" } },
      { tag: "polyline", attrs: { points: "7 10 12 15 17 10" } },
      { tag: "line", attrs: { x1: "12", y1: "15", x2: "12", y2: "3" } },
    ],
    external: [
      { tag: "path", attrs: { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" } },
      { tag: "polyline", attrs: { points: "15 3 21 3 21 9" } },
      { tag: "line", attrs: { x1: "10", y1: "14", x2: "21", y2: "3" } },
    ],
    arrowRight: [
      { tag: "polyline", attrs: { points: "9 18 15 12 9 6" } },
    ],
  };

  function svgIcon(name, size, filled) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("width", String(size || 14));
    svg.setAttribute("height", String(size || 14));
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", filled ? "currentColor" : "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    var shapes = ICON_PATHS[name] || [];
    shapes.forEach(function (shape) {
      var node = document.createElementNS(SVG_NS, shape.tag);
      Object.keys(shape.attrs).forEach(function (k) {
        node.setAttribute(k, shape.attrs[k]);
      });
      svg.appendChild(node);
    });
    return svg;
  }

  // ── Directory Page: Filtering & Navigation ────────────────────
  function getCategoryStats() {
    var map = new Map();
    RESOURCES.forEach(function (item) {
      map.set(item.category, (map.get(item.category) || 0) + 1);
    });
    return Array.from(map.entries()).map(function (entry) {
      return { name: entry[0], count: entry[1] };
    });
  }

  function getFilteredItems() {
    var list = RESOURCES.slice();
    if (state.category === "__starred__") {
      list = list.filter(function (item) { return item.featured; });
    } else if (state.category !== "All") {
      list = list.filter(function (item) { return item.category === state.category; });
    }

    list.sort(function (a, b) {
      if (state.sort === "featured") {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        if (b.dateMs !== a.dateMs) return b.dateMs - a.dateMs;
        return a.index - b.index;
      }
      if (state.sort === "newest") {
        if (b.dateMs !== a.dateMs) return b.dateMs - a.dateMs;
        return a.index - b.index;
      }
      if (state.sort === "oldest") {
        if (a.dateMs !== b.dateMs) return a.dateMs - b.dateMs;
        return a.index - b.index;
      }
      if (state.sort === "name") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return list;
  }

  function setCategory(cat, syncHash) {
    state.category = cat;
    if (syncHash !== false) {
      var hashVal = cat === "All" ? "" : "#cat=" + encodeURIComponent(cat);
      if (window.location.hash !== hashVal) {
        try {
          history.replaceState(null, "", hashVal || window.location.pathname + window.location.search);
        } catch (_) {
          window.location.hash = hashVal;
        }
      }
    }
    renderNavigation();
    renderItems();
  }

  function readCategoryFromHash() {
    var hash = window.location.hash || "";
    if (hash.indexOf("#cat=") === 0) {
      try {
        var decoded = decodeURIComponent(hash.slice(5));
        if (decoded === "__starred__") return "__starred__";
        var exists = RESOURCES.some(function (r) { return r.category === decoded; });
        if (exists) return decoded;
      } catch (_) {
        return "All";
      }
    }
    return "All";
  }

  function buildSidebarButton(label, count, value, isStarred) {
    var btn = el("button", "sidebar-item" + (state.category === value ? " active" : ""));
    btn.type = "button";
    btn.dataset.cat = value;

    var left = el("span", "sidebar-item-label");
    if (isStarred) {
      var star = el("span", "star-dot");
      star.appendChild(svgIcon("star", 12, true));
      left.appendChild(star);
    }
    left.appendChild(document.createTextNode(label));

    var countBadge = el("span", "sidebar-count", String(count));
    btn.appendChild(left);
    btn.appendChild(countBadge);

    btn.addEventListener("click", function () {
      setCategory(value);
      closeDrawer();
    });
    return btn;
  }

  function renderNavigation() {
    if (!isDirectoryPage) return;
    var stats = getCategoryStats();
    var starredCount = RESOURCES.filter(function (r) { return r.featured; }).length;

    dom.sidebarBrowse.textContent = "";
    dom.sidebarBrowse.appendChild(buildSidebarButton("All", RESOURCES.length, "All", false));
    if (starredCount > 0) {
      dom.sidebarBrowse.appendChild(buildSidebarButton("Starred", starredCount, "__starred__", true));
    }

    dom.sidebarCategories.textContent = "";
    stats.forEach(function (cat) {
      dom.sidebarCategories.appendChild(buildSidebarButton(cat.name, cat.count, cat.name, false));
    });

    dom.mobilePills.textContent = "";
    var pillDefs = [{ label: "All", value: "All" }];
    if (starredCount > 0) pillDefs.push({ label: "Starred", value: "__starred__" });
    stats.forEach(function (cat) {
      pillDefs.push({ label: cat.name, value: cat.name });
    });

    pillDefs.forEach(function (def) {
      var pill = el("button", "mobile-pill" + (state.category === def.value ? " active" : ""), def.label);
      pill.type = "button";
      pill.addEventListener("click", function () {
        setCategory(def.value);
      });
      dom.mobilePills.appendChild(pill);
    });
  }

  // ── Directory Page: Cards & List Rows (Details First) ─────────
  function buildItemElement(item) {
    var card = el("article", "resource-item");

    var main = el("div", "item-main");
    var meta = el("div", "item-meta");
    meta.appendChild(el("span", "item-category", item.category));

    if (item.featured) {
      var star = el("span", "item-star");
      star.title = "Featured";
      star.setAttribute("aria-label", "Featured");
      star.appendChild(svgIcon("star", 13, true));
      meta.appendChild(star);
    }

    if (item.note) {
      meta.appendChild(el("span", "item-note", item.note));
    }

    main.appendChild(meta);

    var titleEl = el("h2", "item-title");
    var titleLink = el("a", "item-title-link", item.title);
    titleLink.href = detailPageUrl(item.slug);
    titleEl.appendChild(titleLink);
    main.appendChild(titleEl);

    if (item.desc) {
      main.appendChild(el("p", "item-desc", item.desc));
    }

    if (item.tags.length > 0) {
      var tagsWrap = el("div", "item-tags");
      item.tags.forEach(function (tag) {
        tagsWrap.appendChild(el("span", "item-tag", tag));
      });
      main.appendChild(tagsWrap);
    }

    var actions = el("div", "item-actions");
    var detailsBtn = el("a", "btn btn-secondary");
    detailsBtn.href = detailPageUrl(item.slug);
    detailsBtn.appendChild(document.createTextNode("View details"));
    detailsBtn.appendChild(svgIcon("arrowRight", 14, false));
    actions.appendChild(detailsBtn);

    card.appendChild(main);
    card.appendChild(actions);
    return card;
  }

  function renderItems() {
    if (!isDirectoryPage) return;
    var items = getFilteredItems();
    var total = RESOURCES.length;

    dom.itemsContainer.className = "items-container " + (state.view === "list" ? "view-list" : "view-grid");
    dom.viewGridBtn.classList.toggle("active", state.view === "grid");
    dom.viewListBtn.classList.toggle("active", state.view === "list");
    dom.viewGridBtn.setAttribute("aria-pressed", String(state.view === "grid"));
    dom.viewListBtn.setAttribute("aria-pressed", String(state.view === "list"));

    if (state.category === "All") {
      dom.resultsSummary.textContent = total + (total === 1 ? " item" : " items");
      dom.resetFilterBtn.hidden = true;
    } else {
      var catLabel = state.category === "__starred__" ? "Starred" : state.category;
      dom.resultsSummary.textContent = items.length + " of " + total + " in " + catLabel;
      dom.resetFilterBtn.hidden = false;
    }

    dom.itemsContainer.textContent = "";
    if (items.length === 0) {
      dom.itemsContainer.hidden = true;
      dom.emptyState.hidden = false;
    } else {
      dom.itemsContainer.hidden = false;
      dom.emptyState.hidden = true;
      var frag = document.createDocumentFragment();
      items.forEach(function (item) {
        frag.appendChild(buildItemElement(item));
      });
      dom.itemsContainer.appendChild(frag);
    }
  }

  // ── Detail Page (Download & Preview after Reading Details) ────
  function findSelectedItem() {
    var params = new URLSearchParams(window.location.search || "");
    var id = params.get("id") || "";
    if (!id && window.location.hash && window.location.hash.indexOf("#id=") === 0) {
      try {
        id = decodeURIComponent(window.location.hash.slice(4));
      } catch (_) {
        id = "";
      }
    }
    if (!id) return null;
    for (var i = 0; i < RESOURCES.length; i++) {
      if (RESOURCES[i].slug === id) return RESOURCES[i];
    }
    return null;
  }

  function renderDetailPage() {
    if (!isDetailPage) return;
    var item = findSelectedItem();

    if (!item) {
      dom.detailRoot.hidden = true;
      dom.detailMissing.hidden = false;
      document.title = "Item not found — " + SITE.name;
      return;
    }

    dom.detailRoot.hidden = false;
    dom.detailMissing.hidden = true;
    document.title = item.title + " — " + SITE.name;

    dom.detailRoot.textContent = "";

    var meta = el("div", "detail-meta");
    var catLink = el("a", "item-category", item.category);
    catLink.href = "./#cat=" + encodeURIComponent(item.category);
    meta.appendChild(catLink);

    if (item.featured) {
      var star = el("span", "item-star");
      star.title = "Featured";
      star.setAttribute("aria-label", "Featured");
      star.appendChild(svgIcon("star", 13, true));
      meta.appendChild(star);
    }

    if (item.date) {
      meta.appendChild(el("span", "item-note", item.date));
    }
    if (item.note) {
      meta.appendChild(el("span", "item-note", item.note));
    }

    dom.detailRoot.appendChild(meta);
    dom.detailRoot.appendChild(el("h1", "detail-title", item.title));

    if (item.details) {
      dom.detailRoot.appendChild(el("p", "detail-desc", item.details));
    }

    if (item.features.length > 0) {
      var featWrap = el("div", "detail-section");
      featWrap.appendChild(el("h2", "detail-section-title", "What it does"));
      var ul = el("ul", "detail-list");
      item.features.forEach(function (point) {
        ul.appendChild(el("li", "", point));
      });
      featWrap.appendChild(ul);
      dom.detailRoot.appendChild(featWrap);
    }

    if (item.tags.length > 0) {
      var tagsWrap = el("div", "item-tags detail-tags");
      item.tags.forEach(function (tag) {
        tagsWrap.appendChild(el("span", "item-tag", tag));
      });
      dom.detailRoot.appendChild(tagsWrap);
    }

    var dlHost = formatHost(item.downloadUrl);
    if (dlHost) {
      var sourceLine = el("p", "detail-source", "Source: " + dlHost);
      dom.detailRoot.appendChild(sourceLine);
    }

    var actions = el("div", "detail-actions");
    if (item.downloadUrl) {
      var dl = el("a", "btn btn-primary detail-btn");
      dl.href = item.downloadUrl;
      dl.target = "_blank";
      dl.rel = "noopener noreferrer";
      if (dlHost) dl.title = "Download from " + dlHost;
      dl.appendChild(svgIcon("download", 14, false));
      dl.appendChild(document.createTextNode("Download"));
      actions.appendChild(dl);
    } else {
      var soon = el("button", "btn btn-disabled detail-btn", "Coming soon");
      soon.type = "button";
      soon.disabled = true;
      actions.appendChild(soon);
    }

    if (item.previewUrl) {
      var preview = el("a", "btn btn-secondary detail-btn");
      preview.href = item.previewUrl;
      preview.target = "_blank";
      preview.rel = "noopener noreferrer";
      preview.title = "Open preview (" + (formatHost(item.previewUrl) || "external") + ")";
      preview.appendChild(svgIcon("external", 14, false));
      preview.appendChild(document.createTextNode("Preview"));
      actions.appendChild(preview);
    }

    dom.detailRoot.appendChild(actions);
  }

  // ── Theme & View Toggles ──────────────────────────────────────
  function applyTheme(theme) {
    state.theme = ALLOWED_THEMES.indexOf(theme) !== -1 ? theme : "dark";
    document.documentElement.setAttribute("data-theme", state.theme);
    dom.themeLabel.textContent = THEME_LABELS[state.theme];
    dom.themeToggle.title = "Theme: " + THEME_LABELS[state.theme] + " (click to switch)";
    dom.themeToggle.setAttribute("aria-label", "Theme: " + THEME_LABELS[state.theme]);
    writeStorage("mtb-theme", state.theme);
  }

  function cycleTheme() {
    var idx = ALLOWED_THEMES.indexOf(state.theme);
    var next = ALLOWED_THEMES[(idx + 1) % ALLOWED_THEMES.length];
    applyTheme(next);
  }

  function setView(view) {
    state.view = ALLOWED_VIEWS.indexOf(view) !== -1 ? view : "grid";
    writeStorage("mtb-view", state.view);
    renderItems();
  }

  // ── Mobile Sidebar Drawer ─────────────────────────────────────
  function openDrawer() {
    if (!dom.sidebar) return;
    dom.sidebar.classList.add("open");
    dom.sidebarBackdrop.classList.add("open");
    dom.navMenuBtn.setAttribute("aria-expanded", "true");
  }

  function closeDrawer() {
    if (!dom.sidebar) return;
    dom.sidebar.classList.remove("open");
    dom.sidebarBackdrop.classList.remove("open");
    dom.navMenuBtn.setAttribute("aria-expanded", "false");
  }

  // ── Search Modal (XSS-safe + Routes to Details Page) ──────────
  function isSearchOpen() {
    return dom.searchOverlay.classList.contains("open");
  }

  function openSearch() {
    closeDrawer();
    dom.searchOverlay.classList.add("open");
    dom.searchOverlay.setAttribute("aria-hidden", "false");
    dom.searchInput.value = "";
    state.searchActiveIndex = -1;
    renderSearchResults("");
    dom.searchInput.focus();
  }

  function closeSearch() {
    dom.searchOverlay.classList.remove("open");
    dom.searchOverlay.setAttribute("aria-hidden", "true");
    state.searchActiveIndex = -1;
    dom.searchTrigger.focus();
  }

  function updateSearchHighlight() {
    var links = dom.searchResults.querySelectorAll(".search-result-item");
    links.forEach(function (node, i) {
      var active = i === state.searchActiveIndex;
      node.classList.toggle("active", active);
      if (active) node.scrollIntoView({ block: "nearest" });
    });
  }

  function renderSearchResults(rawQuery) {
    var query = rawQuery.trim().toLowerCase();
    dom.searchResults.textContent = "";
    state.searchItems = [];
    state.searchActiveIndex = -1;

    var hits = query
      ? RESOURCES.filter(function (r) {
          return (
            r.title.toLowerCase().indexOf(query) !== -1 ||
            r.desc.toLowerCase().indexOf(query) !== -1 ||
            r.details.toLowerCase().indexOf(query) !== -1 ||
            r.category.toLowerCase().indexOf(query) !== -1 ||
            r.tags.some(function (t) { return t.toLowerCase().indexOf(query) !== -1; })
          );
        })
      : RESOURCES.slice(0, 6);

    if (hits.length === 0) {
      dom.searchResults.appendChild(el("p", "search-empty", 'No matches for "' + rawQuery.trim() + '"'));
      return;
    }

    var frag = document.createDocumentFragment();
    hits.forEach(function (item, idx) {
      var row = el("a", "search-result-item");
      row.dataset.index = String(idx);
      row.href = detailPageUrl(item.slug);

      row.appendChild(el("span", "sri-cat", item.category));

      var titleWrap = el("span", "sri-title");
      if (item.featured) {
        var star = el("span", "sri-star");
        star.appendChild(svgIcon("star", 12, true));
        titleWrap.appendChild(star);
      }
      titleWrap.appendChild(document.createTextNode(item.title));
      row.appendChild(titleWrap);

      var arrow = el("span", "sri-arrow");
      arrow.appendChild(svgIcon("arrowRight", 13, false));
      row.appendChild(arrow);

      frag.appendChild(row);
    });

    dom.searchResults.appendChild(frag);
    state.searchItems = Array.from(dom.searchResults.querySelectorAll(".search-result-item"));
    if (query && state.searchItems.length > 0) {
      state.searchActiveIndex = 0;
      updateSearchHighlight();
    }
  }

  // ── Site Metadata & Event Listeners ───────────────────────────
  function applySiteInfo() {
    if (dom.pageTitle) dom.pageTitle.textContent = SITE.title;
    if (dom.pageSub) {
      dom.pageSub.textContent = SITE.subtitle;
      dom.pageSub.hidden = !SITE.subtitle;
    }
    if (dom.footerYear) dom.footerYear.textContent = String(new Date().getFullYear());
    if (dom.footerName) dom.footerName.textContent = SITE.name;

    var safeGithub = sanitizeUrl(SITE.githubUrl, false);
    if (safeGithub) {
      document.querySelectorAll('[data-site-link="github"]').forEach(function (a) {
        a.href = safeGithub;
      });
    }
    var safeMail = sanitizeUrl("mailto:" + SITE.email, true);
    if (safeMail) {
      document.querySelectorAll('[data-site-link="email"]').forEach(function (a) {
        a.href = safeMail;
      });
    }
  }

  function bindEvents() {
    if (isDirectoryPage) {
      dom.sortSelect.addEventListener("change", function () {
        state.sort = dom.sortSelect.value;
        renderItems();
      });

      dom.resetFilterBtn.addEventListener("click", function () { setCategory("All"); });
      dom.emptyResetBtn.addEventListener("click", function () { setCategory("All"); });

      dom.viewGridBtn.addEventListener("click", function () { setView("grid"); });
      dom.viewListBtn.addEventListener("click", function () { setView("list"); });

      dom.navMenuBtn.addEventListener("click", openDrawer);
      dom.sidebarClose.addEventListener("click", closeDrawer);
      dom.sidebarBackdrop.addEventListener("click", closeDrawer);

      window.addEventListener("hashchange", function () {
        setCategory(readCategoryFromHash(), false);
      });
    }

    dom.themeToggle.addEventListener("click", cycleTheme);
    dom.searchTrigger.addEventListener("click", openSearch);
    dom.searchClose.addEventListener("click", closeSearch);
    dom.searchOverlay.addEventListener("click", function (e) {
      if (e.target === dom.searchOverlay) closeSearch();
    });
    dom.searchInput.addEventListener("input", function () {
      renderSearchResults(dom.searchInput.value);
    });

    document.addEventListener("keydown", function (e) {
      var targetTag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : "";
      var isTyping = targetTag === "input" || targetTag === "textarea" || targetTag === "select";

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        isSearchOpen() ? closeSearch() : openSearch();
        return;
      }

      if (e.key === "/" && !isTyping && !isSearchOpen()) {
        e.preventDefault();
        openSearch();
        return;
      }

      if (e.key === "Escape") {
        if (isSearchOpen()) closeSearch();
        else if (dom.sidebar && dom.sidebar.classList.contains("open")) closeDrawer();
        return;
      }

      if (!isSearchOpen() || state.searchItems.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        state.searchActiveIndex = (state.searchActiveIndex + 1) % state.searchItems.length;
        updateSearchHighlight();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        state.searchActiveIndex =
          (state.searchActiveIndex - 1 + state.searchItems.length) % state.searchItems.length;
        updateSearchHighlight();
      } else if (e.key === "Enter" && state.searchActiveIndex >= 0) {
        var activeEl = state.searchItems[state.searchActiveIndex];
        if (activeEl) {
          e.preventDefault();
          activeEl.click();
        }
      }
    });
  }

  // ── Init ──────────────────────────────────────────────────────
  applySiteInfo();
  applyTheme(state.theme);
  bindEvents();

  if (isDirectoryPage) {
    state.category = readCategoryFromHash();
    renderNavigation();
    renderItems();
  }
  if (isDetailPage) {
    renderDetailPage();
  }
})();
