<script setup lang="ts">
import ThemeSwitch from './ThemeSwitch.vue';
</script>

<template>
  <nav>
    <ul>
      <li>
        <a
          href="./"
          title="Homepage"
          >&larr; Back to the main page</a
        >
      </li>
    </ul>
    <ul>
      <li>
        <ThemeSwitch />
      </li>
    </ul>
  </nav>
</template>
