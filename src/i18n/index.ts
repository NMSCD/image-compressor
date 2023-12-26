import { createI18n } from 'vue-i18n';
import Español from './es-ES';
import English from './en-EN';
import Euskara from './eu-EU';

const messages = {
  Español,
  English,
  Euskara,
};

const userLang = navigator.language.replace('es-ES', 'Español').replace('en-EN', 'English').replace('eu-EU', 'Euskara');
const localStorageLang = localStorage.getItem('lang');
export const preferredLang = localStorageLang ?? (Object.keys(messages).includes(userLang) ? userLang : 'English');

const i18n = createI18n({
  locale: preferredLang,
  legacy: false,
  messages,
});

export { i18n, messages };
