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
import {
  PopoverRoot, PopoverTrigger, PopoverPortal, PopoverContent,
  SelectRoot, SelectTrigger, SelectValue, SelectPortal, SelectContent, SelectViewport, SelectGroup, SelectItem, SelectItemIndicator, SelectItemText,
} from 'reka-ui';
import { useRecordStore, deckTypes } from '@/stores/record';

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

function import_document(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const result = reader.result;
      if (typeof result !== 'string') {
        alert('文件内容格式不正确');
        return;
      }
      recordStore.import_document(result);
    } catch (error) {
      alert("导入失败：文件格式不正确。" + String(error));
    }
  };
  reader.readAsText(file);
}
</script>

<template>
  <main class="p-4 flex flex-col gap-4">
    <section class="flex justify-center items-center gap-2">
      <button class="btn-primary p-1 text-primary-700" @click="recordStore.new_document">
        <AddIcon />
      </button>
      <button class="text-primary-700 btn-primary p-1" @click="recordStore.save_document">
        <SaveIcon />
      </button>
      <input type="text" v-model="recordStore.chunkDocument.title" class="text-center text-xl font-bold w-72">
      <PopoverRoot>
        <PopoverTrigger class="btn-primary p-1 text-primary-700">
          <ImportIcon />
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent class="bg-white rounded-md shadow-md p-2">
            <div class="grid grid-cols-2 gap-2">
              <button v-for="id in recordStore.recordStorageIds" :key="id" class="btn-primary px-2 py-1"
                @click="recordStore.load_document(id)" :class="{ 'font-bold': id === recordStore.chunkDocument.title }">
                {{ id }}
              </button>
              <input type="file" accept="application/json" @change="import_document"
                class="w-48 border border-primary-300 px-2 py-1" />
            </div>
          </PopoverContent>
        </PopoverPortal>
      </PopoverRoot>

      <PopoverRoot :open="deleting" @update:open="deleting = !deleting">
        <PopoverTrigger class="btn-primary p-1 text-red-700">
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
    </section>
    <section class="flex justify-center">
      <SelectRoot v-model="recordStore.chunkDocument.deckType" class="w-72">
        <SelectTrigger class="btn-primary py-1 px-2 text-primary-700 font-bold">
          卡组类型：
          <SelectValue placeholder="请选择卡组类型" />
        </SelectTrigger>
        <SelectPortal>
          <SelectContent class="bg-white text-primary-700 rounded-md shadow-md p-2">
            <SelectViewport>
              <SelectGroup>
                <SelectItem v-for="deckType in deckTypes" :value="deckType.value" :key="deckType.value"
                  class="p-2 hover:bg-secondary-100">
                  <SelectItemIndicator />
                  <SelectItemText>{{ deckType.label }}</SelectItemText>
                </SelectItem>
              </SelectGroup>
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>
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
