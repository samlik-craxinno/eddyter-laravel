import './modal.css';

const root = document.querySelector('.modal-test');
const apiKey = 'eddyt_p2wIdbf8g23XBz2qcCgqgjHaAKGJUVkDrdFBx219RObYTb6WPPCINzPGF8FcFV6Wzz14tRPCyH2QcF32WYLHRksvda'

const dialog = document.getElementById('editor-modal');
const openBtn = document.getElementById('modal-open-btn');
const closeBtn = document.getElementById('modal-close-btn');
const host = document.getElementById('modal-editor-host');
const settings = document.getElementById('modal-test-settings');
const cycleEl = document.getElementById('modal-cycle-count');
const statusEl = document.getElementById('modal-status');
const maxHeightInput = document.getElementById('modal-max-height');

/** @type {null | ((opts: Record<string, unknown>) => { destroy: () => void })} */
let initFn = null;
/** @type {{ destroy: () => void } | null} */
let instance = null;
let latestHtml = '<p>Content survives close/reopen cycles (same session).</p>';
let completedCycles = 0;

async function loadSdk() {
    if (initFn) return initFn;
    const [mod] = await Promise.all([
        import('richtext-core-sdk'),
        import('richtext-core-sdk/style.css'),
    ]);
    initFn = mod.init;
    return initFn;
}

function getToolbarMode() {
    const el = document.querySelector('input[name="toolbar-mode"]:checked');
    return el?.value === 'static' ? 'static' : 'sticky';
}

function getMaxHeightPx() {
    const n = Number(maxHeightInput?.value);
    if (!Number.isFinite(n)) return 280;
    return Math.min(900, Math.max(120, Math.round(n)));
}

function setSettingsLocked(locked) {
    if (settings) settings.disabled = locked;
    if (openBtn) openBtn.disabled = locked;
}

function setBodyMaxCss(px) {
    if (!dialog) return;
    dialog.style.setProperty('--modal-body-max', `min(70vh, ${px + 140}px)`);
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
}

async function mountEditorInModal() {
    if (!host || !dialog) return;
    if (instance) return;

    const init = await loadSdk();
    if (!dialog.open) return;

    const toolbarMode = getToolbarMode();
    const maxH = getMaxHeightPx();
    setBodyMaxCss(maxH);

    const toolbar = {
        mode: toolbarMode,
        offset: 8,
        zIndex: 10050,
    };

    /** SDK wires editor.maxHeight into the surface when toolbar.mode is static */
    const editor = { maxHeight: maxH };

    const inst = init({
        container: '#modal-editor-host',
        apiKey,
        mode: 'edit',
        initialContent: latestHtml,
        toolbar: {mode: 'static', zIndex: 999 , offset:500 },
        editor,
        style: {
            maxHeight: `${maxH + 160}px`,
        },
        onChange: (html) => {
            latestHtml = html;
        },
        onReady: () => setStatus('Editor ready'),
    });

    if (!dialog.open) {
        inst.destroy();
        return;
    }

    instance = inst;
}

function onDialogClose() {
    const hadInstance = !!instance;
    destroyEditor();
    setSettingsLocked(false);
    if (hadInstance) {
        completedCycles += 1;
        if (cycleEl) cycleEl.textContent = String(completedCycles);
        setStatus('Destroyed on modal close');
    }
}

openBtn?.addEventListener('click', () => {
    if (!dialog) return;
    setSettingsLocked(true);
    dialog.showModal();
    mountEditorInModal().catch((err) => {
        console.error(err);
        setStatus('Failed to load editor');
        dialog.close();
    });
});

closeBtn?.addEventListener('click', () => {
    dialog?.close();
});

dialog?.addEventListener('close', onDialogClose);

dialog?.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
});
