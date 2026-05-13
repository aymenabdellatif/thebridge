import { useState, useEffect, useRef } from 'react';
import { useApi } from '../hooks/useApi';

const DOMAINES = ['Développement Web','Backend','Data Science','DevOps','Mobile','Informatique générale'];
const NIVEAUX  = ['Junior','Intermédiaire','Senior'];

const parler = (texte, onEnd) => {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texte);
  u.lang='fr-FR'; u.rate=1.1; u.pitch=1;
  const v = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('fr'));
  if(v) u.voice=v;
  u.onend = onEnd||null;
  window.speechSynthesis.speak(u);
};
const stopVoix = () => window.speechSynthesis.cancel();

export default function Entretien() {
  const api = useApi();
  const [step,setStep]           = useState('config');
  const [domaine,setDomaine]     = useState('Développement Web');
  const [niveau,setNiveau]       = useState('Junior');
  const [questions,setQuestions] = useState([]);
  const [curQ,setCurQ]           = useState(0);
  const [rep,setRep]             = useState('');
  const [feedbacks,setFeedbacks] = useState([]);
  const [loading,setLoading]     = useState(false);
  const [voixOn,setVoixOn]       = useState(true);
  const [speaking,setSpeaking]   = useState(false);
  const [recording,setRecording] = useState(false);
  const [rapport,setRapport]     = useState(null);
  const [timer,setTimer]         = useState(120);
  const timerRef = useRef(null);
  const recogRef = useRef(null);

  useEffect(()=>{
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = ()=>window.speechSynthesis.getVoices();
    return ()=>stopVoix();
  },[]);

  useEffect(()=>{
    if(step!=='interview') return;
    timerRef.current = setInterval(()=>{
      setTimer(t=>{ if(t<=1){clearInterval(timerRef.current);soumettre('(temps écoulé)');return 0;} return t-1; });
    },1000);
    return ()=>clearInterval(timerRef.current);
  },[step,curQ]);

  const resetTimer = ()=>{ clearInterval(timerRef.current); setTimer(120); };
  const fmt = s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const timerCls = timer<=20?'danger':timer<=45?'warning':'';

  const lire = (t)=>{ if(!voixOn) return; setSpeaking(true); parler(t,()=>setSpeaking(false)); };

  const demarrer = async()=>{
    setLoading(true);
    try{
      const r = await api.post('/entretien/start',{domaine,niveau});
      const qs = r.data.questions||[];
      setQuestions(qs); setCurQ(0); setFeedbacks([]); setRep('');
      setStep('interview'); resetTimer();
      setTimeout(()=>lire(qs[0]),500);
    }catch(e){console.error(e);}
    finally{setLoading(false);}
  };

  const toggleMic=()=>{
    if(recording){recogRef.current?.stop();setRecording(false);return;}
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){alert('Utilisez Chrome pour la reconnaissance vocale.');return;}
    const r=new SR(); r.lang='fr-FR'; r.continuous=true; r.interimResults=true;
    r.onresult=e=>setRep(Array.from(e.results).map(r=>r[0].transcript).join(''));
    r.onend=()=>setRecording(false);
    r.start(); recogRef.current=r; setRecording(true);
  };

  const soumettre = async(repForcee)=>{
    const r=repForcee||rep;
    if(!r?.trim()&&!repForcee) return;
    stopVoix(); setRecording(false); recogRef.current?.stop(); resetTimer(); setLoading(true);
    try{
      const res = await api.post('/entretien/feedback',{question:questions[curQ],reponse:r||'(pas de réponse)',domaine});
      const nf=[...feedbacks,{question:questions[curQ],reponse:r,...res.data}];
      setFeedbacks(nf); setRep('');
      if(curQ+1>=questions.length){
        const avg=Math.round(nf.reduce((s,f)=>s+(f.score||5),0)/nf.length);
        await api.post('/entretien/save',{domaine,score:avg,feedback:nf.map((f,i)=>`Q${i+1}:${f.feedback}`).join('|')});
        setRapport({feedbacks:nf,avgScore:avg}); setStep('rapport'); stopVoix();
      } else {
        const next=curQ+1; setCurQ(next); resetTimer();
        setTimeout(()=>lire(questions[next]),300);
      }
    }catch(e){console.error(e);}
    finally{setLoading(false);}
  };

  const sc=s=>s>=7?'var(--green)':s>=5?'var(--orange)':'var(--red)';

  if(step==='config') return(
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Simulation d'entretien</h1>
        <p className="page-subtitle">Préparez-vous avec votre recruteur IA — voix + micro inclus</p>
      </div>
      <div style={{maxWidth:640}}>
        <div className="card" style={{marginBottom:16}}>
          <div className="section-title"><i className="ti ti-briefcase"/> 1. Choisissez le poste visé</div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {DOMAINES.map(d=>(
              <div key={d} className={`card card-hover ${domaine===d?'card-active':''}`}
                style={{padding:'14px 18px',display:'flex',alignItems:'center',gap:14,cursor:'pointer'}}
                onClick={()=>setDomaine(d)}>
                <i className="ti ti-code" style={{fontSize:20,color:domaine===d?'var(--accent)':'var(--text-muted)'}}/>
                <span style={{fontWeight:600,fontSize:14,color:domaine===d?'var(--accent)':'var(--text-primary)'}}>{d}</span>
                {domaine===d&&<i className="ti ti-check" style={{marginLeft:'auto',color:'var(--accent)'}}/>}
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{marginBottom:16}}>
          <div className="section-title"><i className="ti ti-chart-bar"/> 2. Votre niveau</div>
          <div style={{display:'flex',gap:10}}>
            {NIVEAUX.map(n=><button key={n} className={`btn ${niveau===n?'btn-primary':'btn-ghost'}`} style={{flex:1}} onClick={()=>setNiveau(n)}>{n}</button>)}
          </div>
        </div>
        <div className="card" style={{marginBottom:24}}>
          <div className="section-title"><i className="ti ti-volume"/> 3. Options</div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:'var(--text-primary)'}}>Voix IA</div>
              <div style={{fontSize:12,color:'var(--text-muted)'}}>L'IA lit les questions à voix haute</div>
            </div>
            <button className={`btn ${voixOn?'btn-primary':'btn-ghost'}`} onClick={()=>setVoixOn(!voixOn)}>
              <i className={`ti ${voixOn?'ti-volume':'ti-volume-off'}`}/> Voix {voixOn?'ON':'OFF'}
            </button>
          </div>
        </div>
        <button className="btn btn-primary btn-lg" style={{width:'100%'}} onClick={demarrer} disabled={loading}>
          {loading?<><span className="spinner"/> L'IA prépare vos questions...</>:<><i className="ti ti-player-play"/> Démarrer l'entretien</>}
        </button>
      </div>
    </div>
  );

  if(step==='interview') return(
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div className="interview-topbar">
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:'var(--green)',animation:'pdot 1.2s infinite'}}/>
          <span style={{fontWeight:700,fontSize:14}}>{domaine}</span>
          <span className="badge badge-muted">{niveau}</span>
        </div>
        {speaking  && <div className="voice-indicator speaking"><span className="voice-dot"/>L'IA parle...</div>}
        {recording && <div className="voice-indicator listening"><span className="voice-dot"/>Écoute...</div>}
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:12}}>
          <button className={`btn btn-sm ${voixOn?'btn-primary':'btn-ghost'}`} onClick={()=>{setVoixOn(!voixOn);if(voixOn)stopVoix();}}>
            <i className={`ti ${voixOn?'ti-volume':'ti-volume-off'}`}/> {voixOn?'ON':'OFF'}
          </button>
          <div className={`timer ${timerCls}`}><i className="ti ti-clock"/>{fmt(timer)}</div>
          <div style={{width:80,height:6,background:'var(--bg-elevated)',borderRadius:99,overflow:'hidden'}}>
            <div style={{height:'100%',borderRadius:99,transition:'width 1s linear',width:`${(timer/120)*100}%`,background:timer<=20?'var(--red)':timer<=45?'var(--orange)':'var(--green)'}}/>
          </div>
        </div>
      </div>
      <div style={{flex:1,overflow:'auto',padding:'24px 32px',display:'flex',flexDirection:'column',gap:20}}>
        <div style={{display:'flex',gap:6}}>
          {questions.map((_,i)=><div key={i} style={{height:5,flex:1,borderRadius:99,background:i<curQ?'var(--accent)':i===curQ?'var(--accent-glow)':'var(--bg-elevated)',border:i===curQ?'1px solid var(--accent)':'none'}}/>)}
        </div>
        <div style={{fontSize:12,color:'var(--text-muted)'}}>Question {curQ+1} / {questions.length}</div>
        <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
          <div style={{width:44,height:44,borderRadius:'50%',background:speaking?'var(--accent)':'var(--accent-dim)',color:speaking?'#fff':'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0,transition:'all .3s',boxShadow:speaking?'0 0 0 8px var(--accent-glow)':'none'}}>
            <i className="ti ti-robot"/>
          </div>
          <div style={{flex:1,background:'var(--bg-elevated)',border:'1px solid var(--border)',borderRadius:'14px 14px 14px 4px',padding:'18px 22px'}}>
            <p style={{fontSize:15,color:'var(--text-primary)',lineHeight:1.7}}>{questions[curQ]}</p>
            <button style={{marginTop:10,background:'transparent',border:'none',color:'var(--text-muted)',fontSize:12,display:'flex',alignItems:'center',gap:5,cursor:'pointer',padding:0}} onClick={()=>lire(questions[curQ])}>
              <i className="ti ti-volume"/> Rejouer la question
            </button>
          </div>
        </div>
        <div style={{marginTop:'auto'}}>
          <div style={{display:'flex',gap:12,alignItems:'flex-end'}}>
            <textarea className="input" rows={4}
              placeholder={recording?'Parlez maintenant — je vous écoute...':'Tapez votre réponse ou utilisez le micro...'}
              value={rep} onChange={e=>setRep(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&e.ctrlKey)soumettre();}}
              disabled={loading}
              style={{flex:1,background:recording?'rgba(239,68,68,0.05)':undefined,borderColor:recording?'var(--red)':undefined}}/>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <button className={`mic-btn ${recording?'recording':''}`} onClick={toggleMic} title={recording?'Arrêter':'Parler'}>
                <i className={`ti ${recording?'ti-microphone-off':'ti-microphone'}`}/>
              </button>
              <button className="btn btn-primary" onClick={()=>soumettre()} disabled={loading||!rep.trim()} style={{width:54,height:54,borderRadius:'50%',padding:0}}>
                {loading?<span className="spinner" style={{width:16,height:16}}/>:<i className="ti ti-send"/>}
              </button>
            </div>
          </div>
          <div style={{fontSize:11,color:'var(--text-muted)',marginTop:6}}>Ctrl+Entrée pour envoyer · Micro pour dicter votre réponse</div>
        </div>
      </div>
    </div>
  );

  if(step==='rapport') return(
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Rapport d'entretien</h1>
        <p className="page-subtitle">{domaine} — {niveau}</p>
      </div>
      <div className="card" style={{textAlign:'center',padding:'44px 24px',marginBottom:24,background:'var(--grad-hero)'}}>
        <div style={{fontSize:76,fontWeight:900,lineHeight:1,color:sc(rapport.avgScore)}}>{rapport.avgScore}<span style={{fontSize:26,fontWeight:400,color:'var(--text-muted)'}}>/10</span></div>
        <div style={{marginTop:12,fontSize:17,color:'var(--text-secondary)',fontWeight:500}}>
          {rapport.avgScore>=7?'🎉 Excellent ! Vous êtes prêt(e) !':rapport.avgScore>=5?'👍 Bon travail, continuez !':'💪 Pratiquez davantage !'}
        </div>
        <div className="badge badge-grad" style={{marginTop:16,fontSize:13,padding:'6px 18px'}}>
          {rapport.avgScore>=7?'Prêt pour un vrai entretien':rapport.avgScore>=5?'En bonne progression':'Besoin de pratique'}
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:14,marginBottom:24}}>
        {rapport.feedbacks.map((f,i)=>(
          <div key={i} className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
              <span style={{fontSize:13,color:'var(--text-muted)',fontWeight:600}}>Question {i+1}</span>
              <div style={{fontSize:22,fontWeight:800,color:sc(f.score)}}>{f.score}<span style={{fontSize:13,color:'var(--text-muted)',fontWeight:400}}>/10</span></div>
            </div>
            <p style={{fontSize:14,fontWeight:600,color:'var(--text-primary)',marginBottom:8}}>{f.question}</p>
            {f.reponse&&f.reponse!=='(temps écoulé)'&&(
              <div style={{background:'var(--bg-elevated)',borderRadius:10,padding:'10px 14px',fontSize:13,color:'var(--text-secondary)',marginBottom:10,fontStyle:'italic'}}>"{f.reponse}"</div>
            )}
            <div style={{background:'var(--bg-base)',borderRadius:10,padding:'12px 16px',fontSize:13,color:'var(--text-secondary)'}}>
              <strong style={{color:'var(--text-primary)'}}>Feedback : </strong>{f.feedback}
            </div>
            {(f.points_forts||f.a_ameliorer)&&(
              <div style={{display:'flex',gap:12,marginTop:10}}>
                {f.points_forts&&<div style={{flex:1,background:'var(--green-dim)',borderRadius:8,padding:'8px 12px',fontSize:12,color:'var(--green)'}}><i className="ti ti-thumb-up" style={{marginRight:4}}/>{f.points_forts}</div>}
                {f.a_ameliorer&&<div style={{flex:1,background:'var(--orange-dim)',borderRadius:8,padding:'8px 12px',fontSize:12,color:'var(--orange)'}}><i className="ti ti-trending-up" style={{marginRight:4}}/>{f.a_ameliorer}</div>}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:12}}>
        <button className="btn btn-primary btn-lg" onClick={()=>setStep('config')}><i className="ti ti-refresh"/> Nouvel entretien</button>
        <button className="btn btn-ghost btn-lg" onClick={()=>window.history.back()}><i className="ti ti-arrow-left"/> Retour</button>
      </div>
    </div>
  );

  return null;
}
