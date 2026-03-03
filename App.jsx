import { useState, useRef, useEffect } from "react";

const g = {
  black:"#0A0805", dark:"#111009", card:"#1A1710",
  border:"#2A2518", gold:"#D4A84B", goldDim:"#8A6A20",
  rose:"#E8556A", roseDim:"#7A2535", teal:"#4ECDC4",
  cream:"#F5ECD7", muted:"#6A6050", dim:"#2E2820", green:"#4CAF7D",
};

const profiles = [
  { id:1, name:"Sophia", age:26, city:"Paris",     match:94, bio:"Amatrice de jazz et voyages. Je cherche quelqu'un de vrai.", tags:["Voyages","Jazz","Gastro"], color:"#C8715A" },
  { id:2, name:"Chloé",  age:29, city:"Lyon",      match:88, bio:"Libre et spontanée. Rencontres authentiques uniquement.", tags:["Art","Sport","Cinéma"], color:"#5A7FC8" },
  { id:3, name:"Emma",   age:24, city:"Nice",      match:91, bio:"Fan de randonnées et sincérité avant tout.", tags:["Nature","Yoga","Photo"], color:"#7AC87A" },
  { id:4, name:"Jade",   age:31, city:"Bordeaux",  match:85, bio:"Photographe. Connexion authentique recherchée.", tags:["Photo","Danse","Mode"], color:"#C8A05A" },
  { id:5, name:"Inès",   age:27, city:"Marseille", match:97, bio:"Passionnée de surf. Belle histoire en vue.", tags:["Surf","Cuisine","Musique"], color:"#5AC8C8" },
];

const storiesData = [
  { id:1, name:"Moi",    color:"#D4A84B", isMe:true },
  { id:2, name:"Sophia", color:"#C8715A", emoji:"🌹", content:"Soirée jazz ce soir 🎷", time:"2min",  seen:false },
  { id:3, name:"Chloé",  color:"#5A7FC8", emoji:"🎨", content:"Nouvelle expo à Lyon 🖼️",  time:"14min", seen:false },
  { id:4, name:"Emma",   color:"#7AC87A", emoji:"🏔️", content:"Randonnée du dimanche ☀️", time:"1h",   seen:true  },
  { id:5, name:"Jade",   color:"#C8A05A", emoji:"📸", content:"Shooting photo en cours 📷", time:"2h",  seen:false },
  { id:6, name:"Inès",   color:"#5AC8C8", emoji:"🌊", content:"Vagues parfaites aujourd'hui 🏄‍♀️", time:"3h", seen:true },
  { id:7, name:"Lucas",  color:"#9B6FD4", emoji:"🎸", content:"Concert improvisé ce soir 🎶", time:"4h", seen:false },
];

const matchedList = [
  { id:10, name:"Sophia", age:26, lastMsg:"Tu es libre ce week-end ? 😊", time:"2min", unread:2, color:"#C8715A" },
  { id:11, name:"Jade",   age:31, lastMsg:"J'adore ton profil vocal !",   time:"1h",  unread:0, color:"#C8A05A" },
  { id:12, name:"Emma",   age:24, lastMsg:"C'est noté, à bientôt 😊",     time:"3h",  unread:0, color:"#7AC87A" },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;700&display=swap');
  @keyframes glow    { 0%,100%{text-shadow:0 0 20px #D4A84B40} 50%{text-shadow:0 0 40px #D4A84B80} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
  @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes storyIn { from{opacity:0} to{opacity:1} }
  .fu  { animation: fadeUp 0.4s ease both }
  .fu1 { animation: fadeUp 0.4s 0.1s ease both }
  .fu2 { animation: fadeUp 0.4s 0.2s ease both }
  .float { animation: float 3s ease-in-out infinite }
  .gs { background: linear-gradient(90deg,#D4A84B,#F0C96A,#D4A84B,#8A6A20); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation: shimmer 3s linear infinite; }
  * { box-sizing: border-box; margin:0; padding:0; }
  ::-webkit-scrollbar { display: none; }
  input, textarea, button { font-family: 'DM Sans', sans-serif; outline: none; }
`;

export default function FlirtyApp() {
  const [screen,    setScreen]    = useState("app");
  const [tab,       setTab]       = useState("discover");
  const [cards, setCards] = useState([...profiles]);
  const [dragX,     setDragX]     = useState(0);
  const [dragging,  setDragging]  = useState(false);
  const [swipeDir,  setSwipeDir]  = useState(null);
  const [activeChat,setActiveChat]= useState(null);
  const [inputMsg,  setInputMsg]  = useState("");
  const [messages,  setMessages]  = useState([
    { from:"them", text:"Coucou, j'ai adoré ton message vocal 😍", time:"14:32" },
    { from:"me",   text:"Merci ! Le tien m'a vraiment fait sourire", time:"14:33" },
    { from:"them", text:"Tu es libre ce week-end ? 😊", time:"14:35" },
  ]);

  // Auth
  const [authTab,   setAuthTab]   = useState("login");
  const [email,     setEmail]     = useState("");
  const [pass,      setPass]      = useState("");
  const [prenom,    setPrenom]    = useState("");
  const [nom,       setNom]       = useState("");
  const [dob,       setDob]       = useState("");
  const [gender,    setGender]    = useState("");
  const [authErr,   setAuthErr]   = useState("");
  const [showPw,    setShowPw]    = useState(false);

  // Notifications
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifs, setNotifs] = useState({
    matches:     true,
    messages:    true,
    stories:     true,
    likes:       true,
    superLikes:  true,
    nouveaux:    false,
    emails:      false,
    marketing:   false,
    sons:        true,
    vibrations:  true,
  });
  const toggleNotif = key => setNotifs(n => ({...n, [key]: !n[key]}));

  // Stories
  const [activeStory,   setActiveStory]   = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [seen,          setSeen]          = useState([4,6]);
  const [storyLockMsg,  setStoryLockMsg]  = useState(null);
  const [subscribed,    setSubscribed]    = useState(["Sophia", "Emma"]); // abonnés par défaut
  const toggleSub = name => setSubscribed(s => s.includes(name) ? s.filter(x=>x!==name) : [...s, name]);
  const timerRef = useRef(null);
  const dragRef  = useRef({ startX:0 });

  useEffect(() => {
    if (activeStory) {
      setStoryProgress(0);
      timerRef.current = setInterval(() => {
        setStoryProgress(p => { if (p >= 100) { goNextStory(); return 0; } return p + 1.5; });
      }, 60);
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [activeStory]);

  const openStory = s => {
    if (s.isMe) return;
    if (!subscribed.includes(s.name)) {
      setStoryLockMsg(s.name);
      setTimeout(() => setStoryLockMsg(null), 2500);
      return;
    }
    setSeen(p => [...new Set([...p, s.id])]);
    setActiveStory(s);
  };
  const closeStory = () => { setActiveStory(null); setStoryProgress(0); };
  const goNextStory = () => {
    const list = storiesData.filter(s => !s.isMe);
    const idx  = list.findIndex(s => s.id === activeStory?.id);
    const next = list[idx + 1];
    if (next) { setSeen(p => [...new Set([...p, next.id])]); setActiveStory(next); setStoryProgress(0); }
    else closeStory();
  };

  const onPD = e => { setDragging(true); dragRef.current.startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0; };
  const onPM = e => { if (!dragging) return; const x = (e.clientX ?? e.touches?.[0]?.clientX ?? 0) - dragRef.current.startX; setDragX(x); setSwipeDir(x > 40 ? "like" : x < -40 ? "pass" : null); };
  const onPU = () => { setDragging(false); if (dragX > 80) animOut("like"); else if (dragX < -80) animOut("pass"); else { setDragX(0); setSwipeDir(null); } };
  const animOut = dir => { setDragX(dir === "like" ? 600 : -600); setTimeout(() => { setCards(c => c.slice(1)); setDragX(0); setSwipeDir(null); }, 350); };

  const sendMsg = () => {
    if (!inputMsg.trim()) return;
    const t = new Date(); const time = `${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`;
    setMessages(m => [...m, { from:"me", text:inputMsg, time }]); setInputMsg("");
    setTimeout(() => setMessages(m => [...m, { from:"them", text:"😍 Avec plaisir !", time }]), 1200);
  };

  const login = () => { if (!email || !pass) { setAuthErr("Remplissez tous les champs."); return; } setScreen("app"); setAuthErr(""); };
  const register = () => {
    if (!prenom||!nom||!email||!pass||!dob||!gender) { setAuthErr("Veuillez remplir tous les champs."); return; }
    if (pass.length < 8) { setAuthErr("Mot de passe trop court (8 min)."); return; }
    setScreen("app"); setAuthErr("");
  };

  const TABS = [
    { id:"discover", icon:"⚡", label:"Découvrir" },
    { id:"matches",  icon:"💬", label:"Matches", badge: matchedList.filter(m=>m.unread).length },
    { id:"profile",  icon:"👤", label:"Profil" },
  ];

  return (
    <div style={{ background:g.black, minHeight:"100vh", maxWidth:430, margin:"0 auto", fontFamily:"'DM Sans',sans-serif", color:g.cream, position:"relative", overflow:"hidden", boxShadow:`0 0 60px ${g.gold}10` }}>
      <style>{css}</style>

      {/* ══ AUTH ══════════════════════════════════════════════════════ */}
      {screen === "auth" && (
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:`radial-gradient(ellipse at 50% 20%,#1A120A,${g.black} 65%)` }}>
          <div style={{ padding:"44px 28px 0", textAlign:"center" }} className="fu">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160" style={{width:'220px',margin:'0 auto',display:'block'}}>
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#C9A84C"/>
      <stop offset="50%" stopColor="#F5D78E"/>
      <stop offset="100%" stopColor="#A8801E"/>
    </linearGradient>
  </defs>
  <rect width="400" height="160" fill="#0A0A0A" rx="4"/>
  <rect x="6" y="6" width="388" height="148" fill="none" stroke="#D4A843" strokeWidth="0.8" rx="2"/>
  <text x="200" y="100" fontFamily="Georgia,serif" fontSize="68" fontWeight="400" letterSpacing="16" textAnchor="middle" fill="url(#g1)" fontStyle="italic">FLIRTY</text>
</svg>
           
          </div>
          <div style={{ display:"flex", margin:"28px 24px 0", background:g.dim, borderRadius:14, padding:4 }}>
            {[["login","Connexion"],["register","Inscription"]].map(([id,label]) => (
              <button key={id} onClick={()=>{setAuthTab(id);setAuthErr("");}}
                style={{ flex:1, background:authTab===id?g.card:"none", border:"none", borderRadius:11, padding:"10px 0", fontWeight:700, fontSize:13, color:authTab===id?g.gold:g.muted, cursor:"pointer", transition:"all 0.2s" }}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"20px 24px 40px" }}>
            {authErr && <div style={{ background:`${g.rose}20`, border:`1px solid ${g.rose}40`, borderRadius:10, padding:"10px 14px", fontSize:12, color:g.rose, marginBottom:14 }}>{authErr}</div>}

            {authTab === "login" && (
              <div className="fu">
                {[["Email","email","votre@email.com",email,setEmail],["Mot de passe","password","••••••••",pass,setPass]].map(([lbl,type,ph,val,set]) => (
                  <div key={lbl} style={{ marginBottom:16 }}>
                    <div style={{ fontSize:11, color:g.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:7 }}>{lbl}</div>
                    <div style={{ position:"relative" }}>
                      <input value={val} onChange={e=>set(e.target.value)} placeholder={ph} type={type==="password"?(showPw?"text":"password"):type}
                        onKeyDown={e=>e.key==="Enter"&&login()}
                        style={{ width:"100%", background:g.dim, border:`1.5px solid ${g.border}`, borderRadius:12, padding:"13px 16px", color:g.cream, fontSize:14 }}/>
                      {type==="password" && <button onClick={()=>setShowPw(s=>!s)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16 }}>{showPw?"🙈":"👁️"}</button>}
                    </div>
                  </div>
                ))}
                <div style={{ textAlign:"right", marginBottom:20 }}><button style={{ background:"none", border:"none", color:g.goldDim, fontSize:12, cursor:"pointer" }}>Mot de passe oublié ?</button></div>
                <button onClick={login} style={{ width:"100%", background:`linear-gradient(135deg,${g.gold},#7A5010)`, border:"none", borderRadius:50, padding:"15px", fontWeight:700, fontSize:15, color:g.black, cursor:"pointer", boxShadow:`0 6px 20px ${g.gold}40` }}>Se connecter →</button>
                <div style={{ textAlign:"center", marginTop:18, fontSize:12, color:g.muted }}>Pas encore de compte ? <button onClick={()=>{setAuthTab("register");setAuthErr("");}} style={{ background:"none", border:"none", color:g.gold, fontWeight:700, cursor:"pointer", fontSize:12 }}>S'inscrire</button></div>
              </div>
            )}

            {authTab === "register" && (
              <div className="fu">
                <div style={{ display:"flex", gap:10, marginBottom:16 }}>
                  {[["Prénom",prenom,setPrenom,"Marie"],["Nom",nom,setNom,"Dupont"]].map(([lbl,val,set,ph]) => (
                    <div key={lbl} style={{ flex:1 }}>
                      <div style={{ fontSize:11, color:g.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:7 }}>{lbl}</div>
                      <input value={val} onChange={e=>set(e.target.value)} placeholder={ph} style={{ width:"100%", background:g.dim, border:`1.5px solid ${g.border}`, borderRadius:12, padding:"12px", color:g.cream, fontSize:14 }}/>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:11, color:g.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:7 }}>Email</div>
                  <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="votre@email.com" type="email" style={{ width:"100%", background:g.dim, border:`1.5px solid ${g.border}`, borderRadius:12, padding:"13px 16px", color:g.cream, fontSize:14 }}/>
                </div>
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:11, color:g.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:7 }}>Mot de passe</div>
                  <div style={{ position:"relative" }}>
                    <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="8 caractères minimum" type={showPw?"text":"password"}
                      style={{ width:"100%", background:g.dim, border:`1.5px solid ${pass&&pass.length<8?g.rose:pass.length>=8?g.green:g.border}`, borderRadius:12, padding:"13px 48px 13px 16px", color:g.cream, fontSize:14 }}/>
                    <button onClick={()=>setShowPw(s=>!s)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16 }}>{showPw?"🙈":"👁️"}</button>
                  </div>
                </div>
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:11, color:g.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:7 }}>Date de naissance</div>
                  <input value={dob} onChange={e=>setDob(e.target.value)} type="date" style={{ width:"100%", background:g.dim, border:`1.5px solid ${g.border}`, borderRadius:12, padding:"13px 16px", color:dob?g.cream:g.muted, fontSize:14 }}/>
                  <div style={{ fontSize:11, color:g.muted, marginTop:5 }}>⚠️ 18 ans minimum requis</div>
                </div>
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:11, color:g.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Genre</div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {[["homme","👨 Homme"],["femme","👩 Femme"],["couple","👫 Couple"],["autre","✨ Autre"]].map(([val,lbl]) => (
                      <button key={val} onClick={()=>setGender(val)}
                        style={{ background:gender===val?`${g.gold}25`:g.dim, border:`1.5px solid ${gender===val?g.gold:g.border}`, borderRadius:20, padding:"8px 14px", fontSize:13, fontWeight:700, color:gender===val?g.gold:g.muted, cursor:"pointer" }}>
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={register} style={{ width:"100%", background:`linear-gradient(135deg,${g.gold},#7A5010)`, border:"none", borderRadius:50, padding:"15px", fontWeight:700, fontSize:15, color:g.black, cursor:"pointer", boxShadow:`0 6px 20px ${g.gold}40` }}>Créer mon compte →</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ APP ════════════════════════════════════════════════════════ */}
      {screen === "app" && (
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
          {/* Status bar */}
          <div style={{ height:44, background:g.dark, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", borderBottom:`1px solid ${g.border}`, flexShrink:0 }}>
            <span style={{ fontSize:12, fontWeight:700 }}>9:41</span>
            <div style={{ fontFamily:"'Great Vibes',cursive", fontSize:22, color:g.gold }}>Flirty</div>
            <span style={{ fontSize:12 }}>📶 🔋</span>
          </div>

          <div style={{ flex:1, overflowY:"auto", paddingBottom: tab === "chat" ? 0 : 70 }}>

            {/* ─ DISCOVER ─ */}
            {tab === "discover" && (
              <div style={{ padding:"16px 16px 0" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                  <div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600 }}>Pour vous</div>
                    <div style={{ fontSize:11, color:g.muted }}>Mode : <span style={{ color:g.gold }}>Relation sérieuse</span></div>
                  </div>
                  <button onClick={()=>setScreen("auth")} style={{ background:g.dim, border:`1px solid ${g.border}`, borderRadius:10, padding:"7px 12px", fontSize:11, color:g.gold, fontWeight:700, cursor:"pointer" }}>⚡ Mode</button>
                </div>

                {/* Stories — abonnés en premier, non-abonnés après */}
                {storyLockMsg && (
                  <div style={{ background:`${g.rose}20`, border:`1px solid ${g.rose}40`, borderRadius:10, padding:"9px 14px", fontSize:12, color:g.rose, marginBottom:10, display:"flex", alignItems:"center", gap:8, animation:"fadeUp 0.3s ease" }}>
                    🔒 Abonnez-vous à <strong style={{color:g.cream}}>{storyLockMsg}</strong> pour voir sa story !
                  </div>
                )}
                <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:14 }}>
                  {[
                    storiesData.filter(s => s.isMe),
                    storiesData.filter(s => !s.isMe && subscribed.includes(s.name)),
                    storiesData.filter(s => !s.isMe && !subscribed.includes(s.name)),
                  ].flat().map(s => {
                    const isSub = s.isMe || subscribed.includes(s.name);
                    return (
                      <div key={s.id} onClick={()=>openStory(s)} style={{ flexShrink:0, textAlign:"center", cursor:"pointer", opacity:!isSub?0.4:1, transition:"opacity 0.2s" }}>
                        <div style={{ width:64, height:64, borderRadius:"50%", padding:2.5, background:s.isMe?g.dim:!isSub?g.border:seen.includes(s.id)?g.border:`linear-gradient(135deg,${s.color},${g.gold})`, marginBottom:5, position:"relative" }}>
                          <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:`linear-gradient(135deg,${s.color}90,${g.dark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:s.isMe?20:22, border:`2px solid ${g.dark}`, filter:!isSub?"grayscale(0.7)":"none" }}>
                            {s.isMe ? "➕" : s.name[0]}
                          </div>
                          {!isSub && <div style={{ position:"absolute", bottom:0, right:0, width:20, height:20, borderRadius:"50%", background:g.dark, border:`1px solid ${g.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11 }}>🔒</div>}
                          {isSub && !s.isMe && !seen.includes(s.id) && <div style={{ position:"absolute", top:0, right:0, width:16, height:16, borderRadius:"50%", background:g.gold, border:`2px solid ${g.dark}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:g.black }}>●</div>}
                        </div>
                        <div style={{ fontSize:10, color:!isSub?g.muted:seen.includes(s.id)?g.muted:g.cream, fontWeight:isSub&&!seen.includes(s.id)?700:400, maxWidth:58, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {s.isMe ? "Ma story" : s.name}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cards */}
                <div style={{ position:"relative", height:490, marginBottom:14 }}>
                  {cards.slice(1,3).map((c,i) => (
                    <div key={c.id} style={{ position:"absolute", top:(i+1)*10, left:(i+1)*6, right:(i+1)*6, height:465, borderRadius:24, background:`linear-gradient(160deg,${c.color}40,${g.dark})`, border:`1px solid ${g.border}`, opacity:0.6-i*0.2, transform:`scale(${1-(i+1)*0.03})` }}/>
                  ))}
                  {cards.length > 0 ? (
                    <div onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU}
                      style={{ position:"absolute", inset:0, borderRadius:24, background:`linear-gradient(160deg,${cards[0].color}60 0%,${g.dark} 60%)`, border:`1px solid ${swipeDir==="like"?g.gold:swipeDir==="pass"?g.rose:g.border}`, cursor:"grab", touchAction:"none", transform:`translateX(${dragX}px) rotate(${dragX*0.04}deg)`, transition:dragging?"none":"transform 0.35s ease", overflow:"hidden" }}>
                      <div style={{ height:250, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                        <div style={{ width:100, height:100, borderRadius:"50%", background:`linear-gradient(135deg,${cards[0].color},${g.dark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, border:`3px solid ${g.gold}40`, boxShadow:`0 0 40px ${cards[0].color}40` }}>{cards[0].name[0]}</div>
                        <div style={{ position:"absolute", top:20, right:20, background:`linear-gradient(135deg,${g.gold},#7A5010)`, borderRadius:50, width:48, height:48, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                          <div style={{ fontSize:13, fontWeight:700, color:g.black, lineHeight:1 }}>{cards[0].match}%</div>
                          <div style={{ fontSize:8, color:g.black, fontWeight:700 }}>match</div>
                        </div>
                      </div>
                      <div style={{ padding:"0 20px 12px" }}>
                        <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:4 }}>
                          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:600 }}>{cards[0].name}</div>
                          <div style={{ fontSize:17, color:g.muted }}>{cards[0].age}</div>
                        </div>
                        <div style={{ fontSize:12, color:g.muted, marginBottom:8 }}>📍 {cards[0].city}</div>
                        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontStyle:"italic", color:"rgba(245,236,215,0.8)", lineHeight:1.6, marginBottom:10 }}>"{cards[0].bio}"</div>
                        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>{cards[0].tags.map(t=><div key={t} style={{ background:g.dim, border:`1px solid ${g.border}`, borderRadius:20, padding:"4px 12px", fontSize:11, color:g.gold }}>{t}</div>)}</div>
                      </div>
                      {swipeDir==="like"&&<div style={{ position:"absolute", top:40, left:20, border:`3px solid ${g.gold}`, borderRadius:8, padding:"6px 16px", transform:"rotate(-15deg)" }}><div style={{ fontWeight:900, fontSize:22, color:g.gold }}>LIKE ✨</div></div>}
                      {swipeDir==="pass"&&<div style={{ position:"absolute", top:40, right:20, border:`3px solid ${g.rose}`, borderRadius:8, padding:"6px 16px", transform:"rotate(15deg)" }}><div style={{ fontWeight:900, fontSize:22, color:g.rose }}>PASS ✗</div></div>}
                    </div>
                  ) : (
                    <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12 }}>
                      <div style={{ fontSize:48 }}>💫</div>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:g.muted, fontStyle:"italic" }}>Vous avez tout vu !</div>
                      <button onClick={()=>setCards(profiles)} style={{ background:`linear-gradient(135deg,${g.gold},#7A5010)`, border:"none", borderRadius:20, padding:"10px 24px", fontWeight:700, fontSize:13, color:g.black, cursor:"pointer" }}>Recharger ✨</button>
                    </div>
                  )}
                </div>
                {cards.length > 0 && (
                  <div style={{ paddingBottom:8 }}>
                    {/* Bouton abonné */}
                    <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
                      <button onClick={()=>toggleSub(cards[0].name)}
                        style={{ display:"flex", alignItems:"center", gap:8, background:subscribed.includes(cards[0].name)?`${g.teal}20`:`linear-gradient(135deg,${g.gold}20,${g.goldDim}20)`, border:`1.5px solid ${subscribed.includes(cards[0].name)?g.teal:g.gold}`, borderRadius:50, padding:"9px 22px", fontSize:13, fontWeight:700, color:subscribed.includes(cards[0].name)?g.teal:g.gold, cursor:"pointer", transition:"all 0.2s", boxShadow:subscribed.includes(cards[0].name)?`0 0 16px ${g.teal}30`:`0 0 16px ${g.gold}20` }}>
                        {subscribed.includes(cards[0].name) ? <><span>✓</span> Abonné(e)</> : <><span>+</span> S'abonner</>}
                      </button>
                    </div>
                    {/* Swipe */}
                    <div style={{ display:"flex", justifyContent:"center", gap:20 }}>
                      <button onClick={()=>animOut("pass")} style={{ width:56, height:56, borderRadius:"50%", background:g.card, border:`1.5px solid ${g.roseDim}`, fontSize:22, cursor:"pointer" }}>✗</button>
                      <button onClick={()=>animOut("like")} style={{ width:56, height:56, borderRadius:"50%", background:`linear-gradient(135deg,${g.gold},#7A5010)`, border:"none", fontSize:22, cursor:"pointer", boxShadow:`0 4px 20px ${g.gold}50` }}>♥</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─ MATCHES ─ */}
            {tab === "matches" && (
              <div style={{ padding:"20px 16px" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, marginBottom:4 }}>Vos matches</div>
                <div style={{ fontSize:12, color:g.muted, marginBottom:18 }}>{matchedList.length} connexions</div>
                <div style={{ display:"flex", gap:14, overflowX:"auto", paddingBottom:16, marginBottom:18 }}>
                  {matchedList.map(m => (
                    <div key={m.id} onClick={()=>{setActiveChat(m);setTab("chat");}} style={{ minWidth:68, textAlign:"center", cursor:"pointer" }}>
                      <div style={{ position:"relative" }}>
                        <div style={{ width:66, height:66, borderRadius:"50%", background:`linear-gradient(135deg,${m.color},${g.dark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, border:`2px solid ${g.gold}` }}>{m.name[0]}</div>
                        {m.unread > 0 && <div style={{ position:"absolute", top:0, right:0, width:18, height:18, borderRadius:"50%", background:g.rose, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"white" }}>{m.unread}</div>}
                      </div>
                      <div style={{ fontSize:11, color:g.cream, marginTop:5 }}>{m.name}</div>
                    </div>
                  ))}
                </div>
                {matchedList.map(m => (
                  <div key={m.id} onClick={()=>{setActiveChat(m);setTab("chat");}} style={{ display:"flex", alignItems:"center", gap:14, background:g.card, borderRadius:16, padding:"14px", marginBottom:10, border:`1px solid ${g.border}`, cursor:"pointer" }}>
                    <div style={{ width:50, height:50, borderRadius:"50%", background:`linear-gradient(135deg,${m.color},${g.dark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{m.name[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between" }}>
                        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600 }}>{m.name}, {m.age}</div>
                        <div style={{ fontSize:11, color:g.muted }}>{m.time}</div>
                      </div>
                      <div style={{ fontSize:12, color:m.unread?g.cream:g.muted, marginTop:2, fontWeight:m.unread?600:400 }}>{m.lastMsg}</div>
                    </div>
                    {m.unread > 0 && <div style={{ width:20, height:20, borderRadius:"50%", background:g.rose, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"white" }}>{m.unread}</div>}
                  </div>
                ))}
              </div>
            )}

            {/* ─ CHAT ─ */}
            {tab === "chat" && activeChat && (
              <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 44px)" }}>
                <div style={{ padding:"12px 16px", background:g.dark, borderBottom:`1px solid ${g.border}`, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
                  <button onClick={()=>setTab("matches")} style={{ background:"none", border:"none", color:g.gold, fontSize:24, cursor:"pointer" }}>‹</button>
                  <div style={{ width:38, height:38, borderRadius:"50%", background:`linear-gradient(135deg,${activeChat.color},${g.dark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{activeChat.name[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600 }}>{activeChat.name}</div>
                    <div style={{ fontSize:11, color:g.gold }}>🟢 En ligne</div>
                  </div>
                </div>
                <div style={{ flex:1, overflowY:"auto", padding:"14px" }}>
                  {messages.map((msg,i) => (
                    <div key={i} style={{ display:"flex", justifyContent:msg.from==="me"?"flex-end":"flex-start", marginBottom:10 }}>
                      <div style={{ maxWidth:"72%", borderRadius:msg.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"10px 14px", background:msg.from==="me"?`linear-gradient(135deg,${g.gold},#7A5010)`:g.card, border:msg.from==="them"?`1px solid ${g.border}`:"none" }}>
                        <div style={{ fontSize:14, color:msg.from==="me"?g.black:g.cream, lineHeight:1.5 }}>{msg.text}</div>
                        <div style={{ fontSize:10, color:msg.from==="me"?`${g.black}80`:g.muted, marginTop:3, textAlign:"right" }}>{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding:"10px 12px", background:g.dark, borderTop:`1px solid ${g.border}`, display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                  <input value={inputMsg} onChange={e=>setInputMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Votre message…" style={{ flex:1, background:g.dim, border:`1px solid ${g.border}`, borderRadius:20, padding:"10px 16px", color:g.cream, fontSize:14 }}/>
                  <button onClick={sendMsg} style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${g.gold},#7A5010)`, border:"none", fontSize:16, cursor:"pointer" }}>↑</button>
                </div>
              </div>
            )}

            {/* ─ PROFIL ─ */}
            {tab === "profile" && (
              <div style={{ padding:"24px 20px 32px" }}>
                {/* Avatar */}
                <div style={{ textAlign:"center", marginBottom:24 }}>
                  <div style={{ width:96, height:96, borderRadius:"50%", background:`linear-gradient(135deg,${g.gold},#7A5010)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:42, margin:"0 auto 12px", border:`3px solid ${g.gold}`, boxShadow:`0 0 30px ${g.gold}40` }}>A</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600 }}>Alexandre, 28</div>
                  <div style={{ fontSize:12, color:g.muted, marginTop:4 }}>Mode : <span style={{ color:g.gold }}>Relation sérieuse</span></div>
                </div>

                {/* Menu items */}
                {[
                  { icon:"⚡", label:"Changer de mode", action:()=>setScreen("auth") },
                  { icon:"🔔", label:"Notifications", action:()=>setShowNotifPanel(s=>!s), badge: Object.values(notifs).filter(Boolean).length },
                  { icon:"🔒", label:"Confidentialité" },
                  { icon:"🚪", label:"Se déconnecter", action:()=>setScreen("auth"), color:g.rose },
                ].map((item,i) => (
                  <div key={i}>
                    <div onClick={item.action} style={{ display:"flex", alignItems:"center", gap:14, background:g.card, borderRadius: showNotifPanel && item.icon==="🔔" ? "14px 14px 0 0" : 14, padding:"14px 16px", marginBottom: showNotifPanel && item.icon==="🔔" ? 0 : 10, border:`1px solid ${showNotifPanel && item.icon==="🔔" ? g.gold+"60" : g.border}`, cursor:"pointer", transition:"all 0.2s" }}>
                      <span style={{ fontSize:20 }}>{item.icon}</span>
                      <span style={{ fontSize:14, color:item.color||g.cream, flex:1 }}>{item.label}</span>
                      {item.badge!==undefined && <div style={{ background:`${g.gold}25`, border:`1px solid ${g.gold}50`, borderRadius:20, padding:"2px 10px", fontSize:11, color:g.gold, fontWeight:700, marginRight:6 }}>{item.badge} actives</div>}
                      <span style={{ color:showNotifPanel && item.icon==="🔔" ? g.gold : g.muted, fontSize:18, transition:"transform 0.2s", transform: showNotifPanel && item.icon==="🔔" ? "rotate(90deg)" : "none" }}>›</span>
                    </div>

                    {/* ── PANNEAU NOTIFICATIONS ── */}
                    {showNotifPanel && item.icon==="🔔" && (
                      <div style={{ background:g.dim, border:`1px solid ${g.gold}30`, borderRadius:"0 0 14px 14px", marginBottom:10, overflow:"hidden" }}>

                        {/* Section : Activité */}
                        <div style={{ padding:"12px 16px 6px", fontSize:10, color:g.gold, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>Activité</div>
                        {[
                          { key:"matches",    icon:"💞", label:"Nouveaux matches",       sub:"Quand quelqu'un vous matche" },
                          { key:"messages",   icon:"💬", label:"Messages",               sub:"Nouveaux messages reçus" },
                          { key:"likes",      icon:"♥",  label:"Likes",                  sub:"Quand quelqu'un vous like" },
                          { key:"superLikes", icon:"⭐", label:"Super likes",             sub:"Super likes reçus" },
                          { key:"stories",    icon:"🎬", label:"Stories",                sub:"Nouvelles stories de vos matches" },
                        ].map(({ key, icon, label, sub }) => (
                          <div key={key} onClick={()=>toggleNotif(key)} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 16px", borderTop:`1px solid ${g.border}`, cursor:"pointer" }}>
                            <span style={{ fontSize:18, width:28, textAlign:"center" }}>{icon}</span>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:13, color:g.cream, fontWeight:500 }}>{label}</div>
                              <div style={{ fontSize:11, color:g.muted, marginTop:1 }}>{sub}</div>
                            </div>
                            {/* Toggle */}
                            <div onClick={e=>{e.stopPropagation();toggleNotif(key);}} style={{ width:46, height:26, borderRadius:13, background:notifs[key]?`linear-gradient(135deg,${g.gold},#7A5010)`:g.border, position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
                              <div style={{ position:"absolute", top:3, left:notifs[key]?22:3, width:20, height:20, borderRadius:"50%", background:"white", transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.4)" }}/>
                            </div>
                          </div>
                        ))}

                        {/* Section : Communication */}
                        <div style={{ padding:"12px 16px 6px", fontSize:10, color:g.gold, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", borderTop:`1px solid ${g.border}`, marginTop:4 }}>Communication</div>
                        {[
                          { key:"emails",    icon:"📧", label:"Emails de récap",   sub:"Résumé hebdomadaire d'activité" },
                          { key:"marketing", icon:"🎁", label:"Offres & promos",   sub:"Promotions et offres spéciales" },
                          { key:"nouveaux",  icon:"✨", label:"Suggestions",        sub:"Nouveaux profils correspondants" },
                        ].map(({ key, icon, label, sub }) => (
                          <div key={key} onClick={()=>toggleNotif(key)} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 16px", borderTop:`1px solid ${g.border}`, cursor:"pointer" }}>
                            <span style={{ fontSize:18, width:28, textAlign:"center" }}>{icon}</span>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:13, color:g.cream, fontWeight:500 }}>{label}</div>
                              <div style={{ fontSize:11, color:g.muted, marginTop:1 }}>{sub}</div>
                            </div>
                            <div onClick={e=>{e.stopPropagation();toggleNotif(key);}} style={{ width:46, height:26, borderRadius:13, background:notifs[key]?`linear-gradient(135deg,${g.gold},#7A5010)`:g.border, position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
                              <div style={{ position:"absolute", top:3, left:notifs[key]?22:3, width:20, height:20, borderRadius:"50%", background:"white", transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.4)" }}/>
                            </div>
                          </div>
                        ))}

                        {/* Section : Sons */}
                        <div style={{ padding:"12px 16px 6px", fontSize:10, color:g.gold, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", borderTop:`1px solid ${g.border}`, marginTop:4 }}>Sons & Vibrations</div>
                        {[
                          { key:"sons",       icon:"🔊", label:"Sons",        sub:"Sons pour les notifications" },
                          { key:"vibrations", icon:"📳", label:"Vibrations",  sub:"Vibrer à chaque notification" },
                        ].map(({ key, icon, label, sub }) => (
                          <div key={key} onClick={()=>toggleNotif(key)} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 16px", borderTop:`1px solid ${g.border}`, cursor:"pointer" }}>
                            <span style={{ fontSize:18, width:28, textAlign:"center" }}>{icon}</span>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:13, color:g.cream, fontWeight:500 }}>{label}</div>
                              <div style={{ fontSize:11, color:g.muted, marginTop:1 }}>{sub}</div>
                            </div>
                            <div onClick={e=>{e.stopPropagation();toggleNotif(key);}} style={{ width:46, height:26, borderRadius:13, background:notifs[key]?`linear-gradient(135deg,${g.gold},#7A5010)`:g.border, position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
                              <div style={{ position:"absolute", top:3, left:notifs[key]?22:3, width:20, height:20, borderRadius:"50%", background:"white", transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.4)" }}/>
                            </div>
                          </div>
                        ))}

                        {/* Tout désactiver */}
                        <div style={{ padding:"12px 16px", borderTop:`1px solid ${g.border}`, display:"flex", gap:10 }}>
                          <button onClick={()=>setNotifs(n=>Object.fromEntries(Object.keys(n).map(k=>[k,true])))}
                            style={{ flex:1, background:`${g.green}20`, border:`1px solid ${g.green}40`, borderRadius:10, padding:"9px", fontSize:12, fontWeight:700, color:g.green, cursor:"pointer" }}>
                            ✅ Tout activer
                          </button>
                          <button onClick={()=>setNotifs(n=>Object.fromEntries(Object.keys(n).map(k=>[k,false])))}
                            style={{ flex:1, background:`${g.rose}15`, border:`1px solid ${g.rose}30`, borderRadius:10, padding:"9px", fontSize:12, fontWeight:700, color:g.rose, cursor:"pointer" }}>
                            🔕 Tout désactiver
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom nav */}
          {tab !== "chat" && (
            <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, height:70, background:g.dark, borderTop:`1px solid ${g.border}`, display:"flex", alignItems:"center", zIndex:100 }}>
              {TABS.map(t => (
                <button key={t.id} onClick={()=>setTab(t.id)}
                  style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"8px 0", position:"relative" }}>
                  {t.badge > 0 && <div style={{ position:"absolute", top:6, left:"58%", width:16, height:16, borderRadius:"50%", background:g.rose, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"white" }}>{t.badge}</div>}
                  <span style={{ fontSize:22, opacity:tab===t.id?1:0.4 }}>{t.icon}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:tab===t.id?g.gold:g.muted }}>{t.label}</span>
                  {tab===t.id && <div style={{ position:"absolute", bottom:0, width:24, height:2, background:g.gold, borderRadius:2 }}/>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ STORY VIEWER ════════════════════════════════════════════════ */}
      {activeStory && (
        <div style={{ position:"fixed", inset:0, zIndex:2000, background:g.black, maxWidth:430, margin:"0 auto", display:"flex", flexDirection:"column" }} onClick={goNextStory}>
          {/* Progress bars */}
          <div style={{ display:"flex", gap:4, padding:"48px 12px 8px", position:"absolute", top:0, left:0, right:0, zIndex:10 }}>
            {storiesData.filter(s=>!s.isMe).map((s,i) => {
              const list = storiesData.filter(s=>!s.isMe);
              const idx  = list.findIndex(x=>x.id===activeStory.id);
              return (
                <div key={s.id} style={{ flex:1, height:3, borderRadius:2, background:`${g.cream}30`, overflow:"hidden" }}>
                  <div style={{ height:"100%", background:g.cream, borderRadius:2, width:i<idx?"100%":s.id===activeStory.id?`${storyProgress}%`:"0%", transition:"width 0.1s linear" }}/>
                </div>
              );
            })}
          </div>
          {/* Header */}
          <div style={{ position:"absolute", top:58, left:0, right:0, display:"flex", alignItems:"center", gap:12, padding:"0 16px", zIndex:10 }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${activeStory.color},${g.dark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, border:`2px solid ${g.cream}40` }}>{activeStory.name[0]}</div>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:g.cream }}>{activeStory.name}</div>
              <div style={{ fontSize:11, color:`${g.cream}80` }}>{activeStory.time}</div>
            </div>
            <button onClick={e=>{e.stopPropagation();closeStory();}} style={{ marginLeft:"auto", background:"none", border:"none", color:g.cream, fontSize:24, cursor:"pointer" }}>✕</button>
          </div>
          {/* Content */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:`radial-gradient(ellipse at 50% 40%,${activeStory.color}50,${g.black} 70%)`, animation:"storyIn 0.3s ease" }}>
            <div style={{ fontSize:80, marginBottom:20 }}>{activeStory.emoji}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontStyle:"italic", color:g.cream, textAlign:"center", padding:"0 40px", lineHeight:1.5 }}>{activeStory.content}</div>
          </div>
          {/* Reply */}
          <div style={{ padding:"20px 16px 44px", display:"flex", gap:10, alignItems:"center" }} onClick={e=>e.stopPropagation()}>
            <input placeholder="Répondre à la story…" style={{ flex:1, background:`${g.cream}15`, border:`1px solid ${g.cream}25`, borderRadius:50, padding:"12px 18px", color:g.cream, fontSize:13 }}/>
            <button style={{ width:46, height:46, borderRadius:"50%", background:`${g.cream}15`, border:`1px solid ${g.cream}25`, fontSize:18, cursor:"pointer", flexShrink:0 }}>❤️</button>
            <button style={{ width:46, height:46, borderRadius:"50%", background:`${g.cream}15`, border:`1px solid ${g.cream}25`, fontSize:18, cursor:"pointer", flexShrink:0 }}>📤</button>
          </div>
        </div>
      )}
    </div>
  );
}
