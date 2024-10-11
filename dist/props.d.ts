import { Schema } from 'jsonschema';
export type Props = {
    forms: Forms;
    start: string;
};
export type Forms = {
    [fid in string]: Form;
};
export type Form = {
    questions: Questions;
    goto?: EXPR;
};
export type Questions = {
    [qid in string]: Question;
};
export type Question = {
    caption: string;
    description?: string;
    input: Input;
    message?: InlineMessage[];
};
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
};
export type InlineMessage = {
    text: string;
    color: string;
    where: EXPR;
};
export type EXPR = string;
export declare const InlineMessageSchema: Schema;
export declare const InputSchema: Schema;
export declare const QuestionSchema: Schema;
export declare const QuestionsSchema: Schema;
export declare const FormSchema: Schema;
export declare const FormsSchema: Schema;
export declare const PropsSchema: Schema;
export declare function initModel(forms: Forms): FormModel;
export type FormModel = {
    [fid in string]: {
        [qid in string]: string | number | boolean;
    };
};
