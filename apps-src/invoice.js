calc.invoice=(items,gst)=>{const sub=items.reduce((s,i)=>s+i.q*i.r,0),tax=sub*gst/100;return{sub,tax,total:sub+tax,half:tax/2};};
(function(){
 const g=id=>$('#'+id),ids=['ivFrom','ivTo','ivNo','ivGst'];
 const rows=[1,2,3,4].map(i=>[g('ivD'+i),g('ivQ'+i),g('ivR'+i)]);
 let text='';
 function run(){
  const items=rows.map(r=>({d:r[0].value.trim(),q:Math.max(num(r[1]),0),r:Math.max(num(r[2]),0)})).filter(i=>i.d&&i.q>0);
  const o=calc.invoice(items,Math.max(num(g('ivGst')),0));
  setText('ivBig',R(o.total));setText('ivSub',R(o.sub));setText('ivTax',R(o.tax));setText('ivC',R(o.half));setText('ivS',R(o.half));
  text=['INVOICE '+g('ivNo').value,'From: '+g('ivFrom').value,'To: '+g('ivTo').value,''].concat(items.map(i=>i.d+'  '+i.q+' x '+R(i.r)+' = '+R(i.q*i.r)),['','Subtotal: '+R(o.sub),'GST ('+num(g('ivGst'))+'%): '+R(o.tax),'TOTAL: '+R(o.total)]).join('\n');
  g('ivText').textContent=text;
 }
 [...ids.map(g),...rows.flat()].forEach(e=>e.addEventListener('input',run));
 g('ivCopy').addEventListener('click',()=>copy(text,'Invoice copied ✓'));g('ivPrint').addEventListener('click',()=>window.print());run();
})();
