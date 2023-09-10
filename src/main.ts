import '@picocss/pico';
import { compress, EImageType } from 'image-conversion';

const input = document.querySelector('input');
const downloadElement = document.querySelector('a');
const statusElement = document.getElementById('status');

if (input) input.onchange = async (e: Event) => {
	if (!downloadElement || !statusElement || !(e.target instanceof HTMLInputElement)) return;
	const element = e.target;
	if (!element.files?.length) return;
	downloadElement.style.display = 'none';
	statusElement.style.display = '';
	const file = element.files[0];
	const compressedFile = await compressFile(file);
	const dataURI = await getBase64Image(compressedFile);
	const fileName = file.name.split('.').slice(0, -1).join('.');
	const isCompressed = compressedFile.size !== file.size;
	const newFileName = isCompressed ? fileName + '-min' : fileName;
	const fileExtension = isCompressed ? 'jpg' : file.name.split('.').at(-1);
	downloadElement.href = dataURI;
	statusElement.style.display = 'none';
	downloadElement.style.display = '';
	downloadElement.download = newFileName + '.' + fileExtension;
}

let quality = 1;

async function compressFile(file: File): Promise<Blob> {
	const maxSize = 10000000;
	if (file.size < maxSize) return file; // if below 10 MB, don't do anything
	const name = file.name;
	const res = await compress(file, {
		quality,
		type: EImageType.JPEG,
		scale: 1,
	});
	quality -= 0.01;	// NoSonar reduce quality by 1%;
	if (res.size > maxSize) return await compressFile(new File([res], name, { type: 'image/jpeg' }));
	quality = 1;	// reset quality
	return res;
}

// convert a blob to base64
function blobToBase64(blob: Blob): Promise<string> {
	return new Promise(resolve => {
		const reader = new FileReader();
		reader.onload = () => {
			const dataUrl = reader.result;
			if (typeof dataUrl === 'string') resolve(dataUrl);
		};
		reader.readAsDataURL(blob);
	});
}

// combine the previous two functions to return a base64 encode image from url
async function getBase64Image(blob: Blob) {
	const base64 = await blobToBase64(blob);
	return base64;
}