import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDoctors } from '../context/DoctorsContext';

// ─── Helper: unique specialties list ──────────────────────────────────────────
const getSpecialties = (docs) => [...new Set(docs.map((d) => d.specialty))];

// ─── Empty form template ───────────────────────────────────────────────────────
const EMPTY_FORM = {
    name: '',
    specialty: '',
    qualification: '',
    experience: '',
    fee: '',
    availableHours: '10:00 AM - 5:00 PM',
    rating: '5.0',
    // image stored as base64 data URL after file selection
    image: '',
};

/**
 * AdminDashboard — Full hospital admin portal.
 * Features: stats bar, doctor table with search/filter,
 * slide-in add/edit panel, modal delete confirmation.
 */
const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const { doctors, addDoctor, updateDoctor, deleteDoctor } = useDoctors();

    // ── UI State only (doctors list lives in context) ──────────────────────────
    const [search, setSearch] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('All');
    const [panelOpen, setPanelOpen] = useState(false);    // add/edit side panel
    const [editingDoc, setEditingDoc] = useState(null);   // null = adding new
    const [form, setForm] = useState(EMPTY_FORM);
    const [imagePreview, setImagePreview] = useState(''); // preview URL (base64 or existing)
    const fileInputRef = useRef(null);
    const [deleteTarget, setDeleteTarget] = useState(null); // doc to delete
    const [activeTab, setActiveTab] = useState('doctors'); // doctors | stats

    // ── Derived values ─────────────────────────────────────────────────────────
    const specialties = useMemo(() => getSpecialties(doctors), [doctors]);

    const filtered = useMemo(() => {
        return doctors.filter((d) => {
            const matchSearch =
                d.name.toLowerCase().includes(search.toLowerCase()) ||
                d.specialty.toLowerCase().includes(search.toLowerCase());
            const matchSpec = filterSpecialty === 'All' || d.specialty === filterSpecialty;
            return matchSearch && matchSpec;
        });
    }, [doctors, search, filterSpecialty]);

    const stats = useMemo(() => ({
        total: doctors.length,
        specialties: specialties.length,
        avgRating: doctors.length
            ? (doctors.reduce((s, d) => s + parseFloat(d.rating || 0), 0) / doctors.length).toFixed(1)
            : '0.0',
        avgFee: doctors.length
            ? Math.round(doctors.reduce((s, d) => s + parseInt(d.fee || 0), 0) / doctors.length)
            : 0,
    }), [doctors, specialties]);

    // ── Handlers ───────────────────────────────────────────────────────────────
    const openAddPanel = () => {
        setEditingDoc(null);
        setForm(EMPTY_FORM);
        setImagePreview('');
        setPanelOpen(true);
    };

    const openEditPanel = (doc) => {
        setEditingDoc(doc);
        setForm({
            name: doc.name || '',
            specialty: doc.specialty || '',
            qualification: doc.qualification || '',
            experience: doc.experience || '',
            fee: doc.fee || '',
            availableHours: doc.availableHours || '10:00 AM - 5:00 PM',
            rating: doc.rating || '5.0',
            image: doc.image || '',
        });
        setImagePreview(doc.image || '');
        setPanelOpen(true);
    };

    const closePanel = () => {
        setPanelOpen(false);
        setEditingDoc(null);
        setForm(EMPTY_FORM);
        setImagePreview('');
    };

    // Reads the chosen file as a base64 data URL
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const dataUrl = ev.target.result;
            setImagePreview(dataUrl);
            setForm((f) => ({ ...f, image: dataUrl }));
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview('');
        setForm((f) => ({ ...f, image: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const clampedRating = Math.min(5, parseFloat(form.rating) || 5.0);
        if (editingDoc) {
            updateDoctor(editingDoc.id, { ...form, rating: clampedRating });
        } else {
            addDoctor({ ...form, rating: clampedRating });
        }
        closePanel();
    };

    const confirmDelete = (doc) => setDeleteTarget(doc);

    const handleDelete = () => {
        deleteDoctor(deleteTarget.id);
        setDeleteTarget(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // ── Field helper ───────────────────────────────────────────────────────────
    const field = (label, key, type = 'text', placeholder = '', extra = {}) => (
        <div style={s.formField}>
            <label style={s.formLabel}>{label}</label>
            <input
                type={type}
                required={['name', 'specialty'].includes(key)}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                style={s.formInput}
                {...extra}
            />
        </div>
    );

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div style={s.page}>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .admin-row:hover { background: #f0fdf4 !important; }
                .admin-row:hover .edit-btn { opacity: 1 !important; }
                input:focus { border-color: #14b8a6 !important; outline: none; box-shadow: 0 0 0 3px rgba(20,184,166,0.12); }
                .preview-wrap:hover .preview-overlay { opacity: 1 !important; }
                .upload-area:hover { border-color: #14b8a6 !important; background: #f0fdf4 !important; }
            `}</style>

            {/* ── Sidebar ──────────────────────────────────────────────────── */}
            <aside style={s.sidebar}>
                <div style={s.sidebarLogo}>
                    <div style={s.logoIcon}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </div>
                    <span style={s.logoText}>VitalNode</span>
                </div>
                <div style={s.sidebarDivider} />
                <nav style={s.sidebarNav}>
                    {[
                        { id: 'doctors', icon: '👨‍⚕️', label: 'Doctors' },
                        { id: 'stats', icon: '📊', label: 'Overview' },
                    ].map(({ id, icon, label }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            style={{
                                ...s.navBtn,
                                ...(activeTab === id ? s.navBtnActive : {}),
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>{icon}</span>
                            {label}
                        </button>
                    ))}
                </nav>
                <div style={{ marginTop: 'auto' }}>
                    <div style={s.adminCard}>
                        <div style={s.adminAvatar}>A</div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b' }}>{user?.name || 'Admin'}</div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>Hospital Admin</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={s.logoutBtn}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* ── Main Content ─────────────────────────────────────────────── */}
            <main style={s.main}>

                {/* ─ Stats Tab ─ */}
                {activeTab === 'stats' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <h1 style={s.pageTitle}>Hospital Overview</h1>
                        <div style={s.statsGrid}>
                            {[
                                { label: 'Total Doctors', value: stats.total, color: '#14b8a6', icon: '👨‍⚕️' },
                                { label: 'Specialties', value: stats.specialties, color: '#6366f1', icon: '🏥' },
                                { label: 'Avg. Rating', value: `⭐ ${stats.avgRating}`, color: '#f59e0b', icon: '⭐' },
                                { label: 'Avg. Fee (₹)', value: `₹${stats.avgFee}`, color: '#ec4899', icon: '💳' },
                            ].map(({ label, value, color, icon }) => (
                                <div key={label} style={{ ...s.statCard, borderTop: `4px solid ${color}` }}>
                                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
                                    <div style={{ fontSize: '32px', fontWeight: 800, color }}>{value}</div>
                                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>{label}</div>
                                </div>
                            ))}
                        </div>

                        <h2 style={{ ...s.pageTitle, fontSize: '18px', marginTop: '32px' }}>Doctors by Specialty</h2>
                        <div style={s.specialtyTable}>
                            {specialties.map((spec) => {
                                const count = doctors.filter((d) => d.specialty === spec).length;
                                const pct = Math.round((count / doctors.length) * 100);
                                return (
                                    <div key={spec} style={s.specRow}>
                                        <span style={s.specName}>{spec}</span>
                                        <div style={s.specBarWrap}>
                                            <div style={{ ...s.specBar, width: `${pct}%` }} />
                                        </div>
                                        <span style={s.specCount}>{count} doctor{count !== 1 ? 's' : ''}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ─ Doctors Tab ─ */}
                {activeTab === 'doctors' && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        {/* Header row */}
                        <div style={s.headerRow}>
                            <div>
                                <h1 style={s.pageTitle}>Manage Doctors</h1>
                                <p style={s.pageSubtitle}>{doctors.length} doctors registered</p>
                            </div>
                            <button id="add-doctor-btn" onClick={openAddPanel} style={s.addBtn}>
                                + Add Doctor
                            </button>
                        </div>

                        {/* Search + Filter */}
                        <div style={s.toolbar}>
                            <div style={s.searchWrap}>
                                <svg style={s.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name or specialty…"
                                    style={s.searchInput}
                                />
                            </div>
                            <select
                                value={filterSpecialty}
                                onChange={(e) => setFilterSpecialty(e.target.value)}
                                style={s.filterSelect}
                            >
                                <option value="All">All Specialties</option>
                                {specialties.map((sp) => (
                                    <option key={sp} value={sp}>{sp}</option>
                                ))}
                            </select>
                        </div>

                        {/* Table */}
                        <div style={s.tableWrap}>
                            <table style={s.table}>
                                <thead>
                                    <tr style={s.thead}>
                                        <th style={s.th}>#</th>
                                        <th style={s.th}>Doctor</th>
                                        <th style={s.th}>Specialty</th>
                                        <th style={s.th}>Experience</th>
                                        <th style={s.th}>Fee</th>
                                        <th style={s.th}>Available Hours</th>
                                        <th style={s.th}>Rating</th>
                                        <th style={s.th}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((doc, idx) => (
                                        <tr key={doc.id} className="admin-row" style={s.tr}>
                                            <td style={s.td}>{idx + 1}</td>
                                            <td style={s.td}>
                                                <div style={s.docName}>{doc.name}</div>
                                                <div style={s.docQual}>{doc.qualification || '—'}</div>
                                            </td>
                                            <td style={s.td}>
                                                <span style={s.specBadge}>{doc.specialty}</span>
                                            </td>
                                            <td style={s.td}>{doc.experience}</td>
                                            <td style={s.td}>₹{doc.fee}</td>
                                            <td style={s.td}>{doc.availableHours || '10:00 AM – 5:00 PM'}</td>
                                            <td style={s.td}>
                                                <span style={s.ratingBadge}>⭐ {doc.rating}</span>
                                            </td>
                                            <td style={s.td}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        className="edit-btn"
                                                        onClick={() => openEditPanel(doc)}
                                                        style={{ ...s.actionBtn, ...s.editBtn, opacity: 0, transition: 'opacity 0.2s' }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(doc)}
                                                        style={{ ...s.actionBtn, ...s.deleteBtn }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filtered.length === 0 && (
                                <div style={s.emptyState}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
                                    <div style={{ fontWeight: 700, color: '#475569' }}>No doctors found</div>
                                    <div style={{ color: '#94a3b8', fontSize: '14px' }}>Try adjusting your search or filter</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* ── Add / Edit Slide-in Panel ─────────────────────────────────── */}
            {panelOpen && (
                <>
                    <div onClick={closePanel} style={s.overlay} />
                    <aside style={s.panel}>
                        <div style={s.panelHeader}>
                            <h2 style={s.panelTitle}>{editingDoc ? 'Edit Doctor' : 'Add New Doctor'}</h2>
                            <button onClick={closePanel} style={s.closeBtn} aria-label="Close panel">✕</button>
                        </div>
                        <form onSubmit={handleFormSubmit} style={s.panelForm}>
                            {field('Full Name *', 'name', 'text', 'Dr. John Doe')}
                            {field('Specialty *', 'specialty', 'text', 'e.g. Cardiology')}
                            {field('Qualification', 'qualification', 'text', 'e.g. MBBS, MD')}
                            <div style={s.twoCol}>
                                {field('Experience', 'experience', 'text', 'e.g. 10+ Years')}
                                {field('Consultation Fee (₹)', 'fee', 'number', '500')}
                            </div>
                            <div style={s.twoCol}>
                                {field('Available Hours', 'availableHours', 'text', '10:00 AM - 5:00 PM')}
                                {field('Rating (0–5)', 'rating', 'number', '5.0')}
                            </div>

                            {/* ─ Photo Upload ─ */}
                            <div style={s.formField}>
                                <label style={s.formLabel}>Doctor Photo</label>
                                {imagePreview ? (
                                    <div className="preview-wrap" style={s.previewWrap}>
                                        <img src={imagePreview} alt="Preview" style={s.previewImg} />
                                        <div className="preview-overlay" style={s.previewOverlay}>
                                            <button type="button" onClick={() => fileInputRef.current?.click()} style={s.previewChangeBtn}>Change</button>
                                            <button type="button" onClick={removeImage} style={s.previewRemoveBtn}>Remove</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        className="upload-area"
                                        onClick={() => fileInputRef.current?.click()}
                                        style={s.uploadArea}
                                    >
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                                        </svg>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#14b8a6', marginTop: '6px' }}>Click to upload photo</span>
                                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>JPG, PNG, WEBP (max 5 MB)</span>
                                    </button>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            <div style={s.panelActions}>
                                <button type="button" onClick={closePanel} style={s.cancelBtn}>Cancel</button>
                                <button id="save-doctor-btn" type="submit" style={s.saveBtn}>
                                    {editingDoc ? 'Save Changes' : 'Add Doctor'}
                                </button>
                            </div>
                        </form>
                    </aside>
                </>
            )}

            {/* ── Delete Confirmation Modal ─────────────────────────────────── */}
            {deleteTarget && (
                <div style={s.modalBackdrop}>
                    <div style={s.modal}>
                        <div style={s.modalIcon}>🗑️</div>
                        <h3 style={s.modalTitle}>Remove Doctor?</h3>
                        <p style={s.modalText}>
                            Are you sure you want to remove <strong>{deleteTarget.name}</strong> from the system? This action cannot be undone.
                        </p>
                        <div style={s.modalActions}>
                            <button onClick={() => setDeleteTarget(null)} style={s.cancelBtn}>Cancel</button>
                            <button id="confirm-delete-btn" onClick={handleDelete} style={s.dangerBtn}>Yes, Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Styles ────────────────────────────────────────────────────────────────────
const s = {
    page: {
        display: 'flex', minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    // Sidebar
    sidebar: {
        width: '240px', minHeight: '100vh',
        background: '#fff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex', flexDirection: 'column',
        padding: '24px 16px',
        gap: '8px',
        position: 'sticky', top: 0, alignSelf: 'flex-start', height: '100vh',
    },
    sidebarLogo: { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px 8px' },
    logoIcon: {
        width: '36px', height: '36px', borderRadius: '10px',
        background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    logoText: { fontWeight: 800, fontSize: '18px', color: '#0f172a' },
    sidebarDivider: { height: '1px', background: '#e2e8f0', margin: '8px 0' },
    sidebarNav: { display: 'flex', flexDirection: 'column', gap: '4px' },
    navBtn: {
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 14px', borderRadius: '10px',
        border: 'none', background: 'transparent',
        cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#64748b',
        transition: 'all 0.15s',
        textAlign: 'left',
    },
    navBtnActive: { background: '#f0fdf4', color: '#14b8a6' },
    adminCard: {
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px', background: '#f8fafc', borderRadius: '12px',
        marginBottom: '8px',
    },
    adminAvatar: {
        width: '36px', height: '36px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 800, fontSize: '16px',
    },
    logoutBtn: {
        display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
        padding: '10px 14px', borderRadius: '10px',
        border: '1px solid #fecaca', background: '#fff5f5',
        cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#ef4444',
        transition: 'all 0.15s',
    },
    // Main
    main: { flex: 1, padding: '36px 40px', overflowY: 'auto' },
    pageTitle: { fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' },
    pageSubtitle: { color: '#64748b', fontSize: '14px', margin: 0 },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
    addBtn: {
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
        color: '#fff', border: 'none', borderRadius: '12px',
        fontWeight: 700, fontSize: '14px', cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(20,184,166,0.35)',
        transition: 'transform 0.15s',
    },
    // Stats
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginTop: '24px' },
    statCard: {
        background: '#fff', borderRadius: '16px', padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        textAlign: 'center',
    },
    specialtyTable: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    specRow: { display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 0', borderBottom: '1px solid #f1f5f9' },
    specName: { width: '160px', fontWeight: 600, fontSize: '14px', color: '#1e293b', flexShrink: 0 },
    specBarWrap: { flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' },
    specBar: { height: '100%', background: 'linear-gradient(90deg, #14b8a6, #0891b2)', borderRadius: '99px', transition: 'width 0.6s ease' },
    specCount: { width: '90px', textAlign: 'right', fontSize: '13px', color: '#64748b', fontWeight: 600 },
    // Toolbar
    toolbar: { display: 'flex', gap: '12px', marginBottom: '20px' },
    searchWrap: { flex: 1, position: 'relative', display: 'flex', alignItems: 'center' },
    searchIcon: { position: 'absolute', left: '14px', pointerEvents: 'none' },
    searchInput: {
        width: '100%', padding: '11px 16px 11px 40px',
        border: '1px solid #e2e8f0', borderRadius: '12px',
        fontSize: '14px', color: '#0f172a', background: '#fff',
        outline: 'none', boxSizing: 'border-box',
    },
    filterSelect: {
        padding: '11px 16px', border: '1px solid #e2e8f0',
        borderRadius: '12px', fontSize: '14px', color: '#475569',
        background: '#fff', cursor: 'pointer', outline: 'none',
    },
    // Table
    tableWrap: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    thead: { background: '#f8fafc' },
    th: { padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' },
    tr: { borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' },
    td: { padding: '14px 16px', fontSize: '14px', color: '#334155' },
    docName: { fontWeight: 700, color: '#0f172a', fontSize: '14px' },
    docQual: { fontSize: '12px', color: '#94a3b8', marginTop: '2px' },
    specBadge: {
        display: 'inline-block', padding: '4px 10px',
        background: '#f0fdf4', color: '#14b8a6',
        borderRadius: '999px', fontSize: '12px', fontWeight: 700,
    },
    ratingBadge: {
        display: 'inline-block', padding: '4px 10px',
        background: '#fffbeb', color: '#d97706',
        borderRadius: '999px', fontSize: '12px', fontWeight: 700,
    },
    actionBtn: {
        padding: '6px 14px', borderRadius: '8px',
        border: 'none', fontWeight: 700, fontSize: '13px',
        cursor: 'pointer', transition: 'all 0.15s',
    },
    editBtn: { background: '#eff6ff', color: '#3b82f6' },
    deleteBtn: { background: '#fff1f2', color: '#f43f5e' },
    emptyState: { textAlign: 'center', padding: '56px 24px' },
    // Side Panel
    overlay: {
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)',
        zIndex: 40, backdropFilter: 'blur(2px)',
    },
    panel: {
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '420px', background: '#fff',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
        zIndex: 50, display: 'flex', flexDirection: 'column',
        animation: 'slideIn 0.28s ease',
    },
    panelHeader: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '24px 28px', borderBottom: '1px solid #e2e8f0',
    },
    panelTitle: { fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 },
    closeBtn: {
        background: '#f1f5f9', border: 'none', borderRadius: '8px',
        width: '32px', height: '32px', cursor: 'pointer',
        fontSize: '16px', color: '#64748b', fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    panelForm: { flex: 1, overflowY: 'auto', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' },
    formField: { display: 'flex', flexDirection: 'column', gap: '6px' },
    formLabel: { fontSize: '13px', fontWeight: 600, color: '#475569' },
    formInput: {
        padding: '11px 14px', border: '1px solid #e2e8f0',
        borderRadius: '10px', fontSize: '14px', color: '#0f172a',
        outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
        boxSizing: 'border-box', width: '100%',
    },
    twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    panelActions: { display: 'flex', gap: '12px', paddingTop: '8px', marginTop: 'auto' },
    cancelBtn: {
        flex: 1, padding: '12px', border: '1px solid #e2e8f0',
        borderRadius: '10px', background: '#fff', cursor: 'pointer',
        fontSize: '14px', fontWeight: 600, color: '#64748b',
    },
    saveBtn: {
        flex: 2, padding: '12px',
        background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
        color: '#fff', border: 'none', borderRadius: '10px',
        fontWeight: 700, fontSize: '14px', cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(20,184,166,0.3)',
    },
    // Delete Modal
    modalBackdrop: {
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)',
        zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
    },
    modal: {
        background: '#fff', borderRadius: '20px',
        padding: '36px', maxWidth: '400px', width: '90%',
        textAlign: 'center',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        animation: 'fadeIn 0.2s ease',
    },
    modalIcon: { fontSize: '48px', marginBottom: '16px' },
    modalTitle: { fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px' },
    modalText: { fontSize: '15px', color: '#64748b', margin: '0 0 28px', lineHeight: 1.6 },
    modalActions: { display: 'flex', gap: '12px', justifyContent: 'center' },
    dangerBtn: {
        flex: 1, padding: '12px 24px',
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        color: '#fff', border: 'none', borderRadius: '10px',
        fontWeight: 700, fontSize: '14px', cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(239,68,68,0.3)',
    },
    // Photo upload
    uploadArea: {
        width: '100%', padding: '24px 16px',
        border: '2px dashed #cbd5e1', borderRadius: '12px',
        background: '#f8fafc', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
        transition: 'border-color 0.2s, background 0.2s',
    },
    previewWrap: {
        position: 'relative', width: '100%', height: '160px',
        borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0',
    },
    previewImg: {
        width: '100%', height: '100%', objectFit: 'cover',
    },
    previewOverlay: {
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        opacity: 0, transition: 'opacity 0.2s',
    },
    previewChangeBtn: {
        padding: '7px 18px', borderRadius: '8px',
        background: '#fff', border: 'none',
        fontWeight: 700, fontSize: '13px', color: '#0f172a', cursor: 'pointer',
    },
    previewRemoveBtn: {
        padding: '7px 18px', borderRadius: '8px',
        background: '#ef4444', border: 'none',
        fontWeight: 700, fontSize: '13px', color: '#fff', cursor: 'pointer',
    },
};

export default AdminDashboard;
