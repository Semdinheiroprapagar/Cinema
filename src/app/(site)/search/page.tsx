import { Suspense } from 'react';
import SearchResults from './SearchResults';

export const metadata = {
    title: 'Busca | Fragmentos do Cinema',
    description: 'Resultados da busca no Fragmentos do Cinema.',
};

export default function SearchPage() {
    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Buscando...</div>}>
                <SearchResults />
            </Suspense>
        </div>
    );
}
