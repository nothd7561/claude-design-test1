// Comparison Project — Portfolio UI kit
// All screens + components live here, exposed on window.

const { useState, useMemo } = React;

// ---------- Atoms ----------
const Mark = ({ size = 20 }) => (
  <span style={{ display:'inline-flex', alignItems:'center', gap:10 }}>
    <span style={{
      width:size, height:size, borderRadius:999,
      background:'var(--gradient-accent)',
      boxShadow:'0 4px 12px -4px rgba(184,107,255,0.35)'
    }}/>
    <span style={{ fontWeight:500, letterSpacing:'-0.01em', color:'var(--fg-1)'}}>Comparison Project</span>
  </span>
);

const Button = ({ variant='primary', children, onClick, style }) => {
  const base = {
    fontFamily:'inherit', fontSize:14, fontWeight:500,
    padding:'10px 20px', borderRadius:999, border:0, cursor:'pointer',
    transition:'all var(--dur-med) var(--ease-out)',
    letterSpacing:'-0.01em',
  };
  const variants = {
    primary: { background:'var(--gradient-accent)', color:'#fff', boxShadow:'var(--shadow-1)' },
    secondary: { background:'transparent', color:'var(--fg-1)', border:'1px solid var(--border-2)' },
    ghost: { background:'transparent', color:'var(--fg-2)', padding:'10px 14px' },
  };
  return <button onClick={onClick} style={{...base, ...variants[variant], ...style}}>{children}</button>;
};

const Chip = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{
    fontFamily:'var(--font-mono)', fontSize:12, padding:'4px 12px', borderRadius:999,
    background: active ? 'var(--ink)' : 'var(--bg-2)',
    color: active ? 'var(--paper)' : 'var(--fg-2)',
    border: active ? '1px solid var(--ink)' : '1px solid var(--border-1)',
    cursor:'pointer', transition:'all var(--dur-fast) var(--ease-out)',
  }}>{children}</button>
);

const Eyebrow = ({ children }) => (
  <div style={{ fontSize:12, color:'var(--fg-3)', letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:500 }}>{children}</div>
);

const ArrowLink = ({ children, onClick }) => (
  <a onClick={onClick} style={{
    color:'var(--fg-1)', textDecoration:'none', fontSize:14,
    borderBottom:'1px solid var(--border-2)', paddingBottom:2, cursor:'pointer',
    transition:'border-color var(--dur-fast) var(--ease-out)',
  }}>{children}</a>
);

// ---------- Icons (Lucide inline) ----------
const Icon = ({ d, size=18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const ArrowRight = () => <Icon d={<><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>} />;
const MailIcon = () => <Icon d={<><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 5L2 7"/></>} />;
const GithubIcon = () => <Icon d={<><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></>} />;
const ExternalIcon = () => <Icon d={<><path d="M15 3h6v6"/><path d="m10 14 11-11"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></>} />;

// ---------- Nav + Footer ----------
const Nav = ({ route, setRoute }) => {
  const items = [
    ['home','home'], ['work','work'], ['about','about'],
    ['writing','writing'], ['contact','contact']
  ];
  return (
    <nav style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'22px 48px', borderBottom:'1px solid var(--border-1)',
      position:'sticky', top:0, zIndex:10,
      background:'rgba(250,250,247,0.85)', backdropFilter:'blur(12px)',
    }}>
      <a onClick={()=>setRoute({name:'home'})} style={{cursor:'pointer'}}><Mark /></a>
      <div style={{ display:'flex', gap:28 }}>
        {items.map(([label,key]) => (
          <a key={key} onClick={()=>setRoute({name:key})} style={{
            color: route.name===key ? 'var(--fg-1)':'var(--fg-2)', textDecoration:'none', fontSize:14,
            position:'relative', padding:'4px 0', cursor:'pointer',
          }}>
            {label}
            {route.name===key && <span style={{
              position:'absolute', left:0, right:0, bottom:-6, height:2,
              background:'var(--gradient-accent)', borderRadius:2
            }}/>}
          </a>
        ))}
      </div>
      <Button variant="secondary" onClick={()=>setRoute({name:'contact'})}>Get in touch</Button>
    </nav>
  );
};

const Footer = () => (
  <footer style={{
    padding:'32px 48px', borderTop:'1px solid var(--border-1)',
    display:'flex', justifyContent:'space-between', alignItems:'center',
    fontSize:13, color:'var(--fg-3)', marginTop:96,
  }}>
    <span>© 2026 — a quiet portfolio</span>
    <span style={{display:'flex', gap:20, alignItems:'center'}}>
      <a style={{color:'var(--fg-2)', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer'}}><GithubIcon/> github</a>
      <a style={{color:'var(--fg-2)', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer'}}><MailIcon/> email</a>
      <a style={{color:'var(--fg-2)', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer'}}><ExternalIcon/> read.cv</a>
    </span>
  </footer>
);

// ---------- Data ----------
const PROJECTS = [
  { slug:'broadband', year:2025, kind:'Case study', title:'Broadband access & remote work',
    blurb:'County-level broadband access mapped onto remote-work uptake, pulled from FCC + ACS.',
    tags:['data-viz','python','choropleth'], accent:'var(--gradient-accent-soft)', featured:true },
  { slug:'trees', year:2024, kind:'Visual essay', title:'The color of city trees',
    blurb:'A photographic + chromatic survey of street trees across four neighborhoods.',
    tags:['graphic design','d3'], accent:'linear-gradient(135deg,#FFE2D8,#FFD4C4)' },
  { slug:'reading', year:2024, kind:'Dashboard', title:'Three years of reading',
    blurb:'A small dashboard tracking pace, genre, and abandonment across 2022–2024.',
    tags:['analytics','observable'], accent:'linear-gradient(135deg,#E9DAFE,#D9E4FF)' },
  { slug:'typography', year:2023, kind:'Experiment', title:'Grotesk variations',
    blurb:'Teaching myself variable fonts by animating a grotesque along three axes.',
    tags:['graphic design','typography'], accent:'linear-gradient(135deg,#D9E4FF,#C4DBFF)' },
  { slug:'census', year:2023, kind:'Analysis', title:'Notes on the 2020 census',
    blurb:'A reading of the undercount — with a gentle argument for smaller charts.',
    tags:['writing','data-viz'], accent:'linear-gradient(135deg,#F2F1EC,#E6E4DD)' },
  { slug:'weather', year:2022, kind:'Sketch', title:'A year of weather',
    blurb:'One tile per day. The tile is a gradient. That\u2019s the whole piece.',
    tags:['graphic design'], accent:'linear-gradient(135deg,#FFE2D8,#E9DAFE,#D9E4FF)' },
];

// ---------- Project card ----------
const ProjectCard = ({ p, onOpen, size='md' }) => {
  const [hover,setHover] = useState(false);
  const h = size==='lg' ? 260 : 180;
  return (
    <a onClick={()=>onOpen(p)}
       onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
       style={{
      display:'block', cursor:'pointer', textDecoration:'none', color:'inherit',
      borderRadius:'var(--r-md)', overflow:'hidden',
      background:'var(--bg-1)', border:'1px solid var(--border-1)',
      transform: hover ? 'translateY(-2px)' : 'translateY(0)',
      boxShadow: hover ? 'var(--shadow-2)' : 'none',
      transition:'all var(--dur-med) var(--ease-out)',
    }}>
      <div style={{ height:h, background:p.accent }}/>
      <div style={{ padding:'18px 20px' }}>
        <Eyebrow>{p.kind} · {p.year}</Eyebrow>
        <div style={{ fontSize:20, fontWeight:500, color:'var(--fg-1)', marginTop:6, letterSpacing:'-0.01em' }}>{p.title}</div>
        <div style={{ fontSize:14, color:'var(--fg-3)', marginTop:8, lineHeight:1.55 }}>{p.blurb}</div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:14 }}>
          {p.tags.map(t => <span key={t} style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--fg-3)' }}>·{t}</span>)}
        </div>
      </div>
    </a>
  );
};

// ---------- Screens ----------
const Home = ({ setRoute }) => (
  <main>
    <section style={{ padding:'96px 48px 64px', maxWidth:1200, margin:'0 auto' }}>
      <Eyebrow>Portfolio · 2023 – 2026</Eyebrow>
      <h1 style={{ fontSize:80, fontWeight:300, letterSpacing:'-0.03em', lineHeight:1.02, marginTop:20, maxWidth:'14em', color:'var(--fg-1)' }}>
        A quiet portfolio<br/>of <span className="gradient-text">data, analysis,</span><br/>and graphic design.
      </h1>
      <p style={{ fontSize:18, color:'var(--fg-2)', maxWidth:'42em', marginTop:32, lineHeight:1.65 }}>
        I&rsquo;m a student working at the seam of analytics and design. This is a small collection of studies — mostly about how data feels when it&rsquo;s shown carefully.
      </p>
      <div style={{ display:'flex', gap:12, marginTop:40 }}>
        <Button onClick={()=>setRoute({name:'work'})}>See the work →</Button>
        <Button variant="secondary" onClick={()=>setRoute({name:'about'})}>About me</Button>
      </div>
    </section>

    <section style={{ padding:'64px 48px', maxWidth:1200, margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:32 }}>
        <h2 style={{ fontSize:28, fontWeight:500, letterSpacing:'-0.02em' }}>Selected work</h2>
        <ArrowLink onClick={()=>setRoute({name:'work'})}>see everything →</ArrowLink>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:20, marginBottom:20 }}>
        <ProjectCard p={PROJECTS[0]} size="lg" onOpen={p=>setRoute({name:'project', slug:p.slug})} />
        <ProjectCard p={PROJECTS[1]} size="lg" onOpen={p=>setRoute({name:'project', slug:p.slug})} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20 }}>
        {PROJECTS.slice(2,5).map(p => <ProjectCard key={p.slug} p={p} onOpen={pp=>setRoute({name:'project', slug:pp.slug})} />)}
      </div>
    </section>

    <section style={{ padding:'64px 48px', maxWidth:1200, margin:'0 auto' }}>
      <hr className="rule" />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:48, paddingTop:48 }}>
        <Eyebrow>What I&rsquo;m after</Eyebrow>
        <p style={{ fontSize:22, color:'var(--fg-1)', lineHeight:1.5, fontWeight:400, letterSpacing:'-0.01em', maxWidth:'28em' }}>
          Most of my work is a small argument that data is more convincing when it&rsquo;s <em>quieter</em>. I&rsquo;m drawn to the moment a chart stops explaining and starts noticing.
        </p>
      </div>
    </section>
  </main>
);

const Work = ({ setRoute }) => {
  const [filter,setFilter] = useState('all');
  const tags = ['all','data-viz','graphic design','analytics','writing'];
  const shown = useMemo(() => filter==='all' ? PROJECTS : PROJECTS.filter(p => p.tags.includes(filter)), [filter]);
  return (
    <main style={{ padding:'64px 48px', maxWidth:1200, margin:'0 auto' }}>
      <Eyebrow>Work · {PROJECTS.length} projects</Eyebrow>
      <h1 style={{ fontSize:56, fontWeight:400, letterSpacing:'-0.02em', marginTop:14, color:'var(--fg-1)' }}>Everything, chronologically.</h1>
      <div style={{ display:'flex', gap:8, margin:'40px 0', flexWrap:'wrap' }}>
        {tags.map(t => <Chip key={t} active={filter===t} onClick={()=>setFilter(t)}>{t}</Chip>)}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
        {shown.map(p => <ProjectCard key={p.slug} p={p} onOpen={pp=>setRoute({name:'project', slug:pp.slug})} />)}
      </div>
    </main>
  );
};

const BarChart = () => {
  const bars = [30,42,55,48,70,62,88,76,94];
  const colors = ['var(--mist)','var(--mist)','var(--ash)','var(--ash)','var(--slate)','var(--slate)','var(--accent-a)','var(--accent-b)','var(--accent-c)'];
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:220, padding:'0 4px' }}>
      {bars.map((h,i)=> <div key={i} style={{ flex:1, height:`${h}%`, borderRadius:'4px 4px 0 0', background:colors[i] }}/>)}
    </div>
  );
};

const Project = ({ slug, setRoute }) => {
  const p = PROJECTS.find(x => x.slug===slug) || PROJECTS[0];
  return (
    <main>
      <section style={{ padding:'48px 48px 0', maxWidth:1000, margin:'0 auto' }}>
        <ArrowLink onClick={()=>setRoute({name:'work'})}>← back to work</ArrowLink>
        <div style={{ marginTop:32 }}>
          <Eyebrow>{p.kind} · {p.year}</Eyebrow>
          <h1 style={{ fontSize:56, fontWeight:400, letterSpacing:'-0.02em', marginTop:14, lineHeight:1.05 }}>{p.title}</h1>
          <p style={{ fontSize:20, color:'var(--fg-2)', maxWidth:'34em', marginTop:24, lineHeight:1.55 }}>{p.blurb}</p>
        </div>
      </section>
      <section style={{ padding:'48px 48px', maxWidth:1200, margin:'0 auto' }}>
        <div style={{ height:440, background:p.accent, borderRadius:'var(--r-lg)' }}/>
      </section>
      <section style={{ padding:'0 48px 64px', maxWidth:1000, margin:'0 auto', display:'grid', gridTemplateColumns:'200px 1fr', gap:64 }}>
        <div>
          <Eyebrow>Tools</Eyebrow>
          <div style={{ marginTop:8, fontSize:14, color:'var(--fg-2)', lineHeight:1.9 }}>
            Python · pandas<br/>D3 · Observable<br/>Figma
          </div>
          <Eyebrow style={{marginTop:24}}>Timeline</Eyebrow>
          <div style={{ marginTop:8, fontSize:14, color:'var(--fg-2)' }}>Spring 2025 · 6 weeks</div>
        </div>
        <div>
          <h3 style={{ fontSize:22, fontWeight:500, letterSpacing:'-0.01em' }}>The question</h3>
          <p style={{ marginTop:12 }}>I wanted to see whether access to broadband — not speed, just <em>access</em> — tracked with where people took up remote work during 2020–2023. The FCC publishes availability at the county level; the ACS publishes an estimate of remote workers.</p>
          <h3 style={{ fontSize:22, fontWeight:500, letterSpacing:'-0.01em', marginTop:40 }}>A finding, quietly</h3>
          <p style={{ marginTop:12 }}>The correlation is real but softer than I expected. Counties in the lowest quintile of access show meaningfully less uptake; everyone else looks more or less the same. The rest of the variance lives somewhere I didn&rsquo;t measure.</p>
          <div style={{ marginTop:32, padding:24, background:'var(--bg-2)', borderRadius:'var(--r-md)' }}>
            <Eyebrow>Remote work uptake · by access quintile</Eyebrow>
            <div style={{ marginTop:20 }}><BarChart/></div>
          </div>
          <h3 style={{ fontSize:22, fontWeight:500, letterSpacing:'-0.01em', marginTop:40 }}>What I&rsquo;d do differently</h3>
          <p style={{ marginTop:12 }}>I&rsquo;d stop at the finding. The first draft had four more charts that each said roughly the same thing.</p>
        </div>
      </section>
    </main>
  );
};

const About = () => (
  <main style={{ padding:'64px 48px', maxWidth:1000, margin:'0 auto' }}>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
      <div>
        <Eyebrow>About</Eyebrow>
        <h1 style={{ fontSize:48, fontWeight:400, letterSpacing:'-0.02em', marginTop:14, lineHeight:1.1 }}>
          I&rsquo;m a student of<br/>
          <span className="gradient-text">the quiet middle</span><br/>
          between numbers and images.
        </h1>
        <p style={{ marginTop:32, fontSize:17, lineHeight:1.65 }}>
          I&rsquo;m studying data science and graphic design at Rice. This portfolio is the place where those two habits talk to each other.
        </p>
        <p style={{ marginTop:16, fontSize:17, lineHeight:1.65 }}>
          I&rsquo;m interested in the kind of analysis that doesn&rsquo;t shout, and the kind of design that gets out of the way.
        </p>
      </div>
      <div style={{ aspectRatio:'4/5', background:'var(--gradient-accent-soft)', borderRadius:'var(--r-lg)' }}/>
    </div>
    <hr className="rule" style={{margin:'80px 0 48px'}}/>
    <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:64 }}>
      <Eyebrow>Toolkit</Eyebrow>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px 48px'}}>
        {[
          ['Data','Python · pandas · scikit-learn · SQL'],
          ['Visualization','D3 · Observable · Plot · matplotlib'],
          ['Design','Figma · Illustrator · After Effects'],
          ['Writing','Obsidian · Notion · a surprising amount of paper'],
        ].map(([k,v]) => <div key={k}><div style={{fontSize:14,fontWeight:500,color:'var(--fg-1)'}}>{k}</div><div style={{marginTop:6,fontSize:14,color:'var(--fg-3)',lineHeight:1.7}}>{v}</div></div>)}
      </div>
    </div>
    <hr className="rule" style={{margin:'80px 0 48px'}}/>
    <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:64 }}>
      <Eyebrow>Timeline</Eyebrow>
      <div>
        {[
          ['2026','senior thesis · a visual essay on the census'],
          ['2025','summer internship · analytics at a small nonprofit'],
          ['2024','started this portfolio'],
          ['2023','first D3 project; first time it felt easy'],
          ['2022','picked up graphic design on a whim'],
        ].map(([y,t]) => (
          <div key={y} style={{display:'grid', gridTemplateColumns:'80px 1fr', padding:'14px 0', borderBottom:'1px solid var(--border-1)'}}>
            <span style={{fontFamily:'var(--font-mono)', fontSize:13, color:'var(--fg-3)'}}>{y}</span>
            <span style={{fontSize:15, color:'var(--fg-2)'}}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  </main>
);

const Contact = () => {
  const [sent,setSent] = useState(false);
  const [form,setForm] = useState({ name:'', email:'', message:'' });
  return (
    <main style={{ padding:'64px 48px', maxWidth:900, margin:'0 auto' }}>
      <Eyebrow>Contact</Eyebrow>
      <h1 style={{ fontSize:56, fontWeight:400, letterSpacing:'-0.02em', marginTop:14 }}>Say hello.</h1>
      <p style={{ fontSize:18, color:'var(--fg-2)', marginTop:20, maxWidth:'34em', lineHeight:1.6 }}>
        I&rsquo;m looking for internships in data-viz, analytics, or editorial design for summer 2026. A short note is the best way in.
      </p>
      {sent ? (
        <div style={{ marginTop:56, padding:'48px 40px', background:'var(--bg-2)', borderRadius:'var(--r-lg)' }}>
          <Eyebrow>Thank you</Eyebrow>
          <p style={{ fontSize:22, color:'var(--fg-1)', marginTop:14, letterSpacing:'-0.01em' }}>
            Your note is on its way. I&rsquo;ll reply within a week — usually sooner.
          </p>
        </div>
      ) : (
        <form style={{ marginTop:56, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px 24px' }}
              onSubmit={e => { e.preventDefault(); setSent(true); }}>
          <Field label="Name" value={form.name} onChange={v=>setForm({...form,name:v})} />
          <Field label="Email" value={form.email} onChange={v=>setForm({...form,email:v})} />
          <div style={{ gridColumn:'1/-1' }}>
            <Field label="Message" textarea value={form.message} onChange={v=>setForm({...form,message:v})}
                   placeholder="A few words about what you're working on." />
          </div>
          <div style={{ gridColumn:'1/-1', marginTop:8 }}>
            <Button>Send it →</Button>
          </div>
        </form>
      )}
      <hr className="rule" style={{margin:'80px 0 32px'}}/>
      <div style={{ display:'flex', gap:32, fontSize:15, color:'var(--fg-2)' }}>
        <a style={{display:'inline-flex',alignItems:'center',gap:8,color:'inherit',textDecoration:'none',cursor:'pointer'}}><MailIcon/> hello@comparison.project</a>
        <a style={{display:'inline-flex',alignItems:'center',gap:8,color:'inherit',textDecoration:'none',cursor:'pointer'}}><GithubIcon/> github.com/comparisonproject</a>
      </div>
    </main>
  );
};

const Field = ({ label, value, onChange, textarea, placeholder }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
    <label style={{ fontSize:12, color:'var(--fg-3)', letterSpacing:'0.04em', textTransform:'uppercase' }}>{label}</label>
    {textarea ? (
      <textarea rows={4} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)}
        style={{ fontFamily:'inherit', fontSize:15, padding:'12px 14px', border:'1px solid var(--border-2)',
                 background:'var(--paper)', borderRadius:'var(--r-sm)', color:'var(--fg-1)', resize:'vertical' }}/>
    ) : (
      <input value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)}
        style={{ fontFamily:'inherit', fontSize:15, padding:'12px 14px', border:'1px solid var(--border-2)',
                 background:'var(--paper)', borderRadius:'var(--r-sm)', color:'var(--fg-1)' }}/>
    )}
  </div>
);

const Writing = () => (
  <main style={{ padding:'64px 48px', maxWidth:900, margin:'0 auto' }}>
    <Eyebrow>Writing</Eyebrow>
    <h1 style={{ fontSize:56, fontWeight:400, letterSpacing:'-0.02em', marginTop:14 }}>Notes, occasionally.</h1>
    <div style={{ marginTop:48 }}>
      {[
        ['on smaller charts','March 2026','A quiet argument for making the chart smaller, again, until it stops explaining.'],
        ['the color of city trees','November 2025','A short essay about what I saw when I photographed every block of one neighborhood.'],
        ['first time it felt easy','August 2024','A note about the moment D3 clicked, which was, predictably, the moment I stopped fighting it.'],
      ].map(([t,d,b]) => (
        <article key={t} style={{ padding:'28px 0', borderBottom:'1px solid var(--border-1)', cursor:'pointer' }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--fg-3)' }}>{d}</div>
          <h3 style={{ fontSize:24, fontWeight:500, marginTop:6, letterSpacing:'-0.01em' }}>{t}</h3>
          <p style={{ marginTop:8, color:'var(--fg-3)', lineHeight:1.6 }}>{b}</p>
        </article>
      ))}
    </div>
  </main>
);

// ---------- Router ----------
const App = () => {
  const [route,setRoute] = useState({name:'home'});
  const screen = {
    home: <Home setRoute={setRoute}/>,
    work: <Work setRoute={setRoute}/>,
    project: <Project slug={route.slug} setRoute={setRoute}/>,
    about: <About/>,
    writing: <Writing/>,
    contact: <Contact/>,
  }[route.name];
  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-1)' }}>
      <Nav route={route} setRoute={setRoute}/>
      {screen}
      <Footer/>
    </div>
  );
};

Object.assign(window, { App });
