import './modal.css';

const root = document.querySelector('.modal-page');
const apiKey = root?.dataset.apiKey ?? '';

const dialog = document.getElementById('editor-modal');
const openBtn = document.getElementById('modal-open-btn');
const closeBtn = document.getElementById('modal-close-btn');
const footerCloseBtn = document.getElementById('modal-footer-close-btn');
const host = document.getElementById('modal-editor-host');
const previewEl = document.getElementById('modal-preview');
const settings = document.getElementById('modal-test-settings');
const statusEl = document.getElementById('modal-status');
const maxHeightSelect = document.getElementById('modal-max-height');
const stateEl = document.getElementById('modal-state');
const toolbarLabelEl = document.getElementById('modal-toolbar-label');
const heightLabelEl = document.getElementById('modal-height-label');
const mountCountEl = document.getElementById('modal-mount-count');
const destroyCountEl = document.getElementById('modal-destroy-count');
const logEl = document.getElementById('modal-lifecycle-log');

/** @type {null | ((opts: Record<string, unknown>) => { destroy: () => void })} */
let initFn = null;
/** @type {{ destroy: () => void } | null} */
let instance = null;
let latestHtml = '<p>Editor initialized when the modal opened.</p>';
let mountCount = 0;
let destroyCount = 0;

async function loadSdk() {
    if (initFn) return initFn;
    const [mod] = await Promise.all([
        import('@eddyter/core'),
        import('@eddyter/core/style.css'),
    ]);
    initFn = mod.init;
    return initFn;
}

function getToolbarMode() {
    const el = document.querySelector('input[name="toolbar-mode"]:checked');
    return el?.value === 'static' ? 'static' : 'sticky';
}

function getMaxHeight() {
    const value = maxHeightSelect?.value;
    return typeof value === 'string' && value ? value : '320px';
}

function getMaxHeightPx() {
    const match = getMaxHeight().match(/^(\d+)/);
    const n = match ? Number(match[1]) : 320;
    return Math.min(900, Math.max(120, n));
}

function pushLog(line) {
    if (!logEl) return;
    const stamp = new Date().toISOString().slice(11, 23);
    const item = document.createElement('li');
    item.textContent = `${stamp}  ${line}`;
    logEl.prepend(item);
    while (logEl.children.length > 100) {
        logEl.lastElementChild?.remove();
    }
}

function updateStats({ modalOpen = dialog?.open ?? false } = {}) {
    const toolbarMode = getToolbarMode();
    const maxHeight = getMaxHeight();

    if (stateEl) stateEl.textContent = modalOpen ? 'open' : 'closed';
    if (toolbarLabelEl) toolbarLabelEl.textContent = toolbarMode;
    if (heightLabelEl) heightLabelEl.textContent = maxHeight;
    if (mountCountEl) mountCountEl.textContent = String(mountCount);
    if (destroyCountEl) destroyCountEl.textContent = String(destroyCount);
}

function setPreview(html) {
    if (previewEl) previewEl.innerHTML = html;
}

function setSettingsLocked(locked) {
    if (settings) settings.toggleAttribute('disabled', locked);
    if (openBtn) openBtn.disabled = locked;
}

function setStatus(text) {
    if (!statusEl) return;
    statusEl.textContent = text;
    if (text) {
        clearTimeout(setStatus._t);
        setStatus._t = setTimeout(() => {
            statusEl.textContent = '';
        }, 2400);
    }
}

function destroyEditor() {
    if (!instance) return;
    instance.destroy();
    instance = null;
    destroyCount += 1;
    pushLog(`[Modal] Eddyter destroyed (total: ${destroyCount})`);
    updateStats();
}

async function mountEditorInModal() {
    if (!host || !dialog) return;
    if (instance) return;

    const init = await loadSdk();
    if (!dialog.open) return;

    const toolbarMode = getToolbarMode();
    const maxH = getMaxHeightPx();

    const toolbar =
        toolbarMode === 'sticky'
            ? { mode: 'sticky', offset: 10, zIndex: 1000 }
            : { mode: 'static' };

    const editor = { maxHeight: maxH };

    const inst = init({
        container: '#modal-editor-host',
        apiKey,
        mode: 'edit',
        initialContent: latestHtml,
        toolbar,
        editor,
        onChange: (html) => {
            latestHtml = html;
            setPreview(html);
        },
        onReady: () => {
            mountCount += 1;
            pushLog(`[Modal] Eddyter mounted (total: ${mountCount})`);
            updateStats({ modalOpen: true });
            setStatus('Editor ready');
        },
    });

    if (!dialog.open) {
        inst.destroy();
        return;
    }

    instance = inst;
    setPreview(latestHtml);
}

function closeModal() {
    dialog?.close();
}

function onDialogClose() {
    const hadInstance = !!instance;
    destroyEditor();
    setSettingsLocked(false);
    updateStats({ modalOpen: false });
    if (hadInstance) {
        pushLog('[Modal] closed — destroying editor');
        setStatus('Destroyed on modal close');
    }
}

openBtn?.addEventListener('click', () => {
    if (!dialog) return;
    setSettingsLocked(true);
    updateStats({ modalOpen: true });
    pushLog('[Modal] opened — mounting editor');
    dialog.showModal();
    mountEditorInModal().catch((err) => {
        console.error(err);
        setStatus('Failed to load editor');
        pushLog('[Modal] failed to load editor');
        dialog.close();
    });
});

closeBtn?.addEventListener('click', closeModal);
footerCloseBtn?.addEventListener('click', closeModal);

dialog?.addEventListener('close', onDialogClose);

dialog?.addEventListener('click', (e) => {
    if (e.target === dialog) closeModal();
});

document.querySelectorAll('input[name="toolbar-mode"]').forEach((input) => {
    input.addEventListener('change', () => updateStats({ modalOpen: dialog?.open ?? false }));
});

maxHeightSelect?.addEventListener('change', () => updateStats({ modalOpen: dialog?.open ?? false }));

updateStats();
