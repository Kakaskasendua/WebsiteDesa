import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-sage-900 text-white pt-16 pb-8 overflow-hidden">
      {/* Wave */}
      <div className="footer-wave">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-[60px]"
        >
          <path
            d="M0 30L48 25C96 20 192 10 288 8.3C384 6.7 480 13.3 576 21.7C672 30 768 40 864 41.7C960 43.3 1056 36.7 1152 31.7C1248 26.7 1344 23.3 1392 21.7L1440 20V0H1392C1344 0 1248 0 1152 0C1056 0 960 0 864 0C768 0 672 0 576 0C480 0 384 0 288 0C192 0 96 0 48 0H0V30Z"
            fill="#F5F3ED"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <Image
                  src="/logo-tomohon.png"
                  alt="Logo Tomohon"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <p className="font-semibold text-base leading-tight">
                  Kakaskasen Dua
                </p>
                <p className="text-sage-300/60 text-xs">
                  Kota Tomohon, Sulawesi Utara
                </p>
              </div>
            </div>
            <p className="text-sage-300/70 text-sm leading-relaxed">
              Portal resmi Kelurahan Kakaskasen Dua — menyediakan informasi
              layanan publik, pariwisata, dan pelaporan warga di Kota Tomohon,
              Sulawesi Utara.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-base">
              Navigasi
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Beranda', href: '/' },
                { label: 'Profil Kelurahan', href: '/profil' },
                { label: 'Pariwisata', href: '/wisata' },
                { label: 'Kontak', href: '/kontak' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sage-300/70 hover:text-white text-sm transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-base">
              Kontak
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sage-400 mt-0.5 shrink-0" />
                <p className="text-sage-300/70 text-sm">
                  Jl Mahawu no 137, Kelurahan Kakaskasen Dua, Kecamatan Tomohon Utara, Kota Tomohon, Sulawesi Utara 95416
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sage-400 shrink-0" />
                <p className="text-sage-300/70 text-sm">082292394628</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sage-400 shrink-0" />
                <p className="text-sage-300/70 text-sm">
                  kakaskasendua2@gmail.com
                </p>
              </div>
            </div>


          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-sage-700/40 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <p className="text-sage-300/50 text-xs text-center md:text-left">
              &copy; {currentYear} Kelurahan Kakaskasen Dua. Hak cipta
              dilindungi.
            </p>
            <div className="flex items-center gap-2 mt-1 bg-sage-800/40 px-3 py-1.5 rounded-full border border-sage-700/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sage-300"></span>
              </span>
              <p className="text-sage-200 text-xs font-medium tracking-wide">
                Dikembangkan oleh <span className="text-white font-bold">KKT 149 UNSRAT</span>
              </p>
            </div>
          </div>
          <p className="text-sage-300/50 text-xs text-center md:text-right">
            Kecamatan Tomohon Utara, Kota Tomohon, Sulawesi Utara
          </p>
        </div>
      </div>
    </footer>
  );
}
