<script setup lang="ts">
import { ref } from 'vue';
import { useFileDataStore } from '../stores/fileData';
import { storeToRefs } from 'pinia';
import type { FileObj } from '../types/file';

const dragActive = ref(false);

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
    for="fileUpload"
    class="drop-container"
    :class="{ 'drag-active': dragActive }"
    @dragenter="dragActive = true"
    @dragleave="dragActive = false"
    @drop.prevent="dropFile"
    @dragover.prevent
  >
    <span class="drop-title">Suelta los archivos aquí</span>
    <input
      type="file"
      id="fileUpload"
      multiple
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
