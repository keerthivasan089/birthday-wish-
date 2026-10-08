import React, { useState } from 'react';

interface LyricsSideBySideProps {
  lyrics?: string;
  onPlayGolden?: () => void;
}

export const LyricsContainer: React.FC<LyricsSideBySideProps> = () => {
  const [activeLine, setActiveLine] = useState<number | null>(null);

  const parsedLyrics = [
    { type: 'line', text: 'First year of business studies and the books are piled up high' },
    { type: 'line', text: 'You look so dangerous in the light when you let your guard go by' },
    { type: 'line', text: 'Even when I am the oldest it is you who holds the space' },
    { type: 'line', text: 'A quiet kind of wisdom hiding in your lovely face' },
    { type: 'line', text: 'Oh Kav you feel like a warm hug for the ones you hold so near' },
    { type: 'line', text: 'Discarding all the shadows just to keep the vision clear' },
    { type: 'line', text: 'Though you worry in the silence if you chose the path that is right' },
    { type: 'line', text: 'The Universe is writing every twist for you tonight' },
    { type: 'line', text: 'Yes the story is divine and the best is yet to start' },
    { type: 'line', text: 'With a billion hidden memories waiting for your heart' },
    { type: 'line', text: 'You turn the page on a forbidden novel late into the dark' },
    { type: 'line', text: 'From the Elite Mall to the lecture hall you always leave a mark' },
    { type: 'line', text: 'You do not look back at the people you have left behind' },
    { type: 'line', text: 'Moving toward the beauty that you are destined to find' },
    { type: 'line', text: 'You think you are so confused with every step you take' },
    { type: 'line', text: 'But trust the gentle rhythm that the constellations make' },
    { type: 'line', text: 'It is all unfolding exactly as it should be' },
    { type: 'line', text: 'Oh Kav you feel like a warm hug for the ones you hold so near' },
    { type: 'line', text: 'Discarding all the shadows just to keep the vision clear' },
    { type: 'line', text: 'Though you worry in the silence if you chose the path that is right' },
    { type: 'line', text: 'The Universe is writing every twist for you tonight' },
    { type: 'line', text: 'Yes the story is divine and the best is yet to start' },
    { type: 'line', text: 'With a billion hidden memories waiting for your heart' },
    { type: 'line', text: 'Look forward to the chapters still unread' },
    { type: 'line', text: 'With all the beauty waiting just ahead' },
  ];

  return (
    <div
      className="lyrics-scroll-container spotify-lyrics-container px-6"
      style={{
        flex: '1 1 50%',
        minWidth: '270px',
        maxHeight: '430px',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: 'linear-gradient(165deg, rgba(20, 18, 28, 0.94) 0%, rgba(10, 8, 15, 0.98) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '18px',
        padding: '1.5rem',
        boxSizing: 'border-box',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        scrollbarWidth: 'none',
        fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Segoe UI', sans-serif",
      }}
    >
      <div className="spotify-lyrics-header">
        <span className="spotify-lyrics-tag">
          <span className="spotify-sound-icon" aria-hidden="true">
            <i></i><i></i><i></i><i></i>
          </span>
          LYRICS
        </span>
        <span className="spotify-song-title">Written Just For You, Kav ✨</span>
      </div>

      <div className="spotify-lyrics-content" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
        {parsedLyrics.map((item, idx) => {
          if (item.type === 'heading') {
            return (
              <div key={idx} className="spotify-verse-heading">
                {item.text}
              </div>
            );
          }
          const isSelected = activeLine === idx;
          return (
            <p
              key={idx}
              className={`spotify-lyric-line break-words text-balance ${isSelected ? 'active text-white font-bold' : ''}`}
              onClick={() => setActiveLine(idx)}
              style={{
                whiteSpace: 'normal',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                lineHeight: 1.7,
                maxWidth: '100%',
                boxSizing: 'border-box',
              }}
            >
              {item.text}
            </p>
          );
        })}
      </div>
    </div>
  );
};
