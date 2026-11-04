/* vhs.ai extras: themes, voice, lorebooks, shortcuts, undo, auto titles, context budget */
const UN=[];
S.set.tts=S.set.tts||"off";S.set.th=S.set.th||"ember";S.set.ctx=S.set.ctx||6000;
const TH={ember:["#0c0b0a","#070706","#171412","#241d18","#2b231c","#d4560c"],crimson:["#0d0a0b","#070506","#181213","#251a1c","#2e2124","#c0283c"],violet:["#0b0a0f","#060609","#14121a","#201c2a","#2a2535","#8b5cf6"],forest:["#090d0a","#050806","#111813","#1a251d","#223027","#2f9e5b"],ocean:["#090c10","#05070a","#111820","#1a2430","#233040","#1e88e5"]};
function applyTheme(){const t=TH[S.set.th]||TH.ember,r=document.documentElement.style;["bg","sd","c","c2","ln","a"].forEach((k,i)=>r.setProperty("--"+k,t[i]));if(S.set.acc)r.setProperty("--a",S.set.acc)}
applyTheme();
document.addEventListener("input",e=>{if(e.target.dataset&&/^(th|acc)$/.test(e.target.dataset.s)){if(e.target.dataset.s=="th")S.set.acc="";applyTheme()}});
const ctxTrim=a=>{const B=(+S.set.ctx||6000)*4;let n=0,o=[];for(let i=a.length-1;i>=0;i--){n+=a[i].c.length;if(n>B&&o.length>1)break;o.push(a[i])}o.reverse();if(o.length<a.length&&a[0].r=="assistant")o.unshift(a[0]);return o};
const loreFor=(c,ch)=>{const t=ch.msgs.slice(-6).map(m=>m.c).join(" ").toLowerCase(),o=[];(c.lore||"").split("\n").forEach(l=>{const i=l.indexOf("=");if(i>0&&l.slice(0,i).split(",").some(k=>k.trim()&&t.includes(k.trim().toLowerCase())))o.push(l.slice(i+1).trim())});return o.length?"World info:\n- "+o.join("\n- "):""};
const venErr=(s,t)=>({401:"Venice rejected your API key (401). Check it in Settings → AI.",402:"Your Venice credits are used up (402).",403:"Venice refused this request (403). Does your key have access to this model?",404:"Venice doesn’t know this model (404). Pick another in Settings → AI.",429:"Venice rate limit reached (429). Wait a moment and retry."}[s]||"Venice returned "+s+": "+t.slice(0,200));
/* voice out / in */
const speak=t=>{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t.replace(/\*[^*]*\*/g," ").replace(/[`#>_]/g,"").trim()||t),v=speechSynthesis.getVoices().find(x=>x.name==S.set.voice);if(v)u.voice=v;speechSynthesis.speak(u)};
const fv=()=>{$("#vs").innerHTML=speechSynthesis.getVoices().map(v=>`<option>${esc(v.name)}</option>`).join("");$("#vs").value=S.set.voice||""};
speechSynthesis.onvoiceschanged=fv;fv();
document.addEventListener("click",e=>{if(e.target.closest("#st,[data-act=set]"))setTimeout(fv)});
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let rec=null;
$("#mic").onclick=()=>{if(!SR)return toast("Voice input isn’t supported in this browser. Try Chrome or Edge.");if(rec)return rec.stop();
 rec=new SR();rec.lang=navigator.language;rec.interimResults=true;rec.continuous=true;const base=$("#in").value;
 rec.onresult=e=>{$("#in").value=(base+" "+[...e.results].map(r=>r[0].transcript).join("")).trim()};rec.onend=()=>{rec=null;$("#mic").classList.remove("rec")};rec.onerror=e=>toast("Microphone: "+e.error);rec.start();$("#mic").classList.add("rec")};
/* auto titles + read aloud */
async function title(ch){try{const r=await fetch("https://api.venice.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+S.set.key},body:JSON.stringify({model:S.set.model,max_tokens:24,temperature:.3,venice_parameters:{include_venice_system_prompt:false},messages:[{role:"system",content:"Write a title of 2 to 5 words for this chat. Reply with the title only, no quotes."},{role:"user",content:ch.msgs.slice(0,4).map(m=>m.c.slice(0,300)).join("\n")}]})});
 const t=((await r.json()).choices[0].message.content||"").replace(/["*\n]/g,"").trim().slice(0,50);if(t){ch.title=t;save();render()}}catch(e){ch.titled=0}}
document.addEventListener("vhs",e=>{if(e.detail.t!="done")return;const ch=cur();if(!ch)return;const l=ch.msgs[ch.msgs.length-1];
 if(S.set.tts=="on"&&l&&l.r=="assistant")speak(l.c);if(!ch.titled&&S.set.key&&ch.msgs.some(m=>m.r=="user")){ch.titled=1;title(ch)}});
/* shortcuts, undo */
document.addEventListener("keydown",e=>{const ch=cur(),typing=/INPUT|TEXTAREA|SELECT/.test((e.target.tagName||""));
 if(e.key=="Escape"&&busy&&ctl)ctl.abort();
 if(e.altKey&&e.key=="n"&&ch){e.preventDefault();newChat(char(ch))}
 if(e.altKey&&e.key=="s"){e.preventDefault();$("#st").click()}
 if(e.altKey&&e.key=="r"&&ch&&!busy){e.preventDefault();const l=ch.msgs[ch.msgs.length-1];if(l&&l.r=="assistant"){ev("regen");gen(l)}}
 if((e.ctrlKey||e.metaKey)&&e.key=="z"&&!typing){const u=UN.pop();if(u){const c=S.chats.find(x=>x.id==u[0]);if(c){e.preventDefault();c.msgs=JSON.parse(u[1]);save();draw();toast("Undone")}}}
 if(e.key=="Enter"&&e.target.matches&&e.target.matches(".it,.cd"))e.target.click()});
/* drag and drop import, accessibility, mobile panel, settings tabs, broken avatars */
addEventListener("dragover",e=>e.preventDefault());addEventListener("drop",e=>{e.preventDefault();const f=[...e.dataTransfer.files];if(f.length)impChars(f)});
new MutationObserver(()=>document.querySelectorAll(".it,.cd").forEach(n=>{n.tabIndex=0;n.setAttribute("role","button")})).observe(document.body,{childList:true,subtree:true});
document.addEventListener("error",e=>{if(e.target.tagName=="IMG"&&e.target.dataset.i)e.target.replaceWith(avf(e.target))},true);
$("#ro").onclick=()=>$("#rp").classList.toggle("open");
document.addEventListener("click",e=>{if(innerWidth<1100&&e.target.closest("#rp .rw,#rp .pill"))$("#rp").classList.remove("open")});
$("#ds").addEventListener("click",e=>{const b=e.target.closest("[data-sec]");if(!b||b.tagName!="BUTTON")return;
 document.querySelectorAll("#ds .tabs2 button").forEach(x=>x.classList.toggle("on",x==b));document.querySelectorAll("#ds section").forEach(s=>s.hidden=s.dataset.sec!=b.dataset.sec)});
