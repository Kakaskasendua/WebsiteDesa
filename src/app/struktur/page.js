'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { Users, Loader2, MapPin, UserCheck } from 'lucide-react';

function KepalaLingkunganCard({ nomor_lingkungan, nama, wakil, keterangan }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-sage-100 shadow-sm flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-md hover:border-sage-200">
      <div className="w-12 h-12 rounded-full bg-sage-50 mb-3 border-2 border-sage-200 flex items-center justify-center shrink-0">
        <span className="font-bold text-sage-600 text-base">{nomor_lingkungan}</span>
      </div>
      <p className="text-sage-400 text-[10px] font-semibold uppercase tracking-widest mb-1">
        Lingkungan {nomor_lingkungan}
      </p>

      {/* Kepala Lingkungan */}
      <div className="w-full mb-2">
        <p className="text-sage-400 text-[9px] font-semibold uppercase tracking-wider mb-0.5">
          Kepala Lingkungan
        </p>
        <h3 className="font-[family-name:var(--font-heading)] font-bold text-sage-900 text-sm leading-tight min-h-[1.25rem] flex items-center justify-center">
          {nama ? nama : <span className="text-sage-400 italic font-normal text-xs">Belum diisi</span>}
        </h3>
      </div>

      {/* Wakil Kepala Lingkungan */}
      <div className="w-full pt-2 border-t border-sage-100">
        <p className="text-sage-400 text-[9px] font-semibold uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">
          <UserCheck className="w-3 h-3" />
          Wakil
        </p>
        <p className="text-sage-700 text-xs font-medium leading-tight min-h-[1rem] flex items-center justify-center">
          {wakil ? wakil : <span className="text-sage-400 italic font-normal text-xs">Belum diisi</span>}
        </p>
      </div>

      {/* Keterangan */}
      {keterangan && (
        <p className="text-sage-400 text-[10px] mt-2 italic">{keterangan}</p>
      )}
    </div>
  );
}

export default function StrukturPage() {
  const scrollRef = useScrollAnimation();
  const [klList, setKlList] = useState([]);
  const [loadingKL, setLoadingKL] = useState(true);

  useEffect(() => {
    fetch('/api/kepala-lingkungan')
      .then((res) => res.json())
      .then((kl) => setKlList(Array.isArray(kl) ? kl : []))
      .catch(() => setKlList([]))
      .finally(() => setLoadingKL(false));
  }, []);

  return (
    <div ref={scrollRef}>
      {/* HEADER */}
      <section className="pt-28 pb-16 md:pt-32 md:pb-20 bg-sage-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-sage-800/50 hero-bg opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-sage-200" />
          </div>
          <span className="text-sage-300/60 font-semibold text-xs uppercase tracking-widest">
            Pemerintahan
          </span>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl font-bold text-white mt-2 mb-4">
            Struktur Organisasi
          </h1>
          <p className="text-sage-300/70 text-base max-w-xl mx-auto">
            Susunan kelembagaan dan aparatur pemerintah Kelurahan Kakaskasen Dua
            dalam melayani masyarakat secara profesional dan transparan.
          </p>
        </div>
        <div className="absolute -bottom-1 left-0 w-full overflow-hidden leading-none rotate-180 text-sage-50">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12 md:h-20">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-current"></path>
          </svg>
        </div>
      </section>

      {/* BAGAN STRUKTUR - GAMBAR STATIS */}
      <section className="py-16 md:py-24 bg-sage-50 min-h-[50vh]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 fade-up">
            <span className="block text-sage-400 font-semibold text-xs uppercase tracking-widest mb-2">
              Bagan Organisasi
            </span>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-sage-900 mb-3">
              Struktur Perangkat Kelurahan
            </h2>
            <div className="section-divider mx-auto mb-4" />
            <p className="text-sage-500 text-sm max-w-md mx-auto">
              Bagan struktur organisasi Kelurahan Kakaskasen Dua.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-sage-100 shadow-sm p-4 md:p-8 animate-in">
            <div className="relative w-full aspect-[4/3] md:aspect-[16/10]">
              <Image
                src="/struktur-kelurahan.png"
                alt="Bagan Struktur Organisasi Kelurahan Kakaskasen Dua"
                fill
                className="object-contain rounded-xl"
                priority
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* KEPALA LINGKUNGAN */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 fade-up">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sage-50 border border-sage-200 mb-4">
              <MapPin className="w-6 h-6 text-sage-500" />
            </div>
            <span className="block text-sage-400 font-semibold text-xs uppercase tracking-widest mb-2">
              Wilayah
            </span>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-sage-900 mb-3">
              Kepala Lingkungan
            </h2>
            <div className="section-divider mx-auto mb-4" />
            <p className="text-sage-500 text-sm max-w-md mx-auto">
              Kelurahan Kakaskasen Dua terdiri dari 13 lingkungan yang masing-masing dipimpin oleh seorang Kepala Lingkungan beserta wakilnya.
            </p>
          </div>

          {loadingKL ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-sage-400 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {klList.map((item) => (
                <KepalaLingkunganCard key={item.id} {...item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}