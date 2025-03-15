<script setup lang="ts">
import ChunkItem from '@/components/ChunkItem.vue';
import DownloadIcon from '@/components/Icon/DownloadIcon.vue'
import AddIcon from '@/components/Icon/AddIcon.vue';
import { } from 'reka-ui';
import { useRecordStore } from '@/stores/record';

const recordStore = useRecordStore();
</script>

<template>
  <main class="p-4 flex flex-col gap-4">
    <section class="flex flex-col gap-2">
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
