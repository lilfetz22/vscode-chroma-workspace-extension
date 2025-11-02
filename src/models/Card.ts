export interface Card {
    id: string;
    title: string;
    content: string;
    column_id: string;
    note_id: string | null;
    order: number;
    priority: 'low' | 'medium' | 'high';
}
