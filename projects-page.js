// projects.html — filters, search, sort, grid/list view, URL state (?cat=app&q=...&sort=az&view=list)
(function(){
 const {$,$$,observe,toast,reduce}=window.PF2;const R=window.PF_RENDER;const data=window.PORTFOLIO_PROJECTS||[];
 const grid=$('#projectGrid'),empty=$('#projectEmpty'),count=$('#resultCount'),search=$('#ppSearch'),sort=$('#ppSort');
 const params=new URLSearchParams(location.search);
 const state={cat:params.get('cat')||'all',q:params.get('q')||'',sort:params.get('sort')||'default',view:params.get('view')||'grid'};
 const statusRank={'Live':0,'Working demo':1,'Completed':2,'Concept':3};
 // stats
 $('#statTotal').textContent=data.length;
 $('#statApp').textContent=data.filter(p=>p.category==='app').length;
 $('#statLive').textContent=data.filter(p=>p.status==='Live'||p.status==='Working demo').length;
 // filter button counts
 const counts=()=>$$('.filter[data-filter]').forEach(b=>{const f=b.dataset.filter;const n=f==='all'?data.length:f==='fav'?window.PF_FAVS.list().length:data.filter(p=>p.category===f).length;
  let s=b.querySelector('sup');if(!s){s=document.createElement('sup');s.style.opacity='.7';b.appendChild(s);}s.textContent=' '+n;});
 function list(){
  const q=state.q.trim().toLowerCase();
  let out=data.map((p,i)=>({p,i})).filter(({p})=>(state.cat==='all'||(state.cat==='fav'?window.PF_FAVS.has(p.id):p.category===state.cat))&&(!q||[p.title,p.desc,p.type,p.role,p.status,p.tools.join(' ')].join(' ').toLowerCase().includes(q)));
  if(state.sort==='az')out.sort((a,b)=>a.p.title.localeCompare(b.p.title));
  else if(state.sort==='status')out.sort((a,b)=>(statusRank[a.p.status]??9)-(statusRank[b.p.status]??9));
  return out;
 }
 function sync(){
  const u=new URLSearchParams();if(state.cat!=='all')u.set('cat',state.cat);if(state.q)u.set('q',state.q);if(state.sort!=='default')u.set('sort',state.sort);if(state.view!=='grid')u.set('view',state.view);
  const s=u.toString();try{history.replaceState(null,'',location.pathname+(s?'?'+s:''));}catch(_){}
 }
 function render(){
  const out=list();
  grid.classList.toggle('list-view',state.view==='list');
  grid.innerHTML=out.map(({p,i})=>R.renderCard(p,i,{tags:true})).join('');
  empty.classList.toggle('show',!out.length);
  empty.firstChild.textContent=state.cat==='fav'&&!state.q?'No saved projects yet — tap the ♡ on any project to save it. ':'No projects match that search. ';
  counts();
  count.textContent=out.length+' of '+data.length+' projects'+(state.q?' matching “'+state.q+'”':'');
  $$('.project-card',grid).forEach(c=>{
   const p=data.find(x=>x.id===c.dataset.id);
   c.tabIndex=0;c.setAttribute('role','link');c.setAttribute('aria-label','Open project: '+p.title);
   const h=document.createElement('span');h.className='open-hint';h.textContent='VIEW PROJECT ↗';c.appendChild(h);
   const open=()=>{location.href='project.html?id='+encodeURIComponent(p.id);};
   c.addEventListener('click',open);c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  });
  observe(grid);
  $$('.filter[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===state.cat));
  $$('.view-toggle button').forEach(b=>b.classList.toggle('active',b.dataset.view===state.view));
  sync();
 }
 $$('.filter[data-filter]').forEach(b=>b.addEventListener('click',()=>{state.cat=b.dataset.filter;render();}));
 search.value=state.q;sort.value=state.sort;
 search.addEventListener('input',()=>{state.q=search.value;render();});
 sort.addEventListener('change',()=>{state.sort=sort.value;render();});
 $$('.view-toggle button').forEach(b=>b.addEventListener('click',()=>{state.view=b.dataset.view;render();}));
 $('#resetFilters')?.addEventListener('click',()=>{state.cat='all';state.q='';state.sort='default';search.value='';sort.value='default';render();});
 document.addEventListener('keydown',e=>{
  if(e.key==='/'&&document.activeElement!==search&&!/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)){e.preventDefault();search.focus();}
  if(e.key==='Escape'&&document.activeElement===search){search.blur();}
 });
 window.addEventListener('favchange',()=>{if(state.cat==='fav')render();else counts();});
 render();
})();
