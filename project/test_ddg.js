import { SafeSearchType, searchImages } from 'duck-duck-scrape';

async function test() {
  const result = await searchImages('Apollo Hospital Ahmedabad exterior', {
    safeSearch: SafeSearchType.OFF
  });
  console.log(result.results[0]);
}

test();
