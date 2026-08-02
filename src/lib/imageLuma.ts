/** Average relative luminance of the bottom band of an image (0–1). */
export function sampleBottomLuma(
  img: HTMLImageElement,
  bandRatio = 0.14,
): number {
  const srcW = img.naturalWidth;
  const srcH = img.naturalHeight;
  if (!srcW || !srcH) return 0.5;

  const w = 48;
  const h = 10;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return 0.5;

  const band = Math.max(1, Math.floor(srcH * bandRatio));
  ctx.drawImage(img, 0, srcH - band, srcW, band, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  let sum = 0;
  const pixels = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    sum += (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
  }
  return sum / pixels;
}

/** Background tone under overlays: light → use dark UI, dark → use light UI. */
export function toneFromLuma(luma: number): "light" | "dark" {
  return luma > 0.58 ? "light" : "dark";
}
