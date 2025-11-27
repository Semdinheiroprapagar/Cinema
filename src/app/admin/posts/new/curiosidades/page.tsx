'use client';

import PostForm from '@/components/PostForm';
import { useRouter } from 'next/navigation';

export default function NewCuriosidadesPostPage() {
    const router = useRouter();

    const handleCreate = async (data: any) => {
        const res = await fetch('/api/admin/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            router.push('/admin');
            router.refresh();
        } else {
            alert('Erro ao criar post');
        }
    };

    return <PostForm onSubmit={handleCreate} initialData={{ category: 'Curiosidades' } as any} />;
}
