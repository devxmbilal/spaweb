/* ===== Revitalize MedSpa — interactions & demo automations ===== */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const IMG = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
  const FALLBACK = IMG('photo-1570172619644-dfd03ed5d881');
  const SPA = 'Revitalize MedSpa';

  /* ---------- Data ---------- */
  const treatments = [
    { name: 'Botox & Dysport', cat: 'injectables', tag: 'Injectables', price: 'From $12/unit', icon: 'ri-magic-line', img: 'photo-1487412947147-5cebf100ffc2', desc: 'Smooth forehead lines, frown lines and crow’s feet for a refreshed, natural look.' },
    { name: 'Dermal Fillers', cat: 'injectables', tag: 'Injectables', price: 'From $650', icon: 'ri-drop-line', img: 'photo-1531123897727-8f129e1688ce', desc: 'Restore volume to lips, cheeks and jawline with expertly placed hyaluronic fillers.' },
    { name: 'HydraFacial', cat: 'skin', tag: 'Skin', price: 'From $199', icon: 'ri-water-flash-line', img: 'photo-1552693673-1bf958298935', desc: 'Cleanse, extract and hydrate in one 45-minute glow-boosting treatment.' },
    { name: 'IV Hydration Therapy', cat: 'wellness', tag: 'Wellness', price: 'From $159', icon: 'ri-heart-pulse-line', img: 'photo-1515377905703-c4788e51af15', desc: 'Hydrate, energize and boost immunity with custom vitamin drips — perfect for the Arizona heat.' },
    { name: 'Medical Weight Loss', cat: 'wellness', tag: 'Wellness', price: 'From $299/mo', icon: 'ri-scales-3-line', img: 'photo-1571019613454-1cb2f99b2d8b', desc: 'Physician-guided GLP-1 programs with check-ins, nutrition support and real, lasting results.' },
    { name: 'Laser Hair Removal', cat: 'laser', tag: 'Laser', price: 'From $99', icon: 'ri-flashlight-line', img: 'photo-1560750588-73207b1ef5b8', desc: 'Long-lasting smoothness with advanced laser technology safe for all skin types.' },
    { name: 'Microneedling', cat: 'skin', tag: 'Skin', price: 'From $299', icon: 'ri-focus-3-line', img: 'photo-1616394584738-fc6e612e71b9', desc: 'Stimulate collagen to reduce scars, pores and fine lines. Add PRP for extra glow.' },
    { name: 'Hormone Therapy', cat: 'wellness', tag: 'Wellness', price: 'Free consult', icon: 'ri-capsule-line', img: 'photo-1544161515-4ab6ce6db874', desc: 'Bioidentical hormone balancing for better energy, sleep, mood and vitality.' },
  ];

  const reviews = [
    { name: 'Jessica M.', tx: 'Botox', img: 'photo-1494790108377-be9c29b29330', text: 'The most natural Botox I’ve ever had. Nobody can tell — they just say I look rested! Booking online took less than a minute.' },
    { name: 'Andrea L.', tx: 'HydraFacial', img: 'photo-1438761681033-6461ffad8d80', text: 'Gorgeous space, so calming. My skin was glowing for a week. I loved getting the reminder text the day before.' },
    { name: 'Sofia R.', tx: 'Lip Filler', img: 'photo-1544005313-94ddf0286df2', text: 'They listened to exactly what I wanted — subtle and balanced. I felt completely comfortable the whole time.' },
    { name: 'Megan T.', tx: 'Laser Hair Removal', img: 'photo-1534528741775-53994a69daeb', text: 'Professional, quick and practically painless. The membership pays for itself. Highly recommend Revitalize!' },
    { name: 'Daniela P.', tx: 'Medical Weight Loss', img: 'photo-1517841905240-472988babdf9', text: 'Down 28 lbs and I have so much more energy. The weekly check-in texts kept me on track the whole way.' },
    { name: 'Rachel K.', tx: 'IV Hydration', img: 'photo-1531123897727-8f129e1688ce', text: 'My go-to after a long week. In and out in 45 minutes and I feel brand new. Booking is so easy!' },
  ];

  const faqs = [
    ['Is the consultation really free?', 'Yes! Every new client receives a complimentary consultation and skin analysis. We’ll build a personalized plan with no pressure to book.'],
    ['How long does Botox last?', 'Most clients enjoy results for 3–4 months. We’ll automatically send you a friendly text when it’s time for a touch-up.'],
    ['How does medical weight loss work?', 'After a consultation and health review, our provider builds a personalized plan (including GLP-1 options when appropriate) with regular check-ins and automatic progress reminders by text.'],
    ['Is there downtime after treatments?', 'Most treatments like Botox, HydraFacial and IV therapy have little to no downtime. Microneedling may cause mild redness for 24–48 hours.'],
    ['Do you offer financing?', 'Yes, we offer flexible monthly payment options through Cherry and CareCredit, plus our Glow Memberships for ongoing savings.'],
    ['Can I reschedule my appointment?', 'Absolutely — simply reply to your confirmation text or click the link in your reminder to reschedule in seconds.'],
  ];

  /* ---------- Preloader & AOS ---------- */
  // side-slide animations push content off-screen on phones — use fade-up there
  if (innerWidth < 1024) $$('[data-aos="fade-left"],[data-aos="fade-right"]').forEach(el => el.dataset.aos = 'fade-up');
  window.addEventListener('load', () => {
    setTimeout(() => $('#preloader').classList.add('hide'), 900);
    AOS.init({ duration: 900, once: true, easing: 'ease-out-cubic', offset: 60 });
  });
  $('#year').textContent = new Date().getFullYear();

  // live "Open now / Closed" badge using Phoenix local time (Mon–Sat 9 AM – 7 PM)
  const openStatus = $('#openStatus');
  if (openStatus) {
    const az = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Phoenix' }));
    const h = az.getHours() + az.getMinutes() / 60, day = az.getDay();
    const open = day !== 0 && h >= 9 && h < 19;
    openStatus.innerHTML = open
      ? `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Open now · closes 7 PM`
      : `<span class="w-2 h-2 rounded-full bg-rose-400"></span> Closed now · ${day === 6 && h >= 19 ? 'Sunday by appointment' : 'opens 9 AM'} — book online 24/7`;
  }

  // image fallback
  document.addEventListener('error', e => {
    if (e.target.tagName === 'IMG' && !e.target.dataset.fb) { e.target.dataset.fb = 1; e.target.src = FALLBACK; }
  }, true);

  /* ---------- Navbar / progress / active links ---------- */
  const nav = $('#navbar'), progress = $('#progress');
  const sections = $$('section[id]');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    const h = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (y / h) * 100 + '%';
    let current = '';
    sections.forEach(s => { if (y >= s.offsetTop - 140) current = s.id; });
    $$('.nav-link').forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const menu = $('#mobileMenu');
  $('#menuBtn').onclick = () => { menu.classList.add('open'); document.body.classList.add('lock'); };
  const closeMenu = () => { menu.classList.remove('open'); document.body.classList.remove('lock'); };
  $('#menuClose').onclick = closeMenu;
  $$('.mobile-link, .mobile-link-btn, #mobileMenu a[href^="tel"]').forEach(a => a.addEventListener('click', closeMenu));
  $('.menu-overlay').addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Counters ---------- */
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, target = +el.dataset.target, dur = 1800, t0 = performance.now();
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  }, { threshold: .6 });
  $$('.counter').forEach(c => counterObs.observe(c));

  /* ---------- Treatments ---------- */
  const grid = $('#treatmentGrid');
  grid.innerHTML = treatments.map((t, i) => `
    <article class="t-card" data-cat="${t.cat}" data-aos="fade-up" data-aos-delay="${(i % 4) * 80}" data-service="${t.name}">
      <img src="${IMG(t.img)}" alt="${t.name}" loading="lazy" />
      <span class="t-tag">${t.tag}</span>
      <span class="t-arrow"><i class="ri-arrow-right-up-line"></i></span>
      <div class="t-body">
        <p class="text-gold-300 text-xs font-semibold tracking-wider">${t.price}</p>
        <h3 class="font-serif text-2xl sm:text-3xl leading-tight mt-1">${t.name}</h3>
        <div class="t-desc text-sm text-cream/80">${t.desc}<span class="block mt-3 text-gold-300 font-semibold text-xs uppercase tracking-widest">Book this →</span></div>
      </div>
    </article>`).join('');

  $$('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    $$('.t-card').forEach(c => {
      const show = f === 'all' || c.dataset.cat === f;
      c.classList.toggle('hide', !show);
      if (show) c.animate([{ opacity: 0, transform: 'translateY(20px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.2,.8,.2,1)' });
    });
  }));

  grid.addEventListener('click', e => {
    const card = e.target.closest('.t-card');
    if (!card) return;
    selectService(card.dataset.service);
    $('#book').scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- Before / After ---------- */
  const slider = $('#baSlider'), beforeWrap = $('#baBeforeWrap'), handle = $('#baHandle');
  const setBA = pct => {
    pct = Math.max(2, Math.min(98, pct));
    beforeWrap.style.width = pct + '%';
    handle.style.left = pct + '%';
  };
  const syncWidth = () => slider.style.setProperty('--ba-w', slider.offsetWidth + 'px');
  syncWidth(); window.addEventListener('resize', syncWidth);
  let dragging = false;
  const move = x => { const r = slider.getBoundingClientRect(); setBA(((x - r.left) / r.width) * 100); };
  slider.addEventListener('pointerdown', e => { dragging = true; move(e.clientX); slider.setPointerCapture(e.pointerId); });
  slider.addEventListener('pointermove', e => dragging && move(e.clientX));
  slider.addEventListener('pointerup', () => dragging = false);
  // intro sweep
  new IntersectionObserver((en, o) => {
    if (!en[0].isIntersecting) return;
    o.disconnect();
    const seq = [50, 20, 80, 50]; let i = 0;
    const step = () => { if (i >= seq.length) return; beforeWrap.style.transition = handle.style.transition = 'all .8s cubic-bezier(.65,0,.35,1)'; setBA(seq[i++]); setTimeout(step, 850); };
    step();
    setTimeout(() => beforeWrap.style.transition = handle.style.transition = '', 3600);
  }, { threshold: .5 }).observe(slider);
  $$('.ba-tab').forEach(tab => tab.addEventListener('click', () => {
    $$('.ba-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    $('#baBefore').src = tab.dataset.before;
    $('#baAfter').src = tab.dataset.after;
    $('#baCaption').textContent = tab.dataset.label;
    slider.animate([{ opacity: .4 }, { opacity: 1 }], { duration: 500 });
  }));

  /* ---------- Pricing toggle ---------- */
  $$('.billing-btn').forEach(btn => btn.addEventListener('click', () => {
    $$('.billing-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    $$('.price').forEach(p => {
      p.classList.add('flip');
      setTimeout(() => { p.textContent = '$' + p.dataset[btn.dataset.billing]; p.classList.remove('flip'); }, 220);
    });
  }));

  /* ---------- Reviews carousel ---------- */
  const track = $('#revTrack');
  track.innerHTML = reviews.map(r => `
    <div class="review-card">
      <span class="quote">“</span>
      <div class="flex text-gold-500"><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i></div>
      <p class="mt-5 text-ink/75 leading-relaxed relative">${r.text}</p>
      <div class="mt-7 flex items-center gap-3">
        <img src="${IMG(r.img, 160)}" alt="${r.name}" class="w-12 h-12 rounded-full object-cover" loading="lazy" />
        <div><p class="font-bold">${r.name}</p><p class="text-xs text-rose-600">${r.tx} · Verified client</p></div>
        <i class="ri-google-fill ml-auto text-2xl text-ink/20"></i>
      </div>
    </div>`).join('');
  let rev = 0;
  const perView = () => innerWidth >= 1024 ? 3 : innerWidth >= 768 ? 2 : 1;
  const goRev = i => {
    const max = reviews.length - perView();
    rev = i < 0 ? max : i > max ? 0 : i;
    const card = track.children[0];
    track.style.transform = `translateX(-${rev * (card.offsetWidth + 24)}px)`;
  };
  $('#revNext').onclick = () => goRev(rev + 1);
  $('#revPrev').onclick = () => goRev(rev - 1);
  let revTimer = setInterval(() => goRev(rev + 1), 5000);
  track.addEventListener('mouseenter', () => clearInterval(revTimer));
  track.addEventListener('mouseleave', () => revTimer = setInterval(() => goRev(rev + 1), 5000));
  window.addEventListener('resize', () => goRev(rev));
  // swipe
  let sx = 0;
  track.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
  track.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) goRev(rev + (dx < 0 ? 1 : -1)); });

  /* ---------- FAQ ---------- */
  $('#faqList').innerHTML = faqs.map(([q, a], i) => `
    <div class="faq ${i === 0 ? 'open' : ''}">
      <button type="button"><span>${q}</span><i class="ri-add-line"></i></button>
      <div class="ans"><div><p>${a}</p></div></div>
    </div>`).join('');
  $$('.faq button').forEach(b => b.addEventListener('click', () => {
    const f = b.parentElement, was = f.classList.contains('open');
    $$('.faq').forEach(x => x.classList.remove('open'));
    if (!was) f.classList.add('open');
  }));

  /* ---------- Toasts ---------- */
  const toast = (title, body, icon = 'ri-notification-3-line', color = 'bg-gold-500 text-ink', ms = 5000) => {
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<span class="t-ico ${color}"><i class="${icon}"></i></span><div class="flex-1 min-w-0"><p class="font-semibold text-sm">${title}</p><p class="text-xs text-cream/70 mt-0.5">${body}</p></div><span class="text-[10px] text-cream/40">now</span>`;
    $('#toasts').prepend(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 400); }, ms);
  };

  /* ---------- Leads store (localStorage) ---------- */
  const KEY = 'revitalize_demo_leads';
  const seed = [
    { name: 'Ashley Brooks', service: 'Botox & Dysport', source: 'Website booking', status: 'Booked', ts: Date.now() - 1000 * 60 * 42 },
    { name: 'Maria Gonzalez', service: 'HydraFacial', source: 'Offer popup', status: 'New lead', ts: Date.now() - 1000 * 60 * 95 },
    { name: 'Kayla Nguyen', service: 'Dermal Fillers', source: 'Chat widget', status: 'Booked', ts: Date.now() - 1000 * 60 * 60 * 5 },
  ];
  const getLeads = () => { try { return JSON.parse(localStorage.getItem(KEY)) || seed; } catch { return seed; } };
  const saveLeads = l => { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch {} };
  const ago = ts => { const m = Math.round((Date.now() - ts) / 60000); return m < 1 ? 'just now' : m < 60 ? m + 'm ago' : Math.round(m / 60) + 'h ago'; };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const renderLeads = (highlight = false) => {
    const leads = getLeads();
    $('#leadList').innerHTML = leads.slice(0, 8).map((l, i) => `
      <li class="lead-item ${highlight && i === 0 ? 'new' : ''}">
        <span class="lead-avatar">${esc(l.name).split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
        <div class="flex-1 min-w-0"><p class="text-sm font-semibold truncate">${esc(l.name)}</p><p class="text-[11px] text-ink/50 truncate">${esc(l.service)} · ${esc(l.source)}</p></div>
        <div class="text-right"><span class="lead-badge ${l.status === 'Booked' ? 'bg-emerald-100 text-emerald-700' : 'bg-gold-300/40 text-gold-600'}">${l.status}</span><p class="text-[10px] text-ink/40 mt-1">${ago(l.ts)}</p></div>
      </li>`).join('');
    animateNum($('#kpiLeads'), leads.length);
    animateNum($('#kpiBooked'), leads.filter(l => l.status === 'Booked').length);
  };
  const animateNum = (el, to) => {
    const from = +el.textContent || 0; if (from === to) return;
    const t0 = performance.now();
    const tick = n => { const p = Math.min((n - t0) / 700, 1); el.textContent = Math.round(from + (to - from) * p); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  const addLead = lead => {
    const leads = getLeads();
    leads.unshift({ ...lead, ts: Date.now() });
    saveLeads(leads);
    renderLeads(true);
  };
  $('#clearLeads').onclick = () => { localStorage.removeItem(KEY); renderLeads(); };
  renderLeads();

  /* ---------- Automation phone demo ---------- */
  const feed = $('#chatFeed');
  const scripts = [
    [
      ['sys', 'Online booking · 11:47 PM'],
      ['out', 'New request: HydraFacial — Sat, 10:30 AM'],
      ['in', 'Hi Maria! 💆‍♀️ Thanks for booking with Revitalize MedSpa. Your HydraFacial request for Sat at 10:30 AM is received!'],
    ],
    [
      ['sys', 'Auto-reply sent in 4 seconds'],
      ['in', '✅ Confirmed! Sat, Nov 30 · 10:30 AM\n📍 3143 N 32nd St, Phoenix\nReply C to confirm or R to reschedule.'],
      ['out', 'C'],
      ['in', 'Perfect, see you Saturday! ✨'],
    ],
    [
      ['notify', '🔔 OWNER ALERT\nNew booking: Maria G.\nHydraFacial · Sat 10:30 AM\n📱 (602) 555-0142 · Source: Website'],
    ],
    [
      ['sys', 'Friday · 10:30 AM (24h before)'],
      ['in', 'Hi Maria! Reminder: your HydraFacial is tomorrow at 10:30 AM. Please arrive 10 min early with a clean face 🌸'],
      ['sys', 'Saturday · 8:30 AM (2h before)'],
      ['in', 'See you in 2 hours! Free parking available out front 🚗'],
    ],
    [
      ['sys', 'Sunday · Day after treatment'],
      ['in', 'How is your skin feeling today, Maria? 💕 Remember SPF & extra hydration for 48h.'],
      ['out', 'Glowing!! Love it 😍'],
      ['in', 'Yay! Would you mind leaving us a quick Google review? ⭐ g.page/revitalize-medspa\nPS: Rebook within 30 days & save 15%.'],
    ],
  ];
  let autoStep = 0, autoTimer = null, playing = false;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const pushBubble = (type, text) => {
    const b = document.createElement('div');
    b.className = 'bubble ' + type;
    b.style.whiteSpace = 'pre-line';
    b.textContent = text;
    feed.appendChild(b);
    feed.scrollTo({ top: feed.scrollHeight, behavior: 'smooth' });
  };
  const typing = async () => {
    const t = document.createElement('div'); t.className = 'typing'; t.innerHTML = '<span></span><span></span><span></span>';
    feed.appendChild(t); feed.scrollTop = feed.scrollHeight;
    await sleep(900); t.remove();
  };
  const playStep = async (i, token) => {
    $$('.auto-feature').forEach(f => f.classList.toggle('active', +f.dataset.step === i));
    for (const [type, text] of scripts[i]) {
      if (token !== playToken) return;
      if (type === 'in') await typing();
      if (token !== playToken) return;
      pushBubble(type, text);
      await sleep(type === 'sys' ? 500 : 1100);
    }
  };
  let playToken = 0;
  const playFrom = async start => {
    const token = ++playToken;
    feed.innerHTML = '';
    for (let i = start; i < scripts.length; i++) {
      await playStep(i, token);
      if (token !== playToken) return;
      await sleep(1400);
    }
    if (token === playToken) { await sleep(2500); if (token === playToken) playFrom(0); }
  };
  $$('.auto-feature').forEach(f => f.addEventListener('click', () => playFrom(+f.dataset.step)));
  new IntersectionObserver((en, o) => { if (en[0].isIntersecting) { o.disconnect(); playFrom(0); } }, { threshold: .3 }).observe(feed);

  // show real user's booking inside phone
  const phoneShowBooking = async (name, service, when) => {
    const token = ++playToken;
    feed.innerHTML = '';
    $$('.auto-feature').forEach(f => f.classList.toggle('active', f.dataset.step === '1'));
    pushBubble('sys', 'Your booking · just now');
    await typing(); if (token !== playToken) return;
    pushBubble('in', `Hi ${name.split(' ')[0]}! ✨ Your ${service} is confirmed for ${when}.\nReply C to confirm or R to reschedule.`);
    await sleep(1200); if (token !== playToken) return;
    $$('.auto-feature').forEach(f => f.classList.toggle('active', f.dataset.step === '2'));
    pushBubble('notify', `🔔 OWNER ALERT\nNew booking: ${name}\n${service} · ${when}`);
    await sleep(1200); if (token !== playToken) return;
    $$('.auto-feature').forEach(f => f.classList.toggle('active', f.dataset.step === '3'));
    pushBubble('sys', 'Reminders scheduled: 24h & 2h before');
  };

  /* ---------- Booking form ---------- */
  const svcWrap = $('#serviceChoices');
  svcWrap.innerHTML = treatments.slice(0, 6).map(t => `
    <button type="button" class="choice" data-service="${t.name}"><i class="${t.icon}"></i><span>${t.name.replace(' & Dysport', '')}</span><small>${t.price}</small></button>`).join('');
  const state = { service: '', date: '', time: '' };
  function selectService(name) {
    state.service = name;
    $$('.choice').forEach(c => c.classList.toggle('selected', c.dataset.service === name));
  }
  svcWrap.addEventListener('click', e => { const c = e.target.closest('.choice'); if (c) selectService(c.dataset.service); });

  // dates (next 10 days, skip Sundays)
  const dateWrap = $('#dateChoices');
  const days = [];
  for (let d = new Date(), n = 0; days.length < 10 && n < 20; n++) {
    const x = new Date(d); x.setDate(d.getDate() + n + 1);
    if (x.getDay() !== 0) days.push(x);
  }
  dateWrap.innerHTML = days.map(d => `<button type="button" class="date-chip" data-date="${d.toDateString()}"><small>${d.toLocaleDateString('en-US', { weekday: 'short' })}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString('en-US', { month: 'short' })}</small></button>`).join('');
  const times = ['9:00 AM', '9:30 AM', '10:30 AM', '11:00 AM', '12:30 PM', '1:00 PM', '2:30 PM', '3:00 PM', '4:00 PM', '5:30 PM', '6:00 PM', '6:30 PM'];
  const renderTimes = seedNum => {
    $('#timeChoices').innerHTML = times.map((t, i) => {
      const off = (i * 7 + seedNum) % 5 === 0;
      return `<button type="button" class="time-chip ${off ? 'disabled' : ''} ${state.time === t && !off ? 'selected' : ''}" data-time="${t}" ${off ? 'disabled' : ''}>${t}</button>`;
    }).join('');
  };
  renderTimes(0);
  dateWrap.addEventListener('click', e => {
    const c = e.target.closest('.date-chip'); if (!c) return;
    $$('.date-chip').forEach(x => x.classList.remove('selected'));
    c.classList.add('selected'); state.date = c.dataset.date; state.time = '';
    renderTimes(new Date(state.date).getDate());
    $('#timeChoices').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
  });
  $('#timeChoices').addEventListener('click', e => {
    const c = e.target.closest('.time-chip'); if (!c || c.disabled) return;
    $$('.time-chip').forEach(x => x.classList.remove('selected'));
    c.classList.add('selected'); state.time = c.dataset.time;
  });

  let step = 1;
  const form = $('#bookingForm');
  const showStep = n => {
    step = n;
    $$('.form-step').forEach(s => s.classList.toggle('active', +s.dataset.step === n));
    $$('.step-dot').forEach(d => { const k = +d.dataset.dot; d.classList.toggle('active', k === n); d.classList.toggle('done', k < n); d.innerHTML = k < n ? '<i class="ri-check-line"></i>' : k; });
    $$('.step-line').forEach((l, i) => l.classList.toggle('fill', i + 1 < n));
    if (n === 3) {
      const d = new Date(state.date);
      $('#summary').innerHTML = `<i class="ri-calendar-check-fill text-rose-600 text-2xl"></i><div><p class="font-semibold">${state.service}</p><p class="text-ink/60 text-xs">${d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${state.time}</p></div>`;
    }
  };
  const fail = el => { const err = $('.err', el); err.classList.remove('hidden'); el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); };
  $$('.next-step').forEach(b => b.addEventListener('click', () => {
    const cur = $(`.form-step[data-step="${step}"]`);
    $('.err', cur).classList.add('hidden');
    if (step === 1 && !state.service) return fail(cur);
    if (step === 2 && (!state.date || !state.time)) return fail(cur);
    showStep(step + 1);
  }));
  $$('.prev-step').forEach(b => b.addEventListener('click', () => showStep(step - 1)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const cur = $('.form-step[data-step="3"]');
    const name = $('#fName').value.trim(), phone = $('#fPhone').value.trim(), email = $('#fEmail').value.trim();
    $$('.field', cur).forEach(f => f.classList.remove('invalid'));
    let bad = false;
    if (!name) { $('#fName').parentElement.classList.add('invalid'); bad = true; }
    if (phone.replace(/\D/g, '').length < 10) { $('#fPhone').parentElement.classList.add('invalid'); bad = true; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { $('#fEmail').parentElement.classList.add('invalid'); bad = true; }
    if (bad) return fail(cur);

    const btn = $('button[type=submit]', form);
    btn.disabled = true; btn.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Booking…';

    setTimeout(() => {
      const d = new Date(state.date);
      const when = `${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at ${state.time}`;
      addLead({ name, service: state.service, source: 'Website booking', status: 'Booked' });
      $('#successText').innerHTML = `Thank you, <b>${esc(name.split(' ')[0])}</b>! Your <b>${esc(state.service)}</b> appointment is requested for <b>${when}</b>.`;
      buildICS(state.service, d, state.time);
      openModal($('#successModal'));
      runAutomations(name, state.service, when);
      phoneShowBooking(name, state.service, when);

      form.reset(); state.service = state.date = state.time = '';
      $$('.choice,.date-chip,.time-chip').forEach(x => x.classList.remove('selected'));
      showStep(1);
      btn.disabled = false; btn.innerHTML = 'Confirm Booking <i class="ri-check-double-line"></i>';
    }, 1200);
  });

  const runAutomations = (name, service, when) => {
    const first = esc(name.split(' ')[0]);
    setTimeout(() => toast('SMS sent to client', `“Hi ${first}! Your ${esc(service)} is confirmed for ${when}.”`, 'ri-message-2-fill', 'bg-emerald-500 text-white'), 900);
    setTimeout(() => toast('Owner notified', `New booking from ${esc(name)} — added to calendar.`, 'ri-notification-badge-fill', 'bg-gold-500 text-ink'), 2200);
    setTimeout(() => toast('Reminders scheduled', '24h & 2h SMS reminders queued automatically.', 'ri-alarm-fill', 'bg-rose-500 text-white'), 3500);
  };

  // .ics calendar file
  const buildICS = (service, d, time) => {
    const [hm, ap] = time.split(' '); let [h, m] = hm.split(':').map(Number);
    if (ap === 'PM' && h !== 12) h += 12; if (ap === 'AM' && h === 12) h = 0;
    const start = new Date(d); start.setHours(h, m, 0, 0);
    const end = new Date(start.getTime() + 60 * 60000);
    const f = x => x.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Revitalize MedSpa//EN', 'BEGIN:VEVENT', `UID:${Date.now()}@revitalize`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(start)}`, `DTEND:${f(end)}`, `SUMMARY:${service} — ${SPA}`, 'LOCATION:Revitalize MedSpa, 3143 N 32nd St, Phoenix, AZ 85018', 'DESCRIPTION:Questions? Call (602) 975-6244', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const link = $('#calLink');
    link.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    link.download = 'revitalize-appointment.ics';
  };

  /* ---------- Modals ---------- */
  const openModal = m => { m.classList.add('show'); document.body.classList.add('lock'); };
  const closeModal = m => { m.classList.remove('show'); document.body.classList.remove('lock'); };
  $('#successClose').onclick = () => closeModal($('#successModal'));
  $('#successModal').addEventListener('click', e => { if (e.target.id === 'successModal') closeModal(e.target); });

  /* ---------- Hero quick form ---------- */
  $('#heroForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addLead({ name: fd.get('name'), service: fd.get('service'), source: 'Hero offer', status: 'New lead' });
    toast('Offer claimed! 🎉', `We just texted your $50 code to ${esc(fd.get('phone'))}.`, 'ri-gift-2-fill', 'bg-gold-500 text-ink');
    setTimeout(() => toast('Owner notified', `New lead: ${esc(fd.get('name'))} — ${esc(fd.get('service'))}`, 'ri-notification-badge-fill', 'bg-rose-500 text-white'), 1600);
    e.target.reset();
    sessionStorage.setItem('revitalize_popup', '1');
  });

  /* ---------- Lead popup (timed + exit intent) ---------- */
  const popup = $('#leadPopup');
  const showPopup = () => {
    if (sessionStorage.getItem('revitalize_popup')) return;
    sessionStorage.setItem('revitalize_popup', '1');
    openModal(popup);
  };
  setTimeout(showPopup, 25000);
  document.addEventListener('mouseout', e => { if (!e.relatedTarget && e.clientY < 10) showPopup(); });
  $('#popupClose').onclick = $('#popupNo').onclick = () => closeModal(popup);
  popup.addEventListener('click', e => { if (e.target === popup) closeModal(popup); });
  $('#popupForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addLead({ name: fd.get('name'), service: '$50 first-visit offer', source: 'Offer popup', status: 'New lead' });
    closeModal(popup);
    toast('Your code is on its way! 💌', `Check your texts, ${esc(fd.get('name'))} — code GLOW50.`, 'ri-gift-2-fill', 'bg-gold-500 text-ink');
    setTimeout(() => toast('Owner notified', `New VIP lead: ${esc(fd.get('name'))}`, 'ri-notification-badge-fill', 'bg-rose-500 text-white'), 1600);
  });

  /* ---------- Newsletter ---------- */
  $('#newsletterForm').addEventListener('submit', e => {
    e.preventDefault(); e.target.reset();
    toast('You’re on the list ✨', 'Welcome email sent — enjoy member-only glow tips.', 'ri-mail-check-fill', 'bg-emerald-500 text-white');
  });

  /* ---------- Chat widget ---------- */
  const chatBox = $('#chatBox'), wFeed = $('#widgetFeed'), wQuick = $('#widgetQuick');
  let chatStarted = false, chatLead = { stage: 0 };
  const wMsg = (text, who = 'bot') => {
    const m = document.createElement('div'); m.className = 'w-msg ' + who; m.innerHTML = text;
    wFeed.appendChild(m); wFeed.scrollTop = wFeed.scrollHeight;
  };
  const botSay = async (text, quick = []) => {
    const t = document.createElement('div'); t.className = 'typing'; t.innerHTML = '<span></span><span></span><span></span>';
    wFeed.appendChild(t); wFeed.scrollTop = wFeed.scrollHeight;
    await sleep(800); t.remove(); wMsg(text);
    wQuick.innerHTML = quick.map(q => `<button type="button" class="quick">${q}</button>`).join('');
  };
  const replies = {
    'Book an appointment': () => { botSay('Wonderful! Tap below to pick a treatment & time — it takes under a minute 🗓️<br><a href="#book" class="text-rose-600 font-semibold underline chat-book">Open booking →</a>', ['Pricing', 'Talk to a human']); },
    'Pricing': () => botSay('Botox from <b>$12/unit</b>, HydraFacial from <b>$199</b>, fillers from <b>$650</b>. Members save up to 20% 💎', ['Book an appointment', 'Memberships']),
    'Memberships': () => { botSay('Our Glow plans start at <b>$99/mo</b> — includes a monthly facial & member pricing.', ['Book an appointment']); $('#memberships').scrollIntoView({ behavior: 'smooth' }); },
    'Talk to a human': () => { chatLead.stage = 1; botSay('Of course! What’s your first name? 😊'); },
    'Hours & location': () => botSay('We’re open <b>Mon–Sat, 9 AM – 7 PM</b> at <b>3143 N 32nd St, Phoenix, AZ 85018</b>. <a class="text-rose-600 font-semibold underline" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=3143+N+32nd+St,+Phoenix,+AZ+85018">Get directions →</a><br> Call us anytime at <a class="text-rose-600 font-semibold" href="tel:+16029756244">(602) 975-6244</a>.', ['Book an appointment']),
  };
  const handleChat = async text => {
    wMsg(esc(text), 'me'); wQuick.innerHTML = '';
    if (replies[text]) return replies[text]();
    if (chatLead.stage === 1) { chatLead.name = text; chatLead.stage = 2; return botSay(`Nice to meet you, ${esc(text)}! What’s the best mobile number to reach you?`); }
    if (chatLead.stage === 2) {
      chatLead.stage = 0;
      addLead({ name: chatLead.name, service: 'Chat inquiry', source: 'Chat widget', status: 'New lead' });
      toast('Owner notified', `Chat lead: ${esc(chatLead.name)} wants a callback.`, 'ri-notification-badge-fill', 'bg-rose-500 text-white');
      return botSay('Thank you! 💕 A team member will text you within minutes. Anything else?', ['Pricing', 'Book an appointment']);
    }
    const t = text.toLowerCase();
    if (/price|cost|how much/.test(t)) return replies['Pricing']();
    if (/book|appoint|schedule/.test(t)) return replies['Book an appointment']();
    if (/hour|open|where|location|address/.test(t)) return replies['Hours & location']();
    if (/botox|filler|facial|laser/.test(t)) return botSay('Great choice! That’s one of our most popular treatments. Want to book a free consult?', ['Book an appointment', 'Pricing']);
    botSay('Great question! Want me to connect you with our team? They usually reply in minutes.', ['Talk to a human', 'Book an appointment']);
  };
  $('#chatToggle').onclick = () => {
    chatBox.classList.toggle('open');
    $('#chatToggle span')?.remove();
    if (!chatStarted) { chatStarted = true; botSay('Hi there! 👋 Welcome to <b>Revitalize MedSpa</b>. How can I help you glow today?', ['Book an appointment', 'Pricing', 'Hours & location', 'Talk to a human']); }
  };
  $('#chatClose').onclick = () => chatBox.classList.remove('open');
  // keep the floating chat button from covering footer content on phones
  new IntersectionObserver(([en]) => {
    const hide = en.isIntersecting && innerWidth < 1024 && !chatBox.classList.contains('open');
    $('#chatToggle').classList.toggle('chat-hidden', hide);
  }, { rootMargin: '0px 0px -40% 0px' }).observe($('#contact'));
  wQuick.addEventListener('click', e => { if (e.target.classList.contains('quick')) handleChat(e.target.textContent); });
  wFeed.addEventListener('click', e => { if (e.target.classList.contains('chat-book')) chatBox.classList.remove('open'); });
  $('#widgetForm').addEventListener('submit', e => { e.preventDefault(); const v = $('#widgetInput').value.trim(); if (v) { $('#widgetInput').value = ''; handleChat(v); } });

  /* ---------- Social proof pop-ins ---------- */
  const proofs = [
    ['Sarah from Scottsdale', 'just booked a HydraFacial'],
    ['Emily from Tempe', 'claimed the $50 new-client offer'],
    ['Nicole from Phoenix', 'booked Botox for Saturday'],
    ['Olivia from Chandler', 'joined the Radiance membership'],
  ];
  let pi = 0;
  if (innerWidth >= 640) setTimeout(function loop() {
    const [who, what] = proofs[pi++ % proofs.length];
    toast(who, what + ' · Verified', 'ri-user-heart-fill', 'bg-rose-100 text-rose-600', 4500);
    setTimeout(loop, 22000);
  }, 9000);
})();
