/**
 * Shared color utilities and constants
 * Centralized location for all color-related data to avoid duplication
 */

/**
 * Map of common CSS color names to hex values
 */
export const CSS_COLOR_MAP: Record<string, string> = {
    aliceblue: '#F0F8FF', antiquewhite: '#FAEBD7', aqua: '#00FFFF', aquamarine: '#7FFFD4', azure: '#F0FFFF',
    beige: '#F5F5DC', bisque: '#FFE4C4', black: '#000000', blanchedalmond: '#FFEBCD', blue: '#0000FF',
    blueviolet: '#8A2BE2', brown: '#A52A2A', burlywood: '#DEB887', cadetblue: '#5F9EA0', chartreuse: '#7FFF00',
    chocolate: '#D2691E', coral: '#FF7F50', cornflowerblue: '#6495ED', cornsilk: '#FFF8DC', crimson: '#DC143C',
    cyan: '#00FFFF', darkblue: '#00008B', darkcyan: '#008B8B', darkgoldenrod: '#B8860B', darkgray: '#A9A9A9',
    darkgreen: '#006400', darkkhaki: '#BDB76B', darkmagenta: '#8B008B', darkolivegreen: '#556B2F', darkorange: '#FF8C00',
    darkorchid: '#9932CC', darkred: '#8B0000', darksalmon: '#E9967A', darkseagreen: '#8FBC8F', darkslateblue: '#483D8B',
    darkslategray: '#2F4F4F', darkturquoise: '#00CED1', darkviolet: '#9400D3', deeppink: '#FF1493', deepskyblue: '#00BFFF',
    dimgray: '#696969', dodgerblue: '#1E90FF', firebrick: '#B22222', floralwhite: '#FFFAF0', forestgreen: '#228B22',
    fuchsia: '#FF00FF', gainsboro: '#DCDCDC', ghostwhite: '#F8F8FF', gold: '#FFD700', goldenrod: '#DAA520',
    gray: '#808080', grey: '#808080', green: '#008000', greenyellow: '#ADFF2F', honeydew: '#F0FFF0', hotpink: '#FF69B4',
    indianred: '#CD5C5C', indigo: '#4B0082', ivory: '#FFFFF0', khaki: '#F0E68C', lavender: '#E6E6FA',
    lavenderblush: '#FFF0F5', lawngreen: '#7CFC00', lemonchiffon: '#FFFACD', lightblue: '#ADD8E6', lightcoral: '#F08080',
    lightcyan: '#E0FFFF', lightgoldenrodyellow: '#FAFAD2', lightgray: '#D3D3D3', lightgreen: '#90EE90', lightpink: '#FFB6C1',
    lightsalmon: '#FFA07A', lightseagreen: '#20B2AA', lightskyblue: '#87CEFA', lightslategray: '#778899', lightsteelblue: '#B0C4DE',
    lightyellow: '#FFFFE0', lime: '#00FF00', limegreen: '#32CD32', linen: '#FAF0E6', magenta: '#FF00FF', maroon: '#800000',
    mediumaquamarine: '#66CDAA', mediumblue: '#0000CD', mediumorchid: '#BA55D3', mediumpurple: '#9370DB', mediumseagreen: '#3CB371',
    mediumslateblue: '#7B68EE', mediumspringgreen: '#00FA9A', mediumturquoise: '#48D1CC', mediumvioletred: '#C71585', midnightblue: '#191970',
    mintcream: '#F5FFFA', mistyrose: '#FFE4E1', moccasin: '#FFE4B5', navajowhite: '#FFDEAD', navy: '#000080',
    oldlace: '#FDF5E6', olive: '#808000', olivedrab: '#6B8E23', orange: '#FFA500', orangered: '#FF4500',
    orchid: '#DA70D6', palegoldenrod: '#EEE8AA', palegreen: '#98FB98', paleturquoise: '#AFEEEE', palevioletred: '#DB7093',
    papayawhip: '#FFEFD5', peachpuff: '#FFDAB9', peru: '#CD853F', pink: '#FFC0CB', plum: '#DDA0DD',
    powderblue: '#B0E0E6', purple: '#800080', rebeccapurple: '#663399', red: '#FF0000', rosybrown: '#BC8F8F',
    royalblue: '#4169E1', saddlebrown: '#8B4513', salmon: '#FA8072', sandybrown: '#F4A460', seagreen: '#2E8B57',
    seashell: '#FFF5EE', sienna: '#A0522D', silver: '#C0C0C0', skyblue: '#87CEEB', slateblue: '#6A5ACD',
    slategray: '#708090', snow: '#FFFAFA', springgreen: '#00FF7F', steelblue: '#4682B4', tan: '#D2B48C',
    teal: '#008080', thistle: '#D8BFD8', tomato: '#FF6347', turquoise: '#40E0D0', violet: '#EE82EE',
    wheat: '#F5DEB3', white: '#FFFFFF', whitesmoke: '#F5F5F5', yellow: '#FFFF00', yellowgreen: '#9ACD32'
};

/**
 * Classic color palette (subset of CSS colors)
 * Generated from CSS_COLOR_MAP to maintain single source of truth
 */
export const CLASSIC_COLORS: { name: string; hex: string }[] = [
    { name: 'Red', hex: CSS_COLOR_MAP.red },
    { name: 'Blue', hex: CSS_COLOR_MAP.blue },
    { name: 'Green', hex: CSS_COLOR_MAP.green },
    { name: 'Yellow', hex: CSS_COLOR_MAP.yellow },
    { name: 'Orange', hex: CSS_COLOR_MAP.orange },
    { name: 'Purple', hex: CSS_COLOR_MAP.purple },
    { name: 'Pink', hex: CSS_COLOR_MAP.pink },
    { name: 'Teal', hex: CSS_COLOR_MAP.teal },
    { name: 'Cyan', hex: CSS_COLOR_MAP.cyan },
    { name: 'Magenta', hex: CSS_COLOR_MAP.magenta },
    { name: 'Gray', hex: CSS_COLOR_MAP.gray },
    { name: 'Black', hex: CSS_COLOR_MAP.black },
    { name: 'White', hex: CSS_COLOR_MAP.white },
    { name: 'Brown', hex: CSS_COLOR_MAP.brown },
    { name: 'Indigo', hex: CSS_COLOR_MAP.indigo },
    { name: 'Violet', hex: CSS_COLOR_MAP.violet },
    { name: 'Gold', hex: CSS_COLOR_MAP.gold },
    { name: 'Silver', hex: CSS_COLOR_MAP.silver },
    { name: 'Navy', hex: CSS_COLOR_MAP.navy },
    { name: 'Maroon', hex: CSS_COLOR_MAP.maroon }
];

/**
 * Reverse lookup map: hex to color name
 */
export const HEX_TO_NAME: Record<string, string> = Object.keys(CSS_COLOR_MAP).reduce((acc, key) => {
    const hex = CSS_COLOR_MAP[key].toUpperCase();
    // Prefer US spelling when duplicate (grey/gray)
    if (!acc[hex] || key === 'gray') {
        acc[hex] = key;
    }
    return acc;
}, {} as Record<string, string>);

/**
 * Convert hex color to human-readable color name
 * @param hex Hex color code (e.g., "#FF0000")
 * @returns Color name with first letter capitalized, or undefined if not found
 */
export function hexToName(hex: string): string | undefined {
    if (!hex) return undefined;
    const normalized = hex.trim().toUpperCase();
    const name = HEX_TO_NAME[normalized];
    return name ? name.charAt(0).toUpperCase() + name.slice(1) : undefined;
}

/**
 * Normalize hex color input (handles various formats)
 * @param input Color input (hex, color name, etc.)
 * @returns Normalized hex color or undefined if invalid
 */
export function normalizeHex(input: string): string | undefined {
    if (!input) return undefined;
    
    const trimmed = input.trim().toLowerCase();
    
    // Check if it's a named color
    if (CSS_COLOR_MAP[trimmed]) {
        return CSS_COLOR_MAP[trimmed];
    }
    
    // Check if it's already a hex color
    if (/^#[0-9a-f]{6}$/i.test(trimmed)) {
        return trimmed.toUpperCase();
    }
    
    // Try adding # prefix
    if (/^[0-9a-f]{6}$/i.test(trimmed)) {
        return '#' + trimmed.toUpperCase();
    }
    
    return undefined;
}
