<template>
    <nav>
    <ul>
      <li>
        <a href=".." title="Other pages">← {{ $t("nav.viewother") }}</a>
      </li>
    </ul>
    <ul>
      <li>
        <LanguageSwitcher></LanguageSwitcher>
      </li>
    </ul>
  </nav>
</template>

<script>
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import Tr from "@/i18n/translation.js";

export default {
  components: { LanguageSwitcher },
  setup() {
    return { Tr };
  },
};
</script>
