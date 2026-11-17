 calc.fd=(P,rate,years)=>{const v=P*Math.pow(1+rate/400,4*years);return{value:v,invested:P,interest:v-P};};
 calc.rd=(m,rate,years)=>{const n=Math.round(years*12),q=rate/400;let v=0;for(let i=1;i<=n;i++){const left=(n-i+1)/12;v+=m*Math.pow(1+q,4*left);}return{value:v,invested:m*n,interest:v-m*n};};
 (function(){
  let type='fd';const A=$('#fdAmt'),Rt=$('#fdRate'),Y=$('#fdYears');
  function run(){
   const a=Math.max(num(A),0),r=Math.max(num(Rt),0),y=Math.max(num(Y,1),0.25);
   const o=type==='fd'?calc.fd(a,r,y):calc.rd(a,r,y);
   setText('fdAmtLabel',type==='fd'?'DEPOSIT AMOUNT (₹)':'MONTHLY DEPOSIT (₹)');setText('fdInvLabel',type==='fd'?'Amount deposited':'Total deposited');
   setText('fdBig',R0(o.value));setText('fdInv',R0(o.invested));setText('fdInt',R0(o.interest));setText('fdGrowth',(o.invested?o.interest/o.invested*100:0).toFixed(1)+'%');
   const pa=o.value?o.invested/o.value*100:100;$('#fdBarA').style.width=pa+'%';$('#fdBarB').style.width=(100-pa)+'%';
  }
  $$('#fdType button').forEach(b=>b.addEventListener('click',()=>{type=b.dataset.t;$$('#fdType button').forEach(x=>x.classList.toggle('active',x===b));A.value=type==='fd'?100000:5000;run();}));
  [A,Rt,Y].forEach(e=>e.addEventListener('input',run));run();
 })();
