/* ============================================================
   PQA Docs — Navbar Component
   Plugin QA v3.0 · JM Agentic Development Kit
   ============================================================ */
(function () {
  const pages = [
    { label: 'Home',      href: 'index.html' },
    { label: 'Quickstart', href: 'quickstart.html' },
    { label: 'Prompts',   href: 'prompts.html' },
    { label: 'Skills',    href: 'skills.html' },
    { label: 'Workflow',  href: 'workflow.html' }
  ];

  const current = location.pathname.split('/').pop() || 'index.html';

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Main navigation');
  nav.style.cssText = `
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.75rem 2rem;
    background: rgba(2,6,23,0.85);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    font-family: 'Poppins', sans-serif;
  `;

  const brand = document.createElement('a');
  brand.href = 'index.html';
  brand.innerHTML = `<span style="font-weight:800;color:#FFD700;font-size:1.15rem;">PQA</span>
    <span style="color:#94A3B8;font-size:0.85rem;margin-left:0.5rem;">Plugin QA v3.0</span>`;
  brand.style.cssText = 'display:flex;align-items:center;text-decoration:none;';

  const ul = document.createElement('ul');
  ul.style.cssText = 'display:flex;gap:0.25rem;list-style:none;align-items:center;';

  pages.forEach(function (p) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = p.href;
    a.textContent = p.label;
    const isActive = current === p.href;
    a.style.cssText = `
      padding: 0.4rem 0.85rem; border-radius: 8px; font-size: 0.875rem;
      font-weight: ${isActive ? '700' : '500'};
      color: ${isActive ? '#FFD700' : '#94A3B8'};
      background: ${isActive ? 'rgba(255,215,0,0.1)' : 'transparent'};
      transition: all 0.2s ease; text-decoration: none;
    `;
    a.onmouseenter = function () { if (!isActive) { a.style.color = '#E2E8F0'; a.style.background = 'rgba(255,255,255,0.04)'; } };
    a.onmouseleave = function () { if (!isActive) { a.style.color = '#94A3B8'; a.style.background = 'transparent'; } };
    li.appendChild(a);
    ul.appendChild(li);
  });

  const gh = document.createElement('a');
  gh.href = 'https://github.com/JaviMontano/jm-agentic-development-kit';
  gh.target = '_blank'; gh.rel = 'noopener';
  gh.textContent = 'GitHub';
  gh.style.cssText = 'font-size:0.8rem;color:#64748B;margin-left:1rem;text-decoration:none;';
  gh.onmouseenter = function () { gh.style.color = '#FFD700'; };
  gh.onmouseleave = function () { gh.style.color = '#64748B'; };

  nav.appendChild(brand);
  nav.appendChild(ul);
  nav.appendChild(gh);
  document.body.prepend(nav);
})();
