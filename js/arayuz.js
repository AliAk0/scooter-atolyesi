"use strict";
/* ORTAK ARAYÜZ: sekmeler, gaz, kontak ve marş, ayırma, seçim, kamera, tema ve ana döngü. En son yüklenir. */

const SYSTEMS = REG;
const HOME = Object.values(REG).find(s => s.home) || Object.values(REG)[0];
/* ana görünüme monte edilen alt sistemler: { altSistemId: "genel görünümdeki parça kimliği" } */
const MOUNTS = HOME.mounts || {};
const SUBS = Object.keys(MOUNTS).map(id => REG[id]);
let active = null, userMoved = false;
const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const thr = el("thr");
function onThr() { S.thr = thr.value / 100; el("thrVal").textContent = "%" + thr.value; thr.style.setProperty("--fill", thr.value + "%"); }
thr.addEventListener("input", onThr); onThr();
const bKey = el("btnKey"), bStart = el("btnStart");
bKey.addEventListener("click", () => { S.on = !S.on; if (!S.on) S.run = false; bKey.setAttribute("aria-pressed", String(S.on)); bKey.textContent = S.on ? "Kontak açık" : "Kontak kapalı"; });
const hold = v => { S.hold = v; bStart.setAttribute("aria-pressed", String(v)); };
bStart.addEventListener("pointerdown", e => { e.preventDefault(); try { bStart.setPointerCapture(e.pointerId); } catch (_) {} hold(true); });
["pointerup", "pointercancel", "lostpointercapture"].forEach(ev => bStart.addEventListener(ev, () => hold(false)));
bStart.addEventListener("keydown", e => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); hold(true); } });
bStart.addEventListener("keyup", e => { if (e.key === " " || e.key === "Enter") hold(false); });
bStart.addEventListener("contextmenu", e => e.preventDefault());
let lastEng = "";
function engineStep(dt) {
  S.cranking = S.hold && S.on && !S.run;
  const bt = BAT[S.batt];
  if (S.cranking && S.batt === "bitik") { S.chat = (S.chat + dt * 7) % 1; S.relay = S.chat < 0.5; } else S.relay = S.cranking;
  const target = S.run ? 1700 + S.thr * 5800 : S.cranking && S.relay ? bt.crank : 0;
  S.rpm += (target - S.rpm) * Math.min(1, dt * (S.run ? 3 : S.cranking ? 6 : 1.6));
  if (S.rpm < 5 && target === 0) S.rpm = 0;
  S.temp = S.run ? Math.min(1, S.temp + dt / 22) : Math.max(0, S.temp - dt / 240);
  if (S.cranking && S.rpm > 350) { S.startT += dt; if (S.startT > 0.6) { S.run = true; S.startT = 0; } } else S.startT = 0;
  let txt, cls;
  if (S.run) { txt = "Motor çalışıyor"; cls = "on"; }
  else if (!S.on) { txt = "Kontak kapalı"; cls = "off"; }
  else if (S.cranking) {
    if (S.batt === "iyi") { txt = "Marş dönüyor"; cls = "mid"; }
    else if (S.batt === "zayif") { txt = "Marş ağır dönüyor · motor çalışmıyor"; cls = "bad"; }
    else { txt = "Röle tıkırdıyor · marş dönmüyor"; cls = "bad"; }
  } else { txt = "Motor durdu · marşa basılı tut"; cls = "off"; }
  if (txt !== lastEng) { const e = el("engState"); e.className = "state " + cls; e.textContent = txt; lastEng = txt; }
}

const bEx = el("btnExplode");
function syncExBtn() { const on = active.exT === 1; bEx.setAttribute("aria-pressed", String(on)); bEx.textContent = on ? "Birleştir" : "Ayır"; }
bEx.addEventListener("click", () => { active.exT = active.exT === 1 ? 0 : 1; if (reduce) active.ex = active.exT; syncExBtn(); });

const accentCol = new THREE.Color();
const glow = (m, on) => on ? m.material.emissive.copy(accentCol).multiplyScalar(0.42) : m.material.emissive.setRGB(0, 0, 0);
function paintSel(sys) {
  Object.values(sys.parts).forEach(p => p.meshes.forEach(m => glow(m, p.id === sys.sel)));
  if (sys === HOME) SUBS.forEach(sub => { const on = sys.sel === MOUNTS[sub.id];
    Object.values(sub.parts).forEach(p => p.meshes.forEach(m => glow(m, on))); });
}
function ownerOf(obj) {
  if (active !== HOME) return obj.userData.partId;
  for (let o = obj; o; o = o.parent) for (const sub of SUBS) if (o === sub.root) return MOUNTS[sub.id];
  return obj.userData.partId;
}
function showCard(sys) {
  const P = sys.PARTS[sys.sel]; if (!P) return;
  el("kGrp").textContent = P.grup; el("kName").textContent = P.ad; el("kWhat").textContent = P.islev;
  const chk = el("kChk"); chk.textContent = ""; const b = document.createElement("b"); b.textContent = "Kontrol: "; chk.append(b, document.createTextNode(P.kontrol));
  document.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", String(c.dataset.part === sys.sel)));
  const go = el("kGo"); go.hidden = !P.alt;
  if (P.alt) { go.href = "#" + P.alt; go.textContent = SYSTEMS[P.alt].tab + " sayfasını aç"; }
}
function select(id) { active.sel = id; showCard(active); paintSel(active); }
function buildChips(sys) {
  const wrap = el("chipWrap"); wrap.textContent = "";
  sys.GROUPS.forEach(g => {
    const box = document.createElement("div"); box.className = "chips-grp";
    const h = document.createElement("span"); h.className = "chips-h"; h.textContent = g; box.appendChild(h);
    const row = document.createElement("div"); row.className = "chips";
    Object.keys(sys.PARTS).filter(k => sys.PARTS[k].grup === g).forEach(k => {
      const b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.id = "chip-" + sys.id + "-" + k;
      b.dataset.part = k; b.textContent = sys.PARTS[k].ad; b.setAttribute("aria-pressed", "false"); b.addEventListener("click", () => select(k)); row.appendChild(b);
    });
    box.appendChild(row); wrap.appendChild(box);
  });
}

function fit() {
  const w = stage.clientWidth, h = stage.clientHeight; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false);
  const vh = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), v = active.view;
  return Math.max(v.hw / (vh * camera.aspect), v.hh / vh) * v.k;
}
function resetView() {
  const dist = fit(), v = active.view; controls.target.set(...v.target);
  controls.minDistance = v.minD || 10; controls.maxDistance = v.maxD || 140;
  camera.position.copy(controls.target).addScaledVector(new THREE.Vector3(...v.dir).normalize(), dist); controls.update(); userMoved = false;
}
el("btnReset").addEventListener("click", resetView);
new ResizeObserver(() => { if (!active) return; if (userMoved) fit(); else resetView(); }).observe(stage);

function activate(id) {
  const next = SYSTEMS[id] || HOME; if (next === active) return;
  if (active) active.cam = { pos: camera.position.clone(), target: controls.target.clone(), moved: userMoved };
  SUBS.forEach(sub => {
    if (next === HOME) {
      HOME.mountPoint(sub.id).add(sub.root); sub.root.visible = true;
      if (sub.savedExT === undefined) sub.savedExT = sub.exT;
      sub.ex = sub.exT = 0;
    } else {
      scene.add(sub.root); sub.root.visible = sub === next;
      if (sub.savedExT !== undefined) { sub.exT = sub.ex = sub.savedExT; delete sub.savedExT; }
    }
  });
  Object.values(REG).forEach(s => { if (!SUBS.includes(s)) s.root.visible = s === next; });
  active = next;
  document.querySelectorAll("[data-only]").forEach(n => { n.hidden = n.dataset.only !== active.id; });
  document.querySelectorAll(".tab").forEach(t => { if (t.dataset.sys === active.id) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current"); });
  const m = active.metin; el("hEyebrow").textContent = m.eyebrow; el("hTitle").textContent = m.title; el("hLead").textContent = m.lead;
  el("noteTxt").textContent = m.note; el("footTxt").textContent = m.foot;
  buildChips(active); showCard(active); paintSel(active); syncExBtn();
  if (active.cam && active.cam.moved) { fit(); controls.minDistance = active.view.minD || 10; controls.maxDistance = active.view.maxD || 140;
    camera.position.copy(active.cam.pos); controls.target.copy(active.cam.target); controls.update(); userMoved = true; }
  else resetView();
  applyStage(active.view);
}
const fromHash = () => (location.hash || "").replace("#", "");
window.addEventListener("hashchange", () => activate(fromHash()));

const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let down = null;
renderer.domElement.addEventListener("pointerdown", e => { down = [e.clientX, e.clientY]; userMoved = true; });
renderer.domElement.addEventListener("pointerup", e => {
  if (!down) return; const d = Math.hypot(e.clientX - down[0], e.clientY - down[1]); down = null; if (d > 6) return;
  const r = renderer.domElement.getBoundingClientRect();
  ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const pool = active === HOME ? SUBS.reduce((a, s) => a.concat(s.pickables), HOME.pickables.slice()) : active.pickables;
  const hit = ray.intersectObjects(pool, false)[0]; if (hit) select(ownerOf(hit.object));
});

function applyTheme() {
  const cs = getComputedStyle(document.documentElement);
  scene.background = new THREE.Color(cs.getPropertyValue("--stage").trim() || "#d8dde2");
  accentCol.set(cs.getPropertyValue("--accent").trim() || "#d99a00").convertSRGBToLinear();
  const g = n => cs.getPropertyValue(n).trim();
  TOK.line = g("--line") || TOK.line; TOK.muted = g("--muted") || TOK.muted; TOK.ac = g("--w-ac") || TOK.ac; TOK.dc = g("--w-dc") || TOK.dc; TOK.sig = g("--w-sig") || TOK.sig; TOK.mono = g("--f-mono") || TOK.mono;
  if (active) paintSel(active);
}
if (window.matchMedia) window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);
new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

let prev = performance.now();
function frame(now) {
  const dt = Math.min(0.05, Math.max(0, (now - prev) / 1000)); prev = now;
  engineStep(dt);
  active.ex += (active.exT - active.ex) * Math.min(1, dt * 5);
  active.update(active, dt, S);
  controls.update(); renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
linearizeScene(); applyTheme(); activate(fromHash());
requestAnimationFrame(frame);
