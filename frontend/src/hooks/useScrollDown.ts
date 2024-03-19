import { useEffect } from 'react';

export function useScrollDown<T>(onChange: T) {
    useEffect(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" });
    }, [onChange])
}
