import { defineStore } from 'pinia';

interface StaticPageData {
  route: string;
  fullArticleElement: HTMLDivElement | null;
  debug: boolean;
}

const route = window.location.pathname.split('/')!.at(-1)!.slice(0, -5); // NoSonar getting the current filename without the "html" ending

const researchteamDefaultExceptions = ['base'];

export const departments = {
  '': '',
};

if (researchteamDefaultExceptions.includes(route)) departments[''] = '';

export const useStaticPageDataStore = defineStore('staticPageData', {
  state: (): StaticPageData => ({
    route,
    fullArticleElement: null,
    debug: false,
  }),
});
