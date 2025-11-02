import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const convertBtn = document.getElementById('convertBtn');
const outputFormat = document.getElementById('outputFormat');
const status = document.getElementById('status');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');

let ffmpeg = null;
let selectedFile = null;

async function loadFFmpeg() {
    if (ffmpeg) return;

    showStatus('Loading FFmpeg...', 'info');
    ffmpeg = new FFmpeg();

    ffmpeg.on('log', ({ message }) => {
        console.log(message);
    });

    ffmpeg.on('progress', ({ progress }) => {
        const percentage = Math.round(progress * 100);
        progressFill.style.width = `${percentage}%`;
    });

    const baseURL = import.meta.env.BASE_URL + 'ffmpeg';

    const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
    const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');
    const workerURL = await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript');

    await ffmpeg.load({
        coreURL,
        wasmURL,
        workerURL,
    });

    showStatus('FFmpeg loaded and ready', 'success');
    setTimeout(() => hideStatus(), 2000);
}

dropArea.addEventListener('click', () => fileInput.click());

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

function handleFileSelect(file) {
    selectedFile = file;
    fileName.textContent = file.name;
    fileInfo.classList.add('show');
    convertBtn.disabled = false;
    hideStatus();
}

convertBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    try {
        convertBtn.disabled = true;
        progressBar.classList.add('show');
        progressFill.style.width = '0%';

        await loadFFmpeg();

        const inputName = selectedFile.name;
        const outputName = `converted.${outputFormat.value}`;

        showStatus('Processing file...', 'info');

        await ffmpeg.writeFile(inputName, await fetchFile(selectedFile));

        await ffmpeg.exec(['-i', inputName, outputName]);

        const data = await ffmpeg.readFile(outputName);

        const blob = new Blob([data.buffer], { type: `audio/${outputFormat.value}` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedFile.name.split('.')[0]}.${outputFormat.value}`;
        a.click();
        URL.revokeObjectURL(url);

        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);

        showStatus('Conversion complete! File downloaded.', 'success');
        progressFill.style.width = '100%';

    } catch (error) {
        console.error('Conversion error:', error);
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        convertBtn.disabled = false;
        setTimeout(() => {
            progressBar.classList.remove('show');
            progressFill.style.width = '0%';
        }, 2000);
    }
});

function showStatus(message, type) {
    status.textContent = message;
    status.className = `status show ${type}`;
}

function hideStatus() {
    status.classList.remove('show');
}
