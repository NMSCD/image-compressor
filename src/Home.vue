<script setup lang="ts">
import PageLink from './PageLink.vue';
import CivImage from './CivImage.vue';
import type { CivImageProps, PageLinkProps } from './objects';
import NavBar from './components/ENNavBarES.vue';

const links: PageLinkProps[] = [
  {
    text: 'English',
    url: './english.html',
  },
  {
    text: 'Español',
    url: './spanish.html',
  },
];

const images: CivImageProps[] = [
  {
    link: 'https://nmscd.com/',
    imgAlt: 'NMSCD',
    img: 'https://avatars.githubusercontent.com/u/62565964?s=280&v=4',
  },
];
</script>

<template>
  <NavBar />

  <h1 class="title">
    Image Compressor
    <br />
    Compresor de imágenes
  </h1>

  <div
    class="subtitle is-4"
    style="text-align: center"
  >
    Select what language you want <br />
    Elija el idioma en el que vaya usar la app
  </div>

  <nav
    aria-label="Subpages"
    class="page-options"
  >
    <PageLink
      v-for="link in links"
      :key="link.url"
      :url="link.url"
      :text="link.text"
      :disabled="link.inactive"
    />
  </nav>
  <div class="images">
    <CivImage
      v-for="image in images"
      :img="image.img"
      :img-alt="image.imgAlt"
      :link="image.link"
    />
  </div>
</template>

<style scoped lang="scss">
body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.page-options {
  max-width: 600px;
  margin: 2em auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5em;
  justify-items: center;
  /* Centers the content horizontally */
  align-items: center;
  /* Centers the content vertically */
}

.title {
  margin-block-end: 2rem;
  text-align: center;
}

.subtitle.is-4 {
  text-align: center;
}

.images {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 3em auto;
}
</style>
