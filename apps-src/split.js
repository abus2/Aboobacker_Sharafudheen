calc.split=(bill,tip,n)=>{const t=bill*tip/100,total=bill+t,k=Math.max(Math.round(n),1);return{t,total,each:total/k,tipEach:t/k};};
(function(){
 const ids=['spBill','spTip','spN'].map(i=>$('#'+i));
 function run(){const o=calc.split(Math.max(num(ids[0]),0),Math.max(num(ids[1]),0),num(ids[2],1));
  setText('spBig',R(o.each));setText('spTipAmt',R(o.t));setText('spTotal',R(o.total));setText('spTipEach',R(o.tipEach));}
 ids.forEach(e=>e.addEventListener('input',run));run();
})();
