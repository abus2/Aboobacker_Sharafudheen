calc.cagr=(i,f,y)=>{if(i<=0||y<=0)return null;return{c:(Math.pow(f/i,1/y)-1)*100,gain:f-i,abs:(f-i)/i*100,mult:f/i};};
(function(){
 const ids=['cgI','cgF','cgY'].map(i=>$('#'+i));
 function run(){const o=calc.cagr(num(ids[0]),num(ids[1]),num(ids[2]));
  if(!o){['cgBig','cgGain','cgAbs','cgMult'].forEach(i=>setText(i,'—'));return;}
  setText('cgBig',o.c.toFixed(2)+'%');setText('cgGain',(o.gain<0?'−':'')+R0(Math.abs(o.gain)));setText('cgAbs',o.abs.toFixed(1)+'%');setText('cgMult',o.mult.toFixed(2)+'×');}
 ids.forEach(e=>e.addEventListener('input',run));run();
})();
