<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', config('app.name', 'Laravel'))</title>
    @vite(['resources/css/app.css', 'resources/css/nav-sidebar.css'])
    @stack('vite')
</head>
<body>
    <div class="app-shell">
        <header class="app-shell__header">
            <div class="app-shell__brand">
                <span class="app-shell__logo" aria-hidden="true">E</span>
                <div>
                    <p class="app-shell__title">Eddyter Laravel</p>
                    <p class="app-shell__subtitle">richtext-core-laravel adapter test</p>
                </div>
            </div>
        </header>

        <div class="app-shell__body">
            <aside class="app-shell__nav">
                @include('partials.nav-sidebar')
            </aside>
            <main class="app-shell__main">
                @yield('content')
            </main>
        </div>
    </div>
</body>
</html>
