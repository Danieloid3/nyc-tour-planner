import { useState, useEffect } from 'react';

export interface PlaceImage {
  url: string;
  thumb: string;
  title: string;
}

let preloadedImagesDb: Record<string, PlaceImage[]> | null = null;
let preloadingPromise: Promise<void> | null = null;

export function usePlaceImages(placeName: string | undefined) {
  const [images, setImages] = useState<PlaceImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!placeName) {
      setImages([]);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    async function load() {
      if (!preloadedImagesDb) {
        if (!preloadingPromise) {
          preloadingPromise = fetch('/places/images.json')
            .then(r => {
               if (!r.ok) throw new Error('No images.json');
               return r.json();
            })
            .then(db => { preloadedImagesDb = db; })
            .catch(e => { 
               console.error('Failed to load images library', e);
               preloadedImagesDb = {}; 
            });
        }
        await preloadingPromise;
      }

      if (!mounted) return;

      if (preloadedImagesDb && preloadedImagesDb[placeName] && preloadedImagesDb[placeName].length > 0) {
        setImages(preloadedImagesDb[placeName]);
      } else {
        setImages([]);
      }
      setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, [placeName]);

  return { images, loading, error };
}
