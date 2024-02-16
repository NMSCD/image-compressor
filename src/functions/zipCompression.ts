import JSZip from 'jszip';
import { storeToRefs } from 'pinia';
import { useFileDataStore } from '@/stores/fileData';

export async function compressToZip(): Promise<string> {
  const zip = new JSZip();

  const fileDataStore = useFileDataStore();
  const { files } = storeToRefs(fileDataStore);

  const images = files.value.map((item) => item.file);

  for (const image of images) {
    zip.file(image.name, image);
  }

  const content = await zip.generateAsync({ type: 'blob' });

  return URL.createObjectURL(content);
}
