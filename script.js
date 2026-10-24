document.getElementById('year').textContent=new Date().getFullYear();
const statusEl=document.querySelector('#status'),grid=document.querySelector('#projects-grid');
const pinned=new Set(['Online_C-compiler','nids-robustness-study']);
fetch('https://api.github.com/users/Jithendra54/repos?type=owner&sort=updated&per_page=100')
.then(r=>{if(!r.ok)throw Error('GitHub API unavailable');return r.json()})
.then(repos=>{const selected=repos.filter(r=>!r.fork&&!r.archived).sort((a,b)=>(Number(pinned.has(b.name))-Number(pinned.has(a.name)))||new Date(b.pushed_at)-new Date(a.pushed_at)).slice(0,6);
if(!selected.length)throw Error('No public projects');grid.innerHTML=selected.map(r=>'<article class="card"><div class="label">'+escapeHtml(r.language||'Project')+(r.stargazers_count?' · ★ '+r.stargazers_count:'')+'</div><h3>'+escapeHtml(r.name.replace(/[-_]/g,' '))+'</h3><p>'+escapeHtml(r.description||'Project repository. Open GitHub for source code and details.')+'</p><div class="meta">'+((r.topics||[]).slice(0,3).length?(r.topics||[]).slice(0,3):[r.language||'Project']).map(t=>'<span>'+escapeHtml(t)+'</span>').join('')+'</div><p style="margin:18px 0 0"><a href="'+safeUrl(r.html_url)+'" target="_blank" rel="noreferrer">View repository ↗</a></p></article>').join('');statusEl.textContent='Live from GitHub · '+selected.length+' public projects shown.'})
.catch(()=>{statusEl.textContent='Showing selected projects. Visit GitHub for the latest repositories.'});
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function safeUrl(v){try{const u=new URL(v);return u.hostname==='github.com'?u.href:'https://github.com/Jithendra54'}catch{return 'https://github.com/Jithendra54'}}