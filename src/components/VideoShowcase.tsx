import { motion } from 'framer-motion';
import { Play, ExternalLink, Instagram } from 'lucide-react';
import { useState } from 'react';

const VideoShowcase = () => {
  const [selectedVideo, setSelectedVideo] = useState<{id: string, platform: string} | null>(null);

  // CUTFLOW MEDIA multi-platform projects - Real videos from different platforms
  const showcaseVideos = [
    {
      id: 1,
      title: "YouTube Shorts - Viral Content",
      description: "Contoh hasil editing CUTFLOW MEDIA - optimized untuk YouTube Shorts dengan engagement tinggi",
      thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8eW91dHViZSUyMGxvZ298ZW58MHx8MHx8fDA%3D",
      videoId: "FzDfDt4Xy0w", // Real CUTFLOW MEDIA video
      platform: "youtube",
      category: "YouTube Shorts",
      duration: "0:60",
      views: "Viral",
      link: "https://youtube.com/shorts/FzDfDt4Xy0w"
    },
    {
      id: 2,
      title: "TikTok Viral Content",
      description: "CUTFLOW MEDIA project - Content viral di TikTok dengan editing yang engaging dan trending sounds",
      thumbnail: "https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGlrdG9rJTIwbG9nb3xlbnwwfHwwfHx8MA%3D%3D",
      videoId: "tiktok-content", 
      platform: "tiktok",
      category: "TikTok",
      duration: "0:30",
      views: "Viral",
      link: "https://vt.tiktok.com/ZSPpmXJYF/" // Real TikTok link
    },
    {
      id: 3,
      title: "Instagram Reels Package",
      description: "CUTFLOW MEDIA project - Instagram Reels dengan visual effects dan audio yang optimized untuk engagement",
      thumbnail: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5zdGFncmFtJTIwbG9nb3xlbnwwfHwwfHx8MA%3D%3D",
      videoId: "instagram-reel", 
      platform: "instagram",
      category: "Instagram Reels",
      duration: "0:45",
      views: "Trending",
      link: "https://www.instagram.com/reel/DSWHuiqjw4c/?igsh=em5wZ28xOTNpM2Zm" // Real Instagram link
    }
  ];

  const openVideo = (video: any) => {
    if (video.platform === 'youtube') {
      setSelectedVideo({id: video.videoId, platform: 'youtube'});
    } else {
      // For TikTok and Instagram, open in new tab
      window.open(video.link, '_blank');
    }
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'tiktok':
        return (
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="text-xs font-black text-white">TT</span>
          </div>
        );
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      default:
        return <Play className="w-5 h-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return 'from-red-600 to-red-500';
      case 'tiktok':
        return 'from-black to-gray-800';
      case 'instagram':
        return 'from-purple-600 to-pink-600';
      default:
        return 'from-pink-600 to-cyan-600';
    }
  };

  return (
    <section id="showcase" className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="section-title">
            <span className="gradient-text">Portfolio Showcase</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-medium">
            Lihat hasil kerja nyata dari project-project yang telah kami selesaikan
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {showcaseVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden card-hover group"
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-slate-700">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => openVideo(video)}
                    className={`bg-gradient-to-r ${getPlatformColor(video.platform)} text-white p-4 rounded-full hover:scale-110 transition-transform duration-300`}
                  >
                    {video.platform === 'youtube' ? (
                      <Play size={24} fill="currentColor" />
                    ) : (
                      <ExternalLink size={24} />
                    )}
                  </button>
                </div>

                {/* Category Badge with Platform Icon */}
                <div className="absolute top-3 left-3">
                  <span className={`bg-gradient-to-r ${getPlatformColor(video.platform)} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2`}>
                    {getPlatformIcon(video.platform)}
                    {video.category}
                  </span>
                </div>

                {/* Duration */}
                <div className="absolute bottom-3 right-3">
                  <span className="bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </span>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h3 className="card-title text-white mb-2">{video.title}</h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {video.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{video.views}</span>
                  <button
                    onClick={() => openVideo(video)}
                    className={`text-${video.platform === 'youtube' ? 'red' : video.platform === 'tiktok' ? 'gray' : 'purple'}-600 hover:text-cyan-600 transition-colors duration-300 flex items-center gap-2 text-sm font-semibold`}
                  >
                    {video.platform === 'youtube' ? 'Watch' : 'Open'} 
                    {video.platform === 'youtube' ? <Play size={16} /> : <ExternalLink size={16} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-300 mb-6">
            Ingin hasil seperti ini untuk content Anda?
          </p>
          <button
            onClick={() => {
              const element = document.querySelector('#contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn-primary"
          >
            Mulai Project Anda
          </button>
        </motion.div>
      </div>

      {/* Video Modal - Only for YouTube */}
      {selectedVideo && selectedVideo.platform === 'youtube' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 text-white hover:text-pink-600 transition-colors duration-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
              title="Video Showcase"
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoShowcase;