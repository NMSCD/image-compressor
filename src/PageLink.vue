<script setup lang="ts">
import type { PageLinkProps } from './types';

const props = defineProps<PageLinkProps>();

const title = `Compress a photo in ${props.text}`;
</script>

<template>
  <a
    :href="url"
    :title="title"
    >{{ text }}</a
  >
</template>

<style scoped lang="scss">
a {
  font-size: 1.5rem;
}
</style>
