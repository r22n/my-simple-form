import { createApp } from 'vue'
import App from './App.vue'
import { Props } from './props'

const props: Props = {
    start: 'f1',
    forms: {
        f1: {
            goto: 'f1.q1 > 0 ? "f2" : "f3"',
            questions: {
                q1: {
                    caption: 'form1 question1',
                    description:'description f1.q1',
                    input:{ 
                        type: 'number',
                        default: -1,
                    },
                    message: [
                        { color: 'red', text: 'should be greater than -2', where: 'f1.q1 <= -2' }
                    ]
                }
            }
        },
        f2:{
            goto: '"f3"',
            questions:{
                q1:{
                    caption:'form2 question1',
                    description:'description f2.q1',
                    input:{
                        type:'boolean',
                    }
                }
            }
        },
        f3:{
            questions: {
                q1:{
                    caption:'form3 question1',
                    description:'description f3.q1',
                    input:{
                        type:'select',
                        candidates:[
                            'a','b','c'
                        ]
                    }
                }
            }
        }
    }
}

createApp(App, props).mount('#app')
