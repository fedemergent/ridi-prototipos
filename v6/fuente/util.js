
/* Barra de accesos colapsable: la franja de banderas y la barra se colapsan juntas; reaparecen al subir o al acercar el cursor al borde superior */
(function(){
  const w=$('#utilw'),u=$('.ubox',w);if(!w||!u)return;
  let uh=46,last=scrollY,peek=false;
  const meas=()=>{if(!peek){uh=u.offsetHeight||46;w.style.setProperty('--uh',uh+'px')}};
  meas();addEventListener('resize',meas);
  const set=v=>{if(v===peek)return;peek=v;w.classList.toggle('peek',v)};
  addEventListener('scroll',()=>{
    const y=scrollY,d=y-last;
    if(y<=uh){set(false)}
    else if(d<-8){set(true)}
    else if(d>8){set(false)}
    last=y;
  },{passive:true});
  addEventListener('pointermove',e=>{
    if(e.pointerType==='touch')return;
    if(scrollY>uh){if(e.clientY<44)set(true);else if(peek&&e.clientY>150)set(false)}
  },{passive:true});
  u.addEventListener('focusin',()=>{if(scrollY>uh)set(true)});
})();
