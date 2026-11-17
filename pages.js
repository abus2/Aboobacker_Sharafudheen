// V28 — shared behaviour: light/dark theme, sub-page core (loader, nav, progress, reveal), toast.
(function(){
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const isHome=document.body.dataset.page==='home';

 // ---- toast (works on every page) ----
 let toastEl=$('#toast'),tt;
 function toast(m){if(!toastEl)return;toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('show'),2600);}

 // ---- theme toggle ----
 const root=document.documentElement;
 function applyTheme(t){root.dataset.theme=t;const m=$('meta[name="theme-color"]');if(m)m.content=t==='light'?'#f3f6ff':'#050d24';
  const b=$('#themeToggle');if(b){b.textContent=t==='light'?'☾':'☀';b.setAttribute('aria-label',t==='light'?'Switch to dark theme':'Switch to light theme');b.title=b.getAttribute('aria-label');}}
 let saved=null;try{saved=localStorage.getItem('aboo-theme');}catch(_){}
 const nav=$('#nav');
 if(nav&&!$('#themeToggle')){const b=document.createElement('button');b.type='button';b.id='themeToggle';b.className='theme-toggle';nav.appendChild(b);
  b.addEventListener('click',()=>{const n=root.dataset.theme==='light'?'dark':'light';applyTheme(n);try{localStorage.setItem('aboo-theme',n);}catch(_){}toast(n==='light'?'Light theme on':'Dark theme on');});}
 applyTheme(saved||root.dataset.theme||'dark');

 // press D to toggle theme (not while typing)
 document.addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return;const t=e.target;
  if(t&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable))return;
  if($('.modal.is-open,.palette.is-open'))return;
  if(e.key.toLowerCase()==='d')$('#themeToggle')?.click();
 });

 // ---- footer year ----
 const yr=$('#year');if(yr&&!yr.textContent)yr.textContent=new Date().getFullYear();


 // ---- saved (favourite) projects ----
 const FKEY='aboo-favs';
 const favSet=()=>{try{const a=JSON.parse(localStorage.getItem(FKEY)||'[]');return new Set(Array.isArray(a)?a:[]);}catch(_){return new Set();}};
 window.PF_FAVS={has:id=>favSet().has(id),list:()=>[...favSet()],
  toggle(id){const s=favSet();s.has(id)?s.delete(id):s.add(id);try{localStorage.setItem(FKEY,JSON.stringify([...s]));}catch(_){}return s.has(id);}};
 function paintFavs(){const s=favSet();$$('.fav').forEach(b=>{const on=s.has(b.dataset.fav),sym=on?'♥':'♡',lab=on?'Remove from saved':'Save project';if(b.textContent===sym&&b.classList.contains('on')===on)return;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);b.textContent=sym;b.title=lab;b.setAttribute('aria-label',lab);});}
 document.addEventListener('click',e=>{
  const b=e.target.closest?.('.fav');if(!b)return;
  e.preventDefault();e.stopPropagation();
  const on=window.PF_FAVS.toggle(b.dataset.fav);paintFavs();toast(on?'Saved ♥':'Removed from saved');
  window.dispatchEvent(new Event('favchange'));
 },true);
 document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest?.('.fav'))e.stopPropagation();},true);
 new MutationObserver(()=>paintFavs()).observe(document.body,{childList:true,subtree:true});
 paintFavs();

 window.PF2={$,$$,toast,reduce};
 if(isHome){
  // palette commands for the new pages + theme
  const pf=window.__pf;
  if(pf&&pf.commands){
   pf.commands.push(
    {icon:'▦',label:'Open all projects page',hint:'PAGE',run:()=>{location.href='projects.html';}},
    {icon:'₹',label:'Open apps page',hint:'PAGE',run:()=>{location.href='apps.html';}},
    {icon:'▤',label:'Tally Prime accounts',hint:'PAGE',run:()=>{location.href='tally.html';}},
    {icon:'✦',label:'Certificates page',hint:'PAGE',run:()=>{location.href='certificates.html';}},
    {icon:'%',label:'GST calculator',hint:'APP',run:()=>{location.href='apps.html#gst';}},
    {icon:'₹',label:'EMI calculator',hint:'APP',run:()=>{location.href='apps.html#emi';}},
    {icon:'◐',label:'Toggle light / dark theme',hint:'ACTION',run:()=>$('#themeToggle')?.click()},
    ...(window.PORTFOLIO_PROJECTS||[]).map(p=>({icon:'◆',label:'Project: '+p.title,hint:'PROJECT',run:()=>{location.href='project.html?id='+encodeURIComponent(p.id);}}))
   );
  }
  // page shortcuts
  const goto={g:'projects.html',a:'apps.html'};
  document.addEventListener('keydown',e=>{
   if(e.ctrlKey||e.metaKey||e.altKey)return;const t=e.target;
   if(t&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable))return;
   if($('.modal.is-open,.palette.is-open'))return;
   const k=e.key.toLowerCase();if(goto[k])location.href=goto[k];
  });
  // ?topic=... from other pages pre-fills the contact form
  const topic=new URLSearchParams(location.search).get('topic');
  if(topic){
   const sel=$('#cfTopic'),msg=$('#cfMessage');
   if(sel){const o=[...sel.options].find(x=>x.textContent===topic);if(o)sel.value=o.value||o.textContent;}
   if(msg&&!o_is_option(sel,topic)){msg.value=topic+' — ';msg.dispatchEvent(new Event('input'));}
   setTimeout(()=>{$('#contact')?.scrollIntoView({behavior:reduce?'auto':'smooth'});},500);
  }
  function o_is_option(sel,t){return !!(sel&&[...sel.options].find(x=>x.textContent===t));}
  return;
 }

 // ================= sub-page core =================
 window.addEventListener('load',()=>setTimeout(()=>$('#loader')?.classList.add('done'),350));
 setTimeout(()=>$('#loader')?.classList.add('done'),1800);
 $('#menuToggle')?.addEventListener('click',()=>nav.classList.toggle('open'));
 $$('.nav-link').forEach(l=>l.addEventListener('click',()=>nav.classList.remove('open')));
 const prog=$('#scrollProgress'),header=$('.site-header'),back=$('#backTop');
 function onScroll(){const max=document.documentElement.scrollHeight-innerHeight;if(prog)prog.style.width=(max>0?scrollY/max*100:0)+'%';
  header?.classList.toggle('scrolled',scrollY>30);back?.classList.toggle('show',scrollY>500);}
 addEventListener('scroll',onScroll,{passive:true});onScroll();
 back?.addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'}));
 // reveal helper (also used for dynamically added cards)
 const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}}),{threshold:.1});
 window.PF2.observe=(root=document)=>$$('.reveal:not(.visible)',root).forEach(el=>obs.observe(el));
 window.PF2.observe();
 // keyboard shortcuts for sub-pages
 const goto={h:'index.html',p:'projects.html',a:'apps.html'};
 document.addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return;const t=e.target;
  if(t&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable))return;
  const k=e.key.toLowerCase();
  if(goto[k]&&!(location.pathname.endsWith(goto[k])))location.href=goto[k];
  else if(k==='t')scrollTo({top:0,behavior:reduce?'auto':'smooth'});
 });

 // ---- quick navigation palette (Ctrl+K) on sub-pages ----
 (function(){
  const wrap=document.createElement('div');wrap.className='palette';wrap.id='palette';wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-label','Quick navigation');wrap.setAttribute('aria-hidden','true');
  wrap.innerHTML='<div class="modal-backdrop" data-close></div><div class="palette-box"><div class="palette-input"><span>⌕</span><input id="paletteInput" type="text" placeholder="Jump to a page, project or tool…" autocomplete="off" aria-label="Search commands"><kbd>Esc</kbd></div><ul class="palette-list" id="paletteList" role="listbox"></ul><div class="palette-foot"><span>↑↓ navigate</span><span>↵ select</span><span>Ctrl K toggle</span></div></div>';
  document.body.appendChild(wrap);
  const pin=$('#paletteInput',wrap),list=$('#paletteList',wrap);
  const go=u=>()=>{location.href=u;};
  const cmds=[
   {icon:'⌂',label:'Home',hint:'PAGE',run:go('index.html')},{icon:'▦',label:'All projects',hint:'PAGE',run:go('projects.html')},{icon:'₹',label:'Apps',hint:'PAGE',run:go('apps.html')},{icon:'₹',label:'Tally Prime (working accounts)',hint:'PAGE',run:go('tally.html')},{icon:'✦',label:'Certificates',hint:'PAGE',run:go('certificates.html')},{icon:'✉',label:'Contact',hint:'PAGE',run:go('index.html#contact')},
   ...['gst:GST calculator','emi:EMI calculator','sip:SIP growth planner','budget:Budget tracker','profit:Profit & margin','fd:FD / RD maturity','breakeven:Break-even calculator','percent:Percentage calculator','interest:Interest calculator','age:Age calculator','bmi:BMI calculator','split:Bill split & tip','units:Unit converter','tally:Accounts book (Tally-style)','invoice:Invoice generator','stock:Stock register','trip:Trip fuel cost','hike:Salary hike','datediff:Date difference','eligibility:Loan eligibility','inflation:Inflation calculator','grade:Marks & grade','cagr:CAGR calculator','dep:Depreciation calculator','ratio:Financial ratio analysis','words:Amount in words (₹)','amort:Loan amortization schedule','discount:Discount calculator','marketing:Ad campaign metrics','utm:UTM link builder','wordcount:Word & character counter'].map(x=>{const [id,l]=x.split(':');return{icon:'%',label:l,hint:'APP',run:go('apps.html#'+id)};}),
   ...(window.PORTFOLIO_PROJECTS||[]).map(p=>({icon:'◆',label:'Project: '+p.title,hint:'PROJECT',run:go('project.html?id='+encodeURIComponent(p.id))})),
   {icon:'◐',label:'Toggle light / dark theme',hint:'ACTION',run:()=>$('#themeToggle')?.click()},
   {icon:'↑',label:'Scroll to top',hint:'ACTION',run:()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'})}
  ];
  let shown=[],sel=0;
  const isOpen=()=>wrap.classList.contains('is-open');
  const close=()=>{wrap.classList.remove('is-open');wrap.setAttribute('aria-hidden','true');document.body.style.overflow='';};
  function render(){
   const q=pin.value.trim().toLowerCase();shown=cmds.filter(c=>c.label.toLowerCase().includes(q));sel=Math.min(sel,Math.max(shown.length-1,0));list.replaceChildren();
   if(!shown.length){const li=document.createElement('li');li.className='palette-empty';li.textContent='No matching commands';list.appendChild(li);return;}
   shown.forEach((c,i)=>{const li=document.createElement('li');li.setAttribute('role','option');if(i===sel)li.classList.add('active');
    const ic=document.createElement('i');ic.textContent=c.icon;const t=document.createElement('span');t.textContent=c.label;const h=document.createElement('small');h.textContent=c.hint;li.append(ic,t,h);
    li.addEventListener('click',()=>{close();setTimeout(c.run,60);});list.appendChild(li);});
  }
  function open(){pin.value='';sel=0;render();wrap.classList.add('is-open');wrap.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(()=>pin.focus(),60);}
  $('[data-close]',wrap).addEventListener('click',close);
  pin.addEventListener('input',()=>{sel=0;render();});
  pin.addEventListener('keydown',e=>{
   if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!shown.length)return;sel=(sel+(e.key==='ArrowDown'?1:-1)+shown.length)%shown.length;render();$('li.active',list)?.scrollIntoView({block:'nearest'});}
   else if(e.key==='Enter'&&shown[sel]){e.preventDefault();const c=shown[sel];close();setTimeout(c.run,60);}
  });
  document.addEventListener('keydown',e=>{
   if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();isOpen()?close():open();}
   else if(e.key==='Escape'&&isOpen())close();
  });
  const btn=document.createElement('button');btn.type='button';btn.className='nav-search';btn.innerHTML='<span>⌕</span> Quick nav <kbd>Ctrl K</kbd>';btn.addEventListener('click',()=>{nav.classList.remove('open');open();});
  nav.insertBefore(btn,$('#themeToggle'));
 })();
})();
