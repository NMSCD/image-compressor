<template>
  <select v-on:change="switchLanguage($event.target.value)">
      <option
          v-for="sLocale in supportedLocales"
          :key="`locale-${sLocale}`"
          :value="sLocale"
      >
          {{ t(`locale.${sLocale}`) }}
      </option>
  </select>
</template>



<script>
  import { useI18n } from 'vue-i18n'
  import { useRouter } from "vue-router"
  import Tr from '@/i18n/translation.js';

  export default {
    setup() {
      const { t, locale } = useI18n()

      const supportedLocales = Tr.supportedLocales

      const router = useRouter()

      const switchLanguage = async (newLocale) => {
        await Tr.switchLanguage(newLocale)

        try {
          await router.replace({ params: { locale: newLocale } })
        } catch(e) {
          console.log(e)
          router.push("/")
        }
      }

      return { t, locale, supportedLocales, switchLanguage }
    }
  }
</script>

<style scoped>
  #language-switcher {
    position: fixed;
    top: 0;
    gap: 0.5rem;
    right: 0;
    display: flex;
    padding: 5px;
    border-radius: 5px;
  }


</style>
