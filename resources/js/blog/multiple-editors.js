import { init } from 'richtext-core-sdk';
import 'richtext-core-sdk/style.css';
import './multiple-editors.css';

const STORAGE_PREFIX = 'richtext_multi_editor_v1:';

function debounce(fn, ms) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
    };
}

function loadDraft(id) {
    try {
        const raw = localStorage.getItem(STORAGE_PREFIX + id);
        if (!raw) return null;
        const data = JSON.parse(raw);
        return typeof data?.html === 'string' ? data.html : null;
    } catch {
        return null;
    }
}

function saveDraft(id, html) {
    localStorage.setItem(
        STORAGE_PREFIX + id,
        JSON.stringify({ html, savedAt: Date.now() }),
    );
}

function normalizeHtml(value, fallback = '<p></p>') {
    if (typeof value !== 'string' || !value.trim()) return fallback;
    return value;
}

const root = document.querySelector('.multi-editors');
const apiKey = root?.dataset.apiKey ?? '';

function createEditor({ id, label }) {
    const container = document.getElementById(`editor-${id}`);
    if (!container) return null;

    const previewEl = document.querySelector(`[data-preview-for="${id}"]`);
    const statusEl = document.querySelector(`[data-status-for="${id}"]`);
    const saveBtn = document.querySelector(`[data-action="save"][data-editor-target="${id}"]`);

    const inlineInitial = container.innerHTML;
    const draftHtml = loadDraft(id);
    const initialHtml = normalizeHtml(draftHtml ?? inlineInitial);

    container.innerHTML = '';

    const state = {
        id,
        label,
        html: initialHtml,
    };

    function renderPreview() {
        if (previewEl) previewEl.innerHTML = state.html;
    }

    function setStatus(text) {
        if (!statusEl) return;
        statusEl.textContent = text;
        if (text) {
            clearTimeout(setStatus._t);
            setStatus._t = setTimeout(() => {
                statusEl.textContent = '';
            }, 2500);
        }
    }

    const persist = debounce(() => {
        saveDraft(id, state.html);
    }, 450);

    renderPreview();

    saveBtn?.addEventListener('click', () => {
        saveDraft(id, state.html);
        renderPreview();
        setStatus('Saved locally');
        console.log(`[${label}] saved locally`, state.html);
    });

    init({
        container: `#editor-${id}`,
        apiKey,
        mode: 'edit',
        initialContent: state.html,
        onReady: () => console.log(`[${label}] onReady`),
        onFocus: () => console.log(`[${label}] onFocus`),
        onBlur: () => console.log(`[${label}] onBlur`),
        onChange: (html) => {
            state.html = html;
            console.log(`[${label}] onChange`, html);
            renderPreview();
            persist();
        },
        onAuthSuccess: () => console.log(`[${label}] onAuthSuccess`),
        onAuthError: (message) => console.log(`[${label}] onAuthError`, message),
    });

    return state;
}

const editors = [
    { id: 'excerpt', label: 'Excerpt' },
    { id: 'content', label: 'Main content' },
    { id: 'seo', label: 'SEO description' },
]
    .map(createEditor)
    .filter(Boolean);

window.__multiEditors = editors;
