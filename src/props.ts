import { Schema } from 'jsonschema';


export type Props = {
    forms: Forms;
    start: string;
}

export type Forms = {
    [fid in string]: Form;
}

export type Form = {
    questions: Questions;
    /// expression string returns fid; form id
    goto?: EXPR;
}

export type Questions = {
    [qid in string]: Question;
}

export type Question = {
    caption: string;
    description?: string;
    input: Input;
    message?: InlineMessage[];
}


export type Input = {
    type: 'string';
    default?: string;
} | {
    type: 'number';
    default?: number;
    min?: number;
    max?: number;
    step?: number;
} | {
    type: 'boolean';
    default?: boolean;
} | {
    type: 'select';
    default?: string;
    candidates: string[];
}


export type InlineMessage = {
    text: string;
    color: string;
    /// expression string returns boolean
    where: EXPR;
}

export type EXPR = string;

// schemas

export const InlineMessageSchema: Schema = {
    type: 'object',
    required: ['text', 'color', 'where'],
    properties: {
        text: { type: 'string' },
        color: { type: 'string' },
        where: { type: 'string' }
    }
};


export const InputSchema: Schema = {
    anyOf: [
        {
            type: 'object',
            required: ['type'],
            properties: {
                type: { const: 'string' },
                default: { type: 'string' }
            }
        },
        {
            type: 'object',
            required: ['type'],
            properties: {
                type: { const: 'number' },
                default: { type: 'number' },
                min: { type: 'number' },
                max: { type: 'number' },
                step: { type: 'number' },
            }
        },
        {
            type: 'object',
            required: ['type'],
            properties: {
                type: { const: 'boolean' },
                default: { type: 'boolean' }
            }
        },
        {
            type: 'object',
            required: ['type', 'candidates'],
            properties: {
                type: { const: 'select' },
                default: { type: 'string' },
                candidates: {
                    type: 'array',
                    minItems: 1,
                    items: { type: 'string' }
                }
            }
        }
    ]
};

export const QuestionSchema: Schema = {
    type: 'object',
    required: ['caption', 'input'],
    properties: {
        caption: { type: 'string' },
        description: { type: 'string' },
        input: InputSchema,
        message: {
            type: 'array',
            items: InlineMessageSchema
        }
    }
};

export const QuestionsSchema: Schema = {
    type: 'object',
    additionalProperties: false,
    patternProperties: {
        '^[^ !@#$%^&*()-+={}[];<>?]+$': QuestionSchema
    },
};

export const FormSchema: Schema = {
    type: 'object',
    required: ['questions'],
    properties: {
        questions: QuestionsSchema,
        goto: { type: 'string' }
    }
};

export const FormsSchema: Schema = {
    type: 'object',
    additionalProperties: false,
    patternProperties: {
        '^[^ !@#$%^&*()-+={}[];<>?]+$': FormSchema
    },
};

export const PropsSchema: Schema = {
    type: 'object',
    required: ['forms', 'start'],
    properties: {
        forms: FormsSchema,
        start: { type: 'string' },
    }
};


export function initModel(forms: Forms) {
    const r: FormModel = {};
    for (const [fid, form] of Object.entries(forms)) {
        if (!r[fid]) {
            r[fid] = {};
        }
        for (const [qid, question] of Object.entries(form.questions)) {
            if (question.input.type === 'boolean') {
                r[fid][qid] = question.input.default ?? false;
            } else if (question.input.type === 'number') {
                r[fid][qid] = question.input.default ?? 0;
            } else if (question.input.type === 'select') {
                r[fid][qid] = question.input.default ?? question.input.candidates[0];
            } else if (question.input.type === 'string') {
                r[fid][qid] = question.input.default ?? '';
            }
        }
    }
    return r;
}

// models

export type FormModel = { [fid in string]: { [qid in string]: string | number | boolean } }