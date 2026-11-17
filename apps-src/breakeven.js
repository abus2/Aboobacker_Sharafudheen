 calc.breakeven=(fixed,price,vc,target,expected)=>{
  const c=price-vc;if(c<=0)return{valid:false,contrib:c};
  const units=fixed/c;return{valid:true,contrib:c,cm:c/price*100,units,sales:units*price,targetUnits:(fixed+target)/c,mos:expected>0?(expected-units)/expected*100:null};
 };
 (function(){
  const F=$('#beFixed'),P=$('#bePrice'),V=$('#beVar'),T=$('#beTarget'),E=$('#beExpected');
  function run(){
   const r=calc.breakeven(Math.max(num(F),0),num(P),num(V),Math.max(num(T),0),num(E));
   const box=$('#beBigBox');
   if(!r.valid){setText('beBig','Not possible');box.classList.add('loss');box.classList.remove('profit');['beContrib','beCm','beSales','beTargetUnits','beMos'].forEach(i=>setText(i,'—'));setText('beContrib',R(r.contrib));return;}
   box.classList.remove('loss');
   setText('beBig',inr0.format(Math.ceil(r.units))+' units');setText('beContrib',R(r.contrib));setText('beCm',r.cm.toFixed(1)+'%');setText('beSales',R0(r.sales));setText('beTargetUnits',inr0.format(Math.ceil(r.targetUnits))+' units');
   setText('beMos',r.mos===null?'—':(r.mos>=0?r.mos.toFixed(1)+'% above break-even':Math.abs(r.mos).toFixed(1)+'% below break-even'));
  }
  [F,P,V,T,E].forEach(e=>e.addEventListener('input',run));run();
 })();
