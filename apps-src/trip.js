calc.trip=(d,m,p,n)=>{const l=m>0?d/m:0,cost=l*p;return{l,cost,perKm:d>0?cost/d:0,each:cost/Math.max(Math.round(n),1)};};
(function(){
 const ids=['trD','trM','trP','trN'].map(i=>$('#'+i));
 function run(){const o=calc.trip(Math.max(num(ids[0]),0),Math.max(num(ids[1]),0),Math.max(num(ids[2]),0),num(ids[3],1));
  setText('trBig',R(o.cost));setText('trL',o.l.toFixed(2)+' L');setText('trKm',R(o.perKm));setText('trEach',R(o.each));}
 ids.forEach(e=>e.addEventListener('input',run));run();
})();
