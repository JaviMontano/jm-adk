// SDD Docs — Shared Navigation
// Injected via <script src="shared/nav.js"></script>
(function(){
  const PAGES=[
    {id:'index',label:'Home',icon:'⌘'},
    {id:'quickstart',label:'Quickstart',icon:'▶'},
    {id:'prompts',label:'Prompts',icon:'💬'},
    {id:'artifacts',label:'Artifacts',icon:'📄'},
    {id:'workspace',label:'Workspace',icon:'📁'}
  ];
  const current=location.pathname.split('/').pop().replace('.html','')||'index';

  const nav=document.createElement('nav');
  nav.className='docs-nav';
  nav.innerHTML=`
    <div class="nav-inner">
      <a href="index.html" class="nav-brand">
        <span style="font-family:var(--font-heading);font-weight:900;font-size:1.25rem;color:var(--text-primary)">SDD</span>
        <span style="font-size:0.75rem;color:var(--text-muted);margin-left:6px">by metodolog<span style="color:var(--brand-gold)">IA</span></span>
      </a>
      <button class="nav-toggle" onclick="this.parentElement.classList.toggle('open')" aria-label="Menu">☰</button>
      <div class="nav-links">
        ${PAGES.map(p=>`<a href="${p.id}.html" class="nav-link ${current===p.id?'active':''}">${p.icon} ${p.label}</a>`).join('')}
        <a href="https://github.com/JaviMontano/sdd-metodologia" class="nav-link nav-gh" target="_blank">GitHub ↗</a>
      </div>
    </div>`;
  document.body.prepend(nav);

  // Inject nav styles
  const s=document.createElement('style');
  s.textContent=`
    .docs-nav{position:sticky;top:0;z-index:100;background:rgba(2,6,23,0.85);backdrop-filter:blur(16px) saturate(180%);border-bottom:1px solid rgba(255,255,255,0.05);padding:0 1.5rem}
    .nav-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;height:56px;gap:1rem}
    .nav-brand{display:flex;align-items:baseline;text-decoration:none;gap:0;flex-shrink:0}
    .nav-links{display:flex;gap:0.25rem;margin-left:auto;align-items:center}
    .nav-link{padding:0.5rem 0.75rem;border-radius:8px;font-size:0.85rem;color:var(--text-muted);text-decoration:none;font-family:var(--font-body);transition:all 0.2s;white-space:nowrap}
    .nav-link:hover{color:var(--text-primary);background:rgba(255,255,255,0.04)}
    .nav-link.active{color:var(--brand-gold);border-bottom:2px solid var(--brand-gold)}
    .nav-gh{color:var(--brand-blue)!important}
    .nav-toggle{display:none;background:none;border:none;color:var(--text-primary);font-size:1.5rem;cursor:pointer}
    @media(max-width:768px){
      .nav-toggle{display:block}
      .nav-links{display:none;flex-direction:column;position:absolute;top:56px;left:0;right:0;background:var(--bg-surface);padding:1rem;border-bottom:1px solid var(--border-subtle)}
      .nav-inner.open .nav-links{display:flex}
    }`;
  document.head.appendChild(s);
})();
