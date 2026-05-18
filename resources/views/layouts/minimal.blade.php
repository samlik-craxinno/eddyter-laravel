<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', config('app.name', 'Laravel'))</title>
    @vite(['resources/css/app.css'])
    @stack('vite')
</head>
<body style="margin:0;font-family:system-ui,sans-serif;background:#fafafa;color:#111;">
    @yield('content')
</body>
</html>
