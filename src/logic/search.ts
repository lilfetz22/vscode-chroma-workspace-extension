import { getDb, prepare } from '../database';

export interface SearchResult {
  id: string;
  title: string;
  type: 'note' | 'card';
  // The rank indicates match quality: 1=title match, 2=content match, 3=other
  rank: number;
}

/**
 * Performs a full-text search across notes and cards.
 * @param query The search query.
 * @returns A promise that resolves to an array of search results, ranked by relevance.
 */
export async function search(query: string): Promise<SearchResult[]> {
  getDb(); // Ensure DB is initialized

  // Sanitize query for LIKE search
  const searchQuery = query.trim();

  if (!searchQuery) {
    return [];
  }

  // Use LIKE for search since sql.js doesn't support FTS5
  const likePattern = `%${searchQuery}%`;
  const stmt = prepare(`
    SELECT
      entity_id,
      entity_type,
      title,
      CASE 
        WHEN title LIKE ? THEN 1
        WHEN content LIKE ? THEN 2
        ELSE 3
      END as rank
    FROM search_index
    WHERE title LIKE ? OR content LIKE ?
    ORDER BY rank, title;
  `);

  try {
    const rows = stmt.all(likePattern, likePattern, likePattern, likePattern) as any[];
    return rows.map(row => ({
      id: row.entity_id,
      type: row.entity_type,
      title: row.title,
      rank: row.rank,
    }));
  } catch (error) {
    console.error('Search query failed:', error);
    return [];
  }
}
