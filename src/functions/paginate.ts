import type { FileObj } from '@/types/file';

export function paginate(files: FileObj[], chunkSize: number): FileObj[][] {
  const paginatedArray: FileObj[][] = files.reduce((resultArray: FileObj[][], file, index) => {
    const chunkIndex = Math.floor(index / chunkSize);

    resultArray[chunkIndex] ??= []; // start a new chunk

    resultArray[chunkIndex].push(file);

    return resultArray;
  }, []);

  return paginatedArray;
}
