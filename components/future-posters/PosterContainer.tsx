'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Download,
  Linkedin,
  Instagram,
  Check,
} from 'lucide-react';
import { PosterData } from '@/types/poster';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface PosterContainerProps {
  data: PosterData;
  className?: string;
}

export const PosterContainer: React.FC<PosterContainerProps> = ({
  data,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [posterDataUrl, setPosterDataUrl] = useState<string | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function drawPoster() {
      setIsRendering(true);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Ensure custom typography is loaded
      try {
        if (typeof document !== 'undefined' && document.fonts) {
          await document.fonts.load('900 36px "Montserrat"');
        }
      } catch {
        // Fallback gracefully
      }

      // 1. Load Clean Background Poster Template
      const templateImg = new Image();
      templateImg.crossOrigin = 'anonymous';
      templateImg.src = '/images/poster_template.jpg';

      await new Promise((resolve) => {
        templateImg.onload = resolve;
        templateImg.onerror = resolve;
      });

      if (!isMounted) return;

      // Dimensions of official template image (934 x 1024)
      const width = templateImg.width || 934;
      const height = templateImg.height || 1024;
      canvas.width = width;
      canvas.height = height;

      // Draw clean background template directly
      ctx.drawImage(templateImg, 0, 0, width, height);

      // 2. Draw Startup Logo inside Center Glowing Circle Frame
      // Exact coordinates for 934x1024 template: CenterX ~ 407.5, CenterY ~ 540, Radius ~ 132
      const centerX = width * (407.5 / 934);
      const centerY = height * (540 / 1024);
      const radius = width * (132 / 934);

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip(); // Clip everything inside circle

      // Fill inner circle background with solid white
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      if (data.logoUrl) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.src = data.logoUrl;

        await new Promise((resolve) => {
          logoImg.onload = resolve;
          logoImg.onerror = resolve;
        });

        const maxLogoDim = radius * 1.55;
        let drawW = maxLogoDim;
        let drawH = maxLogoDim;

        if (logoImg.width && logoImg.height) {
          const aspect = logoImg.width / logoImg.height;
          if (aspect > 1) {
            drawH = maxLogoDim / aspect;
          } else {
            drawW = maxLogoDim * aspect;
          }
        }

        ctx.drawImage(
          logoImg,
          centerX - drawW / 2,
          centerY - drawH / 2,
          drawW,
          drawH
        );
      } else {
        // Fallback text avatar inside circle if no logo uploaded
        ctx.fillStyle = '#0F173C';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 700 48px "Montserrat", "Space Grotesk", sans-serif';
        ctx.fillText(data.startupName.substring(0, 8).toUpperCase(), centerX, centerY);
      }
      ctx.restore();

      // 3. Draw Startup Name and Institution Name directly on clean background
      // STARTUP NAME at y ~ 735
      ctx.save();
      ctx.font = '900 34px "Montserrat", "Space Grotesk", "Arial Black", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
      ctx.shadowBlur = 8;
      ctx.fillText(data.startupName.toUpperCase(), centerX, height * (735 / 1024));
      ctx.restore();

      // UNI / INSTITUTE / ORG NAME at y ~ 775
      ctx.save();
      ctx.font = '700 18px "Montserrat", "Space Grotesk", "Arial", sans-serif';
      ctx.fillStyle = '#E2E8F0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(data.institution.toUpperCase(), centerX, height * (775 / 1024));
      ctx.restore();

      if (isMounted) {
        setPosterDataUrl(canvas.toDataURL('image/png'));
        setIsRendering(false);
      }
    }

    drawPoster();

    return () => {
      isMounted = false;
    };
  }, [data]);

  const handleDownload = () => {
    if (!posterDataUrl && canvasRef.current) {
      setPosterDataUrl(canvasRef.current.toDataURL('image/png'));
    }
    const downloadUrl = posterDataUrl || canvasRef.current?.toDataURL('image/png');
    if (!downloadUrl) return;

    const link = document.createElement('a');
    link.download = `IdeaVerse_2.0_${data.startupName.replace(/\s+/g, '_')}_Poster.png`;
    link.href = downloadUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareLinkedIn = () => {
    const shareText = `🚀 Excited to announce that ${data.startupName} (${data.institution}) is attending IdeaVerse 2.0 — Sindh's premier startup pitching & showcase competition under Spectrum 2.0 at Iqra University! \n\n#IdeaVerse20 #Spectrum20 #IqraUniversity #IUEntrepreneurshipSociety #Startups`;
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.href
    )}&summary=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareInstagram = () => {
    const caption = `🚀 WE ARE ATTENDING IDEAVERSE 2.0!\n\n${data.startupName} from ${data.institution} is pitching live at IdeaVerse 2.0 — Sindh's flagship startup showcase under Spectrum 2.0 at Iqra University!\n\n📍 Main Campus, Iqra University\n⚡ Organized by IU Entrepreneurship Society\n\n#IdeaVerse20 #Spectrum20 #IqraUniversity #Startups`;
    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 3000);
  };

  return (
    <Card className={`p-4 sm:p-8 text-center space-y-5 sm:space-y-6 bg-white border-slate-200 shadow-2xl ${className}`}>
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-200">
        <Badge variant="orange" size="md">
          Official Digital Poster Ready
        </Badge>
        <span className="text-xs font-mono text-slate-500 font-bold">
          Ref: {data.publicReference}
        </span>
      </div>

      {/* Poster Canvas Preview Container */}
      <div className="relative mx-auto aspect-[934/1024] max-w-md rounded-2xl sm:rounded-3xl bg-slate-900 border-2 border-slate-200 overflow-hidden shadow-2xl group">
        <canvas ref={canvasRef} className="w-full h-full object-contain" />
        {isRendering && (
          <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center gap-2 text-white">
            <span className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono font-bold">Generating Custom Poster...</span>
          </div>
        )}
      </div>

      {/* Action Buttons: Download & Share */}
      <div className="space-y-4 pt-2">
        <Button
          onClick={handleDownload}
          variant="primary"
          size="lg"
          icon={Download}
          className="w-full py-4 text-xs sm:text-sm uppercase tracking-wider font-extrabold shadow-lg"
          disabled={isRendering}
        >
          Download Official Poster Image
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Share on LinkedIn */}
          <button
            onClick={handleShareLinkedIn}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            <Linkedin className="w-4 h-4" />
            <span>Share on LinkedIn</span>
          </button>

          {/* Share on Instagram */}
          <button
            onClick={handleShareInstagram}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider transition-opacity shadow-md"
          >
            <Instagram className="w-4 h-4" />
            <span>{copiedCaption ? 'Caption Copied!' : 'Copy Instagram Story Caption'}</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {copiedCaption && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Instagram story caption copied to clipboard! Paste it when sharing your poster.</span>
        </div>
      )}
    </Card>
  );
};
