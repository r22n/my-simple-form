import { createApp } from 'vue'
import App from './App.vue'
import states, { init } from './state';
import { parse } from 'expression-eval';

const instance = 'sample-application';
const state = init();
state.forms = {
    'f1': {
        questions: {
            'q1': {
                caption: 'question 1',
                summary: 'summary 1',
                value: { type: 'text', init: 'hoge' },
                order: 0,
                placeholder: 'placeholder 1',
                style: { expr: parse(`f1.q1.length ? '{ "display" : "enabled" }' : '{ "display" : "required", "warn" : "question 1 should not to be empty !" }'`) },
            },
            'q2': {
                caption: 'question 2',
                summary: 'summary 2',
                value: { type: 'email', init: 'fuga@piyo' },
                order: 1,
                placeholder: 'placeholder 2',
                style: { expr: parse(`f1.q2.length ? '{ "display" : "enabled" }' : '{ "display" : "required", "warn" : "question 1 should not to be empty !" }'`) },
            },
            'q3': {
                caption: 'question 3',
                summary: 'summary 3',
                value: { type: 'check', init: true },
                order: 2,
                placeholder: 'placeholder 3',
                style: { expr: parse(`f1.q3 ? '{ "display" : "enabled" }' : '{ "display" : "required", "warn" : "question 1 should not to be empty !" }'`) },
            },
            'q4': {
                caption: 'question 4',
                summary: 'summary 4',
                value: { type: 'number', init: 0 },
                order: 3,
                placeholder: 'placeholder 4',
                style: { expr: parse(`f1.q4 ? '{ "display" : "enabled" }' : '{ "display" : "required", "warn" : "question 1 should not to be empty !" }'`) },
            },
            'q5': {
                caption: 'question 5',
                summary: 'summary 5',
                value: { type: 'select', init: 'a', values: ['a', 'b', 'c'] },
                order: 4,
                placeholder: 'placeholder 5',
                style: { expr: parse(`f1.q5 ? '{ "display" : "enabled" }' : '{ "display" : "required", "warn" : "question 1 should not to be empty !" }'`) },
            },
        }
    }
};
state.flow = { pages: ['f1'], current: 0 };
state.model = {
    'f1': {
        'q1': '',
        'q2': '',
        'q3': false,
        'q4': 0,
        'q5': 'a',
    },

};


states[instance] = state;


createApp(App, { instance }).mount('#app')

