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
	downloadElement.href = dataURI;
	statusElement.style.display = 'none';
	downloadElement.style.display = '';
}

let quality = 1;

async function compressFile(file: File): Promise<Blob> {
	const maxSize = 10000000;
	if (file.size < maxSize) return file; // if below 10 MB, don't do anything
	const name = file.name;
	const res = await compress(file, {
		quality, //The compressed image size is 9000kb
		type: EImageType.JPEG,
		scale: 1,
	}); // NoSonar compress to 9MB
	quality -= 0.01;	// NoSonar reduce quality by 1%;
	if (res.size > maxSize) return await compressFile(new File([res], name, { type: 'image/jpeg' }));
	quality = 1;	// reset quality
	return res;
}

// convert a blob to base64
function blobToBase64(blob: Blob): Promise<string> {
	return new Promise(resolve => {
		const reader = new FileReader();
		reader.onload = function () {
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