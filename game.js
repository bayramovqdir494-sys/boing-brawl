(()=>{
'use strict';
const W=1280,H=720,GY=640;
const cv=document.getElementById('c'),ctx=cv.getContext('2d');
let scale=1,offX=0,offY=0;
function resize(){const dpr=Math.min(window.devicePixelRatio||1,2);const ww=innerWidth,wh=innerHeight;scale=Math.min(ww/W,wh/H);cv.style.width=W*scale+'px';cv.style.height=H*scale+'px';cv.width=Math.round(W*scale*dpr);cv.height=Math.round(H*scale*dpr);offX=(ww-W*scale)/2;offY=(wh-H*scale)/2;cv.style.left=offX+'px';cv.style.top=offY+'px';ctx.setTransform(cv.width/W,0,0,cv.height/H,0,0);}
addEventListener('resize',resize);resize();
// ---------- SDK ----------
const SDK={ok:false,s:null,
 async init(){try{if(window.CrazyGames&&CrazyGames.SDK){await CrazyGames.SDK.init();this.s=CrazyGames.SDK;this.ok=true;}}catch(e){this.ok=false;}},
 call(f){try{if(this.ok&&this.s.game&&this.s.game[f])this.s.game[f]();}catch(e){}},
 ad(type,done,fail){if(!this.ok){done&&done(true);return;}let fin=false;const end=(r)=>{if(fin)return;fin=true;Audio.resume();r?done&&done(true):(fail?fail():done&&done(false));};
  try{Audio.mute(true);this.s.ad.requestAd(type,{adStarted:()=>{},adFinished:()=>{Audio.mute(false);end(true);},adError:()=>{Audio.mute(false);end(false);}});}catch(e){Audio.mute(false);end(false);}}};
// ---------- save ----------
const KEY='boingbrawl_save_v1';
let S={unlocked:1,stars:[],coins:0,skins:[0],skin:0,upg:{power:0,shots:0,magnet:0},snd:1,mus:1,tut:0,heroes:[0],hero:0,st:{},ach:[],daily:-1,endBest:0};
try{const d=JSON.parse(localStorage.getItem(KEY));if(d)S=Object.assign(S,d);}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
// ---------- audio ----------
const Audio={c:null,m:null,sfx:null,mus:null,muted:false,next:0,step:0,
 init(){if(this.c)return;try{this.c=new (window.AudioContext||window.webkitAudioContext)();this.m=this.c.createGain();this.m.connect(this.c.destination);this.sfx=this.c.createGain();this.sfx.connect(this.m);this.mus=this.c.createGain();this.mus.gain.value=.32;this.mus.connect(this.m);this.apply();setInterval(()=>this.sched(),50);}catch(e){}},
 resume(){if(this.c&&this.c.state!=='running')this.c.resume();},
 mute(b){this.muted=b;this.apply();},
 apply(){if(!this.c)return;this.sfx.gain.value=S.snd&&!this.muted?1:0;this.mus.gain.value=S.mus&&!this.muted?.3:0;},
 tone(f,d,type='square',v=.2,slide=0,dest,t0){if(!this.c)return;const t=t0||this.c.currentTime,o=this.c.createOscillator(),g=this.c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f*slide),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(dest||this.sfx);o.start(t);o.stop(t+d+.02);},
 noise(d,v=.3,hp=800,dest,t0){if(!this.c)return;const t=t0||this.c.currentTime,n=this.c.sampleRate*d|0,b=this.c.createBuffer(1,n,this.c.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);const s=this.c.createBufferSource();s.buffer=b;const f=this.c.createBiquadFilter();f.type='highpass';f.frequency.value=hp;const g=this.c.createGain();g.gain.value=v;s.connect(f);f.connect(g);g.connect(dest||this.sfx);s.start(t);},
 play(n,p=1){switch(n){
  case'launch':this.tone(220,.25,'sawtooth',.15,3);this.noise(.15,.15,2000);break;
  case'bounce':this.tone(160*p,.12,'sine',.25,.5);break;
  case'hit':this.tone(300,.12,'square',.18,.3);this.noise(.12,.35,600);break;
  case'pop':this.tone(500*p,.18,'square',.15,2.2);this.tone(750*p,.12,'triangle',.15,2);this.noise(.2,.3,300);break;
  case'crate':this.noise(.25,.45,200);this.tone(120,.2,'square',.15,.4);break;
  case'boom':this.noise(.6,.7,60);this.tone(90,.5,'sawtooth',.3,.2);break;
  case'coin':this.tone(988,.07,'square',.1);this.tone(1319,.15,'square',.1,1,null,this.c&&this.c.currentTime+.06);break;
  case'gem':[880,1109,1319,1760].forEach((f,i)=>this.tone(f,.12,'triangle',.14,1,null,this.c&&this.c.currentTime+i*.05));break;
  case'click':this.tone(660,.06,'square',.12,1.5);break;
  case'win':[523,659,784,1047,1319].forEach((f,i)=>this.tone(f,.25,'square',.12,1,null,this.c&&this.c.currentTime+i*.1));break;
  case'lose':[392,330,262,196].forEach((f,i)=>this.tone(f,.3,'triangle',.15,1,null,this.c&&this.c.currentTime+i*.15));break;
  case'combo':this.tone(600*p,.2,'square',.12,1.5);break;
  case'pad':this.tone(200,.3,'sine',.3,4);this.tone(400,.2,'square',.08,3);break;
  case'portal':this.tone(300,.4,'sine',.2,4);this.tone(900,.3,'triangle',.1,.3);break;
  case'sizzle':this.noise(.5,.4,1500);this.tone(200,.3,'sawtooth',.15,.3);break;
  case'throw':this.tone(500,.15,'triangle',.1,.4);break;
  case'bomb':this.noise(.4,.5,100);this.tone(110,.3,'sawtooth',.2,.3);break;
  case'glass':this.noise(.3,.4,3000);[1800,2400,3100].forEach((f,i)=>this.tone(f,.15,'triangle',.08,1,null,this.c&&this.c.currentTime+i*.03));break;
  case'clang':this.tone(1400,.25,'triangle',.15,.8);this.tone(2100,.2,'sine',.1,.9);break;
 }},
 sched(){if(!this.c||this.c.state!=='running')return;const spb=60/128/2;if(this.next<this.c.currentTime)this.next=this.c.currentTime+.05;
  const prog=[[48,55,60,64],[43,50,55,59],[45,52,57,60],[41,48,53,57]];
  while(this.next<this.c.currentTime+.2){const s=this.step,bar=(s>>3)%4,ch=prog[bar],t=this.next,mf=m=>440*Math.pow(2,(m-69)/12);
   if(s%2==0)this.tone(mf(ch[0]-12),.2,'sawtooth',.13,1,this.mus,t);
   if(s%4==0){this.tone(150,.15,'sine',.5,.3,this.mus,t);}
   if(s%4==2)this.noise(.05,.15,6000,this.mus,t);
   if(s%8==4)this.noise(.12,.25,1500,this.mus,t);
   const arp=[ch[1],ch[2],ch[3],ch[2]+12][s%4];if((s>>5)%2==1||s%2==0)this.tone(mf(arp+12),.12,'square',.05,1,this.mus,t);
   const mel=[0,0,2,-1,3,-1,2,1, 0,-1,1,-1,3,2,1,-1];const mi=mel[s%16];if(mi>=0&&(s>>6)%2==1)this.tone(mf(ch[mi]+24),.18,'triangle',.08,1,this.mus,t);
   this.next+=spb;this.step++;}}
};
// ---------- utils ----------
const rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t;
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
const OUT='#24123a';
function txt(s,x,y,size,col='#fff',align='center',stroke=OUT,sw){ctx.font=`900 ${size}px "Arial Black","Segoe UI",Arial,sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.lineJoin='round';ctx.lineWidth=sw||size*.22;ctx.strokeStyle=stroke;ctx.strokeText(s,x,y+size*.06);ctx.strokeText(s,x,y);
 if(Array.isArray(col)){const g=ctx.createLinearGradient(0,y-size/2,0,y+size/2);g.addColorStop(0,col[0]);g.addColorStop(1,col[1]);ctx.fillStyle=g;}else ctx.fillStyle=col;ctx.fillText(s,x,y);}
// ---------- themes ----------
const THEMES=[
 {n:'Sunny Meadow',sky:['#3fb8ff','#bff3ff'],hills:['#7be36b','#4fc94f','#2fa84a'],top:'#6ee34a',top2:'#3fb52f',body:['#c9824a','#8f5130'],sun:'#fff3a0'},
 {n:'Candy Bay',sky:['#ff6fd0','#ffd4f0'],hills:['#ffb0e5','#ff86cf','#e85fb8'],top:'#ffffff',top2:'#ffc2ec',body:['#ff9a5c','#d9603a'],sun:'#fffbd0'},
 {n:'Snow City',sky:['#5aa8ff','#e3f4ff'],hills:['#c9e6ff','#9cc8f5','#6f9fe0'],top:'#ffffff',top2:'#d4ecff',body:['#7f8fb8','#4f5c86'],sun:'#ffffff',city:1,snow:1,ice:1},
 {n:'Sunset Dunes',sky:['#ff7a3d','#ffd36b'],hills:['#ffb257','#f08b3a','#cf6428'],top:'#ffe08a',top2:'#f2b84a',body:['#d87a3a','#9c4a24'],sun:'#fff0a0'},
 {n:'Neon Night',sky:['#1c0b4d','#6a2bd9'],hills:['#4b23a8','#38188a','#24106b'],top:'#38f0ff',top2:'#1aa8e8',body:['#3b2a8f','#231659'],sun:'#ff5ef2',city:1,stars:1},
 {n:'Lava Volcano',sky:['#4a0d1f','#ff6a2b'],hills:['#8a2a2a','#5e1a24','#3a0f1c'],top:'#ff9a3d',top2:'#d9531a',body:['#5a3a4a','#2e1a2a'],sun:'#ffcf5a',lava:1,embers:1},
 {n:'Pirate Bay',sky:['#22b8ff','#c8f6ff'],hills:['#7fe0ff','#2fb0e8','#1a7fd0'],top:'#ffd27a',top2:'#e0a040',body:['#b06a35','#7a4220'],sun:'#fff6b0',water:1,sea:1},
 {n:'Sky Castle',sky:['#7fc8ff','#ffe8fa'],hills:['#ffffff','#f3e6ff','#e3d0ff'],top:'#fff4ff',top2:'#d9c2ff',body:['#a68cff','#6a4fd8'],sun:'#fffbe0',wind:1,castle:1},
];
const SKINS=[
 {n:'Boing',c:['#ffe14d','#ff9a1a'],acc:0,p:0},{n:'Bubblegum',c:['#ff8ad8','#e0359e'],acc:1,p:150},{n:'Minty',c:['#7dffb2','#14c06a'],acc:2,p:250},
 {n:'Blue Bolt',c:['#7ad8ff','#1f7cff'],acc:3,p:400},{n:'Lava',c:['#ff7a4d','#d4140f'],acc:4,p:600},{n:'Royal',c:['#c79bff','#6b2bdb'],acc:5,p:900},
 {n:'Snowball',c:['#ffffff','#a9c8ff'],acc:6,p:1200},{n:'Ninja',c:['#5a5a7a','#22223a'],acc:7,p:1600},{n:'Golden',c:['#fff6a8','#e8a400'],acc:5,p:2500},{n:'Galaxy',c:['#5effe8','#7a1cff'],acc:8,p:4000},
 {n:'Pirate',c:['#ffb36b','#e0601a'],acc:9,p:1800},{n:'Ocean',c:['#6bfff0','#1a8cff'],acc:9,p:2000},{n:'Angel',c:['#fffbe0','#ffd36b'],acc:10,p:2200},
 {n:'Cotton',c:['#ffd0f5','#b08cff'],acc:10,p:2600},{n:'Inferno',c:['#ffde4d','#ff3b1a'],acc:11,p:3000},{n:'Shadow',c:['#7a5cff','#1a0f3a'],acc:11,p:5000}];
const HEROES=[{n:'Classic',d:'Balanced bouncer',p:0},{n:'Tank',d:'Heavy: one-hit helmets & shields',p:1500},{n:'Trio',d:'Splits into 3 balls each fling',p:2500},{n:'Gloop',d:'Sticky: clings to any surface',p:3500}];
const UPG={power:{n:'POWER',d:'Faster launch & harder hits',max:5,cost:l=>120+l*140},shots:{n:'EXTRA SHOT',d:'+1 launch every level',max:3,cost:l=>300+l*300},magnet:{n:'MAGNET',d:'Pull coins & gems',max:3,cost:l=>200+l*200}};
const NLEV=82;
const FIX={59:1,81:1};
function themeFor(i){return i<40?Math.floor(i/8)%5:i<82?5+Math.min(2,Math.floor((i-40)/14)):(i*7)%8;}
function genLevel(i,seed){
 const r=mulberry(seed!=null?seed:i*7919+13+(FIX[i]||0)*101),th=THEMES[themeFor(seed!=null?(Math.floor(seed/7)%82):i)];
 const L={i,th,plats:[],enemies:[],crates:[],gems:[],pads:[],portals:[],haz:[],type:'kill',timer:0,shots:0,wind:0,waves:null};
 const boss=(i+1)%10==0;
 const NT=[];if(i>=11)NT.push('flag');if(i>=17)NT.push('hill');if(i>=23)NT.push('escort');if(i>=29)NT.push('waves');if(i>=35)NT.push('combo');
 L.type=boss?'boss':['kill','targets','kill','gems','targets'][i%5];
 if(!boss&&NT.length&&i%3==2)L.type=NT[Math.floor(i/3)%NT.length];
 if(i==0)L.type='kill';
 const esc=L.type=='escort'||L.type=='combo';
 if(th.lava&&!esc){const n=1+Math.floor(r()*2);for(let k=0;k<n;k++){const w=110+r()*60,x=380+k*400+r()*140;L.haz.push({t:'lava',x,w});}}
 if(th.water&&!esc){const w=180+r()*120,x=450+r()*480;L.haz.push({t:'water',x,w});}
 if(th.wind)L.wind=(r()<.5?-1:1)*(110+r()*110);
 const np=Math.min(2+Math.floor(Math.min(i,40)/4),6);
 for(let k=0,tries=0;k<np&&tries<200;tries++){const w=150+r()*150,h=30,x=330+r()*(1180-330-w),y=230+r()*290;
  if(L.plats.some(p=>x<p.x+p.w+50&&x+w>p.x-50&&y<p.y+p.h+90&&y+h>p.y-90))continue;const pl={x,y,w,h};if(th.ice&&r()<.6)pl.ice=1;if(th.wind&&r()<.3)pl.ice=1;L.plats.push(pl);k++;}
 if(i>7&&i%2==1&&!esc){const x=560+r()*300;L.plats.push({x,y:GY-140-r()*60,w:40,h:400,pillar:1});}
 if(i>=19&&L.plats.length>2&&!esc){const p=L.plats[0];p.mv={ox:p.x,oy:p.y,ax:r()<.6?80:0,ay:0,sp:.7+r()*.5,ph:r()*6};if(!p.mv.ax)p.mv.ay=55;}
 const occ=[];
 const free=(p,x0,x1)=>!occ.some(o=>o.p===p&&x0<o.x1+6&&x1>o.x0-6)&&(p||(!L.haz.some(h=>x0<h.x+h.w+20&&x1>h.x-20)&&!L.plats.some(q=>q.pillar&&x1>q.x-10&&x0<q.x+q.w+10)));
 const spot=(w,gr)=>{const pl=L.plats.filter(p=>!p.pillar&&!p.mv&&p.w>=w+20);for(let t=0;t<60;t++){let p=null,x;if(!gr&&r()<.55&&pl.length){p=pl[Math.floor(r()*pl.length)];x=p.x+10+w/2+r()*(p.w-20-w);}else x=380+w/2+r()*(1230-380-w);
   const x0=x-w/2,x1=x+w/2;if(free(p,x0,x1)){occ.push({p,x0,x1});return{x,y:p?p.y:GY,p};}}return{x:380+r()*800,y:GY,p:null};};
 const kinds=['norm','norm'];if(i>=7)kinds.push('fly');if(i>=13)kinds.push('shield');if(i>=21)kinds.push('split');if(i>=27)kinds.push('bomb');
 const addEnemy=(big,gr,fk)=>{const s=spot(big?140:56,gr);const k=fk||(big?'norm':kinds[Math.floor(r()*kinds.length)]);
  const e={x:s.x,y:s.y-(big?62:24),r:big?62:24,hp:big?6+Math.floor(Math.min(i,80)/10)*2:1,boss:big,sp:big?40:(i>2?20+r()*40:0),dir:r()<.5?-1:1,kind:Math.floor(r()*3),type:k,vx:0,vy:0,alive:1,t:r()*5,flash:0};
  if(k=='norm'&&i>5&&r()<.3){e.hp=2;e.helm=1;}
  if(k=='fly'){e.fly=1;e.by=Math.max(130,s.y-110-r()*90);e.y=e.by;}
  if(k=='shield')e.shield=1;if(k=='split')e.split=1;if(k=='bomb'){e.bomber=1;e.bt=1.5+r()*2;e.sp*=.5;}
  e.maxhp=e.hp;L.enemies.push(e);return e;};
 const nE=(a)=>Math.min(a+Math.floor(Math.min(i,60)/3),9);
 if(L.type=='kill'){const n=nE(2);for(let k=0;k<n;k++)addEnemy();L.shots=Math.ceil(n*1.5)+3;}
 if(L.type=='boss'){const b=addEnemy(true,true);b.x=1020;b.y=GY-62;occ.push({p:null,x0:940,x1:1100});for(let k=0;k<2;k++)addEnemy();L.shots=b.hp+5;}
 if(L.type=='targets'){const n=Math.min(3+Math.floor(i/4),8);for(let k=0;k<n;k++){const s=spot(60);L.crates.push({x:s.x-28,y:s.y-56,w:56,h:56,target:1});}const e=1+Math.floor(Math.min(i,60)/8);for(let k=0;k<e;k++)addEnemy();L.shots=Math.ceil(n*1.5)+3;L.timer=35+n*5;}
 if(L.type=='gems'){const n=Math.min(5+Math.floor(i/5),10);for(let k=0;k<n;k++){L.gems.push({x:380+r()*840,y:140+r()*400,t:r()*6});}for(let k=0;k<2;k++)addEnemy();L.shots=n+3;}
 if(L.type=='flag'){let s;for(let t=0;t<12;t++){s=spot(40);if(s.x>760)break;occ.pop();}L.flag={x:s.x,y:s.y-40,home:230};const n=2+Math.floor(i/20);for(let k=0;k<n;k++)addEnemy();L.shots=8;}
 if(L.type=='hill'){L.zone={x:640+r()*320,w:240,need:4};const z=L.zone;L.haz=L.haz.filter(h=>h.x>z.x+z.w+30||h.x+h.w<z.x-30);occ.push({p:null,x0:z.x,x1:z.x+z.w});const n=2+Math.floor(i/25);for(let k=0;k<n;k++)addEnemy();L.timer=50;L.shots=9;}
 if(L.type=='escort'){L.friend={x:150,y:GY-22,r:22,hp:3};L.goalX=1200;const n=2+Math.floor(i/15);for(let k=0;k<n;k++){const e=addEnemy(false,true,['norm','shield','bomb'][k%(i>=27?3:2)]);}L.shots=n*2+4;}
 if(L.type=='waves'){L.waves=[];const sizes=[2,3,4];for(const sz of sizes){const st=L.enemies.length;for(let k=0;k<sz;k++)addEnemy();L.waves.push(L.enemies.splice(st));occ.length=0;}L.enemies=L.waves[0];L.shots=16;}
 if(L.type=='combo'){L.comboNeed=3;const x0=560+r()*250;occ.push({p:null,x0:x0-40,x1:x0+6*58});L.row=[];for(let k=0;k<6;k++)L.row.push({x:x0+k*58});L.enemies=L.row.map(q=>({x:q.x,y:GY-24,r:24,hp:1,maxhp:1,sp:0,dir:-1,kind:k2(q),type:'norm',vx:0,vy:0,alive:1,t:r()*5,flash:0,row:1}));L.shots=10;}
 function k2(){return Math.floor(r()*3);}
 if(!esc){const nc=i>1?1+Math.floor(r()*3):0;for(let k=0;k<nc;k++){const s=spot(56);L.crates.push({x:s.x-26,y:s.y-52,w:52,h:52,tnt:i>3&&r()<.45});}}
 if(i>=15&&!esc){const ng=1+Math.floor(r()*2);for(let k=0;k<ng;k++){const s=spot(34);L.crates.push({x:s.x-12,y:s.y-110,w:24,h:110,glass:1});}}
 if(i>=9&&r()<.75){const s=spot(84,true);L.pads.push({x:s.x-35,w:70,sq:0});}
 if(i>=25&&r()<.6&&!esc){L.portals=[{x:240+r()*100,y:220+r()*120},{x:820+r()*320,y:160+r()*200}];}
 if(i>11)L.shots+=1;if(i>23)L.shots+=1;if(i>50)L.shots+=1;
 return L;}
const GOALTXT={kill:L=>`DEFEAT ALL ${L.enemies.length} GRUMPS!`,boss:()=>'BEAT THE BOSS!',targets:L=>`SMASH ${L.crates.filter(c=>c.target).length} TARGETS IN ${L.timer}s!`,gems:L=>`GRAB ALL ${L.gems.length} GEMS!`,
 flag:()=>'CAPTURE THE FLAG & BRING IT HOME!',hill:()=>'HOLD THE GOLD ZONE FOR 4s!',escort:()=>'CLEAR THE WAY FOR BUDDY!',waves:()=>'SURVIVE 3 WAVES!',combo:()=>'HIT A x3 COMBO IN ONE FLING!'};
const ACH=[['first','First Smash','Defeat a Grump',s=>s.kills>=1],['k100','Grump Squasher','Defeat 100 Grumps',s=>s.kills>=100],['k500','Grump Legend','Defeat 500 Grumps',s=>s.kills>=500],
 ['c5','Combo Master','Get a x5 combo',s=>s.maxCombo>=5],['boss','Boss Buster','Beat a boss',s=>s.bosses>=1],['boss5','Boss Hunter','Beat 5 bosses',s=>s.bosses>=5],['crate','Demolition','Break 50 crates',s=>s.crates>=50],
 ['gem','Gem Hoarder','Collect 50 gems',s=>s.gems>=50],['w41','World Traveler','Reach level 41',()=>S.unlocked>=41],['all','Champion','Unlock every level',()=>S.unlocked>=NLEV],
 ['stars','Star Collector','Earn 60 stars',()=>S.stars.reduce((a,b)=>a+(b||0),0)>=60],['daily','Daily Hero','Win a daily challenge',s=>s.daily>=1],['end10','Endless Runner','Clear 10 Endless stages',()=>S.endBest>=10],
 ['skins','Fashionista','Own 6 skins',()=>S.skins.length>=6],['hero','New Friend','Unlock a new hero',()=>S.heroes.length>=2]];
let achQ=[];
function stat(k,n=1){S.st[k]=(S.st[k]||0)+n;}
function checkAch(){let ch=0;for(const a of ACH)if(!S.ach.includes(a[0])&&a[3](S.st)){S.ach.push(a[0]);S.coins+=100;achQ.push({a,t:2.8});Audio.play('win');ch=1;}if(ch)save();}
// ---------- state ----------
let scene='title',G=null,T=0,shake=0,hitstop=0,parts=[],pops=[],buttons=[],ptr={x:0,y:0,down:false},trans=0,banner=0,flyCoins=[];
let lvlPage=0,shopTab=0,panel=null,toast=null;
const dayNum=()=>Math.floor(Date.now()/864e5);
function startLevel(i,mode='normal',seed=null,run=0){Audio.init();Audio.resume();const L=genLevel(i,seed);const hr=S.hero==1?34:28;
 G={L,i,mode,seed,run,p:{x:110,y:GY-hr,vx:0,vy:0,r:hr,rot:0,sq:1,trail:[]},shots:L.shots+S.upg.shots,maxShots:L.shots+S.upg.shots,time:L.timer,coins:0,combo:0,comboT:0,aim:null,launched:0,still:0,done:0,doneT:0,kills:0,elapsed:0,dead:[],debris:[],kbAng:-0.6,kbPow:.7,lastLaunch:-99,
  minis:[],bombs:[],wave:0,waveT:0,hold:0,carry:0,bestCombo:0,rowT:0,friend:L.friend?Object.assign({t:0,cd:0},L.friend):null};
 scene='game';panel=null;banner=2.4;parts=[];pops=[];SDK.call('gameplayStart');}
function startDaily(){const d=dayNum();startLevel(28+d%50,'daily',d*7919+5);}
function startEndless(n,sess){sess=sess||Math.floor(Math.random()*1e6);let i=Math.min(6+n*3,79);if((i+1)%10==0)i++;startLevel(i,'endless',sess*31+n*977,n);G.sess=sess;}
function allDead(){return G.L.enemies.every(e=>!e.alive);}
function goal(){const L=G.L,p=G.p;switch(L.type){case'kill':return allDead();case'boss':return L.enemies.every(e=>!e.boss||!e.alive);case'targets':return L.crates.every(c=>!c.target||c.broken);case'gems':return L.gems.every(g=>g.got);
 case'flag':return G.carry&&p.x<L.flag.home&&p.y>GY-140;case'hill':return G.hold>=L.zone.need;case'escort':return G.friend.x>=L.goalX;case'waves':return G.wave==L.waves.length-1&&allDead();case'combo':return G.bestCombo>=L.comboNeed;}}
function progressTxt(){const L=G.L;switch(L.type){case'kill':return`${L.enemies.filter(e=>!e.alive).length}/${L.enemies.length}`;case'boss':{const b=L.enemies[0];return`BOSS ${Math.max(0,b.hp)}/${b.maxhp}`;}
 case'targets':{const t=L.crates.filter(c=>c.target);return`${t.filter(c=>c.broken).length}/${t.length}`;}case'gems':return`${L.gems.filter(g=>g.got).length}/${L.gems.length}`;
 case'flag':return G.carry?'BRING IT HOME! ◀':'GET THE FLAG! ▶';case'hill':return`ZONE ${Math.min(G.hold,4).toFixed(1)}/4s`;case'escort':return`BUDDY ${'♥'.repeat(Math.max(0,G.friend.hp))} ${Math.floor(clamp((G.friend.x-150)/(L.goalX-150),0,1)*100)}%`;
 case'waves':return`WAVE ${G.wave+1}/3 • ${L.enemies.filter(e=>!e.alive).length}/${L.enemies.length}`;case'combo':return`BEST COMBO ${G.bestCombo}/${L.comboNeed}`;}}
// ---------- particles ----------
function burst(x,y,n,cols,sp=300,sz=8,g=600){for(let k=0;k<n;k++){const a=Math.random()*6.28,s=Math.random()*sp;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-sp*.3,l:rnd(.4,.9),ml:.9,c:cols[k%cols.length],s:rnd(sz*.5,sz*1.3),g,sh:Math.random()<.3?1:0,rot:Math.random()*6});}}
function ring(x,y,c,r=80){parts.push({ring:1,x,y,r:10,mr:r,l:.35,ml:.35,c});}
function pop(s,x,y,col='#fff',size=40){pops.push({s,x,y,l:1.1,col,size});}
function addCoins(n,x,y){for(let k=0;k<Math.min(n,8);k++)flyCoins.push({x:x+rnd(-20,20),y:y+rnd(-20,20),vx:rnd(-250,250),vy:rnd(-400,-150),t:0});}
// ---------- physics ----------
function solids(){const L=G.L;return L.plats.concat(L.crates.filter(c=>!c.broken));}
function circRect(o,b,rest){const cx=clamp(o.x,b.x,b.x+b.w),cy=clamp(o.y,b.y,b.y+b.h);let dx=o.x-cx,dy=o.y-cy,d2=dx*dx+dy*dy;if(d2>=o.r*o.r)return null;let d=Math.sqrt(d2),nx,ny;
 if(d<1e-4){const l=o.x-b.x,rt=b.x+b.w-o.x,t=o.y-b.y,bt=b.y+b.h-o.y,m=Math.min(l,rt,t,bt);nx=m==l?-1:m==rt?1:0;ny=m==t?-1:m==bt?1:0;o.x+=nx*(o.r+m);o.y+=ny*(o.r+m);}else{nx=dx/d;ny=dy/d;o.x+=nx*(o.r-d);o.y+=ny*(o.r-d);}
 const vn=o.vx*nx+o.vy*ny;if(vn<0){o.vx-=(1+rest)*vn*nx;o.vy-=(1+rest)*vn*ny;const fr=b.ice?0:.08,tx=-ny,ty=nx,vt=o.vx*tx+o.vy*ty;o.vx-=vt*tx*fr;o.vy-=vt*ty*fr;}return{nx,ny,vn};}
function bounds(o,rest){let hit=0;if(o.x<o.r){o.x=o.r;if(o.vx<0){o.vx=-o.vx*rest;hit=Math.abs(o.vx);}}if(o.x>W-o.r){o.x=W-o.r;if(o.vx>0){o.vx=-o.vx*rest;hit=Math.abs(o.vx);}}if(o.y<o.r-150){o.y=o.r-150;if(o.vy<0)o.vy=-o.vy*rest;}
 if(o.y>GY-o.r){o.y=GY-o.r;if(o.vy>0){hit=Math.max(hit,o.vy);o.vy=-o.vy*rest;if(Math.abs(o.vy)<60)o.vy=0;o.vx*=.94;}}return hit;}
function power(){return (1150+S.upg.power*90)*(S.hero==1?.95:1);}
function launch(vx,vy){const p=G.p;p.vx=vx;p.vy=vy;p.stuck=0;G.shots--;G.lastLaunch=G.elapsed;G.launched=1;G.still=0;G.combo=0;p.sq=.6;Audio.play('launch');burst(p.x,p.y,14,['#fff','#ffe14d'],200,6,0);ring(p.x,p.y,'#fff',60);
 if(S.hero==2)for(const s of[-1,1]){const a=.15*s,c=Math.cos(a),sn=Math.sin(a);G.minis.push({x:p.x,y:p.y,vx:vx*c-vy*sn,vy:vx*sn+vy*c,r:17,l:3.2,rot:0});}
 if(!S.tut){S.tut=1;save();}}
function stick(o){o.vx=o.vy=0;o.stuck=1;Audio.play('bounce',.5);burst(o.x,o.y,10,['#7dff6b','#c8ffb0','#fff'],160,6,300);}
function respawn(){const p=G.p;burst(p.x,p.y,30,['#ff5a1f','#ffd60a','#fff'],400,9);Audio.play('sizzle');pop('OUCH!',p.x,p.y-50,['#fff36b','#ff5a1f'],44);p.x=110;p.y=GY-p.r;p.vx=p.vy=0;p.stuck=0;shake=12;ring(110,GY-p.r,'#fff',70);}
function bodyStep(o,dt,main){const L=G.L,hv=S.hero==1&&main;
 if(!o.stuck){o.vy+=1500*dt;if(L.wind&&o.y<GY-o.r-2)o.vx+=L.wind*dt*(hv?.4:1);}
 o.x+=o.vx*dt;o.y+=o.vy*dt;const rest=hv?.45:.62;const pre0=Math.hypot(o.vx,o.vy);let bh=bounds(o,rest);
 const canStick=main&&S.hero==3&&!o.stuck&&G.elapsed-G.lastLaunch>.06;
 if(canStick&&bh>150){stick(o);return 0;}
 for(const b of solids()){const pre=Math.hypot(o.vx,o.vy);const h=circRect(o,b,rest);if(h){bh=Math.max(bh,-h.vn);
  if(L.crates.includes(b)&&pre>(b.glass?130:170)){breakCrate(b);o.vx*=.82;o.vy*=.82;}else if(canStick&&pre>110){stick(o);return 0;}}}
 for(const z of L.haz)if(o.x>z.x&&o.x<z.x+z.w&&o.y>GY-o.r-3){if(z.t=='lava'){if(main){respawn();return 0;}else o.l=0;}else{o.vx*=Math.pow(.12,dt);if(Math.random()<.2)parts.push({x:o.x+rnd(-20,20),y:GY-10,vx:0,vy:-80,l:.6,ml:.6,c:'#e0f8ff',s:6,g:-50});}}
 for(const pd of L.pads)if(o.x>pd.x-8&&o.x<pd.x+pd.w+8&&o.y+o.r>GY-30&&o.vy>-300){o.vy=-1420;o.y=GY-30-o.r;o.stuck=0;pd.sq=1;Audio.play('pad');burst(pd.x+35,GY-30,12,['#fff','#ffe14d'],220,6);}
 if(L.portals.length&&!(o.pcd>G.elapsed))for(let k=0;k<2;k++){const q=L.portals[k];if(Math.hypot(o.x-q.x,o.y-q.y)<34){const d=L.portals[1-k];o.x=d.x;o.y=d.y;o.pcd=G.elapsed+.7;o.stuck=0;Audio.play('portal');ring(d.x,d.y,'#fff',90);ring(q.x,q.y,'#fff',90);burst(d.x,d.y,16,['#5ef2ff','#ff9a1a','#fff'],260,6,0);break;}}
 return bh;}
function breakCrate(c){if(c.broken)return;c.broken=1;const cx=c.x+c.w/2,cy=c.y+c.h/2;stat('crates');
 if(c.glass){for(let k=0;k<10;k++)G.debris.push({x:cx+rnd(-10,10),y:c.y+rnd(0,c.h),vx:rnd(-350,350),vy:rnd(-500,-100),rot:0,vr:rnd(-15,15),s:rnd(8,16),l:1.2,glass:1});Audio.play('glass');burst(cx,cy,14,['#d8fbff','#8fe8ff','#fff'],300,6);shake=Math.max(shake,5);return;}
 for(let k=0;k<6;k++)G.debris.push({x:cx+rnd(-15,15),y:cy+rnd(-15,15),vx:rnd(-400,400),vy:rnd(-600,-200),rot:0,vr:rnd(-12,12),s:rnd(14,24),l:1.6,tnt:c.tnt,target:c.target});
 burst(cx,cy,18,c.tnt?['#ff3b30','#ffd60a','#fff']:['#ffcf6b','#c27a35','#fff'],350,9);shake=Math.max(shake,8);
 if(c.tnt){Audio.play('boom');shake=22;hitstop=.08;ring(cx,cy,'#ffd60a',200);burst(cx,cy,40,['#ff5a1f','#ffd60a','#fff','#ff2d55'],700,12,300);pop('BOOM!',cx,cy-40,['#fff36b','#ff7a1a'],64);
  for(const e of G.L.enemies)if(e.alive&&Math.hypot(e.x-cx,e.y-cy)<190){if(e.boss)damage(e,2,(e.x-cx),-300);else kill(e,(e.x-cx)*5,-700);}
  for(const o of G.L.crates)if(!o.broken&&Math.hypot(o.x+o.w/2-cx,o.y+o.h/2-cy)<170)setTimeout(()=>G&&breakCrate(o),80);
  const p=G.p,d=Math.hypot(p.x-cx,p.y-cy)||1;if(d<200){p.stuck=0;p.vx+=(p.x-cx)/d*500;p.vy-=500;}}
 else Audio.play('crate');
 if(c.target){pop('+15',cx,cy-30,'#ffe14d');G.coins+=15;addCoins(15,cx,cy);}else{G.coins+=5;addCoins(5,cx,cy);}}
function kill(e,vx,vy){if(!e.alive)return;e.alive=0;G.kills++;G.combo++;G.comboT=1.5;G.bestCombo=Math.max(G.bestCombo,G.combo);stat('kills');S.st.maxCombo=Math.max(S.st.maxCombo||0,G.combo);if(e.boss)stat('bosses');
 const val=e.boss?100:10+(G.combo-1)*5;G.coins+=val;addCoins(val,e.x,e.y);
 G.dead.push({x:e.x,y:e.y,vx,vy,rot:0,vr:rnd(-14,14),r:e.r,l:2.2,e});
 burst(e.x,e.y,e.boss?60:24,['#ff4fa3','#ffe14d','#7affd1','#fff'],e.boss?700:420,e.boss?14:9);ring(e.x,e.y,'#fff',e.boss?220:90);
 Audio.play('pop',1+Math.min(G.combo,6)*.12);hitstop=e.boss?.25:.06;shake=Math.max(shake,e.boss?30:10);
 if(e.split&&!e.small){for(const s of[-1,1])G.L.enemies.push({x:e.x+s*12,y:e.y-10,r:16,hp:1,maxhp:1,sp:70,dir:s,kind:2,type:'norm',vx:s*260,vy:-520,alive:1,t:0,flash:0,small:1});pop('SPLIT!',e.x,e.y-60,'#7aff9c',34);}
 if(G.combo>=2){pop(['','','DOUBLE!','TRIPLE!','MEGA!','ULTRA!','INSANE!'][Math.min(G.combo,6)]+' x'+G.combo,640,200,['#fff36b','#ff4f9a'],56);Audio.play('combo',1+G.combo*.1);}
 else pop('+'+val,e.x,e.y-40,'#ffe14d');}
function damage(e,n,dx,vy){e.hp-=n;e.flash=.15;e.vx=Math.sign(dx||1)*220;if(!e.fly)e.vy=vy;Audio.play(e.boss?'hit':'clang');if(e.helm&&e.hp==1){e.helm=0;G.debris.push({x:e.x,y:e.y-e.r,vx:Math.sign(dx)*300,vy:-500,rot:0,vr:15,s:26,l:1.5,helm:1});pop('CLANG!',e.x,e.y-50,'#cfe3ff',36);}
 if(e.boss)pop('-'+n,e.x,e.y-e.r-20,'#ff6b6b',44);hitstop=.05;shake=Math.max(shake,10);burst(e.x,e.y,12,['#fff','#ffd60a'],300,7);if(e.hp<=0)kill(e,dx*4,-600);}
function hurtFriend(f){if(f.cd>G.elapsed||G.done)return;f.hp--;f.cd=G.elapsed+1;f.flash=.3;Audio.play('hit');pop('OW!',f.x,f.y-50,'#ff6b6b',36);shake=8;if(f.hp<=0){burst(f.x,f.y,20,['#7af7ff','#fff'],300,8);endLevel(false);}}
function explode(b){const L=G.L,p=G.p;Audio.play('bomb');ring(b.x,b.y,'#ffd60a',140);burst(b.x,b.y,26,['#ff5a1f','#ffd60a','#fff','#444'],450,9,300);shake=Math.max(shake,10);
 const d=Math.hypot(p.x-b.x,p.y-b.y)||1;if(d<140){const k=S.hero==1?.4:1;p.stuck=0;p.vx+=(p.x-b.x)/d*650*k;p.vy-=450*k;}
 if(G.friend&&Math.hypot(G.friend.x-b.x,G.friend.y-b.y)<110)hurtFriend(G.friend);
 for(const c of L.crates)if(c.glass&&!c.broken&&Math.hypot(c.x+c.w/2-b.x,c.y+c.h/2-b.y)<110)breakCrate(c);}
function contact(o,e,main){const p=o;const sp=Math.hypot(p.vx,p.vy);const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy);if(d>=e.r+p.r)return;const nx=dx/(d||1),ny=dy/(d||1);const hv=S.hero==1&&main;
 const thr=e.boss?260:hv?140:170;
 if(sp>thr&&!(e.hitCd>G.elapsed)){e.hitCd=G.elapsed+.25;
  if(e.shield&&!hv&&(p.x-e.x)*e.dir>0&&ny<.6){Audio.play('clang');pop('BLOCK!',e.x,e.y-50,'#ffe14d',34);burst(e.x+e.dir*e.r,e.y,10,['#fff','#ffe14d'],250,6);const vn=p.vx*nx+p.vy*ny;p.vx-=1.8*vn*nx;p.vy-=1.8*vn*ny;p.x=e.x-nx*(e.r+p.r+1);p.y=e.y-ny*(e.r+p.r+1);e.dir*=-1;return;}
  if(e.boss||(e.hp>1&&!hv)){damage(e,e.boss?(1+(S.upg.power>=3?1:0)+(hv?1:0)):1,nx,-350);const vn=p.vx*nx+p.vy*ny;p.vx-=1.7*vn*nx;p.vy-=1.7*vn*ny;p.x=e.x-nx*(e.r+p.r+1);p.y=e.y-ny*(e.r+p.r+1);}
  else{kill(e,p.vx*.8+nx*200,p.vy*.5-500);p.vx*=hv?.95:.88;p.vy*=hv?.95:.88;}}
 else{p.x=e.x-nx*(e.r+p.r);p.y=e.y-ny*(e.r+p.r);const vn=p.vx*nx+p.vy*ny;if(vn>0){p.vx-=1.5*vn*nx;p.vy-=1.5*vn*ny;}if(ny<-.3&&!p.stuck)p.vy=Math.min(p.vy,-300);}}
function step(dt){const L=G.L,p=G.p;G.elapsed+=dt;
 if(!G.done&&L.timer){G.time-=dt;if(G.time<=0){G.time=0;endLevel(false);}}
 for(const b of L.plats)if(b.mv){const m=b.mv,s=Math.sin(G.elapsed*m.sp+m.ph);b.x=m.ox+s*m.ax;b.y=m.oy+s*m.ay;}
 for(const pd of L.pads)pd.sq=Math.max(0,pd.sq-dt*4);
 let bh=bodyStep(p,dt,true);
 if(bh>180){Audio.play('bounce',clamp(bh/600,0.6,1.6));p.sq=clamp(1-bh/2500,.6,1);burst(p.x,p.y+p.r*.6,5,['#fff'],120,5,200);if(bh>500)shake=Math.max(shake,4);}
 p.rot+=p.vx*dt/p.r;p.sq=lerp(p.sq,1,dt*10);p.trail.push({x:p.x,y:p.y});if(p.trail.length>14)p.trail.shift();
 for(const m of G.minis){bodyStep(m,dt,false);m.l-=dt;}G.minis=G.minis.filter(m=>m.l>0);
 const sp=Math.hypot(p.vx,p.vy);const bodies=[p,...G.minis];
 const mr=40+S.upg.magnet*55;
 for(const g of L.gems){g.t+=dt;if(g.got)continue;for(const o of bodies){const d=Math.hypot(g.x-o.x,g.y-o.y);if(o===p&&d<mr&&S.upg.magnet){g.x+=(p.x-g.x)*dt*6;g.y+=(p.y-g.y)*dt*6;}if(d<o.r+20){g.got=1;stat('gems');Audio.play('gem');burst(g.x,g.y,16,['#5ef2ff','#b07aff','#fff'],300,7,100);ring(g.x,g.y,'#5ef2ff',70);G.coins+=8;pop('+8',g.x,g.y-30,'#7af7ff');break;}}}
 if(L.flag&&!G.carry&&Math.hypot(p.x-L.flag.x,p.y-L.flag.y)<p.r+34){G.carry=1;Audio.play('gem');pop('GOT IT! GO HOME!',640,220,['#fff36b','#ff4f9a'],48);burst(L.flag.x,L.flag.y,24,['#ff2d55','#fff','#ffe14d'],350,8);}
 if(L.zone&&p.x>L.zone.x&&p.x<L.zone.x+L.zone.w&&p.y>GY-150){G.hold+=dt;if(Math.random()<.3)parts.push({x:rnd(L.zone.x,L.zone.x+L.zone.w),y:GY-5,vx:0,vy:-150,l:.8,ml:.8,c:'#ffe14d',s:6,g:-40});}
 const f=G.friend;
 if(f&&!G.done){f.t+=dt;f.flash=Math.max(0,(f.flash||0)-dt);const blocked=L.enemies.some(e=>e.alive&&!e.fly&&e.x-f.x>-10&&e.x-f.x<160&&Math.abs(e.y-f.y)<90);f.walk=!blocked;if(!blocked)f.x+=48*dt;
  for(const e of L.enemies)if(e.alive&&Math.hypot(e.x-f.x,e.y-f.y)<e.r+f.r){hurtFriend(f);e.dir=1;e.x=f.x+e.r+f.r+2;e.vx=200;}}
 for(const e of L.enemies){if(!e.alive)continue;e.t+=dt;e.flash=Math.max(0,e.flash-dt);
  if(e.fly){if(Math.abs(e.vx)>e.sp+5)e.vx*=Math.pow(.05,dt);else e.vx=e.dir*Math.max(e.sp,30);e.x+=e.vx*dt;e.y=e.by+Math.sin(e.t*2.5)*28;if(e.x<330){e.x=330;e.dir=1;}if(e.x>W-e.r){e.x=W-e.r;e.dir=-1;}}
  else{e.vy+=1500*dt;
  if(Math.abs(e.vx)>e.sp+5)e.vx*=Math.pow(.05,dt);else e.vx=e.dir*e.sp;
  e.x+=e.vx*dt;e.y+=e.vy*dt;
  const eo={x:e.x,y:e.y,r:e.r,vx:e.vx,vy:e.vy};let onG=false;
  if(eo.y>GY-eo.r){eo.y=GY-eo.r;eo.vy=0;onG=true;}
  for(const b of solids()){const h=circRect(eo,b,0);if(h){if(h.ny<-.5){eo.vy=0;onG=true;}if(Math.abs(h.nx)>.7){e.dir=h.nx>0?1:-1;}}}
  const minX=L.friend?200:300;if(eo.x<eo.r+minX&&!e.boss){eo.x=eo.r+minX;e.dir=1;}if(eo.x>W-eo.r){eo.x=W-eo.r;e.dir=-1;}
  e.x=eo.x;e.y=eo.y;e.vy=onG?0:eo.vy;
  if(onG&&Math.abs(e.vx)<=e.sp+5&&e.sp>0){const ax=e.x+e.dir*(e.r+4),ay=e.y+e.r+6;const lava=ay>=GY&&L.haz.some(h=>ax>h.x-10&&ax<h.x+h.w+10);const sup=!lava&&(ay>=GY||solids().some(b=>ax>b.x&&ax<b.x+b.w&&ay>b.y&&ay<b.y+b.h));if(!sup)e.dir*=-1;}}
  if(e.bomber&&!G.done){e.bt-=dt;if(e.bt<=0){e.bt=3.4;const tg=f||p,fl=1.1;G.bombs.push({x:e.x,y:e.y-e.r,vx:(tg.x-e.x)/fl,vy:(tg.y-e.y+e.r)/fl-750*fl,t:0});Audio.play('throw');}}
  for(const o of bodies)if(e.alive)contact(o,e,o===p);}
 for(const b of G.bombs){b.vy+=1500*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.t+=dt;if(b.y>GY-10||b.t>4||Math.hypot(b.x-p.x,b.y-p.y)<p.r+12||(f&&Math.hypot(b.x-f.x,b.y-f.y)<f.r+12)||solids().some(s=>b.x>s.x&&b.x<s.x+s.w&&b.y>s.y&&b.y<s.y+s.h)){b.dead=1;explode(b);}}G.bombs=G.bombs.filter(b=>!b.dead);
 if(L.type=='waves'&&allDead()&&G.wave<L.waves.length-1){G.waveT+=dt;if(G.waveT>1){G.waveT=0;G.wave++;L.enemies=L.waves[G.wave];for(const e of L.enemies){if(!e.fly)e.y=-40-Math.random()*120;}pop('WAVE '+(G.wave+1)+'!',640,240,['#fff36b','#ff4f9a'],64);Audio.play('combo',1.3);G.shots+=2;}}
 if(L.type=='combo'&&allDead()&&G.bestCombo<L.comboNeed){G.rowT+=dt;if(G.rowT>1.2){G.rowT=0;for(const e of L.enemies){e.alive=1;e.y=-30;e.vx=0;e.vy=0;}pop('AGAIN!',640,240,'#fff',56);}}
 for(const r of G.dead){r.vy+=1500*dt;r.x+=r.vx*dt;r.y+=r.vy*dt;r.rot+=r.vr*dt;r.l-=dt;if(r.y>GY-r.r*.6){r.y=GY-r.r*.6;r.vy*=-.4;r.vx*=.7;r.vr*=.7;}if(r.x<r.r||r.x>W-r.r){r.vx*=-.6;r.x=clamp(r.x,r.r,W-r.r);}}
 G.dead=G.dead.filter(r=>r.l>0);
 for(const d of G.debris){d.vy+=1500*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.rot+=d.vr*dt;d.l-=dt;if(d.y>GY-6){d.y=GY-6;d.vy*=-.3;d.vx*=.6;d.vr*=.5;}}G.debris=G.debris.filter(d=>d.l>0);
 if(G.comboT>0)G.comboT-=dt;
 if(!G.done&&goal()){G.done=1;G.doneT=1.1;G.win=1;Audio.play('win');pop(L.type=='escort'?'BUDDY IS SAFE!':'LEVEL CLEAR!',640,300,['#fff36b','#ffa41a'],80);for(let k=0;k<5;k++)setTimeout(()=>{burst(rnd(200,1080),rnd(100,400),30,['#ff4fa3','#ffe14d','#5ef2ff','#7dff6b'],500,9,400);Audio.play('pop',1.5);},k*150);}
 if((sp<25&&(p.vy===0||p.y>=GY-p.r-1))||p.stuck)G.still+=dt;else G.still=0;
 const waiting=L.type=='hill'||L.type=='escort';
 if(!G.done&&G.shots<=0&&!waiting&&!G.minis.length&&(G.still>1.0||G.elapsed-G.lastLaunch>6))endLevel(false);
 if(!G.done&&G.shots<=0&&waiting&&G.still>1&&(L.type=='hill'?!(p.x>L.zone.x&&p.x<L.zone.x+L.zone.w):L.enemies.some(e=>e.alive&&!e.fly&&e.x>f.x)))endLevel(false);
 if(G.done&&G.doneT>0){G.doneT-=dt;if(G.doneT<=0&&G.win)finishWin();}}
function endLevel(win){if(G.done)return;G.done=1;G.win=0;Audio.play('lose');SDK.call('gameplayStop');setTimeout(()=>{panel={type:'lose',t:0};},700);}
function finishWin(){SDK.call('gameplayStop');const shotsLeft=G.shots,stars=shotsLeft>=2?3:shotsLeft>=1?2:1;const i=G.i;
 let reward=20+Math.min(i,80)*3+stars*5;G.bonusTxt='Level bonus';
 if(G.mode=='daily'){if(S.daily!=dayNum()){S.daily=dayNum();reward+=250;stat('daily');G.bonusTxt='Daily bonus';}}
 if(G.mode=='endless'){S.endBest=Math.max(S.endBest||0,G.run+1);G.bonusTxt='Stage '+(G.run+1)+' bonus';}
 G.reward=reward;G.stars=stars;G.total=G.coins+reward;S.coins+=G.total;
 if(G.mode=='normal'){S.stars[i]=Math.max(S.stars[i]||0,stars);S.unlocked=Math.max(S.unlocked,Math.min(NLEV,i+2));}
 stat('wins');save();checkAch();panel={type:'win',t:0,doubled:0};}
// ---------- drawing ----------
function drawBG(th,px){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,th.sky[0]);g.addColorStop(1,th.sky[1]);ctx.fillStyle=g;ctx.fillRect(-50,-50,W+100,H+100);
 if(th.stars){for(let k=0;k<60;k++){const x=(k*137.5)%W,y=(k*71.3)%380;ctx.globalAlpha=.4+.6*Math.abs(Math.sin(T*2+k));ctx.fillStyle='#fff';ctx.fillRect(x,y,3,3);}ctx.globalAlpha=1;}
 const sx=1040-px*.02,sy=130;const sg=ctx.createRadialGradient(sx,sy,10,sx,sy,220);sg.addColorStop(0,th.sun);sg.addColorStop(.25,th.sun+'aa');sg.addColorStop(1,th.sun+'00');ctx.fillStyle=sg;ctx.fillRect(sx-220,sy-220,440,440);ctx.fillStyle=th.sun;ctx.beginPath();ctx.arc(sx,sy,55,0,7);ctx.fill();
 // rays
 ctx.save();ctx.translate(sx,sy);ctx.rotate(T*.1);ctx.globalAlpha=.12;ctx.fillStyle='#fff';for(let k=0;k<12;k++){ctx.rotate(Math.PI/6);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(900,-60);ctx.lineTo(900,60);ctx.fill();}ctx.restore();ctx.globalAlpha=1;
 // clouds
 for(let k=0;k<5;k++){const x=((k*300+T*(12+k*4))%(W+400))-200-px*.03,y=70+k*45%160;cloud(x,y,0.7+(k%3)*.25,th.stars?'rgba(255,255,255,.18)':'rgba(255,255,255,.9)');}
 // hills
 th.hills.forEach((c,k)=>{const f=.02+k*.03,base=430+k*70;ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(-60,H);for(let x=-60;x<=W+60;x+=20){const y=base-Math.sin((x+k*200-px*f*8)/(150+k*40))*(40-k*6)-Math.sin((x+k*90)/63)*8;ctx.lineTo(x-px*f,y);}ctx.lineTo(W+60,H);ctx.fill();
  if(th.city&&k==1){ctx.fillStyle=k==1?shade(c,-25):c;for(let b=0;b<14;b++){const bx=b*100-px*f*1.5+((b*37)%40),bh=80+((b*53)%120);ctx.fillRect(bx,base-bh-20,70,bh+200);ctx.fillStyle=th.stars?'#ffe66b':'#ffffffaa';for(let wy=0;wy<bh-20;wy+=26)for(let wx=10;wx<60;wx+=22)if(((b+wy+wx)%3))ctx.fillRect(bx+wx,base-bh-10+wy,10,12);ctx.fillStyle=shade(c,-25);}}
  ctx.lineWidth=3;ctx.strokeStyle='rgba(255,255,255,.25)';});
 bgExtra(th,px);if(th.snow){ctx.fillStyle='#fff';for(let k=0;k<70;k++){const x=(k*97+T*30*(1+k%3))%W,y=(k*53+T*(60+k%5*20))%H;ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(x,y,2+k%3,0,7);ctx.fill();}ctx.globalAlpha=1;}}
function shade(hex,a){const n=parseInt(hex.slice(1,7),16);let r=(n>>16)+a,g=(n>>8&255)+a,b=(n&255)+a;r=clamp(r,0,255);g=clamp(g,0,255);b=clamp(b,0,255);return'#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);}
function cloud(x,y,s,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,40*s,0,7);ctx.arc(x+45*s,y-15*s,50*s,0,7);ctx.arc(x+95*s,y,38*s,0,7);ctx.rect(x,y,95*s,38*s);ctx.fill();}
function drawPlat(b,th){if(b.ice&&!b.pillar)th=Object.assign({},th,{top:'#f4feff',top2:'#8fdcff'});if(b.pillar){const g=ctx.createLinearGradient(b.x,0,b.x+b.w,0);g.addColorStop(0,th.body[0]);g.addColorStop(1,th.body[1]);ctx.fillStyle=g;rr(b.x,b.y,b.w,b.h,10);ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=OUT;ctx.stroke();ctx.fillStyle=th.top;rr(b.x-4,b.y-4,b.w+8,20,8);ctx.fill();ctx.stroke();return;}
 ctx.fillStyle='rgba(0,0,0,.18)';rr(b.x+6,b.y+10,b.w,b.h+8,12);ctx.fill();
 const g=ctx.createLinearGradient(0,b.y,0,b.y+b.h+12);g.addColorStop(0,th.body[0]);g.addColorStop(1,th.body[1]);ctx.fillStyle=g;rr(b.x,b.y,b.w,b.h+10,12);ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=OUT;ctx.stroke();
 const g2=ctx.createLinearGradient(0,b.y-4,0,b.y+16);g2.addColorStop(0,th.top);g2.addColorStop(1,th.top2);ctx.fillStyle=g2;ctx.beginPath();ctx.moveTo(b.x-4,b.y+8);for(let x=b.x-4;x<=b.x+b.w+4;x+=16){ctx.quadraticCurveTo(x+8,b.y+24,x+16,b.y+10);}ctx.lineTo(b.x+b.w+4,b.y-4);ctx.arcTo(b.x+b.w+4,b.y-6,b.x-4,b.y-6,8);ctx.lineTo(b.x+4,b.y-6);ctx.arcTo(b.x-4,b.y-6,b.x-4,b.y+8,8);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle='rgba(255,255,255,.55)';rr(b.x+10,b.y-1,b.w*.4,5,3);ctx.fill();}
function drawGround(th){const g=ctx.createLinearGradient(0,GY,0,H);g.addColorStop(0,th.body[0]);g.addColorStop(1,th.body[1]);ctx.fillStyle=g;ctx.fillRect(-30,GY,W+60,H-GY+30);
 ctx.fillStyle='rgba(0,0,0,.12)';for(let x=0;x<W;x+=90)ctx.beginPath(),ctx.arc(x+30,GY+50+(x%3)*12,10+(x%4)*3,0,7),ctx.fill();
 const g2=ctx.createLinearGradient(0,GY-8,0,GY+22);g2.addColorStop(0,th.top);g2.addColorStop(1,th.top2);ctx.fillStyle=g2;ctx.beginPath();ctx.moveTo(-30,GY-8);ctx.lineTo(W+30,GY-8);ctx.lineTo(W+30,GY+10);for(let x=W+30;x>=-30;x-=20)ctx.quadraticCurveTo(x-10,GY+28,x-20,GY+12);ctx.closePath();ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=OUT;ctx.stroke();}
function eye(x,y,r,lx,ly,blink,angry){ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(x,y,r,blink?r*.12:r*1.1,0,0,7);ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=OUT;ctx.stroke();if(!blink){ctx.fillStyle=OUT;ctx.beginPath();ctx.arc(x+lx*r*.4,y+ly*r*.4,r*.5,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x+lx*r*.4-r*.18,y+ly*r*.4-r*.2,r*.17,0,7);ctx.fill();}
 if(angry){ctx.strokeStyle=OUT;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-r*1.1*angry,y-r*1.5);ctx.lineTo(x+r*1.1*angry,y-r*.9);ctx.stroke();}}
function ball(x,y,r,c1,c2,sqx=1,sqy=1){ctx.save();ctx.translate(x,y);ctx.scale(sqx,sqy);ctx.fillStyle='rgba(0,0,0,.0)';const g=ctx.createRadialGradient(-r*.35,-r*.4,r*.1,0,0,r*1.05);g.addColorStop(0,c1);g.addColorStop(1,c2);ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();ctx.lineWidth=Math.max(4,r*.16);ctx.strokeStyle=OUT;ctx.stroke();
 ctx.fillStyle='rgba(255,255,255,.65)';ctx.beginPath();ctx.ellipse(-r*.38,-r*.5,r*.32,r*.17,-.6,0,7);ctx.fill();ctx.restore();}
function drawHero(x,y,r,skin,sq=1,look=[1,0],t=0){const s=SKINS[skin];const sx=1/Math.sqrt(sq)*1,sy=sq;
 ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(x,Math.min(GY,y+r+4),r*.9,7,0,0,7);ctx.fill();
 ball(x,y,r,s.c[0],s.c[1],sx,sy);
 // face
 const fy=y-r*.1*sy,blink=(t%3.2)<.12;eye(x-r*.32+look[0]*r*.18,fy,r*.24,look[0],look[1],blink);eye(x+r*.32+look[0]*r*.18,fy,r*.24,look[0],look[1],blink);
 ctx.strokeStyle=OUT;ctx.lineWidth=4;ctx.beginPath();ctx.arc(x+look[0]*r*.18,y+r*.28,r*.25,.2,Math.PI-.2);ctx.stroke();
 ctx.fillStyle='#ff7aa8';ctx.globalAlpha=.6;ctx.beginPath();ctx.arc(x-r*.6,y+r*.25,r*.12,0,7);ctx.arc(x+r*.6,y+r*.25,r*.12,0,7);ctx.fill();ctx.globalAlpha=1;
 acc(s.acc,x,y,r,t);}
function acc(a,x,y,r,t){ctx.lineWidth=4;ctx.strokeStyle=OUT;
 if(a==1){ctx.fillStyle='#ff2d7a';ctx.beginPath();ctx.moveTo(x+r*.2,y-r*.95);ctx.lineTo(x+r*.85,y-r*1.3);ctx.lineTo(x+r*.75,y-r*.7);ctx.closePath();ctx.moveTo(x+r*.2,y-r*.95);ctx.lineTo(x-r*.35,y-r*1.35);ctx.lineTo(x-r*.3,y-r*.75);ctx.closePath();ctx.fill();ctx.stroke();}
 if(a==2){ctx.fillStyle='#3ad16b';ctx.beginPath();ctx.ellipse(x+r*.1,y-r*1.15,r*.18,r*.38,.5,0,7);ctx.fill();ctx.stroke();}
 if(a==3){ctx.fillStyle='#ff3b30';ctx.beginPath();ctx.arc(x,y-r*.35,r*.95,Math.PI+.25,-.25);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.ellipse(x+r*.7,y-r*.55,r*.55,r*.14,0,0,7);ctx.fill();ctx.stroke();}
 if(a==4){ctx.fillStyle='#1d1d2b';rr(x-r*.75,y-r*.32,r*1.5,r*.38,8);ctx.fill();ctx.fillStyle='rgba(255,255,255,.6)';ctx.fillRect(x-r*.6,y-r*.25,r*.25,r*.08);}
 if(a==5){ctx.fillStyle='#ffd60a';ctx.beginPath();ctx.moveTo(x-r*.55,y-r*.75);ctx.lineTo(x-r*.6,y-r*1.35);ctx.lineTo(x-r*.25,y-r*1.05);ctx.lineTo(x,y-r*1.45);ctx.lineTo(x+r*.25,y-r*1.05);ctx.lineTo(x+r*.6,y-r*1.35);ctx.lineTo(x+r*.55,y-r*.75);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#ff2d55';ctx.beginPath();ctx.arc(x,y-r*.95,r*.1,0,7);ctx.fill();}
 if(a==6){ctx.fillStyle='#ff6b2b';ctx.beginPath();ctx.moveTo(x+r*.5,y+r*.05);ctx.lineTo(x+r*1.1,y+r*.15);ctx.lineTo(x+r*.5,y+r*.3);ctx.fill();ctx.stroke();ctx.fillStyle='#3b6cff';rr(x-r*.8,y-r*1.1,r*1.6,r*.35,8);ctx.fill();ctx.stroke();}
 if(a==7){ctx.fillStyle='#ff2d55';rr(x-r*.98,y-r*.5,r*1.96,r*.3,6);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(x-r*.9,y-r*.4);ctx.quadraticCurveTo(x-r*1.6,y-r*.6+Math.sin(t*10)*8,x-r*1.8,y-r*.1);ctx.lineWidth=6;ctx.strokeStyle='#ff2d55';ctx.stroke();}
 if(a==9){ctx.fillStyle='#24123a';ctx.beginPath();ctx.moveTo(x-r*1.05,y-r*.6);ctx.quadraticCurveTo(x,y-r*1.9,x+r*1.05,y-r*.6);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y-r*1.0,r*.16,0,7);ctx.fill();ctx.fillStyle='#ffd60a';ctx.fillRect(x-r*.9,y-r*.72,r*1.8,r*.1);}
 if(a==10){ctx.strokeStyle='#ffe14d';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(x,y-r*1.25+Math.sin(t*3)*3,r*.6,r*.18,0,0,7);ctx.stroke();ctx.fillStyle='#fff';for(const s of[-1,1]){ctx.beginPath();ctx.ellipse(x+s*r*1.1,y,r*.35,r*.2,s*.5,0,7);ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=OUT;ctx.stroke();}}
 if(a==11){for(let k=0;k<5;k++){const fx=x-r*.6+k*r*.3,fh=r*(.5+.3*Math.sin(t*12+k*1.7));ctx.fillStyle=k%2?'#ffd60a':'#ff5a1f';ctx.beginPath();ctx.moveTo(fx-8,y-r*.8);ctx.quadraticCurveTo(fx,y-r*.8-fh*2,fx+8,y-r*.8);ctx.fill();}}
 if(a==8){for(let k=0;k<3;k++){const an=t*3+k*2.1;ctx.fillStyle=['#fff36b','#5effe8','#ff5ef2'][k];star(x+Math.cos(an)*r*1.3,y+Math.sin(an)*r*.5-r*.6,7);}}}
function star(x,y,r,c){ctx.beginPath();for(let k=0;k<10;k++){const a=k*Math.PI/5-Math.PI/2,rr2=k%2?r*.45:r;ctx.lineTo(x+Math.cos(a)*rr2,y+Math.sin(a)*rr2);}ctx.closePath();if(c)ctx.fillStyle=c;ctx.fill();ctx.lineWidth=Math.max(2,r*.18);ctx.strokeStyle=OUT;ctx.stroke();}
const ECOL=[['#ff7a9c','#d61f5a'],['#b58aff','#5b23c9'],['#7aff9c','#1fa84a']];
function drawEnemy(e,x,y,rot,dead){const c=e.boss?['#ff9a4d','#c42a12']:e.fly?['#8ae6ff','#1f8ce0']:e.shield?['#ffd24d','#e08a00']:e.bomber?['#9a7aff','#3a1f8f']:e.split?['#9dff7a','#2fae2a']:ECOL[e.kind];const r=e.r;const bob=dead?0:Math.abs(Math.sin(e.t*8))*4;
 ctx.save();ctx.translate(x,y-bob);if(rot)ctx.rotate(rot);
 if(!dead){ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(0,r+bob,r*.9,6,0,0,7);ctx.fill();}
 if(e.fly){for(const s of[-1,1]){ctx.save();ctx.scale(s,1);ctx.rotate(Math.sin((e.t||0)*22)*.5);ctx.fillStyle='rgba(255,255,255,.9)';ctx.beginPath();ctx.ellipse(r*.9,-r*.4,r*.6,r*.3,-.5,0,7);ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=OUT;ctx.stroke();ctx.restore();}}
 if(!e.fly){ctx.fillStyle=c[1];ctx.lineWidth=4;ctx.strokeStyle=OUT;for(const s of[-1,1]){ctx.beginPath();ctx.ellipse(s*r*.45+(dead?0:Math.sin(e.t*8+s)*4),r*.85,r*.28,r*.18,0,0,7);ctx.fill();ctx.stroke();}}
 // horns
 ctx.fillStyle='#fff3d6';for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(s*r*.35,-r*.8);ctx.lineTo(s*r*.7,-r*1.35);ctx.lineTo(s*r*.75,-r*.6);ctx.fill();ctx.stroke();}
 ball(0,0,r,e.flash>0?'#ffffff':c[0],e.flash>0?'#ffd0d0':c[1],1+(dead?0:Math.sin(e.t*8)*.04),1-(dead?0:Math.sin(e.t*8)*.04));
 if(dead){ctx.strokeStyle=OUT;ctx.lineWidth=4;for(const s of[-1,1]){const ex=s*r*.32,ey=-r*.1;ctx.beginPath();ctx.moveTo(ex-7,ey-7);ctx.lineTo(ex+7,ey+7);ctx.moveTo(ex+7,ey-7);ctx.lineTo(ex-7,ey+7);ctx.stroke();}ctx.beginPath();ctx.ellipse(0,r*.35,r*.2,r*.15,0,0,7);ctx.fillStyle=OUT;ctx.fill();}
 else{const lx=e.dir*.6;eye(-r*.32,-r*.1,r*.24,lx,.2,(e.t%2.7)<.1,-1);eye(r*.32,-r*.1,r*.24,lx,.2,(e.t%2.7)<.1,1);
  ctx.fillStyle=OUT;ctx.beginPath();ctx.moveTo(-r*.35,r*.42);ctx.quadraticCurveTo(0,r*.18,r*.35,r*.42);ctx.lineTo(r*.3,r*.5);ctx.quadraticCurveTo(0,r*.34,-r*.3,r*.5);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(-r*.22,r*.33);ctx.lineTo(-r*.14,r*.45);ctx.lineTo(-r*.06,r*.3);ctx.fill();ctx.beginPath();ctx.moveTo(r*.22,r*.33);ctx.lineTo(r*.14,r*.45);ctx.lineTo(r*.06,r*.3);ctx.fill();}
 if(e.helm&&!dead){const g=ctx.createLinearGradient(0,-r,0,-r*.2);g.addColorStop(0,'#eef4ff');g.addColorStop(1,'#7f90b8');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,-r*.25,r*1.02,Math.PI+.15,-.15);ctx.closePath();ctx.fill();ctx.lineWidth=4;ctx.stroke();ctx.fillStyle='#ffd60a';ctx.beginPath();ctx.arc(0,-r*1.2,r*.15,0,7);ctx.fill();ctx.stroke();}
 if(e.split&&!dead){ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,-r*.95);ctx.lineTo(0,-r*.55);ctx.stroke();}
 if(e.bomber&&!dead){ctx.fillStyle='#2a2a3a';ctx.beginPath();ctx.arc(0,-r*1.15,r*.42,0,7);ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=OUT;ctx.stroke();ctx.fillStyle=Math.sin(T*30)>0?'#ffd60a':'#ff5a1f';ctx.beginPath();ctx.arc(r*.3,-r*1.55,5,0,7);ctx.fill();}
 if(e.shield&&!dead){const sx=(e.dir||1)*r*.95;const g=ctx.createLinearGradient(sx-10,0,sx+10,0);g.addColorStop(0,'#e8f0ff');g.addColorStop(1,'#7f90b8');ctx.fillStyle=g;rr(sx-9,-r*.9,18,r*1.8,8);ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=OUT;ctx.stroke();ctx.fillStyle='#ffd60a';ctx.beginPath();ctx.arc(sx,0,5,0,7);ctx.fill();}
 if(e.boss&&!dead){ctx.fillStyle='#ffd60a';ctx.beginPath();ctx.moveTo(-r*.5,-r*.85);ctx.lineTo(-r*.55,-r*1.4);ctx.lineTo(-r*.2,-r*1.1);ctx.lineTo(0,-r*1.5);ctx.lineTo(r*.2,-r*1.1);ctx.lineTo(r*.55,-r*1.4);ctx.lineTo(r*.5,-r*.85);ctx.closePath();ctx.fill();ctx.lineWidth=5;ctx.stroke();}
 ctx.restore();
 if(e.boss&&!dead){const w=140;ctx.fillStyle=OUT;rr(x-w/2-4,y-r-56,w+8,22,10);ctx.fill();const g=ctx.createLinearGradient(0,y-r-52,0,y-r-38);g.addColorStop(0,'#ff6b6b');g.addColorStop(1,'#d4140f');ctx.fillStyle=g;rr(x-w/2,y-r-52,w*Math.max(0,e.hp)/e.maxhp,14,7);ctx.fill();}}
function drawCrate(c){const x=c.x,y=c.y,w=c.w,h=c.h;if(c.glass){const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,'rgba(210,250,255,.85)');g.addColorStop(1,'rgba(110,210,255,.6)');ctx.fillStyle=g;rr(x,y,w,h,6);ctx.fill();ctx.lineWidth=4;ctx.strokeStyle='#2a6a9a';ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+6,y+10);ctx.lineTo(x+6,y+h*.5);ctx.moveTo(x+14,y+16);ctx.lineTo(x+14,y+28);ctx.stroke();return;}ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(x+w/2,y+h+2,w*.55,6,0,0,7);ctx.fill();
 if(c.tnt){const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,'#ff5a4a');g.addColorStop(.4,'#ff2a1a');g.addColorStop(1,'#b80f08');ctx.fillStyle=g;rr(x+4,y,w-8,h,10);ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=OUT;ctx.stroke();ctx.fillStyle='#ffd60a';ctx.fillRect(x+4,y+h*.38,w-8,h*.26);ctx.strokeRect(x+4,y+h*.38,w-8,h*.26);txt('TNT',x+w/2,y+h/2+1,15,'#ff2a1a','center',OUT,4);ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(x+10,y+6,6,h*.28);
  ctx.strokeStyle=OUT;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+w/2,y);ctx.quadraticCurveTo(x+w/2+10,y-10,x+w/2+4,y-18);ctx.stroke();ctx.fillStyle=Math.sin(T*30)>0?'#ffd60a':'#ff7a1a';ctx.beginPath();ctx.arc(x+w/2+4,y-20,5+Math.sin(T*25)*2,0,7);ctx.fill();return;}
 const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'#ffcf6b');g.addColorStop(1,'#c27a35');ctx.fillStyle=g;rr(x,y,w,h,8);ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=OUT;ctx.stroke();ctx.strokeStyle='#8f5126';ctx.lineWidth=4;ctx.strokeRect(x+8,y+8,w-16,h-16);ctx.beginPath();ctx.moveTo(x+8,y+8);ctx.lineTo(x+w-8,y+h-8);ctx.stroke();
 if(c.target){const cx=x+w/2,cy=y+h/2,pu=1+Math.sin(T*6)*.08;ctx.save();ctx.translate(cx,cy);ctx.scale(pu,pu);['#fff','#ff2d55','#fff','#ff2d55'].forEach((col,k)=>{ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,22-k*5.5,0,7);ctx.fill();});ctx.lineWidth=3;ctx.strokeStyle=OUT;ctx.beginPath();ctx.arc(0,0,22,0,7);ctx.stroke();ctx.restore();
  ctx.fillStyle='#ff2d55';ctx.beginPath();ctx.moveTo(cx,y-14+Math.sin(T*5)*4);ctx.lineTo(cx-10,y-30+Math.sin(T*5)*4);ctx.lineTo(cx+10,y-30+Math.sin(T*5)*4);ctx.fill();ctx.lineWidth=3;ctx.stroke();}}
function drawGem(g){if(g.got)return;const y=g.y+Math.sin(g.t*3)*6,x=g.x;const gl=ctx.createRadialGradient(x,y,2,x,y,46);gl.addColorStop(0,'rgba(120,250,255,.7)');gl.addColorStop(1,'rgba(120,250,255,0)');ctx.fillStyle=gl;ctx.fillRect(x-46,y-46,92,92);
 ctx.save();ctx.translate(x,y);ctx.scale(Math.cos(g.t*2)*.3+.9,1);const gr=ctx.createLinearGradient(-16,-20,16,20);gr.addColorStop(0,'#c9fdff');gr.addColorStop(.5,'#3ad7ff');gr.addColorStop(1,'#7a3cff');ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(0,-22);ctx.lineTo(17,-6);ctx.lineTo(0,22);ctx.lineTo(-17,-6);ctx.closePath();ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=OUT;ctx.stroke();ctx.fillStyle='rgba(255,255,255,.75)';ctx.beginPath();ctx.moveTo(-5,-15);ctx.lineTo(4,-8);ctx.lineTo(-8,-5);ctx.fill();ctx.restore();}
function coin(x,y,r,t=0){ctx.save();ctx.translate(x,y);ctx.scale(Math.abs(Math.cos(t))*.6+.4,1);const g=ctx.createLinearGradient(0,-r,0,r);g.addColorStop(0,'#fff38a');g.addColorStop(1,'#f0a000');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();ctx.lineWidth=Math.max(2.5,r*.2);ctx.strokeStyle=OUT;ctx.stroke();ctx.strokeStyle='#c97a00';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r*.6,0,7);ctx.stroke();ctx.restore();}
function btn(x,y,w,h,label,cb,col=['#7dff6b','#1fb83a'],size=34,icon){const hov=ptr.x>x&&ptr.x<x+w&&ptr.y>y&&ptr.y<y+h;const pr=hov&&ptr.down;buttons.push({x,y,w,h,cb});
 const oy=pr?4:0;ctx.fillStyle=OUT;rr(x,y+8,w,h,h*.35);ctx.fill();const g=ctx.createLinearGradient(0,y+oy,0,y+oy+h);g.addColorStop(0,col[0]);g.addColorStop(1,col[1]);ctx.fillStyle=g;rr(x,y+oy,w,h,h*.35);ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=OUT;ctx.stroke();
 ctx.fillStyle='rgba(255,255,255,.45)';rr(x+12,y+oy+6,w-24,h*.28,h*.14);ctx.fill();if(hov&&!pr){ctx.fillStyle='rgba(255,255,255,.15)';rr(x,y+oy,w,h,h*.35);ctx.fill();}
 if(icon)icon(x+w/2,y+h/2+oy);else txt(label,x+w/2,y+h/2+oy,size,'#fff');}
function panelBox(x,y,w,h,c=['#5a3cff','#2b1a99']){ctx.fillStyle='rgba(0,0,0,.25)';rr(x+8,y+14,w,h,30);ctx.fill();const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,c[0]);g.addColorStop(1,c[1]);ctx.fillStyle=g;rr(x,y,w,h,30);ctx.fill();ctx.lineWidth=7;ctx.strokeStyle=OUT;ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=3;rr(x+10,y+10,w-20,h-20,22);ctx.stroke();}
function coinHUD(x,y,n){ctx.fillStyle='rgba(36,18,58,.55)';rr(x,y,190,52,26);ctx.fill();coin(x+26,y+26,18,T*3);txt(String(n),x+110,y+28,30,'#ffe14d');}
function bgExtra(th,px){
 if(th.embers){for(let k=0;k<40;k++){const x=(k*131+Math.sin(T+k)*30)%W,y=H-((T*(40+k%5*20)+k*97)%H);ctx.globalAlpha=.7;ctx.fillStyle=k%2?'#ffd60a':'#ff6a2b';ctx.beginPath();ctx.arc(x,y,2+k%3,0,7);ctx.fill();}ctx.globalAlpha=1;
  ctx.fillStyle='#2a0a16';ctx.beginPath();ctx.moveTo(120-px*.03,470);ctx.lineTo(300-px*.03,180);ctx.lineTo(360-px*.03,180);ctx.lineTo(560-px*.03,470);ctx.fill();const g=ctx.createRadialGradient(330-px*.03,180,5,330-px*.03,180,120);g.addColorStop(0,'rgba(255,170,40,.9)');g.addColorStop(1,'rgba(255,90,20,0)');ctx.fillStyle=g;ctx.fillRect(200-px*.03,60,260,240);}
 if(th.sea){for(let k=0;k<4;k++){ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=4;ctx.beginPath();const y=470+k*40;for(let x=0;x<=W;x+=20)ctx.lineTo(x,y+Math.sin(x/50+T*2+k)*5);ctx.stroke();}
  const sx=(T*15)%(W+300)-150;ctx.save();ctx.translate(sx,440+Math.sin(T*1.5)*5);ctx.fillStyle='#6b3a1a';ctx.strokeStyle=OUT;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-70,0);ctx.lineTo(70,0);ctx.lineTo(50,30);ctx.lineTo(-50,30);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillRect(-3,-90,6,90);ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(4,-85);ctx.quadraticCurveTo(50,-55,4,-20);ctx.fill();ctx.stroke();ctx.fillStyle='#24123a';ctx.fillRect(-3,-100,30,14);ctx.restore();}
 if(th.castle){ctx.fillStyle='#d9c8ff';const cx=880-px*.05;for(const [dx,w,h] of [[-120,60,200],[0,110,280],[130,60,180]]){ctx.fillRect(cx+dx,470-h,w,h);ctx.beginPath();ctx.moveTo(cx+dx-10,470-h);ctx.lineTo(cx+dx+w/2,470-h-70);ctx.lineTo(cx+dx+w+10,470-h);ctx.fillStyle='#ff8ad8';ctx.fill();ctx.fillStyle='#d9c8ff';}
  ctx.fillStyle='#ffe14d';ctx.fillRect(cx+40,300,22,30);cloud(cx-260,470,1.4,'#fff');cloud(cx+120,480,1.2,'#fff');}}
function drawHaz(z){if(z.t=='lava'){const g=ctx.createLinearGradient(0,GY-6,0,H);g.addColorStop(0,'#ffe14d');g.addColorStop(.3,'#ff6a1a');g.addColorStop(1,'#a8120a');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(z.x,H);ctx.lineTo(z.x,GY);for(let x=z.x;x<=z.x+z.w;x+=10)ctx.lineTo(x,GY-4+Math.sin(x/14+T*4)*3);ctx.lineTo(z.x+z.w,H);ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=OUT;ctx.stroke();
  const gl=ctx.createRadialGradient(z.x+z.w/2,GY,5,z.x+z.w/2,GY,z.w);gl.addColorStop(0,'rgba(255,160,40,.5)');gl.addColorStop(1,'rgba(255,90,20,0)');ctx.fillStyle=gl;ctx.fillRect(z.x-z.w/2,GY-z.w,z.w*2,z.w);
  for(let k=0;k<3;k++){const ph=(T*.8+k*.33)%1;ctx.fillStyle='#ffd60a';ctx.globalAlpha=1-ph;ctx.beginPath();ctx.arc(z.x+z.w*(.2+k*.3),GY+10-ph*30,5+ph*6,0,7);ctx.fill();}ctx.globalAlpha=1;}
 else{ctx.fillStyle='rgba(40,170,255,.6)';ctx.beginPath();ctx.moveTo(z.x,H);ctx.lineTo(z.x,GY-16);for(let x=z.x;x<=z.x+z.w;x+=10)ctx.lineTo(x,GY-18+Math.sin(x/20+T*3)*4);ctx.lineTo(z.x+z.w,H);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.beginPath();for(let x=z.x;x<=z.x+z.w;x+=10)ctx.lineTo(x,GY-18+Math.sin(x/20+T*3)*4);ctx.stroke();}}
function drawPad(pd){const x=pd.x,s=1-pd.sq*.5;ctx.fillStyle='#4a4a6a';rr(x,GY-12,70,14,5);ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=OUT;ctx.stroke();ctx.strokeStyle='#cfd8ec';ctx.lineWidth=5;ctx.beginPath();for(let k=0;k<=4;k++)ctx.lineTo(x+20+(k%2)*30,GY-12-k*4*s);ctx.stroke();
 const g=ctx.createLinearGradient(0,GY-34,0,GY-24);g.addColorStop(0,'#ff6b6b');g.addColorStop(1,'#d4140f');ctx.fillStyle=g;rr(x-4,GY-14-18*s-8,78,12,6);ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=OUT;ctx.stroke();ctx.fillStyle='#ffe14d';ctx.fillRect(x+10,GY-14-18*s-5,10,5);ctx.fillRect(x+50,GY-14-18*s-5,10,5);}
function drawPortal(q,k){const c=k?['#5ef2ff','#1f6cff']:['#ffd24d','#ff6a1a'];const gl=ctx.createRadialGradient(q.x,q.y,5,q.x,q.y,70);gl.addColorStop(0,c[0]+'aa');gl.addColorStop(1,c[0]+'00');ctx.fillStyle=gl;ctx.fillRect(q.x-70,q.y-70,140,140);
 ctx.save();ctx.translate(q.x,q.y);ctx.fillStyle=OUT;ctx.beginPath();ctx.ellipse(0,0,30,40,0,0,7);ctx.fill();for(let j=0;j<3;j++){ctx.rotate(T*(k?3:-3)/3+j);ctx.strokeStyle=c[j%2];ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(0,0,26-j*7,36-j*9,0,0,4.5);ctx.stroke();}ctx.restore();ctx.lineWidth=5;ctx.strokeStyle=OUT;ctx.beginPath();ctx.ellipse(q.x,q.y,32,42,0,0,7);ctx.stroke();}
function flagShape(x,y,s,c='#ff2d55'){ctx.fillStyle='#e0e0f0';ctx.fillRect(x-3*s,y-50*s,6*s,60*s);ctx.lineWidth=3;ctx.strokeStyle=OUT;ctx.strokeRect(x-3*s,y-50*s,6*s,60*s);ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x+3*s,y-50*s);for(let k=0;k<=8;k++)ctx.lineTo(x+3*s+k*5*s,y-50*s+Math.sin(T*8+k*.7)*3*s);ctx.lineTo(x+43*s,y-22*s);for(let k=8;k>=0;k--)ctx.lineTo(x+3*s+k*5*s,y-22*s+Math.sin(T*8+k*.7)*3*s);ctx.closePath();ctx.fill();ctx.stroke();star(x+22*s,y-36*s,7*s,'#ffe14d');}
function drawGoalObjs(){const L=G.L,p=G.p;
 if(L.flag){ctx.fillStyle='rgba(125,255,107,.28)';ctx.fillRect(0,GY-160,L.flag.home,160);ctx.strokeStyle='#7dff6b';ctx.lineWidth=4;ctx.setLineDash([14,10]);ctx.beginPath();ctx.moveTo(L.flag.home,GY-160);ctx.lineTo(L.flag.home,GY);ctx.stroke();ctx.setLineDash([]);txt('HOME',L.flag.home/2,GY-140,26,G.carry?['#fff36b','#7dff6b']:'#fff');
  if(!G.carry)flagShape(L.flag.x-10,L.flag.y+30,1);}
 if(L.zone){const z=L.zone,pu=.25+Math.sin(T*5)*.08;ctx.fillStyle=`rgba(255,225,77,${pu})`;ctx.fillRect(z.x,GY-150,z.w,150);ctx.strokeStyle='#ffe14d';ctx.lineWidth=5;ctx.strokeRect(z.x,GY-150,z.w,150);
  ctx.fillStyle='#24123a';rr(z.x+20,GY-178,z.w-40,18,9);ctx.fill();ctx.fillStyle='#ffe14d';rr(z.x+23,GY-175,(z.w-46)*Math.min(1,G.hold/z.need),12,6);ctx.fill();txt('ZONE',z.x+z.w/2,GY-120,30,'#fff');}
 if(G.friend){const f=G.friend;flagShape(L.goalX,GY-10,1.2,'#7dff6b');ctx.fillStyle='#fff';ctx.globalAlpha=.6;for(let x=f.x+40;x<L.goalX;x+=40){ctx.beginPath();ctx.arc(x,GY-8,3,0,7);ctx.fill();}ctx.globalAlpha=1;
  const bob=f.walk?Math.abs(Math.sin(f.t*9))*5:0;ball(f.x,f.y-bob,f.r,f.flash>0?'#fff':'#9dfbff',f.flash>0?'#ffd0d0':'#19a8d8');eye(f.x-7,f.y-bob-4,6,.6,0,(f.t%3)<.1);eye(f.x+9,f.y-bob-4,6,.6,0,(f.t%3)<.1);
  ctx.strokeStyle=OUT;ctx.lineWidth=3;ctx.beginPath();if(f.walk)ctx.arc(f.x+2,f.y-bob+6,7,.2,Math.PI-.2);else ctx.arc(f.x+2,f.y-bob+12,6,Math.PI+.3,-.3);ctx.stroke();
  for(let k=0;k<3;k++){ctx.fillStyle=k<f.hp?'#ff2d55':'#4a3a60';heart(f.x-20+k*20,f.y-f.r-22,8);}
  if(!f.walk&&!G.done)txt('!',f.x+22,f.y-40,26,'#ffe14d');}
 if(G.carry)flagShape(p.x-4,p.y-p.r+8,.8);}
function heart(x,y,s){ctx.beginPath();ctx.moveTo(x,y+s);ctx.bezierCurveTo(x-s*1.6,y-s*.2,x-s*.6,y-s*1.4,x,y-s*.4);ctx.bezierCurveTo(x+s*.6,y-s*1.4,x+s*1.6,y-s*.2,x,y+s);ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=OUT;ctx.stroke();}
function drawBomb(b){ctx.fillStyle='#2a2a3a';ctx.beginPath();ctx.arc(b.x,b.y,12,0,7);ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=OUT;ctx.stroke();ctx.fillStyle='rgba(255,255,255,.5)';ctx.beginPath();ctx.arc(b.x-4,b.y-4,3,0,7);ctx.fill();ctx.fillStyle=Math.sin(T*40)>0?'#ffd60a':'#ff5a1f';ctx.beginPath();ctx.arc(b.x+8,b.y-12,4+Math.random()*2,0,7);ctx.fill();}
function heroDeco(h,x,y,r,t){if(h==1){ctx.strokeStyle='#8a94b8';ctx.lineWidth=6;ctx.beginPath();ctx.arc(x,y,r*.98,Math.PI*.15,Math.PI*.85);ctx.stroke();ctx.fillStyle='#cfd8ec';for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(x-r*.5+k*r*.5,y+r*.78,3,0,7);ctx.fill();}}
 if(h==3){ctx.fillStyle='rgba(125,255,107,.85)';ctx.strokeStyle=OUT;ctx.lineWidth=3;for(let k=0;k<3;k++){const dx=-r*.5+k*r*.5,l=8+Math.sin(t*3+k)*4;ctx.beginPath();ctx.ellipse(x+dx,y+r*.9+l/2,5,l,0,0,7);ctx.fill();ctx.stroke();}}
 if(h==2){for(const s of[-1,1]){ctx.fillStyle='rgba(255,255,255,.7)';ctx.beginPath();ctx.arc(x+s*r*1.15,y-r*.6,5,0,7);ctx.fill();}}}
// ---------- scenes ----------
let titleBalls=[];for(let k=0;k<6;k++)titleBalls.push({x:rnd(100,1180),y:rnd(100,500),vx:rnd(-300,300),vy:rnd(-200,200),k});
const sndIcon=(x,y)=>txt(S.snd?'♪ ON':'♪ OFF',x,y,24,'#fff');
function drawTitle(dt){const th=THEMES[Math.floor(T/8)%THEMES.length];drawBG(th,ptr.x);drawGround(th);
 for(const b of titleBalls){b.vy+=900*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.y>GY-30){b.y=GY-30;b.vy=-rnd(600,900);}if(b.x<30||b.x>W-30)b.vx*=-1;b.x=clamp(b.x,30,W-30);
  if(b.k<2)drawHero(b.x,b.y,30,b.k==0?S.skin:(T|0)%SKINS.length,1,[Math.sign(b.vx),0],T);else drawEnemy({kind:b.k%3,r:26,t:T+b.k,dir:Math.sign(b.vx),hp:1,fly:b.k==5,shield:b.k==4},b.x,b.y,0,0);}
 const s=1+Math.sin(T*3)*.03;ctx.save();ctx.translate(640,150);ctx.scale(s,s);ctx.rotate(-.04);txt('BOING',-10,-45,110,['#fff36b','#ff9a1a'],'center',OUT,24);txt('BRAWL!',30,62,110,['#ff8ad8','#ff2d7a'],'center',OUT,24);ctx.restore();
 txt('8 Worlds • 82 Levels • 4 Heroes',640,270,28,'#fff');
 btn(490,310,300,96,'PLAY',()=>{scene='levels';lvlPage=Math.floor((S.unlocked-1)/20);},['#7dff6b','#1fb83a'],52);
 btn(360,425,180,78,'SHOP',()=>{scene='shop';},['#ffd24d','#f08a00'],28);
 const dd=S.daily==dayNum();btn(550,425,180,78,dd?'DAILY ✓':'DAILY',()=>startDaily(),['#ff8ad8','#e0359e'],28);
 btn(740,425,180,78,'ENDLESS',()=>startEndless(0),['#c79bff','#6b2bdb'],26);
 btn(470,520,160,64,'',()=>{S.mus=S.snd=S.snd?0:1;Audio.apply();save();},['#5ec8ff','#1f6cff'],24,sndIcon);
 btn(650,520,160,64,'🏆 '+S.ach.length+'/'+ACH.length,()=>scene='ach',['#ffe14d','#e0a000'],24);
 if(S.endBest)txt('Endless best: '+S.endBest,1140,690,20,'#fff');
 coinHUD(1070,20,S.coins);}
function drawAch(){const th=THEMES[7];drawBG(th,640);drawGround(th);txt('ACHIEVEMENTS',640,60,58,['#fff36b','#ffb31a']);
 ACH.forEach((a,k)=>{const x=40+(k%3)*405,y=120+Math.floor(k/3)*98;const got=S.ach.includes(a[0]);panelBox(x,y,385,86,got?['#7dff6b','#1fb83a']:['#6a5a9a','#3d2f6a']);star(x+42,y+43,24,got?'#ffe14d':'#8a7ab0');txt(a[1],x+75,y+30,22,'#fff','left');txt(a[2],x+75,y+60,16,got?'#fff':'#d8ccff','left',OUT,4);});
 btn(30,640,160,70,'BACK',()=>scene='title',['#ff8ad8','#e0359e'],30);}
function drawLevels(){const th=THEMES[themeFor(lvlPage*20+5)];drawBG(th,640);drawGround(th);txt('SELECT LEVEL',640,56,56,['#fff36b','#ffb31a']);
 const w0=lvlPage*20,wn=[...new Set(Array.from({length:Math.min(20,NLEV-w0)},(_,k)=>THEMES[themeFor(w0+k)].n))].join(' • ');txt(wn,640,104,24,'#fff');
 for(let k=0;k<20;k++){const i=lvlPage*20+k;if(i>=NLEV)break;const cx=180+(k%5)*230,cy=140+Math.floor(k/5)*118;const lock=i>=S.unlocked;const boss=(i+1)%10==0;
  btn(cx-50,cy,140,92,lock?'':String(i+1),lock?()=>{Audio.play('clang');}:()=>startLevel(i),lock?['#9a9ab8','#5d5d7a']:boss?['#ff8a5c','#e0241a']:['#ffe14d','#ff9a1a'],40,lock?(x,y)=>{ctx.fillStyle='#ffe14d';rr(x-16,y-6,32,26,6);ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=OUT;ctx.stroke();ctx.beginPath();ctx.arc(x,y-8,11,Math.PI,0);ctx.stroke();}:null);
  if(!lock){const st=S.stars[i]||0;for(let s=0;s<3;s++)star(cx-10+s*30,cy+94,11,s<st?'#ffe14d':'#6b5a8f');if(boss)txt('BOSS',cx+20,cy+14,16,'#fff');}}
 btn(30,630,160,76,'BACK',()=>scene='title',['#ff8ad8','#e0359e'],30);txt((lvlPage+1)+'/'+Math.ceil(NLEV/20),990,668,30,'#fff');
 if(lvlPage>0)btn(720,630,160,76,'◀',()=>lvlPage--,['#5ec8ff','#1f6cff'],40);if((lvlPage+1)*20<NLEV)btn(1090,630,160,76,'▶',()=>lvlPage++,['#5ec8ff','#1f6cff'],40);
 coinHUD(1070,14,S.coins);}
function noCoins(){toast={s:'Not enough coins!',t:1.5};Audio.play('clang');}
function drawShop(){const th=THEMES[4];drawBG(th,640);drawGround(th);txt('SHOP',640,50,56,['#fff36b','#ffb31a']);coinHUD(1070,20,S.coins);
 ['SKINS','HEROES','UPGRADES'].forEach((n,k)=>btn(290+k*240,90,220,60,n,()=>shopTab=k,shopTab==k?['#ffe14d','#ff9a1a']:['#9a9ab8','#5d5d7a'],26));
 if(shopTab==0){SKINS.forEach((s,k)=>{const x=40+(k%8)*152,y=180+Math.floor(k/8)*215;const own=S.skins.includes(k),sel=S.skin==k;panelBox(x,y,142,200,sel?['#7dff6b','#1fb83a']:['#6a4cff','#3a24b8']);drawHero(x+71,y+72,34,k,1,[0,0],T+k);txt(s.n,x+71,y+130,17,'#fff');
  btn(x+12,y+146,118,44,own?(sel?'USING':'USE'):'',()=>{if(own){S.skin=k;save();Audio.play('click');}else if(S.coins>=s.p){S.coins-=s.p;S.skins.push(k);S.skin=k;save();checkAch();Audio.play('win');burst(x+71,y+72,30,['#ffe14d','#ff4f9a','#fff'],400,8);}else noCoins();},own?['#5ec8ff','#1f6cff']:['#ffd24d','#f08a00'],20,own?null:(cx,cy)=>{coin(cx-32,cy,11,0);txt(String(s.p),cx+10,cy,19,'#fff');});});}
 else if(shopTab==1){HEROES.forEach((h,k)=>{const x=60+k*295,y=180;const own=S.heroes.includes(k),sel=S.hero==k;panelBox(x,y,275,410,sel?['#7dff6b','#1fb83a']:['#6a4cff','#3a24b8']);const r=k==1?54:44;
  if(k==2){drawHero(x+137,y+120,40,S.skin,1,[0,0],T);drawHero(x+70,y+150,22,S.skin,1,[0,0],T);drawHero(x+205,y+150,22,S.skin,1,[0,0],T);}else{drawHero(x+137,y+120,r,S.skin,1,[0,0],T);heroDeco(k,x+137,y+120,r,T);}
  txt(h.n,x+137,y+225,34,'#ffe14d');const ws=h.d.split(': ');ws.forEach((w,j)=>txt(w,x+137,y+270+j*30,17,'#fff','center',OUT,4));
  btn(x+37,y+320,200,66,own?(sel?'USING':'USE'):'',()=>{if(own){S.hero=k;save();Audio.play('click');}else if(S.coins>=h.p){S.coins-=h.p;S.heroes.push(k);S.hero=k;save();checkAch();Audio.play('win');}else noCoins();},own?['#5ec8ff','#1f6cff']:['#ffd24d','#f08a00'],26,own?null:(cx,cy)=>{coin(cx-42,cy,14,0);txt(String(h.p),cx+12,cy,24,'#fff');});});}
 else{Object.keys(UPG).forEach((k,j)=>{const u=UPG[k],l=S.upg[k],y=190+j*140;panelBox(200,y,880,120);txt(u.n,240,y+40,34,'#ffe14d','left');txt(u.d,240,y+85,22,'#fff','left');for(let s=0;s<u.max;s++){ctx.fillStyle=s<l?'#7dff6b':'#2b1a66';rr(620+s*40,y+40,32,40,8);ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=OUT;ctx.stroke();}
  if(l<u.max){const c=u.cost(l);btn(860,y+28,190,70,'',()=>{if(S.coins>=c){S.coins-=c;S.upg[k]++;save();Audio.play('win');}else noCoins();},['#ffd24d','#f08a00'],24,(cx,cy)=>{coin(cx-45,cy,15,0);txt(String(c),cx+12,cy,26,'#fff');});}else txt('MAX',955,y+62,34,'#7dff6b');});}
 btn(30,630,160,76,'BACK',()=>scene='title',['#ff8ad8','#e0359e'],30);}
function trajectory(vx,vy){const p=G.p;let x=p.x,y=p.y;ctx.fillStyle='#fff';for(let k=1;k<=22;k++){const t=k*.035;const px=x+vx*t+(G.L.wind||0)*t*t*.5,py=y+vy*t+750*t*t;if(py>GY)break;ctx.globalAlpha=1-k/24;ctx.beginPath();ctx.arc(px,py,7-k*.2,0,7);ctx.fill();ctx.lineWidth=2;ctx.strokeStyle=OUT;ctx.stroke();}ctx.globalAlpha=1;}
function aimVel(){const a=G.aim;if(!a)return null;let dx=a.sx-a.x,dy=a.sy-a.y;const d=Math.hypot(dx,dy);if(d<18)return null;const pw=Math.min(d,220)/220*power();return[dx/d*pw,dy/d*pw,Math.min(d,220)/220];}
function drawGame(dt){const L=G.L,th=L.th,p=G.p;
 ctx.save();if(shake>0){ctx.translate(rnd(-shake,shake),rnd(-shake,shake));}
 drawBG(th,p.x);drawGround(th);for(const z of L.haz)drawHaz(z);
 if(L.wind){ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=3;for(let k=0;k<14;k++){const x=((k*173+T*L.wind*2.5)%(W+200)+W+200)%(W+200)-100,y=60+(k*47)%460;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+Math.sign(L.wind)*40,y-8,x+Math.sign(L.wind)*80,y);ctx.stroke();}
  txt((L.wind>0?'WIND ▶▶':'◀◀ WIND'),640,150,22,'#fff');}
 for(const b of L.plats)drawPlat(b,th);for(const pd of L.pads)drawPad(pd);L.portals.forEach(drawPortal);for(const c of L.crates)if(!c.broken)drawCrate(c);for(const g of L.gems)drawGem(g);
 drawGoalObjs();
 for(const d of G.debris){ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.rot);ctx.globalAlpha=Math.min(1,d.l*2);if(d.helm){ctx.fillStyle='#cfd8ec';ctx.beginPath();ctx.arc(0,0,d.s*.8,Math.PI,0);ctx.closePath();ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=OUT;ctx.stroke();}else if(d.glass){ctx.fillStyle='rgba(200,250,255,.8)';ctx.beginPath();ctx.moveTo(0,-d.s/2);ctx.lineTo(d.s/2,d.s/2);ctx.lineTo(-d.s/2,d.s/3);ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#4fb8e0';ctx.stroke();}else{ctx.fillStyle=d.tnt?'#ff3b30':d.target?'#ff2d55':'#e2a050';ctx.fillRect(-d.s/2,-d.s/4,d.s,d.s/2);ctx.lineWidth=3;ctx.strokeStyle=OUT;ctx.strokeRect(-d.s/2,-d.s/4,d.s,d.s/2);}ctx.restore();}ctx.globalAlpha=1;
 for(const e of L.enemies)if(e.alive)drawEnemy(e,e.x,e.y,0,0);
 for(const r of G.dead){ctx.globalAlpha=Math.min(1,r.l*1.5);drawEnemy(r.e,r.x,r.y,r.rot,1);}ctx.globalAlpha=1;
 for(const b of G.bombs)drawBomb(b);
 const spd=Math.hypot(p.vx,p.vy);if(spd>300){p.trail.forEach((t,k)=>{ctx.globalAlpha=k/p.trail.length*.45;ctx.fillStyle=SKINS[S.skin].c[0];ctx.beginPath();ctx.arc(t.x,t.y,p.r*k/p.trail.length,0,7);ctx.fill();});ctx.globalAlpha=1;}
 if(spd>700){const gl=ctx.createRadialGradient(p.x,p.y,5,p.x,p.y,p.r*2.2);gl.addColorStop(0,'rgba(255,255,200,.6)');gl.addColorStop(1,'rgba(255,255,200,0)');ctx.fillStyle=gl;ctx.fillRect(p.x-80,p.y-80,160,160);}
 const av=aimVel();const look=av?[av[0]/power(),av[1]/power()]:spd>50?[p.vx/spd,p.vy/spd]:[1,0];
 if(av){ctx.strokeStyle='#ff4f9a';ctx.lineWidth=6;ctx.setLineDash([12,10]);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-av[0]/power()*120,p.y-av[1]/power()*120);ctx.stroke();ctx.setLineDash([]);trajectory(av[0],av[1]);
  const pw=av[2];ctx.fillStyle=OUT;rr(p.x-40,p.y-p.r-30,80,14,7);ctx.fill();ctx.fillStyle=pw>.85?'#ff3b30':pw>.5?'#ffd60a':'#7dff6b';rr(p.x-38,p.y-p.r-28,76*pw,10,5);ctx.fill();}
 for(const m of G.minis){ctx.globalAlpha=Math.min(1,m.l*2);drawHero(m.x,m.y,m.r,S.skin,1,[Math.sign(m.vx)||1,0],T);}ctx.globalAlpha=1;
 drawHero(p.x,p.y,p.r,S.skin,p.sq,look,T);heroDeco(S.hero,p.x,p.y,p.r,T);
 for(const q of parts){if(q.ring){const k=1-q.l/q.ml;ctx.globalAlpha=q.l/q.ml;ctx.strokeStyle=q.c;ctx.lineWidth=8*(1-k)+1;ctx.beginPath();ctx.arc(q.x,q.y,lerp(q.r,q.mr,k),0,7);ctx.stroke();continue;}ctx.globalAlpha=clamp(q.l/q.ml*1.5,0,1);ctx.fillStyle=q.c;if(q.sh){ctx.save();ctx.translate(q.x,q.y);ctx.rotate(q.rot);ctx.fillRect(-q.s/2,-q.s/2,q.s,q.s);ctx.restore();}else{ctx.beginPath();ctx.arc(q.x,q.y,q.s*(q.l/q.ml*.5+.5),0,7);ctx.fill();}}ctx.globalAlpha=1;
 for(const o of pops){const k=1-o.l/1.1;const s=k<.15?k/.15*1.2:1.2-Math.min(.2,(k-.15));ctx.globalAlpha=clamp(o.l*2,0,1);ctx.save();ctx.translate(o.x,o.y-k*40);ctx.scale(s,s);txt(o.s,0,0,o.size,o.col);ctx.restore();}ctx.globalAlpha=1;
 ctx.restore();
 if(G.i==0&&G.mode=='normal'&&!G.launched&&!panel){const k=(T%2)/2;const hx=p.x+20-k*120,hy=p.y+40+k*60;txt('DRAG BACK & RELEASE TO FLING!',640,560,34,'#fff');hand(hx,hy);if(k<.1){ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(hx,hy,24,0,7);ctx.stroke();}}
 if(G.i==0&&G.launched&&G.kills==0&&!panel&&G.elapsed<12)txt('SMASH THE GRUMPS AT HIGH SPEED!',640,560,30,'#fff');
 const tip=TIPS[L.type+'_'+G.mode]||TIPS[L.type];if(tip&&G.elapsed<6&&!panel&&banner<=0&&G.mode=='normal'&&!S['tip_'+L.type])txt(tip,640,580,26,'#fff');
 ctx.fillStyle='rgba(36,18,58,.55)';rr(20,16,300,60,30);ctx.fill();txt(G.mode=='daily'?'DAILY':G.mode=='endless'?'ENDLESS '+(G.run+1):'LEVEL '+(G.i+1),170,47,28,'#fff');
 ctx.fillStyle='rgba(36,18,58,.55)';rr(400,14,480,64,32);ctx.fill();txt(progressTxt(),640,47,28,['#fff36b','#ffb31a']);
 if(G.L.timer){const tl=Math.ceil(G.time);ctx.fillStyle=tl<=10?(Math.sin(T*12)>0?'#ff3b30':'rgba(36,18,58,.55)'):'rgba(36,18,58,.55)';rr(890,14,120,64,32);ctx.fill();txt('⏱'+tl,950,47,28,'#fff');}
 ctx.fillStyle='rgba(36,18,58,.55)';rr(20,90,60+Math.min(G.maxShots,12)*30,46,23);ctx.fill();txt('×',40,113,24,'#fff');for(let k=0;k<Math.min(G.maxShots,12);k++){ball(68+k*30,113,11,k<G.shots?SKINS[S.skin].c[0]:'#6b5a8f',k<G.shots?SKINS[S.skin].c[1]:'#3d2f5c');}
 if(G.maxShots>12)txt(String(G.shots),80+12*30,113,24,'#fff');
 coinHUD(1010,90,S.coins+(G.win&&panel?0:G.coins));
 btn(1180,14,80,64,'',()=>{if(!G.done){panel={type:'pause'};SDK.call('gameplayStop');}},['#5ec8ff','#1f6cff'],30,(x,y)=>{ctx.fillStyle='#fff';ctx.strokeStyle=OUT;ctx.lineWidth=3;rr(x-14,y-14,10,28,3);ctx.fill();ctx.stroke();rr(x+4,y-14,10,28,3);ctx.fill();ctx.stroke();});
 btn(1090,14,80,64,'',()=>{if(!G.done)restart();},['#ffd24d','#f08a00'],30,(x,y)=>txt('↻',x,y,40,'#fff'));
 if(banner>0){const a=clamp(banner*2,0,1),k=clamp((2.4-banner)*4,0,1);ctx.globalAlpha=a;ctx.fillStyle='rgba(36,18,58,.7)';ctx.fillRect(0,250,W,150);ctx.save();ctx.translate(640,325);ctx.scale(k,k);txt(GOALTXT[G.L.type](G.L),0,-18,46,['#fff36b','#ffb31a']);txt(G.L.th.n+' • '+(G.L.type=='boss'?'BOSS FIGHT':G.mode=='daily'?'Daily Challenge':G.mode=='endless'?'Endless stage '+(G.run+1):'Level '+(G.i+1)),0,38,26,'#fff');ctx.restore();ctx.globalAlpha=1;}
 for(const c of flyCoins)coin(c.x,c.y,12,T*8);
 if(panel)drawPanel();}
const TIPS={flag:'Touch the flag, then bounce back to HOME!',hill:'Rest your ball inside the gold zone!',escort:'Buddy stops when Grumps block the way. Clear them!',waves:'More Grumps drop in after each wave!',combo:'Skim along the line of Grumps to chain hits!'};
function restart(){if(G.mode=='endless')startEndless(G.run,G.sess);else startLevel(G.i,G.mode,G.seed);}
function hand(x,y){ctx.save();ctx.translate(x,y);ctx.fillStyle='#fff';ctx.strokeStyle=OUT;ctx.lineWidth=4;rr(-14,-4,28,36,10);ctx.fill();ctx.stroke();rr(-6,-32,12,36,6);ctx.fill();ctx.stroke();ctx.restore();}
function drawPanel(){ctx.fillStyle='rgba(20,8,40,.55)';ctx.fillRect(0,0,W,H);panel.t=(panel.t||0)+1/60;const k=Math.min(1,panel.t*5),s=k<1?1-Math.pow(1-k,3)*1.1+Math.sin(k*9)*.06*(1-k):1;
 ctx.save();ctx.translate(640,360);ctx.scale(s,s);ctx.translate(-640,-360);
 if(panel.type=='win'){panelBox(340,90,600,540);txt(G.mode=='endless'?'STAGE '+(G.run+1)+' CLEAR!':G.mode=='daily'?'DAILY CLEAR!':'LEVEL CLEAR!',640,150,52,['#fff36b','#ffb31a']);
  for(let j=0;j<3;j++){const show=panel.t>.3+j*.25;const sx=520+j*120,sy=j==1?250:270;star(sx,sy,j==1?54:44,j<G.stars&&show?'#ffe14d':'#4a3a80');if(show&&j<G.stars&&!panel['s'+j]){panel['s'+j]=1;Audio.play('coin');burst(sx,sy,14,['#ffe14d','#fff'],300,7,200);}}
  txt('Smash coins: '+G.coins,640,350,28,'#fff');txt(G.bonusTxt+': '+G.reward,640,392,28,'#fff');coin(560,445,20,T*3);txt(String(panel.doubled?G.total*2:G.total),660,447,46,'#ffe14d');
  if(!panel.doubled)btn(400,490,230,90,'',()=>{SDK.ad('rewarded',ok=>{if(ok&&!panel.doubled){panel.doubled=1;S.coins+=G.total;save();Audio.play('win');}})},['#ff8ad8','#e0359e'],26,(x,y)=>{txt('▶ x2 COINS',x,y,28,'#fff');});
  btn(650,490,230,90,G.mode=='daily'?'MENU':'NEXT ▶',()=>nextLevel(),['#7dff6b','#1fb83a'],36);
 }else if(panel.type=='lose'){panelBox(390,140,500,420,['#ff6b8a','#b8153f']);const why=G.friend&&G.friend.hp<=0?'BUDDY GOT HURT!':G.L.timer&&G.time<=0?"TIME'S UP!":'OUT OF SHOTS!';txt(why,640,210,46,['#fff','#ffd0dc']);drawEnemy({kind:0,r:50,t:T,dir:1,hp:1},640,320,0,0);
  txt(G.mode=='endless'?'Run over at stage '+(G.run+1)+'!':'So close! Try again?',640,410,28,'#fff');
  btn(420,450,200,90,'MENU',()=>{scene=G.mode=='normal'?'levels':'title';panel=null;},['#5ec8ff','#1f6cff'],34);btn(660,450,200,90,'RETRY',()=>{SDK.ad('midgame',()=>{if(G.mode=='endless')startEndless(0);else restart();});},['#7dff6b','#1fb83a'],34);
 }else if(panel.type=='pause'){panelBox(440,160,400,400);txt('PAUSED',640,230,58,['#fff36b','#ffb31a']);btn(490,290,300,80,'RESUME',()=>{panel=null;SDK.call('gameplayStart');},['#7dff6b','#1fb83a'],34);btn(490,385,300,80,'',()=>{S.mus=S.snd=S.snd?0:1;Audio.apply();save();},['#5ec8ff','#1f6cff'],30,(x,y)=>txt(S.snd?'SOUND: ON':'SOUND: OFF',x,y,30,'#fff'));btn(490,480,300,80,'QUIT',()=>{scene=G.mode=='normal'?'levels':'title';panel=null;},['#ff8ad8','#e0359e'],34);}
 ctx.restore();}
let levelsSinceAd=0;
function nextLevel(){if(G.L.type&&!S['tip_'+G.L.type]){S['tip_'+G.L.type]=1;save();}levelsSinceAd++;const go=f=>{if(levelsSinceAd>=2){levelsSinceAd=0;SDK.ad('midgame',f);}else f();};
 if(G.mode=='daily'){scene='title';panel=null;return;}
 if(G.mode=='endless'){const n=G.run+1,s=G.sess;go(()=>startEndless(n,s));return;}
 if(G.i==NLEV-1){scene='levels';panel=null;toast={s:'YOU BEAT ALL '+NLEV+' LEVELS!',t:3};return;}const n=G.i+1;go(()=>startLevel(n));}
// ---------- loop ----------
let last=performance.now(),acc2=0,achT=0;
function frame(now){const ts=window.__ts||1;let dt=Math.min(.05,(now-last)/1000)*ts;last=now;T+=dt;buttons=[];
 if(scene=='game'&&G&&!panel){if(hitstop>0){hitstop-=dt;}else{acc2+=dt;let n=0;while(acc2>=1/120&&n<8*ts){step(1/120);acc2-=1/120;n++;}if(acc2>.1)acc2=0;}if(banner>0)banner-=dt;}
 achT+=dt;if(achT>1){achT=0;if(S.st)checkAch();}
 shake=Math.max(0,shake-dt*40);
 for(const q of parts){q.l-=dt;if(!q.ring){q.vy+=q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=.98;q.rot+=dt*8;}}parts=parts.filter(q=>q.l>0);if(parts.length>600)parts.splice(0,parts.length-600);
 for(const o of pops)o.l-=dt;pops=pops.filter(o=>o.l>0);
 for(const c of flyCoins){c.t+=dt;if(c.t<.35){c.vy+=900*dt;c.x+=c.vx*dt;c.y+=c.vy*dt;}else{c.x=lerp(c.x,1036,Math.min(1,dt*9));c.y=lerp(c.y,116,Math.min(1,dt*9));if(Math.hypot(c.x-1036,c.y-116)<20){c.done=1;Audio.play('coin');}}}flyCoins=flyCoins.filter(c=>!c.done);
 ctx.clearRect(0,0,W,H);
 if(scene=='title')drawTitle(dt);else if(scene=='levels')drawLevels();else if(scene=='shop')drawShop();else if(scene=='ach')drawAch();else if(scene=='game')drawGame(dt);
 if(achQ.length){const q=achQ[0];q.t-=dt;const y=q.t>2.5?lerp(-80,20,(2.8-q.t)/.3):q.t<.3?lerp(-80,20,q.t/.3):20;panelBox(390,y,500,76,['#ffe14d','#e08a00']);star(436,y+38,24,'#fff');txt('ACHIEVEMENT: '+q.a[1],660,y+28,22,'#fff');txt('+100 coins',660,y+56,18,'#fff');if(q.t<=0)achQ.shift();}
 if(toast){toast.t-=dt;txt(toast.s,640,660,36,'#ff6b6b');if(toast.t<=0)toast=null;}
 requestAnimationFrame(frame);}
// ---------- input ----------
function toLocal(e){return{x:(e.clientX-offX)/scale,y:(e.clientY-offY)/scale};}
cv.addEventListener('pointerdown',e=>{e.preventDefault();Audio.init();Audio.resume();const q=toLocal(e);ptr.x=q.x;ptr.y=q.y;ptr.down=true;
 for(let k=buttons.length-1;k>=0;k--){const b=buttons[k];if(q.x>b.x&&q.x<b.x+b.w&&q.y>b.y&&q.y<b.y+b.h){Audio.play('click');trans=0;b.cb();ptr.down=false;return;}}
 if(scene=='game'&&G&&!panel&&!G.done&&G.shots>0){G.aim={sx:q.x,sy:q.y,x:q.x,y:q.y};banner=Math.min(banner,.3);}});
addEventListener('pointermove',e=>{const q=toLocal(e);ptr.x=q.x;ptr.y=q.y;if(G&&G.aim){G.aim.x=q.x;G.aim.y=q.y;}});
addEventListener('pointerup',e=>{ptr.down=false;if(G&&G.aim){const v=aimVel();G.aim=null;if(v&&scene=='game'&&!panel&&!G.done&&G.shots>0)launch(v[0],v[1]);}});
addEventListener('pointercancel',()=>{ptr.down=false;if(G)G.aim=null;});
// keyboard: arrows aim, space launch, P pause, R restart
const keys={};addEventListener('keydown',e=>{keys[e.code]=1;Audio.init();Audio.resume();if(scene!='game'||!G)return;
 if(e.code=='KeyP'||e.code=='Escape'){if(panel&&panel.type=='pause'){panel=null;SDK.call('gameplayStart');}else if(!panel&&!G.done){panel={type:'pause'};SDK.call('gameplayStop');}}
 if(e.code=='KeyR'&&!panel)restart();
 if(e.code=='Enter'&&panel&&panel.type=='win')nextLevel();
 if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
 if(!panel&&!G.done&&G.shots>0){if(e.code=='ArrowLeft'||e.code=='KeyA')G.kbAng-=.06;if(e.code=='ArrowRight'||e.code=='KeyD')G.kbAng+=.06;if(e.code=='ArrowUp'||e.code=='KeyW')G.kbPow=clamp(G.kbPow+.05,.15,1);if(e.code=='ArrowDown'||e.code=='KeyS')G.kbPow=clamp(G.kbPow-.05,.15,1);
  const p=G.p;G.aim={sx:p.x,sy:p.y,x:p.x-Math.cos(G.kbAng)*220*G.kbPow,y:p.y-Math.sin(G.kbAng)*220*G.kbPow,kb:1};
  if(e.code=='Space'){const v=aimVel();G.aim=null;if(v)launch(v[0],v[1]);}}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&scene=='game'&&G&&!panel&&!G.done){panel={type:'pause'};SDK.call('gameplayStop');}});
addEventListener('contextmenu',e=>e.preventDefault());
// test hooks
window.__bb={get G(){return G},get scene(){return scene},get panel(){return panel},startLevel,startDaily,startEndless,launch,S,genLevel,
 target(){const L=G.L,p=G.p;const alive=L.enemies.filter(e=>e.alive);
  switch(L.type){case'boss':{const b=alive.find(e=>e.boss);return b?[b.x,b.y]:null}
  case'targets':{const c=L.crates.find(c=>c.target&&!c.broken);return c?[c.x+c.w/2,c.y+c.h/2]:null}
  case'gems':{const g=L.gems.find(g=>!g.got);return g?[g.x,g.y+Math.sin(g.t*3)*6]:null}
  case'flag':return G.carry?[110,GY-30]:[L.flag.x,L.flag.y];
  case'hill':{const z=L.zone;if(p.x>z.x+20&&p.x<z.x+z.w-20&&p.y>GY-150)return null;return[z.x+z.w/2,GY-30];}
  case'escort':{const f=G.friend;let best=null,bd=1e9;for(const e of alive){const d=e.x-f.x;if(d>-30&&d<bd&&!e.fly){bd=d;best=e;}}return best?[best.x,best.y]:null;}
  case'combo':{let best=null;for(const e of alive)if(!best||e.x<best.x)best=e;return best?[best.x-10,best.y]:null;}
  default:{let best=null,bd=1e9;for(const e of alive){const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<bd){bd=d;best=e}}return best?[best.x,best.y]:null;}}},
 solve(tx,ty,low){const p0=G.p,sol=solids(),L=G.L;let best=null,bd=1e9;for(let a=-3.1;a<0.1;a+=0.05)for(let f=.3;f<=1.001;f+=.1){const v=power()*f,o={x:p0.x,y:p0.y,r:p0.r,vx:Math.cos(a)*v,vy:Math.sin(a)*v};let md=1e9;
  for(let k=0;k<260;k++){const dt=1/120;o.vy+=1500*dt;if(L.wind&&o.y<GY-o.r-2)o.vx+=L.wind*dt*(S.hero==1?.4:1);o.x+=o.vx*dt;o.y+=o.vy*dt;bounds(o,.62);for(const b of sol)circRect(o,b,.6);if(L.haz.some(z=>z.t=='lava'&&o.x>z.x&&o.x<z.x+z.w&&o.y>GY-o.r-3)){md+=400;break;}const d=Math.hypot(o.x-tx,o.y-ty);if(d<md)md=d;if(d<20)break;}
  const sc=md+f*5+(low?Math.abs(a+0.4)*30:0);if(sc<bd){bd=sc;best=[Math.cos(a)*v,Math.sin(a)*v];}}launch(best[0],best[1]);return bd;},
 next:nextLevel,go(s,t){scene=s;if(t!=null)shopTab=t;}};
// boot
(async()=>{await new Promise(r=>{let t=0;const iv=setInterval(()=>{if(window.CrazyGames||(t+=50)>1500){clearInterval(iv);r();}},50);});await SDK.init();SDK.call('loadingStart');document.getElementById('ld').style.display='none';SDK.call('loadingStop');requestAnimationFrame(frame);})();
})();
