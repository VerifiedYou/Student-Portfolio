const K='vy_ach2',U='vy_user';
function all(){try{const v=JSON.parse(localStorage.getItem(K));if(v)return v}catch(e){}return[]}
function save(a){try{localStorage.setItem(K,JSON.stringify(a))}catch(e){}}
function user(){try{return JSON.parse(localStorage.getItem(U))||{}}catch(e){return{}}}
function setUser(o){try{localStorage.setItem(U,JSON.stringify(Object.assign(user(),o)))}catch(e){alert('Could not save. Your browser storage may be full or blocked.')}}
function role(){try{return localStorage.getItem('vy_role')||'student'}catch(e){return'student'}}
function staff(){try{return JSON.parse(localStorage.getItem('vy_staff'))||{}}catch(e){return{}}}
function me(){return role()==='student'?user():staff()}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function fmt(d){const x=new Date(d);return isNaN(x)?'':x.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
function ago(t){const m=(Date.now()-t)/6e4;return m<2?'Just now':m<60?Math.floor(m)+' min ago':m<1440?Math.floor(m/60)+' h ago':Math.floor(m/1440)+' d ago'}
function badge(a){return a.s==='verified'?'<span class="b ok">✔ Verified</span>':a.s==='pending'?'<span class="b wait">Pending</span>':'<span class="b no">Rejected</span>'}
function initials(n){return n.split(' ').filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase()}
function meta(a){return esc(a.c)+' · '+(a.s==='verified'&&a.by?'Verified by '+esc(a.by)+' · ':'')+fmt(a.d)}
const P={dash:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
award:'<circle cx="12" cy="9" r="6"/><path d="M9 14l-2 7 5-3 5 3-2-7"/>',
doc:'<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
check:'<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
bell:'<path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8M10 21h4"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
x:'<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
send:'<path d="M21 3L3 11l7 3 3 7z"/><path d="M10 14l11-11"/>',
share:'<circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 11l6-4M9 13l6 4"/>',
chev:'<path d="M9 6l6 6-6 6"/>',
shield:'<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>'};
function ico(n){return '<svg class="i" viewBox="0 0 24 24">'+P[n]+'</svg>'}
function paint(e){const u=me();if(u.photo){e.style.backgroundImage='url('+u.photo+')';e.textContent=''}else{e.style.backgroundImage='';e.textContent=u.name?initials(u.name):'?'}}
function readPhoto(file,cb){const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=c.height=240;const s=Math.min(im.width,im.height);c.getContext('2d').drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,240,240);cb(c.toDataURL('image/jpeg',.85))};im.src=r.result};r.readAsDataURL(file)}
function strength(){const u=user(),a=all(),v=a.filter(x=>x.s==='verified').length,p=a.filter(x=>x.s==='pending').length;
  const f=[u.name,u.program,u.inst,u.year,u.about,u.interests,u.photo].filter(Boolean).length;
  const pct=Math.min(100,f*6+Math.min(v,5)*10+Math.min(p,3)*2);
  const tip=!u.photo?'Add a profile photo to help employers recognise you.':(!u.about||!u.program)?'Complete your profile details.':!a.length?'Add your first achievement.':!v?'Get one achievement verified to build trust.':'Keep adding achievements and projects.';
  return{pct,tip}}
function shell(active){
  const r=role();
  const links=r==='lecturer'?[['institution.html','Review requests','check']]:r==='employer'?[['employer.html','Find candidates','user'],['employer.html#shortlist','Shortlist','award'],['employer-settings.html','Settings','gear']]:[['dashboard.html','Dashboard','dash'],['profile.html','My Profile','user'],['achievements.html','Achievements','award'],['documents.html','Documents','doc'],['requests.html','Verification Requests','check'],['settings.html','Settings','gear']];
  const u=me(),pend=all().filter(x=>x.s==='pending').length;
  if(!document.getElementById('top')){const h=document.createElement('header');h.id='top';h.className='topbar';document.body.prepend(h)}
  document.getElementById('top').innerHTML='<a href="index.html" class="logo"><i>'+ico('shield')+'</i>VerifiedYou</a><div class="tr">'+(r==='employer'?'':'<a class="bell" href="'+(r==='lecturer'?'institution.html':'requests.html')+'" aria-label="Verification requests">'+ico('bell')+(pend?'<s></s>':'')+'</a>')+'<a class="me" href="'+(r==='student'?'profile.html':'#')+'"><span><b>'+esc(u.name||'Add your name')+'</b><small>'+({lecturer:'Lecturer / Institution',employer:'Employer'}[r]||'Student')+'</small></span><span class="av js-av"></span></a></div>';
  const s=document.getElementById('side');s.className='side';
  s.innerHTML=links.map(l=>'<a class="nav'+(l[0]===active?' on':'')+'" href="'+l[0]+'">'+ico(l[2])+l[1]+'</a>').join('')+
   '<div class="help"><b>Need help?</b>Visit the student help centre or chat with support.</div><a class="nav out" href="index.html">Log out</a>';
  document.querySelectorAll('.js-av').forEach(paint);
  document.querySelectorAll('.js-name').forEach(e=>e.textContent=u.name||'Add your name');
}
function listHTML(r,empty){return r.map(x=>'<div class="item">'+badge(x)+'<h3>'+esc(x.t)+'</h3><p>'+esc(x.n||'')+'</p>'+(x.rc?'<p style="color:var(--red);margin-top:6px"><small>Reviewer comment: '+esc(x.rc)+'</small></p>':'')+(x.vc?'<p style="color:var(--green);margin-top:6px"><small>Reviewer comment: '+esc(x.vc)+'</small></p>':'')+'<p style="margin-top:6px"><small>'+meta(x)+'</small></p></div>').join('')||'<p class="sub">'+empty+'</p>'}
