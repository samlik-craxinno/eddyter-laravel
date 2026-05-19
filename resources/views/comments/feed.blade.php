@extends('layouts.app')

@push('vite')
    @vite(['resources/js/comments/feed.js'])
@endpush

@section('title', 'Comments — fake feed')

@section('content')
    @php
        $posts = [
            [
                'id' => 1,
                'author' => 'Alex Chen',
                'handle' => '@alexchen',
                'time' => '2h',
                'body' => "Shipped a dark-mode toggle today. Still tweaking contrast on nested cards — feedback welcome.",
            ],
            [
                'id' => 2,
                'author' => 'Jordan Lee',
                'handle' => '@jordanlee',
                'time' => '5h',
                'body' => "Hot take: local-first drafts beat cloud sync for long-form writing. Change my mind.",
            ],
            [
                'id' => 3,
                'author' => 'Sam Rivera',
                'handle' => '@samcodes',
                'time' => '1d',
                'body' => "Reminder: hydrate. Also: your `useEffect` dependency array is lying to you.",
            ],
            [
                'id' => 4,
                'author' => 'Casey Wu',
                'handle' => '@caseyw',
                'time' => '1d',
                'body' => "Weekend project — fake social feed with inline rich-text replies. No backend, all vibes.",
            ],
            [
                'id' => 5,
                'author' => 'Morgan Patel',
                'handle' => '@morganp',
                'time' => '2d',
                'body' => "If it works in prod and nobody knows how, is it still engineering?",
            ],
        ];
    @endphp

    <main class="comments-feed" data-api-key="{{ config('services.eddyter.api_key') }}">
        <header class="comments-feed__header">
            <h1 class="comments-feed__title">Fake feed</h1>
            <p class="comments-feed__hint">Reply opens an Eddyter editor mounted on demand. Several posts can have editors open at once. Cancel calls <code>instance.destroy()</code>. Save stores HTML in <code>localStorage</code>.</p>
        </header>

        <div class="comments-feed__list" role="feed">
            @foreach ($posts as $post)
                <article class="feed-post" data-post-id="{{ $post['id'] }}" aria-labelledby="post-{{ $post['id'] }}-author">
                    <div class="feed-post__header">
                        <div class="feed-post__avatar" aria-hidden="true"></div>
                        <div class="feed-post__meta">
                            <div class="feed-post__author-row">
                                <span class="feed-post__author" id="post-{{ $post['id'] }}-author">{{ $post['author'] }}</span>
                                <span class="feed-post__handle">{{ $post['handle'] }}</span>
                            </div>
                            <span class="feed-post__time">{{ $post['time'] }}</span>
                        </div>
                    </div>
                    <p class="feed-post__body">{{ $post['body'] }}</p>

                    <div class="feed-post__actions">
                        <button type="button" class="feed-post__btn feed-post__btn--primary" data-action="reply">Reply</button>
                        <button type="button" class="feed-post__btn" data-action="cancel-reply" hidden>Cancel</button>
                        <button type="button" class="feed-post__btn feed-post__btn--save" data-action="save-reply" hidden>Save locally</button>
                        <span class="feed-post__save-status" data-save-status hidden aria-live="polite"></span>
                    </div>

                    <div class="feed-post__composer" data-reply-composer hidden>
                        <p class="feed-post__composer-label">Reply</p>
                        <div
                            id="reply-editor-{{ $post['id'] }}"
                            class="feed-post__editor-mount"
                        ></div>
                    </div>

                    <section class="feed-post__preview-section" aria-label="Reply preview">
                        <h2 class="feed-post__preview-heading">Reply preview</h2>
                        <div class="feed-post__preview" data-reply-preview></div>
                    </section>
                </article>
            @endforeach
        </div>
    </main>
@endsection
