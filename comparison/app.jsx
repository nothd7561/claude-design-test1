// Comparison Project — LLM comparison tool
// Two-model selector, animated bar chart, overlaid radar, built against colors_and_type.css

const { useState, useEffect, useMemo, useRef } = React;

const MODELS = [
  { id:'claude-opus-4',     label:'Claude Opus 4',    vendor:'Anthropic',
    scores:{ intel:82, code:78, math:74, speed:42, latency:52, price:36, context:82 },
    raw:{ intel:'82.0', code:'78.0', math:'74.0', speed:'28 tok/s', latency:'3.5s TTFT', price:'$15/1M', context:'200k' } },
  { id:'claude-sonnet-4-5', label:'Claude Sonnet 4.5', vendor:'Anthropic',
    scores:{ intel:86, code:82, math:76, speed:70, latency:72, price:78, context:82 },
    raw:{ intel:'86.0', code:'82.0', math:'76.0', speed:'70 tok/s', latency:'1.8s TTFT', price:'$3/1M', context:'200k' } },
  { id:'gpt-4-1',           label:'GPT-4.1',           vendor:'OpenAI',
    scores:{ intel:84, code:80, math:75, speed:78, latency:78, price:74, context:78 },
    raw:{ intel:'84.0', code:'80.0', math:'75.0', speed:'90 tok/s', latency:'1.5s TTFT', price:'$2/1M', context:'128k' } },
  { id:'gpt-4o',            label:'GPT-4o',             vendor:'OpenAI',
    scores:{ intel:80, code:75, math:72, speed:80, latency:80, price:76, context:75 },
    raw:{ intel:'80.0', code:'75.0', math:'72.0', speed:'100 tok/s', latency:'1.2s TTFT', price:'$2.5/1M', context:'128k' } },
  { id:'gemini-2-5-pro',    label:'Gemini 2.5 Pro',    vendor:'Google',
    scores:{ intel:85, code:79, math:80, speed:86, latency:88, price:70, context:100 },
    raw:{ intel:'85.0', code:'79.0', math:'80.0', speed:'120 tok/s', latency:'0.9s TTFT', price:'$7/1M', context:'2M' } },
  { id:'llama-4-70b',       label:'Llama 4 70B',       vendor:'Meta',
    scores:{ intel:74, code:68, math:65, speed:94, latency:92, price:98, context:68 },
    raw:{ intel:'74.0', code:'68.0', math:'65.0', speed:'180 tok/s', latency:'0.5s TTFT', price:'$0.4/1M', context:'128k' } },
  { id:'mistral-large-3',   label:'Mistral Large 3',   vendor:'Mistral',
    scores:{ intel:76, code:72, math:66, speed:62, latency:75, price:82, context:72 },
    raw:{ intel:'76.0', code:'72.0', math:'66.0', speed:'55 tok/s', latency:'1.5s TTFT', price:'$2/1M', context:'128k' } },
  { id:'grok-3',            label:'Grok 3',             vendor:'xAI',
    scores:{ intel:78, code:74, math:70, speed:75, latency:68, price:66, context:72 },
    raw:{ intel:'78.0', code:'74.0', math:'70.0', speed:'80 tok/s', latency:'2.0s TTFT', price:'$5/1M', context:'128k' } },
  { id:'deepseek-v3',       label:'DeepSeek V3',       vendor:'DeepSeek',
    scores:{ intel:80, code:76, math:78, speed:84, latency:82, price:98, context:72 },
    raw:{ intel:'80.0', code:'76.0', math:'78.0', speed:'110 tok/s', latency:'1.2s TTFT', price:'$0.27/1M', context:'128k' } },
  { id:'command-r-plus',    label:'Command R+',        vendor:'Cohere',
    scores:{ intel:68, code:62, math:58, speed:72, latency:80, price:90, context:78 },
    raw:{ intel:'68.0', code:'62.0', math:'58.0', speed:'75 tok/s', latency:'1.4s TTFT', price:'$1/1M', context:'128k' } },
  { id:'claude-haiku-4-5',  label:'Claude Haiku 4.5',  vendor:'Anthropic',
    scores:{ intel:72, code:68, math:65, speed:88, latency:90, price:92, context:82 },
    raw:{ intel:'72.0', code:'68.0', math:'65.0', speed:'180 tok/s', latency:'0.5s TTFT', price:'$0.25/1M', context:'200k' } },
  { id:'claude-opus-3-7',   label:'Claude Opus 3.7',   vendor:'Anthropic',
    scores:{ intel:78, code:76, math:74, speed:32, latency:42, price:22, context:82 },
    raw:{ intel:'78.0', code:'76.0', math:'74.0', speed:'20 tok/s', latency:'4.5s TTFT', price:'$15/1M', context:'200k' } },
  { id:'gpt-4o-mini',       label:'GPT-4o mini',       vendor:'OpenAI',
    scores:{ intel:72, code:68, math:65, speed:88, latency:86, price:96, context:75 },
    raw:{ intel:'72.0', code:'68.0', math:'65.0', speed:'150 tok/s', latency:'0.6s TTFT', price:'$0.15/1M', context:'128k' } },
  { id:'o3',                label:'o3',                vendor:'OpenAI',
    scores:{ intel:92, code:88, math:95, speed:18, latency:28, price:20, context:78 },
    raw:{ intel:'92.0', code:'88.0', math:'95.0', speed:'15 tok/s', latency:'8s TTFT', price:'$30/1M', context:'200k' } },
  { id:'o1',                label:'o1',                vendor:'OpenAI',
    scores:{ intel:88, code:84, math:92, speed:22, latency:32, price:28, context:75 },
    raw:{ intel:'88.0', code:'84.0', math:'92.0', speed:'18 tok/s', latency:'6s TTFT', price:'$15/1M', context:'128k' } },
  { id:'gemini-2-0-flash',  label:'Gemini 2.0 Flash',  vendor:'Google',
    scores:{ intel:76, code:74, math:72, speed:92, latency:94, price:94, context:95 },
    raw:{ intel:'76.0', code:'74.0', math:'72.0', speed:'200 tok/s', latency:'0.4s TTFT', price:'$0.1/1M', context:'1M' } },
  { id:'gemini-1-5-pro',    label:'Gemini 1.5 Pro',    vendor:'Google',
    scores:{ intel:80, code:76, math:74, speed:78, latency:74, price:78, context:100 },
    raw:{ intel:'80.0', code:'76.0', math:'74.0', speed:'90 tok/s', latency:'1.6s TTFT', price:'$3.5/1M', context:'2M' } },
  { id:'llama-3-3-70b',     label:'Llama 3.3 70B',     vendor:'Meta',
    scores:{ intel:70, code:64, math:62, speed:92, latency:90, price:98, context:65 },
    raw:{ intel:'70.0', code:'64.0', math:'62.0', speed:'160 tok/s', latency:'0.6s TTFT', price:'$0.2/1M', context:'128k' } },
  { id:'llama-4-scout',     label:'Llama 4 Scout',     vendor:'Meta',
    scores:{ intel:68, code:62, math:58, speed:96, latency:95, price:99, context:88 },
    raw:{ intel:'68.0', code:'62.0', math:'58.0', speed:'200 tok/s', latency:'0.3s TTFT', price:'$0.1/1M', context:'512k' } },
  { id:'deepseek-r1',       label:'DeepSeek R1',       vendor:'DeepSeek',
    scores:{ intel:84, code:82, math:88, speed:72, latency:70, price:96, context:70 },
    raw:{ intel:'84.0', code:'82.0', math:'88.0', speed:'80 tok/s', latency:'2.0s TTFT', price:'$0.5/1M', context:'128k' } },
  { id:'mistral-small',     label:'Mistral Small 3',   vendor:'Mistral',
    scores:{ intel:66, code:60, math:58, speed:86, latency:84, price:94, context:68 },
    raw:{ intel:'66.0', code:'60.0', math:'58.0', speed:'130 tok/s', latency:'1.0s TTFT', price:'$0.1/1M', context:'128k' } },
  { id:'qwen-2-5-72b',      label:'Qwen 2.5 72B',      vendor:'Alibaba',
    scores:{ intel:76, code:74, math:76, speed:82, latency:80, price:96, context:72 },
    raw:{ intel:'76.0', code:'74.0', math:'76.0', speed:'100 tok/s', latency:'1.2s TTFT', price:'$0.3/1M', context:'128k' } },
];

const METRICS = [
  { key:'intel',   label:'Intel Index',  note:'General reasoning & logic',
    desc:'Think of this as the AI\'s overall "street smarts." It measures how well the model reasons through everyday problems, follows complex instructions, and connects ideas — the same way you\'d rate a person on general common sense and problem-solving.' },
  { key:'code',    label:'Code Index',   note:'Code generation & debugging',
    desc:'This measures how well the AI can write and fix computer code. Even if you\'ve never coded, think of it like asking someone to write a detailed recipe from scratch and then proofread it for mistakes. Higher means fewer bugs and better programs.' },
  { key:'math',    label:'Math Index',   note:'Mathematical reasoning',
    desc:'This tests the AI on math problems ranging from basic arithmetic to difficult competition-level questions. A high score means the model can reliably crunch numbers and work through multi-step equations without making mistakes.' },
  { key:'speed',   label:'Output Speed', note:'Higher = faster (tok/s)',
    desc:'This is how fast the AI types its answer — measured in words per second (technically "tokens," which are roughly ¾ of a word). A higher score means the response appears on your screen faster, like the difference between a slow typist and a fast one.' },
  { key:'latency', label:'Latency',      note:'Higher = lower wait time',
    desc:'Latency is the pause before the AI starts responding after you hit send — like the moment before someone begins speaking after you ask a question. A higher score here means a shorter wait. Low latency feels instant; high latency feels sluggish.' },
  { key:'price',   label:'Value',        note:'Higher = cheaper per 1M tokens',
    desc:'This shows how cost-efficient the model is. The AI charges per chunk of text processed — a higher score means you get more for your money. Think of it like comparing price-per-ounce at the grocery store: higher value = better deal.' },
  { key:'context', label:'Context',      note:'Higher = longer memory',
    desc:'Context is the AI\'s "short-term memory" for a single conversation. It determines how much text — your messages, uploaded documents, chat history — the model can hold in mind at once. A higher score means it can remember a longer conversation without forgetting earlier details.' },
];

const COLOR_A = '#FF7A59';
const COLOR_B = '#5B8CFF';

const Eyebrow = ({ children, style }) => (
  <div style={{ fontSize:12, color:'var(--fg-3)', letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:500, ...style }}>{children}</div>
);

const Mark = () => (
  <span style={{ display:'inline-flex', alignItems:'center', gap:10 }}>
    <span style={{ width:18, height:18, borderRadius:999, background:'var(--gradient-accent)' }}/>
    <span style={{ fontWeight:500, letterSpacing:'-0.01em', color:'var(--fg-1)'}}>Comparison Project</span>
  </span>
);

const ModelSelect = ({ value, onChange, exclude, slot, accent }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [pos, setPos] = useState({ top:0, left:0, width:0 });
  const selected = MODELS.find(m => m.id === value);
  const inputRef = useRef(null);
  const triggerRef = useRef(null);
  const dropRef = useRef(null);

  const filtered = MODELS.filter(m =>
    m.id !== exclude &&
    (m.label.toLowerCase().includes(query.toLowerCase()) ||
     m.vendor.toLowerCase().includes(query.toLowerCase()))
  );

  const openDropdown = () => {
    const r = triggerRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 6, left: r.left, width: r.width });
    setOpen(true);
  };

  useEffect(() => {
    const close = e => {
      const inTrigger = triggerRef.current && triggerRef.current.contains(e.target);
      const inDrop    = dropRef.current    && dropRef.current.contains(e.target);
      if (!inTrigger && !inDrop) { setOpen(false); setQuery(''); }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  return (
    <div style={{ position:'relative' }}>
      <Eyebrow>Model {slot}</Eyebrow>
      <button ref={triggerRef} onClick={() => open ? (setOpen(false), setQuery('')) : openDropdown()} style={{
        marginTop:10, width:'100%', padding:'18px 22px', textAlign:'left',
        background:'var(--bg-1)', border:'1px solid var(--border-1)',
        borderRadius:'var(--r-md)', cursor:'pointer', fontFamily:'inherit',
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:12,
        transition:'all var(--dur-fast) var(--ease-out)',
      }}>
        <span style={{ display:'flex', alignItems:'center', gap:14 }}>
          <span style={{ width:12, height:12, borderRadius:999, background:accent, flexShrink:0 }}/>
          <span>
            <div style={{ fontSize:17, fontWeight:500, color:'var(--fg-1)', letterSpacing:'-0.01em' }}>{selected.label}</div>
            <div style={{ fontSize:12, color:'var(--fg-3)', marginTop:2 }}>{selected.vendor}</div>
          </span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color:'var(--fg-3)', transform: open?'rotate(180deg)':'none', transition:'transform var(--dur-fast)' }}>
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div ref={dropRef} style={{
          position:'fixed', top:pos.top, left:pos.left, width:pos.width, zIndex:9999,
          background:'var(--bg-1)', border:'1px solid var(--border-1)',
          borderRadius:'var(--r-md)', boxShadow:'var(--shadow-3)',
          display:'flex', flexDirection:'column', maxHeight:'min(320px, 55vh)',
        }}>
          <div style={{ padding:'10px 12px', borderBottom:'1px solid var(--border-1)', flexShrink:0 }}>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search models…"
              style={{
                width:'100%', padding:'8px 12px', fontFamily:'inherit', fontSize:14,
                background:'var(--bg-2)', border:'1px solid var(--border-1)',
                borderRadius:'var(--r-sm)', color:'var(--fg-1)', outline:'none',
                boxSizing:'border-box',
              }}
            />
          </div>
          <div style={{ overflowY:'auto', flex:1 }}>
            {filtered.length === 0 && (
              <div style={{ padding:'16px 18px', fontSize:13, color:'var(--fg-3)' }}>No models match.</div>
            )}
            {filtered.map(m => (
              <button key={m.id} onClick={() => { onChange(m.id); setOpen(false); setQuery(''); }} style={{
                width:'100%', textAlign:'left', padding:'12px 18px', background:'transparent',
                border:0, cursor:'pointer', fontFamily:'inherit',
                borderBottom:'1px solid var(--border-1)',
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}
              onMouseEnter={e => e.currentTarget.style.background='var(--bg-2)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <span style={{ fontSize:15, color:'var(--fg-1)' }}>{m.label}</span>
                <span style={{ fontSize:11, color:'var(--fg-3)', fontFamily:'var(--font-mono)' }}>{m.vendor}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Bar = ({ value, color, delay, isWinner, raw, playKey, active }) => {
  const [hover, setHover] = useState(false);
  const scale = value / 100;
  return (
    <div style={{ position:'relative', height:14, background:'var(--bg-2)', borderRadius:999, overflow:'visible' }}
         onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {active && (
        <div
          key={`bar-${playKey}`}
          className="bar-fill"
          style={{
            background: color,
            boxShadow: hover ? `0 0 0 3px ${color}22` : 'none',
            '--bar-scale': scale,
            '--bar-delay': `${delay}ms`,
          }}
        />
      )}
      {active && isWinner && (
        <span
          key={`win-${playKey}`}
          className="bar-winner"
          style={{
            position:'absolute', top:-1, left:`calc(${value}% - 8px)`,
            width:16, height:16, borderRadius:999, background:'var(--paper)',
            border:`2px solid ${color}`, display:'flex', alignItems:'center', justifyContent:'center',
            '--winner-delay': `${delay+800}ms`,
          }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </span>
      )}
      {active && hover && (
        <div style={{
          position:'absolute', bottom:'calc(100% + 8px)', left:`${Math.min(value, 92)}%`,
          transform:'translateX(-50%)', background:'var(--ink)', color:'var(--paper)',
          padding:'6px 10px', borderRadius:'var(--r-sm)', fontSize:12, fontFamily:'var(--font-mono)',
          whiteSpace:'nowrap', pointerEvents:'none',
        }}>{raw}</div>
      )}
    </div>
  );
};

const BarChart = ({ a, b, playKey, active }) => {
  const [openMetric, setOpenMetric] = useState(null);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
      {METRICS.map((m,i) => {
        const va = a.scores[m.key], vb = b.scores[m.key];
        const winner = va===vb ? null : (va > vb ? 'a' : 'b');
        const isOpen = openMetric === m.key;
        return (
          <div key={m.key}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <button
                  onClick={() => setOpenMetric(isOpen ? null : m.key)}
                  style={{ background:'none', border:'none', padding:0, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:8 }}
                >
                  <span style={{ fontSize:14, fontWeight:500, color:'var(--fg-1)', letterSpacing:'-0.01em',
                    borderBottom: isOpen ? '1px solid var(--fg-3)' : '1px solid transparent',
                    transition:'border-color var(--dur-fast)',
                  }}>{m.label}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ color:'var(--fg-4)', transform: isOpen ? 'rotate(180deg)' : 'none', transition:'transform var(--dur-fast)', flexShrink:0 }}>
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                <span style={{ fontSize:12, color:'var(--fg-3)' }}>{m.note}</span>
              </div>
              <div className="bar-raw" style={{ fontFamily:'var(--font-mono)', fontSize:11, color: active ? 'var(--fg-3)' : 'var(--fg-4)' }}>
                {active ? `${a.raw[m.key]} · ${b.raw[m.key]}` : '— · —'}
              </div>
            </div>
            {isOpen && (
              <div style={{
                margin:'0 0 12px', padding:'14px 16px',
                background:'var(--bg-2)', borderRadius:'var(--r-sm)',
                borderLeft:'2px solid var(--border-1)',
                fontSize:13, color:'var(--fg-2)', lineHeight:1.7,
              }}>
                {m.desc}
              </div>
            )}
            <Bar value={va} color={COLOR_A} playKey={playKey} delay={i*90}       isWinner={winner==='a'} raw={a.raw[m.key]} active={active} />
            <div style={{ height:6 }}/>
            <Bar value={vb} color={COLOR_B} playKey={playKey} delay={i*90 + 45} isWinner={winner==='b'} raw={b.raw[m.key]} active={active} />
          </div>
        );
      })}
    </div>
  );
};

const RadarChart = ({ a, b, playKey, active }) => {
  const size = 440, cx = size/2, cy = size/2, r = 160;
  const n = METRICS.length;
  const rings = [0.25, 0.5, 0.75, 1.0];

  const point = (i, val) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI/2;
    const rr = r * (val/100);
    return [cx + Math.cos(angle)*rr, cy + Math.sin(angle)*rr];
  };
  const polyPath = (m) => METRICS.map((mm,i) => point(i, m.scores[mm.key])).map(([x,y],i)=> `${i===0?'M':'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + ' Z';

  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    if (!active) { setDrawn(false); return; }
    setDrawn(false);
    const t = setTimeout(() => setDrawn(true), METRICS.length * 90 + 400);
    return () => clearTimeout(t);
  }, [playKey, active]);

  const [hoverIdx, setHoverIdx] = useState(null);

  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} style={{ overflow:'visible' }}>
      {rings.map((rr,i) => (
        <circle key={i} cx={cx} cy={cy} r={r*rr} fill="none"
                stroke="var(--border-1)" strokeWidth={i===rings.length-1?1.2:1}
                strokeDasharray={i===rings.length-1?'':'2 4'} />
      ))}
      {METRICS.map((m,i) => {
        const [x,y] = point(i, 100);
        return <line key={m.key} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border-1)" strokeWidth="1" />;
      })}
      {METRICS.map((m,i) => {
        const [x,y] = point(i, 122);
        const angle = (Math.PI * 2 * i) / n - Math.PI/2;
        const anchor = Math.abs(Math.cos(angle)) < 0.3 ? 'middle' : (Math.cos(angle) > 0 ? 'start' : 'end');
        return (
          <g key={m.key}
             onMouseEnter={()=>setHoverIdx(i)} onMouseLeave={()=>setHoverIdx(null)}
             style={{cursor:'default'}}>
            <text x={x} y={y} textAnchor={anchor} dominantBaseline="middle"
                  fontSize="12" fontWeight="500" fill={hoverIdx===i?'var(--fg-1)':'var(--fg-2)'}
                  style={{fontFamily:'var(--font-sans)', letterSpacing:'-0.01em', transition:'fill var(--dur-fast)'}}>
              {m.label}
            </text>
          </g>
        );
      })}
      <g style={{ opacity: drawn?1:0, transition:'opacity 600ms var(--ease-out)' }}>
        <path d={polyPath(b)} fill={COLOR_B} fillOpacity="0.18" stroke={COLOR_B} strokeWidth="2"
              style={{ transform: drawn?'scale(1)':'scale(0.4)', transformOrigin:`${cx}px ${cy}px`,
                       transition:'transform 700ms var(--ease-out) 80ms' }}/>
        {METRICS.map((m,i) => {
          const [x,y] = point(i, b.scores[m.key]);
          return <circle key={'b'+i} cx={x} cy={y} r={hoverIdx===i?5:3.5} fill="var(--paper)" stroke={COLOR_B} strokeWidth="2" style={{transition:'r var(--dur-fast)'}}/>;
        })}
        <path d={polyPath(a)} fill={COLOR_A} fillOpacity="0.22" stroke={COLOR_A} strokeWidth="2"
              style={{ transform: drawn?'scale(1)':'scale(0.4)', transformOrigin:`${cx}px ${cy}px`,
                       transition:'transform 700ms var(--ease-out)' }}/>
        {METRICS.map((m,i) => {
          const [x,y] = point(i, a.scores[m.key]);
          return <circle key={'a'+i} cx={x} cy={y} r={hoverIdx===i?5:3.5} fill="var(--paper)" stroke={COLOR_A} strokeWidth="2" style={{transition:'r var(--dur-fast)'}}/>;
        })}
      </g>
      {rings.map((rr,i) => (
        <text key={'rl'+i} x={cx+4} y={cy - r*rr - 2} fontSize="9" fill="var(--fg-3)"
              fontFamily="var(--font-mono)">{Math.round(rr*100)}</text>
      ))}
    </svg>
  );
};

const Legend = ({ a, b, leadsA, leadsB, active }) => {
  const [openPanel, setOpenPanel] = useState(null);
  const toggle = which => setOpenPanel(p => p === which ? null : which);
  const panelStyle = {
    position:'absolute', top:'calc(100% + 10px)', right:0, zIndex:30,
    background:'var(--bg-1)', border:'1px solid var(--border-1)',
    borderRadius:'var(--r-md)', boxShadow:'var(--shadow-3)',
    padding:'14px 18px', minWidth:180,
  };
  return (
    <div className="legend" style={{ display:'flex', gap:32, alignItems:'center', padding:'20px 24px', background:'var(--bg-2)', borderRadius:'var(--r-md)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ width:14, height:14, borderRadius:999, background:COLOR_A }}/>
        <span style={{ fontSize:14, fontWeight:500, color:'var(--fg-1)' }}>{a.label}</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ width:14, height:14, borderRadius:999, background:COLOR_B }}/>
        <span style={{ fontSize:14, fontWeight:500, color:'var(--fg-1)' }}>{b.label}</span>
      </div>
      <div style={{ flex:1 }}/>
      <div className="legend-score" style={{ fontSize:13, color:'var(--fg-3)', fontFamily:'var(--font-mono)', display:'flex', alignItems:'center', gap:6, position:'relative' }}>
        {!active ? (
          <span style={{ color:'var(--fg-4)' }}>Press Compare to see results</span>
        ) : (
          <>
            <span>{a.label.split(' ')[0]} leads</span>
            <span style={{ position:'relative' }}>
              <button onClick={() => toggle('a')} style={{
                fontFamily:'var(--font-mono)', fontSize:13, fontWeight:600,
                color: openPanel==='a' ? COLOR_A : 'var(--fg-1)',
                background:'transparent', border:'none', cursor:'pointer', padding:'0 2px',
                borderBottom: `1px dotted ${openPanel==='a' ? COLOR_A : 'var(--fg-3)'}`,
                transition:'color var(--dur-fast)',
              }}>{leadsA.length}</button>
              {openPanel === 'a' && (
                <div style={panelStyle}>
                  <div style={{ fontSize:11, color:'var(--fg-3)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:10 }}>{a.label} leads</div>
                  {leadsA.map(m => (
                    <div key={m.key} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'5px 0', borderBottom:'1px solid var(--border-1)' }}>
                      <span style={{ fontSize:13, color:'var(--fg-1)', fontWeight:500 }}>{m.label}</span>
                      <span style={{ fontSize:11, color:'var(--fg-3)', marginLeft:16 }}>{a.raw[m.key]}</span>
                    </div>
                  ))}
                </div>
              )}
            </span>
            <span style={{ color:'var(--fg-4)' }}>·</span>
            <span>{b.label.split(' ')[0]} leads</span>
            <span style={{ position:'relative' }}>
              <button onClick={() => toggle('b')} style={{
                fontFamily:'var(--font-mono)', fontSize:13, fontWeight:600,
                color: openPanel==='b' ? COLOR_B : 'var(--fg-1)',
                background:'transparent', border:'none', cursor:'pointer', padding:'0 2px',
                borderBottom: `1px dotted ${openPanel==='b' ? COLOR_B : 'var(--fg-3)'}`,
                transition:'color var(--dur-fast)',
              }}>{leadsB.length}</button>
              {openPanel === 'b' && (
                <div style={panelStyle}>
                  <div style={{ fontSize:11, color:'var(--fg-3)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:10 }}>{b.label} leads</div>
                  {leadsB.map(m => (
                    <div key={m.key} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'5px 0', borderBottom:'1px solid var(--border-1)' }}>
                      <span style={{ fontSize:13, color:'var(--fg-1)', fontWeight:500 }}>{m.label}</span>
                      <span style={{ fontSize:11, color:'var(--fg-3)', marginLeft:16 }}>{b.raw[m.key]}</span>
                    </div>
                  ))}
                </div>
              )}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [modelA, setModelA] = useState('claude-sonnet-4-5');
  const [modelB, setModelB] = useState('gpt-4-1');
  const [playKey, setPlayKey] = useState(0);
  const active = playKey > 0;

  const a = MODELS.find(m => m.id===modelA);
  const b = MODELS.find(m => m.id===modelB);

  const leads = useMemo(() => {
    const la = [], lb = [];
    METRICS.forEach(m => {
      if (a.scores[m.key] > b.scores[m.key]) la.push(m);
      else if (a.scores[m.key] < b.scores[m.key]) lb.push(m);
    });
    return { a: la, b: lb };
  }, [modelA, modelB]);

  const handleCompare = () => setPlayKey(k => k + 1);
  const handleModelAChange = (id) => { setModelA(id); if (active) setPlayKey(k => k + 1); };
  const handleModelBChange = (id) => { setModelB(id); if (active) setPlayKey(k => k + 1); };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-1)' }}>
      <nav className="nav" style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'22px 48px', borderBottom:'1px solid var(--border-1)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <Mark/>
          <span className="nav-byline" style={{ fontSize:12, color:'var(--fg-4)', fontFamily:'var(--font-mono)', letterSpacing:'0.02em' }}>— Engineered and Designed by Lucas Lu</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <a href="https://www.linkedin.com/in/lucas-lu6978" target="_blank" rel="noopener noreferrer"
             style={{ color:'var(--fg-3)', display:'flex', alignItems:'center', transition:'color var(--dur-fast)' }}
             onMouseEnter={e=>e.currentTarget.style.color='var(--fg-1)'}
             onMouseLeave={e=>e.currentTarget.style.color='var(--fg-3)'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a href="https://github.com/nothd7561/llm-comparison" target="_blank" rel="noopener noreferrer"
             style={{ color:'var(--fg-3)', display:'flex', alignItems:'center', transition:'color var(--dur-fast)' }}
             onMouseEnter={e=>e.currentTarget.style.color='var(--fg-1)'}
             onMouseLeave={e=>e.currentTarget.style.color='var(--fg-3)'}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
            </svg>
          </a>
        </div>
      </nav>

      <section className="section section-hero" style={{ padding:'72px 48px 40px', maxWidth:1200, margin:'0 auto' }}>
        <Eyebrow>A data-viz study · 2026</Eyebrow>
        <h1 className="hero-title" style={{ fontSize:64, fontWeight:300, letterSpacing:'-0.03em', lineHeight:1.05, marginTop:18, color:'var(--fg-1)', maxWidth:'14em' }}>
          Compare two <span className="gradient-text">language models</span>, quietly.
        </h1>
        <div style={{ marginTop:36, display:'flex', flexDirection:'column', gap:18, maxWidth:'42em' }}>
          <div className="info-row" style={{ display:'flex', alignItems:'baseline', gap:32 }}>
            <span style={{ fontSize:11, color:'var(--fg-4)', fontFamily:'var(--font-mono)', letterSpacing:'0.08em', textTransform:'uppercase', minWidth:90 }}>Benchmarks</span>
            <span style={{ fontSize:15, color:'var(--fg-2)' }}>Intel Index · Code Index · Math Index</span>
            <span className="info-source" style={{ fontSize:11, color:'var(--fg-4)', fontFamily:'var(--font-mono)', marginLeft:'auto' }}>Artificial Analysis</span>
          </div>
          <div style={{ height:1, background:'var(--border-1)' }}/>
          <div className="info-row" style={{ display:'flex', alignItems:'baseline', gap:32 }}>
            <span style={{ fontSize:11, color:'var(--fg-4)', fontFamily:'var(--font-mono)', letterSpacing:'0.08em', textTransform:'uppercase', minWidth:90 }}>Performance</span>
            <span style={{ fontSize:15, color:'var(--fg-2)' }}>Output Speed · Latency · Pricing · Context</span>
            <span className="info-source" style={{ fontSize:11, color:'var(--fg-4)', fontFamily:'var(--font-mono)', marginLeft:'auto' }}>OpenRouter</span>
          </div>
          <div style={{ height:1, background:'var(--border-1)' }}/>
          <div className="info-row" style={{ display:'flex', alignItems:'baseline', gap:32 }}>
            <span style={{ fontSize:11, color:'var(--fg-4)', fontFamily:'var(--font-mono)', letterSpacing:'0.08em', textTransform:'uppercase', minWidth:90 }}>Scale</span>
            <span style={{ fontSize:15, color:'var(--fg-2)' }}>All normalised 0–100 · Raw values on hover</span>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding:'0 48px', maxWidth:1200, margin:'0 auto' }}>
        <div className="selector-grid" style={{
          display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:24, alignItems:'flex-end',
          padding:28, background:'var(--bg-2)', borderRadius:'var(--r-lg)',
        }}>
          <ModelSelect value={modelA} onChange={handleModelAChange} exclude={modelB} slot="A" accent={COLOR_A}/>
          <ModelSelect value={modelB} onChange={handleModelBChange} exclude={modelA} slot="B" accent={COLOR_B}/>
          <button onClick={handleCompare} style={{
            padding:'18px 28px', background:'var(--gradient-accent)', color:'#fff',
            border:0, borderRadius:999, fontFamily:'inherit', fontSize:15, fontWeight:500,
            cursor:'pointer', letterSpacing:'-0.01em', boxShadow:'var(--shadow-1)',
            transition:'all var(--dur-med) var(--ease-out)', whiteSpace:'nowrap',
          }}
          onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--shadow-glow)'; e.currentTarget.style.transform='translateY(-1px)';}}
          onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--shadow-1)'; e.currentTarget.style.transform='none';}}>
            Compare →
          </button>
        </div>
      </section>

      <section className="section" style={{ padding:'32px 48px 0', maxWidth:1200, margin:'0 auto' }}>
        <Legend a={a} b={b} leadsA={leads.a} leadsB={leads.b} active={active}/>
      </section>

      <section className="section charts-grid" style={{ padding:'40px 48px 96px', maxWidth:1200, margin:'0 auto',
                        display:'grid', gridTemplateColumns:'1.25fr 1fr', gap:64, alignItems:'flex-start' }}>
        <div>
          <Eyebrow>Benchmarks · normalised 0–100 · raw on hover</Eyebrow>
          <div style={{ marginTop:28 }}>
            <BarChart a={a} b={b} playKey={playKey} active={active}/>
          </div>
        </div>
        <div className="radar-col" style={{ position:'sticky', top:32 }}>
          <Eyebrow>Radar · shape at a glance</Eyebrow>
          <div style={{ marginTop:16 }}>
            <RadarChart a={a} b={b} playKey={playKey} active={active}/>
          </div>
          <p style={{ fontSize:13, color:'var(--fg-3)', lineHeight:1.6, marginTop:20, maxWidth:'30em' }}>
            The radar shows the overall <em>shape</em> of each model&rsquo;s strengths. A model that&rsquo;s great everywhere fills the circle; specialists look spiky.
          </p>
        </div>
      </section>

      <footer className="footer section" style={{
        padding:'32px 48px', borderTop:'1px solid var(--border-1)',
        display:'flex', justifyContent:'space-between', fontSize:13, color:'var(--fg-3)',
      }}>
        <span>© 2026 — A Quiet Portfolio</span>
        <span style={{ fontFamily:'var(--font-mono)' }}>Data: <a href="https://openrouter.ai" style={{color:'inherit'}}>OpenRouter</a> · <a href="https://artificialanalysis.ai" style={{color:'inherit'}}>Artificial Analysis</a></span>
      </footer>
    </div>
  );
};

Object.assign(window, { App });
