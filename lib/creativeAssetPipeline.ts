import { Offer } from '../types';

export interface CreativeAsset {
  channel: string;
  format: string;
  headline: string;
  subheadline: string;
  callToAction: string;
  visualConcept: string;
  keyMessage: string;
  targetAudience: string;
}

// Generate unique creative asset pipeline based on offer details
export function generateCreativeAssetPipeline(offer: Offer, monthTheme: string): CreativeAsset[] {
  const assets: CreativeAsset[] = [];
  
  // Get offer-specific messaging elements
  const offerKeywords = extractKeywords(offer);
  const urgencyLevel = getUrgencyLevel(offer);
  const targetSegment = getTargetSegment(offer);
  
  // WhatsApp Creative
  if (offer.collateralChannels?.whatsapp) {
    assets.push({
      channel: 'WhatsApp',
      format: 'Image + Text (1:1 ratio)',
      headline: generateWhatsAppHeadline(offer),
      subheadline: `${monthTheme} Special`,
      callToAction: getWhatsAppCTA(offer),
      visualConcept: getVisualConcept(offer, 'whatsapp'),
      keyMessage: offer.whyItWorks.slice(0, 100) + '...',
      targetAudience: targetSegment
    });
  }
  
  // Email Creative
  if (offer.collateralChannels?.email) {
    assets.push({
      channel: 'Email',
      format: 'HTML Template (600px width)',
      headline: generateEmailSubjectLine(offer, monthTheme),
      subheadline: `Unlock ${offer.discountPercent || 0}% savings`,
      callToAction: 'Book Your Spot Now',
      visualConcept: getVisualConcept(offer, 'email'),
      keyMessage: offer.description,
      targetAudience: targetSegment
    });
  }
  
  // In-Studio Creative
  if (offer.collateralChannels?.inStudio) {
    assets.push({
      channel: 'In-Studio',
      format: 'A3 Poster + Tent Cards',
      headline: offer.title,
      subheadline: formatPricing(offer),
      callToAction: 'Ask Front Desk',
      visualConcept: getVisualConcept(offer, 'instudio'),
      keyMessage: `${urgencyLevel} - ${offer.savings || 'Special Pricing'}`,
      targetAudience: 'Walk-in Members'
    });
  }
  
  // Social Media Creative
  if (offer.collateralChannels?.socialMedia) {
    assets.push({
      channel: 'Social Media',
      format: 'Feed (1080x1080) + Story (1080x1920)',
      headline: generateSocialHeadline(offer),
      subheadline: `#${monthTheme.replace(/\s+/g, '')} #Physique57India`,
      callToAction: 'Link in Bio',
      visualConcept: getVisualConcept(offer, 'social'),
      keyMessage: getSocialHook(offer),
      targetAudience: targetSegment
    });
  }
  
  // Meta Ads Creative
  if (offer.collateralChannels?.metaAds) {
    assets.push({
      channel: 'Meta Ads',
      format: 'Carousel + Single Image + Video',
      headline: generateAdHeadline(offer),
      subheadline: getAdSubheadline(offer),
      callToAction: offer.type === 'Flash' ? 'Book Now' : 'Learn More',
      visualConcept: getVisualConcept(offer, 'ads'),
      keyMessage: `${offer.type} Offer: ${offer.pricing}`,
      targetAudience: getAdAudience(offer)
    });
  }
  
  return assets;
}

function extractKeywords(offer: Offer): string[] {
  const keywords: string[] = [];
  const title = offer.title.toLowerCase();
  
  if (title.includes('unlimited')) keywords.push('unlimited');
  if (title.includes('annual') || title.includes('year')) keywords.push('annual');
  if (title.includes('month')) keywords.push('monthly');
  if (title.includes('class')) keywords.push('classes');
  if (title.includes('private')) keywords.push('private');
  if (title.includes('buddy') || title.includes('friend')) keywords.push('social');
  
  return keywords;
}

function getUrgencyLevel(offer: Offer): string {
  if (offer.type === 'Flash') return '⚡ Limited Time Only';
  if (offer.type === 'Event') return '📅 Event-Only Pricing';
  if ((offer.discountPercent || 0) >= 30) return '🔥 Massive Savings';
  if ((offer.discountPercent || 0) >= 20) return '✨ Special Offer';
  return '💎 Exclusive Deal';
}

function getTargetSegment(offer: Offer): string {
  switch (offer.type) {
    case 'New': return 'New Prospects & Trial Members';
    case 'Lapsed': return 'Former Members (6+ months inactive)';
    case 'Retention': return 'Active Members (expiring in 30 days)';
    case 'Student': return 'College Students (18-25)';
    case 'Corporate': return 'Working Professionals';
    case 'Hero': return 'High-Value Prospects';
    case 'Flash': return 'Deal Seekers & Fence-sitters';
    case 'Event': return 'Community & Social Members';
    default: return 'General Audience';
  }
}

function generateWhatsAppHeadline(offer: Offer): string {
  const discountText = offer.discountPercent ? `${offer.discountPercent}% OFF` : '';
  if (offer.type === 'Flash') return `⚡ FLASH SALE: ${offer.title}`;
  if (offer.type === 'Hero') return `🌟 ${offer.title} - ${discountText}`;
  if (offer.type === 'New') return `👋 New Member Special: ${offer.title}`;
  return `💪 ${offer.title}`;
}

function getWhatsAppCTA(offer: Offer): string {
  if (offer.type === 'Flash') return 'Reply YES to claim before it ends!';
  if (offer.type === 'Event') return 'Reply to RSVP your spot';
  if (offer.type === 'New') return 'Reply START to begin your journey';
  return 'Reply BOOK for details';
}

function generateEmailSubjectLine(offer: Offer, theme: string): string {
  const subjects: {[key: string]: string} = {
    'Hero': `Your exclusive ${theme} invitation awaits 🎯`,
    'New': `Welcome offer inside: ${offer.title}`,
    'Flash': `⚡ ${offer.discountPercent}% OFF ends soon - ${offer.title}`,
    'Lapsed': `We miss you! Come back with ${offer.title}`,
    'Retention': `Thank you for being with us - Here's your reward`,
    'Event': `You're invited: ${offer.title} 📅`,
  };
  return subjects[offer.type] || `${theme}: ${offer.title}`;
}

function generateSocialHeadline(offer: Offer): string {
  if (offer.type === 'Flash') return `⚡ FLASH DROP: ${offer.discountPercent}% OFF`;
  if (offer.type === 'Event') return `📍 EVENT ALERT`;
  if (offer.type === 'Hero') return `✨ FEATURED OFFER`;
  return `💪 NEW DROP`;
}

function getSocialHook(offer: Offer): string {
  const hooks: {[key: string]: string} = {
    'Hero': 'This is the one you\'ve been waiting for...',
    'New': 'Ready to start? We made it easy.',
    'Flash': 'Set your alarms. This won\'t last.',
    'Lapsed': 'It\'s time. You know it.',
    'Event': 'Be there or miss out.',
    'Retention': 'Because loyalty deserves rewards.',
  };
  return hooks[offer.type] || 'Your fitness journey starts here.';
}

function generateAdHeadline(offer: Offer): string {
  return `${offer.title} | Save ${offer.discountPercent || 'Big'}%`;
}

function getAdSubheadline(offer: Offer): string {
  if (offer.finalPriceMumbai) {
    return `Starting ₹${offer.finalPriceMumbai.toLocaleString('en-IN')}`;
  }
  return offer.pricing;
}

function getAdAudience(offer: Offer): string {
  const base = 'Women 25-45, Fitness Interested';
  switch (offer.type) {
    case 'Lapsed': return 'Retargeting: Past Website Visitors + Lapsed CRM List';
    case 'New': return `${base}, Lookalike: Current Members`;
    case 'Student': return 'Women 18-25, College Students';
    case 'Corporate': return 'Women 28-45, Business Interest, Corporate Locations';
    default: return base;
  }
}

function getVisualConcept(offer: Offer, channel: string): string {
  const baseStyle = 'High-contrast, bold typography, action shots';
  
  const concepts: {[key: string]: {[key: string]: string}} = {
    'Hero': {
      whatsapp: 'Hero image with gold/premium accents, member transformation photo',
      email: 'Full-width hero banner, testimonial section, clear pricing table',
      instudio: 'Premium poster with metallic finish, QR code for booking',
      social: 'Carousel showing journey: Before → During → After',
      ads: 'Video testimonial + static pricing card',
    },
    'Flash': {
      whatsapp: 'Countdown timer graphic, urgent red/orange colors',
      email: 'Animated GIF countdown, bold pricing comparison',
      instudio: 'Neon-style urgent signage, countdown display',
      social: 'Stories countdown sticker, flashing price reveal',
      ads: 'Urgency-focused creative with timer overlay',
    },
    'New': {
      whatsapp: 'Welcoming studio photos, friendly instructor shots',
      email: 'Welcome journey infographic, what to expect section',
      instudio: 'Beginner-friendly messaging, welcoming atmosphere',
      social: 'New member success stories, first-class experience',
      ads: 'Welcoming studio tour video, beginner testimonials',
    },
    'Lapsed': {
      whatsapp: 'Nostalgic studio photos, "We miss you" messaging',
      email: 'Personalized comeback offer, progress reminder',
      instudio: 'Welcome back signage, re-activation special display',
      social: 'Comeback story features, community shots',
      ads: 'Retargeting creative with familiar studio imagery',
    },
    'Event': {
      whatsapp: 'Event flyer style, date/time prominent, RSVP button',
      email: 'Calendar invite format, event details, host photos',
      instudio: 'Event poster, standee with full event details',
      social: 'Event announcement, behind-the-scenes prep content',
      ads: 'Event teaser video, guest speaker highlights',
    },
  };
  
  return concepts[offer.type]?.[channel] || `${baseStyle} tailored for ${channel}`;
}

function formatPricing(offer: Offer): string {
  if (offer.finalPriceMumbai && offer.priceMumbai) {
    const savings = offer.priceMumbai - offer.finalPriceMumbai;
    return `₹${offer.finalPriceMumbai.toLocaleString('en-IN')} (Save ₹${savings.toLocaleString('en-IN')})`;
  }
  return offer.pricing;
}

// Generate offer-specific creative brief
export function generateCreativeBrief(offer: Offer, monthTheme: string): string {
  const targetSegment = getTargetSegment(offer);
  const urgency = getUrgencyLevel(offer);
  
  return `
**Creative Brief: ${offer.title}**

**Campaign Theme:** ${monthTheme}
**Offer Type:** ${offer.type}
**Target Audience:** ${targetSegment}
**Urgency Level:** ${urgency}

**Core Message:**
${offer.whyItWorks}

**Pricing Story:**
- Mumbai: ₹${offer.priceMumbai?.toLocaleString('en-IN') || 'TBD'} → ₹${offer.finalPriceMumbai?.toLocaleString('en-IN') || 'TBD'} (${offer.discountPercent || 0}% off)
- Bengaluru: ₹${offer.priceBengaluru?.toLocaleString('en-IN') || 'TBD'} → ₹${offer.finalPriceBengaluru?.toLocaleString('en-IN') || 'TBD'}

**Key Visual Direction:**
- Hero imagery: Action shots of ${offer.type === 'New' ? 'welcoming first-time members' : 'confident members mid-workout'}
- Color palette: Brand purple (#7c3aed) with ${offer.type === 'Flash' ? 'urgent orange accents' : 'sophisticated gold accents'}
- Typography: Bold headlines, clean sans-serif body

**Channel-Specific Notes:**
${offer.collateralChannels?.whatsapp ? '• WhatsApp: Concise, emoji-rich, reply-driven CTA' : ''}
${offer.collateralChannels?.email ? '• Email: Scannable layout, mobile-first, clear pricing table' : ''}
${offer.collateralChannels?.inStudio ? '• In-Studio: High visibility, QR code integration, premium finish' : ''}
${offer.collateralChannels?.socialMedia ? '• Social: Platform-native content, hashtag strategy, engagement hooks' : ''}
${offer.collateralChannels?.metaAds ? '• Meta Ads: A/B test headlines, retargeting integration, conversion tracking' : ''}

**Collateral Checklist:**
${offer.collateralTypes?.tentCards ? '☑ Tent Cards (Front Desk Display)' : ''}
${offer.collateralTypes?.imageCreative ? '☑ Image Creatives (1080x1080, 1080x1920)' : ''}
${offer.collateralTypes?.videoCreative ? '☑ Video Creative (15-30 sec)' : ''}
${offer.collateralTypes?.emailTemplate ? '☑ Email Template (HTML)' : ''}
${offer.collateralTypes?.landingPage ? '☑ Landing Page' : ''}
${offer.collateralTypes?.socialPosts ? '☑ Social Media Posts' : ''}
${offer.collateralTypes?.storyTemplate ? '☑ Story Templates' : ''}
${offer.collateralTypes?.easelStandee ? '☑ Easel Standee' : ''}
  `.trim();
}
