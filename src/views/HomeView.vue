<script setup lang="ts">
import ChunkItem from '@/components/ChunkItem.vue';
import DownloadIcon from '@/components/Icon/DownloadIcon.vue'
import AddIcon from '@/components/Icon/AddIcon.vue';
import { useRecordStore } from '@/stores/record';
import { ref } from 'vue';

const recordStore = useRecordStore();

const title = ref("Chunks");

function onKeyUp(event: KeyboardEvent) {
  if (event.key === "Enter" && event.ctrlKey) {
    recordStore.add_record();
  }
}
</script>

<template>
  <main class="p-4 flex flex-col gap-4">
    <section class="text-center">
      <input type="text" v-model="title" class="text-center text-xl font-bold">
    </section>
    <section class="flex flex-col gap-2" @keyup="onKeyUp">
      <ChunkItem v-for="record, index in recordStore.chunkRecords" :key="record.id" :chunk-id="record.id"
        :index="index" />
    </section>
    <section class="flex gap-2 justify-center">
      <button class="text-green-700 btn-primary p-2" @click="recordStore.add_record()">
        <AddIcon></AddIcon>
      </button>
      <button class="text-green-700 btn-primary p-2" @click="recordStore.download_export">
        <DownloadIcon></DownloadIcon>
      </button>
    </section>
  </main>
</template>
