import { compress, EImageType } from 'image-conversion';
import { maxSize } from '@/variables/constants';

export async function useImageCompression(file: File, quality: number = 1): Promise<File> {
  if (file.size < maxSize) return file; // if below 10 MB, don't do anything
  const res = await compress(file, {
    quality,
    type: EImageType.JPEG,
    scale: 1,
  });
  const lowerQuality = quality - 0.01; // NoSonar reduce quality by 1%;
  if (res.size > maxSize) return await useImageCompression(file, lowerQuality); // compress original file with lower quality setting to avoid double compression
  const fileName = file.name.split('.').slice(0, -1).join('.');
  const newFileName = fileName + '-min.jpg';
  return new File([res], newFileName, { type: EImageType.JPEG });
}
