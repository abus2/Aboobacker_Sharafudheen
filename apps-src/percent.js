 calc.pctOf=(p,n)=>p/100*n;
 calc.pctChange=(a,b)=>a===0?null:(b-a)/Math.abs(a)*100;
 calc.discount=(price,disc,tax)=>{const d=price*disc/100,after=price-d,t=after*tax/100;return{d,after,t,final:after+t};};
 (function(){
  const ids=['pcA','pcB','pcFrom','pcTo','pcPrice','pcDisc','pcTax'].map(i=>$('#'+i));
  const fmt=n=>inr.format(Number.isFinite(n)?n:0);
  function run(){
   const [A,B,F,T,P,D,X]=ids;
   setText('pcL1',num(A)+'% OF '+inr0.format(num(B)));setText('pc1',fmt(calc.pctOf(num(A),num(B))));
   const ch=num(T)-num(F),pc=calc.pctChange(num(F),num(T));
   setText('pcChg',(ch>0?'+':ch<0?'−':'')+fmt(Math.abs(ch)));setText('pcPct',pc===null?'n/a':(pc>0?'↑ ':pc<0?'↓ ':'')+Math.abs(pc).toFixed(2)+'%');
   const d=calc.discount(num(P),num(D),num(X));
   setText('pcDiscAmt',R(d.d));setText('pcAfter',R(d.after));setText('pcTaxAmt',R(d.t));setText('pcFinal',R(d.final));
  }
  ids.forEach(e=>e.addEventListener('input',run));run();
 })();
