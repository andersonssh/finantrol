<template>
    <div
        :class="{
            'relative border border-gray-400 md:shadow max-w-md flex': true,
            'bg-green-500': !isExpense,
            'bg-red-600': isExpense,
        }"
    >
        <div class="rounded-full flex items-center justify-center ml-2">
            <img
                class="object-cover m-3 h-20 sm:h-24 rounded-full"
                :src="getRegisterImageSrc(register.category)"
                alt="card 1"
            />
        </div>
        <div class="absolute top-2 right-4">
            <DeleteOrEdit @delete="$emit('delete')" @edit="$emit('edit')"/>
        </div>

        <div class="w-full max-w-full pl-2 pr-4 py-3 sm:py-4 sm:pl-3">
            <div class="font-semibold text-gray-100 my-2 hover:underline text-lg">
                {{ register.description || "Sem descrição" }}
            </div>
            <div class="flex">
                <div class="text-4xl sm:text-5xl mb-4 w-full flex text-gray-100 items-center">
                    {{ Math.abs(register.value) }}
                </div>
                <div class="checkbox-wrapper-31">
                    <input
                        type="checkbox"
                        v-show="isExpense"
                        v-model="register.isPaid"
                        @click="updateIsPaid($event)"
                    />
                    <svg viewBox="0 0 35.6 35.6" v-show="isExpense">
                        <circle class="background" cx="17.8" cy="17.8" r="17.8"></circle>
                        <circle class="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                        <polyline
                            class="check"
                            points="11.78 18.12 15.55 22.23 25.17 12.87"
                        ></polyline>
                    </svg>
                </div>
            </div>

            <div class="text-xs text-gray-100 font-medium uppercase flex flex-wrap">
                <div class="pr-1">{{ register.category }} &bull;</div>
                <div>
                    <i
                        class="fa-solid fa-triangle-exclamation text-yellow-400"
                        v-show="register.isRequired"
                    ></i>
                    {{ register.isRequired ? "OBRIGATÓRIO" : "OPCIONAL" }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DeleteOrEdit from "../Dropdowns/EditOrDelete.vue";
import api from "../../axios";
import { getRegisterValue, Register } from "../../register";

export default defineComponent({
    name: "Register",
    data() {
        return {
            register: {} as Register,
            isExpense: false,
            categoryImages: {
                entradas: "/src/assets/categories/entradas.png",
                casa: "/src/assets/categories/casa.png",
                comida: "/src/assets/categories/comida.png",
                dividas: "/src/assets/categories/dividas.png",
                educação: "/src/assets/categories/educacao.png",
                entretenimento: "/src/assets/categories/entretenimento.png",
                investimentos: "/src/assets/categories/investimentos.png",
                lazer: "/src/assets/categories/lazer.png",
                livre: "/src/assets/categories/livre.png",
                outros: "/src/assets/categories/outros.png",
                saúde: "/src/assets/categories/saude.png",
                transporte: "/src/assets/categories/transporte.png",
                viagem: "/src/assets/categories/viagem.png",
            } as Record<string, string>
        };
    },
    mounted() {
        this.register = JSON.parse(JSON.stringify(this.registerProp));
        this.initValues();
    },
    emits: ["delete", "edit"],
    props: {
        registerProp: {
            type: Object,
            required: true,
        },
    },
    components: {
        DeleteOrEdit,
    },
    methods: {
        getRegisterValue,
        initValues() {
            this.isExpense = this.register.category != "entradas";
        },
        updateIsPaid(e: any) {
            api.patch(`/registers/${this.register._id}`, {
                isPaid: e.target.checked,
            }).then(() => {
                console.debug("isPaid updated!");
            });
        },
        getRegisterImageSrc(category: string) {
            return this.categoryImages[category];
        },
    },
});
</script>

<style>
.checkbox-wrapper-31:hover .check {
    stroke-dashoffset: 0;
}

.checkbox-wrapper-31 {
    position: relative;
    display: inline-block;
    width: 70px;
    height: 70px;
}
.checkbox-wrapper-31 .background {
    fill: #ccc;
    transition: ease all 0.6s;
    -webkit-transition: ease all 0.6s;
}
.checkbox-wrapper-31 .stroke {
    fill: none;
    stroke: #fff;
    stroke-miterlimit: 10;
    stroke-width: 2px;
    stroke-dashoffset: 100;
    stroke-dasharray: 100;
    transition: ease all 0.6s;
    -webkit-transition: ease all 0.6s;
}
.checkbox-wrapper-31 .check {
    fill: none;
    stroke: #fff;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2px;
    stroke-dashoffset: 22;
    stroke-dasharray: 22;
    transition: ease all 0.6s;
    -webkit-transition: ease all 0.6s;
}
.checkbox-wrapper-31 input[type="checkbox"] {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    margin: 0;
    opacity: 0;
    -appearance: none;
    -webkit-appearance: none;
}
.checkbox-wrapper-31 input[type="checkbox"]:hover {
    cursor: pointer;
}
.checkbox-wrapper-31 input[type="checkbox"]:checked + svg .background {
    fill: #B81F1F;
}
.checkbox-wrapper-31 input[type="checkbox"]:checked + svg .stroke {
    stroke-dashoffset: 0;
}
.checkbox-wrapper-31 input[type="checkbox"]:checked + svg .check {
    stroke-dashoffset: 0;
}
</style>