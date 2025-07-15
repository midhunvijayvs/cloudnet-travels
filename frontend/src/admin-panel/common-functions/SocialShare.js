
const shareOnSocialMedia = (socialMedia, url, title) => {
    let shareUrl = '';
    switch (socialMedia) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
        break;
      default:
        break;
    }
    if (shareUrl !== '') {
      window.open(shareUrl, '_blank');
    }
  };
  
  export default shareOnSocialMedia;
  