"use strict";
/* ALT SİSTEM: ön hidrolik disk ve arka kampana fren */

const BRK = { f: 0, r: 0 };
const FR = { m: 155, rw: 0.205, lever: 4.5, dm: 0.011, dc: 0.030, mu: 0.4, reff: 0.085, rearNmPerN: 1.0, gripF: 820, gripR: 547 };
FR.am = Math.PI * (FR.dm / 2) ** 2; FR.ac = Math.PI * (FR.dc / 2) ** 2;
const FREN = createSystem({
  id: "fren", tab: "Frenler", defaultSel: "kaliper",
  metin: {
    eyebrow: "Ön hidrolik disk · Arka kampana",
    title: "Fren Sistemi",
    lead: "Gazla hızlan, sonra fren kollarını sık. Ön fren elinin kuvvetini hidrolikle büyütür, arka fren aynı işi tel ve kollarla yapar. Fazla sıkarsan teker kilitlenir.",
    note: "Ana merkez Ø 11 mm, kaliper pistonu Ø 30 mm: alan oranı 7,4 kat, kol oranıyla birlikte el kuvveti yaklaşık 33 kat büyür. Ölçüler, kuvvetler ve tutunma sınırları yaklaşık örnektir.",
    foot: "Balata ve pabuç boşlukları görünsün diye abartılı çizildi; gerçekte milimetrenin altındadır. Teker dönüşü izlenebilsin diye yavaşlatıldı. Tekerler saydam, kampana ise içindeki pabuçlar görünsün diye ön yüzü açık çizildi."
  },
  view: { ground: null, target: [0, 9, 0], dir: [0.18, 0.16, 0.97], hw: 47, hh: 29, k: 1.04, minD: 15, maxD: 320 },
  GROUPS: ["Ön fren · hidrolik disk", "Arka fren · kampana"],
  PARTS: {
    on_kol: { ad: "Fren kolu ve ana merkez", grup: "Ön fren · hidrolik disk", ayir: [0, 6, 4],
      islev: "Kol, ana merkezdeki küçük pistonu iter. Kapalı bir sıvı sisteminde basınç her yere eşit iletildiği için (Pascal ilkesi), küçük pistondaki kuvvet kaliperdeki büyük pistonda alan oranı kadar büyür. Üstteki haznede fren hidroliği vardır; kolda stop lambası anahtarı bulunur.",
      kontrol: "Hazne seviyesi ve hidroliğin rengi kontrol edilir; hidrolik nem çektiği için belli aralıklarla değiştirilir. Kol süngerimsi geliyorsa hatta hava vardır." },
    disk: { ad: "Fren diski", grup: "Ön fren · hidrolik disk", ayir: [0, 0, 7],
      islev: "Ön tekerin göbeğine cıvatalanır, tekerle birlikte döner. Balatalar sıkıştırınca sürtünme hareket enerjisini ısıya çevirir. Delikler ağırlığı azaltır, ısının ve tozun atılmasına yardım eder.",
      kontrol: "Kalınlık üzerinde yazan en az değerin altına inmişse ya da disk eğilmişse değiştirilir; eğri disk frende kolda titreşim yapar." },
    kaliper: { ad: "Kaliper", grup: "Ön fren · hidrolik disk", ayir: [5, -4, 11],
      islev: "Diski iki yandan saran gövdedir. Bu sınıfta genellikle tek pistonlu kayar tip kaliper kullanılır: piston bir taraftaki balatayı iter, gövde pimler üzerinde kayarak karşı balatayı da diske çeker; böylece iki taraf eşit sıkışır.",
      kontrol: "Kayar pimler kuru ve paslıysa balatalardan biri diske sürtmeye devam eder ve disk ısınır." },
    balata: { ad: "Balatalar", grup: "Ön fren · hidrolik disk", ayir: [8, -7, 15],
      islev: "Çelik bir sırta yapıştırılmış sürtünme malzemesidir. Basınç kalkınca piston keçesi esneyerek pistonu çok az geri çeker; bu yüzden balata diske neredeyse değecek kadar yakın bekler.",
      kontrol: "Balata kalınlığı ve aşınma çentiği kontrol edilir; sırt diske değerse disk çizilir." },
    arka_kol: { ad: "Fren kolu ve teli", grup: "Arka fren · kampana", ayir: [0, 6, 4],
      islev: "Sol koldaki fren kolu çelik bir teli çeker; tel kampanadaki kam kolunu döndürür. Sistem tamamen mekaniktir, kuvvet kolların oranıyla büyür.",
      kontrol: "Tel gerginliği kampanadaki ayar somunuyla yapılır; kol boşluğu kılavuzdaki değerde olmalı." },
    kampana: { ad: "Kampana (tambur)", grup: "Arka fren · kampana", ayir: [0, 0, 8],
      islev: "Arka teker göbeğinin içindeki çelik tamburdur, tekerle döner. Pabuçlar iç yüzeyine bastırılınca fren yapar. Kapalı yapısı suya ve çamura karşı korunaklıdır ama ısıyı diske göre daha zor atar.",
      kontrol: "İç yüzeydeki çizikler kontrol edilir; ıslandıktan sonra kısa süre fren gücü düşebilir." },
    pabuc: { ad: "Fren pabuçları ve yaylar", grup: "Arka fren · kampana", ayir: [0, 0, 4],
      islev: "İki yarım ay biçimli pabuç bir uçtan pime dayanır, diğer uçtan kamla açılır. Dönüş yönüne göre öndeki pabuç sürtünmeyle kendini tambura daha çok bastırır. Yaylar fren bırakılınca pabuçları geri çeker.",
      kontrol: "Balata kalınlığına bakılır; fren tablasındaki aşınma göstergesi kolu sıkarak okunur." },
    kam: { ad: "Kam mili ve fren tablası", grup: "Arka fren · kampana", ayir: [0, 0, -6],
      islev: "Tabla yerinde sabittir ve pabuçları taşır. Kam milinin dışındaki kol tel ile çekilince içerideki yassı kam döner ve pabuçların uçlarını birbirinden ayırır.",
      kontrol: "Kam mili kuru ve paslıysa fren bırakılınca pabuçlar geri dönmeyebilir." }
  },
  build(sys) {
    const B = sys.b = { v: 0, a: 0, angF: 0, angR: 0, lastTxt: "" };
    const XF = -24, XR = 24, XL = 31;
    const ghostT = new THREE.MeshStandardMaterial({ color: 0x5c646d, metalness: 0.1, roughness: 0.8, transparent: true, opacity: 0.12, depthWrite: false, side: DS });
    const black = new THREE.MeshStandardMaterial({ color: 0x2a2d31, metalness: 0.1, roughness: 0.6 });
    const fluid = new THREE.MeshStandardMaterial({ color: 0x7a5a1a, metalness: 0, roughness: 0.3, transparent: true, opacity: 0.8 });
    const clear = new THREE.MeshStandardMaterial({ color: 0xdfe6ec, metalness: 0, roughness: 0.1, transparent: true, opacity: 0.35, depthWrite: false });
    B.deco = new THREE.Group(); sys.root.add(B.deco);

    /* saydam tekerler (seçilemez) */
    B.wF = new THREE.Group(); B.wF.position.set(XF, 0, 0); sys.root.add(B.wF);
    B.wR = new THREE.Group(); B.wR.position.set(XR, 0, 0); sys.root.add(B.wR);
    [B.wF, B.wR].forEach(w => {
      w.add(new THREE.Mesh(new THREE.TorusGeometry(16, 4.5, 16, 56), ghostT));
      w.add(new THREE.Mesh(new THREE.TorusGeometry(12.7, 0.9, 10, 48), MAT.alu));
      for (let i = 0; i < 5; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(9.6, 1.4, 1.0), MAT.alu); const a = i * 2 * Math.PI / 5; sp.position.set(Math.cos(a) * 8.0, Math.sin(a) * 8.0, -1.2); sp.rotation.z = a; w.add(sp); }
    });

    /* ---- ön: disk ---- */
    const pD = sys.makePart("disk"); B.discSpin = new THREE.Group(); B.discSpin.position.set(XF, 0, 0); pD.root.add(B.discSpin);
    { const sh = new THREE.Shape(); sh.absarc(0, 0, 9.5, 0, Math.PI * 2, false);
      const hole = new THREE.Path(); hole.absarc(0, 0, 2.2, 0, Math.PI * 2, true); sh.holes.push(hole);
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, h = new THREE.Path(); h.absarc(Math.cos(a) * 8.0, Math.sin(a) * 8.0, 0.42, 0, Math.PI * 2, true); sh.holes.push(h); }
      for (let i = 0; i < 5; i++) { const a = i * 2 * Math.PI / 5 + 0.3, h = new THREE.Path(); h.absarc(Math.cos(a) * 4.7, Math.sin(a) * 4.7, 1.2, 0, Math.PI * 2, true); sh.holes.push(h); }
      const g = new THREE.ExtrudeGeometry(sh, { depth: 0.4, bevelEnabled: false, curveSegments: 40 }); g.translate(0, 0, 2.4); sys.addMesh(pD, g, MAT.steel, B.discSpin); }
    { const g = cylZ(2.6, 3.4, 24); g.translate(0, 0, 0.6); sys.addMesh(pD, g, MAT.alu, B.discSpin); }

    /* ---- ön: kaliper ve balatalar ---- */
    const CA = -0.62, CR = 8.4;
    const pK = sys.makePart("kaliper"); const kg = new THREE.Group(); kg.position.set(XF + CR * Math.cos(CA), CR * Math.sin(CA), 0); kg.rotation.z = CA; pK.root.add(kg);
    { const o = sys.addMesh(pK, new THREE.BoxGeometry(3.0, 4.4, 1.7), MAT.dark, kg); o.position.set(0.3, 0, 2.6 + 1.6); }
    { const i = sys.addMesh(pK, new THREE.BoxGeometry(3.0, 4.4, 1.0), MAT.dark, kg); i.position.set(0.3, 0, 2.6 - 1.25); }
    { const b = sys.addMesh(pK, new THREE.BoxGeometry(1.0, 4.4, 4.0), MAT.dark, kg); b.position.set(2.1, 0, 2.6 + 0.2); }
    B.piston = sys.addMesh(pK, cylZ(1.1, 0.8, 24), MAT.steel, kg);
    const pB = sys.makePart("balata"); const bg = new THREE.Group(); bg.position.copy(kg.position); bg.rotation.z = CA; pB.root.add(bg);
    B.padO = new THREE.Group(); B.padI = new THREE.Group(); bg.add(B.padO, B.padI);
    [[B.padO, 1], [B.padI, -1]].forEach(([g, sg]) => {
      const lin = sys.addMesh(pB, new THREE.BoxGeometry(2.3, 3.6, 0.35), MAT.lining, g); lin.position.z = sg * 0.175;
      const back = sys.addMesh(pB, new THREE.BoxGeometry(2.5, 3.9, 0.2), MAT.steel, g); back.position.z = sg * 0.45;
    });

    /* ---- ön: kol ve ana merkez ---- */
    const pO = sys.makePart("on_kol"); const og = new THREE.Group(); og.position.set(XF, XL, 0); pO.root.add(og);
    { const g = new THREE.CylinderGeometry(1.1, 1.1, 14, 16); g.rotateZ(Math.PI / 2); g.translate(-1, 0, -0.5); sys.addMesh(pO, g, MAT.steel, og);
      const grip = new THREE.CylinderGeometry(1.6, 1.6, 6, 16); grip.rotateZ(Math.PI / 2); grip.translate(-5.5, 0, -0.5); sys.addMesh(pO, grip, black, og); }
    { const mc = sys.addMesh(pO, new THREE.BoxGeometry(4.2, 2.2, 2.2), MAT.alu, og); mc.position.set(4.6, -0.4, 1.4); }
    { const rv = sys.addMesh(pO, new THREE.BoxGeometry(3.2, 2.2, 2.0), clear, og); rv.position.set(4.6, 1.9, 1.4);
      const fl = new THREE.Mesh(new THREE.BoxGeometry(2.9, 1.4, 1.7), fluid); fl.position.set(4.6, 1.6, 1.4); og.add(fl); }
    B.leverF = new THREE.Group(); B.leverF.position.set(2.4, -1.0, 2.4); og.add(B.leverF);
    { const lv = sys.addMesh(pO, new THREE.BoxGeometry(10, 0.7, 0.6), MAT.steel, B.leverF); lv.position.set(-5, -1.0, 0); lv.rotation.z = 0.08; }
    B.mcPiston = sys.addMesh(pO, new THREE.CylinderGeometry(0.45, 0.45, 1.6, 12), MAT.steel, og); B.mcPiston.rotation.z = Math.PI / 2; B.mcPiston.position.set(3.0, -0.4, 1.4);

    /* hidrolik hortum (seçilemez) */
    B.hoseMat = new THREE.MeshStandardMaterial({ color: 0x2c2f34, metalness: 0.2, roughness: 0.5 });
    const kp = kg.position;
    B.deco.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[XF + 6.8, XL - 0.4, 1.4], [XF + 12, 22, 3], [XF + 12.5, 8, 4.5], [kp.x + 1.2, kp.y + 1.6, 4.8]].map(p => new THREE.Vector3(...p))), 80, 0.45, 10, false), B.hoseMat));

    /* ---- arka: kampana ---- */
    const pM = sys.makePart("kampana"); B.drumSpin = new THREE.Group(); B.drumSpin.position.set(XR, 0, 0); pM.root.add(B.drumSpin);
    { const g = lathe([[5.5, -1.3], [6.1, -1.3], [6.1, 1.7], [5.5, 1.7], [5.5, -1.3]], 0, 0, 72); g.rotateX(Math.PI / 2);
      sys.addMesh(pM, g, new THREE.MeshStandardMaterial({ color: 0x9aa2ab, metalness: 0.45, roughness: 0.5, transparent: true, opacity: 0.38, depthWrite: false, side: DS }), B.drumSpin); }
    for (let i = 0; i < 16; i++) { const m = sys.addMesh(pM, new THREE.BoxGeometry(0.3, 0.3, 2.6), MAT.dark, B.drumSpin); const a = i * Math.PI / 8; m.position.set(Math.cos(a) * 6.2, Math.sin(a) * 6.2, 0.2); m.rotation.z = a; }

    /* ---- arka: pabuçlar ---- */
    const pP = sys.makePart("pabuc"); const pg = new THREE.Group(); pg.position.set(XR, 0, 0); pP.root.add(pg);
    const PIV = new THREE.Vector2(0, -4.1);
    B.shoes = [];
    [[Math.PI, 1], [0, -1]].forEach(([mid, sg]) => {
      const hold = new THREE.Group(); hold.position.set(PIV.x, PIV.y, 0); pg.add(hold);
      const inner = new THREE.Group(); inner.position.set(-PIV.x, -PIV.y, 0); hold.add(inner);
      const h = 72 * Math.PI / 180, a0 = mid - h, a1 = mid + h;
      const ring = (r1, r2, d, z, mat) => { const sh = new THREE.Shape(); sh.moveTo(r2 * Math.cos(a0), r2 * Math.sin(a0)); sh.absarc(0, 0, r2, a0, a1, false); sh.lineTo(r1 * Math.cos(a1), r1 * Math.sin(a1)); sh.absarc(0, 0, r1, a1, a0, true);
        const g = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false, curveSegments: 24 }); g.translate(0, 0, z); return sys.addMesh(pP, g, mat, inner); };
      ring(4.85, 5.25, 2.0, -0.9, MAT.lining); ring(4.45, 4.85, 2.0, -0.9, MAT.steel);
      B.shoes.push({ hold, sg });
    });
    [[0, 3.6], [0, -3.6]].forEach(([x, y]) => { const g = new THREE.TubeGeometry(new Helix(0.28, 5.6, 9, "y"), 140, 0.08, 6, false); g.rotateZ(Math.PI / 2); g.translate(2.8, y, 1.4); sys.addMesh(pP, g, MAT.spring, pg); });

    /* ---- arka: kam ve tabla ---- */
    const pC = sys.makePart("kam"); const cg = new THREE.Group(); cg.position.set(XR, 0, 0); pC.root.add(cg);
    { const g = cylZ(5.6, 0.3, 64); g.translate(0, 0, -1.4); sys.addMesh(pC, g, MAT.cast, cg); }
    { const pin = sys.addMesh(pC, cylZ(0.45, 2.4, 14), MAT.dark, cg); pin.position.set(PIV.x, PIV.y, 0); }
    B.cam = new THREE.Group(); B.cam.position.set(0, 4.25, 0); cg.add(B.cam);
    sys.addMesh(pC, new THREE.BoxGeometry(1.7, 0.55, 2.0), MAT.dark, B.cam);
    sys.addMesh(pC, cylZ(0.3, 4.4, 12), MAT.dark, B.cam).position.z = -1.6;
    B.camArm = new THREE.Group(); B.camArm.position.set(0, 4.25, -3.4); cg.add(B.camArm);
    { const arm = sys.addMesh(pC, new THREE.BoxGeometry(4.2, 0.7, 0.5), MAT.steel, B.camArm); arm.position.set(2.1, 0, 0); }

    /* ---- arka: kol ve tel ---- */
    const pA = sys.makePart("arka_kol"); const ag = new THREE.Group(); ag.position.set(XR, XL, 0); pA.root.add(ag);
    { const g = new THREE.CylinderGeometry(1.1, 1.1, 14, 16); g.rotateZ(Math.PI / 2); g.translate(1, 0, -0.5); sys.addMesh(pA, g, MAT.steel, ag);
      const grip = new THREE.CylinderGeometry(1.6, 1.6, 6, 16); grip.rotateZ(Math.PI / 2); grip.translate(5.5, 0, -0.5); sys.addMesh(pA, grip, black, ag); }
    { const hs = sys.addMesh(pA, new THREE.BoxGeometry(2.6, 2.0, 2.0), MAT.alu, ag); hs.position.set(-4.0, -0.3, 1.4); }
    B.leverR = new THREE.Group(); B.leverR.position.set(-2.4, -1.0, 2.4); ag.add(B.leverR);
    { const lv = sys.addMesh(pA, new THREE.BoxGeometry(10, 0.7, 0.6), MAT.steel, B.leverR); lv.position.set(5, -1.0, 0); lv.rotation.z = -0.08; }
    B.cableMat = new THREE.MeshStandardMaterial({ color: 0x2c2f34, metalness: 0.2, roughness: 0.5 });
    B.deco.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[XR - 4.8, XL - 0.4, 1.4], [XR - 11, 22, 0], [XR - 9, 10, -3.4], [XR + 4.1, 4.4, -3.4]].map(p => new THREE.Vector3(...p))), 80, 0.3, 8, false), B.cableMat));
  },
  update(sys, dt, S) {
    const B = sys.b, P = sys.place;
    Object.values(sys.parts).forEach(p => P(p, 0, 0, 0));
    B.deco.visible = sys.ex < 0.04;
    /* fiziksel model (örnek) */
    const v = B.v, eng = (t => t * t * (3 - 2 * t))(Math.min(1, Math.max(0, (S.rpm - 2800) / 800)));
    const drive = eng * Math.min(S.thr * 260, S.thr * 1400 / Math.max(v, 1));
    const hf = BRK.f * 120, hr = BRK.r * 120;
    const pres = hf * FR.lever / FR.am, clamp = pres * FR.ac;
    let Ff = 2 * FR.mu * clamp * FR.reff / FR.rw, Fr = hr * FR.rearNmPerN / FR.rw;
    const lockF = v > 0.3 && Ff > FR.gripF, lockR = v > 0.3 && Fr > FR.gripR;
    if (lockF) Ff = FR.gripF * 0.7; if (lockR) Fr = FR.gripR * 0.7;
    const drag = v > 0 ? 0.48 * v * v + 15 : 0;
    let net = drive - drag - (v > 0.01 ? Ff + Fr : 0);
    if (v <= 0.01 && drive <= Ff + Fr) net = Math.min(0, net);
    const a = net / FR.m; B.v = Math.max(0, v + a * dt); B.a += (a - B.a) * Math.min(1, dt * 6);
    const w = B.v / FR.rw * 0.16;
    if (!lockF) B.angF -= w * dt; if (!lockR) B.angR -= w * dt;
    B.discSpin.rotation.z = B.angF; B.wF.rotation.z = B.angF; B.drumSpin.rotation.z = B.angR; B.wR.rotation.z = B.angR;

    /* mekanizma */
    B.leverF.rotation.z = BRK.f * 0.32; B.leverR.rotation.z = -BRK.r * 0.32;
    B.mcPiston.position.x = 3.0 - BRK.f * 0.5;
    const gapF = 0.32 * (1 - Math.min(1, BRK.f / 0.08));
    B.padO.position.z = 2.6 + 0.2 + gapF; B.padI.position.z = 2.6 - 0.2 - gapF; B.piston.position.set(0, 0, 2.6 + 0.2 + gapF + 0.95);
    B.hoseMat.color.setRGB(0.17 + 0.55 * Math.min(1, pres / 8e6), 0.18, 0.2).convertSRGBToLinear();
    const close = Math.min(1, BRK.r / 0.1), d = 0.045 * close + 0.006 * Math.max(0, BRK.r - 0.1);
    B.shoes.forEach(s => s.hold.rotation.z = s.sg * d);
    B.cam.rotation.z = BRK.r * 0.55; B.camArm.rotation.z = BRK.r * 0.55;

    placeTag(el("tagBF"), -24, 37, 0); placeTag(el("tagBR"), 24, 37, 0);

    const kmh = Math.round(B.v * 3.6), txt = kmh + "|" + B.a.toFixed(1) + "|" + Math.round(pres / 1e5) + "|" + lockF + lockR;
    if (txt === B.lastTxt) return; B.lastTxt = txt;
    el("bV").textContent = kmh + " km/sa";
    el("bA").textContent = (B.a > 0.05 ? "+" : B.a < -0.05 ? "−" : "") + Math.abs(B.a).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " m/s²";
    el("bP").textContent = Math.round(pres / 1e5) + " bar";
    el("bC").textContent = clamp >= 1000 ? (clamp / 1000).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " kN" : Math.round(clamp) + " N";
    const ws = (id, lock) => { const e = el(id); if (lock) { e.className = "state bad"; e.textContent = "Kilitlendi · kayıyor"; } else if (B.v > 0.3) { e.className = "state on"; e.textContent = "Dönüyor"; } else { e.className = "state off"; e.textContent = "Duruyor"; } };
    ws("bWF", lockF); ws("bWR", lockR);
  }
});

[["brF", "f"], ["brR", "r"]].forEach(([id, k]) => { const r = el(id), on = () => { BRK[k] = r.value / 100; el(id + "Val").textContent = "%" + r.value; r.style.setProperty("--fill", r.value + "%"); }; r.addEventListener("input", on); on(); });
