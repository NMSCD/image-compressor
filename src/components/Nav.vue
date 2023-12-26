<template>
  <nav>
    <ul>
      <li>
        <a
          href=".."
          title="Other pages"
          >← {{ $t('translation.viewother') }}</a
        >
      </li>
    </ul>
    <ul>
      <li>
        <select v-model="selectedLocale">
          <option
            v-for="locale in $i18n.availableLocales"
            :key="`locale-${locale}`"
            :value="locale"
          >
            {{ locale }}
          </option>
        </select>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';
import { useI18n } from '../hooks/useI18n';

const { locale } = useI18n();

type Locales = typeof locale.value;

const selectedLocale = ref<Locales>(locale.value);

watch(selectedLocale, (newVal) => {
  locale.value = newVal;
  localStorage.setItem('lang', newVal);
});
</script>
