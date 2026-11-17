calc.dateDiff=(a,b)=>{if(a>b){const t=a;a=b;b=t;}
 let y=b.getFullYear()-a.getFullYear(),m=b.getMonth()-a.getMonth(),d=b.getDate()-a.getDate();
 if(d<0){m--;d+=new Date(b.getFullYear(),b.getMonth(),0).getDate();}if(m<0){y--;m+=12;}
 const days=Math.round((b-a)/864e5);let wd=0;for(let i=0;i<=days;i++){const g=new Date(a.getFullYear(),a.getMonth(),a.getDate()+i).getDay();if(g>0&&g<6)wd++;}
 return{y,m,d,days,weeks:days/7,months:days/30.4375,wd};};
(function(){
 const A=$('#ddA'),B=$('#ddB');
 function run(){const a=new Date(A.value+'T00:00:00'),b=new Date(B.value+'T00:00:00');
  if(isNaN(a)||isNaN(b)){['ddBig','ddYmd','ddW','ddM','ddWd'].forEach(i=>setText(i,'—'));return;}
  const o=calc.dateDiff(a,b);setText('ddBig',inr0.format(o.days)+' days');setText('ddYmd',o.y+'y '+o.m+'m '+o.d+'d');setText('ddW',o.weeks.toFixed(1));setText('ddM',o.months.toFixed(1));setText('ddWd',inr0.format(o.wd));}
 [A,B].forEach(e=>e.addEventListener('input',run));run();
})();
