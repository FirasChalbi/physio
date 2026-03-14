"use client"
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules"
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"

import VideoPlayer from "./video-player";

const videos = [
  { url: "/heavenglow.mp4", originalUrl: "", likes: 1052, vues: 42800 },
  { url: "/heavenglow.mp4", originalUrl: "", likes: 650, vues: 12800 },
  { url: "/heavenglow.mp4", originalUrl: "", likes: 480, vues: 9100 },
  { url: "/heavenglow.mp4", originalUrl: "", likes: 305, vues: 7200 },
];

export default function InstagramSwiper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <div className="mb-10 max-w-7xl mx-auto px-0 md:px-6">
      <div className="text-center mb-12">
        <h2 className="flex flex-col md:flex-row md:inline-flex items-center md:items-baseline justify-center gap-1 md:gap-3 text-4xl lg:text-5xl leading-tight">
          <span className="font-extrabold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
            Suivez-nous sur
          </span>
          <span className="font-extrabold" style={{ color: '#ff2c92', fontFamily: 'Georgia, serif' }}>
            Instagram
          </span>
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto mt-4 text-sm leading-relaxed px-4">
          Découvrez nos résultats en vidéo et suivez notre actualité au quotidien.
        </p>
      </div>
      <Swiper
        modules={[Navigation, Pagination]}
        onSlideChange={(swiper: SwiperClass) => setActiveIndex(swiper.activeIndex)}
        onSwiper={(swiper: SwiperClass) => { swiperRef.current = swiper; }}
        slidesPerView={1.5}
        spaceBetween={12}
        centeredSlides={true}
        breakpoints={{
          600: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        style={{
          padding: "0 0 40px 0",
        }}
        pagination={{ clickable: true }}
        grabCursor
        className="instagram-swiper-mobile !pb-12"
      >
        {videos.map((video, idx) => (
          <SwiperSlide key={idx}>
            <VideoPlayer
              url={video.url}
              originalUrl={video.originalUrl}
              initialLikes={video.likes}
              initialVues={video.vues}
              isActive={activeIndex === idx}
              swiperRef={swiperRef}
              index={idx}
              shouldPreload={false}
              autoPlay={true} 
              className={`transition-all duration-300 ${
                activeIndex === idx
                  ? ""
                  : "opacity-70"
              }`}
            />
          </SwiperSlide>
        ))}
        <style jsx global>{`
          .instagram-swiper-desktop .swiper-button-next,
          .instagram-swiper-desktop .swiper-button-prev {
            background: rgba(255, 255, 255, 0.9);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          }

          .instagram-swiper-desktop .swiper-button-next:after,
          .instagram-swiper-desktop .swiper-button-prev:after {
            font-size: 16px;
            font-weight: bold;
            color: #000;
          }

          .instagram-swiper-desktop .swiper-button-next:hover,
          .instagram-swiper-desktop .swiper-button-prev:hover {
            background: rgba(255, 255, 255, 1);
          }

          .instagram-swiper-desktop .swiper-button-disabled {
            opacity: 0.5;
          }

          .instagram-swiper-desktop .swiper-pagination-bullet,
          .instagram-swiper-mobile .swiper-pagination-bullet {
            width: 6px;
            height: 6px;
            background: rgba(0, 0, 0, 0.3);
            opacity: 1;
            transition: all 0.3s;
          }

          .instagram-swiper-desktop .swiper-pagination-bullet-active,
          .instagram-swiper-mobile .swiper-pagination-bullet-active {
            width: 32px;
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.8);
          }

          .instagram-swiper-mobile .swiper-pagination {
            bottom: 0 !important;
          }

          .instagram-swiper-desktop .swiper-pagination {
            bottom: 0 !important;
          }
        `}</style>
      </Swiper>
    </div>
  );
}
