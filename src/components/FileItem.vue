<script setup lang="ts">
import { computed, ref, watchEffect, watch, onUnmounted } from 'vue';
import type { FileObj } from '@/types/file';
import { useI18n } from '@/hooks/useI18n';

const { t } = useI18n();

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

const objectUrl = computed(() => URL.createObjectURL(props.fileObj.file));

watch(objectUrl, (_, oldUrl) => URL.revokeObjectURL(oldUrl));

const computeFileSize = (size: number) =>
  (size / (1024 * 1024)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }); // NoSonar this is to convert byte to MB

onUnmounted(() => URL.revokeObjectURL(objectUrl.value));
</script>

<template>
  <div class="file-item">
    <div class="item-set">
      <a
        :href="objectUrl"
        rel="noopener noreferrer"
        target="_blank"
      >
        <img
          :src="objectUrl"
          alt="Image preview"
          class="preview"
          width="200"
        />
      </a>
      <div>
        <div>
          <span class="field-title">{{ t('translation.name') }}</span> {{ fileObj.file.name }}
        </div>
        <div>
          <span class="field-title">{{ t('translation.originalsize') }}</span> {{ computeFileSize(orgSize) }}MB
        </div>
        <div v-if="compSize">
          <span class="field-title">{{ t('translation.compressedsize') }}</span> {{ computeFileSize(compSize) }}MB
        </div>
        <div
          v-if="fileObj.isTooLarge"
          class="error"
        >
          <span class="field-title">{{ t('translation.error') }}</span> {{ t('translation.filetoolarge') }}
        </div>
      </div>
    </div>
    <div class="item-set">
      <a
        :class="{ secondary: !fileObj.isCompressed }"
        :disabled="!fileObj.isCompressed || undefined"
        :download="fileObj.file.name"
        :href="fileObj.isCompressed ? objectUrl : undefined"
        role="button"
        >{{ t('translation.download') }}</a
      >
      <button
        class="secondary delete-button"
        @click="$emit('remove')"
      >
        ❌
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.file-item {
  display: flex;
  gap: 2rem;
  border: 1px solid;
  border-radius: var(--pico-border-radius);
  padding: 0.25rem;
  padding-inline: 1rem;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;

  .item-set {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

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
