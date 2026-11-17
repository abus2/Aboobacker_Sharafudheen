calc.amort=(P,rate,years)=>{
  const n=Math.round(years*12),r=rate/1200;
  const emi=n<=0?0:r===0?P/n:P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
  let bal=P;const rows=[];let pr=0,it=0;
  for(let m=1;m<=n;m++){
   const i=bal*r,p=Math.min(emi-i,bal);bal=Math.max(bal-p,0);pr+=p;it+=i;
   if(m%12===0||m===n){rows.push({y:Math.ceil(m/12),pr,it,bal});pr=0;it=0;}
  }
  return{emi,rows,interest:emi*n-P,total:emi*n};
 };
 (function(){
  const P=$('#amP'),Rt=$('#amR'),Y=$('#amY');
  function run(){
   const p=Math.max(num(P),0),r=Math.min(Math.max(num(Rt),0),60),y=Math.min(Math.max(Math.round(num(Y,1)),1),40);
   const a=calc.amort(p,r,y);
   setText('amBig',R(a.emi));setText('amInt',R(a.interest));setText('amTot',R(a.total));
   $('#amTable').innerHTML='<div><span><b>Year</b> · principal / interest paid</span><b>Balance left</b></div>'+a.rows.map(x=>`<div><span>Year ${x.y} · ${R0(x.pr)} / ${R0(x.it)}</span><b>${R0(x.bal)}</b></div>`).join('');
  }
  [P,Rt,Y].forEach(e=>e.addEventListener('input',run));run();
 })();
