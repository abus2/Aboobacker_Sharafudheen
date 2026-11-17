calc.wordcount=(t)=>{
  const words=(t.trim().match(/\S+/g)||[]).length;
  return{words,chars:t.length,nosp:t.replace(/\s/g,'').length,sent:(t.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g)||[]).filter(s=>s.trim()).length,para:t.split(/\n\s*\n/).filter(s=>s.trim()).length};
 };
 (function(){
  const T=$('#wcText');
  const dur=w=>{const s=Math.round(w*60);return s<60?s+' sec':Math.floor(s/60)+' min '+(s%60)+' sec';};
  function run(){
   const r=calc.wordcount(T.value);
   setText('wcBig',inr0.format(r.words));setText('wcChars',inr0.format(r.chars));setText('wcNoSp',inr0.format(r.nosp));setText('wcSent',r.sent);setText('wcPara',r.para);
   setText('wcRead',dur(r.words/200));setText('wcSpeak',dur(r.words/130));
  }
  T.addEventListener('input',run);
  $('#wcClear').addEventListener('click',()=>{T.value='';run();T.focus();});
  run();
 })();
