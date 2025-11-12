<script setup>
import { ref, computed } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
    dates: {
        type: Array,
        default: () => [],
    },
    size: {
        type: String,
        default: 'md',
        validator: (value) => ['sm', 'md', 'lg', 'full'].includes(value),
    },
});

const emit = defineEmits(['dateClick']);

const currentMonth = ref(new Date());

const sizeConfig = {
    sm: {
        container: 'w-64',
        header: 'text-sm',
        dayHeader: 'text-xs',
        dayCell: 'h-8 text-xs',
        navButton: 'h-8 w-8',
    },
    md: {
        container: 'w-80',
        header: 'text-base',
        dayHeader: 'text-sm',
        dayCell: 'h-10 text-sm',
        navButton: 'h-10 w-10',
    },
    lg: {
        container: 'w-96',
        header: 'text-lg',
        dayHeader: 'text-base',
        dayCell: 'h-12 text-base',
        navButton: 'h-12 w-12',
    },
    full: {
        container: 'w-full',
        header: 'text-2xl',
        dayHeader: 'text-lg',
        dayCell: 'h-16 text-lg',
        navButton: 'h-12 w-12',
    },
};

const config = computed(() => sizeConfig[props.size]);

const monthStart = computed(() => {
    const date = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), 1);
    return date;
});

const monthEnd = computed(() => {
    const date = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 0);
    return date;
});

const daysInMonth = computed(() => {
    const days = [];
    const start = monthStart.value;
    const end = monthEnd.value;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
    }
    return days;
});

const firstDayOfWeek = computed(() => monthStart.value.getDay());

const paddingDays = computed(() => Array(firstDayOfWeek.value).fill(null));

const formatMonthYear = computed(() => {
    return currentMonth.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

const findDateItem = (day) => {
    const dayStr = day.toISOString().split('T')[0];
    return props.dates.find((item) => {
        const itemDate = item.date instanceof Date ? item.date : new Date(item.date);
        const itemStr = itemDate.toISOString().split('T')[0];
        return itemStr === dayStr;
    }) || null;
};

const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

const isSameMonth = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth();
};

const handleDateClick = (day) => {
    const item = findDateItem(day);
    if (item && item.onClick) {
        item.onClick(item.id, day);
    } else if (item) {
        emit('dateClick', item, day);
    }
};

const handlePrevMonth = () => {
    const newDate = new Date(currentMonth.value);
    newDate.setMonth(newDate.getMonth() - 1);
    currentMonth.value = newDate;
};

const handleNextMonth = () => {
    const newDate = new Date(currentMonth.value);
    newDate.setMonth(newDate.getMonth() + 1);
    currentMonth.value = newDate;
};

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
</script>

<template>
    <div
        :class="[
            'rounded-lg border border-gray-200 bg-white p-4 shadow-sm',
            config.container,
        ]"
    >
        <div class="mb-4 flex items-center justify-between">
            <h2 :class="['font-semibold text-gray-900', config.header]">
                {{ formatMonthYear }}
            </h2>
            <div class="flex gap-1">
                <button
                    @click="handlePrevMonth"
                    :class="[
                        'rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center',
                        config.navButton,
                    ]"
                    aria-label="Previous month"
                >
                    <ChevronLeftIcon class="h-4 w-4" />
                </button>
                <button
                    @click="handleNextMonth"
                    :class="[
                        'rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center',
                        config.navButton,
                    ]"
                    aria-label="Next month"
                >
                    <ChevronRightIcon class="h-4 w-4" />
                </button>
            </div>
        </div>

        <div class="mb-2 grid grid-cols-7 gap-1">
            <div
                v-for="day in weekDays"
                :key="day"
                :class="[
                    'text-center font-medium text-gray-500',
                    config.dayHeader,
                ]"
            >
                {{ day }}
            </div>
        </div>

        <div class="grid grid-cols-7 gap-1">
            <div
                v-for="(_, index) in paddingDays"
                :key="`padding-${index}`"
                :class="config.dayCell"
            />
            <div
                v-for="day in daysInMonth"
                :key="day.toISOString()"
                class="relative"
            >
                <button
                    @click="handleDateClick(day)"
                    :class="[
                        'w-full rounded-md transition-colors font-medium',
                        config.dayCell,
                        isSameMonth(day, currentMonth)
                            ? 'text-gray-900 hover:bg-gray-100 cursor-pointer'
                            : 'text-gray-400 opacity-50 cursor-not-allowed',
                        !findDateItem(day) && 'opacity-30',
                    ]"
                    :style="findDateItem(day)?.style || {}"
                    :disabled="!isSameMonth(day, currentMonth) || !findDateItem(day)"
                    :title="findDateItem(day) ? `${findDateItem(day).type || 'Class'} (${findDateItem(day).id})` : ''"
                >
                    {{ day.getDate() }}
                </button>
            </div>
        </div>
    </div>
</template>

