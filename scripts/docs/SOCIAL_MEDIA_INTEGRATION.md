# Social Media Integration Guide

## 📱 Multi-Platform Video Showcase

Website CUTFLOW MEDIA sekarang mendukung showcase video dari berbagai platform:

### ✅ **Supported Platforms:**
- **YouTube** - Embedded player dengan modal
- **TikTok** - External link (opens in new tab)
- **Instagram Reels** - External link (opens in new tab)

## 🔧 **How to Add Your Links**

### Step 1: Update Video Data
Edit `src/components/VideoShowcase.tsx` dan replace placeholder links:

```typescript
const showcaseVideos = [
  // YouTube Video (sudah ada)
  {
    id: 1,
    title: "YouTube Shorts - Viral Content",
    description: "Contoh hasil editing CUTFLOW MEDIA",
    thumbnail: "https://img.youtube.com/vi/FzDfDt4Xy0w/maxresdefault.jpg",
    videoId: "FzDfDt4Xy0w",
    platform: "youtube",
    category: "YouTube Shorts",
    duration: "0:60",
    views: "Viral",
    link: "https://youtube.com/shorts/FzDfDt4Xy0w"
  },
  
  // TikTok Video - REPLACE THIS
  {
    id: 2,
    title: "TikTok Viral Content",
    description: "Your TikTok description here",
    thumbnail: "YOUR_TIKTOK_THUMBNAIL_URL", // Custom thumbnail
    videoId: "your-tiktok-video-id",
    platform: "tiktok",
    category: "TikTok",
    duration: "0:30",
    views: "Your view count",
    link: "https://tiktok.com/@your-username/video/your-video-id" // ← REPLACE THIS
  },
  
  // Instagram Reel - REPLACE THIS
  {
    id: 3,
    title: "Instagram Reels Package",
    description: "Your Instagram Reel description",
    thumbnail: "YOUR_INSTAGRAM_THUMBNAIL_URL", // Custom thumbnail
    videoId: "your-instagram-reel-id",
    platform: "instagram",
    category: "Instagram Reels",
    duration: "0:45",
    views: "Your view count",
    link: "https://instagram.com/reel/your-reel-id" // ← REPLACE THIS
  }
];
```

### Step 2: Get Your Links

#### 📱 **TikTok Links:**
1. Open your TikTok video
2. Click "Share" button
3. Copy link (format: `https://tiktok.com/@username/video/1234567890`)
4. Paste in the `link` field

#### 📸 **Instagram Reels Links:**
1. Open your Instagram Reel
2. Click "Share" → "Copy Link"
3. Link format: `https://instagram.com/reel/ABC123DEF/`
4. Paste in the `link` field

### Step 3: Custom Thumbnails (Recommended)

For better visual consistency, create custom thumbnails:

#### **Thumbnail Specifications:**
- **Size**: 640x360px (16:9 aspect ratio)
- **Format**: JPG or PNG
- **Quality**: High resolution for retina displays
- **Style**: Match your brand colors (pink/cyan gradient)

#### **Where to Host Thumbnails:**
- **Option 1**: Upload to your hosting/CDN
- **Option 2**: Use image hosting services (Imgur, Cloudinary)
- **Option 3**: Create placeholder with brand colors

## 🎨 **Platform-Specific Features**

### **YouTube Videos:**
- ✅ **Embedded Player**: Opens in modal with autoplay
- ✅ **Auto Thumbnails**: Uses YouTube's thumbnail API
- ✅ **Play Button**: Standard play icon
- ✅ **Red Badge**: YouTube brand color

### **TikTok Videos:**
- 🔗 **External Link**: Opens TikTok app/website
- 🎨 **Custom Thumbnails**: Upload your own
- 🔗 **External Icon**: Shows link icon instead of play
- ⚫ **Black Badge**: TikTok brand color

### **Instagram Reels:**
- 🔗 **External Link**: Opens Instagram app/website  
- 🎨 **Custom Thumbnails**: Upload your own
- 🔗 **External Icon**: Shows link icon instead of play
- 🟣 **Purple Badge**: Instagram brand color

## 📱 **User Experience**

### **YouTube Videos:**
1. User hovers → Play button appears
2. User clicks → Modal opens with embedded player
3. Video autoplays in modal
4. User can close modal or watch fullscreen

### **TikTok/Instagram:**
1. User hovers → External link icon appears
2. User clicks → Opens in new tab/app
3. Native platform experience
4. User returns to website when done

## 🎯 **Benefits of This Approach**

### ✅ **Performance:**
- No heavy embeds for TikTok/Instagram
- Fast loading with custom thumbnails
- YouTube embeds only load when clicked

### ✅ **User Experience:**
- Native platform experience for TikTok/Instagram
- Consistent visual design across platforms
- Clear platform indicators with icons

### ✅ **SEO & Analytics:**
- External links drive traffic to your social media
- YouTube embeds good for website engagement
- Platform-specific tracking possible

## 🔧 **Customization Options**

### **Add More Platforms:**
You can easily add more platforms by:
1. Adding new platform cases in `getPlatformIcon()`
2. Adding new colors in `getPlatformColor()`
3. Adding new video objects with `platform: "newplatform"`

### **Change Platform Colors:**
```typescript
const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'youtube': return 'from-red-600 to-red-500';
    case 'tiktok': return 'from-black to-gray-800';
    case 'instagram': return 'from-purple-600 to-pink-600';
    case 'facebook': return 'from-blue-600 to-blue-500'; // Example
    default: return 'from-pink-600 to-cyan-600';
  }
};
```

## 📊 **Analytics Integration**

Track clicks on external links:
```javascript
const openVideo = (video) => {
  // Analytics tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', 'video_click', {
      'platform': video.platform,
      'video_title': video.title,
      'link_type': video.platform === 'youtube' ? 'embed' : 'external'
    });
  }
  
  // Open video logic...
};
```

## 🚀 **Ready to Add Your Links!**

1. **Get your TikTok and Instagram Reel links**
2. **Create custom thumbnails** (optional but recommended)
3. **Update the video data** in VideoShowcase.tsx
4. **Test on all devices**
5. **Deploy and share!**

Your multi-platform video showcase will help demonstrate CUTFLOW MEDIA's versatility across all major social media platforms! 🎬