<template>
    <div class="pdf-viewer" ref="containerRef">
        <div v-if="error" class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {{ error }}
        </div>
        <div v-else-if="loading" class="flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-12 text-sm text-gray-600">
            Loading PDF…
        </div>
        <div v-else ref="pagesRef" class="space-y-8"></div>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const props = defineProps({
    src: {
        type: String,
        required: true,
    },
    allowTextSelection: {
        type: Boolean,
        default: false,
    },
    scale: {
        type: Number,
        default: 1,
    },
});

const containerRef = ref(null);
const pagesRef = ref(null);
const loading = ref(true);
const error = ref(null);

let pdfDocument = null;
let renderTasks = [];
let abortController = null;

const cleanup = () => {
    renderTasks.forEach((task) => {
        try {
            task?.cancel();
        } catch (e) {
            // ignore cancellation errors
        }
    });
    renderTasks = [];

    if (pdfDocument) {
        pdfDocument.cleanup();
        pdfDocument.destroy();
        pdfDocument = null;
    }

    if (pagesRef.value) {
        pagesRef.value.innerHTML = '';
    }

    if (abortController) {
        abortController.abort();
        abortController = null;
    }
};

const renderPage = async (page, scale) => {
    const viewport = page.getViewport({ scale });
    const pageContainer = document.createElement('div');
    pageContainer.className = 'pdf-page relative mx-auto';
    pageContainer.style.width = `${viewport.width}px`;

    const canvas = document.createElement('canvas');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    canvas.className = 'block max-w-full';

    const context = canvas.getContext('2d', { alpha: false });
    const renderTask = page.render({
        canvasContext: context,
        viewport,
    });
    renderTasks.push(renderTask);

    pageContainer.appendChild(canvas);
    pagesRef.value.appendChild(pageContainer);

    await renderTask.promise;

    if (props.allowTextSelection) {
        const textLayerDiv = document.createElement('div');
        textLayerDiv.className = 'textLayer';
        textLayerDiv.style.width = `${viewport.width}px`;
        textLayerDiv.style.height = `${viewport.height}px`;
        pageContainer.appendChild(textLayerDiv);

        const textContent = await page.getTextContent({
            normalizeWhitespace: true,
        });

        pdfjsLib.renderTextLayer({
            textContent,
            container: textLayerDiv,
            viewport,
            textDivs: [],
            enhanceTextSelection: true,
        });
    }
};

const renderDocument = async () => {
    if (!pdfDocument || !containerRef.value || !pagesRef.value) return;

    const containerWidth = containerRef.value.clientWidth || 800;
    const firstPage = await pdfDocument.getPage(1);
    const initialViewport = firstPage.getViewport({ scale: props.scale });
    const scale = (containerWidth / initialViewport.width) * props.scale;

    // re-add first page after measuring
    pagesRef.value.innerHTML = '';

    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
        const page = await pdfDocument.getPage(pageNumber);
        await renderPage(page, scale);
    }
};

const loadPdf = async () => {
    cleanup();
    loading.value = true;
    error.value = null;

    if (!props.src) {
        loading.value = false;
        error.value = 'Missing PDF source.';
        return;
    }

    abortController = new AbortController();

    try {
        const response = await fetch(props.src, {
            credentials: 'include',
            signal: abortController.signal,
        });

        if (!response.ok) {
            throw new Error('Failed to load PDF.');
        }

        const arrayBuffer = await response.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        pdfDocument = pdf;

        await renderDocument();
    } catch (err) {
        if (err.name === 'AbortError') {
            return;
        }
        console.error('PDF Viewer error:', err);
        error.value = err?.message ?? 'Unable to load PDF.';
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadPdf();
});

watch(
    () => [props.src, props.allowTextSelection, props.scale],
    async () => {
        await loadPdf();
    },
);

onBeforeUnmount(() => {
    cleanup();
});
</script>

<style scoped>
.pdf-viewer {
    width: 100%;
}

.pdf-page canvas {
    width: 100%;
    height: auto;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
    border-radius: 0.5rem;
    background: #ffffff;
}

.pdf-page .textLayer {
    position: absolute;
    inset: 0;
    white-space: pre;
    overflow: hidden;
}
</style>

