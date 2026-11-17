(function(){
 const KEY='aboo-tally-v1';let v=[];
 try{v=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(v))v=[];}catch(_){v=[];}
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(v));}catch(_){}};
 const esc=window.PF_RENDER.esc;
 const PRE={Receipt:['Cash',''],Payment:['','Cash'],Sales:['','Sales'],Purchase:['Purchase',''],Journal:['','']};
 let type='Receipt',view='Day Book';
 const dr=$('#tyDr'),cr=$('#tyCr'),amt=$('#tyAmt'),dt=$('#tyDate'),nar=$('#tyNar'),out=$('#tyOut'),led=$('#tyLed'),box=$('#tyLedBox');
 const t=new Date();dt.value=t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0');
 const names=()=>[...new Set(['Cash','Bank','Sales','Purchase','Capital','Rent','Salary',...v.flatMap(x=>[x.dr,x.cr])])].sort();
 const dmy=s=>{const d=new Date(s+'T00:00:00');return isNaN(d)?s:d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'2-digit'});};
 function render(){
  const n=names(),keep=led.value;
  $('#tyList').innerHTML=n.map(x=>`<option value="${esc(x)}">`).join('');
  led.innerHTML=n.map(x=>`<option>${esc(x)}</option>`).join('');if(n.includes(keep))led.value=keep;
  box.hidden=view!=='Ledger';let h='';
  if(view==='Day Book'){
   h=v.length?'<div class="entry-list">'+[...v].reverse().map(x=>`<div class="entry income"><span class="dot"></span><div class="t"><b>${esc(x.type)} · ${esc(x.dr)} → ${esc(x.cr)}</b><small>${esc(dmy(x.date))}${x.nar?' · '+esc(x.nar):''}</small></div><span class="amt">${R(x.amt)}</span><button type="button" data-del="${x.id}" aria-label="Delete voucher">✕</button></div>`).join('')+'</div>':'<div class="empty-note">No vouchers yet. Save your first voucher on the left.</div>';
  }else if(view==='Ledger'){
   let bal=0;const rows=v.filter(x=>x.dr===led.value||x.cr===led.value).sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:a.id-b.id).map(x=>{const isDr=x.dr===led.value;bal+=isDr?x.amt:-x.amt;
    return `<tr><td>${esc(dmy(x.date))}</td><td>${esc(isDr?x.cr:x.dr)}</td><td class="n">${isDr?R(x.amt):''}</td><td class="n">${isDr?'':R(x.amt)}</td><td class="n">${R(Math.abs(bal))} ${bal>=0?'Dr':'Cr'}</td></tr>`;});
   h=rows.length?`<div class="ty-wrap"><table class="ty-tb"><thead><tr><th>Date</th><th>Particulars</th><th class="n">Debit</th><th class="n">Credit</th><th class="n">Balance</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>`:'<div class="empty-note">No entries for this ledger.</div>';
  }else{
   const b={};v.forEach(x=>{b[x.dr]=(b[x.dr]||0)+x.amt;b[x.cr]=(b[x.cr]||0)-x.amt;});
   const ks=Object.keys(b).filter(k=>Math.abs(b[k])>=0.005).sort();let D=0,C=0;
   const rows=ks.map(k=>{const x=Math.round(b[k]*100)/100;if(x>0)D+=x;else C-=x;return `<tr><td>${esc(k)}</td><td class="n">${x>0?R(x):''}</td><td class="n">${x<0?R(-x):''}</td></tr>`;});
   h=ks.length?`<div class="ty-wrap"><table class="ty-tb"><thead><tr><th>Ledger</th><th class="n">Debit</th><th class="n">Credit</th></tr></thead><tbody>${rows.join('')}<tr class="ty-tot"><td>Total</td><td class="n">${R(D)}</td><td class="n">${R(C)}</td></tr></tbody></table></div><p class="note">${Math.abs(D-C)<0.005?'Trial balance is tallied ✓':'Difference: '+R(Math.abs(D-C))}</p>`:'<div class="empty-note">Trial balance appears once you save vouchers.</div>';
  }
  out.innerHTML=h;
 }
 const pick=(id,fn)=>$$('#'+id+' button').forEach(b=>b.addEventListener('click',()=>{$$('#'+id+' button').forEach(x=>x.classList.toggle('active',x===b));fn(b.dataset.v);}));
 pick('tyType',x=>{type=x;dr.value=PRE[x][0];cr.value=PRE[x][1];(dr.value?cr:dr).focus();});
 pick('tyView',x=>{view=x;render();});led.addEventListener('input',render);
 dr.value='Cash';
 $('#tySave').addEventListener('click',()=>{
  const a=parseFloat(amt.value),d=dr.value.trim(),c=cr.value.trim();
  if(!d||!c){toast('Enter both ledgers');return;}if(d.toLowerCase()===c.toLowerCase()){toast('Debit and credit ledgers must differ');return;}
  if(!Number.isFinite(a)||a<=0){toast('Enter an amount greater than 0');amt.focus();return;}
  v.push({id:Date.now()+Math.floor(Math.random()*1000),type,date:dt.value,dr:d,cr:c,amt:Math.round(a*100)/100,nar:nar.value.trim().slice(0,60)});
  save();render();amt.value='';nar.value='';amt.focus();toast('Voucher saved ✓');});
 out.addEventListener('click',e=>{const b=e.target.closest('[data-del]');if(!b)return;v=v.filter(x=>String(x.id)!==b.dataset.del);save();render();});
 $('#tyCsv').addEventListener('click',()=>{if(!v.length){toast('Nothing to export yet');return;}const q=s=>'"'+String(s).replace(/"/g,'""')+'"';
  const csv=['Date,Type,Debit,Credit,Amount,Narration'].concat(v.map(x=>[x.date,x.type,q(x.dr),q(x.cr),x.amt,q(x.nar)].join(','))).join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='accounts-book.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast('CSV downloaded ✓');});
 $('#tyClear').addEventListener('click',()=>{if(v.length&&confirm('Delete all vouchers from this browser?')){v=[];save();render();toast('Cleared');}});
 render();
})();
