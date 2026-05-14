import { useState, useEffect } from "react";
import { supabase, loadAll, saveMilestone, deleteMilestone, saveTask, deleteTask, saveRoom, savePerson, deletePerson, saveDagstart, saveFeedback, saveHouse } from './supabase.js'

const hashPin = async (pin) => {
  const data = new TextEncoder().encode(pin);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
};

const DB=[{id:"b1",n:"Ron",r:"bouw",p:"admin"},{id:"b2",n:"Remco",r:"bouw",p:"bouw"},{id:"b3",n:"Sim",r:"deco",p:"decoratie"},{id:"b4",n:"Ricardo",r:"bouw",p:"bouw"},{id:"b5",n:"Koen L",r:"techniek",p:"techniek"},{id:"b6",n:"Jeroen",r:"techniek",p:"techniek"},{id:"b7",n:"Sanna",r:"deco",p:"decoratie"},{id:"b8",n:"Bart",r:"ict",p:"admin"},{id:"b0",n:"Alec",r:"admin",p:"admin"}];
const DH=[{id:"h1",n:"Hail Mary Hospital",d:"Update in loods",l:"loods",ld:"b1",dl:"2026-11-01"},{id:"h2",n:"Huckabay Highstreet",d:"Update in loods",l:"loods",ld:"b4",dl:"2026-11-01"},{id:"h3",n:"The Barn",d:"Nieuw in tent",l:"tent",ld:"b1",dl:"2026-11-08"},{id:"h4",n:"The Mine",d:"Nieuw in tent",l:"tent",ld:"b4",dl:"2026-11-08"},{id:"h5",n:"The Woods",d:"Bosroute",l:"bos",ld:"b3",dl:"2026-11-08"}];
const iR=[{id:"r1",h:"h1",n:"Receptie",o:1,cr:["b4","b7"],nt:"",mt:[{n:"Balie",q:1,s:"aanwezig"}]},{id:"r2",h:"h1",n:"Operatiekamer",o:2,cr:["b5"],nt:"Animatronic testen",mt:[{n:"Nep bloed",q:2,s:"nodig"}]},{id:"r3",h:"h1",n:"Gang C",o:3,cr:[],nt:"",mt:[]},{id:"r4",h:"h2",n:"Hoofdstraat",o:1,cr:["b2","b3"],nt:"Gevels updaten",mt:[{n:"Geveldelen",q:6,s:"aanwezig"},{n:"Verf",q:3,s:"besteld"}]},{id:"r5",h:"h2",n:"Slagerij",o:2,cr:["b3"],nt:"",mt:[{n:"Vleeshaken",q:8,s:"nodig"}]},{id:"r6",h:"h3",n:"TBD",o:1,cr:[],nt:"Plattegrond volgt",mt:[]},{id:"r7",h:"h4",n:"TBD",o:1,cr:[],nt:"Plattegrond volgt",mt:[]},{id:"r8",h:"h5",n:"Startpunt",o:1,cr:["b3"],nt:"Demontabel!",mt:[{n:"Balken",q:6,s:"aanwezig"}]},{id:"r9",h:"h5",n:"Open Plek",o:2,cr:[],nt:"Brandveiligheid!",mt:[{n:"LED kaarsen",q:20,s:"nodig"}]}];
const iM=[{id:"m1",n:"Plattegronden definitief",dl:"2026-05-15",d:1,nt:""},{id:"m2",n:"Hail Mary Hospital concept goedgekeurd",dl:"2026-06-01",d:0,nt:""},{id:"m3",n:"Loods-huizen klaar",dl:"2026-07-01",d:0,nt:""},{id:"m4",n:"Boshuisjes (demontabel) klaar",dl:"2026-08-01",d:0,nt:""},{id:"m5",n:"Tenten geplaatst, bouw begonnen",dl:"2026-08-15",d:0,nt:""},{id:"m6",n:"Tentenhuizen ruwbouw klaar",dl:"2026-10-01",d:0,nt:""},{id:"m7",n:"Decoratie klaar",dl:"2026-10-20",d:0,nt:""},{id:"m8",n:"Brandinspectie",dl:"2026-10-25",d:0,nt:"Niets meer aanpassen na deze dag"},{id:"m9",n:"Generale repetitie",dl:"2026-10-28",d:0,nt:""},{id:"m10",n:"Openingsdag",dl:"2026-10-31",d:0,nt:""}];
const iT=[{id:"t1",r:"r1",h:"h1",ti:"Balie herstellen",s:"in_progress",pr:"high",c:"ruwbouw",w:"b4",dl:"2026-08-15",nt:"",tp:"nodig",sb:[{id:"s1",ti:"Demonteren",d:true},{id:"s2",ti:"Hout vervangen",d:false}]},{id:"t2",r:"r1",h:"h1",ti:"Deco wanden",s:"not_started",pr:"medium",c:"decoratie",w:"b7",dl:"2026-09-01",nt:"",tp:"nice",sb:[]},{id:"t3",r:"r2",h:"h1",ti:"Muren check",s:"not_started",pr:"high",c:"ruwbouw",w:"b1",dl:"2026-08-20",nt:"",tp:"nodig",sb:[]},{id:"t4",r:"r2",h:"h1",ti:"Animatronic",s:"not_started",pr:"high",c:"techniek",w:"b5",dl:"2026-09-15",nt:"Testen!",tp:"nodig",sb:[{id:"s3",ti:"Ophalen",d:false},{id:"s4",ti:"Monteren",d:false}]},{id:"t5",r:"r4",h:"h2",ti:"Gevels updaten",s:"in_progress",pr:"high",c:"decoratie",w:"b3",dl:"2026-08-10",nt:"",tp:"nodig",sb:[]},{id:"t6",r:"r4",h:"h2",ti:"Straatverlichting",s:"not_started",pr:"medium",c:"techniek",w:"b6",dl:"2026-09-20",nt:"",tp:"nice",sb:[]},{id:"t7",r:"r5",h:"h2",ti:"Constructie",s:"not_started",pr:"high",c:"ruwbouw",w:"b4",dl:"2026-08-25",nt:"",tp:"nodig",sb:[]},{id:"t8",r:"r8",h:"h5",ti:"Poort bouw",s:"in_progress",pr:"high",c:"ruwbouw",w:"b3",dl:"2026-07-30",nt:"Demontabel",tp:"nodig",sb:[{id:"s5",ti:"Zagen",d:true},{id:"s6",ti:"Frame",d:false}]},{id:"t9",r:"r9",h:"h5",ti:"Brandveiligheid",s:"not_started",pr:"critical",c:"overig",w:"b1",dl:"2026-07-15",nt:"Gemeente!",tp:"nodig",sb:[]},{id:"t10",r:"r9",h:"h5",ti:"Cirkel",s:"not_started",pr:"medium",c:"decoratie",w:"b7",dl:"2026-09-30",nt:"",tp:"nice",sb:[]}];

const CS=["ruwbouw","decoratie","techniek","kleding","grime","overig"];
const TD=new Date().toISOString().split("T")[0];
const cE=(u,c)=>!u?0:u.p==="admin"||u.p===c||(u.p==="bouw"&&"ruwbouw,decoratie".includes(c));
const hP=(id,t)=>{const x=t.filter(v=>v.h===id);return x.length?Math.round(x.filter(v=>v.s==="completed").length/x.length*100):0};
const rP=(id,t)=>{const x=t.filter(v=>v.r===id);return x.length?Math.round(x.filter(v=>v.s==="completed").length/x.length*100):0};

// localStorage vervangen window.storage
function L(k,f){try{const r=localStorage.getItem(k);return r?JSON.parse(r):f}catch{return f}}
function S(k,d){try{localStorage.setItem(k,JSON.stringify(d))}catch{}}

const st={bg:"#0a0a0a",cd:"#141414",bd:"#2a2a2a",rd:"#ef4444",gn:"#22c55e",yw:"#fbbf24"};const bx={background:st.cd,border:`1px solid ${st.bd}`,borderRadius:8,padding:10,marginBottom:5};
const btn=(bg,cl)=>({background:bg,color:cl,border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:11,fontWeight:600});

export default function App(){
const[R,sR]=useState([]);const[T,sT]=useState([]);const[U,sU]=useState(null);
const[tb,sTb]=useState("home");const[cH,sCH]=useState(null);const[cR,sCR]=useState(null);
const[eI,sEI]=useState(null);const[eF,sEF]=useState({});const[ld,sLd]=useState(1);
const[q,sQ]=useState("");const[dB,sDB]=useState([]);const[dT,sDT]=useState([]);
const[fb,sFb]=useState("");const[fo,sFo]=useState(0);
const[M,sM]=useState([]);const[eM,sEM]=useState(null);const[eMf,sEMf]=useState({});const[nM,sNM]=useState(0);const[DBs,sDBs]=useState(DB);
const[w,sW]=useState(typeof window!=="undefined"?window.innerWidth:1024);
const[qa,sQa]=useState(0);const[qaF,sQaF]=useState({h:"",r:"",ti:"",pr:"medium",c:"overig",w:"",dl:"",tp:"nodig",milestone_id:""});const[atF,sAtF]=useState({h:"all",s:"all",w:"all"});
const[nB,sNB]=useState(0);const[nBf,sNBf]=useState({n:"",r:"bouw",p:"normaal"});
const[cP,sCP]=useState(null);
const[DHs,sDHs]=useState([]);
const[lS,sLS]=useState(null);const[lU,sLU]=useState(null);const[lP,sLP]=useState("");const[lP2,sLP2]=useState("");const[lE,sLE]=useState("");const[lN,sLN]=useState("");
const[shT,sShT]=useState({});
const[shM,sShM]=useState({});
const[dQa,sDQa]=useState(0);const[dQaF,sDQaF]=useState({h:"",r:"",ti:"",w:""});
const[matF,sMatF]=useState("all");
const[nMat,sNMat]=useState({n:"",q:1,s:"nodig",rooms:[]});const[nMatO,sNMatO]=useState(0);

useEffect(()=>{
  (async()=>{
    try{
      const data=await loadAll();
      sR(data.rooms);
      sT(data.tasks);
      sM(data.milestones);
      sDBs(data.people);
      sDHs(data.houses);
      if(data.dagstart){
        sDB(data.dagstart.present||[]);
        sDT(data.dagstart.task_ids||[]);
      }
      const u=L("zu",null);
      if(u&&data.people.length){const fresh=data.people.find(p=>p.id===u.id);if(fresh){sU(fresh);S("zu",fresh)}else{sU(null);S("zu",null)}}
      else sU(u);
    }catch(err){
      console.error("Fout bij laden uit Supabase:",err);
    }finally{
      sLd(0);
    }
  })();
},[]);
useEffect(()=>{const h=()=>sW(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);
const uT=n=>{sT(n)};
const addTask=async(t)=>{const saved=await saveTask(t);console.log("addTask result:",saved);if(saved)sT([...T,saved])};
const updateTask=async(t)=>{const saved=await saveTask(t);if(saved)sT(T.map(x=>x.id===t.id?saved:x))};
const removeTask=async(id)=>{await deleteTask(id);sT(T.filter(x=>x.id!==id))};
const uR=n=>{sR(n)};
const updateRoom=async(r)=>{const saved=await saveRoom(r);if(saved)sR(R.map(x=>x.id===r.id?saved:x))};
const uM=n=>{sM(n)};
const addMilestone=async(m)=>{const saved=await saveMilestone(m);if(saved)sM([...M,saved])};
const updateMilestone=async(m)=>{const saved=await saveMilestone(m);if(saved)sM(M.map(x=>x.id===m.id?saved:x))};
const removeMilestone=async(id)=>{await deleteMilestone(id);sM(M.filter(x=>x.id!==id))};
const uDBs=n=>{sDBs(n)};
const addPerson=async(p)=>{const saved=await savePerson(p);if(saved)sDBs([...DBs,saved])};
const updatePerson=async(p)=>{const saved=await savePerson(p);if(saved)sDBs(DBs.map(x=>x.id===p.id?saved:x))};
const removePerson=async(id)=>{await deletePerson(id);sDBs(DBs.filter(x=>x.id!==id))};
const updateDagstart=async(present,task_ids)=>{await saveDagstart(TD,present,task_ids)};
const updateHouse=async(h)=>{const saved=await saveHouse(h);if(saved)sDHs(DHs.map(x=>x.id===h.id?saved:x))};

if(ld)return <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",color:"#bbb",fontFamily:"system-ui"}}>Laden...</div>;
const am=U?.p==="admin";

// LOGIN
if(!U){
const loginWrap=c=><div style={{minHeight:"100vh",background:st.bg,color:"#fff",display:"flex",justifyContent:"center",alignItems:"center",padding:16,fontFamily:"system-ui"}}><div style={{width:"100%",maxWidth:380}}>{c}</div></div>;
const loginHeader=<div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:32}}>🎃</div><h1 style={{fontSize:18,fontWeight:700}}>The Horror Zone</h1></div>;
const pinInput=(val,set,ph)=><input value={val} onChange={e=>{const v=e.target.value.replace(/\D/g,"").slice(0,4);set(v);sLE("")}} placeholder={ph||"····"} inputMode="numeric" maxLength={4} autoFocus style={{width:"100%",background:"#1a1a1a",border:`1px solid ${lE?"#7f1d1d":"#333"}`,borderRadius:8,padding:"12px 14px",color:"#fff",fontSize:24,textAlign:"center",letterSpacing:12,fontFamily:"monospace",boxSizing:"border-box",marginBottom:6}}/>;
const backToList=<button onClick={()=>{sLS(null);sLU(null);sLP("");sLP2("");sLE("");sLN("")}} style={{background:"none",border:"none",color:"#bbb",fontSize:11,cursor:"pointer",padding:0,marginBottom:10}}>← Terug</button>;

// Stap: pin invoeren
if(lS==="pin"&&lU)return loginWrap(<>
{loginHeader}
{backToList}
<div style={{...bx,padding:14,textAlign:"center"}}>
<div style={{width:36,height:36,borderRadius:"50%",background:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,color:"#aaa",margin:"0 auto 8px"}}>{lU.n[0]}</div>
<div style={{fontSize:14,fontWeight:600,marginBottom:2}}>{lU.n}</div>
<div style={{fontSize:10,color:"#999",marginBottom:12}}>Voer je 4-cijferige pincode in</div>
{pinInput(lP,sLP)}
{lE&&<div style={{fontSize:10,color:"#ef4444",marginBottom:6}}>{lE}</div>}
<button onClick={async()=>{if(lP.length!==4){sLE("Vul 4 cijfers in");return}const h=await hashPin(lP);if(h!==lU.pin_hash){sLE("Onjuiste pincode");sLP("");return}sU(lU);S("zu",lU);sLS(null);sLU(null);sLP("")}} style={{...btn(st.rd,"#fff"),width:"100%",padding:"10px 14px",fontSize:13,marginTop:4}}>Inloggen</button>
</div>
</>);

// Stap: pin instellen (eerste keer)
if(lS==="setup"&&lU)return loginWrap(<>
{loginHeader}
{backToList}
<div style={{...bx,padding:14,textAlign:"center"}}>
<div style={{width:36,height:36,borderRadius:"50%",background:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,color:"#aaa",margin:"0 auto 8px"}}>{lU.n[0]}</div>
<div style={{fontSize:14,fontWeight:600,marginBottom:2}}>{lU.n}</div>
<div style={{fontSize:10,color:"#999",marginBottom:12}}>Kies een 4-cijferige pincode</div>
{pinInput(lP,sLP,"Pin")}
<div style={{fontSize:10,color:"#999",marginBottom:4,marginTop:8}}>Bevestig je pincode</div>
{pinInput(lP2,sLP2,"Bevestig")}
{lE&&<div style={{fontSize:10,color:"#ef4444",marginBottom:6}}>{lE}</div>}
<button onClick={async()=>{if(lP.length!==4){sLE("Vul 4 cijfers in");return}if(lP!==lP2){sLE("Pincodes komen niet overeen");sLP2("");return}const h=await hashPin(lP);const updated={...lU,pin_hash:h};const saved=await savePerson(updated);if(saved){sDBs(DBs.map(x=>x.id===saved.id?saved:x));sU(saved);S("zu",saved);sLS(null);sLU(null);sLP("");sLP2("")}}} style={{...btn(st.gn,"#fff"),width:"100%",padding:"10px 14px",fontSize:13,marginTop:4}}>Pincode instellen & inloggen</button>
</div>
</>);

// Stap: naam invoeren
return loginWrap(<>
{loginHeader}
<p style={{fontSize:11,color:"#bbb",textAlign:"center",marginBottom:12}}>Vul je naam in om in te loggen</p>
<div style={{...bx,padding:14}}>
<input value={lN} onChange={e=>{sLN(e.target.value);sLE("")}} placeholder="Je naam…" autoFocus style={{width:"100%",background:"#1a1a1a",border:`1px solid ${lE?"#7f1d1d":"#333"}`,borderRadius:8,padding:"12px 14px",color:"#fff",fontSize:14,boxSizing:"border-box",marginBottom:6}}/>
{lE&&<div style={{fontSize:10,color:"#ef4444",marginBottom:6}}>{lE}</div>}
<button onClick={async()=>{const naam=lN.trim();if(!naam){sLE("Vul je naam in");return}const found=DBs.find(b=>b.n.toLowerCase()===naam.toLowerCase());if(found){sLU(found);sLP("");sLP2("");if(found.pin_hash)sLS("pin");else sLS("setup")}else{const newId="b"+Date.now();const newPerson={id:newId,n:naam,r:"algemeen",p:"algemeen"};const saved=await savePerson(newPerson);if(saved){sDBs([...DBs,saved]);sLU(saved);sLP("");sLP2("");sLS("setup")}}}} style={{...btn(st.rd,"#fff"),width:"100%",padding:"10px 14px",fontSize:13}}>Doorgaan</button>
</div>
<div style={{fontSize:9,color:"#666",textAlign:"center",marginTop:10}}>Eerste keer? Vul je naam in en maak een pincode aan.</div>
</>);
}
const isDesktop=w>=768;
const nav=()=><div style={{display:"flex",background:"#0a0a0a",borderTop:"1px solid #1a1a1a",padding:"6px 2px",position:"fixed",bottom:0,left:0,right:0,zIndex:100}}>
{[["home","🏠","Home"],["search","🔍","Zoek"],["dag","☀️","Dag"],["mile","🎯","Mijlp"],["team","👥","Team"],...(am?[["mat","📦","Mater."]]:[])]
.map(([id,ic,lb])=>
<button key={id} onClick={()=>{sTb(id);sCH(null);sCR(null)}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:1,background:"none",border:"none",cursor:"pointer",padding:"3px 0",color:tb===id?"#dc2626":"#444",fontSize:14}}><span>{ic}</span><span style={{fontSize:8,fontWeight:600}}>{lb}</span></button>)}
<button onClick={()=>{sU(null);S("zu",null)}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1,background:"none",border:"none",cursor:"pointer",padding:"3px 6px",color:"#888",fontSize:14}}><span>↩</span><span style={{fontSize:8}}>Uit</span></button></div>;

const fbBtn=()=><div style={{marginTop:10}}>{!fo?<button onClick={()=>sFo(1)} style={{width:"100%",...bx,cursor:"pointer",color:"#999",fontSize:10,border:"1px dashed #333",textAlign:"center"}}>💬 Feedback</button>
:<div style={{...bx,border:`1px solid ${st.rd}`}}><textarea value={fb} onChange={e=>sFb(e.target.value)} placeholder="Wat kan beter?" style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:6,padding:6,color:"#fff",fontSize:11,minHeight:40,resize:"vertical",boxSizing:"border-box"}}/>
<div style={{display:"flex",gap:4,marginTop:4}}><button onClick={async()=>{if(!fb.trim())return;await saveFeedback({t:fb,u:U?.n||"onbekend",d:TD});sFb("");sFo(0);alert("Bedankt voor je feedback!")}} style={btn(st.rd,"#fff")}>Verstuur</button><button onClick={()=>{sFo(0);sFb("")}} style={btn("#222","#888")}>Annuleer</button></div></div>}</div>;

const sideNav=()=><div style={{width:200,background:"#0a0a0a",borderRight:"1px solid #1a1a1a",padding:"20px 12px",display:"flex",flexDirection:"column",gap:4,position:"sticky",top:0,height:"100vh"}}>
<div style={{padding:"0 8px 16px",borderBottom:"1px solid #1a1a1a",marginBottom:8}}>
<div style={{fontSize:18,fontWeight:700,color:"#dc2626"}}>🎃 Horror Zone</div>
<div style={{fontSize:10,color:"#999",marginTop:2}}>{U?.n}</div>
</div>
{[["home","🏠","Home"],["search","🔍","Zoeken"],["dag","☀️","Dagstart"],["mile","🎯","Mijlpalen"],["team","👥","Team"],...(am?[["mat","📦","Materialen"]]:[])]
.map(([id,ic,lb])=>
<button key={id} onClick={()=>{sTb(id);sCH(null);sCR(null)}} style={{display:"flex",alignItems:"center",gap:10,background:tb===id?"#1a1a1a":"none",border:"none",cursor:"pointer",padding:"10px 12px",color:tb===id?"#dc2626":"#888",fontSize:13,borderRadius:6,textAlign:"left",fontWeight:tb===id?600:400}}>
<span style={{fontSize:16}}>{ic}</span><span>{lb}</span></button>)}
<div style={{marginTop:"auto",paddingTop:8,borderTop:"1px solid #1a1a1a"}}>
<button onClick={()=>{sU(null);S("zu",null)}} style={{display:"flex",alignItems:"center",gap:10,background:"none",border:"none",cursor:"pointer",padding:"10px 12px",color:"#bbb",fontSize:13,borderRadius:6,textAlign:"left",width:"100%"}}>
<span style={{fontSize:16}}>↩</span><span>Uitloggen</span></button>
</div>
</div>;
const demoBanner=<div style={{background:"#1a1500",border:"1px solid #854d0e",borderRadius:6,padding:"6px 10px",marginBottom:10,fontSize:10,color:"#ca8a04",display:"flex",alignItems:"center",gap:6}}>⚠ <span><b>Demoversie:</b> Laat je feedback achter voor verbeteringen, bedankt!.</span></div>;
const wrap=c=>isDesktop?
<div style={{minHeight:"100vh",background:st.bg,color:"#fff",fontFamily:"system-ui",display:"flex"}}>
{sideNav()}
<div style={{flex:1,padding:"24px 32px",width:"100%",maxWidth:1400,margin:"0 auto"}}>{demoBanner}{c}{fbBtn()}</div>
</div>
:
<div style={{minHeight:"100vh",background:st.bg,color:"#fff",padding:14,fontFamily:"system-ui",maxWidth:480,margin:"0 auto",paddingBottom:70}}>{demoBanner}{c}{fbBtn()}{nav()}</div>;

// TASK
const Tk=({t,sr})=>{const ed=cE(U,t.c),a=DBs.find(b=>b.id===t.w),od=t.s!=="completed"&&t.dl&&t.dl<TD,sd=(t.sb||[]).filter(x=>x.d).length,st2=(t.sb||[]).length;
const[eSb,sESb]=useState(null);const[eSbT,sESbT]=useState("");const[nSb,sNSb]=useState("");const sh=shT[t.id];const rm=R.find(x=>x.id===t.r),ho=DHs.find(x=>x.id===t.h);
if(eI===t.id)return<div style={{...bx,border:"1px solid #dc2626"}}><input value={eF.ti||""} onChange={e=>sEF({...eF,ti:e.target.value})} style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:6,padding:5,color:"#fff",fontSize:12,marginBottom:4,boxSizing:"border-box"}}/>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:4}}>
<select value={eF.pr} onChange={e=>sEF({...eF,pr:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:4,color:"#fff",fontSize:10}}>{["low","medium","high","critical"].map(v=><option key={v}>{v}</option>)}</select>
<select value={eF.c} onChange={e=>sEF({...eF,c:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:4,color:"#fff",fontSize:10}}>{CS.map(v=><option key={v}>{v}</option>)}</select>
<select value={eF.w||""} onChange={e=>sEF({...eF,w:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:4,color:"#fff",fontSize:10}}><option value="">—</option>{DBs.map(b=><option key={b.id} value={b.id}>{b.n}</option>)}</select>
<input type="date" value={eF.dl||""} onChange={e=>sEF({...eF,dl:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:4,color:"#fff",fontSize:10}}/>
<select value={eF.tp} onChange={e=>sEF({...eF,tp:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:4,color:"#fff",fontSize:10}}><option value="nodig">Nodig</option><option value="nice">Nice to have</option></select>
<select value={eF.milestone_id||""} onChange={e=>sEF({...eF,milestone_id:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:4,color:"#fff",fontSize:10}}><option value="">Geen mijlpaal</option>{M.map(m=><option key={m.id} value={m.id}>{m.n}</option>)}</select></div>
<textarea value={eF.nt||""} onChange={e=>sEF({...eF,nt:e.target.value})} placeholder="Notitie" style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:4,color:"#fff",fontSize:10,minHeight:30,resize:"vertical",marginBottom:4,boxSizing:"border-box"}}/>
<div style={{display:"flex",gap:4,marginTop:4}}><button onClick={async()=>{await updateTask({...t,...eF});sEI(null)}} style={btn(st.gn,"#fff")}>Opslaan</button><button onClick={()=>sEI(null)} style={btn("#222","#bbb")}>Annuleer</button>{am&&<button onClick={()=>{if(confirm("Verwijderen?"))removeTask(t.id)}} style={btn("#7f1d1d","#fff")}>🗑</button>}</div></div>;
return<div style={{...bx,padding:7,marginBottom:4,borderColor:od?"#7f1d1d":t.tp==="nice"?"#1e3a5f":"#222"}}>
<div style={{display:"flex",alignItems:"center",gap:6}}>
<button onClick={()=>{if(!ed)return;const ns=t.s==="completed"?"not_started":t.s==="in_progress"?"completed":"in_progress";updateTask({...t,s:ns})}} style={{background:"none",border:"none",cursor:ed?"pointer":"default",padding:0,fontSize:16,flexShrink:0}}>{t.s==="completed"?"✅":t.s==="in_progress"?"🔄":"⭕"}</button>
<div style={{flex:1,minWidth:0}}>
<div style={{fontSize:12,fontWeight:500,color:t.s==="completed"?"#888":"#fff",textDecoration:t.s==="completed"?"line-through":"none"}}>{t.ti}{sr&&rm&&ho&&<span style={{fontSize:9,color:"#999",fontWeight:400,marginLeft:5}}>· {ho.n}→{rm.n}</span>}</div>
<div style={{fontSize:9,color:"#bbb",display:"flex",gap:5,flexWrap:"wrap",marginTop:1}}>
<span style={{padding:"1px 4px",borderRadius:3,background:t.pr==="critical"?"#7f1d1d":t.pr==="high"?"#854d0e":"#1a1a1a",color:t.pr==="critical"?"#fff":t.pr==="high"?"#fde047":"#ccc"}}>{t.pr}</span>
<span>{t.c}</span>
{a&&<span>👤{a.n}</span>}
{t.dl&&<span style={{color:od?"#ef4444":"#bbb"}}>📅{t.dl}</span>}
<span style={{padding:"0 4px",borderRadius:3,background:t.tp==="nodig"?"#1a0505":"#05051a",color:t.tp==="nodig"?"#f87171":"#60a5fa"}}>{t.tp||"nodig"}</span>
{st2>0&&<span>📋{sd}/{st2}</span>}
{t.milestone_id&&<span style={{color:"#a78bfa"}}>🎯{M.find(x=>x.id===t.milestone_id)?.n}</span>}
</div>
{t.nt&&<div style={{fontSize:9,color:"#ca8a04",marginTop:2}}>⚠ {t.nt}</div>}
</div>
{ed&&<div style={{display:"flex",gap:2,flexShrink:0}}>
<button onClick={()=>{sEF({ti:t.ti,pr:t.pr,c:t.c,w:t.w,dl:t.dl,nt:t.nt,tp:t.tp,milestone_id:t.milestone_id||""});sEI(t.id)}} style={{background:"none",border:"none",color:"#bbb",cursor:"pointer",fontSize:12,padding:2}}>✏️</button>
{(st2>0||ed)&&<button onClick={()=>sShT(p=>({...p,[t.id]:!p[t.id]}))} style={{background:"none",border:"none",color:"#bbb",cursor:"pointer",fontSize:12,padding:2}}>{sh?"▲":"▼"}</button>}
</div>}
</div>
{sh&&<div style={{marginTop:5,paddingLeft:24}}>
{(t.sb||[]).map(s=><div key={s.id} style={{display:"flex",alignItems:"center",gap:5,padding:"2px 0"}}>
{eSb===s.id?<>
<input value={eSbT} onChange={e=>sESbT(e.target.value)} autoFocus onKeyDown={e=>{if(e.key==="Enter"&&eSbT.trim()){const nsb=(t.sb||[]).map(x=>x.id===s.id?{...x,ti:eSbT.trim()}:x);updateTask({...t,sb:nsb});sESb(null)}if(e.key==="Escape")sESb(null)}} style={{flex:1,background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:"2px 5px",color:"#fff",fontSize:10,boxSizing:"border-box"}}/>
<button onClick={()=>{if(eSbT.trim()){const nsb=(t.sb||[]).map(x=>x.id===s.id?{...x,ti:eSbT.trim()}:x);updateTask({...t,sb:nsb})}sESb(null)}} style={{background:"none",border:"none",color:"#4ade80",cursor:"pointer",padding:0,fontSize:10}}>✓</button>
<button onClick={()=>sESb(null)} style={{background:"none",border:"none",color:"#888",cursor:"pointer",padding:0,fontSize:10}}>✕</button>
</>:<>
<button onClick={()=>{if(!ed)return;const nsb=(t.sb||[]).map(x=>x.id===s.id?{...x,d:!x.d}:x);updateTask({...t,sb:nsb})}} style={{background:"none",border:"none",cursor:ed?"pointer":"default",padding:0,fontSize:11}}>{s.d?"☑":"☐"}</button>
<span style={{fontSize:10,color:s.d?"#888":"#ccc",textDecoration:s.d?"line-through":"none",flex:1}}>{s.ti}</span>
{ed&&<button onClick={()=>{sESb(s.id);sESbT(s.ti)}} style={{background:"none",border:"none",color:"#888",cursor:"pointer",padding:0,fontSize:9}}>✏️</button>}
{ed&&<button onClick={()=>{const nsb=(t.sb||[]).filter(x=>x.id!==s.id);updateTask({...t,sb:nsb})}} style={{background:"none",border:"none",color:"#888",cursor:"pointer",padding:0,fontSize:9}}>✕</button>}
</>}
</div>)}
{ed&&<div style={{display:"flex",gap:4,marginTop:4}}>
<input value={nSb} onChange={e=>sNSb(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&nSb.trim()){const nsb=[...(t.sb||[]),{id:"s"+Date.now(),ti:nSb.trim(),d:false}];updateTask({...t,sb:nsb});sNSb("")}}} placeholder="+ Subtaak…" style={{flex:1,background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:"3px 6px",color:"#fff",fontSize:10,boxSizing:"border-box"}}/>
<button onClick={()=>{if(!nSb.trim())return;const nsb=[...(t.sb||[]),{id:"s"+Date.now(),ti:nSb.trim(),d:false}];updateTask({...t,sb:nsb});sNSb("")}} style={{background:"none",border:"none",color:st.rd,cursor:"pointer",fontSize:12,fontWeight:700,padding:0}}>+</button>
</div>}
</div>}
</div>};



// ROOM
if(cR){const rm=cR,ho=DHs.find(x=>x.id===rm.h),rt=T.filter(t=>t.r===rm.id),pr=rP(rm.id,T);
  const tasksNodig=rt.filter(t=>(t.tp||"nodig")==="nodig");
  const tasksNice=rt.filter(t=>t.tp==="nice");
  
  const backBtn=<button onClick={()=>sCR(null)} style={{background:"none",border:"none",color:"#bbb",fontSize:11,cursor:"pointer",padding:0,marginBottom:6}}>← Terug</button>;
  
  const roomHeader=<>
  <div style={{fontSize:9,color:st.rd,fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>{ho?.n} · Kamer {rm.o}</div>
  <h1 style={{fontSize:isDesktop?22:17,fontWeight:700,margin:"2px 0 6px"}}>{rm.n}</h1>
  <div style={{height:5,background:"#222",borderRadius:2,marginBottom:isDesktop?14:10,overflow:"hidden"}}><div style={{height:"100%",background:st.rd,width:`${pr}%`}}/></div>
  </>;
  
  const roomTeamBlock=<div>
  <div style={{fontSize:9,color:"#999",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Bouwers ({rm.cr.length})</div>
  {rm.cr.length===0?<div style={{...bx,fontSize:10,color:"#999",textAlign:"center",padding:8}}>Geen bouwers toegewezen</div>
  :<div style={{display:"flex",flexWrap:"wrap",gap:5}}>{rm.cr.map(id=>{const b=DBs.find(x=>x.id===id);return b?<div key={id} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 8px",background:"#1a1a1a",borderRadius:6,fontSize:10,color:"#aaa"}}><div style={{width:18,height:18,borderRadius:"50%",background:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#ccc"}}>{b.n[0]}</div>{b.n}</div>:null})}</div>}
  </div>;
  
  const roomNote=rm.nt&&<div style={{padding:8,background:"#1a1500",border:"1px solid #433",borderRadius:6,fontSize:11,color:"#ca8a04"}}>⚠ {rm.nt}</div>;
  
  const updMat=async(newMt)=>{const up={...rm,mt:newMt};sCR(up);await updateRoom(up)};

  const materialsBlock=<div>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
  <span style={{fontSize:9,color:"#999",fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Materialen ({(rm.mt||[]).length})</span>
  {am&&<button onClick={()=>updMat([...(rm.mt||[]),{n:"",q:1,s:"nodig"}])} style={{background:"none",border:"none",color:st.rd,cursor:"pointer",fontSize:14,fontWeight:700}}>+</button>}
  </div>
  {(rm.mt||[]).length===0?<div style={{...bx,fontSize:10,color:"#999",textAlign:"center",padding:8}}>Geen materialen</div>
  :(rm.mt||[]).map((m,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,...bx,padding:7,marginBottom:4}}>
  {am?<>
  <input value={m.n} onChange={e=>{const mt=[...(rm.mt||[])];mt[i]={...mt[i],n:e.target.value};sCR({...rm,mt})}} onBlur={()=>updateRoom(rm)} placeholder="Naam…" style={{flex:1,background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:"3px 6px",color:"#fff",fontSize:11,boxSizing:"border-box",minWidth:0}}/>
  <input type="number" value={m.q} min={0} onChange={e=>{const mt=[...(rm.mt||[])];mt[i]={...mt[i],q:parseInt(e.target.value)||0};updMat(mt)}} style={{width:44,background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:"3px 4px",color:"#fff",fontSize:11,textAlign:"center",boxSizing:"border-box"}}/>
  <select value={m.s} onChange={e=>{const mt=[...(rm.mt||[])];mt[i]={...mt[i],s:e.target.value};updMat(mt)}} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:"3px 4px",color:m.s==="aanwezig"?"#4ade80":m.s==="besteld"?"#facc15":"#f87171",fontSize:10}}>
  <option value="nodig">nodig</option><option value="besteld">besteld</option><option value="aanwezig">aanwezig</option></select>
  <button onClick={()=>{const mt=(rm.mt||[]).filter((_,j)=>j!==i);updMat(mt)}} style={{background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:10,padding:0}}>✕</button>
  </>:<>
  <span style={{fontSize:11,flex:1,color:"#aaa"}}>{m.n||"—"}</span>
  <span style={{fontSize:10,color:"#aaa"}}>×{m.q}</span>
  <span style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:m.s==="aanwezig"?"#0a1f0a":m.s==="besteld"?"#1a1500":"#1a0505",color:m.s==="aanwezig"?"#4ade80":m.s==="besteld"?"#facc15":"#f87171"}}>{m.s}</span>
  </>}
  </div>)}
  </div>;
  
  const addTaskBtn=am&&<button onClick={async()=>{const t={id:"t"+Date.now(),r:rm.id,h:rm.h,ti:"Nieuwe taak",s:"not_started",pr:"medium",c:"overig",w:null,dl:null,nt:"",tp:"nodig",sb:[],milestone_id:null};console.log("addTask room:",t);await addTask(t)}} style={btn(st.rd,"#fff")}>+ Taak toevoegen</button>;
  
  const tasksBlock=<div>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
  <span style={{fontSize:9,color:"#999",fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Taken ({rt.length})</span>
  {addTaskBtn}
  </div>
  {tasksNodig.length>0&&<><div style={{fontSize:9,color:"#f87171",fontWeight:700,marginBottom:4,marginTop:4}}>NODIG ({tasksNodig.length})</div>
  {tasksNodig.map(t=><Tk key={t.id} t={t}/>)}</>}
  {tasksNice.length>0&&<><div style={{fontSize:9,color:"#60a5fa",fontWeight:700,marginBottom:4,marginTop:8}}>NICE TO HAVE ({tasksNice.length})</div>
  {tasksNice.map(t=><Tk key={t.id} t={t}/>)}</>}
  {rt.length===0&&<div style={{...bx,textAlign:"center",color:"#888",fontSize:11,padding:20}}>Nog geen taken voor deze kamer</div>}
  </div>;
  
  if(isDesktop)return wrap(<>
  {backBtn}
  {roomHeader}
  <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:20,alignItems:"start"}}>
  <div>{tasksBlock}</div>
  <div style={{position:"sticky",top:20,display:"flex",flexDirection:"column",gap:14}}>
  {roomNote}
  {roomTeamBlock}
  {materialsBlock}
  </div>
  </div>
  </>);
  
  return wrap(<>
  {backBtn}
  {roomHeader}
  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>{rm.cr.map(id=>{const b=DBs.find(x=>x.id===id);return b?<span key={id} style={{fontSize:10,padding:"2px 6px",background:"#1a1a1a",borderRadius:4,color:"#ccc"}}>{b.n}</span>:null})}</div>
  {rm.nt&&<div style={{marginBottom:8,padding:6,background:"#1a1500",border:"1px solid #433",borderRadius:6,fontSize:10,color:"#ca8a04"}}>⚠ {rm.nt}</div>}
  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:9,color:"#999",fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Materialen</span>
  {am&&<button onClick={()=>updMat([...(rm.mt||[]),{n:"",q:1,s:"nodig"}])} style={{background:"none",border:"none",color:st.rd,cursor:"pointer",fontSize:12}}>+</button>}</div>
  {(rm.mt||[]).map((m,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4,...bx,padding:5}}>
  {am?<>
  <input value={m.n} onChange={e=>{const mt=[...(rm.mt||[])];mt[i]={...mt[i],n:e.target.value};sCR({...rm,mt})}} onBlur={()=>updateRoom(rm)} placeholder="Naam…" style={{flex:1,background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:"2px 5px",color:"#fff",fontSize:10,boxSizing:"border-box",minWidth:0}}/>
  <input type="number" value={m.q} min={0} onChange={e=>{const mt=[...(rm.mt||[])];mt[i]={...mt[i],q:parseInt(e.target.value)||0};updMat(mt)}} style={{width:38,background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:"2px 3px",color:"#fff",fontSize:10,textAlign:"center",boxSizing:"border-box"}}/>
  <select value={m.s} onChange={e=>{const mt=[...(rm.mt||[])];mt[i]={...mt[i],s:e.target.value};updMat(mt)}} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:"2px 3px",color:m.s==="aanwezig"?"#4ade80":m.s==="besteld"?"#facc15":"#f87171",fontSize:9}}>
  <option value="nodig">nodig</option><option value="besteld">besteld</option><option value="aanwezig">aanwezig</option></select>
  <button onClick={()=>{const mt=(rm.mt||[]).filter((_,j)=>j!==i);updMat(mt)}} style={{background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:9,padding:0}}>✕</button>
  </>:<>
  <span style={{fontSize:11,flex:1,color:"#aaa"}}>{m.n||"—"}</span><span style={{fontSize:9,color:"#aaa"}}>×{m.q}</span>
  <span style={{fontSize:9,color:m.s==="aanwezig"?"#4ade80":m.s==="besteld"?"#facc15":"#f87171"}}>{m.s}</span>
  </>}
  </div>)}
  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,marginTop:8}}><span style={{fontSize:9,color:"#999",fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Taken({rt.length})</span>
  {am&&<button onClick={async()=>{const t={id:"t"+Date.now(),r:rm.id,h:rm.h,ti:"Nieuwe taak",s:"not_started",pr:"medium",c:"overig",w:null,dl:null,nt:"",tp:"nodig",sb:[],milestone_id:null};console.log("addTask room:",t);await addTask(t)}} style={btn(st.rd,"#fff")}>+ Taak</button>}</div>
  {tasksNodig.length>0&&<div style={{fontSize:8,color:"#f87171",fontWeight:700,marginBottom:2}}>NODIG</div>}
  {tasksNodig.map(t=><Tk key={t.id} t={t}/>)}
  {tasksNice.length>0&&<div style={{fontSize:8,color:"#60a5fa",fontWeight:700,marginBottom:2,marginTop:4}}>NICE TO HAVE</div>}
  {tasksNice.map(t=><Tk key={t.id} t={t}/>)}
  </>)}
  

// HOUSE
if(cH){const h=cH,hr=R.filter(x=>x.h===h.id).sort((a,b)=>a.o-b.o),pr=hP(h.id,T),ht=T.filter(t=>t.h===h.id),dn=ht.filter(t=>t.s==="completed").length,ip=ht.filter(t=>t.s==="in_progress").length;
const hOverdue=ht.filter(t=>t.s!=="completed"&&t.dl&&t.dl<TD);

const backBtn=<button onClick={()=>sCH(null)} style={{background:"none",border:"none",color:"#bbb",fontSize:11,cursor:"pointer",padding:0,marginBottom:6}}>← Dashboard</button>;

const houseHeader=<>
<div style={{fontSize:9,color:st.rd,fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>{h.l}</div>
<h1 style={{fontSize:isDesktop?22:17,fontWeight:700,margin:"2px 0 6px"}}>{h.n}</h1>
</>;

const houseStats=<div style={{display:"grid",gridTemplateColumns:isDesktop?"1fr 1fr":"1fr 1fr",gap:isDesktop?8:4,marginBottom:isDesktop?14:6}}>
{[{l:"Voortgang",v:pr+"%",c:st.rd},{l:"Kamers",v:hr.length,c:"#3b82f6"},{l:"Hoofdbouw",v:DBs.find(b=>b.id===h.ld)?.n||"—",c:st.gn},{l:"Deadline",v:h.dl,c:st.yw}].map((x,i)=>
<div key={i} style={{...bx,textAlign:"center",padding:isDesktop?10:6}}><div style={{fontSize:isDesktop?10:8,color:"#999"}}>{x.l}</div><div style={{fontSize:isDesktop?16:14,fontWeight:700,color:x.c}}>{x.v}</div></div>)}</div>;

const progressBar=<>
<div style={{height:5,background:"#222",borderRadius:2,marginBottom:3,display:"flex",overflow:"hidden"}}>{dn>0&&<div style={{background:st.gn,width:`${dn/ht.length*100}%`,height:"100%"}}/>}{ip>0&&<div style={{background:st.yw,width:`${ip/ht.length*100}%`,height:"100%"}}/>}</div>
<div style={{display:"flex",gap:10,fontSize:10,color:"#999",marginBottom:isDesktop?14:10}}>🟢 {dn} klaar · 🟡 {ip} bezig · ⚪ {ht.length-dn-ip} open</div>
</>;

const roomsList=<>
<div style={{fontSize:9,color:"#999",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Kamers ({hr.length})</div>
{hr.map(r=>{const rp=rP(r.id,T),rTasks=T.filter(t=>t.r===r.id);return<button key={r.id} onClick={()=>sCR(r)} style={{width:"100%",...bx,padding:isDesktop?12:10,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",color:"#fff"}}>
<div style={{display:"flex",alignItems:"center",gap:8,flex:1}}><div style={{width:isDesktop?28:22,height:isDesktop?28:22,borderRadius:6,background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:isDesktop?12:10,fontWeight:700,color:"#999"}}>{r.o}</div>
<div style={{flex:1}}>
<div style={{fontSize:isDesktop?13:12,fontWeight:600}}>{r.n}</div>
<div style={{fontSize:10,color:"#999",display:"flex",gap:8}}>
<span>📋 {rTasks.length} taken</span>
{r.cr.length>0&&<span>👥 {r.cr.length}</span>}
{r.nt&&<span style={{color:"#ca8a04"}}>⚠</span>}
</div>
</div>
</div>
<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:isDesktop?60:30}}><div style={{height:4,background:"#222",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",background:rp===100?st.gn:st.rd,width:`${rp}%`}}/></div></div>{isDesktop&&<span style={{fontSize:10,color:rp===100?st.gn:st.rd,fontWeight:600,minWidth:32,textAlign:"right"}}>{rp}%</span>}<span style={{color:"#888"}}>›</span></div></button>})}
</>;

const houseOverdueList=hOverdue.length>0&&<div>
<div style={{fontSize:9,color:"#ef4444",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>⚠ Achterstand ({hOverdue.length})</div>
{hOverdue.slice(0,isDesktop?6:3).map(t=>{const r=R.find(x=>x.id===t.r);return<div key={t.id} onClick={()=>sCR(r)} style={{background:"#1a0505",border:"1px solid #7f1d1d",borderRadius:6,padding:6,marginBottom:3,cursor:"pointer"}}>
<div style={{fontSize:10,color:"#fca5a5",fontWeight:500}}>{t.ti}</div>
<div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#ef4444",marginTop:2}}><span>{r?.n}</span><span>{t.dl}</span></div>
</div>})}
</div>;

const houseTeam=<div>
<div style={{fontSize:9,color:"#999",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Betrokken bouwers</div>
{(()=>{const ids=new Set();hr.forEach(r=>r.cr.forEach(c=>ids.add(c)));ht.forEach(t=>t.w&&ids.add(t.w));const list=[...ids].map(id=>DBs.find(b=>b.id===id)).filter(Boolean);
if(list.length===0)return<div style={{...bx,fontSize:10,color:"#999",textAlign:"center",padding:8}}>Geen bouwers toegewezen</div>;
return<div style={{display:"flex",flexWrap:"wrap",gap:5}}>{list.map(b=><div key={b.id} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 8px",background:"#1a1a1a",borderRadius:6,fontSize:10,color:"#aaa"}}><div style={{width:18,height:18,borderRadius:"50%",background:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#ccc"}}>{b.n[0]}</div>{b.n}</div>)}</div>})()}
</div>;

if(isDesktop)return wrap(<>
{backBtn}
{houseHeader}
{progressBar}
<div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:20,alignItems:"start"}}>
<div>{roomsList}</div>
<div style={{position:"sticky",top:20}}>
{houseStats}
{houseOverdueList&&<div style={{marginBottom:14}}>{houseOverdueList}</div>}
{houseTeam}
</div>
</div>
</>);

return wrap(<>
{backBtn}
{houseHeader}
{houseStats}
{progressBar}
{hr.map(r=>{const rp=rP(r.id,T);return<button key={r.id} onClick={()=>sCR(r)} style={{width:"100%",...bx,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",color:"#fff"}}>
<div style={{display:"flex",alignItems:"center",gap:6,flex:1}}><div style={{width:22,height:22,borderRadius:5,background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#999"}}>{r.o}</div>
<div><div style={{fontSize:12,fontWeight:600}}>{r.n}</div><div style={{fontSize:9,color:"#999"}}>{T.filter(t=>t.r===r.id).length} taken</div></div></div>
<div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:30}}><div style={{height:3,background:"#222",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",background:rp===100?st.gn:st.rd,width:`${rp}%`}}/></div></div><span style={{color:"#888"}}>›</span></div></button>})}
</>)}

// SEARCH
if(tb==="search"){const qry=(q||"").toLowerCase().trim();
const rs=!qry?[]:[...DHs.filter(h=>h.n.toLowerCase().includes(qry)||h.l.toLowerCase().includes(qry)).map(h=>({tp:"huis",d:h,i:"🏠",l:h.l,c:"#3b82f6"})),
...R.filter(r=>r.n.toLowerCase().includes(qry)||(r.nt||"").toLowerCase().includes(qry)).map(r=>{const h=DHs.find(x=>x.id===r.h);return{tp:"kamer",d:r,i:"🚪",l:h?.n,c:"#a855f7",h}}),
...T.filter(t=>t.ti.toLowerCase().includes(qry)||(t.nt||"").toLowerCase().includes(qry)||(t.sb||[]).some(s=>(s.t||"").toLowerCase().includes(qry))).map(t=>{const r=R.find(x=>x.id===t.r),h=DHs.find(x=>x.id===t.h);return{tp:"taak",d:t,i:t.s==="completed"?"✅":t.s==="in_progress"?"🔄":"⭕",l:`${h?.n}→${r?.n}`,c:t.s==="completed"?"#4ade80":"#facc15",r,h}}),
...DBs.filter(b=>b.n.toLowerCase().includes(qry)||b.r.toLowerCase().includes(qry)).map(b=>({tp:"persoon",d:b,i:"👤",l:b.r,c:"#fb923c"}))];

return wrap(<>
<h1 style={{fontSize:isDesktop?22:17,fontWeight:700,marginBottom:isDesktop?14:8}}>🔍 Zoeken</h1>
<input value={q} onChange={e=>sQ(e.target.value)} autoFocus placeholder="Zoek huizen, kamers, taken, personen…" style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:8,padding:isDesktop?"12px 14px":"8px 10px",color:"#fff",fontSize:isDesktop?14:12,marginBottom:isDesktop?14:10,boxSizing:"border-box"}}/>
{!qry?<div style={{...bx,textAlign:"center",color:"#888",fontSize:11,padding:isDesktop?40:20}}>Typ iets om te zoeken</div>
:rs.length===0?<div style={{...bx,textAlign:"center",color:"#888",fontSize:11,padding:isDesktop?40:20}}>Geen resultaten voor "{q}"</div>
:<>
<div style={{fontSize:10,color:"#999",marginBottom:6}}>{rs.length} resultaten</div>
<div style={{display:"grid",gridTemplateColumns:isDesktop?"1fr 1fr":"1fr",gap:isDesktop?8:4}}>
{rs.map((r,i)=><button key={i} onClick={()=>{if(r.tp==="huis"){sCH(r.d);sTb("home")}else if(r.tp==="kamer"){sCH(r.h);sCR(r.d);sTb("home")}else if(r.tp==="taak"){sCH(r.h);sCR(r.r);sTb("home")}else{sTb("team")}}} style={{...bx,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:8,color:"#fff",padding:isDesktop?10:7}}>
<span style={{fontSize:isDesktop?18:14}}>{r.i}</span>
<div style={{flex:1,minWidth:0}}>
<div style={{fontSize:isDesktop?12:11,fontWeight:600}}>{r.d.n||r.d.ti}</div>
<div style={{fontSize:isDesktop?10:9,color:"#999",display:"flex",gap:5,alignItems:"center"}}>
<span style={{padding:"1px 5px",borderRadius:3,background:"#1a1a1a",color:r.c,fontSize:8,textTransform:"uppercase",fontWeight:700}}>{r.tp}</span>
<span>{r.l}</span>
</div>
</div>
<span style={{color:"#888"}}>›</span>
</button>)}
</div>
</>}
</>)}

// DAGSTART
if(tb==="dag"){const dtT=T.filter(t=>dT.includes(t.id)),up=T.filter(t=>t.s!=="completed"&&t.dl&&t.dl<=TD&&!dT.includes(t.id)),od=T.filter(t=>t.s!=="completed"&&t.dl&&t.dl<TD);
const dagStartNodig=dtT.filter(t=>(t.tp||"nodig")==="nodig");
const dagStartNice=dtT.filter(t=>t.tp==="nice");

const dagHeader=<>
<h1 style={{fontSize:isDesktop?22:17,fontWeight:700,margin:0}}>☀️ Dagstart</h1>
<p style={{fontSize:isDesktop?12:10,color:"#999",marginBottom:isDesktop?14:8,marginTop:4}}>{new Date().toLocaleDateString("nl-NL",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
</>;

const presentBlock=<div>
<div style={{fontSize:9,color:"#999",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Aanwezig ({dB.length})</div>
<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:isDesktop?14:10}}>{DBs.filter(b=>b.id!=="b0").map(b=>{const s=dB.includes(b.id);return<button key={b.id} onClick={()=>{if(!am)return;const n=s?dB.filter(x=>x!==b.id):[...dB,b.id];sDB(n);updateDagstart(n,dT)}} style={{padding:"4px 10px",borderRadius:14,border:`1px solid ${s?"#166534":"#222"}`,background:s?"#0a1f0a":"#111",color:s?"#4ade80":"#444",fontSize:10,cursor:am?"pointer":"default"}}>{b.n}</button>})}</div>
</div>;

const addToTodayBlock=am&&up.length>0&&<div>
<div style={{fontSize:9,color:"#999",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Toevoegen aan vandaag ({up.length})</div>
{up.slice(0,isDesktop?8:5).map(t=>{const r=R.find(x=>x.id===t.r),h=DHs.find(x=>x.id===t.h);return<button key={t.id} onClick={()=>{const n=[...dT,t.id];sDT(n);updateDagstart(dB,n)}} style={{width:"100%",...bx,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:6,color:"#fff",padding:7}}>
<span style={{color:st.rd,fontSize:14,fontWeight:700}}>+</span>
<div style={{flex:1}}><div style={{fontSize:11,fontWeight:500}}>{t.ti}</div><div style={{fontSize:9,color:"#999"}}>{h?.n}→{r?.n}</div></div>
<span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:t.tp==="nodig"?"#1a0505":"#05051a",color:t.tp==="nodig"?"#f87171":"#60a5fa"}}>{t.tp}</span>
</button>})}
</div>;

const dQaRooms=dQaF.h?R.filter(r=>r.h===dQaF.h):[];
const dagNewTask=am&&<div>
{!dQa?<button onClick={()=>sDQa(1)} style={{width:"100%",background:st.rd,color:"#fff",border:"none",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>+ Nieuwe dagtaak</button>
:<div style={{...bx,border:`1px solid ${st.rd}`,padding:10}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:11,fontWeight:600}}>Nieuwe taak voor vandaag</span><button onClick={()=>{sDQa(0);sDQaF({h:"",r:"",ti:"",w:""})}} style={{background:"none",border:"none",color:"#bbb",cursor:"pointer",fontSize:14}}>✕</button></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:4}}>
<select value={dQaF.h} onChange={e=>sDQaF({...dQaF,h:e.target.value,r:""})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11}}><option value="">Huis…</option>{DHs.map(h=><option key={h.id} value={h.id}>{h.n}</option>)}</select>
<select value={dQaF.r} onChange={e=>sDQaF({...dQaF,r:e.target.value})} disabled={!dQaF.h} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11,opacity:dQaF.h?1:.5}}><option value="">Kamer…</option>{dQaRooms.map(r=><option key={r.id} value={r.id}>{r.n}</option>)}</select>
</div>
<input value={dQaF.ti} onChange={e=>sDQaF({...dQaF,ti:e.target.value})} placeholder="Taaknaam" style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11,marginBottom:4,boxSizing:"border-box"}}/>
<select value={dQaF.w} onChange={e=>sDQaF({...dQaF,w:e.target.value})} style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11,marginBottom:6,boxSizing:"border-box"}}><option value="">Toewijzen aan…</option>{DBs.map(b=><option key={b.id} value={b.id}>{b.n}</option>)}</select>
<button onClick={async()=>{if(!dQaF.h||!dQaF.r||!dQaF.ti.trim())return;const newId="t"+Date.now();await addTask({id:newId,r:dQaF.r,h:dQaF.h,ti:dQaF.ti.trim(),s:"not_started",pr:"medium",c:"overig",w:dQaF.w,dl:TD,nt:"",tp:"nodig",sb:[],milestone_id:null});const n=[...dT,newId];sDT(n);updateDagstart(dB,n);sDQa(0);sDQaF({h:"",r:"",ti:"",w:""})}} disabled={!dQaF.h||!dQaF.r||!dQaF.ti.trim()} style={{...btn(st.gn,"#fff"),width:"100%",padding:"6px 10px",opacity:dQaF.h&&dQaF.r&&dQaF.ti.trim()?1:.5,cursor:dQaF.h&&dQaF.r&&dQaF.ti.trim()?"pointer":"not-allowed"}}>Aanmaken & toevoegen aan vandaag</button>
</div>}
</div>;

const todayBlock=<div>
<div style={{fontSize:9,color:"#999",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Vandaag op de planning ({dtT.length})</div>
{!dtT.length?<div style={{...bx,textAlign:"center",color:"#888",fontSize:11,padding:isDesktop?20:12}}>Geen taken voor vandaag{am&&<><br/><span style={{fontSize:9}}>Voeg taken toe via de lijst hiernaast</span></>}</div>
:<>
{dagStartNodig.length>0&&<div style={{fontSize:9,color:"#f87171",fontWeight:700,marginBottom:4}}>NODIG ({dagStartNodig.length})</div>}
{dagStartNodig.map(t=><Tk key={t.id} t={t} sr={1}/>)}
{dagStartNice.length>0&&<div style={{fontSize:9,color:"#60a5fa",fontWeight:700,marginBottom:4,marginTop:8}}>NICE TO HAVE ({dagStartNice.length})</div>}
{dagStartNice.map(t=><Tk key={t.id} t={t} sr={1}/>)}
</>}
</div>;

const overdueBlock=od.length>0&&<div>
<div style={{fontSize:9,color:"#ef4444",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>⚠ Achterstand ({od.length})</div>
{od.slice(0,isDesktop?8:4).map(t=>{const r=R.find(x=>x.id===t.r),h=DHs.find(x=>x.id===t.h);return<div key={t.id} onClick={()=>{sCH(h);sCR(r)}} style={{background:"#1a0505",border:"1px solid #7f1d1d",borderRadius:6,padding:6,marginBottom:3,cursor:"pointer"}}>
<div style={{fontSize:10,color:"#fca5a5",fontWeight:500}}>{t.ti}</div>
<div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#ef4444",marginTop:2}}><span>{h?.n}→{r?.n}</span><span>{t.dl}</span></div>
</div>})}
</div>;

if(isDesktop)return wrap(<>
{dagHeader}
{presentBlock}
<div style={{display:"grid",gridTemplateColumns:am?"1.5fr 1fr":"1fr",gap:20,alignItems:"start"}}>
<div>{todayBlock}</div>
{am&&<div style={{position:"sticky",top:20,display:"flex",flexDirection:"column",gap:14}}>
{dagNewTask}
{addToTodayBlock}
{overdueBlock}
</div>}
{!am&&overdueBlock&&<div style={{marginTop:14}}>{overdueBlock}</div>}
</div>
</>);

return wrap(<>
{dagHeader}
{presentBlock}
{am&&<div style={{marginBottom:10}}>{dagNewTask}</div>}
{addToTodayBlock&&<div style={{marginBottom:10}}>{addToTodayBlock}</div>}
{todayBlock}
{overdueBlock&&<div style={{marginTop:10}}>{overdueBlock}</div>}
</>)}

// PERSON
if(tb==="person"&&cP){const ptasks=T.filter(t=>t.w===cP.id);
  const byHouse={};ptasks.forEach(t=>{const h=DHs.find(x=>x.id===t.h);const key=h?h.n:"Onbekend";if(!byHouse[key])byHouse[key]=[];byHouse[key].push(t)});
  const done=ptasks.filter(t=>t.s==="completed").length;
  const ip=ptasks.filter(t=>t.s==="in_progress").length;
  const open=ptasks.filter(t=>t.s==="not_started").length;
  const od=ptasks.filter(t=>t.s!=="completed"&&t.dl&&t.dl<TD).length;
  const isAdminP=cP.p==="admin";
  
  return wrap(<>
  <button onClick={()=>{sCP(null);sTb("team")}} style={{background:"none",border:"none",color:"#bbb",fontSize:11,cursor:"pointer",padding:0,marginBottom:isDesktop?14:6}}>← Team</button>
  <div style={{display:"flex",alignItems:"center",gap:isDesktop?14:8,marginBottom:isDesktop?14:10}}>
  <div style={{width:isDesktop?54:36,height:isDesktop?54:36,borderRadius:"50%",background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:isDesktop?22:14,color:"#aaa"}}>{cP.n[0]}</div>
  <div>
  <h1 style={{fontSize:isDesktop?22:18,fontWeight:700,margin:0}}>{cP.n}</h1>
  <div style={{fontSize:isDesktop?12:10,color:"#bbb",marginTop:2}}>{cP.r}{isAdminP&&<span style={{marginLeft:6,padding:"2px 6px",background:"#1a0505",color:"#fca5a5",borderRadius:3,fontSize:9,fontWeight:600}}>ADMIN</span>}</div>
  </div>
  </div>
  
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:isDesktop?8:4,marginBottom:isDesktop?14:10}}>
  {[{l:"Totaal",v:ptasks.length,c:"#bbb"},{l:"Klaar",v:done,c:st.gn},{l:"Bezig",v:ip,c:st.yw},{l:"Open",v:open,c:"#888"}].map((x,i)=>
  <div key={i} style={{...bx,textAlign:"center",padding:isDesktop?10:6}}><div style={{fontSize:isDesktop?10:8,color:"#999"}}>{x.l}</div><div style={{fontSize:isDesktop?20:14,fontWeight:700,color:x.c}}>{x.v}</div></div>)}
  </div>
  
  {od>0&&<div style={{...bx,background:"#1a0505",border:"1px solid #7f1d1d",padding:10,marginBottom:isDesktop?14:10}}>
  <div style={{fontSize:11,color:"#fca5a5",fontWeight:600}}>⚠ {od} taak{od>1?"en":""} met achterstand</div>
  </div>}
  
  {ptasks.length===0?<div style={{...bx,textAlign:"center",color:"#888",fontSize:11,padding:isDesktop?40:20}}>Geen taken toegewezen aan {cP.n}</div>
  :Object.keys(byHouse).map(hName=>{const tasks=byHouse[hName];return<div key={hName} style={{marginBottom:isDesktop?14:10}}>
  <div style={{fontSize:9,color:"#999",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>🏠 {hName} ({tasks.length})</div>
  {tasks.map(t=>{const r=R.find(x=>x.id===t.r),h=DHs.find(x=>x.id===t.h),odT=t.s!=="completed"&&t.dl&&t.dl<TD;
  return<div key={t.id} onClick={()=>{sCH(h);sCR(r);sCP(null);sTb("home")}} style={{...bx,cursor:"pointer",padding:8,marginBottom:4,borderColor:odT?"#7f1d1d":"#222",display:"flex",alignItems:"center",gap:8}}>
  <span style={{fontSize:14}}>{t.s==="completed"?"✅":t.s==="in_progress"?"🔄":"⭕"}</span>
  <div style={{flex:1,minWidth:0}}>
  <div style={{fontSize:11,fontWeight:500,color:t.s==="completed"?"#888":"#fff",textDecoration:t.s==="completed"?"line-through":"none"}}>{t.ti}</div>
  <div style={{fontSize:9,color:"#999",display:"flex",gap:5,flexWrap:"wrap"}}>
  <span>{r?.n}</span>{t.dl&&<span style={{color:odT?"#ef4444":""}}>📅 {t.dl}</span>}
  <span style={{padding:"0 4px",borderRadius:3,background:t.tp==="nodig"?"#1a0505":"#05051a",color:t.tp==="nodig"?"#f87171":"#60a5fa"}}>{t.tp||"nodig"}</span>
  </div>
  </div>
  <span style={{color:"#666"}}>›</span>
  </div>})}
  </div>})}
  </>)}

// MIJLPALEN
if(tb==="mile"){const today=new Date(TD);const sorted=[...M].sort((a,b)=>a.dl.localeCompare(b.dl));
  const mStatus=m=>{if(m.d)return{c:"#16a34a",l:"Gehaald",bg:"#0a1f0a",bd:"#166534"};const dd=new Date(m.dl);const diff=Math.ceil((dd-today)/(1000*60*60*24));if(diff<0)return{c:"#ef4444",l:"Gemist",bg:"#1a0505",bd:"#7f1d1d"};if(diff<=7)return{c:"#ef4444",l:`${diff}d`,bg:"#1a0505",bd:"#7f1d1d"};if(diff<=14)return{c:"#facc15",l:`${diff}d`,bg:"#1a1500",bd:"#854d0e"};return{c:"#888",l:`${diff}d`,bg:"#0f0f0f",bd:"#222"}};
  return wrap(<>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
  <h1 style={{fontSize:isDesktop?22:17,fontWeight:700,margin:0}}>🎯 Mijlpalen</h1>
  {am&&<button onClick={()=>sNM(1)} style={btn(st.rd,"#fff")}>+ Nieuwe</button>}
  </div>
  <p style={{fontSize:isDesktop?12:10,color:"#bbb",marginBottom:isDesktop?14:10}}>{sorted.length} mijlpalen · {sorted.filter(m=>!m.d).length} open</p>
  
  {!!nM&&<div style={{...bx,border:`1px solid ${st.rd}`,padding:10,marginBottom:10}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:11,fontWeight:600}}>Nieuwe mijlpaal</span><button onClick={()=>{sNM(0);sEMf({})}} style={{background:"none",border:"none",color:"#bbb",cursor:"pointer",fontSize:14}}>✕</button></div>
  <input value={eMf.n||""} onChange={e=>sEMf({...eMf,n:e.target.value})} placeholder="Naam mijlpaal" style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11,marginBottom:5,boxSizing:"border-box"}}/>
  <input type="date" value={eMf.dl||""} onChange={e=>sEMf({...eMf,dl:e.target.value})} style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11,marginBottom:5,boxSizing:"border-box"}}/>
  <input value={eMf.nt||""} onChange={e=>sEMf({...eMf,nt:e.target.value})} placeholder="Notitie (optioneel)" style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11,marginBottom:8,boxSizing:"border-box"}}/>
  <button onClick={async()=>{const naam=(eMf.n||"").trim(),datum=eMf.dl;if(!naam){alert("Vul een naam in");return}if(!datum){alert("Kies een datum");return}await addMilestone({id:"m"+Date.now(),n:naam,dl:datum,d:0,nt:eMf.nt||""});sNM(0);sEMf({})}} style={{...btn(st.gn,"#fff"),width:"100%"}}>Toevoegen</button>
  </div>}
  
  {isDesktop&&sorted.length>0&&<div style={{...bx,padding:14,marginBottom:14,overflowX:"auto"}}>
  <div style={{display:"flex",alignItems:"flex-start",gap:0,minWidth:"100%",position:"relative",paddingTop:30,paddingBottom:6}}>
  <div style={{position:"absolute",top:38,left:20,right:20,height:2,background:"#333"}}/>
  {sorted.map((m,i)=>{const s=mStatus(m);return<div key={m.id} style={{flex:1,minWidth:90,display:"flex",flexDirection:"column",alignItems:"center",position:"relative",zIndex:1}}>
  <div style={{fontSize:8,color:"#bbb",marginBottom:4,whiteSpace:"nowrap"}}>{new Date(m.dl).toLocaleDateString("nl-NL",{day:"numeric",month:"short"})}</div>
  <div style={{width:14,height:14,borderRadius:"50%",background:s.bg,border:`2px solid ${s.c}`,marginBottom:6}}/>
  <div style={{fontSize:9,color:"#ccc",textAlign:"center",lineHeight:1.2,maxWidth:90,wordWrap:"break-word"}}>{m.n}</div>
  <div style={{fontSize:8,color:s.c,marginTop:2,fontWeight:600}}>{s.l}</div>
  </div>})}
  </div>
  </div>}
  
  <div style={{display:"grid",gridTemplateColumns:isDesktop?"1fr 1fr":"1fr",gap:isDesktop?10:6}}>
  {sorted.map(m=>{const s=mStatus(m);if(eM===m.id)return<div key={m.id} style={{...bx,border:`1px solid ${st.rd}`,padding:10}}>
  <input value={eMf.n||""} onChange={e=>sEMf({...eMf,n:e.target.value})} style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11,marginBottom:5,boxSizing:"border-box"}}/>
  <input type="date" value={eMf.dl||""} onChange={e=>sEMf({...eMf,dl:e.target.value})} style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11,marginBottom:5,boxSizing:"border-box"}}/>
  <input value={eMf.nt||""} onChange={e=>sEMf({...eMf,nt:e.target.value})} placeholder="Notitie" style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11,marginBottom:8,boxSizing:"border-box"}}/>
  <div style={{display:"flex",gap:4}}><button onClick={async()=>{await updateMilestone({id:eM,n:eMf.n,dl:eMf.dl,d:M.find(x=>x.id===eM)?.d||0,nt:eMf.nt||""});sEM(null)}} style={btn(st.gn,"#fff")}>Opslaan</button><button onClick={()=>sEM(null)} style={btn("#222","#bbb")}>Annuleer</button></div>
  </div>;
  return<div key={m.id} style={{...bx,borderColor:s.bd,background:s.bg,padding:10}}>
  <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
  <button onClick={()=>am&&updateMilestone({...m,d:m.d?0:1})} style={{background:"none",border:`2px solid ${s.c}`,borderRadius:"50%",width:18,height:18,cursor:am?"pointer":"default",padding:0,flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center",color:s.c,fontSize:11,fontWeight:700}}>{m.d?"✓":""}</button>
  <div style={{flex:1,minWidth:0}}>
  <div style={{fontSize:13,fontWeight:600,color:m.d?"#888":"#fff",textDecoration:m.d?"line-through":"none"}}>{m.n}</div>
  <div style={{fontSize:10,color:"#bbb",marginTop:2,display:"flex",gap:8,flexWrap:"wrap"}}>
  <span>📅 {new Date(m.dl).toLocaleDateString("nl-NL",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</span>
  <span style={{color:s.c,fontWeight:600}}>{s.l}</span>
  </div>
  {m.nt&&<div style={{fontSize:10,color:"#ca8a04",marginTop:4,padding:"3px 6px",background:"#1a1500",border:"1px solid #433",borderRadius:4}}>⚠ {m.nt}</div>}
  {(()=>{const mt=T.filter(x=>x.milestone_id===m.id),md=mt.filter(x=>x.s==="completed").length,mp=mt.length?Math.round(md/mt.length*100):0;return mt.length>0?<div style={{marginTop:6}}>
  <div style={{display:"flex",alignItems:"center",gap:6}}>
  <div style={{flex:1,height:4,background:"#222",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",background:mp===100?st.gn:st.rd,width:`${mp}%`}}/></div>
  <span style={{fontSize:9,color:"#bbb",whiteSpace:"nowrap"}}>{md}/{mt.length} taken ({mp}%)</span>
  <button onClick={()=>sShM(p=>({...p,[m.id]:!p[m.id]}))} style={{background:"none",border:"none",color:"#bbb",cursor:"pointer",fontSize:11,padding:0}}>{shM[m.id]?"▲":"▼"}</button>
  </div>
  </div>:<div style={{fontSize:9,color:"#666",marginTop:4}}>Geen taken gekoppeld</div>})()}
  </div>
  {am&&<div style={{display:"flex",gap:2,flexShrink:0}}>
  <button onClick={()=>{sEMf({n:m.n,dl:m.dl,nt:m.nt});sEM(m.id)}} style={{background:"none",border:"none",color:"#bbb",cursor:"pointer",padding:2,fontSize:12}}>✏️</button>
  <button onClick={()=>{if(confirm("Weet je zeker dat je deze mijlpaal wilt verwijderen?"))removeMilestone(m.id)}} style={{background:"none",border:"none",color:"#bbb",cursor:"pointer",padding:2,fontSize:12}}>🗑</button>
  </div>}
  </div>
  {shM[m.id]&&(()=>{const mt=T.filter(x=>x.milestone_id===m.id);return mt.length>0&&<div style={{marginTop:8,paddingTop:8,borderTop:"1px solid #222"}}>
  {mt.map(t=>{const r=R.find(x=>x.id===t.r),h=DHs.find(x=>x.id===t.h),od2=t.s!=="completed"&&t.dl&&t.dl<TD;return<div key={t.id} onClick={()=>{sCH(h);sCR(r);sTb("home")}} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 0",cursor:"pointer"}}>
  <span style={{fontSize:12}}>{t.s==="completed"?"✅":t.s==="in_progress"?"🔄":"⭕"}</span>
  <div style={{flex:1,minWidth:0}}>
  <div style={{fontSize:10,fontWeight:500,color:t.s==="completed"?"#888":"#ccc"}}>{t.ti}</div>
  <div style={{fontSize:8,color:"#888"}}>{h?.n}→{r?.n}{t.dl&&<span style={{color:od2?"#ef4444":"",marginLeft:4}}>📅{t.dl}</span>}</div>
  </div>
  </div>})}
  </div>})()}
  </div>})}
  </div>
  {sorted.length===0&&<div style={{...bx,textAlign:"center",color:"#888",fontSize:11,padding:20}}>Nog geen mijlpalen{am&&<><br/><span style={{fontSize:9}}>Klik op "+ Nieuwe" om er een toe te voegen</span></>}</div>}
  </>)}

// TEAM
if(tb==="team"){const teamList=DBs.filter(b=>b.id!=="b0");
const renderPerson=b=>{const d=T.filter(t=>t.w===b.id&&t.s==="completed").length,ip=T.filter(t=>t.w===b.id&&t.s==="in_progress").length;const isMe=U?.id===b.id;const isAdminB=b.p==="admin";
return<div key={b.id} onClick={()=>{sCP(b);sTb("person")}} style={{...bx,display:"flex",alignItems:"center",justifyContent:"space-between",gap:6,padding:isDesktop?12:8,cursor:"pointer"}}>
<div style={{display:"flex",alignItems:"center",gap:isDesktop?10:6,flex:1,minWidth:0}}><div style={{width:isDesktop?38:28,height:isDesktop?38:28,borderRadius:"50%",background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:isDesktop?14:11,color:"#aaa",flexShrink:0}}>{b.n[0]}</div>
<div style={{minWidth:0}}><div style={{fontSize:isDesktop?13:12,fontWeight:600}}>{b.n}{isMe&&<span style={{fontSize:9,color:"#bbb",marginLeft:4}}>(jij)</span>}</div><div style={{fontSize:isDesktop?11:9,color:"#999"}}>{b.r}</div></div>
</div>
<span style={{fontSize:isDesktop?11:10,whiteSpace:"nowrap"}}><span style={{color:"#4ade80"}}>{d}✓</span> <span style={{color:"#facc15"}}>{ip}⏳</span></span>
{am&&<button onClick={async e=>{e.stopPropagation();if(isMe){alert("Je kunt je eigen admin-rechten niet aanpassen.");return}const newP=isAdminB?b.r:"admin";await updatePerson({...b,p:newP})}} disabled={isMe} style={{padding:"4px 8px",borderRadius:4,border:`1px solid ${isAdminB?"#7f1d1d":"#333"}`,background:isAdminB?"#1a0505":"#111",color:isAdminB?"#fca5a5":"#bbb",fontSize:9,cursor:isMe?"not-allowed":"pointer",opacity:isMe?.4:1,whiteSpace:"nowrap"}} title={isMe?"Je kunt jezelf niet de-adminnen":isAdminB?"Klik om admin-rechten in te trekken":"Klik om admin te maken"}>{isAdminB?"Admin ✓":"Maak admin"}</button>}
{am&&!isMe&&b.pin_hash&&<button onClick={async e=>{e.stopPropagation();if(!confirm(`Pincode van ${b.n} resetten? Ze moeten dan een nieuwe instellen.`))return;const updated={...b,pin_hash:null};const saved=await savePerson(updated);if(saved)sDBs(DBs.map(x=>x.id===saved.id?saved:x))}} style={{padding:"4px 8px",borderRadius:4,border:"1px solid #333",background:"#111",color:"#bbb",fontSize:9,cursor:"pointer",whiteSpace:"nowrap"}} title="Pin resetten">🔑</button>}
{am&&!isMe&&<button onClick={async e=>{e.stopPropagation();if(!confirm(`${b.n} verwijderen uit het team?`))return;await removePerson(b.id)}} style={{background:"none",border:"none",color:"#bbb",cursor:"pointer",fontSize:14,padding:2}} title="Verwijderen">🗑</button>}
</div>};

return wrap(<>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:isDesktop?14:8}}>
<h1 style={{fontSize:isDesktop?22:17,fontWeight:700,margin:0}}>👥 Team ({teamList.length})</h1>
{am&&!nB&&<button onClick={()=>sNB(1)} style={btn(st.rd,"#fff")}>+ Nieuw lid</button>}
</div>

{am&&!!nB&&<div style={{...bx,border:`1px solid ${st.rd}`,padding:10,marginBottom:10}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:11,fontWeight:600}}>Nieuw teamlid</span><button onClick={()=>{sNB(0);sNBf({n:"",r:"bouw",p:"normaal"})}} style={{background:"none",border:"none",color:"#bbb",cursor:"pointer",fontSize:14}}>✕</button></div>
<input value={nBf.n} onChange={e=>sNBf({...nBf,n:e.target.value})} placeholder="Naam" style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:6,color:"#fff",fontSize:11,marginBottom:6,boxSizing:"border-box"}}/>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
<select value={nBf.r} onChange={e=>sNBf({...nBf,r:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:6,color:"#fff",fontSize:11}}>
<option value="bouw">Bouw</option><option value="decoratie">Decoratie</option><option value="techniek">Techniek</option><option value="kleding">Kleding</option><option value="grime">Grime</option><option value="marketing">Marketing</option><option value="algemeen">Algemeen</option>
</select>
<select value={nBf.p} onChange={e=>sNBf({...nBf,p:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:6,color:"#fff",fontSize:11}}>
<option value="normaal">Normaal gebruiker</option><option value="admin">Admin</option>
</select>
</div>
<button onClick={async()=>{const naam=(nBf.n||"").trim();if(!naam){alert("Vul een naam in");return}const newId="b"+Date.now();const newMember={id:newId,n:naam,r:nBf.r,p:nBf.p==="admin"?"admin":nBf.r};await addPerson(newMember);sNB(0);sNBf({n:"",r:"bouw",p:"normaal"})}} style={{...btn(st.gn,"#fff"),width:"100%"}}>Toevoegen</button>
</div>}

<div style={{display:"grid",gridTemplateColumns:isDesktop?"1fr 1fr":"1fr",gap:isDesktop?10:6}}>
{teamList.map(renderPerson)}
</div>
{am&&<div style={{marginTop:isDesktop?20:10,padding:isDesktop?10:8,background:"#0f0f0f",border:"1px solid #222",borderRadius:6,fontSize:isDesktop?10:9,color:"#888"}}>ℹ Admins kunnen taken aanmaken, mijlpalen beheren, teamleden toevoegen, andere admins aanwijzen en pincodes resetten (🔑).</div>}
</>)}

// MATERIALEN OVERZICHT
if(tb==="mat"&&am){
const allMat=[];R.forEach(r=>{const h=DHs.find(x=>x.id===r.h);(r.mt||[]).forEach((m,i)=>allMat.push({...m,_ri:r.id,_i:i,_rn:r.n,_hn:h?.n||"?",_room:r}))});
const mNodig=allMat.filter(m=>m.s==="nodig").length,mBesteld=allMat.filter(m=>m.s==="besteld").length,mAanwezig=allMat.filter(m=>m.s==="aanwezig").length;
const filtered=matF==="all"?allMat:allMat.filter(m=>m.s===matF);

// Groepeer op materiaalnaam (case-insensitive)
const byName={};filtered.forEach(m=>{const key=(m.n||"").toLowerCase().trim()||"_leeg_"+m._ri+"_"+m._i;if(!byName[key])byName[key]={n:m.n,items:[]};byName[key].items.push(m)});
const matNames=Object.values(byName).sort((a,b)=>(a.n||"").localeCompare(b.n||""));

const updMatO=async(room,newMt)=>{const up={...room,mt:newMt};await updateRoom(up)};
const addMatToRooms=async()=>{const naam=nMat.n.trim();if(!naam||nMat.rooms.length===0)return;for(const rid of nMat.rooms){const room=R.find(x=>x.id===rid);if(room){const newMt=[...(room.mt||[]),{n:naam,q:nMat.q,s:nMat.s}];await updMatO(room,newMt)}}sNMat({n:"",q:1,s:"nodig",rooms:[]});sNMatO(0)};

return wrap(<>
<h1 style={{fontSize:isDesktop?22:17,fontWeight:700,marginBottom:isDesktop?14:8}}>📦 Materialen</h1>

<div style={{display:"grid",gridTemplateColumns:isDesktop?"1fr 1fr 1fr 1fr":"1fr 1fr",gap:6,marginBottom:isDesktop?14:10}}>
{[{l:"Totaal",v:allMat.length,c:"#bbb",f:"all"},{l:"Nodig",v:mNodig,c:"#f87171",f:"nodig"},{l:"Besteld",v:mBesteld,c:"#facc15",f:"besteld"},{l:"Aanwezig",v:mAanwezig,c:"#4ade80",f:"aanwezig"}].map(x=>
<button key={x.f} onClick={()=>sMatF(matF===x.f?"all":x.f)} style={{...bx,textAlign:"center",padding:isDesktop?10:6,cursor:"pointer",border:`1px solid ${matF===x.f?x.c:st.bd}`,color:"#fff"}}><div style={{fontSize:isDesktop?10:8,color:"#999"}}>{x.l}</div><div style={{fontSize:isDesktop?22:16,fontWeight:700,color:x.c}}>{x.v}</div></button>)}
</div>

{!nMatO?<button onClick={()=>sNMatO(1)} style={{width:"100%",background:st.rd,color:"#fff",border:"none",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:12,fontWeight:600,marginBottom:isDesktop?14:10}}>+ Nieuw materiaal toevoegen</button>
:<div style={{...bx,border:`1px solid ${st.rd}`,padding:12,marginBottom:isDesktop?14:10}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:12,fontWeight:600}}>Nieuw materiaal</span><button onClick={()=>{sNMatO(0);sNMat({n:"",q:1,s:"nodig",rooms:[]})}} style={{background:"none",border:"none",color:"#bbb",cursor:"pointer",fontSize:14}}>✕</button></div>
<div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:5,marginBottom:8}}>
<input value={nMat.n} onChange={e=>sNMat({...nMat,n:e.target.value})} placeholder="Materiaalnaam…" style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11,boxSizing:"border-box"}}/>
<input type="number" value={nMat.q} min={1} onChange={e=>sNMat({...nMat,q:parseInt(e.target.value)||1})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11,textAlign:"center",boxSizing:"border-box"}}/>
<select value={nMat.s} onChange={e=>sNMat({...nMat,s:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:nMat.s==="aanwezig"?"#4ade80":nMat.s==="besteld"?"#facc15":"#f87171",fontSize:11}}>
<option value="nodig">nodig</option><option value="besteld">besteld</option><option value="aanwezig">aanwezig</option></select>
</div>
<div style={{fontSize:9,color:"#999",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Toevoegen aan kamers</div>
<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>
{R.map(r=>{const h=DHs.find(x=>x.id===r.h);const sel=nMat.rooms.includes(r.id);return<button key={r.id} onClick={()=>{const rooms=sel?nMat.rooms.filter(x=>x!==r.id):[...nMat.rooms,r.id];sNMat({...nMat,rooms})}} style={{padding:"4px 8px",borderRadius:6,border:`1px solid ${sel?"#166534":"#333"}`,background:sel?"#0a1f0a":"#111",color:sel?"#4ade80":"#888",fontSize:10,cursor:"pointer"}}>{h?.n} → {r.n}</button>})}
</div>
<button onClick={addMatToRooms} disabled={!nMat.n.trim()||nMat.rooms.length===0} style={{...btn(st.gn,"#fff"),width:"100%",padding:"8px 10px",opacity:nMat.n.trim()&&nMat.rooms.length>0?1:.5,cursor:nMat.n.trim()&&nMat.rooms.length>0?"pointer":"not-allowed"}}>Toevoegen aan {nMat.rooms.length} kamer{nMat.rooms.length!==1?"s":""}</button>
</div>}

{matNames.length===0?<div style={{...bx,textAlign:"center",color:"#888",fontSize:11,padding:20}}>Geen materialen{matF!=="all"&&` met status "${matF}"`}</div>
:matNames.map(({n:matNaam,items})=><div key={matNaam||"leeg"} style={{...bx,padding:10,marginBottom:6}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:items.length>1?6:0}}>
<div style={{fontSize:13,fontWeight:600,color:matNaam?"#fff":"#888"}}>{matNaam||"(naamloos)"}<span style={{fontSize:10,color:"#888",fontWeight:400,marginLeft:6}}>×{items.reduce((s,m)=>s+m.q,0)} totaal</span></div>
<div style={{display:"flex",gap:4}}>{[...new Set(items.map(m=>m.s))].map(s=><span key={s} style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:s==="aanwezig"?"#0a1f0a":s==="besteld"?"#1a1500":"#1a0505",color:s==="aanwezig"?"#4ade80":s==="besteld"?"#facc15":"#f87171"}}>{s}</span>)}</div>
</div>
{items.map(m=><div key={m._ri+"-"+m._i} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 0",borderTop:"1px solid #1a1a1a",marginTop:4}}>
<span style={{fontSize:10,color:"#888",flex:1,minWidth:0}}>{m._hn} → {m._rn}</span>
<input type="number" value={m.q} min={0} onChange={e=>{const mt=[...(m._room.mt||[])];mt[m._i]={...mt[m._i],q:parseInt(e.target.value)||0};updMatO({...m._room,mt},mt)}} style={{width:40,background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:"2px 3px",color:"#fff",fontSize:10,textAlign:"center",boxSizing:"border-box"}}/>
<select value={m.s} onChange={e=>{const mt=[...(m._room.mt||[])];mt[m._i]={...mt[m._i],s:e.target.value};updMatO({...m._room,mt},mt)}} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:"2px 3px",color:m.s==="aanwezig"?"#4ade80":m.s==="besteld"?"#facc15":"#f87171",fontSize:9}}>
<option value="nodig">nodig</option><option value="besteld">besteld</option><option value="aanwezig">aanwezig</option></select>
<button onClick={()=>{const mt=(m._room.mt||[]).filter((_,j)=>j!==m._i);updMatO({...m._room,mt},mt)}} style={{background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:10,padding:0}}>✕</button>
</div>)}
</div>)}
</>)}


// HOME
const tt=T.length,dn=T.filter(t=>t.s==="completed").length,ip=T.filter(t=>t.s==="in_progress").length,od=T.filter(t=>t.s!=="completed"&&t.dl&&t.dl<TD).length,tp=tt?Math.round(dn/tt*100):0;
const roomsForHouse=qaF.h?R.filter(r=>r.h===qaF.h):[];
const atFiltered=T.filter(t=>{if(atF.h!=="all"&&t.h!==atF.h)return 0;if(atF.s!=="all"&&t.s!==atF.s)return 0;if(atF.w!=="all"&&t.w!==atF.w)return 0;return 1});

const userHeader=<div style={{...bx,padding:6,marginBottom:8,display:"flex",alignItems:"center",gap:6,fontSize:10,color:"#999"}}><div style={{width:20,height:20,borderRadius:"50%",background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:9,color:"#aaa"}}>{U.n[0]}</div>{U.n}<span style={{marginLeft:"auto",fontSize:8,padding:"1px 4px",borderRadius:3,background:"#1a1a1a",color:"#888"}}>{am?"admin":U.r}</span></div>;
const aanwezigenToday=dB.length>0?DBs.filter(b=>dB.includes(b.id)):[];
const aanwezigenBlock=aanwezigenToday.length>0?<div style={{...bx,padding:isDesktop?10:8,marginBottom:10}}>
<div style={{fontSize:9,color:"#bbb",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>☀ Aanwezig vandaag ({aanwezigenToday.length})</div>
<div style={{display:"flex",flexWrap:"wrap",gap:5}}>
{aanwezigenToday.map(b=><div key={b.id} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 8px",background:"#1a1a1a",borderRadius:6,fontSize:10,color:"#ccc"}}>
<div style={{width:18,height:18,borderRadius:"50%",background:"#222",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#aaa"}}>{b.n[0]}</div>{b.n}
</div>)}
</div>
</div>:null;
const statsGrid=cols=><div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:6,marginBottom:10}}>
{[{l:"Voortgang",v:tp+"%",c:st.rd},{l:"Afgerond",v:dn+"/"+tt,c:st.gn},{l:"Bezig",v:ip,c:st.yw},{l:"Achterstand",v:od,c:od?"#ef4444":"#333"}].map((x,i)=>
<div key={i} style={{...bx,textAlign:"center",padding:isDesktop?10:6}}><div style={{fontSize:isDesktop?10:8,color:"#999"}}>{x.l}</div><div style={{fontSize:isDesktop?22:16,fontWeight:700,color:x.c}}>{x.v}</div></div>)}</div>;

const housesList=<>
<div style={{fontSize:9,color:"#999",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Huizen ({DHs.length})</div>
{DHs.map(h=>{const pr=hP(h.id,T),ht=T.filter(t=>t.h===h.id),hd=ht.filter(t=>t.s==="completed").length;
return<button key={h.id} onClick={()=>sCH(h)} style={{width:"100%",...bx,borderRadius:10,padding:isDesktop?14:10,cursor:"pointer",textAlign:"left",color:"#fff"}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontSize:isDesktop?15:13,fontWeight:700}}>{h.n}</span><span style={{fontSize:9,padding:"2px 6px",borderRadius:6,background:{loods:"#1e3a5f",tent:"#3b1f5e",bos:"#1a3a2a"}[h.l],color:"#bbb"}}>{h.l}</span></div>
<div style={{display:"flex",gap:8,fontSize:10,color:"#999",marginBottom:5}}>🏠 {R.filter(r=>r.h===h.id).length} kamers · 📋 {hd}/{ht.length} taken · 📅 {h.dl}</div>
<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{flex:1,height:5,background:"#1a1a1a",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",background:pr===100?st.gn:st.rd,width:`${pr}%`}}/></div><span style={{fontSize:11,fontWeight:700,color:pr===100?st.gn:st.rd}}>{pr}%</span></div></button>})}</>;

const overdueList=od>0&&<div><div style={{fontSize:9,color:"#ef4444",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>⚠ Achterstand ({od})</div>
{T.filter(t=>t.s!=="completed"&&t.dl&&t.dl<TD).slice(0,isDesktop?8:3).map(t=>{const r=R.find(x=>x.id===t.r),h=DHs.find(x=>x.id===t.h);return<div key={t.id} onClick={()=>{sCH(h);sCR(r)}} style={{background:"#1a0505",border:"1px solid #7f1d1d",borderRadius:6,padding:6,marginBottom:3,cursor:"pointer"}}>
<div style={{fontSize:10,color:"#fca5a5",fontWeight:500}}>{t.ti}</div>
<div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#ef4444",marginTop:2}}><span>{h?.n} → {r?.n}</span><span>{t.dl}</span></div>
</div>})}</div>;

const quickAdd=am&&<div style={{marginBottom:10}}>
{!qa?<button onClick={()=>sQa(1)} style={{width:"100%",background:st.rd,color:"#fff",border:"none",borderRadius:8,padding:"10px 14px",cursor:"pointer",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>+ Nieuwe taak</button>
:<div style={{...bx,border:`1px solid ${st.rd}`,padding:10}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:11,fontWeight:600}}>Nieuwe taak</span><button onClick={()=>{sQa(0);sQaF({h:"",r:"",ti:"",pr:"medium",c:"overig",w:"",dl:"",tp:"nodig",milestone_id:""})}} style={{background:"none",border:"none",color:"#bbb",cursor:"pointer",fontSize:14}}>✕</button></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:5}}>
<select value={qaF.h} onChange={e=>sQaF({...qaF,h:e.target.value,r:""})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11}}><option value="">Kies huis…</option>{DHs.map(h=><option key={h.id} value={h.id}>{h.n}</option>)}</select>
<select value={qaF.r} onChange={e=>sQaF({...qaF,r:e.target.value})} disabled={!qaF.h} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11,opacity:qaF.h?1:.5}}><option value="">Kies kamer…</option>{roomsForHouse.map(r=><option key={r.id} value={r.id}>{r.n}</option>)}</select>
</div>
<input value={qaF.ti} onChange={e=>sQaF({...qaF,ti:e.target.value})} placeholder="Taaknaam" style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11,marginBottom:5,boxSizing:"border-box"}}/>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5,marginBottom:5}}>
<select value={qaF.pr} onChange={e=>sQaF({...qaF,pr:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11}}>{["low","medium","high","critical"].map(v=><option key={v}>{v}</option>)}</select>
<select value={qaF.c} onChange={e=>sQaF({...qaF,c:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11}}>{CS.map(v=><option key={v}>{v}</option>)}</select>
<select value={qaF.tp} onChange={e=>sQaF({...qaF,tp:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11}}><option value="nodig">Nodig</option><option value="nice">Nice</option></select>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:8}}>
<select value={qaF.w} onChange={e=>sQaF({...qaF,w:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11}}><option value="">Toewijzen aan…</option>{DBs.map(b=><option key={b.id} value={b.id}>{b.n}</option>)}</select>
<input type="date" value={qaF.dl} onChange={e=>sQaF({...qaF,dl:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11}}/>
</div>
<select value={qaF.milestone_id||""} onChange={e=>sQaF({...qaF,milestone_id:e.target.value})} style={{width:"100%",background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:5,color:"#fff",fontSize:11,marginBottom:8,boxSizing:"border-box"}}><option value="">Geen mijlpaal</option>{M.map(m=><option key={m.id} value={m.id}>🎯 {m.n}</option>)}</select>
<button onClick={async()=>{if(!qaF.h||!qaF.r||!qaF.ti)return;await addTask({id:"t"+Date.now(),r:qaF.r,h:qaF.h,ti:qaF.ti,s:"not_started",pr:qaF.pr,c:qaF.c,w:qaF.w,dl:qaF.dl,nt:"",tp:qaF.tp,sb:[],milestone_id:qaF.milestone_id||null});sQa(0);sQaF({h:"",r:"",ti:"",pr:"medium",c:"overig",w:"",dl:"",tp:"nodig",milestone_id:""})}} disabled={!qaF.h||!qaF.r||!qaF.ti} style={{...btn(st.gn,"#fff"),width:"100%",padding:"6px 10px",opacity:qaF.h&&qaF.r&&qaF.ti?1:.5,cursor:qaF.h&&qaF.r&&qaF.ti?"pointer":"not-allowed"}}>Taak toevoegen</button>
</div>}
</div>;

const allTasksList=am&&<div>
<div style={{fontSize:9,color:"#999",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Alle taken (admin) — {atFiltered.length}</div>
<div style={{display:"grid",gridTemplateColumns:isDesktop?"1fr":"1fr 1fr 1fr",gap:4,marginBottom:6}}>
<select value={atF.h} onChange={e=>sAtF({...atF,h:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:4,color:"#fff",fontSize:10}}><option value="all">Alle huizen</option>{DHs.map(h=><option key={h.id} value={h.id}>{h.n}</option>)}</select>
<select value={atF.s} onChange={e=>sAtF({...atF,s:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:4,color:"#fff",fontSize:10}}><option value="all">Alle statussen</option><option value="not_started">Niet gestart</option><option value="in_progress">Bezig</option><option value="completed">Klaar</option></select>
<select value={atF.w} onChange={e=>sAtF({...atF,w:e.target.value})} style={{background:"#1a1a1a",border:"1px solid #333",borderRadius:4,padding:4,color:"#fff",fontSize:10}}><option value="all">Alle personen</option><option value="">Niet toegewezen</option>{DBs.map(b=><option key={b.id} value={b.id}>{b.n}</option>)}</select>
</div>
<div style={{maxHeight:isDesktop?500:"none",overflowY:isDesktop?"auto":"visible"}}>
{atFiltered.length===0?<div style={{...bx,textAlign:"center",color:"#888",fontSize:10,padding:10}}>Geen taken met deze filters</div>
:atFiltered.map(t=>{const r=R.find(x=>x.id===t.r),h=DHs.find(x=>x.id===t.h),a=DBs.find(b=>b.id===t.w),od=t.s!=="completed"&&t.dl&&t.dl<TD;
return<div key={t.id} onClick={()=>{sCH(h);sCR(r)}} style={{...bx,cursor:"pointer",padding:7,display:"flex",alignItems:"center",gap:6,borderColor:od?"#7f1d1d":"#222"}}>
<span style={{fontSize:14,color:t.s==="completed"?"#4ade80":t.s==="in_progress"?"#facc15":"#555"}}>{t.s==="completed"?"✅":t.s==="in_progress"?"🔄":"⭕"}</span>
<div style={{flex:1,minWidth:0}}>
<div style={{fontSize:11,fontWeight:500,color:t.s==="completed"?"#444":"#fff",textDecoration:t.s==="completed"?"line-through":"none"}}>{t.ti}</div>
<div style={{fontSize:9,color:"#999",display:"flex",gap:5,flexWrap:"wrap"}}>
<span>🏠{h?.n}→{r?.n}</span>{a&&<span>👤{a.n}</span>}{t.dl&&<span style={{color:od?"#ef4444":""}}>📅{t.dl}</span>}
<span style={{padding:"0 4px",borderRadius:3,background:t.tp==="nodig"?"#1a0505":"#05051a",color:t.tp==="nodig"?"#f87171":"#60a5fa"}}>{t.tp}</span>
</div>
</div>
<span style={{color:"#888",fontSize:11}}>›</span>
</div>})}
</div>
</div>;

if(isDesktop)return wrap(<>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
<div><h1 style={{fontSize:22,fontWeight:700,margin:0}}>🎃 Horror Zone Dashboard</h1><p style={{fontSize:11,color:"#999",marginTop:4}}>{new Date().toLocaleDateString("nl-NL",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p></div>
<div style={{fontSize:11,color:"#bbb"}}>Welkom, {U.n} <span style={{fontSize:9,padding:"2px 6px",borderRadius:3,background:"#1a1a1a",color:"#bbb",marginLeft:6}}>{am?"admin":U.r}</span></div>
</div>
<div style={{display:"grid",gridTemplateColumns:am?"1.6fr 1fr":"1fr",gap:20,alignItems:"start"}}>
<div>
{aanwezigenBlock}
{statsGrid(4)}
{housesList}
{!am&&overdueList&&<div style={{marginTop:14}}>{overdueList}</div>}
</div>
{am&&<div style={{position:"sticky",top:20}}>
{quickAdd}
{overdueList&&<div style={{marginBottom:14}}>{overdueList}</div>}
{allTasksList}
</div>}
</div>
</>);

return wrap(<>
<h1 style={{fontSize:17,fontWeight:700}}>🎃 Horror Zone</h1><p style={{fontSize:10,color:"#999",marginBottom:6}}>{new Date().toLocaleDateString("nl-NL",{weekday:"short",day:"numeric",month:"short"})}</p>
{userHeader}
{aanwezigenBlock}
{quickAdd}
{statsGrid(2)}
{housesList}
{overdueList&&<div style={{marginTop:6}}>{overdueList}</div>}
{allTasksList&&<div style={{marginTop:14}}>{allTasksList}</div>}
</>);
}