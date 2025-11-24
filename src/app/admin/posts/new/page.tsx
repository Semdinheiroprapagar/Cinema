'use client';

import PostForm from '@/components/PostForm';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
    const router = useRouter();

    async function handleCreate(data: any) {
        const res = await fetch('/api/admin/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            router.push('/admin');
        } else {
            alert('Failed to create post');
        }
    }

    return <PostForm onSubmit={handleCreate} />;
}
