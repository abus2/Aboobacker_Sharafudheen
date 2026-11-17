calc.dep=(cost,salv,life,method,rate)=>{
  const rows=[];let open=cost;
  for(let y=1;y<=life;y++){
   let d=method==='slm'?(cost-salv)/life:open*rate/100;
   d=Math.max(0,Math.min(d,open-salv));
   if(method==='wdv'&&y===life)d=Math.max(0,open-salv);
   rows.push({y,open,d,close:open-d});open-=d;
  }
  return rows;
 };
 (function(){
  let m='slm';const C=$('#dpCost'),S=$('#dpSalv'),L=$('#dpLife'),Rt=$('#dpRate');
  function run(){
   const cost=Math.max(num(C),0),salv=Math.min(Math.max(num(S),0),cost),life=Math.min(Math.max(Math.round(num(L,1)),1),50),rate=Math.min(Math.max(num(Rt),0),100);
   $('#dpRateBox').style.display=m==='wdv'?'':'none';
   const rows=calc.dep(cost,salv,life,m,rate);
   const tot=rows.reduce((a,r)=>a+r.d,0);
   setText('dpBig',R(rows[0]?rows[0].d:0));setText('dpTotal',R(tot));setText('dpEnd',R(cost-tot));
   $('#dpTable').innerHTML='<div><span><b>Year</b> · opening value</span><b>Depreciation → closing</b></div>'+rows.map(r=>`<div><span>Year ${r.y} · ${R0(r.open)}</span><b>${R0(r.d)} → ${R0(r.close)}</b></div>`).join('');
  }
  $$('#dpMethod button').forEach(b=>b.addEventListener('click',()=>{m=b.dataset.m;$$('#dpMethod button').forEach(x=>x.classList.toggle('active',x===b));run();}));
  [C,S,L,Rt].forEach(e=>e.addEventListener('input',run));run();
 })();
