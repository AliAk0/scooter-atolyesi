"use strict";
/* ALT SİSTEM: CVT ve son dişli kutusu */

const CVT = createSystem({
  id: "cvt", defaultSel: "bilye", tab: "CVT",
  metin: {
    eyebrow: "GY6 tipi · Kayışlı CVT · İki kademeli son dişli",
    title: "CVT ve Dişli Kutusu",
    lead: "Gazı aç, ön kasnağın büyüyüp arka kasnağın küçülmesini izle. Ayır ile parçaları birbirinden uzaklaştır, parçaya dokunarak ne iş yaptığını gör.",
    note: "Değerler GY6 tipi 50 cc için yaklaşık örnektir, ölçülmüş değildir. Hız yüksüz ve sınırlayıcısız hesaplandı; bu sınıf scooterlar mevzuat gereği 45 km/sa ile sınırlandırılır, sınırlama genellikle varyatördeki bir burçla ya da CDI'daki devir sınırıyla yapılır.",
    foot: "Geometri kodla üretilmiş geçici bir taslaktır; parça adları, bilgi kartları ve ayrılma yönleri ileride gerçek modellere aynen taşınacak şekilde tanımlandı."
  },
  view: { target: [0, -1.8, 0], dir: [0.36, 0.34, 0.87], hw: 19, hh: 12.5, k: 1.02 },
  GROUPS: ["Ön kasnak", "Kayış", "Arka kasnak", "Dişli kutusu"],
  PARTS: {
    krank: { ad: "Krank mili ucu", grup: "Ön kasnak", ayir: [0, 0, 0],
      islev: "Motorun dönüşü varyatöre buradan girer. Ön kasnaktaki bütün parçalar bu milin üzerinde, motorla aynı devirde döner.",
      kontrol: "Kama yuvası ve dişli kanal aşınması kasnağın boşluk yapmasına yol açar." },
    rampa: { ad: "Rampa plakası", grup: "Ön kasnak", ayir: [0, 0, -4.8],
      islev: "Mil üzerinde sabittir, eksen boyunca kaymaz. Konik yüzü bilyelere dayanak olur; bilye dışa kaçtıkça hareketli yarımı öne iter.",
      kontrol: "Kızaklarındaki izler ve çapaklar varyatörün takılmasına neden olur." },
    bilye: { ad: "Varyatör bilyeleri", grup: "Ön kasnak", ayir: [0, 0, -3.4],
      islev: "Devir yükseldikçe merkezkaç kuvvetiyle dışa kaçar, rampa plakası ile hareketli yarım arasına sıkışıp yarımı sabit yarıma doğru iter. Ağır bilye vitesi daha düşük devirde büyütür, hafif bilye motoru daha yüksek devirde tutar.",
      kontrol: "Düzleşmiş, köşelenmiş bilye düzgün yuvarlanmaz; takım halinde değiştirilir." },
    on_hareketli: { ad: "Ön hareketli yarım", grup: "Ön kasnak", ayir: [0, 0, -1.8],
      islev: "Bilyelerin itmesiyle sabit yarıma yaklaşır. Aradaki V-oluk daralır, kayış dışa itilir ve ön kayış çapı büyür. Arka yüzündeki yuvalar bilyeleri taşır.",
      kontrol: "Göbek burcu aşınırsa yarım eğik kayar, titreşim ve kayış aşınması başlar." },
    on_sabit: { ad: "Ön sabit yarım (fanlı)", grup: "Ön kasnak", ayir: [0, 0, 3.2],
      islev: "Kayışın dış yanağıdır, eksen boyunca hareket etmez. Arkasındaki kanatlar CVT kutusuna hava basarak kayışı ve kasnakları soğutur.",
      kontrol: "Kayış yüzeyinde basamak oluşmuşsa kayış düzgün tırmanamaz." },
    kayis: { ad: "V-kayış", grup: "Kayış", ayir: [0, 0, 0],
      islev: "Ön ve arka kasnağı bağlar. İç yüzündeki dişler esneklik ve soğuma sağlar. Uzunluğu sabit olduğu için önde büyük çapa çıkınca arkada küçük çapa iner; oran böyle değişir.",
      kontrol: "Çatlak, parlama ve genişlik kaybına bakılır. İncelen kayış en yüksek orana çıkamaz, son hız düşer." },
    arka_sabit: { ad: "Arka sabit yarım", grup: "Arka kasnak", ayir: [0, 0, -3.0],
      islev: "Tahrik edilen kasnağın sabit yanağıdır. Hareketli yarımla birlikte kayışın arkadaki çapını belirler.",
      kontrol: "Kayış izinde basamak ve renk değişimi aşırı ısınmayı gösterir." },
    arka_hareketli: { ad: "Arka hareketli yarım", grup: "Arka kasnak", ayir: [0, 0, 1.8],
      islev: "Tork yayı onu sabit yarıma bastırır. Önde kayış büyüdükçe arkada içeri çekilir ve yarım yayı sıkıştırarak açılır. Göbeğindeki tork kamı, yük artınca kasnağı kapatıp oranı küçültmeye yardım eder.",
      kontrol: "Kam yuvası ve pimleri aşınırsa yokuşta vites düşürme tepkisi zayıflar." },
    yay: { ad: "Tork yayı (kontra yay)", grup: "Arka kasnak", ayir: [0, 0, 3.0],
      islev: "Arka kasnağı kapalı, yani başlangıçta büyük kayış çapında tutar. Sert yay vitesin geç büyümesine ve motorun daha yüksek devirde kalmasına yol açar.",
      kontrol: "Zamanla gevşeyen yay kalkışta güç kaybı gibi hissedilir." },
    pabuc: { ad: "Debriyaj pabuçları", grup: "Arka kasnak", ayir: [0, 0, 4.2],
      islev: "Arka kasnakla birlikte döner. Belli bir devrin üzerinde merkezkaç kuvvetiyle açılır, balataları çana sürtünüp bağlanır. Rölantide toplanık durdukları için teker dönmez.",
      kontrol: "Balata kalınlığına bakılır; aşınmış balata sarsıntılı kalkış yapar." },
    can: { ad: "Debriyaj çanı", grup: "Arka kasnak", ayir: [0, 0, 6.5],
      islev: "Arka tahrik miline bağlıdır. Pabuçlar kavrayınca döner ve dönüşü redüksiyon dişlileri üzerinden arka tekere iletir.",
      kontrol: "İç yüzeyde parlama veya ovallik titremeli kalkışa yol açar." },
    ara_disli: { ad: "Ara mil ve dişliler", grup: "Dişli kutusu", ayir: [0, -5, -7],
      islev: "Debriyaj çanının milindeki küçük dişli, ara mildeki büyük dişliyi çevirir (14'ten 48 dişe, yaklaşık 3,4 kat yavaşlama). Ara mildeki küçük dişli de çıkış dişlisini sürer. Her kademede devir düşer, tork aynı oranda artar.",
      kontrol: "Devirle artan bir uğultu dişli kutusu rulmanlarının aşındığını gösterebilir." },
    cikis_disli: { ad: "Çıkış dişlisi ve teker mili", grup: "Dişli kutusu", ayir: [0, -9, -11],
      islev: "İkinci kademedir (13'ten 49 dişe, yaklaşık 3,8 kat). Teker mili doğrudan arka tekere bağlıdır; iki kademe birlikte yaklaşık 12,9:1 eder. CVT ile birlikte motor devri tekere 10 ile 34 kat arası azalarak iner.",
      kontrol: "Mil keçesi kaçırırsa dişli yağı kampana balatasına bulaşır ve arka fren tutmaz hale gelir." },
    dk_kutu: { ad: "Dişli kutusu ve yağı", grup: "Dişli kutusu", ayir: [0, 0, -16],
      islev: "Dişliler kapalı bir kutuda kendi yağıyla yağlanır; bu yağ motor yağından ayrıdır. Bu tip motorlarda genellikle 100 ml civarında dişli yağı kullanılır; doğru miktar ve tip kullanım kılavuzunda yazar.",
      kontrol: "Dişli yağı periyodik bakımda değiştirilir; motor yağı değişirken en sık unutulan yağdır." },
    arka_mil: { ad: "Arka tahrik mili", grup: "Arka kasnak", ayir: [0, 0, 0],
      islev: "Debriyaj çanını taşır ve dönüşü arkadaki dişli kutusuna iletir. Arka kasnak ve pabuçlar bu mil üzerinde yataklarla serbest döner; mili yalnızca çan çevirir.",
      kontrol: "Yatak boşluğu çan ve kasnakta salgı yapar." }
  },
  build(sys) {
    const K = 0.22, W = 1.8, T = 0.35, BT = 0.4, C = 23, XA = -C / 2, XB = C / 2;
    const RH_F = 1.0, RO_F = 4.4, RH_R = 1.6, RO_R = 5.6, ROLL_R = 0.42;
    const V = sys.v = { K, W, T, C, XA, XB, RH_F, RO_F, RH_R, RO_R, ROLL_R, Z_F: 0.45, Z_R: -0.31, Z_CP: 3.4, R1_MIN: 2.0, R1_MAX: 4.0, RSUM: 7.2,
      p: 0, eng: 0, aF: 0, aR: 0, aB: 0, lastR1: -1, springLen: 2, lastTxt: "" };
    const spinPart = id => { const p = sys.makePart(id); p.spin = new THREE.Group(); p.root.add(p.spin); return p; };
    const sheave = (rHub, rOut, s) => {
      const rb = 0.62, rim = (rOut - rHub) * K;
      const g = lathe([[rb, 0], [rHub, 0], [rOut, rim], [rOut, rim + T], [rHub, T], [rHub, T + 0.55], [rb, T + 0.55], [rb, 0]].map(p => [p[0], p[1] * s]), 0, 0, 72);
      g.rotateX(Math.PI / 2); return g;
    };

    V.pCrank = spinPart("krank");
    { const g = cylZ(0.55, 6.2, 28); g.translate(0, 0, -0.9); sys.addMesh(V.pCrank, g, MAT.dark, V.pCrank.spin); }

    V.pRamp = spinPart("rampa");
    { const f = r => -2.232 + 0.4086 * (r - 1.6);
      const g = lathe([[0.6, f(0.6)], [3.3, f(3.3)], [3.3, f(3.3) - 0.32], [0.6, f(0.6) - 0.32], [0.6, f(0.6)]]); g.rotateX(Math.PI / 2);
      sys.addMesh(V.pRamp, g, MAT.steel, V.pRamp.spin);
      for (let i = 0; i < 3; i++) { const m = sys.addMesh(V.pRamp, new THREE.BoxGeometry(0.5, 0.9, 0.35), MAT.steel, V.pRamp.spin); const a = i * 2 * Math.PI / 3 + Math.PI / 6;
        m.position.set(Math.cos(a) * 3.45, Math.sin(a) * 3.45, f(3.3) - 0.16); m.rotation.z = a; } }

    V.pRoll = spinPart("bilye"); V.rollers = [];
    for (let i = 0; i < 6; i++) { const m = sys.addMesh(V.pRoll, new THREE.CylinderGeometry(ROLL_R, ROLL_R, 0.78, 24), MAT.brass, V.pRoll.spin); m.userData.ang = i * Math.PI / 3; V.rollers.push(m); }

    V.pMovF = spinPart("on_hareketli"); sys.addMesh(V.pMovF, sheave(RH_F, RO_F, -1), MAT.alu, V.pMovF.spin);
    V.pFixF = spinPart("on_sabit"); sys.addMesh(V.pFixF, sheave(RH_F, RO_F, 1), MAT.alu, V.pFixF.spin);
    for (let i = 0; i < 14; i++) { const h = new THREE.Group(); h.rotation.z = i * 2 * Math.PI / 14; V.pFixF.spin.add(h);
      const m = sys.addMesh(V.pFixF, new THREE.BoxGeometry(2.7, 0.12, 0.6), MAT.dark, h); m.position.set(2.95, 0, T + (2.95 - RH_F) * K + 0.3); m.rotation.y = -Math.atan(K); }

    /* kayış */
    const cv = document.createElement("canvas"); cv.width = 128; cv.height = 16;
    const x2 = cv.getContext("2d"); x2.fillStyle = "#24272b"; x2.fillRect(0, 0, 128, 16); x2.fillStyle = "#3b3f45"; for (let i = 0; i < 128; i += 32) x2.fillRect(i, 0, 12, 16);
    V.beltTex = new THREE.CanvasTexture(cv); V.beltTex.wrapS = THREE.RepeatWrapping;
    V.pBelt = sys.makePart("kayis");
    const NB = 300, RING = NB + 1, geom = new THREE.BufferGeometry();
    const bPos = new Float32Array(4 * RING * 2 * 3), bUv = new Float32Array(4 * RING * 2 * 2), idx = [];
    for (let s = 0; s < 4; s++) for (let i = 0; i < NB; i++) { const a0 = s * RING * 2 + i * 2; idx.push(a0, a0 + 1, a0 + 2, a0 + 1, a0 + 3, a0 + 2); }
    geom.setAttribute("position", new THREE.BufferAttribute(bPos, 3)); geom.setAttribute("uv", new THREE.BufferAttribute(bUv, 2)); geom.setIndex(idx);
    const belt = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({ color: 0xffffff, map: V.beltTex, metalness: 0, roughness: 0.85, side: DS }));
    belt.userData.partId = "kayis"; V.pBelt.root.add(belt); V.pBelt.meshes.push(belt); sys.pickables.push(belt);
    V.updateBelt = (r1, r2, zA, zB) => {
      const beta = Math.asin((r2 - r1) / C), tA0 = Math.PI / 2 + beta, tA1 = 3 * Math.PI / 2 - beta, tB0 = -(Math.PI / 2 + beta), tB1 = Math.PI / 2 + beta;
      const Ll = Math.sqrt(C * C - (r2 - r1) * (r2 - r1)), LA = r1 * (tA1 - tA0), LB = r2 * (tB1 - tB0), L = LA + LB + 2 * Ll;
      const ho = W / 2 + BT * K, hi = W / 2 - BT * K, nB = [Math.cos(tA1), Math.sin(tA1)], nT = [Math.cos(tA0), Math.sin(tA0)];
      for (let i = 0; i <= NB; i++) {
        let s = (i / NB) * L, px, py, nx, ny, z;
        if (s < LA) { const th = tA0 + s / r1; nx = Math.cos(th); ny = Math.sin(th); px = XA + r1 * nx; py = r1 * ny; z = zA; }
        else if ((s -= LA) < Ll) { const u = s / Ll; [nx, ny] = nB; px = (XA + r1 * nx) * (1 - u) + (XB + r2 * nx) * u; py = r1 * ny * (1 - u) + r2 * ny * u; z = zA + (zB - zA) * u; }
        else if ((s -= Ll) < LB) { const th = tB0 + s / r2; nx = Math.cos(th); ny = Math.sin(th); px = XB + r2 * nx; py = r2 * ny; z = zB; }
        else { s -= LB; const u = Math.min(1, s / Ll); [nx, ny] = nT; px = (XB + r2 * nx) * (1 - u) + (XA + r1 * nx) * u; py = r2 * ny * (1 - u) + r1 * ny * u; z = zB + (zA - zB) * u; }
        const ox = px + nx * BT, oy = py + ny * BT, ix = px - nx * BT, iy = py - ny * BT;
        const Q = [[ox, oy, z + ho, ox, oy, z - ho], [ix, iy, z - hi, ix, iy, z + hi], [ox, oy, z + ho, ix, iy, z + hi], [ix, iy, z - hi, ox, oy, z - ho]];
        const u = (i / NB) * L / 1.2;
        for (let q = 0; q < 4; q++) { const v = (q * RING + i) * 2; bPos.set(Q[q], v * 3); bUv[v * 2] = u; bUv[v * 2 + 1] = 0; bUv[v * 2 + 2] = u; bUv[v * 2 + 3] = 1; }
      }
      geom.attributes.position.needsUpdate = true; geom.attributes.uv.needsUpdate = true; geom.computeVertexNormals(); geom.computeBoundingSphere();
    };

    V.pFixR = spinPart("arka_sabit"); sys.addMesh(V.pFixR, sheave(RH_R, RO_R, -1), MAT.alu, V.pFixR.spin);
    V.pMovR = spinPart("arka_hareketli"); sys.addMesh(V.pMovR, sheave(RH_R, RO_R, 1), MAT.alu, V.pMovR.spin);
    V.pSpring = spinPart("yay");
    V.springMesh = sys.addMesh(V.pSpring, new THREE.TubeGeometry(new Helix(2.05, 2, 5.5, "z"), 240, 0.12, 8, false), MAT.spring, V.pSpring.spin);
    V.Helix = Helix;

    V.pShoe = spinPart("pabuc"); V.shoes = [];
    sys.addMesh(V.pShoe, cylZ(3.2, 0.3, 64), MAT.steel, V.pShoe.spin);
    for (let i = 0; i < 3; i++) {
      const mid = i * 2 * Math.PI / 3, half = 50 * Math.PI / 180, a0 = mid - half, a1 = mid + half, rin = 3.35, rout = 3.9, sh = new THREE.Shape();
      sh.moveTo(rout * Math.cos(a0), rout * Math.sin(a0)); sh.absarc(0, 0, rout, a0, a1, false); sh.lineTo(rin * Math.cos(a1), rin * Math.sin(a1)); sh.absarc(0, 0, rin, a1, a0, true);
      const m = sys.addMesh(V.pShoe, new THREE.ExtrudeGeometry(sh, { depth: 1.2, bevelEnabled: false, curveSegments: 24 }), MAT.lining, V.pShoe.spin);
      m.position.z = 0.15; m.userData.mid = mid; V.shoes.push(m);
    }
    V.pBell = spinPart("can");
    { const g = lathe([[4.3, -0.2], [4.65, -0.2], [4.65, 1.9], [0.8, 1.9], [0.8, 1.6], [4.3, 1.6], [4.3, -0.2]], 0, 0, 80); g.rotateX(Math.PI / 2); sys.addMesh(V.pBell, g, MAT.steel, V.pBell.spin);
      for (let i = 0; i < 24; i++) { const m = sys.addMesh(V.pBell, new THREE.BoxGeometry(0.16, 0.18, 1.9), MAT.dark, V.pBell.spin); const a = i * Math.PI / 12; m.position.set(Math.cos(a) * 4.72, Math.sin(a) * 4.72, 0.85); m.rotation.z = a; } }
    V.pShaft = spinPart("arka_mil");
    { const g = cylZ(0.6, 10.4, 28); g.translate(0, 0, 0.9); sys.addMesh(V.pShaft, g, MAT.dark, V.pShaft.spin); }

    /* son dişli kutusu: 14/48 ve 13/49 diş, modül benzeri ölçek 0.075 */
    const gearG = (z, depth) => { const r = z * 0.075, s = new THREE.Shape();
      for (let i = 0; i < z * 2; i++) { const a = i / (z * 2) * Math.PI * 2, rr = i % 2 ? r + 0.12 : r - 0.08; i ? s.lineTo(rr * Math.cos(a), rr * Math.sin(a)) : s.moveTo(rr * Math.cos(a), rr * Math.sin(a)); }
      const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false }); g.translate(0, 0, -depth / 2); return g; };
    const GZ = -4.3, cd1 = (14 + 48) * 0.075, cd2 = (13 + 49) * 0.075;
    const pI = { x: V.XB, y: 0 }, pM = { x: V.XB + cd1 * Math.cos(-0.7), y: cd1 * Math.sin(-0.7) }, pO = { x: pM.x + cd2 * Math.cos(-2.2), y: pM.y + cd2 * Math.sin(-2.2) };
    V.gIn = new THREE.Group(); V.gIn.position.set(0, 0, GZ); V.pShaft.spin.add(V.gIn);
    sys.addMesh(V.pShaft, gearG(14, 0.7), MAT.steel, V.gIn);
    V.pMid = sys.makePart("ara_disli"); V.gMid = new THREE.Group(); V.pMid.root.add(V.gMid);
    sys.addMesh(V.pMid, gearG(48, 0.6), MAT.steel, V.gMid).position.z = GZ;
    sys.addMesh(V.pMid, gearG(13, 0.7), MAT.steel, V.gMid).position.z = GZ - 1.1;
    sys.addMesh(V.pMid, cylZ(0.45, 2.6, 14), MAT.dark, V.gMid).position.z = GZ - 0.6;
    V.pOut = sys.makePart("cikis_disli"); V.gOut = new THREE.Group(); V.pOut.root.add(V.gOut);
    sys.addMesh(V.pOut, gearG(49, 0.6), MAT.steel, V.gOut).position.z = GZ - 1.1;
    { const g = cylZ(0.75, 7, 18); g.translate(0, 0, GZ - 4.4); sys.addMesh(V.pOut, g, MAT.dark, V.gOut); }
    V.pBox = sys.makePart("dk_kutu");
    { const minX = Math.min(pI.x, pM.x, pO.x) - 4.4, maxX = Math.max(pI.x, pM.x, pO.x) + 4.4, minY = Math.min(pI.y, pM.y, pO.y) - 4.4, maxY = Math.max(pI.y, pM.y, pO.y) + 4.4;
      const g = new THREE.BoxGeometry(maxX - minX, maxY - minY, 2.8);
      g.translate((minX + maxX) / 2, (minY + maxY) / 2, GZ - 0.6);
      sys.addMesh(V.pBox, g, new THREE.MeshStandardMaterial({ color: 0x9aa2ab, metalness: 0.3, roughness: 0.4, transparent: true, opacity: 0.18, depthWrite: false, side: DS }));
      const oil = new THREE.BoxGeometry(maxX - minX - 0.4, (maxY - minY) * 0.28, 2.4);
      oil.translate((minX + maxX) / 2, minY + (maxY - minY) * 0.14 + 0.2, GZ - 0.6);
      sys.addMesh(V.pBox, oil, new THREE.MeshStandardMaterial({ color: 0x8a6a2a, roughness: 0.3, transparent: true, opacity: 0.4, depthWrite: false })); }
    V.gp = { pM, pO }; V.aMid = 0; V.aOut = 0;
  },
  update(sys, dt, S) {
    const V = sys.v, P = sys.place, K = V.K, W = V.W, T = V.T;
    const pT = Math.min(1, Math.max(0, (S.rpm - 4200) / 2600));
    V.p += (pT - V.p) * Math.min(1, dt * 2.5);
    const t = Math.min(1, Math.max(0, (S.rpm - 2800) / 800)); V.eng = t * t * (3 - 2 * t);
    const r1 = V.R1_MIN + (V.R1_MAX - V.R1_MIN) * V.p, r2 = V.RSUM - r1;
    V.r1 = r1; V.r2 = r2;
    const hsF = W - 2 * (r1 - V.RH_F) * K, hsR = W - 2 * (r2 - V.RH_R) * K, zMovF = V.Z_F - hsF, rr = 1.6 + 1.4 * V.p;

    P(V.pCrank, V.XA, 0, 0); P(V.pFixF, V.XA, 0, V.Z_F); P(V.pMovF, V.XA, 0, zMovF); P(V.pRamp, V.XA, 0, 0);
    P(V.pRoll, V.XA, 0, zMovF - T - (rr - V.RH_F) * K - V.ROLL_R);
    V.rollers.forEach(m => { const a = m.userData.ang; m.position.set(Math.cos(a) * rr, Math.sin(a) * rr, 0); m.rotation.z = a; });
    if (Math.abs(r1 - V.lastR1) > 0.0008) { V.updateBelt(r1, r2, V.Z_F - hsF / 2, V.Z_R + hsR / 2); V.lastR1 = r1; }
    P(V.pBelt, 0, 0, 0);
    P(V.pFixR, V.XB, 0, V.Z_R); P(V.pMovR, V.XB, 0, V.Z_R + hsR);
    const ex = sys.ex, a = id => sys.PARTS[id].ayir[2] * ex;
    const sStart = V.Z_R + hsR + T + (2.05 - V.RH_R) * K + 0.06 + a("arka_hareketli"), sEnd = V.Z_CP - 0.16 + a("pabuc"), len = Math.max(0.4, sEnd - sStart);
    V.pSpring.root.position.set(V.XB, 0, sStart);
    if (Math.abs(len - V.springLen) > 0.015) { V.springMesh.geometry.dispose(); V.springMesh.geometry = new THREE.TubeGeometry(new V.Helix(2.05, len, 5.5, "z"), 240, 0.12, 8, false); V.springLen = len; }
    P(V.pShoe, V.XB, 0, V.Z_CP);
    const grow = 0.34 * V.eng; V.shoes.forEach(m => { m.position.x = Math.cos(m.userData.mid) * grow; m.position.y = Math.sin(m.userData.mid) * grow; });
    P(V.pBell, V.XB, 0, V.Z_CP); P(V.pShaft, V.XB, 0, 0);

    const w1 = (S.rpm / 7500) * 12, w2 = w1 * r1 / r2;
    V.aF += w1 * dt; V.aR += w2 * dt; V.aB += w2 * V.eng * dt;
    [V.pCrank, V.pRamp, V.pRoll, V.pMovF, V.pFixF].forEach(p => p.spin.rotation.z = V.aF);
    [V.pFixR, V.pMovR, V.pSpring, V.pShoe].forEach(p => p.spin.rotation.z = V.aR);
    V.pBell.spin.rotation.z = V.aB; V.pShaft.spin.rotation.z = V.aB;
    V.aMid = -V.aB * 14 / 48; V.aOut = -V.aMid * 13 / 49;
    P(V.pMid, V.gp.pM.x, V.gp.pM.y, 0); V.gMid.rotation.z = V.aMid;
    P(V.pOut, V.gp.pO.x, V.gp.pO.y, 0); V.gOut.rotation.z = V.aOut;
    P(V.pBox, 0, 0, 0);
    V.beltTex.offset.x -= (w1 * r1 * dt) / 1.2;

    placeTag(el("tagF"), V.XA, V.RO_F + 1.6, 0.4); placeTag(el("tagR"), V.XB, V.RO_R + 1.6, 0.4);

    const wheelRpm = S.rpm * (r1 / r2) * V.eng / (48 / 14 * 49 / 13), kmh = wheelRpm * Math.PI * 0.41 * 60 / 1000;
    const rpm = Math.round(S.rpm / 50) * 50, txt = rpm + "|" + r1.toFixed(2) + "|" + V.eng.toFixed(2) + "|" + Math.round(kmh);
    if (txt === V.lastTxt) return; V.lastTxt = txt;
    const fmt = (n, d) => n.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d });
    el("vRpm").textContent = fmt(rpm, 0) + " d/d"; el("vRatio").textContent = fmt(r2 / r1, 2) + " : 1";
    el("vF").textContent = "Ø " + Math.round(r1 * 20) + " mm"; el("vR").textContent = "Ø " + Math.round(r2 * 20) + " mm";
    el("vWh").textContent = Math.round(wheelRpm) + " d/d"; el("vKmh").textContent = Math.round(kmh) + " km/sa";
    const c = el("vClutch");
    if (V.eng < 0.05) { c.className = "state off"; c.textContent = "Ayrık · teker durur"; }
    else if (V.eng < 0.95) { c.className = "state mid"; c.textContent = "Kavranıyor · kaydırıyor"; }
    else { c.className = "state on"; c.textContent = "Kavramış · teker döner"; }
  }
});
