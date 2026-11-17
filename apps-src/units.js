calc.units={Length:{m:1,km:1000,cm:.01,mm:.001,mile:1609.344,yard:.9144,ft:.3048,inch:.0254},
 Weight:{kg:1,g:.001,mg:1e-6,tonne:1000,lb:.45359237,oz:.028349523},
 Volume:{L:1,mL:.001,'m³':1000,gallon:3.785411784,cup:.2365882365},
 Speed:{'m/s':1,'km/h':1/3.6,mph:.44704,knot:.514444},
 Temperature:{'°C':1,'°F':1,K:1}};
calc.convert=(cat,v,a,b)=>{if(cat==='Temperature'){const c=a==='°C'?v:a==='°F'?(v-32)*5/9:v-273.15;return b==='°C'?c:b==='°F'?c*9/5+32:c+273.15;}
 const t=calc.units[cat];return v*t[a]/t[b];};
(function(){
 const C=$('#unCat'),V=$('#unVal'),A=$('#unFrom'),B=$('#unTo'),U=calc.units;
 const opts=a=>a.map(x=>`<option>${x}</option>`).join('');
 const fmt=n=>Number.isFinite(n)?n.toLocaleString('en-IN',{maximumSignificantDigits:8}):'—';
 C.innerHTML=opts(Object.keys(U));
 function fill(){const k=Object.keys(U[C.value]);A.innerHTML=opts(k);B.innerHTML=opts(k);B.selectedIndex=Math.min(1,k.length-1);run();}
 function run(){const v=num(V),r=calc.convert(C.value,v,A.value,B.value),back=calc.convert(C.value,1,B.value,A.value);
  setText('unBig',fmt(r)+' '+B.value);setText('unText',fmt(v)+' '+A.value+' = '+fmt(r)+' '+B.value);setText('unRev','1 '+B.value+' = '+fmt(back)+' '+A.value);}
 C.addEventListener('input',fill);[V,A,B].forEach(e=>e.addEventListener('input',run));fill();
})();
