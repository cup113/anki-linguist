<script setup lang="ts">
import { ref } from 'vue';
import { onKeyStroke } from '@vueuse/core';

import ChunkItem from '@/components/ChunkItem.vue';
import DownloadIcon from '@/components/Icon/DownloadIcon.vue'
import AddIcon from '@/components/Icon/AddIcon.vue';
import ImportIcon from '@/components/Icon/ImportIcon.vue';
import SaveIcon from '@/components/Icon/SaveIcon.vue';
import DeleteIcon from '@/components/Icon/DeleteIcon.vue';

import TiptapEditor from '@/components/TiptapEditor.vue';
import { PopoverRoot, PopoverTrigger, PopoverPortal, PopoverContent } from 'reka-ui';
import { useRecordStore } from '@/stores/record';

const recordStore = useRecordStore();
const deleting = ref(false);

onKeyStroke('s', e => {
  if (e.ctrlKey) {
    e.preventDefault();
    recordStore.save_document();
  }
});

function delete_document(id: string) {
  if (confirm("确定删除该文档？")) {
    recordStore.delete_document(id);
    deleting.value = false;
  }
}

</script>

<template>
  <main class="p-4 flex flex-col gap-4">
    <section class="flex justify-center items-center gap-2">
      <button class="text-primary-700 btn-primary p-1" @click="recordStore.save_document">
        <SaveIcon />
      </button>
      <input type="text" v-model="recordStore.chunkDocument.title" class="text-center text-xl font-bold w-72">
      <div class="flex gap-2">
        <PopoverRoot>
          <PopoverTrigger class="btn-primary px-2 py-1 text-primary-700">
            <ImportIcon />
          </PopoverTrigger>
          <PopoverPortal>
            <PopoverContent class="bg-white rounded-md shadow-md p-2">
              <div class="grid grid-cols-2 gap-2">
                <button v-for="id in recordStore.recordStorageIds" :key="id" class="btn-primary px-2 py-1"
                  @click="recordStore.load_document(id)"
                  :class="{ 'font-bold': id === recordStore.chunkDocument.title }">
                  {{ id }}
                </button>
              </div>
            </PopoverContent>
          </PopoverPortal>
        </PopoverRoot>

        <PopoverRoot :open="deleting" @update:open="deleting = true">
          <PopoverTrigger class="btn-primary px-2 py-1 text-red-700">
            <DeleteIcon />
          </PopoverTrigger>
          <PopoverPortal>
            <PopoverContent class="bg-white text-red-700 rounded-md shadow-md p-2">
              <div class="grid grid-cols-2 gap-2">
                <button v-for="id in recordStore.recordStorageIds" :key="id" class="btn-primary px-2 py-1"
                  @click="delete_document(id);">
                  {{ id }}
                </button>
              </div>
            </PopoverContent>
          </PopoverPortal>
        </PopoverRoot>

        <button class="btn-primary px-2 py-1 text-primary-700" @click="recordStore.new_document">
          <AddIcon />
        </button>
      </div>
    </section>
    <section class="flex flex-col gap-2">
      <ChunkItem v-for="record, index in recordStore.chunkDocument.records" :key="record.id" :chunk-id="record.id"
        :index="index" />
    </section>
    <section>
      <TiptapEditor v-model="recordStore.chunkDocument.footer"></TiptapEditor>
    </section>
    <section class="flex gap-2 justify-center">
      <button class="text-primary-700 btn-primary p-2" @click="recordStore.chunkDocument.add_record">
        <AddIcon></AddIcon>
      </button>
      <button class="text-primary-700 btn-primary p-2" @click="recordStore.download_export">
        <DownloadIcon></DownloadIcon>
      </button>
    </section>
  </main>
</template>
