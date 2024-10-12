# config

the simple form for vue3

```
<script setup lang="ts">
import { App, Forms } from 'my-simple-form';

const forms: Forms = {
    form01: {
        questions: {
            question01: {
                caption: 'what your name ?',
                description: 'input your first name',
                input: { type: 'string' },
                message: [
                    { color: 'red', text: 'name should not be empty', where: 'form01.question01 == ""' },
                    { color: 'green', text: 'ok', where: 'length(form01.question01) > 2'},
                ]
            }
        }
    }
};

const start = 'form01';

function done() {
    // done button clicked
}

function ok() {
    // ok button clicked
}

const model = reactive({
    form01: {
        question01: 'default'
    }
});

</script>

<template>
    <App
        :forms="forms"
        :start="start"
        v-model="model"
        @done="done"
        @ok="ok"
    />
</template>

```