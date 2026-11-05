/* ===== သီချင်း လမ်းကြောင်း ဒီမှာ ထည့်ပါ ===== */
const SONG_URL = "2f9bcd6826260d99b9dbddf3e363bbaf.mp4"; // ဥပမာ: "song.mp3" သို့မဟုတ် "https://.../song.mp3"

/* ===== ပုံလမ်းကြောင်းများ ===== */
const PHOTOS = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"];

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const store = {
  get(k){ try{ return localStorage.getItem(k) }catch(e){ return null } },
  set(k,v){ try{ localStorage.setItem(k,v) }catch(e){} }
};

/* IndexedDB (ပုံသိမ်းရန်) */
const idb = () => new Promise((ok,no)=>{
  const r = indexedDB.open("love",1);
  r.onupgradeneeded = () => r.result.createObjectStore("p");
  r.onsuccess = () => ok(r.result);
  r.onerror = no;
});
const dbGet = async k => {
  try{
    const d = await idb();
    return await new Promise(ok=>{
      const q = d.transaction("p").objectStore("p").get(k);
      q.onsuccess = () => ok(q.result);
      q.onerror = () => ok();
    });
  }catch(e){}
};
const dbSet = async (k,v) => {
  try{
    (await idb()).transaction("p","readwrite").objectStore("p").put(v,k);
  }catch(e){}
};

/* မြန်မာစာအတွက် grapheme ခွဲခြားခြင်း */
const seg = t => window.Intl && Intl.Segmenter
  ? [...new Intl.Segmenter("my",{granularity:"grapheme"}).segment(t)].map(x=>x.segment)
  : Array.from(t);

const rnd = (a,b) => a + Math.random()*(b-a);
const calm = matchMedia("(prefers-reduced-motion:reduce)").matches;

/* ===== Hero name ===== */
$("#nm").innerHTML = [..."Htet Htet Wai"]
  .map((c,i)=>`<span style="animation-delay:${.15*i+.4}s">${c===" "?"&nbsp;":c}</span>`)
  .join("");

/* ===== Gate ဖွင့်ခြင်း ===== */
$("#open").onclick = () => {
  $("#gate").classList.add("off");
  document.body.classList.remove("lock");
  $("#hero").classList.add("go");
};

/* ===== သီချင်း ===== */
const song = $("#song");
const mBtn = $("#music");
const mHint = $("#music-hint");
if(SONG_URL) song.src = SONG_URL;

function setPlaying(on){
  mBtn.classList.toggle("playing", on);
  mHint.classList.toggle("playing", on);
  mHint.textContent = on ? "သီချင်း ဖွင့်နေပါပြီ 🎶" : "သီချင်းဖွင့်ရန် နှိပ်ပါ";
}

mBtn.onclick = () => {
  if(!SONG_URL){
    mHint.textContent = "⚠️ သီချင်း မထည့်ရသေးပါ";
    return;
  }
  if(song.paused){
    song.play().then(()=> setPlaying(true)).catch(()=>{});
  }else{
    song.pause();
  }
};
song.addEventListener("play", ()=> setPlaying(true));
song.addEventListener("pause", ()=> setPlaying(false));

/* ===== Gallery ===== */
const gal = $("#gal");
PHOTOS.forEach((src,i)=>{
  const f = document.createElement("figure");
  f.className = "ph rv";
  f.innerHTML = `
    <label>
      <span>💙 ပုံ ${i+1} ထည့်ရန် နှိပ်ပါ</span>
      <img alt="အမှတ်တရ ${i+1}">
      <input type="file" accept="image/*">
    </label>`;
  gal.append(f);

  const img = f.querySelector("img");
  const show = u => { img.src = u; f.classList.add("has"); };

  if(src) show(src);
  else dbGet("p"+i).then(b => { if(b) show(URL.createObjectURL(b)) });

  f.querySelector("input").onchange = e => {
    const b = e.target.files[0];
    if(!b) return;
    show(URL.createObjectURL(b));
    dbSet("p"+i, b);
  };

  f.onpointermove = e => {
    if(e.pointerType !== "mouse") return;
    const r = f.getBoundingClientRect();
    const x = (e.clientX - r.x)/r.width - .5;
    const y = (e.clientY - r.y)/r.height - .5;
    f.style.transform = `rotateY(${x*14}deg) rotateX(${-y*14}deg) scale(1.03)`;
  };
  f.onpointerleave = () => f.style.transform = "";
});

/* ===== ချစ်ရတဲ့ အကြောင်းရင်းများ ===== */
const reasons = [
  "မင်းနဲ့တွေ့ပြီးနောက်ပိုင်း ကိုယ့်နေ့ရက်တွေက အရင်ကနဲ့မတူတော့ဘူး။ ဘာမှမထူးခြားတဲ့နေ့လေးတွေတောင် မင်းရှိနေလို့ အဓိပ္ပာယ်ရှိလာတယ်။ ❤️",

  "ကိုယ်က လူကောင်းတစ်ယောက် အမြဲဖြစ်ချင်မှ ဖြစ်မယ်။ ဒါပေမဲ့ မင်းအပေါ်မှာတော့ ရိုးသားတဲ့သူတစ်ယောက် ဖြစ်ပေးချင်တယ်။",

  "တစ်နေ့တာ ဘယ်လောက်ပဲ ပင်ပန်းနေပါစေ မင်းဆီက စာလေးတစ်စောင်ရရင်တောင် စိတ်ထဲမှာ အပြုံးလေးဖြစ်သွားတယ်။",

  "ကိုယ်တို့နှစ်ယောက် အမြဲတမ်း နီးနီးကပ်ကပ် ရှိနေနိုင်ဖို့ မျှော်လင့်တယ်။ အချိန်တွေ ဘယ်လောက်ပြောင်းပြောင်း မင်းကိုချစ်တဲ့စိတ်လေးတော့ မပြောင်းလဲချင်ဘူး။",

  "ထက်ထက်ဝေရေ... ကိုယ် မင်းကို ချစ်တယ်ဆိုတာထက် မင်းနဲ့အတူ ဘဝရဲ့နေ့ရက်တွေကို ဖြတ်သန်းချင်တယ်ဆိုတာ ပိုပြီးမှန်ကန်တဲ့ ကိုယ့်ခံစားချက်ပါ။ ❤️"
];
const emo = ["💙","💗","💜","💞","💖"];
reasons.forEach((t,i)=>{
  const c = document.createElement("div");
  c.className = "fc rv";
  c.tabIndex = 0;
  c.innerHTML = `
    <div class="fi">
      <div class="f">${emo[i]}</div>
      <div class="b">${t}</div>
    </div>`;
  const flip = () => c.classList.toggle("on");
  c.onclick = flip;
  c.onkeydown = e => {
    if(e.key === "Enter" || e.key === " "){
      e.preventDefault(); flip();
    }
  };
  $("#cards").append(c);
});

/* ===== Counter ===== */
const si = $("#since");
si.max = new Date().toISOString().slice(0,10);
si.value = store.get("since") || "";
si.onchange = () => { store.set("since", si.value); tick(); };
function tick(){
  const t = si.value ? new Date(si.value+"T00:00:00").getTime() : NaN;
  const n = isNaN(t) ? 0 : Math.max(0, (Date.now()-t)/1000|0);
  $("#d").textContent = n/86400|0;
  $("#h").textContent = n%86400/3600|0;
  $("#m").textContent = n%3600/60|0;
  $("#s").textContent = n%60;
}
tick();
setInterval(tick, 1000);

/* ===== စာ ===== */
const letter =
  "ထက်ထက်ဝေရေ ❤️\n\n" +
  "တစ်ခါတလေ ကိုယ်က မင်းကို ဘယ်လောက်ချစ်တယ်ဆိုတာ စကားလုံးတွေနဲ့ ပြည့်ပြည့်စုံစုံ ဖော်ပြဖို့ ခက်တယ်။ " +
  "ဒါပေမဲ့ ကိုယ့်ဘဝထဲမှာ မင်းရှိနေတာလေးကိုက ကိုယ့်အတွက် ပျော်ရွှင်မှုတစ်ခုပါပဲ။ " +
  "မင်းပျော်နေရင် ကိုယ်လည်းပျော်တယ်၊ မင်းစိတ်ညစ်နေရင်လည်း ကိုယ်တတ်နိုင်သလောက် အနားမှာရှိပေးချင်တယ်။ " +
  "ကိုယ်တို့နှစ်ယောက်ကြားမှာ အမြဲတမ်း အဆင်ပြေနေမှာတော့ မဟုတ်ဘူးဆိုတာ သိပါတယ်။ " +
  "တစ်ခါတလေ စိတ်ကောက်တာတွေ၊ နားလည်မှုလွဲတာတွေလည်း ရှိလာနိုင်တယ်။ " +
  "ဒါပေမဲ့ ဘယ်လိုအခြေအနေမျိုးပဲဖြစ်ဖြစ် မင်းလက်ကို လွယ်လွယ်နဲ့ လွှတ်မချချင်ဘူး။ " +
  "ကိုယ်လိုချင်တာက ပြီးပြည့်စုံတဲ့ ချစ်ခြင်းမျိုးမဟုတ်ဘူး။ " +
  "အားနည်းချက်တွေရှိတဲ့ ကိုယ်တို့နှစ်ယောက် အပြန်အလှန် နားလည်ပေးရင်း အတူတူရှေ့ဆက်သွားနိုင်ဖို့ပါပဲ။ " +
  "မင်းဟာ ကိုယ့်အတွက် ချစ်ရတဲ့သူတစ်ယောက်ထက် ပိုပါတယ်။ ကိုယ့်ဘဝရဲ့ အရေးပါတဲ့သူတစ်ယောက်ပါ။ " +
  "ချစ်တယ် ထက်ထက်ဝေ ❤️";

let typed = false;
function type(){
  if(typed) return;
  typed = true;
  const g = seg(letter), el = $("#txt");
  let i = 0;
  (function s(){
    el.textContent = g.slice(0, ++i).join("");
    if(i < g.length) setTimeout(s, calm ? 5 : 70);
    else el.classList.remove("caret");
  })();
}

/* ===== Finale ===== */
let k = 1;
const no = $("#no"), yes = $("#yes");
function dodge(e){
  e.preventDefault();
  k = Math.min(k + .25, 3);
  yes.style.transform = `scale(${k})`;
  no.style.transform = `translate(${rnd(-90,90)}px,${rnd(-60,60)}px)`;
}
no.addEventListener("pointerenter", dodge);
no.addEventListener("pointerdown", dodge);

yes.onclick = () => {
  $(".btns").style.display = "none";
  const w = $("#win");
  w.style.display = "block";
  w.style.animation = "flow 6s linear infinite";
};

/* ===== Section တစ်ခုပြီးတိုင်း animation ===== */
const io = new IntersectionObserver(es => {
  es.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add("in");
      const sec = e.target.closest(".sec");
      if(sec) sec.classList.add("in");
      if(e.target.id === "paper") type();
      io.unobserve(e.target);
    }
  });
}, { threshold:.2 });

$$(".rv").forEach((el,i)=>{
  el.style.transitionDelay = (i%5)*.08 + "s";
  io.observe(el);
});
