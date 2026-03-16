/**
 * Static offer tag map keyed by merchant id.
 * The API does not return offer tags — this is a frontend-only static map.
 */
export const OFFER_TAGS = {
  1: 'Sale Live',
  2: 'Trending',
  3: 'B1G1',
  4: 'Sale Live',
  5: 'Trending',
  6: 'New',
  7: 'Sale Live',
  8: 'Trending',
};

/**
 * Set of merchant IDs that display the gold "Featured" ribbon.
 * The API does not return a featured field.
 */
export const FEATURED_IDS = [1, 5, 6];
