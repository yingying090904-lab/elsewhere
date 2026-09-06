import http from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT=fileURLToPath(new URL('.', import.meta.url));
const PORT=Number(process.env.PORT||3000);
const SOCIAL_FILE=join(ROOT,'social.json');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'};
const cleanText=(v,n=400)=>String(v??'').trim().slice(0,n);
const id=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);

function send(res,status,body,type='text/plain; charset=utf-8'){res.writeHead(status,{'content-type':type,'cache-control':'no-store','access-control-allow-origin':'*'});res.end(body)}
async function serveStatic(req,res){
  let pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname==='/') pathname='/index.html';
  const safe=normalize(pathname).replace(/^([.][.][/\\])+/, '');
  const file=join(ROOT,safe);
  if(!file.startsWith(ROOT)) return send(res,403,'Forbidden');
  try{const s=await stat(file); if(!s.isFile()) throw new Error(); const data=await readFile(file); send(res,200,data,MIME[extname(file)]||'application/octet-stream')}catch{send(res,404,'Not found')}
}
async function parseJson(req){let b='';for await(const c of req){b+=c;if(b.length>2_000_000) throw new Error('too large')}return JSON.parse(b||'{}')}
async function readSocial(){try{const d=JSON.parse(await readFile(SOCIAL_FILE,'utf8'));return {profiles:Array.isArray(d.profiles)?d.profiles:[],posts:Array.isArray(d.posts)?d.posts:[],follows:Array.isArray(d.follows)?d.follows:[]}}catch{return {profiles:[],posts:[],follows:[]}}}
async function writeSocial(d){await writeFile(SOCIAL_FILE,JSON.stringify(d,null,2),'utf8')}
async function socialApi(req,res,path){
  const db=await readSocial();
  if(req.method==='GET'&&path==='/api/social/profiles') return send(res,200,JSON.stringify({profiles:db.profiles,posts:db.posts.slice().sort((a,b)=>b.ts-a.ts).slice(0,80)}),'application/json');
  const body=await parseJson(req);
  if(path==='/api/social/profile'){
    const p={id:cleanText(body.id,80),name:cleanText(body.name,40)||'Elsewhere user',handle:cleanText(body.handle,24)||'user',bio:cleanText(body.bio,220),status:cleanText(body.status,120),avatar:cleanText(body.avatar,900000),banner:cleanText(body.banner,900000),tags:Array.isArray(body.tags)?body.tags.map(x=>cleanText(x,24)).filter(Boolean).slice(0,8):[]};
    if(!p.id)return send(res,400,JSON.stringify({error:'missing id'}),'application/json');
    const i=db.profiles.findIndex(x=>x.id===p.id); if(i>=0)db.profiles[i]={...db.profiles[i],...p}; else db.profiles.push(p); await writeSocial(db); return send(res,200,JSON.stringify({ok:true,profile:p}),'application/json');
  }
  if(path==='/api/social/post'){
    const author=cleanText(body.author,80),text=cleanText(body.text,500);if(!author||!text)return send(res,400,JSON.stringify({error:'missing fields'}),'application/json');
    const post={id:'p-'+id(),author,text,ts:Date.now(),likes:0,likedBy:[],notes:[]};db.posts.unshift(post);db.posts=db.posts.slice(0,200);await writeSocial(db);return send(res,200,JSON.stringify({ok:true,post}),'application/json');
  }
  if(path==='/api/social/like'){
    const post=db.posts.find(x=>x.id===body.postId),userId=cleanText(body.userId,80);if(!post||!userId)return send(res,404,JSON.stringify({error:'not found'}),'application/json');post.likedBy||=[];const has=post.likedBy.includes(userId);post.likedBy=has?post.likedBy.filter(x=>x!==userId):[...post.likedBy,userId];post.likes=post.likedBy.length;await writeSocial(db);return send(res,200,JSON.stringify({ok:true,likes:post.likes}),'application/json');
  }
  if(path==='/api/social/note'){
    const post=db.posts.find(x=>x.id===body.postId);if(!post)return send(res,404,JSON.stringify({error:'not found'}),'application/json');post.notes||=[];post.notes.push({id:'n-'+id(),author:cleanText(body.author,80),name:cleanText(body.name,40)||'someone',text:cleanText(body.text,240),ts:Date.now()});await writeSocial(db);return send(res,200,JSON.stringify({ok:true}),'application/json');
  }
  if(path==='/api/social/follow'){
    const from=cleanText(body.from,80),to=cleanText(body.to,80);if(!from||!to)return send(res,400,JSON.stringify({error:'missing fields'}),'application/json');db.follows=db.follows.filter(x=>!(x.from===from&&x.to===to));if(body.follow!==false)db.follows.push({from,to,ts:Date.now()});await writeSocial(db);return send(res,200,JSON.stringify({ok:true}),'application/json');
  }
  return send(res,404,JSON.stringify({error:'not found'}),'application/json');
}
function geminiConfig(){
  return {
    key: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-3.8-flash'
  };
}
function buildSystem(character={},world={}){
  return `You are roleplaying as ${character.name||'a fictional character'}. Stay in character.\nPersonality: ${character.personality||'natural, vivid, concise'}\nRelationship to user: ${character.relationship||'close'}\nSpeech style: ${character.style||'casual text messages'}\nWorld context: ${world.summary||'private everyday life'}\nRules: reply like a real person texting. Avoid assistant framing. Remember established facts from the conversation. Do not claim to perform real-world actions. Keep continuity with prior turns. Reply in the user's language unless the character would naturally switch.`;
}
async function callGemini({messages=[],character={},world={},model}){
  const {key,model:defaultModel}=geminiConfig();
  if(!key) throw Object.assign(new Error('GEMINI_API_KEY not configured'),{status:503});
  const selected=model||defaultModel;
  const contents=(messages||[]).slice(-32).map(m=>({
    role:m.role==='assistant'?'model':'user',
    parts:[{text:String(m.content??m.text??'')}]
  })).filter(x=>x.parts[0].text.trim());
  if(!contents.length) contents.push({role:'user',parts:[{text:'Hello'}]});
  const url=`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(selected)}:generateContent`;
  const r=await fetch(url,{method:'POST',headers:{'content-type':'application/json','x-goog-api-key':key},body:JSON.stringify({
    systemInstruction:{parts:[{text:buildSystem(character,world)}]},
    contents,
    generationConfig:{temperature:0.9,topP:0.95,maxOutputTokens:900}
  })});
  const raw=await r.text();
  let data={}; try{data=JSON.parse(raw)}catch{}
  if(!r.ok){
    const msg=data?.error?.message||raw||`Gemini HTTP ${r.status}`;
    throw Object.assign(new Error(msg),{status:r.status});
  }
  const content=(data?.candidates?.[0]?.content?.parts||[]).map(p=>p.text||'').join('').trim();
  if(!content) throw Object.assign(new Error('Gemini returned an empty response'),{status:502});
  return {content,model:selected};
}
async function proxyChat(req,res){
  try{
    const body=await parseJson(req);
    const out=await callGemini(body);
    return send(res,200,JSON.stringify({...out,provider:'gemini'}),'application/json');
  }catch(e){
    return send(res,e.status||500,JSON.stringify({error:String(e.message||e),provider:'gemini'}),'application/json');
  }
}
async function aiTest(req,res){
  try{
    const out=await callGemini({messages:[{role:'user',content:'Reply with exactly: connected'}],character:{name:'Thomas',personality:'calm private assistant',relationship:'private assistant',style:'very concise'},world:{summary:'Elsewhere connection test'}});
    return send(res,200,JSON.stringify({...out,provider:'gemini'}),'application/json');
  }catch(e){
    return send(res,e.status||500,JSON.stringify({error:String(e.message||e),provider:'gemini'}),'application/json');
  }
}
http.createServer(async(req,res)=>{
  const path=new URL(req.url,'http://localhost').pathname;
  if(req.method==='OPTIONS'){res.writeHead(204,{'access-control-allow-origin':'*','access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'content-type'});return res.end()}
  if(req.method==='GET'&&path==='/api/ai-status'){const c=geminiConfig();return send(res,200,JSON.stringify({provider:'gemini',configured:!!c.key,model:c.model}),'application/json')}
  if(req.method==='POST'&&path==='/api/ai-test') return aiTest(req,res);
  if(req.method==='POST'&&path==='/api/chat') return proxyChat(req,res);
  if(path.startsWith('/api/social/')) return socialApi(req,res,path);
  return serveStatic(req,res);
}).listen(PORT,()=>console.log(`Elsewhere running on http://localhost:${PORT}`));
