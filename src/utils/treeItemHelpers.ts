/**
 * Helper utilities for TreeItem display formatting
 */

/**
 * Split a long title into label and description for better display in tree views.
 * Since VS Code tree views truncate long labels with ellipsis, this function splits
 * the text to utilize both the label and description fields.
 * 
 * @param text The full text to display
 * @param maxLabelLength Maximum characters for the label before splitting (default: 40)
 * @returns Object with label and description properties
 */
export function splitLongText(text: string, maxLabelLength: number = 40): { label: string; description?: string } {
    if (text.length <= maxLabelLength) {
        return { label: text };
    }

    // Try to split at a word boundary
    let splitPoint = maxLabelLength;
    const beforeSpace = text.lastIndexOf(' ', maxLabelLength);
    const beforePunctuation = Math.max(
        text.lastIndexOf(',', maxLabelLength),
        text.lastIndexOf('.', maxLabelLength),
        text.lastIndexOf(';', maxLabelLength),
        text.lastIndexOf(':', maxLabelLength)
    );

    // Use the best split point (prefer punctuation, then space, then hard cut)
    if (beforePunctuation > maxLabelLength * 0.6) {
        splitPoint = beforePunctuation + 1;
    } else if (beforeSpace > maxLabelLength * 0.6) {
        splitPoint = beforeSpace;
    }

    const label = text.substring(0, splitPoint).trim();
    const description = text.substring(splitPoint).trim();

    return { label, description };
}
