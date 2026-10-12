'use client';

import useScrollAnimation from '@/hooks/useScrollAnimation';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Compass,
} from 'lucide-react';

export default function KontakPage() {
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
            Hubungi Kami
          </span>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl font-bold text-white mt-2 mb-4">
            Kontak & Lokasi
          </h1>
          <p className="text-sage-300/70 text-base max-w-xl mx-auto">
            Hubungi kami untuk informasi lebih lanjut tentang layanan Kelurahan
            Kakaskasen Dua.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20 bg-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Contact Info */}
            <div className="fade-left">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-sage-100/50 h-full">
                <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-sage-900 mb-5">
                  Kantor Kelurahan Kakaskasen Dua
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sage-400/10 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-sage-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sage-900 text-sm mb-0.5">
                        Alamat
                      </p>
                      <p className="text-sage-600 text-sm leading-relaxed">
                        Jl Mahawu no 137, Kelurahan Kakaskasen Dua, Kecamatan Tomohon Utara, Kota
                        Tomohon, Sulawesi Utara 95416
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sage-400/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 text-sage-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sage-900 text-sm mb-0.5">
                        Jam Operasional
                      </p>
                      <p className="text-sage-600 text-sm">
                        Senin — Kamis: 08.00 — 17.00 WITA
                      </p>
                      <p className="text-sage-600 text-sm">
                        Jumat: 08.00 — 11.30 WITA
                      </p>
                      <p className="text-sage-500 text-sm">
                        Sabtu — Minggu: Tutup
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sage-400/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-4 h-4 text-sage-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sage-900 text-sm mb-0.5">
                        Telepon
                      </p>
                      <p className="text-sage-600 text-sm">082292394628</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sage-400/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-4 h-4 text-sage-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sage-900 text-sm mb-0.5">
                        Email
                      </p>
                      <p className="text-sage-600 text-sm">
                        kakaskasendua2@gmail.com
                      </p>
                    </div>
                  </div>
                </div>



                {/* Batas Wilayah */}
                <div className="mt-6 pt-5 border-t border-sage-100">
                  <h3 className="font-medium text-sage-900 mb-3 flex items-center gap-2 text-sm">
                    <Compass className="w-4 h-4 text-sage-400" />
                    Batas Wilayah
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {batasWilayah.map((b) => (
                      <div
                        key={b.arah}
                        className="bg-sage-50 rounded-lg px-3 py-2.5"
                      >
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
            </div>

            {/* Right: Map */}
            <div className="fade-right">
              <div className="map-container h-full min-h-[450px]">
                <iframe
                  src="https://maps.google.com/maps?q=Kantor+Kelurahan+Kakaskasen+Dua,+Tomohon+Utara,+Sulawesi+Utara&t=h&z=17&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '450px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Kantor Kelurahan Kakaskasen Dua di Google Maps"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
