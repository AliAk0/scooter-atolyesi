"use strict";
/* ALT SİSTEM: ön teleskopik çatal ve salınan motor ünitesi */

const SU = { k: { F: 18000, R: 30000 }, travel: { F: 0.08, R: 0.07 }, zeta: { iyi: 0.32, yorgun: 0.05 }, h: 0.04, L: 0.5, v: 6.94, WB: 1.36, slow: 0.4, T: 2.0 };
const SUSP = { load: 75, damp: "iyi" };
const suMass = load => ({ F: 30 + 0.35 * load, R: 22 + 0.65 * load });
const suSag = load => { const m = suMass(load); return { F: m.F * 9.81 / SU.k.F, R: m.R * 9.81 / SU.k.R }; };
const SAG75 = suSag(75);
const SUS = createSystem({
  id: "suspansiyon", tab: "Süspansiyon", defaultSel: "unite",
  metin: {
    eyebrow: "Ön teleskopik çatal · Salınan motor ünitesi",
    title: "Süspansiyon",
    lead: "Tümsekten geç ve tekerler yolu izlerken gövdenin ne kadar sakin kaldığına bak. Yükü artır, yayların nasıl oturduğunu gör; amortisörü yorgun yapıp farkı karşılaştır.",
    note: "Ön ve arka, birbirinden bağımsız yay-kütle-sönümleyici olarak hesaplanıyor. Yay sertlikleri, kütleler ve sönüm oranları yaklaşık örnektir; hareket izlenebilsin diye yavaşlatıldı, grafik gerçek zamanı gösterir.",
    foot: "Gövde temsilidir. Çatalın bir bacağında yay, diğerinde sönümleyici gösterildi; gerçek çatallarda düzen modele göre değişir. Alt kovanlar içi görünsün diye yarı saydam çizildi."
  },
  view: { ground: null, target: [72, 44, 0], dir: [0.04, 0.1, 0.99], hw: 118, hh: 56, k: 1.02, minD: 30, maxD: 600 },
  GROUPS: ["Ön süspansiyon", "Arka süspansiyon", "Gövde ve yük"],
  PARTS: {
    on_catal: { ad: "Teleskopik ön çatal", grup: "Ön süspansiyon", ayir: [30, 0, 14],
      islev: "Gövdeye bağlı üst borular, tekerle birlikte hareket eden alt kovanların içinde kayar. Teker tümseğe çıkınca kovanlar yukarı itilir; çatal kısalarak darbeyi yutar.",
      kontrol: "Üst borulardaki çizikler ve keçelerden yağ sızıntısı kontrol edilir; frenlerken çatalın aşırı dalması zayıflamış yay veya azalmış yağ belirtisidir." },
    on_ic: { ad: "Çatal yayı ve sönümleyici", grup: "Ön süspansiyon", ayir: [30, 0, 28],
      islev: "Yay darbeyi depolar ve gövdeyi taşır; sönümleyici yağı küçük deliklerden geçirerek yayın geri salınımını frenler. Yay olmasa gövde düşer, sönümleyici olmasa gövde yay üzerinde zıplamaya devam eder.",
      kontrol: "Çatal yağı zamanla incelir; yağ azalınca ön taraf tümseklerde sekmeye başlar." },
    on_teker: { ad: "Ön teker", grup: "Ön süspansiyon", ayir: [45, 0, 0],
      islev: "Teker, fren diski ve alt kovanlar yayın altında kalır, yani yaylanmayan kütledir; yolu doğrudan izler. Bu kütle ne kadar hafifse teker yola o kadar iyi tutunur.",
      kontrol: "Lastik basıncı da süspansiyonun bir parçasıdır; düşük basınç tümseği yumuşatır ama yol tutuşunu bozar." },
    unite: { ad: "Salınan motor ünitesi", grup: "Arka süspansiyon", ayir: [0, -25, -30],
      islev: "Scooterda motor, CVT ve arka teker tek parça halinde ön taraftaki mafsal etrafında salınır. Bu yüzden motor ağırlığının büyük kısmı yaylanmayan kütleye katılır; scooterlar tümseklerde motosikletlere göre daha sert hissettirir.",
      kontrol: "Ünitenin şasiye bağlandığı mafsal burçları aşınırsa arka taraf yalpalar." },
    amortisor: { ad: "Arka amortisör", grup: "Arka süspansiyon", ayir: [-20, 20, -20],
      islev: "Ünitenin arka ucunu gövdeye bağlar; içinde yay ve hidrolik sönümleyici bir aradadır. Birçok modelde yay ön gerginliği kademeli ayarlanabilir; iki kişilik kullanımda artırılır.",
      kontrol: "Gövdesinde yağ izi varsa keçe kaçırıyordur. Scooter'a basıp bırakınca birden fazla sekiyorsa sönümleme bitmiştir." },
    arka_teker: { ad: "Arka teker", grup: "Arka süspansiyon", ayir: [-40, 0, 0],
      islev: "Doğrudan motor ünitesinin dişli kutusuna bağlıdır; ünitenin geri kalanıyla birlikte yaylanmayan kütleyi oluşturur.",
      kontrol: "Lastik basıncı ve diş derinliği düzenli kontrol edilir." },
    govde: { ad: "Gövde ve şasi", grup: "Gövde ve yük", ayir: [0, 35, 0],
      islev: "Yayların üzerinde taşınan, yani yaylanan kütledir; sürücü bu kütlenin hareketini hisseder. Süspansiyonun amacı tekerler yolu izlerken bu kütleyi olabildiğince sakin tutmaktır.",
      kontrol: "Şasi ve sele altı bağlantılarındaki gevşeklik tümseklerde tıkırtı yapar." },
    yuk: { ad: "Sürücü ve yük", grup: "Gövde ve yük", ayir: [0, 60, 0],
      islev: "Yük arttıkça yaylar daha çok oturur ve kalan süspansiyon yolu azalır. Ağırlığın çoğu arka tekere bindiği için arka taraf daha çok çöker.",
      kontrol: "İki kişilik kullanımda arka amortisör ön gerginliği artırılmazsa arka taraf tümseklerde dibe vurabilir." }
  },
  build(sys) {
    const Q = sys.q = { zf: 0, vf: 0, zr: 0, vr: 0, d: -0.45, t: 0, active: false, hist: [], maxF: 0, maxR: 0, botF: false, botR: false, done: false, lastTxt: "" };
    const ghost = new THREE.MeshStandardMaterial({ color: 0xc3ced9, metalness: 0.1, roughness: 0.4, transparent: true, opacity: 0.2, depthWrite: false, side: DS });
    const seatM = new THREE.MeshStandardMaterial({ color: 0x2b2e33, metalness: 0.05, roughness: 0.8 });
    const tireM = new THREE.MeshStandardMaterial({ color: 0x202226, metalness: 0.05, roughness: 0.9 });
    const glassAlu = new THREE.MeshStandardMaterial({ color: 0xbfc5cc, metalness: 0.4, roughness: 0.3, transparent: true, opacity: 0.4, depthWrite: false, side: DS });
    const ext = (pts, z0, z1, bev, smooth) => {
      const sh = new THREE.Shape(); sh.moveTo(pts[0][0], pts[0][1]);
      const rest = pts.slice(1).map(p => new THREE.Vector2(p[0], p[1]));
      smooth ? sh.splineThru(rest) : rest.forEach(v => sh.lineTo(v.x, v.y));
      const g = new THREE.ExtrudeGeometry(sh, { depth: z1 - z0 - 2 * bev, bevelEnabled: bev > 0, bevelThickness: bev, bevelSize: bev, bevelSegments: 3, curveSegments: 24 });
      g.translate(0, 0, z0 + bev); return g;
    };
    const tube = (pts, r) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), false, "catmullrom", 0.2), 64, r, 10, false);
    Q.up = new THREE.Vector3(0, 1, 0);

    /* yol ve tümsek (seçilemez) */
    const road = new THREE.Mesh(new THREE.BoxGeometry(420, 1.5, 40), new THREE.MeshStandardMaterial({ color: 0x4d535a, roughness: 0.95 }));
    road.position.set(70, -0.75, 0); road.receiveShadow = true; sys.root.add(road);
    { const sh = new THREE.Shape(); sh.moveTo(0, 0); for (let i = 0; i <= 30; i++) { const u = i / 30; sh.lineTo(u * SU.L * 100, SU.h * 100 * Math.sin(Math.PI * u)); } sh.lineTo(SU.L * 100, 0);
      const g = new THREE.ExtrudeGeometry(sh, { depth: 40, bevelEnabled: false }); g.translate(0, 0, -20);
      Q.bump = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: 0x8a6f5c, roughness: 0.9 })); sys.root.add(Q.bump); }

    /* gövde (yaylanan kütle) */
    const pG = sys.makePart("govde"); Q.body = new THREE.Group(); pG.root.add(Q.body);
    sys.addMesh(pG, ext([[53, 22], [112, 22], [112, 27], [53, 27], [53, 22]], -17, 17, 1), ghost, Q.body);
    sys.addMesh(pG, ext([[60, 31], [62, 48], [55, 72], [20, 76], [-10, 77], [-28, 71], [-35, 60], [-24, 50], [0, 45], [25, 39], [45, 33], [60, 31]], -15, 15, 2, true), ghost, Q.body);
    sys.addMesh(pG, ext([[108, 27], [118, 27], [130, 45], [133, 68], [127, 90], [116, 93], [110, 86], [110, 40], [108, 27]], -20, 20, 2, true), ghost, Q.body);
    sys.addMesh(pG, ext([[-12, 77], [20, 76.5], [52, 73], [56, 76], [50, 83], [25, 85.5], [0, 86], [-14, 82], [-12, 77]], -14, 14, 2, true), seatM, Q.body);
    [-8, 8].forEach(z => sys.addMesh(pG, tube([[114, 70, 0], [108, 30, 0], [101, 21, z], [62, 21, z], [56, 31, z], [44, 56, z], [10, 64, z], [-24, 62, z]], 1.4), MAT.dark, Q.body));
    { const g = new THREE.CylinderGeometry(1.4, 1.4, 14, 14); g.translate(0, 0, 0); const hd = sys.addMesh(pG, g, MAT.dark, Q.body); hd.position.set(116, 76, 0); hd.rotation.z = 0.44; }
    { const g = cylZ(1.3, 18, 12); g.translate(52, 26, 0); sys.addMesh(pG, g, MAT.steel, Q.body); }

    /* yük */
    const pY = sys.makePart("yuk"); Q.loadG = new THREE.Group(); Q.body.add(Q.loadG); pY.root.add(new THREE.Group());
    const loadM = new THREE.MeshStandardMaterial({ color: 0x55657a, metalness: 0.1, roughness: 0.7 });
    Q.rider = sys.addMesh(pY, new THREE.BoxGeometry(18, 1, 22), loadM, Q.loadG); Q.rider.position.set(30, 86, 0);
    Q.pass = sys.addMesh(pY, new THREE.BoxGeometry(16, 1, 22), loadM, Q.loadG); Q.pass.position.set(2, 86, 0);
    Q.pY = pY;

    /* ön teker */
    const pW = sys.makePart("on_teker"); Q.wF = new THREE.Group(); pW.root.add(Q.wF);
    const wheel = (part, g) => {
      sys.addMesh(part, new THREE.TorusGeometry(16, 4.5, 16, 56), tireM, g);
      sys.addMesh(part, new THREE.TorusGeometry(12.7, 0.9, 10, 48), MAT.alu, g);
      sys.addMesh(part, cylZ(3, 10, 24), MAT.alu, g);
      for (let i = 0; i < 5; i++) { const sp = sys.addMesh(part, new THREE.BoxGeometry(10, 1.6, 1.2), MAT.alu, g); const a = i * 2 * Math.PI / 5; sp.position.set(Math.cos(a) * 7.6, Math.sin(a) * 7.6, 0); sp.rotation.z = a; }
    };
    wheel(pW, Q.wF);

    /* ön çatal: üst borular gövdeye, alt kovanlar tekere bağlı */
    const pC = sys.makePart("on_catal");
    Q.stan = [-7, 7].map(z => { const m = sys.addMesh(pC, new THREE.CylinderGeometry(1.5, 1.5, 1, 18), MAT.steel); m.userData.z = z; return m; });
    Q.slid = [-7, 7].map(z => { const m = sys.addMesh(pC, new THREE.CylinderGeometry(2.1, 2.1, 1, 18), glassAlu); m.userData.z = z; return m; });
    Q.crownM = sys.addMesh(pC, new THREE.BoxGeometry(5, 2.2, 18), MAT.dark);
    const pI = sys.makePart("on_ic");
    Q.fSpring = sys.addMesh(pI, new THREE.TubeGeometry(new Helix(1.0, 20, 12, "y"), 200, 0.22, 6, false), MAT.spring); Q.fSpringLen = 20;
    Q.fRod = sys.addMesh(pI, new THREE.CylinderGeometry(0.45, 0.45, 1, 12), MAT.dark);
    Q.fPiston = sys.addMesh(pI, new THREE.CylinderGeometry(1.0, 1.0, 1.2, 16), MAT.brass);

    /* arka teker */
    const pR = sys.makePart("arka_teker"); Q.wR = new THREE.Group(); pR.root.add(Q.wR); wheel(pR, Q.wR);

    /* salınan ünite: yerel +x pivottan aksa doğru */
    const pU = sys.makePart("unite"); Q.unit = new THREE.Group(); pU.root.add(Q.unit);
    Q.LU = Math.hypot(52, 26 - 20.5);
    { const m = sys.addMesh(pU, new THREE.BoxGeometry(Q.LU, 9, 9), MAT.cast, Q.unit); m.position.set(Q.LU / 2, -1, 9); }
    { const m = sys.addMesh(pU, new THREE.BoxGeometry(18, 13, 14), MAT.cast, Q.unit); m.position.set(11, 2, 0); }
    { const m = sys.addMesh(pU, cylZ(1.6, 22, 14), MAT.dark, Q.unit); }
    { const m = sys.addMesh(pU, cylZ(1.2, 14, 12), MAT.dark, Q.unit); m.position.set(Q.LU, 0, 3); }

    /* arka amortisör */
    const pA = sys.makePart("amortisor");
    Q.rBody = sys.addMesh(pA, new THREE.CylinderGeometry(2.0, 2.0, 1, 18), MAT.steel);
    Q.rRod = sys.addMesh(pA, new THREE.CylinderGeometry(0.6, 0.6, 1, 12), MAT.alu);
    Q.rSpring = sys.addMesh(pA, new THREE.TubeGeometry(new Helix(2.6, 20, 7, "y"), 200, 0.35, 6, false), MAT.spring); Q.rSpringLen = 20;
    Q.rEye = [0, 1].map(() => sys.addMesh(pA, cylZ(1.1, 3, 12), MAT.dark));

    /* grafik */
    Q.scope = el("susScope"); Q.sctx = Q.scope.getContext("2d");
    Q.tmpA = new THREE.Vector3(); Q.tmpB = new THREE.Vector3(); Q.tmpD = new THREE.Vector3();
  },
  update(sys, dt, S) {
    const Q = sys.q, P = sys.place, ex = sys.ex;
    Object.values(sys.parts).forEach(p => P(p, 0, 0, 0));

    /* --- fizik (fiziksel zaman, alt adımlarla) --- */
    const m = suMass(SUSP.load), sag = suSag(SUSP.load), z = SU.zeta[SUSP.damp];
    const c = { F: 2 * z * Math.sqrt(SU.k.F * m.F), R: 2 * z * Math.sqrt(SU.k.R * m.R) };
    const road = u => (u >= 0 && u <= SU.L ? SU.h * Math.sin(Math.PI * u / SU.L) : 0);
    const droad = u => (u >= 0 && u <= SU.L ? SU.h * Math.PI / SU.L * Math.cos(Math.PI * u / SU.L) : 0);
    let wF = 0, wR = 0;
    if (Q.active) {
      const n = 10, h = dt * SU.slow / n;
      for (let i = 0; i < n; i++) {
        const uF = Q.d, uR = Q.d - SU.WB;
        wF = road(uF); wR = road(uR); const vwF = droad(uF) * SU.v, vwR = droad(uR) * SU.v;
        const step = (k, zk, vk, w, vw, cc, mm, sg, tr, key) => {
          const comp = sg + (w - Q[zk]); let f = -k * (Q[zk] - w) - cc * (Q[vk] - vw);
          if (comp > tr) { f += 10 * k * (comp - tr); if (key === "F") Q.botF = true; else Q.botR = true; }
          Q[vk] += f / mm * h; Q[zk] += Q[vk] * h;
          if (key === "F") Q.maxF = Math.max(Q.maxF, comp); else Q.maxR = Math.max(Q.maxR, comp);
        };
        step(SU.k.F, "zf", "vf", wF, vwF, c.F, m.F, sag.F, SU.travel.F, "F");
        step(SU.k.R, "zr", "vr", wR, vwR, c.R, m.R, sag.R, SU.travel.R, "R");
        Q.d += SU.v * h; Q.t += h;
      }
      Q.hist.push([Q.t, Q.zf * 100, Q.zr * 100, road(Q.d) * 100]);
      if (Q.t >= SU.T) { Q.active = false; Q.done = true; Q.zf = Q.vf = Q.zr = Q.vr = 0; Q.d = -0.45; }
    }

    /* --- geometri (cm) --- */
    const zbF = 100 * (Q.zf - (sag.F - SAG75.F)), zbR = 100 * (Q.zr - (sag.R - SAG75.R));
    const pitch = Math.atan((zbF - zbR) / 136), cs = Math.cos(pitch), sn = Math.sin(pitch);
    const W = (x, y, out) => out.set(x * cs - y * sn + ex * 0, x * sn + y * cs + zbR, 0);
    Q.body.position.set(0, zbR, 0); Q.body.rotation.z = pitch;
    Q.rider.scale.y = 10; Q.rider.position.y = 86 + 5; Q.pass.visible = SUSP.load > 110;
    Q.pass.scale.y = 9; Q.pass.position.y = 86 + 4.5;
    Q.bump.position.set(136 - Q.d * 100, 0, 0);

    const axF = new THREE.Vector3(136, 20.5 + wF * 100, 0);
    Q.wF.position.copy(axF);
    const crown = W(114.2, 67.6, Q.tmpA.clone());
    const dir = Q.tmpD.copy(crown).sub(axF).normalize();
    Q.crownM.position.copy(crown); Q.crownM.rotation.z = Math.atan2(dir.y, dir.x) - Math.PI / 2;
    const orient = (mesh, a, b, zoff) => {
      const v = Q.tmpB.copy(b).sub(a); const len = Math.max(0.1, v.length());
      mesh.position.copy(a).add(b).multiplyScalar(0.5); mesh.position.z = zoff;
      mesh.quaternion.setFromUnitVectors(Q.up, v.normalize()); mesh.scale.set(1, len, 1);
    };
    Q.stan.forEach(mm => orient(mm, crown.clone().addScaledVector(dir, -34), crown, mm.userData.z));
    Q.slid.forEach(mm => orient(mm, axF.clone().addScaledVector(dir, -1), axF.clone().addScaledVector(dir, 26), mm.userData.z));
    /* yay (z=+7 bacak) */
    const sA = axF.clone().addScaledVector(dir, 5), sB = crown.clone().addScaledVector(dir, -6), sLen = sA.distanceTo(sB);
    if (Math.abs(sLen - Q.fSpringLen) > 0.08) { Q.fSpring.geometry.dispose(); Q.fSpring.geometry = new THREE.TubeGeometry(new Helix(1.0, sLen, 12, "y"), 200, 0.22, 6, false); Q.fSpringLen = sLen; }
    Q.fSpring.position.set(sA.x, sA.y, 7); Q.fSpring.quaternion.setFromUnitVectors(Q.up, dir);
    /* sönümleyici (z=-7 bacak): rod gövdeyle, piston kovanın içinde */
    const pist = crown.clone().addScaledVector(dir, -30);
    orient(Q.fRod, pist, crown, -7); Q.fPiston.position.set(pist.x, pist.y, -7); Q.fPiston.quaternion.setFromUnitVectors(Q.up, dir);

    /* arka */
    const piv = W(52, 26, new THREE.Vector3());
    const ayR = 20.5 + wR * 100, aAng = Math.asin(Math.max(-1, Math.min(1, (ayR - piv.y) / Q.LU)));
    const axR = new THREE.Vector3(piv.x - Q.LU * Math.cos(aAng), ayR, 0);
    Q.wR.position.copy(axR);
    Q.unit.position.copy(piv); Q.unit.rotation.z = Math.atan2(axR.y - piv.y, axR.x - piv.x);
    const top = W(-6, 60, new THREE.Vector3()), bot = new THREE.Vector3(axR.x + 5, axR.y + 8, 0);
    const sd = Q.tmpD.copy(top).sub(bot), slen = sd.length(); sd.normalize();
    orient(Q.rBody, top.clone().addScaledVector(sd, -16), top, -9);
    orient(Q.rRod, bot, top.clone().addScaledVector(sd, -10), -9);
    const rA = bot.clone().addScaledVector(sd, 2.5), rLen = slen - 6;
    if (Math.abs(rLen - Q.rSpringLen) > 0.08) { Q.rSpring.geometry.dispose(); Q.rSpring.geometry = new THREE.TubeGeometry(new Helix(2.6, rLen, 7, "y"), 200, 0.35, 6, false); Q.rSpringLen = rLen; }
    Q.rSpring.position.set(rA.x, rA.y, -9); Q.rSpring.quaternion.setFromUnitVectors(Q.up, sd);
    Q.rEye[0].position.set(top.x, top.y, -9); Q.rEye[1].position.set(bot.x, bot.y, -9);
    if (Q.active) Q.wF.rotation.z -= SU.v / 0.205 * dt * SU.slow * 0.35; Q.wR.rotation.z = Q.wF.rotation.z;
    Q.loadG.position.y = ex * 25;

    /* --- grafik --- */
    const cv = Q.scope, W2 = cv.clientWidth, H2 = cv.clientHeight;
    if (W2 > 0) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (cv.width !== Math.round(W2 * dpr)) { cv.width = Math.round(W2 * dpr); cv.height = Math.round(H2 * dpr); }
      const x = Q.sctx; x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W2, H2);
      const ym = v => H2 / 2 - v / 8 * (H2 / 2 - 6), xm = t => t / SU.T * W2;
      x.strokeStyle = TOK.line; x.lineWidth = 1;
      [-5, 0, 5].forEach(v => { x.beginPath(); x.moveTo(0, ym(v)); x.lineTo(W2, ym(v)); x.stroke(); });
      for (let i = 1; i < 4; i++) { x.beginPath(); x.moveTo(W2 * i / 4, 0); x.lineTo(W2 * i / 4, H2); x.stroke(); }
      const line = (idx, col, w, dash) => { x.strokeStyle = col; x.lineWidth = w; x.setLineDash(dash || []); x.beginPath(); Q.hist.forEach((h, i) => i ? x.lineTo(xm(h[0]), ym(h[idx])) : x.moveTo(xm(h[0]), ym(h[idx]))); x.stroke(); x.setLineDash([]); };
      if (Q.hist.length > 1) { line(3, TOK.muted, 1.5, [4, 3]); line(2, TOK.ac, 2); line(1, TOK.sig, 2); }
      else { x.fillStyle = TOK.muted; x.font = "12px " + TOK.mono; x.fillText("Tümsekten geç düğmesine bas", 10, H2 / 2 - 8); }
      x.fillStyle = TOK.muted; x.font = "11px " + TOK.mono; x.fillText("+5 cm", 4, ym(5) - 3);
    }

    /* --- göstergeler --- */
    const mm = v => Math.round(v * 1000) + " mm";
    const txt = SUSP.load + "|" + SUSP.damp + "|" + Q.active + "|" + Q.done + "|" + Q.botF + Q.botR;
    if (txt === Q.lastTxt) return; Q.lastTxt = txt;
    el("sSagF").textContent = mm(sag.F); el("sSagR").textContent = mm(sag.R);
    el("sRemF").textContent = mm(Math.max(0, SU.travel.F - sag.F)); el("sRemR").textContent = mm(Math.max(0, SU.travel.R - sag.R));
    const st = el("sState");
    if (Q.active) { st.className = "state mid"; st.textContent = "Tümsekten geçiyor"; }
    else if (!Q.done) { st.className = "state off"; st.textContent = "Henüz geçilmedi"; }
    else if (Q.botF || Q.botR) { st.className = "state bad"; st.textContent = (Q.botF && Q.botR ? "Ön ve arka" : Q.botF ? "Ön" : "Arka") + " dibe vurdu"; }
    else { st.className = "state on"; st.textContent = "Dibe vurmadı · en çok ön " + Math.round(Q.maxF * 1000) + ", arka " + Math.round(Q.maxR * 1000) + " mm sıkıştı"; }
  }
});

el("btnBump").addEventListener("click", () => {
  const Q = SUS.q; Q.active = true; Q.done = false; Q.t = 0; Q.d = -0.45; Q.hist = []; Q.maxF = Q.maxR = 0; Q.botF = Q.botR = false; Q.zf = Q.vf = Q.zr = Q.vr = 0;
});
{ const r = el("load"), on = () => { SUSP.load = +r.value; el("loadVal").textContent = r.value + " kg"; r.style.setProperty("--fill", ((r.value - 55) / 115 * 100) + "%"); }; r.addEventListener("input", on); on(); }
document.querySelectorAll("[data-damp]").forEach(b => b.addEventListener("click", () => {
  SUSP.damp = b.dataset.damp; document.querySelectorAll("[data-damp]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
}));
