/* Cloudflare Worker: lets vhs.ai fetch a c.ai character from a link (browsers can't call c.ai directly). Free plan is enough. */
const H={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST,OPTIONS"};
const out=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{...H,"Content-Type":"application/json"}});
export default{async fetch(q){
 if(q.method=="OPTIONS")return new Response(null,{headers:H});
 try{const{url,token}=await q.json(),id=(String(url).match(/[A-Za-z0-9_-]{30,}/g)||[]).pop();if(!id)return out({error:"No c.ai character ID found in that link."},400);
  const h={"Content-Type":"application/json",Origin:"https://character.ai",Referer:"https://character.ai/",...(token?{Authorization:"Token "+token}:{})};let err="no answer";
  for(const[u,b]of[["https://neo.character.ai/character/v1/get_character_info",{external_id:id,lang:"en"}],["https://plus.character.ai/chat/character/info",{external_id:id}]]){
   try{const r=await fetch(u,{method:"POST",headers:h,body:JSON.stringify(b)});if(!r.ok){err=new URL(u).host+" answered "+r.status;continue}
    const j=await r.json(),c=j.character||j;if(!c||!c.name){err="no character in the answer";continue}
    let avatar="";if(c.avatar_file_name)try{const a=await fetch("https://characterai.io/i/200/static/avatars/"+c.avatar_file_name+"?webp=true&anim=0");
     if(a.ok){const u8=new Uint8Array(await a.arrayBuffer());let s="";for(let i=0;i<u8.length;i+=8192)s+=String.fromCharCode(...u8.subarray(i,i+8192));avatar=`data:${a.headers.get("content-type")||"image/webp"};base64,`+btoa(s)}}catch{}
    return out({character:c,avatar})}catch(e){err=e.message}}
  return out({error:"c.ai refused the request ("+err+"). Add your c.ai token in Settings > Privacy, or import a card file instead."},502)
 }catch(e){return out({error:e.message},400)}}};
