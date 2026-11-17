// Design 5 portfolio interactions + abstract 3D holographic core
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Loading screen
window.addEventListener('load',()=>setTimeout(()=>$('#loader')?.classList.add('done'),650));
$('#year').textContent=new Date().getFullYear();

// Mobile navigation
const nav=$('#nav');
$('#menuToggle').addEventListener('click',()=>nav.classList.toggle('open'));
$$('.nav-link').forEach(link=>link.addEventListener('click',()=>nav.classList.remove('open')));

// Scroll progress, header, back-to-top
const progress=$('#scrollProgress'),header=$('.site-header'),backTop=$('#backTop');
function onScroll(){
 const max=document.documentElement.scrollHeight-innerHeight;
 progress.style.width=(max>0?scrollY/max*100:0)+'%';
 header.classList.toggle('scrolled',scrollY>30);
 backTop.classList.toggle('show',scrollY>500);
}
addEventListener('scroll',onScroll,{passive:true});onScroll();
backTop.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));


// Reveal sections and animate skill meters
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
 if(entry.isIntersecting){entry.target.classList.add('visible');entry.target.querySelectorAll('.skill-row').forEach(row=>row.classList.add('visible'));revealObserver.unobserve(entry.target);}
}),{threshold:.12});
$$('.reveal').forEach(el=>revealObserver.observe(el));

// Active navigation
const sections=$$('main section[id]');
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
 if(entry.isIntersecting){$$('.nav-link').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));}
}),{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s=>sectionObserver.observe(s));

// Rotating role text
const roles=['Digital Marketing','Finance & Accounting','Business Development','Creative Thinking'];
let roleIndex=0;
if(!reduceMotion)setInterval(()=>{
 const el=$('#roleText');if(!el)return;
 el.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-7px)'}],{duration:180,fill:'forwards'}).onfinish=()=>{
  roleIndex=(roleIndex+1)%roles.length;el.textContent=roles[roleIndex];
  el.animate([{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:250,fill:'forwards'});
 };
},2600);

// Project filters
$$('.filter').forEach(btn=>btn.addEventListener('click',()=>{
 $$('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
 const filter=btn.dataset.filter;
 $$('.project-card').forEach(card=>{
  const show=filter==='all'||card.dataset.category===filter;
  card.classList.toggle('hide',!show);
 });
}));


// 
// V19 personal music player — import and play audio files selected by the visitor.
(function musicPlayer(){
 const audio=$('#portfolioAudio'),play=$('#musicPlay'),seek=$('#musicSeek'),list=$('#musicPlaylist');
 if(!audio||!play||!list)return;
 const tracks=[
  {title:'Midnight Drive',artist:'Demo instrumental • SoundHelix',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'},
  {title:'Neon Dreams',artist:'Demo instrumental • SoundHelix',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'},
  {title:'Focus Flow',artist:'Demo instrumental • SoundHelix',src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'}
 ];
 let index=0,localUrls=[];
 const title=$('#trackTitle'),artist=$('#trackArtist'),current=$('#musicCurrent'),duration=$('#musicDuration'),player=$('.music-player'),trackState=$('#trackState');
 const format=s=>{if(!Number.isFinite(s))return '0:00';return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');};
 function renderList(){
  list.innerHTML='';
  tracks.forEach((t,n)=>{
   const b=document.createElement('button');b.type='button';b.className='playlist-track'+(n===index?' active':'');b.dataset.track=n;
   const no=document.createElement('span');no.textContent=String(n+1).padStart(2,'0');
   const name=document.createElement('span');name.textContent=t.title;
   const meta=document.createElement('small');meta.textContent=t.local?'YOUR FILE':'AUDIO';
   b.append(no,name,meta);b.addEventListener('click',()=>load(n,true));list.appendChild(b);
  });
 }
 function load(i,autoplay=false){
  index=(i+tracks.length)%tracks.length;const t=tracks[index];
  title.textContent=t.title;artist.textContent=t.artist;audio.src=t.src;seek.value=0;current.textContent='0:00';duration.textContent='0:00';if(trackState)trackState.textContent='READY TO PLAY';
  $$('.playlist-track').forEach((b,n)=>{b.classList.toggle('active',n===index);b.setAttribute('aria-current',n===index?'true':'false');});
  if(autoplay)audio.play().catch(()=>{artist.textContent='Playback unavailable — choose another audio file';});
  else{audio.pause();play.textContent='▶';play.setAttribute('aria-label','Play music');}
 }
 play.addEventListener('click',()=>{
  if(audio.paused)audio.play().catch(()=>{artist.textContent='Choose an audio file or check your connection';});
  else audio.pause();
 });
 $('#musicPrev').addEventListener('click',()=>load(index-1,true));
 $('#musicNext').addEventListener('click',()=>load(index+1,true));
 audio.addEventListener('timeupdate',()=>{if(audio.duration){seek.value=audio.currentTime/audio.duration*100;current.textContent=format(audio.currentTime);duration.textContent=format(audio.duration);}});
 audio.addEventListener('loadedmetadata',()=>duration.textContent=format(audio.duration));
 audio.addEventListener('ended',()=>load(index+1,true));
 audio.addEventListener('play',()=>{play.textContent='Ⅱ';play.setAttribute('aria-label','Pause music');player?.classList.add('is-playing');if(trackState)trackState.textContent='NOW PLAYING';});
 audio.addEventListener('pause',()=>{play.textContent='▶';play.setAttribute('aria-label','Play music');player?.classList.remove('is-playing');if(trackState)trackState.textContent='PAUSED';});
 audio.addEventListener('error',()=>{if(!tracks[index]?.local){artist.textContent='Demo audio unavailable — add your own songs below';if(trackState)trackState.textContent='ADD YOUR MUSIC';}});
 seek.addEventListener('input',()=>{if(audio.duration)audio.currentTime=(Number(seek.value)/100)*audio.duration;});
 $('#musicVolume').addEventListener('input',e=>audio.volume=Number(e.target.value));
 const fileInput=$('#musicFiles');
 fileInput?.addEventListener('change',e=>{
  const files=[...e.target.files].filter(f=>f.type.startsWith('audio/')||/\.(mp3|m4a|wav|ogg|aac|flac)$/i.test(f.name));
  if(!files.length)return;
  audio.pause();localUrls.forEach(URL.revokeObjectURL);localUrls=[];
  tracks.splice(0,tracks.length);
  files.forEach(file=>{const src=URL.createObjectURL(file);localUrls.push(src);tracks.push({title:file.name.replace(/\.[^.]+$/,'').replace(/[_-]+/g,' '),artist:'Your music library',src,local:true});});
  index=0;renderList();load(0,false);
  $('#musicNote').textContent=files.length+' song'+(files.length===1?'':'s')+' loaded from your device. Select a track to play.';
  fileInput.value='';
 });
 audio.volume=.7;renderList();load(0,false);
 window.addEventListener('beforeunload',()=>localUrls.forEach(URL.revokeObjectURL));
})();

// V21: owner password gate for the Certificates section.



// V23: small floating music button that opens / closes the player popup.
(function musicPopup(){
 const fab=$('#musicFab'),pop=$('#musicPopup'),close=$('#musicClose'),widget=$('#musicWidget');
 if(!fab||!pop)return;
 const set=open=>{
  widget.classList.toggle('open',open);fab.setAttribute('aria-expanded',open);pop.setAttribute('aria-hidden',!open);
  fab.setAttribute('aria-label',open?'Close music player':'Open music player');
 };
 fab.addEventListener('click',()=>set(!widget.classList.contains('open')));
 close?.addEventListener('click',()=>{set(false);fab.focus();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&widget.classList.contains('open'))set(false);});
 document.addEventListener('pointerdown',e=>{if(widget.classList.contains('open')&&!widget.contains(e.target))set(false);});
 $('#musicPlay')?.closest('.music-player')&&document.getElementById('portfolioAudio')&&(()=>{
  const a=document.getElementById('portfolioAudio');
  a.addEventListener('play',()=>widget.classList.add('playing'));
  a.addEventListener('pause',()=>widget.classList.remove('playing'));
 })();
})();
