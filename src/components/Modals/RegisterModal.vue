<template>
    <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-10" @close="open = false">
            <TransitionChild
                as="template"
                enter="ease-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in duration-200"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div
                    class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
                >
                    <TransitionChild
                        as="template"
                        enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <DialogPanel
                            class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                        >
                            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div class="sm:flex sm:items-start">
                                    <div
                                        class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-300 sm:mx-0 sm:h-10 sm:w-10"
                                    >
                                        <PlusIcon
                                            class="h-6 w-6 text-black"
                                            aria-hidden="true"
                                            v-if="isCreatingNewRegister()"
                                        />
                                        <PencilSquareIcon
                                            class="h-6 w-6 text-black"
                                            aria-hidden="true"
                                            v-else
                                        />
                                    </div>
                                    <div class="mt-3 text-left sm:ml-4 sm:mt-0">
                                        <DialogTitle
                                            as="h3"
                                            class="text-xl text-center sm:text-left font-semibold leading-6 text-gray-900"
                                            >{{
                                                isCreatingNewRegister()
                                                    ? isExpense()
                                                        ? "Nova despesa"
                                                        : "Nova entrada"
                                                    : isExpense()
                                                    ? "Editar despesa"
                                                    : "Editar entrada"
                                            }}</DialogTitle
                                        >
                                        <div class="mt-2">
                                            <div class="mb-4 w-full">
                                                <label
                                                    class="block mb-1 text-base"
                                                    for="description"
                                                    >Descrição</label
                                                >
                                                <input
                                                    id="description"
                                                    class="w-full border px-4 py-2 rounded focus:border-blue-500 focus:shadow-outline outline-none"
                                                    autocomplete="off"
                                                    type="text"
                                                    autofocus
                                                    placeholder="Descrição"
                                                    required
                                                    v-model="register.description"
                                                />
                                                <!-- ADICIONAR LIMITE DE CARACTERES -->
                                            </div>
                                            <div class="mb-4 w-full">
                                                <label class="block mb-1 text-base" for="categories"
                                                    >Categoria</label
                                                >
                                                <select
                                                    id="categories"
                                                    v-model="register.category"
                                                    class="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                >
                                                    <option
                                                        :value="category"
                                                        v-for="(category, index) in categories"
                                                        class="text-lg"
                                                        v-bind:key="index"
                                                    >
                                                        {{ category }}
                                                    </option>
                                                </select>
                                            </div>
                                            <div>
                                                <label class="block mb-1 text-base" for="isRequired"
                                                    >Obrigatório</label
                                                >
                                                <Switch
                                                    id="isRequired"
                                                    v-model="register.isRequired"
                                                    :class="
                                                        register.isRequired
                                                            ? 'bg-blue-600'
                                                            : 'bg-gray-200'
                                                    "
                                                    class="relative inline-flex h-8 w-16 items-center rounded-full"
                                                >
                                                    <span class="sr-only"
                                                        >Enable notifications</span
                                                    >
                                                    <span
                                                        :class="
                                                            register.isRequired
                                                                ? 'translate-x-10'
                                                                : 'translate-x-1'
                                                        "
                                                        class="inline-block h-5 w-5 transform rounded-full bg-white transition"
                                                    />
                                                </Switch>
                                            </div>
                                            <div class="flex flex-col">
                                                <label
                                                    for="value"
                                                    class="mt-4 mb-1 text-grey-darker text-base"
                                                    >Valor</label
                                                >
                                                <div class="flex flex-row">
                                                    <span
                                                        class="flex items-center bg-grey-lighter rounded rounded-r-none px-3 font-bold text-grey-darker"
                                                        >R$</span
                                                    >
                                                    <input
                                                        type="number"
                                                        id="value"
                                                        name="value"
                                                        class="bg-grey-lighter text-grey-darker py-2 px-2 rounded text-grey-darkest border border-grey-lighter rounded-l-none font-bold w-40"
                                                        v-model="register.value"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button
                                    type="button"
                                    :class="{
                                        'inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto': true,
                                        'bg-green-600 hover:bg-green-500': isCreatingNewRegister(),
                                        'bg-blue-600 hover:bg-blue-500': !isCreatingNewRegister(),
                                    }"
                                    @click="submit()"
                                >
                                    {{ isCreatingNewRegister() ? "Criar" : "Editar" }}
                                </button>
                                <button
                                    type="button"
                                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    @click="cancel"
                                    ref="cancelButtonRef"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script lang="ts">
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    Switch,
} from "@headlessui/vue";
import { PencilSquareIcon, PlusIcon } from "@heroicons/vue/24/outline";
export default {
    data() {
        return {
            register: {
                description: "seila",
                category: "casa",
                isPercentage: false,
                isRequired: false,
                value: 200
            },

            open: true,
            categories: [
                "entradas",
                "casa",
                "comida",
                "contas",
                "educação",
                "entretenimento",
                "investimentos",
                "lazer",
                "livre",
                "saúde",
                "transporte",
                "viagem",
                "outros",
            ],
        };
    },
    mounted() {
        this.register = JSON.parse(JSON.stringify(this.registerProp || {}));
        if(Object.keys(this.register).length === 0){
            this.register = {
                description: "",
                category: "outros",
                isPercentage: false,
                isRequired: false,
                value: 0
            }
        }
    },
    emits: [
        "submit",
        "cancel"
    ],
    props: {
      registerProp: Object
    },
    components: {
        Dialog,
        DialogPanel,
        DialogTitle,
        TransitionChild,
        TransitionRoot,
        PencilSquareIcon,
        PlusIcon,
        Switch,
    },
    methods: {
        isCreatingNewRegister() {
            return this.register._id ? false : true;
        },
        isExpense() {
            return this.register.category === "entradas" ? false : true;
        },
        submit() {
            this.$emit("submit", this.register)
            this.open = false
        },
        cancel(){
            this.$emit("cancel")
            this.open = false
        }
    },
};
</script>
