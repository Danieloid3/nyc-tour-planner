import { useState, useEffect } from 'react';

export interface PlaceImage {
  url: string;
  thumb: string;
  title: string;
}

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

    async function fetchImages() {
      try {
        // Query Wikimedia Commons for "New York [Place Name]"
        const query = encodeURIComponent(`New York ${placeName}`);
        // gsrnamespace=6 means "File:" namespace. gsrlimit=4 limits to 4 images.
        // prop=imageinfo&iiprop=url gets the URL, and iiurlwidth=800 gets an 800px thumbnail.
        const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${query}&gsrnamespace=6&gsrlimit=4&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (!mounted) return;

        if (!data.query || !data.query.pages) {
          setImages([]);
          setLoading(false);
          return;
        }

        const pages = data.query.pages;
        const results: PlaceImage[] = [];

        // Sort by index so it matches the search relevance order
        const sortedPages = Object.values(pages).sort((a: any, b: any) => a.index - b.index);

        for (const page of sortedPages as any[]) {
          const imageInfo = page.imageinfo?.[0];
          if (imageInfo?.thumburl) {
            results.push({
              url: imageInfo.url, // Original full size
              thumb: imageInfo.thumburl, // 800px width
              title: page.title.replace('File:', '').replace(/\.[^/.]+$/, ''), // Clean title
            });
          }
        }

        setImages(results);
        setLoading(false);
      } catch (err) {
        if (mounted) {
          console.error("Failed to fetch images for", placeName, err);
          setError("Failed to load images");
          setLoading(false);
        }
      }
    }

    fetchImages();

    return () => {
      mounted = false;
    };
  }, [placeName]);

  return { images, loading, error };
}
