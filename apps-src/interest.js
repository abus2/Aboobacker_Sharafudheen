calc.interest=(P,r,y,n)=>{const si=P*r*y/100,ca=P*Math.pow(1+r/100/n,n*y);return{si,st:P+si,ci:ca-P,ca};};
(function(){
 const ids=['inP','inR','inY','inN'].map(i=>$('#'+i));
 function run(){const [P,Rt,Y,N]=ids;const o=calc.interest(Math.max(num(P),0),Math.max(num(Rt),0),Math.max(num(Y),0),+N.value);
  setText('inBig',R0(o.ca));setText('inSi',R(o.si));setText('inSt',R(o.st));setText('inCi',R(o.ci));setText('inCa',R(o.ca));setText('inDiff',R(o.ci-o.si));}
 ids.forEach(e=>e.addEventListener('input',run));run();
})();
