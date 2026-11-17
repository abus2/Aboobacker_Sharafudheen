(function(){
 const KEY='aboo-stock-v1';let it=[];
 try{it=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(it))it=[];}catch(_){it=[];}
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(it));}catch(_){}};const esc=window.PF_RENDER.esc;
 function render(){
  const cost=it.reduce((s,i)=>s+i.q*i.c,0),sell=it.reduce((s,i)=>s+i.q*i.s,0);
  setText('skBig',R0(cost));setText('skCnt',it.length);setText('skSell',R0(sell));setText('skProfit',R0(sell-cost));
  $('#skList').innerHTML=it.length?it.map(i=>`<div class="entry income"><span class="dot"></span><div class="t"><b>${esc(i.n)}</b><small>${i.q} ${esc(i.u)} · cost ${R(i.c)} · sell ${R(i.s)}</small></div><span class="amt">${R0(i.q*i.c)}</span><button type="button" data-del="${i.id}" aria-label="Delete item">✕</button></div>`).join(''):'<div class="empty-note">No items yet. Add your first item on the left.</div>';
 }
 $('#skAdd').addEventListener('click',()=>{const n=$('#skN').value.trim(),q=num($('#skQ')),c=num($('#skC')),s=num($('#skS'));
  if(!n){toast('Enter an item name');return;}if(q<0||c<0||s<0){toast('Values cannot be negative');return;}
  it.push({id:Date.now()+Math.floor(Math.random()*1000),n:n.slice(0,40),q,u:($('#skU').value.trim()||'pcs').slice(0,8),c,s});save();render();$('#skN').value='';$('#skN').focus();toast('Item added ✓');});
 $('#skList').addEventListener('click',e=>{const b=e.target.closest('[data-del]');if(!b)return;it=it.filter(i=>String(i.id)!==b.dataset.del);save();render();});
 $('#skClear').addEventListener('click',()=>{if(it.length&&confirm('Delete all stock items from this browser?')){it=[];save();render();toast('Cleared');}});
 render();
})();
