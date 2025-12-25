/**
 * Formats technical model names into user-friendly names for display.
 */
export function formatModelName(name: string): string {
    const lowerName = name.toLowerCase();

    // Exact matches or specific prefixes
    if (lowerName.includes('gemini-3-pro-high')) return 'Gemini 3 Pro';
    if (lowerName.includes('gemini-3-flash')) return 'Gemini 3 Flash';
    if (lowerName.includes('gemini-3-pro-image')) return 'Gemini 3 Image';
    if (lowerName.includes('claude-sonnet-4-5')) return 'Claude 4.5';
    if (lowerName.includes('claude-opus')) return 'Claude Opus';
    if (lowerName.includes('claude-haiku')) return 'Claude Haiku';

    // Fallback formatting for unknown models
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
