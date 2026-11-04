
const ev=(t,d)=>document.dispatchEvent(new CustomEvent("vhs",{detail:{t,...d}}));
const $=s=>document.querySelector(s),uid=()=>Math.random().toString(36).slice(2,10);
let S;try{S=JSON.parse(localStorage.getItem("vc"))}catch(e){}
S=S||{set:{key:"",model:"venice-uncensored",temp:0.9,max:1024,user:"User",persona:"",sys:""},chars:[],chats:[],cur:null,tab:"c"};
S.set.hist=S.set.hist||60;if(!S.personas){S.personas=[{id:uid(),name:S.set.user||"User",desc:S.set.persona||""}];S.set.pid=S.personas[0].id}S.chats.forEach(x=>x.t=x.t||Date.now());let busy=false,ctl=null,ed=null,showH=false;
const save=()=>{window.vpush&&vpush();try{localStorage.setItem("vc",JSON.stringify(S))}catch(e){toast("Storage is full. Back up, then delete large characters or old chats.")}};
const toast=m=>{$("#err").textContent=m||""};
const esc=s=>s.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
const fmt=s=>{const cb=[];s=esc(s||"").replace(/```(?:\w*\n)?([\s\S]*?)```/g,(_,c)=>"\u0000"+(cb.push(c)-1)+"\u0000");
 s=s.replace(/`([^`\n]+)`/g,"<code>$1</code>").replace(/^#{1,3} (.+)$/gm,"<h4>$1</h4>").replace(/^[-*] (.+)$/gm,"<li>$1</li>").replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/\*(.+?)\*/g,"<i>$1</i>").replace(/<\/(li|h4)>\n/g,"</$1>").replace(/\n/g,"<br>");
 return s.replace(/\u0000(\d+)\u0000/g,(_,i)=>"<pre>"+cb[i]+"</pre>")};
const mac=(t,c)=>(t||"").replace(/\{\{user\}\}|<USER>/gi,S.set.user).replace(/\{\{char\}\}|<BOT>/gi,c?c.name:"");
const cur=()=>S.chats.find(x=>x.id==S.cur),char=ch=>ch&&S.chars.find(c=>c.id==ch.charId);
const ini=c=>esc((c.name||"?")[0].toUpperCase()),avf=i=>{const d=document.createElement("div");d.className=i.className;d.textContent=i.dataset.i;return d};
const av=(c,z="")=>c.av?`<img class="av ${z}" data-i="${ini(c)}" src="${c.av}" alt="">`:`<div class="av ${z}">${ini(c)}</div>`;
const grp=t=>{const d=(Date.now()-t)/864e5;return d<1?"Today":d<7?"This week":d<14?"Last week":"Older"};
const rs=u=>new Promise(r=>{const i=new Image();i.onload=()=>{const k=Math.min(1,160/Math.max(i.width,i.height)),v=document.createElement("canvas");v.width=i.width*k;v.height=i.height*k;v.getContext("2d").drawImage(i,0,0,v.width,v.height);r(v.toDataURL("image/jpeg",.8))};i.onerror=()=>r("");i.src=u});
const url=f=>new Promise(r=>{const x=new FileReader();x.onload=()=>r(x.result);x.readAsDataURL(f)});
const dl=(n,t)=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([t]));a.download=n;a.click()};

function render(){
 if(S.view===undefined&&cur())S.view="chat";
 const q=$("#q").value.toLowerCase(),h={};
 S.chats.filter(x=>char(x)&&(char(x).name+x.title+(q.length>2?x.msgs.map(m=>m.c).join(" "):"")).toLowerCase().includes(q)).sort((a,b)=>b.t-a.t).forEach(x=>(h[grp(x.t)]=h[grp(x.t)]||[]).push(x));
 $("#list").innerHTML=["Today","This week","Last week","Older"].filter(k=>h[k]).map(k=>`<p class="gh">${k}</p>`+h[k].map(x=>`<div class="it ${x.id==S.cur&&S.view=="chat"?"on":""}" data-h="${x.id}">${av(char(x))}<span class="n">${esc(char(x).name)}</span><button class="x" data-x="${x.id}" title="Delete chat">✕</button></div>`).join("")).join("")||'<p class="gh">No chats yet.</p>';
 $("#home").classList.toggle("on",S.view!="chat");draw();
}
function draw(){
 const ch=cur(),c=char(ch),chat=S.view=="chat"&&ch&&c;
 $("footer").style.display=$("#rp").style.display=chat?"":"none";
 if(!chat){$("#log").innerHTML=`<div class="grid">${S.chars.filter(c=>(c.name+(c.title||"")).toLowerCase().includes($("#q").value.toLowerCase())).sort((a,b)=>!!b.fav-!!a.fav||(b.rate||0)-(a.rate||0)).map(c=>`<div class="cd" data-c="${c.id}">${av(c,"l")}<b>${esc(c.name)}</b><p>${esc(c.title||c.desc||"")}</p><small class="st">${c.rate?"★".repeat(c.rate):""}</small><button class="fv" data-fav="${c.id}" title="Favorite">${c.fav?"★":"☆"}</button><button class="ed" data-e="${c.id}">Edit</button></div>`).join("")}</div>`+(S.chars.length?"":'<p class="empty">No characters yet.<br>Create one, or import c.ai cards (.json / .png).</p>');return}
 const n=ch.msgs.length;
 $("#log").innerHTML=`<div class="ph">${av(c,"l")}<b>${esc(c.name)}</b><p>${esc(c.title||"")}</p>${c.by?`<small>By @${esc(c.by)}</small>`:""}</div>`+ch.msgs.map((m,i)=>{
  const bot=m.r=="assistant",last=i==n-1&&bot,al=m.alts&&m.alts.length>1;
  return `<div class="m ${bot?"bot":"user"}" data-i="${i}">${bot?`<div class="hd">${av(c,"s")}<b>${esc(c.name)}</b><span class="tag">venice</span></div>`:""}<div class="bub tx">${fmt(mac(m.c,c))}</div><div class="ac ${last?"on":""}">${al?`<a data-a="p">‹</a><span>${m.k+1}/${m.alts.length}</span><a data-a="n">›</a>`:""}${last?'<a data-a="r" title="Regenerate">↻</a>':""}<a data-a="b" title="Branch from here">⑂</a><a data-a="s" title="Read aloud">🔊</a><a data-a="c" title="Copy">⧉</a><a data-a="e" title="Edit">✎</a><a data-a="d" title="Delete">✕</a></div></div>`}).join("");
 $("#rp").innerHTML=`<div class="rh">${av(c,"l")}<div><b>${esc(c.name)}</b><small>${c.by?"By @"+esc(c.by):""}</small><small>${esc(c.inter||"")}</small></div></div><p class="tl">${esc(c.title||"")}</p>
 <div class="rb"><button class="pill" data-act="nchat">New chat</button><button class="g" data-act="set" title="Settings">⚙</button></div>
 <button class="rw" data-act="hist">History <span>${showH?"⌄":"›"}</span></button>${showH?S.chats.filter(x=>x.charId==c.id).sort((a,b)=>b.t-a.t).map(x=>`<div class="it ${x.id==S.cur?"on":""}" data-h="${x.id}"><span class="n">${esc(x.title)}</span></div>`).join(""):""}
 <button class="rw" data-act="rename">Rename chat <span>›</span></button><button class="rw" data-act="edit">Customize <span>›</span></button><button class="rw" data-act="ichat">Import a chat <span>›</span></button><button class="rw" data-act="export">Export this chat <span>›</span></button>
 <button class="rw" data-act="persona">Persona <span>${esc(S.set.user)} ›</span></button><button class="rw" data-act="set">Style <span>${esc(S.set.model)} ›</span></button>`;
 $("#send").textContent=busy?"■":"↑";$("#in").placeholder="Message "+c.name+"…";$("#log").scrollTop=n<2?0:1e9;
}
function newChat(c,msgs){
 const ch={id:uid(),t:Date.now(),charId:c.id,title:new Date().toLocaleString(),msgs:msgs||(c.greet?[{r:"assistant",c:c.greet}]:[])};
 S.chats.push(ch);S.cur=ch.id;S.view="chat";save();render();ev("newchat");return ch;
}
async function gen(m0){
 const ch=cur(),c=char(ch);if(!ch||busy)return;
 if(!S.set.key){toast("Add your Venice API key in Settings first.");$("#ds").showModal();return}
 toast();
 const sys=[S.set.sys,`You are ${c.name}.${c.title?" "+c.title+".":""}\n${c.desc}`,c.ex&&"Example dialogue:\n"+c.ex,loreFor(c,ch),S.set.persona&&`The user is ${S.set.user}. ${S.set.persona}`].filter(Boolean).map(x=>mac(x,c)).join("\n\n");
 const msgs=[{role:"system",content:sys},...ctxTrim(ch.msgs.filter(x=>x!==m0)).map(m=>({role:m.r,content:mac(m.c,c)}))];
 let m=m0;if(m){m.alts=m.alts||[m.c];m.old=m.c;m.c=""}else{m={r:"assistant",c:""};ch.msgs.push(m)}busy=true;ctl=new AbortController();draw();ev("think");
 try{
  const r=await fetch("https://api.venice.ai/api/v1/chat/completions",{method:"POST",signal:ctl.signal,headers:{"Content-Type":"application/json",Authorization:"Bearer "+S.set.key},
   body:JSON.stringify({model:S.set.model,messages:msgs,temperature:+S.set.temp,max_tokens:+S.set.max,stream:true,venice_parameters:{include_venice_system_prompt:false}})});
  if(!r.ok)throw new Error(venErr(r.status,await r.text()));
  const rd=r.body.getReader(),dc=new TextDecoder();let buf="";
  for(;;){const{done,value}=await rd.read();if(done)break;buf+=dc.decode(value,{stream:true});const ls=buf.split("\n");buf=ls.pop();
   for(const l of ls){if(!l.startsWith("data:"))continue;const d=l.slice(5).trim();if(d=="[DONE]")continue;try{m.c+=JSON.parse(d).choices[0].delta.content||""}catch(e){}}
   const el=[...document.querySelectorAll("#log .tx")].pop();if(el){el.innerHTML=fmt(mac(m.c,c));$("#log").scrollTop=1e9}ev("stream")}
 }catch(e){if(e.name!="AbortError"){toast(/Failed to fetch|NetworkError/i.test(e.message)?"Couldn’t reach Venice. Check your connection. Any partial reply was kept.":e.message);ev("error")}}
 if(m0){if(m.c.trim()){m.alts.push(m.c);m.k=m.alts.length-1}else m.c=m.old}else if(!m.c.trim())ch.msgs.pop();ch.t=Date.now();
 busy=false;ctl=null;save();render();if(m.c.trim())ev("done");
}
function send(){
 if(busy){ctl&&ctl.abort();return}
 const ch=cur();if(!ch)return toast("Pick a character first.");
 const t=$("#in").value.trim(),last=ch.msgs[ch.msgs.length-1];
 if(t){ch.msgs.push({r:"user",c:t});if(ch.msgs.filter(m=>m.r=="user").length==1)ch.title=t.slice(0,40);$("#in").value="";$("#in").style.height=""}
 else if(!last||last.r=="assistant"){ // empty send on an assistant message = retry it
  if(last&&ch.msgs.length>1){ch.msgs.pop()}else return;
 }
 ev("send");draw();gen();
}

/* ---------- imports ---------- */
async function png(f){
 const b=new Uint8Array(await f.arrayBuffer()),dv=new DataView(b.buffer);let p=8;
 while(p<b.length){const n=dv.getUint32(p),t=String.fromCharCode(...b.slice(p+4,p+8));
  if(t=="tEXt"){const s=new TextDecoder("latin1").decode(b.slice(p+8,p+8+n)),i=s.indexOf("\0"),k=s.slice(0,i);
   if(k=="chara"||k=="ccv3")return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(s.slice(i+1)),c=>c.charCodeAt(0))))}
  p+=12+n}
 throw new Error("No character data found in "+f.name);
}
function norm(o){
 const d=o.data||o.character||o.char||o,g=(...k)=>{for(const x of k)if(typeof d[x]=="string"&&d[x].trim())return d[x];return""};
 const name=g("name","char_name","display_name")||(d.participant&&d.participant.name)||"Unnamed";
 const desc=[g("description","persona","char_persona","long_description"),g("personality"),g("scenario")&&"Scenario: "+g("scenario")].filter(Boolean).join("\n\n");
 return{id:uid(),name,title:g("title","tagline","short_description"),desc:desc||g("definition"),greet:g("first_mes","greeting","char_greeting","first_message"),ex:g("mes_example","example_dialogue","example_chat")||(desc?g("definition"):""),av:d.avatar_file_name?"https://characterai.io/i/200/static/avatars/"+d.avatar_file_name:"",by:g("creator","author","user__username","participant__user__username"),inter:d.participant__num_interactions?(d.participant__num_interactions/1000).toFixed(1)+"k interactions":""};
}
async function impChars(files){
 let n=0;
 for(const f of files){try{
  if(/\.png$/i.test(f.name)){const c=norm(await png(f));c.av=await rs(await url(f));S.chars.push(c);n++;continue}
  const o=JSON.parse(await f.text());
  if(o.chars){S.chars.push(...o.chars.filter(c=>!S.chars.some(x=>x.id==c.id)));n+=o.chars.length;continue}
  for(const x of Array.isArray(o)?o:o.characters||[o]){const c=norm(x);const a=x.avatar||x.avatar_url;if(typeof a=="string"&&a.startsWith("data:"))c.av=await rs(a);S.chars.push(c);n++}
 }catch(e){toast(f.name+": "+e.message)}}
 S.view="home";save();render();if(n){toast("");ev("import",{n})}
}
const isU=x=>x.is_human===true||x.is_user===true||x.role=="user"||x.sender=="human"||[x.name,x.author,x.sender,x.speaker].some(v=>typeof v=="string"&&(/^(you|user|me|human)$/i.test(v)||v.toLowerCase()==S.set.user.toLowerCase()));
function parseChat(t){
 let a;try{const o=JSON.parse(t);a=Array.isArray(o)?o:o.messages||o.history||o.chat||o.turns||o.chat_history||[o]}
 catch(e){try{a=t.trim().split("\n").map(l=>JSON.parse(l))}catch(e2){a=null}}
 if(a){return a.map(x=>{let c=x.content??x.text??x.message??x.mes??x.raw_content??"";if(Array.isArray(c))c=c.map(p=>p.text||p).join("");
  if(!c&&x.candidates)c=(x.candidates[0]||{}).raw_content||"";return typeof c=="string"&&c.trim()&&(x.role!="system")?{r:isU(x)?"user":"assistant",c:c.trim()}:null}).filter(Boolean)}
 const out=[];for(const l of t.split(/\r?\n/)){const k=l.match(/^([^:\n]{1,40}):\s*(.*)$/);
  if(k)out.push({r:isU({name:k[1]})?"user":"assistant",c:k[2]});else if(out.length&&l.trim())out[out.length-1].c+="\n"+l}
 return out.filter(m=>m.c.trim());
}
async function impChat(f){
 const c=char(cur())||S.chars.find(x=>x.id==(cur()||{}).charId);
 if(!c)return toast("Open a character first; the imported chat will be attached to it.");
 try{const ms=parseChat(await f.text());if(!ms.length)throw new Error("No messages found in this file.");
  const ch=newChat(c,ms);ch.title="Imported: "+f.name.slice(0,30);save();render();toast("")}
 catch(e){toast(f.name+": "+e.message)}
}

/* ---------- events ---------- */
function exportChat(){const ch=cur(),c=char(ch);if(ch)dl((c.name+"-chat.txt").replace(/\s+/g,"_"),ch.msgs.map(m=>(m.r=="user"?S.set.user:c.name)+": "+mac(m.c,c)).join("\n\n"))}
document.addEventListener("click",e=>{
 const g=s=>e.target.closest(s);let x;
 if(innerWidth<800&&(g("#list")||g(".cd")))$("#side").classList.add("hide");
 if(x=g("[data-x]")){S.chats=S.chats.filter(y=>y.id!=x.dataset.x);if(S.cur==x.dataset.x){S.cur=null;S.view="home"}save();return render()}
 if(x=g("[data-h]")){S.cur=x.dataset.h;S.view="chat";return render()}
 if(x=g("[data-fav]")){const c=S.chars.find(y=>y.id==x.dataset.fav);c.fav=!c.fav;save();return draw()}if(x=g("[data-e]"))return editChar(x.dataset.e);
 if(x=g("[data-c]")){const id=x.dataset.c,l=S.chats.filter(y=>y.charId==id).sort((a,b)=>b.t-a.t)[0];if(l){S.cur=l.id;S.view="chat";render()}else newChat(S.chars.find(y=>y.id==id));return}
 if(x=g("[data-act]")){const a=x.dataset.act,c=char(cur());
  if(a=="rename"){const t=prompt("Chat title",cur().title);if(t){cur().title=t;cur().titled=1;save();render()}}if(a=="persona")openP();if(a=="nchat")newChat(c);if(a=="set"){fill();$("#ds").showModal()}if(a=="hist"){showH=!showH;draw()}if(a=="edit")editChar(c.id);if(a=="ichat")$("#fh").click();if(a=="export")exportChat();return}
 if(x=g("[data-a]")){if(busy)return;const a=x.dataset.a,ch=cur(),i=+x.closest(".m").dataset.i,m=ch.msgs[i];
  if(a=="r"){ev("regen");return gen(m)}if(a=="b"){const n=newChat(char(ch),JSON.parse(JSON.stringify(ch.msgs.slice(0,i+1))));n.title="Branch: "+ch.title.slice(0,30);n.titled=1;save();render();return}if(a=="s"){speak(m.c);return}if(a=="c"){navigator.clipboard.writeText(m.c);return}
  if(a=="d"||a=="e")UN.push([ch.id,JSON.stringify(ch.msgs)]);if(a=="d")ch.msgs.splice(i,1);
  if(a=="e"){const v=prompt("Edit message",m.c);if(v===null)return;m.c=v;if(m.alts)m.alts[m.k]=v}
  if(a=="p"||a=="n"){m.k=(m.k+(a=="n"?1:-1)+m.alts.length)%m.alts.length;m.c=m.alts[m.k]}
  save();draw()}
});
$("#send").onclick=send;
$("#in").onkeydown=e=>{if(e.key=="Enter"&&!e.shiftKey){e.preventDefault();send()}};
$("#in").oninput=e=>{e.target.style.height="auto";e.target.style.height=e.target.scrollHeight+"px"};
$("#home").onclick=()=>{S.view="home";render()};$("#q").oninput=render;
$("#col").onclick=()=>$("#side").classList.add("hide");$("#tg").onclick=()=>$("#side").classList.remove("hide");
$("#ic").onclick=()=>$("#fc").click();$("#fc").onchange=e=>{impChars([...e.target.files]);e.target.value=""};
$("#fh").onchange=e=>{if(e.target.files[0])impChat(e.target.files[0]);e.target.value=""};
if(innerWidth<800)$("#side").classList.add("hide");
/* settings */
const fill=()=>document.querySelectorAll("[data-s]").forEach(i=>i.value=S.set[i.dataset.s]);
document.querySelectorAll("[data-s]").forEach(i=>i.oninput=()=>{S.set[i.dataset.s]=i.value;save()});
$("#st").onclick=()=>{fill();$("#ds").showModal()};
$("#lm").onclick=async()=>{try{const r=await fetch("https://api.venice.ai/api/v1/models?type=text",{headers:{Authorization:"Bearer "+S.set.key}});if(!r.ok)throw new Error("Venice returned "+r.status);
 $("#ml").innerHTML=(await r.json()).data.map(m=>`<option value="${m.id}">`).join("");toast("")}catch(e){toast("Could not load models: "+e.message)}};
$("#ba").onclick=()=>dl("vhs-backup.json",JSON.stringify({v:1,chars:S.chars,chats:S.chats}));
$("#br").onclick=()=>$("#fr").click();
$("#fr").onchange=async e=>{try{const o=JSON.parse(await e.target.files[0].text());
 for(const k of["chars","chats"])for(const x of o[k]||[]){const i=S[k].findIndex(y=>y.id==x.id);i<0?S[k].push(x):S[k][i]=x}
 save();render()}catch(er){toast("Backup file not valid: "+er.message)}e.target.value=""};
/* character editor */
function editChar(id){
 ed=S.chars.find(c=>c.id==id)||{id:uid(),name:"",title:"",desc:"",greet:"",ex:"",av:"",isNew:true};
 $("#e-name").value=ed.name;$("#e-title").value=ed.title;$("#e-desc").value=ed.desc;$("#e-greet").value=ed.greet;$("#e-ex").value=ed.ex;$("#e-lore").value=ed.lore||"";$("#e-rate").value=ed.rate||0;$("#e-rev").value=ed.rev||"";$("#e-av").value="";
 $("#e-del").style.display=$("#e-exp").style.display=ed.isNew?"none":"";$("#de").showModal();
}
$("#nc").onclick=()=>editChar();
$("#e-save").onclick=async()=>{
 const f=$("#e-av").files[0];if(f)ed.av=await rs(await url(f));
 Object.assign(ed,{name:$("#e-name").value.trim()||"Unnamed",title:$("#e-title").value,desc:$("#e-desc").value,greet:$("#e-greet").value,ex:$("#e-ex").value,lore:$("#e-lore").value,rate:+$("#e-rate").value,rev:$("#e-rev").value});
 if(ed.isNew){delete ed.isNew;S.chars.push(ed)}S.view="home";save();render();
};
$("#e-del").onclick=()=>{if(confirm("Delete "+ed.name+" and all of their chats?")){S.chars=S.chars.filter(c=>c.id!=ed.id);S.chats=S.chats.filter(x=>x.charId!=ed.id);if(!cur())S.cur=null;save();$("#de").close();render()}};
/* personas */
const P=()=>S.personas.find(p=>p.id==S.set.pid)||S.personas[0];
const useP=p=>{S.set.pid=p.id;S.set.user=p.name;S.set.persona=p.desc;save();ev("persona",{name:p.name})};
const pj=l=>JSON.stringify({type:"venice-persona",v:1,personas:l.map(p=>({name:p.name,desc:p.desc}))},null,1);
let pe=null;
function renderP(){
 $("#pl").innerHTML=S.personas.map(p=>`<div class="pl ${p.id==S.set.pid?"on":""}"><b>${esc(p.name)}</b>`+[["use",p.id==S.set.pid?"Active":"Use"],["edit","Edit"],["exp","Export"],["del","✕"]].map(([a,t])=>`<button type="button" data-p="${a}" data-id="${p.id}">${t}</button>`).join("")+"</div>").join("");
 $("#p-name").value=pe.name;$("#p-desc").value=pe.desc;
}
function openP(){pe=P();renderP();if(!$("#dp").open)$("#dp").showModal()}
$("#pn").onclick=openP;$("#op").onclick=()=>{$("#ds").close();openP()};
$("#dp").addEventListener("click",e=>{const b=e.target.closest("[data-p]");if(!b)return;const p=S.personas.find(x=>x.id==b.dataset.id),a=b.dataset.p;
 if(a=="use"){useP(p);pe=p}if(a=="edit")pe=p;
 if(a=="exp")dl(p.name.replace(/\W+/g,"_")+"-persona.json",pj([p]));
 if(a=="del"){if(S.personas.length<2)return alert("Keep at least one persona.");if(!confirm("Delete "+p.name+"?"))return;S.personas=S.personas.filter(x=>x!==p);if(S.set.pid==p.id)useP(S.personas[0]);pe=P()}
 save();renderP();render()});
$("#p-save").onclick=()=>{pe.name=$("#p-name").value.trim()||"User";pe.desc=$("#p-desc").value;if(!S.personas.includes(pe))S.personas.push(pe);if(pe.id==S.set.pid)useP(pe);save();renderP();render()};
$("#p-new").onclick=()=>{pe={id:uid(),name:"New persona",desc:""};renderP()};
$("#p-exp").onclick=()=>dl("personas.json",pj(S.personas));
$("#p-imp").onclick=()=>$("#fp").click();
$("#fp").onchange=async e=>{let n=0;
 for(const f of e.target.files){try{const o=JSON.parse(await f.text());for(const x of o.personas||(Array.isArray(o)?o:[o])){const name=x.name||x.title||x.display_name,desc=x.desc||x.description||x.definition||x.persona||x.content||"";if(typeof name=="string"&&name){S.personas.push({id:uid(),name,desc:typeof desc=="string"?desc:""});n++}}}catch(er){alert(f.name+": "+er.message)}}
 e.target.value="";if(!n)return alert("No persona found in this file.");pe=S.personas[S.personas.length-1];save();renderP()};
$("#e-exp").onclick=()=>{if(ed&&!ed.isNew)dl(ed.name.replace(/\W+/g,"_")+".json",JSON.stringify({spec:"chara_card_v2",spec_version:"2.0",data:{name:ed.name,description:ed.desc,first_mes:ed.greet,mes_example:ed.ex,personality:"",scenario:"",tags:[],creator:ed.by||"",extensions:{}}},null,1))};
render();
