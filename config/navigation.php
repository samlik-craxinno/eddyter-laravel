<?php

return [
    'items' => [
        [
            'label' => 'Basic editor',
            'route' => 'editor.basic',
        ],
        [
            'label' => 'Lifecycle',
            'route' => 'editor.lifecycle',
        ],
        [
            'label' => 'Modal editor',
            'route' => 'editor.modal',
        ],
        [
            'label' => 'Multi editors',
            'route' => 'blog.multiple-editors',
        ],
        [
            'label' => 'New post',
            'route' => 'blog.create',
            'active' => ['blog.create', 'blog.create.store'],
        ],
        [
            'label' => 'Comments',
            'route' => 'comments.feed',
        ],
    ],
];
