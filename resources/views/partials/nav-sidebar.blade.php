<nav class="nav-sidebar" aria-label="Main">
    <ul class="nav-sidebar__list">
        @foreach (config('navigation.items') as $item)
            @php
                $activeRoutes = $item['active'] ?? [$item['route']];
            @endphp
            <li>
                <a
                    href="{{ route($item['route']) }}"
                    class="nav-sidebar__link @if (request()->routeIs(...$activeRoutes)) nav-sidebar__link--active @endif"
                >
                    {{ $item['label'] }}
                </a>
            </li>
        @endforeach
    </ul>
</nav>
