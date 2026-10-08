(function(){
var root=document.documentElement;
var themeBtn=document.getElementById("theme");
try{
  var savedTheme=localStorage.getItem("theme");
  if(savedTheme==="dark" || savedTheme==="light") root.setAttribute("data-theme",savedTheme);
}catch(e){}

function applyTheme(){
  var current=root.getAttribute("data-theme");
  var systemDark=window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var isDark=current ? current==="dark" : systemDark;
  var next=isDark ? "light" : "dark";
  root.setAttribute("data-theme",next);
  try{localStorage.setItem("theme",next)}catch(e){}
  if(themeBtn){
    themeBtn.textContent=next==="dark" ? "☀️" : "🌙";
    themeBtn.setAttribute("aria-label",next==="dark" ? "Switch to light theme" : "Switch to dark theme");
    themeBtn.title=next==="dark" ? "Light mode" : "Dark mode";
  }
}
if(themeBtn){
  var initial=root.getAttribute("data-theme");
  var initialDark=initial ? initial==="dark" : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  themeBtn.textContent=initialDark ? "☀️" : "🌙";
  themeBtn.addEventListener("click",applyTheme);
}

var db=null,assets=null,admin=false,mats=[],notes=[],cat="All",first=true;
var $=function(i){return document.getElementById(i)};
var seen=0;try{seen=+localStorage.getItem("seen")||0}catch(e){}
function esc(s){var d=document.createElement("div");d.textContent=s==null?"":s;return d.innerHTML}
function toast(t){var e=$("toast");e.textContent=t;e.style.display="block";clearTimeout(toast.t);toast.t=setTimeout(function(){e.style.display="none"},4500)}
function tagc(t){return t==="Assignment"||t==="Assignments"?"b":t==="Notice"?"r":""}
function fmt(ts){try{return new Date(ts).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}catch(e){return""}}
function offline(){var m='<div class="empty">Live files and notices open when this page is viewed signed in to claude.ai.</div>';$("mat").innerHTML=m;$("upd").innerHTML='<li>'+m+'</li>'}
function drawM(){
var l=mats.filter(function(m){return cat==="All"||m.cat===cat});
if(!l.length){$("mat").innerHTML='<div class="empty">'+(admin?"No files yet. Upload your first PDF above.":"No files in this section yet. Check back soon.")+'</div>';return}
$("mat").innerHTML=l.map(function(m){return '<div class="card mat"><div><a class="t" href="/_blob/'+esc(m.assetId)+'" target="_blank" rel="noopener">📄 '+esc(m.title)+'</a><small>'+esc(m.cat)+' • '+esc(m.sem)+' • '+fmt(m.at)+'</small></div>'+(admin?'<button class="x" data-d="'+esc(m.id)+'" data-a="'+esc(m.assetId)+'">Delete</button>':'')+'</div>'}).join("")}
function drawN(){
var n=notes.filter(function(x){return x.at>seen}).length;
$("cnt").textContent=n;$("cnt").style.display=n?"grid":"none";
if(!notes.length){$("upd").innerHTML='<li><div class="empty" style="width:100%">No updates yet.</div></li>';return}
$("upd").innerHTML=notes.map(function(x){return '<li class="'+(x.at>seen?"new":"")+'"><span class="tag '+tagc(x.type)+'">'+esc(x.type)+'</span><span>'+esc(x.text)+' <small style="color:var(--mute)">'+fmt(x.at)+'</small></span>'+(admin?'<button class="x" data-n="'+esc(x.id)+'">Delete</button>':'')+'</li>'}).join("")}
$("tabs").addEventListener("click",function(e){var b=e.target.closest(".tab");if(!b)return;cat=b.dataset.c;[].forEach.call(document.querySelectorAll("#tabs .tab"),function(t){t.setAttribute("aria-selected",t===b)});drawM()});
$("bell").addEventListener("click",function(){seen=Date.now();try{localStorage.setItem("seen",seen)}catch(e){}drawN();$("updates").scrollIntoView()});
$("al").addEventListener("click",function(){if(!window.Notification){toast("Alerts are not supported in this browser.");return}Notification.requestPermission().then(function(p){toast(p==="granted"?"Alerts are on.":"Alerts are off.")})});
$("mat").addEventListener("click",async function(e){var b=e.target.closest("[data-d]");if(!b||!confirm("Delete this file for everyone?"))return;
try{await db.doc("materials/"+b.dataset.d).delete();if(assets)await assets.delete(b.dataset.a)}catch(x){toast("Could not delete. Try again.")}});
$("upd").addEventListener("click",async function(e){var b=e.target.closest("[data-n]");if(!b||!confirm("Delete this notice?"))return;
try{await db.doc("notices/"+b.dataset.n).delete()}catch(x){toast("Could not delete. Try again.")}});
$("upf").addEventListener("submit",async function(e){e.preventDefault();
var f=$("uf").files[0];if(!f)return;
if(!assets){$("um").textContent="Upload is not available in this view.";return}
$("ub").disabled=true;$("um").textContent="Uploading…";
try{var r=await assets.upload(f,{type:"application/pdf"});
var d={title:$("ut").value.trim(),cat:$("uc").value,sem:$("us").value,assetId:r.id,at:Date.now()};
await db.collection("materials").add(d);
if($("un").checked)await db.collection("notices").add({type:d.cat==="Assignments"?"Assignment":"Class",text:"New "+d.cat+" uploaded: "+d.title+" ("+d.sem+")",at:Date.now()});
$("upf").reset();$("um").textContent="Uploaded."}
catch(x){$("um").textContent=x&&x.code==="too_large"?"File is too large (max 20 MB).":"Upload failed. Check it is a PDF and try again."}
$("ub").disabled=false});
$("nf").addEventListener("submit",async function(e){e.preventDefault();$("nb").disabled=true;
try{await db.collection("notices").add({type:$("nt").value,text:$("nx").value.trim(),at:Date.now()});$("nf").reset();$("nm").textContent="Notice sent."}
catch(x){$("nm").textContent="Could not send. Try again."}
$("nb").disabled=false});

// SECURITY: the admin UI is fail-closed. Only claude.use("user").isOwner() can enable it.
var uid=null,pwRef=null,pwData=null;
function hex(b){return Array.prototype.map.call(new Uint8Array(b),function(x){return("0"+x.toString(16)).slice(-2)}).join("")}
function unhex(s){var a=new Uint8Array(s.length/2);for(var i=0;i<a.length;i++)a[i]=parseInt(s.substr(i*2,2),16);return a}
async function hashPw(pw,salt){var k=await crypto.subtle.importKey("raw",new TextEncoder().encode(pw),"PBKDF2",false,["deriveBits"]);return hex(await crypto.subtle.deriveBits({name:"PBKDF2",salt:salt,iterations:150000,hash:"SHA-256"},k,256))}
function showLock(){
$("admc").hidden=true;$("lock").style.display="flex";$("p1").value="";$("p2").value="";$("lm").textContent="";
var setup=!pwData;$("p2").style.display=setup?"block":"none";
$("lt").textContent=setup?"Set an admin password":"Owner Admin Lock";
$("lh").textContent=setup?"Choose a password (6+ characters). You will enter it each time you open the admin panel.":"Enter the owner password to access upload and notice controls.";
$("lb").textContent=setup?"Save password":"Unlock";$("lr").style.display=setup?"none":"block"}
function open_(){$("lock").style.display="none";$("admc").hidden=false}
$("lb").addEventListener("click",async function(){
var p=$("p1").value;if(p.length<6){$("lm").textContent="Use at least 6 characters.";return}
try{
if(!pwData){if(p!==$("p2").value){$("lm").textContent="Passwords do not match.";return}
var salt=crypto.getRandomValues(new Uint8Array(16));var d={salt:hex(salt),hash:await hashPw(p,salt)};
await pwRef.set(d);pwData=d;open_()}
else{var h=await hashPw(p,unhex(pwData.salt));if(h===pwData.hash)open_();else{$("lm").textContent="Wrong password.";$("p1").value=""}}
}catch(e){$("lm").textContent="Could not check the password. Try again."}});
$("lk").addEventListener("click",showLock);
$("lr").addEventListener("click",async function(){if(!confirm("Reset the admin password? You will set a new one."))return;
try{await pwRef.delete();pwData=null;showLock()}catch(e){$("lm").textContent="Could not reset. Try again."}});
(async function(){
if(!window.claude){offline();return}
try{var u=await claude.use("user");admin=!!(u&&u.isOwner());if(admin)uid=await u.id()}catch(e){}
try{db=await claude.use("db")}catch(e){}
if(!db){offline();return}
if(admin){
try{assets=await claude.use("assets")}catch(e){assets=null}
$("adm").classList.add("on");
try{pwRef=db.doc("data/users/"+uid+"/pw");var ps=await pwRef.get();pwData=ps.exists?ps.data():null}catch(e){pwData=null}
showLock();$("role").textContent="Owner";$("role").classList.add("a")
}else{
$("adm").classList.remove("on");$("role").textContent="Student";$("role").classList.remove("a")
}
db.collection("materials").orderBy("at","desc").onSnapshot(function(s){mats=s.docs.map(function(d){var o=d.data();o.id=d.id;return o});drawM()},function(){offline()});
db.collection("notices").orderBy("at","desc").onSnapshot(function(s){
notes=s.docs.map(function(d){var o=d.data();o.id=d.id;return o});
if(!first){s.docChanges().forEach(function(c){if(c.type==="added"&&!admin){var x=c.doc.data();toast("New "+x.type+": "+x.text);try{if(window.Notification&&Notification.permission==="granted")new Notification("MUJ BCA CodeHub",{body:x.text})}catch(e){}}})}
first=false;drawN()},function(){offline()});
})();

var lines=[
  '<span class="c"># MUJ BCA CodeHub</span>',
  '<span class="k">def</span> journey():',
  '    steps = [<span class="s">"learn"</span>, <span class="s">"practice"</span>,',
  '             <span class="s">"build"</span>, <span class="s">"internship"</span>, <span class="s">"job"</span>]',
  '    <span class="k">for</span> s <span class="k">in</span> steps:',
  '        print(s)'
];
var el=document.getElementById("type"),full=lines.join("\n");
if(el){
  if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    el.innerHTML=full+'\n<span class="cur"></span>';
  }else{
    var i=0;
    el.innerHTML=lines[0]+'\n<span class="cur"></span>';
    i=1;
    (function next(){
      if(i>=lines.length){
        el.innerHTML=full+'\n<span class="cur"></span>';
        return;
      }
      el.innerHTML=lines.slice(0,i+1).join("\n")+'\n<span class="cur"></span>';
      i++;
      setTimeout(next,520);
    })();
  }
}
})();
