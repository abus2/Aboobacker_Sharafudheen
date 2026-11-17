calc.inflation=(a,r,y)=>{const f=a*Math.pow(1+r/100,y),w=a/Math.pow(1+r/100,y);return{f,extra:f-a,w,loss:a?(1-w/a)*100:0};};
(function(){
 const ids=['ifA','ifR','ifY'].map(i=>$('#'+i));
 function run(){const o=calc.inflation(Math.max(num(ids[0]),0),num(ids[1]),Math.max(num(ids[2]),0));
  setText('ifBig',R0(o.f));setText('ifExtra',R0(o.extra));setText('ifWorth',R0(o.w)+' worth');setText('ifLoss',o.loss.toFixed(1)+'%');}
 ids.forEach(e=>e.addEventListener('input',run));run();
})();
