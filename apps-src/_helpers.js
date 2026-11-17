const {$,$$,toast,reduce}=window.PF2;
 const inr=new Intl.NumberFormat('en-IN',{maximumFractionDigits:2,minimumFractionDigits:2});
 const inr0=new Intl.NumberFormat('en-IN',{maximumFractionDigits:0});
 const R=n=>'₹'+inr.format(Number.isFinite(n)?n:0), R0=n=>'₹'+inr0.format(Number.isFinite(n)?Math.round(n):0);
 const num=(el,d=0)=>{const v=parseFloat(el.value);return Number.isFinite(v)?v:d;};
 const copy=async(t,msg)=>{try{await navigator.clipboard.writeText(t);toast(msg||'Copied ✓');}catch(_){toast(t);}};
 const setText=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
 const calc=window.PF_CALC={};
