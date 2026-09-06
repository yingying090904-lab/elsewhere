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
async function proxyChat(req,res){
  try{
    const {messages=[],character={},world={},model}=await parseJson(req);
    const key=process.env.OPENAI_API_KEY;
    if(!key) return send(res,503,JSON.stringify({error:'OPENAI_API_KEY not configured'}),'application/json');
    const base=(process.env.OPENAI_BASE_URL||'https://api.openai.com/v1').replace(/\/$/,'');
    const selected=model||process.env.OPENAI_MODEL||'gpt-4.1-mini';
    const system=`You are roleplaying as ${character.name||'a fictional character'}. Stay in character.\nPersonality: ${character.personality||'natural, vivid, concise'}\nRelationship to user: ${character.relationship||'close'}\nSpeech style: ${character.style||'casual text messages'}\nWorld context: ${world.summary||'private everyday life'}\nRules: reply like a real person texting. Avoid assistant framing. Remember established facts from the conversation. Do not claim to perform real-world actions.`;
    const r=await fetch(base+'/chat/completions',{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+key},body:JSON.stringify({model:selected,messages:[{role:'system',content:system},...messages.slice(-24)],temperature:0.9})});
    const text=await r.text(); if(!r.ok) return send(res,r.status,text,'application/json'); const data=JSON.parse(text); send(res,200,JSON.stringify({content:data.choices?.[0]?.message?.content||'',model:selected}),'application/json');
  }catch(e){send(res,500,JSON.stringify({error:String(e.message||e)}),'application/json')}
}
http.createServer(async(req,res)=>{
  const path=new URL(req.url,'http://localhost').pathname;
  if(req.method==='OPTIONS'){res.writeHead(204,{'access-control-allow-origin':'*','access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'content-type'});return res.end()}
  if(req.method==='POST'&&path==='/api/chat') return proxyChat(req,res);
  if(path.startsWith('/api/social/')) return socialApi(req,res,path);
  return serveStatic(req,res);
}).listen(PORT,()=>console.log(`Elsewhere running on http://localhost:${PORT}`));
