calc.marketing=(s,rev,imp,clk,cv)=>{const d=(a,b)=>b>0?a/b:null;return{ctr:d(clk*100,imp),cpc:d(s,clk),cpm:d(s*1000,imp),cr:d(cv*100,clk),cpa:d(s,cv),roas:d(rev,s),roi:d((rev-s)*100,s)};};
 (function(){
  const ids=['mkSpend','mkRev','mkImp','mkClk','mkConv'].map(i=>$('#'+i));
  const m=(x)=>x===null?'—':R(x),p=(x)=>x===null?'—':x.toFixed(2)+'%';
  function run(){
   const [s,rev,imp,clk,cv]=ids.map(e=>Math.max(num(e),0));
   const r=calc.marketing(s,rev,imp,clk,cv);
   setText('mkBig',r.roas===null?'—':r.roas.toFixed(2)+'×');
   setText('mkCTR',p(r.ctr));setText('mkCPC',m(r.cpc));setText('mkCPM',m(r.cpm));setText('mkCR',p(r.cr));setText('mkCPA',m(r.cpa));setText('mkROI',p(r.roi));
  }
  ids.forEach(e=>e.addEventListener('input',run));run();
 })();
