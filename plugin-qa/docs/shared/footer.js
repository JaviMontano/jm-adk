/* ============================================================
   PQA Docs — Footer Component
   Plugin QA v3.0 · JM Agentic Development Kit
   ============================================================ */
(function () {
  const footer = document.createElement('footer');
  footer.style.cssText = `
    margin-top: 4rem; padding: 2rem;
    border-top: 1px solid rgba(255,255,255,0.06);
    text-align: center; font-family: 'Montserrat', sans-serif;
    font-size: 0.8rem; color: #64748B;
  `;
  footer.innerHTML = `
    <p style="margin-bottom:0.35rem;">
      <span style="color:#FFD700;font-weight:700;">Plugin QA v3.0</span>
      &middot; JM Agentic Development Kit &middot; Javier Montano
    </p>
    <p>Released under the <a href="https://opensource.org/licenses/MIT"
       target="_blank" rel="noopener"
       style="color:#137DC5;text-decoration:none;">MIT License</a></p>
  `;
  document.body.appendChild(footer);
})();
