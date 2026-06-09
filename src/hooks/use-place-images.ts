import { useState, useEffect } from 'react';

export interface PlaceImage {
  url: string;
  thumb: string;
  title: string;
}

const imageCache = new Map<string, PlaceImage[]>();

export function usePlaceImages(placeName: string | undefined) {
  const [images, setImages] = useState<PlaceImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!placeName) {
      setImages([]);
      return;
    }

    if (imageCache.has(placeName)) {
      setImages(imageCache.get(placeName)!);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    async function fetchImages() {
      try {
        // Query Wikimedia Commons for "New York [Place Name]"
        const query = encodeURIComponent(`New York ${placeName}`);
        // gsrnamespace=6 means "File:" namespace. We fetch up to 8 images to have enough after deduplication.
        // prop=imageinfo&iiprop=url|sha1 gets the URL, 1024px thumbnail, and SHA1 hash for deduplication.
        const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${query}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|sha1&iiurlwidth=1024&format=json&origin=*`;
        
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

        const sortedPages = Object.values(pages).sort((a: any, b: any) => a.index - b.index);
        const uniqueHashes = new Set<string>();

        for (const page of sortedPages as any[]) {
          const imageInfo = page.imageinfo?.[0];
          // Use SHA1 hash to ensure exact image contents are not duplicated, even if filenames differ
          if (imageInfo?.thumburl && imageInfo?.sha1 && !uniqueHashes.has(imageInfo.sha1)) {
            uniqueHashes.add(imageInfo.sha1);
            results.push({
              url: imageInfo.thumburl, // Use the 1024px version for fullscreen to ensure extremely fast loading!
              thumb: imageInfo.thumburl, // Use 1024px width for thumbnail too
              title: page.title.replace('File:', '').replace(/\.[^/.]+$/, ''), // Clean title
            });
            // Stop once we have 4 good unique images
            if (results.length >= 4) break;
          }
        }
        if (mounted) {
          setImages(results);
          imageCache.set(placeName, results);
          setLoading(false);
        }
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
