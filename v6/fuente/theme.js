
/* Modo día / modo noche */
(function(){
  const btns=$$('[data-theme-btn]');let m='light';
  try{m=localStorage.getItem('ridi-theme')==='dark'?'dark':'light'}catch(e){}
  function apply(v){
    m=v;root.setAttribute('data-ridi',v);root.style.colorScheme=v;
    btns.forEach(b=>{b.setAttribute('aria-pressed',v==='dark');b.setAttribute('aria-label',v==='dark'?'Cambiar a modo día':'Cambiar a modo noche')});
    try{localStorage.setItem('ridi-theme',v)}catch(e){}
  }
  btns.forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();apply(m==='dark'?'light':'dark')}));
  apply(m);
})();
