/**
 * Uploaded Photos Data Array (22 memories photos + 1 vinyl cover)
 * All 22 memories images distributed across:
 * - 3 Flipping Polaroids (Together scene)
 * - 6 Floating Anti-Gravity Background Polaroids (Vault scene)
 * - 13 Embedded Letter Photos across the 4 Sister Birthday Letters
 */

export const VINYL_COVER_PHOTO = '/vinyl.jpeg';

export const SISTER_PHOTOS: string[] = [
  '/1.jpeg',
  '/2.jpeg',
  '/3.jpeg',
  '/4.jpeg',
  '/5.jpeg',
  '/6.jpeg',
  '/7.jpeg',
  '/8.jpeg',
  '/9.jpeg',
  '/10.jpeg',
  '/11.jpeg',
  '/13.jpeg',
  '/14.jpeg',
  '/15.jpeg',
  '/16.jpeg',
  '/17.jpeg',
  '/18.jpeg',
  '/19.jpeg',
  '/20.jpeg',
  '/21.jpeg',
  '/22.jpeg',
  '/23.jpeg',
];

// 1. Together Memories Scene - 3 Flipping Polaroids
export const MEMORIES_POLAROIDS = [
  { photo: SISTER_PHOTOS[0], caption: 'Where it all began ✨', date: 'Chapter One • Day 1' },
  { photo: SISTER_PHOTOS[1], caption: 'Partners in crime 🌅', date: 'Growing Up • Us' },
  { photo: SISTER_PHOTOS[2], caption: 'Sisters forever 💖', date: 'Today & Forever' },
];

// 2. Secret Vault Scene - 6 Anti-Gravity Floating Background Polaroids
export const VAULT_FLOATING_PHOTOS = [
  SISTER_PHOTOS[3],
  SISTER_PHOTOS[4],
  SISTER_PHOTOS[5],
  SISTER_PHOTOS[6],
  SISTER_PHOTOS[7],
  SISTER_PHOTOS[8],
];

// 3. Four Sister Birthday Letters - 13 Photos distributed evenly (3, 3, 3, 4)
export const LETTER_PHOTOS = {
  letter1: [SISTER_PHOTOS[9], SISTER_PHOTOS[10], SISTER_PHOTOS[11]],
  letter2: [SISTER_PHOTOS[12], SISTER_PHOTOS[13], SISTER_PHOTOS[14]],
  letter3: [SISTER_PHOTOS[15], SISTER_PHOTOS[16], SISTER_PHOTOS[17]],
  letter4: [SISTER_PHOTOS[18], SISTER_PHOTOS[19], SISTER_PHOTOS[20], SISTER_PHOTOS[21]],
};
