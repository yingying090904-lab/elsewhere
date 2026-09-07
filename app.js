const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const KEY = 'elsewhere-state';
const LEGACY_KEYS = ['elsewhere-v242-state','elsewhere-v24-state','elsewhere-v23-state','elsewhere-v22-state','elsewhere-v21-state','elsewhere-v20-state'];
const VERSION = '3.0.1-polished-home';

const today = () => new Date().toISOString().slice(0,10);
const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const esc = (s='') => String(s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const fmtTime = (d=Date.now()) => new Date(d).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false});
const rel = ts => { const m=Math.max(0,Math.floor((Date.now()-ts)/60000)); if(m<1)return '刚刚'; if(m<60)return `${m} 分钟前`; const h=Math.floor(m/60); if(h<24)return `${h} 小时前`; return `${Math.floor(h/24)} 天前`; };
const clone = o => JSON.parse(JSON.stringify(o));

const themes = {
  blush:{name:'Blush Scrapbook',paper:'#fff7f8',ink:'#49363d',muted:'#9f7f89',accent:'#c96f8a',accent2:'#efb9c8',wall:'radial-gradient(circle at 78% 2%,rgba(255,255,255,.86),transparent 24%),radial-gradient(circle at 5% 30%,rgba(244,188,206,.35),transparent 29%),linear-gradient(145deg,#e9cbd4 0%,#f9e7eb 38%,#d8b8c3 100%)'},
  ribbon:{name:'Ribbon Milk',paper:'#fffaf8',ink:'#4b3b3e',muted:'#a18789',accent:'#b86c7d',accent2:'#f0c9cf',wall:'linear-gradient(155deg,#ead7d6,#fff4f0 46%,#e9cbd2)'},
  atelier:{name:'Rose Archive',paper:'#f8efec',ink:'#372d31',muted:'#92777f',accent:'#a6536b',accent2:'#dba4b4',wall:'radial-gradient(circle at 20% 8%,rgba(255,255,255,.95),transparent 24%),linear-gradient(155deg,#d9cbc7 0%,#f5eee8 44%,#e7cfd5 100%)'},
  noir:{name:'Nocturne Scrap',paper:'#1d1a1b',ink:'#f4ede8',muted:'#b7a9a4',accent:'#c27c93',accent2:'#7a6579',wall:'linear-gradient(160deg,#191617,#372d30 48%,#201c25 100%)'},
  olive:{name:'Old Garden',paper:'#f1eee2',ink:'#303328',muted:'#7a7c6c',accent:'#7f8060',accent2:'#b6a78c',wall:'linear-gradient(160deg,#c9c5ab,#ece5d0 55%,#d6c5bf)'},
  blue:{name:'Rain Letter',paper:'#edf0f1',ink:'#293038',muted:'#74808a',accent:'#687d91',accent2:'#a7bac7',wall:'linear-gradient(160deg,#c2cad1,#e9ecec 50%,#d9ced0)'}
};

const defaultState = {
  theme:'blush', locked:true, owner:{name:'Ann',handle:'ann',bio:'collecting little things from ordinary days.',status:'somewhere between busy and daydreaming.',avatar:'',banner:'',tags:['scrapbook','study']}, wallpaper:'',
  social:{userId:'u-'+uid(),following:[],feed:[],lastSync:0},
  custom:{title:'Elsewhere',subtitle:'此刻以外',tagline:'A SMALL PHONE, A BIGGER YOU',quote:'same sky, different dreams.',accent:'',paper:'',ink:'',radius:28,font:'serif',density:'cozy',iconShape:'soft',appOrder:[],hiddenApps:[],aliases:{},cardOpacity:88,blur:22,shadow:16,grain:24,spacing:18,appSize:58,dockOpacity:82,borderStrength:18,titleScale:100,wallpaperTint:14, iconStyle:'star', showHomeAvatar:true, clickEffect:'sparkle', effectStrength:2, compactApps:true, pageWallpapers:{}, folders:[], homeLayout:[], homeWidgets:[{id:'hw-thomas',type:'thomas',page:0,size:'4x2'},{id:'hw-clock',type:'clock',page:0,size:'2x1'},{id:'hw-weather',type:'weather',page:0,size:'2x1'},{id:'hw-todo',type:'todo',page:1,size:'2x1'},{id:'hw-study',type:'study',page:1,size:'2x1'}],homeLayoutRevision:'v28', homePageCount:2},
  weather:{city:'Elsewhere',temp:'29',desc:'大毛毛雨 · 微风',low:'26',high:'30',loading:false},
  characters:[
    {id:'victor',name:'Victor',initial:'V',relation:'close friend',status:'last seen just now',color:'#92727b',personality:'敏锐、克制、有点坏心眼，会记住细节。',style:'自然短句，偶尔很轻地调侃。'},
    {id:'ciel',name:'Ciel',initial:'C',relation:'best friend',status:'online',color:'#7f8590',personality:'热情、会吐槽、观察力强。',style:'像真实朋友，反应快，偶尔连续发几条。'}
  ],
  chats:{
    victor:[{id:uid(),role:'assistant',text:'在做什么？',ts:Date.now()-23*60000},{id:uid(),role:'assistant',text:'别太累了。记得喝水，休息一下。',ts:Date.now()-19*60000}],
    ciel:[{id:uid(),role:'assistant',text:'我发现一家新咖啡店。你下次必须和我去。',ts:Date.now()-80*60000}]
  },
  moments:[
    {id:uid(),who:'victor',text:'下了一整天的雨，但雨声也有一种让人平静的魔力。',ts:Date.now()-2*3600000,likes:21},
    {id:uid(),who:'ciel',text:'新的咖啡店！好喜欢这个角落。',ts:Date.now()-5*3600000,likes:14}
  ],
  todos:[
    {id:uid(),text:'完成作业',done:false},{id:uid(),text:'整理房间',done:false},{id:uid(),text:'阅读 30 分钟',done:false},{id:uid(),text:'喝够 2L 水',done:false},{id:uid(),text:'买生日礼物',done:true}
  ],
  habits:[
    {id:uid(),name:'喝水',detail:'1200 / 2000 ml',streak:3,done:false},{id:uid(),name:'早睡',detail:'目标 23:30 前',streak:5,done:false},{id:uid(),name:'运动',detail:'42 min today',streak:2,done:false},{id:uid(),name:'阅读',detail:'30 min today',streak:7,done:false}
  ],
  events:[
    {id:uid(),date:today(),time:'09:00',title:'早餐 & 早安'},{id:uid(),date:today(),time:'10:00',title:'书房 · 学习'},{id:uid(),date:today(),time:'19:00',title:'健身 · 腿部'},{id:uid(),date:today(),time:'22:00',title:'睡前阅读'}
  ],
  study:{seconds:25*60,running:false,lastTick:0,totalMinutes:0},
  food:[{id:uid(),meal:'早餐',name:'燕麦 + 水果 + 牛奶',kcal:320},{id:uid(),meal:'午餐',name:'鸡胸肉沙拉',kcal:450}],
  water:1200,
  fitness:[{id:uid(),name:'腿部训练',minutes:30,kcal:280}],
  finance:[{id:uid(),type:'expense',name:'咖啡',amount:18.5},{id:uid(),type:'expense',name:'交通',amount:12},{id:uid(),type:'income',name:'零用',amount:400}],
  notes:[{id:uid(),title:'一些话',text:'做一个更好的自己，也要记得给生活留一点空白。'}],
  diary:[{id:uid(),date:today(),text:'今天没有什么大事。只是突然觉得，普通的一天也可以被认真收藏。'}],
  photos:[],
  notifications:[{id:uid(),title:'Thomas',text:'下午好。今天还有 3 项待办没有完成。',ts:Date.now()-15*60000,read:false}],
  thomas:[{id:uid(),role:'assistant',text:'嗨，Ann。今天过得怎么样？如果有任何事情想聊、想记录，或者只是想发呆，我都在这里。',ts:Date.now()-1000}],
  memories:{victor:[{id:uid(),text:'Ann 不喜欢被催得太紧。',importance:3,ts:Date.now()-86400000}],ciel:[]},
  relationships:{victor:{score:68,label:'亲近',secrets:['其实会默默看你的朋友圈。']},ciel:{score:74,label:'挚友',secrets:['准备带你去一家没告诉你的咖啡店。']}},
  privateChats:[{id:uid(),a:'victor',b:'ciel',ts:Date.now()-3*3600000,messages:[{who:'ciel',text:'她最近是不是又熬夜？'},{who:'victor',text:'嗯。嘴上说没事。'}]}],
  worlds:[{id:'main',name:'Main World',createdAt:Date.now()}], activeWorld:'main',
  worldMeta:{lastPulse:Date.now()-2*3600000,auto:true,pulseMinutes:8},
  callLogs:[],
  widgets:[{id:'w-thomas',type:'thomas',x:18,y:230},{id:'w-note',type:'note',x:210,y:248}],
  moods:[{id:uid(),date:today(),value:4,note:'还不错'}],
  sleep:[{id:uid(),date:today(),hours:7.5,quality:4}],
  countdowns:[{id:uid(),title:'一个值得期待的日子',date:new Date(Date.now()+14*86400000).toISOString().slice(0,10)}],
  wishlist:[{id:uid(),text:'买一本喜欢很久的书',done:false}],
  bookmarks:[{id:uid(),title:'Elsewhere notes',url:'https://example.com'}],
  settings:{assistantName:'Thomas',useAI:true,passcode:'0000',thomasProfile:{warmth:72,sass:28,initiative:58,formality:30,verbosity:42,address:'Ann',base:'克制、体贴、聪明，有一点英式管家的从容，但不是客服。',learn:true},thomasLearned:[]}
};

function load(){
  try{
    const fresh=JSON.parse(localStorage.getItem(KEY)||'null');
    let legacy=null;
    if(!fresh){
      for(const k of LEGACY_KEYS){ try{ const v=JSON.parse(localStorage.getItem(k)||'null'); if(v){legacy=v;break;} }catch{} }
    }
    const saved=fresh||legacy;
    const out=saved?Object.assign(clone(defaultState),saved):clone(defaultState);
    if(legacy&&!fresh){ out.theme='blush'; out.custom=Object.assign(clone(defaultState.custom),out.custom||{}, {accent:'',paper:'',ink:''}); }
    out.settings=Object.assign(clone(defaultState.settings),out.settings||{});
    out.settings.thomasProfile=Object.assign(clone(defaultState.settings.thomasProfile),out.settings.thomasProfile||{});
    out.settings.thomasLearned ||= [];
    out.custom=Object.assign(clone(defaultState.custom),out.custom||{});
    delete out.custom.desktopEdit; delete out.custom.stickers;
    out.custom.pageWallpapers ||= {}; out.custom.folders ||= []; out.custom.homeLayout ||= []; out.custom.homeWidgets ||= clone(defaultState.custom.homeWidgets); out.custom.homeWidgets=out.custom.homeWidgets.map(w=>Object.assign({page:0,size:'2x1'},w));
    out.custom.homePageCount=Math.max(2,Number(out.custom.homePageCount)||2);
    // v2.8.1: static launcher. Flatten old folders so every app is visible again.
    if(out.custom.homeLayoutRevision!=='v281-static'){
      const folderMap=new Map((out.custom.folders||[]).map(f=>['folder:'+f.id,[...(f.apps||[])]]));
      const flat=[];
      for(const entry of (out.custom.homeLayout||[])){
        if(folderMap.has(entry)) flat.push(...folderMap.get(entry)); else flat.push(entry);
      }
      out.custom.homeLayout=[...new Set(flat.filter(x=>!String(x).startsWith('folder:')))];
      out.custom.folders=[];
      out.custom.homeLayoutRevision='v281-static';
    }
    // v2.6.2: rebalance the stock widgets across the first two pages once.
    // Custom widgets keep their page; only the five built-in starter widgets are migrated.
    if(!['v281-static'].includes(out.custom.homeLayoutRevision) && out.custom.homeLayoutRevision!=='v262'){
      const stockPages={
        'hw-clock':{page:0,size:'1x1'},
        'hw-todo':{page:0,size:'1x1'},
        'hw-thomas':{page:0,size:'2x1'},
        'hw-weather':{page:1,size:'2x1'},
        'hw-study':{page:1,size:'2x1'}
      };
      out.custom.homeWidgets.forEach(w=>{const v=stockPages[w.id];if(v){w.page=v.page;w.size=v.size;}});
      if(out.custom.homeLayoutRevision!=='v281-static') out.custom.homeLayoutRevision='v262';
    }
    if(!fresh){
      const defaults=new Map([['hw-clock','1x1'],['hw-todo','1x1'],['hw-thomas','2x1'],['hw-weather','2x1'],['hw-study','2x1']]);
      out.custom.homeWidgets.forEach(w=>{ if(defaults.has(w.id)) w.size=defaults.get(w.id); });
      const rank=['hw-clock','hw-todo','hw-thomas','hw-weather','hw-study'];
      out.custom.homeWidgets.sort((a,b)=>{const ai=rank.indexOf(a.id),bi=rank.indexOf(b.id);return (ai<0?99:ai)-(bi<0?99:bi)});
    }
    out.owner=Object.assign(clone(defaultState.owner),out.owner||{});
    out.social=Object.assign(clone(defaultState.social),out.social||{});
    out.social.following ||= []; out.social.feed ||= []; out.social.profiles ||= [];
    if(!fresh) out.custom.iconStyle='none';
    ['moods','sleep','countdowns','wishlist','bookmarks'].forEach(k=>out[k] ||= clone(defaultState[k]));
    return out;
  }catch{return clone(defaultState)}
}
let S=load(), current='home', currentArg=null, timer=null, todoTab='todo', homePage=0, homeEdit=false, dragState=null, shadeOpen=false, calendarOffset=0, lockStage='welcome', passcodeBuffer='';
S.locked=true;
// v2.8 one-time launcher reset: only reposition the five stock widgets; keep user widgets/apps/folders intact.
if(!S.custom.v28HomeReset){
  const stock={
    'hw-thomas':{page:0,size:'4x2'},
    'hw-clock':{page:0,size:'2x1'},
    'hw-weather':{page:0,size:'2x1'},
    'hw-todo':{page:1,size:'2x1'},
    'hw-study':{page:1,size:'2x1'}
  };
  (S.custom.homeWidgets||[]).forEach(w=>{const v=stock[w.id];if(v){w.page=v.page;w.size=v.size;}});
  S.custom.homePageCount=Math.max(2,Number(S.custom.homePageCount)||2);
  S.custom.v28HomeReset=true;
  save();
}
// v3.0: normalize the reference layout once. Keep user-created widgets, but place the stock set deliberately.
if(!S.custom.v30ReferenceLayout){
  const stock={
    'hw-thomas':{page:0,size:'4x2'},
    'hw-clock':{page:0,size:'2x1'},
    'hw-weather':{page:0,size:'2x1'},
    'hw-todo':{page:1,size:'2x1'},
    'hw-study':{page:1,size:'2x1'}
  };
  (S.custom.homeWidgets||[]).forEach(w=>{const v=stock[w.id];if(v){w.page=v.page;w.size=v.size;}});
  if(!(S.custom.homeWidgets||[]).some(w=>w.type==='profile')) S.custom.homeWidgets.push({id:'hw-profile',type:'profile',page:1,size:'4x2'});
  else { const pw=(S.custom.homeWidgets||[]).find(w=>w.type==='profile'); if(pw){pw.page=1;pw.size='4x2';} }
  S.custom.homePageCount=Math.max(2,Number(S.custom.homePageCount)||2);
  S.custom.v30ReferenceLayout=true;
  save();
}
function save(){ try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){console.warn('Elsewhere save failed',e);} }
window.addEventListener('pagehide',save); window.addEventListener('beforeunload',save); document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')save()});
function ch(id){ return S.characters.find(x=>x.id===id); }
function avatar(c,cls=''){ c=c||{name:S?.settings?.assistantName||'Thomas',initial:'T',color:'#9c7881'}; return `<div class="avatar ${cls}" style="--av:${c.color||'#9c7881'}">${esc(c.initial||c.name?.[0]||'?')}</div>`; }
function applyTheme(){
  const t=themes[S.theme]||themes.blush; for(const [k,v] of Object.entries(t)) document.documentElement.style.setProperty('--'+k,v);
  const c=S.custom||{}; if(c.accent)document.documentElement.style.setProperty('--accent',c.accent); if(c.paper)document.documentElement.style.setProperty('--paper',c.paper); if(c.ink)document.documentElement.style.setProperty('--ink',c.ink);
  const vars={radius:(c.radius||24)+'px',cardOpacity:(c.cardOpacity??82)/100,glassBlur:(c.blur??18)+'px',shadowSize:(c.shadow??18)+'px',grainOpacity:(c.grain??42)/1000,gridGap:(c.spacing??12)+'px',appSize:(c.appSize??58)+'px',dockOpacity:(c.dockOpacity??74)/100,borderAlpha:(c.borderStrength??22)/100,titleScale:(c.titleScale??100)/100,wallpaperTint:(c.wallpaperTint??20)/100};
  Object.entries(vars).forEach(([k,v])=>document.documentElement.style.setProperty('--'+k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()),v));
  document.documentElement.dataset.font=c.font||'serif'; document.documentElement.dataset.density=c.density||'cozy'; document.documentElement.dataset.iconshape=c.iconShape||'soft';
  const tint=`linear-gradient(rgba(255,239,244,var(--wallpaper-tint)),rgba(255,239,244,var(--wallpaper-tint)))`;
  document.documentElement.style.setProperty('--wallpaper',S.wallpaper?`${tint},url('${S.wallpaper}') center/cover`:t.wall);
}
function persistRender(){save();render();}

const apps = [
  ['thomas','','Thomas'],['messages','','消息'],['moments','','朋友圈'],['photos','','相册'],
  ['todo','','待办'],['calendar','','日历'],['study','','书房'],['food','','饮食'],
  ['fitness','','健身'],['weather','','天气'],['finance','','记账'],['habits','','习惯'],
  ['notes','','笔记'],['diary','','日记'],['mood','','心情'],['sleep','','睡眠'],
  ['countdown','','倒数日'],['wishlist','','愿望清单'],['bookmarks','','收藏'],
  ['contacts','','角色'],['world','','世界'],['social','','社交'],['profile','','我'],['customize','','装扮'],['settings','','更多']
];

const tumblrAssets={
  messages:'/assets/tumblr/pink-reminder.png', moments:'/assets/tumblr/rose-windows.jpg', photos:'/assets/tumblr/dino-keychain.png',
  todo:'/assets/tumblr/rilakkuma-clip.png', calendar:'/assets/tumblr/starfish.png', study:'/assets/tumblr/piano-bow.png', food:'/assets/tumblr/toast.png',
  fitness:'/assets/tumblr/music-bow.png', weather:'/assets/tumblr/color-stars.png', finance:'/assets/tumblr/chocolate.png', habits:'/assets/tumblr/miffy.png',
  notes:'/assets/tumblr/rose-windows.jpg', diary:'/assets/tumblr/bear.png', mood:'/assets/tumblr/orange-flower.png', sleep:'/assets/tumblr/lace-flower.png',
  countdown:'/assets/tumblr/gold-stars.png', wishlist:'/assets/tumblr/bunny-figurine.png', bookmarks:'/assets/tumblr/sculpture-eye.jpg',
  contacts:'/assets/tumblr/bear.png', world:'/assets/tumblr/gold-stars.png', customize:'/assets/tumblr/lace-flower.png', settings:'/assets/tumblr/green-phone.png',
  thomas:'/assets/tumblr/dino-keychain.png'
};
const stickerCatalog=[
  ['gold-stars','gold stars'],['green-phone','green phone'],['chocolate','chocolate'],['pocky','pocky'],['bear','teddy'],['toast','toast'],['piano-bow','piano bow'],['music-bow','music bow'],['dino-keychain','dinosaur'],['rilakkuma-clip','bear clip'],['lace-flower','lace flower'],['bunny-figurine','bunny'],['starfish','starfish'],['miffy','miffy'],['orange-flower','orange flower'],['color-stars','color stars']
];

function status(){return `<div class="status"><b id="statusTime">${fmtTime()}</b><span>5G <i class="battery"><em></em></i></span></div>`}
function render(){
  applyTheme();
  const app=$('#app');
  app.innerHTML=`<div class="shell"><div class="phone">${S.locked?lockScreen():screen()}</div><aside class="desk-note"><div class="brand-script">Elsewhere</div><p>此刻以外 · a small phone, a bigger you.</p><small>v${VERSION} · scrapbook utility phone</small></aside></div><input id="photoPicker" type="file" accept="image/*" hidden>`;
  bind();
}
function notificationShade(){
  const unread=S.notifications.filter(n=>!n.read).length;
  return `<aside class="notification-shade ${shadeOpen?'open':''}" id="notificationShade"><div class="shade-grabber"></div><header><div><small>ELSEWHERE</small><h2>通知中心</h2></div><button data-shade-close>完成</button></header><div class="shade-summary"><span>${unread} unread</span><button data-notif-read>全部已读</button></div><div class="shade-list">${S.notifications.length?S.notifications.slice(0,12).map(n=>`<button class="shade-notif ${n.read?'read':''}" data-open="thomas"><small>${esc(n.title||'Elsewhere')} · ${rel(n.ts||Date.now())}</small><b>${esc(n.text||'')}</b></button>`).join(''):'<div class="shade-empty">没有新的通知。</div>'}</div><button class="shade-clear" data-notif-clear>清空通知</button></aside>`;
}
function lockScreen(){
  const d=new Date(), due=S.todos.filter(x=>!x.done).length;
  const dots='<span></span>'.repeat(4);
  if(lockStage==='passcode'){
    return `<section class="lockscreen phone-lock passcode-lock">
      <div class="lock-editorial"><small>ELSEWHERE · PRIVATE PHONE</small><i></i></div>
      <div class="passcode-time">${fmtTime()}</div>
      <div class="passcode-panel">
        <small>ENTER PASSCODE</small><h2>欢迎回来，${esc(S.owner.name||'Ann')}</h2>
        <div class="passcode-dots" data-passcode-dots>${dots}</div>
        <div class="passcode-keypad">
          ${[1,2,3,4,5,6,7,8,9].map(n=>`<button data-passcode-key="${n}">${n}</button>`).join('')}
          <button class="passcode-blank" aria-hidden="true"></button><button data-passcode-key="0">0</button><button data-passcode-delete>⌫</button>
        </div>
        <button class="passcode-back" data-passcode-back>‹ 返回</button>
      </div>${notificationShade()}</section>`;
  }
  return `<section class="lockscreen phone-lock welcome-lock">
    <div class="lock-editorial"><small>ELSEWHERE · PRIVATE PHONE</small><i></i></div>
    <div class="welcome-date">${d.toLocaleDateString('en-GB',{weekday:'long',day:'2-digit',month:'long'}).toUpperCase()}</div>
    <div class="welcome-time">${fmtTime()}</div>
    <div class="welcome-wordmark"><small>${esc(S.custom.tagline||'A SMALL PHONE, A BIGGER YOU')}</small><h1>${esc(S.custom.title||'Elsewhere')}</h1><p>${esc(S.custom.subtitle||'此刻以外')}</p></div>
    <div class="welcome-glance"><span><small>TODAY</small><b>${due}</b><em>things left</em></span><span><small>WEATHER</small><b>${esc(S.weather.temp)}°</b><em>${esc(S.weather.city)}</em></span></div>
    <p class="welcome-quote">${esc(S.custom.quote||'same sky, different dreams.')}</p>
    <button class="unlock-btn" data-passcode-open><i></i><span>向上滑动</span></button>${notificationShade()}</section>`;
}
function screen(){
  const body=current==='home'?home():`<section class="view app-view">${view(current,currentArg)}<button class="home-handle" data-home aria-label="返回主页"><span></span></button></section>`;
  return `${body}${notificationShade()}`;
}
function header(title,sub='',right=''){return `<header class="page-head"><button data-home>‹</button><div><h1>${esc(title)}</h1>${sub?`<small>${esc(sub)}</small>`:''}</div><span class="head-rule"></span>${right}</header>`}
function icon(k,g,l){
  const a=S.custom?.aliases?.[k]||{};
  const label=a.label||l;
  const custom=a.src;
  const sub=({thomas:'assistant',messages:'messages',moments:'moments',photos:'archive',todo:'to do',calendar:'calendar',study:'study room',food:'food log',fitness:'fitness',weather:'weather',finance:'finance',habits:'habits',notes:'notes',diary:'diary',mood:'mood',sleep:'sleep',countdown:'countdown',wishlist:'wishlist',bookmarks:'saved',contacts:'characters',world:'worlds',social:'community',profile:'profile',customize:'customise',settings:'settings'})[k]||'app';
  return `<button class="app-icon tumblr-app ${custom?'has-custom-icon':''}" data-open="${k}" data-app-key="${k}"><span class="app-visual">${custom?`<img src="${esc(custom)}" alt="">`:'<span class="default-star">★</span>'}</span><span class="app-copy"><b>${esc(label)}</b><small>${esc(sub)}</small></span></button>`;
}

function ensureHomeLayout(){
  const known=orderedApps().map(a=>a[0]);
  const knownSet=new Set(known);
  S.custom.folders=(S.custom.folders||[]).map(f=>({...f,apps:[...new Set((f.apps||[]).filter(k=>knownSet.has(k)))]}));
  const validFolderIds=new Set(S.custom.folders.map(f=>f.id));
  let layout=(S.custom.homeLayout||[]).filter(x=>knownSet.has(x)||(String(x).startsWith('folder:')&&validFolderIds.has(String(x).slice(7))));
  const inFolders=new Set(S.custom.folders.flatMap(f=>f.apps||[]));
  for(const k of known) if(!layout.includes(k)&&!inFolders.has(k)) layout.push(k);
  // remove duplicate app/folder entries so nothing can disappear behind a stale layout row
  layout=[...new Set(layout)];
  S.custom.homeLayout=layout; return layout;
}
function folderById(id){return (S.custom.folders||[]).find(f=>f.id===id)}
function folderIcon(f){
  const previews=(f.apps||[]).slice(0,4).map(k=>{const a=S.custom.aliases?.[k]||{};return a.src?`<img src="${esc(a.src)}">`:'<i>★</i>'}).join('');
  return `<button class="app-icon tumblr-app folder-icon" data-folder-open="${esc(f.id)}" data-folder-key="${esc(f.id)}"><span class="app-visual folder-visual">${previews||'<i>★</i><i>★</i>'}</span><span class="app-copy"><b>${esc(f.name||'文件夹')}</b><small>${(f.apps||[]).length} apps</small></span></button>`;
}
function homeEntry(entry){
  const handle=homeEdit?`<span class="home-drag-handle app-drag-handle" data-app-drag-handle aria-label="拖动 App"><i></i><i></i><i></i><i></i></span>`:'';
  if(String(entry).startsWith('folder:')){const f=folderById(String(entry).slice(7));if(!f)return '';return folderIcon(f).replace('</button>',`${handle}</button>`)}
  const a=apps.find(x=>x[0]===entry); if(!a)return '';
  return icon(...a).replace('</button>',`${handle}</button>`);
}
function pageWallpaperStyle(i){const w=S.custom.pageWallpapers?.[i];return w?`style="--page-wallpaper:url('${esc(w)}')"`:''}
const HOME_WIDGET_TYPES = {
  clock:'Clock', thomas:'Thomas', weather:'Weather', todo:'Todo', study:'Study', calendar:'Calendar', profile:'Profile', note:'Note', countdown:'Countdown', mood:'Mood', quote:'Quote', custom:'Custom text'
};
function homeWidgetHtml(w){
  const due=S.todos.filter(x=>!x.done).length;
  const note=S.notes[0], cd=(S.countdowns||[])[0], mood=(S.moods||[])[0];
  const common=`data-home-widget-id="${esc(w.id)}" data-widget-type="${esc(w.type)}" data-widget-page="${Number(w.page)||0}" data-widget-size="${esc(w.size||'2x1')}"`;
  const controls=homeEdit?`<div class="widget-edit-controls"><button type="button" class="widget-drag-handle" data-widget-drag-handle aria-label="拖动组件"><i></i><i></i><i></i><i></i></button><button type="button" class="widget-more-button" data-widget-config="${esc(w.id)}" aria-label="组件设置">•••</button></div>`:'';
  const frame=(cls,body,open='')=>`<article class="home-widget ${cls}" ${common} ${open?`data-open="${open}" role="button" tabindex="0"`:''}>${body}${controls}</article>`;
  if(w.type==='clock') return frame('hw-clock',`<small>NOW</small><b>${fmtTime()}</b><span>${new Date().toLocaleDateString('zh-CN',{month:'numeric',day:'numeric'})}</span>`);
  if(w.type==='thomas') return frame('hw-thomas',`<small>THOMAS</small><b>${esc(S.settings.assistantName)}</b><span>${esc((S.notifications?.[0]?.text||'I am here.').slice(0,42))}</span>`,'thomas');
  if(w.type==='weather') return frame('hw-weather',`<small>WEATHER</small><b>${esc(S.weather.temp)}°</b><span>${esc(S.weather.city)} · ${esc(S.weather.desc)}</span>`,'weather');
  if(w.type==='todo') return frame('hw-todo',`<small>TODAY</small><b>${due}</b><span>${due?'things left':'all clear'}</span>`,'todo');
  if(w.type==='study') return frame('hw-study',`<small>STUDY</small><b>${Math.floor(S.study.seconds/60)} min</b><span>${S.study.running?'focus running':'ready when you are'}</span>`,'study');
  if(w.type==='calendar') return frame('hw-calendar',`<small>CALENDAR</small><b>${new Date().getDate()}</b><span>${S.events.filter(e=>e.date===today()).length} events today</span>`,'calendar');
  if(w.type==='profile') return frame('hw-profile',`${S.owner.avatar?`<img src="${esc(S.owner.avatar)}" alt="">`:`<i>${esc((S.owner.name||'E')[0])}</i>`}<div><small>PROFILE</small><b>${esc(S.owner.name||'Elsewhere user')}</b><span>@${esc(S.owner.handle||'elsewhere')}</span></div>`,'profile');
  if(w.type==='note') return frame('hw-note',`<small>PINNED NOTE</small><b>${esc(note?.title||'untitled')}</b><span>${esc((note?.text||'Write something small.').slice(0,48))}</span>`,'notes');
  if(w.type==='countdown') return frame('hw-countdown',`<small>COUNTDOWN</small><b>${cd?Math.max(0,Math.ceil((new Date(cd.date)-new Date())/86400000)):'—'}</b><span>${esc(cd?.title||'nothing counting down')}</span>`,'countdown');
  if(w.type==='mood') return frame('hw-mood',`<small>MOOD</small><b>${mood?'★'.repeat(Math.max(1,Math.min(5,mood.value))):'—'}</b><span>${esc(mood?.note||'how are you feeling?')}</span>`,'mood');
  if(w.type==='quote') return frame('hw-quote',`<small>ELSEWHERE</small><b>“${esc(S.custom.quote||'same sky, different dreams.')}”</b>`);
  if(w.type==='custom') return frame('hw-custom',`<small>${esc(w.title||'LITTLE NOTE')}</small><b>${esc(w.text||'something of your own')}</b>`);
  return '';
}

function pageWidgets(page){ return (S.custom.homeWidgets||[]).filter(w=>(Number(w.page)||0)===Number(page)); }
function homeWidgetsHtml(page=0){ return pageWidgets(page).map(homeWidgetHtml).join(''); }
function widgetManagerHtml(page='all'){
  const all=(S.custom.homeWidgets||[]);
  const current=page==='all'?all:all.filter(w=>(Number(w.page)||0)===Number(page));
  const pageOptions=[0,1,2,3,4].map(i=>`<option value="${i}" ${String(page)===String(i)?'selected':''}>${i===0?'Today':`Page ${i}`}</option>`).join('');
  return `<section class="widget-manager"><div class="widget-manager-toolbar"><label>显示页面<select data-widget-manager-page><option value="all" ${page==='all'?'selected':''}>全部页面</option>${pageOptions}</select></label><button data-widget-library-open>＋ Add Widget</button></div><div class="widget-current">${current.map((w,i)=>`<div><span><b>${esc(HOME_WIDGET_TYPES[w.type]||w.type)}</b><small>${w.type==='custom'?esc(w.title||'custom text'):`${(Number(w.page)||0)===0?'Today':`Page ${Number(w.page)||0}`} · ${esc(w.size||'2x1')}`}</small></span><button data-widget-edit="${esc(w.id)}">编辑</button><button class="widget-manager-remove" data-widget-remove="${esc(w.id)}">移除</button></div>`).join('')||'<p>No widgets on this page yet.</p>'}</div></section>`;
}
function widgetLibrarySheet(page=homePage){
  const wrap=document.createElement('div'); wrap.className='ew-modal-wrap widget-library-sheet';
  wrap.innerHTML=`<div class="ew-modal-scrim" data-widget-sheet-close></div><section class="ew-dialog ew-sheet"><div class="sheet-handle"></div><div class="sheet-title"><div><small>HOME SCREEN</small><h3>Add Widget</h3><p>${page===0?'Today':`Page ${page}`}</p></div><button data-widget-sheet-close>×</button></div><div class="widget-library">${Object.entries(HOME_WIDGET_TYPES).map(([type,name])=>`<button data-widget-add="${type}" data-widget-target-page="${page}"><span>＋</span><b>${esc(name)}</b></button>`).join('')}</div></section>`;
  uiLayer().appendChild(wrap); requestAnimationFrame(()=>wrap.classList.add('show'));
  wrap.querySelectorAll('[data-widget-sheet-close]').forEach(x=>x.onclick=()=>{wrap.classList.remove('show');setTimeout(()=>wrap.remove(),140)});
  bindWidgetControls(wrap);
}
async function editWidgetSheet(id){
  const w=(S.custom.homeWidgets||[]).find(x=>x.id===id); if(!w)return;
  const values=await uiForm({
    title:'Edit Widget',
    subtitle:'一次改完，不会再一个字段一个字段弹。',
    confirmText:'保存',
    fields:[
      {name:'page',label:'页面',type:'select',value:String(Number(w.page)||0),options:[['0','Today'],['1','Page 1'],['2','Page 2'],['3','Page 3'],['4','Page 4']]},
      {name:'size',label:'尺寸',type:'select',value:w.size||'2x1',options:[['1x1','Small · 1×1'],['2x1','Wide · 2×1'],['2x2','Medium · 2×2'],['4x2','Large · 4×2']]},
      ...(w.type==='custom'?[{name:'title',label:'标题',value:w.title||'little note'},{name:'text',label:'内容',multiline:true,value:w.text||''}]:[])
    ]
  });
  if(!values)return;
  w.page=Number(values.page)||0; w.size=values.size||'2x1';
  if(w.type==='custom'){w.title=values.title||'little note';w.text=values.text||''}
  save(); render(); uiToast('Widget 已更新');
}
function bindWidgetControls(root=document){
  $$('[data-widget-add]',root).forEach(x=>x.onclick=async()=>{
    const type=x.dataset.widgetAdd; const page=Number(x.dataset.widgetTargetPage ?? homePage)||0;
    const w={id:'hw-'+uid(),type,page,size:'2x1'};
    if(type==='custom'){
      const values=await uiForm({title:'Custom Widget',subtitle:'标题和内容在同一张编辑卡里。',fields:[
        {name:'title',label:'标题',value:'little note',placeholder:'例如：this week'},
        {name:'text',label:'内容',multiline:true,value:'',placeholder:'写一点想放在主页上的内容…'},
        {name:'size',label:'尺寸',type:'select',value:'2x1',options:[['1x1','Small · 1×1'],['2x1','Wide · 2×1'],['2x2','Medium · 2×2'],['4x2','Large · 4×2']]}
      ]});
      if(!values)return; w.title=values.title||'little note';w.text=values.text||'';w.size=values.size||'2x1';
    }
    S.custom.homeWidgets ||= []; S.custom.homeWidgets.push(w); save(); uiLayer().querySelector('.widget-library-sheet')?.remove(); render(); uiToast(`Widget 已加入 ${page===0?'Today':`Page ${page}`}`);
  });
  $$('[data-widget-remove]',root).forEach(x=>x.onclick=()=>{S.custom.homeWidgets=(S.custom.homeWidgets||[]).filter(w=>w.id!==x.dataset.widgetRemove);save();render()});
  $$('[data-widget-edit]',root).forEach(x=>x.onclick=()=>editWidgetSheet(x.dataset.widgetEdit));
  $('[data-widget-library-open]',root)?.addEventListener('click',()=>widgetLibrarySheet(homePage));
  $('[data-widget-manager-page]',root)?.addEventListener('change',e=>{const v=e.target.value; const old=root.querySelector('.widget-manager'); if(old){old.replaceWith(htmlToElement(widgetManagerHtml(v))); bindWidgetControls(root);}});
}
function chooseImageFile(onData){
  const input=document.createElement('input'); input.type='file'; input.accept='image/*';
  input.onchange=()=>{const f=input.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>onData(r.result);r.readAsDataURL(f)};
  input.click();
}
function wallpaperStudio(page=homePage){
  const wrap=document.createElement('div');wrap.className='ew-modal-wrap wallpaper-studio-wrap';
  const hasPage=!!S.custom.pageWallpapers?.[page], hasGlobal=!!S.wallpaper;
  wrap.innerHTML=`<div class="ew-modal-scrim" data-wallpaper-close></div><section class="ew-dialog ew-sheet wallpaper-studio"><div class="sheet-handle"></div><div class="sheet-title"><div><small>HOME STUDIO</small><h3>Wallpaper</h3><p>${page===0?'Home 01':`Home ${String(page+1).padStart(2,'0')}`}</p></div><button data-wallpaper-close>×</button></div><div class="wallpaper-actions"><button data-wallpaper-page><b>这一页</b><span>只更换当前主页壁纸</span></button><button data-wallpaper-global><b>所有页面</b><span>更换 Elsewhere 默认壁纸</span></button><button data-wallpaper-clear-page ${hasPage?'':'disabled'}><b>清除本页壁纸</b><span>恢复默认背景</span></button><button data-wallpaper-clear-all ${hasPage||hasGlobal?'':'disabled'}><b>恢复主题背景</b><span>清除所有自定义壁纸</span></button></div></section>`;
  uiLayer().appendChild(wrap);requestAnimationFrame(()=>wrap.classList.add('show'));
  const close=()=>{wrap.classList.remove('show');setTimeout(()=>wrap.remove(),140)};
  wrap.querySelectorAll('[data-wallpaper-close]').forEach(x=>x.onclick=close);
  $('[data-wallpaper-page]',wrap)?.addEventListener('click',()=>chooseImageFile(data=>{S.custom.pageWallpapers[page]=data;save();close();render();uiToast('已更换这一页的壁纸')}));
  $('[data-wallpaper-global]',wrap)?.addEventListener('click',()=>chooseImageFile(data=>{S.wallpaper=data;save();applyTheme();close();render();uiToast('默认壁纸已更新')}));
  $('[data-wallpaper-clear-page]',wrap)?.addEventListener('click',()=>{delete S.custom.pageWallpapers[page];save();close();render();uiToast('本页壁纸已清除')});
  $('[data-wallpaper-clear-all]',wrap)?.addEventListener('click',()=>{S.wallpaper='';S.custom.pageWallpapers={};save();applyTheme();close();render();uiToast('已恢复主题背景')});
}
function homeEditPaletteHtml(){
  return `<div class="home-edit-palette"><button data-home-add-page><span>＋</span><b>增加页面</b></button><button data-widget-library-open><span>▦</span><b>添加组件</b></button><button data-home-wallpaper><span>◫</span><b>更换壁纸</b></button><button data-folder-new><span>⊞</span><b>新建文件夹</b></button></div>`;
}

function homeStudioSheet(page=homePage){
  const wrap=document.createElement('div'); wrap.className='ew-modal-wrap home-studio-static-wrap';
  const canRemovePage=(Number(S.custom.homePageCount)||2)>2 && page>1 && !pageWidgets(page).length;
  wrap.innerHTML=`<div class="ew-modal-scrim" data-home-studio-close></div><section class="ew-dialog ew-sheet home-studio-static"><div class="sheet-handle"></div><div class="sheet-title"><div><small>HOME STUDIO</small><h3>主页</h3><p>移动、组件与壁纸集中在这里，不让正常点击和编辑互相打架。</p></div><button data-home-studio-close aria-label="关闭">×</button></div><div class="static-home-actions home-studio-actions"><button data-static-rearrange><b>整理主页</b><span>只从四点把手拖动；其余区域不会启动移动</span></button><button data-static-add-widget><b>添加 Widget</b><span>选择类型、尺寸与页面</span></button><button data-static-wallpaper><b>壁纸与主题</b><span>只换这一页，或应用到全部页面</span></button><button data-static-add-page><b>增加页面</b><span>新增一页干净的 Home</span></button>${canRemovePage?'<button data-static-remove-page><b>删除当前空页面</b><span>只会删除没有 Widget 的最后扩展页面</span></button>':''}<button data-static-reset-home><b>整理成推荐排版</b><span>恢复两页基础布局，不删除你的资料</span></button></div><div class="studio-divider"><span>WIDGETS</span></div>${widgetManagerHtml('all')}</section>`;
  uiLayer().appendChild(wrap); requestAnimationFrame(()=>wrap.classList.add('show'));
  const close=()=>{wrap.classList.remove('show');setTimeout(()=>wrap.remove(),140)};
  wrap.querySelectorAll('[data-home-studio-close]').forEach(x=>x.onclick=close);
  $('[data-static-rearrange]',wrap)?.addEventListener('click',()=>{close();setTimeout(()=>{homeEdit=true;render();uiToast('整理模式已开启 · 按住四点把手移动')},150)});
  $('[data-static-add-widget]',wrap)?.addEventListener('click',()=>widgetLibrarySheet(page));
  $('[data-static-wallpaper]',wrap)?.addEventListener('click',()=>wallpaperStudio(page));
  $('[data-static-add-page]',wrap)?.addEventListener('click',()=>{S.custom.homePageCount=Math.max(2,Number(S.custom.homePageCount)||2)+1;save();close();render();uiToast('已增加一个主页')});
  $('[data-static-remove-page]',wrap)?.addEventListener('click',async()=>{const ok=await uiConfirm({title:'删除这一页？',message:'这一页没有 Widget。删除后 App 会自动回到前面的页面。',confirmText:'删除',cancelText:'取消',danger:true});if(!ok)return;S.custom.homePageCount=Math.max(2,(Number(S.custom.homePageCount)||2)-1);homePage=Math.min(homePage,S.custom.homePageCount-1);save();close();render();});
  $('[data-static-reset-home]',wrap)?.addEventListener('click',async()=>{const ok=await uiConfirm({title:'恢复推荐排版？',message:'会重新排列主页 App 与内置 Widget，但不会删除聊天、角色、日记或其他资料。',confirmText:'恢复排版',cancelText:'取消'});if(!ok)return;S.custom.homeLayout=orderedApps().map(a=>a[0]);S.custom.homePageCount=2;const stock={'hw-thomas':{page:0,size:'4x2'},'hw-clock':{page:0,size:'2x1'},'hw-weather':{page:0,size:'2x1'},'hw-todo':{page:1,size:'2x1'},'hw-study':{page:1,size:'2x1'},'hw-profile':{page:1,size:'4x2'}};(S.custom.homeWidgets||[]).forEach(w=>{if(stock[w.id])Object.assign(w,stock[w.id])});save();close();render();uiToast('推荐排版已恢复')});
  bindWidgetControls(wrap);
}

function htmlToElement(html){const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild}

function home(){
  const now=new Date();
  const day=now.toLocaleDateString('en-GB',{weekday:'short',day:'2-digit',month:'short'}).toUpperCase();
  const layout=ensureHomeLayout().filter(k=>String(k).startsWith('folder:')||!S.custom.hiddenApps.includes(k));
  const pageSize=8;
  const appPages=[];
  for(let i=0;i<layout.length;i+=pageSize) appPages.push(layout.slice(i,i+pageSize));
  const minPages=Math.max(2,Number(S.custom.homePageCount)||2);
  const widgetMax=Math.max(0,...(S.custom.homeWidgets||[]).map(w=>Number(w.page)||0));
  const totalPages=Math.max(minPages,appPages.length,widgetMax+1);
  while(appPages.length<totalPages) appPages.push([]);

  const widgetZone=pi=>`<section class="home-widget-grid concept-widget-grid" data-widget-zone="${pi}">${homeWidgetsHtml(pi)}</section>`;
  const appGrid=(items)=>`<section class="concept-apps"><div class="phone-app-grid classic-app-grid concept-app-grid">${items.map(homeEntry).join('')}</div></section>`;
  const editTop=homeEdit?`<button class="home-done concept-done" data-home-edit-done>完成</button>`:'';
  const pageHead=(pi,title,eyebrow)=>`<header class="concept-home-head ${pi===0?'is-first':'is-later'}"><div><small>${pi===0?day:`HOME ${String(pi+1).padStart(2,'0')}`}</small><h2>${pi===0?esc(title):esc(eyebrow)}</h2></div><div class="concept-home-actions"><button class="home-plus" data-home-edit-open aria-label="编辑主页">＋</button>${editTop}</div></header>`;
  const pageShell=(pi,inner)=>`<section class="home-page concept-home-page ${pi===0?'concept-home-one':'concept-home-other'}" data-app-page="${pi}" ${pageWallpaperStyle(pi)}>${inner}</section>`;

  const first=pageShell(0,`
    ${pageHead(0,'Elsewhere','A SMALL PHONE, A BIGGER YOU')}
    <div class="concept-subline"><span>${esc(S.custom.subtitle||'此刻以外')}</span><em>${esc(S.custom.quote||'same sky, different dreams.')}</em></div>
    ${widgetZone(0)}
    ${appGrid(appPages[0])}`);

  const others=appPages.slice(1).map((items,i)=>{
    const pi=i+1;
    const title=`HOME ${String(pi+1).padStart(2,'0')}`;
    const eyebrow=pi===1?'WIDGETS & APPS':'YOUR LITTLE ROOMS';
    return pageShell(pi,`
      ${pageHead(pi,title,eyebrow)}
      ${widgetZone(pi)}
      ${appGrid(items)}
      ${!items.length&&!pageWidgets(pi).length?'<div class="concept-empty">这一页还是空的。点右上角 ＋ 添加 Widget。</div>':''}`)
  }).join('');

  const editShelf=homeEdit?`<aside class="home-edit-shelf"><div class="home-edit-status"><span>整理主页</span><small>按住四点把手移动</small></div><div class="home-edit-tools"><button data-widget-library-page="${homePage}"><b>＋</b><span>组件</span></button><button data-page-wallpaper><b>▧</b><span>壁纸</span></button><button data-home-add-page><b>□</b><span>页面</span></button><button data-home-edit-done class="edit-done"><b>✓</b><span>完成</span></button></div></aside>`:'';
  return `<section class="home swipe-home concept-home ${homeEdit?'home-edit':''}">
    <div class="home-pages" id="homePages">${first}${others}</div>
    <div class="home-page-dots" aria-label="主页分页">${Array.from({length:totalPages},(_,i)=>`<button data-home-dot="${i}" class="${i===homePage?'active':''}" aria-label="第 ${i+1} 页"></button>`).join('')}</div>
    ${editShelf}
    <nav class="tumblr-dock text-dock phone-dock concept-dock"><button data-open="messages">消息</button><button data-open="thomas">Thomas</button><button data-open="social">社交</button><button data-open="profile">我</button></nav>
  </section>`;
}

function orderedApps(){const order=S.custom?.appOrder||[];return [...apps].sort((a,b)=>{const ai=order.indexOf(a[0]),bi=order.indexOf(b[0]);return (ai<0?999:ai)-(bi<0?999:bi)});}
function view(k,arg){
  if(k==='player') return playerView(arg);
  const map={thomas:thomasView,messages:messagesView,moments:momentsView,photos:photosView,todo:todoView,calendar:calendarView,study:studyView,food:foodView,fitness:fitnessView,weather:weatherView,finance:financeView,habits:habitsView,notes:notesView,diary:diaryView,mood:moodView,sleep:sleepView,countdown:countdownView,wishlist:wishlistView,bookmarks:bookmarksView,customize:customizeView,contacts:contactsView,world:worldView,social:socialView,profile:profileView,phone:characterPhoneView,settings:settingsView};
  return (map[k]||(()=>header('Elsewhere')+'<main class="page">nothing here yet.</main>'))(arg);
}

function thomasView(){
  const p=S.settings.thomasProfile;
  return `${header(S.settings.assistantName,'always here for you.','<button class="text-action" data-thomas-style>语气</button><button class="text-action" data-thomas-clear>清空</button>')}<main class="chat-page thomas-page"><div class="assistant-intro"><div class="thomas-portrait">T</div><div><b>${esc(S.settings.assistantName)}</b><p>聊天陪伴 · 生活助手 · 会慢慢学会你的偏好</p><span class="ai-inline-status" id="thomasAIStatus">Gemini · checking…</span></div></div><div class="thomas-tone-chip">温柔 ${p.warmth} · 毒舌 ${p.sass} · 主动 ${p.initiative} · ${p.learn?'正在学习你的反馈':'固定语气'}</div><div class="quick-row"><button data-thomas-quick="帮我看看今天还有什么没做">整理今天</button><button data-thomas-action="mood">记录心情</button><button data-thomas-action="focus">开始专注</button></div><div class="messages" id="thomasMessages">${S.thomas.map(m=>bubble(m,m.role==='assistant'?{name:S.settings.assistantName,initial:'T',color:'#9c7881'}:null)).join('')}</div></main><div class="composer thomas-composer"><button class="composer-plus" type="button" data-thomas-plus aria-label="更多">＋</button><textarea id="thomasInput" placeholder="和 Thomas 聊聊，或直接告诉他‘少一点客服腔’…"></textarea><button class="composer-attach" type="button" data-thomas-attach aria-label="添加图片">▧</button><button class="send-text" data-thomas-send>发送</button></div>`;
}
function bubble(m,c){const body=m.type==='voice'?`<button class="voice-bubble" data-play-voice="${m.id}">▶ ${m.seconds||Math.max(2,Math.min(18,Math.ceil((m.text||'').length/4)))}" <span>${esc(m.text||'语音消息')}</span></button>`:`<div class="bubble">${esc(m.text)}</div>`;const src=m.role==='assistant'&&m.source==='local'?'<em class="message-source">LOCAL</em>':'';return `<div class="msg ${m.role==='user'?'mine':''}">${m.role==='assistant'?avatar(c,'sm'):''}<div>${body}<small>${fmtTime(m.ts)}${src}</small></div></div>`}
function messagesView(arg){
  if(arg) return chatView(arg);
  return `${header('消息','messages')}<main class="page">${S.characters.map(c=>{const list=S.chats[c.id]||[]; const last=list.at(-1); return `<button class="person-row" data-chat="${c.id}">${avatar(c)}<span><b>${esc(c.name)}</b><small>${esc(last?.text||'还没有消息')}</small></span><i>${last?fmtTime(last.ts):''}</i></button>`}).join('')}</main>`;
}
function chatView(id){const c=ch(id); const list=S.chats[id]||[]; return `${header(c.name,c.status,'<button class="text-action" data-call="'+id+'">通话</button>')}<main class="chat-page"><div class="messages">${list.map(m=>bubble(m,c)).join('')}</div></main><div class="composer"><button class="mini-compose" data-voice-send="${id}">语音</button><textarea id="chatInput" placeholder="发点什么…"></textarea><button class="send-text" data-chat-send="${id}">发送</button></div>`}
function momentsView(){return `${header('朋友圈','moments','<button class="round" data-new-moment>new</button>')}<main class="page tumblr-moments">${[...S.moments].sort((a,b)=>b.ts-a.ts).map(p=>{const c=ch(p.who)||{name:S.owner.name,initial:'A',color:'#aa566b'};const comments=p.comments||[];return `<article class="tumblr-post"><div class="posthead">${avatar(c,'sm')}<span><b>${esc(c.name)}</b><small>${rel(p.ts)}</small></span></div><p>${esc(p.text)}</p>${p.image?`<img src="${p.image}">`:''}<footer><button data-like="${p.id}">${p.likes||0} likes</button><button data-comment="${p.id}">${comments.length} notes</button></footer>${comments.length?`<div class="notes-thread">${comments.map(x=>`<p><b>${esc(ch(x.who)?.name||x.who)}</b> ${esc(x.text)}</p>`).join('')}</div>`:''}</article>`}).join('')}</main>`}
function todoView(){
  const todos=todoTab==='done'?S.todos.filter(t=>t.done):S.todos.filter(t=>!t.done);
  const content=todoTab==='habits'
    ? `<div class="habit-mini-list airy-habits">${S.habits.map(h=>`<button data-habit="${h.id}" class="habit-mini ${h.done?'done':''}"><span><b>${esc(h.name)}</b><small>${esc(h.detail||'today')}</small></span><em>${h.done?'已完成':`${h.streak||0} day streak`}</em></button>`).join('')}</div>`
    : `<div class="paper-list airy-todos">${todos.length?todos.map(t=>`<label class="todo-row"><input type="checkbox" data-todo="${t.id}" ${t.done?'checked':''}><span>${esc(t.text)}</span><button data-del-todo="${t.id}">删除</button></label>`).join(''):'<div class="empty-paper">这里暂时是空的。</div>'}</div>`;
  return `${header('待办','todo','<button class="text-action" data-add-todo>新增</button>')}<main class="page todo-page-air"><div class="tabs clickable-tabs"><button data-todo-tab="todo" class="${todoTab==='todo'?'active':''}">待办</button><button data-todo-tab="habits" class="${todoTab==='habits'?'active':''}">习惯</button><button data-todo-tab="done" class="${todoTab==='done'?'active':''}">已完成</button></div>${content}</main>`
}
function calendarView(){
  const ds=[...S.events].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)), realNow=new Date();
  const viewDate=new Date(realNow.getFullYear(),realNow.getMonth()+calendarOffset,1);
  const y=viewDate.getFullYear(), m=viewDate.getMonth();
  const first=new Date(y,m,1), offset=first.getDay(), days=new Date(y,m+1,0).getDate();
  const cells=[...Array(offset).fill(null),...Array.from({length:days},(_,i)=>i+1)];
  return `${header('日历','calendar','<button class="round blush-plus" data-add-event>＋</button>')}<main class="page couture-page calendar-couture">
    <section class="calendar-title-card"><small>GOOD PLANS · SOFTER DAYS</small><h2>Calendar</h2><span>make room for little joys</span></section>
    <section class="calendar-card couture-calendar"><div class="calendar-month"><button class="calendar-nav" data-calendar-prev aria-label="上个月">‹</button><b>${y}年${m+1}月</b><button class="calendar-nav" data-calendar-next aria-label="下个月">›</button></div><div class="week">${['日','一','二','三','四','五','六'].map(x=>`<span>${x}</span>`).join('')}</div><div class="date-dots">${cells.map(d=>d?`<span class="${calendarOffset===0&&d===realNow.getDate()?'today':''}">${d}${S.events.some(e=>e.date===`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`)?'<i class="event-dot"></i>':''}</span>`:'<span></span>').join('')}</div><button class="calendar-today" data-calendar-today ${calendarOffset===0?'disabled':''}>回到本月</button></section>
    <section class="day-agenda"><div class="agenda-head"><div><small>TODAY'S LITTLE PLAN</small><h3>${realNow.toLocaleDateString('zh-CN',{month:'long',day:'numeric',weekday:'long'})}</h3></div><button data-add-event>＋</button></div>${ds.map((e)=>`<div class="agenda-row minimal-agenda"><time>${esc(e.time||'--:--')}</time><div><b>${esc(e.title)}</b><small>${esc(e.date)}</small></div><button class="row-text-action" data-del-event="${e.id}">移除</button></div>`).join('')}</section>
    <div class="torn-quote">Discipline is a form of self-love. <span>Elsewhere</span></div>
  </main>`;
}
function studyView(){const sec=S.study.seconds; const mm=String(Math.floor(sec/60)).padStart(2,'0'), ss=String(sec%60).padStart(2,'0');return `${header('书房','study room')}<main class="page"><div class="study-hero"><span>“ 专注是一种温柔的力量。 ”</span></div><div class="timer-card"><div class="tabs"><b>番茄钟</b><button class="tab-action" data-study-custom>自定义</button></div><div class="timer" id="timerText">${mm}:${ss}</div><button class="play" data-study-toggle>${S.study.running?'Ⅱ':'▶'}</button><small>今日专注：${S.study.totalMinutes} 分钟</small></div><div class="study-menu"><button data-study-reset="25">25 MIN · CLASSIC</button><button data-study-reset="45">45 MIN · DEEP WORK</button><button data-open="notes">学习笔记</button><button data-open="habits">学习习惯</button></div></main>`}
function foodView(){const total=S.food.reduce((n,x)=>n+Number(x.kcal||0),0);return `${header('饮食','food','<button class="round" data-add-food>＋</button>')}<main class="page"><div class="stats-card"><span><b>${total}</b><small>/ 2000 kcal</small></span><div class="progress"><i style="width:${Math.min(100,total/20)}%"></i></div></div>${S.food.map(f=>`<div class="meal-row"><div><b>${esc(f.meal)}</b><p>${esc(f.name)}</p></div><strong>${f.kcal} kcal</strong><button data-del-food="${f.id}">×</button></div>`).join('')}<div class="water-card"><b>喝水</b><span>${S.water} / 2000 ml</span><div class="progress"><i style="width:${Math.min(100,S.water/20)}%"></i></div><div><button data-water="-250">−250</button><button data-water="250">＋250</button></div></div></main>`}
function fitnessView(){const mins=S.fitness.reduce((a,x)=>a+Number(x.minutes||0),0), kcal=S.fitness.reduce((a,x)=>a+Number(x.kcal||0),0);return `${header('健身','fitness','<button class="round" data-add-workout>＋</button>')}<main class="page"><div class="fitness-summary"><b>${mins}</b><span>MIN TODAY</span><b>${kcal}</b><span>KCAL</span></div>${S.fitness.map(x=>`<div class="meal-row"><div><b>${esc(x.name)}</b><p>${x.minutes} 分钟</p></div><strong>${x.kcal} kcal</strong><button data-del-workout="${x.id}">×</button></div>`).join('')}</main>`}
function weatherView(){return `${header('天气','weather')}<main class="page"><div class="weather-big"><span>${esc(S.weather.city)}</span><b>${esc(S.weather.temp)}°</b><p>${esc(S.weather.desc)}</p><small>${esc(S.weather.low)}° — ${esc(S.weather.high)}°</small></div><button class="primary wide" data-weather-refresh>${S.weather.loading?'正在获取…':'使用当前位置更新天气'}</button><p class="hint">天气通过浏览器定位 + Open‑Meteo 获取；拒绝定位时会保留当前天气卡。</p></main>`}
function financeView(){const income=S.finance.filter(x=>x.type==='income').reduce((a,x)=>a+Number(x.amount),0), expense=S.finance.filter(x=>x.type==='expense').reduce((a,x)=>a+Number(x.amount),0);return `${header('记账','finance','<button class="round" data-add-money>＋</button>')}<main class="page"><div class="money-card"><small>本月结余</small><b>RM ${(income-expense).toFixed(2)}</b><div><span>收入 RM ${income.toFixed(2)}</span><span>支出 RM ${expense.toFixed(2)}</span></div></div>${S.finance.map(x=>`<div class="money-row"><span>${x.type==='income'?'＋':'−'}</span><b>${esc(x.name)}</b><i>${x.type==='income'?'+':'-'} RM ${Number(x.amount).toFixed(2)}</i><button data-del-money="${x.id}">×</button></div>`).join('')}</main>`}
function habitsView(){return `${header('习惯','habit tracker','<button class="text-action" data-add-habit>新增</button>')}<main class="page habit-page"><section class="habit-paper"><small>DAILY RHYTHM</small><h2>今天，慢慢来。</h2><p>不需要把每件事都变成图标。这里只留下进度、节奏和你真正想坚持的事。</p></section><div class="habit-list">${S.habits.map(h=>`<button data-habit="${h.id}" class="habit-line ${h.done?'done':''}"><span><b>${esc(h.name)}</b><small>${esc(h.detail||'today')}</small></span><div><em>${h.streak||0} day streak</em><strong>${h.done?'完成':'打卡'}</strong></div></button>`).join('')}</div></main>`}

function notesView(){return `${header('笔记','notes','<button class="round" data-add-note>＋</button>')}<main class="page note-grid">${S.notes.map(n=>`<article class="note"><b>${esc(n.title)}</b><p>${esc(n.text)}</p><button data-del-note="${n.id}">×</button></article>`).join('')}</main>`}
function diaryView(){return `${header('日记','diary','<button class="round" data-add-diary>＋</button>')}<main class="page">${[...S.diary].reverse().map(d=>`<article class="diary-entry"><small>${esc(d.date)}</small><p>${esc(d.text)}</p><button data-del-diary="${d.id}">×</button></article>`).join('')}</main>`}
function photosView(){return `${header('相册','photos','<button class="round" data-photo-add>＋</button>')}<main class="page"><div class="photo-grid">${S.photos.length?S.photos.map(p=>`<div class="photo" style="background-image:url('${p.data}')"><button data-del-photo="${p.id}">×</button></div>`).join(''):'<div class="empty-paper">还没有照片。<br>点右上角把自己的图片放进 Elsewhere。</div>'}</div></main>`}

function moodView(){const latest=S.moods?.[0];const labels=['很低','低','一般','不错','很好'];return `${header('心情','mood journal','<button class="text-action" data-add-mood>记录</button>')}<main class="page"><div class="mood-hero"><small>TODAY FEELS LIKE</small><h2>${latest?.note?esc(latest.note):labels[(latest?.value||4)-1]}</h2></div><div class="mood-scale text-mood">${labels.map((f,i)=>`<button data-mood="${i+1}" class="${latest?.value===i+1?'active':''}"><b>${f}</b></button>`).join('')}</div><h3 class="section-title">最近的心情</h3>${(S.moods||[]).map(m=>`<div class="journal-row"><time>${esc(m.date)}</time><b>${labels[(m.value||3)-1]}</b><span>${esc(m.note||'')}</span></div>`).join('')}</main>`}

function sleepView(){const avg=(S.sleep||[]).length?((S.sleep.reduce((a,x)=>a+Number(x.hours||0),0))/S.sleep.length).toFixed(1):'0';return `${header('睡眠','sleep archive','<button class="round" data-add-sleep>＋</button>')}<main class="page"><div class="sleep-hero"><small>7 DAY RHYTHM</small><b>${avg}<i>h</i></b><p>不追求完美，只收藏自己的节奏。</p></div>${(S.sleep||[]).map(x=>`<div class="sleep-row"><span>${esc(x.date)}</span><div><i style="width:${Math.min(100,Number(x.hours||0)/9*100)}%"></i></div><b>${x.hours}h · ${'★'.repeat(x.quality||3)}</b></div>`).join('')}</main>`}
function countdownView(){return `${header('倒数日','countdown','<button class="round" data-add-countdown>＋</button>')}<main class="page countdown-grid">${(S.countdowns||[]).map(x=>{const d=Math.ceil((new Date(x.date+'T00:00:00')-new Date(today()+'T00:00:00'))/86400000);return `<article class="countdown-card"><small>${d>=0?'IN':'AGO'}</small><b>${Math.abs(d)}</b><i>DAYS</i><h3>${esc(x.title)}</h3><p>${esc(x.date)}</p><button data-del-countdown="${x.id}">×</button></article>`}).join('')}</main>`}
function wishlistView(){return `${header('愿望清单','little wishes','<button class="round" data-add-wish>＋</button>')}<main class="page"><div class="wish-intro">things I would like to meet, make, buy or become.</div>${(S.wishlist||[]).map(x=>`<label class="wish-row"><input type="checkbox" data-wish="${x.id}" ${x.done?'checked':''}><span>${esc(x.text)}</span><button data-del-wish="${x.id}">×</button></label>`).join('')}</main>`}
function bookmarksView(){return `${header('收藏','bookmarks','<button class="round" data-add-bookmark>＋</button>')}<main class="page"><div class="bookmark-grid">${(S.bookmarks||[]).map(x=>`<article class="bookmark-card"><small>SAVED LINK</small><b>${esc(x.title)}</b><p>${esc(x.url)}</p><div><button data-open-link="${esc(x.url)}">打开</button><button data-del-bookmark="${x.id}">删除</button></div></article>`).join('')}</div></main>`}
function customizeView(){
  const c=S.custom;
  return `${header('Customise','make it completely yours')}<main class="page tumblr-custom">
    <section class="custom-preview-card phone-custom-preview"><div class="mini-desktop"><b>${esc(c.title)}</b><small>${esc(c.quote)}</small><div class="mini-icon-grid"><i>★</i><i>★</i><i>★</i><i>★</i><i>★</i><i>★</i></div></div><div><small>HOME SCREEN</small><h2>clean,<br>personal.</h2><p>像真正的小手机一样整理主页：长按 App 编辑、拖动换页、建立文件夹，并且每一页都能有自己的壁纸。</p></div></section>
    <h3 class="section-title">themes</h3><div class="theme-grid couture-themes">${Object.entries(themes).map(([id,t])=>`<button data-theme="${id}" class="${S.theme===id?'active':''}" style="--sample:${t.wall}"><span></span><b>${esc(t.name)}</b></button>`).join('')}</div>
    <h3 class="section-title">home details</h3><div class="custom-toggle-grid"><label><span>主页显示头像<small>点头像直接进入个人资料</small></span><input type="checkbox" data-custom-toggle="showHomeAvatar" ${c.showHomeAvatar?'checked':''}></label><label><span>点击特效<small>选择页面点击时的小动画</small></span><select data-custom-select="clickEffect"><option value="sparkle" ${c.clickEffect==='sparkle'?'selected':''}>星光</option><option value="heart" ${c.clickEffect==='heart'?'selected':''}>小心心</option><option value="petal" ${c.clickEffect==='petal'?'selected':''}>花瓣</option><option value="none" ${c.clickEffect==='none'?'selected':''}>关闭</option></select></label><label><span>特效强度<small>保持轻一点会更耐看</small></span><input type="range" min="1" max="4" value="${c.effectStrength||2}" data-custom-range="effectStrength"></label></div>
    <h3 class="section-title">home widgets</h3><p class="custom-help">Widget 可以放到任何主页。长按桌面进入编辑，或在这里统一管理；所有编辑会在同一张面板里完成。</p>${widgetManagerHtml()}
    <h3 class="section-title">apps</h3><p class="custom-help">默认统一使用小星星，保持整齐。点 App 可以改名、隐藏，或上传自己的图片作为图标。</p><div class="visual-app-manager clean-app-manager">${orderedApps().map(a=>{const al=c.aliases[a[0]]||{};return `<button draggable="true" data-app-tile="${a[0]}" data-app-edit="${a[0]}" class="${c.hiddenApps.includes(a[0])?'is-hidden':''}">${al.src?`<img src="${esc(al.src)}">`:'<span class="no-icon-preview star-preview">★</span>'}<span><b>${esc(al.label||a[2])}</b><small>${c.hiddenApps.includes(a[0])?'hidden':'tap to edit'}</small></span></button>`}).join('')}</div>
    <h3 class="section-title">type & colour</h3><div class="custom-form couture-form"><label>title<input data-custom="title" value="${esc(c.title)}"></label><label>subtitle<input data-custom="subtitle" value="${esc(c.subtitle)}"></label><label>little sentence<input data-custom="quote" value="${esc(c.quote)}"></label></div><div class="color-row couture-colors"><label><span>pink</span><input type="color" data-custom-color="accent" value="${c.accent||'#c96f8a'}"></label><label><span>paper</span><input type="color" data-custom-color="paper" value="${c.paper||'#fff7f8'}"></label><label><span>ink</span><input type="color" data-custom-color="ink" value="${c.ink||'#49363d'}"></label></div>
    <div class="custom-air-controls"><label>桌面间距 <b>${c.spacing||18}px</b><input type="range" min="10" max="30" value="${c.spacing||18}" data-custom-range="spacing" data-suffix="px"></label><label>卡片透明度 <b>${c.cardOpacity||82}%</b><input type="range" min="45" max="100" value="${c.cardOpacity||82}" data-custom-range="cardOpacity" data-suffix="%"></label><label>圆角 <b>${c.radius||24}px</b><input type="range" min="4" max="34" value="${c.radius||24}" data-custom-range="radius" data-suffix="px"></label></div>
    <button class="primary wide couture-primary" data-wallpaper-studio>wallpaper studio</button><button class="paper-button wide" data-custom-reset>restore Pink Dream</button>
  </main>`;
}

function profileCard(p,actions=''){
  const av=p.avatar?`<img src="${esc(p.avatar)}" alt="">`:`<span>${esc((p.name||'?').slice(0,1))}</span>`;
  return `<article class="player-card"><div class="profile-banner" ${p.banner?`style="background-image:url('${esc(p.banner)}')"`:''}></div><div class="profile-main"><div class="player-avatar">${av}</div><div class="player-copy"><h3>${esc(p.name||'Elsewhere user')}</h3><small>@${esc(p.handle||'user')}</small><p>${esc(p.bio||'')}</p><em>${esc(p.status||'')}</em></div></div>${actions}</article>`;
}
async function socialSync(){
  try{
    const r=await fetch('/api/social/profiles'); if(!r.ok)throw 0; const d=await r.json(); S.social.feed=d.posts||[]; S.social.profiles=d.profiles||[]; S.social.lastSync=Date.now(); save();
  }catch{}
}
function socialView(){
  const profiles=(S.social.profiles||[]).filter(p=>p.id!==S.social.userId);
  const posts=S.social.feed||[];
  return `${header('社交','community','<button class="text-action" data-social-refresh>刷新</button>')}<main class="page social-page"><section class="social-intro"><small>ELSEWHERE COMMUNITY</small><h2>和别人的小手机，轻轻碰个面。</h2><p>同一个部署地址里的玩家可以公开资料、关注彼此、发短帖和留言。</p><button class="paper-button" data-social-post>写一条</button></section><h3 class="section-title">people</h3><div class="people-strip">${profiles.length?profiles.map(p=>`<button data-view-player="${esc(p.id)}"><span class="mini-player-avatar">${p.avatar?`<img src="${esc(p.avatar)}">`:esc((p.name||'?')[0])}</span><b>${esc(p.name)}</b><small>@${esc(p.handle||'user')}</small></button>`).join(''):'<p class="quiet-copy">还没有其他玩家出现。部署给朋友后，他们会显示在这里。</p>'}</div><h3 class="section-title">notes from elsewhere</h3><div class="community-feed">${posts.length?posts.map(post=>{const p=(S.social.profiles||[]).find(x=>x.id===post.author)||{name:'someone',handle:'elsewhere'};return `<article class="community-post"><header><b>${esc(p.name)}</b><small>@${esc(p.handle||'user')} · ${rel(post.ts)}</small></header><p>${esc(post.text)}</p><footer><button data-social-like="${post.id}">${post.likes||0} likes</button><button data-social-notes="${post.id}">${(post.notes||[]).length} notes</button></footer>${post._open?`<div class="community-notes">${(post.notes||[]).map(n=>`<p><b>${esc(n.name||'someone')}</b> ${esc(n.text)}</p>`).join('')}<button data-social-reply="${post.id}">写留言</button></div>`:''}</article>`}).join(''):'<div class="empty-paper">这里还很安静。你可以成为第一条。</div>'}</div></main>`;
}
function profileView(){
  const me={id:S.social.userId,...S.owner}; const following=(S.social.following||[]).length;
  return `${header('我','profile','<button class="text-action" data-edit-profile>编辑</button>')}<main class="page profile-page">${profileCard(me,`<div class="profile-stats"><span><b>${following}</b><small>following</small></span><span><b>${(S.social.feed||[]).filter(p=>p.author===S.social.userId).length}</b><small>posts</small></span><span><b>${S.characters.length}</b><small>characters</small></span></div>`)}<div class="profile-actions"><button data-open="social">去社交页</button><button data-profile-avatar>更换头像</button><button data-profile-banner>更换封面</button></div><section class="profile-paper"><small>ABOUT THIS PHONE</small><p>${esc(S.custom.quote||'')}</p><div>${(S.owner.tags||[]).map(t=>`<span>${esc(t)}</span>`).join('')}</div></section><section class="profile-lock-card"><div><small>PHONE LOCK</small><b>密码锁</b><span>启动 Elsewhere 时先经过锁屏与密码。</span></div><button data-change-passcode>修改密码</button></section></main>`;
}
function playerView(id){
  const p=(S.social.profiles||[]).find(x=>x.id===id); if(!p)return socialView(); const following=(S.social.following||[]).includes(id);
  return `${header(p.name||'player','community profile')}<main class="page profile-page">${profileCard(p,`<div class="profile-actions"><button data-follow-player="${esc(id)}">${following?'取消关注':'关注'}</button></div>`)}<h3 class="section-title">recent notes</h3><div class="community-feed">${(S.social.feed||[]).filter(x=>x.author===id).map(post=>`<article class="community-post"><p>${esc(post.text)}</p><footer>${post.likes||0} likes · ${(post.notes||[]).length} notes</footer></article>`).join('')||'<div class="empty-paper">还没有公开内容。</div>'}</div></main>`;
}
function contactsView(){return `${header('角色','characters','<button class="round" data-add-char>＋</button>')}<main class="page">${S.characters.map(c=>{const r=S.relationships[c.id]||{score:50,label:'熟悉',secrets:[]};return `<div class="person-row rich">${avatar(c)}<span><b>${esc(c.name)}</b><small>${esc(c.relation)} · ${r.score}/100 ${esc(r.label)}</small></span><div class="person-actions"><button class="pill" data-chat="${c.id}">聊天</button><button class="pill" data-peek="${c.id}">偷看手机</button><button class="pill" data-call="${c.id}">通话</button></div><button data-del-char="${c.id}">×</button></div>`}).join('')}<div class="setting-list"><button data-card-export>导出全部角色卡 <i>›</i></button><button data-card-import>导入角色卡 <i>›</i></button></div></main>`}
function widgetHtml(w){
  if(w.type==='thomas') return `<button class="desk-widget w-thomas" data-widget="${w.id}" style="left:${w.x}px;top:${w.y}px" data-open="thomas"><small>THOMAS · ASSISTANT</small><b>${S.todos.filter(t=>!t.done).length} things left</b><i>drag me</i></button>`;
  const n=S.notes[0]; return `<button class="desk-widget w-note" data-widget="${w.id}" style="left:${w.x}px;top:${w.y}px" data-open="notes"><small>PINNED NOTE</small><b>${esc(n?.title||'untitled')}</b><i>${esc((n?.text||'').slice(0,35))}</i></button>`;
}
function worldView(){const log=[...S.privateChats].sort((a,b)=>b.ts-a.ts);return `${header('世界','world engine','<button class="round" data-world-pulse>✦</button>')}<main class="page"><div class="world-card"><small>ACTIVE WORLD</small><h2>${esc(S.worlds.find(w=>w.id===S.activeWorld)?.name||'Main World')}</h2><p>角色会在你离开时继续留下痕迹：主动消息、朋友圈、私聊、秘密与关系变化。</p><button class="primary wide" data-world-pulse>推进世界一次</button></div><h3 class="section-title">世界存档</h3><div class="setting-list">${S.worlds.map(w=>`<button data-world-switch="${w.id}">${w.id===S.activeWorld?'● ':'○ '}${esc(w.name)}<i>›</i></button>`).join('')}<button data-world-new>＋ 新建世界存档<i>›</i></button></div><h3 class="section-title">角色之间</h3>${log.length?log.map(x=>`<article class="private-chat"><small>${rel(x.ts)} · ${esc(ch(x.a)?.name||x.a)} × ${esc(ch(x.b)?.name||x.b)}</small>${x.messages.map(m=>`<p><b>${esc(ch(m.who)?.name||m.who)}：</b>${esc(m.text)}</p>`).join('')}</article>`).join(''):'<div class="empty-paper">还没有留下角色之间的私聊。</div>'}</main>`}
function characterPhoneView(id){const c=ch(id);if(!c)return header('角色手机')+'<main class="page">not found</main>';const r=S.relationships[id]||{score:50,label:'熟悉',secrets:[]};const mem=S.memories[id]||[];const privateThreads=S.privateChats.filter(x=>x.a===id||x.b===id);return `${header(c.name+' 的手机','private phone')}<main class="page"><div class="phone-peek"><div class="peek-lock">${avatar(c)}<h2>${esc(c.name)}</h2><small>${r.score}/100 · ${esc(r.label)}</small></div><div class="peek-grid"><div><small>MEMORY</small><b>${mem.length}</b><span>长期记忆</span></div><div><small>SECRETS</small><b>${r.secrets.length}</b><span>未说出口</span></div><div><small>CHATS</small><b>${privateThreads.length}</b><span>私人对话</span></div><div><small>CALLS</small><b>${S.callLogs.filter(x=>x.character===id).length}</b><span>通话记录</span></div></div></div><h3 class="section-title">长期记忆</h3>${mem.map(m=>`<div class="memory-row"><span>✦</span><p>${esc(m.text)}</p><small>${'★'.repeat(Math.max(1,m.importance||1))}</small></div>`).join('')||'<div class="empty-paper">还没有形成长期记忆。</div>'}<h3 class="section-title">秘密</h3>${r.secrets.map(x=>`<div class="secret-note">${esc(x)}</div>`).join('')||'<div class="empty-paper">暂时没有秘密。</div>'}<h3 class="section-title">角色私聊</h3>${privateThreads.map(x=>`<article class="private-chat">${x.messages.map(m=>`<p><b>${esc(ch(m.who)?.name||m.who)}：</b>${esc(m.text)}</p>`).join('')}</article>`).join('')||'<div class="empty-paper">没有发现私聊。</div>'}</main>`}
function settingsView(){const p=S.settings.thomasProfile;return `${header('设置','settings')}<main class="page"><h3 class="section-title">主题</h3><div class="theme-grid">${Object.entries(themes).map(([id,t])=>`<button data-theme="${id}" class="${S.theme===id?'active':''}" style="--sample:${t.wall}"><span></span><b>${esc(t.name)}</b></button>`).join('')}</div><h3 class="section-title">Thomas · 语气养成</h3><div class="thomas-settings"><label>温柔度 <b>${p.warmth}</b><input type="range" min="0" max="100" value="${p.warmth}" data-thomas-range="warmth"></label><label>毒舌度 <b>${p.sass}</b><input type="range" min="0" max="100" value="${p.sass}" data-thomas-range="sass"></label><label>主动程度 <b>${p.initiative}</b><input type="range" min="0" max="100" value="${p.initiative}" data-thomas-range="initiative"></label><label>正式程度 <b>${p.formality}</b><input type="range" min="0" max="100" value="${p.formality}" data-thomas-range="formality"></label><label>话多程度 <b>${p.verbosity}</b><input type="range" min="0" max="100" value="${p.verbosity}" data-thomas-range="verbosity"></label><label class="thomas-field">Thomas 怎么称呼你<input value="${esc(p.address)}" data-thomas-address></label><label class="thomas-field">基础人格<textarea data-thomas-base>${esc(p.base)}</textarea></label><label class="learn-toggle"><input type="checkbox" data-thomas-learn ${p.learn?'checked':''}> 根据聊天反馈慢慢调整语气</label><small>已学会 ${S.settings.thomasLearned.length} 条偏好。你也可以直接对 Thomas 说“别这么官方”“再毒舌一点”“以后叫我 Ann”。</small><button class="pill" data-thomas-forget>清除已学习的语气偏好</button></div><h3 class="section-title">主页 Widgets</h3><p class="hint">每个 Widget 都可以选择页面和尺寸，也可以重复加入同一种。</p>${widgetManagerHtml()}<h3 class="section-title">Elsewhere</h3><div class="setting-list"><button data-wallpaper-studio>壁纸与主页背景 <i>›</i></button><button data-export>导出数据 <i>›</i></button><button data-import>导入数据 <i>›</i></button><button data-reset class="danger">重置小手机 <i>›</i></button></div><section class="ai-status-card" id="aiStatusCard"><div><small>AI ENGINE</small><b id="aiStatusLabel">正在检查 Gemini…</b><span id="aiStatusMeta">Thomas 与角色共用同一个 Gemini 连接</span></div><button data-ai-test>Test AI</button></section><p class="hint">Render 只需要 GEMINI_API_KEY。AI 失败时会明确标记为 Local，不再偷偷伪装成已连接。</p></main>`}

function uiLayer(){
  let layer=document.querySelector('#uiLayer');
  if(!layer){ layer=document.createElement('div'); layer.id='uiLayer'; document.body.appendChild(layer); }
  return layer;
}
function uiClose(result=null){
  const layer=uiLayer(); const active=layer.querySelector('.ew-modal-wrap');
  if(!active)return; active.classList.add('closing');
  const resolve=active._resolve; setTimeout(()=>{active.remove(); resolve?.(result)},150);
}
function uiPrompt({title='写一点什么',label='',value='',placeholder='',type='text',multiline=false,confirmText='保存',cancelText='取消'}={}){
  return new Promise(resolve=>{
    const wrap=document.createElement('div'); wrap.className='ew-modal-wrap'; wrap._resolve=resolve;
    const control=multiline
      ? `<textarea class="ew-dialog-input" id="ewDialogInput" placeholder="${esc(placeholder)}">${esc(value)}</textarea>`
      : `<input class="ew-dialog-input" id="ewDialogInput" type="${esc(type)}" value="${esc(value)}" placeholder="${esc(placeholder)}">`;
    wrap.innerHTML=`<div class="ew-modal-scrim" data-dialog-cancel></div><section class="ew-dialog" role="dialog" aria-modal="true"><div class="ew-dialog-ornament">Elsewhere</div><h3>${esc(title)}</h3>${label?`<p class="ew-dialog-label">${esc(label)}</p>`:''}${control}<div class="ew-dialog-actions"><button class="ew-dialog-secondary" data-dialog-cancel>${esc(cancelText)}</button><button class="ew-dialog-primary" data-dialog-ok>${esc(confirmText)}</button></div></section>`;
    uiLayer().appendChild(wrap); requestAnimationFrame(()=>wrap.classList.add('show'));
    const input=wrap.querySelector('#ewDialogInput'); setTimeout(()=>{input?.focus(); if(input?.select && !multiline) input.select()},60);
    const finish=v=>uiClose(v);
    wrap.querySelectorAll('[data-dialog-cancel]').forEach(x=>x.onclick=()=>finish(null));
    wrap.querySelector('[data-dialog-ok]').onclick=()=>finish((input?.value??'').trim());
    input?.addEventListener('keydown',e=>{if(e.key==='Escape')finish(null);if(e.key==='Enter'&&!multiline&&!e.shiftKey){e.preventDefault();finish((input.value||'').trim())}});
  });
}

function uiForm({title='Edit',subtitle='',fields=[],confirmText='保存',cancelText='取消'}={}){
  return new Promise(resolve=>{
    const wrap=document.createElement('div');wrap.className='ew-modal-wrap ew-form-wrap';wrap._resolve=resolve;
    const controls=fields.map(f=>{
      const name=esc(f.name),label=esc(f.label||f.name),value=esc(f.value??'');
      let control='';
      if(f.type==='select'){
        control=`<select class="ew-dialog-input" data-form-field="${name}">${(f.options||[]).map(o=>{const pair=Array.isArray(o)?o:[o,o];return `<option value="${esc(pair[0])}" ${String(pair[0])===String(f.value)?'selected':''}>${esc(pair[1])}</option>`}).join('')}</select>`;
      }else if(f.multiline){
        control=`<textarea class="ew-dialog-input" data-form-field="${name}" placeholder="${esc(f.placeholder||'')}">${value}</textarea>`;
      }else{
        control=`<input class="ew-dialog-input" data-form-field="${name}" type="${esc(f.type||'text')}" value="${value}" placeholder="${esc(f.placeholder||'')}">`;
      }
      return `<label class="ew-form-field"><span>${label}</span>${control}</label>`;
    }).join('');
    wrap.innerHTML=`<div class="ew-modal-scrim" data-form-cancel></div><section class="ew-dialog ew-sheet ew-form-dialog" role="dialog" aria-modal="true"><div class="sheet-handle"></div><div class="sheet-title"><div><small>ELSEWHERE EDITOR</small><h3>${esc(title)}</h3>${subtitle?`<p>${esc(subtitle)}</p>`:''}</div><button data-form-cancel>×</button></div><div class="ew-form-grid">${controls}</div><div class="ew-dialog-actions"><button class="ew-dialog-secondary" data-form-cancel>${esc(cancelText)}</button><button class="ew-dialog-primary" data-form-ok>${esc(confirmText)}</button></div></section>`;
    uiLayer().appendChild(wrap);requestAnimationFrame(()=>wrap.classList.add('show'));
    const finish=v=>{wrap.classList.remove('show');setTimeout(()=>{wrap.remove();resolve(v)},140)};
    wrap.querySelectorAll('[data-form-cancel]').forEach(x=>x.onclick=()=>finish(null));
    wrap.querySelector('[data-form-ok]').onclick=()=>{const out={};$$('[data-form-field]',wrap).forEach(el=>out[el.dataset.formField]=el.value);finish(out)};
  });
}
function uiConfirm({title='确认一下',message='',confirmText='确定',cancelText='取消',danger=false}={}){
  return new Promise(resolve=>{
    const wrap=document.createElement('div'); wrap.className='ew-modal-wrap'; wrap._resolve=resolve;
    wrap.innerHTML=`<div class="ew-modal-scrim" data-dialog-cancel></div><section class="ew-dialog ew-confirm" role="dialog" aria-modal="true"><div class="ew-dialog-ornament">Elsewhere</div><h3>${esc(title)}</h3><p class="ew-confirm-copy">${esc(message)}</p><div class="ew-dialog-actions"><button class="ew-dialog-secondary" data-dialog-cancel>${esc(cancelText)}</button><button class="ew-dialog-primary ${danger?'danger':''}" data-dialog-ok>${esc(confirmText)}</button></div></section>`;
    uiLayer().appendChild(wrap); requestAnimationFrame(()=>wrap.classList.add('show'));
    const finish=v=>uiClose(v); wrap.querySelectorAll('[data-dialog-cancel]').forEach(x=>x.onclick=()=>finish(false)); wrap.querySelector('[data-dialog-ok]').onclick=()=>finish(true);
  });
}
function uiAlert({title='Elsewhere',message='',button='知道了'}={}){
  return new Promise(resolve=>{
    const wrap=document.createElement('div'); wrap.className='ew-modal-wrap'; wrap._resolve=resolve;
    wrap.innerHTML=`<div class="ew-modal-scrim" data-dialog-ok></div><section class="ew-dialog ew-alert" role="dialog" aria-modal="true"><div class="ew-dialog-ornament">Elsewhere</div><h3>${esc(title)}</h3><p class="ew-confirm-copy">${esc(message)}</p><div class="ew-dialog-actions single"><button class="ew-dialog-primary" data-dialog-ok>${esc(button)}</button></div></section>`;
    uiLayer().appendChild(wrap); requestAnimationFrame(()=>wrap.classList.add('show')); wrap.querySelectorAll('[data-dialog-ok]').forEach(x=>x.onclick=()=>uiClose(true));
  });
}
function uiToast(message,{tone='paper',duration=2200}={}){
  const layer=uiLayer(); const t=document.createElement('div'); t.className=`ew-toast ${tone}`; t.innerHTML=`<b>${esc(message)}</b>`; layer.appendChild(t); requestAnimationFrame(()=>t.classList.add('show')); setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),180)},duration);
}

function pushBanner(title,text,target='thomas'){
  const old=document.querySelector('.ew-notification-banner'); old?.remove();
  const b=document.createElement('button'); b.className='ew-notification-banner'; b.innerHTML=`<small>${esc(title||'ELSEWHERE')}</small><b>${esc(text||'')}</b>`;
  b.onclick=()=>{b.remove();open(target)}; document.querySelector('.phone')?.appendChild(b);
  requestAnimationFrame(()=>b.classList.add('show')); setTimeout(()=>{b.classList.remove('show');setTimeout(()=>b.remove(),220)},4200);
}
function addNotification(title,text,target='thomas'){
  S.notifications.unshift({id:uid(),title,text,ts:Date.now(),read:false,target}); save();
  if(!S.locked) setTimeout(()=>pushBanner(title,text,target),80);
}
async function ask(label,def='',opts={}){ return uiPrompt({title:label,value:def,...opts}); }
function open(k,arg=null){save();
  if(k==='home'){homeEdit=false; const v=$('.view'); if(v){v.classList.add('going-home');setTimeout(()=>{current='home';currentArg=null;render()},140);return;} current='home';currentArg=null;render();return;}
  if(current==='home'){const ph=$('.phone');ph?.classList.add('app-launching');setTimeout(()=>{current=k;currentArg=arg;render();requestAnimationFrame(()=>$('.app-view')?.classList.add('app-arrived'))},110);return;}
  current=k; currentArg=arg; render(); requestAnimationFrame(()=>{const phone=$('.phone'); if(phone) phone.scrollTop=0; const m=$('.messages'); if(m)m.scrollTop=m.scrollHeight});
}
function learnThomasStyle(text){
  const p=S.settings.thomasProfile, learned=S.settings.thomasLearned;
  if(!p.learn)return '';
  const t=text.toLowerCase(); let note='';
  const shift=(k,n)=>p[k]=Math.max(0,Math.min(100,Number(p[k]||0)+n));
  if(/(别|不要).*(客服|官方|正式)|太(客服|官方|正式)/.test(text)){shift('formality',-12);note='少一点正式和客服腔'}
  if(/更.*(随意|自然|口语)/.test(text)){shift('formality',-8);note='说话更自然随意'}
  if(/更.*(温柔|体贴)/.test(text)){shift('warmth',10);note='更温柔体贴'}
  if(/(别|不要).*(温柔|哄)/.test(text)){shift('warmth',-10);note='减少过度温柔'}
  if(/(毒舌|欠一点|损一点|刻薄一点)/.test(text)){shift('sass',10);note='可以更毒舌一点'}
  if(/(别|不要).*(毒舌|阴阳|讽刺)/.test(text)){shift('sass',-12);note='减少毒舌和讽刺'}
  if(/(少说|简短|话少|少一点废话)/.test(text)){shift('verbosity',-12);note='回答更短，少废话'}
  if(/(多说|详细一点|话多)/.test(text)){shift('verbosity',10);note='可以多说一点'}
  if(/(主动一点|多提醒|多来找我)/.test(text)){shift('initiative',10);note='更主动地提醒和关心'}
  if(/(别催|少提醒|不要主动)/.test(text)){shift('initiative',-12);note='降低主动提醒频率'}
  const m=text.match(/(?:以后|你可以)?叫我[「“"']?([^，。！？,.!?'”」]{1,16})/);
  if(m){p.address=m[1].trim();note=`称呼用户为 ${p.address}`}
  if(note && !learned.includes(note)){learned.unshift(note);if(learned.length>20)learned.length=20}
  return note;
}
function thomasStylePrompt(){
  const p=S.settings.thomasProfile, learned=S.settings.thomasLearned;
  return `基础人格：${p.base}；称呼用户：${p.address||'自然称呼'}。语气参数（0-100）：温柔${p.warmth}，毒舌${p.sass}，主动${p.initiative}，正式${p.formality}，话多${p.verbosity}。已学习偏好：${learned.join('；')||'暂无'}。不要机械复述参数，要自然体现。${p.verbosity<35?'尽量用短句。':''}${p.formality<35?'避免客服腔、模板式安慰和过度礼貌。':''}${p.sass>60?'可以轻微挖苦或吐槽，但不要恶意。':''}`;
}
function localThomas(text){
  const p=S.settings.thomasProfile;
  if(S.settings.thomasLearned[0] && /(客服|官方|温柔|毒舌|废话|简短|主动|提醒|叫我)/.test(text)) return p.sass>55?'行，记住了。别到时候又嫌我太会说。':'好，我会慢慢照这个方式和你说话。';
  const due=S.todos.filter(x=>!x.done);
  if(/今天|待办|没做/.test(text)) return due.length?`你今天还有 ${due.length} 项没完成：${due.slice(0,5).map(x=>x.text).join('、')}。我建议先挑最短的一项开始，不用一次把整天都解决。`:'今天的待办已经全部完成了。剩下的时间可以留给自己。';
  if(/专注|番茄|学习/.test(text)){ S.study.seconds=25*60; S.study.running=false; return '我已经把书房的番茄钟调到 25 分钟。先只做一件事，结束后再决定要不要继续。'; }
  if(/记录|心情|日记/.test(text)){ return '可以。你直接把现在脑子里的话说给我，我会把它当成一段可以被整理进日记的文字。'; }
  if(/喝水/.test(text)){ return `你今天记录了 ${S.water} ml。离 2000 ml 还差 ${Math.max(0,2000-S.water)} ml。`; }
  if(/花|钱|记账|余额/.test(text)){const i=S.finance.filter(x=>x.type==='income').reduce((a,x)=>a+Number(x.amount),0),e=S.finance.filter(x=>x.type==='expense').reduce((a,x)=>a+Number(x.amount),0);return `目前记录的结余是 RM ${(i-e).toFixed(2)}，收入 RM ${i.toFixed(2)}，支出 RM ${e.toFixed(2)}。`;}
  const opts=['我在。你可以不用把事情说得很完整。','听起来你今天脑子里装了很多东西。先把最吵的那一件告诉我。','这件事我记住了。你想让我陪你梳理，还是只想让我听着？','可以。我们把它变小一点，一件一件来。']; return opts[Math.floor(Math.random()*opts.length)];
}
async function aiStatus(updateUI=true){
  try{
    const r=await fetch('/api/ai-status',{cache:'no-store'}); const d=await r.json();
    const ok=!!d.configured;
    if(updateUI){
      const label=$('#aiStatusLabel'); if(label)label.textContent=ok?'Gemini · Connected':'Gemini · Not connected';
      const meta=$('#aiStatusMeta'); if(meta)meta.textContent=ok?`${d.model||'Gemini'} · server key detected`:'Render 里还没有可用的 GEMINI_API_KEY';
      const inline=$('#thomasAIStatus'); if(inline)inline.textContent=ok?'Gemini · connected':'Gemini · offline';
      const card=$('#aiStatusCard'); if(card)card.classList.toggle('connected',ok);
    }
    return d;
  }catch(e){
    if(updateUI){ const label=$('#aiStatusLabel'); if(label)label.textContent='Gemini · status unavailable'; }
    return {configured:false,error:String(e)};
  }
}
async function sendThomas(text){
  if(!text)return;
  learnThomasStyle(text);
  S.thomas.push({id:uid(),role:'user',text,ts:Date.now()}); save(); render();
  let reply='', source='gemini', error='';
  try{
    if(S.settings.useAI){
      const context=`用户待办：${S.todos.filter(x=>!x.done).map(x=>x.text).join('、')}；今日饮水 ${S.water}ml；今日专注 ${S.study.totalMinutes} 分钟。你叫 Thomas，是 Elsewhere 小手机里的私人生活助手。${thomasStylePrompt()} 你可以基于这些信息给生活建议，但不要假装已经做了未做的动作。若用户正在给你的语气反馈，简短自然地承认并立刻按新语气回应，不要解释参数。`;
      const r=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({character:{name:'Thomas',personality:context,relationship:'private assistant',style:'natural concise Chinese messages'},world:{summary:'Elsewhere scrapbook little phone'},messages:S.thomas.slice(-24).map(x=>({role:x.role,content:x.text}))})});
      const d=await r.json().catch(()=>({}));
      if(r.ok) reply=d.content||''; else error=d.error||`HTTP ${r.status}`;
    }
  }catch(e){error=String(e.message||e)}
  if(!reply){ source='local'; reply=localThomas(text); if(error) uiToast(`Gemini 未连接：${String(error).slice(0,90)}`); }
  S.thomas.push({id:uid(),role:'assistant',text:reply,ts:Date.now(),source}); save(); render();
  setTimeout(()=>{const m=$('.messages');if(m)m.scrollTop=m.scrollHeight},10);
}
async function sendChat(id,text){
  if(!text)return; const c=ch(id); if(!c)return;
  S.chats[id] ||= []; S.chats[id].push({id:uid(),role:'user',text,ts:Date.now()}); rememberFromChat(id,text); save(); render();
  let reply='',source='gemini',error='';
  try{
    const memories=(S.memories[id]||[]).slice(0,10).map(x=>x.text).join('；');
    const rel=S.relationships[id]||{};
    const r=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({character:{name:c.name,personality:`${c.personality||''}\nLong-term memories: ${memories||'none yet'}`,relationship:`${c.relation||''}; relationship score ${rel.score||50}/100`,style:c.style},world:{summary:'A private everyday world inside Elsewhere. Keep continuity across previous messages.'},messages:S.chats[id].slice(-28).map(x=>({role:x.role,content:x.text}))})});
    const d=await r.json().catch(()=>({})); if(r.ok)reply=d.content||'';else error=d.error||`HTTP ${r.status}`;
  }catch(e){error=String(e.message||e)}
  if(!reply){ source='local'; const generic=['知道了。','你终于想起回我了。','嗯，然后呢？','好。别又忙到忘记吃东西。']; reply=generic[Math.floor(Math.random()*generic.length)]; if(error)uiToast(`Gemini 未连接：${String(error).slice(0,90)}`); }
  S.chats[id].push({id:uid(),role:'assistant',text:reply,ts:Date.now(),source}); addNotification(c.name,reply,'messages'); save(); render();
}
function rememberFromChat(id,text){
  S.memories[id] ||= []; S.relationships[id] ||= {score:50,label:'熟悉',secrets:[]};
  if(text.length>10 && /(喜欢|讨厌|记得|以后|我会|我不|生日|明天|下周|重要)/.test(text)){S.memories[id].unshift({id:uid(),text:text.slice(0,90),importance:/重要|生日|讨厌|喜欢/.test(text)?3:2,ts:Date.now()});S.memories[id]=S.memories[id].slice(0,30)}
  S.relationships[id].score=Math.min(100,(S.relationships[id].score||50)+1);
  const sc=S.relationships[id].score;S.relationships[id].label=sc>82?'很亲密':sc>65?'亲近':sc>45?'熟悉':'疏远';
}
function localWorldPulse(){
  if(S.characters.length<1)return; const c=S.characters[Math.floor(Math.random()*S.characters.length)];
  S.chats[c.id] ||= []; const texts=['刚刚路过一家店，第一反应居然是你会喜欢。','你今天安静得有点过分。','突然想起你之前说的那件事。','别忘了吃东西。这个不是建议。','我本来不想发消息的。算了。']; const text=texts[Math.floor(Math.random()*texts.length)];
  S.chats[c.id].push({id:uid(),role:'assistant',text,ts:Date.now(),proactive:true});addNotification(c.name,text,'messages');
  if(Math.random()<.65){const post=['今天的风有点像旧照片。','有些普通瞬间，反而最难忘。','突然很想把今天保存下来。','雨停以后，街上闻起来很干净。'][Math.floor(Math.random()*4)];const comments=[];const other=S.characters.find(x=>x.id!==c.id);if(other&&Math.random()<.7)comments.push({who:other.id,text:['你又开始了。','这句倒是挺像你。','我知道你在说谁。'][Math.floor(Math.random()*3)]});S.moments.unshift({id:uid(),who:c.id,text:post,ts:Date.now(),likes:Math.floor(Math.random()*12),comments})}
  if(S.characters.length>1&&Math.random()<.8){const b=S.characters.find(x=>x.id!==c.id);S.privateChats.unshift({id:uid(),a:c.id,b:b.id,ts:Date.now(),messages:[{who:c.id,text:'她今天是不是有点累？'},{who:b.id,text:'你自己去问。别绕我。'}]})}
  const r=S.relationships[c.id]||(S.relationships[c.id]={score:50,label:'熟悉',secrets:[]});if(Math.random()<.35&&r.secrets.length<8)r.secrets.push(['其实很在意你有没有回消息。','把你随口说过的话记下来了。','有一件事想告诉你，但还没找到时机。'][Math.floor(Math.random()*3)]);
  S.worldMeta.lastPulse=Date.now(); save();
}
function runElapsedWorld(){const elapsed=Date.now()-(S.worldMeta?.lastPulse||Date.now());if(S.worldMeta?.auto&&elapsed>Math.max(4,S.worldMeta.pulseMinutes||8)*60000)localWorldPulse()}
function startCall(id){const c=ch(id);if(!c)return;const started=Date.now();const overlay=document.createElement('div');overlay.className='call-overlay';overlay.innerHTML=`<div class="call-card">${avatar(c)}<small>ELSEWHERE CALL</small><h2>${esc(c.name)}</h2><p id="callState">正在连接…</p><div class="call-rings">connecting</div><button id="hangup">挂断</button></div>`;document.body.appendChild(overlay);setTimeout(()=>{const el=$('#callState');if(el)el.textContent='已接通 · 00:01'},900);$('#hangup').onclick=()=>{S.callLogs.unshift({id:uid(),character:id,ts:started,duration:Math.max(1,Math.floor((Date.now()-started)/1000))});save();overlay.remove()}}
function exportCharacterCards(){const cards=S.characters.map(c=>({...c,memory:S.memories[c.id]||[],relationship:S.relationships[c.id]||null}));const blob=new Blob([JSON.stringify({format:'elsewhere-character-cards',version:1,cards},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='elsewhere-character-cards.json';a.click();URL.revokeObjectURL(a.href)}
function studyTick(){clearInterval(timer); if(!S.study.running)return; S.study.lastTick=Date.now(); timer=setInterval(()=>{ if(!S.study.running){clearInterval(timer);return;} if(S.study.seconds>0) S.study.seconds--; else {S.study.running=false; S.study.totalMinutes+=25; addNotification('书房','这一轮专注结束了。休息一下吧。','study'); clearInterval(timer);} const el=$('#timerText'); if(el){const m=String(Math.floor(S.study.seconds/60)).padStart(2,'0'),s=String(S.study.seconds%60).padStart(2,'0');el.textContent=`${m}:${s}`;} },1000)}


async function socialWrite(path,body){try{const r=await fetch(path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw 0;return await r.json()}catch{uiToast('社交服务暂时离线');return null}}
async function pushProfile(){await socialWrite('/api/social/profile',{id:S.social.userId,...S.owner});}
async function editProfile(){
  const v=await uiForm({title:'Edit Profile',subtitle:'名字、用户名、简介、状态和标签一次改完。',fields:[
    {name:'name',label:'显示名字',value:S.owner.name||'',placeholder:'名字'},
    {name:'handle',label:'用户名',value:S.owner.handle||'',placeholder:'例如 ann'},
    {name:'bio',label:'个人简介',value:S.owner.bio||'',multiline:true,placeholder:'写一点关于你'},
    {name:'status',label:'现在的状态',value:S.owner.status||'',placeholder:'一句很轻的近况'},
    {name:'tags',label:'标签',value:(S.owner.tags||[]).join(', '),placeholder:'study, music, scrapbook'}
  ]}); if(!v)return;
  Object.assign(S.owner,{name:v.name||'Elsewhere user',handle:(v.handle||'user').replace(/\s+/g,'').slice(0,24),bio:v.bio||'',status:v.status||'',tags:(v.tags||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,8)});
  save();await pushProfile();render();uiToast('资料已更新');
}
function pickProfileImage(kind){const input=document.createElement('input');input.type='file';input.accept='image/*';input.onchange=()=>{const f=input.files?.[0];if(!f)return;const r=new FileReader();r.onload=async()=>{S.owner[kind]=r.result;save();await pushProfile();render();uiToast(kind==='avatar'?'头像已更新':'封面已更新')};r.readAsDataURL(f)};input.click()}
function editAppAppearance(k){
  const a=apps.find(i=>i[0]===k);if(!a)return;const cur=S.custom.aliases[k]||{};const hidden=S.custom.hiddenApps.includes(k);
  const wrap=document.createElement('div');wrap.className='ew-modal-wrap app-edit-wrap';wrap.innerHTML=`<div class="ew-modal-scrim" data-close-app-editor></div><section class="ew-dialog app-editor"><div class="app-editor-head"><small>APP APPEARANCE</small><h3>${esc(cur.label||a[2])}</h3><p>默认使用小星星。你想要时，可以上传自己的图片替换。</p></div><label class="app-editor-field">名字<input id="appEditName" value="${esc(cur.label||a[2])}"></label><div class="app-icon-preview">${cur.src?`<img src="${esc(cur.src)}">`:'<span>no icon</span>'}</div><div class="app-editor-actions"><button data-app-upload-icon>上传图标</button>${cur.src?'<button data-app-remove-icon>移除图标</button>':''}<button data-app-toggle-visibility>${hidden?'显示 App':'隐藏 App'}</button></div><div class="ew-dialog-actions"><button class="ew-dialog-secondary" data-close-app-editor>取消</button><button class="ew-dialog-primary" data-save-app-editor>保存</button></div></section>`;uiLayer().appendChild(wrap);requestAnimationFrame(()=>wrap.classList.add('show'));
  const close=()=>wrap.remove();wrap.querySelectorAll('[data-close-app-editor]').forEach(b=>b.onclick=close);
  wrap.querySelector('[data-app-upload-icon]').onclick=()=>{const input=document.createElement('input');input.type='file';input.accept='image/*';input.onchange=()=>{const f=input.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{cur.src=r.result;const pv=wrap.querySelector('.app-icon-preview');pv.innerHTML=`<img src="${esc(cur.src)}">`};r.readAsDataURL(f)};input.click()};
  wrap.querySelector('[data-app-remove-icon]')?.addEventListener('click',()=>{delete cur.src;wrap.querySelector('.app-icon-preview').innerHTML='<span>no icon</span>'});
  wrap.querySelector('[data-app-toggle-visibility]').onclick=()=>{if(S.custom.hiddenApps.includes(k))S.custom.hiddenApps=S.custom.hiddenApps.filter(i=>i!==k);else S.custom.hiddenApps.push(k);wrap.querySelector('[data-app-toggle-visibility]').textContent=S.custom.hiddenApps.includes(k)?'显示 App':'隐藏 App'};
  wrap.querySelector('[data-save-app-editor]').onclick=()=>{cur.label=wrap.querySelector('#appEditName').value.trim()||a[2];S.custom.aliases[k]=cur;save();close();render();uiToast('App 外观已保存')};
}
let homeNavDelegated=false;
function ensureHomeNavigation(){
  if(homeNavDelegated)return;
  homeNavDelegated=true;
  document.addEventListener('click',e=>{
    const homeBtn=e.target.closest?.('[data-home]');
    if(homeBtn){e.preventDefault();e.stopPropagation();open('home');return;}
  },true);
}


function openFolder(id){
  const f=folderById(id); if(!f)return;
  const wrap=document.createElement('div');wrap.className='ew-modal-wrap folder-wrap';
  const contents=(f.apps||[]).map(k=>{const a=apps.find(x=>x[0]===k);return a?`<div class="folder-item">${icon(...a)}${homeEdit?`<button class="folder-remove" data-folder-remove="${k}">移出</button>`:''}</div>`:''}).join('');
  wrap.innerHTML=`<div class="ew-modal-scrim" data-folder-close></div><section class="ew-dialog folder-dialog"><header><div><small>FOLDER</small><h3>${esc(f.name)}</h3></div><button data-folder-rename>改名</button></header><div class="folder-grid">${contents||'<p class="quiet-copy">把 App 拖到这里。</p>'}</div><div class="ew-dialog-actions"><button class="ew-dialog-primary" data-folder-close>完成</button></div></section>`;
  uiLayer().appendChild(wrap);requestAnimationFrame(()=>wrap.classList.add('show'));
  wrap.querySelectorAll('[data-folder-close]').forEach(x=>x.onclick=()=>{wrap.classList.remove('show');setTimeout(()=>wrap.remove(),150)});
  wrap.querySelectorAll('[data-open]').forEach(x=>x.onclick=()=>{wrap.remove();open(x.dataset.open)});
  wrap.querySelectorAll('[data-folder-remove]').forEach(x=>x.onclick=()=>{f.apps=f.apps.filter(k=>k!==x.dataset.folderRemove);S.custom.homeLayout.push(x.dataset.folderRemove);save();wrap.remove();render()});
  wrap.querySelector('[data-folder-rename]')?.addEventListener('click',async()=>{const v=await uiForm({title:'Edit Folder',fields:[{name:'name',label:'文件夹名称',value:f.name}]});if(v?.name){f.name=v.name;save();wrap.remove();render()}});
}
function createFolderFromApps(dragKey,targetKey){
  if(!dragKey||!targetKey||dragKey===targetKey)return null;
  const a=S.custom.homeLayout||[];
  const di=a.indexOf(dragKey), ti=a.indexOf(targetKey); if(di<0||ti<0)return null;
  const insert=Math.min(di,ti), id='f-'+uid();
  S.custom.homeLayout=a.filter(x=>x!==dragKey&&x!==targetKey);
  S.custom.homeLayout.splice(Math.min(insert,S.custom.homeLayout.length),0,'folder:'+id);
  S.custom.folders.push({id,name:'文件夹',apps:[targetKey,dragKey]}); save(); return id;
}
function reorderWidget(dragId,targetId){
  if(!dragId||!targetId||dragId===targetId)return;
  const a=S.custom.homeWidgets||[], di=a.findIndex(w=>w.id===dragId), ti=a.findIndex(w=>w.id===targetId); if(di<0||ti<0)return;
  const [w]=a.splice(di,1); const target=a.findIndex(x=>x.id===targetId); w.page=a[target]?.page??w.page; a.splice(Math.max(0,target),0,w); save();
}
function clearDragUI(){document.body.classList.remove('ew-dragging');document.querySelectorAll('.is-drag-source,.is-drop-target,.is-folder-target').forEach(x=>x.classList.remove('is-drag-source','is-drop-target','is-folder-target'));}
async function createHomeFolder(){
  const v=await uiForm({title:'New Folder',subtitle:'在同一张卡里完成。',fields:[{name:'name',label:'文件夹名称',value:'My Folder',placeholder:'文件夹名称'}]}); if(!v?.name)return;
  const id='f-'+uid(); S.custom.folders.push({id,name:v.name,apps:[]}); S.custom.homeLayout.push('folder:'+id); save(); render(); uiToast('文件夹已建立，把 App 拖进去就好');
}
function moveLayoutEntry(key,targetKey,before=true){
  const a=S.custom.homeLayout; const i=a.indexOf(key); if(i<0)return; a.splice(i,1); const j=a.indexOf(targetKey); if(j<0){a.push(key);save();return;} a.splice(j+(before?0:1),0,key); save();
}
function pageInsertIndex(page){
  page=Math.max(0,Number(page)||0); return Math.min(S.custom.homeLayout.length,(page+1)*8);
}
function moveAppToPage(key,page){
  const a=S.custom.homeLayout; const i=a.indexOf(key); if(i<0)return; a.splice(i,1); const insert=Math.min(a.length,pageInsertIndex(page)); a.splice(insert,0,key); S.custom.homePageCount=Math.max(Number(S.custom.homePageCount)||2,page+1); save();
}

function addAppToFolder(key,fid){
  const f=folderById(fid); if(!f||f.apps.includes(key))return; S.custom.homeLayout=S.custom.homeLayout.filter(x=>x!==key); f.apps.push(key); save();
}
async function widgetActionSheet(id){
  const w=(S.custom.homeWidgets||[]).find(x=>x.id===id); if(!w)return;
  const wrap=document.createElement('div'); wrap.className='ew-modal-wrap widget-action-sheet';
  wrap.innerHTML=`<div class="ew-modal-scrim" data-widget-action-close></div><section class="ew-dialog ew-sheet compact-action-sheet"><div class="sheet-handle"></div><div class="sheet-title"><div><small>WIDGET</small><h3>${esc(HOME_WIDGET_TYPES[w.type]||w.type)}</h3><p>${(Number(w.page)||0)===0?'Home 01':`Home ${String((Number(w.page)||0)+1).padStart(2,'0')}`}</p></div><button data-widget-action-close>×</button></div><div class="widget-action-buttons"><button data-widget-action-edit>编辑组件</button><button class="danger-soft" data-widget-action-delete>删除组件</button></div></section>`;
  uiLayer().appendChild(wrap); requestAnimationFrame(()=>wrap.classList.add('show'));
  const close=()=>{wrap.classList.remove('show');setTimeout(()=>wrap.remove(),140)};
  wrap.querySelectorAll('[data-widget-action-close]').forEach(x=>x.onclick=close);
  wrap.querySelector('[data-widget-action-edit]').onclick=()=>{close();setTimeout(()=>editWidgetSheet(id),150)};
  wrap.querySelector('[data-widget-action-delete]').onclick=async()=>{
    const ok=await uiConfirm({title:'删除这个 Widget？',message:'删除后可以再从组件库添加回来。',confirmText:'删除',cancelText:'取消',danger:true});
    if(!ok)return; S.custom.homeWidgets=(S.custom.homeWidgets||[]).filter(x=>x.id!==id); save(); close(); render(); uiToast('Widget 已删除');
  };
}

function phoneOSBind(){
  const phone=$('.phone'); if(!phone)return;
  clearDragUI(); dragState=null;
  $$('[data-folder-open]').forEach(x=>x.onclick=e=>{e.stopPropagation();if(!homeEdit)openFolder(x.dataset.folderOpen)});
  $$('[data-home-edit-open]').forEach(x=>x.onclick=e=>{e.preventDefault();e.stopPropagation();if(homeEdit)return;homeStudioSheet(homePage)});
  $$('[data-home-edit-done]').forEach(x=>x.onclick=e=>{e.preventDefault();e.stopPropagation();homeEdit=false;dragState=null;clearDragUI();save();render();uiToast('主页已整理好')});
  $$('[data-widget-library-page]').forEach(x=>x.onclick=()=>widgetLibrarySheet(Number(x.dataset.widgetLibraryPage)||0));
  $$('[data-widget-config]').forEach(x=>x.onclick=e=>{e.preventDefault();e.stopPropagation();widgetActionSheet(x.dataset.widgetConfig)});
  $('[data-page-wallpaper]')?.addEventListener('click',()=>wallpaperStudio(homePage));
  $('[data-home-add-page]')?.addEventListener('click',()=>{S.custom.homePageCount=Math.max(2,Number(S.custom.homePageCount)||2)+1;save();render();uiToast('已增加一个主页')});
  $('[data-shade-close]')?.addEventListener('click',()=>{shadeOpen=false;$('#notificationShade')?.classList.remove('open')});
  $('[data-notif-read]')?.addEventListener('click',()=>{S.notifications.forEach(n=>n.read=true);save();render()});
  $('[data-notif-clear]')?.addEventListener('click',()=>{S.notifications=[];save();render()});
  const lockPages=$('#lockPages'); if(lockPages){lockPages.addEventListener('scroll',()=>{const i=Math.round(lockPages.scrollLeft/(lockPages.clientWidth||1));$$('.lock-dots i').forEach((d,j)=>d.classList.toggle('active',i===j))},{passive:true})}

  if(!homeEdit) return;

  // Edit mode is deliberate: normal card/icon taps are disabled. Only the visible
  // drag handles start a drag, which avoids accidental navigation on iOS.
  $$('.home-page [data-open], .home-page [data-folder-open]').forEach(el=>{
    el.onclick=e=>{e.preventDefault();e.stopPropagation()};
  });

  const pages=$('#homePages');
  const pageWidth=()=>pages?.clientWidth||1;
  const setPage=p=>{
    const count=$$('.home-page',pages).length;
    homePage=Math.max(0,Math.min(count-1,p));
    pages?.scrollTo({left:homePage*pageWidth(),behavior:'smooth'});
    $$('[data-home-dot]').forEach((d,i)=>d.classList.toggle('active',i===homePage));
  };
  const pageAtPoint=(x,y)=>{
    const el=document.elementFromPoint(x,y)?.closest?.('.home-page');
    return el?Number(el.dataset.appPage)||0:homePage;
  };
  const makeGhost=(source,kind)=>{
    const g=source.cloneNode(true);g.classList.add('drag-ghost',kind==='widget'?'widget-drag-ghost':'app-drag-ghost');
    g.querySelectorAll('.widget-edit-controls,.home-drag-handle').forEach(n=>n.remove());
    document.body.appendChild(g);return g;
  };
  const nearestTarget=(x,y,selector,source)=>{
    const nodes=[...document.querySelectorAll(selector)].filter(n=>n!==source && n.getBoundingClientRect().width>0);
    let best=null,dist=Infinity;
    for(const n of nodes){const r=n.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;const d=Math.hypot(x-cx,y-cy);if(d<dist){dist=d;best=n}}
    return best;
  };
  const clearTargets=()=>document.querySelectorAll('.is-drop-target').forEach(n=>n.classList.remove('is-drop-target'));
  const reorderApp=(key,targetKey,targetPage)=>{
    const layout=ensureHomeLayout();
    const from=layout.indexOf(key); if(from<0)return;
    layout.splice(from,1);
    let at=targetKey?layout.indexOf(targetKey):-1;
    if(at<0) at=Math.min(layout.length,pageInsertIndex(targetPage));
    layout.splice(at,0,key); S.custom.homeLayout=layout;
  };

  const bindDragHandle=(handle,kind)=>{
    const source=kind==='widget'?handle.closest('.home-widget'):handle.closest('[data-app-key],.folder-icon');
    if(!source)return;
    let st=null,frame=0;
    const paint=()=>{
      frame=0;if(!st||!st.active)return;
      st.ghost.style.transform=`translate3d(${st.x}px,${st.y}px,0) translate(-50%,-50%) scale(1.06)`;
      const target=nearestTarget(st.x,st.y,kind==='widget'?'.home-widget':'[data-app-key],.folder-icon',source);
      if(target!==st.target){st.target?.classList.remove('is-drop-target');st.target=target;target?.classList.add('is-drop-target')}
      const pr=pages?.getBoundingClientRect();
      if(pr){const now=performance.now();if(now-st.lastEdge>430){if(st.x>pr.right-34&&homePage<$$('.home-page',pages).length-1){st.lastEdge=now;setPage(homePage+1)}else if(st.x<pr.left+34&&homePage>0){st.lastEdge=now;setPage(homePage-1)}}}
    };
    const activate=()=>{
      if(!st||st.active)return;st.active=true;st.ghost=makeGhost(source,kind);source.classList.add('is-drag-source');document.body.classList.add('ew-dragging');navigator.vibrate?.(7);paint();
    };
    const cleanup=(rerender=false)=>{
      cancelAnimationFrame(frame);frame=0;st?.ghost?.remove();source.classList.remove('is-drag-source');clearTargets();document.body.classList.remove('ew-dragging');st=null;if(rerender)render();
    };
    handle.onpointerdown=e=>{
      if(e.pointerType==='mouse'&&e.button!==0)return;
      e.preventDefault();e.stopPropagation();handle.setPointerCapture?.(e.pointerId);
      st={id:e.pointerId,sx:e.clientX,sy:e.clientY,x:e.clientX,y:e.clientY,ghost:null,active:false,source,target:null,page:Number(source.closest('.home-page')?.dataset.appPage)||0,lastEdge:0};
      handle.classList.add('is-held');
    };
    handle.onpointermove=e=>{
      if(!st||e.pointerId!==st.id)return;e.preventDefault();e.stopPropagation();st.x=e.clientX;st.y=e.clientY;
      if(!st.active&&Math.hypot(st.x-st.sx,st.y-st.sy)>7)activate();
      if(st.active&&!frame)frame=requestAnimationFrame(paint);
    };
    handle.onpointerup=e=>{
      if(!st||e.pointerId!==st.id)return;e.preventDefault();e.stopPropagation();handle.classList.remove('is-held');
      if(!st.active){cleanup(false);return;}
      const targetPage=pageAtPoint(st.x,st.y);
      if(kind==='widget'){
        const wid=source.dataset.homeWidgetId,twid=st.target?.dataset.homeWidgetId;const w=(S.custom.homeWidgets||[]).find(x=>x.id===wid);
        if(w){w.page=targetPage;if(twid&&twid!==wid)reorderWidget(wid,twid)}
      }else{const key=source.dataset.appKey;if(key){const targetKey=st.target?.dataset.appKey;reorderApp(key,targetKey,targetPage)}}
      save();cleanup(true);
    };
    handle.onpointercancel=()=>{handle.classList.remove('is-held');cleanup(true)};
  };
  $$('[data-app-drag-handle]').forEach(h=>bindDragHandle(h,'app'));
  $$('[data-widget-drag-handle]').forEach(h=>bindDragHandle(h,'widget'));
}


let iosTouchGesturesBound=false;
function envSafeBottom(){
  // CSS env() cannot be read directly in JS; this keeps the home gesture edge narrow
  // while leaving enough room for iPhone's home-indicator area.
  return 18;
}
function ensureIOSTouchGestures(){
  if(iosTouchGesturesBound)return;
  iosTouchGesturesBound=true;
  let g=null;
  const ignored=el=>!!el?.closest?.('input,textarea,select,[contenteditable="true"],.ew-modal-wrap,.ew-dialog,.ew-sheet');
  const start=e=>{
    const t=e.touches?.[0]; if(!t)return;
    const phone=document.querySelector('.phone'); if(!phone||!phone.contains(e.target)||ignored(e.target))return;
    const r=phone.getBoundingClientRect();
    g={sx:t.clientX,sy:t.clientY,x:t.clientX,y:t.clientY,phoneRect:r,target:e.target,done:false,
       top:(t.clientY-r.top)<Math.max(96,r.height*.14), bottomEdge:(r.bottom-t.clientY)<Math.max(54,envSafeBottom()+42)};
  };
  const move=e=>{
    if(!g||g.done)return;
    const t=e.touches?.[0]; if(!t)return;
    g.x=t.clientX;g.y=t.clientY;
    const dx=g.x-g.sx,dy=g.y-g.sy,adx=Math.abs(dx),ady=Math.abs(dy);

    // Horizontal launcher paging is handled natively by the scroll-snap container.
    // Keeping JS out of this path avoids double-scrolling / jitter on iOS Safari.

    if(ady>42&&ady>adx*1.12){
      // Pull down from the upper part of Elsewhere to open notifications.
      if(g.top&&dy>0&&!S.locked){
        e.preventDefault();shadeOpen=true;document.querySelector('#notificationShade')?.classList.add('open');g.done=true;return;
      }
      // Lock screen / any app: swipe up decisively.
      if(dy<0){
        if(S.locked){e.preventDefault();lockStage='passcode';passcodeBuffer='';g.done=true;render();return;}
        if(current!=='home'&&g.bottomEdge&&ady>58){
          e.preventDefault();g.done=true;open('home');return;
        }
      }
    }
  };
  const end=e=>{
    if(!g){return;}
    const dx=g.x-g.sx,dy=g.y-g.sy;
    const moved=Math.hypot(dx,dy);
    const opener=g.target?.closest?.('[data-open]');
    // iOS Safari can suppress the synthetic click after a touch gesture listener.
    // Treat a short, stationary touch as a real tap and navigate here directly.
    // In home edit mode, every tap that starts inside a home page belongs to the
    // editor. Never turn it into navigation — even if the finger barely moved.
    // This fixes the iOS touchend path that used to bypass the normal click guard
    // and unexpectedly exit edit mode when touching a widget or its handle.
    const editingHomeTarget=homeEdit && !!g.target?.closest?.('.home-page');
    if(!g.done && moved<18 && opener && !editingHomeTarget){
      const target=opener.dataset.open;
      g.done=true;
      if(e.cancelable)e.preventDefault();
      e.stopPropagation?.();
      open(target);
      // Ignore the delayed synthetic click Safari may emit afterwards.
      window.__elsewhereIgnoreClickUntil=Date.now()+450;
    }
    g=null;
  };
  document.addEventListener('touchstart',start,{passive:true,capture:true});
  document.addEventListener('touchmove',move,{passive:false,capture:true});
  document.addEventListener('touchend',end,{passive:false,capture:true});
  document.addEventListener('touchcancel',()=>{g=null},{passive:true,capture:true});
}
function updateHomeDots(){
  document.querySelectorAll('.home-page-dots button').forEach((d,i)=>d.classList.toggle('active',i===homePage));
}
function updatePasscodeDots(){const el=document.querySelector('[data-passcode-dots]');if(!el)return;[...el.children].forEach((d,i)=>d.classList.toggle('filled',i<passcodeBuffer.length));}
function checkPasscode(){
  if(passcodeBuffer===String(S.settings.passcode||'0000')){S.locked=false;lockStage='welcome';passcodeBuffer='';render();return;}
  const p=document.querySelector('.passcode-panel');p?.classList.add('wrong');setTimeout(()=>p?.classList.remove('wrong'),360);passcodeBuffer='';updatePasscodeDots();
}
function bind(){
  document.querySelectorAll('button').forEach(btn=>{
    if(btn.matches('[aria-disabled="true"],:disabled')) btn.classList.add('is-disabled-control');
  });
  ensureHomeNavigation();
  aiStatus(true);
  ensureIOSTouchGestures();
  // iOS Safari: delegated navigation keeps widgets/dock tappable even after touch/long-press handlers.
  // While arranging the home screen, pointer/touch releases inside a home page
  // must never become navigation events.
  const phoneRoot=$('.phone');
  phoneRoot?.addEventListener('click',e=>{if((window.__elsewhereIgnoreClickUntil||0)>Date.now()){e.preventDefault();e.stopPropagation();return;}const x=e.target.closest?.('[data-open]');if(!x)return;if(homeEdit&&x.closest('.home-page')){e.preventDefault();e.stopPropagation();return;}e.preventDefault();e.stopPropagation();open(x.dataset.open)},true);
  phoneOSBind();
  $$('[data-passcode-open]').forEach(x=>x.onclick=()=>{lockStage='passcode';passcodeBuffer='';render()});
  $('[data-passcode-back]')?.addEventListener('click',()=>{lockStage='welcome';passcodeBuffer='';render()});
  $$('[data-passcode-key]').forEach(x=>x.onclick=()=>{if(passcodeBuffer.length>=4)return;passcodeBuffer+=x.dataset.passcodeKey;updatePasscodeDots();if(passcodeBuffer.length===4)setTimeout(checkPasscode,90)});
  $('[data-passcode-delete]')?.addEventListener('click',()=>{passcodeBuffer=passcodeBuffer.slice(0,-1);updatePasscodeDots()});
  $$('[data-home]').forEach(x=>x.onclick=e=>{e.preventDefault();e.stopPropagation();open('home')});
  $$('[data-open]').forEach(x=>x.onclick=e=>{e.stopPropagation();if(homeEdit&&x.closest('.home-page')){e.preventDefault();e.stopPropagation();return;}open(x.dataset.open)});
  const homePages=$('#homePages'); if(homePages){
    requestAnimationFrame(()=>{homePages.scrollLeft=homePage*homePages.clientWidth});
    let raf=0, snapTimer=0, swipe=null;
    const pageCount=()=>$$('.home-page',homePages).length;
    const snapTo=(page,behavior='smooth')=>{
      const w=homePages.clientWidth||1;
      homePage=Math.max(0,Math.min(pageCount()-1,Number(page)||0));
      homePages.scrollTo({left:homePage*w,behavior});
      $$('[data-home-dot]').forEach((d,i)=>d.classList.toggle('active',i===homePage));
    };
    homePages.addEventListener('touchstart',e=>{
      const t=e.touches?.[0]; if(!t||homeEdit)return;
      const w=homePages.clientWidth||1;
      swipe={x:t.clientX,y:t.clientY,page:Math.round(homePages.scrollLeft/w)};
      clearTimeout(snapTimer);
    },{passive:true});
    homePages.addEventListener('touchend',e=>{
      if(!swipe||homeEdit)return;
      const t=e.changedTouches?.[0]; if(!t){swipe=null;return;}
      const dx=t.clientX-swipe.x, dy=t.clientY-swipe.y;
      let target=swipe.page;
      if(Math.abs(dx)>Math.abs(dy)*1.15 && Math.abs(dx)>34) target += dx<0?1:-1;
      else target=Math.round(homePages.scrollLeft/(homePages.clientWidth||1));
      swipe=null;
      // Settle only after the finger is up. This keeps native movement fluid but
      // prevents iOS Safari from stopping between pages.
      requestAnimationFrame(()=>snapTo(target,'smooth'));
    },{passive:true});
    homePages.addEventListener('scroll',()=>{
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{
        const w=homePages.clientWidth||1;
        const nearest=Math.round(homePages.scrollLeft/w);
        $$('[data-home-dot]').forEach((d,i)=>d.classList.toggle('active',i===nearest));
        clearTimeout(snapTimer);
        snapTimer=setTimeout(()=>{
          if(!homeEdit && !swipe){homePage=nearest;const off=Math.abs(homePages.scrollLeft-nearest*w);if(off>2)snapTo(nearest,'smooth');}
        },90);
      });
    },{passive:true});
    $$('[data-home-dot]').forEach(d=>d.onclick=()=>snapTo(Number(d.dataset.homeDot)||0,'smooth'));
  }
  $$('[data-chat]').forEach(x=>x.onclick=()=>open('messages',x.dataset.chat));
  $$('[data-chat-send]').forEach(x=>x.onclick=()=>{const inp=$('#chatInput');sendChat(x.dataset.chatSend,inp.value.trim())});
  const ci=$('#chatInput'); if(ci)ci.onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('[data-chat-send]')?.click()}};
  $$('[data-thomas-quick]').forEach(x=>x.onclick=()=>sendThomas(x.dataset.thomasQuick));
  $$('[data-thomas-action]').forEach(x=>x.onclick=()=>{const action=x.dataset.thomasAction;if(action==='mood'){open('mood');return;}if(action==='focus'){S.study.seconds=25*60;S.study.running=true;S.study.lastTick=Date.now();save();open('study');uiToast('25 分钟专注已开始');studyTick();}});
  $('[data-thomas-send]')?.addEventListener('click',()=>{const i=$('#thomasInput');sendThomas(i.value.trim())});
  $('[data-thomas-plus]')?.addEventListener('click',()=>uiAlert({title:'Thomas 快捷入口',message:'你可以直接输入待办、心情、学习计划，Thomas 会按当前语气回复。图片功能也可以从旁边的图标添加。'}));
  $('[data-thomas-attach]')?.addEventListener('click',()=>chooseImageFile(data=>{S.photos.unshift({id:uid(),src:data,caption:'来自 Thomas 对话',ts:Date.now()});save();uiToast('图片已保存到相册；下一步可以在对话里告诉 Thomas 你想聊什么。')}));
  $('#thomasInput')?.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('[data-thomas-send]')?.click()}});
  $('[data-thomas-clear]')?.addEventListener('click',async()=>{if(await uiConfirm({title:'清空聊天',message:'清空和 Thomas 的聊天记录？',confirmText:'清空',danger:true})){S.thomas=[];persistRender();uiToast('Thomas 的聊天记录已清空')}});
  $('[data-thomas-style]')?.addEventListener('click',()=>open('settings'));
  $$('[data-thomas-range]').forEach(x=>x.oninput=()=>{S.settings.thomasProfile[x.dataset.thomasRange]=Number(x.value);save();const b=x.closest('label')?.querySelector('b');if(b)b.textContent=x.value});
  $('[data-thomas-address]')?.addEventListener('change',e=>{S.settings.thomasProfile.address=e.target.value.trim()||'Ann';save()});
  $('[data-thomas-base]')?.addEventListener('change',e=>{S.settings.thomasProfile.base=e.target.value.trim()||defaultState.settings.thomasProfile.base;save()});
  $('[data-thomas-learn]')?.addEventListener('change',e=>{S.settings.thomasProfile.learn=e.target.checked;save()});
  $('[data-thomas-forget]')?.addEventListener('click',async()=>{if(await uiConfirm({title:'清除学习偏好',message:'Thomas 手动滑杆会保留，只清除他后来学会的语气。',confirmText:'清除'})){S.settings.thomasLearned=[];persistRender();uiToast('已清除 Thomas 的学习偏好')}});
  $('[data-ai-test]')?.addEventListener('click',async()=>{const b=$('[data-ai-test]');if(b){b.disabled=true;b.textContent='Testing…'}try{const r=await fetch('/api/ai-test',{method:'POST'});const d=await r.json();if(r.ok)uiAlert({title:'Gemini 已连接',message:`${d.model||'Gemini'} 回应正常：${d.content||'OK'}`});else uiAlert({title:'Gemini 连接失败',message:d.error||`HTTP ${r.status}`});}catch(e){uiAlert({title:'Gemini 连接失败',message:String(e.message||e)})}finally{if(b){b.disabled=false;b.textContent='Test AI'}aiStatus(true)}});
  $$('[data-todo]').forEach(x=>x.onchange=()=>{const t=S.todos.find(t=>t.id===x.dataset.todo);t.done=x.checked;persistRender()});
  $$('[data-todo-tab]').forEach(x=>x.onclick=()=>{todoTab=x.dataset.todoTab;render()});
  $('[data-add-todo]')?.addEventListener('click',async()=>{const text=await ask('新的待办','',{placeholder:'例如：完成作业'});if(text){S.todos.unshift({id:uid(),text,done:false});persistRender();uiToast('已加入待办')}});
  $$('[data-del-todo]').forEach(x=>x.onclick=e=>{e.preventDefault();S.todos=S.todos.filter(t=>t.id!==x.dataset.delTodo);persistRender()});
  $$('[data-habit]').forEach(x=>x.onclick=()=>{const h=S.habits.find(h=>h.id===x.dataset.habit);h.done=!h.done;persistRender()});
  $('[data-add-habit]')?.addEventListener('click',async()=>{const name=await ask('新的习惯','',{placeholder:'例如：阅读 30 分钟'});if(name){S.habits.push({id:uid(),name,detail:'today',streak:0,done:false});persistRender();uiToast('习惯已加入')}});
  $('[data-add-event]')?.addEventListener('click',async()=>{const v=await uiForm({title:'New Event',fields:[{name:'title',label:'事件名称',value:''},{name:'date',label:'日期',type:'date',value:today()},{name:'time',label:'时间',type:'time',value:'12:00'}]});if(!v?.title)return;S.events.push({id:uid(),title:v.title,date:v.date||today(),time:v.time||''});persistRender();uiToast('日程已保存')});
  $('[data-calendar-prev]')?.addEventListener('click',()=>{calendarOffset--;render()});
  $('[data-calendar-next]')?.addEventListener('click',()=>{calendarOffset++;render()});
  $('[data-calendar-today]')?.addEventListener('click',()=>{calendarOffset=0;render()});
  $$('[data-del-event]').forEach(x=>x.onclick=()=>{S.events=S.events.filter(e=>e.id!==x.dataset.delEvent);persistRender()});
  $('[data-study-toggle]')?.addEventListener('click',()=>{S.study.running=!S.study.running;save();render();studyTick()});
  $$('[data-study-reset]').forEach(x=>x.onclick=()=>{S.study.seconds=Number(x.dataset.studyReset)*60;S.study.running=false;persistRender()});
  $('[data-study-custom]')?.addEventListener('click',async()=>{const v=await ask('自定义专注分钟','30',{type:'number',placeholder:'例如 30'});const mins=Math.max(1,Math.min(240,Number(v)||0));if(!mins)return;S.study.seconds=mins*60;S.study.running=false;persistRender();uiToast(`已设为 ${mins} 分钟`)});
  $('[data-add-food]')?.addEventListener('click',async()=>{const v=await uiForm({title:'Log Food',fields:[{name:'meal',label:'餐次',value:'晚餐'},{name:'name',label:'吃了什么',value:''},{name:'kcal',label:'大约热量',type:'number',value:'400'}]});if(!v?.name)return;S.food.push({id:uid(),meal:v.meal||'餐食',name:v.name,kcal:Number(v.kcal)||0});persistRender();uiToast('饮食已记录')});
  $$('[data-del-food]').forEach(x=>x.onclick=()=>{S.food=S.food.filter(f=>f.id!==x.dataset.delFood);persistRender()});
  $$('[data-water]').forEach(x=>x.onclick=()=>{S.water=Math.max(0,S.water+Number(x.dataset.water));persistRender()});
  $('[data-add-workout]')?.addEventListener('click',async()=>{const v=await uiForm({title:'Log Workout',fields:[{name:'name',label:'训练',value:'力量训练'},{name:'minutes',label:'分钟',type:'number',value:'30'},{name:'kcal',label:'大约消耗',type:'number',value:'200'}]});if(!v?.name)return;S.fitness.push({id:uid(),name:v.name,minutes:Number(v.minutes)||0,kcal:Number(v.kcal)||0});persistRender();uiToast('训练已记录')});
  $$('[data-del-workout]').forEach(x=>x.onclick=()=>{S.fitness=S.fitness.filter(f=>f.id!==x.dataset.delWorkout);persistRender()});
  $('[data-add-money]')?.addEventListener('click',async()=>{const v=await uiForm({title:'New Transaction',fields:[{name:'type',label:'类型',type:'select',value:'expense',options:[['expense','支出'],['income','收入']]},{name:'name',label:'项目',value:''},{name:'amount',label:'金额（RM）',type:'number',value:'0'}]});if(!v?.name)return;S.finance.unshift({id:uid(),type:v.type==='income'?'income':'expense',name:v.name,amount:Number(v.amount)||0});persistRender();uiToast('账目已记录')});
  $$('[data-del-money]').forEach(x=>x.onclick=()=>{S.finance=S.finance.filter(f=>f.id!==x.dataset.delMoney);persistRender()});
  $('[data-add-note]')?.addEventListener('click',async()=>{const v=await uiForm({title:'New Note',fields:[{name:'title',label:'标题',value:'untitled'},{name:'text',label:'内容',multiline:true,value:'',placeholder:'写下想留下的东西…'}]});if(!v?.title)return;S.notes.unshift({id:uid(),title:v.title,text:v.text||''});persistRender();uiToast('笔记已保存')});
  $$('[data-del-note]').forEach(x=>x.onclick=()=>{S.notes=S.notes.filter(n=>n.id!==x.dataset.delNote);persistRender()});
  $('[data-add-diary]')?.addEventListener('click',async()=>{const text=await ask('今天想留下什么？','',{multiline:true,placeholder:'普通的一天也值得被收藏。'});if(text){S.diary.push({id:uid(),date:today(),text});persistRender();uiToast('日记已保存')}});
  $$('[data-del-diary]').forEach(x=>x.onclick=()=>{S.diary=S.diary.filter(n=>n.id!==x.dataset.delDiary);persistRender()});
  $('[data-new-moment]')?.addEventListener('click',async()=>{const text=await ask('发一条朋友圈','',{multiline:true,placeholder:'这一刻想说什么？',confirmText:'发布'});if(text){S.moments.unshift({id:uid(),who:'owner',text,ts:Date.now(),likes:0});persistRender();uiToast('朋友圈已发布')}});
  $$('[data-like]').forEach(x=>x.onclick=()=>{const p=S.moments.find(p=>p.id===x.dataset.like);p.likes=(p.likes||0)+1;persistRender()});
  $('[data-add-char]')?.addEventListener('click',async()=>{const v=await uiForm({title:'New Character',fields:[{name:'name',label:'角色名字',value:''},{name:'relation',label:'关系',value:'friend',placeholder:'friend / partner / roommate…'}]});if(!v?.name)return;const idd=v.name.toLowerCase().replace(/\W/g,'')||uid();S.characters.push({id:idd,name:v.name,initial:v.name[0],relation:v.relation||'friend',status:'online',color:'#9a7580',personality:'自然、有自己的生活。',style:'像真实聊天。'});S.chats[idd]=[];persistRender();uiToast(`${v.name} 已加入 Elsewhere`)});
  $$('[data-del-char]').forEach(x=>x.onclick=async()=>{const c=ch(x.dataset.delChar);if(await uiConfirm({title:'删除角色',message:`确定要从 Elsewhere 删除 ${c?.name||'这个角色'}？聊天记录也会一起移除。`,confirmText:'删除',danger:true})){S.characters=S.characters.filter(c=>c.id!==x.dataset.delChar);delete S.chats[x.dataset.delChar];persistRender();uiToast('角色已删除')}});
  $$('[data-theme]').forEach(x=>x.onclick=()=>{S.theme=x.dataset.theme;S.custom.accent='';S.custom.paper='';S.custom.ink='';S.wallpaper='';save();applyTheme();render();uiToast('Theme 已切换')});
  $('[data-wallpaper]')?.addEventListener('click',()=>$('#photoPicker').click());
  $$('[data-wallpaper-studio]').forEach(x=>x.onclick=()=>wallpaperStudio(homePage));
  $('[data-photo-add]')?.addEventListener('click',()=>{const p=$('#photoPicker');p.dataset.mode='photo';p.click()});
  $('#photoPicker')?.addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{if(e.target.dataset.mode==='photo')S.photos.unshift({id:uid(),data:r.result});else S.wallpaper=r.result;e.target.dataset.mode='';persistRender()};r.readAsDataURL(f)});
  $$('[data-del-photo]').forEach(x=>x.onclick=()=>{S.photos=S.photos.filter(p=>p.id!==x.dataset.delPhoto);persistRender()});
  $('[data-export]')?.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(S,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='elsewhere-data.json';a.click();URL.revokeObjectURL(a.href)});
  $('[data-import]')?.addEventListener('click',()=>{const input=document.createElement('input');input.type='file';input.accept='application/json';input.onchange=()=>{const f=input.files[0];const r=new FileReader();r.onload=()=>{try{S=JSON.parse(r.result);persistRender()}catch{uiAlert({title:'导入失败',message:'这个文件不是有效的 Elsewhere 数据。'})}};r.readAsText(f)};input.click()});
  $('[data-reset]')?.addEventListener('click',async()=>{if(await uiConfirm({title:'重置 Elsewhere',message:'这会清空本机保存的角色、聊天和生活数据。这个操作不能撤销。',confirmText:'彻底重置',danger:true})){S=clone(defaultState);localStorage.removeItem(KEY);current='home';persistRender();uiToast('Elsewhere 已重置')}});
  $('[data-weather-refresh]')?.addEventListener('click',refreshWeather);
  $$('[data-peek]').forEach(x=>x.onclick=()=>open('phone',x.dataset.peek));
  $$('[data-call]').forEach(x=>x.onclick=()=>startCall(x.dataset.call));
  $$('[data-voice-send]').forEach(x=>x.onclick=async()=>{const id=x.dataset.voiceSend;const text=await ask('发送语音','嗯，我晚点再跟你说。',{multiline:true,confirmText:'发送'});if(text){S.chats[id]||=[];S.chats[id].push({id:uid(),role:'user',type:'voice',text,seconds:Math.max(2,Math.ceil(text.length/4)),ts:Date.now()});rememberFromChat(id,text);persistRender()}});
  $$('[data-play-voice]').forEach(x=>x.onclick=()=>{x.textContent=x.textContent.startsWith('▶')?'Ⅱ  playing…':'▶ voice'});
  $$('[data-comment]').forEach(x=>x.onclick=async()=>{const p=S.moments.find(p=>p.id===x.dataset.comment);const text=await ask('写评论','',{placeholder:'说点什么…',confirmText:'发布'});if(text){p.comments||=[];p.comments.push({who:'owner',text});persistRender()}});
  $$('[data-world-pulse]').forEach(x=>x.onclick=()=>{localWorldPulse();render()});
  $('[data-world-new]')?.addEventListener('click',async()=>{const name=await ask('新建世界','Another World',{placeholder:'世界存档名称'});if(name){const snapshot=JSON.stringify({characters:S.characters,chats:S.chats,moments:S.moments,memories:S.memories,relationships:S.relationships,privateChats:S.privateChats});const id='w-'+uid();S.worlds.push({id,name,createdAt:Date.now(),snapshot});S.activeWorld=id;persistRender();uiToast(`已进入 ${name}`)}});
  $$('[data-world-switch]').forEach(x=>x.onclick=()=>{const target=S.worlds.find(w=>w.id===x.dataset.worldSwitch);if(!target)return;const currentW=S.worlds.find(w=>w.id===S.activeWorld);if(currentW)currentW.snapshot=JSON.stringify({characters:S.characters,chats:S.chats,moments:S.moments,memories:S.memories,relationships:S.relationships,privateChats:S.privateChats});if(target.snapshot){try{const d=JSON.parse(target.snapshot);Object.assign(S,d)}catch{}}S.activeWorld=target.id;persistRender()});
  $('[data-card-export]')?.addEventListener('click',exportCharacterCards);
  $('[data-card-import]')?.addEventListener('click',()=>{const input=document.createElement('input');input.type='file';input.accept='application/json';input.onchange=()=>{const f=input.files[0];const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);for(const c of (d.cards||[])){const id=c.id||uid();const base={...c,id};delete base.memory;delete base.relationship;S.characters.push(base);S.chats[id]||=[];S.memories[id]=c.memory||[];S.relationships[id]=c.relationship||{score:50,label:'熟悉',secrets:[]}}persistRender()}catch{uiAlert({title:'角色卡无法导入',message:'这个文件不是有效的 Elsewhere 角色卡。'})}};r.readAsText(f)};input.click()});
  $$('.desk-widget').forEach(el=>{let sx=0,sy=0,ox=0,oy=0,moved=false;el.onpointerdown=e=>{sx=e.clientX;sy=e.clientY;ox=parseFloat(el.style.left)||0;oy=parseFloat(el.style.top)||0;el.setPointerCapture(e.pointerId);moved=false};el.onpointermove=e=>{if(!el.hasPointerCapture(e.pointerId))return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)+Math.abs(dy)>7)moved=true;el.style.left=Math.max(4,Math.min(292,ox+dx))+'px';el.style.top=Math.max(170,Math.min(690,oy+dy))+'px'};el.onpointerup=e=>{if(!el.hasPointerCapture(e.pointerId))return;el.releasePointerCapture(e.pointerId);const w=S.widgets.find(w=>w.id===el.dataset.widget);if(w){w.x=parseFloat(el.style.left);w.y=parseFloat(el.style.top);save()}if(moved)e.preventDefault()}});

  $$('[data-mood]').forEach(x=>x.onclick=async()=>{const value=Number(x.dataset.mood);const note=await ask('给今天的心情留一句话','',{multiline:true});S.moods.unshift({id:uid(),date:today(),value,note:note||''});persistRender();uiToast('心情已记录')});
  $('[data-add-mood]')?.addEventListener('click',async()=>{const v=await uiForm({title:'Mood',fields:[{name:'value',label:'心情 1–5',type:'number',value:'4'},{name:'note',label:'一句话',multiline:true,value:''}]});if(!v)return;const value=Math.max(1,Math.min(5,Number(v.value)||4));S.moods.unshift({id:uid(),date:today(),value,note:v.note||''});persistRender();uiToast('心情已记录')});
  $('[data-add-sleep]')?.addEventListener('click',async()=>{const v=await uiForm({title:'Sleep',fields:[{name:'hours',label:'睡眠小时',type:'number',value:'7.5'},{name:'quality',label:'质量 1–5',type:'number',value:'4'}]});if(!v)return;S.sleep.unshift({id:uid(),date:today(),hours:Number(v.hours)||0,quality:Math.max(1,Math.min(5,Number(v.quality)||4))});persistRender();uiToast('睡眠已记录')});
  $('[data-add-countdown]')?.addEventListener('click',async()=>{const v=await uiForm({title:'New Countdown',fields:[{name:'title',label:'名称',value:'',placeholder:'例如：旅行'},{name:'date',label:'日期',type:'date',value:today()}]});if(!v?.title||!v.date)return;S.countdowns.push({id:uid(),title:v.title,date:v.date});persistRender();uiToast('倒数日已保存')});
  $$('[data-del-countdown]').forEach(x=>x.onclick=()=>{S.countdowns=S.countdowns.filter(i=>i.id!==x.dataset.delCountdown);persistRender()});
  $('[data-add-wish]')?.addEventListener('click',async()=>{const text=await ask('加入愿望清单','',{placeholder:'想拥有、想去、想完成…'});if(text){S.wishlist.unshift({id:uid(),text,done:false});persistRender();uiToast('已加入愿望清单')}});
  $$('[data-wish]').forEach(x=>x.onchange=()=>{const w=S.wishlist.find(i=>i.id===x.dataset.wish);if(w)w.done=x.checked;persistRender()});
  $$('[data-del-wish]').forEach(x=>x.onclick=e=>{e.preventDefault();S.wishlist=S.wishlist.filter(i=>i.id!==x.dataset.delWish);persistRender()});
  $('[data-add-bookmark]')?.addEventListener('click',async()=>{const v=await uiForm({title:'New Bookmark',fields:[{name:'title',label:'名称',value:''},{name:'url',label:'网址',value:'https://'}]});if(!v?.title||!v.url)return;S.bookmarks.unshift({id:uid(),title:v.title,url:v.url});persistRender();uiToast('网页已收藏')});
  $$('[data-open-link]').forEach(x=>x.onclick=()=>window.open(x.dataset.openLink,'_blank','noopener'));
  $$('[data-del-bookmark]').forEach(x=>x.onclick=()=>{S.bookmarks=S.bookmarks.filter(i=>i.id!==x.dataset.delBookmark);persistRender()});
  $$('[data-custom]').forEach(x=>x.onchange=()=>{S.custom[x.dataset.custom]=x.value;persistRender()});
  $$('[data-custom-color]').forEach(x=>x.oninput=()=>{S.custom[x.dataset.customColor]=x.value;save();applyTheme()});
  $$('[data-custom-range]').forEach(x=>x.oninput=()=>{S.custom[x.dataset.customRange]=Number(x.value);save();applyTheme();const b=x.closest('label')?.querySelector('b');if(b)b.textContent=x.value+(x.dataset.suffix||'')});
  $$('[data-custom-choice]').forEach(x=>x.onclick=()=>{S.custom[x.dataset.customChoice]=x.dataset.value;persistRender()});
  $$('[data-app-visible]').forEach(x=>x.onchange=()=>{const k=x.dataset.appVisible;S.custom.hiddenApps=S.custom.hiddenApps.filter(i=>i!==k);if(!x.checked)S.custom.hiddenApps.push(k);persistRender()});
  $$('[data-app-edit]').forEach(x=>x.onclick=()=>editAppAppearance(x.dataset.appEdit));
  $$('[data-app-move]').forEach(x=>x.onclick=()=>{const k=x.dataset.appMove,dir=Number(x.dataset.dir);let arr=orderedApps().map(a=>a[0]);const i=arr.indexOf(k),j=Math.max(0,Math.min(arr.length-1,i+dir));[arr[i],arr[j]]=[arr[j],arr[i]];S.custom.appOrder=arr;persistRender()});
  $('[data-custom-reset]')?.addEventListener('click',async()=>{if(await uiConfirm({title:'恢复默认装扮',message:'只会恢复视觉设置，不会删除聊天、角色或生活数据。',confirmText:'恢复'})){S.custom=clone(defaultState.custom);S.theme='blush';S.wallpaper='';persistRender();uiToast('默认装扮已恢复')}});

  $$('[data-custom-toggle]').forEach(el=>el.onchange=()=>{S.custom[el.dataset.customToggle]=el.checked;persistRender()});
  $$('[data-custom-select]').forEach(el=>el.onchange=()=>{S.custom[el.dataset.customSelect]=el.value;persistRender()});

  bindWidgetControls(document);
  $('[data-social-refresh]')?.addEventListener('click',async()=>{await socialSync();render();uiToast('社交页已刷新')});
  $('[data-social-post]')?.addEventListener('click',async()=>{const text=await ask('写一条公开短帖','',{multiline:true,placeholder:'一点近况、一句话、一个小发现…'});if(!text)return;await socialWrite('/api/social/post',{author:S.social.userId,text});await socialSync();render()});
  $$('[data-view-player]').forEach(x=>x.onclick=()=>open('player',x.dataset.viewPlayer));
  $$('[data-follow-player]').forEach(x=>x.onclick=async()=>{const id=x.dataset.followPlayer;const has=S.social.following.includes(id);S.social.following=has?S.social.following.filter(i=>i!==id):[...S.social.following,id];save();await socialWrite('/api/social/follow',{from:S.social.userId,to:id,follow:!has});render()});
  $$('[data-social-like]').forEach(x=>x.onclick=async()=>{await socialWrite('/api/social/like',{postId:x.dataset.socialLike,userId:S.social.userId});await socialSync();render()});
  $$('[data-social-notes]').forEach(x=>x.onclick=()=>{const p=(S.social.feed||[]).find(p=>p.id===x.dataset.socialNotes);if(p){p._open=!p._open;render()}});
  $$('[data-social-reply]').forEach(x=>x.onclick=async()=>{const text=await ask('写留言','',{placeholder:'留一句话'});if(!text)return;await socialWrite('/api/social/note',{postId:x.dataset.socialReply,author:S.social.userId,name:S.owner.name,text});await socialSync();render()});
  $('[data-edit-profile]')?.addEventListener('click',editProfile);
  $('[data-change-passcode]')?.addEventListener('click',async()=>{const v=await uiForm({title:'修改手机密码',subtitle:'这是本机锁屏密码，用来保护你的 Elsewhere。',fields:[{name:'old',label:'当前密码',type:'password',value:''},{name:'next',label:'新密码 · 4 位数字',type:'password',value:''},{name:'confirm',label:'再次输入新密码',type:'password',value:''}]});if(!v)return;if(v.old!==String(S.settings.passcode||'0000')){uiAlert({title:'密码不正确',message:'当前密码没有对上。'});return;}if(!/^\d{4}$/.test(v.next||'')){uiAlert({title:'格式不对',message:'请输入 4 位数字密码。'});return;}if(v.next!==v.confirm){uiAlert({title:'两次密码不同',message:'请重新输入。'});return;}S.settings.passcode=v.next;save();uiToast('手机密码已修改');});
  $('[data-profile-avatar]')?.addEventListener('click',()=>pickProfileImage('avatar'));
  $('[data-profile-banner]')?.addEventListener('click',()=>pickProfileImage('banner'));
  studyTick();
}

async function refreshWeather(){
  if(!navigator.geolocation){await uiAlert({title:'无法定位',message:'当前浏览器不支持定位，天气卡会继续使用手动天气。'});return;}
  S.weather.loading=true;persistRender();
  navigator.geolocation.getCurrentPosition(async pos=>{
    try{
      const {latitude,longitude}=pos.coords;
      const url=`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
      const r=await fetch(url);const d=await r.json();
      const code=d.current?.weather_code; const desc=code===0?'晴朗':code<3?'少云':code<50?'多云':code<70?'有雨':'天气变化';
      S.weather={city:'当前位置',temp:Math.round(d.current?.temperature_2m??29).toString(),desc,low:Math.round(d.daily?.temperature_2m_min?.[0]??26).toString(),high:Math.round(d.daily?.temperature_2m_max?.[0]??30).toString(),loading:false};persistRender();
    }catch{S.weather.loading=false;persistRender();uiAlert({title:'天气暂时离线',message:'暂时没能获取实时天气，Elsewhere 会保留当前天气卡。'})}
  },()=>{S.weather.loading=false;persistRender();uiAlert({title:'定位权限未开启',message:'没有获得定位权限，所以会继续使用当前天气卡。你也可以之后在系统设置中允许定位。'})},{enableHighAccuracy:false,timeout:10000});
}

setInterval(()=>{const t=$('#statusTime');if(t)t.textContent=fmtTime();},30000);
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
runElapsedWorld();
pushProfile().then(socialSync).then(()=>render()).catch(()=>{});
setInterval(()=>{if(S.worldMeta?.auto && !S.locked && Date.now()-(S.worldMeta.lastPulse||0)>(S.worldMeta.pulseMinutes||8)*60000){localWorldPulse();render()}},60000);
render();


// v1.7 micro interaction layer — intentionally subtle and entirely inside Elsewhere.
if(!window.__elsewhereFxBound){
  window.__elsewhereFxBound=true;
  document.addEventListener('pointerdown',e=>{
    const c=S?.custom||{}; if(!c.clickEffect||c.clickEffect==='none')return;
    if(e.target.closest('input,textarea,select'))return;
    const n=Math.max(1,Math.min(4,Number(c.effectStrength)||2));
    const chars={sparkle:['✦','·','✧'],heart:['♡','·'],petal:['❀','·']}[c.clickEffect]||['✦'];
    for(let i=0;i<n;i++){
      const f=document.createElement('i');f.className='tap-fx';f.textContent=chars[i%chars.length];
      f.style.left=(e.clientX+(i-(n-1)/2)*9)+'px';f.style.top=(e.clientY+(i%2?4:-3))+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),650);
    }
  },{passive:true});
}
