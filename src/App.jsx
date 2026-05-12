import { useState, useEffect } from "react";

const DB=[{id:"b1",n:"Ron",r:"bouw",p:"admin"},{id:"b2",n:"Remco",r:"bouw",p:"bouw"},{id:"b3",n:"Sim",r:"deco",p:"decoratie"},{id:"b4",n:"Ricardo",r:"bouw",p:"bouw"},{id:"b5",n:"Koen L",r:"techniek",p:"techniek"},{id:"b6",n:"Jeroen",r:"techniek",p:"techniek"},{id:"b7",n:"Sanna",r:"deco",p:"decoratie"},{id:"b8",n:"Bart",r:"ict",p:"admin"},{id:"b0",n:"Alec",r:"admin",p:"admin"}];
const DH=[{id:"h1",n:"Hail Mary Hospital",d:"Update in loods",l:"loods",ld:"b1",dl:"2026-11-01"},{id:"h2",n:"Huckabay Highstreet",d:"Update in loods",l:"loods",ld:"b4",dl:"2026-11-01"},{id:"h3",n:"The Barn",d:"Nieuw in tent",l:"tent",ld:"b1",dl:"2026-11-08"},{id:"h4",n:"The Mine",d:"Nieuw in tent",l:"tent",ld:"b4",dl:"2026-11-08"},{id:"h5",n:"The Woods",d:"Bosroute",l:"bos",ld:"b3",dl:"2026-11-08"}];
const iR=[{id:"r1",h:"h1",n:"Receptie",o:1,cr:["b4","b7"],nt:"",mt:[{n:"Balie",q:1,s:"aanwezig"}]},{id:"r2",h:"h1",n:"Operatiekamer",o:2,cr:["b5"],nt:"Animatronic testen",mt:[{n:"Nep bloed",q:2,s:"nodig"}]},{id:"r3",h:"h1",n:"Gang C",o:3,cr:[],nt:"",mt:[]},{id:"r4",h:"h2",n:"Hoofdstraat",o:1,cr:["b2","b3"],nt:"Gevels updaten",mt:[{n:"Geveldelen",q:6,s:"aanwezig"},{n:"Verf",q:3,s:"besteld"}]},{id:"r5",h:"h2",n:"Slagerij",o:2,cr:["b3"],nt:"",mt:[{n:"Vleeshaken",q:8,s:"nodig"}]},{id:"r6",h:"h3",n:"TBD",o:1,cr:[],nt:"Plattegrond volgt",mt:[]},{id:"r7",h:"h4",n:"TBD",o:1,cr:[],nt:"Plattegrond volgt",mt:[]},{id:"r8",h:"h5",n:"Startpunt",o:1,cr:["b3"],nt:"Demontabel!",mt:[{n:"Balken",q:6,s:"aanwezig"}]},{id:"r9",h:"h5",n:"Open Plek",o:2,cr:[],nt:"Brandveiligheid!",mt:[{n:"LED kaarsen",q:20,s:"nodig"}]}];
const iT=[{id:"t1",r:"r1",h:"h1",ti:"Balie herstellen",s:"in_progress",pr:"high",c:"ruwbouw",w:"b4",dl:"2026-08-15",nt:"",tp:"nodig",sb:[{id:"s1",ti:"Demonteren",d:true},{id:"s2",ti:"Hout vervangen",d:false}]},{id:"t2",r:"r1",h:"h1",ti:"Deco wanden",s:"not_started",pr:"medium",c:"decoratie",w:"b7",dl:"2026-09-01",nt:"",tp:"nice",sb:[]},{id:"t3",r:"r2",h:"h1",ti:"Muren check",s:"not_started",pr:"high",c:"ruwbouw",w:"b1",dl:"2026-08-20",nt:"",tp:"nodig",sb:[]},{id:"t4",r:"r2",h:"h1",ti:"Animatronic",s:"not_started",pr:"high",c:"techniek",w:"b5",dl:"2026-09-15",nt:"Testen!",tp:"nodig",sb:[{id:"s3",ti:"Ophalen",d:false},{id:"s4",ti:"Monteren",d:false}]},{id:"t5",r:"r4",h:"h2",ti:"Gevels updaten",s:"in_progress",pr:"high",c:"decoratie",w:"b3",dl:"2026-08-10",nt:"",tp:"nodig",sb:[]},{id:"t6",r:"r4",h:"h2",ti:"Straatverlichting",s:"not_started",pr:"medium",c:"techniek",w:"b6",dl:"2026-09-20",nt:"",tp:"nice",sb:[]},{id:"t7",r:"r5",h:"h2",ti:"Constructie",s:"not_started",pr:"high",c:"ruwbouw",w:"b4",dl:"2026-08-25",nt:"",tp:"nodig",sb:[]},{id:"t8",r:"r8",h:"h5",ti:"Poort bouw",s:"in_progress",pr:"high",c:"ruwbouw",w:"b3",dl:"2026-07-30",nt:"Demontabel",tp:"nodig",sb:[{id:"s5",ti:"Zagen",d:true},{id:"s6",ti:"Frame",d:false}]},{id:"t9",r:"r9",h:"h5",ti:"Brandveiligheid",s:"not_started",pr:"critical",c:"overig",w:"b1",dl:"2026-07-15",nt:"Gemeente!",tp:"nodig",sb:[]},{id:"t10",r:"r9",h:"h5",ti:"Cirkel",s:"not_started",pr:"medium",c:"decoratie",w:"b7",dl:"2026-09-30",nt:"",tp:"nice",sb:[]}];

const CS=["ruwbouw","decoratie","techniek","kleding","grime","overig"];
const TD=new Date().toISOString().split("T")[0];
const cE=(u,c)=>!u?0:u.p==="admin"||u.p===c||(u.p==="bouw"&&"ruwbouw,decoratie".includes(c));
const hP=(id,t)=>{const x=t.filter(v=>v.h===id);return x.length?Math.round(x.filter(v=>v.s==="completed").length/x.length*100):0};
const rP=(id,t)=>{const x=t.filter(v=>v.r===id);return x.length?Math.round(x.filter(v=>v.s==="completed").length/x.length*100):0};

// localStorage vervangen window.storage
function L(k,f){try{const r=localStorage.getItem(k);return r?JSON.parse(r):f}catch{return f}}
function S(k,d){try{localStorage.setItem(k,JSON.stringify(d))}catch{}}

const st={bg:"#090909",cd:"#111",bd:"#222",rd:"#dc2626",gn:"#16a34a",yw:"#ca8a04"};
const bx={background:st.cd,border:`1px solid ${st.bd}`,borderRadius:8,padding:10,marginBottom:5};
const btn=(bg,cl)=>({background:bg,color:cl,border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:11,fontWeight:600});

export default function App(){
const[R,sR]=useState([]);const[T,sT]=useState([]);const[U,sU]=useState(null);
const[tb,sTb]=useState("home");const[cH,sCH]=useState(null);const[cR,sCR]=useState(null);
const[eI,sEI]=useState(null);const[eF,sEF]=useState({});const[ld,sLd]=useState(1);
const[q,sQ]=useState("");const[dB,sDB]=useState([]);const[dT,sDT]=useState([]);
const[fb,sFb]=useState("");const[fo,sFo]=useState(0);
const[qa,sQa]=useState(0);const[qaF,sQaF]=useState({h:"",r:"",ti:"",pr:"medium",c:"overig",w:"",dl:"",tp:"nodig"});const[atF,sAtF]=useState({h:"all",s:"all",w:"all"});

useEffect(()=>{
  const r=L("zr",null);
  const t=L("zt",null);
  const u=L("zu",null);
  const dp=L("zd",null);
  sR(r||iR);
  sT(t||iT);
  sU(u);
  if(dp){sDB(dp.b||[]);sDT(dp.t||[])}
  if(!r){S("zr",iR);S("zt",iT)}
  sLd(0);
},[]);

const uT=n=>{sT(n);S("zt",n)};
const uR=n=>{sR(n);S("zr",n)};

if(ld)return <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",color:"#666",fontFamily:"system-ui"}}>Laden...</div>;
const am=U?.p==="admin";

// LOGIN
if(!U)return(<div style={{minHeight:"100vh",background:st.bg,color:"#fff",display:"flex",justifyContent:"center",alignItems:"center",padding:16,fontFamily:"system-ui"}}><div style={{width:"100%",maxWidth:380}}>
<div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:32}}>🎃</div><h1 style={{fontSize:18,fontWeight:700}}>The Horror Zone</h1><p style={{fontSize:11,color:"#666"}}>Selecteer je naam</p></div>
{DB.map(b=><button key={b.id} onClick={()=>{sU(b);S("zu",b)}} style={{width:"100%",display:"flex",alignItems:"center",gap:10,...bx,cursor:"pointer",textAlign:"left",color:"#fff"}}>
<div style={{width:32,height:32,borderRadius:"50%",background:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,color:"#aaa"}}>{b.n[0]}</div>
<div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{b.n}</div><div style={{fontSize:10,color:"#555"}}>{b.r}</div></div>
<span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:b.p==="admin"?"#7f1d1d":"#1a1a2e",color:b.p==="admin"?"#fca5a5":"#94a3b8"}}>{b.p==="admin"?"admin":b.r}</span>
</button>)}</div></div>);

const nav=()=><div style={{display:"flex",background:"#0a0a0a",borderTop:"1px solid #1a1a1a",padding:"6px 2px",position:"sticky",bottom:0,marginTop:12}}>
{[["home","🏠","Home"],["search","🔍","Zoek"],["dag","☀️","Dag"],["team","👥","Team"]].map(([id,ic,lb])=>
<button key={id} onClick={()=>{sTb(id);sCH(null);sCR(null)}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:1,background:"none",border:"none",cursor:"pointer",padding:"3px 0",color:tb===id?"#dc2626":"#444",fontSize:14}}><span>{ic}</span><span style={{fontSize:8,fontWeight:600}}>{lb}</span></button>)}
<button onClick={()=>{sU(null);S("zu",null)}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1,background:"none",border:"none",cursor:"pointer",padding:"3px 6px",color:"#333",fontSize:14}}><span>↩</span><span style={{fontSize:8}}>Uit</span></button></div>;

const fbBtn=()=><div style={{marginTop:10}}>{!fo?<button onClick={()=>sFo(1)} style={{width:"100%",...bx,cursor:"pointer",color:"#444",fontSize:10,border:"1px dashed #333",textAlign:"center"}}>💬 Feedback</button>
:<div style={{...bx,border:`1px solid ${st.rd}`}}><textarea value={fb} onChange={e=>sFb(e.target.value)} placeholder="Wat kan beter?" style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:6,padding:6,color:"#fff",fontSize:11,minHeight:40,resize:"vertical",boxSizing:"border-box"}}/>
<div style={{display:"flex",gap:4,marginTop:4}}><button onClick={()=>{const o=L("zfb",[]);S("zfb",[...o,{t:fb,u:U?.n,d:TD}]);sFb("");sFo(0)}} style={btn(st.rd,"#fff")}>Verstuur</button><button onClick={()=>{sFo(0);sFb("")}} style={btn("#222","#888")}>Annuleer</button></div></div>}</div>;

// TASK
const Tk=({t,sr})=>{const ed=cE(U,t.c),a=DB.find(b=>b.id===t.w),od=t.s!=="completed"&&t.dl&&t.dl<TD,sd=(t.sb||[]).filter(x=>x.d).length,st2=(t.sb||[]).length;
const[sh,sSh]=useState(0);const rm=R.find(x=>x.id===t.r),ho=DH.find(x=>x.id===t.h);
if(eI===t.id)return<div style={{...bx,border:"1px solid #dc2626"}}><input value={eF.ti||""} onChange={e=>sEF({...eF,ti:e.target.value})} style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:6,padding:5,color:"#fff",fontSize:12,marginBottom:4,boxSizing:"border-box"}}/>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:4}}>
<select value={eF.pr} onChange={e=>sEF({...eF,pr:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:4,color:"#fff",fontSize:10}}>{["low","medium","high","critical"].map(v=><option key={v}>{v}</option>)}</select>
<select value={eF.c} onChange={e=>sEF({...eF,c:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:4,color:"#fff",fontSize:10}}>{CS.map(v=><option key={v}>{v}</option>)}</select>
<select value={eF.w||""} onChange={e=>sEF({...eF,w:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:4,color:"#fff",fontSize:10}}><option value="">—</option>{DB.map(b=><option key={b.id} value={b.id}>{b.n}</option>)}</select>
<input type="date" value={eF.dl||""} onChange={e=>sEF({...eF,dl:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:4,color:"#fff",fontSize:10}}/>
<select value={eF.tp} onChange={e=>sEF({...eF,tp:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:4,color:"#fff",fontSize:10}}><option value="nodig">Nodig</option><option value="nice">Nice to have</option></select></div>
<div style={{display:"flex",gap:4}}><button onClick={()=>{uT(T.map(x=>x.id===eI?{...x,...eF}:x));sEI(null)}} style={btn("#16a34a","#fff")}>Opslaan</button><button onClick={()=>sEI(null)} style={btn("#222","#888")}>Annuleer</button></div></div>;

return<div style={{...bx,borderColor:od?"#7f1d1d":"#222"}}><div style={{display:"flex",alignItems:"flex-start",gap:7}}>
<button onClick={()=>ed&&(()=>{const o=["not_started","in_progress","completed"];uT(T.map(x=>x.id!==t.id?x:{...x,s:o[(o.indexOf(x.s)+1)%3]}))})()}
style={{background:"none",border:"none",marginTop:1,cursor:ed?"pointer":"default",padding:0,opacity:ed?1:.4,color:t.s==="completed"?"#4ade80":t.s==="in_progress"?"#facc15":"#555",fontSize:16}}>
{t.s==="completed"?"✅":t.s==="in_progress"?"🔄":"⭕"}</button>
<div style={{flex:1,minWidth:0}}>
<div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
<span style={{fontSize:12,fontWeight:500,color:t.s==="completed"?"#444":"#fff",textDecoration:t.s==="completed"?"line-through":"none"}}>{t.ti}</span>
<span style={{fontSize:8,padding:"1px 4px",borderRadius:3,border:`1px solid ${t.pr==="high"||t.pr==="critical"?"#9a3412":"#333"}`,color:t.pr==="high"||t.pr==="critical"?"#fb923c":"#555"}}>{t.pr}</span>
<span style={{fontSize:8,padding:"1px 4px",borderRadius:3,background:t.tp==="nodig"?"#1a0505":"#05051a",color:t.tp==="nodig"?"#f87171":"#60a5fa"}}>{t.tp}</span></div>
<div style={{display:"flex",gap:5,marginTop:2,fontSize:10,color:"#444",flexWrap:"wrap"}}>
{a&&<span>👤{a.n}</span>}{t.dl&&<span style={{color:od?"#ef4444":""}}>📅{t.dl}</span>}{sr&&rm&&<span>🏠{ho?.n}→{rm.n}</span>}{st2>0&&<span>📋{sd}/{st2}</span>}</div>
{st2>0&&<button onClick={()=>sSh(!sh)} style={{background:"none",border:"none",color:"#333",fontSize:9,cursor:"pointer",padding:"2px 0"}}>{sh?"▲":"▼"}subtaken</button>}
{sh&&<div style={{paddingLeft:6,borderLeft:"2px solid #222",marginTop:2}}>{(t.sb||[]).map(s=>
<div key={s.id} style={{display:"flex",alignItems:"center",gap:5,padding:"2px 0"}}>
<button onClick={()=>ed&&uT(T.map(x=>x.id!==t.id?x:{...x,sb:x.sb.map(v=>v.id===s.id?{...v,d:!v.d}:v)}))} style={{background:"none",border:"none",cursor:ed?"pointer":"default",padding:0,color:s.d?"#4ade80":"#444",fontSize:12}}>{s.d?"✅":"⭕"}</button>
<span style={{fontSize:10,color:s.d?"#444":"#bbb",textDecoration:s.d?"line-through":"none",flex:1}}>{s.ti}</span>
{ed&&<button onClick={()=>uT(T.map(x=>x.id!==t.id?x:{...x,sb:x.sb.filter(v=>v.id!==s.id)}))} style={{background:"none",border:"none",color:"#333",cursor:"pointer",fontSize:10}}>✕</button>}</div>)}
{ed&&<button onClick={()=>uT(T.map(x=>x.id!==t.id?x:{...x,sb:[...x.sb,{id:"s"+Date.now(),ti:"Subtaak",d:false}]}))} style={{background:"none",border:"none",color:"#dc2626",cursor:"pointer",fontSize:9}}>+ subtaak</button>}</div>}
</div>
{ed&&<div style={{display:"flex",gap:1,flexShrink:0}}>
<button onClick={()=>{sEF({...t});sEI(t.id)}} style={{background:"none",border:"none",color:"#333",cursor:"pointer",padding:2,fontSize:11}}>✏️</button>
<button onClick={()=>uT(T.filter(x=>x.id!==t.id))} style={{background:"none",border:"none",color:"#333",cursor:"pointer",padding:2,fontSize:11}}>🗑</button></div>}
</div></div>};



// ROOM
if(cR){const rm=cR,ho=DH.find(x=>x.id===rm.h),rt=T.filter(t=>t.r===rm.id),pr=rP(rm.id,T);
return wrap(<>
<button onClick={()=>sCR(null)} style={{background:"none",border:"none",color:"#666",fontSize:11,cursor:"pointer",padding:0,marginBottom:6}}>← Terug</button>
<div style={{fontSize:9,color:st.rd,fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>{ho?.n}·K{rm.o}</div>
<h1 style={{fontSize:17,fontWeight:700,margin:"2px 0 6px"}}>{rm.n}</h1>
<div style={{height:4,background:"#222",borderRadius:2,marginBottom:10,overflow:"hidden"}}><div style={{height:"100%",background:st.rd,width:`${pr}%`}}/></div>
<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>{rm.cr.map(id=>{const b=DB.find(x=>x.id===id);return b?<span key={id} style={{fontSize:10,padding:"2px 6px",background:"#1a1a1a",borderRadius:4,color:"#888"}}>{b.n}</span>:null})}</div>
{rm.nt&&<div style={{marginBottom:8,padding:6,background:"#1a1500",border:"1px solid #433",borderRadius:6,fontSize:10,color:"#ca8a04"}}>⚠ {rm.nt}</div>}
<div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:9,color:"#444",fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Materialen</span>
{am&&<button onClick={()=>{const n=R.map(x=>x.id===rm.id?{...x,mt:[...x.mt,{n:"",q:1,s:"nodig"}]}:x);uR(n);sCR({...rm,mt:[...rm.mt,{n:"",q:1,s:"nodig"}]})}} style={{background:"none",border:"none",color:st.rd,cursor:"pointer",fontSize:12}}>+</button>}</div>
{(rm.mt||[]).map((m,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4,...bx,padding:5}}>
<span style={{fontSize:11,flex:1,color:"#aaa"}}>{m.n||"—"}</span><span style={{fontSize:9,color:"#555"}}>×{m.q}</span>
<span style={{fontSize:9,color:m.s==="aanwezig"?"#4ade80":m.s==="besteld"?"#facc15":"#f87171"}}>{m.s}</span></div>)}
<div style={{display:"flex",justifyContent:"space-between",marginBottom:3,marginTop:8}}><span style={{fontSize:9,color:"#444",fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Taken({rt.length})</span>
{am&&<button onClick={()=>uT([...T,{id:"t"+Date.now(),r:rm.id,h:rm.h,ti:"Nieuwe taak",s:"not_started",pr:"medium",c:"overig",w:"",dl:"",nt:"",tp:"nodig",sb:[]}])} style={btn(st.rd,"#fff")}>+ Taak</button>}</div>
{rt.filter(t=>t.tp==="nodig").length>0&&<div style={{fontSize:8,color:"#f87171",fontWeight:700,marginBottom:2}}>NODIG</div>}
{rt.filter(t=>t.tp==="nodig").map(t=><Tk key={t.id} t={t}/>)}
{rt.filter(t=>t.tp==="nice").length>0&&<div style={{fontSize:8,color:"#60a5fa",fontWeight:700,marginBottom:2,marginTop:4}}>NICE TO HAVE</div>}
{rt.filter(t=>t.tp==="nice").map(t=><Tk key={t.id} t={t}/>)}
</>)}

// HOUSE
if(cH){const h=cH,hr=R.filter(x=>x.h===h.id).sort((a,b)=>a.o-b.o),pr=hP(h.id,T),ht=T.filter(t=>t.h===h.id),dn=ht.filter(t=>t.s==="completed").length,ip=ht.filter(t=>t.s==="in_progress").length;
return wrap(<>
<button onClick={()=>sCH(null)} style={{background:"none",border:"none",color:"#666",fontSize:11,cursor:"pointer",padding:0,marginBottom:6}}>← Dashboard</button>
<div style={{fontSize:9,color:st.rd,fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>{h.l}</div>
<h1 style={{fontSize:17,fontWeight:700,margin:"2px 0 6px"}}>{h.n}</h1>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:6}}>
{[{l:"Voortgang",v:pr+"%",c:st.rd},{l:"Kamers",v:hr.length,c:"#3b82f6"},{l:"Hoofdbouw",v:DB.find(b=>b.id===h.ld)?.n||"—",c:st.gn},{l:"Deadline",v:h.dl,c:st.yw}].map((x,i)=>
<div key={i} style={{...bx,textAlign:"center",padding:6}}><div style={{fontSize:8,color:"#444"}}>{x.l}</div><div style={{fontSize:14,fontWeight:700,color:x.c}}>{x.v}</div></div>)}</div>
<div style={{height:4,background:"#222",borderRadius:2,marginBottom:2,display:"flex",overflow:"hidden"}}>{dn>0&&<div style={{background:st.gn,width:`${dn/ht.length*100}%`,height:"100%"}}/>}{ip>0&&<div style={{background:st.yw,width:`${ip/ht.length*100}%`,height:"100%"}}/>}</div>
<div style={{display:"flex",gap:8,fontSize:9,color:"#444",marginBottom:10}}>🟢{dn} 🟡{ip} ⚪{ht.length-dn-ip}</div>
{hr.map(r=>{const rp=rP(r.id,T);return<button key={r.id} onClick={()=>sCR(r)} style={{width:"100%",...bx,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",color:"#fff"}}>
<div style={{display:"flex",alignItems:"center",gap:6,flex:1}}><div style={{width:22,height:22,borderRadius:5,background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#444"}}>{r.o}</div>
<div><div style={{fontSize:12,fontWeight:600}}>{r.n}</div><div style={{fontSize:9,color:"#444"}}>{T.filter(t=>t.r===r.id).length} taken</div></div></div>
<div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:30}}><div style={{height:3,background:"#222",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",background:rp===100?st.gn:st.rd,width:`${rp}%`}}/></div></div><span style={{color:"#333"}}>›</span></div></button>})}
</>)}

// SEARCH
if(tb==="search"){const ql=q.toLowerCase();const res=[];
if(ql){DH.forEach(h=>{if((h.n+h.d+h.l).toLowerCase().includes(ql))res.push({i:"🏚️",l:h.n,s:h.d,a:()=>sCH(h)})});
R.forEach(r=>{const h=DH.find(x=>x.id===r.h);if((r.n+(r.nt||"")).toLowerCase().includes(ql))res.push({i:"🚪",l:r.n,s:h?.n,a:()=>{sCH(h);sCR(r)}})});
T.forEach(t=>{const r=R.find(x=>x.id===t.r),h=DH.find(x=>x.id===t.h);if((t.ti+t.c+(t.nt||"")).toLowerCase().includes(ql))res.push({i:"📋",l:t.ti,s:`${h?.n}→${r?.n}`,a:()=>{sCH(h);sCR(r)}})});
R.forEach(r=>{(r.mt||[]).forEach(m=>{if(m.n.toLowerCase().includes(ql)){const h=DH.find(x=>x.id===r.h);res.push({i:"📦",l:m.n,s:`${h?.n}→${r.n}`,a:()=>{sCH(h);sCR(r)}})}})});
DB.forEach(b=>{if((b.n+b.r).toLowerCase().includes(ql))res.push({i:"👤",l:b.n,s:b.r,a:()=>sTb("team")})})}
return wrap(<>
<h1 style={{fontSize:17,fontWeight:700,marginBottom:8}}>🔍 Zoeken</h1>
<input value={q} onChange={e=>sQ(e.target.value)} placeholder="Huis, kamer, taak, materiaal, persoon..." style={{width:"100%",background:"#111",border:"1px solid #333",borderRadius:8,padding:"8px 10px",color:"#fff",fontSize:12,marginBottom:8,boxSizing:"border-box",outline:"none"}} autoFocus/>
{!ql&&<div style={{textAlign:"center",color:"#333",fontSize:10,padding:20}}>Typ om te zoeken</div>}
{ql&&!res.length&&<div style={{textAlign:"center",color:"#444",fontSize:10,padding:20}}>Geen resultaten</div>}
{res.map((r,i)=><button key={i} onClick={()=>{r.a();sQ("")}} style={{width:"100%",...bx,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:6,color:"#fff"}}>
<span>{r.i}</span><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{r.l}</div><div style={{fontSize:9,color:"#444"}}>{r.s}</div></div></button>)}
</>)}

// DAGSTART
if(tb==="dag"){const dtT=T.filter(t=>dT.includes(t.id)),up=T.filter(t=>t.s!=="completed"&&t.dl&&t.dl<=TD&&!dT.includes(t.id)),od=T.filter(t=>t.s!=="completed"&&t.dl&&t.dl<TD);
return wrap(<>
<h1 style={{fontSize:17,fontWeight:700}}>☀️ Dagstart</h1><p style={{fontSize:10,color:"#444",marginBottom:8}}>{new Date().toLocaleDateString("nl-NL",{weekday:"long",day:"numeric",month:"long"})}</p>
<div style={{fontSize:8,color:"#444",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>Aanwezig({dB.length})</div>
<div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:10}}>{DB.filter(b=>b.id!=="b0").map(b=>{const s=dB.includes(b.id);return<button key={b.id} onClick={()=>{if(!am)return;const n=s?dB.filter(x=>x!==b.id):[...dB,b.id];sDB(n);S("zd",{b:n,t:dT})}} style={{padding:"3px 8px",borderRadius:12,border:`1px solid ${s?"#166534":"#222"}`,background:s?"#0a1f0a":"#111",color:s?"#4ade80":"#444",fontSize:9,cursor:am?"pointer":"default"}}>{b.n}</button>})}</div>
{am&&up.length>0&&<><div style={{fontSize:8,color:"#444",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>Toevoegen</div>
{up.slice(0,5).map(t=>{const r=R.find(x=>x.id===t.r),h=DH.find(x=>x.id===t.h);return<button key={t.id} onClick={()=>{const n=[...dT,t.id];sDT(n);S("zd",{b:dB,t:n})}} style={{width:"100%",...bx,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:5,color:"#fff"}}>
<span style={{color:st.rd}}>+</span><div style={{flex:1}}><div style={{fontSize:11}}>{t.ti}</div><div style={{fontSize:9,color:"#444"}}>{h?.n}→{r?.n}</div></div><span style={{fontSize:8,color:t.tp==="nodig"?"#f87171":"#60a5fa"}}>{t.tp}</span></button>})}<div style={{marginBottom:8}}/></>}
<div style={{fontSize:8,color:"#444",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>Vandaag({dtT.length})</div>
{!dtT.length&&<div style={{...bx,textAlign:"center",color:"#333",fontSize:10}}>Geen taken</div>}
{dtT.filter(t=>t.tp==="nodig").map(t=><Tk key={t.id} t={t} sr={1}/>)}
{dtT.filter(t=>t.tp==="nice").map(t=><Tk key={t.id} t={t} sr={1}/>)}
{od.length>0&&<div style={{marginTop:8}}><div style={{fontSize:8,color:"#ef4444",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>⚠Achterstand({od.length})</div>
{od.slice(0,4).map(t=><div key={t.id} style={{background:"#1a0505",border:"1px solid #7f1d1d",borderRadius:6,padding:5,marginBottom:3,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:10,color:"#fca5a5"}}>{t.ti}</span><span style={{fontSize:9,color:"#ef4444"}}>{t.dl}</span></div>)}</div>}
</>)}

// TEAM
if(tb==="team")return wrap(<>
<h1 style={{fontSize:17,fontWeight:700,marginBottom:8}}>👥 Team</h1>
{DB.filter(b=>b.id!=="b0").map(b=>{const d=T.filter(t=>t.w===b.id&&t.s==="completed").length,ip=T.filter(t=>t.w===b.id&&t.s==="in_progress").length;return<div key={b.id} style={{...bx,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:28,height:28,borderRadius:"50%",background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,color:"#555"}}>{b.n[0]}</div><span style={{fontSize:12,fontWeight:600}}>{b.n}<span style={{fontSize:9,color:"#444"}}> {b.r}</span></span></div>
<span style={{fontSize:10}}><span style={{color:"#4ade80"}}>{d}✓</span> <span style={{color:"#facc15"}}>{ip}⏳</span></span></div>})}</>);

// HOME
const tt=T.length,dn=T.filter(t=>t.s==="completed").length,ip=T.filter(t=>t.s==="in_progress").length,od=T.filter(t=>t.s!=="completed"&&t.dl&&t.dl<TD).length,tp=tt?Math.round(dn/tt*100):0;
const roomsForHouse=qaF.h?R.filter(r=>r.h===qaF.h):[];
const atFiltered=T.filter(t=>{if(atF.h!=="all"&&t.h!==atF.h)return 0;if(atF.s!=="all"&&t.s!==atF.s)return 0;if(atF.w!=="all"&&t.w!==atF.w)return 0;return 1});
return wrap(<>
<h1 style={{fontSize:17,fontWeight:700}}>🎃 Horror Zone</h1><p style={{fontSize:10,color:"#444",marginBottom:6}}>{new Date().toLocaleDateString("nl-NL",{weekday:"short",day:"numeric",month:"short"})}</p>
<div style={{...bx,padding:6,marginBottom:6,display:"flex",alignItems:"center",gap:6,fontSize:10,color:"#444"}}><div style={{width:20,height:20,borderRadius:"50%",background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:9,color:"#555"}}>{U.n[0]}</div>{U.n}<span style={{marginLeft:"auto",fontSize:8,padding:"1px 4px",borderRadius:3,background:"#1a1a1a",color:"#333"}}>{am?"admin":U.r}</span></div>

{am&&<div style={{marginBottom:10}}>
{!qa?<button onClick={()=>sQa(1)} style={{width:"100%",background:st.rd,color:"#fff",border:"none",borderRadius:8,padding:"10px 14px",cursor:"pointer",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>+ Nieuwe taak</button>
:<div style={{...bx,border:`1px solid ${st.rd}`,padding:10}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:11,fontWeight:600}}>Nieuwe taak</span><button onClick={()=>{sQa(0);sQaF({h:"",r:"",ti:"",pr:"medium",c:"overig",w:"",dl:"",tp:"nodig"})}} style={{background:"none",border:"none",color:"#666",cursor:"pointer",fontSize:14}}>✕</button></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:5}}>
<select value={qaF.h} onChange={e=>sQaF({...qaF,h:e.target.value,r:""})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11}}><option value="">Kies huis…</option>{DH.map(h=><option key={h.id} value={h.id}>{h.n}</option>)}</select>
<select value={qaF.r} onChange={e=>sQaF({...qaF,r:e.target.value})} disabled={!qaF.h} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11,opacity:qaF.h?1:.5}}><option value="">Kies kamer…</option>{roomsForHouse.map(r=><option key={r.id} value={r.id}>{r.n}</option>)}</select>
</div>
<input value={qaF.ti} onChange={e=>sQaF({...qaF,ti:e.target.value})} placeholder="Taaknaam" style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11,marginBottom:5,boxSizing:"border-box"}}/>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5,marginBottom:5}}>
<select value={qaF.pr} onChange={e=>sQaF({...qaF,pr:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11}}>{["low","medium","high","critical"].map(v=><option key={v}>{v}</option>)}</select>
<select value={qaF.c} onChange={e=>sQaF({...qaF,c:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11}}>{CS.map(v=><option key={v}>{v}</option>)}</select>
<select value={qaF.tp} onChange={e=>sQaF({...qaF,tp:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11}}><option value="nodig">Nodig</option><option value="nice">Nice</option></select>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:8}}>
<select value={qaF.w} onChange={e=>sQaF({...qaF,w:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11}}><option value="">Toewijzen aan…</option>{DB.map(b=><option key={b.id} value={b.id}>{b.n}</option>)}</select>
<input type="date" value={qaF.dl} onChange={e=>sQaF({...qaF,dl:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11}}/>
</div>
<button onClick={()=>{if(!qaF.h||!qaF.r||!qaF.ti)return;uT([...T,{id:"t"+Date.now(),r:qaF.r,h:qaF.h,ti:qaF.ti,s:"not_started",pr:qaF.pr,c:qaF.c,w:qaF.w,dl:qaF.dl,nt:"",tp:qaF.tp,sb:[]}]);sQa(0);sQaF({h:"",r:"",ti:"",pr:"medium",c:"overig",w:"",dl:"",tp:"nodig"})}} disabled={!qaF.h||!qaF.r||!qaF.ti} style={{...btn(st.gn,"#fff"),width:"100%",padding:"6px 10px",opacity:qaF.h&&qaF.r&&qaF.ti?1:.5,cursor:qaF.h&&qaF.r&&qaF.ti?"pointer":"not-allowed"}}>Taak toevoegen</button>
</div>}
</div>}

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:10}}>
{[{l:"Voortgang",v:tp+"%",c:st.rd},{l:"Afgerond",v:dn+"/"+tt,c:st.gn},{l:"Bezig",v:ip,c:st.yw},{l:"Achterstand",v:od,c:od?"#ef4444":"#333"}].map((x,i)=>
<div key={i} style={{...bx,textAlign:"center",padding:6}}><div style={{fontSize:8,color:"#444"}}>{x.l}</div><div style={{fontSize:16,fontWeight:700,color:x.c}}>{x.v}</div></div>)}</div>
<div style={{fontSize:8,color:"#444",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>Huizen({DH.length})</div>
{DH.map(h=>{const pr=hP(h.id,T),ht=T.filter(t=>t.h===h.id),hd=ht.filter(t=>t.s==="completed").length;
return<button key={h.id} onClick={()=>sCH(h)} style={{width:"100%",...bx,borderRadius:10,padding:10,cursor:"pointer",textAlign:"left",color:"#fff"}}>
<div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}><span style={{fontSize:13,fontWeight:700}}>{h.n}</span><span style={{fontSize:8,padding:"1px 5px",borderRadius:6,background:{loods:"#1e3a5f",tent:"#3b1f5e",bos:"#1a3a2a"}[h.l],color:"#bbb"}}>{h.l}</span></div>
<div style={{display:"flex",gap:5,fontSize:9,color:"#444",marginBottom:4}}>🏠{R.filter(r=>r.h===h.id).length} 📋{hd}/{ht.length} 📅{h.dl}</div>
<div style={{display:"flex",alignItems:"center",gap:4}}><div style={{flex:1,height:4,background:"#1a1a1a",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",background:pr===100?st.gn:st.rd,width:`${pr}%`}}/></div><span style={{fontSize:10,fontWeight:700,color:pr===100?st.gn:st.rd}}>{pr}%</span></div></button>})}
{od>0&&<div style={{marginTop:6}}><div style={{fontSize:8,color:"#ef4444",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:3}}>⚠Achterstand</div>
{T.filter(t=>t.s!=="completed"&&t.dl&&t.dl<TD).slice(0,3).map(t=><div key={t.id} style={{background:"#1a0505",border:"1px solid #7f1d1d",borderRadius:6,padding:5,marginBottom:3,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:10,color:"#fca5a5"}}>{t.ti}</span><span style={{fontSize:9,color:"#ef4444"}}>{t.dl}</span></div>)}</div>}

{am&&<div style={{marginTop:14}}>
<div style={{fontSize:8,color:"#444",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Alle taken (admin) — {atFiltered.length}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,marginBottom:6}}>
<select value={atF.h} onChange={e=>sAtF({...atF,h:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:4,color:"#fff",fontSize:10}}><option value="all">Alle huizen</option>{DH.map(h=><option key={h.id} value={h.id}>{h.n}</option>)}</select>
<select value={atF.s} onChange={e=>sAtF({...atF,s:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:4,color:"#fff",fontSize:10}}><option value="all">Alle statussen</option><option value="not_started">Niet gestart</option><option value="in_progress">Bezig</option><option value="completed">Klaar</option></select>
<select value={atF.w} onChange={e=>sAtF({...atF,w:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:4,color:"#fff",fontSize:10}}><option value="all">Alle personen</option><option value="">Niet toegewezen</option>{DB.map(b=><option key={b.id} value={b.id}>{b.n}</option>)}</select>
</div>
{atFiltered.length===0?<div style={{...bx,textAlign:"center",color:"#333",fontSize:10,padding:10}}>Geen taken met deze filters</div>
:atFiltered.map(t=>{const r=R.find(x=>x.id===t.r),h=DH.find(x=>x.id===t.h),a=DB.find(b=>b.id===t.w),od=t.s!=="completed"&&t.dl&&t.dl<TD;
return<div key={t.id} onClick={()=>{sCH(h);sCR(r)}} style={{...bx,cursor:"pointer",padding:7,display:"flex",alignItems:"center",gap:6,borderColor:od?"#7f1d1d":"#222"}}>
<span style={{fontSize:14,color:t.s==="completed"?"#4ade80":t.s==="in_progress"?"#facc15":"#555"}}>{t.s==="completed"?"✅":t.s==="in_progress"?"🔄":"⭕"}</span>
<div style={{flex:1,minWidth:0}}>
<div style={{fontSize:11,fontWeight:500,color:t.s==="completed"?"#444":"#fff",textDecoration:t.s==="completed"?"line-through":"none"}}>{t.ti}</div>
<div style={{fontSize:9,color:"#444",display:"flex",gap:5,flexWrap:"wrap"}}>
<span>🏠{h?.n}→{r?.n}</span>{a&&<span>👤{a.n}</span>}{t.dl&&<span style={{color:od?"#ef4444":""}}>📅{t.dl}</span>}
<span style={{padding:"0 4px",borderRadius:3,background:t.tp==="nodig"?"#1a0505":"#05051a",color:t.tp==="nodig"?"#f87171":"#60a5fa"}}>{t.tp}</span>
</div>
</div>
<span style={{color:"#333",fontSize:11}}>›</span>
</div>})}
</div>}
</>);
}