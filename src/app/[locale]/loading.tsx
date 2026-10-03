import { LumaSpin } from "@/components/ui/luma-spin";

export default function Loading() {
  return (
    <div
      className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8"
      role="status"
      aria-label="Loading content"
    >
      <LumaSpin size={64} variant="brand" showLogo />
    </div>
  );
}
