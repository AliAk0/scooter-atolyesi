"use strict";
/* ORTAK ÇEKİRDEK: sahne, kamera, malzemeler, alt sistem kaydı ve ortak motor durumu. Diğer bütün dosyalar bunu kullanır. */

const stage = document.getElementById("stage");
if (!window.THREE || !THREE.OrbitControls) {
  const d = document.createElement("div"); d.className = "err"; d.textContent = "3B kütüphane yüklenemedi. Sayfayı yenileyin.";
  stage.appendChild(d); throw new Error("three.js yüklenemedi");
}
const el = id => document.getElementById(id);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
stage.insertBefore(renderer.domElement, stage.firstChild);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.5, 1200);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = 10; controls.maxDistance = 140;

scene.add(new THREE.HemisphereLight(0xffffff, 0x3a4552, 0.85));
const key = new THREE.DirectionalLight(0xffffff, 1.0); key.position.set(14, 26, 26); scene.add(key);
const fill = new THREE.DirectionalLight(0xcfe0ff, 0.45); fill.position.set(-25, -6, 12); scene.add(fill);
const rim = new THREE.DirectionalLight(0xffffff, 0.35); rim.position.set(0, 12, -30); scene.add(rim);

const DS = THREE.DoubleSide;
const MAT = {
  alu: new THREE.MeshStandardMaterial({ color: 0xbfc5cc, metalness: 0.55, roughness: 0.34, side: DS }),
  cast: new THREE.MeshStandardMaterial({ color: 0x9aa2ab, metalness: 0.45, roughness: 0.55, side: DS }),
  steel: new THREE.MeshStandardMaterial({ color: 0x8f98a2, metalness: 0.6, roughness: 0.4, side: DS }),
  dark: new THREE.MeshStandardMaterial({ color: 0x5f6770, metalness: 0.55, roughness: 0.45, side: DS }),
  ring: new THREE.MeshStandardMaterial({ color: 0x3c4148, metalness: 0.7, roughness: 0.35 }),
  valve: new THREE.MeshStandardMaterial({ color: 0xa9a196, metalness: 0.6, roughness: 0.4 }),
  spring: new THREE.MeshStandardMaterial({ color: 0x7e8ea3, metalness: 0.6, roughness: 0.35 }),
  ceramic: new THREE.MeshStandardMaterial({ color: 0xece8e0, metalness: 0.0, roughness: 0.5 }),
  brass: new THREE.MeshStandardMaterial({ color: 0xb8925a, metalness: 0.5, roughness: 0.4 }),
  lining: new THREE.MeshStandardMaterial({ color: 0x5a4636, metalness: 0.1, roughness: 0.9 })
};
const lathe = (pts, phi0, phiL, seg) => new THREE.LatheGeometry(pts.map(p => new THREE.Vector2(p[0], p[1])), seg || 64, phi0 || 0, phiL || Math.PI * 2);
const cylZ = (r, h, seg) => { const g = new THREE.CylinderGeometry(r, r, h, seg || 32); g.rotateX(Math.PI / 2); return g; };
class Helix extends THREE.Curve {
  constructor(r, len, turns, axis) { super(); this.r = r; this.len = len; this.turns = turns; this.axis = axis; }
  getPoint(t, out) {
    const a = t * Math.PI * 2 * this.turns, v = out || new THREE.Vector3();
    return this.axis === "y" ? v.set(this.r * Math.cos(a), t * this.len, this.r * Math.sin(a)) : v.set(this.r * Math.cos(a), this.r * Math.sin(a), t * this.len);
  }
}

/* Alt sistem: kendi kök grubu, parça kaydı, seçimi ve ayırma durumu olan bağımsız birim.
   Sözleşme: def = { id, PARTS{kimlik:{ad, grup, islev, kontrol, ayir:[x,y,z]}}, GROUPS[], view{target, dir, hw, hh, k},
                     metin{eyebrow, title, lead, note, foot}, build(sys), update(sys, dt, S), defaultSel } */
/* Kayıt: her createSystem çağrısı alt sistemi buraya ekler; sekmeler ve arayüz bu kayıttan çalışır. */
const REG = {};
function createSystem(def) {
  const sys = Object.assign({ root: new THREE.Group(), parts: {}, pickables: [], ex: 0, exT: 0, sel: def.defaultSel, cam: null }, def);
  sys.root.visible = false; scene.add(sys.root);
  sys.makePart = id => { const root = new THREE.Group(); sys.root.add(root); return (sys.parts[id] = { id, root, meshes: [] }); };
  sys.addMesh = (part, geom, mat, parent) => {
    const m = new THREE.Mesh(geom, mat.clone()); m.userData.partId = part.id;
    (parent || part.root).add(m); part.meshes.push(m); sys.pickables.push(m); return m;
  };
  sys.place = (part, x, y, z) => { const a = sys.PARTS[part.id].ayir; part.root.position.set(x + a[0] * sys.ex, y + a[1] * sys.ex, z + a[2] * sys.ex); };
  def.build(sys);
  REG[def.id] = sys;
  return sys;
}

const TOK = { line: "#c9d0d7", muted: "#56616d", ac: "#d9732b", dc: "#c23b30", sig: "#3f7fc0", mono: "monospace" };
/* Ortak motor durumu: iki alt sistem aynı gaz kolunu ve aynı devri paylaşır */
const S = { temp: 1, thr: 0, rpm: 1700, on: true, run: true, hold: false, batt: "iyi", chat: 0, startT: 0, cranking: false, relay: false };
const BAT = { iyi: { rest: 12.7, sag: 10.2, amp: 45, crank: 550 }, zayif: { rest: 12.2, sag: 8.3, amp: 30, crank: 240 }, bitik: { rest: 11.6, sag: 5.2, amp: 8, crank: 0 } };

const v3 = new THREE.Vector3();
function placeTag(tag, x, y, z) {
  v3.set(x, y, z).project(camera);
  tag.style.left = ((v3.x + 1) / 2 * stage.clientWidth) + "px"; tag.style.top = ((1 - v3.y) / 2 * stage.clientHeight) + "px";
  tag.style.visibility = v3.z > 1 ? "hidden" : "visible";
}
