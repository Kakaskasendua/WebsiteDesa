'use client';

import Image from 'next/image';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import {
  Users,
  MapPin,
  Plane,
  Trophy,
  Clock,
  Compass,
  Building2,
} from 'lucide-react';

export default function ProfilPage() {
  const scrollRef = useScrollAnimation();

  const batasWilayah = [
    { arah: 'Utara', wilayah: 'Kakaskasen Satu' },
    { arah: 'Timur', wilayah: 'Gunung Mahawu' },
    { arah: 'Selatan', wilayah: 'Kakaskasen Tiga' },
    { arah: 'Barat', wilayah: 'Gunung Lokon' },
  ];

  return (
    <div ref={scrollRef}>
      {/* Header */}
      <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-sage-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sage-300/60 font-semibold text-xs uppercase tracking-widest">
            Profil
          </span>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl font-bold text-white mt-2 mb-4">
            Profil Kelurahan
          </h1>
          <p className="text-sage-300/70 text-base max-w-xl mx-auto">
            Mengenal lebih dekat Kelurahan Kakaskasen Dua, Kecamatan Tomohon
            Utara, Kota Tomohon, Sulawesi Utara.
          </p>
        </div>
      </section>

      {/* Sejarah & Gambaran */}
      <section className="py-16 md:py-20 bg-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center mb-16">
            <div className="fade-left">
              <div className="rounded-2xl overflow-hidden shadow-xl shadow-sage-400/15">
                <Image
                  src="/profil-gambaran-2.jpg"
                  alt="Panorama Desa Kakaskasen Dua"
                  width={700}
                  height={450}
                  className="w-full h-[380px] object-cover"
                />
              </div>
            </div>

            <div className="fade-right">
              <span className="text-sage-400 font-semibold text-xs uppercase tracking-widest">
                Gambaran Umum
              </span>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-sage-900 mt-2 mb-4">
                Kelurahan di Antara Dua Gunung
              </h2>
              <p className="text-sage-600 leading-relaxed mb-4 text-sm">
                Kakaskasen Dua adalah kelurahan yang berlokasi strategis di
                dataran tinggi Tomohon, diapit oleh dua gunung berapi aktif —
                <strong> Gunung Lokon</strong> di sisi barat dan{' '}
                <strong>Gunung Mahawu</strong> di sisi timur.
              </p>
              <p className="text-sage-600 leading-relaxed mb-4 text-sm">
                Dengan udara sejuk khas pegunungan dan pemandangan alam yang memukau, desa ini
                telah diakui sebagai salah satu desa wisata terbaik di Indonesia
                melalui nominasi 75 besar ADWI 2023.
              </p>
              <p className="text-sage-600 leading-relaxed text-sm">
                Selain pesona alamnya, Kakaskasen Dua juga dikenal sebagai
                <strong> sentra bunga utama</strong> yang mendukung kesuksesan
                Tomohon International Flower Festival (TIFF), serta kaya akan
                seni budaya Minahasa seperti Tari Kabasaran dan musik
                Kolintang.
              </p>
            </div>
          </div>

          {/* Sejarah Kelurahan */}
          <div className="fade-up">
            <div className="text-center mb-10">
              <span className="text-sage-400 font-semibold text-xs uppercase tracking-widest">
                Sejarah Singkat
              </span>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-sage-900 mt-2 mb-3">
                Sejarah Singkat
              </h2>
              <div className="section-divider mb-4" />
              <p className="text-sage-600 text-sm max-w-2xl mx-auto">
                Perjalanan panjang Kelurahan Kakaskasen Dua dari masa ke masa, mencerminkan semangat dan identitas masyarakat Minahasa yang kaya budaya.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {/* Narasi Sejarah */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-sage-100/50 shadow-sm mb-8">
                <p className="text-sage-700 leading-relaxed text-sm mb-4">
                  Nama <strong>"Kakaskasen"</strong> berakar dari tradisi lisan Minahasa kuno mengenai kisah "Kinaskas" yang berarti digaruk, merujuk pada cerita rakyat tentang penemuan mata air legendaris di tengah hutan. Seiring dengan perkembangan zaman dari masa aliansi Walak Toumbulu di abad ke-17 hingga pertumbuhan penduduk yang pesat, wilayah Kakaskasen yang awalnya merupakan satu kesatuan akhirnya mengalami pemekaran.
                </p>
                <p className="text-sage-700 leading-relaxed text-sm">
                  Pada tanggal 14 Februari 1978, kawasan ini resmi dimekarkan menjadi empat kelurahan yang berdiri sendiri, yaitu Kakaskasen, Kakaskasen Satu, Kakaskasen Dua, dan Kakaskasen Tiga. Pemekaran ini bertujuan untuk mengoptimalkan efektivitas pemerintahan dan mempercepat pembangunan di Kelurahan Kakaskasen Dua.
                </p>
              </div>

              {/* Timeline */}
              <div className="space-y-0">
                {[
                  {
                    tahun: 'Pra-1978',
                    judul: 'Kesatuan Kakaskasen',
                    desc: 'Wilayah ini masih tergabung dalam satu kesatuan desa induk Kakaskasen yang dikenal dengan kesuburan tanahnya.',
                  },
                  {
                    tahun: '14 Februari 1978',
                    judul: 'Pemekaran Wilayah',
                    desc: 'Desa induk Kakaskasen secara resmi dimekarkan menjadi empat kelurahan terpisah: Kakaskasen, Kakaskasen Satu, Kakaskasen Dua, dan Kakaskasen Tiga demi meningkatkan pelayanan kepada masyarakat.',
                  },
                  {
                    tahun: '2023',
                    judul: 'Desa Wisata',
                    desc: 'Kelurahan Kakaskasen Dua semakin dikenal luas dengan masuknya dalam nominasi 75 besar Anugerah Desa Wisata Indonesia (ADWI).',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-sage-500 flex items-center justify-center shrink-0 text-white text-xs font-bold z-10">
                        {i + 1}
                      </div>
                      {i < 3 && <div className="w-0.5 flex-1 bg-sage-200 my-1" />}
                    </div>
                    <div className={`pb-8 ${i === 3 ? 'pb-0' : ''}`}>
                      <span className="text-sage-400 text-xs font-bold uppercase tracking-widest">
                        {item.tahun}
                      </span>
                      <h4 className="font-[family-name:var(--font-heading)] font-bold text-sage-900 mt-1 mb-1">
                        {item.judul}
                      </h4>
                      <p className="text-sage-600 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Data Kelurahan */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-up">
            <span className="text-sage-400 font-semibold text-xs uppercase tracking-widest">
              Data
            </span>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-sage-900 mt-2 mb-3">
              Data Kelurahan
            </h2>
            <div className="section-divider mb-4" />
          </div>

          <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto mb-12">
            {[
              { icon: Users, label: 'Penduduk', value: '4.409', sub: 'jiwa' },
              { icon: MapPin, label: 'Lingkungan', value: '13', sub: 'lingkungan' },

              { icon: Trophy, label: 'Prestasi', value: 'Top 75', sub: 'ADWI 2023' },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-sage-50 rounded-xl p-5 border border-sage-100/50 text-center fade-up"
              >
                <div className="w-11 h-11 rounded-lg bg-sage-400/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-sage-500" />
                </div>
                <p className="text-sage-500 text-xs font-medium mb-1">
                  {item.label}
                </p>
                <p className="text-2xl font-bold text-sage-900">{item.value}</p>
                <p className="text-sage-500 text-xs mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Batas Wilayah */}
          <div className="bg-sage-50 rounded-xl p-6 border border-sage-100/50 fade-up">
            <h3 className="font-semibold text-sage-900 mb-4 flex items-center gap-2 text-base">
              <Compass className="w-4 h-4 text-sage-400" />
              Batas Wilayah
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {batasWilayah.map((b) => (
                <div key={b.arah} className="bg-white rounded-lg px-4 py-3">
                  <p className="text-sage-400 text-xs font-medium uppercase">
                    {b.arah}
                  </p>
                  <p className="text-sage-800 text-sm font-medium">
                    {b.wilayah}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Jam Operasional */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center fade-up">
          <div className="w-11 h-11 rounded-lg bg-sage-400/10 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-5 h-5 text-sage-500" />
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-sage-900 mb-2">
            Jam Pelayanan
          </h2>
          <p className="text-sage-600 text-sm mb-1">
            Senin — Kamis: 08.00 — 17.00 WITA
          </p>
          <p className="text-sage-600 text-sm mb-1">
            Jumat: 08.00 — 11.30 WITA
          </p>
          <p className="text-sage-500 text-xs">Sabtu — Minggu: Tutup</p>

          <div className="mt-6 bg-sage-50 rounded-xl p-4 border border-sage-100/50 inline-block">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sage-400" />
              <p className="text-sage-700 text-sm">
                Jl Mahawu no 137, Kelurahan Kakaskasen Dua, Kecamatan Tomohon Utara, Kota Tomohon, Sulawesi Utara 95416
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
