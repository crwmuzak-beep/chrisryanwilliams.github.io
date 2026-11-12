/* ===== SITE ENGINE: builds header, nav, footer and every inner page from content/*.js =====
   Shared by all inner pages (index.html is the one-page home and has its own layout). */
var SITE = window.SITE || {};
SITE = Object.assign({name:"", email:"", social:[], shows:[], about:[], accomplishments:[], albums:[], collaborations:[], works:[], press:[]}, SITE);
/* Pages listed in the nav. albums / collaborations / works / press are still placeholders —
   add them back here once their content files are filled in. */
const PAGES = [["index.html","home"],["shows.html","shows"],["about.html","about"],["contact.html","contact"]];
  // ,["albums.html","albums"],["collaborations.html","collaborations"],["works.html","works"],["press.html","press"]
const $ = (s) => document.querySelector(s);
const h = (s) => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const link = (u, t) => u ? `<a href="${h(u)}" target="_blank" rel="noopener">${h(t)}</a>` : h(t);
const fmtDate = (d) => new Date(d + "T12:00:00").toLocaleDateString("en-US", {year:"numeric", month:"short", day:"numeric"});

function frame(page) {
  const cur = document.body.dataset.page;
  document.title = page + " · " + SITE.name;
  document.body.insertAdjacentHTML("afterbegin",
    `<header><a class="name" href="index.html">${h(SITE.name)}</a><nav>` +
    PAGES.map(([f, n]) => `<a href="${f}" class="${n === cur ? "on" : ""}">${n}</a>`).join("") +
    `</nav></header>`);
  document.body.insertAdjacentHTML("beforeend",
    `<footer>&copy; ${new Date().getFullYear()} ${h(SITE.name)}</footer>`);
}

const R = {
  shows() {
    const row = (s) => `<div class="item show"><div class="d">${fmtDate(s.date)}</div><div>
      <strong>${link(s.url, s.title)}</strong><br><span class="meta">${[s.venue, s.city].filter(Boolean).map(h).join(" · ")}</span>
      ${s.note ? `<div class="meta">${h(s.note)}</div>` : ""}</div></div>`;
    const all = SITE.shows.slice().sort((a, b) => b.date.localeCompare(a.date));
    const tagline = /\(Replace/.test(SITE.tagline || "") ? "" : SITE.tagline;   // hide the placeholder tagline
    return (SITE.photo ? `<img class="photo" src="${h(SITE.photo)}" alt="${h(SITE.name)}" onerror="this.remove()">` + (SITE.photoCredit ? `<p class="credit">${h(SITE.photoCredit)}</p>` : `<div style="height:1.5rem"></div>`) : "") +
      (tagline ? `<p class="hero">${h(tagline)}</p>` : "") + `<h1>Shows</h1>` +
      (all.length ? all.map(row).join("") : `<p class="empty">New dates coming soon.</p>`);
  },
  about() {
    return `<h1>About</h1>${SITE.about.map(p => `<p>${h(p)}</p>`).join("")}` +
      (SITE.accomplishments.length ? `<h2>Selected highlights</h2><ul>${SITE.accomplishments.map(a => `<li>${h(a)}</li>`).join("")}</ul>` : "");
  },
  albums() {
    return `<h1>Albums</h1>` + SITE.albums.map(a => `<div class="item"><strong>${h(a.title)}</strong> <span class="meta">${h(a.year)}</span>
      ${a.note ? `<div class="meta">${h(a.note)}</div>` : ""}
      ${a.embed ? `<div class="embed"><iframe src="${h(a.embed)}" height="${h(a.height || 152)}" loading="lazy" allow="encrypted-media"></iframe></div>` : ""}
      <div class="links">${(a.links || []).filter(l => l.url).map(l => link(l.url, l.label)).join("")}</div></div>`).join("");
  },
  collaborations() {
    return `<h1>Collaborations</h1>` + SITE.collaborations.map(c => `<div class="item"><strong>${link(c.url, c.name)}</strong>
      <span class="meta">${h(c.year)}</span><div>${h(c.note)}</div></div>`).join("");
  },
  works() {
    return `<h1>Works</h1>` + SITE.works.map(w => `<div class="item"><strong>${h(w.title)}</strong> <span class="meta">${h(w.year)}</span>
      ${w.note ? `<div class="meta">${h(w.note)}</div>` : ""}
      ${w.youtube ? `<div class="embed yt"><iframe src="https://www.youtube-nocookie.com/embed/${h(w.youtube)}" loading="lazy" allowfullscreen></iframe></div>` : ""}</div>`).join("");
  },
  press() {
    return `<h1>Press</h1>` + SITE.press.map(p => `<div class="item"><strong>${link(p.url, p.title)}</strong>
      <div class="meta">${h(p.outlet)} · ${h(p.year)}</div>${p.quote ? `<p><em>“${h(p.quote)}”</em></p>` : ""}</div>`).join("");
  },
  contact() {
    return `<h1>Contact</h1><p>Booking and inquiries:<br><a href="mailto:${h(SITE.email)}">${h(SITE.email)}</a></p>
      <div class="links">${SITE.social.map(s => link(s.url, s.label)).join("")}</div>`;
  }
};

const page = document.body.dataset.page;
frame(page);
$("main").innerHTML = R[page]();
