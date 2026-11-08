"use strict";
/* ALT SİSTEM: yakıt ve hava, CV karbüratör */

const carbModel = S => {
  const thr = S.thr, run = S.rpm > 150;
  const butter = 6 + 84 * thr;
  const ve = 0.2 + 0.8 * Math.sqrt(thr), air = run ? (S.rpm / 7500) * ve : 0;
  const choke = Math.min(1, Math.max(0, (0.7 - S.temp) / 0.4));
  const lift = Math.min(1, Math.max(0, (air - 0.07) / 0.6));
  const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const main = sm(0.03, 0.35, lift), pilot = 1 - main;
  let afr = 13.4 + 1.2 * Math.min(1, lift / 0.6) - 1.8 * Math.max(0, (thr - 0.75) / 0.25);
  afr -= 4.0 * choke;
  const airgps = 3.7 * air, fuelLh = run ? airgps / afr * 3.6 / 0.74 : 0;
  return { butter, air, choke, lift, main, pilot, afr, fuelLh, run };
};
const CARB = createSystem({
  id: "karburator", tab: "Karbüratör", defaultSel: "surgu",
  metin: {
    eyebrow: "GY6 tipi · Sabit hızlı (CV) karbüratör · Otomatik jikle",
    title: "Yakıt ve Hava Sistemi",
    lead: "Gaz kolu kelebeği açar; sürgüyü ise motorun çektiği havanın vakumu kaldırır. Gazı yavaşça aç ve yakıtın önce rölanti jiklöründen, sonra iğne ve ana jiklörden gelmeye başladığını izle.",
    note: "Mavi noktalar havayı, sarı noktalar yakıtı temsil eder; akış emme supabı açıldıkça ilerler. Hava/yakıt oranı ve tüketim yaklaşık örnektir. Normal sürüşte oran 14,7'ye yakındır; tam gazda ve soğuk motorda bilerek zenginleştirilir.",
    foot: "Karbüratör içi görünsün diye saydam ve büyütülmüş çizildi. Gerçek karbüratörde jiklörler gövdenin içindeki kanallarla birbirine bağlıdır; burada sadeleştirildi. Gerçek motorda karbüratör silindir kapağının üstünde, hava filtresi kutusu ise CVT kapağının üstündedir."
  },
  view: { target: [-4, -1, 0], dir: [0.3, 0.32, 0.9], hw: 40, hh: 20, k: 1.06, minD: 10, maxD: 250 },
  GROUPS: ["Hava yolu", "Karbüratör"],
  PARTS: {
    hava_filtresi: { ad: "Hava filtresi", grup: "Hava yolu", ayir: [-12, 0, 0],
      islev: "Motorun çektiği havadaki tozu tutar. Kıvrımlı yapısı küçük bir kutuda geniş bir süzme yüzeyi sağlar. Kutu aynı zamanda emme sesini azaltır.",
      kontrol: "Tıkanmış filtre karışımı zenginleştirir: güç düşer, yakıt tüketimi artar. Bakım tablosundaki aralıkta temizlenir ya da değiştirilir." },
    manifold: { ad: "Emme manifoldu ve supap", grup: "Hava yolu", ayir: [12, -4, 0],
      islev: "Karbüratörden çıkan karışımı silindir kapağındaki emme kanalına taşır. Emme supabı açıldığında piston aşağı inerken karışımı içeri çeker; akış bu yüzden sürekli değil, darbe darbe ilerler.",
      kontrol: "Manifold ile karbüratör arasındaki contadan hava kaçağı karışımı fakirleştirir; rölantide devir dalgalanır." },
    kelebek: { ad: "Gaz kelebeği", grup: "Karbüratör", ayir: [0, 0, 12],
      islev: "Gaz telinin doğrudan açtığı yuvarlak kapaktır. Motorun ne kadar hava çekebileceğini belirler. Gazı kapatsan da rölanti vidası onu biraz açık tutar.",
      kontrol: "Gaz teli boşluğu ayarlanır; kelebek mili aşınırsa buradan hava kaçar ve rölanti düzensizleşir." },
    surgu: { ad: "Vakum sürgüsü ve diyafram", grup: "Karbüratör", ayir: [0, 14, 0],
      islev: "Kelebek açılıp hava hızlandıkça venturideki basınç düşer. Bu vakum sürgünün üstündeki diyaframı çeker ve yay kuvvetine karşı sürgüyü kaldırır. Böylece sürgü motorun gerçekten çekebildiği havaya göre açılır; gazı birden açsan bile motor boğulmaz.",
      kontrol: "Yırtık diyafram sürgüyü kaldıramaz: motor rölantide çalışır ama gaz açınca devir almaz." },
    igne: { ad: "İğne ve ana jiklör", grup: "Karbüratör", ayir: [0, 7, 7],
      islev: "Sürgüye bağlı konik iğne, iğne memesinin içinde yukarı kalktıkça yakıt geçiş kesiti büyür. Orta gaz bölgesini iğne, tam gazı en alttaki ana jiklörün delik çapı belirler.",
      kontrol: "İğne klipsinin kademesi ve ana jiklör numarası karışımı ayarlar; tıkalı jiklör yüksek devirde tekleme yapar." },
    rolanti: { ad: "Rölanti jiklörü ve hava vidası", grup: "Karbüratör", ayir: [4, -6, 9],
      islev: "Kelebek neredeyse kapalıyken ana devreden yakıt çekilemez. Bu küçük jiklör, kelebeğin hemen arkasındaki delikten rölanti yakıtını verir. Yanındaki vida bu devrenin karışımını ayarlar.",
      kontrol: "Rölanti jiklörü çok küçük olduğu için en çabuk tıkanan yerdir; bekleyen benzin buraya vernik bırakır. Tipik belirtisi motorun rölantide durmasıdır." },
    samandira: { ad: "Şamandıra haznesi", grup: "Karbüratör", ayir: [0, -12, 0],
      islev: "Jiklörlerin altında sabit seviyede yakıt tutar. Yakıt azalınca şamandıra iner ve iğne vanası depodan yakıt alır; seviye yükselince kapanır. Seviye sabit olduğu için karışım da kararlı kalır.",
      kontrol: "İğne vanası tam kapanmazsa karbüratör taşırır ve karışım zenginleşir; altındaki tahliye vidasından birikmiş su ve tortu boşaltılır." },
    jikle: { ad: "Otomatik jikle", grup: "Karbüratör", ayir: [0, 0, -12],
      islev: "Soğuk motorda yakıt silindir duvarında yoğuşur, bu yüzden karışımın zenginleştirilmesi gerekir. Bu tip motorlarda statordan beslenen ısıtıcılı bir eleman, soğukken ek bir yakıt kanalını açık tutar; ısındıkça pistonu uzayıp kanalı kapatır.",
      kontrol: "Kapanmayan jikle sıcak motorda karışımı zengin bırakır: tüketim artar, buji kararır. Açılmayan jikle soğukta çalıştırmayı zorlaştırır." }
  },
  build(sys) {
    const K = sys.k = { th: 0, slide: 0, lastTxt: "", air: [], fuel: [] };
    const glass = new THREE.MeshStandardMaterial({ color: 0xc8d0d8, metalness: 0.3, roughness: 0.25, transparent: true, opacity: 0.22, depthWrite: false, side: DS });
    const brassM = MAT.brass, black = new THREE.MeshStandardMaterial({ color: 0x2a2d31, roughness: 0.6 });
    const fuelM = new THREE.MeshStandardMaterial({ color: 0xe0a23a, roughness: 0.3, transparent: true, opacity: 0.55, depthWrite: false });
    const cylX = (r, len, seg, open) => { const g = new THREE.CylinderGeometry(r, r, len, seg || 32, 1, !!open); g.rotateZ(Math.PI / 2); return g; };
    const tubeG = (pts, r) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p))), 60, r, 10, false);

    /* hava filtresi */
    const pF = sys.makePart("hava_filtresi");
    { const m = sys.addMesh(pF, new THREE.BoxGeometry(16, 16, 16), glass); m.position.set(-32, 0, 0); }
    for (let i = 0; i < 9; i++) { const m = sys.addMesh(pF, new THREE.BoxGeometry(0.35, 13, 13), new THREE.MeshStandardMaterial({ color: 0xd8c9a3, roughness: 0.9 })); m.position.set(-36 + i, 0, 0); m.rotation.y = i % 2 ? 0.25 : -0.25; }
    { const m = sys.addMesh(pF, cylX(3.4, 12, 24, true), new THREE.MeshStandardMaterial({ color: 0x2a2d31, roughness: 0.7, transparent: true, opacity: 0.35, depthWrite: false, side: DS })); m.position.set(-18, 0, 0); }

    /* karbüratör gövdesi (kelebeğin parçası sayılmaz; seçimde sürgüye bağlı) */
    const pS = sys.makePart("surgu");
    sys.addMesh(pS, cylX(4.2, 24, 40, true), glass);
    { const m = sys.addMesh(pS, new THREE.BoxGeometry(4.4, 6, 8), glass); m.position.set(-2, 6.4, 0); }
    { const g = new THREE.CylinderGeometry(6.5, 6.5, 3.5, 40, 1, false); const m = sys.addMesh(pS, g, glass); m.position.set(-2, 11.2, 0); }
    K.slide = sys.addMesh(pS, new THREE.BoxGeometry(3, 6, 6), MAT.alu); K.slide.position.x = -2;
    K.diaph = sys.addMesh(pS, new THREE.CylinderGeometry(6, 6, 0.2, 40), new THREE.MeshStandardMaterial({ color: 0x3a3d42, roughness: 0.8 })); K.diaph.position.x = -2;
    K.spring = sys.addMesh(pS, new THREE.TubeGeometry(new Helix(1.3, 3, 6, "y"), 120, 0.12, 6, false), MAT.spring); K.springLen = 3;

    /* iğne ve ana jiklör */
    const pI = sys.makePart("igne");
    K.needle = sys.addMesh(pI, (() => { const g = new THREE.CylinderGeometry(0.33, 0.12, 7, 12); g.translate(0, -3.5, 0); return g; })(), MAT.steel); K.needle.position.x = -2;
    { const m = sys.addMesh(pI, new THREE.CylinderGeometry(0.55, 0.55, 5.6, 14, 1, true), new THREE.MeshStandardMaterial({ color: 0xb8925a, metalness: 0.4, roughness: 0.4, transparent: true, opacity: 0.45, depthWrite: false, side: DS })); m.position.set(-2, -6.6, 0); }
    { const m = sys.addMesh(pI, new THREE.CylinderGeometry(0.7, 0.7, 1.0, 6), brassM); m.position.set(-2, -9.8, 0); }

    /* kelebek */
    const pK = sys.makePart("kelebek");
    K.flap = new THREE.Group(); K.flap.position.set(8, 0, 0); pK.root.add(K.flap);
    sys.addMesh(pK, cylX(3.55, 0.2, 40), MAT.steel, K.flap);
    sys.addMesh(pK, cylZ(0.25, 10, 10), MAT.dark, K.flap);
    K.lever = new THREE.Group(); K.lever.position.set(8, 0, 5.2); pK.root.add(K.lever);
    { const m = sys.addMesh(pK, new THREE.BoxGeometry(3.2, 0.5, 0.4), MAT.steel, K.lever); m.position.x = 1.6; }
    sys.addMesh(pK, tubeG([[9.6, 0.5, 5.4], [11, 6, 6], [12, 14, 6]], 0.2), MAT.dark);

    /* rölanti */
    const pR = sys.makePart("rolanti");
    { const m = sys.addMesh(pR, new THREE.CylinderGeometry(0.45, 0.45, 1.0, 6), brassM); m.position.set(3, -9.4, 0); }
    sys.addMesh(pR, tubeG([[3, -8.8, 0], [4, -6, 0], [6.5, -4.6, 0], [8.8, -3.6, 0]], 0.18), fuelM);
    { const m = sys.addMesh(pR, cylZ(0.5, 3, 12), brassM); m.position.set(1, -5, 4.6); }

    /* şamandıra haznesi */
    const pB = sys.makePart("samandira");
    { const m = sys.addMesh(pB, new THREE.BoxGeometry(15, 8, 10), glass); m.position.set(-1, -10, 0); }
    { const m = sys.addMesh(pB, new THREE.BoxGeometry(14.4, 3.4, 9.4), fuelM); m.position.set(-1, -12.2, 0); }
    K.float = new THREE.Group(); pB.root.add(K.float);
    [-2.6, 2.6].forEach(z => { const m = sys.addMesh(pB, new THREE.BoxGeometry(6, 1.6, 2.2), new THREE.MeshStandardMaterial({ color: 0xe8e2d4, roughness: 0.6 }), K.float); m.position.set(-3, -10.6, z); });
    K.fvalve = sys.addMesh(pB, new THREE.CylinderGeometry(0.3, 0.12, 1.4, 10), MAT.steel); K.fvalve.position.set(4.5, -6.9, 0);
    K.fuelLine = tubeG([[4.5, -6, 0], [5, -4, -6], [5, 6, -8], [4, 15, -8]], 0.3);
    sys.addMesh(pB, K.fuelLine, new THREE.MeshStandardMaterial({ color: 0x8a6a3a, roughness: 0.5, transparent: true, opacity: 0.6 }));

    /* otomatik jikle */
    const pC = sys.makePart("jikle");
    { const m = sys.addMesh(pC, new THREE.CylinderGeometry(1.6, 1.6, 6, 20), black); m.position.set(4, 2.5, -7.5); }
    K.choke = sys.addMesh(pC, new THREE.CylinderGeometry(0.45, 0.45, 3, 12), MAT.steel); K.choke.position.set(4, -1.5, -7.5);
    K.chokePass = sys.addMesh(pC, tubeG([[2, -6.5, -4], [4, -4, -7.5], [6, -3, -6], [9.6, -2.4, -2.6]], 0.22), new THREE.MeshStandardMaterial({ color: 0xe0a23a, roughness: 0.4, transparent: true, opacity: 0.2 }));
    sys.addMesh(pC, tubeG([[4, 5.5, -7.5], [4, 9, -9], [0, 14, -10]], 0.15), new THREE.MeshStandardMaterial({ color: 0xd9732b, roughness: 0.5 }));

    /* manifold ve supap */
    const pM = sys.makePart("manifold");
    K.path = new THREE.CatmullRomCurve3([[-40, 0, 0], [-24, 0, 0], [-12, 0, 0], [12, 0, 0], [19, 0, 0], [25, -2, 0], [29, -7, 0], [30, -10.5, 0]].map(p => new THREE.Vector3(...p)), false, "catmullrom", 0.1);
    sys.addMesh(pM, new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[12, 0, 0], [19, 0, 0], [25, -2, 0], [29, -7, 0], [30, -10.5, 0]].map(p => new THREE.Vector3(...p))), 60, 3.0, 20, false), glass);
    { const m = sys.addMesh(pM, new THREE.BoxGeometry(12, 6, 12), MAT.cast); m.position.set(30, -15.5, 0); }
    K.valve = new THREE.Group(); K.valve.position.set(30, -12.4, 0); pM.root.add(K.valve);
    { const m = sys.addMesh(pM, new THREE.CylinderGeometry(1.6, 2.7, 0.4, 24), MAT.valve, K.valve); m.position.y = 0; }
    { const m = sys.addMesh(pM, new THREE.CylinderGeometry(0.22, 0.22, 9, 10), MAT.valve, K.valve); m.position.y = 4.6; }

    /* parçacıklar */
    K.pG = new THREE.Group(); sys.root.add(K.pG);
    const aGeo = new THREE.SphereGeometry(0.32, 8, 6), fGeo = new THREE.SphereGeometry(0.26, 8, 6);
    const aMat = new THREE.MeshBasicMaterial({ color: 0x7fb6ea }), fMat = new THREE.MeshBasicMaterial({ color: 0xe0a23a });
    const disk = () => { const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()); return [Math.cos(a) * r, Math.sin(a) * r]; };
    for (let i = 0; i < 110; i++) { const m = new THREE.Mesh(aGeo, aMat); K.pG.add(m); K.air.push({ m, s: Math.random(), o: disk() }); }
    for (let i = 0; i < 46; i++) { const m = new THREE.Mesh(fGeo, fMat); m.visible = false; K.pG.add(m); K.fuel.push({ m, s: 2, o: [0, 0], src: 0, sp: 1 }); }
    K.len = K.path.getLength();
    K.sAt = x => (x + 40) / K.len;
    K.tmp = new THREE.Vector3();
  },
  update(sys, dt, S) {
    const K = sys.k, P = sys.place, M = carbModel(S);
    Object.values(sys.parts).forEach(p => P(p, 0, 0, 0));
    K.pG.visible = sys.ex < 0.04;

    /* mekanizma */
    K.flap.rotation.z = (90 - M.butter) * Math.PI / 180; K.lever.rotation.z = M.butter * Math.PI / 180 * 0.6;
    K.slide_l = (K.slide_l || 0) + (M.lift - (K.slide_l || 0)) * Math.min(1, dt * 3);
    const L = K.slide_l, yb = -2.8 + 6.2 * L;
    K.slide.position.y = yb + 3; K.needle.position.y = yb; K.diaph.position.y = yb + 6.1;
    const sl = 13 - (yb + 6.2); if (Math.abs(sl - K.springLen) > 0.05) { K.spring.geometry.dispose(); K.spring.geometry = new THREE.TubeGeometry(new Helix(1.3, sl, 6, "y"), 120, 0.12, 6, false); K.springLen = sl; }
    K.spring.position.set(-2, yb + 6.2, 0);
    const fl = Math.min(1, M.fuelLh / 1.4);
    K.float.position.y = -0.4 * fl; K.fvalve.position.y = -6.9 - 0.4 * fl;
    K.choke.position.y = -1.5 + 2.2 * (1 - M.choke); K.chokePass.material.opacity = 0.2 + 0.7 * M.choke;

    /* emme supabı: krank açısına göre (motor bloğuyla aynı zamanlama) */
    K.th += (S.rpm / 7500) * 12 * dt;
    const deg = ((K.th * 180 / Math.PI) % 720 + 720) % 720, inW = deg > 710 ? deg - 720 : deg;
    const open = inW >= -10 && inW <= 220 ? Math.sin(Math.PI * (inW + 10) / 230) : 0;
    K.valve.position.y = -12.4 - 1.6 * open;

    /* parçacıklar */
    const flow = M.run ? (0.03 + 0.25 * M.air) * (0.25 + 0.75 * open) : 0;
    K.air.forEach(a => {
      a.s += flow * dt * 1.4; if (a.s >= 1) { a.s -= 1; }
      const p = K.path.getPointAt(Math.min(0.999, a.s), K.tmp), x = p.x;
      const r = x < -24 ? 6.8 : x < -20 ? 6.8 - (x + 24) / 4 * 4 : x < 12 ? 2.8 : 2.4;
      a.m.position.set(p.x, p.y + a.o[0] * r, p.z + a.o[1] * r);
    });
    const srcS = [K.sAt(-2), K.sAt(8.8), K.sAt(9.6)];
    const weights = [M.main, M.pilot, M.choke * 0.8];
    const tot = weights[0] + weights[1] + weights[2];
    const nAct = M.run ? Math.round(Math.min(46, 8 + 38 * Math.min(1, M.fuelLh / 1.2 + M.choke * 0.3))) : 0;
    K.fuel.forEach((f, i) => {
      if (i >= nAct) { f.m.visible = false; f.s = 2; return; }
      if (f.s >= 1) {
        let r = Math.random() * tot, k = 0; while (k < 2 && r > weights[k]) { r -= weights[k]; k++; }
        f.src = k; f.s = srcS[k] - Math.random() * 0.01; f.o = [-1, (Math.random() - 0.5) * 0.4]; f.t = 0; f.sp = 0.8 + Math.random() * 0.5;
      }
      f.s += flow * dt * 1.4 * f.sp; f.t += dt;
      const rise = Math.min(1, f.t * 1.5), oy = -1 + rise * (0.6 + 0.3 * Math.sin(i));
      const p = K.path.getPointAt(Math.min(0.999, f.s), K.tmp), r = p.x < 12 ? 2.6 : 2.2;
      f.m.position.set(p.x, p.y + oy * r, p.z + f.o[1] * r); f.m.visible = sys.ex < 0.04 && f.s < 0.999;
    });

    /* göstergeler */
    const txt = Math.round(M.butter) + "|" + Math.round(L * 100) + "|" + M.afr.toFixed(1) + "|" + M.fuelLh.toFixed(2) + "|" + Math.round(M.choke * 10) + "|" + M.run;
    if (txt === K.lastTxt) return; K.lastTxt = txt;
    const f1 = n => n.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    el("kThr").textContent = "%" + Math.round((M.butter - 6) / 84 * 100);
    el("kSl").textContent = "%" + Math.round(L * 100);
    el("kAfr").textContent = M.run ? f1(M.afr) + " : 1" : "—";
    el("kFuel").textContent = M.fuelLh.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " L/sa";
    const c = el("kCirc");
    if (!M.run) { c.className = "state off"; c.textContent = "Akış yok · motor durmuş"; }
    else if (M.choke > 0.05) { c.className = "state mid"; c.textContent = (M.main > 0.5 ? "Ana devre" : "Rölanti jiklörü") + " + jikle kanalı"; }
    else if (M.main < 0.15) { c.className = "state off"; c.textContent = "Rölanti jiklörü"; }
    else if (M.main < 0.85) { c.className = "state mid"; c.textContent = "Geçiş · rölanti + iğne"; }
    else { c.className = "state on"; c.textContent = L > 0.85 ? "Ana jiklör · tam gaz" : "İğne ve ana jiklör"; }
    const ch = el("kChoke");
    if (M.choke > 0.95) { ch.className = "state mid"; ch.textContent = "Açık · motor soğuk"; }
    else if (M.choke > 0.05) { ch.className = "state mid"; ch.textContent = "Kapanıyor · motor ısınıyor"; }
    else { ch.className = "state on"; ch.textContent = "Kapalı · motor sıcak"; }
  }
});

el("btnCold").addEventListener("click", () => { S.run = false; S.temp = 0; S.rpm = 0; });
