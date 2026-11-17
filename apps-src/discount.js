calc.discount=(p,d1,d2)=>{const mid=p*(1-d1/100),fin=mid*(1-d2/100);return{mid,fin,save:p-fin,eff:p>0?(p-fin)/p*100:0};};
 (function(){
  const P=$('#dcPrice'),D1=$('#dcD1'),D2=$('#dcD2');
  function run(){
   const cl=x=>Math.min(Math.max(x,0),100);
   const r=calc.discount(Math.max(num(P),0),cl(num(D1)),cl(num(D2)));
   setText('dcBig',R(r.fin));setText('dcSave',R(r.save));setText('dcMid',R(r.mid));setText('dcEff',r.eff.toFixed(2)+'%');
  }
  [P,D1,D2].forEach(e=>e.addEventListener('input',run));run();
 })();
