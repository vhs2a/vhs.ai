/* vhs.ai: VHS the orange monster runs the tutorial, then lives in Settings > More > Tutorial */
(()=>{
const el=document.createElement("div");el.id="vhs";
el.innerHTML=`<div id="sb"></div><svg viewBox="0 0 120 136" width="110" height="125"><defs>
<radialGradient id="vg" cx=".35" cy=".25" r=".95"><stop offset="0" stop-color="#ffa34a"/><stop offset=".55" stop-color="#ee6a10"/><stop offset="1" stop-color="#a63c07"/></radialGradient>
<linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe3b8"/><stop offset="1" stop-color="#c25510"/></linearGradient></defs>
<ellipse cx="60" cy="132" rx="36" ry="4.5" fill="#000" opacity=".4"/>
<g class="bd">
<path d="M34 30 24 5q18 1 25 19zM86 30 96 5Q78 6 71 24z" fill="url(#hg)"/>
<ellipse cx="44" cy="127" rx="14" ry="6" fill="#a63c07"/><ellipse cx="76" cy="127" rx="14" ry="6" fill="#a63c07"/>
<path d="M99 80c15-2 18-17 11-25" stroke="#e8660f" stroke-width="10" stroke-linecap="round" fill="none"/><circle cx="110" cy="54" r="6.5" fill="#ff8a1f"/>
<path d="M20 72C20 36 38 17 60 17s40 19 40 55v21c0 20-14 31-40 31S20 113 20 93z" fill="url(#vg)"/>
<path d="M21 80l-7 3 7 5M99 80l7 3-7 5M23 98l-7 4 8 2M97 98l7 4-8 2M46 18l3-7 5 6M66 17l4-7 4 8" fill="#ee6a10"/>
<g class="arm"><path d="M22 80C7 78 4 64 10 56" stroke="#e8660f" stroke-width="10" stroke-linecap="round" fill="none"/><circle cx="10" cy="55" r="6.5" fill="#ff8a1f"/></g>
<path d="M32 38q11-7 23-1M65 37q12-6 23 1" stroke="#7c2f06" stroke-width="4.5" stroke-linecap="round" fill="none"/>
<g class="ey"><ellipse cx="44" cy="53" rx="13" ry="15" fill="#fff"/><ellipse cx="76" cy="53" rx="13" ry="15" fill="#fff"/>
<g class="pp"><circle cx="44" cy="55" r="6.5" fill="#1a0e07"/><circle cx="46.5" cy="52" r="2.2" fill="#fff"/></g>
<g class="pp"><circle cx="76" cy="55" r="6.5" fill="#1a0e07"/><circle cx="78.5" cy="52" r="2.2" fill="#fff"/></g></g>
<circle cx="30" cy="72" r="5" fill="#ff5a2a" opacity=".45"/><circle cx="90" cy="72" r="5" fill="#ff5a2a" opacity=".45"/>
<path d="M45 73q15 17 30 0z" fill="#1a0e07"/><path d="M50 73l3 6 3-6zM64 73l3 6 3-6z" fill="#fff"/><path d="M53 83q7 4 14 0q-7-5-14 0z" fill="#e0505a"/>
<g transform="translate(36 88)"><rect width="48" height="26" rx="4" fill="#1d1410" stroke="#4a3426" stroke-width="1.5"/><rect x="4" y="3" width="40" height="11" rx="2" fill="#f0e9e1"/>
<text x="24" y="12" text-anchor="middle" font-size="9" font-weight="800" font-family="Arial,sans-serif" fill="#d4560c">VHS</text>
<circle cx="15" cy="20" r="3.8" fill="#ee6a10"/><circle cx="33" cy="20" r="3.8" fill="#ee6a10"/><circle cx="15" cy="20" r="1.3" fill="#1d1410"/><circle cx="33" cy="20" r="1.3" fill="#1d1410"/></g>
</g></svg>`;
document.body.appendChild(el);
const sb=el.firstChild,pp=el.querySelectorAll(".pp"),cl=(v,a,b)=>Math.max(a,Math.min(b,v));let tut=-1,tgt=null,tm,ht;
addEventListener("pointermove",e=>{if(tut<0)return;const r=el.getBoundingClientRect(),a=Math.atan2(e.clientY-(r.top+55),e.clientX-(r.left+55));pp.forEach(p=>p.setAttribute("transform",`translate(${Math.cos(a)*3.5} ${Math.sin(a)*3.5})`))});
const steps=[
 {t:"Hi! I’m VHS, your orange guide. Let me show you around."},
 {el:"#st",t:"Settings: paste your Venice API key here. It stays in this browser and is only sent to Venice. Keep the model on venice-uncensored."},
 {el:"#ic",t:"Import characters here. c.ai cards (.json or .png) work, and so do cards from SillyTavern or this site."},
 {el:"#il",t:"Paste a character.ai link here and I’ll fetch the character for you. It needs the free c.ai proxy from SETUP.md."},
 {el:"#nc",t:"Or build your own: name, description, first message and an avatar."},
 {el:"#pn",t:"Personas are who you play. Make several, switch any time, and import or export them as .json."},
 {el:"#home",t:"The Characters page lists everyone. Click a card to start a chat. Ctrl+K searches."},
 {el:"#rp",t:"In a chat, ↻ regenerates and keeps every version (swipe with ‹ ›). ✎ edits, ⧉ copies. This panel imports a c.ai chat or exports this one."},
 {el:"#ac",t:"Create an account to sync characters, chats and personas across devices. Your API keys stay in this browser."},
 {el:"#st",t:"That’s it! To see this again, open Settings → General → Tutorial. Have fun!"}];
function say(t,b=[],ms=0){clearTimeout(tm);sb.innerHTML=t?`<p>${t}</p><div>`+b.map(([k,l])=>`<button data-k="${k}">${l}</button>`).join("")+"</div>":"";sb.style.display=t?"block":"none";el.classList.toggle("talk",!!t);if(t&&ms)tm=setTimeout(()=>say(""),ms)}
function spot(sel){document.querySelectorAll(".spot").forEach(n=>n.classList.remove("spot"));tgt=null;const n=sel&&document.querySelector(sel);if(n&&n.offsetParent!==null){n.classList.add("spot");tgt=n}}
function place(){let x=innerWidth-150,y=innerHeight-190;
 if(tgt){const b=tgt.getBoundingClientRect();x=b.right+18;y=b.top+b.height/2-62;if(x>innerWidth-130)x=b.left-130}
 x=cl(x,8,innerWidth-122);y=cl(y,8,innerHeight-136);el.style.left=x+"px";el.style.top=y+"px";el.classList.toggle("dn",y<230);el.classList.toggle("lf",x<300)}
function stop(msg){tut=-1;spot();S.set.tut=1;save();
 if(msg){say(msg,[],4200);ht=setTimeout(()=>el.style.display="none",4300)}
 else{say("");el.dataset.m="happy";ht=setTimeout(()=>{el.dataset.m="";el.style.display="none"},700)}}
function step(i){const s=steps[i];if(!s)return stop();tut=i;clearTimeout(ht);const first=el.style.display!="block";
 el.style.display="block";if(first)el.style.transition="none";spot(s.el);place();if(first){el.offsetWidth;el.style.transition=""}
 say(s.t,[...(i<steps.length-1?[["skip","Skip"]]:[]),["next",i==steps.length-1?"Done":i?"Next":"Let’s go"]])}
sb.onclick=e=>{const k=e.target.dataset.k;if(k=="next")step(tut+1);if(k=="skip")stop("No problem! Replay it from Settings → General → Tutorial.")};
$("#rt").onclick=()=>{$("#ds").close();step(0)};
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key=="k"){e.preventDefault();S.view="home";render();$("#q").focus()}});
addEventListener("resize",()=>tut>=0&&place());
if(!S.set.tut)setTimeout(()=>step(0),700);
})();
