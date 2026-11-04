/* vhs.ai particles: app.js emits "vhs" events, this turns them into effects */
(()=>{
const cv=document.createElement("canvas");cv.id="fx";document.body.appendChild(cv);const g=cv.getContext("2d");let W,H,ps=[],run=false;
const rz=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight};rz();addEventListener("resize",rz);
S.set.fx=S.set.fx||"on";
const on=()=>S.set.fx!="off"&&!matchMedia("(prefers-reduced-motion:reduce)").matches;
const C=["#ff8a1f","#e8660f","#ffb14a","#b8420a","#fff1d6"],rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.random()*a.length|0];
const P=o=>{if(ps.length>600)return;ps.push({x:0,y:0,vx:0,vy:0,g:0,l:1,d:.02,s:3,c:C[0],k:"o",r:0,vr:0,...o});if(!run){run=true;requestAnimationFrame(tick)}};
function tick(){g.clearRect(0,0,W,H);g.globalCompositeOperation="lighter";ps=ps.filter(p=>p.l>0&&p.y<H+30);
 for(const p of ps){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.l-=p.d;p.r+=p.vr;const a=Math.max(0,Math.min(1,p.l));g.globalAlpha=a;g.fillStyle=g.strokeStyle=p.c;
  if(p.k=="o"){g.shadowBlur=10;g.shadowColor=p.c;g.beginPath();g.arc(p.x,p.y,p.s*(.5+a/2),0,7);g.fill()}
  else if(p.k=="s"){g.shadowBlur=0;g.lineWidth=2;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x-p.vx*3,p.y-p.vy*3);g.stroke()}
  else if(p.k=="q"){g.shadowBlur=0;g.save();g.translate(p.x,p.y);g.rotate(p.r);g.fillRect(-p.s,-p.s/2,p.s*2,p.s);g.restore()}
  else{g.shadowBlur=0;g.lineWidth=2;g.beginPath();g.arc(p.x,p.y,p.s*(1-a)*10+4,0,7);g.stroke()}}
 if(ps.length)requestAnimationFrame(tick);else{run=false;g.clearRect(0,0,W,H)}}
const at=el=>{const b=el&&el.offsetParent!==null&&el.getBoundingClientRect();return b?{x:b.left+b.width/2,y:b.top+b.height/2,b}:{x:W/2,y:H/2,b:{left:W/4,right:W*.75,top:H/2,bottom:H/2}}};
const last=()=>at([...document.querySelectorAll("#log .tx")].pop());
const E={
 send(){const{x,y}=at(document.querySelector("#send"));for(let i=0;i<24;i++){const a=rnd(-2.7,-.45),v=rnd(3,8);P({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:.16,d:.025,k:i%3?"s":"o",s:rnd(2,4),c:pick(C)})}},
 stream(){const{b}=last();for(let i=0;i<2;i++)P({x:rnd(b.left,b.right),y:Math.min(b.bottom,H-4),vx:rnd(-.3,.3),vy:rnd(-1.6,-.5),d:.012,s:rnd(1.5,3.5),c:pick(C)})},
 done(){const{x,b}=last();for(let i=0;i<16;i++)P({x,y:Math.min(b.bottom,H-8),vx:rnd(-3,3),vy:rnd(-4,-1),g:.12,d:.02,k:"q",s:rnd(2,4),vr:rnd(-.2,.2),c:pick(C)})},
 error(){const{x,y}=at(document.querySelector("#cb"));for(let i=0;i<16;i++)P({x:x+rnd(-80,80),y,vx:rnd(-1,1),vy:rnd(-2,0),g:.2,d:.016,k:"q",s:3,vr:.1,c:"#c0392b"})},
 import(d){for(let i=0;i<Math.min(80,30+(d.n||1)*10);i++)P({x:rnd(0,W),y:-10,vx:rnd(-1,1),vy:rnd(2,5),d:.007,k:"q",s:rnd(2,5),vr:rnd(-.2,.2),c:pick(C)})},
 newchat(){const{x,y}=at(document.querySelector("#log"));P({x,y,k:"r",d:.02,c:C[0]});P({x,y,k:"r",d:.015,c:C[2]})},
 persona(){const{x,y}=at(document.querySelector("#pn"));for(let i=0;i<20;i++){const a=rnd(0,6.28),v=rnd(1,4);P({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,d:.03,s:rnd(2,4),c:pick(C)})}},
 regen(){const{x,y}=last();for(let i=0;i<24;i++){const a=i/24*6.28;P({x:x+Math.cos(a)*40,y:y+Math.sin(a)*40,vx:-Math.sin(a)*2,vy:Math.cos(a)*2,d:.03,s:3,c:pick(C)})}}
};
document.addEventListener("vhs",e=>{if(on()&&E[e.detail.t])E[e.detail.t](e.detail)});
document.addEventListener("pointerdown",e=>{if(on())for(let i=0;i<5;i++)P({x:e.clientX,y:e.clientY,vx:rnd(-2,2),vy:rnd(-2,2),d:.05,s:2,c:pick(C)})});
document.addEventListener("input",e=>{if(on()&&e.target.id=="in"){const{b}=at(e.target);P({x:rnd(b.left,b.right),y:b.top,vx:rnd(-.3,.3),vy:rnd(-1.2,-.4),d:.03,s:rnd(1,2.5),c:pick(C)})}});
setInterval(()=>{if(on()&&!document.hidden&&Math.random()<.5)P({x:rnd(0,W),y:H+5,vy:rnd(-.7,-.25),vx:rnd(-.2,.2),d:.0028,s:rnd(1,2.2),c:C[1]})},700);
})();
