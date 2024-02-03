<script setup lang="ts">
import { ref } from 'vue';
import { useFileDataStore } from '@/stores/fileData';
import { storeToRefs } from 'pinia';
import type { FileObj } from '@/types/file';
import { useI18n } from '@/hooks/useI18n';

const dragActive = ref(false);

const { t } = useI18n();

let id = 0;

const fileDataStore = useFileDataStore();
const { files } = storeToRefs(fileDataStore);

function dropFile(e: DragEvent) {
  dragActive.value = false;
  const uploadedFiles = e.dataTransfer?.files;
  if (uploadedFiles?.length) addFiles(uploadedFiles);
}

function uploadFile(e: Event) {
  if (!(e.target instanceof HTMLInputElement)) return;
  const uploadedFiles = e.target.files;
  if (uploadedFiles?.length) addFiles(uploadedFiles);
}

function addFiles(uploadedFiles: FileList) {
  if (!uploadedFiles?.length) return;
  for (const file of Array.from(uploadedFiles)) {
    const fileObj: FileObj = {
      id: id++,
      isCompressed: false,
      isTooLarge: false,
      file,
    };
    files.value.push(fileObj);
  }
}
</script>

<template>
  <label
    :class="{ 'drag-active': dragActive }"
    class="drop-container"
    for="fileUpload"
    @dragenter="dragActive = true"
    @dragleave="dragActive = false"
    @dragover.prevent
    @drop.prevent="dropFile"
  >
    <span class="drop-title">{{ t('translation.dropfiles') }}</span>
    <input
      id="fileUpload"
      multiple
      type="file"
      @change="uploadFile"
    />
  </label>
</template>

<style scoped lang="scss">
.drop-container {
  --border-radius: 10px;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  border-radius: var(--border-radius);
  border: 2px dashed;
  cursor: pointer;
  transition:
    background-color 0.2s ease-in-out,
    border 0.2s ease-in-out;

  &:hover,
  &.drag-active {
    border: 3px solid;
  }

  .drop-title {
    font-weight: bold;
    text-align: center;
  }

  input[type='file'] {
    width: max-content;
    height: auto;
    padding: 5px;
    border-radius: var(--border-radius);
    border: 1px solid;

    &::file-selector-button {
      padding: 10px 20px;
    }
  }
}
</style>
