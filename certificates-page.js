// certificates.html — search, issuer filter and detail window for the certificates in certificates-data.js
(function(){
 const {$,$$}=window.PF2;
 const esc=window.PF_RENDER.esc;
 const data=Array.isArray(window.PORTFOLIO_CERTS)?window.PORTFOLIO_CERTS:[];
 const grid=$('#cGrid'),empty=$('#cEmpty'),filt=$('#cFilters'),q=$('#cQuery'),modal=$('#certModal');
 let issuer='All',last=null;
 const issuers=['All',...new Set(data.map(c=>c.issuer))];
 const skillSet=new Set(data.flatMap(c=>c.skills||[]));
 $('#cTotal').textContent=data.length;$('#cIssuers').textContent=issuers.length-1;$('#cSkills').textContent=skillSet.size;
 filt.innerHTML=issuers.map(i=>`<button type="button" class="filter${i===issuer?' active':''}" data-i="${esc(i)}">${esc(i)}</button>`).join('');
 function paint(){
  const s=q.value.trim().toLowerCase();
  const list=data.filter(c=>(issuer==='All'||c.issuer===issuer)&&(!s||(c.title+' '+c.issuer+' '+(c.skills||[]).join(' ')+' '+c.desc).toLowerCase().includes(s)));
  grid.innerHTML=list.map(c=>`<article class="certificate-card glass-card cert-open" tabindex="0" role="button" data-id="${esc(c.id)}" aria-label="Open ${esc(c.title)}">
   <div class="certificate-top"><span class="cert-icon">${esc(c.badge||c.issuer.slice(0,2))}</span><span class="cert-year">${esc(c.year||c.issuer.toUpperCase())}</span></div>
   <p class="cert-provider">${esc(c.issuer.toUpperCase())}</p><h3>${esc(c.title)}</h3>
   <div class="tag-list">${(c.skills||[]).slice(0,3).map(x=>`<span>${esc(x)}</span>`).join('')}</div>
   <div class="cert-foot"><span class="cert-status">${esc(c.status||'Completed')}</span><span class="cert-more">View details →</span></div></article>`).join('');
  empty.style.display=list.length?'none':'block';
 }
 filt.addEventListener('click',e=>{const b=e.target.closest('.filter');if(!b)return;issuer=b.dataset.i;$$('.filter',filt).forEach(x=>x.classList.toggle('active',x===b));paint();});
 q.addEventListener('input',paint);

 function open(id){
  const c=data.find(x=>x.id===id);if(!c)return;last=document.activeElement;
  $('#cmIcon').textContent=c.badge||c.issuer.slice(0,2);$('#cmIssuer').textContent=c.issuer.toUpperCase()+(c.year?' · '+c.year:'');$('#cmTitle').textContent=c.title;
  $('#cmDesc').textContent=c.desc||'';$('#cmStatus').textContent=c.status||'Completed';
  $('#cmSkills').innerHTML=(c.skills||[]).map(x=>`<span>${esc(x)}</span>`).join('');
  const img=$('#cmImg');
  if(c.image){img.hidden=false;img.innerHTML='';const im=new Image();im.alt=c.title+' certificate';im.src=c.image;im.onerror=()=>{img.hidden=true;};img.appendChild(im);}else{img.hidden=true;img.innerHTML='';}
  const v=$('#cmVerify');if(c.verify&&/^https?:\/\//i.test(c.verify)){v.href=c.verify;v.hidden=false;}else v.hidden=true;
  $('#cmAsk').href='index.html?topic='+encodeURIComponent('Certificate verification: '+c.title)+'#contact';
  modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  setTimeout(()=>$('.modal-close',modal).focus(),50);
 }
 function close(){modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';if(last&&last.focus)last.focus();}
 grid.addEventListener('click',e=>{const c=e.target.closest('.cert-open');if(c)open(c.dataset.id);});
 grid.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const c=e.target.closest('.cert-open');if(c){e.preventDefault();open(c.dataset.id);}}});
 modal.addEventListener('click',e=>{if(e.target.closest('[data-close]'))close();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))close();});
 paint();
 if(location.hash.length>1){const id=decodeURIComponent(location.hash.slice(1));if(data.some(c=>c.id===id))open(id);}
})();
