import { createI18n } from 'vue-i18n';
import Español from './es-ES';
import English from './en-EN';

const messages = {
	Español,
	English,
};

const userLang = navigator.language.replace('es-ES', 'Español').replace('en-EN', 'English');
const localStorageLang = localStorage.getItem('lang');
export const preferredLang = localStorageLang ?? (Object.keys(messages).includes(userLang) ? userLang : 'English');

const i18n = createI18n({
	locale: preferredLang,
	legacy: false,
	messages,
});

export { i18n, messages };
