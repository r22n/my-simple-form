import { parse } from 'expression-eval';
import { reactive } from 'vue';
import { Schema } from 'jsonschema';

export type States = { [instance in string]: State };

export type State = {
    forms: { [fid in string]: Form };
    model: AnswerModel;
    flow: AnswerFlow;
    message: Message;
};

export type Message = {
    warnings: string[];
    errors: string[];
};

export type AnswerFlow = {
    pages: string[];
    current: number;
};

export type AnswerModel = {
    [fid in string]: {
        [model in string]: MV;
    }
};

export type Form = {
    goto?: EXF<string>;
    questions: { [model in string]: QuestionModel };
};

export type QuestionModel = {
    order?: number;
    caption: string;
    summary?: string;
    value: ModelValue;
    placeholder?: string;
    style?: EXF<ModelDisplay>;
};

export type ModelValue = {
    type: 'text' | 'email';
    init?: string;
} | {
    type: 'check';
    init?: boolean;
} | {
    type: 'number';
    init?: number;
} | {
    type: 'select';
    init?: string;
    values: string[];
};
export type MT = 'text' | 'email' | 'check' | 'number' | 'select';
export type MV = string | number | boolean;

export type ModelDisplay = {
    display: 'disabled';
    warn?: string;
} | {
    display: 'enabled' | 'hide';
} | {
    display: 'required';
    warn?: string;
};

export const display: Schema = {
    anyOf: [
        {
            type: 'object',
            properties: {
                display: { enum: ['disabled', 'required'], required: true },
                warn: { type: 'string' },
            }
        },
        {
            type: 'object',
            properties: {
                display: { enum: ['enabled', 'hide'] }
            }
        }
    ]
};

export type EXF<T> = {
    expr: parse.Expression;
    eval?: T;
};

export const init = (): State => ({
    flow: { pages: [], current: -1 },
    forms: {},
    message: { warnings: [], errors: [] },
    model: {},
});

export default reactive<States>({});
