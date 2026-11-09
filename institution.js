// Uses the same saved data as the student pages (all(), save(), user(), staff() come from app.js).
// When a student submits an achievement it shows up here; approving or rejecting updates what the student sees.
var filter="all",sel=null,$=function(i){return document.getElementById(i)};
function label(s){return s.charAt(0).toUpperCase()+s.slice(1)}
// The student pages call a verified record "verified"; this page calls it "approved".
function st(x){return x.s=="verified"?"approved":x.s}
function rows(){
  var u=user();
  return all().map(function(x,i){
    return {i:i,t:x.t,c:x.c,n:x.n||"",f:x.f||"",status:st(x),note:x.rc||x.vc||"",
      date:x.at?fmt(x.at):fmt(x.d),student:u.name||"Student (name not set)",course:[u.program,u.inst].filter(Boolean).join(" · ")}
  });
}
function current(list){return list.filter(function(d){return d.i==sel})[0]}
function render(){
  var list=rows(),q=$("q").value.toLowerCase();
  if(sel===null&&list.length){var p=list.filter(function(d){return d.status=="pending"})[0];sel=(p||list[0]).i}
  var shown=list.filter(function(d){
    var ok=filter=="all"||d.status==filter||(filter=="history"&&d.status!="pending");
    return ok&&(d.student+" "+d.t+" "+d.c).toLowerCase().indexOf(q)>-1});
  $("rows").innerHTML=shown.map(function(d){return '<tr tabindex="0" data-i="'+d.i+'" class="'+(d.i==sel?"sel":"")+'"><td>'+esc(d.t)+'<small>'+esc(d.student)+' &middot; '+esc(d.c)+'</small></td><td>'+esc(d.date)+'</td><td><span class="tag '+d.status+'">'+label(d.status)+'</span></td></tr>'}).join("");
  $("none").hidden=shown.length>0;
  $("none").textContent=list.length?"No requests match. Try a different search or filter.":"No requests yet. They appear here when a student submits an achievement.";
  ["pending","approved","rejected"].forEach(function(s){$("s"+label(s)).textContent=list.filter(function(d){return d.status==s}).length});
  $("sTotal").textContent=list.length;
  detail(list);
}
function detail(list){
  var d=current(list),el=$("detail");
  if(!d){el.innerHTML='<div class="empty">Select a request to review it.</div>';return}
  var done=d.status!="pending";
  el.innerHTML='<span class="tag '+d.status+'">'+label(d.status)+'</span><h2>'+esc(d.t)+'</h2><small style="color:var(--muted)">'+esc(d.student)+'</small>'+
  '<dl><dt>Programme</dt><dd>'+esc(d.course||"Not provided")+'</dd><dt>Category</dt><dd>'+esc(d.c)+'</dd><dt>Details</dt><dd>'+esc(d.n||"None given")+'</dd><dt>Submitted</dt><dd>'+esc(d.date)+'</dd></dl>'+
  '<div class="doc">'+(d.f?'Proof attached: <strong>'+esc(d.f)+'</strong>':'No proof attached')+'</div>'+
  '<label for="note" style="display:block;margin-top:14px;font-size:14px">Note to student (required if rejecting)</label><textarea id="note"'+(done?' disabled':'')+'>'+esc(d.note)+'</textarea>'+
  '<div class="acts"><button class="no" id="rej"'+(done?' disabled':'')+'>Reject</button><button class="ok" id="app"'+(done?' disabled':'')+'>Approve</button></div>'+
  '<p class="msg" id="msg">'+(done?"This request has been "+d.status+".":"")+'</p>';
  if(!done){$("app").onclick=function(){decide("approved")};$("rej").onclick=function(){decide("rejected")}}
}
function decide(s){
  var a=all(),x=a[sel],note=$("note").value.trim(),who=staff();
  if(!x)return;
  if(s=="rejected"&&!note){$("msg").textContent="Add a note explaining the rejection.";$("note").focus();return}
  if(s=="approved"){x.s="verified";x.by=who.inst||who.name||"Institution";x.vn=who.name||"";x.vd=Date.now();if(note)x.vc=note}
  else{x.s="rejected";x.rc=note}
  save(a);
  render();$("msg").textContent="Request "+s+".";
}
function setFilter(f){
  filter=f;
  document.querySelectorAll(".chip").forEach(function(x){x.setAttribute("aria-pressed",x.dataset.f==f)});
  document.querySelectorAll("nav a").forEach(function(x){x.classList.toggle("on",(f=="history")==(x.getAttribute("href")=="#history"))});
  render();
}
$("rows").onclick=function(e){var r=e.target.closest("tr");if(r){sel=+r.dataset.i;render()}};
$("rows").onkeydown=function(e){var r=e.target.closest("tr");if(r&&e.key=="Enter"){sel=+r.dataset.i;render()}};
$("q").oninput=render;
document.querySelectorAll(".chip").forEach(function(c){c.onclick=function(){setFilter(c.dataset.f)}});
window.onhashchange=function(){setFilter(location.hash=="#history"?"history":"all")};
var w=staff();$("instName").textContent=w.inst||w.name||"Your institution";
$("logout").onclick=function(){window.location.href="index.html"};
setFilter(location.hash=="#history"?"history":"all");
