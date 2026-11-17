// project.html?id=... — full detail page for one project
(function(){
 const {$,$$,observe,toast}=window.PF2;const R=window.PF_RENDER,esc=R.esc;const data=window.PORTFOLIO_PROJECTS||[];
 const id=new URLSearchParams(location.search).get('id');
 const idx=data.findIndex(p=>p.id===id);const host=$('#pd');
 if(idx<0){
  host.innerHTML='<div class="pd-card glass-card" style="text-align:center;padding:50px 24px"><h2>Project not found</h2><p style="color:#a9b8de;margin:10px 0 22px">That project link doesn’t exist (yet).</p><a class="button button-primary" href="projects.html">See all projects <span>↗</span></a></div>';
  document.title='Project not found | Aboobacker Sharfudheen';return;
 }
 const p=data[idx],prev=data[(idx-1+data.length)%data.length],next=data[(idx+1)%data.length];
 document.title=p.title+' | Aboobacker Sharfudheen';
 const dm=document.querySelector('meta[name="description"]');if(dm)dm.content=p.desc;
 const n=String(idx+1).padStart(2,'0');
 const where=p.category==='app'?['apps.html#'+p.id.replace('app-',''),'Try the app']:null;
 const primary=p.link?`<a class="button button-primary" href="${esc(p.link)}">${esc(p.linkLabel||'Open')} <span>↗</span></a>`:(where?`<a class="button button-primary" href="${esc(where[0])}">${where[1]} <span>↗</span></a>`:'');
 const related=data.filter(x=>x.id!==p.id&&x.category===p.category).concat(data.filter(x=>x.id!==p.id&&x.category!==p.category)).slice(0,3);
 host.innerHTML=
 `<div class="pd-hero reveal"><div class="pd-title"><small>${esc(p.type)} · ${n}</small><h1>${esc(p.title)}</h1><p>${esc(p.desc)}</p>`+
 `<div class="pd-actions">${primary}<button type="button" class="button button-ghost" id="pdDiscuss">Discuss this project</button><button type="button" class="button button-ghost" id="pdShare">Share link ⧉</button></div></div>`+
 `<div class="pd-art glass-card ${esc(p.art)}"><span class="art-symbol">${esc(p.symbol)}</span><div class="${esc(p.pattern)}"></div><span class="badge ${R.slug(p.status)}"><i></i>${esc(p.status.toUpperCase())}</span></div></div>`+
 `<div class="pd-grid reveal"><div><small>MY ROLE</small><strong>${esc(p.role)}</strong></div><div><small>CATEGORY</small><strong>${esc(p.category.charAt(0).toUpperCase()+p.category.slice(1))}</strong></div><div><small>STATUS</small><strong>${esc(p.status)}</strong></div><div><small>YEAR</small><strong>${esc(p.year||'—')}</strong></div></div>`+
 `<div class="pd-cols reveal"><div class="pd-card glass-card"><h2>Key takeaways</h2><ul>${p.points.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`+
 `<div class="pd-card glass-card"><h2>Tools &amp; skills</h2><div class="tag-list" style="margin-top:0">${p.tools.map(t=>`<span>${esc(t)}</span>`).join('')}</div></div></div>`+
 `<div class="pd-nav reveal"><a class="button button-ghost" href="project.html?id=${encodeURIComponent(prev.id)}">← ${esc(prev.title)}</a><a class="button button-ghost" href="project.html?id=${encodeURIComponent(next.id)}">${esc(next.title)} →</a></div>`+
 `<div class="pd-related"><h2>More work</h2><div class="project-grid" id="relGrid">${related.map(x=>R.renderCard(x,data.indexOf(x))).join('')}</div></div>`;
 $('#crumbTitle').textContent=p.title;
 $$('#relGrid .project-card').forEach(c=>{c.tabIndex=0;c.setAttribute('role','link');const go=()=>location.href='project.html?id='+encodeURIComponent(c.dataset.id);c.addEventListener('click',go);c.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go();}});});
 $('#pdShare').addEventListener('click',async()=>{
  const url=location.href;
  try{if(navigator.share){await navigator.share({title:document.title,url});return;}}catch(e){if(e&&e.name==='AbortError')return;}
  try{await navigator.clipboard.writeText(url);toast('Project link copied ✓');}catch(_){toast(url);}
 });
 $('#pdDiscuss').addEventListener('click',()=>{location.href='index.html?topic='+encodeURIComponent('Project: '+p.title)+'#contact';});
 observe();
 document.addEventListener('keydown',e=>{if(/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))return;
  if(e.key==='ArrowLeft')location.href='project.html?id='+encodeURIComponent(prev.id);
  if(e.key==='ArrowRight')location.href='project.html?id='+encodeURIComponent(next.id);});
})();
