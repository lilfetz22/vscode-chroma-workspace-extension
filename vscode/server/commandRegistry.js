// Source of truth for which VS Code commands the local HTTP API exposes,
// and what parameters each accepts. Drives both GET /commands (discovery
// for LLM callers) and POST /commands/:id validation.
//
// param.type is one of: 'string' | 'number' | 'boolean' | 'string[]'

const EXPOSED_COMMANDS = [
  {
    id: 'chroma.addBoard',
    description: 'Create a new Kanban board.',
    params: [
      { name: 'title', type: 'string', required: true },
    ],
  },
  {
    id: 'chroma.addCard',
    description: 'Create a new card in a column.',
    params: [
      { name: 'columnId', type: 'string', required: true },
      { name: 'title', type: 'string', required: true },
      { name: 'content', type: 'string', required: false },
      { name: 'position', type: 'number', required: false },
      { name: 'tagIds', type: 'string[]', required: false },
    ],
  },
  {
    id: 'chroma.editCard',
    description: 'Edit an existing card.',
    params: [
      { name: 'cardId', type: 'string', required: true },
      { name: 'title', type: 'string', required: false },
      { name: 'content', type: 'string', required: false },
      { name: 'tagIds', type: 'string[]', required: false },
    ],
  },
  {
    id: 'chroma.moveCard',
    description: 'Move a card to a different column / position.',
    params: [
      { name: 'cardId', type: 'string', required: true },
      { name: 'columnId', type: 'string', required: true },
      { name: 'position', type: 'number', required: false },
    ],
  },
  {
    id: 'chroma.deleteCard',
    description: 'Delete a card.',
    params: [
      { name: 'cardId', type: 'string', required: true },
    ],
  },
  {
    id: 'chroma.addTask',
    description: 'Create a new scheduled task.',
    params: [
      { name: 'title', type: 'string', required: true },
      { name: 'description', type: 'string', required: false },
      { name: 'dueDate', type: 'string', required: true },
      { name: 'recurrence', type: 'string', required: false },
      { name: 'boardId', type: 'string', required: false },
      { name: 'tagIds', type: 'string[]', required: false },
    ],
  },
  {
    id: 'chroma.completeTask',
    description: 'Mark a scheduled task as completed.',
    params: [
      { name: 'taskId', type: 'string', required: true },
    ],
  },
  {
    id: 'chroma.deleteTask',
    description: 'Delete a scheduled task.',
    params: [
      { name: 'taskId', type: 'string', required: true },
    ],
  },
];

const COMMAND_INDEX = new Map(EXPOSED_COMMANDS.map((c) => [c.id, c]));

function listCommands() {
  return EXPOSED_COMMANDS;
}

function getCommandSpec(id) {
  return COMMAND_INDEX.get(id);
}

function validateArgs(spec, body) {
  const args = body && typeof body === 'object' ? body : {};
  const errors = [];
  const allowedKeys = new Set(spec.params.map((p) => p.name));
  for (const key of Object.keys(args)) {
    if (!allowedKeys.has(key)) {
      errors.push(`unknown param: ${key}`);
    }
  }
  for (const p of spec.params) {
    const present = Object.prototype.hasOwnProperty.call(args, p.name) && args[p.name] !== null && args[p.name] !== undefined;
    if (p.required && !present) {
      errors.push(`missing required param: ${p.name}`);
      continue;
    }
    if (!present) continue;
    const v = args[p.name];
    if (p.type === 'string' && typeof v !== 'string') errors.push(`${p.name} must be a string`);
    else if (p.type === 'number' && typeof v !== 'number') errors.push(`${p.name} must be a number`);
    else if (p.type === 'boolean' && typeof v !== 'boolean') errors.push(`${p.name} must be a boolean`);
    else if (p.type === 'string[]') {
      if (!Array.isArray(v) || v.some((x) => typeof x !== 'string')) {
        errors.push(`${p.name} must be an array of strings`);
      }
    }
  }
  return errors;
}

module.exports = { listCommands, getCommandSpec, validateArgs };
