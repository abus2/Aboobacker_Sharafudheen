calc.bmi=(w,h)=>{const m=h/100,b=w/(m*m);const cat=b<18.5?'Underweight':b<25?'Normal weight':b<30?'Overweight':'Obese';return{b,cat,lo:18.5*m*m,hi:24.9*m*m};};
(function(){
 const W=$('#bmW'),H=$('#bmH');
 function run(){const w=num(W),h=num(H);if(w<=0||h<=0){['bmBig','bmCat','bmRange','bmDiff'].forEach(i=>setText(i,'—'));return;}
  const r=calc.bmi(w,h);setText('bmBig',r.b.toFixed(1));setText('bmCat',r.cat);setText('bmRange',r.lo.toFixed(1)+' – '+r.hi.toFixed(1)+' kg');
  setText('bmDiff',w<r.lo?'Gain ~'+(r.lo-w).toFixed(1)+' kg':w>r.hi?'Lose ~'+(w-r.hi).toFixed(1)+' kg':'Already in range');}
 [W,H].forEach(e=>e.addEventListener('input',run));run();
})();
