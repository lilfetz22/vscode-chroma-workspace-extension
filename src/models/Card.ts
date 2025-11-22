export interface Card {
    id: string;
    column_id: string;
    position: number;
    card_type: 'simple' | 'linked';
    title: string;
    content?: string | null;
    note_id?: string | null;
    summary?: string | null;
    priority?: number;
    scheduled_at?: string | null;
    recurrence?: string | null;
    activated_at?: string | null;
    completed_at?: string | null;
    created_at?: string;
}
