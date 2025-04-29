'use client';

import AtasehirMap from '@/components/AtasehirMap';

export default function Home() {
  return (
    <main className="bg-white min-h-screen w-full">
      <div className="container mx-auto p-4 bg-white">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Akıllı İşim</h1>
        <h2 className="text-lg text-center mb-6 text-gray-700">Elektrik Dağıtım Şebekeleri İzleme ve Yönetim Platformu</h2>
        <AtasehirMap />
        <div className="mt-8 bg-white">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Trafolar ve Kofreler</h2>
          {/* İçerik buraya gelecek */}
        </div>
      </div>
    </main>
  );
}
