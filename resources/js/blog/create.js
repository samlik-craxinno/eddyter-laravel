import { init } from 'richtext-core-sdk';
import 'richtext-core-sdk/style.css';
import './create.css';

const STORAGE_KEY = 'richtext_blog_create_draft_v1';

function loadDraft() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { title: '', html: '<p></p>' };
        const data = JSON.parse(raw);
        return {
            title: typeof data.title === 'string' ? data.title : '',
            html: typeof data.html === 'string' && data.html.trim() ? data.html : '<p></p>',
        };
    } catch {
        return { title: '', html: '<p></p>' };
    }
}

function saveDraft(title, html) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ title, html, savedAt: Date.now() }),
    );
}

function debounce(fn, ms) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
    };
}

function readServerContent() {
    const el = document.getElementById('blog-server-state');
    if (!el?.textContent) return null;
    try {
        const state = JSON.parse(el.textContent);
        if (!Object.prototype.hasOwnProperty.call(state, 'content')) return null;
        return state.content;
    } catch {
        return null;
    }
}

function normalizeHtml(value) {
    if (value === null || value === undefined) return '<p></p>';
    if (typeof value !== 'string' || !value.trim()) return '<p></p>';
    return value;
}

const mainEl = document.querySelector('.blog-create');
if (mainEl?.dataset.clearBlogDraft === '1') {
    localStorage.removeItem(STORAGE_KEY);
}

const hasValidationErrors = mainEl?.dataset.hasValidationErrors === '1';

const editorEl = document.getElementById('blog-editor');
const titleInput = document.getElementById('post-title');
const previewEl = document.getElementById('post-preview');
const saveBtn = document.getElementById('save-draft');
const statusEl = document.getElementById('save-status');
const form = document.getElementById('blog-create-form');
const contentHidden = document.getElementById('content-hidden');

const apiKey = editorEl?.dataset?.apiKey ?? '';
const serverContent = readServerContent();
const draft = loadDraft();

if (!hasValidationErrors && !titleInput.value.trim() && draft.title) {
    titleInput.value = draft.title;
}

const initialHtml = normalizeHtml(serverContent !== null ? serverContent : draft.html);
let latestHtml = initialHtml;

function setPreview(html) {
    previewEl.innerHTML = html;
}

function setStatus(text) {
    statusEl.textContent = text;
    if (text) {
        clearTimeout(setStatus._clearTimer);
        setStatus._clearTimer = setTimeout(() => {
            statusEl.textContent = '';
        }, 2500);
    }
}

setPreview(initialHtml);
contentHidden.value = latestHtml;

const persist = debounce(() => {
    saveDraft(titleInput.value.trim(), latestHtml);
}, 450);

titleInput.addEventListener('input', () => {
    persist();
});

saveBtn.addEventListener('click', () => {
    saveDraft(titleInput.value.trim(), latestHtml);
    setPreview(latestHtml);
    setStatus('Saved locally');
});

form.addEventListener('submit', () => {
    contentHidden.value = latestHtml;
});

function destroyEditorIfAny() {
    const el = document.getElementById('blog-editor');
    const handle = el?.__eddyter__;
    if (handle && typeof handle.destroy === 'function') {
        handle.destroy();
    }
}

function mountEditor() {
    destroyEditorIfAny();
    init({
        container: '#blog-editor',
        apiKey,
        mode: 'edit',
        initialContent: latestHtml,
        onChange: (html) => {
            latestHtml = html;
            contentHidden.value = html;
            setPreview(html);
            persist();
        },
    });
}

mountEditor();
