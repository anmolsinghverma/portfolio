// All dynamic text uses textContent / createElement, so API data can never inject HTML.
const $ = (sel) => document.querySelector(sel);
const h = (tag, attrs = {}, ...kids) => {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => (v != null && v !== false) && n.setAttribute(k, v));
  n.append(...kids);
  return n;
};
const api = async (path) => {
  const res = await fetch(`/api/${path}`);
  const body = await res.json();
  if (!res.ok) throw new Error(body.errors?.[0]?.message || 'Request failed');
  return body.data;
};
const safeUrl = (u) => (/^https?:\/\//i.test(u || '') ? u : null);
const ext = (label, url) => url && safeUrl(url) && h('a', { href: url, target: '_blank', rel: 'noopener noreferrer' }, label);

function renderProfile(p) {
  document.title = `${p.name} · ${p.title}`;
  $('#name').textContent = p.name;
  $('#title').textContent = p.title;
  $('#bio').textContent = p.bio;
  $('#footer-name').textContent = `${p.name}${p.location ? ', ' + p.location : ''}`;
  const s = p.socials || {};
  $('#socials').replaceChildren(
    ...[ext('GitHub', s.github), ext('LinkedIn', s.linkedin), ext('Résumé', s.resume),
        p.email && h('a', { href: `mailto:${p.email}` }, p.email)].filter(Boolean));
}

function renderProjects(list) {
  $('#project-list').replaceChildren(...list.map((p) => h('article', { class: 'row' },
    h('h3', {}, p.title),
    h('p', {}, p.summary),
    h('ul', { class: 'stack' }, ...(p.stack || []).map((t) => h('li', {}, t))),
    h('p', { class: 'links' }, ...[ext('Source', p.repoUrl), ext('Live site', p.liveUrl)].filter(Boolean)),
  )));
}

function renderSkills(list) {
  const groups = list.reduce((m, s) => ((m[s.category] ||= []).push(s), m), {});
  $('#skill-groups').replaceChildren(...Object.entries(groups).map(([cat, items]) =>
    h('div', {}, h('h3', {}, cat), h('ul', {}, ...items.map((s) =>
      h('li', {}, h('span', {}, s.name),
        h('span', { class: 'dots', role: 'img', 'aria-label': `${s.level} of 5` },
          ...[1, 2, 3, 4, 5].map((i) => h('i', { class: i <= s.level ? 'on' : '' })))))))));
}

(async () => {
  try {
    const [p, projects, skills] = await Promise.all([api('profile'), api('projects'), api('skills')]);
    renderProfile(p); renderProjects(projects); renderSkills(skills);
  } catch (e) {
    $('#name').textContent = 'Portfolio unavailable';
    $('#bio').textContent = `${e.message}. If this is a fresh install, run "npm run seed".`;
  }
})();

// Contact form
const form = $('#contact-form');
const status = $('#form-status');
const setStatus = (msg, cls) => { status.textContent = msg; status.className = cls || ''; };

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  form.querySelectorAll('.err').forEach((n) => (n.textContent = ''));
  form.querySelectorAll('[aria-invalid]').forEach((n) => n.removeAttribute('aria-invalid'));
  const btn = form.querySelector('button');
  btn.disabled = true; setStatus('Sending…');
  try {
    const res = await fetch('/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const body = await res.json();
    if (res.ok) { form.reset(); setStatus('Message sent. I will reply by email.', 'ok'); return; }
    (body.errors || []).forEach((er) => {
      const slot = er.field && form.querySelector(`.err[data-for="${er.field}"]`);
      if (slot) { slot.textContent = er.message; form.elements[er.field]?.setAttribute('aria-invalid', 'true'); }
    });
    setStatus(body.errors?.some((x) => x.field) ? 'Fix the highlighted fields.' : body.errors?.[0]?.message || 'Could not send.', 'bad');
  } catch {
    setStatus('Network error. Check your connection and try again.', 'bad');
  } finally {
    btn.disabled = false;
  }
});
