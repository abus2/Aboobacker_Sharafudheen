// V27 — photo zoom, time-based greeting, save contact (.vcf), share, project search,
// keyboard shortcuts, auto-hiding header.
(function(){
 const pf=window.__pf; if(!pf) return;
 const {$,$$,toast,openModal,closeModal,commands,OWNER_EMAIL,reduce,dotDefs}=pf;

 // ----- Time-based greeting -----
 const kicker=$('.hero-kicker');
 if(kicker){
  const h=new Date().getHours();
  const g=h<5?'HELLO':h<12?'GOOD MORNING':h<17?'GOOD AFTERNOON':h<21?'GOOD EVENING':'HELLO';
  kicker.textContent=g+", I'M";
 }

 // ----- Photo lightbox -----
 const photoModal=$('#photoModal');
 const openPhoto=()=>openModal(photoModal);
 $('#photoZoom')?.addEventListener('click',openPhoto);
 $('.profile-photo')?.addEventListener('click',openPhoto);

 // ----- Save contact (.vcf) + Share -----
 function saveContact(){
  const lines=['BEGIN:VCARD','VERSION:3.0','N:Sharfudheen;Aboobacker;;;','FN:Aboobacker Sharfudheen','TITLE:B.Com Finance Student','ADR;TYPE=HOME:;;Payyanur;Kerala;;;India'];
  if(OWNER_EMAIL&&!/example\.com$/i.test(OWNER_EMAIL))lines.push('EMAIL;TYPE=INTERNET:'+OWNER_EMAIL);
  if(/^https?:/.test(location.href))lines.push('URL:'+location.href.split('#')[0]);
  lines.push('END:VCARD');
  const blob=new Blob([lines.join('\r\n')],{type:'text/vcard'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Aboobacker-Sharfudheen.vcf';
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  toast('Contact card downloaded ✓');
 }
 async function sharePage(){
  const data={title:document.title,text:'Portfolio of Aboobacker Sharfudheen',url:location.href.split('#')[0]};
  try{ if(navigator.share){await navigator.share(data);return;} }catch(e){ if(e&&e.name==='AbortError')return; }
  try{await navigator.clipboard.writeText(data.url);toast('Portfolio link copied ✓');}
  catch(_){toast(data.url);}
 }
 const copyBtn=$('#copyEmail');
 if(copyBtn){
  const wrap=document.createElement('div');wrap.className='contact-actions';
  const b1=document.createElement('button');b1.type='button';b1.textContent='⇩ Save contact';b1.addEventListener('click',saveContact);
  const b2=document.createElement('button');b2.type='button';b2.textContent='↗ Share portfolio';b2.addEventListener('click',sharePage);
  wrap.append(b1,b2);copyBtn.insertAdjacentElement('afterend',wrap);
 }

 // ----- Project search -----
 const grid=$('.project-grid'),toolbar=$('.project-toolbar');
 let searchInput=null;
 if(grid&&toolbar){
  const box=document.createElement('label');box.className='project-search';
  box.innerHTML='<span aria-hidden="true">⌕</span><input type="search" id="projectSearch" placeholder="Search projects…" aria-label="Search projects" autocomplete="off"><kbd>/</kbd>';
  toolbar.insertAdjacentElement('afterend',box);
  searchInput=$('input',box);
  const empty=document.createElement('p');empty.className='project-empty';empty.textContent='No projects match your search.';
  grid.insertAdjacentElement('afterend',empty);
  const run=()=>{
   const q=searchInput.value.trim().toLowerCase();let n=0;
   $$('.project-card',grid).forEach(c=>{const hit=!q||c.textContent.toLowerCase().includes(q);c.classList.toggle('search-hide',!hit);if(hit&&!c.classList.contains('hide'))n++;});
   empty.classList.toggle('show',n===0);
  };
  searchInput.addEventListener('input',run);
  $$('.filter').forEach(f=>f.addEventListener('click',()=>setTimeout(run,0)));
 }

 // ----- Shortcuts modal -----
 const scModal=$('#shortcutsModal');
 const foot=$('.footer');
 if(foot){const k=document.createElement('button');k.type='button';k.className='kbd-hint';k.innerHTML='<kbd>?</kbd> Shortcuts';k.addEventListener('click',()=>openModal(scModal));foot.appendChild(k);}
 commands.push(
  {icon:'?',label:'Keyboard shortcuts',hint:'ACTION',run:()=>openModal(scModal)},
  {icon:'◉',label:'View profile photo',hint:'ACTION',run:openPhoto},
  {icon:'⇩',label:'Save contact card (.vcf)',hint:'ACTION',run:saveContact},
  {icon:'↗',label:'Share this portfolio',hint:'ACTION',run:sharePage}
 );
 document.addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  const t=e.target,typing=t&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable);
  if(typing)return;
  const open=$('.modal.is-open,.palette.is-open');
  const k=e.key;
  if(k==='?'){e.preventDefault();open?(open===scModal&&closeModal(scModal)):openModal(scModal);return;}
  if(open)return;
  if(k==='/'&&searchInput){e.preventDefault();$('#projects')?.scrollIntoView({behavior:reduce?'auto':'smooth'});setTimeout(()=>searchInput.focus({preventScroll:true}),350);return;}
  if(/^[1-9]$/.test(k)&&dotDefs[+k-1]){document.getElementById(dotDefs[+k-1][0])?.scrollIntoView({behavior:reduce?'auto':'smooth'});return;}
  const l=k.toLowerCase();
  if(l==='m')$('#musicFab')?.click();
  else if(l==='r')$('[data-open-resume]')?.click();
  else if(l==='p')openPhoto();
  else if(l==='t')scrollTo({top:0,behavior:reduce?'auto':'smooth'});
 });

 // ----- Auto-hide header on scroll down -----
 const header=$('.site-header');
 if(header){
  let last=scrollY,ticking=false;
  addEventListener('scroll',()=>{
   if(ticking)return;ticking=true;
   requestAnimationFrame(()=>{
    const y=scrollY,navOpen=$('#nav')?.classList.contains('open');
    if(navOpen||y<200||y<last-6)header.classList.remove('header-hidden');
    else if(y>last+6)header.classList.add('header-hidden');
    last=y;ticking=false;
   });
  },{passive:true});
  header.addEventListener('focusin',()=>header.classList.remove('header-hidden'));
 }
})();
