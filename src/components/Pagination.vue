<template>
    <nav class="overflow-auto">
        <ul class="pagination">
            <li :class="`page-item ${i === model && 'active'}`" v-for="page, i in props.pages">
                <a :class="`page-link`" @click="model = i">{{ page }}</a>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">

const props = defineProps<{ pages: string[] }>();
const model = defineModel({ default: 0 });

</script>