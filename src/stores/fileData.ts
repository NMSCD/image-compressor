import { defineStore } from 'pinia';
import type { FileObj } from '../types/file';

interface State {
  files: FileObj[];
}

export const useFileDataStore = defineStore('FileData', {
  state: (): State => ({
    files: [],
  }),
});
