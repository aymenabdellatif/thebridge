import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

const L = ['A','B','C','D'];

const PARCOURS = {
  1: {
    chapitres: [
      {
        titre: 'Variables et types',
        contenu: `**var, let, const** sont les trois façons de déclarer une variable en JavaScript.\n\n- \`let\` : portée de bloc, valeur modifiable\n- \`const\` : portée de bloc, valeur constante (préféré)\n- \`var\` : ancienne méthode, évitez-le\n\n**Types primitifs :**\n\`\`\`js\nconst nom = "Aymen";    // string\nlet age = 22;           // number\nconst actif = true;     // boolean\nlet inconnu;            // undefined\n\nconst phrase = \`Bonjour \${nom}, tu as \${age} ans\`;\nconsole.log(phrase);\n\`\`\``,
        quiz: [
          { question: 'Quelle déclaration ne peut pas être réassignée ?', options: ['var','let','const','function'], reponse: 'const' },
          { question: 'Quel type retourne typeof null ?', options: ['null','undefined','object','string'], reponse: 'object' },
          { question: 'Quelle syntaxe est un template literal ?', options: ['"texte"',"'texte'",'`texte`','(texte)'], reponse: '`texte`' },
        ]
      },
      {
        titre: 'Fonctions et Arrow Functions',
        contenu: `**Déclaration classique :**\n\`\`\`js\nfunction saluer(nom) {\n  return "Bonjour " + nom;\n}\n\`\`\`\n\n**Arrow function (ES6+) :**\n\`\`\`js\nconst saluer = (nom) => \`Bonjour \${nom}\`;\nconst double = n => n * 2;\nconst add = (a, b) => a + b;\n\`\`\`\n\n**Paramètres par défaut :**\n\`\`\`js\nconst saluer = (nom = "inconnu") => \`Bonjour \${nom}\`;\nsaluer();        // "Bonjour inconnu"\nsaluer("Aymen"); // "Bonjour Aymen"\n\`\`\``,
        quiz: [
          { question: 'Syntaxe correcte d\'une arrow function ?', options: ['function => {}','(x) => x * 2','fn(x) -> x','arrow(x){}'], reponse: '(x) => x * 2' },
          { question: 'Que retourne une fonction sans return ?', options: ['0','null','undefined','false'], reponse: 'undefined' },
          { question: 'Arrow function et this : quelle différence ?', options: ['Aucune','Hérite le this du parent','Crée son propre this','N\'a pas de this'], reponse: 'Hérite le this du parent' },
        ]
      },
      {
        titre: 'Tableaux et Objets',
        contenu: `**Méthodes de tableau essentielles :**\n\`\`\`js\nconst fruits = ['pomme','banane','orange'];\n\nfruits.push('kiwi');              // ajouter à la fin\nfruits.pop();                     // supprimer le dernier\nfruits.map(f => f.toUpperCase()); // transformer → nouveau tableau\nfruits.filter(f => f.length > 5); // filtrer → nouveau tableau\nfruits.find(f => f === 'banane'); // trouver un élément\n\`\`\`\n\n**Objets et destructuring :**\n\`\`\`js\nconst user = { nom: 'Aymen', age: 22, ville: 'Tunis' };\n\n// Destructuring\nconst { nom, age } = user;\nconst [premier, ...reste] = fruits;\n\n// Spread\nconst newUser = { ...user, email: 'a@b.com' };\n\`\`\``,
        quiz: [
          { question: 'Quelle méthode ajoute un élément à la fin d\'un tableau ?', options: ['push','pop','shift','add'], reponse: 'push' },
          { question: 'Que fait Array.map() ?', options: ['Filtre','Crée un nouveau tableau transformé','Trie','Supprime'], reponse: 'Crée un nouveau tableau transformé' },
          { question: 'Comment déstructurer un objet user ?', options: ['const [nom] = user','const {nom} = user','const nom = user[]','extract(user)'], reponse: 'const {nom} = user' },
        ]
      },
      {
        titre: 'Async / Await et Promesses',
        contenu: `**Problème des callbacks (callback hell) :**\n\`\`\`js\nfetch(url, function(data) {\n  traiter(data, function(result) {\n    // Imbrication profonde...\n  });\n});\n\`\`\`\n\n**Solution : async/await (moderne) :**\n\`\`\`js\nasync function getUsers() {\n  try {\n    const res  = await fetch('/api/users');\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error('Erreur:', err);\n  }\n}\n\n// Appel\nconst users = await getUsers();\n\`\`\`\n\nLa règle : **await ne peut être utilisé que dans une fonction async.**`,
        quiz: [
          { question: 'Que fait await ?', options: ['Exécute en parallèle','Attend la résolution d\'une promesse','Crée une promesse','Annule une requête'], reponse: 'Attend la résolution d\'une promesse' },
          { question: 'Une fonction async retourne toujours ?', options: ['un objet','un tableau','une Promise','undefined'], reponse: 'une Promise' },
          { question: 'Quel bloc gère les erreurs en async/await ?', options: ['catch()','try/catch','error()','handle()'], reponse: 'try/catch' },
        ]
      },
    ],
    testFinal: [
      { question: 'Différence principale entre let et const ?', options: ['Aucune','const ne peut pas être réassigné','let est global','const est plus rapide'], reponse: 'const ne peut pas être réassigné' },
      { question: 'Que fait Array.filter() ?', options: ['Transforme chaque élément','Retourne les éléments qui passent le test','Trie le tableau','Supprime les doublons'], reponse: 'Retourne les éléments qui passent le test' },
      { question: 'Arrow function et this ?', options: ['Identique','Hérite du contexte parent','Crée son propre this','Pas de this'], reponse: 'Hérite du contexte parent' },
      { question: 'Syntaxe de destructuring objet ?', options: ['const [a] = obj','const {a} = obj','const a = obj[]','extract(obj,a)'], reponse: 'const {a} = obj' },
      { question: 'fetch() retourne ?', options: ['Les données directement','Une Promise','Un callback','Un tableau'], reponse: 'Une Promise' },
    ]
  },
  2: {
    chapitres: [
      { titre: 'Composants React', contenu: `**Un composant React est une fonction qui retourne du JSX :**\n\`\`\`jsx\nfunction MonComposant({ nom, age }) {\n  return (\n    <div className="card">\n      <h2>{nom}</h2>\n      <p>Age: {age}</p>\n    </div>\n  );\n}\n\n// Utilisation\n<MonComposant nom="Aymen" age={22} />\n\`\`\`\n\n**Props :** données passées du parent vers l'enfant.\n**JSX :** syntaxe HTML dans JavaScript, compilée par Vite.`, quiz: [
        { question: 'Que sont les props en React ?', options: ['Variables locales','Données passées du parent','Fonctions internes','Styles CSS'], reponse: 'Données passées du parent' },
        { question: 'JSX est ?', options: ['Un langage','HTML dans JavaScript','CSS dans React','Un framework'], reponse: 'HTML dans JavaScript' },
        { question: 'Comment passer un nombre comme prop ?', options: ['age="22"','age={22}','age=22','age:(22)'], reponse: 'age={22}' },
      ]},
      { titre: 'State avec useState', contenu: `**useState** est le hook le plus important :\n\`\`\`jsx\nimport { useState } from 'react';\n\nfunction Compteur() {\n  const [count, setCount] = useState(0); // [valeur, setter]\n\n  return (\n    <div>\n      <p>Compteur: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+</button>\n      <button onClick={() => setCount(count - 1)}>-</button>\n    </div>\n  );\n}\n\`\`\`\n\n**Règle importante :** ne jamais modifier le state directement.\nToujours utiliser le setter : \`setCount(newValue)\``, quiz: [
        { question: 'Que retourne useState(0) ?', options: ['Un nombre','[valeur, setter]','Un objet','Une promesse'], reponse: '[valeur, setter]' },
        { question: 'Comment mettre à jour le state ?', options: ['state = newValue','setState(newValue)','setCount(newValue)','update(state)'], reponse: 'setCount(newValue)' },
        { question: 'Quand React re-rend un composant ?', options: ['Jamais','Quand le state change','Chaque seconde','Au clic'], reponse: 'Quand le state change' },
      ]},
      { titre: 'useEffect et cycle de vie', contenu: `**useEffect** exécute du code après le rendu :\n\`\`\`jsx\nimport { useState, useEffect } from 'react';\n\nfunction Users() {\n  const [users, setUsers] = useState([]);\n\n  useEffect(() => {\n    // Exécuté après chaque rendu\n    fetch('/api/users')\n      .then(r => r.json())\n      .then(data => setUsers(data));\n  }, []); // [] = exécuter UNE SEULE FOIS au montage\n\n  return <ul>{users.map(u => <li key={u.id}>{u.nom}</li>)}</ul>;\n}\n\`\`\`\n\n**Le tableau de dépendances :**\n- \`[]\` : une fois au montage\n- \`[valeur]\` : quand valeur change\n- Vide : à chaque rendu`, quiz: [
        { question: 'useEffect avec [] s\'exécute ?', options: ['À chaque rendu','Une seule fois au montage','Jamais','Au démontage'], reponse: 'Une seule fois au montage' },
        { question: 'À quoi sert useEffect ?', options: ['Gérer le state','Effets de bord après rendu','Styliser','Router'], reponse: 'Effets de bord après rendu' },
        { question: 'Que signifie le tableau de dépendances ?', options: ['Props requis','Conditions de re-exécution','Variables globales','Imports'], reponse: 'Conditions de re-exécution' },
      ]},
      { titre: 'React Router & Navigation', contenu: `**Installation et configuration :**\n\`\`\`jsx\nimport { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path="/"        element={<Home />} />\n        <Route path="/cours"   element={<Cours />} />\n        <Route path="/profil"  element={<Profil />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}\n\`\`\`\n\n**Navigation programmatique :**\n\`\`\`jsx\nconst navigate = useNavigate();\nnavigate('/cours');       // aller à /cours\nnavigate(-1);             // retour en arrière\n\`\`\``, quiz: [
        { question: 'Quel composant définit les routes ?', options: ['<Router>','<Routes>','<Link>','<Navigate>'], reponse: '<Routes>' },
        { question: 'Hook pour naviguer programmatiquement ?', options: ['useRouter','useNavigate','useLocation','usePath'], reponse: 'useNavigate' },
        { question: 'Comment faire un lien React Router ?', options: ['<a href>','<Link to>','<navigate>','<route>'], reponse: '<Link to>' },
      ]},
    ],
    testFinal: [
      { question: 'Que sont les props ?', options: ['Variables locales','Données du parent','State interne','Fonctions'], reponse: 'Données du parent' },
      { question: 'useState retourne ?', options: ['Une valeur','Un tableau [valeur, setter]','Un objet','Une promesse'], reponse: 'Un tableau [valeur, setter]' },
      { question: 'useEffect avec [] ?', options: ['Jamais','À chaque rendu','Une fois au montage','Quand le state change'], reponse: 'Une fois au montage' },
      { question: 'Hook pour naviguer ?', options: ['useRouter','useNavigate','useHistory','useLocation'], reponse: 'useNavigate' },
      { question: 'JSX est ?', options: ['Un langage séparé','HTML dans JS compilé','CSS en JS','Un framework'], reponse: 'HTML dans JS compilé' },
    ]
  }
};

export default function Cours() {
  const api = useApi();
  const [cours, setCours]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [vue, setVue]               = useState('liste');
  const [coursActif, setCoursActif] = useState(null);
  const [chapIdx, setChapIdx]       = useState(0);
  const [done, setDone]             = useState([]);
  const [qA, setQA]                 = useState({});
  const [qSoumis, setQSoumis]       = useState(false);
  const [tA, setTA]                 = useState({});
  const [tSoumis, setTSoumis]       = useState(false);
  const [scoreQ, setScoreQ]         = useState(null);
  const [scoreT, setScoreT]         = useState(null);

  useEffect(() => { api.get('/cours/progression').then(r => { setCours(r.data); setLoading(false); }); }, []);

  const ouvrir = (c) => {
    setCoursActif(c); setChapIdx(0); setDone([]);
    setQA({}); setQSoumis(false); setTA({}); setTSoumis(false);
    setScoreQ(null); setScoreT(null); setVue('cours');
  };

  const parcours = coursActif ? PARCOURS[coursActif.id] : null;
  const chap = parcours ? parcours.chapitres[chapIdx] : null;

  const soumettreQuiz = () => {
    let ok = 0;
    chap.quiz.forEach((q,i) => { if (qA[i] === q.reponse) ok++; });
    const s = Math.round((ok/chap.quiz.length)*100);
    setScoreQ({ score:s, ok, total:chap.quiz.length }); setQSoumis(true);
  };

  const suivant = () => {
    setDone(p => [...p, chapIdx]);
    if (chapIdx+1 < parcours.chapitres.length) {
      setChapIdx(chapIdx+1); setQA({}); setQSoumis(false); setScoreQ(null); setVue('cours');
    } else { setVue('test'); }
  };

  const soumettreTest = async () => {
    let ok = 0;
    parcours.testFinal.forEach((q,i) => { if (tA[i] === q.reponse) ok++; });
    const s = Math.round((ok/parcours.testFinal.length)*100);
    setScoreT({ score:s, ok, total:parcours.testFinal.length }); setTSoumis(true);
    await api.post(`/cours/${coursActif.id}/score`, { score:s });
    setCours(p => p.map(c => c.id === coursActif.id ? { ...c, score:s, completed:s>=70 } : c));
  };

  const nB = { debutant:'badge-green', intermediaire:'badge-orange', avance:'badge-purple' };
  const nL = { debutant:'Débutant', intermediaire:'Intermédiaire', avance:'Avancé' };

  const renderContenu = (text) => text.split('```').map((block, i) => {
    if (i % 2 === 1) return <pre key={i} className="code-block"><code>{block.replace(/^(js|jsx)\n/,'')}</code></pre>;
    return <span key={i}>{block.split('**').map((t,j) =>
      j%2===1 ? <strong key={j} style={{color:'var(--text-primary)'}}>{t}</strong>
      : t.split('`').map((s,k) => k%2===1
        ? <code key={k} style={{background:'var(--bg-elevated)',padding:'1px 6px',borderRadius:5,fontFamily:'monospace',fontSize:13,color:'var(--accent)'}}>{s}</code>
        : s)
    )}</span>;
  });

  const NavCours = () => (
    <div style={{width:250,background:'var(--bg-surface)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',flexShrink:0,overflowY:'auto'}}>
      <div style={{padding:'20px 16px',borderBottom:'1px solid var(--border)'}}>
        <div style={{fontSize:11,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>Cours</div>
        <div style={{fontWeight:700,fontSize:14,color:'var(--text-primary)'}}>{coursActif?.titre}</div>
        <div style={{marginTop:10}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text-muted)',marginBottom:4}}>
            <span>Progression</span><span>{done.length}/{parcours?.chapitres.length}</span>
          </div>
          <div className="progress-wrap progress-bar">
            <div className="progress-fill" style={{width:`${parcours ? (done.length/parcours.chapitres.length)*100 : 0}%`}} />
          </div>
        </div>
      </div>
      <div style={{padding:'12px 10px',flex:1}}>
        <div style={{fontSize:10,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'.08em',padding:'0 6px',marginBottom:8}}>Chapitres</div>
        {parcours?.chapitres.map((ch,i) => (
          <div key={i} className={`chapter-item ${i===chapIdx&&vue==='cours'?'active':''} ${done.includes(i)?'done':''}`}
            onClick={() => { if(done.includes(i)||i===chapIdx){setChapIdx(i);setVue('cours');} }}>
            <div className="chapter-dot">{done.includes(i)?<i className="ti ti-check" style={{fontSize:10}}/>:i+1}</div>
            <span>{ch.titre}</span>
          </div>
        ))}
        <div style={{margin:'10px 0',height:1,background:'var(--border)'}}/>
        <div className={`chapter-item ${vue==='test'?'active':''}`}
          style={{opacity:done.length===parcours?.chapitres.length?1:0.4}}
          onClick={() => { if(done.length===parcours?.chapitres.length) setVue('test'); }}>
          <div className="chapter-dot" style={{borderColor:'var(--yellow)',color:'var(--yellow)'}}>🏆</div>
          <span>Test final</span>
        </div>
      </div>
      <div style={{padding:12,borderTop:'1px solid var(--border)'}}>
        <button className="btn btn-ghost btn-sm" style={{width:'100%'}} onClick={() => setVue('liste')}>
          <i className="ti ti-arrow-left"/> Retour aux cours
        </button>
      </div>
    </div>
  );

  if (loading) return <div className="page" style={{display:'flex',alignItems:'center',gap:12,color:'var(--text-muted)'}}><span className="spinner"/> Chargement...</div>;

  if (vue === 'liste') return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Mes cours</h1>
        <p className="page-subtitle">Apprenez par chapitres, validez par quiz et obtenez votre certification</p>
      </div>
      <div className="grid-2">
        {cours.map(c => (
          <div key={c.id} className="card card-hover" onClick={() => ouvrir(c)} style={{cursor:'pointer'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
              <div>
                <div style={{fontWeight:700,fontSize:16,color:'var(--text-primary)',marginBottom:4}}>{c.titre}</div>
                <div style={{fontSize:12,color:'var(--text-muted)'}}>{c.domaine}</div>
              </div>
              <span className={`badge ${nB[c.niveau]}`}>{nL[c.niveau]}</span>
            </div>
            <p style={{fontSize:13,color:'var(--text-secondary)',marginBottom:16}}>{c.contenu}</p>
            <div style={{display:'flex',gap:16,fontSize:12,color:'var(--text-muted)',marginBottom:14}}>
              {PARCOURS[c.id] && <span><i className="ti ti-book" style={{marginRight:4}}/>{PARCOURS[c.id].chapitres.length} chapitres</span>}
              <span><i className="ti ti-clock" style={{marginRight:4}}/>{c.duree || '3h'}</span>
            </div>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'var(--text-muted)',marginBottom:6}}>
                <span>Progression</span><span>{c.score||0}%</span>
              </div>
              <div className="progress-wrap progress-bar">
                <div className={`progress-fill ${c.completed?'green':''}`} style={{width:`${c.score||0}%`}}/>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:14}}>
              {c.completed ? <span className="badge badge-green"><i className="ti ti-check"/> Certifié</span>
                : c.score > 0 ? <span className="badge badge-orange"><i className="ti ti-player-play"/> En cours</span>
                : <span className="badge badge-muted">Non commencé</span>}
              {!PARCOURS[c.id] && <span className="badge badge-muted">Bientôt disponible</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (vue === 'cours' && chap) return (
    <div style={{display:'flex',height:'100%'}}>
      <NavCours/>
      <div className="main-content" style={{flex:1}}>
        <div className="page">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
            <div>
              <div style={{fontSize:12,color:'var(--text-muted)',marginBottom:4}}>Chapitre {chapIdx+1} / {parcours.chapitres.length}</div>
              <h2 style={{fontSize:22,fontWeight:800,color:'var(--text-primary)'}}>{chap.titre}</h2>
            </div>
            <span className={`badge ${nB[coursActif.niveau]}`}>{nL[coursActif.niveau]}</span>
          </div>

          <div className="card" style={{marginBottom:20,fontSize:14,lineHeight:1.9,color:'var(--text-secondary)'}}>
            {renderContenu(chap.contenu)}
          </div>

          <div className="card">
            <div className="section-title"><i className="ti ti-help-circle"/> Quiz — {chap.titre}</div>
            <div style={{display:'flex',flexDirection:'column',gap:22}}>
              {chap.quiz.map((q,i) => (
                <div key={i}>
                  <p style={{fontSize:14,fontWeight:600,color:'var(--text-primary)',marginBottom:10}}>{i+1}. {q.question}</p>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    {q.options.map((opt,j) => {
                      let cls='quiz-option';
                      if(qSoumis){if(opt===q.reponse)cls+=' correct';else if(opt===qA[i])cls+=' wrong';}
                      else if(qA[i]===opt)cls+=' selected';
                      return (
                        <div key={j} className={cls} onClick={()=>{ if(!qSoumis) setQA({...qA,[i]:opt}); }}>
                          <span className="quiz-letter">{L[j]}</span>{opt}
                          {qSoumis&&opt===q.reponse&&<i className="ti ti-check" style={{marginLeft:'auto',color:'var(--green)'}}/>}
                          {qSoumis&&opt===qA[i]&&opt!==q.reponse&&<i className="ti ti-x" style={{marginLeft:'auto',color:'var(--red)'}}/>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {!qSoumis ? (
              <button className="btn btn-primary" style={{marginTop:20}} onClick={soumettreQuiz} disabled={Object.keys(qA).length<chap.quiz.length}>
                <i className="ti ti-check"/> Valider le quiz
              </button>
            ) : (
              <div style={{marginTop:20}}>
                <div style={{display:'flex',alignItems:'center',gap:12,padding:'14px 18px',borderRadius:12,background:scoreQ.score>=70?'var(--green-dim)':'var(--orange-dim)',marginBottom:14,border:`1px solid ${scoreQ.score>=70?'var(--green)':'var(--orange)'}`}}>
                  <span style={{fontSize:24}}>{scoreQ.score>=70?'🎉':'😅'}</span>
                  <div>
                    <div style={{fontWeight:700,color:scoreQ.score>=70?'var(--green)':'var(--orange)'}}>{scoreQ.ok}/{scoreQ.total} — {scoreQ.score}%</div>
                    <div style={{fontSize:12,color:'var(--text-secondary)'}}>{scoreQ.score>=70?'Excellent ! Passez au chapitre suivant.':'Relisez le cours et réessayez.'}</div>
                  </div>
                </div>
                {scoreQ.score>=70
                  ? <button className="btn btn-success" onClick={suivant}>{chapIdx+1<parcours.chapitres.length?<><i className="ti ti-arrow-right"/> Chapitre suivant</>:<><i className="ti ti-trophy"/> Passer au test final</>}</button>
                  : <button className="btn btn-ghost" onClick={()=>{setQA({});setQSoumis(false);setScoreQ(null);}}><i className="ti ti-refresh"/> Réessayer le quiz</button>
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (vue === 'test') return (
    <div style={{display:'flex',height:'100%'}}>
      <NavCours/>
      <div className="main-content" style={{flex:1}}>
        <div className="page">
          <div style={{marginBottom:24}}>
            <div style={{fontSize:12,color:'var(--yellow)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>🏆 Test final de certification</div>
            <h2 style={{fontSize:22,fontWeight:800,color:'var(--text-primary)'}}>{coursActif.titre}</h2>
            <p style={{fontSize:13,color:'var(--text-muted)',marginTop:4}}>{parcours.testFinal.length} questions — Score minimum requis : 70%</p>
          </div>
          {!tSoumis ? (
            <div className="card">
              <div style={{display:'flex',flexDirection:'column',gap:24}}>
                {parcours.testFinal.map((q,i) => (
                  <div key={i}>
                    <p style={{fontSize:14,fontWeight:600,color:'var(--text-primary)',marginBottom:10}}>{i+1}. {q.question}</p>
                    <div style={{display:'flex',flexDirection:'column',gap:8}}>
                      {q.options.map((opt,j) => (
                        <div key={j} className={`quiz-option ${tA[i]===opt?'selected':''}`} onClick={()=>setTA({...tA,[i]:opt})}>
                          <span className="quiz-letter">{L[j]}</span>{opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary btn-lg" style={{marginTop:24}} onClick={soumettreTest} disabled={Object.keys(tA).length<parcours.testFinal.length}>
                <i className="ti ti-send"/> Soumettre le test final
              </button>
            </div>
          ) : (
            <div className="card" style={{textAlign:'center',padding:'52px 24px'}}>
              <div style={{fontSize:72,marginBottom:8}}>{scoreT.score>=70?'🏆':'💪'}</div>
              <div style={{fontSize:68,fontWeight:900,color:scoreT.score>=70?'var(--green)':'var(--orange)',lineHeight:1}}>{scoreT.score}%</div>
              <div style={{fontSize:16,color:'var(--text-secondary)',marginTop:8,marginBottom:6}}>{scoreT.ok}/{scoreT.total} bonnes réponses</div>
              <div style={{fontSize:15,fontWeight:600,color:scoreT.score>=70?'var(--green)':'var(--orange)',marginBottom:28}}>
                {scoreT.score>=70?'🎉 Félicitations ! Cours certifié !':'Continuez à pratiquer !'}
              </div>
              {scoreT.score>=70
                ? <span className="badge badge-grad" style={{fontSize:14,padding:'8px 20px'}}>✅ Certification obtenue</span>
                : <button className="btn btn-ghost" onClick={()=>{setTA({});setTSoumis(false);}}><i className="ti ti-refresh"/> Refaire le test</button>
              }
              <br/>
              <button className="btn btn-ghost" style={{marginTop:16}} onClick={()=>setVue('liste')}><i className="ti ti-arrow-left"/> Retour aux cours</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return null;
}
