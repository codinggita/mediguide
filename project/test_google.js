import * as cheerio from 'cheerio';

async function fetchGoogleImageURL(query) {
  try {
    const response = await fetch(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Google Images stores image URLs in script tags with base64 or direct URLs
    // Let's try grabbing the first actual image src that isn't a tiny thumb
    // Actually, Cheerio on tbm=isch returns standard HTML with img tags if no JS
    let url = null;
    $('img').each((i, el) => {
      const src = $(el).attr('src');
      if (src && src.startsWith('http') && !src.includes('googlelogo')) {
        url = src;
        return false; // break
      }
    });
    return url;
  } catch (error) {
    console.error(error);
  }
}

async function test() {
  const url = await fetchGoogleImageURL("Apollo Hospital Ahmedabad exterior");
  console.log(url);
}

test();
