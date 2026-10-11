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
  Users,
  MapPin,
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

  // Aparatur state
  const [aparaturList, setAparaturList] = useState([]);
  const [loadingA, setLoadingA] = useState(true);
  const [showFormA, setShowFormA] = useState(false);
  const [formA, setFormA] = useState({ id: null, jabatan: '', nama: '', nip: '' });
  const [savingA, setSavingA] = useState(false);

  // Kepala Lingkungan state
  const [klList, setKlList] = useState([]);
  const [loadingKL, setLoadingKL] = useState(true);
  const [showFormKL, setShowFormKL] = useState(false);
  const [formKL, setFormKL] = useState({ id: null, nomor_lingkungan: '', nama: '', keterangan: '' });
  const [savingKL, setSavingKL] = useState(false);

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

  const fetchAparatur = useCallback(async () => {
    setLoadingA(true);
    try {
      const res = await fetch('/api/aparatur');
      const data = await res.json();
      setAparaturList(Array.isArray(data) ? data : []);
    } catch {
      setAparaturList([]);
    }
    setLoadingA(false);
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

  useEffect(() => {
    if (user) {
      fetchPengumuman();
      fetchGaleri();
      fetchAparatur();
      fetchKL();
    }
  }, [user, fetchPengumuman, fetchGaleri, fetchAparatur, fetchKL]);

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

  // Aparatur CRUD (Update Only)
  const handleEditA = (item) => {
    setFormA({ id: item.id, jabatan: item.jabatan, nama: item.nama, nip: item.nip || '' });
    setShowFormA(true);
  };

  const handleSaveA = async (e) => {
    e.preventDefault();
    setSavingA(true);
    try {
      const res = await fetch(`/api/aparatur/${formA.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: formA.nama, nip: formA.nip }),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'Data aparatur diperbarui');
      setShowFormA(false);
      fetchAparatur();
    } catch {
      showToast('error', 'Gagal menyimpan data aparatur');
    }
    setSavingA(false);
  };

  // Kepala Lingkungan CRUD (Update Only)
  const handleEditKL = (item) => {
    setFormKL({ id: item.id, nomor_lingkungan: item.nomor_lingkungan, nama: item.nama || '', keterangan: item.keterangan || '' });
    setShowFormKL(true);
  };

  const handleSaveKL = async (e) => {
    e.preventDefault();
    setSavingKL(true);
    try {
      const res = await fetch(`/api/kepala-lingkungan/${formKL.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: formKL.nama, keterangan: formKL.keterangan }),
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
            onClick={() => setTab('aparatur')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === 'aparatur'
                ? 'bg-sage-500 text-white'
                : 'text-sage-600 hover:bg-sage-50'
            }`}
          >
            <Users className="w-4 h-4" />
            Struktur Desa
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
            Kepala Lingkungan
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



        {/* ─── APARATUR TAB ─── */}
        {tab === 'aparatur' && (
          <div className="animate-in bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden">
            <div className="p-6 border-b border-sage-100 flex items-center justify-between bg-sage-50/50">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-sage-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-sage-500" />
                Struktur Perangkat Desa
              </h2>
            </div>
            
            {loadingA ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 text-sage-400 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-sage-50/80 text-sage-600 text-xs uppercase tracking-wider border-b border-sage-100">
                      <th className="px-6 py-4 font-semibold">Jabatan</th>
                      <th className="px-6 py-4 font-semibold">Nama Pejabat</th>
                      <th className="px-6 py-4 font-semibold">NIP / Keterangan</th>
                      <th className="px-6 py-4 font-semibold w-24 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-100/50">
                    {aparaturList.map((item) => (
                      <tr key={item.id} className="hover:bg-sage-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-sage-900">{item.jabatan}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-sage-600">{item.nama}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-sage-500">
                          {item.nip || '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleEditA(item)}
                            className="p-2 text-sage-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
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

        {/* ─── KEPALA LINGKUNGAN TAB ─── */}
        {tab === 'kepala-lingkungan' && (
          <div className="animate-in bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden">
            <div className="p-6 border-b border-sage-100 flex items-center justify-between bg-sage-50/50">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-sage-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sage-500" />
                Kepala Lingkungan (1-13)
              </h2>
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
                      <th className="px-6 py-4 font-semibold">Nama Kepala Lingkungan</th>
                      <th className="px-6 py-4 font-semibold">Keterangan</th>
                      <th className="px-6 py-4 font-semibold w-24 text-center">Aksi</th>
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
                            <p className="text-sm text-sage-600">{item.nama}</p>
                          ) : (
                            <p className="text-sm text-sage-400 italic">Belum diisi</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-sage-500">
                          {item.keterangan || '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleEditKL(item)}
                            className="p-2 text-sage-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
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
      </div>

      {/* MODAL EDIT APARATUR */}
      {showFormA && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowFormA(false)}
              className="absolute top-4 right-4 text-sage-400 hover:text-sage-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-sage-900 mb-6">
              Edit {formA.jabatan}
            </h3>
            
            <form onSubmit={handleSaveA} className="space-y-4">
              <div>
                <label className="block text-sage-700 text-sm font-medium mb-1.5">
                  Nama Pejabat *
                </label>
                <input
                  type="text"
                  value={formA.nama}
                  onChange={(e) => setFormA({ ...formA, nama: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sage-700 text-sm font-medium mb-1.5">
                  NIP (Opsional)
                </label>
                <input
                  type="text"
                  value={formA.nip}
                  onChange={(e) => setFormA({ ...formA, nip: e.target.value })}
                  className="form-input"
                  placeholder="Contoh: 19801231 200501 1 001"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFormA(false)}
                  className="btn-secondary px-5 py-2.5 text-sm cursor-pointer"
                  disabled={savingA}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2.5 text-sm flex items-center justify-center cursor-pointer min-w-[100px]"
                  disabled={savingA}
                >
                  {savingA ? (
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
              Edit Kepala Lingkungan {formKL.nomor_lingkungan}
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
