 calc.profit=(cost,sell)=>{const p=sell-cost;return{profit:p,onCost:cost?p/cost*100:0,margin:sell?p/sell*100:0};};
 calc.priceForMargin=(cost,margin)=>margin>=100?NaN:cost/(1-margin/100);
 (function(){
  const C=$('#pfCost'),S=$('#pfSell'),T=$('#pfTarget'),Q=$('#pfQty');
  function run(){
   const cost=Math.max(num(C),0),sell=Math.max(num(S),0),qty=Math.max(num(Q,1),1);const r=calc.profit(cost,sell);
   const box=$('#pfBigBox');box.classList.toggle('profit',r.profit>0);box.classList.toggle('loss',r.profit<0);
   setText('pfLabel',r.profit<0?'LOSS PER UNIT':r.profit>0?'PROFIT PER UNIT':'BREAK-EVEN');
   setText('pfBig',R(Math.abs(r.profit)));setText('pfMarkup',r.onCost.toFixed(2)+'%');setText('pfMargin',r.margin.toFixed(2)+'%');
   setText('pfTotal',(r.profit<0?'−':'')+R(Math.abs(r.profit*qty)));setText('pfRev',R(sell*qty));
   const t=Math.min(Math.max(num(T),0),99.99),price=calc.priceForMargin(cost,t);
   setText('pfReq',R(price));setText('pfReqProfit',R(price-cost));
  }
  [C,S,T,Q].forEach(e=>e.addEventListener('input',run));run();
 })();
