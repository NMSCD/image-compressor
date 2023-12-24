<script setup lang="ts">
import NavBar from './components/NavBarES.vue';
import FileUpload from './components/FileUploadES.vue';
import FileItem from './components/FileItemES.vue';
import { useFileDataStore } from './stores/fileData';
import { storeToRefs } from 'pinia';
import type { FileObj } from './types/file';
import { computed, ref, watch } from 'vue';
import { useImageCompression } from './composables/useImageCompression';
import { useZipCompression } from './composables/useZipCompression';

const fileDataStore = useFileDataStore();
const { files } = storeToRefs(fileDataStore);

const isCompressing = ref(false);
const zipData = ref('');
const isZipCompressing = ref(false);
const anyUncompressed = computed(() => files.value.some((file) => !file.isCompressed));

async function editFileObj(fileObj: FileObj) {
  try {
    const compressedFile = await useImageCompression(fileObj.file);
    const item = files.value.find((item) => item.id === fileObj.id);
    if (!item) return;
    item.file = compressedFile;
    item.isCompressed = true;
  } catch {
    fileObj.isTooLarge = true;
  }
}

async function compressFiles() {
  isCompressing.value = true;

  const promises = [];

  const uncompressedFiles = files.value.filter((fileObj: FileObj) => !fileObj.isCompressed);

  for (const fileObj of uncompressedFiles) {
    promises.push(editFileObj(fileObj));
  }

  await Promise.all(promises);
  isCompressing.value = false;
}

function removeItem(file: FileObj) {
  files.value = files.value.filter((item) => item !== file);
}

watch(anyUncompressed, async (newVal) => {
  if (files.value.length && !newVal) {
    isZipCompressing.value = true;
    zipData.value = await useZipCompression();
    isZipCompressing.value = false;
  }
});
</script>

<template>
  <header>
    <NavBar />
    <h1 class="title">Compresor de imágenes</h1>
  </header>

  <main>
    <div class="explanation-wrapper">
      <p class="explanation">Comprime imágenes a &lt; 10 MB.</p>
      <a
        href="https://nomanssky.fandom.com/wiki/Special:Upload?multiple=true"
        role="button"
        target="_blank"
        rel="noopener noreferrer"
        >Abrir la carga de imágenes de la wiki del NMS</a
      >
    </div>
    <h2 class="subheading">Entrada</h2>
    <FileUpload />

    <h2 class="subheading">Lista de archivos</h2>
    <div class="buttons">
      <button
        :aria-busy="isCompressing"
        :class="{ 'is-success': files.length && !anyUncompressed }"
        :disabled="!files.length || !anyUncompressed"
        @click="compressFiles"
      >
        {{ files.length && !anyUncompressed ? '¡Todo comprimido!' : 'Comprimir' }}
      </button>
      <a
        :aria-busy="isZipCompressing"
        :aria-disabled="!zipData"
        :href="zipData || undefined"
        role="button"
        download
      >
        Descargar ZIP
      </a>
      <button
        :disabled="!files.length"
        class="secondary"
        @click="files = []"
      >
        Limpiar lista
      </button>
    </div>
    <div class="file-list">
      <FileItem
        v-for="file in files"
        :key="file.id"
        :file-obj="file"
        @remove="removeItem(file)"
      />
    </div>
  </main>
</template>

<style scoped lang="scss">
.title {
  margin-block-end: 2rem;
  text-align: center;
}

.explanation-wrapper {
  display: flex;
  gap: 2rem;
  justify-content: space-between;

  .explanation {
    margin: 0;
  }
}

.subheading {
  margin-block-end: 0.5rem;

  &:first-of-type {
    margin-block-start: 0;
  }

  &:nth-of-type(n + 2) {
    margin-block-start: 1.5rem;
  }
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: fit-content;
}

.is-success {
  background-color: mediumseagreen;
  border: 1px solid darkseagreen;
}

.buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-block-end: 1rem;

  & > * {
    flex-grow: 1;
    width: fit-content;
    height: fit-content;
    margin: 0;
  }
}
</style>
