 calc.gst=(amount,rate,mode)=>{
  let base,gst,total;
  if(mode==='add'){base=amount;gst=amount*rate/100;total=base+gst;}
  else{total=amount;base=amount/(1+rate/100);gst=total-base;}
  return{base,gst,total,half:gst/2};
 };
 (function(){
  let rate=18,mode='add';const amt=$('#gstAmount'),custom=$('#gstCustom');
  function run(){
   const r=calc.gst(Math.max(num(amt),0),rate,mode);
   setText('gstTotal',R(mode==='add'?r.total:r.base));
   setText('gstBigLabel',mode==='add'?'FINAL AMOUNT (INCL. GST)':'PRICE BEFORE GST');
   setText('gstBase',R(r.base));setText('gstTax',R(r.gst));setText('gstCgst',R(r.half));setText('gstSgst',R(r.half));setText('gstFinal',R(r.total));setText('gstRateShown',rate+'%');
  }
  $$('#gstRates button').forEach(b=>b.addEventListener('click',()=>{rate=+b.dataset.rate;custom.value='';$$('#gstRates button').forEach(x=>x.classList.toggle('active',x===b));run();}));
  custom.addEventListener('input',()=>{const v=parseFloat(custom.value);if(Number.isFinite(v)&&v>=0&&v<=100){rate=v;$$('#gstRates button').forEach(x=>x.classList.remove('active'));run();}});
  $$('#gstMode button').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;$$('#gstMode button').forEach(x=>x.classList.toggle('active',x===b));run();}));
  amt.addEventListener('input',run);
  $('#gstCopy').addEventListener('click',()=>copy(`Base ${$('#gstBase').textContent} | GST (${$('#gstRateShown').textContent}) ${$('#gstTax').textContent} | Total ${$('#gstFinal').textContent}`,'Result copied ✓'));
  run();
 })();
