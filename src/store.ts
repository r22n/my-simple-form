import { parse } from 'expression-eval';
import { createStore } from 'vuex';
import { Schema } from 'jsonschema';

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
    touch: AnswerTouch;
};

export type AnswerTouch = {
    display: 'input' | 'done';
    done: CompMsg;
}
export type CompMsg = {
    title: string;
    caption: string;
    summary: string;
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

export const stylevalidate: Schema = {
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
    flow: { pages: [], current: -1, touch: { display: 'input', done: { title: 'Complete', caption: 'Thank you for input', summary: 'Please answer other form if you mind.' } } },
    forms: {},
    message: { warnings: [], errors: [] },
    model: {},
});

export const store = createStore<State>({
    state: init,
    mutations: {
        start(s, fid: string) {
            const f = s.flow;
            f.pages = [fid];
            f.current = 0;
            f.touch.display = 'input';
        },
        compmsg(s, msg: CompMsg) {
            s.flow.touch.done = msg;
        },
        quit(s) {
            s.flow.touch.display = 'done';
        },
        addform(s, p: { fid: string, form: Form }) {
            s.forms[p.fid] = p.form;
        },
        rmform(s, fid: string) {
            delete s.forms[fid];
            const f = s.flow;
            const c = f.pages.indexOf(fid);
            if (c !== -1) {
                f.pages = f.pages.slice(0, c);
                f.current = c - 1;
            }
        },
        model(s, p: AnswerModel) {
            s.model = p;
        },
    }
});
