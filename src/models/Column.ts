export interface Column {
    id: string;
    board_id: string;
    title: string;
    position: number;
    hidden?: number;
    created_at?: string;
}
