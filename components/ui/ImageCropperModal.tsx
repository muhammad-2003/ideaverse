'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Check,
  Maximize2,
  Crop,
  Move,
  FlipHorizontal,
  Sparkles,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export type AspectRatioOption = '16:9' | '4:3' | '1:1' | '3:2' | 'free';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  fileName?: string;
  defaultAspectRatio?: AspectRatioOption;
  onCropComplete: (croppedFile: File) => void | Promise<void>;
  title?: string;
}

const RATIO_MAP: Record<AspectRatioOption, number | null> = {
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '1:1': 1 / 1,
  '3:2': 3 / 2,
  'free': null,
};

export function ImageCropperModal({
  isOpen,
  onClose,
  imageSrc,
  fileName = 'cropped_image.jpg',
  defaultAspectRatio = '16:9',
  onCropComplete,
  title = 'Crop & Optimize Photo',
}: ImageCropperModalProps) {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>(defaultAspectRatio);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Pan offsets in viewport pixels
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Reset transforms when image changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setFlipH(false);
      setPan({ x: 0, y: 0 });
      setAspectRatio(defaultAspectRatio);
      setImageLoaded(false);
    }
  }, [isOpen, imageSrc, defaultAspectRatio]);

  // Load image dimensions
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      setImageLoaded(true);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Viewport & crop box sizing
  const viewportWidth = 520;
  const viewportHeight = 360;

  const targetRatio = RATIO_MAP[aspectRatio] || (naturalSize.width && naturalSize.height ? naturalSize.width / naturalSize.height : 16 / 9);

  let cropWidth = viewportWidth - 40;
  let cropHeight = cropWidth / targetRatio;

  if (cropHeight > viewportHeight - 40) {
    cropHeight = viewportHeight - 40;
    cropWidth = cropHeight * targetRatio;
  }

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    },
    [isDragging]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(Math.max(1, prev + delta), 3.5));
  };

  // Reset transforms
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setPan({ x: 0, y: 0 });
  };

  // Execute high-res crop on canvas
  const handleApplyCrop = async () => {
    if (!imageRef.current || !imageLoaded) return;
    setIsProcessing(true);

    try {
      const img = imageRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Output resolution target (high definition)
      const maxOutputWidth = 1600;
      const outputWidth = Math.min(maxOutputWidth, Math.max(800, Math.round(cropWidth * 2.5)));
      const outputHeight = Math.round(outputWidth / targetRatio);

      canvas.width = outputWidth;
      canvas.height = outputHeight;

      // Enable high quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fill background (neutral slate)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, outputWidth, outputHeight);

      // Compute transform mapping from screen to output canvas
      const scaleMultiplier = outputWidth / cropWidth;

      ctx.save();
      // Translate to canvas center
      ctx.translate(outputWidth / 2, outputHeight / 2);

      // Apply pan
      ctx.translate(pan.x * scaleMultiplier, pan.y * scaleMultiplier);

      // Apply rotation
      ctx.rotate((rotation * Math.PI) / 180);

      // Apply flip
      ctx.scale(flipH ? -1 : 1, 1);

      // Calculate base image display scale
      const isRotated = rotation === 90 || rotation === 270;
      const effectiveImgWidth = isRotated ? naturalSize.height : naturalSize.width;
      const effectiveImgHeight = isRotated ? naturalSize.width : naturalSize.height;

      const baseFitScale = Math.max(
        cropWidth / effectiveImgWidth,
        cropHeight / effectiveImgHeight
      );

      const renderScale = baseFitScale * zoom * scaleMultiplier;
      const renderWidth = naturalSize.width * renderScale;
      const renderHeight = naturalSize.height * renderScale;

      ctx.drawImage(
        img,
        -renderWidth / 2,
        -renderHeight / 2,
        renderWidth,
        renderHeight
      );

      ctx.restore();

      // Convert to Blob and File
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }

          const cleanName = fileName.replace(/\.[^/.]+$/, '') + '_cropped.jpg';
          const file = new File([blob], cleanName, { type: 'image/jpeg' });

          await onCropComplete(file);
          setIsProcessing(false);
          onClose();
        },
        'image/jpeg',
        0.92
      );
    } catch (err) {
      console.error('Crop export failed:', err);
      alert('Failed to crop image. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-brand-orange/10 text-brand-orange border border-brand-orange/20 flex items-center justify-center font-bold">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-brand-navy font-display">
                {title}
              </h3>
              <p className="text-[11px] text-slate-500">
                Pan, zoom, and select aspect ratio for the optimal showcase display.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aspect Ratio Toolbar */}
        <div className="px-5 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Aspect Ratio:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['16:9', '4:3', '1:1', '3:2', 'free'] as AspectRatioOption[]).map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => {
                  setAspectRatio(ratio);
                  setPan({ x: 0, y: 0 });
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  aspectRatio === ratio
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{ratio === 'free' ? 'Original' : ratio}</span>
                {ratio === '16:9' && (
                  <span className="text-[9px] bg-brand-orange text-white px-1 py-0.2 rounded font-black">
                    Cards
                  </span>
                )}
                {ratio === '1:1' && (
                  <span className="text-[9px] bg-brand-blue text-white px-1 py-0.2 rounded font-black">
                    Logo
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Viewport & Interactive Canvas Area */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          className="relative bg-slate-950 flex items-center justify-center overflow-hidden select-none cursor-grab active:cursor-grabbing"
          style={{ height: `${viewportHeight}px`, width: '100%' }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Active Image with Pan, Zoom, Rotation */}
          {imageSrc && (
            <div
              className="absolute pointer-events-none transition-transform duration-75"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})`,
                transformOrigin: 'center center',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt="Source preview"
                className="max-w-none select-none"
                style={{
                  width: `${naturalSize.width ? naturalSize.width * (Math.max(cropWidth / (rotation === 90 || rotation === 270 ? naturalSize.height : naturalSize.width), cropHeight / (rotation === 90 || rotation === 270 ? naturalSize.width : naturalSize.height))) * zoom : 400}px`,
                  height: 'auto',
                }}
                draggable={false}
              />
            </div>
          )}

          {/* Vignette Overlay (Dark outside crop box) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: `0 0 0 9999px rgba(15, 23, 42, 0.72)`,
              width: `${cropWidth}px`,
              height: `${cropHeight}px`,
              left: `calc(50% - ${cropWidth / 2}px)`,
              top: `calc(50% - ${cropHeight / 2}px)`,
              borderRadius: aspectRatio === '1:1' ? '16px' : '12px',
              border: '2px solid rgba(255, 107, 0, 0.9)',
            }}
          >
            {/* Rule of Thirds Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-white/20" />
              <div className="border-r border-white/20" />
              <div />
            </div>

            {/* Corner Crop Marks */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-brand-orange" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-brand-orange" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-brand-orange" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-brand-orange" />
          </div>

          {/* Quick Drag Hint */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white/80 font-medium flex items-center gap-1.5 pointer-events-none">
            <Move className="w-3 h-3 text-brand-orange" />
            <span>Click &amp; drag to frame</span>
          </div>
        </div>

        {/* Adjustments Bar (Zoom, Rotate, Flip, Reset) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {/* Zoom Slider */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-xs">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(1, prev - 0.15))}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="1"
              max="3"
              step="0.02"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-brand-orange h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(3, prev + 0.15))}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-bold text-slate-500 w-10 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Transform Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1"
              title="Rotate 90 degrees clockwise"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Rotate</span>
            </button>

            <button
              type="button"
              onClick={() => setFlipH((prev) => !prev)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1"
              title="Flip horizontally"
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Flip</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
              title="Reset position & zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 hidden sm:block">
            Target Output: <strong className="text-slate-700">{aspectRatio.toUpperCase()} High-Res</strong>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApplyCrop}
              disabled={isProcessing || !imageLoaded}
              className="py-2 px-5 rounded-xl bg-gradient-to-r from-brand-orange to-brand-orangeLight text-white font-bold text-xs shadow-md shadow-brand-orange/20 hover:shadow-brand-orange/40 transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Cropping &amp; Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Apply Crop &amp; Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
