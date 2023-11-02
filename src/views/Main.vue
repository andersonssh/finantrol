<template>
    <div class="h-full pt-16 pb-24 pl-10 pr-10 overflow-y-auto bg-yellow-500">
        <div class="text-5xl text-center mt-10 mb-10">
            total: {{ exit }}
        </div>
        <Register />
    </div>
    <div class="absolute bottom-0 w-full bg-red-500 text-center">
        x
    </div>

    
</template>

<script lang="ts">
import Register from '../components/Cards/Register.vue';
export default {
    name: 'Main',
    data() {
        return {
            registers: [],

            total: 100,
            entry: 200,
            exit: 100
        }
    },
    components: {
        Register
    }
}
</script>