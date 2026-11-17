calc.eligible=(inc,emis,rate,years,foir)=>{const cap=Math.max(inc*foir/100-emis,0),r=rate/1200,n=Math.round(years*12);
 const loan=n<=0?0:r===0?cap*n:cap*(Math.pow(1+r,n)-1)/(r*Math.pow(1+r,n));return{cap,loan,total:cap*n,interest:cap*n-loan};};
(function(){
 const ids=['elI','elE','elR','elY','elF'].map(i=>$('#'+i));
 function run(){const v=ids.map(e=>num(e));const o=calc.eligible(Math.max(v[0],0),Math.max(v[1],0),Math.max(v[2],0),Math.max(v[3],0),Math.min(Math.max(v[4],0),100));
  setText('elBig',R0(o.loan));setText('elEmi',R0(o.cap));setText('elTot',R0(o.total));setText('elInt',R0(o.interest));}
 ids.forEach(e=>e.addEventListener('input',run));run();
})();
