(() => {
  'use strict';

  const form = document.getElementById('brief-form');
  const canvas = document.getElementById('site-canvas');
  const frame = document.getElementById('preview-frame');
  const status = document.getElementById('result-status');
  const badge = document.getElementById('version-badge');
  const title = document.getElementById('window-title');
  const desktopButton = document.getElementById('desktop-view');
  const mobileButton = document.getElementById('mobile-view');
  const refineButton = document.getElementById('refine');
  const defaults = {company:'Atelier Boréal',trade:'Menuiserie & agencement',city:'Genève',service:'Agencements sur mesure',instruction:'Valoriser le savoir-faire et les réalisations. Style chaleureux, sobre, avec un contact facile à trouver.',style:'architectural'};
  const files = {capture:null,photo:null,logo:null};
  const images = {photo:null,logo:null};
  const state = {...defaults,refined:false,format:'desktop'};
  const palettes = {
    architectural:{deep:'#142b29',accent:'#ba835f',light:'#f5f2ec',warm:'#e7d4be',mid:'#73877e'},
    chaleureux:{deep:'#352e29',accent:'#b97950',light:'#faf3e9',warm:'#e8c8a0',mid:'#9c7c65'},
    contraste:{deep:'#111e2c',accent:'#2f78e0',light:'#f2f6fa',warm:'#c4d4e5',mid:'#59738c'}
  };

  function text(ctx,value,x,y,size,color,weight='400',maxWidth=Infinity,lineHeight=size*1.3,maxLines=10){
    ctx.font=`${weight} ${size}px Inter, Arial, sans-serif`;
    ctx.fillStyle=color;
    const words=String(value||'').split(/\s+/).filter(Boolean);
    let line='',shown=0;
    for(let i=0;i<words.length;i++){
      const next=line?`${line} ${words[i]}`:words[i];
      if(ctx.measureText(next).width>maxWidth && line){
        ctx.fillText(line,x,y+shown*lineHeight);shown++;line=words[i];
        if(shown>=maxLines){return y+shown*lineHeight;}
      }else{line=next;}
    }
    if(line){ctx.fillText(line,x,y+shown*lineHeight);shown++;}
    return y+shown*lineHeight;
  }
  function rect(ctx,x,y,w,h,fill){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);}
  function rounded(ctx,x,y,w,h,r,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
  function line(ctx,x1,y1,x2,y2,color,width=1){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
  function poly(ctx,points,fill){ctx.fillStyle=fill;ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.fill();}
  function imageCover(ctx,img,x,y,w,h){
    const scale=Math.max(w/img.width,h/img.height),iw=img.width*scale,ih=img.height*scale;
    ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.drawImage(img,x+(w-iw)/2,y+(h-ih)/2,iw,ih);ctx.restore();
  }
  function grain(ctx,x,y,w,h){
    ctx.save();ctx.globalAlpha=.055;for(let i=0;i<65;i++){const px=x+((i*233)%w),py=y+((i*97)%h);rect(ctx,px,py,2,2,'#17342c');}ctx.restore();
  }
  function room(ctx,x,y,w,h,p){
    if(images.photo){imageCover(ctx,images.photo,x,y,w,h);return;}
    const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,p.warm);g.addColorStop(.58,'#eee7dc');g.addColorStop(1,'#b1a18f');rect(ctx,x,y,w,h,g);
    poly(ctx,[[x,y],[x+w,y],[x+w*.76,y+h*.38],[x+w*.18,y+h*.38]],'#f1ecdf');
    poly(ctx,[[x,y+h],[x+w,y+h],[x+w*.76,y+h*.38],[x+w*.18,y+h*.38]],'#b79f83');
    poly(ctx,[[x+w*.18,y+h*.38],[x+w*.76,y+h*.38],[x+w,y],[x,y]],'#dbd0c2');
    const winX=x+w*.53,winY=y+h*.13,winW=w*.33,winH=h*.43;
    const sky=ctx.createLinearGradient(winX,winY,winX,winY+winH);sky.addColorStop(0,'#95b8b9');sky.addColorStop(1,'#d6d8c6');rect(ctx,winX,winY,winW,winH,sky);
    for(let i=0;i<4;i++)line(ctx,winX+i*winW/3,winY,winX+i*winW/3,winY+winH,'#625f56',6);
    line(ctx,winX,winY+winH*.6,winX+winW,winY+winH*.6,'#625f56',6);
    for(let i=0;i<13;i++){const sx=x+i*w/12;line(ctx,sx,y+h*.02,x+w*.5+(sx-x-w*.5)*1.7,y+h*.38,'#c7bbab',2);}
    for(let i=0;i<16;i++){const sy=y+h*.57+i*h*.035;line(ctx,x,sy,x+w,sy,'#a5896d',1);}
    poly(ctx,[[x+w*.11,y+h*.58],[x+w*.69,y+h*.58],[x+w*.83,y+h*.78],[x+w*.23,y+h*.78]],'#594736');
    poly(ctx,[[x+w*.11,y+h*.58],[x+w*.69,y+h*.58],[x+w*.69,y+h*.67],[x+w*.11,y+h*.67]],'#8d6f55');
    poly(ctx,[[x+w*.23,y+h*.78],[x+w*.83,y+h*.78],[x+w*.83,y+h*.85],[x+w*.23,y+h*.85]],'#66513f');
    rect(ctx,x+w*.075,y+h*.15,w*.14,h*.36,'#8b6b4e');for(let i=1;i<5;i++)line(ctx,x+w*(.075+.14*i/5),y+h*.15,x+w*(.075+.14*i/5),y+h*.51,'#604831',3);
    ctx.fillStyle='#384d38';for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse(x+w*.92+i*5,y+h*.67-i*19,15,45,i*.35,0,Math.PI*2);ctx.fill();}
    rect(ctx,x+w*.90,y+h*.69,w*.07,h*.12,'#6b5a49');grain(ctx,x,y,w,h);
  }
  function tile(ctx,x,y,w,h,n,p){
    rounded(ctx,x,y,w,h,10,'#d8d1c2');ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,10);ctx.clip();
    const gs=[['#a89078','#e6dbc9'],['#8c9c91','#dce4da'],['#796c60','#d6c6b7']][n%3];const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,gs[0]);g.addColorStop(1,gs[1]);rect(ctx,x,y,w,h,g);
    if(n%3===0){for(let i=0;i<8;i++){rect(ctx,x+i*w/8,y,w/18,h,'#6f5d4b');}poly(ctx,[[x,y+h*.82],[x+w,y+h*.72],[x+w,y+h],[x,y+h]],'#b39576');}
    if(n%3===1){for(let i=0;i<5;i++){line(ctx,x+15+i*w/5,y,x+15+i*w/5,y+h,'#59685f',5);}line(ctx,x,y+h*.52,x+w,y+h*.52,'#59685f',4);}
    if(n%3===2){for(let i=0;i<7;i++){poly(ctx,[[x+i*w/7,y],[x+(i+1)*w/7,y],[x+(i+1)*w/7-20,y+h],[x+i*w/7-20,y+h]],'#9e8a72');}}
    ctx.restore();
  }
  function nav(ctx,w,p,mobile){
    rect(ctx,0,0,w,mobile?66:82,'#fff');
    if(images.logo){imageCover(ctx,images.logo,mobile?20:54,mobile?15:18,mobile?35:46,mobile?35:46);}
    else{rounded(ctx,mobile?20:54,mobile?15:18,mobile?35:46,mobile?35:46,7,p.deep);text(ctx,'A',mobile?30:67,mobile?39:50,mobile?22:28,'#fff','700');}
    text(ctx,state.company,mobile?64:115,mobile?39:50,mobile?16:20,p.deep,'700',mobile?265:300,22,1);
    if(mobile){line(ctx,w-47,26,w-20,26,p.deep,2);line(ctx,w-47,37,w-20,37,p.deep,2);}
    else{text(ctx,'Services       Réalisations       Avis       Contact',618,47,16,p.deep,'600');rounded(ctx,1010,20,146,43,21,p.deep);text(ctx,'Parlons projet  ↗',1030,47,14,'#fff','700');}
  }
  function desktop(ctx,p){
    const w=1200,h=1850;rect(ctx,0,0,w,h,p.light);nav(ctx,w,p,false);
    rect(ctx,0,82,560,617,p.deep);ctx.save();ctx.globalAlpha=.08;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(510,151,210,0,7);ctx.fill();ctx.restore();
    text(ctx,`${state.city.toUpperCase()}  /  ${state.trade.toUpperCase()}`,58,175,15,p.warm,'700',450);
    const head=state.refined?`Des espaces conçus pour durer.`:`Votre projet prend forme ici.`;
    text(ctx,head,58,248,57,'#fff','700',455,68,3);
    text(ctx,state.refined?`L’expertise de ${state.company}, au service de vos espaces.`:`${state.service} par ${state.company}. Une proposition pensée autour de votre savoir-faire.`,58,450,21,'#e0e9e3','400',440,31,4);
    rounded(ctx,58,575,235,57,28,p.accent);text(ctx,'Parlons de votre projet  →',79,611,16,'#fff','700');
    room(ctx,560,82,640,617,p);
    rect(ctx,0,699,1200,469,'#fff');text(ctx,'NOS SERVICES',58,772,15,p.accent,'700');text(ctx,'Le savoir-faire au cœur de chaque projet',58,827,38,p.deep,'700',1080);
    const labels=[state.service,'Conception personnalisée','Pose & finitions'];
    for(let i=0;i<3;i++){const x=58+i*371;tile(ctx,x,872,342,160,i,p);rounded(ctx,x,1007,342,116,12,'#f8f7f3');text(ctx,labels[i],x+19,1055,21,p.deep,'700',305,26,2);text(ctx,'Un exemple à compléter avec les données du client.',x+19,1086,13,'#67796f','400',305,18,2);}
    rect(ctx,0,1168,1200,390,p.deep);text(ctx,'RÉALISATIONS',58,1237,15,p.warm,'700');text(ctx,'Des projets qui parlent d’eux-mêmes',58,1293,38,'#fff','700');
    for(let i=0;i<3;i++){let x=58+i*371;tile(ctx,x,1332,342,131,i+1,p);text(ctx,`Projet exemple 0${i+1}`,x,1495,20,'#fff','700');text(ctx,'Photo et détail à confirmer',x,1520,14,'#c4d2c9');}
    rect(ctx,0,1558,1200,165,'#f6f8f4');text(ctx,'AVIS CLIENTS',58,1610,14,p.accent,'700');text(ctx,'À ajouter après validation',58,1652,31,p.deep,'700');text(ctx,'Aucun avis fictif n’est présenté comme réel.',620,1650,18,'#607a69');
    rect(ctx,0,1723,1200,127,'#fff');text(ctx,'Un projet ? Échangeons.',58,1777,32,p.deep,'700');text(ctx,'Coordonnées du prospect à renseigner',58,1810,15,'#6b8072');rounded(ctx,934,1750,208,50,25,p.deep);text(ctx,'Nous contacter  →',957,1782,16,'#fff','700');
    text(ctx,'MAQUETTE DE DÉMONSTRATION · INFORMATIONS À VÉRIFIER',58,1834,10,'#829588','600');
  }
  function mobile(ctx,p){
    const w=420,h=2600;rect(ctx,0,0,w,h,p.light);nav(ctx,w,p,true);room(ctx,0,66,420,355,p);
    rect(ctx,0,421,420,413,p.deep);text(ctx,`${state.city.toUpperCase()} / ${state.trade.toUpperCase()}`,24,474,12,p.warm,'700',375);
    text(ctx,state.refined?'Des espaces conçus pour durer.':'Votre projet prend forme ici.',24,541,41,'#fff','700',370,48,3);
    text(ctx,`${state.service} par ${state.company}.`,24,681,19,'#e2eae4','400',370,27,3);
    rounded(ctx,24,741,286,56,28,p.accent);text(ctx,'Parlons de votre projet  →',43,776,16,'#fff','700');
    rect(ctx,0,834,420,686,'#fff');text(ctx,'NOS SERVICES',24,889,13,p.accent,'700');text(ctx,'Un savoir-faire sur mesure',24,930,32,p.deep,'700',355,38,2);
    const names=[state.service,'Conception personnalisée','Pose & finitions','Conseil & suivi'];
    for(let i=0;i<4;i++){const x=24+(i%2)*191,y=1000+Math.floor(i/2)*250;tile(ctx,x,y,181,135,i,p);rounded(ctx,x,y+121,181,119,10,'#f7f8f5');text(ctx,names[i],x+11,y+166,17,p.deep,'700',160,21,3);text(ctx,'À préciser avec le client',x+11,y+215,11,'#667b6d','400',160,15,2);}
    rect(ctx,0,1520,420,594,p.deep);text(ctx,'RÉALISATIONS',24,1576,13,p.warm,'700');text(ctx,'Des projets à valoriser',24,1623,30,'#fff','700');
    for(let i=0;i<2;i++){const y=1660+i*202;tile(ctx,24,y,372,137,i+1,p);rounded(ctx,24,y+112,372,76,10,'#fff');text(ctx,`Projet exemple 0${i+1}`,38,y+148,17,p.deep,'700');text(ctx,'Photo et détail à confirmer',38,y+171,12,'#698071');}
    rect(ctx,0,2114,420,210,'#f5f8f3');text(ctx,'AVIS CLIENTS',24,2167,13,p.accent,'700');text(ctx,'À ajouter après validation',24,2211,26,p.deep,'700',370,31,2);text(ctx,'Ne présentez que des témoignages vérifiés.',24,2281,13,'#6a8072');
    rect(ctx,0,2324,420,276,'#fff');text(ctx,'Un projet ?',24,2384,34,p.deep,'700');text(ctx,'Échangeons sur votre besoin.',24,2416,18,'#61796b');rounded(ctx,24,2453,300,57,28,p.deep);text(ctx,'Nous contacter  →',47,2488,17,'#fff','700');text(ctx,'Coordonnées à renseigner',24,2542,13,'#778d7c');text(ctx,'MAQUETTE FICTIVE · À VÉRIFIER',24,2581,10,'#92a393','600');
  }
  function render(target=canvas,format=state.format){
    const isMobile=format==='mobile';target.width=isMobile?420:1200;target.height=isMobile?2600:1850;
    const ctx=target.getContext('2d');ctx.clearRect(0,0,target.width,target.height);
    const p=palettes[state.style]||palettes.architectural;
    if(isMobile)mobile(ctx,p);else desktop(ctx,p);
    target.setAttribute('aria-label',`Aperçu ${isMobile?'mobile':'ordinateur'} de la maquette fictive ${state.company}`);
  }
  function setFormat(format){state.format=format;frame.classList.toggle('mobile',format==='mobile');desktopButton.classList.toggle('active',format==='desktop');mobileButton.classList.toggle('active',format==='mobile');desktopButton.setAttribute('aria-pressed',String(format==='desktop'));mobileButton.setAttribute('aria-pressed',String(format==='mobile'));render();}
  function readForm(){
    state.company=document.getElementById('company').value.trim();state.trade=document.getElementById('trade').value.trim();
    state.city=document.getElementById('city').value.trim()||'Votre région';state.service=document.getElementById('service').value.trim()||'Un service sur mesure';
    state.instruction=document.getElementById('instruction').value.trim();state.style=form.elements.style.value;
  }
  function safeName(name){return (name||'proposition').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40)||'proposition';}
  function download(format){
    const output=document.createElement('canvas');render(output,format);
    output.toBlob(blob=>{
      if(!blob){status.textContent='L’export PNG a échoué dans ce navigateur.';return;}
      const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${safeName(state.company)}-${format}-${state.refined?'v2':'v1'}-demo.png`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
      status.textContent=`Image ${format==='mobile'?'mobile':'desktop'} téléchargée. Vérifiez les informations avant tout envoi.`;
    },'image/png');
  }
  function clearFiles(){for(const kind of Object.keys(files)){files[kind]=null;document.getElementById(`${kind}-name`).textContent='Aucun fichier ajouté';document.getElementById(kind).value='';}images.photo=null;images.logo=null;}
  function loadFile(kind,file){
    if(!file){files[kind]=null;document.getElementById(`${kind}-name`).textContent='Aucun fichier ajouté';if(kind==='photo'||kind==='logo')images[kind]=null;return;}
    if(!/^image\/(png|jpeg|webp)$/.test(file.type)||file.size>8*1024*1024){document.getElementById(kind).value='';document.getElementById(`${kind}-name`).textContent='PNG, JPG ou WebP · 8 Mo max';status.textContent='Ce fichier ne peut pas être chargé. Choisissez une image de 8 Mo maximum.';return;}
    files[kind]=file;document.getElementById(`${kind}-name`).textContent=file.name;
    if(kind==='capture')return;
    const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>{images[kind]=img;status.textContent='Image prête. Cliquez sur « Créer la base sans IA » pour l’intégrer.';};img.onerror=()=>{status.textContent='Impossible de lire cette image.';};img.src=reader.result;};reader.readAsDataURL(file);
  }
  form.addEventListener('submit',event=>{
    event.preventDefault();readForm();
    if(!state.company||!state.trade){status.textContent='Ajoutez le nom de l’entreprise et son métier pour créer la base.';(!state.company?document.getElementById('company'):document.getElementById('trade')).focus();return;}
    state.refined=false;badge.textContent='V1 · Base sans IA';refineButton.textContent='Simuler un affinage visuel';title.textContent=`${state.company} · proposition visuelle`;
    render();status.textContent=`Base créée pour ${state.company}, sans appel IA. Comparez desktop et mobile.`;
  });
  form.addEventListener('input',event=>{if(event.target.type!=='file')status.textContent='Brief modifié. Cliquez sur « Créer la base sans IA » pour voir le changement.';});
  for(const kind of Object.keys(files))document.getElementById(kind).addEventListener('change',event=>loadFile(kind,event.target.files[0]));
  document.getElementById('reset').addEventListener('click',()=>{
    form.reset();for(const [key,value] of Object.entries(defaults)){if(key!=='style')document.getElementById(key==='instruction'?'instruction':key).value=value;}
    clearFiles();Object.assign(state,defaults,{refined:false});badge.textContent='V1 · Base sans IA';refineButton.textContent='Simuler un affinage visuel';title.textContent='Atelier Boréal · proposition visuelle';setFormat('desktop');status.textContent='Exemple réinitialisé. La base fictive est prête à explorer.';
  });
  desktopButton.addEventListener('click',()=>setFormat('desktop'));
  mobileButton.addEventListener('click',()=>setFormat('mobile'));
  refineButton.addEventListener('click',()=>{
    state.refined=!state.refined;badge.textContent=state.refined?'V2 · Affinage illustré':'V1 · Base sans IA';refineButton.textContent=state.refined?'Revenir à la base':'Simuler un affinage visuel';
    status.textContent=state.refined?'Version V2 affichée. Cet affinage est simulé localement, sans appel IA.':'Version V1 affichée. Première base composée sans IA.';render();
  });
  document.getElementById('download-desktop').addEventListener('click',()=>download('desktop'));
  document.getElementById('download-mobile').addEventListener('click',()=>download('mobile'));
  render();
})();
