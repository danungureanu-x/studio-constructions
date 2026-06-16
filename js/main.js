// Mobile nav toggle
const toggle = document.querySelector('.nav__toggle');
const links  = document.querySelector('.nav__links');

toggle.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  links.classList.toggle('is-open', !expanded);
  document.body.style.overflow = expanded ? '' : 'hidden';
});

// Close nav when a link is clicked
links.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    links.classList.remove('is-open');
    document.body.style.overflow = '';
  });
});

// Scroll-reveal via IntersectionObserver
const revealEls = document.querySelectorAll(
  '.card, .project-card, .testimonial, .about__image, .about__stats, .contact__form'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach(el => observer.observe(el));

// Hero scroll zoom + crossfade
const heroBgExt   = document.querySelector('.hero__bg--exterior');
const heroBgInt   = document.querySelector('.hero__bg--interior');
const heroEl      = document.querySelector('.hero');
const heroContent = document.querySelector('.hero__content');

function onHeroScroll() {
  const animZone = heroEl.offsetHeight * 0.25;
  const progress = Math.min(1, Math.max(0, window.scrollY / animZone));

  heroBgExt.style.transform = `scale(${1 + progress * 0.55})`;

  const interiorOpacity = Math.min(1, Math.max(0, (progress - 0.15) / 0.70));
  heroBgInt.style.opacity = interiorOpacity;

  heroContent.style.opacity   = Math.max(0, 1 - progress * 2.5);
  heroContent.style.transform = `translateY(${-progress * 40}px)`;
}

window.addEventListener('scroll', onHeroScroll, { passive: true });

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Contact form submit (placeholder — wire up to a backend or service later)
document.querySelector('.contact__form').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Message sent!';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.disabled = false;
    e.target.reset();
  }, 3000);
});

/* --- Chat Widget --- */
(function () {
  const faqData = [
    {
      patterns: ['durata', 'cat timp', 'cand gata', 'cand termina', 'timeline', 'how long', 'duration', 'finish', 'complete', 'when ready', 'months', 'luni'],
      ro: 'O casă rezidențială standard durează între 8 și 14 luni, în funcție de complexitate și dimensiune. Renovările pot fi finalizate în 2–6 luni. Vă putem oferi un calendar detaliat după prima consultație.',
      en: 'A standard residential build typically takes 8–14 months, depending on size and complexity. Renovations can be completed in 2–6 months. We can provide a detailed timeline after an initial consultation.'
    },
    {
      patterns: ['servicii', 'ce faceti', 'ce oferiti', 'renovare', 'extindere', 'constructie rezidentiala', 'project management', 'services', 'what do you do', 'what you offer', 'renovation', 'extension'],
      ro: 'Oferim trei servicii principale:\n• Construcție Rezidențială — case noi, de la zero\n• Renovări & Extinderi — transformarea spațiilor existente\n• Management de Proiect — coordonăm arhitecți, ingineri și meșteri\nDoriți detalii despre un serviciu anume?',
      en: 'We offer three main services:\n• Residential Construction — new builds from the ground up\n• Renovations & Extensions — transforming existing spaces\n• Project Management — coordinating architects, engineers, and tradespeople\nWould you like details on a specific service?'
    },
    {
      patterns: ['pret', 'cost', 'cat costa', 'buget', 'tarif', 'oferta', 'deviz', 'price', 'how much', 'budget', 'quote', 'estimate'],
      ro: 'Prețurile variază în funcție de dimensiunea și complexitatea proiectului. Oferim consultații și devize gratuite, fără nicio obligație. Completați <a href="#contact">formularul de contact</a> sau sunați la +40 721 000 000.',
      en: 'Pricing varies by size and complexity. We offer free, no-obligation consultations and quotes. Fill in the <a href="#contact">contact form</a> or call us at +40 721 000 000.'
    },
    {
      patterns: ['contact', 'telefon', 'suna', 'email', 'adresa', 'phone', 'call', 'reach', 'get in touch'],
      ro: 'Ne puteți contacta prin:\n• Telefon: +40 721 000 000\n• Email: contact@studioconstructions.ro\n• <a href="#contact">Formularul de pe site</a>\nRăspundem în cel mult o zi lucrătoare.',
      en: 'You can reach us via:\n• Phone: +40 721 000 000\n• Email: contact@studioconstructions.ro\n• <a href="#contact">Contact form on this page</a>\nWe reply within one business day.'
    },
    {
      patterns: ['adresa', 'locatie', 'unde', 'bucuresti', 'oras', 'address', 'location', 'where', 'bucharest', 'city'],
      ro: 'Suntem localizați la Str. Constructorilor 14, București, România. Construim în București și în zonele limitrofe.',
      en: 'We are located at Str. Constructorilor 14, Bucharest, Romania. We build in Bucharest and surrounding areas.'
    },
    {
      patterns: ['experienta', 'ani', 'proiecte', 'referinte', 'portofoliu', 'cate case', 'history', 'experience', 'years', 'portfolio', 'how many', 'since when', 'founded'],
      ro: 'Studio Constructions a fost fondată în 2005. În cei 20+ ani de activitate am construit peste 350 de case, cu o rată de satisfacție a clienților de 98%. Vedeți <a href="#projects">portofoliul nostru</a>.',
      en: 'Studio Constructions was founded in 2005. In 20+ years we have built over 350 homes, with a 98% client satisfaction rate. See our <a href="#projects">portfolio</a>.'
    },
    {
      patterns: ['garantie', 'calitate', 'materiale', 'durabil', 'warranty', 'guarantee', 'quality', 'materials', 'durable', 'standard'],
      ro: 'Lucrăm exclusiv cu materiale de calitate superioară și respectăm toate standardele de construcție din România. Toate proiectele beneficiază de garanție legală și suport post-construcție.',
      en: 'We use high-quality materials and comply with all Romanian construction standards. All projects come with a legal warranty and post-construction support.'
    },
    {
      patterns: ['program', 'orar', 'disponibil', 'luni vineri', 'weekend', 'hours', 'schedule', 'available', 'open', 'working hours'],
      ro: 'Biroul nostru este deschis Luni–Vineri, 09:00–18:00. Acest asistent este disponibil 24/7. Pentru urgențe: +40 721 000 000.',
      en: 'Our office is open Monday–Friday, 09:00–18:00. This assistant is available 24/7. For urgent matters: +40 721 000 000.'
    },
    {
      patterns: ['proces', 'etape', 'cum functioneaza', 'pasi', 'inceput', 'process', 'steps', 'how does it work', 'how it works', 'start', 'begin'],
      ro: 'Procesul nostru are 4 etape:\n1. Consultație gratuită — înțelegem nevoile dvs.\n2. Proiectare & deviz — plan detaliat și costuri\n3. Execuție — construcție sau renovare\n4. Predare & garanție — cheile și documentele finale',
      en: 'Our process has 4 stages:\n1. Free consultation — we understand your needs\n2. Design & quote — detailed plan and costs\n3. Execution — construction or renovation\n4. Handover & warranty — keys and final documents'
    },
    {
      patterns: ['permis', 'autorizatie', 'documentatie', 'acte', 'birocratie', 'permit', 'authorization', 'documents', 'paperwork', 'legal'],
      ro: 'Da, ne ocupăm de toată documentația necesară: autorizații de construire, avize și expertize tehnice. Dvs. nu trebuie să vă ocupați de birocrație — noi gestionăm totul.',
      en: 'Yes, we handle all necessary documentation: building permits, approvals, and technical certifications. You don\'t need to deal with bureaucracy — we manage everything.'
    },
  ];

  const enWords = new Set(['the', 'is', 'are', 'how', 'what', 'do', 'you', 'can', 'i', 'we', 'long', 'much', 'does', 'have', 'your', 'for', 'get', 'build', 'house', 'home', 'where', 'when', 'which', 'tell', 'about', 'help', 'need', 'want']);

  function normalize(str) {
    return str.toLowerCase()
      .replace(/[ăâ]/g, 'a')
      .replace(/[îí]/g, 'i')
      .replace(/[șş]/g, 's')
      .replace(/[țţ]/g, 't')
      .replace(/é/g, 'e');
  }

  function detectLang(input) {
    const words = input.toLowerCase().split(/\s+/);
    const enCount = words.filter(w => enWords.has(w)).length;
    return enCount / words.length > 0.3 ? 'en' : 'ro';
  }

  function getAnswer(input) {
    const norm = normalize(input);
    const lang = detectLang(input);
    for (const item of faqData) {
      if (item.patterns.some(p => norm.includes(normalize(p)))) {
        return item[lang];
      }
    }
    return lang === 'en'
      ? 'I don\'t have an answer for that, but our team is happy to help. Contact us at <a href="mailto:contact@studioconstructions.ro">contact@studioconstructions.ro</a>, call +40 721 000 000, or use the <a href="#contact">contact form</a>.'
      : 'Nu am un răspuns la această întrebare, dar echipa noastră vă stă la dispoziție. Contactați-ne la <a href="mailto:contact@studioconstructions.ro">contact@studioconstructions.ro</a>, la +40 721 000 000, sau folosiți <a href="#contact">formularul de contact</a>.';
  }

  const toggleBtn  = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const closeBtn   = chatWindow.querySelector('.chat__close');
  const messagesEl = document.getElementById('chat-messages');
  const input      = document.getElementById('chat-input');
  const sendBtn    = document.getElementById('chat-send');

  function appendMsg(html, type) {
    const div = document.createElement('div');
    div.className = 'chat__msg chat__msg--' + type;
    div.innerHTML = html.replace(/\n/g, '<br>');
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function botReply(userText) {
    const typing = appendMsg('&bull; &bull; &bull;', 'bot chat__msg--typing');
    setTimeout(() => {
      typing.remove();
      appendMsg(getAnswer(userText), 'bot');
    }, 650);
  }

  function openChat() {
    chatWindow.hidden = false;
    toggleBtn.setAttribute('aria-expanded', 'true');
    input.focus();
    if (messagesEl.children.length === 0) {
      appendMsg('Bună ziua! Sunt asistentul Studio Constructions. Cu ce vă pot ajuta?<br><small style="opacity:.75">Hello! I\'m the Studio Constructions assistant. How can I help?</small>', 'bot');
    }
  }

  function closeChat() {
    chatWindow.hidden = true;
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', () => {
    chatWindow.hidden ? openChat() : closeChat();
  });
  closeBtn.addEventListener('click', closeChat);

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    appendMsg(text, 'user');
    input.value = '';
    botReply(text);
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
})();

/* --- Gooey Text Morph --- */
(function initGooeyText() {
  const texts   = ['Construim', 'Renovăm', 'Proiectăm', 'Finisăm'];
  const MORPH   = 1.0;
  const COOL    = 0.35;
  const t1 = document.getElementById('gooey-t1');
  const t2 = document.getElementById('gooey-t2');
  if (!t1 || !t2) return;

  let idx      = texts.length - 1;
  let morph    = 0;
  let cooldown = COOL;
  let last     = performance.now();

  t1.textContent = texts[idx % texts.length];
  t2.textContent = texts[(idx + 1) % texts.length];

  function setMorph(f) {
    t2.style.filter  = `blur(${Math.min(8 / f - 8, 100)}px)`;
    t2.style.opacity = `${Math.pow(f, 0.4) * 100}%`;
    const g = 1 - f;
    t1.style.filter  = `blur(${Math.min(8 / g - 8, 100)}px)`;
    t1.style.opacity = `${Math.pow(g, 0.4) * 100}%`;
  }

  function doCooldown() {
    morph = 0;
    t2.style.filter = t1.style.filter = '';
    t2.style.opacity = '100%';
    t1.style.opacity = '0%';
  }

  function tick(now) {
    requestAnimationFrame(tick);
    const dt       = (now - last) / 1000;
    last           = now;
    const wasCool  = cooldown > 0;
    cooldown      -= dt;
    if (cooldown <= 0) {
      if (wasCool) {
        idx = (idx + 1) % texts.length;
        t1.textContent = texts[idx % texts.length];
        t2.textContent = texts[(idx + 1) % texts.length];
      }
      morph   -= cooldown;
      cooldown = 0;
      let f    = morph / MORPH;
      if (f > 1) { cooldown = COOL; f = 1; }
      setMorph(f);
    } else {
      doCooldown();
    }
  }

  requestAnimationFrame(tick);
})();
