calc.ratio=(v)=>{const d=(a,b)=>b>0?a/b:null;return{cur:d(v.ca,v.cl),quick:d(v.ca-v.inv,v.cl),de:d(v.debt,v.eq),npm:d(v.np*100,v.rev),roa:d(v.np*100,v.ta),roe:d(v.np*100,v.eq),at:d(v.rev,v.ta)};};
 (function(){
  const ids={ca:'#rtCA',cl:'#rtCL',inv:'#rtInv',ta:'#rtTA',debt:'#rtDebt',eq:'#rtEq',rev:'#rtRev',np:'#rtNP'};
  const f=(x,s='')=>x===null?'—':x.toFixed(2)+s;
  function run(){
   const v={};for(const k in ids)v[k]=num($(ids[k]));
   const r=calc.ratio(v);
   setText('rtBig',f(r.cur));setText('rtQuick',f(r.quick));setText('rtDE',f(r.de));setText('rtNPM',f(r.npm,'%'));setText('rtROA',f(r.roa,'%'));setText('rtROE',f(r.roe,'%'));setText('rtAT',f(r.at,'×'));
  }
  for(const k in ids)$(ids[k]).addEventListener('input',run);run();
 })();
