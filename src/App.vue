<script setup lang="ts">
import { type Component } from 'vue';
import Home from './Home.vue';
import English from './English.vue';
import Spanish from './Spanish.vue';
import { useStaticPageDataStore } from './stores/pageData';
import { storeToRefs } from 'pinia';

const staticPageData = useStaticPageDataStore();
const { route: currentRoute } = storeToRefs(staticPageData);


const router: { [key: string]: Component } = {
  english: English,
  spanish: Spanish,
};
</script>

<template>
  <component :is="router[currentRoute] ?? Home"></component>
</template>
