import React, { useEffect, useRef, useState } from 'react';
import {
  VINYL_COVER_PHOTO,
  SISTER_PHOTOS,
  MEMORIES_POLAROIDS,
  VAULT_FLOATING_PHOTOS,
  LETTER_PHOTOS,
} from './photoData';

export {
  VINYL_COVER_PHOTO,
  SISTER_PHOTOS,
  MEMORIES_POLAROIDS,
  VAULT_FLOATING_PHOTOS,
  LETTER_PHOTOS,
};

export interface SisterAudioControllerProps {
  onRegisterTrigger?: (triggerGoldenSong: () => void) => void;
}

export interface SyncedLyricLine {
  id: number;
  time: number; // in seconds
  text: string;
  isHeading?: boolean;
}

export const SYNCED_LYRICS: SyncedLyricLine[] = [
  { id: 1, time: 10, text: 'First year of business studies and the books are piled up high' },
  { id: 2, time: 17, text: 'You look so dangerous in the light when you let your guard go by' },
  { id: 3, time: 24, text: 'Even when I am the oldest it is you who holds the space' },
  { id: 4, time: 31, text: 'A quiet kind of wisdom hiding in your lovely face' },

  { id: 5, time: 41, text: 'Oh Kav you feel like a warm hug for the ones you hold so near' },
  { id: 6, time: 48, text: 'Discarding all the shadows just to keep the vision clear' },
  { id: 7, time: 55, text: 'Though you worry in the silence if you chose the path that is right' },
  { id: 8, time: 63, text: 'The Universe is writing every twist for you tonight' },
  { id: 9, time: 70, text: 'Yes the story is divine and the best is yet to start' },
  { id: 10, time: 78, text: 'With a billion hidden memories waiting for your heart' },

  { id: 11, time: 92, text: 'You turn the page on a forbidden novel late into the dark' },
  { id: 12, time: 100, text: 'From the Elite Mall to the lecture hall you always leave a mark' },
  { id: 13, time: 108, text: 'You do not look back at the people you have left behind' },
  { id: 14, time: 116, text: 'Moving toward the beauty that you are destined to find' },

  { id: 15, time: 127, text: 'You think you are so confused with every step you take' },
  { id: 16, time: 135, text: 'But trust the gentle rhythm that the constellations make' },
  { id: 17, time: 144, text: 'It is all unfolding exactly as it should be' },

  { id: 18, time: 157, text: 'Oh Kav you feel like a warm hug for the ones you hold so near' },
  { id: 19, time: 164, text: 'Discarding all the shadows just to keep the vision clear' },
  { id: 20, time: 171, text: 'Though you worry in the silence if you chose the path that is right' },
  { id: 21, time: 178, text: 'The Universe is writing every twist for you tonight' },
  { id: 22, time: 185, text: 'Yes the story is divine and the best is yet to start' },
  { id: 23, time: 193, text: 'With a billion hidden memories waiting for your heart' },

  { id: 24, time: 204, text: 'Look forward to the chapters still unread' },
  { id: 25, time: 212, text: 'With all the beauty waiting just ahead' },
];

export function SisterAudioController({ onRegisterTrigger }: SisterAudioControllerProps) {
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const birthdayAudioRef = useRef<HTMLAudioElement | null>(null);
  const goldenAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingGolden, setIsPlayingGolden] = useState(false);
  const [isPlayingBirthday, setIsPlayingBirthday] = useState(false);
  const [isBgActive, setIsBgActive] = useState(false);

  // Play background song on loop at 40% volume (resuming from currentTime)
  const resumeBackgroundSong = () => {
    // Stop birthday song if playing
    if (birthdayAudioRef.current) {
      birthdayAudioRef.current.pause();
      setIsPlayingBirthday(false);
    }
    // Stop golden song if playing
    if (goldenAudioRef.current) {
      goldenAudioRef.current.pause();
      setIsPlayingGolden(false);
    }

    if (bgAudioRef.current) {
      bgAudioRef.current.volume = 0.4;
      bgAudioRef.current.loop = true;
      bgAudioRef.current.play().then(() => {
        setIsBgActive(true);
      }).catch((err) => {
        console.warn('Background audio play deferred:', err);
      });
    }
  };

  // Candle Blow: Pause background song, immediately play Happy Birthday melody
  const playBirthdayMelody = () => {
    // 1. Pause background song (leaving currentTime intact so it can resume)
    if (bgAudioRef.current) {
      bgAudioRef.current.pause();
      setIsBgActive(false);
    }
    // 2. Pause golden song if it was active
    if (goldenAudioRef.current) {
      goldenAudioRef.current.pause();
      setIsPlayingGolden(false);
    }
    // 3. Play birthday melody
    if (birthdayAudioRef.current) {
      birthdayAudioRef.current.currentTime = 0;
      birthdayAudioRef.current.volume = 0.9;
      birthdayAudioRef.current.play().then(() => {
        setIsPlayingBirthday(true);
      }).catch((err) => {
        console.warn('Birthday melody play deferred:', err);
      });
    }
  };

  // Exit Candle Scene: Pause Happy Birthday melody, resume background song from where it left off
  const stopBirthdayAndResumeBg = () => {
    if (birthdayAudioRef.current) {
      birthdayAudioRef.current.pause();
      birthdayAudioRef.current.currentTime = 0;
      setIsPlayingBirthday(false);
    }
    resumeBackgroundSong();
  };

  // Scratch Reveal: Pause background song completely, play golden-song.mp3 at 100% volume
  const playGoldenSong = () => {
    // 1. Guarantee background music's .pause() method runs immediately before new song starts
    if (bgAudioRef.current) {
      try {
        bgAudioRef.current.pause();
      } catch (err) {
        console.log('Background audio pause error:', err);
      }
      setIsBgActive(false);
    }
    if (birthdayAudioRef.current) {
      try {
        birthdayAudioRef.current.pause();
      } catch (err) {}
      setIsPlayingBirthday(false);
    }

    // Also pause any vanilla DOM bg audio elements
    const vanillaBgAudio = document.getElementById('bg-audio') as HTMLAudioElement | null;
    if (vanillaBgAudio) {
      try {
        vanillaBgAudio.pause();
      } catch (err) {}
    }

    // 2. Explicitly play golden song with catch handler
    if (goldenAudioRef.current) {
      goldenAudioRef.current.volume = 1.0;
      goldenAudioRef.current.currentTime = 0;
      goldenAudioRef.current.play().then(() => {
        setIsPlayingGolden(true);
      }).catch((err) => {
        console.log('Audio autoplay blocked:', err);
      });
    }

    // Expand container max-width to 1200px after card is revealed
    const bonusCard = document.querySelector('.secret-bonus-card');
    if (bonusCard) {
      bonusCard.classList.add('is-revealed');
    }
  };

  const pauseAll = () => {
    if (bgAudioRef.current) bgAudioRef.current.pause();
    if (birthdayAudioRef.current) birthdayAudioRef.current.pause();
    if (goldenAudioRef.current) goldenAudioRef.current.pause();
    setIsBgActive(false);
    setIsPlayingBirthday(false);
    setIsPlayingGolden(false);
  };

  // 1. Synchronize spinning vinyl disc, animated equalizer bars, and tonearm with React state
  useEffect(() => {
    const vinylDisc = document.getElementById('vinyl-disc');
    const vinylSvg = document.querySelector('.vinyl-record-svg');
    const vinylEqualizer = document.getElementById('vinyl-equalizer') || document.getElementById('vinyl-waveform');
    const vinylTonearm = document.getElementById('vinyl-tonearm');
    const vinylPlayerBox = document.querySelector('.vinyl-player-box');

    if (vinylDisc) {
      if (isPlayingGolden) {
        vinylDisc.classList.add('playing', 'is-spinning', 'animate-[spin_6s_linear_infinite]');
      } else {
        vinylDisc.classList.remove('playing', 'is-spinning', 'animate-spin', 'animate-[spin_6s_linear_infinite]');
      }
    }

    if (vinylSvg) {
      if (isPlayingGolden) {
        vinylSvg.classList.add('playing', 'is-spinning', 'animate-[spin_6s_linear_infinite]');
      } else {
        vinylSvg.classList.remove('playing', 'is-spinning', 'animate-spin', 'animate-[spin_6s_linear_infinite]');
      }
    }

    if (vinylEqualizer) {
      if (isPlayingGolden) {
        vinylEqualizer.classList.add('playing');
      } else {
        vinylEqualizer.classList.remove('playing');
      }
    }

    if (vinylTonearm) {
      if (isPlayingGolden) {
        vinylTonearm.classList.add('is-active');
      } else {
        vinylTonearm.classList.remove('is-active');
      }
    }

    if (vinylPlayerBox) {
      if (isPlayingGolden) {
        vinylPlayerBox.classList.add('playing');
      } else {
        vinylPlayerBox.classList.remove('playing');
      }
    }
  }, [isPlayingGolden]);

  // 2. Spotify-Style Synced Lyrics: listen to currentTime of golden-song audio ref,
  // map custom lyrics to timestamps, dynamically apply text-white font-extrabold scale-105 transition-all,
  // and automatically scroll the container so the active line stays in the vertical center.
  useEffect(() => {
    const audio = goldenAudioRef.current;
    if (!audio) return;

    let lastActiveId = -1;

    const handleTimeUpdate = () => {
      const curTime = audio.currentTime;

      // Find the active lyric line according to estimated timestamps
      let activeLine: SyncedLyricLine | null = null;
      for (let i = 0; i < SYNCED_LYRICS.length; i++) {
        if (curTime >= SYNCED_LYRICS[i].time) {
          activeLine = SYNCED_LYRICS[i];
        }
      }

      if (!activeLine && curTime > 1 && !audio.paused) {
        activeLine = SYNCED_LYRICS[0];
      }

      const activeId = activeLine ? activeLine.id : -1;
      if (activeId === lastActiveId) return;
      lastActiveId = activeId;

      const container = document.getElementById('lyrics-scroll-container');
      const lyricElements = document.querySelectorAll<HTMLElement>('.spotify-lyric-line');

      lyricElements.forEach((el) => {
        const lineId = Number(el.getAttribute('data-id'));
        if (lineId === activeId) {
          // Dynamically apply classes: text-white font-bold transition-all is-active-sync break-words
          el.classList.add('text-white', 'font-bold', 'transition-all', 'is-active-sync', 'break-words');
          el.classList.remove('scale-105', 'font-extrabold');

          // Automatically scroll container so active line stays in vertical center of box
          if (container) {
            const containerHeight = container.clientHeight;
            const elementOffsetTop = el.offsetTop;
            const elementHeight = el.clientHeight;
            const targetScrollTop = elementOffsetTop - (containerHeight / 2) + (elementHeight / 2);
            container.scrollTo({
              top: Math.max(0, targetScrollTop),
              behavior: 'smooth',
            });
          }
        } else {
          el.classList.remove('text-white', 'font-bold', 'font-extrabold', 'scale-105', 'is-active-sync');
          el.classList.add('transition-all', 'break-words');
        }
      });
    };

    const handlePlay = () => setIsPlayingGolden(true);
    const handlePause = () => setIsPlayingGolden(false);
    const handleEnded = () => {
      setIsPlayingGolden(false);
      lastActiveId = -1;
    };

    const domGoldenAudio = document.getElementById('golden-audio') as HTMLAudioElement | null;

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    if (domGoldenAudio && domGoldenAudio !== audio) {
      domGoldenAudio.addEventListener('timeupdate', handleTimeUpdate);
      domGoldenAudio.addEventListener('play', handlePlay);
      domGoldenAudio.addEventListener('pause', handlePause);
      domGoldenAudio.addEventListener('ended', handleEnded);
    }

    // Interactive click to seek and sync
    const handleLyricClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.spotify-lyric-line') as HTMLElement | null;
      if (target && target.dataset.time) {
        const timeToSeek = parseFloat(target.dataset.time);
        audio.currentTime = timeToSeek;
        if (domGoldenAudio) domGoldenAudio.currentTime = timeToSeek;
        if (audio.paused) {
          audio.play().catch(console.warn);
        }
      }
    };

    document.addEventListener('click', handleLyricClick);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      if (domGoldenAudio && domGoldenAudio !== audio) {
        domGoldenAudio.removeEventListener('timeupdate', handleTimeUpdate);
        domGoldenAudio.removeEventListener('play', handlePlay);
        domGoldenAudio.removeEventListener('pause', handlePause);
        domGoldenAudio.removeEventListener('ended', handleEnded);
      }
      document.removeEventListener('click', handleLyricClick);
    };
  }, []);

  useEffect(() => {
    // Expose control functions globally for vanilla script.js and custom events
    (window as any).__sisterAudio = {
      playBg: resumeBackgroundSong,
      resumeBg: resumeBackgroundSong,
      pauseBg: () => {
        if (bgAudioRef.current) bgAudioRef.current.pause();
        setIsBgActive(false);
      },
      playBirthday: playBirthdayMelody,
      stopBirthday: () => {
        if (birthdayAudioRef.current) {
          birthdayAudioRef.current.pause();
          setIsPlayingBirthday(false);
        }
      },
      stopBirthdayAndResumeBg: stopBirthdayAndResumeBg,
      playGolden: playGoldenSong,
      pauseAll: pauseAll,
      bgRef: bgAudioRef,
      bgSongRef: bgAudioRef,
      birthdayRef: birthdayAudioRef,
      goldenRef: goldenAudioRef,
      goldenSongRef: goldenAudioRef,
      setIsPlayingGolden: setIsPlayingGolden,
    };

    if (onRegisterTrigger) {
      onRegisterTrigger(playGoldenSong);
    }

    // Custom DOM events for cross-communication
    const handleEntryClick = () => {
      resumeBackgroundSong();
    };

    const handleCandleBlow = () => {
      playBirthdayMelody();
    };

    const handleExitCandle = () => {
      stopBirthdayAndResumeBg();
    };

    const handleGoldenReveal = () => {
      playGoldenSong();
    };

    // Auto-play background song on first user interaction
    const handleFirstInteraction = () => {
      resumeBackgroundSong();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    window.addEventListener('sisterhood-entry-click', handleEntryClick);
    window.addEventListener('sisterhood-candle-blow', handleCandleBlow);
    window.addEventListener('sisterhood-exit-candle', handleExitCandle);
    window.addEventListener('sisterhood-golden-reveal', handleGoldenReveal);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('sisterhood-entry-click', handleEntryClick);
      window.removeEventListener('sisterhood-candle-blow', handleCandleBlow);
      window.removeEventListener('sisterhood-exit-candle', handleExitCandle);
      window.removeEventListener('sisterhood-golden-reveal', handleGoldenReveal);
    };
  }, [onRegisterTrigger]);

  return (
    <>
      {/* Hidden audio elements properly referenced using React useRef */}
      <audio
        ref={bgAudioRef}
        id="react-bg-audio"
        src="/bg-song.mp3"
        loop
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src="/bg-song.mp3" type="audio/mp3" />
        <source src="/assets/bg-song.mp3" type="audio/mp3" />
      </audio>

      <audio
        ref={birthdayAudioRef}
        id="react-birthday-audio"
        src="/happy-birthday.mp3"
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src="/happy-birthday.mp3" type="audio/mp3" />
        <source src="/assets/happy-birthday.mp3" type="audio/mp3" />
      </audio>

      <audio
        ref={goldenAudioRef}
        id="react-golden-audio"
        src="/golden-song.mp3"
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src="/golden-song.mp3" type="audio/mp3" />
        <source src="/assets/golden-song.mp3" type="audio/mp3" />
        <source src="/golden card song.mp3" type="audio/mp3" />
      </audio>
    </>
  );
}

export const SONG_LYRICS = `First year of business studies and the books are piled up high
You look so dangerous in the light when you let your guard go by
Even when I am the oldest it is you who holds the space
A quiet kind of wisdom hiding in your lovely face

Oh Kav you feel like a warm hug for the ones you hold so near
Discarding all the shadows just to keep the vision clear
Though you worry in the silence if you chose the path that is right
The Universe is writing every twist for you tonight
Yes the story is divine and the best is yet to start
With a billion hidden memories waiting for your heart

You turn the page on a forbidden novel late into the dark
From the Elite Mall to the lecture hall you always leave a mark
You do not look back at the people you have left behind
Moving toward the beauty that you are destined to find

You think you are so confused with every step you take
But trust the gentle rhythm that the constellations make
It is all unfolding exactly as it should be

Oh Kav you feel like a warm hug for the ones you hold so near
Discarding all the shadows just to keep the vision clear
Though you worry in the silence if you chose the path that is right
The Universe is writing every twist for you tonight
Yes the story is divine and the best is yet to start
With a billion hidden memories waiting for your heart

Look forward to the chapters still unread
With all the beauty waiting just ahead`;
