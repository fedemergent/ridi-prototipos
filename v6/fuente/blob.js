
/* Logo RIDI: blobs que se funden, giran, se difuminan y reaparecen */
(function(){
  const host=$$('.blobmk');if(!host.length)return;
  const COL=['#8a98ff','#62d3a8','#f0b56d','#8a98ff','#62d3a8','#f0b56d'];
  const R0=[11,12.5,11.5,12,11,12.5],RO=[30,26,32,27,31,28];
  const NS='http://www.w3.org/2000/svg';
  const inst=host.map(h=>{
    const s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 100 100');s.setAttribute('aria-hidden','true');
    const g=document.createElementNS(NS,'g');g.setAttribute('filter','url(#blobGoo)');
    const cs=COL.map(c=>{const e=document.createElementNS(NS,'circle');e.setAttribute('fill',c);g.appendChild(e);return e});
    s.appendChild(g);h.appendChild(s);return {g,cs};
  });
  const blur=$('#blobBlur');
  const T=8.6,TAU=Math.PI*2;
  const ease=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
  const cl=u=>Math.max(0,Math.min(1,u));
  function st(t){
    let orbit=1,ang=0,op=1,bl=3.2,pulse=0;
    if(t<1){orbit=1;ang=0}
    else if(t<3.8){const u=ease(cl((t-1)/2.8));orbit=1-u;ang=u*2*TAU}
    else if(t<4.7){orbit=0;ang=2*TAU;pulse=Math.sin((t-3.8)/.9*Math.PI)}
    else if(t<6){const u=ease(cl((t-4.7)/1.3));orbit=0;ang=2*TAU;op=1-u;bl=3.2+u*6.5}
    else if(t<6.5){orbit=0;ang=2*TAU;op=0;bl=9.7}
    else{const u=ease(cl((t-6.5)/2.1));orbit=u;ang=2*TAU+(1-u)*-1.2;op=cl(u*1.8);bl=9.7-Math.min(1,u*1.4)*6.5}
    return {orbit,ang,op,bl,pulse};
  }
  function paint(t){
    const p=st(t);
    if(blur)blur.setAttribute('stdDeviation',p.bl.toFixed(2));
    for(const it of inst){
      it.g.style.opacity=p.op.toFixed(3);
      it.cs.forEach((c,i)=>{
        const a=i*TAU/6+p.ang+Math.sin(t*1.3+i)*.05;
        const rho=RO[i]*p.orbit+Math.sin(t*1.7+i*2)*1.1*p.orbit;
        const r=R0[i]*(1+.8*(1-p.orbit)+.12*p.pulse);
        c.setAttribute('cx',(50+Math.cos(a)*rho).toFixed(2));
        c.setAttribute('cy',(50+Math.sin(a)*rho).toFixed(2));
        c.setAttribute('r',r.toFixed(2));
      });
    }
  }
  if(RM){paint(.5);return}
  let t0=performance.now(),raf=0,on=true;
  function loop(now){raf=requestAnimationFrame(loop);paint(((now-t0)/1000)%T)}
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){cancelAnimationFrame(raf);on=false}else if(!on){on=true;raf=requestAnimationFrame(loop)}
  });
  raf=requestAnimationFrame(loop);
})();
