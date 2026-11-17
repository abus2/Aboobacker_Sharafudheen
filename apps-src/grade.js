calc.grade=(m,t,g)=>{const p=t?m/t*100:0,gr=p>=90?'A+':p>=80?'A':p>=70?'B+':p>=60?'B':p>=50?'C':p>=40?'D':'Fail',need=t*g/100;return{p,gr,need,gap:m-need};};
(function(){
 const ids=['grM','grT','grG'].map(i=>$('#'+i));
 function run(){const t=num(ids[1]);if(t<=0){['grBig','grGrade','grNeed','grGap'].forEach(i=>setText(i,'—'));return;}
  const o=calc.grade(num(ids[0]),t,num(ids[2]));setText('grBig',o.p.toFixed(2)+'%');setText('grGrade',o.gr);setText('grNeed',o.need.toFixed(1));
  setText('grGap',o.gap>=0?'+'+o.gap.toFixed(1)+' extra':Math.abs(o.gap).toFixed(1)+' short');}
 ids.forEach(e=>e.addEventListener('input',run));run();
})();
