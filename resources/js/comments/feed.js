import './feed.css';

const STORAGE_PREFIX = 'richtext_comments_reply_v1:';

function storageKey(postId) {
    return STORAGE_PREFIX + postId;
}

function loadSaved(postId) {
    try {
        const raw = localStorage.getItem(storageKey(postId));
        if (!raw) return '<p></p>';
        const data = JSON.parse(raw);
        const html = typeof data?.html === 'string' ? data.html : '';
        return html.trim() ? html : '<p></p>';
    } catch {
        return '<p></p>';
    }
}

function saveLocal(postId, html) {
    localStorage.setItem(
        storageKey(postId),
        JSON.stringify({ html, savedAt: Date.now() }),
    );
}

const root = document.querySelector('.comments-feed');
const apiKey = root?.dataset.apiKey ?? '';

/** @type {null | ((opts: Record<string, unknown>) => { destroy: () => void })} */
let initFn = null;

/** @type {Record<string, ReturnType<typeof setTimeout>>} */
const saveStatusTimers = {};

async function loadSdk() {
    if (initFn) return initFn;
    const [mod] = await Promise.all([
        import('@eddyter/core'),
        import('@eddyter/core/style.css'),
    ]);
    initFn = mod.init;
    return initFn;
}

/**
 * @typedef {{ instance: { destroy: () => void } | null, workingHtml: string, savedHtml: string, opening?: boolean }} PostReplyState
 */

/** @type {Map<string, PostReplyState>} */
const byPostId = new Map();

function getPostEl(postId) {
    return document.querySelector(`.feed-post[data-post-id="${CSS.escape(postId)}"]`);
}

function setPreview(postId, html) {
    const post = getPostEl(postId);
    const preview = post?.querySelector('[data-reply-preview]');
    if (!preview) return;
    const empty = !html || html === '<p></p>' || !html.replace(/<[^>]+>/g, '').trim();
    if (empty) {
        preview.innerHTML = '';
        return;
    }
    preview.innerHTML = html;
}

function setComposerVisible(postId, visible) {
    const post = getPostEl(postId);
    const composer = post?.querySelector('[data-reply-composer]');
    const replyBtn = post?.querySelector('[data-action="reply"]');
    const cancelBtn = post?.querySelector('[data-action="cancel-reply"]');
    const saveBtn = post?.querySelector('[data-action="save-reply"]');
    if (composer) composer.hidden = !visible;
    if (replyBtn) replyBtn.hidden = visible;
    if (cancelBtn) cancelBtn.hidden = !visible;
    if (saveBtn) saveBtn.hidden = !visible;
}

function setSaveStatus(postId, text) {
    const post = getPostEl(postId);
    const el = post?.querySelector('[data-save-status]');
    if (!el) return;
    clearTimeout(saveStatusTimers[postId]);
    delete saveStatusTimers[postId];
    if (!text) {
        el.textContent = '';
        el.hidden = true;
        return;
    }
    el.hidden = false;
    el.textContent = text;
    saveStatusTimers[postId] = setTimeout(() => {
        el.textContent = '';
        el.hidden = true;
        delete saveStatusTimers[postId];
    }, 2200);
}

function ensureState(postId) {
    let s = byPostId.get(postId);
    if (s) return s;
    const savedHtml = loadSaved(postId);
    s = {
        instance: null,
        workingHtml: savedHtml,
        savedHtml,
    };
    byPostId.set(postId, s);
    setPreview(postId, savedHtml);
    return s;
}

function destroyReplyEditor(postId, reason) {
    const s = byPostId.get(postId);
    if (!s?.instance) return;
    s.instance.destroy();
    s.instance = null;
    setComposerVisible(postId, false);
    s.workingHtml = s.savedHtml;
    setPreview(postId, s.savedHtml);
    setSaveStatus(postId, '');
    console.log(`[comments] destroy post ${postId} (${reason})`);
}

async function openReplyEditor(postId) {
    const s = ensureState(postId);
    if (s.instance || s.opening) return;
    s.opening = true;

    try {
        const post = getPostEl(postId);
        const mount = post?.querySelector(`#reply-editor-${postId}`);
        if (!(mount instanceof HTMLElement)) return;

        setComposerVisible(postId, true);

        const init = await loadSdk();
        if (s.instance) return;

        const initial = s.savedHtml;

        s.instance = init({
            container: `#reply-editor-${postId}`,
            apiKey,
            mode: 'edit',
            initialContent: initial,
            onChange: (html) => {
                s.workingHtml = html;
                setPreview(postId, html);
            },
            onReady: () => console.log(`[comments] onReady post ${postId}`),
            mentionUserList: ["sam", "alex", "maria", "john.doe"],
        });

        s.workingHtml = initial;
        setPreview(postId, initial);
    } finally {
        s.opening = false;
    }
}

function saveReply(postId) {
    const s = ensureState(postId);
    saveLocal(postId, s.workingHtml);
    s.savedHtml = s.workingHtml;
    setPreview(postId, s.savedHtml);
    setSaveStatus(postId, 'Saved locally');
}

document.querySelector('.comments-feed__list')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const post = btn.closest('.feed-post');
    const postId = post?.dataset.postId;
    if (!postId) return;

    const action = btn.getAttribute('data-action');
    if (action === 'reply') {
        openReplyEditor(postId).catch((err) => {
            console.error(err);
            setSaveStatus(postId, 'Could not load editor');
        });
    } else if (action === 'cancel-reply') {
        destroyReplyEditor(postId, 'cancel');
    } else if (action === 'save-reply') {
        saveReply(postId);
    }
});

document.querySelectorAll('.feed-post[data-post-id]').forEach((article) => {
    const postId = article.dataset.postId;
    if (postId) ensureState(postId);
});
