// Makes every "Download" button save a file in any browser, even when the site is opened
// straight from a folder (file://), where the plain <a download> attribute does nothing.
(function(){
 function toast(m){try{window.PF2.toast(m);}catch(_){}}
 document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[download],a[data-dl]');if(!a)return;
  var m=(a.getAttribute('href')||'').match(/downloads\/([^\/?#]+)\.html$/);if(!m)return;
  var key=a.getAttribute('data-dl')||m[1],html=window.PF_DOWNLOADS&&window.PF_DOWNLOADS[key];
  if(typeof html!=='string')return;          // no embedded copy: let the browser handle the link
  e.preventDefault();
  try{
   var url=URL.createObjectURL(new Blob([html],{type:'text/html'})),d=document.createElement('a');
   d.href=url;d.download=m[1]+'.html';document.body.appendChild(d);d.click();d.remove();
   setTimeout(function(){URL.revokeObjectURL(url);},2000);toast('Download started ✓');
  }catch(_){location.href=a.getAttribute('href');}
 });
})();
