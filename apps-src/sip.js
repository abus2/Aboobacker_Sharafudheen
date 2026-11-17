 calc.sip=(monthly,lump,annual,years)=>{
  const r=annual/12/100,n=Math.round(years*12);const rows=[];let bal=lump,inv=lump;
  rows.push({y:0,inv:lump,val:lump});
  for(let m=1;m<=n;m++){bal=bal*(1+r)+monthly;inv+=monthly;if(m%12===0||m===n)rows.push({y:m/12,inv,val:bal});}
  return{value:bal,invested:inv,gain:bal-inv,rows};
 };
 (function(){
  const M=$('#sipM'),Mr=$('#sipMr'),L=$('#sipL'),I=$('#sipI'),Ir=$('#sipIr'),Y=$('#sipY'),Yr=$('#sipYr');
  function chart(rows){
   const W=520,H=230,pad={l:46,r:12,t:12,b:26};const max=Math.max(...rows.map(r=>r.val),1),maxY=rows[rows.length-1].y||1;
   const X=y=>pad.l+(y/maxY)*(W-pad.l-pad.r),Yp=v=>H-pad.b-(v/max)*(H-pad.t-pad.b);
   const line=k=>rows.map((r,i)=>(i?'L':'M')+X(r.y).toFixed(1)+' '+Yp(r[k]).toFixed(1)).join(' ');
   const area=line('val')+` L${X(maxY).toFixed(1)} ${H-pad.b} L${X(0)} ${H-pad.b} Z`;
   let grid='';for(let i=0;i<=4;i++){const v=max*i/4,y=Yp(v);const lab=v>=1e7?(v/1e7).toFixed(1)+'Cr':v>=1e5?(v/1e5).toFixed(1)+'L':v>=1e3?(v/1e3).toFixed(0)+'K':Math.round(v);
    grid+=`<line x1="${pad.l}" x2="${W-pad.r}" y1="${y}" y2="${y}" stroke="rgba(125,160,255,.18)"/><text x="${pad.l-6}" y="${y+3}" text-anchor="end" font-size="9" fill="#8fa2d0">${lab}</text>`;}
   const step=Math.max(1,Math.ceil(maxY/6));let xl='';for(let y=0;y<=maxY;y+=step)xl+=`<text x="${X(y)}" y="${H-8}" text-anchor="middle" font-size="9" fill="#8fa2d0">${y}y</text>`;
   $('#sipChart').innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Growth chart of invested amount and estimated value"><defs><linearGradient id="sg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3a6bff" stop-opacity=".5"/><stop offset="1" stop-color="#3a6bff" stop-opacity="0"/></linearGradient></defs>${grid}${xl}<path d="${area}" fill="url(#sg)"/><path d="${line('val')}" fill="none" stroke="#7da0ff" stroke-width="2.5" stroke-linejoin="round"/><path d="${line('inv')}" fill="none" stroke="#cfe0ff" stroke-width="1.6" stroke-dasharray="4 4"/></svg>`;
  }
  function run(){
   $('#sipMv').textContent=R0(num(M));$('#sipIv').textContent=num(I)+'% p.a.';$('#sipYv').textContent=num(Y)+' yr';
   const r=calc.sip(Math.max(num(M),0),Math.max(num(L),0),num(I),Math.max(num(Y),1));
   setText('sipBig',R0(r.value));setText('sipInv',R0(r.invested));setText('sipGain',R0(r.gain));setText('sipMult',(r.invested?r.value/r.invested:0).toFixed(2)+'×');
   chart(r.rows);
  }
  const link=(a,b)=>{a.addEventListener('input',()=>{b.value=a.value;run();});b.addEventListener('input',()=>{a.value=b.value;run();});};
  link(M,Mr);link(I,Ir);link(Y,Yr);L.addEventListener('input',run);run();
 })();
