<script setup>
import { cn } from '@/lib/utils';

defineProps({
    class: {
        type: String,
        default: '',
    },
});
</script>

<template>
    <div :class="cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', $attrs.class)">
        <slot />
    </div>
</template>

