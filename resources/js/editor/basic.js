import { init } from 'richtext-core-sdk';
import 'richtext-core-sdk/style.css';

const el = document.getElementById('editor');
const apiKey = el?.dataset.apiKey ?? '';

init({
    container: '#editor',
    apiKey,
    mode: 'edit',
    initialContent: '<p>Start typing…</p>',
    onReady: () => console.log('[Eddyter] onReady'),
    onFocus: () => console.log('[Eddyter] onFocus'),
    onBlur: () => console.log('[Eddyter] onBlur'),
    onChange: (html) => console.log('[Eddyter] onChange', html),
    onAuthSuccess: () => console.log('[Eddyter] onAuthSuccess'),
    onAuthError: (message) => console.log('[Eddyter] onAuthError', message),
});
