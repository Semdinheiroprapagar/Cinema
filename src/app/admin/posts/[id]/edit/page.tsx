'use client';

import { useEffect, useState } from 'react';
import PostForm from '@/components/PostForm';
import { useRouter, useParams } from 'next/navigation';

export default function EditPostPage() {
    const [post, setPost] = useState(null);
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        fetch(`/api/admin/posts/${id}`)
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error('Failed to fetch');
            })
            .then((data) => setPost(data))
            .catch(() => router.push('/admin'));
    }, [id, router]);

    async function handleUpdate(data: any) {
        const res = await fetch(`/api/admin/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            router.push('/admin');
        } else {
            alert('Failed to update post');
        }
    }

    if (!post) return <div>Loading...</div>;

    return <PostForm initialData={post} onSubmit={handleUpdate} isEditing />;
}
