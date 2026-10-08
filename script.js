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


var $=function(i){return document.getElementById(i)};
// ===== APNE FILES YAHAN ADD KARO =====
// url: Google Drive / Telegram / PDF ka link. cat: Notes, PPT ya Assignments. date: YYYY-MM-DD
var MATERIALS=[
  // {title:"Unit 1 Notes", cat:"Notes", sem:"Semester 1", url:"https://drive.google.com/...", date:"2026-10-09"},
];
// type: Class, Assignment ya Notice
var NOTICES=[
  // {type:"Notice", text:"Welcome to MUJ BCA CodeHub!", date:"2026-10-09"},
];
// =====================================
var cat="All",seen=0;try{seen=+localStorage.getItem("seen")||0}catch(e){}
function esc(s){var d=document.createElement("div");d.textContent=s==null?"":s;return d.innerHTML}
function ts(x){return new Date(x.date).getTime()||0}
function fmt(x){try{return new Date(x).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}catch(e){return""}}
function tagc(t){return t==="Assignment"||t==="Assignments"?"b":t==="Notice"?"r":""}
function drawM(){
var l=MATERIALS.filter(function(m){return cat==="All"||m.cat===cat}).sort(function(a,b){return ts(b)-ts(a)});
if(!l.length){$("mat").innerHTML='<div class="empty">No files in this section yet. Check back soon.</div>';return}
$("mat").innerHTML=l.map(function(m){return '<div class="card mat"><div><a class="t" href="'+esc(m.url)+'" target="_blank" rel="noopener">📄 '+esc(m.title)+'</a><small>'+esc(m.cat)+' • '+esc(m.sem)+' • '+fmt(ts(m))+'</small></div></div>'}).join("")}
function drawN(){
var n=NOTICES.filter(function(x){return ts(x)>seen}).length;
$("cnt").textContent=n;$("cnt").style.display=n?"grid":"none";
if(!NOTICES.length){$("upd").innerHTML='<li><div class="empty" style="width:100%">No updates yet.</div></li>';return}
$("upd").innerHTML=NOTICES.slice().sort(function(a,b){return ts(b)-ts(a)}).map(function(x){return '<li class="'+(ts(x)>seen?"new":"")+'"><span class="tag '+tagc(x.type)+'">'+esc(x.type)+'</span><span>'+esc(x.text)+' <small style="color:var(--mute)">'+fmt(ts(x))+'</small></span></li>'}).join("")}
$("tabs").addEventListener("click",function(e){var b=e.target.closest(".tab");if(!b)return;cat=b.dataset.c;[].forEach.call(document.querySelectorAll("#tabs .tab"),function(t){t.setAttribute("aria-selected",t===b)});drawM()});
$("bell").addEventListener("click",function(){seen=Date.now();try{localStorage.setItem("seen",seen)}catch(e){}drawN();$("updates").scrollIntoView()});
$("al").style.display="none";
drawM();drawN();

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
