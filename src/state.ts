import { parse } from 'expression-eval';
import { reactive } from 'vue';
import { Schema } from 'jsonschema';

export type State = {
    /**
     * - user input and forms structure
     *      - user interact with single form and input answer for question called model.
     *      - form have 'fid' and question have 'model' by string.
     *      - form's 'ok'/'done' button navigate user next form 'goto' field.
     *          - 'done' button goto complete screen if 'goto' is empty or null
     *          - otherwise, 'ok' button goes to 'goto' form as next form
     * - this field reprents formid; 'fid' and forms pairs
     *      - puts your forms into this fields.
     *      - 'fid' requires /^[^. ;()[]<>-+\*-=@#$%^&*!?{}"'~]+$/ also you can check `fmid`
     *      - if 'fid' exceeded this rule, form behavior is unspecified.
     * - forms can chain by conditional flow.
     *      - see 'goto' in 'Form' type.
     *      - you can set first form by 'flow' field in 'AnswerFlow' type. 
     * @see Form
     * @see AnswerFlow
     * @see fmid
     */
    forms: { [fid in string]: Form };

    /**
     * - get/set user input in question of form
     *      - model['fid']['model'] represents value of field such as text-field user can interact
     * - model field will be set initial value on mounted
     *      - `forms['fid'].questions['model'].value.init` puts inital value
     *          - if its field was undefined, gives default value instead
     *      - default value is '', false, 0 each 'type' field
     *          - 'text|email|select': '' (empty string)
     *          - 'checkbox': false 
     *          - 'number': 0
     *      - 'model' string rule is same with 'fid'.
     */
    model: AnswerModel;

    /**
     * - get current form flow and set initial form.
     *      - flow get by 'goto' and 'ok' button shows 'pages' field as pagination.
     *      - 'pages' can go before page as history.
     *      - old history in 'pages' can change 'goto', so 'pages' cut out in different its position.
     * - set initial form user sees as first by;
     *      - `flow.pages = ['fid']; flow.current = 0;`
     * - get user form transitions by;
     *      - `flow.pages`: f1  f2  f3  f4(flow.current)  f5
     *      - `flow.current`: pagination and transition history position in 'pages'
     *      - e.g. user get 'f2' 'f3' and navigate to 'f2' after 'f3' by pagination, and goto of 'f2' changed by model
     *          - pages: f2, current: 0
     *          - pages: f2 f3, current: 1
     *          - pages: f2 f3, current: 0
     *          - pages: f2, current: 0
     */
    flow: AnswerFlow;

    /**
     * components reports warnings and errors into this field
     */
    message: Message;
};

export type Message = {
    warnings: string[];
    errors: string[];
};

export type AnswerFlow = {
    /**
     * - transition and form history pagination.
     *      - gives 'fid' string this field
     * - this filed shows pagination as 'fid' array.
     *      - 'current' history includes old history pagination will highlight
     * 
     * @see current
     */
    pages: string[];

    /**
     * pagination position in 'pages' field.
     * 
     * @see pages
     */
    current: number;

    /**
     * controls form shows questions or complete screen
     */
    touch: AnswerTouch;
};

export type AnswerTouch = {
    /**
     * - 'input' shows form and questions
     *      - requires `state.forms['fid']`, `state.flow.pages` and its `current` position
     * - 'done' shows complete screen
     *      - message will appear by `done` field.
     * 
     * @see done
     */
    display: 'input' | 'done';

    /**
     * complete screen displays this message on 'display' is 'done'
     * 
     * @see display
     */
    done: {
        title: string;
        caption: string;
        summary: string;
    };
}

export type AnswerModel = {
    [fid in string]: {
        [model in string]: MV;
    }
};

export type Form = {
    /**
     * - get next form and create form flow conditionally.
     *      - 'goto' shows 'ok' button to next form if string was length 1+  
     *      - otherwise, 'done' button to complete screen 
     * - goto should be 'fid' string
     *      - case-sensitive and space-sensitive
     *      - if 'fid' form was not found, displays 'ok' button however its behavior is unspecified
     * - expr can use model object 
     *      - e.g.1. `fid.model > 20 ? "f1" :"f2"`
     *      - e.g.2. `you.like_apple  ? "apple" :"google"`
     *          - conditional form branching and stack history next form to 'pages' as history
     *      - e.g.3. `"next_form"`
     *          - go next_form by 'fid' from this form
     *      - e.g.4. null or empty
     *          - this form is terminal and displays 'done' button
     */
    goto?: EXF<string>;

    /**
     * - displays questions.
     * - 'model' string and 'fid' string combination can identify user input value
     *      - e.g. `state.model['fid']['model'] = 1` 
     */
    questions: { [model in string]: QuestionModel };
};

export type QuestionModel = {
    /**
     * - sort and display questions by asscending order.
     * - sort order is unspecified if undefined
     */
    order?: number;

    /**
     * caption string shows question text what you want to ask to user
     */
    caption: string;

    /**
     * summary string you want to describe about caption
     */
    summary?: string;

    /**
     * - answer text-field type you want to restirct
     * - 'select' field has empty value as combobox even if placeholder was empty or undefined.
     */
    value: ModelValue;

    /**
     * - placehodler string while text-field empty.
     * - label next to checkbox if 'type' was 'check' always display placeholder string
     * - otherwise, displays placehodler while text-field is empty 
     */
    placeholder?: string;

    /**
     * - inline script for field validations
     *      - 'enabled': user can input value into this text-field
     *      - 'disabled': text-field grays out and user cannot interact with this
     *      - 'required': text-field reds border, 'ok'/'done' button will be disabled, and user can interact
     *      - 'hide': hides all elements includes caption, summary of this question
     * - 'style' should be JSON string of 'ModelDisplay' type.
     *      - JSON string not match 'ModelDisplay' type shows unspecified
     *      - otherwise, apply style into this question
     * - default value is 'enabled' if style was null.
     * - expr can use model object 
     *      - e.g.1. `fid.model < 20 ? '{ "display":"required", "warn": "you cannot use this site: this value should be over 20+"}' : null`
     *      - e.g.2. `you.like_apple  ? '{ "display": "hide" }' : null`
     *          - conditional question validation and display 
     *      - e.g.3. `'{ "display": "required" }'`
     *          - always requires user input this text-field even if user answered anything
     *      - e.g.4. null or undefined
     *          - same with `'{ "display": "enabled" }'`
     * @see ModelDisplay
     */
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
    display: 'disabled' | 'required';
    warn?: string;
} | {
    display: 'enabled' | 'hide';
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
    eval?: T | null;
};

export const init = (): State => ({
    flow: { pages: [], current: -1, touch: { display: 'input', done: { title: 'Complete', caption: 'Thank you for input', summary: 'Please answer other form if you mind.' } } },
    forms: {},
    message: { warnings: [], errors: [] },
    model: {},
});

export const fmid = /^[^\.\ \;\(\)\[\]\<\>\-\+\*\/\=\@\#\$\%\^\&\*\!\?\{\}\"\'\~]+$/;

export const state = reactive<State>(init());
