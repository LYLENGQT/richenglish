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
    <div :class="cn('flex flex-col space-y-1.5 text-center sm:text-left', $attrs.class)">
        <slot />
    </div>
</template>

