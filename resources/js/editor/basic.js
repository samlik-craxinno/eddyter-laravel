import './basic.css';
import { init } from 'richtext-core-sdk';
import 'richtext-core-sdk/style.css';

const STORAGE_THEME = 'basic-editor:theme';

const root = document.querySelector('.basic-page');
const apiKey = root?.dataset.apiKey ?? '';
const themeToggle = document.getElementById('basic-theme-toggle');

/** @type {import('richtext-core-sdk').EddyterInstance | null} */
let instance = null;
let latestHtml = '<p>Start typing…</p>';

function loadThemePreference() {
    const stored = localStorage.getItem(STORAGE_THEME);
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyDocumentTheme(dark) {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}

function updateToggleLabel(dark) {
    if (!themeToggle) return;
    themeToggle.textContent = dark ? 'Light theme' : 'Dark theme';
    themeToggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
}

let isDark = loadThemePreference();
applyDocumentTheme(isDark);
updateToggleLabel(isDark);

instance = init({
    container: '#editor',
    apiKey,
    mode: 'edit',
    darkMode: isDark,
    initialContent: latestHtml,
    onReady: () => console.log('[Eddyter] onReady'),
    onFocus: () => console.log('[Eddyter] onFocus'),
    onBlur: () => console.log('[Eddyter] onBlur'),
    onChange: (html) => {
        latestHtml = html;
        console.log('[Eddyter] onChange', html);
    },
    onAuthSuccess: () => console.log('[Eddyter] onAuthSuccess'),
    onAuthError: (message) => console.log('[Eddyter] onAuthError', message),
});

themeToggle?.addEventListener('click', () => {
    isDark = !isDark;
    applyDocumentTheme(isDark);
    updateToggleLabel(isDark);
    localStorage.setItem(STORAGE_THEME, isDark ? 'dark' : 'light');
    instance?.update({ darkMode: isDark });
});
