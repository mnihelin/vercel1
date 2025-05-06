import { useEffect, useRef, useState } from 'react';

// Ataşehir'in koordinatları
const ATASEHIR_COORDS = [41.0012, 29.1175];

// Ataşehir'deki trafolar konumları
const TRAFO_1_KONUM = [41.0026, 29.1269]; // 120 Nolu A çıkışı trafo konumu (Tevazu Sokak)
const TRAFO_2_KONUM = [41.0032, 29.1273]; // 130 Nolu B çıkışı trafo konumu

// 120 A çıkışı - normal durum (Hisar Sokak)
const HAT_120A_KONUM = [41.0023, 29.1266]; // 120 A çıkışı konumu

// 120 B çıkışı - tehlikeli durum (Hisar Sokak)
const HAT_120B_KONUM = [41.0027, 29.1268]; // 120 B çıkışı konumu

// 130 A çıkışı - normal durum (Şerif Sokak)
const HAT_130A_KONUM = [41.0031, 29.1269]; // 130 A çıkışı konumu

// 130 B çıkışı - tehlikeli durum (Şerif Sokak)
const HAT_130B_KONUM = [41.0033, 29.1275]; // 130 B çıkışı konumu

// Araçların plaka bilgileri - atama için
const ARAC_FF5179 = "34FF5179"; // 120 B çıkışına atanacak araç (yeraltı tipi)
const ARAC_ABC123 = "34ABC123"; // 130 B çıkışına atanacak araç (havai tipi)
const ARAC_GG6280 = "34GG6280"; // 120 A çıkışına atanacak araç (yeraltı tipi)
const ARAC_ME7890 = "34ME7890"; // 130 A çıkışına atanacak araç (yeraltı tipi)

// 120 Nolu trafonun sokağında kofreler - art arda dizilmiş
const KOFRE_1_KONUM = [41.0023, 29.1266]; // 22 Nolu Kofre
const KOFRE_2_KONUM = [41.0025, 29.1267]; // 23 Nolu Kofre 
const KOFRE_3_KONUM = [41.0027, 29.1268]; // 24 Nolu Kofre

// 130 Nolu trafonun sokağında kofreler - aynı sokakta art arda dizilmiş
// Sokak doğrultusu daha yatay bir çizgide ve trafo ile çakışmayacak şekilde
const KOFRE_4_KONUM = [41.0031, 29.1269]; // 31 Nolu Kofre - sokağın başlangıcında
const KOFRE_5_KONUM = [41.0032, 29.1272]; // 32 Nolu Kofre - sokağın ortasında (trafo yakınında)
const KOFRE_6_KONUM = [41.0033, 29.1275]; // 33 Nolu Kofre - sokağın sonunda

// Araçların konumları ve bilgileri
const ARAC_1_KONUM = [41.0025, 29.1265]; // 34 ABC 123 plakalı araç
const ARAC_1_PLAKA = "34 ABC 123";
const ARAC_1_MESAFE = "200 metre";
const ARAC_1_TIP = "Yeraltı tipi";

const ARAC_2_KONUM = [41.0024, 29.1273]; // 34 KJ 4567 plakalı araç
const ARAC_2_PLAKA = "34 KJ 4567";
const ARAC_2_MESAFE = "1 KM";

const ARAC_3_KONUM = [41.0028, 29.1277]; // 34 ZY 8901 plakalı araç
const ARAC_3_PLAKA = "34 ZY 8901";
const ARAC_3_MESAFE = "1.5 KM";

// 130 Nolu trafo için araçlar
const ARAC_4_KONUM = [41.0034, 29.1268]; // 34 KC 9012 plakalı araç
const ARAC_4_PLAKA = "34 KC 9012";
const ARAC_4_MESAFE = "300 METRE";

const ARAC_5_KONUM = [41.0036, 29.1272]; // 34 LD 3456 plakalı araç
const ARAC_5_PLAKA = "34 LD 3456";
const ARAC_5_MESAFE = "700 METRE";

const ARAC_6_KONUM = [41.0038, 29.1276]; // 34 ME 7890 plakalı araç
const ARAC_6_PLAKA = "34 ME 7890";
const ARAC_6_MESAFE = "2 KM";

// Sabit plaka metinleri için kırmızı renkli versiyonlar
const ARAC_1_PLAKA_RED = "34 ABC 123";
const ARAC_4_PLAKA_RED = "34 KC 9012";

export default function YandexMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  // Simülasyon durum değişkenleri
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [simulationOutput, setSimulationOutput] = useState<string>("");
  const [renderOutput, setRenderOutput] = useState<string>("");
  const [simulationStep, setSimulationStep] = useState(0);
  const [trafo1Status, setTrafo1Status] = useState<'Normal' | 'Tehlikeli'>('Normal');
  const [trafo2Status, setTrafo2Status] = useState<'Normal' | 'Tehlikeli'>('Normal');
  const [activeTrafo, setActiveTrafo] = useState<'120' | '130' | null>(null);
  const [aramaAsamasi, setAramaAsamasi] = useState<'Bekliyor' | 'Tamamlandi'>('Bekliyor');
  // Yeni otomatik atama simülasyonu için değişkenler
  const [autoAssignSimulationStarted, setAutoAssignSimulationStarted] = useState(false);
  const [autoAssignSimulationOutput, setAutoAssignSimulationOutput] = useState<string>("");
  const [autoAssignSimulationStep, setAutoAssignSimulationStep] = useState(0);
  const [activeHat, setActiveHat] = useState<'120A' | '120B' | '130A' | '130B' | null>(null);
  const [showCompletedAssignments, setShowCompletedAssignments] = useState<string[]>([]);
  // Tarayıcıda olup olmadığımızı kontrol etmek için
  const [isBrowser, setIsBrowser] = useState(false);

  const formatOutput = (output: string) => {
    if (!output) return '';
    
    // Plaka numaralarını JSX içinde kırmızı renklendirmek için özel işleme
    let parts = output.split(ARAC_1_PLAKA);
    if (parts.length > 1) {
      output = parts.join(`<span class="text-red-600 font-bold">${ARAC_1_PLAKA}</span>`);
    }
    
    parts = output.split(ARAC_4_PLAKA);
    if (parts.length > 1) {
      output = parts.join(`<span class="text-red-600 font-bold">${ARAC_4_PLAKA}</span>`);
    }
    
    return output;
  };

  // Simülasyonu başlat
  const startSimulation = () => {
    setSimulationStarted(true);
    setSimulationStep(1);
    setActiveTrafo('120');
    const output = "• 3 numaralı tesisattan \"Aydınlatma Arızası\" bildirimi geldi...";
    setSimulationOutput(output);
    setRenderOutput(formatOutput(output));
    
    // Adım adım simülasyonu göster, her 2 saniyede bir yeni adım
    setTimeout(() => {
      setSimulationStep(2);
      const output = "• 3 numaralı tesisattan \"Aydınlatma Arızası\" bildirimi geldi...\n• 3 numaralı tesisat 22 numaralı kofre'de bulunuyor.";
      setSimulationOutput(output);
      setRenderOutput(formatOutput(output));
      
      setTimeout(() => {
        setSimulationStep(3);
        const output = "• 3 numaralı tesisattan \"Aydınlatma Arızası\" bildirimi geldi...\n• 3 numaralı tesisat 22 numaralı kofre'de bulunuyor.\n• 22 numaralı kofre 120A hattına bağlı.";
        setSimulationOutput(output);
        setRenderOutput(formatOutput(output));
        
        setTimeout(() => {
          setSimulationStep(4);
          const output = "• 3 numaralı tesisattan \"Aydınlatma Arızası\" bildirimi geldi...\n• 3 numaralı tesisat 22 numaralı kofre'de bulunuyor.\n• 22 numaralı kofre 120A hattına bağlı.\n• 120A hattı yeraltı tipine sahip.";
          setSimulationOutput(output);
          setRenderOutput(formatOutput(output));
          
          setTimeout(() => {
            setSimulationStep(5);
            setTrafo1Status('Tehlikeli');
            const output = "• 3 numaralı tesisattan \"Aydınlatma Arızası\" bildirimi geldi...\n• 3 numaralı tesisat 22 numaralı kofre'de bulunuyor.\n• 22 numaralı kofre 120A hattına bağlı.\n• 120A hattı yeraltı tipine sahip.\n• 120A hattı için en uygun yer altı ekibi bulunuyor..";
            setSimulationOutput(output);
            setRenderOutput(formatOutput(output));
            
            setTimeout(() => {
              setSimulationStep(6);
              setAramaAsamasi('Tamamlandi');
              const output = "• 3 numaralı tesisattan \"Aydınlatma Arızası\" bildirimi geldi...\n• 3 numaralı tesisat 22 numaralı kofre'de bulunuyor.\n• 22 numaralı kofre 120A hattına bağlı.\n• 120A hattı yeraltı tipine sahip.\n• 120A hattı için en uygun yer altı ekibi bulunuyor..\n• 120A hattı siparişi için en yakın ekip 34 ABC 123 olarak belirlendi.";
              setSimulationOutput(output);
              setRenderOutput(formatOutput(output));
              
              // 5 saniye sonra 130 nolu trafo senaryosuna geçiş
              setTimeout(() => {
                setActiveTrafo('130');
                setTrafo1Status('Normal');
                setTrafo2Status('Tehlikeli');
                setSimulationStep(7);
                setAramaAsamasi('Bekliyor');
                const output = "• 3 numaralı tesisattan \"Aydınlatma Arızası\" bildirimi geldi...\n• 3 numaralı tesisat 22 numaralı kofre'de bulunuyor.\n• 22 numaralı kofre 120A hattına bağlı.\n• 120A hattı yeraltı tipine sahip.\n• 120A hattı için en uygun yer altı ekibi bulunuyor..\n• 120A hattı siparişi için en yakın ekip 34 ABC 123 olarak belirlendi.\n\n• 8 numaralı tesisattan \"Aydınlatma Arızası-Tehlikeli Durum\" bildirimi geldi...";
                setSimulationOutput(output);
                setRenderOutput(formatOutput(output));
                
                setTimeout(() => {
                  setSimulationStep(8);
                  const output = "• 3 numaralı tesisattan \"Aydınlatma Arızası\" bildirimi geldi...\n• 3 numaralı tesisat 22 numaralı kofre'de bulunuyor.\n• 22 numaralı kofre 120A hattına bağlı.\n• 120A hattı yeraltı tipine sahip.\n• 120A hattı için en uygun yer altı ekibi bulunuyor..\n• 120A hattı siparişi için en yakın ekip 34 ABC 123 olarak belirlendi.\n\n• 8 numaralı tesisattan \"Aydınlatma Arızası-Tehlikeli Durum\" bildirimi geldi...\n• 8 numaralı tesisat 32 numaralı kofre'de bulunuyor.";
                  setSimulationOutput(output);
                  setRenderOutput(formatOutput(output));
                  
                  setTimeout(() => {
                    setSimulationStep(9);
                    const output = "• 3 numaralı tesisattan \"Aydınlatma Arızası\" bildirimi geldi...\n• 3 numaralı tesisat 22 numaralı kofre'de bulunuyor.\n• 22 numaralı kofre 120A hattına bağlı.\n• 120A hattı yeraltı tipine sahip.\n• 120A hattı için en uygun yer altı ekibi bulunuyor..\n• 120A hattı siparişi için en yakın ekip 34 ABC 123 olarak belirlendi.\n\n• 8 numaralı tesisattan \"Aydınlatma Arızası-Tehlikeli Durum\" bildirimi geldi...\n• 8 numaralı tesisat 32 numaralı kofre'de bulunuyor.\n• 32 numaralı kofre 130B hattına bağlı.";
                    setSimulationOutput(output);
                    setRenderOutput(formatOutput(output));
                    
                    setTimeout(() => {
                      setSimulationStep(10);
                      const output = "• 3 numaralı tesisattan \"Aydınlatma Arızası\" bildirimi geldi...\n• 3 numaralı tesisat 22 numaralı kofre'de bulunuyor.\n• 22 numaralı kofre 120A hattına bağlı.\n• 120A hattı yeraltı tipine sahip.\n• 120A hattı için en uygun yer altı ekibi bulunuyor..\n• 120A hattı siparişi için en yakın ekip 34 ABC 123 olarak belirlendi.\n\n• 8 numaralı tesisattan \"Aydınlatma Arızası-Tehlikeli Durum\" bildirimi geldi...\n• 8 numaralı tesisat 32 numaralı kofre'de bulunuyor.\n• 32 numaralı kofre 130B hattına bağlı.\n• 130B hattı havai hat tipine sahip.";
                      setSimulationOutput(output);
                      setRenderOutput(formatOutput(output));
                      
                      setTimeout(() => {
                        setSimulationStep(11);
                        const output = "• 3 numaralı tesisattan \"Aydınlatma Arızası\" bildirimi geldi...\n• 3 numaralı tesisat 22 numaralı kofre'de bulunuyor.\n• 22 numaralı kofre 120A hattına bağlı.\n• 120A hattı yeraltı tipine sahip.\n• 120A hattı için en uygun yer altı ekibi bulunuyor..\n• 120A hattı siparişi için en yakın ekip 34 ABC 123 olarak belirlendi.\n\n• 8 numaralı tesisattan \"Aydınlatma Arızası-Tehlikeli Durum\" bildirimi geldi...\n• 8 numaralı tesisat 32 numaralı kofre'de bulunuyor.\n• 32 numaralı kofre 130B hattına bağlı.\n• 130B hattı havai hat tipine sahip.\n• 130B hattı için en uygun havai hat ekibi bulunuyor..";
                        setSimulationOutput(output);
                        setRenderOutput(formatOutput(output));
                        
                        setTimeout(() => {
                          setSimulationStep(12);
                          setAramaAsamasi('Tamamlandi');
                          const output = "• 3 numaralı tesisattan \"Aydınlatma Arızası\" bildirimi geldi...\n• 3 numaralı tesisat 22 numaralı kofre'de bulunuyor.\n• 22 numaralı kofre 120A hattına bağlı.\n• 120A hattı yeraltı tipine sahip.\n• 120A hattı için en uygun yer altı ekibi bulunuyor..\n• 120A hattı siparişi için en yakın ekip 34 ABC 123 olarak belirlendi.\n\n• 8 numaralı tesisattan \"Aydınlatma Arızası-Tehlikeli Durum\" bildirimi geldi...\n• 8 numaralı tesisat 32 numaralı kofre'de bulunuyor.\n• 32 numaralı kofre 130B hattına bağlı.\n• 130B hattı havai hat tipine sahip.\n• 130B hattı için en uygun havai hat ekibi bulunuyor..\n• 130B hattı siparişi için en yakın ekip 34 KC 9012 olarak belirlendi.";
                          setSimulationOutput(output);
                          setRenderOutput(formatOutput(output));
                        }, 2000);
                      }, 2000);
                    }, 2000);
                  }, 2000);
                }, 2000);
              }, 5000);
            }, 2000);
          }, 2000);
        }, 2000);
      }, 2000);
    }, 2000);
  };

  // Simülasyonu sıfırla
  const resetSimulation = () => {
    setSimulationStarted(false);
    setSimulationStep(0);
    setTrafo1Status('Normal');
    setTrafo2Status('Normal');
    setAramaAsamasi('Bekliyor');
    setActiveTrafo(null);
    setSimulationOutput("");
    setRenderOutput("");
  };

  // Formatlanmış otomatik atama çıktısı
  const formatAutoAssignOutput = (output: string) => {
    if (!output) return '';
    
    let formattedOutput = output;
    // Tüm araç plakalarını kırmızı renklendir
    [ARAC_FF5179, ARAC_ABC123, ARAC_GG6280, ARAC_ME7890].forEach(plaka => {
      let parts = formattedOutput.split(plaka);
      if (parts.length > 1) {
        formattedOutput = parts.join(`<span class="text-red-600 font-bold">${plaka}</span>`);
      }
    });
    
    // "Tehlikeli" ifadesini kırmızı yap
    formattedOutput = formattedOutput.replace(/Tehlikeli/g, '<span class="text-red-600 font-bold">Tehlikeli</span>');
    
    return formattedOutput;
  };

  // Otomatik atama simülasyonunu başlat
  const startAutoAssignSimulation = () => {
    setAutoAssignSimulationStarted(true);
    setAutoAssignSimulationStep(1);
    setActiveHat('120B');
    setShowCompletedAssignments([]);
    const output = "## AG Fider Çıkışlarına Göre Otomatik Atama Başlatılıyor...\n\n1. Tesisat numaraları kofrelerle eşleştiriliyor.\n2. Tehlikeli durum bildirimleri tespit ediliyor.\n3. Aynı AG Fider çıkışına bağlı kofreler belirleniyor.\n\n• İşleniyor...";
    setAutoAssignSimulationOutput(output);
    
    // Adım adım simülasyonu göster, her 2 saniyede bir yeni adım
    setTimeout(() => {
      setAutoAssignSimulationStep(2);
      const output = "## AG Fider Çıkışlarına Göre Otomatik Atama Başlatılıyor...\n\n1. Tesisat numaraları kofrelerle eşleştirildi.\n2. Tehlikeli durum bildirimleri tespit edildi.\n3. Aynı AG Fider çıkışına bağlı kofreler belirlendi.\n\n## Atama #1: 120 B Çıkışı (Tehlikeli durum - Hisar Sokak)\n• Hat Tipi: Yeraltı\n• Tesisatlar: 11-21\n• Atama için uygun araç aranıyor...";
      setAutoAssignSimulationOutput(output);
      
      setTimeout(() => {
        setAutoAssignSimulationStep(3);
        const output = "## AG Fider Çıkışlarına Göre Otomatik Atama Başlatılıyor...\n\n1. Tesisat numaraları kofrelerle eşleştirildi.\n2. Tehlikeli durum bildirimleri tespit edildi.\n3. Aynı AG Fider çıkışına bağlı kofreler belirlendi.\n\n## Atama #1: 120 B Çıkışı (Tehlikeli durum - Hisar Sokak)\n• Hat Tipi: Yeraltı\n• Tesisatlar: 11-21\n• Atanan Araç: 34FF5179 (Hisar Sokak'ta yeraltı tipi araç)\n• Atama Durumu: ✅ Tamamlandı";
        setAutoAssignSimulationOutput(output);
        setShowCompletedAssignments([...showCompletedAssignments, '120B']);
        
        setTimeout(() => {
          setAutoAssignSimulationStep(4);
          setActiveHat('130B');
          const output = "## AG Fider Çıkışlarına Göre Otomatik Atama Başlatılıyor...\n\n1. Tesisat numaraları kofrelerle eşleştirildi.\n2. Tehlikeli durum bildirimleri tespit edildi.\n3. Aynı AG Fider çıkışına bağlı kofreler belirlendi.\n\n## Atama #1: 120 B Çıkışı (Tehlikeli durum - Hisar Sokak)\n• Hat Tipi: Yeraltı\n• Tesisatlar: 11-21\n• Atanan Araç: 34FF5179 (Hisar Sokak'ta yeraltı tipi araç)\n• Atama Durumu: ✅ Tamamlandı\n\n## Atama #2: 130 B Çıkışı (Tehlikeli durum - Şerif Sokak)\n• Hat Tipi: Havai\n• Tesisatlar: 32-42\n• Atama için uygun araç aranıyor...";
          setAutoAssignSimulationOutput(output);
          
          setTimeout(() => {
            setAutoAssignSimulationStep(5);
            const output = "## AG Fider Çıkışlarına Göre Otomatik Atama Başlatılıyor...\n\n1. Tesisat numaraları kofrelerle eşleştirildi.\n2. Tehlikeli durum bildirimleri tespit edildi.\n3. Aynı AG Fider çıkışına bağlı kofreler belirlendi.\n\n## Atama #1: 120 B Çıkışı (Tehlikeli durum - Hisar Sokak)\n• Hat Tipi: Yeraltı\n• Tesisatlar: 11-21\n• Atanan Araç: 34FF5179 (Hisar Sokak'ta yeraltı tipi araç)\n• Atama Durumu: ✅ Tamamlandı\n\n## Atama #2: 130 B Çıkışı (Tehlikeli durum - Şerif Sokak)\n• Hat Tipi: Havai\n• Tesisatlar: 32-42\n• Atanan Araç: 34ABC123 (Şerif Sokak'ta havai tipi araç)\n• Atama Durumu: ✅ Tamamlandı";
            setAutoAssignSimulationOutput(output);
            setShowCompletedAssignments([...showCompletedAssignments, '120B', '130B']);
            
            setTimeout(() => {
              setAutoAssignSimulationStep(6);
              setActiveHat('120A');
              const output = "## AG Fider Çıkışlarına Göre Otomatik Atama Başlatılıyor...\n\n1. Tesisat numaraları kofrelerle eşleştirildi.\n2. Tehlikeli durum bildirimleri tespit edildi.\n3. Aynı AG Fider çıkışına bağlı kofreler belirlendi.\n\n## Atama #1: 120 B Çıkışı (Tehlikeli durum - Hisar Sokak)\n• Hat Tipi: Yeraltı\n• Tesisatlar: 11-21\n• Atanan Araç: 34FF5179 (Hisar Sokak'ta yeraltı tipi araç)\n• Atama Durumu: ✅ Tamamlandı\n\n## Atama #2: 130 B Çıkışı (Tehlikeli durum - Şerif Sokak)\n• Hat Tipi: Havai\n• Tesisatlar: 32-42\n• Atanan Araç: 34ABC123 (Şerif Sokak'ta havai tipi araç)\n• Atama Durumu: ✅ Tamamlandı\n\n## Atama #3: 120 A Çıkışı (Normal durum - Hisar Sokak)\n• Hat Tipi: Yeraltı\n• Tesisatlar: 1-10\n• Atama için uygun araç aranıyor...";
              setAutoAssignSimulationOutput(output);
              
              setTimeout(() => {
                setAutoAssignSimulationStep(7);
                const output = "## AG Fider Çıkışlarına Göre Otomatik Atama Başlatılıyor...\n\n1. Tesisat numaraları kofrelerle eşleştirildi.\n2. Tehlikeli durum bildirimleri tespit edildi.\n3. Aynı AG Fider çıkışına bağlı kofreler belirlendi.\n\n## Atama #1: 120 B Çıkışı (Tehlikeli durum - Hisar Sokak)\n• Hat Tipi: Yeraltı\n• Tesisatlar: 11-21\n• Atanan Araç: 34FF5179 (Hisar Sokak'ta yeraltı tipi araç)\n• Atama Durumu: ✅ Tamamlandı\n\n## Atama #2: 130 B Çıkışı (Tehlikeli durum - Şerif Sokak)\n• Hat Tipi: Havai\n• Tesisatlar: 32-42\n• Atanan Araç: 34ABC123 (Şerif Sokak'ta havai tipi araç)\n• Atama Durumu: ✅ Tamamlandı\n\n## Atama #3: 120 A Çıkışı (Normal durum - Hisar Sokak)\n• Hat Tipi: Yeraltı\n• Tesisatlar: 1-10\n• Atanan Araç: 34GG6280 (Yeraltı tipi araç)\n• Atama Durumu: ✅ Tamamlandı";
                setAutoAssignSimulationOutput(output);
                setShowCompletedAssignments([...showCompletedAssignments, '120B', '130B', '120A']);
                
                setTimeout(() => {
                  setAutoAssignSimulationStep(8);
                  setActiveHat('130A');
                  const output = "## AG Fider Çıkışlarına Göre Otomatik Atama Başlatılıyor...\n\n1. Tesisat numaraları kofrelerle eşleştirildi.\n2. Tehlikeli durum bildirimleri tespit edildi.\n3. Aynı AG Fider çıkışına bağlı kofreler belirlendi.\n\n## Atama #1: 120 B Çıkışı (Tehlikeli durum - Hisar Sokak)\n• Hat Tipi: Yeraltı\n• Tesisatlar: 11-21\n• Atanan Araç: 34FF5179 (Hisar Sokak'ta yeraltı tipi araç)\n• Atama Durumu: ✅ Tamamlandı\n\n## Atama #2: 130 B Çıkışı (Tehlikeli durum - Şerif Sokak)\n• Hat Tipi: Havai\n• Tesisatlar: 32-42\n• Atanan Araç: 34ABC123 (Şerif Sokak'ta havai tipi araç)\n• Atama Durumu: ✅ Tamamlandı\n\n## Atama #3: 120 A Çıkışı (Normal durum - Hisar Sokak)\n• Hat Tipi: Yeraltı\n• Tesisatlar: 1-10\n• Atanan Araç: 34GG6280 (Yeraltı tipi araç)\n• Atama Durumu: ✅ Tamamlandı\n\n## Atama #4: 130 A Çıkışı (Normal durum - Şerif Sokak)\n• Hat Tipi: Yeraltı\n• Tesisatlar: 22-31\n• Atama için uygun araç aranıyor...";
                  setAutoAssignSimulationOutput(output);
                  
                  setTimeout(() => {
                    setAutoAssignSimulationStep(9);
                    const output = "## AG Fider Çıkışlarına Göre Otomatik Atama Başlatılıyor...\n\n1. Tesisat numaraları kofrelerle eşleştirildi.\n2. Tehlikeli durum bildirimleri tespit edildi.\n3. Aynı AG Fider çıkışına bağlı kofreler belirlendi.\n\n## Atama #1: 120 B Çıkışı (Tehlikeli durum - Hisar Sokak)\n• Hat Tipi: Yeraltı\n• Tesisatlar: 11-21\n• Atanan Araç: 34FF5179 (Hisar Sokak'ta yeraltı tipi araç)\n• Atama Durumu: ✅ Tamamlandı\n\n## Atama #2: 130 B Çıkışı (Tehlikeli durum - Şerif Sokak)\n• Hat Tipi: Havai\n• Tesisatlar: 32-42\n• Atanan Araç: 34ABC123 (Şerif Sokak'ta havai tipi araç)\n• Atama Durumu: ✅ Tamamlandı\n\n## Atama #3: 120 A Çıkışı (Normal durum - Hisar Sokak)\n• Hat Tipi: Yeraltı\n• Tesisatlar: 1-10\n• Atanan Araç: 34GG6280 (Yeraltı tipi araç)\n• Atama Durumu: ✅ Tamamlandı\n\n## Atama #4: 130 A Çıkışı (Normal durum - Şerif Sokak)\n• Hat Tipi: Yeraltı\n• Tesisatlar: 22-31\n• Atanan Araç: 34ME7890 (Yeraltı tipi araç)\n• Atama Durumu: ✅ Tamamlandı";
                    setAutoAssignSimulationOutput(output);
                    setShowCompletedAssignments([...showCompletedAssignments, '120B', '130B', '120A', '130A']);
                    
                    setTimeout(() => {
                      setAutoAssignSimulationStep(10);
                      setActiveHat(null);
                      const output = "## AG Fider Çıkışlarına Göre Otomatik Atama Başlatılıyor...\n\n1. Tesisat numaraları kofrelerle eşleştirildi.\n2. Tehlikeli durum bildirimleri tespit edildi.\n3. Aynı AG Fider çıkışına bağlı kofreler belirlendi.\n\n## Atama #1: 120 B Çıkışı (Tehlikeli durum - Hisar Sokak)\n• Hat Tipi: Yeraltı\n• Tesisatlar: 11-21\n• Atanan Araç: 34FF5179 (Hisar Sokak'ta yeraltı tipi araç)\n• Atama Durumu: ✅ Tamamlandı\n\n## Atama #2: 130 B Çıkışı (Tehlikeli durum - Şerif Sokak)\n• Hat Tipi: Havai\n• Tesisatlar: 32-42\n• Atanan Araç: 34ABC123 (Şerif Sokak'ta havai tipi araç)\n• Atama Durumu: ✅ Tamamlandı\n\n## Atama #3: 120 A Çıkışı (Normal durum - Hisar Sokak)\n• Hat Tipi: Yeraltı\n• Tesisatlar: 1-10\n• Atanan Araç: 34GG6280 (Yeraltı tipi araç)\n• Atama Durumu: ✅ Tamamlandı\n\n## Atama #4: 130 A Çıkışı (Normal durum - Şerif Sokak)\n• Hat Tipi: Yeraltı\n• Tesisatlar: 22-31\n• Atanan Araç: 34ME7890 (Yeraltı tipi araç)\n• Atama Durumu: ✅ Tamamlandı\n\n## Özet\n• Toplam Atama: 4/4 (100%)\n• Tehlikeli Durum Atamaları: 2/2 (100%)\n• Atanan Araç Sayısı: 4\n• İşlem Tamamlandı!";
                      setAutoAssignSimulationOutput(output);
                    }, 3000);
                  }, 2000);
                }, 2000);
              }, 2000);
            }, 2000);
          }, 2000);
        }, 2000);
      }, 3000);
    }, 2000);
  };

  // Otomatik atama simülasyonunu sıfırla
  const resetAutoAssignSimulation = () => {
    setAutoAssignSimulationStarted(false);
    setAutoAssignSimulationStep(0);
    setActiveHat(null);
    setShowCompletedAssignments([]);
    setAutoAssignSimulationOutput("");
  };

  // Tarayıcıda olduğumuzu belirlemek için
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    // Eğer tarayıcıda değilsek ya da simülasyon başlamamışsa, çıkalım
    if (!isBrowser) return;

    // Yandex Maps'i global olarak tanımlıyoruz
    if (!window.ymaps) {
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?lang=tr_TR`;
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      // TypeScript için window.ymaps'i tanımlıyoruz
      if (window.ymaps && mapRef.current) {
        window.ymaps.ready(() => {
          // Haritayı oluşturuyoruz ve daha yakın başlatıyoruz
          const map = new window.ymaps.Map(mapRef.current!, {
            center: [41.0029, 29.1270], // İki trafo bölgesinin orta noktası
            zoom: 12, // Tüm araçları görmek için zoom seviyesini ayarladık
            controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
          });
          
          // Trafo simge/ikon tanımlamaları
          const trafoIconLayout = window.ymaps.templateLayoutFactory.createClass(
            '<div class="trafo-icon" style="position: relative; width: 24px; height: 24px; background-color: #8a2be2; border: 2px solid #4B0082; border-radius: 4px; display: flex; justify-content: center; align-items: center;">' +
            '<div style="color: white; font-weight: bold; font-size: 14px;">T</div>' +
            '</div>'
          );
          
          // Tehlikeli durum trafo simge/ikon tanımlamaları
          const trafoTehlikeliIconLayout = window.ymaps.templateLayoutFactory.createClass(
            '<div class="trafo-icon" style="position: relative; width: 24px; height: 24px; background-color: #FF0000; border: 2px solid #8B0000; border-radius: 4px; display: flex; justify-content: center; align-items: center;">' +
            '<div style="color: white; font-weight: bold; font-size: 14px;">T!</div>' +
            '</div>'
          );
          
          // Aydınlatma arızası trafo simge/ikon tanımlamaları
          const trafoAydinlatmaIconLayout = window.ymaps.templateLayoutFactory.createClass(
            '<div class="trafo-icon" style="position: relative; width: 24px; height: 24px; background-color: #FFA500; border: 2px solid #FF8C00; border-radius: 4px; display: flex; justify-content: center; align-items: center;">' +
            '<div style="color: white; font-weight: bold; font-size: 14px;">T*</div>' +
            '</div>'
          );
          
          // Kofre simge/ikon tanımlamaları (bina şeklinde)
          const kofreIconLayout = window.ymaps.templateLayoutFactory.createClass(
            '<div class="kofre-icon" style="position: relative; width: 20px; height: 20px; background-color: #3CB371; border: 1px solid #2E8B57; display: flex; justify-content: center; align-items: center;">' +
            '<div style="color: white; font-weight: bold; font-size: 12px;">K</div>' +
            '</div>'
          );
          
          // Araç simge/ikon tanımlamaları
          const aracIconLayout = window.ymaps.templateLayoutFactory.createClass(
            '<div class="arac-icon" style="position: relative; width: 24px; height: 24px; background-color: #FF0000; border: 1px solid #8B0000; border-radius: 3px; display: flex; justify-content: center; align-items: center;">' +
            '<div style="color: white; font-weight: bold; font-size: 12px; transform: rotate(90deg);">🚗</div>' +
            '</div>'
          );
          
          // Özel araç simge/ikon tanımlamaları (kırmızı renkli)
          const ozelArac1IconLayout = window.ymaps.templateLayoutFactory.createClass(
            '<div class="arac-icon" style="position: relative; width: 24px; height: 24px; background-color: #FF0000; border: 1px solid #8B0000; border-radius: 3px; display: flex; justify-content: center; align-items: center;">' +
            '<div style="color: white; font-weight: bold; font-size: 12px; transform: rotate(90deg);">🚗</div>' +
            '</div>'
          );
          
          // Atanan araç simge/ikon tanımlamaları (sarı renkli)
          const atananAracIconLayout = window.ymaps.templateLayoutFactory.createClass(
            '<div class="arac-icon" style="position: relative; width: 24px; height: 24px; background-color: #FFD700; border: 1px solid #DAA520; border-radius: 3px; display: flex; justify-content: center; align-items: center;">' +
            '<div style="color: white; font-weight: bold; font-size: 12px; transform: rotate(90deg);">🚗</div>' +
            '</div>'
          );
          
          // Trafolar için imleçler - Normal durum
          const trafo1Marker = new window.ymaps.Placemark(TRAFO_1_KONUM, {
            balloonContent: '<div><strong>120 Nolu A çıkışı</strong><br>Yeraltı tipi trafo</div>',
            hintContent: '120 Nolu A çıkışı - Yeraltı tipi trafo'
          }, {
            iconLayout: trafoIconLayout,
            iconShape: {
              type: 'Rectangle',
              coordinates: [[0, 0], [24, 24]]
            }
          });
          
          // Trafolar için imleçler - Tehlikeli durum 
          const trafo1TehlikeliMarker = new window.ymaps.Placemark(TRAFO_1_KONUM, {
            balloonContent: '<div><strong>120 Nolu A çıkışı</strong><br>Yeraltı tipi trafo<br><span style="color: red; font-weight: bold;">TEHLİKELİ DURUM!</span></div>',
            hintContent: '120 Nolu A çıkışı - Yeraltı tipi trafo - TEHLİKELİ DURUM!'
          }, {
            iconLayout: trafoTehlikeliIconLayout,
            iconShape: {
              type: 'Rectangle',
              coordinates: [[0, 0], [24, 24]]
            }
          });
          
          const trafo2Marker = new window.ymaps.Placemark(TRAFO_2_KONUM, {
            balloonContent: '<div><strong>130 Nolu B çıkışı</strong><br>Havaihat tipi trafo</div>',
            hintContent: '130 Nolu B çıkışı - Havaihat tipi trafo'
          }, {
            iconLayout: trafoIconLayout,
            iconShape: {
              type: 'Rectangle',
              coordinates: [[0, 0], [24, 24]]
            }
          });
          
          const trafo2TehlikeliMarker = new window.ymaps.Placemark(TRAFO_2_KONUM, {
            balloonContent: '<div><strong>130 Nolu B çıkışı</strong><br>Havaihat tipi trafo<br><span style="color: red; font-weight: bold;">TEHLİKELİ DURUM!</span></div>',
            hintContent: '130 Nolu B çıkışı - Havaihat tipi trafo - TEHLİKELİ DURUM!'
          }, {
            iconLayout: trafoTehlikeliIconLayout,
            iconShape: {
              type: 'Rectangle',
              coordinates: [[0, 0], [24, 24]]
            }
          });
          
          const trafo2AydinlatmaMarker = new window.ymaps.Placemark(TRAFO_2_KONUM, {
            balloonContent: '<div><strong>130 Nolu B çıkışı</strong><br>Havaihat tipi trafo<br><span style="color: orange; font-weight: bold;">AYDINLATMA ARIZA</span></div>',
            hintContent: '130 Nolu B çıkışı - Havaihat tipi trafo - AYDINLATMA ARIZA'
          }, {
            iconLayout: trafoAydinlatmaIconLayout,
            iconShape: {
              type: 'Rectangle',
              coordinates: [[0, 0], [24, 24]]
            }
          });
          
          // 120 Nolu trafo için kofreler - bina şeklinde
          const kofre1Marker = new window.ymaps.Placemark(KOFRE_1_KONUM, {
            balloonContent: '<div><strong>22 Nolu Kofre</strong><br>120 Nolu A trafo çıkışına bağlı</div>',
            hintContent: '22 Nolu Kofre'
          }, {
            iconLayout: kofreIconLayout,
            iconShape: {
              type: 'Rectangle',
              coordinates: [[0, 0], [20, 20]]
            }
          });
          
          const kofre2Marker = new window.ymaps.Placemark(KOFRE_2_KONUM, {
            balloonContent: '<div><strong>23 Nolu Kofre</strong><br>120 Nolu A trafo çıkışına bağlı</div>',
            hintContent: '23 Nolu Kofre'
          }, {
            iconLayout: kofreIconLayout,
            iconShape: {
              type: 'Rectangle',
              coordinates: [[0, 0], [20, 20]]
            }
          });
          
          const kofre3Marker = new window.ymaps.Placemark(KOFRE_3_KONUM, {
            balloonContent: '<div><strong>24 Nolu Kofre</strong><br>120 Nolu A trafo çıkışına bağlı</div>',
            hintContent: '24 Nolu Kofre'
          }, {
            iconLayout: kofreIconLayout,
            iconShape: {
              type: 'Rectangle',
              coordinates: [[0, 0], [20, 20]]
            }
          });
          
          // 130 Nolu trafo için kofreler - bina şeklinde
          const kofre4Marker = new window.ymaps.Placemark(KOFRE_4_KONUM, {
            balloonContent: '<div><strong>31 Nolu Kofre</strong><br>130 Nolu B trafo çıkışına bağlı</div>',
            hintContent: '31 Nolu Kofre'
          }, {
            iconLayout: kofreIconLayout,
            iconShape: {
              type: 'Rectangle',
              coordinates: [[0, 0], [20, 20]]
            }
          });
          
          const kofre5Marker = new window.ymaps.Placemark(KOFRE_5_KONUM, {
            balloonContent: '<div><strong>32 Nolu Kofre</strong><br>130 Nolu B trafo çıkışına bağlı</div>',
            hintContent: '32 Nolu Kofre'
          }, {
            iconLayout: kofreIconLayout,
            iconShape: {
              type: 'Rectangle',
              coordinates: [[0, 0], [20, 20]]
            }
          });
          
          const kofre6Marker = new window.ymaps.Placemark(KOFRE_6_KONUM, {
            balloonContent: '<div><strong>33 Nolu Kofre</strong><br>130 Nolu B trafo çıkışına bağlı</div>',
            hintContent: '33 Nolu Kofre'
          }, {
            iconLayout: kofreIconLayout,
            iconShape: {
              type: 'Rectangle',
              coordinates: [[0, 0], [20, 20]]
            }
          });
          
          // Araçlar için imleçler
          const arac1Marker = new window.ymaps.Placemark(ARAC_1_KONUM, {
            balloonContent: `<div><strong>${ARAC_1_PLAKA}</strong><br>${ARAC_1_TIP} araç<br>120 Nolu trafodan ${ARAC_1_MESAFE} uzaklıkta</div>`,
            hintContent: `${ARAC_1_PLAKA} - 120 Nolu trafodan ${ARAC_1_MESAFE} uzaklıkta`
          }, {
            iconLayout: simulationStarted && activeTrafo === '120' && simulationStep >= 6 ? ozelArac1IconLayout : aracIconLayout,
            iconShape: {
              type: 'Rectangle',
              coordinates: [[0, 0], [24, 24]]
            }
          });
          
          const arac2Marker = new window.ymaps.Placemark(ARAC_2_KONUM, {
            balloonContent: `<div><strong>${ARAC_2_PLAKA}</strong><br>120 Nolu trafodan ${ARAC_2_MESAFE} uzaklıkta</div>`,
            hintContent: `${ARAC_2_PLAKA} - 120 Nolu trafodan ${ARAC_2_MESAFE} uzaklıkta`
          }, {
            iconLayout: aracIconLayout,
            iconShape: {
              type: 'Rectangle',
              coordinates: [[0, 0], [24, 24]]
            }
          });
          
          const arac3Marker = new window.ymaps.Placemark(ARAC_3_KONUM, {
            balloonContent: `<div><strong>${ARAC_3_PLAKA}</strong><br>120 Nolu trafodan ${ARAC_3_MESAFE} uzaklıkta</div>`,
            hintContent: `${ARAC_3_PLAKA} - 120 Nolu trafodan ${ARAC_3_MESAFE} uzaklıkta`
          }, {
            iconLayout: aracIconLayout,
            iconShape: {
              type: 'Rectangle',
              coordinates: [[0, 0], [24, 24]]
            }
          });
          
          // 130 Nolu trafo için araçlar
          const arac4Marker = new window.ymaps.Placemark(ARAC_4_KONUM, {
            balloonContent: `<div><strong>${ARAC_4_PLAKA}</strong><br>130 Nolu trafodan ${ARAC_4_MESAFE} uzaklıkta</div>`,
            hintContent: `${ARAC_4_PLAKA} - 130 Nolu trafodan ${ARAC_4_MESAFE} uzaklıkta`
          }, {
            iconLayout: simulationStarted && activeTrafo === '130' && simulationStep >= 12 ? atananAracIconLayout : aracIconLayout,
            iconShape: {
              type: 'Rectangle',
              coordinates: [[0, 0], [24, 24]]
            }
          });
          
          const arac5Marker = new window.ymaps.Placemark(ARAC_5_KONUM, {
            balloonContent: `<div><strong>${ARAC_5_PLAKA}</strong><br>130 Nolu trafodan ${ARAC_5_MESAFE} uzaklıkta</div>`,
            hintContent: `${ARAC_5_PLAKA} - 130 Nolu trafodan ${ARAC_5_MESAFE} uzaklıkta`
          }, {
            iconLayout: aracIconLayout,
            iconShape: {
              type: 'Rectangle',
              coordinates: [[0, 0], [24, 24]]
            }
          });
          
          const arac6Marker = new window.ymaps.Placemark(ARAC_6_KONUM, {
            balloonContent: `<div><strong>${ARAC_6_PLAKA}</strong><br>130 Nolu trafodan ${ARAC_6_MESAFE} uzaklıkta</div>`,
            hintContent: `${ARAC_6_PLAKA} - 130 Nolu trafodan ${ARAC_6_MESAFE} uzaklıkta`
          }, {
            iconLayout: aracIconLayout,
            iconShape: {
              type: 'Rectangle',
              coordinates: [[0, 0], [24, 24]]
            }
          });
          
          // Tüm nesneleri haritaya ekliyoruz
          map.geoObjects.add(kofre1Marker);
          map.geoObjects.add(kofre2Marker);
          map.geoObjects.add(kofre3Marker);
          map.geoObjects.add(kofre4Marker);
          map.geoObjects.add(kofre5Marker);
          map.geoObjects.add(kofre6Marker);
          map.geoObjects.add(arac1Marker);
          map.geoObjects.add(arac2Marker);
          map.geoObjects.add(arac3Marker);
          map.geoObjects.add(arac4Marker);
          map.geoObjects.add(arac5Marker);
          map.geoObjects.add(arac6Marker);
          
          // Trafo durumlarına göre marker ekleme
          if (trafo1Status === 'Tehlikeli') {
            map.geoObjects.add(trafo1TehlikeliMarker);
          } else {
            map.geoObjects.add(trafo1Marker);
          }
          
          // 130 nolu trafo
          if (trafo2Status === 'Tehlikeli') {
            map.geoObjects.add(trafo2TehlikeliMarker);
          } else {
            map.geoObjects.add(trafo2Marker);
          }
        });
      }
    }

    return () => {
      // Temizlik işlemleri
      const yandexScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
      if (yandexScript) {
        yandexScript.remove();
      }
    };
  }, [trafo1Status, trafo2Status, simulationStarted, simulationStep, activeTrafo, isBrowser]);

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-xl shadow-sm">
      {/* Sol taraf - Harita */}
      <div className="w-full md:w-3/4 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Ataşehir Haritası</h2>
            <p className="text-sm opacity-80">AG Fider Çıkışları ve Araç Konumları</p>
          </div>
          {/* Küçük buton */}
          {!autoAssignSimulationStarted ? (
            <button 
              className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white text-xs py-2 px-3 rounded-lg shadow-sm transition duration-200 flex items-center justify-center"
              onClick={startAutoAssignSimulation}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
              Otomatik Atama
            </button>
          ) : (
            <button 
              className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white text-xs py-2 px-3 rounded-lg shadow-sm transition duration-200 flex items-center justify-center"
              onClick={resetAutoAssignSimulation}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              Durdur
            </button>
          )}
        </div>
        <div ref={mapRef} className="h-[600px]"></div>
      </div>

      {/* Sağ taraf - Atama bilgileri paneli (simülasyon çalıştığında görünür) */}
      {autoAssignSimulationStarted && (
        <div className="w-full md:w-1/4 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm flex-1 flex flex-col max-h-[600px] overflow-hidden">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3 flex items-center justify-between">
              Otomatik Atama
              <span className="text-sm font-normal bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                Adım {autoAssignSimulationStep}/10
              </span>
            </h3>

            <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {/* AG Fider Durum Kartları */}
              <div className="grid grid-cols-1 gap-3 mt-3">
                {/* 120B Çıkışı */}
                <div className={`relative p-3 rounded-lg border-l-4 ${showCompletedAssignments.includes('120B') 
                  ? 'border-l-green-600 bg-green-50' 
                  : activeHat === '120B' 
                    ? 'border-l-blue-600 bg-blue-50 animate-pulse' 
                    : 'border-l-gray-300 bg-gray-50'}`}>
                  
                  {showCompletedAssignments.includes('120B') && (
                    <div className="absolute -right-2 -top-2 bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  <div className={`font-bold text-base ${showCompletedAssignments.includes('120B') ? 'text-green-800' : activeHat === '120B' ? 'text-blue-800' : 'text-gray-800'}`}>120B Çıkışı</div>
                  <div className="mt-1 text-sm flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                    <span className="font-medium text-red-700">Tehlikeli Durum</span>
                    <span className="mx-1">-</span>
                    <span>Hisar Sokak</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1 flex items-center">
                    <span className="mr-1">Tesisatlar:</span>
                    <span className="font-medium">11-21</span>
                  </div>
                  {showCompletedAssignments.includes('120B') && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-gray-300">
                      <div className="text-xs">Atanan Araç:</div>
                      <div className="bg-red-100 text-red-800 text-xs font-bold py-1 px-2 rounded">
                        {ARAC_FF5179}
                      </div>
                    </div>
                  )}
                  {activeHat === '120B' && !showCompletedAssignments.includes('120B') && (
                    <div className="mt-2 text-xs text-blue-700 flex items-center">
                      <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Atama işleniyor...
                    </div>
                  )}
                </div>

                {/* 130B Çıkışı */}
                <div className={`relative p-3 rounded-lg border-l-4 ${showCompletedAssignments.includes('130B') 
                  ? 'border-l-green-600 bg-green-50' 
                  : activeHat === '130B' 
                    ? 'border-l-blue-600 bg-blue-50 animate-pulse' 
                    : 'border-l-gray-300 bg-gray-50'}`}>
                  
                  {showCompletedAssignments.includes('130B') && (
                    <div className="absolute -right-2 -top-2 bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  <div className={`font-bold text-base ${showCompletedAssignments.includes('130B') ? 'text-green-800' : activeHat === '130B' ? 'text-blue-800' : 'text-gray-800'}`}>130B Çıkışı</div>
                  <div className="mt-1 text-sm flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                    <span className="font-medium text-red-700">Tehlikeli Durum</span>
                    <span className="mx-1">-</span>
                    <span>Şerif Sokak</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1 flex items-center">
                    <span className="mr-1">Tesisatlar:</span>
                    <span className="font-medium">32-42</span>
                  </div>
                  {showCompletedAssignments.includes('130B') && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-gray-300">
                      <div className="text-xs">Atanan Araç:</div>
                      <div className="bg-red-100 text-red-800 text-xs font-bold py-1 px-2 rounded">
                        {ARAC_ABC123}
                      </div>
                    </div>
                  )}
                  {activeHat === '130B' && !showCompletedAssignments.includes('130B') && (
                    <div className="mt-2 text-xs text-blue-700 flex items-center">
                      <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Atama işleniyor...
                    </div>
                  )}
                </div>

                {/* 120A Çıkışı */}
                <div className={`relative p-3 rounded-lg border-l-4 ${showCompletedAssignments.includes('120A') 
                  ? 'border-l-green-600 bg-green-50' 
                  : activeHat === '120A' 
                    ? 'border-l-blue-600 bg-blue-50 animate-pulse' 
                    : 'border-l-gray-300 bg-gray-50'}`}>
                  
                  {showCompletedAssignments.includes('120A') && (
                    <div className="absolute -right-2 -top-2 bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  <div className={`font-bold text-base ${showCompletedAssignments.includes('120A') ? 'text-green-800' : activeHat === '120A' ? 'text-blue-800' : 'text-gray-800'}`}>120A Çıkışı</div>
                  <div className="mt-1 text-sm flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    <span className="font-medium text-blue-700">Normal Durum</span>
                    <span className="mx-1">-</span>
                    <span>Hisar Sokak</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1 flex items-center">
                    <span className="mr-1">Tesisatlar:</span>
                    <span className="font-medium">1-10</span>
                  </div>
                  {showCompletedAssignments.includes('120A') && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-gray-300">
                      <div className="text-xs">Atanan Araç:</div>
                      <div className="bg-red-100 text-red-800 text-xs font-bold py-1 px-2 rounded">
                        {ARAC_GG6280}
                      </div>
                    </div>
                  )}
                  {activeHat === '120A' && !showCompletedAssignments.includes('120A') && (
                    <div className="mt-2 text-xs text-blue-700 flex items-center">
                      <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Atama işleniyor...
                    </div>
                  )}
                </div>

                {/* 130A Çıkışı */}
                <div className={`relative p-3 rounded-lg border-l-4 ${showCompletedAssignments.includes('130A') 
                  ? 'border-l-green-600 bg-green-50' 
                  : activeHat === '130A' 
                    ? 'border-l-blue-600 bg-blue-50 animate-pulse' 
                    : 'border-l-gray-300 bg-gray-50'}`}>
                  
                  {showCompletedAssignments.includes('130A') && (
                    <div className="absolute -right-2 -top-2 bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  <div className={`font-bold text-base ${showCompletedAssignments.includes('130A') ? 'text-green-800' : activeHat === '130A' ? 'text-blue-800' : 'text-gray-800'}`}>130A Çıkışı</div>
                  <div className="mt-1 text-sm flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    <span className="font-medium text-blue-700">Normal Durum</span>
                    <span className="mx-1">-</span>
                    <span>Şerif Sokak</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1 flex items-center">
                    <span className="mr-1">Tesisatlar:</span>
                    <span className="font-medium">22-31</span>
                  </div>
                  {showCompletedAssignments.includes('130A') && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-gray-300">
                      <div className="text-xs">Atanan Araç:</div>
                      <div className="bg-red-100 text-red-800 text-xs font-bold py-1 px-2 rounded">
                        {ARAC_ME7890}
                      </div>
                    </div>
                  )}
                  {activeHat === '130A' && !showCompletedAssignments.includes('130A') && (
                    <div className="mt-2 text-xs text-blue-700 flex items-center">
                      <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Atama işleniyor...
                    </div>
                  )}
                </div>
              </div>
              
              {/* Özet bilgiler */}
              {autoAssignSimulationStep === 10 && (
                <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg p-4">
                  <h4 className="font-bold text-lg text-green-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Atama Tamamlandı
                  </h4>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center justify-center">
                      <div className="text-sm text-gray-600 mb-1">Toplam Atama</div>
                      <div className="text-xl font-bold text-green-600">4/4</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center justify-center">
                      <div className="text-sm text-gray-600 mb-1">Tehlikeli Durum</div>
                      <div className="text-xl font-bold text-red-600">2/2</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center justify-center">
                      <div className="text-sm text-gray-600 mb-1">Araç Sayısı</div>
                      <div className="text-xl font-bold text-blue-600">4</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col items-center justify-center">
                      <div className="text-sm text-gray-600 mb-1">Başarı Oranı</div>
                      <div className="text-xl font-bold text-green-600">100%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Typescript için global tanımlama
declare global {
  interface Window {
    ymaps: any;
  }
} 