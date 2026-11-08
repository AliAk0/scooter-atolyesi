"use strict";
/* ANA GÖRÜNÜM: temsili gövde ve gerçek yerlerine monte edilen alt sistemler */

const SCOOTER = createSystem({
  id: "scooter", defaultSel: "motor_unitesi", tab: "Genel görünüm", home: true, mounts: { motor: "motor_unitesi", cvt: "cvt_unitesi" },
  mountPoint(id) { return this.o.mount[id]; },
  metin: {
    eyebrow: "GY6 tipi · 50 cc · 10 inç jant",
    title: "Scooter Genel Görünümü",
    lead: "Kaporta saydam çizildi; motor ve CVT gerçek yerlerinde, gaz koluna bağlı çalışıyor. Sarı çerçeveli etiketlere dokunarak alt sistemlere geç ya da bir parçaya dokunup kartını oku.",
    note: "Gövde ölçüleri tipik bir 50 cc scooter'a yakın tutuldu: dingil mesafesi yaklaşık 136 cm, lastik 3.50-10. Motor ve CVT burada görünür olsun diye yüzde 25 büyük çizildi.",
    foot: "Gövde kodla üretilmiş temsili bir taslaktır, belirli bir markanın tasarımını kopyalamaz. Motor ve CVT, alt sistem sayfalarındaki modellerin aynısıdır."
  },
  view: { target: [60, 46, 0], dir: [0.4, 0.26, 0.88], hw: 112, hh: 58, k: 1.04, minD: 30, maxD: 600 },
  GROUPS: ["Güç ünitesi", "Gövde", "Yürüyen aksam"],
  PARTS: {
    motor_unitesi: { ad: "Motor bloğu", grup: "Güç ünitesi", ayir: [0, 0, -32], alt: "motor",
      islev: "Silindir öne bakacak şekilde neredeyse yatay durur. Motor, CVT ve arka teker tek bir salınan ünite oluşturur; ünite önden şasiye mafsalla asılır, arkasını amortisör taşır. Yani motor, arka süspansiyonla birlikte hareket eder.",
      kontrol: "Motor yağı seviyesi ve değişim aralığı kullanım kılavuzundaki bakım tablosuna göre izlenir." },
    cvt_unitesi: { ad: "CVT", grup: "Güç ünitesi", ayir: [0, 0, 32], alt: "cvt",
      islev: "Sol tarafta, kendi kapağının içinde durur. Krank milinin ucundaki varyatörden arka tekere giden dişli kutusuna kadar uzanır.",
      kontrol: "Kapaktaki hava girişi tıkanmamalı; kayış ve bilyeler periyodik bakımda kontrol edilir." },
    egzoz: { ad: "Egzoz ve susturucu", grup: "Güç ünitesi", ayir: [0, 0, -55],
      islev: "Silindir kapağının altındaki egzoz kanalından çıkan gazı sağ taraftan arkaya taşır. Susturucu sesi azaltır.",
      kontrol: "Bağlantı contası kaçırırsa patlama sesi ve güç kaybı olur." },
    kaporta: { ad: "Kaporta ve taban", grup: "Gövde", ayir: [0, 45, 0],
      islev: "Ön kalkan, ayak tabanı ve yan kapaklardan oluşur. Taşıyıcı değildir; sürücüyü rüzgârdan ve sıçrayan sudan korur, mekanik parçaları örter.",
      kontrol: "Kırık tırnak ve gevşek vida titreşim sesine yol açar." },
    sele: { ad: "Sele", grup: "Gövde", ayir: [0, 80, 0],
      islev: "Altında bagaj gözü bulunur. Bu sınıf scooterlarda yakıt deposu da genellikle sele bölgesinin altına yerleştirilir.",
      kontrol: "Kilit, menteşe ve bagaj gözüne su girişi kontrol edilir." },
    sasi: { ad: "Şasi", grup: "Gövde", ayir: [0, -42, 0],
      islev: "Çelik borulardan oluşur; direksiyon borusunu, tabanı ve sele altını birbirine bağlar. Motor ünitesi şasiye ön tarafındaki bir mafsalla asılır.",
      kontrol: "Kaynak noktalarındaki çatlaklar ve motor askı burcundaki boşluk kontrol edilir." },
    karburator: { ad: "Karbüratör ve hava filtresi", grup: "Güç ünitesi", ayir: [0, 30, 20], alt: "karburator",
      islev: "Karbüratör silindir kapağının üstünde, emme kanalına bağlıdır. Hava filtresi kutusu CVT kapağının üstünde durur ve havayı karbüratöre bir körükle verir. Burada temsili konumda gösterildi.",
      kontrol: "Uzun süre kullanılmayacaksa karbüratör haznesindeki benzin boşaltılır; bekleyen benzin jiklörleri tıkar." },
    elektrik: { ad: "Elektrik sistemi", grup: "Güç ünitesi", ayir: [0, 22, -45], alt: "elektrik",
      islev: "Volan ve stator krank milinin sağ ucunda, motorun içindedir. Akü bu sınıf scooterlarda genellikle sele önünde ya da taban altında durur; burada temsili konumda gösterildi.",
      kontrol: "Rölantide farlar sönükleşiyor ya da marş zor basıyorsa önce akü gerilimi ölçülür." },
    on_takim: { ad: "Ön takım", grup: "Yürüyen aksam", ayir: [55, 0, 0], alt: "fren",
      islev: "Gidon, direksiyon borusu, ön amortisörlü çatal ve ön tekerden oluşur. Ön fren disklidir.",
      kontrol: "Direksiyon rulman boşluğu, amortisör yağ kaçağı ve fren balatası kontrol edilir." },
    arka_teker: { ad: "Arka teker ve amortisör", grup: "Yürüyen aksam", ayir: [-45, 0, 0], alt: "suspansiyon",
      islev: "Arka teker motor ünitesinin dişli kutusu çıkışına doğrudan bağlıdır. Ünite önden mafsallı olduğu için amortisör, motorla birlikte bütün üniteyi taşır. Arka fren kampanalıdır.",
      kontrol: "Lastik basıncı ve diş derinliği düzenli kontrol edilir; kampana balatası aşınınca fren kolu boşluğu artar." }
  },
  build(sys) {
    const O = sys.o = { mount: {} };
    const ghost = new THREE.MeshStandardMaterial({ color: 0xc3ced9, metalness: 0.1, roughness: 0.4, transparent: true, opacity: 0.2, depthWrite: false, side: DS });
    const seatM = new THREE.MeshStandardMaterial({ color: 0x2b2e33, metalness: 0.05, roughness: 0.8 });
    const tireM = new THREE.MeshStandardMaterial({ color: 0x202226, metalness: 0.05, roughness: 0.9 });
    const redM = new THREE.MeshStandardMaterial({ color: 0xb3261e, metalness: 0.1, roughness: 0.5, emissive: 0x3a0806 });
    const lampM = new THREE.MeshStandardMaterial({ color: 0xf3efe0, metalness: 0.1, roughness: 0.3 });
    const ext = (pts, z0, z1, bev, smooth) => {
      const sh = new THREE.Shape(); sh.moveTo(pts[0][0], pts[0][1]);
      const rest = pts.slice(1).map(p => new THREE.Vector2(p[0], p[1]));
      smooth ? sh.splineThru(rest) : rest.forEach(v => sh.lineTo(v.x, v.y));
      const g = new THREE.ExtrudeGeometry(sh, { depth: z1 - z0 - 2 * bev, bevelEnabled: bev > 0, bevelThickness: bev, bevelSize: bev, bevelSegments: 3, curveSegments: 24 });
      g.translate(0, 0, z0 + bev); return g;
    };
    const tube = (pts, r) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), false, "catmullrom", 0.2), 64, r, 10, false);

    /* güç ünitesi: alt sistem kökleri bu bağlantı gruplarına takılır */
    const pM = sys.makePart("motor_unitesi"), mM = new THREE.Group(); mM.position.set(28.75, 20.5, 0); mM.rotation.z = -1.4; mM.scale.setScalar(1.25); pM.root.add(mM); O.mount.motor = mM;
    const pC = sys.makePart("cvt_unitesi"), mC = new THREE.Group(); mC.position.set(14.375, 20.5, 9.5); mC.rotation.z = Math.PI; mC.scale.setScalar(1.25); pC.root.add(mC); O.mount.cvt = mC;

    const pKb = sys.makePart("karburator");
    { const g = new THREE.BoxGeometry(6, 6, 6); g.translate(44, 33, 4); sys.addMesh(pKb, g, MAT.alu); }
    { const g = new THREE.BoxGeometry(22, 9, 9); g.translate(12, 33, 12); sys.addMesh(pKb, g, new THREE.MeshStandardMaterial({ color: 0x3a3e44, roughness: 0.7 })); }
    sys.addMesh(pKb, tube([[23, 33, 12], [32, 36, 9], [41, 34, 5]], 1.6), new THREE.MeshStandardMaterial({ color: 0x2a2d31, roughness: 0.7 }));
    const pEl = sys.makePart("elektrik");
    { const g = cylZ(7.5, 3, 40); g.translate(28.75, 20.5, -8); sys.addMesh(pEl, g, MAT.steel); }
    { const g = new THREE.BoxGeometry(11.3, 8.6, 7); g.translate(52, 50, 0); sys.addMesh(pEl, g, new THREE.MeshStandardMaterial({ color: 0x2a2d31, roughness: 0.6 })); }
    const pE = sys.makePart("egzoz");
    sys.addMesh(pE, tube([[42, 16, -1], [36, 8, -8], [25, 11, -15], [20, 22, -16]], 1.3), MAT.dark);
    { const g = new THREE.CylinderGeometry(4.5, 4.5, 30, 28); g.rotateZ(Math.PI / 2); g.translate(5, 24, -16); sys.addMesh(pE, g, MAT.steel); }

    const pK = sys.makePart("kaporta");
    sys.addMesh(pK, ext([[53, 22], [112, 22], [112, 27], [53, 27], [53, 22]], -17, 17, 1), ghost);
    sys.addMesh(pK, ext([[60, 31], [62, 48], [55, 72], [20, 76], [-10, 77], [-28, 71], [-35, 60], [-24, 50], [0, 45], [25, 39], [45, 33], [60, 31]], -15, 15, 2, true), ghost);
    sys.addMesh(pK, ext([[108, 27], [118, 27], [130, 45], [133, 68], [127, 90], [116, 93], [110, 86], [110, 40], [108, 27]], -20, 20, 2, true), ghost);
    { const g = new THREE.BoxGeometry(3, 4, 14); g.translate(-35.5, 62, 0); sys.addMesh(pK, g, redM); }

    const pS = sys.makePart("sele");
    sys.addMesh(pS, ext([[-12, 77], [20, 76.5], [52, 73], [56, 76], [50, 83], [25, 85.5], [0, 86], [-14, 82], [-12, 77]], -14, 14, 2, true), seatM);

    const pF = sys.makePart("sasi");
    sys.addMesh(pF, tube([[121, 84, 0], [114, 62, 0], [108, 30, 0]], 1.6), MAT.dark);
    [-8, 8].forEach(z => sys.addMesh(pF, tube([[108, 30, 0], [101, 21, z], [62, 21, z], [56, 31, z], [44, 56, z], [10, 64, z], [-24, 62, z]], 1.4), MAT.dark));
    { const g = cylZ(1.4, 16, 12); g.translate(56, 31, 0); sys.addMesh(pF, g, MAT.dark); }

    const wheel = (part, parent, discZ) => {
      const t = new THREE.TorusGeometry(16, 4.5, 16, 56); sys.addMesh(part, t, tireM, parent);
      sys.addMesh(part, new THREE.TorusGeometry(12.7, 0.9, 10, 48), MAT.alu, parent);
      sys.addMesh(part, cylZ(3, 8, 24), MAT.alu, parent);
      for (let i = 0; i < 5; i++) { const sp = sys.addMesh(part, new THREE.BoxGeometry(10, 1.6, 1.2), MAT.alu, parent); const a = i * 2 * Math.PI / 5; sp.position.set(Math.cos(a) * 7.6, Math.sin(a) * 7.6, 0); sp.rotation.z = a; }
      if (discZ) { const d = sys.addMesh(part, cylZ(9.5, 0.5, 40), MAT.steel, parent); d.position.z = discZ; }
    };
    const pW = sys.makePart("on_takim"); O.frontSpin = new THREE.Group(); O.frontSpin.position.set(136, 20.5, 0); pW.root.add(O.frontSpin);
    wheel(pW, O.frontSpin, 5.2);
    [-7, 7].forEach(z => sys.addMesh(pW, tube([[136, 20.5, z], [128.5, 49, z], [121, 78, z]], 1.6), MAT.steel));
    { const g = cylZ(1.2, 16, 12); g.translate(121, 78, 0); sys.addMesh(pW, g, MAT.steel); }
    sys.addMesh(pW, tube([[121, 78, 0], [118, 92, 0], [113, 103, 0]], 1.8), MAT.dark);
    { const g = cylZ(1.1, 66, 14); g.translate(113, 104, 0); sys.addMesh(pW, g, MAT.steel); }
    [-28, 28].forEach(z => { const g = cylZ(1.7, 11, 14); g.translate(113, 104, z); sys.addMesh(pW, g, seatM); });
    { const g = new THREE.BoxGeometry(12, 9, 44); g.translate(113, 103, 0); sys.addMesh(pW, g, ghost); }
    { const g = new THREE.CylinderGeometry(3.6, 3.6, 1.2, 28); g.rotateZ(Math.PI / 2); g.translate(119.5, 103, 0); sys.addMesh(pW, g, lampM); }

    const pR = sys.makePart("arka_teker"); O.rearSpin = new THREE.Group(); O.rearSpin.position.set(0, 20.5, 0); pR.root.add(O.rearSpin);
    wheel(pR, O.rearSpin, 0);
    { const g = cylZ(1, 12, 12); g.translate(0, 20.5, 3); sys.addMesh(pR, g, MAT.dark); }
    sys.addMesh(pR, tube([[-5, 25, -9], [-11, 44, -9], [-16, 61, -9]], 1.3), MAT.spring);
    { const g = new THREE.CylinderGeometry(2.4, 2.4, 14, 16); g.translate(0, 0, 0); const m = sys.addMesh(pR, g, MAT.steel); m.position.set(-11.5, 46, -9); m.rotation.z = 0.29; }
  },
  update(sys, dt, S) {
    MOTOR.update(MOTOR, dt, S); CVT.update(CVT, dt, S);
    const O = sys.o;
    Object.values(sys.parts).forEach(p => sys.place(p, 0, 0, 0));
    const wa = -CVT.v.aB / 6; O.rearSpin.rotation.z = wa; O.frontSpin.rotation.z = wa;
    const ex = sys.ex, a = id => sys.PARTS[id].ayir;
    O.hots = O.hots || [...document.querySelectorAll(".hot")];
    const HP = { motor: [[44, 34, 0], "motor_unitesi"], cvt: [[8, 2, 15], "cvt_unitesi"], elektrik: [[54, 60, 0], "elektrik"], karburator: [[30, 46, 10], "karburator"], fren: [[136, 46, 6], "on_takim"], suspansiyon: [[-20, 74, -9], "arka_teker"] };
    O.hots.forEach(b => { const [pt, id] = HP[b.dataset.go], o = a(id); placeTag(b, pt[0] + o[0] * ex, pt[1] + o[1] * ex, pt[2] + o[2] * ex); });
    const V = CVT.v, rpm = Math.round(S.rpm / 50) * 50, txt = rpm + "|" + (V.r1 || 0).toFixed(2) + "|" + V.eng.toFixed(2);
    if (txt === O.lastTxt) return; O.lastTxt = txt;
    el("oRpm").textContent = rpm.toLocaleString("tr-TR") + " d/d";
    if (V.r1) el("oRatio").textContent = (V.r2 / V.r1).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " : 1";
    const c = el("oClutch");
    if (V.eng < 0.05) { c.className = "state off"; c.textContent = "Duruyor · debriyaj ayrık"; }
    else if (V.eng < 0.95) { c.className = "state mid"; c.textContent = "Kalkıyor · debriyaj kaydırıyor"; }
    else { c.className = "state on"; c.textContent = "Dönüyor · debriyaj kavramış"; }
  }
});

document.querySelectorAll(".hot").forEach(b => b.addEventListener("click", () => { location.hash = b.dataset.go; }));
