<script setup>
import { DialogTitle as DialogTitlePrimitive } from 'radix-vue';
import { cn } from '@/lib/utils';

defineProps({
    class: {
        type: String,
        default: '',
    },
});
</script>

<template>
    <DialogTitlePrimitive :class="cn('text-lg font-semibold leading-none tracking-tight', $attrs.class)">
        <slot />
    </DialogTitlePrimitive>
</template>

