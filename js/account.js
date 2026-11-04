/* Accounts (Firebase Auth + Firestore over REST, no SDK, no server of yours) and c.ai link import (via an optional Cloudflare Worker) */
(()=>{
const CFG=window.VHS_CONFIG||{},FB=!!(CFG.apiKey&&CFG.projectId&&!/YOUR_/.test(CFG.apiKey+CFG.projectId)),A="vhs-auth";
const EM=n=>n.includes("@")?n:n.toLowerCase()+"@vhs-ai.user";
let au=null,tm;try{au=JSON.parse(localStorage.getItem(A))}catch(e){}
const ERR={EMAIL_EXISTS:"That username is taken.",INVALID_LOGIN_CREDENTIALS:"Wrong username or password.",INVALID_PASSWORD:"Wrong username or password.",EMAIL_NOT_FOUND:"Wrong username or password.",WEAK_PASSWORD:"Password must have 6+ characters.",INVALID_EMAIL:"Username: letters, digits, . _ - only.",TOO_MANY_ATTEMPTS_TRY_LATER:"Too many attempts. Wait a few minutes.",OPERATION_NOT_ALLOWED:"Enable Email/Password sign-in in your Firebase project (SETUP.md, step 2).",USER_DISABLED:"This account is disabled."};
const jf=async(u,o={})=>{let r;try{r=await fetch(u,o)}catch(e){throw new Error("Couldn’t reach the server. Check your connection and config.js.")}
 const j=await r.json().catch(()=>({}));if(!r.ok){const e=typeof j.error=="string"?j.error:(j.error&&j.error.message)||"";throw new Error(ERR[e.split(" ")[0]]||e||"Server error "+r.status)}return j};
const store=x=>{au=x;x?localStorage.setItem(A,JSON.stringify(x)):localStorage.removeItem(A)};
async function auth(k,name,pw){const j=await jf(`https://identitytoolkit.googleapis.com/v1/accounts:${k}?key=${CFG.apiKey}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:EM(name),password:pw,returnSecureToken:true})});
 store({name:name.includes("@")?name:name.toLowerCase(),uid:j.localId,refresh:j.refreshToken,id:j.idToken,exp:Date.now()+j.expiresIn*1e3-6e4})}
async function tok(){if(!au)throw new Error("Not signed in");
 if(Date.now()>au.exp){const j=await jf(`https://securetoken.googleapis.com/v1/token?key=${CFG.apiKey}`,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=refresh_token&refresh_token="+encodeURIComponent(au.refresh)});store({...au,id:j.id_token,refresh:j.refresh_token,exp:Date.now()+j.expires_in*1e3-6e4})}
 return au.id}
const DB=()=>`https://firestore.googleapis.com/v1/projects/${CFG.projectId}/databases/(default)/documents`,P=()=>`projects/${CFG.projectId}/databases/(default)/documents/users/${au.uid}/sync/`;
const mg=(a,b)=>{const m=new Map((a||[]).map(x=>[x.id,x]));(b||[]).forEach(x=>m.set(x.id,x));return[...m.values()]};
async function push(){const{key,cai,...set}=S.set,s=JSON.stringify({chars:S.chars,chats:S.chats,personas:S.personas,set}),parts=[];
 for(let b=0;b<s.length;){let e=Math.min(s.length,b+3e5);if(e<s.length&&(s.charCodeAt(e-1)&0xFC00)==0xD800)e--;parts.push(s.slice(b,e));b=e}
 const w=parts.map((p,i)=>({update:{name:P()+"c"+i,fields:{s:{stringValue:p}}}}));
 w.push({update:{name:P()+"meta",fields:{n:{integerValue:String(parts.length)},t:{integerValue:String(Date.now())}}}});
 await jf(DB()+":commit",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+await tok()},body:JSON.stringify({writes:w})})}
async function pull(){const H={Authorization:"Bearer "+await tok()};let meta;
 try{meta=await jf(DB()+"/users/"+au.uid+"/sync/meta",{headers:H})}catch(e){if(/not found/i.test(e.message))return push();throw e}
 const names=Array.from({length:+meta.fields.n.integerValue},(_,i)=>P()+"c"+i),r=await jf(DB()+":batchGet",{method:"POST",headers:{...H,"Content-Type":"application/json"},body:JSON.stringify({documents:names})}),m={};
 r.forEach(x=>x.found&&(m[x.found.name]=x.found.fields.s.stringValue));const d=JSON.parse(names.map(k=>m[k]||"").join(""));
 S.chars=mg(S.chars,d.chars);S.chats=mg(S.chats,d.chats);S.personas=mg(S.personas,d.personas);
 Object.assign(S.set,d.set||{},{key:S.set.key,cai:S.set.cai});if(!S.personas.length)S.personas=[{id:uid(),name:"User",desc:""}];
 save();push().catch(()=>{});render()}
window.vpush=()=>{if(!au||!FB)return;clearTimeout(tm);tm=setTimeout(()=>push().catch(e=>toast("Sync failed: "+e.message)),1500)};
const lab=()=>$("#ac").textContent=au?"Account: "+au.name:"Sign in";
function draw(){$("#da-b").innerHTML=!FB?'<p class="mu">Accounts need a free Firebase project. Open <b>config.js</b>, paste your keys, and follow <b>SETUP.md</b>.</p>'
 :au?`<p>Signed in as <b>${esc(au.name)}</b>. Characters, chats and personas sync to your Firebase project. Your API keys never leave this browser.</p><div class="row"><button id="a-sync">Sync now</button><button id="a-out">Sign out</button></div><p id="a-e" class="mu"></p>`
 :'<label>Username (or email)</label><input id="a-n" autocomplete="username"><label>Password (6+ characters)</label><input id="a-p" type="password" autocomplete="current-password"><p id="a-e" style="color:#ff8a7a;margin:8px 0 0"></p><div class="row"><button id="a-in">Sign in</button><button id="a-up">Create account</button></div>'}
const go=async k=>{const n=$("#a-n").value.trim(),e=$("#a-e");try{if(!n.includes("@")&&!/^[\w.-]{3,24}$/.test(n))throw new Error(ERR.INVALID_EMAIL);
 await auth(k=="up"?"signUp":"signInWithPassword",n,$("#a-p").value);lab();await pull();draw()}catch(x){e.textContent=x.message}};
$("#da").onclick=async e=>{const i=e.target.id;
 if(i=="a-in")go("in");if(i=="a-up")go("up");if(i=="da-x")$("#da").close();
 if(i=="a-out"){store(null);lab();draw()}
 if(i=="a-sync")try{await pull();draw();$("#a-e").textContent="Synced."}catch(x){$("#a-e").textContent=x.message}};
$("#da").onkeydown=e=>{if(e.key=="Enter"&&e.target.id=="a-p")go("in")};
$("#ac").onclick=()=>{draw();$("#da").showModal()};
$("#il").onclick=()=>{$("#l-st").textContent=CFG.caiProxy?"":"Link import needs the free c.ai proxy (SETUP.md, step 5). Card files still import fine.";$("#dl").showModal()};
$("#l-x").onclick=()=>$("#dl").close();
$("#l-go").onclick=async()=>{const st=$("#l-st");if(!CFG.caiProxy)return;st.textContent="Fetching…";
 try{const j=await jf(CFG.caiProxy,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:$("#l-url").value,token:S.set.cai||""})});const c=norm(j.character);if(j.avatar)c.av=await rs(j.avatar);
  S.chars.push(c);S.view="home";save();render();ev("import",{n:1});st.textContent="Imported "+c.name+".";$("#l-url").value=""}catch(e){st.textContent=e.message}};
lab();if(au&&FB)pull().catch(()=>{});
})();
