import * as vscode from 'vscode';
import { createTag, getAllTags, updateTag, deleteTag, addTagToCard, removeTagFromCard, getTagsByCardId } from '../src/database';

// Classic color set and common CSS color names mapping to hex
const CSS_COLOR_MAP: Record<string, string> = {
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

const CLASSIC_COLORS: { name: string; hex: string }[] = [
    { name: 'Red', hex: '#FF0000' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Green', hex: '#008000' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Teal', hex: '#008080' },
    { name: 'Cyan', hex: '#00FFFF' },
    { name: 'Magenta', hex: '#FF00FF' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Brown', hex: '#A52A2A' },
    { name: 'Indigo', hex: '#4B0082' },
    { name: 'Violet', hex: '#EE82EE' },
    { name: 'Gold', hex: '#FFD700' },
    { name: 'Silver', hex: '#C0C0C0' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Maroon', hex: '#800000' }
];

function normalizeHex(input: string): string | undefined {
    const v = input.trim().replace(/^#/,'');
    if (/^[0-9a-fA-F]{3}$/.test(v)) {
        const r = v[0]; const g = v[1]; const b = v[2];
        return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
    }
    if (/^[0-9a-fA-F]{6}$/.test(v)) {
        return `#${v}`.toUpperCase();
    }
    return undefined;
}

function nameToHex(name: string): string | undefined {
    const key = name.trim().toLowerCase();
    return CSS_COLOR_MAP[key];
}

async function promptForCustomColor(initial?: string): Promise<string | undefined> {
    const value = await vscode.window.showInputBox({
        prompt: 'Enter color name or hex (e.g., blue or #ff0000)',
        value: initial,
        validateInput: (text: string) => {
            if (normalizeHex(text) || nameToHex(text)) return undefined;
            return 'Enter a valid CSS color name or #RRGGBB';
        }
    });
    if (!value) return undefined;
    return normalizeHex(value) || nameToHex(value);
}

async function pickColor(initial?: string): Promise<string | undefined> {
    const items: (vscode.QuickPickItem & { hex?: string; kind: 'classic' | 'custom' })[] = [
        ...CLASSIC_COLORS.map(c => ({ label: c.name, description: c.hex, hex: c.hex, kind: 'classic' as const })),
        { label: 'Custom color…', description: 'Type a color name or hex', kind: 'custom' as const }
    ];

    const pick = await vscode.window.showQuickPick(items, { placeHolder: 'Pick a color or choose Custom' });
    if (!pick) return undefined;
    if (pick.kind === 'classic' && pick.hex) return pick.hex;
    return promptForCustomColor(initial);
}

async function addTag() {
    const name = await vscode.window.showInputBox({ prompt: 'Enter tag name' });
    if (!name) {
        return;
    }
    const color = await pickColor();
    if (!color) {
        return;
    }
    createTag({ name, color });
}

async function editTag(tag) {
    const newName = await vscode.window.showInputBox({ value: tag.name, prompt: 'Enter new tag name' });
    if (!newName) {
        return;
    }
    const newColor = await pickColor(tag.color);
    if (!newColor) {
        return;
    }
    updateTag({ id: tag.id, name: newName, color: newColor });
}

async function deleteTagWithConfirmation(tag) {
    const confirm = await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: `Are you sure you want to delete the tag "${tag.name}"?` });
    if (confirm === 'Yes') {
        deleteTag(tag.id);
    }
}

async function assignTag(card) {
    const cardId = card?.id || card?.cardId;
    if (!cardId) {
        vscode.window.showErrorMessage('Unable to assign tag: Missing card id.');
        return;
    }
    const tags = getAllTags();
    if (tags.length === 0) {
        vscode.window.showInformationMessage('No tags available. Please create a tag first.');
        return;
    }
    const tagNames = tags.map(t => t.name);
    const tagName = await vscode.window.showQuickPick(tagNames, { placeHolder: 'Select a tag to assign' });
    if (tagName) {
        const tag = tags.find(t => t.name === tagName);
        if (tag) {
            // Check if tag is already assigned
            const assignedTags = getTagsByCardId(cardId);
            const alreadyAssigned = assignedTags.some(t => t.id === tag.id);
            if (alreadyAssigned) {
                vscode.window.showInformationMessage(`Tag "${tag.name}" is already assigned to this card.`);
                return;
            }
            try {
                addTagToCard(cardId, tag.id);
            } catch (err) {
                vscode.window.showErrorMessage(`Failed to assign tag: ${err.message || err}`);
            }
        }
    }
}

async function removeTag(card) {
    const cardId = card?.id || card?.cardId;
    if (!cardId) {
        vscode.window.showErrorMessage('Unable to remove tag: Missing card id.');
        return;
    }
    const tags = getTagsByCardId(cardId);
    const tagNames = tags.map(t => t.name);
    if (tags.length === 0) {
        vscode.window.showInformationMessage('This card has no tags to remove.');
        return;
    }
    const tagName = await vscode.window.showQuickPick(tagNames, { placeHolder: 'Select a tag to remove' });
    if (tagName) {
        const tag = tags.find(t => t.name === tagName);
        if (tag) {
            removeTagFromCard(cardId, tag.id);
        }
    }
}

export { addTag, editTag, deleteTagWithConfirmation as deleteTag, assignTag, removeTag };
