// SDD Docs — Shared Footer
(function(){
  const f=document.createElement('footer');
  f.className='docs-footer';
  f.innerHTML=`
    <div class="footer-inner">
      <p><strong>SDD v3.0</strong> · Spec Driven Development</p>
      <p class="footer-muted">by metodolog<span style="color:var(--brand-gold)">IA</span> · Javier Montano · <a href="https://github.com/JaviMontano/sdd-metodologia">GitHub</a> · <a href="https://github.com/JaviMontano/jm-agentic-development-kit">Dev Kit</a></p>
      <p class="footer-muted" style="font-size:0.7rem;margin-top:0.5rem">Upstream: <a href="https://github.com/intent-integrity-chain/kit">IIC/kit</a> (MIT) · Brand: GPL-3.0</p>
    </div>`;
  document.body.appendChild(f);

  const s=document.createElement('style');
  s.textContent=`
    .docs-footer{background:var(--brand-navy);border-top:4px solid var(--brand-gold);padding:2rem 1.5rem;margin-top:4rem;text-align:center}
    .footer-inner{max-width:1200px;margin:0 auto}
    .footer-inner p{margin:0.25rem 0}
    .footer-muted{color:var(--text-muted);font-size:0.8rem}
    .footer-muted a{color:var(--brand-gold)}`;
  document.head.appendChild(s);
})();
