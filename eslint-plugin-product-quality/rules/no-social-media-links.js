/**
 * ESLint Rule: no-social-media-links
 * 
 * Public pages should not contain social media links.
 * Keeps users focused on the product.
 * 
 * @version 2.8
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Public pages should not contain social media links',
      category: 'Content Restrictions',
      recommended: true,
    },
    messages: {
      socialMediaLink:
        'Social media link to "{{platform}}" found. Public pages should not link to social networks.',
    },
    schema: [],
  },
  create(context) {
    const socialPlatforms = [
      { name: 'Facebook', pattern: /(facebook\.com|fb\.com|fb\.me)/i },
      { name: 'Twitter/X', pattern: /(twitter\.com|(?:^|\/\/)x\.com|t\.co)/i },
      { name: 'Instagram', pattern: /(instagram\.com|instagr\.am)/i },
      { name: 'LinkedIn', pattern: /(linkedin\.com|lnkd\.in)/i },
      { name: 'YouTube', pattern: /(youtube\.com|youtu\.be)/i },
      { name: 'TikTok', pattern: /(tiktok\.com)/i },
      { name: 'Telegram', pattern: /(t\.me|telegram\.me|telegram\.org)/i },
      { name: 'WhatsApp', pattern: /(whatsapp\.com|wa\.me)/i },
      { name: 'Discord', pattern: /(discord\.gg|discord\.com)/i },
      { name: 'Reddit', pattern: /(reddit\.com)/i },
      { name: 'Pinterest', pattern: /(pinterest\.com|pin\.it)/i },
      { name: 'Snapchat', pattern: /(snapchat\.com)/i },
      { name: 'Vimeo', pattern: /(vimeo\.com)/i },
      { name: 'Twitch', pattern: /(twitch\.tv)/i },
      { name: 'GitHub', pattern: /(github\.com|github\.io)/i },
    ];

    return {
      JSXAttribute(node) {
        if (node.name.name === 'href' && node.value?.value) {
          const href = node.value.value;

          if (typeof href === 'string') {
            socialPlatforms.forEach(({ name, pattern }) => {
              if (pattern.test(href)) {
                context.report({
                  node,
                  messageId: 'socialMediaLink',
                  data: { platform: name },
                });
              }
            });
          }
        }
      },
      Literal(node) {
        if (typeof node.value === 'string') {
          const value = node.value;

          // Check if it looks like a URL
          if (value.includes('http://') || value.includes('https://') || value.startsWith('//')) {
            socialPlatforms.forEach(({ name, pattern }) => {
              if (pattern.test(value)) {
                context.report({
                  node,
                  messageId: 'socialMediaLink',
                  data: { platform: name },
                });
              }
            });
          }
        }
      },
    };
  },
};
