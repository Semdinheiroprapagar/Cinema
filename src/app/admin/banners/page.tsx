'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';

interface Banner {
    id: number;
    title: string;
    image_url: string;
    video_url: string;
    link: string;
    active: number;
    display_order: number;
}

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newBanner, setNewBanner] = useState({ title: '', image_url: '', video_url: '', link: '' });
    const router = useRouter();

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await fetch('/api/banners');
            if (res.ok) {
                const data = await res.json();
                setBanners(data);
            }
        } catch (error) {
            console.error('Failed to fetch banners', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBanner.image_url && !newBanner.video_url) {
            alert('Por favor, faça upload de uma imagem ou vídeo');
            return;
        }
        try {
            const res = await fetch('/api/banners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBanner),
            });
            if (res.ok) {
                setNewBanner({ title: '', image_url: '', video_url: '', link: '' });
                fetchBanners();
            }
        } catch (error) {
            console.error('Failed to create banner', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja deletar este banner?')) return;
        try {
            const res = await fetch(`/api/banners?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchBanners();
            }
        } catch (error) {
            console.error('Failed to delete banner', error);
        }
    };

    if (isLoading) return <div style={{ padding: '20px' }}>Carregando...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Gerenciar Banners</h1>

            <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h2>Adicionar Novo Banner</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Título (Opcional)</label>
                        <input
                            type="text"
                            value={newBanner.title}
                            onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                            placeholder="Deixe em branco se não quiser título"
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Imagem</label>
                        <ImageUpload
                            value={newBanner.image_url}
                            onChange={(url) => setNewBanner({ ...newBanner, image_url: url })}
                            accept="image/*"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Vídeo (Opcional)</label>
                        <ImageUpload
                            value={newBanner.video_url}
                            onChange={(url) => setNewBanner({ ...newBanner, video_url: url })}
                            accept="video/*"
                        />
                        <small style={{ color: '#666', fontSize: '12px' }}>Se adicionar vídeo, ele será exibido no lugar da imagem</small>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Link (Opcional)</label>
                        <input
                            type="text"
                            value={newBanner.link}
                            onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                            placeholder="https://..."
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: '10px',
                            backgroundColor: '#0070f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Adicionar Banner
                    </button>
                </form>
            </div>

            <h2>Banners Existentes</h2>
            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {banners.length === 0 ? (
                    <p style={{ color: '#666' }}>Nenhum banner cadastrado ainda.</p>
                ) : (
                    banners.map((banner) => (
                        <div key={banner.id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            {banner.video_url ? (
                                <video
                                    src={banner.video_url}
                                    controls
                                    style={{ width: '100%', height: '150px', objectFit: 'cover', backgroundColor: '#000' }}
                                />
                            ) : banner.image_url ? (
                                <img src={banner.image_url} alt={banner.title || 'Banner'} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '150px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                                    Sem mídia
                                </div>
                            )}
                            <div style={{ padding: '15px' }}>
                                {banner.title && <h3 style={{ margin: '0 0 10px 0' }}>{banner.title}</h3>}
                                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
                                    {banner.link ? (
                                        <a href={banner.link} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>
                                            {banner.link}
                                        </a>
                                    ) : (
                                        'Sem link'
                                    )}
                                </p>
                                <div style={{ fontSize: '12px', color: '#999', marginBottom: '10px' }}>
                                    {banner.video_url ? '🎥 Vídeo' : banner.image_url ? '🖼️ Imagem' : ''}
                                </div>
                                <button
                                    onClick={() => handleDelete(banner.id)}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#ff4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    🗑️ Deletar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
