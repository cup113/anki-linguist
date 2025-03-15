<script setup lang="ts">
import ChunkItem from '@/components/ChunkItem.vue';
import DownloadIcon from '@/components/Icon/DownloadIcon.vue'
import AddIcon from '@/components/Icon/AddIcon.vue';
import SaveIcon from '@/components/Icon/SaveIcon.vue';
import MoreIcon from '@/components/Icon/MoreIcon.vue';
import { PopoverRoot, PopoverTrigger, PopoverPortal, PopoverContent, PopoverArrow } from 'reka-ui';
import { useRecordStore } from '@/stores/record';

const recordStore = useRecordStore();

function onKeyUp(event: KeyboardEvent) {
  if (event.key === "Enter" && event.ctrlKey) {
    recordStore.add_record();
  }
}
</script>

<template>
  <main class="p-4 flex flex-col gap-4">
    <section class="flex justify-center items-center gap-2">
      <button class="text-green-700 btn-primary p-1" @click="recordStore.save_records">
        <SaveIcon />
      </button>
      <input type="text" v-model="recordStore.title" class="text-center text-xl font-bold">
      <PopoverRoot>
        <PopoverTrigger>
          <button class="text-green-700 btn-primary p-1">
            <MoreIcon />
          </button>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent class="bg-white rounded-md shadow-md p-2">
            <div class="grid grid-cols-2 gap-2">
              <button class="btn-primary p-1" v-for="id in recordStore.recordStorageIds" :key="id"
                @click="recordStore.load_records(id)">
                {{ id }}
              </button>
              <button class="btn-primary p-1 text-green-700" @click="recordStore.add_new_records">
                <AddIcon class="mx-auto" />
              </button>
            </div>
            <PopoverArrow />
          </PopoverContent>
        </PopoverPortal>
      </PopoverRoot>
    </section>
    <section class="flex flex-col gap-2" @keyup="onKeyUp">
      <ChunkItem v-for="record, index in recordStore.chunkRecords" :key="record.id" :chunk-id="record.id"
        :index="index" />
    </section>
    <section class="flex gap-2 justify-center">
      <button class="text-green-700 btn-primary p-2" @click="recordStore.add_record">
        <AddIcon></AddIcon>
      </button>
      <button class="text-green-700 btn-primary p-2" @click="recordStore.download_export">
        <DownloadIcon></DownloadIcon>
      </button>
    </section>
  </main>
</template>
