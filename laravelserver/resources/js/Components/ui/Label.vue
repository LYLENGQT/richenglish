<script setup>
import { cn } from '@/lib/utils';

defineProps({
    class: {
        type: String,
        default: '',
    },
    for: {
        type: String,
        default: '',
    },
});
</script>

<template>
    <label :for="for" :class="cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', $attrs.class)">
        <slot />
    </label>
</template>

