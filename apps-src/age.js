calc.age=(dob,on)=>{let y=on.getFullYear()-dob.getFullYear(),m=on.getMonth()-dob.getMonth(),d=on.getDate()-dob.getDate();
 if(d<0){m--;d+=new Date(on.getFullYear(),on.getMonth(),0).getDate();}if(m<0){y--;m+=12;}
 const days=Math.round((on-dob)/864e5);let nb=new Date(on.getFullYear(),dob.getMonth(),dob.getDate());if(nb<on)nb.setFullYear(on.getFullYear()+1);
 return{y,m,d,days,weeks:Math.floor(days/7),next:Math.round((nb-on)/864e5)};};
(function(){
 const D=$('#agDob'),O=$('#agOn'),t=new Date();
 O.value=t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0');
 function run(){const dob=new Date(D.value+'T00:00:00'),on=new Date(O.value+'T00:00:00');
  const ok=!isNaN(dob)&&!isNaN(on)&&dob<=on;
  if(!ok){['agBig','agY','agM','agD','agDays','agWeeks','agNext'].forEach(i=>setText(i,'—'));setText('agBig','Check the dates');return;}
  const a=calc.age(dob,on);setText('agBig',a.y+' yrs '+a.m+' mo '+a.d+' d');setText('agY',a.y);setText('agM',a.m);setText('agD',a.d);
  setText('agDays',inr0.format(a.days));setText('agWeeks',inr0.format(a.weeks));setText('agNext',a.next===0?'Today 🎉':a.next+' days');}
 [D,O].forEach(e=>e.addEventListener('input',run));run();
})();
