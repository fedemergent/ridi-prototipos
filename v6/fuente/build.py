import re, json, base64, sys
D='/tmp/claude-0/-home-claude/05294e5d-8020-5b38-9ddd-8e03e4810cc2/scratchpad/ridi6/'
rd=lambda f:open(D+f,encoding='utf-8').read()
s=rd('v5.html'); v4=rd('v4.html').split('\n')

# ---------- 1. paleta: naranja/cálido -> blanco/celeste/metal ----------
HEX={'ff7a1a':'3D8BFF','e8590c':'1D5FD6','c2410c':'1752C2','fff1e4':'E7F1FF','fff8f1':'F3F8FF','f5ece2':'E4EEFB',
 'ebe3da':'D8E3F2','d9d0c7':'C4CFDF','f4ede2':'EDF3FB','ffb066':'8FC1FF','ff9440':'5CA4FF','f26a0b':'1D5FD6','ffb38a':'A9CFFF',
 'ffe3cc':'D6E8FF','1b1612':'0D1B33','26201a':'14284A','3b352f':'2A3850','1d1a17':'0D1B33','4b4540':'3C4A62','7a7168':'5C6B85',
 '4a4a4a':'3C4A62','6b6b6b':'5C6B85','b92a12':'1752C2','dc3418':'3D8BFF','e8452a':'3D8BFF','8f1d0e':'0D1B33','5a0f07':'0A1426',
 '4a0e07':'0A1426','14a89a':'2F86F2'}
RGB={'40,20,5':'10,22,46','27,22,18':'13,27,51','255,122,26':'61,139,255'}
parts=re.split(r'(base64,[A-Za-z0-9+/=]+)',s)
for i in range(0,len(parts),2):
    t=parts[i]
    t=re.sub(r'#([0-9a-fA-F]{6})\b',lambda m:'#'+HEX.get(m.group(1).lower(),m.group(1)).upper() if m.group(1).lower() in HEX else m.group(0),t)
    for k,v in RGB.items(): t=t.replace('rgba('+k+',','rgba('+v+',')
    parts[i]=t
s=''.join(parts)

def sub1(old,new,cnt=1):
    global s
    assert s.count(old)>=1,('no encontrado',old[:60])
    s=s.replace(old,new,cnt)

sub1('<title>Sitio RIDI Versión 5</title>','<title>Sitio RIDI Versión 6</title>')

# ---------- 2. bienvenida V4 + banderas ----------
a=next(i for i,l in enumerate(v4) if l.strip().startswith('<svg class="bgrib"'))
b=next(i for i,l in enumerate(v4) if 'class="ends"' in l)
intro='\n'.join(v4[a:b+1])
intro=intro.replace(' class="dl"',' class="sk"')
for o,n in [('#3A9BE0','#2F86F2'),('#3a9be0','#2F86F2'),('#8ED0FF','#6FB2FF'),('#1F78C8','#1D5FD6')]: intro=intro.replace(o,n)
intro=intro.replace('stop-opacity=".32"','stop-opacity=".42"')
print('hex en intro:',sorted(set(re.findall(r'#[0-9A-Fa-f]{6}\b',intro))))
splash='''<!-- BIENVENIDA -->
<div class="splash" id="splash" role="dialog" aria-label="Bienvenida a RIDI">
  '''+intro.split('<svg class="bgrib"',1)[0]+'<svg class="bgrib"'+intro.split('<svg class="bgrib"',1)[1].split('<div class="sp-in">')[0]
# más simple: reconstruir explícitamente a partir de v4
def block(start_pat,end_pat):
    i=next(k for k,l in enumerate(v4) if start_pat in l); j=next(k for k,l in enumerate(v4) if end_pat in l and k>=i)
    return '\n'.join(v4[i:j+1])
bg=block('<svg class="bgrib"','</svg>') if False else None
lines=v4[a:b+1]
bgrib_end=next(i for i,l in enumerate(lines) if l.strip()=='</svg>')
bgrib='\n'.join(lines[:bgrib_end+1])
fus_start=next(i for i,l in enumerate(lines) if 'class="fusion"' in l)
fus_end=next(i for i,l in enumerate(lines) if l.strip()=='</button>' and i>fus_start)
fusion='\n'.join(lines[fus_start:fus_end+1]); ends=lines[-1]
rep=lambda t:t.replace(' class="dl"',' class="sk"').replace('#3A9BE0','#2F86F2').replace('#8ED0FF','#6FB2FF').replace('#1F78C8','#1D5FD6').replace('stop-opacity=".32"','stop-opacity=".42"')
bgrib,fusion,ends=rep(bgrib),rep(fusion),rep(ends)
splash='''<!-- BIENVENIDA -->
<div class="splash" id="splash" role="dialog" aria-label="Bienvenida a RIDI">
'''+bgrib+'''
  <div class="sp-in">
    <p class="sp-hello">Bienvenido a</p>
'''+fusion+'\n'+ends+'''
    <p class="sp-sub" id="spSub">Red Iberoamericana de Diseño Industrial</p>
    <button class="btn pri sp-enter" id="spEnter" type="button">Entrar al sitio <svg class="ic"><use href="#i-arr"/></svg></button>
  </div>
  <div class="flags" id="flags" role="img" aria-label="Banderas de los países de la red, en orden alfabético"><div class="trk" id="flTrk"></div></div>
</div>

'''
i=s.index('<!-- BIENVENIDA -->'); j=s.index('<!-- BARRA DE ACCESOS -->')
goo='''<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><filter id="blobGoo" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur id="blobBlur" in="SourceGraphic" stdDeviation="3.2" result="b"/><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"/></filter></defs></svg>

'''
s=s[:i]+goo+splash+s[j:]

# ---------- 3. logo blob ----------
pat=re.compile(r'<span class="mark" aria-hidden="true"><svg viewBox="0 0 32 32">.*?<b>RIDI</b></span>',re.S)
ms=list(pat.finditer(s)); assert len(ms)==2,len(ms)
s=s[:ms[1].start()]+'<span class="mark" aria-hidden="true"><span class="blobmk lg"></span><b>RIDI</b></span>'+s[ms[1].end():]
s=s[:ms[0].start()]+'<span class="mark" aria-hidden="true"><span class="blobmk"></span><b>RIDI</b></span>'+s[ms[0].end():]
sub1('<div class="member rv">\n        <div>\n          <div class="eyebrow">','<div class="member rv">\n        <div>\n          <span class="blobmk xl" aria-hidden="true"></span>\n          <div class="eyebrow">')

sub1('<!-- BARRA DE ACCESOS -->','<div class="utilw" id="utilw"><div class="ubox">\n<div class="hflags" id="hFlags" role="img" aria-label="Banderas de los países de la red, en orden alfabético"></div>\n<!-- BARRA DE ACCESOS -->')
sub1('<!-- CABECERA -->','</div></div>\n<!-- CABECERA -->')
BTN=rd('themebtn.html').strip()
sub1('<button class="burger"',BTN.replace('@@','')+'<button class="burger"')
sub1('<div class="sp-in">\n    <p class="sp-hello">',BTN.replace('@@',' sp')+'\n  <div class="sp-in">\n    <p class="sp-hello">')
# ---------- 4. menú ----------
sub1('<a href="#equipo">Equipo</a>','<a href="#equipo">Equipo</a>\n      <a href="#miembros">Miembros</a>')
sub1('<a href="#equipo">Equipo <svg class="ic"><use href="#i-arr"/></svg></a>','<a href="#equipo">Equipo <svg class="ic"><use href="#i-arr"/></svg></a>\n      <a href="#miembros">Miembros <svg class="ic"><use href="#i-arr"/></svg></a>')

# ---------- 5. sección de miembros ----------
sec='''    <!-- MIEMBROS -->
  <section class="band mm-band" id="miembros"><div class="w">
    <div class="sh rv"><div><div class="eyebrow"><i></i>Miembros</div><h2 style="margin-top:14px">Una red que cruza el Atlántico</h2></div></div>
    <p class="mm-lead rv">Recorre el mapa: acerca el cursor (o toca) un país resaltado para ver cuántos miembros tiene y entra a su red de perfiles destacados. Perfiles y cifras de ejemplo.</p>
    <div class="mm rv" id="mm">
      <div class="mm-stage" id="mmStage">
        <canvas id="mmCv" role="img" aria-label="Mapa mundial de píxeles con los países de la red iberoamericana resaltados en azul"></canvas>
        <svg class="mm-tent" id="mmTent" aria-hidden="true"></svg>
        <div class="mm-avs" id="mmAvs"></div>
        <div class="mm-tip" id="mmTip" role="status" aria-live="polite"></div>
      </div>
      <div class="mm-card" id="mmCard" hidden></div>
      <div class="mm-bar">
        <div class="mm-info" id="mmInfo" aria-live="polite"></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm pri" id="mmOpen" type="button" disabled>Ver miembros</button><button class="btn sm" id="mmBack" type="button" hidden>← Volver al mapa</button></div>
      </div>
      <div class="mm-chips" id="mmChips" role="group" aria-label="Elegir un país de la red"></div>
      <div class="mm-dir" id="mmDir" hidden>
        <div class="dh"><h3 id="mmDirT">Miembros</h3><input id="mmQ" type="search" placeholder="Buscar por nombre, área o ciudad" aria-label="Buscar miembros"></div>
        <ul id="mmList"></ul>
        <div class="more2"><button class="btn sm" id="mmMore" type="button" aria-expanded="false">Ver todos</button></div>
      </div>
    </div>
  </div></section>

'''
sub1('    <!-- PROYECTOS -->',sec+'    <!-- PROYECTOS -->')

# ---------- 6. JS ----------
fl=json.load(open(D+'FL.json'))
AD='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><path fill="#10069f" d="M0 0h213.3v480H0z"/><path fill="#fedf00" d="M213.3 0h213.4v480H213.3z"/><path fill="#d50032" d="M426.7 0H640v480H426.7z"/><path fill="#fedf00" stroke="#8a6a00" stroke-width="3" d="M268 170h104v96c0 38-30 62-52 72-22-10-52-34-52-72z"/><path fill="#d50032" d="M320 174h48v90c0 30-22 50-48 62z"/><path fill="#fff" opacity=".0" d="M0 0"/><path fill="#d50032" d="M272 174h48v152c-26-12-48-32-48-62z" opacity=".0"/><path fill="#d50032" d="M272 220h48v8h-48zM272 244h48v8h-48z"/></svg>'
fl['AD']=AD
fl={k:(v if 'xmlns=' in v else v.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ',1)) for k,v in fl.items()}
FLG={k:'data:image/svg+xml;base64,'+base64.b64encode(v.encode()).decode() for k,v in fl.items()}
NAMES={'AD':'Andorra','AR':'Argentina','BO':'Bolivia','BR':'Brasil','CL':'Chile','CO':'Colombia','CR':'Costa Rica','CU':'Cuba','DO':'República Dominicana','EC':'Ecuador','SV':'El Salvador','ES':'España','GT':'Guatemala','HN':'Honduras','MX':'México','NI':'Nicaragua','PA':'Panamá','PY':'Paraguay','PE':'Perú','PT':'Portugal','UY':'Uruguay','VE':'Venezuela'}
fl={k:v.replace('<svg ','<svg preserveAspectRatio="none" ',1) for k,v in fl.items()}
FLG={k:'data:image/svg+xml;base64,'+base64.b64encode(v.encode()).decode() for k,v in fl.items()}
assert set(NAMES)==set(FLG),set(NAMES)^set(FLG)
import locale
def key(n):
    return n.lower().replace('á','a').replace('é','e').replace('í','i').replace('ó','o').replace('ú','u')
order=sorted(NAMES.items(),key=lambda kv:key(kv[1]))
print([n for _,n in order])
gr=json.load(open(D+'GR.json'))
glob='const FLG='+json.dumps(FLG,separators=(',',':'))+';\nconst FLORD='+json.dumps(order,ensure_ascii=False,separators=(',',':'))+';\n'

intro_js='''/* Bienvenida: del boceto artesanal a la cinta industrial + banderas */
(function(){
  const splash=$('#splash'),fu=$('#spStage'),tC=$('#tC'),tI=$('#tI');let gone=false,raf=0,moved=false;
  const trk=$('#flTrk'),fw=$('#flags');
  const mk=(iso,nm,dup)=>'<img src="'+FLG[iso]+'" alt="'+(dup?'':nm)+'" '+(dup?'aria-hidden="true" class="dup"':'')+' width="34" height="25" decoding="async">';
  trk.innerHTML=FLORD.map(f=>mk(f[0],f[1],0)).join('');
  
  $('#hFlags').innerHTML=FLORD.map(f=>'<img src="'+FLG[f[0]]+'" alt="" decoding="async">').join('');
  if(RM){fw.classList.add('still')}
  if(RM)$$('animateTransform',splash).forEach(n=>n.remove());
  let x=0,tx=0,over=false,drag=0,t0=performance.now();
  const ease=u=>u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
  function auto(ms){
    const T=13000,t=(ms%T)/1000;
    if(t<1.6)return 0; if(t<6.4)return ease((t-1.6)/4.8)*100; if(t<8.2)return 100; if(t<12.4)return 100-ease((t-8.2)/4.2)*100; return 0;
  }
  function frame(now){
    if(gone)return;raf=requestAnimationFrame(frame);
    const ms=now-t0;
    if(over){x+=(tx-x)*.18}
    else{const a=RM?100:auto(ms+300);x+=(a-x)*(over?.2:.12)}
    const v=Math.max(0,Math.min(100,x));
    fu.style.setProperty('--x',v.toFixed(2)+'%');
    tC.style.opacity=(1-v/100*.7).toFixed(2);tI.style.opacity=(.3+v/100*.7).toFixed(2);
  }
  function pos(e){const b=fu.getBoundingClientRect();tx=Math.max(0,Math.min(100,(e.clientX-b.left)/b.width*100))}
  fu.addEventListener('pointerenter',e=>{over=true;pos(e)});
  fu.addEventListener('pointermove',e=>{over=true;pos(e);if(e.pointerType==='touch'&&e.buttons)moved=true});
  fu.addEventListener('pointerdown',e=>{over=true;moved=false;drag=e.clientX;pos(e)});
  fu.addEventListener('pointerleave',()=>{over=false});
  fu.addEventListener('pointerup',e=>{if(e.pointerType==='touch'){setTimeout(()=>{over=false},1200)}});
  function enter(){
    if(gone)return;gone=true;cancelAnimationFrame(raf);splash.classList.add('out');root.classList.remove('lock');
    setTimeout(()=>{splash.hidden=true},750);scrollTo(0,0);
  }
  fu.addEventListener('click',e=>{if(moved||Math.abs(e.clientX-drag)>10){e.preventDefault();moved=false;return}enter()});
  $('#spEnter').addEventListener('click',enter);
  setTimeout(()=>{$('#spSub').classList.add('on');$('#spEnter').classList.add('on')},RM?0:1800);
  setTimeout(()=>splash.classList.add('drawn'),RM?0:3300);
  raf=requestAnimationFrame(frame);
  $('#spEnter').focus({preventScroll:true});
})();

'''
i=s.index('/* Bienvenida: tótem tejido */'); j=s.index('/* Secciones desplegables */')
s=s[:i]+glob+intro_js+s[j:]
mapjs=rd('map.js').replace('__GR__',json.dumps(gr,ensure_ascii=False,separators=(',',':'))).replace("  const FLG=__FLG__;\n",'')
assert '__FLG__' not in mapjs
k=s.rindex('</script>')
s=s[:k]+rd('blob.js')+rd('util.js')+rd('theme.js')+mapjs+s[k:]

# ---------- 7. CSS ----------
k=s.index('</style>',s.index('/* ===== motivos tejidos en el sitio ===== */'))
s=s[:k]+rd('extra.css')+rd('extra2.css')+rd('dark.css')+s[k:]

open(D+'ridi6.html','w',encoding='utf-8').write(s)
print('ok',len(s)/1e6,'MB')
