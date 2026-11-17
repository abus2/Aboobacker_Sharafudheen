// Home page: render the featured projects from projects-data.js before the page scripts run.
(function(){
 const grid=document.getElementById('projectGrid');
 const data=window.PORTFOLIO_PROJECTS,R=window.PF_RENDER;
 if(!grid||!data||!R)return;
 grid.innerHTML=data.filter(p=>p.featured).map((p,i)=>R.renderCard(p,i)).join('');
 const total=document.getElementById('projectsTotal');
 if(total)total.textContent=data.length;
 document.querySelectorAll('[data-count-projects]').forEach(el=>el.dataset.count=data.length);
})();
