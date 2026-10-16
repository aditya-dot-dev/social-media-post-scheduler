import type { Post } from '../types/post';

/**
 * Helper to generate dynamic ISO UTC timestamp strings relative to the current execution time.
 * @param daysOffset Days offset from today (negative for past, 0 for today, positive for future)
 * @param hours Target hour in 24h format (0-23)
 * @param minutes Target minute (0-59)
 */
const getRelativeTimestamp = (daysOffset: number, hours: number, minutes: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

export const mockPosts: Post[] = [
  // --- Published Posts (Past: Days -4 to -1 and Earlier Today) ---
  {
    id: 'post-1',
    content:
      '🚀 Big update! We just rolled out our brand-new analytics dashboard. Track impressions, engagement velocity, and conversion attribution all in one unified view. Check out the link in bio for a 14-day free trial!',
    platforms: ['x', 'facebook'],
    mediaUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(-4, 9, 30),
    status: 'published',
  },
  {
    id: 'post-2',
    content:
      '✨ Behind the scenes at our Q3 design sprint! Building software isn\'t just about code—it\'s about empathy, iteration, and countless cups of matcha 🍵 Which feature are you most excited to test next? Drop your thoughts below! 👇 #DesignSprint #ProductDesign #TechLife',
    platforms: ['instagram'],
    mediaUrl:
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(-3, 14, 0),
    status: 'published',
  },
  {
    id: 'post-3',
    content:
      '3 productivity hacks every remote founder needs to know in 2026 💡 #remoteWork #startupHacks #productivityTips #founderLife',
    platforms: ['tiktok'],
    mediaUrl:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(-3, 18, 15),
    status: 'published',
  },
  {
    id: 'post-4',
    content:
      'Customer Spotlight 🌟 How @CraftStudio increased organic reach by 340% in just 60 days using automated social scheduling and targeted cross-posting. Read the complete case study on our blog! #CustomerSuccess #SocialGrowth',
    platforms: ['facebook', 'instagram'],
    mediaUrl:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(-2, 11, 0),
    status: 'published',
  },
  {
    id: 'post-5',
    content:
      'Hot take: Posting 5x a day with mediocre content is killing your reach.\n\nInstead, post 3x a week with:\n1. One original teardown or insight\n2. One tactical breakdown\n3. One community discussion prompt\n\nQuality > Noise. Agree or disagree?',
    platforms: ['x'],
    scheduledAt: getRelativeTimestamp(-2, 16, 45),
    status: 'published',
  },
  {
    id: 'post-6',
    content:
      'Monday mood check-in! ⚡ Fresh week, clean workspace, and big goals ahead. What is the #1 project on your radar this week? #WorkspaceInspo #DeskSetup #CreatorEconomy',
    platforms: ['instagram', 'tiktok'],
    mediaUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(-1, 10, 30),
    status: 'published',
  },
  {
    id: 'post-7',
    content:
      'Join us this Thursday at 2 PM EST for our live workshop: "Scaling Multi-Channel Social Strategies Without Burnout". Live Q&A with our head of growth + free template giveaway for all attendees. Reserve your spot now! 🎟️',
    platforms: ['facebook'],
    mediaUrl:
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(-1, 15, 0),
    status: 'published',
  },
  {
    id: 'post-8',
    content:
      'The creator economy isn\'t slowing down—it\'s maturing into micro-networks.\n\nMonetization is moving closer to direct relationships, community memberships, and owned distribution channels.',
    platforms: ['x'],
    scheduledAt: getRelativeTimestamp(-1, 20, 0),
    status: 'published',
  },
  {
    id: 'post-9',
    content:
      'Sunrise espresso + batching the week\'s social content before notifications kick in. Who else does morning deep work blocks? ☕☀️ #MorningRoutine #DeepWork #CreativeProcess',
    platforms: ['instagram'],
    mediaUrl:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(0, 6, 30),
    status: 'published',
  },
  {
    id: 'post-10',
    content:
      '⚡ Platform Status Update: All scheduled publishing pipelines are operating normally with 99.98% delivery reliability. Have questions or need support? Our team is live in the chat.',
    platforms: ['x', 'facebook'],
    scheduledAt: getRelativeTimestamp(0, 8, 45),
    status: 'published',
  },

  // --- Failed Posts (Realistic Social Media API Errors) ---
  {
    id: 'post-11',
    content:
      'Weekend Flash Sale starts now! Get 40% off our yearly Pro subscription. Use code FLASH40 at checkout before midnight Sunday. Link in bio! 🏷️',
    platforms: ['instagram'],
    mediaUrl:
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(-3, 12, 10),
    status: 'failed',
    errorMessage: 'Instagram access token expired. Re-authenticate your Instagram Business account.',
  },
  {
    id: 'post-12',
    content:
      'Breaking down the top 10 social algorithm shifts we uncovered analyzing 2.4 million posts across the network in Q1 🧵👇',
    platforms: ['x'],
    scheduledAt: getRelativeTimestamp(-2, 13, 20),
    status: 'failed',
    errorMessage: 'X rate limit exceeded. Publish queue backed up (HTTP 429).',
  },
  {
    id: 'post-13',
    content:
      'Can you spot what went wrong in this studio setup? 🎬 Full video breakdown of camera gear vs budget alternatives! #videography #studiovlog #creatorgear',
    platforms: ['tiktok'],
    mediaUrl:
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(-2, 17, 30),
    status: 'failed',
    errorMessage: 'Video aspect ratio unsupported for TikTok. Video must be 9:16 vertical.',
  },
  {
    id: 'post-14',
    content:
      'Exciting announcement! We have partnered with Global Creators Summit 2026 as premier technology partner. Early-bird ticket discounts available for our community members!',
    platforms: ['facebook'],
    mediaUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(-1, 11, 45),
    status: 'failed',
    errorMessage: 'Facebook Page publish permission revoked by account admin.',
  },
  {
    id: 'post-15',
    content:
      'Quick remix tutorial: How to synchronize voiceovers with sound transitions seamlessly in under 60 seconds 🎵 #sounddesign #editingtutorial #filmmaking',
    platforms: ['tiktok'],
    mediaUrl:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(-1, 19, 15),
    status: 'failed',
    errorMessage: 'TikTok audio copyright restriction detected in video soundtrack.',
  },
  {
    id: 'post-16',
    content:
      '4K Masterclass walkthrough: Building an omni-channel distribution machine from scratch. Watch the full 30-minute training!',
    platforms: ['facebook', 'instagram'],
    mediaUrl:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(0, 9, 15),
    status: 'failed',
    errorMessage: 'Media file exceeded maximum size limit of 512MB.',
  },
  {
    id: 'post-17',
    content:
      'Swipe through our 7 essential visual storytelling templates for product carousels ➡️ Save this post for your next campaign planning session! #CarouselTemplates #ContentStrategy',
    platforms: ['instagram'],
    mediaUrl:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(0, 11, 0),
    status: 'failed',
    errorMessage: 'Instagram carousel format requires at least 2 media assets.',
  },

  // --- Scheduled Posts: Today (Various Times) ---
  {
    id: 'post-18',
    content:
      'Midday focus sprint: Turn off non-essential notifications for the next 90 minutes. You will be amazed at what gets completed when context switching drops to zero. 🎯',
    platforms: ['x', 'facebook'],
    scheduledAt: getRelativeTimestamp(0, 13, 0),
    status: 'scheduled',
  },
  {
    id: 'post-19',
    content:
      'Clean aesthetics, effortless scheduling. 🗓️ Your brand consistency shouldn\'t depend on how hectic your afternoon is. Double tap if you plan your posts in advance! #SocialMediaManager #BrandIdentity #VisualMarketing',
    platforms: ['instagram'],
    mediaUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(0, 15, 30),
    status: 'scheduled',
  },
  {
    id: 'post-20',
    content:
      'Rating social media managers\' daily coffee orders based on panic levels 😂☕ Watch till the end! #SMMlife #agencylife #workhumor #socialmediatips',
    platforms: ['tiktok'],
    mediaUrl:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(0, 18, 0),
    status: 'scheduled',
  },
  {
    id: 'post-21',
    content:
      'Building in public lesson #42: Your customers will tell you what to build next if you listen to what they complain about manually doing in spreadsheets.',
    platforms: ['x'],
    scheduledAt: getRelativeTimestamp(0, 20, 45),
    status: 'scheduled',
  },

  // --- Scheduled Posts: Tomorrow ---
  {
    id: 'post-22',
    content:
      'Rise and shine! 🌅 Kicking off tomorrow with 5 actionable marketing framework templates you can copy & paste into Notion. Drop a comment with "TEMPLATES" and we will DM you the direct link!',
    platforms: ['facebook', 'instagram'],
    mediaUrl:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(1, 8, 30),
    status: 'scheduled',
  },
  {
    id: 'post-23',
    content:
      'Short-form video is now the default search engine for Gen Z. If your brand doesn\'t answer search queries in video format, you are invisible to half the internet. Here is how to fix it in 3 steps: 🧵',
    platforms: ['x', 'tiktok'],
    mediaUrl:
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(1, 11, 15),
    status: 'scheduled',
  },
  {
    id: 'post-24',
    content:
      'Community Poll 📊 When planning Q4 marketing budgets, where are you allocating the largest growth share?\n\nA) Creator partnerships & UGC\nB) Paid search & performance social\nC) Organic community & SEO\nD) Live events & podcasts\n\nVote below!',
    platforms: ['facebook'],
    scheduledAt: getRelativeTimestamp(1, 14, 0),
    status: 'scheduled',
  },
  {
    id: 'post-25',
    content:
      'Color palette inspiration for bold tech brands who dare to stand out from corporate blue 🎨 Save this swatch deck for your next branding refresh! Which combo speaks to you? #ColorPalette #BrandDesign #VisualAesthetics',
    platforms: ['instagram'],
    mediaUrl:
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(1, 17, 30),
    status: 'scheduled',
  },

  // --- Scheduled Posts: Next 2 to 5 Days in Future ---
  {
    id: 'post-26',
    content:
      '🎉 Milestones matter! Today we officially crossed 50,000 active creators scheduling over 1,000,000 posts every single month! Thank you to every team who trusts us daily ❤️ Big surprises coming next week!',
    platforms: ['facebook', 'instagram', 'x', 'tiktok'],
    mediaUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(2, 9, 0),
    status: 'scheduled',
  },
  {
    id: 'post-27',
    content:
      'Simple copywriting trick: Replace "We help companies..." with "You get [specific result] without [painful step]". Instant clarity boost.',
    platforms: ['x'],
    scheduledAt: getRelativeTimestamp(2, 16, 0),
    status: 'scheduled',
  },
  {
    id: 'post-28',
    content:
      'Day in the life: Social Media Director at a hyper-growth SaaS startup 📱 From daily analytics standups to batching reels and scheduling across 4 channels. What part of the job surprises you most? #DayInTheLife #TechStartup #WorkVlog',
    platforms: ['instagram', 'tiktok'],
    mediaUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(3, 10, 30),
    status: 'scheduled',
  },
  {
    id: 'post-29',
    content:
      'Case Study Preview 🔍 How an e-commerce apparel label generated $45k in revenue from 3 well-timed Instagram & Facebook carousel launches. Read the breakdown before Friday\'s full release!',
    platforms: ['facebook'],
    mediaUrl:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(3, 15, 0),
    status: 'scheduled',
  },
  {
    id: 'post-30',
    content:
      'The 3 metrics you actually need to care about:\n1. Retention / Repeat engagement rate\n2. Share rate (shows authentic resonance)\n3. Direct inbound conversions\n\nVanity likes will not pay payroll.',
    platforms: ['x'],
    scheduledAt: getRelativeTimestamp(4, 12, 0),
    status: 'scheduled',
  },
  {
    id: 'post-31',
    content:
      'Golden hour in our creative studio 🌇 Packing up content kits for our upcoming brand ambassadors. Tag a creator who embodies effortless aesthetic vibes! #CreatorCollab #StudioVibes #AestheticInspo',
    platforms: ['instagram'],
    mediaUrl:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(4, 18, 30),
    status: 'scheduled',
  },
  {
    id: 'post-32',
    content:
      '🗓️ New Feature Drop: Introducing Smart Multi-Timezone Auto-Publishing! Now you can schedule a single campaign and deliver it at peak local engagement hours across London, New York, Tokyo, and Sydney automatically.',
    platforms: ['facebook', 'instagram', 'x'],
    mediaUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    scheduledAt: getRelativeTimestamp(5, 11, 0),
    status: 'scheduled',
  },
];
