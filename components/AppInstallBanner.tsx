"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const BANNER_DISMISSED_KEY = "app-install-banner-dismissed";

export default function AppInstallBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(t);
    }
  }, [pathname]);

  const dismiss = () => {
    setHiding(true);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem(BANNER_DISMISSED_KEY, "1");
    }, 350);
  };

  if (pathname !== "/" || !visible) return null;

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
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.20);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          line-height: 1;
          flex-shrink: 0;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .banner-close-btn:hover {
          background: rgba(255,255,255,0.35);
          transform: scale(1.1);
        }
        .banner-open-btn {
          flex-shrink: 0;
          padding: 7px 14px;
          border-radius: 10px;
          border: none;
          background: #fff;
          color: #E8192C;
          font-weight: 800;
          font-size: 13px;
          cursor: pointer;
          white-space: nowrap;
          letter-spacing: 0.01em;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .banner-open-btn:hover {
          opacity: 0.9;
          transform: scale(1.03);
        }
      `}</style>

      <div
        className={hiding ? "banner-exit" : "banner-enter"}
        style={{
          position: "relative",
          zIndex: 9999,
          width: "100%",
          background: "#E8192C",
          boxShadow: "0 2px 16px rgba(232,25,44,0.25)",
          padding: "7px 10px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          
        }}
      >
      

        {/* App icon */}
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "#fff",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
              fill="#E8192C"
            />
          </svg>
        </div>

        {/* Text block */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: 12,
            lineHeight: 1.3,
          }}>
            Les Meilleures adresses autours de vous
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 4,
            marginTop: 2,
          }}>
            <span style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 11,
              fontWeight: 500,
            }}>
                            Télécharger l&apos;application Life

            </span>
            <span style={{ color: "#FFD700", fontSize: 10, letterSpacing: "-0.5px" }}>★★★★★</span>
            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 10 }}>(1.8 k)</span>
          </div>
        </div>

        {/* CTA */}
        <button className="banner-open-btn">
          Ouvrir
        </button>
          {/* Close button */}
        {/* <button
          onClick={dismiss}
          className="banner-close-btn"
          aria-label="Fermer la bannière d'installation"
        >
          ✕
        </button> */}
      </div>
    </>
  );
}
