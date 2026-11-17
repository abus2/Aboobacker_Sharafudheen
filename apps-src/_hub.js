const cards=$$('.hub-try'),panels=$$('.app-panel'),hub=$('#appHub'),bar=$('#appBar');
 function show(id,push){
  const ok=panels.some(p=>p.id===id);
  hub.hidden=ok;bar.hidden=!ok;
  panels.forEach(p=>p.classList.toggle('active',p.id===id));
  if(ok){const t=$('#'+id+' h2');bar.querySelector('b').textContent=t?t.textContent:'';}
  if(push){try{history.replaceState(null,'',ok?'#'+id:location.pathname+location.search);}catch(_){}}
  if(push)window.scrollTo({top:0});
 }
 cards.forEach(c=>c.addEventListener('click',e=>{e.preventDefault();show(c.dataset.app,true);}));
 $('#appBack').addEventListener('click',()=>show('',true));
 addEventListener('hashchange',()=>show(location.hash.slice(1)));
 show(location.hash.slice(1));
 document.addEventListener('keydown',e=>{
  if(/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;
  if(/^[1-9]$/.test(e.key)){const c=cards[+e.key-1];if(c)show(c.dataset.app,true);}
  if(e.key==='Escape')show('',true);
 });
