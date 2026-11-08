# Scooter Atölyesi

GY6 tipi 50 cc bir scooter'ın alt sistemlerini 3B olarak gösteren eğitim sitesi.
Canlı adres: https://aliak0.github.io/scooter-atolyesi/

## Çalıştırma

Sunucu gerekmez: `index.html` dosyasına çift tıklamak yeterli. Üç boyutlu kütüphane (three.js) ve yazı tipleri internetten yüklendiği için bağlantı gerekir.

## Klasör yapısı

```
index.html                 sayfa iskeleti: sekmeler, sahne, paneller
css/site.css               bütün görünüm ayarları, açık ve koyu tema
js/cekirdek.js             ortak 3B sahne, malzemeler, alt sistem kaydı, ortak motor durumu
js/sistemler/motor.js      4 zamanlı motor bloğu
js/sistemler/cvt.js        CVT ve son dişli kutusu
js/sistemler/elektrik.js   şarj, ateşleme ve marş devresi
js/sistemler/fren.js       ön disk ve arka kampana fren
js/sistemler/suspansiyon.js  ön çatal ve salınan motor ünitesi
js/sistemler/karburator.js yakıt ve hava sistemi
js/sistemler/genel.js      genel görünüm (gövde ve monte edilmiş alt sistemler)
js/arayuz.js               sekmeler, gaz, kontak, marş, seçim, kamera, ana döngü
```

Dosyaların yükleme sırası önemlidir: önce `cekirdek.js`, sonra alt sistemler, en son `arayuz.js`. Sıra `index.html`'in sonundaki `<script>` satırlarında yazar.

## Yeni bir alt sistem eklemek

1. `js/sistemler/` altına yeni bir dosya aç ve `createSystem({...})` ile tanımla. Her alt sistem şunları verir:
   - `id`, `tab` (sekme adı), `defaultSel` (açılışta seçili parça)
   - `metin`: başlık, açıklama, not ve alt bilgi
   - `view`: kamera hedefi, yönü ve kadraj ölçüleri
   - `GROUPS` ve `PARTS`: her parça için `ad`, `grup`, `islev`, `kontrol` ve ayrılma yönü `ayir: [x, y, z]`
   - `build(sys)`: geometriyi bir kez kurar
   - `update(sys, dt, S)`: her karede hareketi ve göstergeleri günceller
2. `index.html`'e sekme bağlantısını (`<a class="tab" href="#id">`) ve varsa bu sekmeye özel panel bloklarını (`data-only="id"`) ekle.
3. Dosyayı `index.html`'in sonunda `arayuz.js`'den önce yükle.

Parça kartlarındaki metinleri düzeltmek için ilgili dosyada `PARTS` bloğunu düzenlemek yeterli.

## Notlar

- Geometri kodla üretilmiş geçici bir taslaktır; ölçüler ve değerler yaklaşık örnektir.
- Gövde temsilidir, belirli bir markanın tasarımını kopyalamaz.
