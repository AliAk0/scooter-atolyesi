"use strict";
/* ALT SİSTEM: 4 zamanlı motor bloğu */

const MOTOR = createSystem({
  id: "motor", defaultSel: "piston", tab: "Motor bloğu",
  metin: {
    eyebrow: "GY6 tipi · 50 cc · Tek silindir · SOHC 2 supap",
    title: "4 Zamanlı Motor Bloğu",
    lead: "Piston dört zamanı tamamlarken krank iki tur, eksantrik bir tur döner. Gazı aç, çevrimi izle; Ayır ile parçaları birbirinden uzaklaştır, parçaya dokunarak ne iş yaptığını gör.",
    note: "Çevrim izlenebilsin diye animasyon yavaşlatıldı; gösterge gerçek devri gösterir. Supap zamanlaması ve ölçüler GY6 tipi 50 cc için yaklaşık örnektir.",
    foot: "Geometri kodla üretilmiş geçici bir taslaktır. Gerçek motorda silindir neredeyse yatay, öne doğru durur; burada anlaşılır olsun diye dik gösterildi. Silindir ve kapak, içi görünsün diye çeyrek kesitli çizildi."
  },
  view: { ground: -3.4, target: [0, 7.8, 0], dir: [0.5, 0.3, 0.81], hw: 7.5, hh: 11.5, k: 1.18 },
  GROUPS: ["Krank grubu", "Silindir ve kapak", "Supap mekanizması"],
  PARTS: {
    krank: { ad: "Krank mili", grup: "Krank grubu", ayir: [0, 0, 0],
      islev: "Pistonun ileri-geri hareketini dönüşe çevirir. Scooter motorlarında tam daire biçimli volan diskleri hem karşı ağırlık hem de dönüşü dengeleyen kütle görevi görür. Bir ucu varyatöre, diğer ucu manyetoya gider.",
      kontrol: "Biyel yatağındaki boşluk motor içinden tıkırtı olarak duyulur." },
    biyel: { ad: "Biyel kolu", grup: "Krank grubu", ayir: [6.5, 0, 0],
      islev: "Piston pimi ile krank pimini bağlar ve pistonun doğrusal hareketini krankın dairesel hareketine çevirir. Büyük ucu iğneli rulmanla krank pimine oturur.",
      kontrol: "Büyük uçta yanal ve dikey boşluğa bakılır." },
    piston: { ad: "Piston", grup: "Krank grubu", ayir: [-7, 2, 0],
      islev: "Yanma basıncını biyele iletir. Emme zamanında aşağı inerek karışımı çeker, sıkıştırma zamanında yukarı çıkarak karışımı sıkıştırır, egzoz zamanında yanmış gazı dışarı iter.",
      kontrol: "Etekteki çizikler ve tepedeki karbon birikimi incelenir." },
    segman: { ad: "Segmanlar", grup: "Krank grubu", ayir: [-7, 4.5, 0],
      islev: "Üstteki iki kompresyon segmanı yanma odasının sızdırmazlığını sağlar. Alttaki yağ segmanı silindir duvarındaki fazla yağı sıyırıp kartere geri gönderir.",
      kontrol: "Aşınınca kompresyon düşer ve motor yağ yakar; egzozdan mavi duman çıkar." },
    silindir: { ad: "Silindir", grup: "Silindir ve kapak", ayir: [0, 3.5, 0],
      islev: "Pistonun içinde çalıştığı gömlektir; çapı 39 mm civarındadır. Dıştaki kanatlar havayla soğutma içindir; scooterda volan tarafındaki fan bu kanatların üzerine hava basar.",
      kontrol: "Duvardaki çizik ve ovallik kompresyon kaybına yol açar." },
    kapak: { ad: "Silindir kapağı", grup: "Silindir ve kapak", ayir: [0, 7, 0],
      islev: "Yanma odasının tavanını oluşturur; supapları, bujiyi, eksantrik milini ve külbütörleri taşır.",
      kontrol: "Aşırı ısınmada çarpılabilir; conta kaçağı kompresyon kaybı yapar." },
    buji: { ad: "Buji", grup: "Silindir ve kapak", ayir: [0, 7, 5],
      islev: "Sıkıştırma zamanının sonunda, üst ölü noktadan biraz önce kıvılcım çakarak sıkışmış karışımı ateşler. Yanmanın tam ÜÖN'den sonra en yüksek basınca ulaşması için erken ateşlenir.",
      kontrol: "Tırnak aralığına ve uç rengine bakılır; açık kahverengi uç düzgün yanmayı gösterir." },
    emme: { ad: "Emme supabı", grup: "Supap mekanizması", ayir: [-4, 9, 0],
      islev: "Emme zamanında açılarak benzin-hava karışımını silindire alır. ÜÖN'den biraz önce açılır, AÖN'den sonra kapanır; böylece akmakta olan karışımın ataletinden faydalanılır.",
      kontrol: "Supap boşluğu belirli aralıklarla ayarlanır; boşluk kapanırsa supap tam oturmaz." },
    egzoz: { ad: "Egzoz supabı", grup: "Supap mekanizması", ayir: [4, 9, 0],
      islev: "İş zamanının sonuna doğru, AÖN'den önce açılır ve yanmış gazı egzoza bırakır. ÜÖN civarında kısa bir süre emme supabıyla birlikte açık kalır; buna supap bindirmesi denir.",
      kontrol: "Emmeden daha sıcak çalışır; yanık veya oturmayan supap kompresyon kaybı yapar." },
    eksantrik: { ad: "Eksantrik mili", grup: "Supap mekanizması", ayir: [0, 12, 0],
      islev: "Krankın yarı devriyle döner, yani her iki krank turunda her supabı bir kez açar. Kamların biçimi supabın ne zaman, ne kadar ve ne süre açık kalacağını belirler.",
      kontrol: "Kam yüzeyindeki aşınma supap kalkışını azaltır, güç düşer." },
    kulbutor: { ad: "Külbütörler", grup: "Supap mekanizması", ayir: [0, 14.5, 0],
      islev: "Kamın itmesini supaba iletir. Ortasından bir mile oturur; kam bir ucunu kaldırınca diğer ucu supabı aşağı basar. Ucundaki ayar vidası supap boşluğunu belirler.",
      kontrol: "Supap ayarı bu vida ve karşı somunla yapılır." },
    zincir: { ad: "Eksantrik zinciri ve dişliler", grup: "Supap mekanizması", ayir: [0, 0, -4],
      islev: "Krank ile eksantrik milini bağlar. Krank dişlisi eksantrik dişlisinin yarı çapındadır; bu yüzden eksantrik krankın yarı devriyle döner ve supaplar pistonla senkron kalır.",
      kontrol: "Gergi aşınırsa zincir gevşer ve şakırtı yapar." }
  },
  build(sys) {
    const RC = 2.07, LROD = 8.0, BORE = 1.95, Y_DECK = 11.6, Y_ROOF = 11.85, Y_CAM = 14.6, Z_CHAIN = -4.6;
    const VX = 0.85, VZ = 0.5, CAM_R0 = 0.75, CAM_H = 0.5, CAM_W = 57.5 * Math.PI / 180;
    const OFF_IN = 142.5 * Math.PI / 180, OFF_EX = 37.5 * Math.PI / 180, CUT0 = Math.PI / 2, CUTL = Math.PI * 1.5;
    const M = sys.m = { RC, LROD, Y_ROOF, Y_CAM, Z_CHAIN, VX, OFF_IN, OFF_EX, th: 0 };

    const flash = new THREE.PointLight(0xffa040, 0, 14); flash.position.set(0, 11.3, 0.4); sys.root.add(flash); M.flash = flash;

    const pCrank = sys.makePart("krank"); M.crankSpin = new THREE.Group(); pCrank.root.add(M.crankSpin);
    sys.addMesh(pCrank, cylZ(0.75, 10.6, 28), MAT.dark, M.crankSpin);
    [-0.8, 0.8].forEach(z => { const m = sys.addMesh(pCrank, cylZ(3.0, 0.5, 64), MAT.steel, M.crankSpin); m.position.z = z; });
    { const m = sys.addMesh(pCrank, cylZ(0.55, 1.6, 24), MAT.dark, M.crankSpin); m.position.y = RC; }

    const pRod = sys.makePart("biyel"); M.rodG = new THREE.Group(); pRod.root.add(M.rodG);
    sys.addMesh(pRod, cylZ(0.95, 0.8, 32), MAT.steel, M.rodG);
    { const m = sys.addMesh(pRod, cylZ(0.55, 0.7, 24), MAT.steel, M.rodG); m.position.y = LROD; }
    { const m = sys.addMesh(pRod, new THREE.BoxGeometry(0.5, LROD - 1.3, 0.6), MAT.steel, M.rodG); m.position.y = LROD / 2; }

    const pPist = sys.makePart("piston");
    { const g = new THREE.CylinderGeometry(1.92, 1.92, 3.4, 48); g.translate(0, -0.5, 0); sys.addMesh(pPist, g, MAT.alu); }
    sys.addMesh(pPist, cylZ(0.45, 3.0, 20), MAT.dark);
    const pRing = sys.makePart("segman");
    [0.95, 0.65, 0.3].forEach((y, i) => { const g = new THREE.TorusGeometry(1.935, i === 2 ? 0.09 : 0.065, 8, 64); g.rotateX(Math.PI / 2); const m = sys.addMesh(pRing, g, MAT.ring); m.position.y = y; });

    const pCyl = sys.makePart("silindir");
    sys.addMesh(pCyl, lathe([[BORE, 4.6], [2.45, 4.6], [2.45, Y_DECK], [BORE, Y_DECK], [BORE, 4.6]], CUT0, CUTL), MAT.cast);
    for (let y = 5.2; y < 11.3; y += 0.6) sys.addMesh(pCyl, lathe([[2.45, y], [4.1, y], [4.1, y + 0.16], [2.45, y + 0.16], [2.45, y]], CUT0, CUTL), MAT.cast);

    const pHead = sys.makePart("kapak");
    sys.addMesh(pHead, lathe([[BORE, Y_DECK], [3.6, Y_DECK], [3.6, Y_ROOF], [BORE, Y_ROOF], [BORE, Y_DECK]], CUT0, CUTL), MAT.cast);
    sys.addMesh(pHead, lathe([[0, Y_ROOF], [3.6, Y_ROOF], [3.6, Y_ROOF + 0.3], [0, Y_ROOF + 0.3], [0, Y_ROOF]], CUT0, CUTL), MAT.cast);
    sys.addMesh(pHead, lathe([[3.2, Y_ROOF], [3.6, Y_ROOF], [3.6, 16.4], [3.2, 16.4], [3.2, Y_ROOF]], CUT0, CUTL), MAT.cast);
    for (let y = 12.4; y < 16.2; y += 0.7) sys.addMesh(pHead, lathe([[3.6, y], [4.4, y], [4.4, y + 0.15], [3.6, y + 0.15], [3.6, y]], CUT0, CUTL), MAT.cast);

    const pPlug = sys.makePart("buji"); const plugG = new THREE.Group(); pPlug.root.add(plugG);
    plugG.position.set(0, Y_ROOF - 0.05, 1.0); plugG.rotation.x = 0.45;
    { const t = new THREE.CylinderGeometry(0.28, 0.28, 1.2, 16); t.translate(0, 0.6, 0); sys.addMesh(pPlug, t, MAT.steel, plugG);
      const h = new THREE.CylinderGeometry(0.42, 0.42, 0.5, 6); h.translate(0, 1.45, 0); sys.addMesh(pPlug, h, MAT.dark, plugG);
      const c = new THREE.CylinderGeometry(0.2, 0.26, 1.6, 16); c.translate(0, 2.5, 0); sys.addMesh(pPlug, c, MAT.ceramic, plugG);
      const e = new THREE.CylinderGeometry(0.05, 0.05, 0.25, 8); e.translate(0, -0.12, 0); sys.addMesh(pPlug, e, MAT.dark, plugG); }
    M.sparkMat = new THREE.MeshBasicMaterial({ color: 0xfff1b8, transparent: true, opacity: 0 });
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), M.sparkMat); spark.position.set(0, -0.25, 0); plugG.add(spark);

    function makeValve(id, x, z) {
      const p = sys.makePart(id); const mov = new THREE.Group(); p.root.add(mov);
      const st = new THREE.CylinderGeometry(0.12, 0.12, 3.5, 12); st.translate(x, Y_ROOF - 0.05 + 1.75, z); sys.addMesh(p, st, MAT.valve, mov);
      const hd = new THREE.CylinderGeometry(0.42, 0.72, 0.16, 32); hd.translate(x, Y_ROOF - 0.08, z); sys.addMesh(p, hd, MAT.valve, mov);
      const rt = new THREE.CylinderGeometry(0.42, 0.42, 0.1, 20); rt.translate(x, 14.95, z); sys.addMesh(p, rt, MAT.steel, mov);
      const sp = sys.addMesh(p, new THREE.TubeGeometry(new Helix(0.36, 1, 6, "y"), 160, 0.06, 6, false), MAT.spring); sp.position.set(x, 13.0, z);
      p.mov = mov; p.spring = sp; return p;
    }
    M.pIn = makeValve("emme", -VX, -VZ); M.pEx = makeValve("egzoz", VX, VZ);

    const camLift = phi => { const a = Math.atan2(Math.sin(phi), Math.cos(phi)); return Math.abs(a) < CAM_W ? CAM_H * Math.pow(Math.cos(a * Math.PI / (2 * CAM_W)), 2) : 0; };
    M.camLift = camLift;
    const pCam = sys.makePart("eksantrik"); M.camSpin = new THREE.Group(); M.camSpin.position.y = Y_CAM; pCam.root.add(M.camSpin);
    { const g = cylZ(0.35, 6.4, 20); g.translate(0, 0, -1.6); sys.addMesh(pCam, g, MAT.dark, M.camSpin); }
    const lobeGeom = () => {
      const s = new THREE.Shape();
      for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2, r = CAM_R0 + camLift(a); i ? s.lineTo(r * Math.cos(a), r * Math.sin(a)) : s.moveTo(r * Math.cos(a), r * Math.sin(a)); }
      const g = new THREE.ExtrudeGeometry(s, { depth: 0.5, bevelEnabled: false, curveSegments: 4 }); g.translate(0, 0, -0.25); return g;
    };
    { const a = sys.addMesh(pCam, lobeGeom(), MAT.steel, M.camSpin); a.position.z = -VZ; a.rotation.z = OFF_IN;
      const b = sys.addMesh(pCam, lobeGeom(), MAT.steel, M.camSpin); b.position.z = VZ; b.rotation.z = OFF_EX; }

    const pRock = sys.makePart("kulbutor"); M.rockers = [];
    [[-1, -VZ], [1, VZ]].forEach(([sx, z]) => {
      const g = new THREE.Group(); g.position.set(sx * VX / 2, Y_CAM + CAM_R0 + 0.22, z); pRock.root.add(g);
      sys.addMesh(pRock, new THREE.BoxGeometry(1.25, 0.22, 0.34), MAT.steel, g);
      const pin = sys.addMesh(pRock, cylZ(0.12, 0.7, 12), MAT.dark, g); pin.position.y = 0.12; M.rockers.push(g);
    });

    const gearGeom = (r, n, depth) => {
      const s = new THREE.Shape();
      for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * Math.PI * 2, rr = i % 2 ? r + 0.14 : r - 0.04; i ? s.lineTo(rr * Math.cos(a), rr * Math.sin(a)) : s.moveTo(rr * Math.cos(a), rr * Math.sin(a)); }
      const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false }); g.translate(0, 0, -depth / 2); return g;
    };
    const pChain = sys.makePart("zincir");
    M.sprC = new THREE.Group(); M.sprK = new THREE.Group(); M.sprK.position.y = Y_CAM; pChain.root.add(M.sprC, M.sprK);
    sys.addMesh(pChain, gearGeom(0.82, 12, 0.3), MAT.steel, M.sprC);
    sys.addMesh(pChain, gearGeom(1.72, 24, 0.3), MAT.steel, M.sprK);
    const R1 = 0.92, R2 = 1.82, D = Y_CAM, BETA = Math.asin((R2 - R1) / D), LLINE = Math.sqrt(D * D - (R2 - R1) * (R2 - R1));
    const LA = R1 * (Math.PI - 2 * BETA), LB = R2 * (Math.PI + 2 * BETA), LTOT = LA + LB + 2 * LLINE, NL = Math.round(LTOT / 0.34);
    const links = new THREE.InstancedMesh(new THREE.BoxGeometry(0.3, 0.12, 0.34), MAT.dark.clone(), NL);
    links.userData.partId = "zincir"; pChain.root.add(links); pChain.meshes.push(links); sys.pickables.push(links);
    const dummy = new THREE.Object3D();
    const loopAt = s => {
      s = ((s % LTOT) + LTOT) % LTOT;
      const tA0 = Math.PI / 2 + BETA, tA1 = 3 * Math.PI / 2 - BETA, tB0 = -(Math.PI / 2 + BETA);
      if (s < LA) { const t = tA0 + s / R1; return [R1 * Math.cos(t), R1 * Math.sin(t), t + Math.PI / 2]; }
      s -= LA;
      if (s < LLINE) { const u = s / LLINE, a = [R1 * Math.cos(tA1), R1 * Math.sin(tA1)], b = [D + R2 * Math.cos(tA1), R2 * Math.sin(tA1)]; return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, Math.atan2(b[1] - a[1], b[0] - a[0])]; }
      s -= LLINE;
      if (s < LB) { const t = tB0 + s / R2; return [D + R2 * Math.cos(t), R2 * Math.sin(t), t + Math.PI / 2]; }
      s -= LB; const u = s / LLINE, a = [D + R2 * Math.cos(tA0), R2 * Math.sin(tA0)], b = [R1 * Math.cos(tA0), R1 * Math.sin(tA0)];
      return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, Math.atan2(b[1] - a[1], b[0] - a[0])];
    };
    M.updateChain = off => {
      for (let i = 0; i < NL; i++) { const [u, v, ang] = loopAt(i * LTOT / NL + off); dummy.position.set(-v, u, 0); dummy.rotation.set(0, 0, ang + Math.PI / 2); dummy.updateMatrix(); links.setMatrixAt(i, dummy.matrix); }
      links.instanceMatrix.needsUpdate = true;
    };
    M.R1 = R1;

    M.gasMat = new THREE.MeshBasicMaterial({ color: 0x7fb3e6, transparent: true, opacity: 0.3, depthWrite: false });
    const gg = new THREE.CylinderGeometry(1.9, 1.9, 1, 40); gg.translate(0, 0.5, 0);
    M.gas = new THREE.Mesh(gg, M.gasMat); sys.root.add(M.gas);
    M.C_FRESH = new THREE.Color(0x6fa3dc).convertSRGBToLinear(); M.C_FIRE = new THREE.Color(0xffa23a).convertSRGBToLinear(); M.C_SPENT = new THREE.Color(0x8d8580).convertSRGBToLinear(); M.tmp = new THREE.Color();
    M.pCrank = pCrank; M.pRod = pRod; M.pPist = pPist; M.pRing = pRing; M.pCyl = pCyl; M.pHead = pHead; M.pPlug = pPlug; M.pCam = pCam; M.pRock = pRock; M.pChain = pChain;

    /* çevrim şeridi */
    const bars = (track, spans, cls) => spans.forEach(([a, b]) => { const d = document.createElement("span"); d.className = "c-bar " + cls; d.style.left = (a / 7.2) + "%"; d.style.width = ((b - a) / 7.2) + "%"; track.appendChild(d); });
    bars(el("trackIn"), [[0, 220], [710, 720]], "in"); bars(el("trackEx"), [[500, 720], [0, 10]], "ex");
    const tick = document.createElement("span"); tick.className = "c-spark"; tick.style.left = (345 / 7.2) + "%"; el("trackIn").appendChild(tick);
    M.marker = document.createElement("span"); M.marker.className = "c-marker"; el("cycle").appendChild(M.marker);
    M.segs = [...el("cSegs").children]; M.lastPh = -1; M.lastTxt = "";
  },
  update(sys, dt, S) {
    const M = sys.m, P = sys.place;
    M.th += (S.rpm / 7500) * 12 * dt; if (M.th > 4 * Math.PI * 1000) M.th -= 4 * Math.PI * 1000;
    const th = M.th, s = Math.sin(th), c = Math.cos(th), RC = M.RC, L = M.LROD;
    const yPin = RC * c + Math.sqrt(L * L - RC * RC * s * s);
    M.crankSpin.rotation.z = -th; P(M.pCrank, 0, 0, 0);
    P(M.pRod, RC * s, RC * c, 0); M.rodG.rotation.z = Math.asin(RC * s / L);
    P(M.pPist, 0, yPin, 0); P(M.pRing, 0, yPin, 0);
    P(M.pCyl, 0, 0, 0); P(M.pHead, 0, 0, 0); P(M.pPlug, 0, 0, 0);
    const camRot = -th / 2; M.camSpin.rotation.z = camRot; P(M.pCam, 0, 0, 0);
    const liftIn = M.camLift(camRot + M.OFF_IN - Math.PI / 2), liftEx = M.camLift(camRot + M.OFF_EX - Math.PI / 2);
    P(M.pIn, 0, 0, 0); P(M.pEx, 0, 0, 0);
    M.pIn.mov.position.y = -liftIn; M.pEx.mov.position.y = -liftEx;
    M.pIn.spring.scale.y = 1.9 - liftIn; M.pEx.spring.scale.y = 1.9 - liftEx;
    P(M.pRock, 0, 0, 0); M.rockers[0].rotation.z = liftIn / (M.VX / 2); M.rockers[1].rotation.z = -liftEx / (M.VX / 2);
    M.sprC.rotation.z = -th; M.sprK.rotation.z = -th / 2; P(M.pChain, 0, 0, M.Z_CHAIN); M.updateChain(-th * M.R1);

    const deg = ((th * 180 / Math.PI) % 720 + 720) % 720, top = yPin + 1.2;
    M.gas.position.y = top; M.gas.scale.y = Math.max(0.05, M.Y_ROOF - top); M.gas.visible = sys.ex < 0.04;
    let op, burst = 0; const t = M.tmp;
    if (deg < 180) { t.copy(M.C_FRESH); op = 0.12 + 0.2 * deg / 180; }
    else if (deg < 345) { t.copy(M.C_FRESH); op = 0.32 + 0.25 * (deg - 180) / 165; }
    else if (deg < 540) { const k = Math.min(1, (deg - 345) / 195); if (S.on && S.rpm > 150) { t.copy(M.C_FIRE).lerp(M.C_SPENT, Math.pow(k, 0.7)); op = 0.85 - 0.5 * k; burst = Math.max(0, 1 - (deg - 345) / 40); } else { t.copy(M.C_FRESH); op = 0.45 - 0.3 * k; } }
    else { t.copy(M.C_SPENT); op = 0.35 - 0.2 * (deg - 540) / 180; }
    M.gasMat.color.copy(t); M.gasMat.opacity = op;
    M.sparkMat.opacity = S.on && S.rpm > 150 && deg > 340 && deg < 362 ? 1 : 0;
    M.flash.intensity = M.gas.visible ? 3.5 * burst : 0;

    /* göstergeler */
    const segsBox = el("cSegs"), trEx = el("trackEx");
    M.marker.style.top = (segsBox.offsetTop - 2) + "px"; M.marker.style.height = (trEx.offsetTop + trEx.offsetHeight - segsBox.offsetTop + 4) + "px";
    M.marker.style.left = (deg / 720 * segsBox.offsetWidth + segsBox.offsetLeft) + "px";
    const ph = Math.floor(deg / 180);
    if (ph !== M.lastPh) { M.segs.forEach((x, i) => x.classList.toggle("on", i === ph)); M.lastPh = ph; }
    const rpm = Math.round(S.rpm / 50) * 50, a = Math.round(deg), oi = liftIn > 0.003, oe = liftEx > 0.003;
    const txt = rpm + "|" + a + "|" + oi + "|" + oe; if (txt === M.lastTxt) return; M.lastTxt = txt;
    el("mRpm").textContent = rpm.toLocaleString("tr-TR") + " d/d"; el("mAng").textContent = a + "°";
    const mi = el("mIn"), me = el("mEx");
    mi.className = "state " + (oi ? "in" : "off"); mi.textContent = oi ? "Açık" : "Kapalı";
    me.className = "state " + (oe ? "ex" : "off"); me.textContent = oe ? "Açık" : "Kapalı";
    const PH = ["Emme", "Sıkıştırma", "İş", "Egzoz"], SUB = ["Piston iniyor, karışım giriyor", "Piston çıkıyor, karışım sıkışıyor", "Yanma pistonu itiyor", "Piston çıkıyor, gaz dışarı atılıyor"];
    const tag = el("phaseTag"); tag.firstChild.nodeValue = PH[ph]; tag.querySelector("small").textContent = "Krank " + a + "° · " + SUB[ph];
  }
});
