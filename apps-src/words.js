calc.words=(amount)=>{
  const ones=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  const two=n=>n<20?ones[n]:tens[Math.floor(n/10)]+(n%10?' '+ones[n%10]:'');
  const three=n=>{const h=Math.floor(n/100),r=n%100;return (h?ones[h]+' Hundred'+(r?' ':''):'')+(r?two(r):'');};
  const whole=n=>{
   if(n===0)return 'Zero';
   const parts=[],cr=Math.floor(n/1e7),lk=Math.floor(n%1e7/1e5),th=Math.floor(n%1e5/1e3),rest=n%1e3;
   if(cr)parts.push(three(cr)+' Crore');if(lk)parts.push(two(lk)+' Lakh');if(th)parts.push(two(th)+' Thousand');if(rest)parts.push(three(rest));
   return parts.join(' ');
  };
  const cents=Math.round(amount*100),rs=Math.floor(cents/100),ps=cents%100;
  let t='Rupees '+whole(rs);if(ps)t+=' and '+two(ps)+' Paise';
  return t+' Only';
 };
 (function(){
  const A=$('#wdAmt');
  function run(){
   const a=num(A,-1);
   if(a<0||a>99999999999.99){setText('wdOut','—');setText('wdFmt','—');return;}
   setText('wdOut',calc.words(a));setText('wdFmt','₹'+inr.format(a));
  }
  A.addEventListener('input',run);
  $('#wdCopy').addEventListener('click',()=>{const t=$('#wdOut').textContent;if(t&&t!=='—')copy(t,'Words copied ✓');});
  run();
 })();
