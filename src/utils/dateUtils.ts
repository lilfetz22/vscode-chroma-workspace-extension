/**
 * Date utility functions
 */

/**
 * Format a date string to MM-DD-YY format
 * @param dateString ISO date string or Date object
 * @returns Formatted date string (MM-DD-YY)
 */
export function formatDate(dateString: string | Date): string {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}-${day}-${year}`;
}
