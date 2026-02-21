// ═══════════════════════════════════════════
// DETAIL PANEL — Scroll-styled slide-out
// ═══════════════════════════════════════════

(function(){
  const style=document.createElement('style');
  style.textContent=`

/* ── Scrim ── */
#detail-scrim {
  position: fixed; inset: 0; background: rgba(0,0,0,0.55);
  z-index: 99; display: none;
}
#detail-scrim.open { display: block; }

/* ── Panel — slides from right ── */
#detail-panel {
  position: fixed; top: 44px; right: 0; width: 420px; max-width: 92vw; height: calc(100vh - 44px);
  z-index: 100;
  transform: translateX(100%); transition: transform 0.25s ease;
  display: flex; flex-direction: column;
  font-family: var(--pxfont);
  image-rendering: pixelated;
}
#detail-panel.open { transform: translateX(0); }

/* ── Spindles (top & bottom wooden rods) ── */
.dp-spindle {
  height: 28px; flex-shrink: 0;
  background: #8b6a3e;
  border: 3px solid #5c3d1e;
  position: relative; z-index: 2;
  box-shadow: inset 0 4px 0 #a07d4e, inset 0 -4px 0 #6b4c2a;
}
.dp-spindle::before {
  content: ''; position: absolute; top: -6px; left: -14px;
  width: 22px; height: 38px;
  background: #6b4c2a; border: 3px solid #3d2a12; border-radius: 4px;
}

/* ── Scroll inner (between spindles) ── */
.dp-scroll-inner {
  flex: 1; overflow: hidden; display: flex; flex-direction: column;
  background: #f0deb4;
  border-left: 6px solid #c9a96e; border-right: 6px solid #c9a96e;
  box-shadow: inset 4px 0 8px rgba(0,0,0,0.08), inset -4px 0 8px rgba(0,0,0,0.08);
}

/* ── Header ── */
.dp-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px; flex-shrink: 0;
  border-bottom: 2px dashed #c9a96e;
}
.dp-header h2 {
  color: #3d2a12; font-size: 0.65rem; margin: 0;
  font-family: var(--pxfont); text-transform: uppercase; letter-spacing: 1px;
}
.dp-badge {
  font-family: var(--pxfont);
  font-size: 0.45rem; text-transform: uppercase; letter-spacing: 1px;
  padding: 3px 7px; margin-right: 10px; font-weight: 700;
  border: 2px solid; background: rgba(0,0,0,0.06);
}
.dp-close {
  background: #c9a96e; border: 2px solid #8b6a3e; color: #3d2a12;
  font-family: var(--pxfont); font-size: 0.55rem; cursor: pointer;
  padding: 4px 8px; line-height: 1;
}
.dp-close:hover { background: #8b6a3e; color: #f0deb4; }

/* ── Body ── */
.dp-body {
  padding: 16px; overflow-y: auto; flex: 1;
  font-family: var(--pxfont); font-size: 0.5rem; line-height: 2;
  color: #5c3d1e;
}
.dp-body::-webkit-scrollbar { width: 6px; }
.dp-body::-webkit-scrollbar-thumb { background: #c9a96e; border-radius: 3px; }

/* ── Sections ── */
.dp-section { margin-bottom: 18px; }
.dp-section-title {
  font-family: var(--pxfont);
  font-size: 0.5rem; text-transform: uppercase; letter-spacing: 2px;
  color: #40812E; margin-bottom: 10px; padding-bottom: 6px;
  border-bottom: 2px dashed #c9a96e;
}

/* ── Info rows ── */
.dp-info-row { display: flex; justify-content: space-between; padding: 5px 0; }
.dp-info-label { color: #8b6a3e; font-size: 0.45rem; font-family: var(--pxfont); }
.dp-info-value { color: #3d2a12; font-size: 0.45rem; font-family: var(--pxfont); text-align: right; }

/* ── Tags ── */
.dp-tag {
  display: inline-block; font-family: var(--pxfont);
  font-size: 0.4rem; padding: 3px 6px; margin: 3px 3px 3px 0;
  border: 2px solid;
}
.dp-tag-skill { border-color: #40812E; color: #40812E; background: rgba(64,129,46,0.1); }
.dp-tag-mcp   { border-color: #8b6a3e; color: #5c3d1e; background: rgba(139,106,62,0.1); }

/* ── Task items ── */
.task-item {
  padding: 10px 12px; margin-bottom: 8px;
  background: #e8d4a8; border: 2px solid #c9a96e;
  border-left: 4px solid #c9a96e;
}
.task-item.running { border-left-color: #cc7700; }
.task-item.thinking { border-left-color: #634255; }
.task-item.done    { border-left-color: #40812E; opacity: 0.6; }

.task-status {
  font-family: var(--pxfont);
  font-size: 0.4rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px;
}
.task-status.running  { color: #cc7700; }
.task-status.thinking { color: #634255; }
.task-status.done     { color: #40812E; }

.task-name { color: #3d2a12; font-size: 0.45rem; font-family: var(--pxfont); margin-bottom: 3px; }
.task-detail { color: #8b6a3e; font-size: 0.4rem; font-family: var(--pxfont); }

.task-progress { height: 4px; background: #c9a96e; margin-top: 6px; overflow: hidden; }
.task-progress-bar { height: 100%; }
`;
  document.head.appendChild(style);
})();

/* ── Panel functions (globals: agents, ZONE_NAMES) ── */
function openDetailPanel(idx){
  const a=agents[idx];
  document.getElementById('dp-badge').textContent=a.model.toUpperCase();
  document.getElementById('dp-badge').style.cssText=`border-color:${a.color};color:${a.color}`;
  document.getElementById('dp-title').textContent=a.name;
  let h='<div class="dp-section"><div class="dp-section-title">Agent Info</div>';
  h+=`<div class="dp-info-row"><span class="dp-info-label">Role</span><span class="dp-info-value">${a.desc}</span></div>`;
  h+=`<div class="dp-info-row"><span class="dp-info-label">Zone</span><span class="dp-info-value">${ZONE_NAMES[a.zone]}</span></div>`;
  h+=`<div class="dp-info-row"><span class="dp-info-label">State</span><span class="dp-info-value">${a.state}</span></div>`;
  h+='<div style="margin-top:8px">';a.skills.forEach(s=>{h+=`<span class="dp-tag dp-tag-skill">/${s}</span>`;});
  a.mcps.forEach(m=>{h+=`<span class="dp-tag dp-tag-mcp">${m}</span>`;});h+='</div></div>';
  h+='<div class="dp-section"><div class="dp-section-title">Tasks</div>';
  a.tasks.forEach(t=>{
    const icons={running:"\u25B6",thinking:"\u25C6",done:"\u2713"};
    const colors={running:"#cc7700",thinking:"#634255",done:"#40812E"};
    h+=`<div class="task-item ${t.status}"><div class="task-status ${t.status}">${icons[t.status]||"\u25CB"} ${t.status}</div>`;
    h+=`<div class="task-name">${t.name}</div><div class="task-detail">${t.detail}</div>`;
    if(t.status!=="done")h+=`<div class="task-progress"><div class="task-progress-bar" style="width:${t.progress}%;background:${colors[t.status]}"></div></div>`;
    h+='</div>';
  });
  h+='</div>';
  document.getElementById('dp-body').innerHTML=h;
  document.getElementById('detail-panel').classList.add('open');
  document.getElementById('detail-scrim').classList.add('open');
}

function closeDetailPanel(){
  document.getElementById('detail-panel').classList.remove('open');
  document.getElementById('detail-scrim').classList.remove('open');
}

/* ── Event listeners ── */
document.getElementById('dp-close').addEventListener('click',closeDetailPanel);
document.getElementById('detail-scrim').addEventListener('click',closeDetailPanel);
