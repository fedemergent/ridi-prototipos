
/* ===== Mapa interactivo de miembros (datos ficticios) ===== */
(function(){
  const GR=__GR__;
  const FLG=__FLG__;
  const IBC={A:['AR','Argentina'],B:['BO','Bolivia'],C:['BR','Brasil'],D:['CL','Chile'],E:['CO','Colombia'],F:['CR','Costa Rica'],G:['CU','Cuba'],H:['DO','República Dominicana'],I:['EC','Ecuador'],J:['SV','El Salvador'],K:['ES','España'],L:['GT','Guatemala'],M:['HN','Honduras'],N:['MX','México'],O:['NI','Nicaragua'],P:['PA','Panamá'],Q:['PY','Paraguay'],R:['PE','Perú'],S:['PT','Portugal'],T:['UY','Uruguay'],U:['VE','Venezuela']};
  const ISO2L={};for(const L in IBC)ISO2L[IBC[L][0]]=L;
  const CNT={BR:100,MX:88,ES:72,AR:68,CO:64,PE:52,CL:49,VE:44,EC:41,BO:38,GT:36,PT:33,DO:30,PY:28,CU:27,HN:26,PA:25,CR:24,NI:23,SV:22,UY:21};
  const TOUR=Object.keys(IBC).sort((a,b)=>IBC[a][1].localeCompare(IBC[b][1],'es'));
  const flag=iso=>FLG[iso]||'';

  const stage=$('#mmStage'),cv=$('#mmCv'),tent=$('#mmTent'),avs=$('#mmAvs'),tip=$('#mmTip'),info=$('#mmInfo'),
        bOpen=$('#mmOpen'),bBack=$('#mmBack'),chips=$('#mmChips'),card=$('#mmCard'),dir=$('#mmDir'),mm=$('#mm');
  const ctx=cv.getContext('2d');

  /* ---------- generador de miembros ficticios ---------- */
  const rng=seed=>{let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}};
  const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
  const FN_ES=['Camila','Mateo','Valentina','Santiago','Sofía','Diego','Lucía','Andrés','Isabela','Joaquín','Mariana','Sebastián','Paula','Tomás','Daniela','Felipe','Carolina','Nicolás','Ana','Rafael','Gabriela','Emilio','Renata','Bruno','Elena','Iván','Lorena','Pablo','Natalia','Hugo','Julia','Martín','Fernanda','Rodrigo','Adriana','Gonzalo','Alejandra','Mauro','Inés','Ricardo'];
  const FN_PT=['João','Beatriz','Pedro','Marta','Tiago','Inês','Rui','Catarina','Gabriel','Larissa','Lucas','Helena','Rafaela','Bruno','Camila','Henrique','Mariana','Diogo','Carolina','Felipe'];
  const LN_ES=['Rojas','Mendoza','Quispe','Herrera','Salazar','Vargas','Cabrera','Ortega','Paredes','Medina','Aguirre','Navarro','Castillo','Lara','Ibáñez','Morales','Fuentes','Sandoval','Peralta','Villarreal','Ríos','Duarte','Cornejo','Bravo','Suárez','Montes','Cárdenas','Ledesma','Arce','Valdivia','Zamora','Acosta'];
  const LN_PT=['Silva','Costa','Ferreira','Almeida','Pereira','Carvalho','Ribeiro','Gomes','Martins','Teixeira','Moreira','Lopes','Barros','Nunes'];
  const CITY={AR:['Buenos Aires','Córdoba','Rosario'],BO:['La Paz','Santa Cruz','Cochabamba'],BR:['São Paulo','Curitiba','Rio de Janeiro'],CL:['Santiago','Valparaíso','Concepción'],CO:['Bogotá','Medellín','Cali'],CR:['San José','Heredia'],CU:['La Habana','Santiago de Cuba'],DO:['Santo Domingo','Santiago'],EC:['Quito','Guayaquil','Cuenca'],ES:['Madrid','Barcelona','Valencia'],GT:['Ciudad de Guatemala','Antigua'],HN:['Tegucigalpa','San Pedro Sula'],MX:['Ciudad de México','Guadalajara','Monterrey'],NI:['Managua','León'],PA:['Ciudad de Panamá','Colón'],PE:['Lima','Arequipa','Cusco'],PT:['Lisboa','Oporto'],PY:['Asunción','Encarnación'],SV:['San Salvador','Santa Ana'],UY:['Montevideo','Colonia'],VE:['Caracas','Maracaibo']};
  const ROLES=['Diseño de producto','Mobiliario y espacios','Packaging sostenible','Biomateriales','Diseño de servicios','Movilidad y transporte','Calzado y textil','Diseño médico','Modelado 3D y prototipado','Docencia e investigación','Cerámica y vidrio','Joyería y objetos','Electrónica de consumo','Diseño para la manufactura'];
  const FOCO=['trabaja con talleres locales y manufactura regional','colabora con estudios de la red en proyectos de exportación','combina docencia e investigación en materiales','impulsa el prototipado rápido y la producción en serie','explora procesos artesanales aplicados a la industria','desarrolla productos con enfoque de economía circular'];
  const BGS=[['#5CA8FF','#CFE6FF'],['#7C8CFF','#D5DAFF'],['#5ED3B0','#C6F1E3'],['#FFB86B','#FFE2BD'],['#C79BFF','#EAD8FF'],['#FF9AA8','#FFD3D9'],['#8FC1FF','#E7F1FF'],['#9AA4B2','#E4E8EE']];
  const SKIN=['#F6D2B4','#E7B38B','#CF9366','#A66A43','#7A4A2B','#F0C29C'];
  const HAIR=['#17171B','#35261C','#5E3B20','#9B6A38','#C7A46B','#6C727C'];
  const CLOTH=['#0D1B33','#1D5FD6','#2A3850','#3D8BFF','#14284A','#5C6B85'];
  function avatar(seed){
    const r=rng(seed),pk=a=>a[Math.floor(r()*a.length)];
    const bg=pk(BGS),sk=pk(SKIN),hr=pk(HAIR),cl=pk(CLOTH),hs=Math.floor(r()*6),gl=r()<.3,sm=r()<.8;
    let s='<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="64" height="64" fill="'+bg[0]+'"/><circle cx="47" cy="14" r="23" fill="'+bg[1]+'" opacity=".6"/>';
    if(hs===1||hs===4)s+='<path d="M16 36c0-15 6-22 16-22s16 7 16 22v16H16z" fill="'+hr+'"/>';
    s+='<path d="M7 64c0-12 10-17 25-17s25 5 25 17z" fill="'+cl+'"/><path d="M27 38h10v10c0 3-10 3-10 0z" fill="'+sk+'"/><path d="M27 43c3 3 7 3 10 0v-3H27z" fill="#000" opacity=".12"/>';
    s+='<ellipse cx="32" cy="29" rx="11" ry="12.5" fill="'+sk+'"/>';
    if(hs===0||hs===1||hs===4)s+='<path d="M20.2 29c-1.4-11 5-17 12-17s13.5 6 11.8 17c-1.6-5-4.6-8.6-11.8-8.6s-9.6 3.6-12 8.6z" fill="'+hr+'"/>';
    if(hs===2)s+='<circle cx="32" cy="11.5" r="5.5" fill="'+hr+'"/><path d="M20.4 28c-.8-10 5-15 11.6-15s12.4 5 11.6 15c-2-5-5.2-7.6-11.6-7.6S22.4 23 20.4 28z" fill="'+hr+'"/>';
    if(hs===3)s+='<g fill="'+hr+'"><circle cx="22" cy="23" r="5.5"/><circle cx="28" cy="17.5" r="6"/><circle cx="36" cy="17.5" r="6"/><circle cx="42" cy="23" r="5.5"/><circle cx="32" cy="19" r="6"/></g>';
    if(hs===4)s+='<path d="M20 30c-1-8 3-14 9-16-4 3-6 8-5 15z" fill="'+hr+'" opacity=".0"/>';
    s+='<circle cx="27.6" cy="30" r="1.25" fill="#1B1B1F"/><circle cx="36.4" cy="30" r="1.25" fill="#1B1B1F"/>';
    if(gl)s+='<g fill="none" stroke="#1B1B1F" stroke-width="1.1"><circle cx="27.6" cy="30" r="3.6"/><circle cx="36.4" cy="30" r="3.6"/><path d="M31.2 30h1.6"/></g>';
    s+=sm?'<path d="M28.6 35.2c2.2 2 4.6 2 6.8 0" fill="none" stroke="#7A3E2B" stroke-width="1.2" stroke-linecap="round"/>':'<path d="M29 35.6h6" stroke="#7A3E2B" stroke-width="1.2" stroke-linecap="round"/>';
    return s+'</svg>';
  }
  const cache={};
  function members(iso){
    if(cache[iso])return cache[iso];
    const r=rng(hash('ridi6'+iso)),pt=iso==='BR'||iso==='PT',n=CNT[iso]||20;
    const prem=Math.max(3,Math.round(n*.35)),list=[],used=new Set();
    for(let i=0;i<n;i++){
      let nm;do{nm=(pt?FN_PT:FN_ES)[Math.floor(r()*(pt?FN_PT:FN_ES).length)]+' '+(pt?LN_PT:LN_ES)[Math.floor(r()*(pt?LN_PT:LN_ES).length)]}while(used.has(nm));used.add(nm);
      const role=ROLES[Math.floor(r()*ROLES.length)],city=CITY[iso][Math.floor(r()*CITY[iso].length)],yrs=3+Math.floor(r()*22),foco=FOCO[Math.floor(r()*FOCO.length)];
      list.push({id:iso+i,iso,name:nm,role,city,premium:i<prem,seed:hash(iso+nm),bio:yrs+' años de trayectoria en '+city+'. '+foco.charAt(0).toUpperCase()+foco.slice(1)+'.'});
    }
    return cache[iso]=list;
  }

  /* ---------- estado del mapa ---------- */
  let rows=0,cols=0,ps=0,W=0,H=0,h0=0,h1=0,dpr=1,grid=[],key='',lastW=0;
  let flat=[],cells={},cen={},bbox={},tw=[],twMap=new Map(),base=null;
  const cam={cx:0,cy:0,z:1,vh:0},tgt={cx:0,cy:0,z:1,vh:0};
  let mode='world',sel='',R=60,vis=false,gone=false;
  let px=0,py=0,tx=0,ty=0,ls=0,want=false,userAt=-1e9,holdUntil=0,tourI=0,tourAt=0,curL='',armed='';
  const sparks=[];let nextSpark=900;
  const t0=performance.now();
  let lastPT='mouse';

  function drawCells(c,cm,skipTw,hl){
    const z=cm.z,ox=W/2-cm.cx*z,oy=cm.vh/2-cm.cy*z,zz=ps*z,sz=zz*.76,vhh=cm.vh;
    for(let i=0;i<flat.length;i++){
      const f=flat[i];
      const x=f[0]*z+ox,y=f[1]*z+oy;
      if(x<-zz||x>W+zz||y<-zz||y>vhh+zz)continue;
      const t=f[2],L=f[3];
      if(t===0){
        if(z>1.6)continue;
        c.fillStyle='rgba(143,193,255,.1)';const s=zz*.32;c.fillRect(x-s/2,y-s/2,s,s);continue;
      }
      if(skipTw&&f[4])continue;
      if(hl){
        if(L===hl){c.fillStyle='#FFFFFF'}else if(t===2){c.fillStyle='rgba(143,193,255,.5)'}else{c.fillStyle='rgba(207,226,255,.26)'}
      }else{c.fillStyle=t===2?'#8FC8FF':'rgba(226,238,255,.82)'}
      c.fillRect(x-sz/2,y-sz/2,sz,sz);
    }
  }
  function build(){
    const w=stage.clientWidth;if(!w)return;
    const k=w<640?'m':'d';
    if(k!==key){key=k;grid=GR[k].split('|');rows=grid.length;cols=grid[0].length}
    W=w;lastW=w;ps=W/cols;H=ps*rows;dpr=Math.min(window.devicePixelRatio||1,2);
    const small=W<640;
    h0=Math.round(H+(small?74:96));
    h1=Math.round(Math.max(h0+110,Math.min(small?580:640,W*(small?1.5:.72))));
    stage.style.setProperty('--h0',h0+'px');stage.style.setProperty('--h1',h1+'px');
    cv.width=Math.round(W*dpr);cv.height=Math.round(h1*dpr);cv.style.width=W+'px';cv.style.height=h1+'px';
    R=Math.max(48,Math.min(92,W*.16));
    flat=[];cells={};bbox={};tw=[];twMap=new Map();
    let seed=11;const rn=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
      const ch=grid[r][c],x=(c+.5)*ps,y=(r+.5)*ps;
      if(ch===' '){flat.push([x,y,0,'',0]);continue}
      let isTw=0;
      if(rn()<.075){isTw=1;const o={x,y,ph:rn()*6.28,sp:.7+rn()*1.3,L:IBC[ch]?ch:''};tw.push(o);twMap.set(r*cols+c,o)}
      if(ch==='.'){flat.push([x,y,1,'',isTw])}
      else{
        flat.push([x,y,2,ch,isTw]);(cells[ch]=cells[ch]||[]).push([x,y]);
        const b=bbox[ch]=bbox[ch]||[x,y,x,y];b[0]=Math.min(b[0],x);b[1]=Math.min(b[1],y);b[2]=Math.max(b[2],x);b[3]=Math.max(b[3],y);
      }
    }
    for(const L in cells){const a=cells[L];cen[L]=[a.reduce((s,p)=>s+p[0],0)/a.length,a.reduce((s,p)=>s+p[1],0)/a.length]}
    base=document.createElement('canvas');base.width=Math.round(W*dpr);base.height=Math.round(H*dpr);
    const b=base.getContext('2d');b.scale(dpr,dpr);
    drawCells(b,{cx:W/2,cy:H/2,z:1,vh:H},true,'');
    if(!px&&!py){px=tx=W*.3;py=ty=H*.62}
    setTargets(true);
  }
  function setTargets(snap){
    if(mode==='world'){tgt.cx=W/2;tgt.cy=H/2;tgt.z=1;tgt.vh=h0}
    else{
      const L=sel,c=cen[L],b=bbox[L],bw=b[2]-b[0]+ps*2,bh=b[3]-b[1]+ps*2;
      tgt.cx=c[0];tgt.cy=c[1];
      tgt.z=Math.max(1.7,Math.min(9,Math.min(W*(W<640?.4:.3)/bw,h1*.4/bh)));tgt.vh=h1;
    }
    if(snap){Object.assign(cam,tgt);stage.style.height=cam.vh+'px'}
  }
  function letterAt(x,y){
    const c=Math.floor(x/ps),r=Math.floor(y/ps);let best='',bd=9;
    for(let dr=-2;dr<=2;dr++)for(let dc=-2;dc<=2;dc++){
      const rr=r+dr,cc=c+dc;if(rr<0||cc<0||rr>=rows||cc>=cols)continue;
      const ch=grid[rr][cc];if(IBC[ch]){const d=Math.abs(dr)+Math.abs(dc);if(d<bd){bd=d;best=ch}}
    }
    return bd<=(lastPT==='touch'?4:3)?best:'';
  }
  function setInfo(L,extra){
    if(!L){info.innerHTML='<span class="dot"></span><span><span class="mm-hint-fine">Acerca el cursor a un país resaltado en azul.</span><span class="mm-hint-touch">Toca un país resaltado en azul.</span></span>';return}
    const [iso,name]=IBC[L],n=CNT[iso];
    info.innerHTML='<img src="'+flag(iso)+'" alt=""><span><b>'+name+'</b> · '+n+' miembros'+(extra?' · '+extra:'')+'</span>';
  }
  function tipFor(L){
    const [iso,name]=IBC[L];
    tip.innerHTML='<img src="'+flag(iso)+'" alt=""><span><b>'+name+'</b><i>'+CNT[iso]+' miembros de la red · cifra de ejemplo</i></span>';
    tip.classList.remove('pop');void tip.offsetWidth;tip.classList.add('pop');
  }
  function place(oy){
    const w=tip.offsetWidth||220;
    const x=Math.max(w/2+6,Math.min(W-w/2-6,px));
    let y=py+oy-R-10;
    if(y<56){y=py+oy+R+10;tip.style.transform='translate(-50%,0)'}else tip.style.transform='translate(-50%,-100%)';
    tip.style.left=x+'px';tip.style.top=y+'px';
  }
  function star(c,x,y,s,a){
    c.globalAlpha=a;c.fillStyle='#EAF4FF';
    c.beginPath();c.moveTo(x,y-s);c.lineTo(x+s*.16,y-s*.16);c.lineTo(x+s,y);c.lineTo(x+s*.16,y+s*.16);c.lineTo(x,y+s);c.lineTo(x-s*.16,y+s*.16);c.lineTo(x-s,y);c.lineTo(x-s*.16,y-s*.16);c.closePath();c.fill();
  }

  /* ---------- bucle de dibujo ---------- */
  let last=performance.now();
  function frame(now){
    if(gone)return;requestAnimationFrame(frame);
    if(!vis||document.hidden){last=now;return}
    const dt=Math.min(.05,(now-last)/1000);last=now;
    const ms=now-t0,s=ms/1000,k=1-Math.pow(.88,dt*60);
    cam.cx+=(tgt.cx-cam.cx)*k;cam.cy+=(tgt.cy-cam.cy)*k;cam.z+=(tgt.z-cam.z)*k;cam.vh+=(tgt.vh-cam.vh)*k;
    if(Math.abs(cam.z-tgt.z)<.002&&Math.abs(cam.vh-tgt.vh)<.4){cam.z=tgt.z;cam.vh=tgt.vh;cam.cx=tgt.cx;cam.cy=tgt.cy}
    const hh=Math.round(cam.vh);if(stage._h!==hh){stage._h=hh;stage.style.height=hh+'px'}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,h1);
    const worldView=mode==='world'&&Math.abs(cam.z-1)<.004&&Math.abs(cam.vh-h0)<1.5;
    if(!worldView){
      drawCells(ctx,cam,false,mode==='country'?sel:'');
      // titileo en vista de país
      if(mode==='country'&&!RM){
        const z=cam.z,ox=W/2-cam.cx*z,oy=cam.vh/2-cam.cy*z;
        for(const o of tw){
          const x=o.x*z+ox,y=o.y*z+oy;if(x<0||x>W||y<0||y>cam.vh)continue;
          const v=.5+.5*Math.sin(s*o.sp+o.ph);ctx.globalAlpha=.25+.55*v*v;ctx.fillStyle=o.L===sel?'#fff':'#BFDDFF';const q=ps*z*.76;ctx.fillRect(x-q/2,y-q/2,q,q);
        }
        ctx.globalAlpha=1;
      }
      if(ls>0){ls=0;tip.classList.remove('on');curL=''}
      return;
    }
    /* vista de mundo: lupa + destellos (V3) */
    const oy=(h0-H)/2;
    // recorrido automático cuando nadie interactúa
    const touchHold=armed&&lastPT==='touch';
    if(!RM&&ms>1500&&now-userAt>5200&&!want&&!touchHold){
      if(now>tourAt){const L=TOUR[tourI++%TOUR.length];const c=cen[L];if(c){tx=c[0];ty=c[1]}tourAt=now+2500}
    }
    const act=want||(!RM&&ms>1500&&now-userAt>5200&&!touchHold)||now<holdUntil||touchHold;
    px+=(tx-px)*.2;py+=(ty-py)*.2;ls+=((act?1:0)-ls)*.12;if(ls<.01&&!act)ls=0;
    if(!RM&&ms>1500&&ms>nextSpark){
      const Ls=Object.keys(cells);const L=Ls[Math.floor(Math.random()*Ls.length)],a=cells[L];
      const p=a[Math.floor(Math.random()*a.length)];sparks.push({x:p[0],y:p[1],t:ms,d:1500+Math.random()*700});
      nextSpark=ms+520+Math.random()*620;
    }
    ctx.save();ctx.translate(0,oy);
    const lens=ls>.02;
    ctx.save();
    if(lens){ctx.beginPath();ctx.rect(0,-oy,W,h1);ctx.arc(px,py,R,0,6.2832);ctx.clip('evenodd')}
    ctx.drawImage(base,0,0,W,H);
    for(const o of tw){
      if(lens&&Math.hypot(o.x-px,o.y-py)<R)continue;
      const v=RM?1:.5+.5*Math.sin(s*o.sp+o.ph),a=.28+.72*v*v,z=ps*.76;
      const col=o.L?'#8FC8FF':'#E2EEFF';
      if(a>.8&&!RM){ctx.globalAlpha=(a-.8)*.9;ctx.fillStyle='#fff';const g=z*1.9;ctx.fillRect(o.x-g/2,o.y-g/2,g,g)}
      ctx.globalAlpha=RM?.9:a;ctx.fillStyle=col;ctx.fillRect(o.x-z/2,o.y-z/2,z,z);
    }
    ctx.restore();ctx.globalAlpha=1;
    const L=lens&&ls>.35?letterAt(px,py):'';
    if(lens){
      const kk=.8*ls,r0=Math.max(0,Math.floor((py-R)/ps)),r1=Math.min(rows-1,Math.ceil((py+R)/ps));
      const c0=Math.max(0,Math.floor((px-R)/ps)),c1=Math.min(cols-1,Math.ceil((px+R)/ps));
      for(let r=r0;r<=r1;r++)for(let c=c0;c<=c1;c++){
        const x=(c+.5)*ps,y=(r+.5)*ps,d=Math.hypot(x-px,y-py);if(d>=R)continue;
        const u=1-d/R,f=1+kk*u*u,nx=px+(x-px)*f,ny=py+(y-py)*f,ch=grid[r][c];
        if(ch===' '){ctx.fillStyle='rgba(143,193,255,.16)';const z=ps*.34*f;ctx.fillRect(nx-z/2,ny-z/2,z,z)}
        else{
          const o=twMap.get(r*cols+c);let a=.95;
          if(o&&!RM)a=.4+.6*Math.pow(.5+.5*Math.sin(s*o.sp+o.ph),2);
          ctx.fillStyle=(L&&ch===L)?'#FFFFFF':(IBC[ch]?'#8FC8FF':'rgba(226,238,255,.85)');ctx.globalAlpha=a;
          const z=ps*.82*f;ctx.fillRect(nx-z/2,ny-z/2,z,z);ctx.globalAlpha=1;
        }
      }
      ctx.strokeStyle='rgba(207,230,255,'+(.5*ls)+')';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(px,py,R,0,6.2832);ctx.stroke();
    }
    for(let i=sparks.length-1;i>=0;i--){
      const p=sparks[i],q=(ms-p.t)/p.d;if(q>=1){sparks.splice(i,1);continue}
      const env=Math.sin(Math.PI*q),sz=ps*(1.2+3.8*env);
      const gr=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,ps*4.2*env+1);gr.addColorStop(0,'rgba(190,225,255,.6)');gr.addColorStop(1,'rgba(190,225,255,0)');
      ctx.globalAlpha=env;ctx.fillStyle=gr;ctx.fillRect(p.x-ps*5,p.y-ps*5,ps*10,ps*10);
      star(ctx,p.x,p.y,sz,Math.min(1,env*1.2));
      ctx.globalAlpha=(1-q)*.5;ctx.strokeStyle='#A9D2FF';ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.x,p.y,ps*(1+q*5),0,6.2832);ctx.stroke();
    }
    ctx.globalAlpha=1;ctx.restore();
    if(L!==curL){
      curL=L;
      if(L){tipFor(L);tip.classList.add('on');setInfo(L)}
      else{tip.classList.remove('on');if(!armed)setInfo('')}
      stage.classList.toggle('hot',!!L);
      if(lastPT!=='touch')bOpen.disabled=!L;
    }
    if(L)place(oy);
  }

  /* ---------- punteros ---------- */
  function pos(e){const b=cv.getBoundingClientRect(),oy=(h0-H)/2;tx=(e.clientX-b.left)*(W/b.width);ty=(e.clientY-b.top)*(h1/b.height)-oy}
  cv.style.touchAction='pan-y';
  cv.addEventListener('pointerdown',e=>{if(mode!=='world')return;lastPT=e.pointerType;userAt=performance.now();want=true;pos(e);if(e.pointerType==='touch'){px=tx;py=ty}});
  cv.addEventListener('pointermove',e=>{if(mode!=='world')return;lastPT=e.pointerType;userAt=performance.now();want=true;pos(e)});
  const off=e=>{userAt=performance.now();want=false;holdUntil=e.pointerType==='touch'?performance.now()+1800:0};
  cv.addEventListener('pointerleave',off);cv.addEventListener('pointercancel',off);
  cv.addEventListener('pointerup',e=>{
    if(mode!=='world')return;
    off(e);lastPT=e.pointerType;pos(e);
    const L=letterAt(tx,ty);
    if(e.pointerType==='touch'){
      if(L&&armed===L){openCountry(L)}
      else if(L){armed=L;px=tx;py=ty;setInfo(L,'toca otra vez para abrir');bOpen.disabled=false;holdUntil=performance.now()+4000}
      else{armed='';bOpen.disabled=true;setInfo('')}
    }else if(L)openCountry(L);
  });

  /* ---------- modo país ---------- */
  let shown=[],selId='',dirAll=false;
  function layout(list){
    const n=list.length,small=W<640,cx=W/2,cy=h1/2,pad=small?10:14;
    const out=[],rnd=rng(hash('lay'+sel+n));
    const sizes=list.map(()=>small?44+Math.round(rnd()*10):50+Math.round(rnd()*14));
    const off=rnd()*6.28;
    for(let i=0;i<n;i++){
      const s=sizes[i],rx=W/2-s/2-pad,ry=h1/2-s/2-pad;
      const outer=i%2===0,f=outer?1:(small?.62:.66);
      const th=off+(i/n)*6.2832+(rnd()-.5)*.28;
      out.push({x:cx+Math.cos(th)*rx*f,y:cy+Math.sin(th)*ry*f*(outer?1:.95),s});
    }
    for(let it=0;it<48;it++){
      for(let a=0;a<n;a++)for(let b=a+1;b<n;b++){
        const dx=out[b].x-out[a].x,dy=out[b].y-out[a].y,d=Math.hypot(dx,dy)||1,m=(out[a].s+out[b].s)/2+6;
        if(d<m){const p=(m-d)/2,ux=dx/d,uy=dy/d;out[a].x-=ux*p;out[a].y-=uy*p;out[b].x+=ux*p;out[b].y+=uy*p}
      }
      for(const o of out){o.x=Math.max(o.s/2+4,Math.min(W-o.s/2-4,o.x));o.y=Math.max(o.s/2+4,Math.min(h1-o.s/2-4,o.y));
        const dx=o.x-cx,dy=o.y-cy,d=Math.hypot(dx,dy),mn=(small?64:78)+o.s/2;if(d<mn){o.x=cx+dx/d*mn;o.y=cy+dy/d*mn}}
    }
    return out;
  }
  function drawTentacles(pos){
    const hx=W/2,hy=h1/2;let svg='<g>';
    pos.forEach((p,i)=>{
      const dx=p.x-hx,dy=p.y-hy,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len,sg=i%2?1:-1,dl=(0.04*i).toFixed(2);
      const c1x=hx+dx*.3+nx*len*.26*sg,c1y=hy+dy*.3+ny*len*.26*sg,c2x=hx+dx*.72-nx*len*.2*sg,c2y=hy+dy*.72-ny*len*.2*sg;
      const d='M'+hx.toFixed(1)+' '+hy.toFixed(1)+'C'+c1x.toFixed(1)+' '+c1y.toFixed(1)+' '+c2x.toFixed(1)+' '+c2y.toFixed(1)+' '+p.x.toFixed(1)+' '+p.y.toFixed(1);
      const d2='M'+hx.toFixed(1)+' '+hy.toFixed(1)+'C'+(hx+dx*.4-nx*len*.14*sg).toFixed(1)+' '+(hy+dy*.4-ny*len*.14*sg).toFixed(1)+' '+(hx+dx*.8+nx*len*.1*sg).toFixed(1)+' '+(hy+dy*.8+ny*len*.1*sg).toFixed(1)+' '+p.x.toFixed(1)+' '+p.y.toFixed(1);
      svg+='<path class="g" pathLength="1" style="--d:'+dl+'s" d="'+d+'"/><path class="c2" pathLength="1" style="--d:'+(0.04*i+.08).toFixed(2)+'s" d="'+d2+'"/><path class="c" pathLength="1" style="--d:'+dl+'s" d="'+d+'"/>';
    });
    svg+='<circle class="ring" cx="'+hx+'" cy="'+hy+'" r="7"/><circle class="hub" cx="'+hx+'" cy="'+hy+'" r="5"/></g>';
    tent.setAttribute('viewBox','0 0 '+W+' '+h1);tent.setAttribute('width',W);tent.setAttribute('height',h1);tent.innerHTML=svg;
  }
  const STAR='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#0D1B33" d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8L5.7 21l1.7-7L2 9.2l7.1-.6z"/></svg>';
  function buildAvatars(){
    const iso=IBC[sel][0],all=members(iso),n=Math.min(all.filter(m=>m.premium).length,W<640?14:20);
    shown=all.slice(0,n);
    const p=layout(shown);drawTentacles(p);
    avs.innerHTML=shown.map((m,i)=>'<button type="button" class="mm-av" data-i="'+i+'" style="left:'+p[i].x.toFixed(1)+'px;top:'+p[i].y.toFixed(1)+'px;--s:'+p[i].s+'px;--d2:'+(.55+i*.045).toFixed(2)+'s" aria-label="'+m.name+', '+m.role+'"><span class="im">'+avatar(m.seed)+'</span><span class="star">'+STAR+'</span><span class="nm">'+m.name+'</span></button>').join('');
    avs.classList.remove('has-sel');
  }
  function memberRow(m){
    return '<li><span class="im">'+avatar(m.seed)+'</span><b>'+m.name+(m.premium?'<span class="pr" title="Perfil destacado"></span>':'')+'</b><span class="sub2">'+m.role+' · '+m.city+'</span><span class="lk"><a href="#" data-demo="Vista previa: aquí abrirá el currículo de '+m.name+'.">Currículo</a><a href="#" data-demo="Vista previa: aquí abrirá el portafolio de '+m.name+'.">Portafolio</a></span></li>';
  }
  function renderDir(){
    const iso=IBC[sel][0],all=members(iso),q=($('#mmQ').value||'').trim().toLowerCase();
    let list=all;if(q)list=all.filter(m=>(m.name+' '+m.role+' '+m.city).toLowerCase().includes(q));
    const cap=dirAll||q?list.length:6;
    $('#mmList').innerHTML=list.slice(0,cap).map(memberRow).join('')||'<li><span class="sub2" style="grid-column:1/-1">Sin resultados para esa búsqueda.</span></li>';
    const mb=$('#mmMore');mb.hidden=!!q||list.length<=6;mb.textContent=dirAll?'Ver menos':'Ver los '+list.length+' miembros';mb.setAttribute('aria-expanded',dirAll);
  }
  function showCard(m){
    selId=m.id;const iso=m.iso;
    card.innerHTML='<button class="x" type="button" aria-label="Cerrar perfil" id="mmX"><svg class="ic"><use href="#i-x"/></svg></button><div class="pic">'+avatar(m.seed)+'</div><div class="inf">'+(m.premium?'<span class="pill"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#0D1B33" d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8L5.7 21l1.7-7L2 9.2l7.1-.6z"/></svg>Perfil destacado</span>':'')+'<h3>'+m.name+'</h3><div class="role">'+m.role+'</div><div class="loc"><img src="'+flag(iso)+'" alt="">'+m.city+', '+IBC[ISO2L[iso]][1]+'</div><p class="bio">'+m.bio+'</p><div class="act"><a class="btn sm pri" href="#" data-demo="Vista previa: aquí abrirá el currículo de '+m.name+'.">Ver currículo</a><a class="btn sm" href="#" data-demo="Vista previa: aquí abrirá el portafolio de '+m.name+'.">Ver portafolio</a></div></div>';
    card.hidden=false;
    $('#mmX').addEventListener('click',closeCard);
    $$('.mm-av',avs).forEach((b,i)=>b.classList.toggle('sel',shown[i].id===m.id));avs.classList.add('has-sel');
    card.scrollIntoView({block:'nearest',behavior:RM?'auto':'smooth'});
  }
  function closeCard(){selId='';card.hidden=true;$$('.mm-av',avs).forEach(b=>b.classList.remove('sel'));avs.classList.remove('has-sel')}
  avs.addEventListener('click',e=>{const b=e.target.closest('.mm-av');if(!b)return;const m=shown[+b.dataset.i];if(selId===m.id)closeCard();else showCard(m)});

  function setChips(){$$('.mm-chip',chips).forEach(c=>c.setAttribute('aria-pressed',mode==='country'&&c.dataset.iso===IBC[sel][0]))}
  function openCountry(L){
    if(!L||!IBC[L])return;
    sel=L;mode='country';armed='';want=false;ls=0;tip.classList.remove('on');curL='';
    stage.classList.add('is-country');
    closeCard();dirAll=false;$('#mmQ').value='';
    setTargets(false);
    const iso=IBC[L][0],n=CNT[iso];
    setInfo(L,Math.min(members(iso).filter(m=>m.premium).length,W<640?14:20)+' destacados en el mapa');
    bOpen.hidden=true;bBack.hidden=false;
    $('#mmDirT').textContent='Miembros de '+IBC[L][1];
    dir.hidden=false;renderDir();
    avs.innerHTML='';tent.innerHTML='';
    buildAvatars();
    setChips();
    const top=mm.getBoundingClientRect().top;
    if(top<0||top>innerHeight*.5)mm.scrollIntoView({block:'start',behavior:RM?'auto':'smooth'});
    const ch=$('.mm-chip[aria-pressed=true]',chips);if(ch&&ch.scrollIntoView)ch.scrollIntoView({inline:'center',block:'nearest',behavior:'auto'});
  }
  function backToWorld(){
    mode='world';sel='';armed='';stage.classList.remove('is-country');
    avs.innerHTML='';tent.innerHTML='';closeCard();dir.hidden=true;
    setTargets(false);setInfo('');bOpen.hidden=false;bOpen.disabled=true;bBack.hidden=true;setChips();
    userAt=performance.now();holdUntil=0;
  }
  bBack.addEventListener('click',backToWorld);
  bOpen.addEventListener('click',()=>{const L=armed||curL;if(L)openCountry(L)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mode==='country'&&!document.querySelector('#lb:not([hidden])'))backToWorld()});
  $('#mmQ').addEventListener('input',renderDir);
  $('#mmMore').addEventListener('click',()=>{dirAll=!dirAll;renderDir()});

  /* chips de países (también para quien no puede usar el mapa) */
  const order=Object.keys(IBC).map(L=>({L,iso:IBC[L][0],name:IBC[L][1]})).sort((a,b)=>a.name.localeCompare(b.name,'es'));
  chips.innerHTML=order.map(o=>'<button type="button" class="mm-chip" data-iso="'+o.iso+'" aria-pressed="false"><img src="'+flag(o.iso)+'" alt="">'+o.name+' <i>'+CNT[o.iso]+'</i></button>').join('');
  chips.addEventListener('click',e=>{const c=e.target.closest('.mm-chip');if(!c)return;const L=ISO2L[c.dataset.iso];if(mode==='country'&&sel===L)backToWorld();else openCountry(L)});

  /* ---------- arranque ---------- */
  new ResizeObserver(()=>{
    const w=stage.clientWidth;if(!w||Math.abs(w-lastW)<1)return;
    build();if(mode==='country'){setTargets(true);buildAvatars();if(selId){const m=shown.find(x=>x.id===selId);if(!m)closeCard()}}
  }).observe(stage);
  new IntersectionObserver(es=>{vis=es[0].isIntersecting},{rootMargin:'120px'}).observe(stage);
  build();setInfo('');bOpen.disabled=true;
  requestAnimationFrame(frame);
})();
