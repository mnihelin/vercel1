import YandexMap from './YandexMap';

export default function AtasehirMap() {
  // Not: Gerçek uygulamada API anahtarınızı .env.local dosyasında saklayabilirsiniz
  // Örneğin: const apiKey = process.env.NEXT_PUBLIC_YANDEX_API_KEY || '';
  
  return (
    <div className="atasehir-map-container">
      <header className="text-center my-8">
        <h1 className="text-3xl font-bold mb-4">Akıllı İşim</h1>
        <p className="text-gray-600">Elektrik Dağıtım Şebekeleri İzleme ve Yönetim Platformu</p>
      </header>
      
      <YandexMap />
      
      <div className="my-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Trafolar ve Kofreler</h2>
        
        {/* Trafolar */}
        <div className="mb-5">
          <h3 className="text-lg font-semibold border-b pb-2 mb-3">Trafolar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border-l-4 border-purple-500">
              <h3 className="font-medium">
                <span className="inline-block w-4 h-4 rounded-sm bg-purple-700 mr-2 flex items-center justify-center text-white text-xs">T</span>
                120 Nolu A çıkışı (Tevazu Sokak)
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Koordinatlar:</strong> 41.0026, 29.1269
              </p>
              <p className="mt-2">
                <span className="font-medium">Tipi:</span> Yeraltı tipi trafo<br />
                <span className="font-medium">Durum:</span> <span className="text-yellow-600">İzleniyor</span>
              </p>
            </div>
            <div className="p-3 border-l-4 border-purple-500">
              <h3 className="font-medium">
                <span className="inline-block w-4 h-4 rounded-sm bg-purple-700 mr-2 flex items-center justify-center text-white text-xs">T</span>
                130 Nolu B çıkışı
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Koordinatlar:</strong> 41.0032, 29.1273
              </p>
              <p className="mt-2">
                <span className="font-medium">Tipi:</span> Havaihat tipi trafo<br />
                <span className="font-medium">Durum:</span> Aktif
              </p>
            </div>
          </div>
        </div>
        
        {/* 120 Nolu A trafo için kofreler */}
        <div className="mt-5">
          <h3 className="text-lg font-semibold border-b pb-2 mb-3">120 Nolu A Çıkışına Bağlı Kofreler</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 border-l-4 border-green-500">
              <h3 className="font-medium">
                <span className="inline-block w-4 h-4 bg-green-600 mr-2 flex items-center justify-center text-white text-xs">K</span>
                22 Nolu Kofre
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Koordinatlar:</strong> 41.0023, 29.1266
              </p>
              <p className="mt-2">
                <span className="font-medium">Durum:</span> Aktif<br />
                <span className="font-medium">Konum:</span> Sokak başlangıcı
              </p>
            </div>
            <div className="p-3 border-l-4 border-green-500">
              <h3 className="font-medium">
                <span className="inline-block w-4 h-4 bg-green-600 mr-2 flex items-center justify-center text-white text-xs">K</span>
                23 Nolu Kofre
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Koordinatlar:</strong> 41.0025, 29.1267
              </p>
              <p className="mt-2">
                <span className="font-medium">Durum:</span> Aktif<br />
                <span className="font-medium">Konum:</span> Sokak ortası
              </p>
            </div>
            <div className="p-3 border-l-4 border-green-500">
              <h3 className="font-medium">
                <span className="inline-block w-4 h-4 bg-green-600 mr-2 flex items-center justify-center text-white text-xs">K</span>
                24 Nolu Kofre
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Koordinatlar:</strong> 41.0027, 29.1268
              </p>
              <p className="mt-2">
                <span className="font-medium">Durum:</span> Aktif<br />
                <span className="font-medium">Konum:</span> Trafo yakını
              </p>
            </div>
          </div>
        </div>
        
        {/* 130 Nolu B trafo için kofreler */}
        <div className="mt-5">
          <h3 className="text-lg font-semibold border-b pb-2 mb-3">130 Nolu B Çıkışına Bağlı Kofreler</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 border-l-4 border-green-500">
              <h3 className="font-medium">
                <span className="inline-block w-4 h-4 bg-green-600 mr-2 flex items-center justify-center text-white text-xs">K</span>
                31 Nolu Kofre
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Koordinatlar:</strong> 41.0031, 29.1269
              </p>
              <p className="mt-2">
                <span className="font-medium">Durum:</span> Aktif<br />
                <span className="font-medium">Konum:</span> Sokağın başlangıcında
              </p>
            </div>
            <div className="p-3 border-l-4 border-green-500">
              <h3 className="font-medium">
                <span className="inline-block w-4 h-4 bg-green-600 mr-2 flex items-center justify-center text-white text-xs">K</span>
                32 Nolu Kofre
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Koordinatlar:</strong> 41.0032, 29.1272
              </p>
              <p className="mt-2">
                <span className="font-medium">Durum:</span> Aktif<br />
                <span className="font-medium">Konum:</span> Sokağın ortasında (trafo yakınında)
              </p>
            </div>
            <div className="p-3 border-l-4 border-green-500">
              <h3 className="font-medium">
                <span className="inline-block w-4 h-4 bg-green-600 mr-2 flex items-center justify-center text-white text-xs">K</span>
                33 Nolu Kofre
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Koordinatlar:</strong> 41.0033, 29.1275
              </p>
              <p className="mt-2">
                <span className="font-medium">Durum:</span> Aktif<br />
                <span className="font-medium">Konum:</span> Sokağın sonunda
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-300">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Not:</span> Haritada trafolar mor, kofreler yeşil ikonlarla gösterilmiştir. 120 Nolu trafonun sokağında kofreler sıralanmış olarak bulunmaktadır. 130 Nolu trafonun bulunduğu sokağın üstünde kofreler birbirine yakın olarak art arda dizilmiştir. İkonların üzerine tıklayarak daha fazla bilgi alabilirsiniz.
          </p>
        </div>
      </div>
      
      {/* Araçlar bölümü */}
      <div className="my-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Saha Araçları</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 border-l-4 border-blue-500">
            <h3 className="font-medium">
              <span className="inline-block w-5 h-5 rounded-sm bg-red-600 mr-2 flex items-center justify-center text-white text-xs">🚗</span>
              34 ABC 123
            </h3>
            <p className="mt-2">
              <span className="font-medium">Durum:</span> Aktif görevde<br />
              <span className="font-medium">Konum:</span> 120 Nolu trafodan 200 metre uzaklıkta<br />
              <span className="font-medium">Koordinatlar:</span> 41.0025, 29.1265<br />
              <span className="font-medium">Tip:</span> <span className="font-bold text-blue-600">Yeraltı tipi</span>
            </p>
          </div>
          
          <div className="p-3 border-l-4 border-blue-500">
            <h3 className="font-medium">
              <span className="inline-block w-5 h-5 rounded-sm bg-red-600 mr-2 flex items-center justify-center text-white text-xs">🚗</span>
              34 KJ 4567
            </h3>
            <p className="mt-2">
              <span className="font-medium">Durum:</span> Aktif görevde<br />
              <span className="font-medium">Konum:</span> 120 Nolu trafodan 1 KM uzaklıkta<br />
              <span className="font-medium">Koordinatlar:</span> 41.0024, 29.1273
            </p>
          </div>
          
          <div className="p-3 border-l-4 border-blue-500">
            <h3 className="font-medium">
              <span className="inline-block w-5 h-5 rounded-sm bg-red-600 mr-2 flex items-center justify-center text-white text-xs">🚗</span>
              34 ZY 8901
            </h3>
            <p className="mt-2">
              <span className="font-medium">Durum:</span> Aktif görevde<br />
              <span className="font-medium">Konum:</span> 120 Nolu trafodan 1.5 KM uzaklıkta<br />
              <span className="font-medium">Koordinatlar:</span> 41.0028, 29.1277
            </p>
          </div>
        </div>
        
        <div className="mt-5 pt-4 border-t border-gray-300">
          <h3 className="text-lg font-semibold mb-3">130 Nolu Trafo Araçları</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border-l-4 border-blue-500">
              <h3 className="font-medium">
                <span className="inline-block w-5 h-5 rounded-sm bg-red-600 mr-2 flex items-center justify-center text-white text-xs">🚗</span>
                34 KC 9012
              </h3>
              <p className="mt-2">
                <span className="font-medium">Durum:</span> Aktif görevde<br />
                <span className="font-medium">Konum:</span> 130 Nolu trafodan 300 METRE uzaklıkta<br />
                <span className="font-medium">Koordinatlar:</span> 41.0034, 29.1268
              </p>
            </div>
            
            <div className="p-3 border-l-4 border-blue-500">
              <h3 className="font-medium">
                <span className="inline-block w-5 h-5 rounded-sm bg-red-600 mr-2 flex items-center justify-center text-white text-xs">🚗</span>
                34 LD 3456
              </h3>
              <p className="mt-2">
                <span className="font-medium">Durum:</span> Aktif görevde<br />
                <span className="font-medium">Konum:</span> 130 Nolu trafodan 700 METRE uzaklıkta<br />
                <span className="font-medium">Koordinatlar:</span> 41.0036, 29.1272
              </p>
            </div>
            
            <div className="p-3 border-l-4 border-blue-500">
              <h3 className="font-medium">
                <span className="inline-block w-5 h-5 rounded-sm bg-red-600 mr-2 flex items-center justify-center text-white text-xs">🚗</span>
                34 ME 7890
              </h3>
              <p className="mt-2">
                <span className="font-medium">Durum:</span> Aktif görevde<br />
                <span className="font-medium">Konum:</span> 130 Nolu trafodan 2 KM uzaklıkta<br />
                <span className="font-medium">Koordinatlar:</span> 41.0038, 29.1276
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-300">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Not:</span> Haritada araçlar kırmızı renkli araba ikonlarıyla gösterilmiştir. İkonların üzerine tıklayarak plaka ve konum detaylarına ulaşabilirsiniz. Araçlar sürekli hareket halinde olduğundan, konumlar anlık olarak değişebilir.
          </p>
        </div>
      </div>
      
      <div className="mt-8 mb-8">
        <h2 className="text-xl font-semibold mb-3">Simülasyon Özelliği</h2>
        <p className="mb-4">
          Haritanın sağ tarafındaki kontrol panelinde yer alan "Simülasyonu Başlat" butonuna tıklayarak, 
          120 A Nolu Trafo (Tevazu Sokak) için tehlikeli durum senaryosunu başlatabilirsiniz. 
          Tehlikeli durum oluştuğunda, sisteme tanımlı kurallar gereği en yakındaki yeraltı tipi araç 
          otomatik olarak atanacaktır. Simülasyon çıktısını yan panelde görebilirsiniz.
        </p>
        
        <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <h3 className="font-medium text-yellow-800">Önemli Bilgi</h3>
          <p className="text-sm text-yellow-700 mt-1">
            Bu simülasyon yalnızca test amaçlıdır. Gerçek senaryolarda, sensörlerden alınan veriler ve 
            yapay zeka destekli karar verme algoritmaları aracılığıyla uygun araç atamaları otomatik olarak gerçekleştirilir.
          </p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Ataşehir Hakkında</h2>
        <p className="mb-4">
          Ataşehir, İstanbul'un Anadolu yakasında yer alan modern bir ilçedir. 
          2008 yılında Kadıköy, Ümraniye ve Üsküdar ilçelerinden ayrılarak kurulmuştur.
          Finans Merkezi, alışveriş merkezleri ve modern konut projeleriyle tanınır.
        </p>
        
        <h3 className="text-lg font-semibold mb-2">Önemli Yerler</h3>
        <ul className="list-disc pl-5 mb-4">
          <li>İstanbul Finans Merkezi</li>
          <li>Bulvar 216</li>
          <li>Watergarden İstanbul</li>
          <li>Ataşehir Belediye Başkanlığı</li>
          <li>Metropol İstanbul</li>
        </ul>
      </div>
    </div>
  );
} 