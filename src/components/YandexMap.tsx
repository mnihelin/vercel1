import { useEffect, useRef, useState } from 'react';

// Ataşehir'in koordinatları
const ATASEHIR_COORDS = [41.0012, 29.1175];

// Ataşehir'deki trafolar konumları
const TRAFO_1_KONUM = [41.0026, 29.1269]; // 120 Nolu A çıkışı trafo konumu (Tevazu Sokak)
const TRAFO_2_KONUM = [41.0032, 29.1273]; // 130 Nolu B çıkışı trafo konumu

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
const ARAC_1_KONUM = [41.0025, 29.1265]; // 34 ABC 123 plakalı araç (yeraltı tipi)
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
    <div className="map-container flex h-[80vh]">
      <div ref={mapRef} style={{ width: '85%', height: '100%' }} />
      
      <div className="sidebar w-[15%] bg-white p-1 flex flex-col">
        <div className="bg-white p-1 mb-1 border-b border-gray-200">
          <h3 className="text-xs font-bold mb-1.5 text-center text-gray-700">Kontrol Paneli</h3>
          
          {!simulationStarted ? (
            <div className="space-y-1">
              <button 
                onClick={startSimulation}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-2 rounded text-xxs"
              >
                Simülasyonu Başlat
              </button>
            </div>
          ) : (
            <div className="mb-1 space-y-1">
              <button 
                onClick={resetSimulation}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-1 px-2 rounded text-xxs"
              >
                Sıfırla
              </button>
            </div>
          )}
        </div>
        
        {simulationStarted && (
          <div className="flex-1 bg-white p-1 mb-1">
            <div className="flex items-center justify-end mb-1">
              {(activeTrafo === '120' && simulationStep < 6) || (activeTrafo === '130' && simulationStep < 12) ? (
                <span className="text-xxs text-yellow-600 bg-yellow-50 px-1 py-0.5 rounded-sm">
                  İşleniyor...
                </span>
              ) : simulationStep >= 6 ? (
                <span className="text-xxs text-green-600 bg-green-50 px-1 py-0.5 rounded-sm">
                  Tamamlandı
                </span>
              ) : null}
            </div>
            <pre className="bg-white text-gray-800 p-1.5 rounded-sm font-mono text-xxs whitespace-pre-line overflow-auto border border-gray-300 h-48">
              {simulationOutput.includes(ARAC_1_PLAKA) && (
                <span 
                  dangerouslySetInnerHTML={{ 
                    __html: simulationOutput.replace(
                      ARAC_1_PLAKA, 
                      `<span style="color:red;font-weight:bold">${ARAC_1_PLAKA}</span>`
                    ).replace(
                      ARAC_4_PLAKA, 
                      `<span style="color:red;font-weight:bold">${ARAC_4_PLAKA}</span>`
                    )
                  }} 
                />
              )}
              {!simulationOutput.includes(ARAC_1_PLAKA) && simulationOutput}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

// Typescript için global tanımlama
declare global {
  interface Window {
    ymaps: any;
  }
} 