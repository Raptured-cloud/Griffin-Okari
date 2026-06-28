import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, X, Save, Search, Package,
  AlertCircle, CheckCircle, Loader2, Database, ShieldCheck
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  in_stock: boolean;
  stock_count: number;
  requires_prescription: boolean;
  image_url: string;
  created_at?: string;
}

const CATEGORIES = ['Prescription', 'OTC', 'Wellness', 'Medical Equipment'];

const emptyForm = (): Omit<Product, 'id' | 'created_at'> => ({
  name: '',
  category: 'OTC',
  price: 0,
  description: '',
  in_stock: true,
  stock_count: 0,
  requires_prescription: false,
  image_url: '',
});

type Toast = { id: number; type: 'success' | 'error'; message: string };

export default function Admin() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm]           = useState(emptyForm());
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState<number | null>(null);
  const [toasts, setToasts]       = useState<Toast[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

  const addToast = (type: Toast['type'], message: string) => {
    const id = Date.now();
    setToasts(t => [...t, { id, type, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  };

  // ── Fetch products from PHP API ──────────────────────────────
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search)    params.set('search', search);
      if (filterCat) params.set('category', filterCat);
      const res  = await fetch(`/api/products.php?${params}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      addToast('error', 'Failed to load products from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [search, filterCat]);

  // ── Open modal for create or edit ───────────────────────────
  const openCreate = () => {
    setEditProduct(null);
    setForm(emptyForm());
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      description: p.description,
      in_stock: p.in_stock,
      stock_count: p.stock_count,
      requires_prescription: p.requires_prescription,
      image_url: p.image_url,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditProduct(null);
    setForm(emptyForm());
  };

  // ── Save (create or update) ──────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const isEdit = editProduct !== null;
      const url    = isEdit ? `/api/products.php?id=${editProduct!.id}` : '/api/products.php';
      const res    = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      addToast('success', isEdit ? 'Product updated successfully.' : 'Product added to database.');
      closeModal();
      fetchProducts();
    } catch {
      addToast('error', 'Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────
  const handleDelete = async (p: Product) => {
    setDeleting(p.id);
    setConfirmDelete(null);
    try {
      const res = await fetch(`/api/products.php?id=${p.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      addToast('success', `"${p.name}" removed from database.`);
      fetchProducts();
    } catch {
      addToast('error', 'Failed to delete product.');
    } finally {
      setDeleting(null);
    }
  };

  const categoryColor: Record<string, string> = {
    Prescription:     'bg-blue-100 text-blue-800',
    OTC:              'bg-green-100 text-green-800',
    Wellness:         'bg-purple-100 text-purple-800',
    'Medical Equipment': 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast notifications */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
                t.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {t.type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Page header */}
      <div className="bg-white border-b px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Product Database</h1>
            </div>
            <p className="text-muted-foreground text-sm">Manage medical products — backed by PHP + SQLite database</p>
          </div>
          <Button onClick={openCreate} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: products.length },
          { label: 'In Stock', value: products.filter(p => p.in_stock).length },
          { label: 'Prescription', value: products.filter(p => p.requires_prescription).length },
          { label: 'Categories', value: new Set(products.map(p => p.category)).size },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border px-4 py-3">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold text-primary">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 pb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Products table */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
              <Package className="h-12 w-12 opacity-30" />
              <p className="text-sm">No products found. Add one to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-10">ID</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Product Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Category</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Price</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Stock</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Rx</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {products.map((p, i) => (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b last:border-0 hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-4 py-3 text-muted-foreground font-mono">#{p.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image_url || `https://picsum.photos/seed/${p.id}/40/40`}
                              alt={p.name}
                              className="h-9 w-9 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                            <div>
                              <p className="font-medium text-foreground leading-tight">{p.name}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[180px]">{p.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryColor[p.category] ?? 'bg-gray-100 text-gray-700'}`}>
                            {p.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-foreground">${p.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.stock_count} units</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${p.in_stock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${p.in_stock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {p.in_stock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {p.requires_prescription && (
                            <span title="Requires Prescription">
                              <ShieldCheck className="h-4 w-4 text-blue-500" />
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEdit(p)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              title="Edit product"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setConfirmDelete(p)}
                              disabled={deleting === p.id}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              title="Delete product"
                            >
                              {deleting === p.id
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : <Trash2 className="h-3.5 w-3.5" />
                              }
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Records stored in SQLite database via PHP REST API &nbsp;·&nbsp; {products.length} record{products.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {/* ── Create / Edit modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-lg font-bold">
                  {editProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <Button variant="ghost" size="icon" onClick={closeModal} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSave} className="px-6 py-5 flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label className="text-sm font-medium block mb-1">Product Name <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Amoxicillin 500mg"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium block mb-1">Category <span className="text-red-500">*</span></label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Price + Stock count */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium block mb-1">Price ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Stock Count</label>
                    <input
                      type="number"
                      min="0"
                      value={form.stock_count}
                      onChange={e => setForm(f => ({ ...f, stock_count: parseInt(e.target.value) || 0 }))}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Brief description of the product..."
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="text-sm font-medium block mb-1">Image URL</label>
                  <input
                    type="text"
                    value={form.image_url}
                    onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.in_stock}
                      onChange={e => setForm(f => ({ ...f, in_stock: e.target.checked }))}
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="text-sm">In Stock</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.requires_prescription}
                      onChange={e => setForm(f => ({ ...f, requires_prescription: e.target.checked }))}
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="text-sm">Requires Prescription</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 gap-2" disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Saving...' : editProduct ? 'Save Changes' : 'Add Product'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete confirmation modal ── */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            >
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <h2 className="text-lg font-bold mb-1">Delete Product</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Are you sure you want to delete <strong>"{confirmDelete.name}"</strong> from the database? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleDelete(confirmDelete)}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
