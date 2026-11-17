/* pwa.js: installable app + app-style bottom tab bar + offline status. Safe on file:// (just skips the service worker). */
(function(){
  var $=function(s,r){return (r||document).querySelector(s)};
  var file=(location.pathname.split('/').pop()||'index.html');
  // 1. Service worker (needs https or localhost)
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
    window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})});
  }
  function toast(m){var t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';t.setAttribute('role','status');document.body.appendChild(t)}
    t.textContent=m;t.classList.add('show');clearTimeout(window.__pt);window.__pt=setTimeout(function(){t.classList.remove('show')},2600)}
  // 2. Bottom tab bar (shown on phones / when installed, via mobile.css)
  var tabs=[['index.html','⌂','Home'],['apps.html','▦','Apps'],['tally.html','₹','Accounts'],['certificates.html','✓','Certs'],['index.html#contact','✉','Contact']];
  var bar=document.createElement('nav');bar.className='tabbar';bar.setAttribute('aria-label','App navigation');
  bar.innerHTML=tabs.map(function(t){var f=t[0].split('#')[0];var on=(f===file||(file===''&&f==='index.html'))&&t[0].indexOf('#')<0;
    return '<a href="'+t[0]+'"'+(on?' class="on" aria-current="page"':'')+'><i aria-hidden="true">'+t[1]+'</i><span>'+t[2]+'</span></a>'}).join('');
  document.body.appendChild(bar);document.body.classList.add('has-tabbar');
  // 3. Wide tables scroll sideways instead of breaking the layout
  document.querySelectorAll('table').forEach(function(t){var p=t.parentElement;
    if(p&&!p.classList.contains('tbl-scroll')&&getComputedStyle(p).overflowX==='visible'){var w=document.createElement('div');w.className='tbl-scroll';p.insertBefore(w,t);w.appendChild(t)}});
  // 4. Install prompt
  var standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
  var dp=null,ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  function banner(msg,btn,fn){if(standalone||sessionStorage.getItem('pwa-x'))return;
    var b=document.createElement('div');b.className='install-banner';
    b.innerHTML='<span>'+msg+'</span>'+(btn?'<button type="button" class="ib-go">'+btn+'</button>':'')+'<button type="button" class="ib-x" aria-label="Dismiss">✕</button>';
    document.body.appendChild(b);
    $('.ib-x',b).onclick=function(){b.remove();try{sessionStorage.setItem('pwa-x','1')}catch(e){}};
    if(btn)$('.ib-go',b).onclick=function(){b.remove();fn()}}
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;
    banner('Install this as an app on your phone','Install',function(){dp.prompt();dp.userChoice.then(function(){dp=null})})});
  window.addEventListener('appinstalled',function(){toast('App installed ✓')});
  if(ios&&!standalone&&location.protocol!=='file:')setTimeout(function(){banner('Install: tap Share, then “Add to Home Screen”')},2500);
  // 5. Offline status
  window.addEventListener('offline',function(){toast('You are offline. Saved data and cached pages still work.')});
  window.addEventListener('online',function(){toast('Back online')});
})();
