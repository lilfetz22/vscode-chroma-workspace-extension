import { getDb } from '../database';

export interface SearchResult {
  id: string;
  title: string;
  type: 'note' | 'card';
  // The rank is a negative number, with lower values indicating a better match.
  rank: number;
}

/**
 * Performs a full-text search across notes and cards.
 * @param query The search query.
 * @returns A promise that resolves to an array of search results, ranked by relevance.
 */
export async function search(query: string): Promise<SearchResult[]> {
  const db = getDb();

  // Sanitize and format the query for FTS5
  const ftsQuery = query.trim().split(/\s+/).map(term => `"${term}"`).join(' ');

  if (!ftsQuery) {
    return [];
  }

  const stmt = db.prepare(`
    SELECT
      entity_id,
      entity_type,
      title,
      rank
    FROM search_index
    WHERE search_index MATCH ?
    ORDER BY rank; -- FTS5 ranks by relevance, lower is better
  `);

  try {
    const rows = stmt.all(ftsQuery) as any[];
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
