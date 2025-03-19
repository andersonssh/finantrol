<template>
    <div class="relative text-lg w-3 z-10">
        <button
            class="flex items-center justify-between bg-inherit w-full"
            @click="isOptionsExpanded = !isOptionsExpanded"
            @blur="isOptionsExpanded = false"
        >
            <i class="fa-solid fa-ellipsis-vertical text-white text-2xl"></i>
        </button>
        <transition
            enter-active-class="transform transition duration-500 ease-custom"
            enter-class="-translate-y-1/2 scale-y-0 opacity-0"
            enter-to-class="translate-y-0 scale-y-100 opacity-100"
            leave-active-class="transform transition duration-300 ease-custom"
            leave-class="translate-y-0 scale-y-100 opacity-100"
            leave-to-class="-translate-y-1/2 scale-y-0 opacity-0"
        >
            <ul
                v-show="isOptionsExpanded"
                class="absolute right-0 top-full mt-2 bg-white divide-y rounded-lg shadow-lg overflow-hidden z-50"
            >
                <li
                    class="px-3 py-2 transition-colors duration-300 hover:bg-gray-200 hover:cursor-pointer"
                    @mousedown.prevent="setOption('edit')"
                >
                    Editar
                </li>
                <li
                    class="px-3 py-2 transition-colors duration-300 hover:bg-gray-200 hover:cursor-pointer"
                    @mousedown.prevent="setOption('delete')"
                >
                    Excluir
                </li>
            </ul>
        </transition>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    data() {
        return {
            isOptionsExpanded: false,
        };
    },
    emits: ["edit", "delete"],
    methods: {
        setOption(option: String) {
            if (option === "delete") this.$emit("delete");
            if (option === "edit") this.$emit("edit");
            this.isOptionsExpanded = false;
        },
    },
});
</script>

<style>
.ease-custom {
    transition-timing-function: cubic-bezier(0.61, -0.53, 0.43, 1.43);
}
</style>
