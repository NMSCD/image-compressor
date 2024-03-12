<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import FileUpload from './components/FileUpload.vue';
import FileItem from './components/FileItem.vue';
import ControlButtons from './components/ControlButtons.vue';
import { useFileDataStore } from './stores/fileData';
import { storeToRefs } from 'pinia';
import type { FileObj } from './types/file';
import { useI18n } from './hooks/useI18n';

const { t } = useI18n();

const fileDataStore = useFileDataStore();
const { files } = storeToRefs(fileDataStore);

const removeItem = (file: FileObj) => (files.value = files.value.filter((item) => item !== file));
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
    <ControlButtons />
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
</style>
