<script setup>
import { DialogDescription as DialogDescriptionPrimitive } from 'radix-vue';
import { cn } from '@/lib/utils';

defineProps({
    class: {
        type: String,
        default: '',
    },
});
</script>

<template>
    <DialogDescriptionPrimitive :class="cn('text-sm text-muted-foreground', $attrs.class)">
        <slot />
    </DialogDescriptionPrimitive>
</template>

