"use strict";
/* ALT SİSTEM: şarj, ateşleme ve marş devresi */

const elecModel = S => {
  const rpm = S.rpm, bt = BAT[S.batt];
  const igen = Math.min(1, Math.max(0, (rpm - 1500) / 2500)) * 2.2, load = S.on ? 1.0 : 0;
  const istart = S.cranking && S.relay ? bt.amp : 0, ibat = igen - load - istart;
  let vbus;
  if (S.cranking) vbus = S.relay ? bt.sag : bt.rest - 0.3;
  else vbus = ibat < -0.05 ? bt.rest - 0.25 + ibat * 0.15 : ibat <= 0.05 ? bt.rest : Math.min(14.4, 12.8 + ibat * 1.4);
  return { hz: rpm / 60 * 4, vac: Math.min(58, rpm * 0.0075), igen, load, istart, ibat, vbus, sps: rpm / 60 };
};
const ELEK = createSystem({
  id: "elektrik", defaultSel: "stator", tab: "Elektrik",
  metin: {
    eyebrow: "GY6 tipi · 12 V · Manyeto ve CDI ateşleme",
    title: "Şarj ve Ateşleme Sistemi",
    lead: "Volandaki mıknatıslar statorun etrafında döndükçe alternatif akım üretir; regülatör bunu doğrultup aküyü şarj eder. Ayrı bir devre her krank turunda bujiye kıvılcım gönderir. Kontağı kapatıp marşla çalıştırmayı, akü durumunu değiştirerek de zayıf akünün belirtilerini dene.",
    note: "Kablolardaki noktalar akımı temsil eder: AC'de ileri geri salınır, DC'de tek yönde akar, mor hatta ateşleme darbesi ilerler. Akış ve kıvılcım izlenebilsin diye yavaşlatıldı. Gerilim ve akım değerleri yaklaşık örnektir; grafik yüksüz stator dalgasını gösterir.",
    foot: "Bileşenler scooterdaki gerçek yerlerinde değil, devre sırasına göre dizildi. Volan, içindeki stator görünsün diye açık yüzü öne bakacak şekilde çizildi. Bu sınıf motorlarda CDI bazı versiyonlarda statordaki bir bobinden (AC-CDI), bazılarında aküden (DC-CDI) beslenir; burada AC-CDI gösterildi. AC-CDI'lı motor akü bitik olsa bile ayakla (kick) çalıştırılabilir, çünkü ateşleme enerjisini statordan alır. Sigorta ve şase dönüşleri sadelik için çizilmedi."
  },
  view: { target: [9.5, 3.5, 0], dir: [0.26, 0.28, 0.92], hw: 34, hh: 19, k: 1.06, minD: 8, maxD: 240 },
  GROUPS: ["Şarj devresi", "Ateşleme devresi", "Marş devresi"],
  PARTS: {
    volan: { ad: "Volan (manyeto rotoru)", grup: "Şarj devresi", ayir: [0, 0, 10],
      islev: "İç yüzeyine dizilmiş kalıcı mıknatıslar (kırmızı N, mavi S) statorun etrafında döner. Bobinlerden geçen manyetik akı her mıknatıs geçişinde yön değiştirdiği için bobinlerde alternatif gerilim indüklenir. Krank milinin sağ ucuna kamayla sabitlenir; üzerine silindiri soğutan fan bağlanır. Dış yüzündeki çıkıntı ateşleme zamanlamasını verir.",
      kontrol: "Kama kesilirse volan krank üzerinde kayar, ateşleme zamanı bozulur ve motor çalışmaz ya da geri teper." },
    stator: { ad: "Stator (şarj bobinleri)", grup: "Şarj devresi", ayir: [0, 0, 0],
      islev: "Yerinde sabit duran demir nüve ve üzerine sarılı bobinlerdir. Mıknatıslar geçtikçe her bobinde gerilim indüklenir; bobinler seri bağlanarak toplanır. Frekans devirle ve mıknatıs sayısıyla doğru orantılıdır: 8 mıknatısla her turda 4 tam dalga çıkar. Koyu renkli bobin daha ince telli besleme bobinidir ve CDI'yı besler.",
      kontrol: "Bobin dirençleri ve yüksüz AC çıkış ölçülür; kararmış sargı ve yanık kokusu arıza işaretidir." },
    regulator: { ad: "Regülatör-redresör", grup: "Şarj devresi", ayir: [0, 3, 3],
      islev: "Statorun AC çıkışını diyotlarla doğrultup DC'ye çevirir ve gerilimi 14-15 V civarında sınırlar. Bu tip regülatör fazla enerjiyi ısıya çevirerek atar; bu yüzden kanatlı alüminyum gövdelidir.",
      kontrol: "Yüksek devirde akü uçlarında yaklaşık 13,5-15 V görülmeli. Çok yüksekse regülatör, düşükse stator veya regülatör şüphelidir." },
    aku: { ad: "Akü (12 V, MF)", grup: "Şarj devresi", ayir: [3, 3, 0],
      islev: "Motor dururken ve rölantide elektrik ihtiyacını karşılar, marş motoruna enerji verir. Bakım gerektirmeyen (MF) tiptir; su eklenmez. Devir yükselince stator yükü tek başına karşılar ve fazlası aküyü şarj eder.",
      kontrol: "Dinlenmiş akü 12,6 V civarında olmalı; 12,2 V'un altı yarı boş demektir. Marşa basınca gerilim çok düşüyorsa akü zayıftır." },
    lamba: { ad: "Aydınlatma (yük)", grup: "Şarj devresi", ayir: [3, 0, 0],
      islev: "Far, stop ve gösterge lambalarını temsil eder. Rölantide stator yeterli akım üretemediğinde bu yükü akü karşılar; devir yükselince stator hem yükü besler hem aküyü şarj eder.",
      kontrol: "Rölantide farlar belirgin biçimde sönükleşiyorsa akü veya şarj sistemi kontrol edilmeli." },
    pikap: { ad: "Pikap (tetik bobini)", grup: "Ateşleme devresi", ayir: [3, 3, 0],
      islev: "Volanın dış yüzündeki çıkıntı önünden geçerken küçük bir gerilim darbesi üretir. CDI bu darbeyi pistonun ÜÖN'ye yaklaştığı bilgisi olarak kullanır.",
      kontrol: "Volanla arasındaki hava boşluğu ve bobin direnci ölçülür." },
    cdi: { ad: "CDI ünitesi", grup: "Ateşleme devresi", ayir: [0, -3, 3],
      islev: "İçindeki kondansatörü besleme bobininden gelen enerjiyle yüzlerce volta şarj eder. Pikaptan darbe gelince kondansatörü ateşleme bobininin primerine boşaltır. Ateşleme avansını devre göre ayarlar.",
      kontrol: "Kıvılcım yoksa önce buji, bobin ve pikap kontrol edilir; CDI en son, çalışan bir eşdeğeriyle değiştirilerek denenir." },
    bobin: { ad: "Ateşleme bobini", grup: "Ateşleme devresi", ayir: [0, -3, 3],
      islev: "Bir yükseltici transformatördür. Az sarımlı primerine gelen ani darbe, çok sarımlı sekonderde on binlerce volta çıkar ve buji kablosuyla bujiye gider.",
      kontrol: "Primer ve sekonder dirençleri ölçülür; buji başlığındaki çatlak yüksek gerilimin kaçmasına yol açar." },
    kontak: { ad: "Kontak anahtarı", grup: "Marş devresi", ayir: [0, 4, 0],
      islev: "Açıldığında akü gücünü aydınlatmaya, kornaya ve marş devresine verir. Kapatıldığında CDI'yı şaseye bağlayarak ateşlemeyi keser; motor bu yüzden durur.",
      kontrol: "Kontak açıkken gösterge ışıkları yanmıyorsa önce sigorta ve akü bağlantıları kontrol edilir." },
    mars_butonu: { ad: "Marş butonu ve fren anahtarı", grup: "Marş devresi", ayir: [0, 4, 0],
      islev: "Scooterlarda marş butonu fren anahtarıyla seri bağlıdır: fren kolu sıkılmadan marş çalışmaz. Böylece motor çalıştığı anda scooter kendiliğinden hareket etmez. Buton yalnızca rölenin bobinine küçük bir akım gönderir; buradaki Marş butonu kolun sıkılı olduğunu varsayar.",
      kontrol: "Marşa basınca hiç ses gelmiyorsa fren anahtarı ve buton kontağı kontrol edilir; stop lambası yanmıyorsa fren anahtarı şüphelidir." },
    role: { ad: "Marş rölesi", grup: "Marş devresi", ayir: [3, 3, 0],
      islev: "Butondan gelen küçük akım bobini mıknatıslar, bobin kalın kontakları kapatır ve aküden marş motoruna onlarca amperlik akım geçer. Böylece büyük akım ince buton kablolarından geçmez.",
      kontrol: "Röle tıklıyor ama marş dönmüyorsa akü, kablo bağlantıları ya da röle kontakları şüphelidir. Hızlı ardışık tıkırtı tipik bitik akü belirtisidir: marş yüklenince gerilim çöker, röle bırakır, gerilim toparlanır, röle tekrar çeker." },
    mars_motoru: { ad: "Marş motoru", grup: "Marş devresi", ayir: [4, -2, 0],
      islev: "Küçük bir DC motordur ve en çok akımı çeken tüketicidir. Bu tip motorlarda genellikle Bendix tipi bir dişliyle varyatör tarafındaki marş dişlisine kavrayıp krankı çevirir; motor çalışınca dişli geri çekilir.",
      kontrol: "Marş ağır dönüyorsa önce akü ölçülür; akü sağlamsa marş kömürleri ve kablo bağlantıları kontrol edilir." },
    buji: { ad: "Buji", grup: "Ateşleme devresi", ayir: [3, -3, 0],
      islev: "Bobinden gelen yüksek gerilim elektrotlar arasındaki havayı delerek kıvılcım oluşturur. Bu motorda pikap her krank turunda tetiklendiği için buji egzoz zamanının sonunda da çakar (boşa ateşleme). O anda silindirde yanacak karışım olmadığı için zararsızdır.",
      kontrol: "Tırnak aralığı ve uç rengine bakılır; açık kahverengi uç düzgün yanmayı gösterir." }
  },
  build(sys) {
    const E = sys.e = { phi: 0, acPh: 0, packets: [], flash: 0, lastTxt: "", wires: {}, dc: { reg: 0, gnd: 0, lp: 0, ln: 0, c1: 0, c2: 0, c3: 0, b1: 0, b2: 0 } };
    const CX = -18;
    const label = (text, w, h, bg, fg) => {
      const c = document.createElement("canvas"); c.width = 256; c.height = Math.round(256 * h / w);
      const x = c.getContext("2d"); x.fillStyle = bg; x.fillRect(0, 0, c.width, c.height);
      x.fillStyle = fg; x.font = "600 " + Math.round(c.height * 0.42) + "px Arial, sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(text, c.width / 2, c.height / 2);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) })); return m;
    };
    const copper = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.6, roughness: 0.35 });
    const copperDark = new THREE.MeshStandardMaterial({ color: 0x6e3f1c, metalness: 0.5, roughness: 0.45 });
    const black = new THREE.MeshStandardMaterial({ color: 0x2a2d31, metalness: 0.1, roughness: 0.6 });
    const magN = new THREE.MeshStandardMaterial({ color: 0xb8433a, metalness: 0.3, roughness: 0.5 });
    const magS = new THREE.MeshStandardMaterial({ color: 0x3f6fae, metalness: 0.3, roughness: 0.5 });

    /* volan */
    const pV = sys.makePart("volan"); E.rotor = new THREE.Group(); E.rotor.position.set(CX, 0, 0); pV.root.add(E.rotor);
    { const g = lathe([[1.2, -2.4], [6.0, -2.4], [6.0, 1.6], [5.45, 1.6], [5.45, -1.9], [1.2, -1.9], [1.2, -2.4]], 0, 0, 72); g.rotateX(Math.PI / 2); sys.addMesh(pV, g, MAT.steel, E.rotor); }
    for (let i = 0; i < 8; i++) {
      const mid = i * Math.PI / 4, h = 18 * Math.PI / 180, a0 = mid - h, a1 = mid + h, sh = new THREE.Shape();
      sh.moveTo(5.43 * Math.cos(a0), 5.43 * Math.sin(a0)); sh.absarc(0, 0, 5.43, a0, a1, false); sh.lineTo(4.95 * Math.cos(a1), 4.95 * Math.sin(a1)); sh.absarc(0, 0, 4.95, a1, a0, true);
      const g = new THREE.ExtrudeGeometry(sh, { depth: 3.2, bevelEnabled: false, curveSegments: 12 }); g.translate(0, 0, -1.8);
      sys.addMesh(pV, g, i % 2 ? magS : magN, E.rotor);
    }
    { const m = sys.addMesh(pV, new THREE.BoxGeometry(0.9, 0.8, 1.4), MAT.dark, E.rotor); m.position.set(6.4, 0, -0.4); }
    { const g = cylZ(0.75, 6, 20); sys.addMesh(pV, g, MAT.dark, E.rotor); }

    /* stator */
    const pS = sys.makePart("stator"); const st = new THREE.Group(); st.position.set(CX, 0, 0); pS.root.add(st);
    sys.addMesh(pS, cylZ(1.5, 2.4, 32), MAT.dark, st);
    for (let i = 0; i < 8; i++) {
      const g = new THREE.Group(); g.rotation.z = i * Math.PI / 4 + Math.PI / 8; st.add(g);
      const core = sys.addMesh(pS, new THREE.BoxGeometry(3.3, 0.9, 2.4), MAT.dark, g); core.position.set(3.0, 0, -0.2);
      const shoe = sys.addMesh(pS, new THREE.BoxGeometry(0.28, 2.1, 2.4), MAT.dark, g); shoe.position.set(4.72, 0, -0.2);
      const wnd = sys.addMesh(pS, new THREE.BoxGeometry(1.7, 1.8, 3.0), i === 0 ? copperDark : copper, g); wnd.position.set(3.05, 0, -0.2);
    }

    /* pikap */
    const pP = sys.makePart("pikap"); const pk = new THREE.Group(); pk.position.set(CX + 7.3 * Math.cos(Math.PI / 4), 7.3 * Math.sin(Math.PI / 4), -0.4); pk.rotation.z = Math.PI / 4; pP.root.add(pk);
    sys.addMesh(pP, new THREE.BoxGeometry(1.5, 1.1, 1.3), black, pk);
    { const t = new THREE.TorusGeometry(0.5, 0.18, 8, 20); t.rotateY(Math.PI / 2); const m = sys.addMesh(pP, t, copper, pk); m.position.x = -0.3; }
    E.pkGlowMat = new THREE.MeshBasicMaterial({ color: 0x8fc0ff, transparent: true, opacity: 0 });
    { const gl = new THREE.Mesh(new THREE.SphereGeometry(1.1, 16, 12), E.pkGlowMat); pk.add(gl); }

    /* regülatör */
    const pR = sys.makePart("regulator"); const rg = new THREE.Group(); rg.position.set(0, 8, 0); pR.root.add(rg);
    sys.addMesh(pR, new THREE.BoxGeometry(6, 5, 1.6), MAT.alu, rg);
    for (let i = 0; i < 6; i++) { const f = sys.addMesh(pR, new THREE.BoxGeometry(0.25, 4.6, 1.0), MAT.alu, rg); f.position.set(-2.5 + i, 0, -1.2); }
    { const l = label("REG", 3, 1.2, "#3a3f46", "#e8ebee"); l.position.set(0, 0, 0.81); rg.add(l); }

    /* akü */
    const pA = sys.makePart("aku"); const ak = new THREE.Group(); ak.position.set(17, 6, 0); pA.root.add(ak);
    sys.addMesh(pA, new THREE.BoxGeometry(11.3, 8.6, 7), black, ak);
    { const lid = sys.addMesh(pA, new THREE.BoxGeometry(11.5, 0.6, 7.2), MAT.dark, ak); lid.position.y = 4.0; }
    { const tp = sys.addMesh(pA, new THREE.CylinderGeometry(0.5, 0.5, 0.9, 16), new THREE.MeshStandardMaterial({ color: 0xc23b30, roughness: 0.5 }), ak); tp.position.set(3, 4.7, 0); }
    { const tn = sys.addMesh(pA, new THREE.CylinderGeometry(0.5, 0.5, 0.9, 16), MAT.dark, ak); tn.position.set(-3, 4.7, 0); }
    { const l = label("12V  MF", 8, 2.4, "#2a2d31", "#e8ebee"); l.position.set(0, 0.6, 3.51); ak.add(l); }

    /* lamba */
    const pL = sys.makePart("lamba"); const lp = new THREE.Group(); lp.position.set(28, 8.6, 0); pL.root.add(lp);
    { const sock = sys.addMesh(pL, new THREE.CylinderGeometry(0.9, 0.9, 1.6, 20), MAT.steel, lp); sock.position.y = 2.6; }
    sys.addMesh(pL, new THREE.SphereGeometry(2.2, 28, 20), new THREE.MeshStandardMaterial({ color: 0xf6f2e4, metalness: 0, roughness: 0.2, transparent: true, opacity: 0.45 }), lp);
    E.lampMat = new THREE.MeshBasicMaterial({ color: 0xffe08a });
    { const fil = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 12), E.lampMat); lp.add(fil); }

    /* CDI */
    const pC = sys.makePart("cdi"); const cd = new THREE.Group(); cd.position.set(0, -8, 0); pC.root.add(cd);
    sys.addMesh(pC, new THREE.BoxGeometry(5, 3.4, 2), black, cd);
    { const l = label("CDI", 3, 1.4, "#2a2d31", "#e8ebee"); l.position.set(0, 0, 1.01); cd.add(l); }

    /* bobin */
    const pB = sys.makePart("bobin"); const bb = new THREE.Group(); bb.position.set(12, -9, 0); pB.root.add(bb);
    { const g = new THREE.CylinderGeometry(1.5, 1.5, 6, 24); g.rotateZ(Math.PI / 2); sys.addMesh(pB, g, black, bb); }
    { const tw = sys.addMesh(pB, new THREE.CylinderGeometry(0.6, 0.7, 1.6, 16), black, bb); tw.position.set(2, 1.9, 0); }
    { const br = sys.addMesh(pB, new THREE.BoxGeometry(1.2, 3.4, 0.4), MAT.steel, bb); br.position.set(-2.4, 0, -1.6); }

    /* buji */
    const pJ = sys.makePart("buji"); const pj = new THREE.Group(); pj.position.set(24, -11.7, 0); pJ.root.add(pj);
    { const t = new THREE.CylinderGeometry(0.42, 0.42, 1.5, 16); t.translate(0, 0.75, 0); sys.addMesh(pJ, t, MAT.steel, pj);
      const h = new THREE.CylinderGeometry(0.62, 0.62, 0.7, 6); h.translate(0, 1.85, 0); sys.addMesh(pJ, h, MAT.dark, pj);
      const c = new THREE.CylinderGeometry(0.3, 0.38, 2.6, 16); c.translate(0, 3.5, 0); sys.addMesh(pJ, c, MAT.ceramic, pj);
      const b = new THREE.CylinderGeometry(0.75, 0.6, 2.2, 16); b.translate(0, 5.8, 0); sys.addMesh(pJ, b, black, pj);
      const e = new THREE.CylinderGeometry(0.07, 0.07, 0.3, 8); e.translate(0, -0.15, 0); sys.addMesh(pJ, e, MAT.dark, pj); }
    E.sparkMat = new THREE.MeshBasicMaterial({ color: 0xd8e6ff, transparent: true, opacity: 0 });
    { const sp = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 12), E.sparkMat); sp.position.y = -0.45; pj.add(sp); }

    /* kontak */
    const pKt = sys.makePart("kontak"); const kt = new THREE.Group(); kt.position.set(6, 19, 0); pKt.root.add(kt);
    sys.addMesh(pKt, cylZ(1.5, 2.2, 24), black, kt);
    E.key = new THREE.Group(); E.key.position.z = 1.6; kt.add(E.key);
    sys.addMesh(pKt, new THREE.BoxGeometry(0.5, 2.2, 0.3), MAT.steel, E.key).position.y = 0.3;
    sys.addMesh(pKt, cylZ(0.9, 0.5, 18), MAT.dark, E.key).position.z = 0.15;

    /* marş butonu ve fren anahtarı */
    const pMb = sys.makePart("mars_butonu"); const mb = new THREE.Group(); mb.position.set(20, 20, 0); pMb.root.add(mb);
    sys.addMesh(pMb, new THREE.BoxGeometry(4.2, 2.6, 2.2), black, mb);
    E.btn = sys.addMesh(pMb, cylZ(0.75, 0.8, 18), new THREE.MeshStandardMaterial({ color: 0xc23b30, roughness: 0.5 }), mb); E.btn.position.set(-0.8, 0, 1.3);
    { const bs = sys.addMesh(pMb, new THREE.BoxGeometry(1.2, 1.0, 1.0), MAT.dark, mb); bs.position.set(1.2, 0, 1.2); }
    { const l = label("START", 2.2, 0.8, "#2a2d31", "#e8ebee"); l.position.set(-0.6, -0.9, 1.11); mb.add(l); }

    /* marş rölesi */
    const pRl = sys.makePart("role"); const rl = new THREE.Group(); rl.position.set(33, 15, 0); pRl.root.add(rl);
    sys.addMesh(pRl, new THREE.BoxGeometry(3.4, 3.6, 2.8), black, rl);
    E.plunger = sys.addMesh(pRl, new THREE.CylinderGeometry(0.5, 0.5, 1.0, 16), MAT.steel, rl); E.plunger.position.y = 2.3;
    [-1, 1].forEach(x => { const t = sys.addMesh(pRl, new THREE.CylinderGeometry(0.4, 0.4, 0.8, 12), MAT.alu, rl); t.position.set(x * 1.1, -2.2, 0); });
    { const l = label("RÖLE", 2.6, 1.0, "#2a2d31", "#e8ebee"); l.position.set(0, 0.2, 1.41); rl.add(l); }
    E.relayGlowMat = new THREE.MeshBasicMaterial({ color: 0xfff1b8, transparent: true, opacity: 0 });
    { const g = new THREE.Mesh(new THREE.SphereGeometry(1.2, 14, 10), E.relayGlowMat); g.position.y = 2.6; rl.add(g); }

    /* marş motoru */
    const pSm = sys.makePart("mars_motoru"); const sm = new THREE.Group(); sm.position.set(38.5, 2, 0); pSm.root.add(sm);
    { const g = new THREE.CylinderGeometry(2.4, 2.4, 7, 28); g.rotateZ(Math.PI / 2); sys.addMesh(pSm, g, MAT.steel, sm); }
    { const g = new THREE.CylinderGeometry(2.0, 2.0, 1.0, 24); g.rotateZ(Math.PI / 2); g.translate(3.9, 0, 0); sys.addMesh(pSm, g, MAT.dark, sm); }
    { const t = sys.addMesh(pSm, new THREE.CylinderGeometry(0.45, 0.45, 0.9, 12), MAT.alu, sm); t.position.set(1.5, 2.6, 0); }
    E.pinion = new THREE.Group(); E.pinion.position.set(-4.2, 0, 0); sm.add(E.pinion);
    { const sh = new THREE.Shape(); for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2, r = i % 2 ? 1.05 : 0.8; i ? sh.lineTo(r * Math.cos(a), r * Math.sin(a)) : sh.moveTo(r * Math.cos(a), r * Math.sin(a)); }
      const g = new THREE.ExtrudeGeometry(sh, { depth: 1.2, bevelEnabled: false }); g.translate(0, 0, -0.6); g.rotateY(Math.PI / 2); sys.addMesh(pSm, g, MAT.steel, E.pinion); }
    { const g = new THREE.CylinderGeometry(0.3, 0.3, 1.4, 10); g.rotateZ(Math.PI / 2); g.translate(0.8, 0, 0); sys.addMesh(pSm, g, MAT.dark, E.pinion); }

    /* kablolar (seçilemez) ve akım noktaları */
    E.wireG = new THREE.Group(); sys.root.add(E.wireG);
    const WC = { ac: 0xd9732b, dc: 0xc23b30, gnd: 0x5d6670, sig: 0x3f7fc0, hv: 0x8a5cc7 };
    const DOT = { ac: 0xffc58f, dc: 0xff9d8f, gnd: 0xd6dce2, sig: 0xb9d8ff, hv: 0xe2cbff };
    const wire = (name, type, pts, r) => {
      const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)));
      const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 90, r || 0.2, 8, false), new THREE.MeshStandardMaterial({ color: WC[type], roughness: 0.55, metalness: 0.1 }));
      E.wireG.add(m);
      const len = curve.getLength(), n = Math.max(4, Math.round(len / 1.7)), dots = [];
      if (type !== "hv" && type !== "sig") for (let i = 0; i < n; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 8), new THREE.MeshBasicMaterial({ color: DOT[type] })); E.wireG.add(d); dots.push(d); }
      E.wires[name] = { curve, dots, n };
    };
    wire("acA", "ac", [[CX - 0.6, 0.8, -2.7], [-16, 6.8, -2.9], [-9, 9.6, -1.5], [-3, 8.4, 0]]);
    wire("acB", "ac", [[CX + 0.6, 0.8, -2.7], [-15, 7.4, -3.4], [-8.5, 10.6, -1.9], [-3, 7.2, 0]]);
    wire("src", "ac", [[CX, -0.8, -2.7], [-15, -7, -2.6], [-8, -9.2, -1], [-2.5, -8, 0]]);
    wire("reg", "dc", [[3, 9, 0], [8, 13, 0], [16, 13.6, 0], [20, 11.1, 0]]);
    wire("gnd", "gnd", [[14, 11.1, 0], [12, 13.2, -1.5], [6, 11.6, -1.5], [3, 7, -0.6]]);
    wire("lp", "dc", [[20, 11.1, 0], [24, 13.6, 0.5], [28, 12.2, 0]]);
    wire("ln", "gnd", [[28.9, 11.6, 0], [31, 3, -1], [22, 0.4, -4.3], [12, 0.4, -4.3], [11, 8, -3], [14, 11.1, 0]]);
    wire("c1", "dc", [[20, 11.1, 0], [16, 15, 1], [9, 17, 1.2], [7.5, 18.2, 0.6]], 0.14);
    wire("c2", "dc", [[7.5, 19.8, 0.6], [12, 22.5, 0.8], [18, 21.8, 0.8]], 0.14);
    wire("c3", "dc", [[22.1, 20, 0.6], [27, 19.5, 0.8], [31.3, 16.4, 0.6]], 0.14);
    wire("b1", "dc", [[20, 11.1, 0], [25, 15, -2.2], [31.9, 12.8, -0.4]], 0.38);
    wire("b2", "dc", [[34.1, 12.8, 0], [36, 8, 0.4], [40, 4.6, 0]], 0.38);
    wire("sig", "sig", [[CX + 5.4, 5.4, -0.4], [-10.5, 3, 1.2], [-6, -4.5, 1.4], [-1.2, -6.3, 0.6]]);
    wire("pri", "hv", [[2.5, -8, 0], [6, -9.6, 0.6], [9, -9, 0]]);
    wire("ht", "hv", [[14, -6.5, 0], [18, -3, 0.6], [22.5, -3.2, 0.3], [24, -4.7, 0]], 0.3);
    E.pkt = []; for (let i = 0; i < 4; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 10), new THREE.MeshBasicMaterial({ color: 0xf4ecff })); d.visible = false; E.wireG.add(d); E.pkt.push(d); }

    /* osiloskop */
    E.scope = el("scope"); E.sctx = E.scope.getContext("2d");
  },
  update(sys, dt, S) {
    const E = sys.e, P = sys.place, M = elecModel(S);
    Object.values(sys.parts).forEach(p => P(p, 0, 0, 0));
    const w = (S.rpm / 7500) * 12, prev = E.phi; E.phi += w * dt; E.rotor.rotation.z = E.phi;
    E.wireG.visible = sys.ex < 0.04;

    /* AC: noktalar ileri geri salınır */
    E.acPh += (0.8 + S.rpm / 7500 * 4) * 2 * Math.PI * dt;
    const amp = 0.25 + 0.75 * Math.min(1, S.rpm / 7500);
    ["acA", "acB", "src"].forEach((k, j) => { const W = E.wires[k], sgn = j === 1 ? -1 : 1;
      W.dots.forEach((d, i) => { const u = Math.min(0.999, Math.max(0.001, (i + 0.5) / W.n + sgn * Math.sin(E.acPh) * amp * 0.45 / W.n)); d.position.copy(W.curve.getPointAt(u)); }); });
    /* DC: noktalar tek yönde akar, hız akımla orantılı */
    const flow = (k, rate, rev) => { const W = E.wires[k]; E.dc[k] = (((E.dc[k] + rate * dt) % 1) + 1) % 1;
      W.dots.forEach((d, i) => { let u = ((i / W.n) + E.dc[k]) % 1; if (rev) u = 1 - u; d.position.copy(W.curve.getPointAt(Math.min(0.999, u))); d.visible = rate > 0.001; }); };
    flow("reg", M.igen * 0.35); flow("gnd", M.igen * 0.35); flow("lp", M.load * 0.35); flow("ln", M.load * 0.3);
    const ctl = S.on && S.hold && !S.run ? 0.25 : 0; flow("c1", ctl); flow("c2", ctl); flow("c3", ctl);
    flow("b1", M.istart * 0.03); flow("b2", M.istart * 0.03);
    if (M.load > 0) E.lampMat.color.setHSL(0.12, 1, Math.max(0.12, Math.min(0.66, 0.2 + 0.035 * (M.vbus - 4)))); else E.lampMat.color.setRGB(0.32, 0.31, 0.28);
    E.key.rotation.z = S.on ? -Math.PI / 2 : 0;
    E.btn.position.z = S.hold ? 1.05 : 1.3;
    E.plunger.position.y = S.relay ? 1.95 : 2.3; E.relayGlowMat.opacity = S.relay ? 0.45 : 0;
    E.pinion.rotation.x += (S.cranking && S.relay ? BAT[S.batt].crank / 550 * 14 : 0) * dt;

    /* ateşleme: volandaki çıkıntı pikabın önünden geçince darbe */
    const T = Math.PI / 4, a0 = ((prev % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI), a1 = ((E.phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    if (S.on && S.rpm > 150 && ((a0 < T && a1 >= T) || (a0 > a1 && (a1 >= T || a0 < T)))) { E.packets.push(0); E.pkGlow = 1; }
    E.pkGlow = Math.max(0, (E.pkGlow || 0) - dt * 5); E.pkGlowMat.opacity = 0.55 * E.pkGlow;
    const D = [["sig", 0.22], ["pri", 0.12], ["ht", 0.2]], TOT = 0.54;
    E.pkt.forEach(d => d.visible = false);
    E.packets = E.packets.map(t => t + dt).filter(t => { if (t >= TOT) { E.flash = 0.12; return false; } return true; });
    E.packets.slice(0, 4).forEach((t, i) => { let acc = 0; for (const [k, dur] of D) { if (t < acc + dur) { const d = E.pkt[i]; d.visible = E.wireG.visible; d.position.copy(E.wires[k].curve.getPointAt((t - acc) / dur)); break; } acc += dur; } });
    E.flash = Math.max(0, E.flash - dt); E.sparkMat.opacity = E.flash > 0 ? 1 : 0;

    /* osiloskop */
    const cv = E.scope, W2 = cv.clientWidth, H2 = cv.clientHeight;
    if (W2 > 0) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (cv.width !== Math.round(W2 * dpr)) { cv.width = Math.round(W2 * dpr); cv.height = Math.round(H2 * dpr); }
      const x = E.sctx; x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W2, H2);
      const ym = v => H2 / 2 - v / 60 * (H2 / 2 - 6);
      x.strokeStyle = TOK.line; x.lineWidth = 1;
      [-50, 0, 50].forEach(v => { x.beginPath(); x.moveTo(0, ym(v)); x.lineTo(W2, ym(v)); x.stroke(); });
      for (let i = 1; i < 4; i++) { x.beginPath(); x.moveTo(W2 * i / 4, 0); x.lineTo(W2 * i / 4, H2); x.stroke(); }
      x.strokeStyle = TOK.ac; x.lineWidth = 2; x.beginPath();
      for (let i = 0; i <= 200; i++) { const t = i / 200 * 0.02, v = M.vac * Math.sin(2 * Math.PI * M.hz * t + E.phi * 4); i ? x.lineTo(i / 200 * W2, ym(v)) : x.moveTo(0, ym(v)); }
      x.stroke();
      x.strokeStyle = TOK.dc; x.lineWidth = 2; x.beginPath(); x.moveTo(0, ym(M.vbus)); x.lineTo(W2, ym(M.vbus)); x.stroke();
      x.fillStyle = TOK.muted; x.font = "11px " + TOK.mono; x.fillText("+50 V", 4, ym(50) - 3); x.fillText("0", 4, ym(0) - 3);
      x.fillStyle = TOK.dc; x.fillText("DC " + M.vbus.toFixed(1).replace(".", ",") + " V", W2 - 74, ym(M.vbus) - 4);
    }

    const rpm = Math.round(S.rpm / 50) * 50, txt = rpm + "|" + M.ibat.toFixed(1) + "|" + M.vbus.toFixed(1) + "|" + M.istart + "|" + S.on;
    if (txt === E.lastTxt) return; E.lastTxt = txt;
    const f1 = n => n.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    el("eRpm").textContent = rpm.toLocaleString("tr-TR") + " d/d";
    el("eHz").textContent = Math.round(rpm / 60 * 4) + " Hz";
    el("eV").textContent = f1(M.vbus) + " V";
    el("eI").textContent = (M.ibat > 0.05 ? "+" : M.ibat < -0.05 ? "−" : "") + f1(Math.abs(M.ibat)) + " A";
    const b = el("eBat");
    el("eSt").textContent = M.istart > 0 ? Math.round(M.istart) + " A · akü gerilimi " + f1(M.vbus) + " V'a düştü" : "0 A";
    if (M.istart > 0) { b.className = "state bad"; b.textContent = "Marşı besliyor · gerilim düşüyor"; }
    else if (!S.on) { b.className = "state off"; b.textContent = "Dinleniyor · kontak kapalı"; }
    else if (M.ibat < -0.05) { b.className = "state mid"; b.textContent = "Boşalıyor · yükü akü taşıyor"; }
    else if (M.ibat <= 0.05) { b.className = "state off"; b.textContent = "Dengede · şarj yükü karşılıyor"; }
    else { b.className = "state on"; b.textContent = "Şarj oluyor"; }
    el("eSpark").textContent = S.on && rpm > 150 ? Math.round(rpm / 60) + " kıvılcım/s · her krank turunda bir" : "Yok";
  }
});

document.querySelectorAll("[data-batt]").forEach(b => b.addEventListener("click", () => {
  S.batt = b.dataset.batt; document.querySelectorAll("[data-batt]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
}));
