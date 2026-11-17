calc.hike=(s,p)=>{const n=s*(1+p/100);return{n,inc:n-s,oy:s*12,ny:n*12,iy:(n-s)*12};};
(function(){
 const a=$('#hkS'),b=$('#hkP');
 function run(){const o=calc.hike(Math.max(num(a),0),num(b));setText('hkBig',R(o.n));setText('hkInc',R(o.inc));setText('hkOldY',R0(o.oy));setText('hkNewY',R0(o.ny));setText('hkIncY',R0(o.iy));}
 [a,b].forEach(e=>e.addEventListener('input',run));run();
})();
