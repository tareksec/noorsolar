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
    touch.current = null;
  }
  function keyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); event.stopPropagation(); move(event.key === "ArrowRight" ? 1 : -1); }
  }
  return <div onKeyDown={keyDown} role="region" aria-label="Product image gallery" className="min-w-0">
    <div className="relative bg-[#EDEDED] rounded-3xl overflow-hidden" onTouchStart={touchStart} onTouchEnd={touchEnd}>
      <button type="button" aria-label={"Open image viewer for " + productName} onClick={() => { if (!touch.current) setOpen(true); }} className="block w-full cursor-zoom-in">
        <AppImage src={current.url} alt={current.alt || productName} width={800} height={600} loading="eager" fetchPriority="high" sizes="(max-width: 639px) 90vw, (max-width: 1023px) 80vw, 540px" className="w-full aspect-4/3 object-contain" />
        <span className="absolute bottom-4 right-4 rounded-full bg-white/90 p-3"><Maximize2 size={18} /></span>
      </button>
      {display.length > 1 && <div className="absolute top-4 left-4 flex items-center gap-3 rounded-full bg-white/95 p-1 border border-[#DDE1DC]">
        <button type="button" onClick={() => move(-1)} aria-label="Previous image" className="p-2.5 rounded-full hover:bg-[#CEF23E]"><ArrowLeft size={16} /></button>
        <span className="text-xs font-mono" aria-live="polite">{active+1} / {display.length}</span>
        <button type="button" onClick={() => move(1)} aria-label="Next image" className="p-2.5 rounded-full hover:bg-[#CEF23E]"><ArrowRight size={16} /></button>
      </div>}
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

