'use client';

import useScrollAnimation from '@/hooks/useScrollAnimation';
import {
  MessageCircle,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Info,
  ExternalLink,
} from 'lucide-react';

const WHATSAPP_NUMBER = '6282292394628';
export default function PelaporanPage() {
  const scrollRef = useScrollAnimation();

  const handleLaporUmum = () => {
    const pesan = `Halo, saya ingin menyampaikan laporan/aspirasi kepada Kelurahan Kakaskasen Dua.

*Nama:* 
*Alamat:* 
*Isi Laporan:*`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(pesan)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div ref={scrollRef}>
      {/* Header */}
      <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-sage-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sage-300/60 font-semibold text-xs uppercase tracking-widest">
            Layanan Warga
          </span>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl font-bold text-white mt-2 mb-4">
            Pelaporan Warga
          </h1>
          <p className="text-sage-300/70 text-base max-w-xl mx-auto">
            Sampaikan laporan, keluhan, atau aspirasi Anda kepada Kelurahan Kakaskasen Dua melalui WhatsApp. Setiap laporan akan ditindaklanjuti secepatnya.
          </p>
        </div>
      </section>

      {/* Cara & Pilih Kategori */}
      <section className="py-16 md:py-20 bg-sage-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Info Banner */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 mb-10 animate-in">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-green-600">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.553 4.099 1.522 5.826L.054 23.272a.75.75 0 0 0 .92.92l5.49-1.47A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.51-5.17-1.402l-.37-.222-3.808 1.02 1.037-3.79-.24-.378A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
            </div>
            <div>
              <p className="text-green-800 font-semibold text-sm">Pelaporan via WhatsApp</p>
              <p className="text-green-700 text-sm mt-0.5">
                WhatsApp akan terbuka otomatis dengan template pesan yang sudah siap diisi.
              </p>
            </div>
          </div>

          {/* Tombol Lapor Umum */}
          <div className="text-center mb-12">
            <button
              onClick={handleLaporUmum}
              className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-base shadow-lg shadow-green-600/20 transition-all hover:shadow-xl cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.553 4.099 1.522 5.826L.054 23.272a.75.75 0 0 0 .92.92l5.49-1.47A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.51-5.17-1.402l-.37-.222-3.808 1.02 1.037-3.79-.24-.378A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              Kirim Laporan via WhatsApp
              <ExternalLink className="w-4 h-4 opacity-80" />
            </button>
          </div>

          {/* Panduan Singkat */}
          <div className="bg-white rounded-2xl p-6 border border-sage-100/50 shadow-sm">
            <h3 className="font-[family-name:var(--font-heading)] font-bold text-sage-900 text-lg mb-5 flex items-center gap-2">
              <Info className="w-5 h-5 text-sage-400" />
              Panduan Pelaporan
            </h3>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                {
                  step: '1',
                  title: 'Klik Kirim Laporan',
                  desc: 'Klik tombol Kirim Laporan via WhatsApp.',
                },
                {
                  step: '2',
                  title: 'Lengkapi Detail di WA',
                  desc: 'WhatsApp akan terbuka dengan template. Lengkapi nama, alamat, dan deskripsi Anda.',
                },
                {
                  step: '3',
                  title: 'Kirim & Tunggu',
                  desc: 'Kirim pesan. Petugas kelurahan akan segera merespons dan menindaklanjuti.',
                },
              ].map((s) => (
                <div key={s.step} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-sage-400/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sage-600 font-bold text-sm">{s.step}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sage-900 text-sm mb-1">{s.title}</p>
                    <p className="text-sage-500 text-xs leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-sage-100 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sage-500 text-xs">
                Untuk laporan darurat atau bencana, segera hubungi kantor kelurahan atau nomor darurat setempat.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
