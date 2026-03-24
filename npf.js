(() => {
  if (jQuery === undefined) {
    console.error("npf.js : jQuery is required but was not found.");

    return;
  }

  // NPFのcontentからimageのhtmlを作る
  const htmlImage = content => {
    const srcset = [];
    let src = '';

    content.media?.forEach(media => {
      srcset.push(`${media.url} ${media.width}w`);

      if (media.width == 500) src = media.url;
    });

    return `<img src="${src}" srcset="${srcset.join(', ')}">`;
  }

  // NPFのcontentからvideoのhtmlを作る
  const htmlVideo = content => {
    const url = content.media?.url || '';
    const poster = content.poster?.[0]?.url || '';
    const options = [
      'preload="auto"',
      'loop', // ループ再生する
      'playsinline' // スマートフォンで全画面表示にしない
    ].join(' ');

    return [
      `<img src="${poster}">`, // スマートフォンで再生時の点滅を防ぐ
      `<video src="${url}" poster="${poster}" ${options}></video>`,
      '<div class="video-overlay">',
      '<i class="fa-solid fa-play"></i>',
      '</div>'
    ].join('');
  };

  // NPFのデータを扱いやすいデータに変換する
  const parseNPF = (npf) => {
    const data = {'type': 'unknown'};
    
    npf.content?.forEach(content => {
      switch (content.type) {
        case 'image':
          data.type = 'image';
          data.html = htmlImage(content);

          break;
        case 'video':
          data.type = 'video';
          
          if (content.provider == 'tumblr') {
            data.html = htmlVideo(content);
          } else {
            data.html = content.embed_html;
          }

          break;
        case 'text':
          if (!('subtype' in content)) {
            data.title = content.text;
          }
          
          break;
      }
    });

    return data;
  }

  // 投稿の実体をhtmlに追加する
  const drawPost = ($post, url, npf) => {
    const content = parseNPF(npf);

    if (content.type == 'unknown') {
      return;
    }

    const $caption = $post.find('.caption');
    const $media = $post.find('.media');

    // キャプションを描画する
    $caption.append([
      '<div class="caption__text">',
        `<a href="${url}" class="caption__link">${content.title}</a>`,
      '</div>'
    ].join(''));

    // メディアを描画する
    if (content.type == 'image') {
      $media.append(`<div class="media__image">${content.html}</div>`);
    } else if (content.type == 'video') {
      $media.append(`<div class="media__video">${content.html}</div>`);
    }
  }

  const posts = [];

  // 投稿を追加する
  window.pushPost = (id, url, npf) => {
    posts.push({$post: $(`#${id}`), url: url, npf: npf});
  }

  // 投稿の実体をhtmlに追加する
  window.drawPosts = () => {
    posts.forEach(post => drawPost(post.$post, post.url, post.npf));
  }
})();
