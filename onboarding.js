// ═══════════════════════════════════════════
// ONBOARDING — Landing page + Title card
// Extracted from game-org-chart.html
// ═══════════════════════════════════════════

/* ── Inject styles ── */
(function(){
  const style=document.createElement('style');
  style.textContent=`
/* ╔══════════════════════════════════════════════╗
   ║  LANDING PAGE — "website-builder"            ║
   ║  First screen: user enters what to build,    ║
   ║  sees agent roster, clicks "Assemble"        ║
   ╚══════════════════════════════════════════════╝ */
#onboarding-overlay {
  position: fixed; inset: 0; background: #63ACF0;
  z-index: 500; display: flex; align-items: center; justify-content: center;
  font-family: var(--pxfont); image-rendering: pixelated;
  overflow: hidden;
}
/* Pixel clouds */
.px-cloud {
  position: absolute; background: #fff; image-rendering: pixelated;
  border-radius: 0; opacity: 0.45;
}
.px-cloud::before, .px-cloud::after {
  content: ''; position: absolute; background: #fff;
}
/* top */
.px-cloud-1 { width: 180px; height: 36px; top: 5%; left: 8%;  animation: cloud-drift 28s linear infinite; }
.px-cloud-1::before { width: 72px; height: 36px; top: -28px; left: 24px; }
.px-cloud-1::after  { width: 54px; height: 28px; top: -20px; left: 84px; }
.px-cloud-2 { width: 200px; height: 40px; top: 12%; left: 55%; animation: cloud-drift 32s linear infinite; animation-delay: -18s; }
.px-cloud-2::before { width: 80px; height: 40px; top: -32px; left: 30px; }
.px-cloud-2::after  { width: 64px; height: 32px; top: -24px; left: 100px; }
/* upper-mid */
.px-cloud-3 { width: 150px; height: 32px; top: 22%; left: 25%; animation: cloud-drift 34s linear infinite; animation-delay: -14s; }
.px-cloud-3::before { width: 60px; height: 32px; top: -26px; left: 20px; }
.px-cloud-3::after  { width: 48px; height: 24px; top: -18px; left: 70px; }
.px-cloud-4 { width: 140px; height: 30px; top: 30%; left: 75%; animation: cloud-drift 36s linear infinite; animation-delay: -10s; }
.px-cloud-4::before { width: 60px; height: 30px; top: -24px; left: 16px; }
.px-cloud-4::after  { width: 44px; height: 24px; top: -16px; left: 64px; }
/* middle */
.px-cloud-5 { width: 170px; height: 34px; top: 45%; left: 10%; animation: cloud-drift 30s linear infinite; animation-delay: -22s; }
.px-cloud-5::before { width: 68px; height: 34px; top: -28px; left: 22px; }
.px-cloud-5::after  { width: 52px; height: 28px; top: -20px; left: 82px; }
.px-cloud-6 { width: 120px; height: 28px; top: 50%; left: 60%; animation: cloud-drift 40s linear infinite; animation-delay: -5s; }
.px-cloud-6::before { width: 52px; height: 28px; top: -22px; left: 12px; }
.px-cloud-6::after  { width: 40px; height: 22px; top: -16px; left: 54px; }
/* lower */
.px-cloud-7 { width: 160px; height: 34px; top: 65%; left: 40%; animation: cloud-drift 26s linear infinite; animation-delay: -20s; }
.px-cloud-7::before { width: 64px; height: 34px; top: -26px; left: 18px; }
.px-cloud-7::after  { width: 48px; height: 26px; top: -18px; left: 74px; }
.px-cloud-8 { width: 130px; height: 28px; top: 72%; left: 5%; animation: cloud-drift 38s linear infinite; animation-delay: -8s; }
.px-cloud-8::before { width: 52px; height: 28px; top: -22px; left: 10px; }
.px-cloud-8::after  { width: 40px; height: 20px; top: -14px; left: 50px; }
/* bottom */
.px-cloud-9 { width: 190px; height: 38px; top: 82%; left: 65%; animation: cloud-drift 29s linear infinite; animation-delay: -12s; }
.px-cloud-9::before { width: 76px; height: 38px; top: -30px; left: 26px; }
.px-cloud-9::after  { width: 56px; height: 30px; top: -22px; left: 90px; }
.px-cloud-10 { width: 150px; height: 32px; top: 88%; left: 20%; animation: cloud-drift 35s linear infinite; animation-delay: -16s; }
.px-cloud-10::before { width: 60px; height: 32px; top: -26px; left: 18px; }
.px-cloud-10::after  { width: 46px; height: 24px; top: -18px; left: 68px; }
.px-cloud-11 { width: 110px; height: 26px; top: 92%; left: 80%; animation: cloud-drift 33s linear infinite; animation-delay: -3s; }
.px-cloud-11::before { width: 48px; height: 26px; top: -20px; left: 12px; }
.px-cloud-11::after  { width: 36px; height: 20px; top: -14px; left: 52px; }
@keyframes cloud-drift {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-120vw); }
}
#onboarding-box {
  width: 820px; max-width: 94vw;
  border: 4px solid #DCB5A3;
  outline: 3px solid #634255;
  background: #000000;
  box-shadow: 6px 6px 0 #0a0812;
  position: relative;
}
.pokeball {
  position: absolute; top: -28px; right: -28px; width: 64px; height: 64px;
  image-rendering: pixelated; z-index: 2;
}
.pokeball-top { width: 100%; height: 50%; background: #DB3E55; border-radius: 64px 64px 0 0; border: 4px solid #000000; border-bottom: none; }
.pokeball-bot { width: 100%; height: 50%; background: #e8e8e8; border-radius: 0 0 64px 64px; border: 4px solid #000000; border-top: none; }
.pokeball-mid { position: absolute; top: 50%; left: 0; right: 0; height: 6px; background: #000000; transform: translateY(-50%); }
.pokeball-btn { position: absolute; top: 50%; left: 50%; width: 18px; height: 18px; background: #e8e8e8; border: 4px solid #000000; border-radius: 50%; transform: translate(-50%,-50%); z-index: 3; }
.pokeball-btn::after { content:''; position: absolute; top: 50%; left: 50%; width: 8px; height: 8px; background: #fff; border: 2px solid #000000; border-radius: 50%; transform: translate(-50%,-50%); }
.pokeball-shine { position: absolute; top: 10px; left: 14px; width: 10px; height: 10px; background: rgba(255,255,255,0.5); border-radius: 50%; }
#onboarding-header {
  background: #000000; border-bottom: 3px solid #7FC761;
  padding: 34px 40px 26px;
}
#onboarding-header .ob-label {
  font-size: 0.5rem; letter-spacing: 2px; text-transform: uppercase;
  color: #7FC761; margin-bottom: 10px; font-family: var(--pxfont);
}
#onboarding-header h1 {
  font-size: 1.8rem; color: #7FC761; letter-spacing: 2px; margin: 0;
  text-transform: uppercase; font-family: var(--pxfont); line-height: 1.6;
}
#onboarding-header p {
  font-size: 0.55rem; color: #9D7375; margin: 8px 0 0; letter-spacing: 1px;
  font-family: var(--pxfont);
}
#onboarding-body {
  background: #140F20; padding: 36px 40px;
}
/* Character picker */
.ob-char-label {
  display: block; font-size: 0.5rem; letter-spacing: 2px; text-transform: uppercase;
  color: #9D7375; margin-bottom: 12px; font-family: var(--pxfont);
}
.ob-char-picker {
  display: flex; gap: 16px; margin-bottom: 28px;
}
.ob-char-option {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 12px 20px; background: #2A1F3D; border: 3px solid #634255;
  cursor: pointer; transition: border-color 0.1s, box-shadow 0.1s;
  font-family: var(--pxfont); font-size: 0.4rem; color: #9D7375;
  text-transform: uppercase; letter-spacing: 1px;
}
.ob-char-option img {
  width: 64px; height: 64px; image-rendering: pixelated;
}
.ob-char-option.selected {
  border-color: #7FC761; box-shadow: 0 0 0 2px #7FC761, 4px 4px 0 #0a0812;
  color: #7FC761;
}
.ob-char-option:hover:not(.selected) { border-color: #9D7375; }

#onboarding-body label {
  display: block; font-size: 0.5rem; letter-spacing: 2px; text-transform: uppercase;
  color: #9D7375; margin-bottom: 10px; font-family: var(--pxfont);
}
#onboarding-input {
  width: 100%; padding: 14px 16px; font-family: var(--pxfont); font-size: 0.6rem;
  background: #2A1F3D; border: 3px solid #634255; color: #DCB5A3;
  outline: none; box-sizing: border-box; border-radius: 0;
  margin-top: 4px;
}
#onboarding-input:focus { border-color: #7FC761; }
#onboarding-input::placeholder { color: #634255; font-family: var(--pxfont); font-size: 0.5rem; }
#onboarding-submit {
  margin-top: 20px; width: 100%; padding: 16px; font-family: var(--pxfont);
  font-size: 0.6rem; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;
  background: linear-gradient(180deg,#7FC761 0%,#40812E 100%);
  color: #0a2008; border: 3px solid #2A1F3D; cursor: pointer;
  box-shadow: 4px 4px 0 #0a0812; border-radius: 0;
  transition: transform 0.05s, box-shadow 0.05s;
}
#onboarding-submit:hover { background: linear-gradient(180deg,#9DD880 0%,#7FC761 100%); }
#onboarding-submit:active { transform: translate(3px,3px); box-shadow: 1px 1px 0 #0a0812; }
.ob-team-title {
  font-family: var(--pxfont); font-size: 0.55rem; color: #DCB5A3;
  text-transform: uppercase; letter-spacing: 2px;
  margin-top: 24px; padding-top: 18px;
  border-top: 2px solid #2A1F3D;
}
.ob-agents {
  display: flex; gap: 12px; margin-top: 12px;
}
.ob-agent-chip {
  flex: 1; padding: 14px 8px 12px; text-align: center;
  background: #2A1F3D; border: 2px solid #634255;
  font-size: 0.45rem; letter-spacing: 1px; text-transform: uppercase;
  border-radius: 0; font-family: var(--pxfont);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.ob-agent-chip img {
  width: 80px; height: 80px; image-rendering: pixelated;
}

/* ╔══════════════════════════════════════════════╗
   ║  NAME PAGE — "name-page"                     ║
   ║  Second screen: shows generated product      ║
   ║  name + tagline, "Enter the hub" button.     ║
   ║  Collapses into top header bar in-game.      ║
   ╚══════════════════════════════════════════════╝ */
#title-card {
  position: fixed; inset: 0; background: #63ACF0;
  z-index: 400; display: none; align-items: center; justify-content: center;
  font-family: var(--pxfont); transition: all 0.4s ease;
  overflow: hidden;
}
#title-card.show { display: flex; }
#title-card.as-header {
  inset: unset; top: 0; left: 0; right: 0; height: 44px;
  background: rgba(0,0,0,0.95); border-bottom: 2px solid #634255; overflow: hidden;
  align-items: center; justify-content: flex-start;
  padding: 0 16px; display: flex;
  box-shadow: 0 2px 20px rgba(0,0,0,0.5);
}
#title-card-inner { text-align: center; padding: 40px; max-width: 600px; transition: all 0.4s ease; }
#title-card.as-header #title-card-inner {
  display: flex; align-items: center; gap: 16px; padding: 0; text-align: left;
}
#title-card-loading {
  color: #4A3650; font-size: 0.55rem; letter-spacing: 3px; text-transform: uppercase;
  font-family: var(--pxfont);
}
#title-card-content { display: none; }
#title-card-content.show { display: block; }
#title-card.as-header #title-card-content { display: flex; align-items: center; gap: 14px; }
.tc-label {
  font-size: 0.5rem; letter-spacing: 3px; text-transform: uppercase;
  color: #fff; margin-bottom: 24px; font-family: var(--pxfont);
  text-shadow: 2px 2px 0 rgba(0,0,0,0.4);
}
#title-card.as-header .tc-label { display: none; }
#tc-title {
  font-size: clamp(1.8rem, 5vw, 3rem); font-weight: bold; letter-spacing: 3px;
  text-transform: uppercase; font-family: var(--pxfont);
  background: linear-gradient(90deg, #FF5070, #FFD060, #90FF80, #80E0C0, #70C0FF, #C080A0, #FF5070);
  background-size: 300% 100%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: rainbow-shift 4s linear infinite;
  margin-bottom: 16px; line-height: 1.4; transition: font-size 0.4s ease, letter-spacing 0.4s ease;
  filter: drop-shadow(3px 3px 0 rgba(0,0,0,0.5)) drop-shadow(0 0 12px rgba(255,255,255,0.3));
  -webkit-text-stroke: 1px rgba(0,0,0,0.2);
}
@keyframes rainbow-shift {
  0%   { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}
#title-card.as-header #tc-title {
  font-size: 0.7rem; letter-spacing: 2px; margin-bottom: 0;
  background: none; -webkit-text-fill-color: #7FC761; color: #7FC761;
  filter: none; animation: none;
}
#tc-tagline {
  font-size: 0.55rem; color: #fff; letter-spacing: 2px; margin-bottom: 40px;
  transition: all 0.4s ease; font-family: var(--pxfont);
  text-shadow: 2px 2px 0 rgba(0,0,0,0.4);
}
#title-card.as-header #tc-tagline {
  font-size: 0.65rem; letter-spacing: 1px; margin-bottom: 0; color: #4A3650;
  border-left: 1px solid #2A1F3D; padding-left: 14px;
}
#tc-begin {
  font-family: var(--pxfont); font-size: 0.6rem; font-weight: bold;
  letter-spacing: 3px; text-transform: uppercase;
  padding: 14px 36px; border: 3px solid #fff; background: rgba(0,0,0,0.3);
  color: #fff; cursor: pointer; transition: all 0.15s; border-radius: 0;
  box-shadow: 4px 4px 0 rgba(0,0,0,0.3);
}
#tc-begin:hover { background: #fff; color: #1a6a30; }
#title-card.as-header #tc-begin { display: none; }
.tc-scanline {
  position: absolute; inset: 0; pointer-events: none;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
}
#title-card.as-header .tc-scanline { display: none; }
#title-card.as-header .px-cloud { display: none; }
`;
  document.head.appendChild(style);
})();

/* ── Onboarding → Title Card → Game ── */
/* Depends on globals: onboardingOpen, productContext, selectedCeoImg, agentImages, gameLoop */

const titleCard=document.getElementById('title-card');
const titleCardContent=document.getElementById('title-card-content');
const titleCardLoading=document.getElementById('title-card-loading');
let tcDotsTimer=null;

function startGame(){
  onboardingOpen=false;
  titleCard.classList.remove('show');
  titleCard.classList.add('as-header');
  gameLoop();
}

document.getElementById('tc-begin').addEventListener('click',startGame);

async function showTitleCard(context){
  document.getElementById('onboarding-overlay').style.display='none';
  titleCard.classList.add('show');

  // Animate loading dots
  let dots=0;
  tcDotsTimer=setInterval(()=>{dots=(dots+1)%4;document.getElementById('tc-dots').textContent='.'.repeat(dots);},400);

  try {
    const resp=await fetch('/api/title',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({context})});
    const data=resp.ok?await resp.json():{title:'Your Product',tagline:'Built with your AI team.'};
    clearInterval(tcDotsTimer);
    document.getElementById('tc-title').textContent=data.title;
    document.getElementById('tc-tagline').textContent=data.tagline;
  } catch {
    clearInterval(tcDotsTimer);
    document.getElementById('tc-title').textContent='Your Product';
    document.getElementById('tc-tagline').textContent='Built with your AI team.';
  }

  titleCardLoading.style.display='none';
  titleCardContent.classList.add('show');
}

// Character picker
function selectCeo(el){
  document.querySelectorAll('.ob-char-option').forEach(o=>o.classList.remove('selected'));
  el.classList.add('selected');
  const src='agent-images/'+el.dataset.ceo;
  selectedCeoImg=src;
  // Reload the CEO image
  const img=new Image(); img.src=src;
  img.onload=()=>{ agentImages["CEO"]=img; };
}

function handleOnboardingSubmit(){
  const val=document.getElementById('onboarding-input').value.trim();
  if(!val)return;
  productContext=val;
  showTitleCard(val);
}

document.getElementById('onboarding-submit').addEventListener('click',handleOnboardingSubmit);
document.getElementById('onboarding-input').addEventListener('keydown',e=>{
  if(e.key==='Enter')handleOnboardingSubmit();
});
document.getElementById('onboarding-input').focus();
