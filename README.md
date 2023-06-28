# my-simple-form

show simple form from your model.

## how to use


### declare template and data bindings

```
import MSF, { state } from 'my-simple-form';

// MSF is vue sfc for 'components' fields and puts <MSF/> into 'template'
...
components: { MSF }

...
<MSF/>

// get/set datas for your forms by reactive 'state' fields.
// set forms and identify question by 'fid' and 'model'.
// 'fid' represents field in forms key in case 'f1', 'f2'
// 'model' represents field in questions in case 'q1', 'q2',
state.forms = {
    'f1': {
        questions: {
            'q1': {
                caption: 'question 1',
                summary: 'summary 1',
                value: { type: 'text', init: 'a' },
                order: 0,
                placeholder: 'placeholder 1',
// 'style' field let this question styles 'enabled|disabled|required|hide'.
// 'enabled': enable user answer this question.
// 'disabled': gray out this question and show 'warn' message.
// 'required': red border this field and show 'warn message' and not to gray-out.
// 'hide': hide this question as user cannot touch.

// you can use special operands;
// - fid.model;     e.g. f1.q1, form1.question1
// - _util.date;    e.g. _util.date.isMatch(f1.q1, 'yyyy/MM/dd') 
//      - see. https://date-fns.org/v2.30.0/docs functions
// - _util.math:    e.g. _util.math.abs(f1.q1)
//      - see. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math functions
                style: { expr: parse(`f1.q1.length ? '{ "display" : "enabled" }' : '{ "display" : "required", "warn" : "question 1 should not to be empty !" }'`) },
            },
            'q2': {
                caption: 'question 2',
                summary: 'summary 2',
                value: { type: 'email', init: 'fuga@piyo' },
                order: 1,
                placeholder: 'placeholder 2',
                style: { expr: parse(`f1.q2.length ? '{ "display" : "enabled" }' : '{ "display" : "disabled", "warn" : "question 2 should not to be empty !" }'`) },
            },
            'q3': {
                caption: 'question 3',
                summary: 'summary 3',
                value: { type: 'check', init: true },
                order: 2,
                placeholder: 'placeholder 3',
                style: { expr: parse(`f1.q3 ? '{ "display" : "enabled" }' : '{ "display" : "hide", "warn" : "question 3 should not to be empty !" }'`) },
            },
            'q4': {
                caption: 'question 4',
                summary: 'summary 4',
                value: { type: 'number', init: 1 },
                order: 3,
                placeholder: 'placeholder 4',
                style: { expr: parse(`f1.q4 ? '{ "display" : "enabled" }' : '{ "display" : "required", "warn" : "question 4 should not to be empty !" }'`) },
            },
            'q5': {
                caption: 'question 5',
                summary: 'summary 5',
                value: { type: 'select', init: '', values: ['a', 'b', 'c'] },
                order: 4,
                placeholder: '(placeholder 5)',
                style: { expr: parse(`f1.q5 ? '{ "display" : "enabled" }' : '{ "display" : "required", "warn" : "question 5 should not to be empty !" }'`) },
            },
        },
// 'goto' field determs next form by 'fid'.
// this form displays 
//  - 'ok' button user go to its 'fid' if 'goto' is not empty
//  - 'done' button completes user all forms as can reach if 'goto' is empty
        goto: { expr: parse('f1.q3 ? "f2" : "f3"') }
    },

    'f2': {
        questions: {
            'q1': {
                caption: 'question 1',
                summary: 'summary 1',
                value: { type: 'text', init: 'a' },
                order: 0,
                placeholder: 'placeholder 1',
                style: { expr: parse(`f2.q1.length ? '{ "display" : "enabled" }' : '{ "display" : "required", "warn" : "question 1 should not to be empty !" }'`) },
            },
        },
        goto: { expr: parse('"f3"') }
    },

    'f3': {
        questions: {
            'q1': {
                caption: 'question 1',
                summary: 'summary 1',
                value: { type: 'text', init: 'a' },
                order: 0,
                placeholder: 'placeholder 1',
                style: { expr: parse(`f3.q1.length ? '{ "display" : "enabled" }' : '{ "display" : "required", "warn" : "question 1 should not to be empty !" }'`) },
            },
        }
    },
};
state.flow = {
// 'done' field puts your original message on complete all forms
    ...state.flow,
// 'pages' and 'current' field is pagination of forms user can reach
    pages: ['f1'], current: 0,
};

// 'model' field is user edits state.
// state.model['fid']['model'] are reactive values
state.model = {
    'f1': {
        'q1': '',
        'q2': '',
        'q3': false,
        'q4': 0,
        'q5': 'a',
    },
    'f2': {
        'q1': '',
    },
    'f3': {
        'q1': '',
    },
};
```

### events

```
// set event in template section
<MSF @change="(fid,model)=>..." @ok="fid=>..." ...


// declarations of events emitted from component
type E = {
  change(fid: string, model: string): void;
  ok(fid:string): void;
  done(fid:string): void;
  pagination(fid:string): void;
}
```

### store initial values 

```
import { modelinit } from 'my-simple-form';

// state.model will be initial value by state.forms.*.questions.*.value.init
modelinit();
```e
