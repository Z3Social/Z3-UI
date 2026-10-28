import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { IconButton } from 'soapbox/components/ui';

const CATEGORIES = [
  { id: 'trending', label: 'Trending' },
  { id: 'reactions', label: 'Reactions' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'memes', label: 'Memes' },
  { id: 'anime', label: 'Anime' },
  { id: 'movies', label: 'Movies' },
];

const GifButton = ({ onSelectGif, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('trending');
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let cancel = false;

    const fetchGifs = async () => {
      setLoading(true);
      try {
        const endpoint = query
          ? `/api/klipy/search?q=${encodeURIComponent(query)}`
          : (activeCategory === 'trending' ? '/api/klipy/trending' : `/api/klipy/search?q=${encodeURIComponent(activeCategory)}`);
        const res = await fetch(endpoint, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (!cancel) setGifs(data.gifs || []);
        }
      } catch (e) {
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    const timer = setTimeout(fetchGifs, query ? 300 : 0);
    return () => {
      cancel = true;
      clearTimeout(timer);
    };
  }, [isOpen, query, activeCategory]);

  const handlePick = (g) => {
    onSelectGif(g.url, g);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      <IconButton
        src={require('icons/gif.svg')}
        className='text-gray-400 hover:text-gray-600'
        title='Choose a GIF (KLIPY)'
        disabled={disabled}
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60'
          onClick={() => setIsOpen(false)}
        >
          <div
            className='w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between px-4 py-3 border-b border-gray-800'>
              <h3 className='font-bold text-gray-100 text-base'>Choose a GIF (KLIPY)</h3>
              <button
                type='button'
                className='text-gray-400 hover:text-gray-200 text-lg'
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className='p-3 border-b border-gray-800'>
              <input
                type='text'
                placeholder='Search GIFs...'
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveCategory('');
                }}
                className='w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:border-sky-500'
                autoFocus
              />

              <div className='flex gap-1.5 overflow-x-auto pt-2 pb-0.5 no-scrollbar'>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type='button'
                    className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
                      activeCategory === cat.id
                        ? 'bg-sky-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setQuery('');
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className='flex-1 overflow-y-auto p-3'>
              {loading && (
                <div className='text-center py-12 text-gray-400 text-sm'>
                  Loading GIFs…
                </div>
              )}

              {!loading && gifs.length === 0 && (
                <div className='text-center py-12 text-gray-400 text-sm'>
                  No GIFs found.
                </div>
              )}

              {!loading && gifs.length > 0 && (
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                  {gifs.map((g) => (
                    <div
                      key={g.id || g.url}
                      className='aspect-video rounded-lg overflow-hidden bg-black cursor-pointer hover:opacity-90 relative group'
                      onClick={() => handlePick(g)}
                    >
                      <img
                        src={g.preview || g.url}
                        alt={g.title || 'GIF'}
                        loading='lazy'
                        className='w-full h-full object-cover'
                      />
                      {g.title && (
                        <div className='absolute bottom-0 inset-x-0 p-1 bg-gradient-to-t from-black/80 to-transparent text-[11px] text-white truncate opacity-0 group-hover:opacity-100 transition-opacity'>
                          {g.title}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GifButton;
