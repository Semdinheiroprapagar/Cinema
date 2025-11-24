'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';

interface Activity {
    id: number;
    title: string;
    description: string;
    image_url: string;
    video_url: string;
    link: string;
    active: number;
    display_order: number;
}

export default function ActivitiesPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newActivity, setNewActivity] = useState({ title: '', description: '', image_url: '', video_url: '', link: '' });
    const router = useRouter();

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const res = await fetch('/api/activities');
            if (res.ok) {
                const data = await res.json();
                setActivities(data);
            }
        } catch (error) {
            console.error('Failed to fetch activities', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newActivity),
            });
            if (res.ok) {
                setNewActivity({ title: '', description: '', image_url: '', video_url: '', link: '' });
                fetchActivities();
            }
        } catch (error) {
            console.error('Failed to create activity', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja deletar esta atividade?')) return;
        try {
            const res = await fetch(`/api/activities?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchActivities();
            }
        } catch (error) {
            console.error('Failed to delete activity', error);
        }
    };

    if (isLoading) return <div style={{ padding: '20px' }}>Carregando...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Gerenciar Atividades</h1>

            <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h2>Adicionar Nova Atividade</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Título (Opcional)</label>
                        <input
                            type="text"
                            value={newActivity.title}
                            onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                            placeholder="Deixe em branco se não quiser título"
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descrição</label>
                        <textarea
                            value={newActivity.description}
                            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                            style={{ width: '100%', padding: '8px', minHeight: '80px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Imagem (Opcional)</label>
                        <ImageUpload
                            value={newActivity.image_url}
                            onChange={(url) => setNewActivity({ ...newActivity, image_url: url })}
                            accept="image/*"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Link (Opcional)</label>
                        <input
                            type="text"
                            value={newActivity.link}
                            onChange={(e) => setNewActivity({ ...newActivity, link: e.target.value })}
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
                        Adicionar Atividade
                    </button>
                </form>
            </div>

            <h2>Atividades Existentes</h2>
            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {activities.length === 0 ? (
                    <p style={{ color: '#666' }}>Nenhuma atividade cadastrada ainda.</p>
                ) : (
                    activities.map((activity) => (
                        <div key={activity.id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            {activity.video_url ? (
                                <video
                                    src={activity.video_url}
                                    controls
                                    style={{ width: '100%', height: '150px', objectFit: 'cover', backgroundColor: '#000' }}
                                />
                            ) : activity.image_url ? (
                                <img src={activity.image_url} alt={activity.title || 'Atividade'} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '150px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                                    Sem mídia
                                </div>
                            )}
                            <div style={{ padding: '15px' }}>
                                {activity.title && <h3 style={{ margin: '0 0 10px 0' }}>{activity.title}</h3>}
                                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>{activity.description}</p>
                                {activity.link && (
                                    <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                                        <a href={activity.link} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>
                                            {activity.link}
                                        </a>
                                    </p>
                                )}
                                <div style={{ fontSize: '12px', color: '#999', marginBottom: '10px' }}>
                                    {activity.video_url ? '🎥 Vídeo' : activity.image_url ? '🖼️ Imagem' : ''}
                                </div>
                                <button
                                    onClick={() => handleDelete(activity.id)}
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

                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Vídeo (Opcional)</label>
                                <ImageUpload
                                    value={newActivity.video_url}
                                    onChange={(url) => setNewActivity({ ...newActivity, video_url: url })}
                                    accept="video/*"
                                />
                                <small style={{ color: '#666', fontSize: '12px' }}>Se adicionar vídeo, ele será exibido no lugar da imagem</small>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
