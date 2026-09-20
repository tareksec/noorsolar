"use client";
import { useState, useRef, useEffect } from "react";
import { AppImage } from "@/components/ui/app-image";
import { ArrowLeft, ArrowRight, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
interface ProductImage { id: string; url: string; alt: string; sortOrder?: number }
export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const display = images.length ? images : [{ id: "fallback", url: "/demo/category-panels.svg", alt: productName }];
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null);
  const touch = useRef<{ x: number; y: number; distance?: number } | null>(null);
  const current = display[active] || display[0];
  const move = (direction: number) => { setActive(i => (i + direction + display.length) % display.length); setZoom(1); };
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    element?.showModal();
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = before; };
  }, [open]);
  function touchStart(event: React.TouchEvent) {
    const a = event.touches[0], b = event.touches[1];
    touch.current = { x: a.clientX, y: a.clientY, distance: b ? Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY) : undefined };
  }
  function touchEnd(event: React.TouchEvent) {
    if (touch.current && !touch.current.distance && zoom === 1) {
      const dx = event.changedTouches[0].clientX - touch.current.x;
      const dy = event.changedTouches[0].clientY - touch.current.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? -1 : 1);
    }
  };

  // Touch swipe handling for main image
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - endX;
    const diffY = (touchStartY.current ?? endY) - endY;

    // Horizontal swipe threshold
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Lightbox pinch-to-zoom handling
  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDist.current = dist;
    } else if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleLightboxTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDist.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleDelta = dist / initialPinchDist.current;
      const newScale = Math.min(Math.max(scaleDelta, 1), 3);
      setZoomScale(newScale);
      setZoomed(newScale > 1.2);
    }
  };

  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      initialPinchDist.current = null;
    }
    if (touchStartX.current !== null && !zoomed && zoomScale <= 1.1) {
      const endX = e.changedTouches[0].clientX;
      const diffX = touchStartX.current - endX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) handleNext();
        else handlePrev();
      }
      touchStartX.current = null;
    }
  };

  const toggleZoom = () => {
    if (zoomed || zoomScale > 1) {
      setZoomed(false);
      setZoomScale(1);
    } else {
      setZoomed(true);
      setZoomScale(2);
    }
  };

  return (
    <div
      data-motion="product-gallery"
      className="flex flex-col gap-4 focus:outline-none"
      onKeyDown={handleGalleryKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Product media gallery"
    >
      {/* Main Image Frame */}
      <div
        className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-[#EDEDED] border border-[#DDE1DC] flex items-center justify-center p-4 group cursor-zoom-in select-none"
        onClick={() => setLightboxOpen(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage.id + activeIndex}
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            <Image
              src={currentImage.url}
              alt={currentImage.alt || productName}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 640px) 330px, (max-width: 1024px) 100vw, 50vw"
              className="object-cover rounded-2xl"
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom Overlay Indicator */}
        <div className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md border border-white/60 text-[#111311] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-sm">
          <Maximize2 className="w-4 h-4" />
        </div>

        {/* Counter Badge */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 right-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono tracking-wider">
            {activeIndex + 1} / {displayImages.length}
          </div>
        )}

        {/* Prev / Next Arrows on Main Image (pointer hover) */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#DDE1DC] flex items-center justify-center text-[#111311] opacity-80 sm:opacity-0 group-hover:opacity-100 hover:bg-[#CEF23E] transition-all shadow-md focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#CEF23E]"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#DDE1DC] flex items-center justify-center text-[#111311] opacity-80 sm:opacity-0 group-hover:opacity-100 hover:bg-[#CEF23E] transition-all shadow-md focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#CEF23E]"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div
          className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none"
          role="tablist"
          aria-label="Image thumbnails"
        >
          {displayImages.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={img.id || idx}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`Show image ${idx + 1} of ${displayImages.length}`}
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden bg-[#EDEDED] border-2 shrink-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#CEF23E] ${
                  isSelected
                    ? "border-[#111311] ring-2 ring-[#CEF23E] scale-[1.02] shadow-sm"
                    : "border-transparent opacity-70 hover:opacity-100 hover:border-[#DDE1DC]"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${productName} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            key="lightbox-modal"
            data-motion="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`${productName} image viewer`}
            onTouchStart={handleLightboxTouchStart}
            onTouchMove={handleLightboxTouchMove}
            onTouchEnd={handleLightboxTouchEnd}
          >
            {/* Top Bar Controls */}
            <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 z-50 flex items-center justify-between text-white">
              <div className="text-xs font-mono tracking-widest bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                {activeIndex + 1} / {displayImages.length}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleZoom}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CEF23E]"
                  aria-label={zoomed ? "Zoom out" : "Zoom in"}
                >
                  {zoomed ? (
                    <ZoomOut className="w-5 h-5" />
                  ) : (
                    <ZoomIn className="w-5 h-5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLightboxOpen(false);
                    setZoomed(false);
                    setZoomScale(1);
                  }}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CEF23E]"
                  aria-label="Close lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Nav Arrows in Lightbox */}
            {displayImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#CEF23E]"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#CEF23E]"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Zoomable Image Container */}
            <div
              className={`relative max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center overflow-hidden cursor-pointer ${
                zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
              onClick={toggleZoom}
            >
              <motion.div
                key={`zoom-${currentImage.id}-${activeIndex}`}
                animate={{
                  scale: zoomScale,
                }}
                transition={{
                  duration: prefersReduced ? 0 : 0.25,
                  ease: "easeOut",
                }}
                className="relative w-full h-full max-w-4xl max-h-[75vh]"
              >
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt || productName}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    {display.length > 1 && <div className="flex gap-3 py-4 overflow-x-auto" aria-label="Image thumbnails">{display.map((item, index) => <button key={item.id} type="button" aria-label={"Show image " + (index+1)} aria-pressed={index === active} onClick={() => setActive(index)}
      className={"w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 " + (index === active ? "border-[#111311]" : "border-transparent")}>
      <AppImage src={item.url} alt="" width={80} height={80} sizes="80px" className="object-contain w-full h-full bg-[#EDEDED]" />
    </button>)}</div>}
    <dialog ref={dialog} onCancel={() => setOpen(false)} aria-label={productName + " image viewer"} className="fixed m-auto w-[95vw] max-w-5xl rounded-3xl bg-[#EDEDED] p-4 sm:p-6 backdrop:bg-black/85" onKeyDown={keyDown}>
      {open && <><div className="flex items-center justify-between mb-4 gap-3"><p className="text-xs font-mono">{active+1} / {display.length}</p><div className="flex gap-2"><button type="button" className="p-3 rounded-full bg-white" aria-label={zoom > 1 ? "Zoom out" : "Zoom in"} onClick={() => setZoom(zoom > 1 ? 1 : 2)}>{zoom > 1 ? <ZoomOut size={20} /> : <ZoomIn size={20} />}</button><button type="button" className="p-3 rounded-full bg-[#111311] text-white" aria-label="Close image viewer" onClick={() => { setOpen(false); setZoom(1); }}><X size={20} /></button></div></div>
      <div className="overflow-auto max-h-[70vh]" onTouchStart={touchStart} onTouchEnd={touchEnd} onTouchMove={event => {
        if (event.touches.length === 2 && touch.current?.distance) {
          const [a,b] = event.touches;
          setZoom(Math.max(1,Math.min(3,Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)/touch.current.distance)));
        }
      }}><AppImage src={current.url} alt={current.alt || productName} width={1200} height={900} sizes="90vw" className="w-full max-h-[65vh] object-contain origin-top-left" style={{ transform: "scale(" + zoom + ")" }} /></div>
      <div className="flex justify-between mt-4"><button type="button" onClick={() => move(-1)} className="button button-outline"><ArrowLeft size={17} />Previous</button><button type="button" onClick={() => move(1)} className="button button-outline">Next<ArrowRight size={17} /></button></div></>}
    </dialog>
  </div>;
}

