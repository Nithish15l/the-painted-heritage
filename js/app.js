(function () {
 "use strict";

 const config = window.KALAMKARI_CONFIG || {};
 const works = Array.isArray(window.KALAMKARI_WORKS) ? window.KALAMKARI_WORKS : [];

 const handle = (config.instagramHandle || "thepaintedheritage").replace(/^@/, "");
 const brand = config.brandName || "The Painted Heritage";
 const tagline =
 config.tagline ||
 "Hand-painted Kalamkari canvas stories from the heart of India";
 const inquiryMessage =
 config.inquiryMessage ||
 "Hi! I'm interested in a Kalamkari canvas painting.";
 const customInquiryMessage =
 config.customInquiryMessage ||
 "Hi! I'd love a custom Kalamkari canvas. Theme / Size / Palette / Country:";

 const countryCode = String(config.countryCode || "91").replace(/\D/g, "");
 let waDigits = String(config.whatsappNumber || "9381435570").replace(/\D/g, "");
 // Strip leading country code if already included
 if (waDigits.startsWith(countryCode) && waDigits.length > 10) {
 waDigits = waDigits.slice(countryCode.length);
 }
 const waDisplay =
 config.whatsappDisplay ||
 ("+" + countryCode + " " + waDigits.replace(/(\d{5})(\d{5})/, "$1 $2"));
 const waE164 = countryCode + waDigits;

 const instagramProfileUrl = `https://www.instagram.com/${encodeURIComponent(handle)}/`;
 const instagramLabel = `@${handle}`;

 function whatsappUrl(message) {
 const text = encodeURIComponent(message || inquiryMessage);
 return `https://wa.me/${waE164}?text=${text}`;
 }

 function setText(id, text) {
 const el = document.getElementById(id);
 if (el) el.textContent = text;
 }

 setText("brand-name", brand);
 setText("footer-brand", brand);
 setText("hero-tagline", tagline);
 setText("instagram-label", instagramLabel);
 setText("contact-ig-label", instagramLabel);
 setText("footer-ig", instagramLabel);
 setText("whatsapp-display", waDisplay);
 setText("footer-wa-num", waDisplay);
 setText("whatsapp-btn-label", "WhatsApp " + waDisplay);
 document.title = `${brand} - Hand-Painted Kalamkari Canvas`;

 function bindExternal(selector, href) {
 document.querySelectorAll(selector).forEach((el) => {
 if (!el) return;
 el.setAttribute("href", href);
 el.setAttribute("target", "_blank");
 el.setAttribute("rel", "noopener noreferrer");
 });
 }

 function bindInstagramLinks() {
 bindExternal(
 "#contact-instagram, #modal-instagram, #float-instagram",
 instagramProfileUrl
 );
 }

 function bindWhatsAppLinks(message) {
 const url = whatsappUrl(message);
 bindExternal(
 "#nav-whatsapp, #contact-whatsapp, #custom-instagram, #custom-whatsapp-secondary, #modal-whatsapp, #float-whatsapp, a.wa-link",
 url
 );
 }

 bindInstagramLinks();
 bindWhatsAppLinks(inquiryMessage);

 function copyInquiry(text) {
 if (navigator.clipboard && navigator.clipboard.writeText) {
 navigator.clipboard.writeText(text).catch(function () {});
 }
 }

 ["custom-instagram", "modal-custom"].forEach((id) => {
 const el = document.getElementById(id);
 if (!el) return;
 el.addEventListener("click", () => copyInquiry(customInquiryMessage));
 });

 // --- Mobile nav ---
 const nav = document.getElementById("main-nav");
 const toggle = document.getElementById("nav-toggle");
 const header = document.querySelector(".site-header");

 if (toggle && nav) {
 toggle.addEventListener("click", () => {
 const open = nav.classList.toggle("is-open");
 toggle.setAttribute("aria-expanded", String(open));
 toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
 });

 nav.querySelectorAll("a").forEach((link) => {
 link.addEventListener("click", () => {
 nav.classList.remove("is-open");
 toggle.setAttribute("aria-expanded", "false");
 toggle.setAttribute("aria-label", "Open menu");
 });
 });
 }

 // Simple sticky header + light progress bar only
 const progressBar = document.getElementById("scroll-progress-bar");
 let ticking = false;

 function onScrollFrame() {
 const y = window.scrollY || 0;
 const docH = Math.max(
 document.documentElement.scrollHeight - window.innerHeight,
 1
 );
 const progress = Math.min(Math.max(y / docH, 0), 1);

 if (header) header.classList.toggle("is-scrolled", y > 12);

 if (progressBar) {
 progressBar.style.width = (progress * 100).toFixed(2) + "%";
 }
 ticking = false;
 }

 window.addEventListener(
 "scroll",
 () => {
 if (!ticking) {
 ticking = true;
 requestAnimationFrame(onScrollFrame);
 }
 },
 { passive: true }
 );
 onScrollFrame();

 // --- Scroll reveal (staggered, smooth) ---
 const revealEls = document.querySelectorAll(".reveal");
 if ("IntersectionObserver" in window) {
 const io = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 if (entry.isIntersecting) {
 const el = entry.target;
 const siblings = el.parentElement
 ? Array.from(el.parentElement.children).filter((c) =>
 c.classList.contains("reveal")
 )
 : [];
 const idx = Math.max(siblings.indexOf(el), 0);
 el.style.transitionDelay = Math.min(idx * 0.08, 0.4) + "s";
 el.classList.add("is-visible");
 io.unobserve(el);
 }
 });
 },
 { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
 );
 revealEls.forEach((el) => io.observe(el));
 } else {
 revealEls.forEach((el) => el.classList.add("is-visible"));
 }

 document.querySelectorAll(".hero .reveal, .highlight-landscape.reveal").forEach((el) => {
 el.style.transitionDelay = "0s";
 el.classList.add("is-visible");
 });

 // --- Gallery ---
 const grid = document.getElementById("gallery-grid");
 const empty = document.getElementById("gallery-empty");
 const moreWrap = document.getElementById("gallery-more");
 const moreBtn = document.getElementById("gallery-view-more");
 const moreCount = document.getElementById("gallery-more-count");
 const portSlider = document.getElementById("portrait-slider");
 const portPrev = document.getElementById("port-prev");
 const portNext = document.getElementById("port-next");
 const portDots = document.getElementById("port-dots");
 const landTrack = document.getElementById("land-track");
 const landDots = document.getElementById("land-dots");
 const landPrev = document.getElementById("land-prev");
 const landNext = document.getElementById("land-next");
 const landSlider = document.getElementById("land-slider");
 let activeFilter = "all";
 const PAGE_SIZE = 8; // portrait grid default (desktop)
 let visibleCount = PAGE_SIZE;
 let landIndex = 0;
 let landSlides = [];
 let portScrollRaf = 0;

 function isPortraitSliderMode() {
 return window.matchMedia("(max-width: 900px)").matches;
 }

 function scrollTrackToIndex(track, itemSelector, index, opts) {
 if (!track) return;
 const options = opts || {};
 const behavior = options.behavior || "smooth";
 const items = Array.from(track.querySelectorAll(itemSelector));
 if (!items.length) return;
 const i = ((index % items.length) + items.length) % items.length;
 const target = items[i];
 if (!target) return;
 // Center item inside the scroll track (works with padding + snap)
 const maxLeft = Math.max(0, track.scrollWidth - track.clientWidth);
 const left = Math.max(
 0,
 Math.min(
 target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2,
 maxLeft
 )
 );
 if (typeof track.scrollTo === "function") {
 track.scrollTo({ left: left, behavior: behavior });
 } else {
 track.scrollLeft = left;
 }
 }

 /** Center first slide after layout paints (instant, no jump) */
 function centerTrackStart(track, itemSelector) {
 if (!track) return;
 const run = () => scrollTrackToIndex(track, itemSelector, 0, { behavior: "auto" });
 // Double rAF waits for flex/padding layout; third pass catches late images/fonts
 requestAnimationFrame(() => {
 requestAnimationFrame(() => {
 run();
 window.setTimeout(run, 60);
 window.setTimeout(run, 220);
 });
 });
 }

 function isLandscape(work) {
 return work.orientation === "landscape";
 }

 function isPortrait(work) {
 return !isLandscape(work);
 }

 function workMatches(work, filter) {
 if (filter === "all") return true;
 if (filter === "image" || filter === "video") return work.type === filter;
 return work.category === filter || (work.tags || []).includes(filter);
 }

 function playIconSvg() {
 return `
 <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
 <circle cx="32" cy="32" r="30" fill="rgba(26,20,16,0.45)" stroke="white" stroke-width="2"/>
 <path d="M26 20 L48 32 L26 44 Z" fill="white"/>
 </svg>`;
 }

 function createCard(work, index) {
 const isVideo = work.type === "video";
 const isFeatured = !!work.featured;
 const btn = document.createElement("button");
 btn.type = "button";
 btn.className =
 "card card--enter card--portrait" +
 (isFeatured ? " card--featured" : "") +
 (work.highRes ? " card--hires" : "");
 btn.style.setProperty("--enter-delay", `${Math.min(index, 8) * 55}ms`);
 btn.dataset.id = work.id;
 btn.setAttribute("aria-label", `View ${work.title}`);

 const badgeLabel = work.featured
 ? "Masterpiece"
 : isVideo
 ? "Video"
 : "Canvas";

 const mediaInner = isVideo
 ? `<img src="${escapeAttr(work.poster || work.media)}" alt="" loading="lazy" decoding="async" />
 <span class="card__play">${playIconSvg()}</span>`
 : `<img src="${escapeAttr(work.media)}" alt="${escapeAttr(work.title)}" loading="${index < 6 ? "eager" : "lazy"}" decoding="async" />`;

 btn.innerHTML = `
 <div class="card__frame">
 <div class="card__media">
 <span class="card__badge${work.featured ? " card__badge--master" : ""}">
 ${badgeLabel}
 </span>
 ${mediaInner}
 </div>
 </div>
 <div class="card__body">
 <p class="card__label">Kalamkari canvas</p>
 <h3 class="card__title">${escapeHtml(work.title)}</h3>
 <p class="card__meta">${escapeHtml(work.size || work.medium || "")}</p>
 <p class="card__cta-hint">View painting &gt;</p>
 </div>
 `;

 btn.addEventListener("click", () => openModal(work));
 requestAnimationFrame(() => btn.classList.add("is-in"));
 return btn;
 }

 function getPortraitWorks() {
 return works.filter((w) => isPortrait(w) && workMatches(w, activeFilter));
 }

 function getLandscapeWorks() {
 return works.filter((w) => isLandscape(w) && workMatches(w, activeFilter));
 }

 /* Landscape slider */
 function renderLandDots() {
 if (!landDots) return;
 landDots.innerHTML = "";
 landSlides.forEach((_, i) => {
 const b = document.createElement("button");
 b.type = "button";
 b.className = "land-slider__dot" + (i === landIndex ? " is-active" : "");
 b.setAttribute("aria-label", "Go to landscape " + (i + 1));
 b.addEventListener("click", () => goLand(i));
 landDots.appendChild(b);
 });
 }

 function goLand(index, opts) {
 if (!landSlides.length || !landTrack) return;
 const options = opts || {};
 const prev = landIndex;
 landIndex = ((index % landSlides.length) + landSlides.length) % landSlides.length;
 landTrack.style.transform = "translate3d(-" + landIndex * 100 + "%, 0, 0)";

 const slides = landTrack.querySelectorAll(".land-slide");
 slides.forEach((s, i) => {
 s.classList.toggle("is-active", i === landIndex);
 s.setAttribute("aria-hidden", i === landIndex ? "false" : "true");
 });

 if (landDots) {
 landDots.querySelectorAll(".land-slider__dot").forEach((d, i) => {
 d.classList.toggle("is-active", i === landIndex);
 });
 }

 // Soft cross-fade assist
 if (landTrack && prev !== landIndex) {
 landTrack.classList.add("is-sliding");
 window.clearTimeout(goLand._t);
 goLand._t = window.setTimeout(() => {
 landTrack.classList.remove("is-sliding");
 }, 650);
 }

 // Restart auto-scroll after manual moves (unless auto-driven)
 if (!options.fromAuto && landAutoEnabled) {
 startLandAuto();
 }
 }

 function renderLandscapeSlider() {
 if (!landTrack) return;
 // Art-only slides (exclude any marked with text overlays)
 landSlides = getLandscapeWorks().filter((w) => !w.hasTextOverlay);

 if (landSlider) {
 landSlider.hidden = landSlides.length === 0;
 }

 landTrack.innerHTML = "";
 landSlides.forEach((work, i) => {
 const slide = document.createElement("button");
 slide.type = "button";
 slide.className = "land-slide" + (i === 0 ? " is-active" : "");
 slide.setAttribute("aria-label", "View " + work.title);
 slide.setAttribute("aria-hidden", i === 0 ? "false" : "true");
 const badgeLabel = work.featured ? "Masterpiece" : "Wall canvas";
 const badgeIcon = work.featured
 ? `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true"><path d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5L12 14.4 7.5 16.7l.9-5L4.8 8.2l5-.7L12 3z" fill="currentColor"/></svg>`
 : `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="6" y="9" width="12" height="6" stroke="currentColor" stroke-width="1.3"/></svg>`;
 slide.innerHTML = `
 <div class="land-slide__frame">
 <span class="land-slide__mat" aria-hidden="true"></span>
 <span class="land-slide__orn land-slide__orn--tl" aria-hidden="true"></span>
 <span class="land-slide__orn land-slide__orn--tr" aria-hidden="true"></span>
 <span class="land-slide__orn land-slide__orn--bl" aria-hidden="true"></span>
 <span class="land-slide__orn land-slide__orn--br" aria-hidden="true"></span>
 <img src="${escapeAttr(work.media)}" alt="${escapeAttr(work.title)}" loading="${i === 0 ? "eager" : "lazy"}" decoding="async" ${work.highRes ? 'fetchpriority="high"' : ""} />
 <span class="land-slide__shine" aria-hidden="true"></span>
 </div>
 <div class="land-slide__meta">
 <span class="land-slide__badge">${badgeIcon}<span>${badgeLabel}</span></span>
 <strong>${escapeHtml(work.title)}</strong>
 <em>${escapeHtml(work.size || work.medium || "Kalamkari canvas")}</em>
 <span class="land-slide__hint">
 <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.6"/><path d="M16 16l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
 <span>View full detail</span>
 </span>
 </div>
 `;
 slide.addEventListener("click", () => openModal(work));
 landTrack.appendChild(slide);
 });

 landIndex = 0;
 renderLandDots();
 goLand(0);
 }

 if (landPrev) {
 landPrev.addEventListener("click", () => goLand(landIndex - 1));
 }
 if (landNext) {
 landNext.addEventListener("click", () => goLand(landIndex + 1));
 }

 // Touch swipe for landscape slider
 if (landTrack) {
 let touchX = null;
 landTrack.addEventListener(
 "touchstart",
 (e) => {
 touchX = e.changedTouches[0].screenX;
 stopLandAuto();
 },
 { passive: true }
 );
 landTrack.addEventListener(
 "touchend",
 (e) => {
 if (touchX == null) return;
 const dx = e.changedTouches[0].screenX - touchX;
 touchX = null;
 if (Math.abs(dx) < 40) {
 if (landAutoEnabled) startLandAuto();
 return;
 }
 if (dx < 0) goLand(landIndex + 1);
 else goLand(landIndex - 1);
 },
 { passive: true }
 );
 }

 // Auto-scroll Wall masterworks continuously
 let landTimer = null;
 let landAutoEnabled = true;
 let landInView = true;

 function startLandAuto() {
 stopLandAuto();
 if (!landAutoEnabled || !landInView) return;
 if (!landSlides || landSlides.length < 2) return;
 landTimer = setInterval(function () {
 goLand(landIndex + 1, { fromAuto: true });
 }, 4000);
 if (landSlider) landSlider.classList.add("is-autoplaying");
 }

 function stopLandAuto() {
 if (landTimer) {
 clearInterval(landTimer);
 landTimer = null;
 }
 if (landSlider) landSlider.classList.remove("is-autoplaying");
 }

 if (landSlider) {
 landSlider.addEventListener("mouseenter", function () {
 landAutoEnabled = false;
 stopLandAuto();
 });
 landSlider.addEventListener("mouseleave", function () {
 landAutoEnabled = true;
 startLandAuto();
 });
 landSlider.addEventListener("focusin", function () {
 landAutoEnabled = false;
 stopLandAuto();
 });
 landSlider.addEventListener("focusout", function () {
 landAutoEnabled = true;
 startLandAuto();
 });

 // Pause when section is off-screen; resume when visible
 if ("IntersectionObserver" in window) {
 const landIo = new IntersectionObserver(
 function (entries) {
 entries.forEach(function (entry) {
 landInView = entry.isIntersecting && entry.intersectionRatio > 0.25;
 if (landInView && landAutoEnabled) startLandAuto();
 else stopLandAuto();
 });
 },
 { threshold: [0, 0.25, 0.5] }
 );
 landIo.observe(landSlider);
 }
 }

 function updateMoreUI(total, shown) {
 if (!moreWrap || !moreBtn) return;

 // Mobile uses horizontal sliding view — no page chunks
 if (isPortraitSliderMode()) {
 moreWrap.hidden = true;
 moreBtn.dataset.mode = "more";
 return;
 }

 if (total <= PAGE_SIZE) {
 moreWrap.hidden = true;
 moreBtn.dataset.mode = "more";
 return;
 }

 moreWrap.hidden = false;
 const remaining = Math.max(total - shown, 0);
 const isExpanded = shown >= total;

 if (isExpanded) {
 moreBtn.dataset.mode = "less";
 moreBtn.innerHTML = `View less <span class="btn__arrow" aria-hidden="true">&lt;</span>`;
 moreBtn.setAttribute("aria-label", "Show fewer paintings");
 if (moreCount) moreCount.textContent = `Showing all ${total} paintings`;
 } else {
 moreBtn.dataset.mode = "more";
 moreBtn.innerHTML = `View more paintings <span class="gallery-more__n">+${remaining}</span> <span class="btn__arrow" aria-hidden="true">&gt;</span>`;
 moreBtn.setAttribute("aria-label", `Show ${remaining} more paintings`);
 if (moreCount) moreCount.textContent = `Showing ${shown} of ${total} paintings`;
 }
 }

 function getCardStep() {
 if (!grid) return 280;
 const card = grid.querySelector(".card");
 if (!card) return Math.round(grid.clientWidth * 0.82);
 const styles = window.getComputedStyle(grid);
 const gap = parseFloat(styles.columnGap || styles.gap || "12") || 12;
 return Math.round(card.getBoundingClientRect().width + gap);
 }

 function getActivePortIndex() {
 if (!grid) return 0;
 const cards = grid.querySelectorAll(".card");
 if (!cards.length) return 0;
 const mid = grid.scrollLeft + grid.clientWidth / 2;
 let best = 0;
 let bestDist = Infinity;
 cards.forEach((card, i) => {
 const center = card.offsetLeft + card.offsetWidth / 2;
 const dist = Math.abs(center - mid);
 if (dist < bestDist) {
 bestDist = dist;
 best = i;
 }
 });
 return best;
 }

 function updatePortDots(activeIndex) {
 if (!portDots) return;
 const cards = grid ? grid.querySelectorAll(".card") : [];
 const n = cards.length;
 if (!n || !isPortraitSliderMode()) {
 portDots.innerHTML = "";
 portDots.hidden = true;
 return;
 }
 portDots.hidden = false;
 if (portDots.childElementCount !== n) {
 portDots.innerHTML = "";
 for (let i = 0; i < n; i++) {
 const b = document.createElement("button");
 b.type = "button";
 b.className = "portrait-slider__dot";
 b.setAttribute("aria-label", "Go to painting " + (i + 1));
 b.addEventListener("click", () => {
 scrollTrackToIndex(grid, ".card", i);
 softPausePort();
 });
 portDots.appendChild(b);
 }
 }
 portDots.querySelectorAll(".portrait-slider__dot").forEach((dot, i) => {
 dot.classList.toggle("is-active", i === activeIndex);
 });
 }

 function updatePortNav() {
 if (!isPortraitSliderMode() || !grid) {
 if (portPrev) portPrev.hidden = true;
 if (portNext) portNext.hidden = true;
 if (portDots) portDots.hidden = true;
 if (portSlider) portSlider.classList.remove("is-slider");
 return;
 }
 if (portSlider) portSlider.classList.add("is-slider");
 if (portPrev) {
 portPrev.hidden = false;
 portPrev.disabled = false;
 }
 if (portNext) {
 portNext.hidden = false;
 portNext.disabled = false;
 }
 updatePortDots(getActivePortIndex());
 }

 function scrollPortBy(dir) {
 if (!grid || !isPortraitSliderMode()) return;
 const n = grid.querySelectorAll(".card").length;
 if (!n) return;
 scrollTrackToIndex(grid, ".card", getActivePortIndex() + dir);
 }

 let portTimer = null;
 let portPauseUntil = 0;
 let portInView = true;

 function softPausePort() {
 portPauseUntil = Date.now() + 6500;
 }

 function stopPortAuto() {
 if (portTimer) {
 clearInterval(portTimer);
 portTimer = null;
 }
 }

 function startPortAuto() {
 stopPortAuto();
 updatePortNav();
 if (!isPortraitSliderMode() || !grid || !portInView) return;
 portTimer = window.setInterval(() => {
 if (Date.now() < portPauseUntil || document.hidden || !portInView) return;
 const n = grid.querySelectorAll(".card").length;
 if (n < 2) return;
 scrollTrackToIndex(grid, ".card", getActivePortIndex() + 1);
 }, 5000);
 }

 function bindPortraitSlider() {
 if (!grid) return;
 if (portPrev) {
 portPrev.addEventListener("click", () => {
 scrollPortBy(-1);
 softPausePort();
 });
 }
 if (portNext) {
 portNext.addEventListener("click", () => {
 scrollPortBy(1);
 softPausePort();
 });
 }
 grid.addEventListener(
 "scroll",
 () => {
 if (!isPortraitSliderMode()) return;
 if (portScrollRaf) cancelAnimationFrame(portScrollRaf);
 portScrollRaf = requestAnimationFrame(() => updatePortNav());
 },
 { passive: true }
 );
 grid.addEventListener("touchstart", softPausePort, { passive: true });

 let lastMode = isPortraitSliderMode();
 let resizeTimer = 0;
 const onViewportChange = () => {
 clearTimeout(resizeTimer);
 resizeTimer = setTimeout(() => {
 const nowSlider = isPortraitSliderMode();
 document.documentElement.classList.toggle("is-port-slider", nowSlider);
 if (nowSlider !== lastMode) {
 lastMode = nowSlider;
 renderGallery(true);
 requestAnimationFrame(() => {
 if (grid && nowSlider) centerTrackStart(grid, ".card");
 startPortAuto();
 });
 } else {
 if (nowSlider) centerTrackStart(grid, ".card");
 updatePortNav();
 }
 }, 140);
 };
 window.addEventListener("resize", onViewportChange);
 window.addEventListener("orientationchange", onViewportChange);

 if (portSlider && "IntersectionObserver" in window) {
 const io = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 portInView = entry.isIntersecting && entry.intersectionRatio > 0.2;
 if (portInView) startPortAuto();
 else stopPortAuto();
 });
 },
 { threshold: [0, 0.2, 0.5] }
 );
 io.observe(portSlider);
 }

 document.documentElement.classList.toggle("is-port-slider", isPortraitSliderMode());
 startPortAuto();
 }

 function renderGallery(resetPage) {
 if (!grid) return;

 const filtered = getPortraitWorks();
 const sliderMode = isPortraitSliderMode();

 if (sliderMode) {
 visibleCount = filtered.length;
 } else {
 if (resetPage) visibleCount = PAGE_SIZE;
 visibleCount = Math.min(Math.max(visibleCount, 0), Math.max(filtered.length, PAGE_SIZE));
 if (filtered.length <= PAGE_SIZE) visibleCount = filtered.length || PAGE_SIZE;
 }

 const slice = filtered.slice(0, visibleCount);
 grid.innerHTML = "";
 slice.forEach((work, i) => grid.appendChild(createCard(work, i)));
 if (empty) empty.hidden = filtered.length > 0;
 updateMoreUI(filtered.length, slice.length);
 requestAnimationFrame(() => {
 if (sliderMode) {
 if (resetPage) centerTrackStart(grid, ".card");
 else updatePortNav();
 } else {
 updatePortNav();
 }
 });
 }

 function renderAllGallery(resetPage) {
 renderLandscapeSlider();
 renderGallery(resetPage);
 startLandAuto();
 }

 if (moreBtn) {
 moreBtn.addEventListener("click", () => {
 const filtered = getPortraitWorks();
 const total = filtered.length;
 const mode = moreBtn.dataset.mode || "more";

 if (mode === "less" || visibleCount >= total) {
 visibleCount = PAGE_SIZE;
 renderGallery(false);
 const ph = document.querySelector(".portrait-head");
 if (ph) ph.scrollIntoView({ behavior: "smooth", block: "start" });
 moreBtn.focus({ preventScroll: true });
 return;
 }

 visibleCount = total;
 renderGallery(false);
 moreBtn.focus({ preventScroll: true });
 const cards = grid ? grid.querySelectorAll(".card") : [];
 if (cards.length > PAGE_SIZE) {
 const firstNew = cards[PAGE_SIZE];
 if (firstNew) firstNew.scrollIntoView({ behavior: "smooth", block: "nearest" });
 }
 });
 }

 document.querySelectorAll(".filter").forEach((btn) => {
 btn.addEventListener("click", () => {
 activeFilter = btn.dataset.filter || "all";
 document.querySelectorAll(".filter").forEach((b) => {
 const on = b === btn;
 b.classList.toggle("is-active", on);
 b.setAttribute("aria-selected", String(on));
 });
 renderAllGallery(true);
 });
 });

 // --- Modal ---
 const modal = document.getElementById("work-modal");
 const modalMedia = document.getElementById("modal-media");
 const modalTitle = document.getElementById("modal-title");
 const modalMeta = document.getElementById("modal-meta");
 const modalDesc = document.getElementById("modal-description");
 const modalSize = document.getElementById("modal-size");
 const modalMedium = document.getElementById("modal-medium");
 const modalIg = document.getElementById("modal-instagram");
 const modalWa = document.getElementById("modal-whatsapp");
 const modalCustom = document.getElementById("modal-custom");
 const modalPost = document.getElementById("modal-post");
 let lastFocus = null;
 let zoomState = null; // pan/zoom controller for high-detail view

 function destroyZoom() {
 if (!zoomState) return;
 if (zoomState.cleanup) zoomState.cleanup();
 zoomState = null;
 }

 /**
 * Drag to pan + wheel/pinch to zoom for Featured high-detail works.
 * Replaces sideways scroll.
 */
 function enableDragZoom(viewport, img, options) {
 const minScale = 1;
 const maxScale = options.maxScale || 5;
 let scale = 1;
 let x = 0;
 let y = 0;
 let dragging = false;
 let startX = 0;
 let startY = 0;
 let originX = 0;
 let originY = 0;
 let pointers = new Map();
 let lastPinchDist = 0;

 function apply() {
 img.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
 viewport.classList.toggle("is-zoomed", scale > 1.02);
 if (options.onScale) options.onScale(scale);
 }

 function clampPan() {
 if (scale <= 1) {
 x = 0;
 y = 0;
 return;
 }
 const rect = viewport.getBoundingClientRect();
 const maxX = (rect.width * (scale - 1)) / 2 + 40;
 const maxY = (rect.height * (scale - 1)) / 2 + 40;
 x = Math.max(-maxX, Math.min(maxX, x));
 y = Math.max(-maxY, Math.min(maxY, y));
 }

 function zoomAt(clientX, clientY, nextScale) {
 const rect = viewport.getBoundingClientRect();
 const cx = clientX - rect.left - rect.width / 2;
 const cy = clientY - rect.top - rect.height / 2;
 const prev = scale;
 nextScale = Math.max(minScale, Math.min(maxScale, nextScale));
 // Keep point under cursor stable-ish
 x = cx - ((cx - x) * nextScale) / prev;
 y = cy - ((cy - y) * nextScale) / prev;
 scale = nextScale;
 if (scale <= 1) {
 x = 0;
 y = 0;
 }
 clampPan();
 apply();
 }

 function onWheel(e) {
 e.preventDefault();
 const delta = e.deltaY > 0 ? -0.15 : 0.15;
 zoomAt(e.clientX, e.clientY, scale * (1 + delta));
 }

 function onPointerDown(e) {
 viewport.setPointerCapture(e.pointerId);
 pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
 if (pointers.size === 1) {
 dragging = true;
 startX = e.clientX;
 startY = e.clientY;
 originX = x;
 originY = y;
 viewport.classList.add("is-dragging");
 } else if (pointers.size === 2) {
 dragging = false;
 const pts = Array.from(pointers.values());
 lastPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
 }
 }

 function onPointerMove(e) {
 if (!pointers.has(e.pointerId)) return;
 pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

 if (pointers.size === 2) {
 const pts = Array.from(pointers.values());
 const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
 if (lastPinchDist > 0) {
 const midX = (pts[0].x + pts[1].x) / 2;
 const midY = (pts[0].y + pts[1].y) / 2;
 zoomAt(midX, midY, scale * (dist / lastPinchDist));
 }
 lastPinchDist = dist;
 return;
 }

 if (!dragging || scale <= 1) return;
 x = originX + (e.clientX - startX);
 y = originY + (e.clientY - startY);
 clampPan();
 apply();
 }

 function onPointerUp(e) {
 pointers.delete(e.pointerId);
 if (pointers.size < 2) lastPinchDist = 0;
 if (pointers.size === 0) {
 dragging = false;
 viewport.classList.remove("is-dragging");
 } else if (pointers.size === 1) {
 const p = Array.from(pointers.values())[0];
 dragging = true;
 startX = p.x;
 startY = p.y;
 originX = x;
 originY = y;
 }
 }

 function reset() {
 scale = 1;
 x = 0;
 y = 0;
 apply();
 }

 function zoomIn() {
 const rect = viewport.getBoundingClientRect();
 zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, scale * 1.35);
 }

 function zoomOut() {
 const rect = viewport.getBoundingClientRect();
 zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, scale / 1.35);
 }

 viewport.addEventListener("wheel", onWheel, { passive: false });
 viewport.addEventListener("pointerdown", onPointerDown);
 viewport.addEventListener("pointermove", onPointerMove);
 viewport.addEventListener("pointerup", onPointerUp);
 viewport.addEventListener("pointercancel", onPointerUp);
 viewport.addEventListener("pointerleave", onPointerUp);

 apply();

 return {
 reset,
 zoomIn,
 zoomOut,
 getScale: () => scale,
 cleanup() {
 viewport.removeEventListener("wheel", onWheel);
 viewport.removeEventListener("pointerdown", onPointerDown);
 viewport.removeEventListener("pointermove", onPointerMove);
 viewport.removeEventListener("pointerup", onPointerUp);
 viewport.removeEventListener("pointercancel", onPointerUp);
 viewport.removeEventListener("pointerleave", onPointerUp);
 },
 };
 }

 function openModal(work) {
 if (!modal) return;
 lastFocus = document.activeElement;
 destroyZoom();

 const isLandscape = work.orientation === "landscape";
 const isHires = !!work.highRes || !!work.featured;
 modal.classList.toggle("modal--landscape", isLandscape);
 modal.classList.toggle("modal--hires", isHires);
 modal.classList.toggle("modal--zoomable", isHires || isLandscape);

 if (modalTitle) modalTitle.textContent = work.title;
 if (modalMeta) {
 modalMeta.textContent = work.featured
 ? "Masterpiece · High detail"
 : work.type === "video"
 ? `Studio film · ${instagramLabel}`
 : `Hand-painted canvas · ${instagramLabel}`;
 }
 if (modalDesc) modalDesc.textContent = work.description || "";
 if (modalSize) modalSize.textContent = work.size || "-";
 if (modalMedium) modalMedium.textContent = work.medium || "-";

 if (modalMedia) {
 modalMedia.innerHTML = "";
 if (work.type === "video") {
 const video = document.createElement("video");
 video.src = work.media;
 if (work.poster) video.poster = work.poster;
 video.controls = true;
 video.playsInline = true;
 video.setAttribute("controlsList", "nodownload");
 modalMedia.appendChild(video);
 } else if (isHires || isLandscape) {
 // Featured / high-detail: drag zoom viewer (no sideways slide)
 const viewport = document.createElement("div");
 viewport.className = "modal__zoom-view";
 viewport.setAttribute("role", "img");
 viewport.setAttribute(
 "aria-label",
 work.title + " — drag to move, scroll or pinch to zoom"
 );

 const img = document.createElement("img");
 img.src = work.media;
 img.alt = work.title;
 img.decoding = "async";
 img.draggable = false;
 img.className = "modal__zoom-img" + (work.highRes ? " modal__img--hires" : "");
 if (work.highRes) img.setAttribute("fetchpriority", "high");

 const controls = document.createElement("div");
 controls.className = "modal__zoom-controls";
 controls.innerHTML = `
 <button type="button" class="modal__zoom-btn" data-zoom="out" aria-label="Zoom out">−</button>
 <button type="button" class="modal__zoom-btn" data-zoom="reset" aria-label="Reset zoom">Reset</button>
 <button type="button" class="modal__zoom-btn" data-zoom="in" aria-label="Zoom in">+</button>
 `;

 const tip = document.createElement("p");
 tip.className = "modal__zoom-tip";
 tip.textContent = "Pinch or use + / − to explore the detail";

 viewport.appendChild(img);
 modalMedia.appendChild(viewport);
 modalMedia.appendChild(controls);
 modalMedia.appendChild(tip);

 zoomState = enableDragZoom(viewport, img, { maxScale: 6 });
 controls.addEventListener("click", (e) => {
 const btn = e.target.closest("[data-zoom]");
 if (!btn || !zoomState) return;
 const action = btn.getAttribute("data-zoom");
 if (action === "in") zoomState.zoomIn();
 if (action === "out") zoomState.zoomOut();
 if (action === "reset") zoomState.reset();
 });
 } else {
 const wrap = document.createElement("div");
 wrap.className = "modal__media-scroll";
 const img = document.createElement("img");
 img.src = work.media;
 img.alt = work.title;
 img.decoding = "async";
 wrap.appendChild(img);
 modalMedia.appendChild(wrap);
 }
 }

 if (modalPost) {
 if (work.instagramUrl) {
 modalPost.hidden = false;
 modalPost.href = work.instagramUrl;
 } else {
 modalPost.hidden = true;
 modalPost.removeAttribute("href");
 }
 }

 const interestMsg = `Hi! I'm interested in purchasing "${work.title}". ${inquiryMessage}`;
 const customMsg = `Hi! I'd love a custom version inspired by "${work.title}". ${customInquiryMessage}`;

 if (modalIg) {
 modalIg.href = instagramProfileUrl;
 modalIg.dataset.work = work.title;
 }

 if (modalWa) {
 modalWa.href = whatsappUrl(interestMsg);
 modalWa.dataset.work = work.title;
 }

 if (modalCustom) {
 modalCustom.href = whatsappUrl(customMsg);
 modalCustom.dataset.work = work.title;
 }

 modal.hidden = false;
 document.body.style.overflow = "hidden";
 document.body.classList.add("modal-open");

 const closeBtn = modal.querySelector(".modal__close");
 if (closeBtn) closeBtn.focus();
 }

 function closeModal() {
 if (!modal || modal.hidden) return;
 destroyZoom();
 modal.hidden = true;
 document.body.style.overflow = "";
 document.body.classList.remove("modal-open");
 modal.classList.remove("modal--landscape", "modal--hires", "modal--zoomable");
 if (modalMedia) {
 const vid = modalMedia.querySelector("video");
 if (vid) {
 vid.pause();
 vid.removeAttribute("src");
 vid.load();
 }
 modalMedia.innerHTML = "";
 }
 if (lastFocus && typeof lastFocus.focus === "function") {
 lastFocus.focus();
 }
 }

 function openWorkById(id) {
 const work = works.find((w) => w.id === id);
 if (work) openModal(work);
 }

 document.querySelectorAll("[data-open-work]").forEach((el) => {
 el.addEventListener("click", (e) => {
 e.preventDefault();
 openWorkById(el.getAttribute("data-open-work"));
 });
 });

 if (modal) {
 modal.querySelectorAll("[data-close-modal]").forEach((el) => {
 el.addEventListener("click", closeModal);
 });
 }

 document.addEventListener("keydown", (e) => {
 if (e.key === "Escape") closeModal();
 });

 if (modalIg) {
 modalIg.addEventListener("click", () => {
 const title = modalIg.dataset.work;
 const text = title
 ? `Hi! I'm interested in purchasing "${title}". ${inquiryMessage}`
 : inquiryMessage;
 copyInquiry(text);
 });
 }

 if (modalCustom) {
 modalCustom.addEventListener("click", () => {
 const title = modalCustom.dataset.work;
 const text = title
 ? `Hi! I'd love a custom version inspired by "${title}". ${customInquiryMessage}`
 : customInquiryMessage;
 copyInquiry(text);
 });
 }

 // Custom CTA > WhatsApp with custom message
 const customIg = document.getElementById("custom-instagram");
 if (customIg) {
 customIg.setAttribute("href", whatsappUrl(customInquiryMessage));
 customIg.addEventListener("click", () => copyInquiry(customInquiryMessage));
 }

 function escapeHtml(str) {
 return String(str)
 .replace(/&/g, "&amp;")
 .replace(/</g, "&lt;")
 .replace(/>/g, "&gt;")
 .replace(/"/g, "&quot;");
 }

 function escapeAttr(str) {
 return escapeHtml(str).replace(/'/g, "&#39;");
 }

 bindPortraitSlider();
 renderAllGallery(true);

 /* Why-buy lead: auto-slide quotes on mobile */
 (function initWhyBuyRotator() {
 const lead = document.getElementById("why-buy-lead");
 const rotator = document.getElementById("why-buy-rotator");
 const dotsWrap = document.getElementById("why-buy-dots");
 if (!lead || !rotator) return;

 const slides = Array.from(rotator.querySelectorAll("[data-why-slide]"));
 if (slides.length < 2) return;

 let index = Math.max(
 0,
 slides.findIndex((s) => s.classList.contains("is-active"))
 );
 if (index < 0) index = 0;
 let timer = null;
 let reduceMotion = false;

 try {
 reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 } catch (e) {
 reduceMotion = false;
 }

 function isMobileWhySlide() {
 return window.matchMedia("(max-width: 900px)").matches;
 }

 function paintDots() {
 if (!dotsWrap) return;
 if (!isMobileWhySlide()) {
 dotsWrap.innerHTML = "";
 dotsWrap.hidden = true;
 return;
 }
 dotsWrap.hidden = false;
 if (dotsWrap.childElementCount !== slides.length) {
 dotsWrap.innerHTML = "";
 slides.forEach((_, i) => {
 const b = document.createElement("button");
 b.type = "button";
 b.className = "why-buy__dot" + (i === index ? " is-active" : "");
 b.setAttribute("aria-label", "Show message " + (i + 1));
 b.addEventListener("click", () => {
 go(i);
 restart();
 });
 dotsWrap.appendChild(b);
 });
 } else {
 dotsWrap.querySelectorAll(".why-buy__dot").forEach((d, i) => {
 d.classList.toggle("is-active", i === index);
 });
 }
 }

 function go(next) {
 const n = slides.length;
 const target = ((next % n) + n) % n;
 if (target === index) {
 paintDots();
 return;
 }
 slides.forEach((s, i) => {
 s.classList.toggle("is-active", i === target);
 s.classList.toggle("is-exit", i === index);
 });
 index = target;
 window.setTimeout(() => {
 slides.forEach((s) => s.classList.remove("is-exit"));
 }, 480);
 paintDots();
 }

 function stop() {
 if (timer) {
 clearInterval(timer);
 timer = null;
 }
 }

 function start() {
 stop();
 if (!isMobileWhySlide() || reduceMotion) {
 // Desktop / reduced motion: show all lines stacked
 slides.forEach((s) => {
 s.classList.add("is-active");
 s.classList.remove("is-exit");
 });
 if (dotsWrap) {
 dotsWrap.innerHTML = "";
 dotsWrap.hidden = true;
 }
 return;
 }
 // Ensure only active slide is marked for rotator mode
 slides.forEach((s, i) => {
 s.classList.toggle("is-active", i === index);
 s.classList.remove("is-exit");
 });
 paintDots();
 timer = window.setInterval(() => go(index + 1), 4200);
 }

 function restart() {
 stop();
 if (isMobileWhySlide() && !reduceMotion) {
 timer = window.setInterval(() => go(index + 1), 4200);
 }
 }

 // Pause when off-screen or hidden tab
 let inView = true;
 if ("IntersectionObserver" in window) {
 const io = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 inView = entry.isIntersecting && entry.intersectionRatio > 0.2;
 if (inView) start();
 else stop();
 });
 },
 { threshold: [0, 0.2, 0.5] }
 );
 io.observe(lead);
 }

 document.addEventListener("visibilitychange", () => {
 if (document.hidden) stop();
 else if (inView) start();
 });

 window.addEventListener("resize", () => {
 window.clearTimeout(lead._whyResize);
 lead._whyResize = window.setTimeout(start, 140);
 });

 // Touch swipe
 let touchX = null;
 rotator.addEventListener(
 "touchstart",
 (e) => {
 if (!isMobileWhySlide() || !e.changedTouches || !e.changedTouches[0]) return;
 touchX = e.changedTouches[0].clientX;
 },
 { passive: true }
 );
 rotator.addEventListener(
 "touchend",
 (e) => {
 if (touchX == null || !e.changedTouches || !e.changedTouches[0]) return;
 const dx = e.changedTouches[0].clientX - touchX;
 touchX = null;
 if (Math.abs(dx) < 40) return;
 if (dx < 0) go(index + 1);
 else go(index - 1);
 restart();
 },
 { passive: true }
 );

 start();
 })();

 /* Why-buy cards: auto-slide carousel on mobile */
 (function initWhyCardsSlider() {
 const shell = document.getElementById("why-cards-slider");
 const track = document.getElementById("why-buy-grid");
 const prev = document.getElementById("why-cards-prev");
 const next = document.getElementById("why-cards-next");
 const dotsWrap = document.getElementById("why-cards-dots");
 if (!shell || !track) return;

 const cards = () => Array.from(track.querySelectorAll(".why-card"));
 let timer = null;
 let reduceMotion = false;
 let inView = true;
 let pauseUntil = 0;

 try {
 reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 } catch (e) {
 reduceMotion = false;
 }

 function isMobile() {
 return window.matchMedia("(max-width: 900px)").matches;
 }

 function step() {
 const card = track.querySelector(".why-card");
 if (!card) return Math.round(track.clientWidth * 0.82);
 const styles = window.getComputedStyle(track);
 const gap = parseFloat(styles.columnGap || styles.gap || "12") || 12;
 return Math.round(card.getBoundingClientRect().width + gap);
 }

 function activeIndex() {
 const list = cards();
 if (!list.length) return 0;
 const mid = track.scrollLeft + track.clientWidth / 2;
 let best = 0;
 let bestDist = Infinity;
 list.forEach((card, i) => {
 const center = card.offsetLeft + card.offsetWidth / 2;
 const dist = Math.abs(center - mid);
 if (dist < bestDist) {
 bestDist = dist;
 best = i;
 }
 });
 return best;
 }

 function paintDots() {
 if (!dotsWrap) return;
 const list = cards();
 if (!isMobile() || !list.length) {
 dotsWrap.innerHTML = "";
 dotsWrap.hidden = true;
 return;
 }
 dotsWrap.hidden = false;
 const active = activeIndex();
 if (dotsWrap.childElementCount !== list.length) {
 dotsWrap.innerHTML = "";
 list.forEach((_, i) => {
 const b = document.createElement("button");
 b.type = "button";
 b.className = "why-cards-slider__dot";
 b.setAttribute("aria-label", "Go to reason " + (i + 1));
 b.addEventListener("click", () => {
 goTo(i);
 softPause();
 });
 dotsWrap.appendChild(b);
 });
 }
 dotsWrap.querySelectorAll(".why-cards-slider__dot").forEach((d, i) => {
 d.classList.toggle("is-active", i === active);
 });
 }

 function updateNav() {
 if (!isMobile()) {
 shell.classList.remove("is-slider");
 if (prev) prev.hidden = true;
 if (next) next.hidden = true;
 if (dotsWrap) {
 dotsWrap.innerHTML = "";
 dotsWrap.hidden = true;
 }
 return;
 }
 shell.classList.add("is-slider");
 if (prev) {
 prev.hidden = false;
 prev.disabled = false;
 }
 if (next) {
 next.hidden = false;
 next.disabled = false;
 }
 paintDots();
 }

 function goTo(index, opts) {
 const list = cards();
 if (!list.length) return;
 const i = ((index % list.length) + list.length) % list.length;
 scrollTrackToIndex(track, ".why-card", i, opts);
 window.setTimeout(updateNav, 320);
 }

 function scrollByDir(dir) {
 if (!isMobile()) return;
 goTo(activeIndex() + dir);
 }

 function softPause() {
 pauseUntil = Date.now() + 7000;
 }

 function stop() {
 if (timer) {
 clearInterval(timer);
 timer = null;
 }
 }

 function start() {
 stop();
 updateNav();
 if (!isMobile() || reduceMotion || !inView) return;
 timer = window.setInterval(() => {
 if (Date.now() < pauseUntil) return;
 if (document.hidden || !inView) return;
 const list = cards();
 if (list.length < 2) return;
 const i = activeIndex();
 const nextIndex = i >= list.length - 1 ? 0 : i + 1;
 goTo(nextIndex);
 }, 4500);
 }

 if (prev) prev.addEventListener("click", () => {
 scrollByDir(-1);
 softPause();
 });
 if (next) next.addEventListener("click", () => {
 scrollByDir(1);
 softPause();
 });

 track.addEventListener(
 "scroll",
 () => {
 if (!isMobile()) return;
 window.requestAnimationFrame(updateNav);
 },
 { passive: true }
 );

 track.addEventListener(
 "touchstart",
 () => {
 softPause();
 },
 { passive: true }
 );

 if ("IntersectionObserver" in window) {
 const io = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 inView = entry.isIntersecting && entry.intersectionRatio > 0.2;
 if (inView) start();
 else stop();
 });
 },
 { threshold: [0, 0.2, 0.5] }
 );
 io.observe(shell);
 }

 document.addEventListener("visibilitychange", () => {
 if (document.hidden) stop();
 else if (inView) start();
 });

 window.addEventListener("resize", () => {
 window.clearTimeout(shell._whyCardsResize);
 shell._whyCardsResize = window.setTimeout(() => {
 if (isMobile()) centerTrackStart(track, ".why-card");
 start();
 }, 140);
 });

 start();
 if (isMobile()) centerTrackStart(track, ".why-card");
 })();

 /* Theme / What you choose: auto-slide on mobile */
 (function initThemeSlider() {
 const shell = document.getElementById("theme-slider");
 const track = document.getElementById("theme-grid");
 const prev = document.getElementById("theme-prev");
 const next = document.getElementById("theme-next");
 const dotsWrap = document.getElementById("theme-dots");
 if (!shell || !track) return;

 const cards = () => Array.from(track.querySelectorAll(".theme-card"));
 let timer = null;
 let reduceMotion = false;
 let inView = true;
 let pauseUntil = 0;
 let index = 0;

 try {
 reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 } catch (e) {
 reduceMotion = false;
 }

 function isMobile() {
 return window.matchMedia("(max-width: 900px)").matches;
 }

 function canSlide() {
 // Only horizontal carousel when track actually overflows
 return track.scrollWidth > track.clientWidth + 12;
 }

 function activeIndex() {
 const list = cards();
 if (!list.length) return 0;
 // Prefer scroll position when track is scrollable
 if (canSlide()) {
 const mid = track.scrollLeft + track.clientWidth / 2;
 let best = 0;
 let bestDist = Infinity;
 list.forEach((card, i) => {
 const center = card.offsetLeft + card.offsetWidth / 2;
 const dist = Math.abs(center - mid);
 if (dist < bestDist) {
 bestDist = dist;
 best = i;
 }
 });
 return best;
 }
 return index;
 }

 function paintDots() {
 if (!dotsWrap) return;
 const list = cards();
 if (!isMobile() || !list.length) {
 dotsWrap.innerHTML = "";
 dotsWrap.hidden = true;
 return;
 }
 dotsWrap.hidden = false;
 const active = activeIndex();
 if (dotsWrap.childElementCount !== list.length) {
 dotsWrap.innerHTML = "";
 list.forEach((_, i) => {
 const b = document.createElement("button");
 b.type = "button";
 b.className = "theme-slider__dot";
 b.setAttribute("aria-label", "Go to choice " + (i + 1));
 b.addEventListener("click", () => {
 goTo(i);
 softPause();
 });
 dotsWrap.appendChild(b);
 });
 }
 dotsWrap.querySelectorAll(".theme-slider__dot").forEach((d, i) => {
 d.classList.toggle("is-active", i === active);
 });
 }

 function updateNav() {
 // Stacked layout (all cards visible): no carousel chrome
 if (!canSlide()) {
 shell.classList.remove("is-slider");
 if (prev) prev.hidden = true;
 if (next) next.hidden = true;
 if (dotsWrap) {
 dotsWrap.innerHTML = "";
 dotsWrap.hidden = true;
 }
 return;
 }
 shell.classList.add("is-slider");
 if (prev) {
 prev.hidden = false;
 prev.disabled = false;
 prev.removeAttribute("hidden");
 }
 if (next) {
 next.hidden = false;
 next.disabled = false;
 next.removeAttribute("hidden");
 }
 paintDots();
 }

 function goTo(nextIndex, opts) {
 if (!canSlide()) return;
 const list = cards();
 if (!list.length) return;
 index = ((nextIndex % list.length) + list.length) % list.length;
 scrollTrackToIndex(track, ".theme-card", index, opts);
 window.setTimeout(updateNav, 280);
 }

 function softPause() {
 pauseUntil = Date.now() + 6500;
 }

 function stop() {
 if (timer) {
 clearInterval(timer);
 timer = null;
 }
 }

 function start() {
 stop();
 updateNav();
 // Auto-slide only when horizontal carousel is active
 if (!canSlide() || reduceMotion || !inView) return;
 timer = window.setInterval(() => {
 if (document.hidden || !inView || !canSlide()) return;
 if (Date.now() < pauseUntil) return;
 const list = cards();
 if (list.length < 2) return;
 goTo(activeIndex() + 1);
 }, 4000);
 }

 if (prev) {
 prev.addEventListener("click", (e) => {
 e.preventDefault();
 goTo(activeIndex() - 1);
 softPause();
 });
 }
 if (next) {
 next.addEventListener("click", (e) => {
 e.preventDefault();
 goTo(activeIndex() + 1);
 softPause();
 });
 }

 track.addEventListener(
 "scroll",
 () => {
 if (!isMobile()) return;
 window.requestAnimationFrame(() => {
 index = activeIndex();
 updateNav();
 });
 },
 { passive: true }
 );
 track.addEventListener("touchstart", softPause, { passive: true });
 track.addEventListener("pointerdown", softPause, { passive: true });

 if ("IntersectionObserver" in window) {
 const io = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 inView = entry.isIntersecting;
 if (inView) start();
 else stop();
 });
 },
 { threshold: 0.05, rootMargin: "40px 0px" }
 );
 io.observe(shell);
 } else {
 inView = true;
 }

 document.addEventListener("visibilitychange", () => {
 if (document.hidden) stop();
 else start();
 });
 window.addEventListener("resize", () => {
 window.clearTimeout(shell._themeResize);
 shell._themeResize = window.setTimeout(() => {
 if (isMobile()) centerTrackStart(track, ".theme-card");
 start();
 }, 120);
 });

 // Layout-ready: stack or carousel depending on overflow
 window.requestAnimationFrame(() => {
 start();
 if (canSlide()) centerTrackStart(track, ".theme-card");
 });
 })();

 // --- Stories slider (aligned, smooth, auto) ---
 (function initStories() {
 const track = document.getElementById("stories-track");
 const prev = document.getElementById("stories-prev");
 const next = document.getElementById("stories-next");
 const dotsWrap = document.getElementById("stories-dots");
 const shell = track && track.closest(".stories");
 if (!track) return;

 const cards = () => Array.from(track.querySelectorAll(".story-card"));
 if (!cards().length) return;

 let index = 0;
 let timer = null;
 let pauseUntil = 0;
 let inView = true;
 let reduceMotion = false;

 try {
 reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 } catch (e) {
 reduceMotion = false;
 }

 function activeIndex() {
 const list = cards();
 if (!list.length) return 0;
 const mid = track.scrollLeft + track.clientWidth / 2;
 let best = 0;
 let bestDist = Infinity;
 list.forEach((card, i) => {
 const center = card.offsetLeft + card.offsetWidth / 2;
 const dist = Math.abs(center - mid);
 if (dist < bestDist) {
 bestDist = dist;
 best = i;
 }
 });
 return best;
 }

 function paintDots() {
 if (!dotsWrap) return;
 const list = cards();
 const active = activeIndex();
 if (dotsWrap.childElementCount !== list.length) {
 dotsWrap.innerHTML = "";
 list.forEach((_, i) => {
 const b = document.createElement("button");
 b.type = "button";
 b.className = "stories__dot";
 b.setAttribute("aria-label", "Go to story " + (i + 1));
 b.addEventListener("click", () => {
 goTo(i);
 softPause();
 });
 dotsWrap.appendChild(b);
 });
 }
 Array.from(dotsWrap.querySelectorAll(".stories__dot")).forEach((d, i) => {
 d.classList.toggle("is-active", i === active);
 });
 }

 function goTo(nextIndex, opts) {
 const list = cards();
 if (!list.length) return;
 index = ((nextIndex % list.length) + list.length) % list.length;
 const behavior =
 (opts && opts.behavior) || (reduceMotion ? "auto" : "smooth");
 scrollTrackToIndex(track, ".story-card", index, { behavior: behavior });
 window.setTimeout(paintDots, 280);
 }

 function softPause() {
 pauseUntil = Date.now() + 6500;
 }

 function stop() {
 if (timer) {
 clearInterval(timer);
 timer = null;
 }
 }

 function start() {
 stop();
 paintDots();
 if (reduceMotion || !inView) return;
 timer = window.setInterval(() => {
 if (document.hidden || !inView) return;
 if (Date.now() < pauseUntil) return;
 goTo(activeIndex() + 1);
 }, 4200);
 }

 if (prev) {
 prev.addEventListener("click", (e) => {
 e.preventDefault();
 goTo(activeIndex() - 1);
 softPause();
 });
 }
 if (next) {
 next.addEventListener("click", (e) => {
 e.preventDefault();
 goTo(activeIndex() + 1);
 softPause();
 });
 }

 track.addEventListener(
 "scroll",
 () => {
 window.requestAnimationFrame(() => {
 index = activeIndex();
 paintDots();
 });
 },
 { passive: true }
 );
 track.addEventListener("touchstart", softPause, { passive: true });
 track.addEventListener("pointerdown", softPause, { passive: true });

 if (shell && "IntersectionObserver" in window) {
 const io = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 inView = entry.isIntersecting;
 if (inView) start();
 else stop();
 });
 },
 { threshold: 0.12, rootMargin: "30px 0px" }
 );
 io.observe(shell);
 }

 document.addEventListener("visibilitychange", () => {
 if (document.hidden) stop();
 else start();
 });

 window.addEventListener("resize", () => {
 window.clearTimeout(track._storiesResize);
 track._storiesResize = window.setTimeout(() => {
 centerTrackStart(track, ".story-card");
 start();
 }, 140);
 });

 centerTrackStart(track, ".story-card");
 start();
 })();
})();
