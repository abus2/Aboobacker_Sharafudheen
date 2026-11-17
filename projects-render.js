// Shared card renderer used by the home page, projects page and project-detail page.
(function(){
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const CAT={finance:'FINANCE',digital:'DIGITAL',creative:'DESIGN',app:'APP'};
 const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-');
 function renderCard(p,i,opts={}){
  const n=String(i+1).padStart(2,'0');
  const tags=opts.tags?`<div class="mini-tags">${p.tools.slice(0,3).map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:'';
  return `<article class="project-card glass-card reveal" data-category="${esc(p.category)}" data-id="${esc(p.id)}" data-status="${esc(p.status)}">`+
   `<div class="project-art ${esc(p.art)}"><span class="art-symbol">${esc(p.symbol)}</span><div class="${esc(p.pattern)}"></div><small>${CAT[p.category]||'WORK'} / ${n}</small>`+
   `<span class="badge ${slug(p.status)}"><i></i>${esc(p.status.toUpperCase())}</span><button type="button" class="fav" data-fav="${esc(p.id)}" aria-pressed="false" aria-label="Save project" title="Save project">♡</button></div>`+
   `<div class="project-info"><div><span class="project-type">${esc(p.type)}</span><h3>${esc(p.title)}</h3></div><span class="project-index">${n}</span><p>${esc(p.desc)}</p>${tags}</div></article>`;
 }
 window.PF_RENDER={renderCard,esc,slug,CAT};
})();
