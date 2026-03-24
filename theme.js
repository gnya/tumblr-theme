(() => {
  if (jQuery === undefined) {
    console.error("theme.js : jQuery is required but was not found.");

    return;
  }

  // テーマを初期化する
  // NOTE すべての要素を追加し終わった後に実行してください
  window.initTumblrTheme = () => {
    // ページとフォントの読み込みが終わったらページを表示する
    $(window).on('load', () => {
      document.fonts.ready.then(() => {
        $('.site-wrapper').css({'opacity' : 1});
      });
    });

    // 読み込みが終わったメディアを表示する
    $('.media img, .media iframe').each(function () {
      if (this.complete) {
        this.style.opacity = 1;
      } else {
        $(this).one('load', () => this.style.opacity = 1);
      }
    });

    $('.media video').each(function () {
      const poster = $(this).prev('img')[0];

      if (poster === undefined) {
        return;
      } else if (poster.complete) {
        this.style.opacity = 1;
      } else {
        $(poster).one('load', () => this.style.opacity = 1);
      }
    });

    // video要素の再生ボタンを置き換えるためイベントを登録する
    $('.media__video').on('click', function () {
      const video = $(this).find('video')[0];
      const $overlay = $(this).find('.video-overlay');
      const $icon = $overlay.find('i');

      if (video === undefined) {
        return
      } else if (video.paused) {
        video.play();
        $overlay.css({'opacity' : 0});
        $icon.attr('class', 'fa-solid fa-pause');
      } else {
        video.pause();
        $overlay.css({'opacity' : 1});
        $icon.attr('class', 'fa-solid fa-play');
      }
    });

    $('.portrait__link, .nav-posts__link, .caption__link, .tags__link, .nav-pages__link').on('click', function (event) {
      const $link = $(this);
      const $html = $('html');

      // 次のページへの移動を一旦キャンセルする
      event.preventDefault();

      // 他のページに移動する際にページを一旦非表示にする
      $('.site-wrapper').css({'opacity' : 0});

      // 次のページの背景色に変更する
      if ($link.is('.portrait__link, .tags__link')) {
        $html.css({
          '--theme-current-page': 1,
          '--theme-is-index-page': 1
        });
      } else if ($link.is('.nav-posts__link, .caption__link')) {
        $html.css({
          // '--theme-current-page': any,
          '--theme-is-index-page': 0
        });
      } else if ($link.is('.nav-pages__link--jump-page')) {
        $html.css({
          '--theme-current-page': $link.css('--theme-jump-page'),
          '--theme-is-index-page': 1
        });
      } else if ($link.is('.nav-pages__link--previous-page')) {
        $html.css({
          '--theme-current-page': parseInt($html.css('--theme-current-page')) - 1,
          '--theme-is-index-page': 1
        });
      } else if ($link.is('.nav-pages__link--next-page')) {
        $html.css({
          '--theme-current-page': parseInt($html.css('--theme-current-page')) + 1,
          '--theme-is-index-page': 1
        });
      }

      // 600ms後に次のページへ移動
      setTimeout(() => {window.location = $link.attr('href')}, 600);
    });
  }
})();
