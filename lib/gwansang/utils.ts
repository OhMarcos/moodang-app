/**
 * Compress image to max dimension and return base64
 */
export async function compressImage(
  file: File,
  maxDimension: number = 1024
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const base64 = canvas.toDataURL("image/jpeg", 0.85);
      resolve(base64);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 불러올 수 없습니다"));
    };

    img.src = url;
  });
}

/**
 * Convert data URL to base64 string (strip prefix)
 */
export function dataUrlToBase64(dataUrl: string): string {
  return dataUrl.split(",")[1] ?? "";
}

/**
 * Get fortune score color based on value
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return "var(--color-gold)";
  if (score >= 60) return "var(--color-gold-dim)";
  if (score >= 40) return "var(--color-ivory-dim)";
  return "var(--color-red)";
}

/**
 * Get star rating display
 */
export function getStars(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

/**
 * cn utility for combining class names
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
