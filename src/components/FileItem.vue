<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import type { FileObj } from '../types/file';

const props = defineProps<{
  fileObj: FileObj;
}>();

const orgSize = ref(0);
const compSize = ref(0);

watchEffect(() => {
  const file = props.fileObj.file;
  if (props.fileObj.isCompressed) {
    compSize.value = file.size;
  } else {
    orgSize.value = file.size;
  }
});

const fileData = computed(() => URL.createObjectURL(props.fileObj.file));
</script>

<template>
  <div class="file-item">
    <a
      :href="fileData"
      rel="noopener noreferrer"
      target="_blank"
    >
      <img
        :src="fileData"
        class="preview"
        alt="Image preview"
        width="200"
      />
    </a>
    <div>
      <div><span class="field-title">Name:</span> {{ fileObj.file.name }}</div>
      <div><span class="field-title">Original Size:</span> {{ (orgSize / (1024 * 1024)).toFixed(1) }}MB</div>
      <div v-if="compSize">
        <span class="field-title">Compressed Size:</span> {{ (compSize / (1024 * 1024)).toFixed(1) }}MB
      </div>
    </div>
    <a
      :aria-disabled="!fileObj.isCompressed"
      :class="{ secondary: !fileObj.isCompressed }"
      :href="fileObj.isCompressed ? fileData : undefined"
      role="button"
      download
      >Download</a
    >
    <button
      class="secondary delete-button"
      @click="$emit('remove')"
    >
      ❌
    </button>
  </div>
</template>

<style scoped lang="scss">
.file-item {
  display: flex;
  gap: 2rem;
  border: 1px solid;
  border-radius: var(--border-radius);
  padding: 0.25rem;
  padding-inline: 1rem;
  align-items: center;
  width: 100%;
  justify-content: space-between;

  .field-title {
    font-weight: bold;
  }

  .delete-button {
    width: auto;
    margin: 0;
  }
}
</style>
