import fs from 'fs';

const REAL_HOSPITALS = [
  // Ahmedabad
  { name: 'Apollo Hospital', city: 'Ahmedabad' },
  { name: 'Zydus Hospital', city: 'Ahmedabad' },
  { name: 'CIMS Hospital', city: 'Ahmedabad' },
  { name: 'Sterling Hospital', city: 'Ahmedabad' },
  { name: 'KD Hospital', city: 'Ahmedabad' },
  // Mumbai
  { name: 'Lilavati Hospital', city: 'Mumbai' },
  { name: 'Kokilaben Dhirubhai Ambani Hospital', city: 'Mumbai' },
  { name: 'Breach Candy Hospital', city: 'Mumbai' },
  { name: 'Jaslok Hospital', city: 'Mumbai' },
  { name: 'Hinduja Hospital', city: 'Mumbai' },
  // Delhi
  { name: 'AIIMS New Delhi', city: 'Delhi' },
  { name: 'Indraprastha Apollo Hospital', city: 'Delhi' },
  { name: 'Max Super Speciality Hospital', city: 'Delhi' },
  { name: 'Sir Ganga Ram Hospital', city: 'Delhi' },
  { name: 'Fortis Escorts Heart Institute', city: 'Delhi' },
  // Gurugram
  { name: 'Medanta The Medicity', city: 'Gurugram' },
  { name: 'Fortis Memorial Research Institute', city: 'Gurugram' },
  { name: 'Artemis Hospital', city: 'Gurugram' },
  { name: 'Max Hospital Gurugram', city: 'Gurugram' }
];

async function fetchWikiImage(query) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=800&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1`;
    const res = await fetch(url).then(r => r.json());
    if (res.query && res.query.pages) {
      const pages = res.query.pages;
      const pageId = Object.keys(pages)[0];
      if (pages[pageId] && pages[pageId].thumbnail) {
        return pages[pageId].thumbnail.source;
      }
    }
  } catch (e) {
  }
  return null;
}

async function run() {
  const images = {};
  for (const h of REAL_HOSPITALS) {
    let url = await fetchWikiImage(h.name);
    if (!url) url = await fetchWikiImage(h.name.split(' ')[0] + ' Hospital');
    if (url) {
      images[h.name] = url;
      console.log(`Found: ${h.name}`);
    } else {
      console.log(`Missing: ${h.name}`);
    }
  }
}

run();
