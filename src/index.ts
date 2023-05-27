

import { reactive } from 'vue';
import App from './App.vue';
import { State, init } from './state';

export {
    State,
    Message,
    AnswerFlow,
    AnswerModel,
    Form,
    QuestionModel,
    ModelValue,
    MT,
    MV,
    ModelDisplay,
    stylevalidate,
    EXF,
    init,
} from './state';

export const state = reactive<State>(init());
export default App;