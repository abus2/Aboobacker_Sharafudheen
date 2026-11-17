// V26 — new features: stats counters, marquee, project details, resume, contact form,
// quick-navigation command palette, side dots, IST clock, toasts, magnetic buttons.
(function(){
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const fine=matchMedia('(pointer:fine)').matches;

 // ====== EDIT THESE ======
 const OWNER_EMAIL='your.email@example.com';   // <- put your real email here
 const PROJECTS=window.PORTFOLIO_PROJECTS||[];   // edit projects-data.js
 // ========================

 // Toast
 const toastEl=$('#toast');let toastTimer;
 function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove('show'),2600);}

 // Email placeholders follow OWNER_EMAIL
 $$('a[href^="mailto:"]').forEach(a=>{a.href='mailto:'+OWNER_EMAIL;if(a.textContent.includes('@'))a.textContent=OWNER_EMAIL+' ↗';});
 $('#rsEmail')&&($('#rsEmail').textContent=OWNER_EMAIL);

 // Marquee: duplicate content for a seamless loop
 const track=$('#marqueeTrack');
 if(track)track.innerHTML+=track.innerHTML;

 // Count-up stats
 const counters=$$('[data-count]');
 const countObs=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;countObs.unobserve(e.target);
  const el=e.target,end=+el.dataset.count;
  if(reduce){el.textContent=end;return;}
  const t0=performance.now(),dur=1400;
  (function tick(t){const p=Math.min((t-t0)/dur,1),eased=1-Math.pow(1-p,3);el.textContent=Math.round(end*eased);if(p<1)requestAnimationFrame(tick);})(t0);
 }),{threshold:.6});
 counters.forEach(c=>countObs.observe(c));

 // Live IST clock
 const clock=$('#istClock');
 function tickClock(){if(!clock)return;clock.textContent=new Intl.DateTimeFormat('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true,timeZone:'Asia/Kolkata'}).format(new Date()).toUpperCase();}
 tickClock();setInterval(tickClock,15000);

 // Copy email
 $('#copyEmail')?.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(OWNER_EMAIL);toast('Email address copied ✓');}
  catch(_){toast(OWNER_EMAIL);}
 });

 // ----- Modal helper -----
 let lastFocus=null;
 function openModal(m){lastFocus=document.activeElement;m.classList.add('is-open');m.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  setTimeout(()=>$('button, input',m)?.focus(),60);}
 function closeModal(m){m.classList.remove('is-open');m.setAttribute('aria-hidden','true');
  if(!$('.modal.is-open,.palette.is-open')){document.body.style.overflow='';}
  lastFocus?.focus?.();}
 $$('.modal,.palette').forEach(m=>$$('[data-close]',m).forEach(b=>b.addEventListener('click',()=>closeModal(m))));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const o=$('.modal.is-open,.palette.is-open');if(o)closeModal(o);}});

 // ----- Project detail modal -----
 const pm=$('#projectModal');let pmIndex=0;
 const cards=$$('.project-card');
 function showProject(i){
  pmIndex=(i+cards.length)%cards.length;const c=cards[pmIndex],d=PROJECTS.find(p=>p.id===c.dataset.id)||PROJECTS[pmIndex]||{role:'',tools:[],points:[]};
  $('#pmType').textContent=$('.project-type',c).textContent;
  $('#pmTitle').textContent=$('h3',c).textContent;
  $('#pmDesc').textContent=$('.project-info p',c).textContent;
  $('#pmSymbol').textContent=$('.art-symbol',c).textContent;
  const full=$('#pmFull');if(full)full.href='project.html?id='+encodeURIComponent(c.dataset.id);
  $('#pmRole').textContent=d.role;
  $('#pmTools').replaceChildren(...d.tools.map(t=>{const s=document.createElement('span');s.textContent=t;return s;}));
  $('#pmPoints').replaceChildren(...d.points.map(t=>{const l=document.createElement('li');l.textContent=t;return l;}));
 }
 cards.forEach((c,i)=>{
  c.tabIndex=0;c.setAttribute('role','button');c.setAttribute('aria-label','Open details: '+$('h3',c).textContent);
  const hint=document.createElement('span');hint.className='open-hint';hint.textContent='VIEW DETAILS ↗';c.appendChild(hint);
  const open=()=>{showProject(i);openModal(pm);};
  c.addEventListener('click',open);
  c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
 });
 $('#pmNext')?.addEventListener('click',()=>showProject(pmIndex+1));
 $('#pmDiscuss')?.addEventListener('click',()=>{closeModal(pm);setTopic('General enquiry','Project: '+$('#pmTitle').textContent);});

 // ----- Resume -----
 const rm=$('#resumeModal');
 $$('[data-open-resume]').forEach(b=>b.addEventListener('click',()=>openModal(rm)));
 $('#resumePrint')?.addEventListener('click',()=>window.print());

 // ----- Contact form -----
 const form=$('#contactForm');
 function setTopic(topic,prefill){
  const sel=$('#cfTopic');if(sel){[...sel.options].forEach(o=>{if(o.textContent===topic)sel.value=o.value||o.textContent;});}
  if(prefill&&!$('#cfMessage').value)$('#cfMessage').value=prefill+' — ';
  $('#cfMessage')?.dispatchEvent(new Event('input'));
  form?.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});
  setTimeout(()=>$('#cfName')?.focus({preventScroll:true}),500);
 }
 $$('.service-ask').forEach(b=>b.addEventListener('click',()=>setTopic(b.dataset.topic)));
 const msg=$('#cfMessage'),count=$('#cfCount');
 msg?.addEventListener('input',()=>count.textContent=msg.value.length+' / 500');
 form?.addEventListener('submit',e=>{
  e.preventDefault();const err=$('#cfError');err.textContent='';
  $$('.field',form).forEach(f=>f.classList.remove('invalid'));
  const name=$('#cfName'),email=$('#cfEmail'),topic=$('#cfTopic').value;
  const bad=[];
  if(name.value.trim().length<2)bad.push(name);
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()))bad.push(email);
  if(msg.value.trim().length<10)bad.push(msg);
  if(bad.length){bad.forEach(i=>i.closest('.field').classList.add('invalid'));err.textContent='Please enter your name, a valid email and a message of at least 10 characters.';bad[0].focus();return;}
  const body=`Hi Aboobacker,\n\n${msg.value.trim()}\n\n— ${name.value.trim()}\n${email.value.trim()}`;
  const url=`mailto:${OWNER_EMAIL}?subject=${encodeURIComponent('Portfolio enquiry: '+topic)}&body=${encodeURIComponent(body)}`;
  toast('Opening your email app…');setTimeout(()=>{location.href=url;},350);
 });

 // (side dots removed in V28)
 const dotDefs=[['home','Home'],['about','About'],['journey','Journey'],['internship','Internship'],['projects','Projects'],['skills','Skills'],['services','Services'],['certificates','Certificates'],['contact','Contact']];

 // ----- Command palette -----
 const pal=$('#palette'),pin=$('#paletteInput'),plist=$('#paletteList');
 const go=id=>()=>document.getElementById(id)?.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
 const commands=[
  ...dotDefs.map(([id,l],i)=>({icon:'#',label:'Go to '+l,hint:'SECTION',run:go(id)})),
  {icon:'⇩',label:'View resume',hint:'ACTION',run:()=>openModal(rm)},
  {icon:'♫',label:'Open music player',hint:'ACTION',run:()=>$('#musicFab')?.click()},
  {icon:'⧉',label:'Copy email address',hint:'ACTION',run:()=>$('#copyEmail')?.click()},
  {icon:'✉',label:'Write a message',hint:'ACTION',run:()=>setTopic('General enquiry')},
  {icon:'↑',label:'Scroll to top',hint:'ACTION',run:()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'})}
 ];
 let shown=[],sel=0;
 function renderPalette(){
  const q=pin.value.trim().toLowerCase();
  shown=commands.filter(c=>c.label.toLowerCase().includes(q));sel=Math.min(sel,Math.max(shown.length-1,0));
  plist.replaceChildren();
  if(!shown.length){const li=document.createElement('li');li.className='palette-empty';li.textContent='No matching commands';plist.appendChild(li);return;}
  shown.forEach((c,i)=>{
   const li=document.createElement('li');li.setAttribute('role','option');if(i===sel)li.classList.add('active');
   const ic=document.createElement('i');ic.textContent=c.icon;const t=document.createElement('span');t.textContent=c.label;const h=document.createElement('small');h.textContent=c.hint;
   li.append(ic,t,h);li.addEventListener('mousemove',()=>{if(sel!==i){sel=i;$$('li',plist).forEach((x,n)=>x.classList.toggle('active',n===i));}});
   li.addEventListener('click',()=>runCmd(c));plist.appendChild(li);
  });
 }
 function runCmd(c){closeModal(pal);setTimeout(c.run,120);}
 function openPalette(){pin.value='';sel=0;renderPalette();openModal(pal);setTimeout(()=>pin.focus(),70);}
 $('#paletteOpen')?.addEventListener('click',()=>{$('#nav')?.classList.remove('open');openPalette();});
 pin.addEventListener('input',()=>{sel=0;renderPalette();});
 pin.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!shown.length)return;sel=(sel+(e.key==='ArrowDown'?1:-1)+shown.length)%shown.length;renderPalette();$('li.active',plist)?.scrollIntoView({block:'nearest'});}
  else if(e.key==='Enter'&&shown[sel]){e.preventDefault();runCmd(shown[sel]);}
 });
 document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();pal.classList.contains('is-open')?closeModal(pal):openPalette();}
 });

 window.__pf={$,$$,toast,openModal,closeModal,commands,OWNER_EMAIL,reduce,dotDefs,openPalette};
})();
