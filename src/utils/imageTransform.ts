/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import sharp from "sharp";

/**
 * Resize an image with caching.
 * Returns the absolute path to the resized image.
 */
export async function imageTransform(
  filename: string,
  width: string,
  height: string,
): Promise<string> {
  // 1️⃣ Validate parameters
  if (!filename) throw new Error("Missing filename parameter");
  if (!width) throw new Error("Missing width parameter");
  if (!height) throw new Error("Missing height parameter");

  const w = parseInt(width, 10);
  const h = parseInt(height, 10);
  if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
    throw new Error("Width and height must be positive numbers");
  }

  // 2️⃣ File paths
  const inputPath = path.join(
    process.cwd(),
    "src",
    "assets",
    `${filename}.jpg`,
  );
  if (!fs.existsSync(inputPath)) throw new Error("Image file does not exist");

  const thumbDir = path.join(process.cwd(), "thumb");
  console.log(thumbDir);
  if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

  const outputPath = path.join(thumbDir, `${filename}_${w}x${h}.jpg`);

  // 3️⃣ Serve cached image if it exists
  if (fs.existsSync(outputPath)) {
    return outputPath;
  }

  // 4️⃣ Resize and save the image
  try {
    await sharp(inputPath).resize(w, h).toFile(outputPath);
    return outputPath;
  } catch (err: any) {
    throw new Error(`Error processing image: ${err.message}`);
  }
}

export default imageTransform;
