"use client";

import { useState, useEffect } from "react";

const BANNER_DISMISSED_KEY = "app-install-banner-dismissed";

export default function AppInstallBanner() {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setHiding(true);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem(BANNER_DISMISSED_KEY, "1");
    }, 350);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes bannerSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @keyframes bannerSlideUp {
          from { transform: translateY(0);     opacity: 1; }
          to   { transform: translateY(-100%); opacity: 0; }
        }
        .banner-enter { animation: bannerSlideDown 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .banner-exit  { animation: bannerSlideUp   0.35s cubic-bezier(0.4, 0, 1, 1) forwards; }

        .banner-close-btn {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: rgba(0, 0, 0, 0.15);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          line-height: 1;
          transition: background 0.15s ease, transform 0.15s ease;
          z-index: 2;
          backdrop-filter: blur(4px);
        }
        .banner-close-btn:hover {
          background: rgba(255, 45, 85, 0.8);
          transform: translateY(-50%) scale(1.1);
        }
      `}</style>

      <div
        className={hiding ? "banner-exit" : "banner-enter"}
        style={{
          position: "relative",
          zIndex: 9999,
          width: "100%",
          overflow: "hidden",
          boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/appbanner.jfif"
          alt="Téléchargez l'application Life — Tous les bons plans autour de vous"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            maxHeight: 90,
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {/* Close (X) button */}
        <button
          onClick={dismiss}
          className="banner-close-btn"
          aria-label="Fermer la bannière d'installation"
        >
          ✕
        </button>
      </div>
    </>
  );
}
