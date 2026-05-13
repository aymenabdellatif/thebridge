import { useState, useEffect, useRef } from 'react';
import { useApi } from '../hooks/useApi';

const SUGGESTIONS = [
  { icon:'ti-book',       text:'Quel cours me conseilles-tu pour débuter ?' },
  { icon:'ti-microphone', text:'Comment améliorer mes performances en entretien ?' },
  { icon:'ti-code',       text:'Explique-moi les closures en JavaScript' },
  { icon:'ti-briefcase',  text:'Quelles compétences pour un poste Junior ?' },
  { icon:'ti-chart-bar',  text:'Comment progresser rapidement en dev web ?' },
  { icon:'ti-help-circle',text:'Différence entre SQL et NoSQL ?' },
];

export default function Agent() {
  const api = useApi();
  const [messages, setMessages] = useState([{
    role:'bot',
    text:'Bonjour ! Je suis **EduBot**, votre assistant IA.\n\nJe peux vous aider à choisir vos cours, préparer vos entretiens et expliquer des concepts techniques.\n\nComment puis-je vous aider ?',
    time: new Date()
  }]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}); },[messages]);

  const envoyer = async(texte)=>{
    const msg=texte||input.trim();
    if(!msg||loading) return;
    setInput('');
    setMessages(p=>[...p,{role:'user',text:msg,time:new Date()}]);
    setLoading(true);
    try{
      const r = await api.post('/agent/chat',{message:msg});
      setMessages(p=>[...p,{role:'bot',text:r.data.reponse,time:new Date()}]);
    }catch{
      setMessages(p=>[...p,{role:'bot',text:'Désolé, problème de connexion. Vérifiez qu\'Ollama est lancé.',time:new Date()}]);
    }finally{
      setLoading(false);
      setTimeout(()=>inputRef.current?.focus(),100);
    }
  };

  const fmt=d=>d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});

  const renderText=(text)=>text.split('\n').map((line,i)=>(
    <span key={i}>{line.split('**').map((t,j)=>j%2===1?<strong key={j} style={{color:'var(--text-primary)',fontWeight:700}}>{t}</strong>:t)}{i<text.split('\n').length-1&&<br/>}</span>
  ));

  return(
    <div style={{display:'flex',height:'100%',overflow:'hidden'}}>
      <div style={{width:260,background:'var(--bg-surface)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',padding:'20px 12px',gap:8,flexShrink:0}}>
        <div style={{fontSize:11,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4,padding:'0 4px'}}>Suggestions</div>
        {SUGGESTIONS.map((s,i)=>(
          <button key={i} onClick={()=>envoyer(s.text)} disabled={loading}
            style={{display:'flex',alignItems:'flex-start',gap:10,padding:'10px 12px',borderRadius:10,background:'transparent',border:'1px solid var(--border)',color:'var(--text-secondary)',fontSize:13,textAlign:'left',cursor:'pointer',transition:'all .15s',lineHeight:1.4}}
            onMouseEnter={e=>{e.currentTarget.style.background='var(--bg-elevated)';e.currentTarget.style.borderColor='var(--border-hover)';e.currentTarget.style.color='var(--text-primary)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text-secondary)';}}>
            <i className={`ti ${s.icon}`} style={{fontSize:15,marginTop:1,flexShrink:0,color:'var(--accent)'}}/>
            {s.text}
          </button>
        ))}
        <div style={{marginTop:'auto'}}>
          <div style={{background:'var(--accent-dim)',border:'1px solid var(--accent-glow)',borderRadius:12,padding:'14px'}}>
            <div style={{fontSize:12,color:'var(--accent)',fontWeight:700,marginBottom:8}}><i className="ti ti-robot" style={{marginRight:4}}/>EduBot peut vous aider à :</div>
            <ul style={{fontSize:12,color:'var(--text-secondary)',paddingLeft:16,lineHeight:2}}>
              <li>Choisir vos cours</li>
              <li>Préparer vos entretiens</li>
              <li>Expliquer des concepts</li>
              <li>Conseils carrière</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{padding:'14px 24px',borderBottom:'1px solid var(--border)',background:'var(--bg-surface)',display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:40,height:40,borderRadius:'50%',background:'var(--grad-btn)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>
            <i className="ti ti-robot"/>
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:15,color:'var(--text-primary)'}}>EduBot</div>
            <div style={{fontSize:12,color:'var(--green)',display:'flex',alignItems:'center',gap:5}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:'var(--green)',display:'inline-block'}}/>
              Assistant IA actif
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{marginLeft:'auto'}} onClick={()=>setMessages([{role:'bot',text:'Conversation réinitialisée. Comment puis-je vous aider ?',time:new Date()}])}>
            <i className="ti ti-trash"/> Effacer
          </button>
        </div>

        <div style={{flex:1,overflowY:'auto',padding:'24px',display:'flex',flexDirection:'column',gap:20}}>
          {messages.map((m,i)=>(
            <div key={i} style={{display:'flex',gap:12,flexDirection:m.role==='user'?'row-reverse':'row',alignItems:'flex-end',maxWidth:'82%',alignSelf:m.role==='user'?'flex-end':'flex-start'}}>
              {m.role==='bot'&&(
                <div style={{width:34,height:34,borderRadius:'50%',background:'var(--grad-btn)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>
                  <i className="ti ti-robot"/>
                </div>
              )}
              <div style={{display:'flex',flexDirection:'column',gap:4,alignItems:m.role==='user'?'flex-end':'flex-start'}}>
                <div style={{padding:'13px 17px',borderRadius:m.role==='user'?'14px 14px 4px 14px':'14px 14px 14px 4px',background:m.role==='user'?'var(--grad-btn)':'var(--bg-elevated)',border:m.role==='bot'?'1px solid var(--border)':'none',fontSize:14,lineHeight:1.7,color:m.role==='user'?'#fff':'var(--text-secondary)'}}>
                  {renderText(m.text)}
                </div>
                <div style={{fontSize:11,color:'var(--text-muted)'}}>{fmt(m.time)}</div>
              </div>
            </div>
          ))}
          {loading&&(
            <div style={{display:'flex',gap:12,alignItems:'flex-end',alignSelf:'flex-start'}}>
              <div style={{width:34,height:34,borderRadius:'50%',background:'var(--grad-btn)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>
                <i className="ti ti-robot"/>
              </div>
              <div style={{padding:'14px 18px',borderRadius:'14px 14px 14px 4px',background:'var(--bg-elevated)',border:'1px solid var(--border)',display:'flex',gap:5,alignItems:'center'}}>
                {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:'50%',background:'var(--text-muted)',animation:`pdot 1.2s ease-in-out ${i*.2}s infinite`}}/>)}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        <div style={{padding:'16px 24px',borderTop:'1px solid var(--border)',background:'var(--bg-surface)'}}>
          <div style={{display:'flex',gap:10,alignItems:'flex-end'}}>
            <textarea ref={inputRef} className="input" rows={2}
              placeholder="Posez votre question à EduBot..."
              value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();envoyer();}}}
              disabled={loading} style={{flex:1,resize:'none'}}/>
            <button className="btn btn-primary" onClick={()=>envoyer()} disabled={loading||!input.trim()} style={{width:46,height:46,padding:0,borderRadius:'50%',flexShrink:0}}>
              {loading?<span className="spinner" style={{width:16,height:16}}/>:<i className="ti ti-send"/>}
            </button>
          </div>
          <div style={{fontSize:11,color:'var(--text-muted)',marginTop:6}}>Entrée pour envoyer · Shift+Entrée pour nouvelle ligne</div>
        </div>
      </div>
    </div>
  );
}
