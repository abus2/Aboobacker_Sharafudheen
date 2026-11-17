 (function(){
  const KEY='aboo-budget-v1';let items=[];
  try{items=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(items))items=[];}catch(_){items=[];}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(items));}catch(_){}};
  const form=$('#bgForm'),list=$('#bgList'),cats=$('#bgCats');let type='expense';
  const esc=window.PF_RENDER.esc;
  function render(){
   const inc=items.filter(i=>i.type==='income').reduce((s,i)=>s+i.amt,0),exp=items.filter(i=>i.type==='expense').reduce((s,i)=>s+i.amt,0),bal=inc-exp;
   setText('bgBal',(bal<0?'−':'')+R(Math.abs(bal)));setText('bgInc',R(inc));setText('bgExp',R(exp));
   $('#bgBigBox').classList.toggle('loss',bal<0);$('#bgBigBox').classList.toggle('profit',bal>0);
   setText('bgSave',inc>0?Math.max(0,(bal/inc*100)).toFixed(0)+'% of income saved':'Add income to see savings rate');
   list.innerHTML=items.length?[...items].reverse().map(i=>`<div class="entry ${i.type}"><span class="dot"></span><div class="t"><b>${esc(i.note||i.cat)}</b><small>${esc(i.cat)} · ${esc(i.date)}</small></div><span class="amt">${i.type==='income'?'+':'−'}${R(i.amt)}</span><button type="button" data-del="${i.id}" aria-label="Delete entry">✕</button></div>`).join(''):'<div class="empty-note">No entries yet. Add your first income or expense →</div>';
   const by={};items.filter(i=>i.type==='expense').forEach(i=>by[i.cat]=(by[i.cat]||0)+i.amt);
   const rows=Object.entries(by).sort((a,b)=>b[1]-a[1]);
   cats.innerHTML=rows.length?rows.map(([c,v])=>`<div class="cat-row"><div><span>${esc(c)}</span><b>${R0(v)} · ${(v/exp*100).toFixed(0)}%</b></div><div class="track"><i style="width:${(v/exp*100).toFixed(1)}%"></i></div></div>`).join(''):'<div class="empty-note">Expense breakdown appears here.</div>';
  }
  $$('#bgType button').forEach(b=>b.addEventListener('click',()=>{type=b.dataset.type;$$('#bgType button').forEach(x=>x.classList.toggle('active',x===b));
   $('#bgCat').innerHTML=(type==='income'?['Salary / Stipend','Pocket money','Freelance','Gift','Other']:['Food','Travel','Study','Bills','Shopping','Health','Entertainment','Other']).map(c=>`<option>${c}</option>`).join('');}));
  form.addEventListener('submit',e=>{
   e.preventDefault();const a=parseFloat($('#bgAmt').value);
   if(!Number.isFinite(a)||a<=0){toast('Enter an amount greater than 0');$('#bgAmt').focus();return;}
   items.push({id:Date.now()+Math.floor(Math.random()*1000),type,cat:$('#bgCat').value,amt:Math.round(a*100)/100,note:$('#bgNote').value.trim().slice(0,60),date:new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short'})});
   save();render();$('#bgAmt').value='';$('#bgNote').value='';$('#bgAmt').focus();toast(type==='income'?'Income added ✓':'Expense added ✓');
  });
  list.addEventListener('click',e=>{const b=e.target.closest('[data-del]');if(!b)return;items=items.filter(i=>String(i.id)!==b.dataset.del);save();render();});
  $('#bgCsv').addEventListener('click',()=>{
   if(!items.length){toast('Nothing to export yet');return;}
   const q=s=>'"'+String(s).replace(/"/g,'""')+'"';
   const csv=['Date,Type,Category,Note,Amount'].concat(items.map(i=>[q(i.date),i.type,q(i.cat),q(i.note),i.amt].join(','))).join('\r\n');
   const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='budget.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast('CSV downloaded ✓');
  });
  $('#bgClear').addEventListener('click',()=>{if(!items.length)return;if(confirm('Delete all budget entries from this browser?')){items=[];save();render();toast('Cleared');}});
  render();
 })();
