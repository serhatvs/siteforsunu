const storyboardAsset = (fileName) =>
  `${import.meta.env.BASE_URL}images/storyboard/${fileName}`;

// Storyboard görsel adları değişirse yalnızca bu dizideki `src` alanlarını güncelleyin.
export const siteContent = {
  hero: {
    eyebrow: "Üniversite / Yarışma Projesi",
    title: "Dijital Kayak Gözlüğü",
    subtitle: "Telefon kontrollü, reflektif cam destekli akıllı gösterim sistemi",
    description:
      "Akıllı kayak gözlüğü konsepti; kullanıcıya hız, sıcaklık, yön ve rakım gibi canlı verileri görüş alanında taşıyan, premium ve geleceğe dönük bir optik arayüz deneyimi sunar.",
    highlights: [
      "7 kareli sinematik akış",
      "GSAP ScrollTrigger animasyonu",
      "Optik katman odaklı ürün sunumu"
    ],
    panelTitle: "Sunum Yapısı",
    panelItems: [
      {
        label: "Hikâye",
        value: "POV sahnesinden tam optik katman görünümüne ilerler"
      },
      {
        label: "Görseller",
        value: "7 referans kare tek bir sinematik akışta ilerler"
      },
      {
        label: "Odak",
        value: "Yansıtma mantığı ve optik katman dizisi"
      },
      {
        label: "Ton",
        value: "Platinum Mist paletiyle premium sunum dili"
      }
    ]
  },
  sequence: {
    eyebrow: "Sinematik Scroll Akışı",
    title: "7 kare, tek ürün anlatısı",
    description:
      "Aşağı kaydırdıkça her kare bir sonrakine yumuşak biçimde bağlanır. POV açılışı, ürünün ortaya çıkışı ve tam optik patlatılmış görünüm aynı sahne üzerinde sinematik bir akış kurar."
  },
  frames: [
    {
      id: "frame-01",
      src: storyboardAsset("frame-01.png"),
      fileName: "frame-01.png",
      title: "Kayak POV HUD Açılışı",
      description:
        "Açılış sahnesi kayakçının bakışından başlar; hız, sıcaklık, yön ve rakım verileri pist manzarasının üzerine bindirilir.",
      stepLabel: "01 / 07",
      enterScale: 1.06,
      exitScale: 1.08,
      enterY: 26,
      exitY: -24,
      enterBlur: 10,
      exitBlur: 10,
      alt: "Kayak pistinde birinci şahıs görüşünden HUD verileri"
    },
    {
      id: "frame-02",
      src: storyboardAsset("frame-02.png"),
      fileName: "frame-02.png",
      title: "Optik Çerçeveye Giriş",
      description:
        "Aynı HUD dili korunur fakat bu kez sahne, veriyi taşıyan kayak gözlüğü çerçevesinin içinden izlenir.",
      stepLabel: "02 / 07",
      enterScale: 1.05,
      exitScale: 1.07,
      enterY: 22,
      exitY: -18,
      enterBlur: 8,
      exitBlur: 8,
      alt: "HUD ile kayak manzarasını gösteren akıllı gözlük çerçevesi"
    },
    {
      id: "frame-03",
      src: storyboardAsset("frame-03.png"),
      fileName: "frame-03.png",
      title: "Yan Profil ve Kayış Modülü",
      description:
        "Ürün yan profilde belirir; kayış üzerindeki kontrol şeridi ve elektronik gövde dili ilk kez netleşir.",
      stepLabel: "03 / 07",
      enterScale: 1.04,
      exitScale: 1.06,
      enterY: 18,
      exitY: -14,
      enterBlur: 7,
      exitBlur: 7,
      alt: "Yan açıdan gösterilen dijital kayak gözlüğü ve kayış ekran modülü"
    },
    {
      id: "frame-04",
      src: storyboardAsset("frame-04.png"),
      fileName: "frame-04.png",
      title: "Ön Yüz Arayüzü",
      description:
        "Merkezi ön görünüm, koyu lens içindeki HUD yerleşimini ve ana ürün siluetini temiz bir şekilde odağa alır.",
      stepLabel: "04 / 07",
      enterScale: 1.03,
      exitScale: 1.05,
      enterY: 14,
      exitY: -10,
      enterBlur: 6,
      exitBlur: 6,
      alt: "Ön görünümde HUD arayüzlü akıllı kayak gözlüğü"
    },
    {
      id: "frame-05",
      src: storyboardAsset("frame-05.png"),
      fileName: "frame-05.png",
      title: "Parlak HUD Detayı",
      description:
        "HUD bu karede daha parlak ve okunaklı hale gelir; kullanım senaryosu ile premium ürün dili aynı karede buluşur.",
      stepLabel: "05 / 07",
      enterScale: 1.03,
      exitScale: 1.05,
      enterY: 12,
      exitY: -8,
      enterBlur: 6,
      exitBlur: 6,
      alt: "Daha parlak HUD katmanlarıyla öne çıkan akıllı kayak gözlüğü"
    },
    {
      id: "frame-06",
      src: storyboardAsset("frame-06.png"),
      fileName: "frame-06.png",
      title: "Elektronik ve Optik Patlatma",
      description:
        "Dış lens, optik lens, yansıtıcı katman ve mikro-LED modül ayrışarak verinin nasıl oluştuğunu gösteren teknik kareyi kurar.",
      stepLabel: "06 / 07",
      enterScale: 1.02,
      exitScale: 1.03,
      enterY: 8,
      exitY: -4,
      enterBlur: 5,
      exitBlur: 5,
      alt: "Mikro LED ve optik katmanları ayrışmış akıllı kayak gözlüğü"
    },
    {
      id: "frame-07",
      src: storyboardAsset("frame-07.png"),
      fileName: "frame-07.png",
      title: "Şeffaf Optik Katman Dizisi",
      description:
        "Kapanış karesi tüm şeffaf lens ve koruyucu katmanları tek bakışta açarak sistemin optik mimarisini özetler.",
      stepLabel: "07 / 07",
      enterScale: 1.02,
      exitScale: 1.03,
      enterY: 6,
      exitY: -2,
      enterBlur: 5,
      exitBlur: 5,
      alt: "Şeffaf optik katmanları etiketlenmiş patlatılmış kayak gözlüğü"
    }
  ],
  opticalConcept: {
    eyebrow: "Optik Yansıtma Mantığı",
    title: "Bilgi doğrudan göze değil, optik katman dizisine taşınır",
    description:
      "Bu konseptte görüntüleme mantığı, kullanıcının görüşünü kapatmadan veriyi cam yüzeyinde okunabilir kılmayı hedefler. Sunumdaki patlatılmış görünüm özellikle optik katman ilişkisini öne çıkarır.",
    flow: [
      {
        step: "01",
        title: "HUD veri üretimi",
        text: "Sayısal bilgiler önce görüntüleme kaynağında hazırlanır ve optik hatta yönlendirilir."
      },
      {
        step: "02",
        title: "Reflektif yönlendirme",
        text: "Veri, reflektif katman üzerinden cam yüzeyine kontrollü biçimde taşınır."
      },
      {
        step: "03",
        title: "Görüş alanında okuma",
        text: "Kullanıcı çevreyi izlemeye devam ederken bilgiyi doğrudan görüş alanında takip eder."
      }
    ],
    layersTitle: "Optik Katman Dizisi",
    layers: [
      {
        name: "Frame",
        text: "Tüm optik yapıyı taşıyan ana gövde ve çerçeve yapısı."
      },
      {
        name: "Outer Protective Lens",
        text: "Dış darbeye ve çizilmeye karşı koruma sağlayan ilk saydam katman."
      },
      {
        name: "Optical Lens",
        text: "Görüntünün geçtiği temel optik yüzey ve ana şeffaf katman."
      },
      {
        name: "Reflective Layer",
        text: "Bilgiyi kullanıcı görüşüne geri yansıtan reflektif optik yüzey."
      },
      {
        name: "Inner Protective Layer",
        text: "İç tarafta konfor ve yüzey stabilitesi sağlayan son optik koruma katmanı."
      }
    ]
  },
  budget: {
    eyebrow: "Tahmini Bütçe",
    title: "Konseptten prototipe uzanan maliyet dağılımı",
    description:
      "Aşağıdaki dağılım, üniversite / yarışma ölçeğinde sunulacak bir konsept prototip için öngörülen yaklaşık maliyet yapısını temsil eder.",
    items: [
      {
        label: "Optik Katmanlar",
        value: 10000,
        detail: "Optik lensler, reflektif yüzeyler ve koruyucu katman prototiplemesi"
      },
      {
        label: "Gövde ve Mekanik Üretim",
        value: 7000,
        detail: "Çerçeve, bağlantı yüzeyleri ve gövde üretim denemeleri"
      },
      {
        label: "Mikro Görüntüleme / Yansıtma",
        value: 9000,
        detail: "Görüntü kaynağı, optik hizalama ve yansıtma testleri"
      },
      {
        label: "Mobil Bağlantı ve Kontrol",
        value: 4000,
        detail: "Telefon arayüzü, eşleşme mantığı ve demo kontrol akışı"
      },
      {
        label: "Prototipleme ve Test",
        value: 5000,
        detail: "Montaj, sunum testleri ve iteratif deneme maliyeti"
      }
    ],
    totalLabel: "Toplam Tahmini Bütçe",
    totalValue: 35000,
    breakdownTitle: "Detaylı Maliyet Kırılımı",
    breakdownDescription:
      "Aşağıdaki kartlar, mühendislik gerekçeleriyle birlikte temel sistem bileşenlerini ve tahmini maliyet aralıklarını gösterir.",
    downloadLabel: "CSV olarak indir",
    breakdown: [
      {
        category: "Kontrol Sistemi",
        material: "Mikrodenetleyici Geliştirme Kartı",
        cost: "1.000 – 2.000 TL",
        rationale:
          "Sistem bileşenleri arasındaki veri iletişimini ve kontrolünü sağlamak"
      },
      {
        category: "Görüntü Sistemi",
        material: "OLED Display Modülü",
        cost: "800 – 1.500 TL",
        rationale:
          "Kullanıcıya gösterilecek verilerin optik sisteme aktarılması"
      },
      {
        category: "Sensör Sistemi",
        material: "IMU Hareket Sensörü",
        cost: "1.000 – 2.000 TL",
        rationale:
          "Kullanıcının hareket ve yön bilgisini algılamak"
      },
      {
        category: "Optik Sistem",
        material: "Reflektif Lens / Optik Cam",
        cost: "4.000 – 6.000 TL",
        rationale:
          "OLED ekran görüntüsünü kullanıcının görüş alanına yansıtmak"
      },
      {
        category: "Güç Sistemi",
        material: "Lityum Batarya ve Güç Yönetimi Devresi",
        cost: "2.000 – 3.000 TL",
        rationale:
          "Sistemin taşınabilir ve bağımsız çalışmasını sağlamak"
      },
      {
        category: "Elektronik Sistem",
        material: "Konektör, Kablo ve Bağlantı Elemanları",
        cost: "2.000 – 3.000 TL",
        rationale:
          "Elektronik bileşenler arasında bağlantı sağlamak"
      },
      {
        category: "Elektronik Sistem",
        material: "Direnç, Kapasitör ve Yardımcı Elektronik Bileşenler",
        cost: "5.000 – 7.000 TL",
        rationale:
          "Devre stabilitesi ve sinyal yönetimi için gerekli yardımcı bileşenler"
      },
      {
        category: "Devre Tasarımı",
        material: "Özel PCB Tasarımı ve Üretimi",
        cost: "10.000 – 14.000 TL",
        rationale:
          "Tüm sistem bileşenlerini kompakt ve stabil şekilde çalıştırmak"
      },
      {
        category: "Mekanik Sistem",
        material: "Gözlük Gövdesi ve Mekanik Montaj Parçaları",
        cost: "3.000 – 5.000 TL",
        rationale:
          "Elektronik ve optik bileşenlerin gözlük yapısına entegre edilmesi"
      }
    ]
  },
  closing: {
    eyebrow: "Kapanış",
    title: "Dijital Kayak Gözlüğü",
    text:
      "Bu sunum; birinci şahıs HUD deneyimini, dış ürün görünümünü ve optik katman mantığını tek bir scroll akışında birleştirerek konsepti sahneye taşır."
  }
};
