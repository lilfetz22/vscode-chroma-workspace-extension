import * as fs from 'fs';
import * as path from 'path';
import { normalizeHex } from './colors';

// Cache generated composite icons in memory to avoid regenerating
const compositeCache: Record<string, string> = {};

function getIconDir(): string {
    // Generate into workspace/dist-safe relative folder under extension root
    // __dirname at runtime for compiled JS will be .../out/src/utils
    const base = path.join(__dirname, '..', '..', '..', 'generated-icons');
    if (!fs.existsSync(base)) {
        try { fs.mkdirSync(base, { recursive: true }); } catch { /* ignore */ }
    }
    return base;
}

// Minimal Tailwind-like color mapping for common 500 shades
const TW_500_MAP: Record<string, string> = {
    red: '#EF4444', blue: '#3B82F6', green: '#22C55E', yellow: '#EAB308',
    orange: '#F97316', indigo: '#6366F1', violet: '#8B5CF6', purple: '#A855F7',
    pink: '#EC4899', fuchsia: '#C026D3', teal: '#14B8A6', cyan: '#06B6D4',
    sky: '#0EA5E9', lime: '#65A30D', emerald: '#10B981', rose: '#F43F5E',
    amber: '#F59E0B', slate: '#64748B', gray: '#6B7280', neutral: '#737373',
    stone: '#78716C', zinc: '#71717A'
};

function parseTailwindColor(input: string): string | undefined {
    const s = input.trim().toLowerCase();
    // patterns: "bg-blue-500", "text-blue-500", "blue-500"
    const m = s.match(/(?:^|\b)(?:bg-|text-)?([a-z]+)-(\d{2,3})(?:\b|$)/);
    if (!m) return undefined;
    const base = m[1];
    const shade = m[2];
    if (shade !== '500') return undefined; // support 500 only for now
    return TW_500_MAP[base];
}

function normalizeColor(input: string): string {
    // Try Tailwind-like class parsing first
    const tw = parseTailwindColor(input);
    if (tw) return tw.toUpperCase();
    const normalized = normalizeHex(input);
    // fallback sanitize if normalizeHex couldn't resolve
    return (normalized || input.replace(/[^0-9a-fA-F#]/g, '').toUpperCase());
}

export function ensureSingleColorIcon(hex: string): string {
    const color = normalizeColor(hex);
    // Validate final color strictly as hex #RRGGBB; if invalid, skip icon
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
        return '';
    }
    const iconDir = getIconDir();
    const fileName = `tag-${color.replace('#','')}.svg`;
    const filePath = path.join(iconDir, fileName);
    if (!fs.existsSync(filePath)) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" rx="3" fill="${color}" stroke="${color}"/></svg>`;
        try { fs.writeFileSync(filePath, svg); } catch { /* ignore */ }
    }
    return filePath;
}

export function generateTagCompositeIcon(colors: string[]): string | undefined {
    if (!colors || colors.length === 0) return undefined;
    const sanitized = colors
        .map(normalizeColor)
        .filter(c => /^#[0-9A-F]{6}$/i.test(c))
        .slice(0, 6); // cap at 6 for clarity
    if (sanitized.length === 0) return undefined;
    const key = sanitized.join('_');
    if (compositeCache[key]) return compositeCache[key];
    const iconDir = getIconDir();
    const fileName = `tags-${key.replace(/#/g,'')}.svg`;
    const filePath = path.join(iconDir, fileName);
    if (!fs.existsSync(filePath)) {
        // Create a horizontal row of small squares
        const size = 16;
        const pad = 1;
        const cell = (size - (pad * (sanitized.length + 1))) / sanitized.length;
        const rects = sanitized.map((c, i) => {
            const x = pad + i * (cell + pad);
            return `<rect x="${x}" y="3" width="${cell}" height="10" rx="2" fill="${c}" stroke="${c}"/>`;
        }).join('');
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">${rects}</svg>`;
        try { fs.writeFileSync(filePath, svg); } catch { /* ignore */ }
    }
    compositeCache[key] = filePath;
    return filePath;
}
