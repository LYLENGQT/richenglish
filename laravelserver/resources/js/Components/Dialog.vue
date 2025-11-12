<script setup>
import { computed } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:open', 'close']);

const isOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value),
});

const close = () => {
    emit('close');
    emit('update:open', false);
};
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isOpen"
                class="fixed inset-0 z-50 overflow-y-auto"
            >
                <!-- Backdrop -->
                <div
                    class="fixed inset-0 bg-black/50 transition-opacity"
                    @click="close"
                ></div>
                
                <!-- Dialog Content -->
                <div class="flex min-h-full items-center justify-center p-4">
                    <div
                        class="relative z-50 w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
                        @click.stop
                    >
                        <div class="absolute right-0 top-0 pr-4 pt-4">
                            <button
                                type="button"
                                class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                @click="close"
                            >
                                <span class="sr-only">Close</span>
                                <XMarkIcon class="h-6 w-6" />
                            </button>
                        </div>
                        <div class="p-6">
                            <slot />
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

