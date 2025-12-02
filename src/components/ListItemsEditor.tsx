'use client';

import { useState } from 'react';
import ImageUpload from './ImageUpload';
import styles from '../app/admin/admin.module.css';

interface ListItem {
    title: string;
    image_url: string;
    description?: string;
}

interface ListItemsEditorProps {
    value: ListItem[];
    onChange: (items: ListItem[]) => void;
}

export default function ListItemsEditor({ value, onChange }: ListItemsEditorProps) {
    const addItem = () => {
        onChange([...value, { title: '', image_url: '', description: '' }]);
    };

    const removeItem = (index: number) => {
        const newItems = value.filter((_, i) => i !== index);
        onChange(newItems);
    };

    const updateItem = (index: number, field: keyof ListItem, newValue: string) => {
        const newItems = [...value];
        newItems[index] = { ...newItems[index], [field]: newValue };
        onChange(newItems);
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === value.length - 1)
        ) {
            return;
        }

        const newItems = [...value];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        onChange(newItems);
    };

    return (
        <div className={styles.field}>
            <label>Tópicos da Lista</label>
            <div style={{ marginTop: '10px' }}>
                {value.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '15px',
                            marginBottom: '15px',
                            backgroundColor: '#f9f9f9',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <strong>Tópico {index + 1}</strong>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button
                                    type="button"
                                    onClick={() => moveItem(index, 'up')}
                                    disabled={index === 0}
                                    style={{
                                        padding: '5px 10px',
                                        fontSize: '12px',
                                        cursor: index === 0 ? 'not-allowed' : 'pointer',
                                        opacity: index === 0 ? 0.5 : 1,
                                    }}
                                >
                                    ↑
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveItem(index, 'down')}
                                    disabled={index === value.length - 1}
                                    style={{
                                        padding: '5px 10px',
                                        fontSize: '12px',
                                        cursor: index === value.length - 1 ? 'not-allowed' : 'pointer',
                                        opacity: index === value.length - 1 ? 0.5 : 1,
                                    }}
                                >
                                    ↓
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    style={{
                                        padding: '5px 10px',
                                        fontSize: '12px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Remover
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                                Título do Tópico
                            </label>
                            <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItem(index, 'title', e.target.value)}
                                placeholder="Ex: Melhor Filme de Ação"
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                                Descrição
                            </label>
                            <textarea
                                value={item.description || ''}
                                onChange={(e) => updateItem(index, 'description', e.target.value)}
                                placeholder="Escreva sobre este tópico..."
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd',
                                    resize: 'vertical',
                                }}
                            />
                        </div>

                        <ImageUpload
                            value={item.image_url}
                            onChange={(url) => updateItem(index, 'image_url', url)}
                            label="Imagem do Tópico"
                        />
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addItem}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                    }}
                >
                    + Adicionar Tópico
                </button>
            </div>
        </div>
    );
}
