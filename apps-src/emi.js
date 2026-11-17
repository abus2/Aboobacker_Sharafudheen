 calc.emi=(P,annual,months)=>{
  const r=annual/12/100;let emi;
  if(months<=0)return{emi:0,total:0,interest:0};
  emi=r===0?P/months:P*r*Math.pow(1+r,months)/(Math.pow(1+r,months)-1);
  const total=emi*months;return{emi,total,interest:total-P};
 };
 (function(){
  const P=$('#emiP'),Pr=$('#emiPr'),I=$('#emiI'),Ir=$('#emiIr'),T=$('#emiT'),Tr=$('#emiTr');let yrs=true;
  const months=()=>Math.round(num(T,1)*(yrs?12:1));
  function run(){
   $('#emiPv').textContent=R0(num(P));$('#emiIv').textContent=num(I)+'%';$('#emiTv').textContent=num(T)+(yrs?' yr':' mo');
   const r=calc.emi(num(P),num(I),months());
   setText('emiBig',R0(r.emi));setText('emiTotalInt',R0(r.interest));setText('emiTotalPay',R0(r.total));setText('emiPrin',R0(num(P)));setText('emiMonths',months()+' months');
   const pct=r.total>0?num(P)/r.total*100:100;$('#emiBarA').style.width=pct+'%';$('#emiBarB').style.width=(100-pct)+'%';
   setText('emiPctA',pct.toFixed(0)+'% principal');setText('emiPctB',(100-pct).toFixed(0)+'% interest');
  }
  const link=(a,b)=>{a.addEventListener('input',()=>{b.value=a.value;run();});b.addEventListener('input',()=>{a.value=b.value;run();});};
  link(P,Pr);link(I,Ir);link(T,Tr);
  $$('#emiUnitSeg button').forEach(b=>b.addEventListener('click',()=>{
   const toYears=b.dataset.u==='yr';if(toYears===yrs)return;
   const cur=num(T,1);T.value=Tr.value=toYears?Math.max(1,Math.round(cur/12)):cur*12;
   Tr.max=T.max=toYears?30:360;yrs=toYears;$$('#emiUnitSeg button').forEach(x=>x.classList.toggle('active',x===b));run();}));
  run();
 })();
