type SocialMediaProvider =
  | 'facebook'
  | 'twitter'
  | 'linkedin'
  | 'pinterest'
  | 'reddit'
  | 'tumblr'
  | 'vk'
  | 'weibo'
  | 'xing'
  | 'email';

export default function shareUrl(socialMedia: SocialMediaProvider, url: string) {
  const baseUrl = window.location.origin || process.env.NEXT_PUBLIC_VERCEL_URL;
  const shareUrl = new URL(url, baseUrl).toString();
  switch (socialMedia) {
    case 'facebook':
      return `https://www.facebook.com/dialog/share?href=${shareUrl}&display=popup&app_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${shareUrl}`;
    case 'linkedin':
      return `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`;
    case 'pinterest':
      return `https://pinterest.com/pin/create/button/?url=${shareUrl}`;
    case 'reddit':
      return `https://reddit.com/submit?url=${shareUrl}`;
    case 'tumblr':
      return `https://www.tumblr.com/share/link?url=${shareUrl}`;
    case 'vk':
      return `https://vk.com/share.php?url=${shareUrl}`;
    case 'weibo':
      return `https://service.weibo.com/share/share.php?url=${shareUrl}`;
    case 'xing':
      return `https://www.xing.com/app/user?op=share&url=${shareUrl}`;
    case 'email':
      return `mailto:?subject=Check%20out%20this%20link&body=${shareUrl}`;
  }
}
