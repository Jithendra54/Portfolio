document.getElementById('year').textContent=new Date().getFullYear();
const statusEl=document.querySelector('#status'),grid=document.querySelector('#projects-grid');
const pinned=new Set(['Online_C-compiler','nids-robustness-study']);
const featured={
 'Online_C-compiler':{title:'C Forge — Online C Compiler',category:'Web application · React / JavaScript',description:'A browser-based workspace for writing C programs, compiling them, and inspecting program output. The repository contains the source code for the project.',features:[['Code in browser','Write C programs in a dedicated editor.'],['Compile & run','Execute supported programs and inspect results.'],['Readable output','Review compiler messages and program output.']],demo:'https://jithendra54.github.io/Online_C-compiler/',repo:'https://github.com/Jithendra54/Online_C-compiler',live:true},
 'nids-robustness-study':{title:'Network Intrusion Detection Robustness',category:'Cybersecurity research · Python / machine learning',description:'An offline research project exploring feature-space robustness of supervised network intrusion classifiers using the UNSW-NB15 dataset. The repository documents experimental design, limitations, and preliminary results.',features:[['Model evaluation','Compare baseline intrusion-detection classifiers.'],['Robustness study','Test a constrained feature-space evasion scenario offline.'],['Reproducible workflow','Review configuration, evaluation scripts, and recorded results.']],repo:'https://github.com/Jithendra54/nids-robustness-study',live:false}
};
function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function safeRepoUrl(v){try{const u=new URL(v);return u.hostname==='github.com'?u.href:'https://github.com/Jithendra54'}catch{return 'https://github.com/Jithendra54'}}
function card(repo){const info=featured[repo.name];const topics=(repo.topics||[]).slice(0,3);const tags=topics.length?topics:[repo.language||'Project'];const title=info?info.title:repo.name.replace(/[-_]/g,' ');const desc=info?info.description:(repo.description||'Project repository. Open the project preview to learn more, or inspect the source code.');return '<article class="card"><div class="label">'+esc(repo.language||'Project')+(repo.stargazers_count?' · ★ '+repo.stargazers_count:'')+'</div><h3>'+esc(title)+'</h3><p>'+esc(desc)+'</p><div class="meta">'+tags.map(t=>'<span>'+esc(t)+'</span>').join('')+'</div><div class="project-actions"><button class="button project-preview-btn" type="button" data-preview="'+esc(repo.name)+'">Explore project ↗</button><a class="button" href="'+safeRepoUrl(repo.html_url)+'" target="_blank" rel="noreferrer">Source code</a></div></article>'}
function openPreview(name,repo){const info=featured[name]||{title:repo.name.replace(/[-_]/g,' '),category:(repo.language||'Project')+' · GitHub repository',description:repo.description||'Explore this project repository and its source files.',features:[['Source code','Browse the implementation and project structure.'],['Documentation','Read the README and setup instructions.'],['Project activity','Review commits and repository updates.']],repo:safeRepoUrl(repo.html_url),live:false};const modal=document.querySelector('#preview-modal'),content=document.querySelector('#preview-content');document.querySelector('#preview-title')?.removeAttribute('id');document.querySelector('.preview-window').setAttribute('aria-labelledby','preview-title');document.querySelector('#preview-url').textContent=info.live?'Live demo preview': 'Project overview';
content.className='preview-content';content.innerHTML='<div class="label">'+esc(info.category)+'</div><h3 id="preview-title">'+esc(info.title)+'</h3><p>'+esc(info.description)+'</p><div class="preview-feature-grid">'+info.features.map(f=>'<div class="preview-feature"><strong>'+esc(f[0])+'</strong><span>'+esc(f[1])+'</span></div>').join('')+'</div><div class="buttons"><a class="button primary" href="'+info.repo+'" target="_blank" rel="noreferrer">Open source repository ↗</a>'+(info.live?'<button class="button" id="load-demo" type="button">Try embedded live demo ↓</button>':'')+'</div><div id="demo-slot"></div>';
modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');modal.querySelector('[data-close-preview]').focus?.();const load=document.querySelector('#load-demo');if(load)load.addEventListener('click',()=>{const slot=document.querySelector('#demo-slot');slot.innerHTML='<div class="preview-live"><p class="live-notice">Attempting to load the hosted demo. If embedding is blocked or the page is unavailable, open the project repository for source and setup instructions.</p><iframe title="C Forge live demo" src="'+info.demo+'" loading="lazy" referrerpolicy="no-referrer"></iframe><div class="frame-fallback">If the preview does not load, <a href="'+info.demo+'" target="_blank" rel="noreferrer">open the demo in a new tab ↗</a>.</div></div>';load.disabled=true;load.textContent='Demo loaded below';})}
function closePreview(){const m=document.querySelector('#preview-modal');m.classList.remove('is-open');m.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')}
document.addEventListener('click',e=>{const b=e.target.closest('[data-preview]');if(b){const repo={name:b.dataset.preview,html_url:'https://github.com/Jithendra54/'+b.dataset.preview,language:'Project'};openPreview(b.dataset.preview,repo)}if(e.target.closest('[data-close-preview]'))closePreview()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePreview()});
fetch('https://api.github.com/users/Jithendra54/repos?type=owner&sort=updated&per_page=100').then(r=>{if(!r.ok)throw Error('GitHub API unavailable');return r.json()}).then(repos=>{const selected=repos.filter(r=>!r.fork&&!r.archived).sort((a,b)=>(Number(pinned.has(b.name))-Number(pinned.has(a.name)))||new Date(b.pushed_at)-new Date(a.pushed_at)).slice(0,6);if(!selected.length)throw Error('No public projects');grid.innerHTML=selected.map(card).join('');statusEl.textContent='Live from GitHub · '+selected.length+' public projects. Use Explore project for an interactive overview.'}).catch(()=>{statusEl.textContent='Showing selected projects. Visit GitHub for the latest repositories.';grid.querySelectorAll('.card').forEach(card=>{const link=card.querySelector('a[href*="github.com"]');if(link){const m=link.href.match(/github\.com\/Jithendra54\/([^/]+)/);if(m){const btn=document.createElement('button');btn.className='button project-preview-btn';btn.type='button';btn.dataset.preview=m[1];btn.textContent='Explore project ↗';link.parentNode.insertBefore(btn,link)}}})});


/* UI polish: scroll reveals, progress indicator, tilt, magnetic hover, and back-to-top */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.getElementById('scroll-progress-bar');
  const topButton = document.getElementById('back-to-top');
  let ticking = false;
  const updateScrollUI = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const amount = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    if (progress) progress.style.width = amount + '%';
    if (topButton) topButton.classList.toggle('visible', window.scrollY > 480);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(updateScrollUI); ticking = true; }
  }, { passive: true });
  updateScrollUI();
  topButton?.addEventListener('click', () => window.scrollTo({top: 0, behavior: reduceMotion ? 'auto' : 'smooth'}));

  const revealTargets = 'section, .hero-copy, .portrait-wrap, .card, .contact-panel, .chips, .about';
  const targets = document.querySelectorAll(revealTargets);
  if ('IntersectionObserver' in window && !reduceMotion) {
    targets.forEach((el, i) => {
      el.classList.add('reveal-ready');
      if (el.matches('.card')) el.style.setProperty('--reveal-delay', (i % 4) * 65 + 'ms');
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    targets.forEach(el => observer.observe(el));
  }

  document.querySelectorAll('.card').forEach(card => {
    if (!reduceMotion) {
      card.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse' || window.innerWidth < 850) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--pointer-x', (x * 100) + '%');
        card.style.setProperty('--pointer-y', (y * 100) + '%');
      });
    }
  });

  const navLinks = [...document.querySelectorAll('.links a[href^="#"]')];
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    sections.forEach(section => navObserver.observe(section));
  }

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('pointerdown', () => el.classList.add('is-pressed'));
    ['pointerup','pointerleave','blur'].forEach(ev => el.addEventListener(ev, () => el.classList.remove('is-pressed')));
  });
})();


/* Extra micro-interactions: button ripples, card tilt, header state, and gentle pointer parallax */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  window.addEventListener('scroll', updateHeader, {passive:true});
  updateHeader();

  if (!reduced) {
    document.querySelectorAll('.button, .back-to-top').forEach(button => {
      button.addEventListener('pointerdown', event => {
        if (event.pointerType === 'touch' || event.pointerType === 'mouse') {
          const rect = button.getBoundingClientRect();
          const ripple = document.createElement('span');
          ripple.className = 'ripple';
          const size = Math.max(rect.width, rect.height) * 1.15;
          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
          ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
          button.querySelectorAll('.ripple').forEach(old => old.remove());
          button.appendChild(ripple);
          ripple.addEventListener('animationend', () => ripple.remove(), {once:true});
        }
      });
    });

    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('pointermove', event => {
        if (event.pointerType !== 'mouse' || window.innerWidth < 900) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - .5) * 3.5;
        const rotateX = (.5 - y) * 3.5;
        card.style.transform = 'perspective(900px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-4px)';
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });

    const hero = document.querySelector('.hero');
    const heroCopy = document.querySelector('.hero-copy');
    hero?.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || window.innerWidth < 900 || !heroCopy) return;
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      heroCopy.style.setProperty('--hero-x', (x * 5).toFixed(2) + 'px');
      heroCopy.style.setProperty('--hero-y', (y * 4).toFixed(2) + 'px');
      heroCopy.style.translate = (x * 2).toFixed(2) + 'px ' + (y * 2).toFixed(2) + 'px';
    });
    hero?.addEventListener('pointerleave', () => { if (heroCopy) heroCopy.style.translate = ''; });
  }
})();
