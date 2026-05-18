import './lifecycle.css';

const MAX_LOG = 150;

const root = document.querySelector('.lifecycle-page');
const apiKey = root?.dataset.apiKey ?? '';

const mountBtn = document.getElementById('lifecycle-mount');
const destroyBtn = document.getElementById('lifecycle-destroy');
const recreateBtn = document.getElementById('lifecycle-recreate');
const container = document.getElementById('lifecycle-editor');
const logOl = document.getElementById('lifecycle-log');
const elCount = document.getElementById('lifecycle-instance-count');
const elMounted = document.getElementById('lifecycle-mounted');
const elHtmlLen = document.getElementById('lifecycle-html-len');
const elLastChange = document.getElementById('lifecycle-last-change');

let initFn = null;
/** @type {{ destroy: () => void } | null} */
let instance = null;
let latestHtml = '<p>Lifecycle test — type here after mount.</p>';
/** @type {Date | null} */
let lastChangeAt = null;

function pad2(n) {
    return String(n).padStart(2, '0');
}

function timestamp() {
    const d = new Date();
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}.${String(d.getMilliseconds()).padStart(3, '0')}`;
}

function log(message) {
    if (!logOl) return;
    const li = document.createElement('li');
    const t = document.createElement('time');
    t.dateTime = new Date().toISOString();
    t.textContent = timestamp();
    li.appendChild(t);
    li.appendChild(document.createTextNode(` ${message}`));
    logOl.insertBefore(li, logOl.firstChild);
    while (logOl.children.length > MAX_LOG) {
        logOl.removeChild(logOl.lastChild);
    }
}

function setActiveCount(n) {
    if (elCount) elCount.textContent = String(n);
}

function setMounted(yes) {
    if (elMounted) elMounted.textContent = yes ? 'yes' : 'no';
}

function updateStatePanel() {
    if (elHtmlLen) {
        elHtmlLen.textContent = instance ? String(latestHtml.length) : '—';
    }
}

function setLastChangeLine() {
    if (!elLastChange) return;
    if (!instance || !lastChangeAt) {
        elLastChange.textContent = instance ? 'No onChange yet' : '—';
        return;
    }
    const t = lastChangeAt;
    const clock = `${pad2(t.getHours())}:${pad2(t.getMinutes())}:${pad2(t.getSeconds())}`;
    const preview = latestHtml.replace(/\s+/g, ' ').trim().slice(0, 72);
    elLastChange.textContent = `${clock} · len ${latestHtml.length} · ${preview}${latestHtml.length > 72 ? '…' : ''}`;
}

async function loadSdk() {
    if (initFn) return initFn;
    const [mod] = await Promise.all([
        import('richtext-core-sdk'),
        import('richtext-core-sdk/style.css'),
    ]);
    initFn = mod.init;
    log('SDK loaded (dynamic import)');
    return initFn;
}

function destroyEditor(reason = 'manual') {
    if (!instance) {
        log(`destroy skipped (${reason}, no instance)`);
        return;
    }
    instance.destroy();
    instance = null;
    lastChangeAt = null;
    setActiveCount(0);
    setMounted(false);
    updateStatePanel();
    if (elLastChange) elLastChange.textContent = '—';
    log(`destroy() completed (${reason})`);
}

async function mountEditor(reason = 'mount') {
    if (!container) return;
    if (instance) {
        log(`mount skipped (${reason}, already mounted)`);
        return;
    }
    if (container.__eddyter__) {
        log('mount skipped: container.__eddyter__ still set; call destroy first');
        return;
    }

    const init = await loadSdk();

    instance = init({
        container: '#lifecycle-editor',
        apiKey,
        mode: 'edit',
        initialContent: latestHtml,
        onReady: () => {
            log('onReady');
        },
        onFocus: () => log('onFocus'),
        onBlur: () => log('onBlur'),
        onChange: (html) => {
            latestHtml = html;
            lastChangeAt = new Date();
            updateStatePanel();
            setLastChangeLine();
            log(`onChange (length ${html.length})`);
        },
        onAuthSuccess: () => log('onAuthSuccess'),
        onAuthError: (msg) => log(`onAuthError: ${msg}`),
    });

    setActiveCount(1);
    setMounted(true);
    updateStatePanel();
    if (elLastChange) elLastChange.textContent = 'No onChange yet';
    log(`init() returned instance; mounted (${reason})`);
}

async function recreateEditor() {
    log('recreate: destroy then mount');
    destroyEditor('recreate');
    await mountEditor('recreate');
}

mountBtn?.addEventListener('click', () => {
    mountEditor('button').catch((err) => {
        log(`mount error: ${err?.message ?? err}`);
        console.error(err);
    });
});

destroyBtn?.addEventListener('click', () => {
    destroyEditor('button');
});

recreateBtn?.addEventListener('click', () => {
    recreateEditor().catch((err) => {
        log(`recreate error: ${err?.message ?? err}`);
        console.error(err);
    });
});

log('Page ready — use Mount to load the editor.');
