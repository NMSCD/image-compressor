<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import FileUpload from './components/FileUpload.vue';
import FileItem from './components/FileItem.vue';
import { useFileDataStore } from './stores/fileData';
import { storeToRefs } from 'pinia';
import type { FileObj } from './types/file';
import { computed, ref } from 'vue';
import { compressFile } from './functions/imageCompression';
import { compressToZip } from './functions/zipCompression';
import { paginate } from './functions/paginate';
import { useI18n } from './hooks/useI18n';

const { t } = useI18n();

const fileDataStore = useFileDataStore();
const { files } = storeToRefs(fileDataStore);

const isCompressing = ref(false);
const zipData = ref('');
const isZipCompressing = ref(false);
const anyUncompressed = computed(() => files.value.some((file) => !file.isCompressed));

const availableThreads = Math.max(navigator.hardwareConcurrency - 2, 1);

async function editFileObj(fileObj: FileObj) {
  try {
    const compressedFile = await compressFile(fileObj.file);
    fileObj.file = compressedFile;
    fileObj.isCompressed = true;
  } catch {
    fileObj.isError = true;
  }
}

async function compressFiles() {
  isCompressing.value = true;

  const uncompressedFiles = files.value.filter((fileObj: FileObj) => !fileObj.isCompressed);

  // option 1 (no errors, slower)
  const paginatedFileArray = paginate(uncompressedFiles, availableThreads);

  for (const subArray of paginatedFileArray) {
    const promises = subArray.map(editFileObj);
    await Promise.all(promises);
  }

  // option 2 (errors, faster -> better option once the errors are fixed in Firefox)
  // const promises = uncompressedFiles.map(editFileObj);
  // await Promise.all(promises);

  isCompressing.value = false;

  URL.revokeObjectURL(zipData.value);
  isZipCompressing.value = true;
  zipData.value = await compressToZip();
  isZipCompressing.value = false;
}

function removeItem(file: FileObj) {
  files.value = files.value.filter((item) => item !== file);
}
</script>

<template>
  <header>
    <NavBar />
    <h1 class="title">{{ t('translation.header') }}</h1>
  </header>

  <main>
    <div class="explanation-wrapper">
      <p class="explanation">{{ t('translation.subtitle') }}</p>
      <a
        href="https://nomanssky.fandom.com/wiki/Special:Upload?multiple=true"
        role="button"
        target="_blank"
        rel="noopener noreferrer"
        >{{ t('translation.buttonwiki') }}</a
      >
    </div>
    <h2 class="subheading">{{ t('translation.input') }}</h2>
    <FileUpload />

    <h2 class="subheading">{{ t('translation.filelist') }}</h2>
    <div class="buttons">
      <button
        :aria-busy="isCompressing"
        :class="{ 'is-success': files.length && !anyUncompressed }"
        :disabled="!files.length || !anyUncompressed || isCompressing"
        @click="compressFiles"
      >
        {{ files.length && !anyUncompressed ? t('translation.allcompressed') : t('translation.compress') }}
      </button>
      <a
        :aria-busy="isZipCompressing"
        :disabled="!zipData || undefined"
        :href="zipData || undefined"
        role="button"
        download
      >
        {{ t('translation.downloadzip') }}
      </a>
      <button
        :disabled="!files.length"
        class="secondary"
        @click="files = []"
      >
        {{ t('translation.clearlist') }}
      </button>
    </div>
    <div class="file-list">
      <FileItem
        v-for="file in files"
        :file-obj="file"
        :key="file.id"
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
