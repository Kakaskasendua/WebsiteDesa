'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Megaphone,
  FileText,
  ImageIcon,
  Plus,
  Edit3,
  Trash2,
  Pin,
  PinOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  LogOut,
  Calendar,
  Clock,
  Link as LinkIcon,
  Paperclip,
  MapPin,
  Layers,
  UploadCloud,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

const statusColors = {
  Diterima: 'bg-blue-100 text-blue-700',
  Diproses: 'bg-amber-100 text-amber-700',
  Selesai: 'bg-green-100 text-green-700',
  Ditolak: 'bg-red-100 text-red-700',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('pengumuman');

  // Pengumuman state
  const [pengumumanList, setPengumumanList] = useState([]);
  const [loadingP, setLoadingP] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formP, setFormP] = useState({
    judul: '',
    isi: '',
    is_pinned: false,
    gambar_url: '',
    file_url: '',
    file_nama: '',
  });
  const [savingP, setSavingP] = useState(false);

  // Galeri state
  const [galeriList, setGaleriList] = useState([]);
  const [loadingG, setLoadingG] = useState(true);
  const [showFormG, setShowFormG] = useState(false);
  const [editingIdG, setEditingIdG] = useState(null);
  const [formG, setFormG] = useState({
    judul: '',
    deskripsi: '',
    gambar_url: '',
  });
  const [savingG, setSavingG] = useState(false);

  // Kepala Lingkungan state
  const [klList, setKlList] = useState([]);
  const [loadingKL, setLoadingKL] = useState(true);
  const [showFormKL, setShowFormKL] = useState(false);
  const [formKL, setFormKL] = useState({ id: null, nomor_lingkungan: '', nama: '', keterangan: '', wakil: '' });
  const [savingKL, setSavingKL] = useState(false);

  // Bagan Struktur Kelurahan state
  const [baganUrl, setBaganUrl] = useState('/struktur-kelurahan.png');
  const [tempBaganUrl, setTempBaganUrl] = useState('/struktur-kelurahan.png');
  const [savingBagan, setSavingBagan] = useState(false);
  const [uploadingBagan, setUploadingBagan] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [authLoading, user, router]);

  // Fetch data
  const fetchPengumuman = useCallback(async () => {
    setLoadingP(true);
    try {
      const res = await fetch('/api/pengumuman');
      const data = await res.json();
      setPengumumanList(Array.isArray(data) ? data : []);
    } catch {
      setPengumumanList([]);
    }
    setLoadingP(false);
  }, []);

  const fetchGaleri = useCallback(async () => {
    setLoadingG(true);
    try {
      const res = await fetch('/api/galeri');
      const data = await res.json();
      setGaleriList(Array.isArray(data) ? data : []);
    } catch {
      setGaleriList([]);
    }
    setLoadingG(false);
  }, []);

  const fetchKL = useCallback(async () => {
    setLoadingKL(true);
    try {
      const res = await fetch('/api/kepala-lingkungan');
      const data = await res.json();
      setKlList(Array.isArray(data) ? data : []);
    } catch {
      setKlList([]);
    }
    setLoadingKL(false);
  }, []);

  const fetchPengaturan = useCallback(async () => {
    try {
      const res = await fetch('/api/pengaturan');
      const data = await res.json();
      if (data?.bagan_struktur_url) {
        setBaganUrl(data.bagan_struktur_url);
        setTempBaganUrl(data.bagan_struktur_url);
      }
    } catch {
      // fallback
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchPengumuman();
      fetchGaleri();
      fetchKL();
      fetchPengaturan();
    }
  }, [user, fetchPengumuman, fetchGaleri, fetchKL, fetchPengaturan]);

  const handleFileUpload = async (e, setForm, field, setFileNameField = null) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Batas 4MB (Vercel API limit standard)
    if (file.size > 4 * 1024 * 1024) {
      showToast('error', 'Ukuran file terlalu besar. Maksimal 4MB.');
      return;
    }

    try {
      showToast('info', 'Sedang mengunggah file...');
      
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        let errMessage = 'Upload gagal';
        try {
          const errData = await res.json();
          errMessage = errData.error || errMessage;
        } catch (e) {}
        throw new Error(errMessage);
      }
      
      const blob = await res.json();

      setForm(prev => {
        const next = { ...prev, [field]: blob.url };
        if (setFileNameField) next[setFileNameField] = file.name;
        return next;
      });

      showToast('success', 'File berhasil diunggah!');
    } catch (err) {
      console.error(err);
      showToast('error', 'Gagal mengunggah file. Pastikan Vercel Blob sudah dikonfigurasi.');
    }
  };

  // Pengumuman CRUD
  const resetForm = () => {
    setFormP({ judul: '', isi: '', is_pinned: false, gambar_url: '', file_url: '', file_nama: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditP = (item) => {
    setFormP({
      judul: item.judul,
      isi: item.isi,
      is_pinned: item.is_pinned,
      gambar_url: item.gambar_url || '',
      file_url: item.file_url || '',
      file_nama: item.file_nama || '',
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSaveP = async (e) => {
    e.preventDefault();
    setSavingP(true);
    try {
      const url = editingId ? `/api/pengumuman/${editingId}` : '/api/pengumuman';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formP),
      });
      if (!res.ok) throw new Error();
      showToast('success', editingId ? 'Pengumuman diperbarui' : 'Pengumuman dibuat');
      resetForm();
      fetchPengumuman();
    } catch {
      showToast('error', 'Gagal menyimpan pengumuman');
    }
    setSavingP(false);
  };

  const handleDeleteP = async (id) => {
    if (!confirm('Hapus pengumuman ini?')) return;
    try {
      await fetch(`/api/pengumuman/${id}`, { method: 'DELETE' });
      showToast('success', 'Pengumuman dihapus');
      fetchPengumuman();
    } catch {
      showToast('error', 'Gagal menghapus');
    }
  };

  // Galeri CRUD
  const resetFormG = () => {
    setFormG({ judul: '', deskripsi: '', gambar_url: '' });
    setEditingIdG(null);
    setShowFormG(false);
  };

  const handleEditG = (item) => {
    setFormG({
      judul: item.judul,
      deskripsi: item.deskripsi || '',
      gambar_url: item.gambar_url,
    });
    setEditingIdG(item.id);
    setShowFormG(true);
  };

  const handleSaveG = async (e) => {
    e.preventDefault();
    setSavingG(true);
    try {
      const url = editingIdG ? `/api/galeri/${editingIdG}` : '/api/galeri';
      const method = editingIdG ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formG),
      });
      if (!res.ok) throw new Error();
      showToast('success', editingIdG ? 'Galeri diperbarui' : 'Galeri ditambahkan');
      resetFormG();
      fetchGaleri();
    } catch {
      showToast('error', 'Gagal menyimpan galeri');
    }
    setSavingG(false);
  };

  const handleDeleteG = async (id) => {
    if (!confirm('Hapus foto dari galeri?')) return;
    try {
      await fetch(`/api/galeri/${id}`, { method: 'DELETE' });
      showToast('success', 'Foto dihapus');
      fetchGaleri();
    } catch {
      showToast('error', 'Gagal menghapus');
    }
  };

  // Kepala Lingkungan CRUD (Update Only)
  const handleEditKL = (item) => {
    setFormKL({ id: item.id, nomor_lingkungan: item.nomor_lingkungan, nama: item.nama || '', keterangan: item.keterangan || '', wakil: item.wakil || '' });
    setShowFormKL(true);
  };

  const handleSaveKL = async (e) => {
    e.preventDefault();
    setSavingKL(true);
    try {
      const res = await fetch(`/api/kepala-lingkungan/${formKL.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: formKL.nama, keterangan: formKL.keterangan, wakil: formKL.wakil }),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Data kepala lingkungan diperbarui');
      setShowFormKL(false);
      fetchKL();
    } catch {
      showToast('error', 'Gagal menyimpan data kepala lingkungan');
    }
    setSavingKL(false);
  };

  // Bagan Struktur Kelurahan Save & Upload
  const handleSaveBagan = async (e) => {
    if (e) e.preventDefault();
    setSavingBagan(true);
    try {
      const res = await fetch('/api/pengaturan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kunci: 'bagan_struktur_url', nilai: tempBaganUrl }),
      });
      if (!res.ok) throw new Error();
      setBaganUrl(tempBaganUrl);
      showToast('success', 'Gambar bagan struktur berhasil diperbarui');
    } catch {
      showToast('error', 'Gagal menyimpan bagan struktur');
    }
    setSavingBagan(false);
  };

  const handleBaganUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      showToast('error', 'Ukuran file terlalu besar. Maksimal 4MB.');
      return;
    }

    setUploadingBagan(true);
    try {
      showToast('info', 'Mengunggah gambar bagan struktur...');
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setTempBaganUrl(data.url);
      showToast('success', 'Gambar berhasil diunggah! Klik Simpan Perubahan untuk mengaktifkan.');
    } catch {
      showToast('error', 'Gagal mengunggah file gambar');
    }
    setUploadingBagan(false);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-6 h-6 text-sage-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-50 pt-20 pb-20">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-[80] toast">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {toast.message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-sage-900">
              Dashboard Admin
            </h1>
            <p className="text-sage-500 text-sm mt-1">
              Selamat datang, {user.nama}
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sage-500 hover:text-red-600 text-sm font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-sage-100/50 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Megaphone className="w-4 h-4 text-sage-400" />
              <span className="text-sage-500 text-xs font-medium">Pengumuman</span>
            </div>
            <p className="text-2xl font-bold text-sage-900">{pengumumanList.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-sage-100/50 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="w-4 h-4 text-sage-400" />
              <span className="text-sage-500 text-xs font-medium">Foto Galeri</span>
            </div>
            <p className="text-2xl font-bold text-sage-900">{galeriList.length}</p>
          </div>
          <div
            onClick={() => setTab('kepala-lingkungan')}
            className="bg-white rounded-xl p-4 border border-sage-100/50 shadow-sm cursor-pointer hover:border-sage-300 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-sage-400" />
              <span className="text-sage-500 text-xs font-medium">Kepala Lingkungan</span>
            </div>
            <p className="text-2xl font-bold text-sage-900">13 <span className="text-xs font-normal text-sage-500">Lingkungan</span></p>
          </div>
          <div
            onClick={() => setTab('bagan-struktur')}
            className="bg-white rounded-xl p-4 border border-sage-100/50 shadow-sm cursor-pointer hover:border-sage-300 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-sage-400" />
              <span className="text-sage-500 text-xs font-medium">Bagan Struktur</span>
            </div>
            <p className="text-lg font-bold text-sage-900 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              Gambar Bagan
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-xl p-1.5 border border-sage-100/50 w-fit shadow-sm">
          <button
            onClick={() => setTab('pengumuman')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === 'pengumuman'
                ? 'bg-sage-500 text-white'
                : 'text-sage-600 hover:bg-sage-50'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            Pengumuman
          </button>
          <button
            onClick={() => setTab('galeri')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === 'galeri'
                ? 'bg-sage-500 text-white'
                : 'text-sage-600 hover:bg-sage-50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Galeri
          </button>

          <button
            onClick={() => setTab('kepala-lingkungan')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === 'kepala-lingkungan'
                ? 'bg-sage-500 text-white'
                : 'text-sage-600 hover:bg-sage-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Kepala & Wakil Lingkungan
          </button>

          <button
            onClick={() => setTab('bagan-struktur')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === 'bagan-struktur'
                ? 'bg-sage-500 text-white'
                : 'text-sage-600 hover:bg-sage-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            Bagan Struktur Kelurahan
          </button>
        </div>

        {/* ─── PENGUMUMAN TAB ─── */}
        {tab === 'pengumuman' && (
          <div className="animate-in">
            {/* Add Button */}
            {!showForm && (
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="btn-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold mb-6 cursor-pointer shadow-sm hover:shadow-md"
              >
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Buat Pengumuman Baru
                </span>
              </button>
            )}

            {/* Form */}
            {showForm && (
              <div className="bg-white rounded-xl p-6 border border-sage-100/50 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sage-900">
                    {editingId ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-sage-400 hover:text-sage-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSaveP} className="space-y-4">
                  <div>
                    <label className="block text-sage-700 text-sm font-medium mb-1.5">
                      Judul *
                    </label>
                    <input
                      type="text"
                      value={formP.judul}
                      onChange={(e) =>
                        setFormP({ ...formP, judul: e.target.value })
                      }
                      className="form-input"
                      placeholder="Judul pengumuman"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sage-700 text-sm font-medium mb-1.5">
                      Isi Pengumuman *
                    </label>
                    <textarea
                      value={formP.isi}
                      onChange={(e) =>
                        setFormP({ ...formP, isi: e.target.value })
                      }
                      className="form-textarea"
                      rows={5}
                      placeholder="Tulis isi pengumuman..."
                      required
                    />
                  </div>

                  {/* Upload Gambar */}
                  <div>
                    <label className="block text-sage-700 text-sm font-medium mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-sage-400" />
                        Upload Gambar (opsional, maks 4MB)
                      </span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setFormP, 'gambar_url')}
                      className="block w-full text-sm text-sage-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-xl file:border-0
                        file:text-sm file:font-semibold
                        file:bg-sage-100 file:text-sage-700
                        hover:file:bg-sage-200 cursor-pointer border border-sage-200 rounded-xl"
                    />
                    {formP.gambar_url && (
                      <div className="mt-2 w-40 h-24 rounded-lg overflow-hidden border border-sage-200 bg-sage-50 relative group">
                        <img src={formP.gambar_url} alt="preview" className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display='none'; }} />
                        <button
                          type="button"
                          onClick={() => setFormP({ ...formP, gambar_url: '' })}
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Upload File Lampiran */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sage-700 text-sm font-medium mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5 text-sage-400" />
                          Upload Dokumen Lampiran (opsional, maks 4MB)
                        </span>
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                        onChange={(e) => handleFileUpload(e, setFormP, 'file_url', 'file_nama')}
                        className="block w-full text-sm text-sage-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-xl file:border-0
                          file:text-sm file:font-semibold
                          file:bg-sage-100 file:text-sage-700
                          hover:file:bg-sage-200 cursor-pointer border border-sage-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sage-700 text-sm font-medium mb-1.5">
                        Nama File (Otomatis dari upload)
                      </label>
                      <input
                        type="text"
                        value={formP.file_nama}
                        onChange={(e) =>
                          setFormP({ ...formP, file_nama: e.target.value })
                        }
                        className="form-input"
                        placeholder="Bisa diubah manual..."
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formP.is_pinned}
                        onChange={(e) =>
                          setFormP({ ...formP, is_pinned: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-sage-300 text-sage-500 focus:ring-sage-400"
                      />
                      <span className="text-sage-700 text-sm">
                        Sematkan di atas
                      </span>
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={savingP}
                      className="btn-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        {savingP ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        {editingId ? 'Perbarui' : 'Simpan'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2.5 rounded-xl text-sm font-medium text-sage-600 border border-sage-200 hover:bg-sage-50 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List */}
            {loadingP ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-5 h-5 text-sage-400 animate-spin" />
              </div>
            ) : pengumumanList.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-sage-100/50 shadow-sm">
                <Megaphone className="w-10 h-10 text-sage-300 mx-auto mb-3" />
                <p className="text-sage-500 text-sm">Belum ada pengumuman</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pengumumanList.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl p-4 border shadow-sm transition-shadow hover:shadow-md flex items-start justify-between gap-4 ${
                      item.is_pinned
                        ? 'border-sage-300 ring-1 ring-sage-200'
                        : 'border-sage-100/50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {item.is_pinned && (
                          <Pin className="w-3 h-3 text-sage-500" />
                        )}
                        {item.gambar_url && <ImageIcon className="w-3 h-3 text-sage-400" />}
                        {item.file_url && <Paperclip className="w-3 h-3 text-sage-400" />}
                      </div>
                      <h4 className="font-semibold text-sage-900 text-sm">
                        {item.judul}
                      </h4>
                      <p className="text-sage-500 text-xs mt-1 line-clamp-2">
                        {item.isi}
                      </p>
                      <p className="text-sage-400 text-xs mt-2 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleEditP(item)}
                        className="p-2 text-sage-400 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteP(item.id)}
                        className="p-2 text-sage-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── GALERI TAB ─── */}
        {tab === 'galeri' && (
          <div className="animate-in">
            {/* Add Button */}
            {!showFormG && (
              <button
                onClick={() => {
                  resetFormG();
                  setShowFormG(true);
                }}
                className="btn-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold mb-6 cursor-pointer shadow-sm hover:shadow-md"
              >
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Tambah Foto ke Galeri
                </span>
              </button>
            )}

            {/* Form */}
            {showFormG && (
              <div className="bg-white rounded-xl p-6 border border-sage-100/50 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sage-900">
                    {editingIdG ? 'Edit Foto' : 'Tambah Foto Baru'}
                  </h3>
                  <button
                    onClick={resetFormG}
                    className="text-sage-400 hover:text-sage-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSaveG} className="space-y-4">
                  <div>
                    <label className="block text-sage-700 text-sm font-medium mb-1.5">
                      Upload Gambar Galeri * (Maks 4MB)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setFormG, 'gambar_url')}
                      className="block w-full text-sm text-sage-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-xl file:border-0
                        file:text-sm file:font-semibold
                        file:bg-sage-100 file:text-sage-700
                        hover:file:bg-sage-200 cursor-pointer border border-sage-200 rounded-xl"
                      required={!formG.gambar_url}
                    />
                    {formG.gambar_url && (
                      <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-sage-200 bg-sage-50 relative group">
                        <img 
                          src={formG.gambar_url} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <button
                          type="button"
                          onClick={() => setFormG({ ...formG, gambar_url: '' })}
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sage-700 text-sm font-medium mb-1.5">
                      Judul Foto *
                    </label>
                    <input
                      type="text"
                      value={formG.judul}
                      onChange={(e) =>
                        setFormG({ ...formG, judul: e.target.value })
                      }
                      className="form-input"
                      placeholder="Contoh: Kerja Bakti Desa"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sage-700 text-sm font-medium mb-1.5">
                      Deskripsi Singkat (Opsional)
                    </label>
                    <textarea
                      value={formG.deskripsi}
                      onChange={(e) =>
                        setFormG({ ...formG, deskripsi: e.target.value })
                      }
                      className="form-textarea min-h-[80px]"
                      rows={3}
                      placeholder="Deskripsi kegiatan di foto..."
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={savingG}
                      className="btn-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        {savingG ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        {editingIdG ? 'Perbarui' : 'Simpan'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={resetFormG}
                      className="px-6 py-2.5 rounded-xl text-sm font-medium text-sage-600 border border-sage-200 hover:bg-sage-50 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List */}
            {loadingG ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-5 h-5 text-sage-400 animate-spin" />
              </div>
            ) : galeriList.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-sage-100/50 shadow-sm">
                <ImageIcon className="w-10 h-10 text-sage-300 mx-auto mb-3" />
                <p className="text-sage-500 text-sm">Belum ada foto di galeri</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {galeriList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl overflow-hidden border border-sage-100/50 shadow-sm transition-shadow hover:shadow-md flex flex-col"
                  >
                    <div className="relative w-full aspect-video bg-sage-100 border-b border-sage-100/50">
                      <img 
                        src={item.gambar_url} 
                        alt={item.judul}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/400x300/e8e6d8/8e9e70?text=Error';
                        }}
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h4 className="font-semibold text-sage-900 text-sm mb-1 line-clamp-1">
                        {item.judul}
                      </h4>
                      {item.deskripsi && (
                        <p className="text-sage-500 text-xs mb-3 line-clamp-2 flex-1">
                          {item.deskripsi}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-sage-100/50">
                        <span className="text-sage-400 text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.created_at)}
                        </span>
                        <div className="flex items-center shrink-0">
                          <button
                            onClick={() => handleEditG(item)}
                            className="p-1.5 text-sage-400 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteG(item.id)}
                            className="p-1.5 text-sage-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}



        {/* ─── KEPALA LINGKUNGAN TAB ─── */}
        {tab === 'kepala-lingkungan' && (
          <div className="animate-in bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden">
            <div className="p-6 border-b border-sage-100 flex items-center justify-between bg-sage-50/50">
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-sage-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-sage-500" />
                  Kepala & Wakil Kepala Lingkungan (1-13)
                </h2>
                <p className="text-xs text-sage-500 mt-1">
                  Kelola nama Kepala Lingkungan dan Wakil Kepala Lingkungan untuk masing-masing wilayah 1 sampai 13.
                </p>
              </div>
            </div>
            
            {loadingKL ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 text-sage-400 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-sage-50/80 text-sage-600 text-xs uppercase tracking-wider border-b border-sage-100">
                      <th className="px-6 py-4 font-semibold w-20">No.</th>
                      <th className="px-6 py-4 font-semibold">Lingkungan</th>
                      <th className="px-6 py-4 font-semibold">Kepala Lingkungan</th>
                      <th className="px-6 py-4 font-semibold">Wakil Kepala Lingkungan</th>
                      <th className="px-6 py-4 font-semibold">Keterangan</th>
                      <th className="px-6 py-4 font-semibold w-28 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-100/50">
                    {klList.map((item) => (
                      <tr key={item.id} className="hover:bg-sage-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-sage-100 text-sage-700 font-bold text-sm">
                            {item.nomor_lingkungan}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-sage-900">Lingkungan {item.nomor_lingkungan}</p>
                        </td>
                        <td className="px-6 py-4">
                          {item.nama ? (
                            <p className="text-sm font-medium text-sage-800">{item.nama}</p>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded text-xs bg-sage-100 text-sage-500 italic">
                              Belum diisi
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {item.wakil ? (
                            <p className="text-sm font-medium text-sage-800">{item.wakil}</p>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded text-xs bg-sage-100 text-sage-500 italic">
                              Belum diisi
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-sage-500">
                          {item.keterangan || '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleEditKL(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sage-700 bg-sage-100 hover:bg-sage-200 hover:text-sage-900 rounded-lg transition-colors cursor-pointer"
                            title="Edit Kepala & Wakil Lingkungan"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── BAGAN STRUKTUR TAB ─── */}
        {tab === 'bagan-struktur' && (
          <div className="animate-in bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden">
            <div className="p-6 border-b border-sage-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-sage-50/50">
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-sage-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-sage-500" />
                  Bagan Struktur Organisasi Kelurahan
                </h2>
                <p className="text-xs text-sage-500 mt-1">
                  Struktur perangkat kelurahan ditampilkan sebagai gambar bagan resmi (statis). Anda dapat melihat dan mengganti gambar bagan di bawah ini.
                </p>
              </div>
              <a
                href="/struktur"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-sage-700 bg-white hover:bg-sage-100 border border-sage-200 rounded-xl transition-colors cursor-pointer w-fit shadow-sm"
              >
                <span>Lihat di Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Preview Gambar */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-sage-500">
                    Preview Bagan Saat Ini
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-medium">
                    Aktif di Website
                  </span>
                </div>
                <div className="bg-sage-50 rounded-2xl border border-sage-200/80 p-4 flex items-center justify-center min-h-[320px] max-h-[500px] overflow-hidden">
                  <img
                    src={tempBaganUrl || '/struktur-kelurahan.png'}
                    alt="Preview Bagan Struktur"
                    className="max-h-[460px] w-full object-contain rounded-xl shadow-sm"
                    onError={(e) => {
                      e.target.src = '/struktur-kelurahan.png';
                    }}
                  />
                </div>
                <p className="text-[11px] text-sage-400 mt-2 text-center">
                  * Bagan ini otomatis tampil di halaman publik Struktur Organisasi (/struktur)
                </p>
              </div>

              {/* Form Upload & Ganti Gambar */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="bg-sage-50/70 p-4 rounded-xl border border-sage-100">
                    <h4 className="text-sm font-semibold text-sage-900 mb-1 flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-sage-600" />
                      Unggah File Gambar Baru
                    </h4>
                    <p className="text-xs text-sage-500 mb-3">
                      Pilih file bagan baru dari komputer/HP (PNG, JPG, WEBP). Maksimal 4MB.
                    </p>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-sage-300 hover:border-sage-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-white">
                      <UploadCloud className="w-8 h-8 text-sage-400 mb-2" />
                      <span className="text-xs font-medium text-sage-700">
                        {uploadingBagan ? 'Sedang mengunggah...' : 'Klik untuk memilih file gambar bagan'}
                      </span>
                      <span className="text-[10px] text-sage-400 mt-1">
                        Format disarankan: gambar lanskap (16:9 atau 4:3)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBaganUpload}
                        disabled={uploadingBagan}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-sage-700 text-xs font-medium mb-1.5">
                      Atau Masukkan URL Gambar (Opsional)
                    </label>
                    <input
                      type="text"
                      value={tempBaganUrl}
                      onChange={(e) => setTempBaganUrl(e.target.value)}
                      className="form-input text-xs"
                      placeholder="https://... atau /struktur-kelurahan.png"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTempBaganUrl('/struktur-kelurahan.png')}
                      className="inline-flex items-center gap-1.5 text-xs text-sage-600 hover:text-sage-900 px-3 py-1.5 rounded-lg border border-sage-200 hover:bg-sage-100/60 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Reset ke Gambar Default
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-sage-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setTempBaganUrl(baganUrl)}
                    className="btn-secondary px-4 py-2 text-xs cursor-pointer"
                    disabled={savingBagan}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveBagan}
                    disabled={savingBagan || uploadingBagan}
                    className="btn-primary px-5 py-2 text-xs flex items-center justify-center gap-1.5 cursor-pointer min-w-[120px]"
                  >
                    {savingBagan ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <span>Simpan Perubahan</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL EDIT KEPALA LINGKUNGAN */}
      {showFormKL && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowFormKL(false)}
              className="absolute top-4 right-4 text-sage-400 hover:text-sage-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-sage-900 mb-1">
              Edit Kepala & Wakil Lingkungan {formKL.nomor_lingkungan}
            </h3>
            <p className="text-sage-500 text-sm mb-6">Lingkungan {formKL.nomor_lingkungan}</p>
            
            <form onSubmit={handleSaveKL} className="space-y-4">
              <div>
                <label className="block text-sage-700 text-sm font-medium mb-1.5">
                  Nama Kepala Lingkungan
                </label>
                <input
                  type="text"
                  value={formKL.nama}
                  onChange={(e) => setFormKL({ ...formKL, nama: e.target.value })}
                  className="form-input"
                  placeholder="Masukkan nama kepala lingkungan"
                />
              </div>
              <div>
                <label className="block text-sage-700 text-sm font-medium mb-1.5">
                  Nama Wakil Kepala Lingkungan
                </label>
                <input
                  type="text"
                  value={formKL.wakil}
                  onChange={(e) => setFormKL({ ...formKL, wakil: e.target.value })}
                  className="form-input"
                  placeholder="Masukkan nama wakil kepala lingkungan"
                />
              </div>
              <div>
                <label className="block text-sage-700 text-sm font-medium mb-1.5">
                  Keterangan (Opsional)
                </label>
                <input
                  type="text"
                  value={formKL.keterangan}
                  onChange={(e) => setFormKL({ ...formKL, keterangan: e.target.value })}
                  className="form-input"
                  placeholder="Contoh: RT/RW, alamat, dll"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFormKL(false)}
                  className="btn-secondary px-5 py-2.5 text-sm cursor-pointer"
                  disabled={savingKL}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2.5 text-sm flex items-center justify-center cursor-pointer min-w-[100px]"
                  disabled={savingKL}
                >
                  {savingKL ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    'Simpan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
