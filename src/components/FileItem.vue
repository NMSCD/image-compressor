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

const computeFileSize = (size: number) =>
  (size / (1024 * 1024)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }); // NoSonar this is to convert byte to MB
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
      <div><span class="field-title">{{ $t("translation.name") }}</span> {{ fileObj.file.name }}</div>
      <div><span class="field-title">{{ $t("translation.originalsize") }}</span> {{ computeFileSize(orgSize) }}MB</div>
      <div v-if="compSize"><span class="field-title">{{ $t("translation.compressedsize") }}</span> {{ computeFileSize(compSize) }}MB</div>
      <div
        v-if="fileObj.isTooLarge"
        class="error"
      >
        <span class="field-title">{{ $t("translation.error") }}</span> {{ $t("translation.filetoolarge") }}
      </div>
    </div>
    <a
      :aria-disabled="!fileObj.isCompressed"
      :class="{ secondary: !fileObj.isCompressed }"
      :href="fileObj.isCompressed ? fileData : undefined"
      role="button"
      download
      >{{ $t("translation.download") }}</a
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

  .error {
    color: red;
  }

  .delete-button {
    width: auto;
    margin: 0;
  }
}
</style>
