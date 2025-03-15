<script lang="ts" setup>
import { computed } from 'vue';
import { Separator, CheckboxRoot, CheckboxIndicator } from 'reka-ui';
import { useRecordStore } from '@/stores/record';
import TickIcon from './Icon/TickIcon.vue';
import MoreIcon from './Icon/MoreIcon.vue';
import DeleteIcon from './Icon/DeleteIcon.vue';

import TiptapEditor from './TiptapEditor.vue';
import ChunkAddition from './ChunkAddition.vue';

const props = defineProps<{
    index: number;
    chunkId: string;
}>();

const recordStore = useRecordStore();

const chunk = computed(() => {
    return recordStore.find_record(props.chunkId);
});

const index = computed(() => {
    return (props.index + 1).toString().padStart(2, '0');
});

</script>

<template>
    <div class="shadow rounded-lg pl-4">
        <div class="flex text-center items-center gap-4">
            <div class="text-gray-500 text-sm font-semibold">{{ index }}</div>
            <CheckboxRoot class="h-6 w-6 bg-gray-100 rounded-md">
                <CheckboxIndicator
                    class="flex h-full w-full appearance-none items-center justify-center rounded-md shadow-sm border outline-none focus-within:shadow-[0_0_0_2px_gray]">
                    <TickIcon class="text-gray-500" />
                </CheckboxIndicator>
            </CheckboxRoot>
            <input type="text" class="w-6 h-6 p-0 text-center rounded-xl bg-gray-100 text-sm" v-model="chunk.level">
            <div class="grow px-2 py-1">
                <TiptapEditor v-model="chunk.front" />
            </div>
            <Separator class="bg-gray-300 h-5 w-0.5 mx-2" decorative orientation="vertical">
            </Separator>
            <div class="grow px-2 py-1">
                <TiptapEditor v-model="chunk.back" />
            </div>
            <button class="text-green-700 btn-primary p-1" @click="recordStore.add_addition(chunk.id)">
                <MoreIcon />
            </button>
            <button class="text-red-700 btn-primary p-1" @click="recordStore.delete_record(chunk.id)">
                <DeleteIcon />
            </button>
        </div>
        <div class="pl-16">
            <ChunkAddition v-for="addition in chunk.additions" :key="addition.id" :chunk-id="chunk.id"
                :addition-id="addition.id" />
        </div>
    </div>
</template>
