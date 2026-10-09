# IX2 (legacy) interactions — зведення з опублікованого webflow.js (2026-10-09)

events: 112, actionLists: 26. Повний JSON: `reference/ix2-interactions.json`.
Імена action lists у публікації зрізані, тому тут — що саме анімується (тип→ціль=значення).

| Подія | Тригер (клас) | id | Дії |
|---|---|---|---|
| MOUSE_CLICK | `.trigger` |  | STYLE_OPACITY→`.loader-wrap`=0 ; GENERAL_DISPLAY→`.loader-wrap`=none |
| SCROLLING_IN_VIEW | `82669f55-58cb-92c6-092b-e331980e111b` |  | CONTINUOUS(SCROLL_PROGRESS): STYLE_BACKGROUND_COLOR→`.resources-overlay`; TRANSFORM_MOVE→`.footer-cloud-item.is-first`; TRANSFORM_MOVE→`.footer-cloud-item.is-fourth`; TRANSFORM_MOVE→`.footer-cloud-item.is-second`; TRANSFORM_MOVE→`.footer-cloud-item.is-third` |
| SCROLL_INTO_VIEW | `82669f55-58cb-92c6-092b-e331980e111b` |  | STYLE_OPACITY→`.sound-btn-wrap`=0 ; TRANSFORM_SCALE→`.sound-btn-wrap`=None ; GENERAL_DISPLAY→`.sound-btn-wrap`=none |
| SCROLL_OUT_OF_VIEW | `82669f55-58cb-92c6-092b-e331980e111b` |  | GENERAL_DISPLAY→`.sound-btn-wrap`=block ; STYLE_OPACITY→`.sound-btn-wrap`=1 ; TRANSFORM_SCALE→`.sound-btn-wrap`=None |
| MOUSE_CLICK | `72f99802-b564-d60d-caa1-fe3317922afc` |  | GENERAL_DISPLAY→`.nav-menu`=none ; STYLE_OPACITY→`.nav-menu`=0 ; TRANSFORM_MOVE→`.nav-links`=None ; TRANSFORM_MOVE→`.toggle-label`=None ; GENERAL_DISPLAY→`.nav-menu`=block ; STYLE_OPACITY→`.nav-menu`=1 ; TRANSFORM_MOVE→`.nav-links`=None ; TRANSFORM_MOVE→`.toggle-label`=None ; TRANSFORM_ROTATE→`.toggle-span.is-top`=None ; TRANSFORM_MOVE→`.toggle-span.is-top`=None ; TRANSFORM_ROTATE→`.toggle-span.is-bottom`=None ; TRANSFORM_MOVE→`.toggle-span.is-bottom`=None |
| MOUSE_SECOND_CLICK | `72f99802-b564-d60d-caa1-fe3317922afc` |  | STYLE_OPACITY→`.nav-menu`=0 ; TRANSFORM_MOVE→`.nav-links`=None ; TRANSFORM_MOVE→`.toggle-label`=None ; TRANSFORM_ROTATE→`.toggle-span.is-top`=None ; TRANSFORM_MOVE→`.toggle-span.is-top`=None ; TRANSFORM_ROTATE→`.toggle-span.is-bottom`=None ; TRANSFORM_MOVE→`.toggle-span.is-bottom`=None ; GENERAL_DISPLAY→`.nav-menu`=none |
| MOUSE_OVER | `a444f0ef-5fde-6453-64a2-b7d23695011f` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `a444f0ef-5fde-6453-64a2-b7d23695011f` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `ff871729-a1ce-4057-1f88-4b7877586ece` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `ff871729-a1ce-4057-1f88-4b7877586ece` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `ec5acce9-4ef8-223e-2628-45d45eac80e4` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `ec5acce9-4ef8-223e-2628-45d45eac80e4` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `a42c050c-f385-70f7-c89f-873fa512d62f` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `a42c050c-f385-70f7-c89f-873fa512d62f` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `3d60fe29-a496-fa80-7d07-a521649960ea` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `3d60fe29-a496-fa80-7d07-a521649960ea` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `48838b29-5b59-c059-2854-b8c15b7ebaa4` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `48838b29-5b59-c059-2854-b8c15b7ebaa4` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `82b1f0ea-d8b1-c0da-7a05-1f4c99a15bfd` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `82b1f0ea-d8b1-c0da-7a05-1f4c99a15bfd` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `7844f42f-38b9-61d3-1346-fe526a2f9906` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `7844f42f-38b9-61d3-1346-fe526a2f9906` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `31552dc4-b740-dbf1-4d09-e9497cd99ead` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `31552dc4-b740-dbf1-4d09-e9497cd99ead` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `9549b6fb-3c88-c0dd-ec15-d63672030190` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `9549b6fb-3c88-c0dd-ec15-d63672030190` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_CLICK | `1914557c-e1f3-1de2-0b00-ab7b7493bb16` |  | GENERAL_DISPLAY→`.nav-menu`=none ; STYLE_OPACITY→`.nav-menu`=0 ; TRANSFORM_MOVE→`.nav-links`=None ; TRANSFORM_MOVE→`.toggle-label`=None ; GENERAL_DISPLAY→`.nav-menu`=block ; STYLE_OPACITY→`.nav-menu`=1 ; TRANSFORM_MOVE→`.nav-links`=None ; TRANSFORM_MOVE→`.toggle-label`=None ; TRANSFORM_ROTATE→`.toggle-span.is-top`=None ; TRANSFORM_MOVE→`.toggle-span.is-top`=None ; TRANSFORM_ROTATE→`.toggle-span.is-bottom`=None ; TRANSFORM_MOVE→`.toggle-span.is-bottom`=None |
| MOUSE_SECOND_CLICK | `1914557c-e1f3-1de2-0b00-ab7b7493bb16` |  | STYLE_OPACITY→`.nav-menu`=0 ; TRANSFORM_MOVE→`.nav-links`=None ; TRANSFORM_MOVE→`.toggle-label`=None ; TRANSFORM_ROTATE→`.toggle-span.is-top`=None ; TRANSFORM_MOVE→`.toggle-span.is-top`=None ; TRANSFORM_ROTATE→`.toggle-span.is-bottom`=None ; TRANSFORM_MOVE→`.toggle-span.is-bottom`=None ; GENERAL_DISPLAY→`.nav-menu`=none |
| MOUSE_OVER | `1914557c-e1f3-1de2-0b00-ab7b7493bb2b` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `1914557c-e1f3-1de2-0b00-ab7b7493bb2b` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `1914557c-e1f3-1de2-0b00-ab7b7493bb2d` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `1914557c-e1f3-1de2-0b00-ab7b7493bb2d` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `1914557c-e1f3-1de2-0b00-ab7b7493bb2f` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `1914557c-e1f3-1de2-0b00-ab7b7493bb2f` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `1914557c-e1f3-1de2-0b00-ab7b7493bb31` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `1914557c-e1f3-1de2-0b00-ab7b7493bb31` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `1914557c-e1f3-1de2-0b00-ab7b7493bb33` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `1914557c-e1f3-1de2-0b00-ab7b7493bb33` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `1914557c-e1f3-1de2-0b00-ab7b7493bb35` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `1914557c-e1f3-1de2-0b00-ab7b7493bb35` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `1914557c-e1f3-1de2-0b00-ab7b7493bb37` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `1914557c-e1f3-1de2-0b00-ab7b7493bb37` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `1914557c-e1f3-1de2-0b00-ab7b7493bb39` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `1914557c-e1f3-1de2-0b00-ab7b7493bb39` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `1914557c-e1f3-1de2-0b00-ab7b7493bb3b` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `1914557c-e1f3-1de2-0b00-ab7b7493bb3b` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `1914557c-e1f3-1de2-0b00-ab7b7493bb3d` |  | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `1914557c-e1f3-1de2-0b00-ab7b7493bb3d` |  | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_CLICK | `nav-toggle` | menu-toggle | GENERAL_DISPLAY→`.nav-menu`=none ; STYLE_OPACITY→`.nav-menu`=0 ; TRANSFORM_MOVE→`.nav-links`=None ; TRANSFORM_MOVE→`.toggle-label`=None ; GENERAL_DISPLAY→`.nav-menu`=block ; STYLE_OPACITY→`.nav-menu`=1 ; TRANSFORM_MOVE→`.nav-links`=None ; TRANSFORM_MOVE→`.toggle-label`=None ; TRANSFORM_ROTATE→`.toggle-span.is-top`=None ; TRANSFORM_MOVE→`.toggle-span.is-top`=None ; TRANSFORM_ROTATE→`.toggle-span.is-bottom`=None ; TRANSFORM_MOVE→`.toggle-span.is-bottom`=None |
| MOUSE_SECOND_CLICK | `nav-toggle` | menu-toggle | STYLE_OPACITY→`.nav-menu`=0 ; TRANSFORM_MOVE→`.nav-links`=None ; TRANSFORM_MOVE→`.toggle-label`=None ; TRANSFORM_ROTATE→`.toggle-span.is-top`=None ; TRANSFORM_MOVE→`.toggle-span.is-top`=None ; TRANSFORM_ROTATE→`.toggle-span.is-bottom`=None ; TRANSFORM_MOVE→`.toggle-span.is-bottom`=None ; GENERAL_DISPLAY→`.nav-menu`=none |
| MOUSE_OVER | `nav-link w-inline-block` | link1 | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `nav-link w-inline-block` | link1 | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `nav-link w-inline-block` | link2 | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `nav-link w-inline-block` | link2 | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `nav-link w-inline-block` | link3 | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `nav-link w-inline-block` | link3 | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `nav-link w-inline-block` | link4 | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `nav-link w-inline-block` | link4 | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `nav-link w-inline-block` | link5 | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `nav-link w-inline-block` | link5 | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `nav-link w-inline-block` | link6 | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `nav-link w-inline-block` | link6 | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `nav-link w-inline-block` | link7 | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `nav-link w-inline-block` | link7 | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `nav-link w-inline-block` | link8 | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `nav-link w-inline-block` | link8 | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `nav-link w-inline-block` | link9 | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `nav-link w-inline-block` | link9 | PLUGIN_LOTTIE→`.lottie-card`=1 |
| MOUSE_OVER | `nav-link w-inline-block` | link10 | PLUGIN_LOTTIE→`.lottie-card`=1 ; PLUGIN_LOTTIE→`.lottie-card`=99 |
| MOUSE_OUT | `nav-link w-inline-block` | link10 | PLUGIN_LOTTIE→`.lottie-card`=1 |
| SCROLLING_IN_VIEW | `div-2` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.bg-list-item.is-first`; TRANSFORM_MOVE→`.bg-list-item.is-second`; TRANSFORM_MOVE→`.bg-list-item.is-third` |
| SCROLLING_IN_VIEW | `div-2` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.bg-list-item.is-first`; TRANSFORM_MOVE→`.bg-list-item.is-second`; TRANSFORM_MOVE→`.bg-list-item.is-third` |
| MOUSE_CLICK | `h-lottie-hover` | notrealtime | PLUGIN_LOTTIE→`.h-item-lottie`=0 ; PLUGIN_LOTTIE→`.h-item-lottie`=100 ; PLUGIN_LOTTIE→`.h-item-lottie`=0 |
| MOUSE_OVER | `h-lottie-hover` | notrealtime | PLUGIN_LOTTIE→`.h-item-lottie`=0 ; PLUGIN_LOTTIE→`.h-item-lottie`=100 |
| MOUSE_OUT | `h-lottie-hover` | notrealtime | PLUGIN_LOTTIE→`.h-item-lottie`=100 ; PLUGIN_LOTTIE→`.h-item-lottie`=0 |
| SCROLLING_IN_VIEW | `section is-techniques` | techniques | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`bg-image is-star first`; TRANSFORM_MOVE→`bg-image is-star second`; TRANSFORM_MOVE→`list-item is-techniques first`; TRANSFORM_MOVE→`list-item is-techniques second`; TRANSFORM_MOVE→`list-item is-techniques third`; TRANSFORM_ROTATE→`list-item is-techniques first`; TRANSFORM_ROTATE→`list-item is-techniques second`; TRANSFORM_ROTATE→`list-item is-techniques third`; TRANSFORM_SCALE→`bg-image is-star first`; TRANSFORM_SCALE→`bg-image is-star second`; TRANSFO |
| SCROLLING_IN_VIEW | `section is-techniques` | techniques | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`bg-image is-star first`; TRANSFORM_MOVE→`bg-image is-star second`; TRANSFORM_MOVE→`list-item is-techniques first`; TRANSFORM_MOVE→`list-item is-techniques second`; TRANSFORM_MOVE→`list-item is-techniques third`; TRANSFORM_ROTATE→`list-item is-techniques first`; TRANSFORM_ROTATE→`list-item is-techniques second`; TRANSFORM_ROTATE→`list-item is-techniques third`; TRANSFORM_SCALE→`bg-image is-star first`; TRANSFORM_SCALE→`bg-image is-star second`; TRANSFO |
| SCROLLING_IN_VIEW | `section is-techniques` | techniques | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`bg-image is-star first`; TRANSFORM_MOVE→`bg-image is-star second`; TRANSFORM_MOVE→`list-item is-techniques first`; TRANSFORM_MOVE→`list-item is-techniques second`; TRANSFORM_MOVE→`list-item is-techniques third`; TRANSFORM_ROTATE→`list-item is-techniques first`; TRANSFORM_ROTATE→`list-item is-techniques second`; TRANSFORM_ROTATE→`list-item is-techniques third`; TRANSFORM_SCALE→`bg-image is-star first`; TRANSFORM_SCALE→`bg-image is-star second`; TRANSFO |
| SCROLLING_IN_VIEW | `resources` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.resources-cloud-item.first`; TRANSFORM_MOVE→`.resources-cloud-item.fourth`; TRANSFORM_MOVE→`.resources-cloud-item.second`; TRANSFORM_MOVE→`.resources-cloud-item.third` |
| SCROLLING_IN_VIEW | `lesson-item is-examples` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.scrolling-text.is-lessons`; TRANSFORM_MOVE→`.star-vector.even`; TRANSFORM_MOVE→`.star-vector.odd` |
| SCROLLING_IN_VIEW | `lesson-item is-examples` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.scrolling-text.is-lessons`; TRANSFORM_MOVE→`.star-vector.even`; TRANSFORM_MOVE→`.star-vector.odd` |
| SCROLLING_IN_VIEW | `nav-inner nav-dark` |  | CONTINUOUS(SCROLL_PROGRESS): STYLE_OPACITY→`.example-video-1`; STYLE_OPACITY→`.example-video-2`; STYLE_OPACITY→`.example-video-3`; STYLE_OPACITY→`.example-video-4`; STYLE_OPACITY→`.example-video-5`; STYLE_OPACITY→`.example-video-6`; STYLE_SIZE→`.progress-bar_line-active`; STYLE_SIZE→`progress-bar_divider-line_large`; STYLE_SIZE→`progress-bar_divider-line_small`; STYLE_TEXT_COLOR→`.progress-bar_title-1`; STYLE_TEXT_COLOR→`.progress-bar_title-2`; STYLE_TEXT_COLOR→`.progress-bar_title-3` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.card-link.is-third`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `classic-anim_wrap` |  | CONTINUOUS(SCROLL_PROGRESS): STYLE_BACKGROUND_COLOR→`classic-anim_wrap`; STYLE_BACKGROUND_COLOR→`overlay-bg` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.card-link.is-third`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `classic-anim_wrap` |  | CONTINUOUS(SCROLL_PROGRESS): STYLE_BACKGROUND_COLOR→`classic-anim_wrap`; STYLE_BACKGROUND_COLOR→`overlay-bg` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.card-link.is-third`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.card-link.is-third`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.card-link.is-third`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.card-link.is-third`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.card-link.is-third`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation is-last` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation is-last` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.card-link.is-third`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLLING_IN_VIEW | `lesson-item is-implementation is-last` |  | CONTINUOUS(SCROLL_PROGRESS): TRANSFORM_MOVE→`.card-link.is-second`; TRANSFORM_MOVE→`.list-wrap.is-implementation`; TRANSFORM_SCALE→`.title-wrap.is-implementation` |
| SCROLL_INTO_VIEW | `footer` |  | STYLE_OPACITY→`.sound-btn-wrap`=0 ; TRANSFORM_SCALE→`.sound-btn-wrap`=None ; GENERAL_DISPLAY→`.sound-btn-wrap`=none |
| SCROLL_OUT_OF_VIEW | `footer` |  | GENERAL_DISPLAY→`.sound-btn-wrap`=block ; STYLE_OPACITY→`.sound-btn-wrap`=1 ; TRANSFORM_SCALE→`.sound-btn-wrap`=None |
| SCROLLING_IN_VIEW | `footer` |  | CONTINUOUS(SCROLL_PROGRESS): STYLE_BACKGROUND_COLOR→`.resources-overlay`; TRANSFORM_MOVE→`.footer-cloud-item.is-first`; TRANSFORM_MOVE→`.footer-cloud-item.is-fourth`; TRANSFORM_MOVE→`.footer-cloud-item.is-second`; TRANSFORM_MOVE→`.footer-cloud-item.is-third` |
| PAGE_START | `643fc55a8d5a6a31d4d2a4df` |  | TRANSFORM_MOVE→`.nav-panels`=None ; STYLE_OPACITY→`.anim-ball-border.is-preloader`=0 ; TRANSFORM_SCALE→`.anim-ball-border.is-preloader`=None ; TRANSFORM_MOVE→`.text-wrap.is-preloader`=None ; TRANSFORM_SCALE→`.sound-btn-wrap`=None ; PLUGIN_LOTTIE→`.preloader_lottie`=0 ; STYLE_BACKGROUND_COLOR→`.preloader_lottie`=None ; STYLE_SIZE→`.ball-divider.is-preloader-left`=None ; GENERAL_DISPLAY→`.loader-wrap`=flex ; GENERAL_DISPLAY→`.anim-ball-wrap.is-preloader`=none ; GENERAL_DISPLAY→`.loader-wrap`=none  |

## Підсумок за типами

- SCROLLING_IN_VIEW: 37
- MOUSE_OVER: 31
- MOUSE_OUT: 31
- MOUSE_CLICK: 5
- MOUSE_SECOND_CLICK: 3
- SCROLL_INTO_VIEW: 2
- SCROLL_OUT_OF_VIEW: 2
- PAGE_START: 1
