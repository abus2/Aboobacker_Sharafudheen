calc.utm=(url,tags)=>{
  url=url.trim();if(!url)return '';
  if(!/^https?:\/\//i.test(url))url='https://'+url;
  let hash='';const i=url.indexOf('#');if(i>-1){hash=url.slice(i);url=url.slice(0,i);}
  const q=Object.entries(tags).filter(([,v])=>v.trim()).map(([k,v])=>k+'='+encodeURIComponent(v.trim().replace(/\s+/g,'_')));
  if(!q.length)return url+hash;
  return url+(url.includes('?')?(/[?&]$/.test(url)?'':'&'):'?')+q.join('&')+hash;
 };
 (function(){
  const f={url:$('#utUrl'),utm_source:$('#utSrc'),utm_medium:$('#utMed'),utm_campaign:$('#utCmp'),utm_term:$('#utTerm'),utm_content:$('#utCnt')};
  function run(){
   const tags={};for(const k in f)if(k!=='url')tags[k]=f[k].value;
   const out=calc.utm(f.url.value,tags);
   setText('utOut',out||'—');
  }
  for(const k in f)f[k].addEventListener('input',run);
  $('#utCopy').addEventListener('click',()=>{const t=$('#utOut').textContent;if(t&&t!=='—')copy(t,'Link copied ✓');});
  run();
 })();
