// Afterglow - shared script for every page
const $=s=>document.querySelector(s);
const posts=[
{t:"The interface will disappear before the screen does",c:"Design",m:6,d:"Sep 28",v:12400,s:"Ambient computing is replacing taps with context. What do designers keep when nothing is left to click?",b:["For thirty years we designed surfaces. Buttons, cards, menus: all of it assumed someone was looking and pointing.","Now the best product moments happen with no screen at all. A door unlocks, a playlist shifts, a reminder arrives right when your hands are free.","The craft shifts from layout to timing. The question becomes when to speak, how softly, and how to be quiet the rest of the day."]},
{t:"Small models, big quiet wins",c:"AI",m:8,d:"Sep 21",v:9800,s:"The most useful AI on your phone may be the one nobody advertises: tiny, private and always on.",b:["Headline models grab attention, but daily value is moving toward compact models that run on the device itself.","They answer instantly, work offline and keep your notes where they started. That changes what people are willing to ask.","Expect the next wave of apps to feel less like chatting with a machine and more like a better keyboard."]},
{t:"Cities are learning to listen",c:"Cities",m:7,d:"Sep 14",v:7100,s:"Sensors, sound maps and slow data are turning streets into feedback loops.",b:["A crossing that lengthens for slower walkers. A lamp that dims when the street is empty. These are small acts of attention.","The risk is surveillance dressed up as care. Cities that publish what they sense, and why, earn the right to keep sensing.","Good infrastructure is the kind you notice only when it is missing."]},
{t:"Typography is the last analog interface",c:"Design",m:5,d:"Sep 07",v:5300,s:"In a world of generated everything, letterforms still carry a human hand.",b:["Every typeface is a decision made by someone about how a word should feel before it is read.","As generated images flood feeds, careful type becomes a signal of intent. It says someone chose this.","Pick two families, set them with care, and let the words do the rest."]},
{t:"Sleep is the next productivity frontier",c:"Life",m:6,d:"Aug 30",v:4600,s:"Wearables stopped counting steps and started guarding rest. Is that progress?",b:["The newest health gadgets advise on rest rather than effort, which is a healthier default.","Yet scoring your sleep can create the anxiety that ruins it. Data helps most when it is gentle.","Use the numbers to notice a pattern, then put the device in a drawer."]},
{t:"Building slow software on purpose",c:"Craft",m:9,d:"Aug 22",v:6200,s:"Teams are choosing fewer features, longer cycles and calmer releases. It works.",b:["Speed became a habit long before it became a strategy. Many teams ship constantly and learn nothing.","A slower rhythm leaves room to delete, to polish and to ask whether a feature should exist.","Calm products are made by calm teams, and users can feel the difference."]}
];
const authors=[["Mira Okafor","Design","2","17,700","Lagos"],["Jun Takeda","AI","1","9,800","Osaka"],["Lena Vogt","Cities","1","7,100","Berlin"],["Arun Mehta","Craft","1","6,200","Ahmedabad"],["Sofia Lindqvist","Life","1","4,600","Malmo"],["Theo Marsh","Culture","0","3,900","Leeds"]];

function card(p,big){return `<button class="card ${big?"big":""}" data-i="${p.i}" style="--g:${["#b79cff","#ffb48a","#8cf0d8"][p.i%3]};--r:${p.i*60}deg"><span class="glyph"></span><h3>${p.t}</h3><p>${p.s}</p><span class="meta"><span>${p.c}</span><span>${p.m} min · ${p.d}</span></span></button>`}
const all=posts.map((p,i)=>({...p,i}));

// active nav link
const file=location.pathname.split("/").pop()||"index.html";
document.querySelectorAll("#nav a").forEach(a=>a.classList.toggle("cur",a.getAttribute("href")===file));

// home: latest three
if($("#latest"))$("#latest").innerHTML=all.slice(0,3).map(p=>card(p)).join("");

// journal: filters + search
if($("#grid")){
  const cats=["All",...new Set(posts.map(p=>p.c))];let cat="All",term="";
  $("#chips").innerHTML=cats.map(c=>`<button class="chip" aria-pressed="${c==="All"}">${c}</button>`).join("");
  $("#chips").onclick=e=>{const b=e.target.closest(".chip");if(!b)return;cat=b.textContent;[...$("#chips").children].forEach(x=>x.setAttribute("aria-pressed",x===b));draw()};
  $("#q").oninput=e=>{term=e.target.value.toLowerCase();draw()};
  function draw(){const l=all.filter(p=>(cat==="All"||p.c===cat)&&(p.t+p.s).toLowerCase().includes(term));
    $("#grid").innerHTML=l.length?l.map((p,k)=>card(p,k===0&&cat==="All"&&!term)).join(""):`<p class="empty">No essays match that search. Clear the box or pick another topic.</p>`}
  draw();
}

// archive: sortable table
if($("#tA")){
  let sk="d",asc=false;
  function tbl(){const rows=all.map(p=>({...p,dn:-p.i}));
    rows.sort((a,b)=>{const k=sk==="d"?"dn":sk;return(a[k]>b[k]?1:a[k]<b[k]?-1:0)*(asc?1:-1)});
    $("#tA tbody").innerHTML=rows.map(p=>`<tr data-i="${p.i}" style="cursor:pointer"><td>${p.t}</td><td>${p.c}</td><td>${p.m}</td><td>${p.v.toLocaleString()}</td><td>${p.d}</td></tr>`).join("");
    document.querySelectorAll("#tA th").forEach(h=>{h.classList.toggle("s",h.dataset.k===sk);h.classList.toggle("u",h.dataset.k===sk&&asc)})}
  $("#tA thead").onclick=e=>{const h=e.target.closest("th");if(!h)return;const k=h.dataset.k;if(sk===k)asc=!asc;else{sk=k;asc=k==="t"||k==="c"}tbl()};
  tbl();
}

// authors table
if($("#tW tbody"))$("#tW tbody").innerHTML=authors.map(a=>`<tr>${a.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("");

// card tilt
document.addEventListener("mousemove",e=>{const c=e.target.closest(".card");if(!c)return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;c.style.setProperty("--mx",x*100+"%");c.style.setProperty("--my",y*100+"%");c.style.transform=`rotateX(${(.5-y)*8}deg) rotateY(${(x-.5)*8}deg)`});
document.addEventListener("mouseout",e=>{const c=e.target.closest(".card");if(c)c.style.transform=""});

// essay reader
const dlg=$("#dlg");
document.addEventListener("click",e=>{const c=e.target.closest(".card,#tA tbody tr");if(!c)return;const p=posts[c.dataset.i];
  $("#art").innerHTML=`<span class="meta" style="display:block">${p.c} · ${p.m} min read · ${p.d}</span><h2>${p.t}</h2>${p.b.map(x=>`<p>${x}</p>`).join("")}`;dlg.showModal();dlg.scrollTop=0});
$("#cl").onclick=()=>dlg.close();
dlg.onclick=e=>{if(e.target===dlg)dlg.close()};

// newsletter
if($("#f"))$("#f").onsubmit=e=>{e.preventDefault();$("#msg").textContent="Subscribed. Your first essay arrives on Sunday.";e.target.reset()};

// theme toggle (remembered)
const root=document.documentElement;
try{const t=localStorage.getItem("theme");if(t)root.dataset.theme=t}catch(e){}
$("#tg").onclick=()=>{const dark=getComputedStyle(root).getPropertyValue("--bg").trim()==="#0e0b24";root.dataset.theme=dark?"light":"dark";try{localStorage.setItem("theme",root.dataset.theme)}catch(e){}};

// scroll progress
addEventListener("scroll",()=>{const h=document.documentElement;$("#bar").style.width=(h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight))*100+"%"},{passive:true});

// counters (home)
function count(id,to,ms=1400){const el=$(id);if(!el)return;const t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/ms);el.textContent=Math.round(to*(1-Math.pow(1-k,3))).toLocaleString();if(k<1)requestAnimationFrame(f)})(t0)}
count("#n1",posts.length);count("#n2",48200);count("#n3",7);

// constellation sky
const cv=$("#sky"),x=cv.getContext("2d");let W,H,pts=[],m={x:-999,y:-999};
function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;pts=Array.from({length:Math.min(90,W/14|0)},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25}))}
size();addEventListener("resize",size);addEventListener("pointermove",e=>{m.x=e.clientX;m.y=e.clientY});
(function loop(){x.clearRect(0,0,W,H);const col=getComputedStyle(root).getPropertyValue("--ink").trim()||"#fff";x.fillStyle=col;x.strokeStyle=col;
for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;const dx=p.x-m.x,dy=p.y-m.y,d=Math.hypot(dx,dy);if(d<140){p.x+=dx/d*1.2;p.y+=dy/d*1.2}x.globalAlpha=.55;x.beginPath();x.arc(p.x,p.y,1.4,0,7);x.fill()}
for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);if(d<110){x.globalAlpha=(1-d/110)*.25;x.beginPath();x.moveTo(pts[i].x,pts[i].y);x.lineTo(pts[j].x,pts[j].y);x.stroke()}}
for(const p of pts){const d=Math.hypot(p.x-m.x,p.y-m.y);if(d<170){x.globalAlpha=(1-d/170)*.6;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(m.x,m.y);x.stroke()}}
requestAnimationFrame(loop)})();
