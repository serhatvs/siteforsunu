import { mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const frameNames = [
  "frame-01.jpg",
  "frame-02.jpg",
  "frame-03.jpg",
  "frame-04.jpg",
  "frame-05.jpg",
  "frame-06.jpg",
  "frame-07.jpg"
];

const supportedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".tif",
  ".tiff"
]);

const preferredExactMatchExtensions = [
  ".png",
  ".webp",
  ".jpg",
  ".jpeg",
  ".avif",
  ".tif",
  ".tiff"
];

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

const inputDir = process.argv[2];
const outputDir = path.resolve("public/images/storyboard");

if (!inputDir) {
  console.error('Usage: npm run import:storyboard -- "D:\\slider-fotolar"');
  process.exit(1);
}

const resolvedInputDir = path.resolve(inputDir);

const entries = await readdir(resolvedInputDir, { withFileTypes: true });
const inputFiles = entries
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((fileName) => supportedExtensions.has(path.extname(fileName).toLowerCase()))
  .sort((left, right) => collator.compare(left, right));

if (!inputFiles.length) {
  console.error(`No supported images found in ${resolvedInputDir}`);
  process.exit(1);
}

await mkdir(outputDir, { recursive: true });
const usedFiles = new Set();
const resolvedFiles = frameNames.map((frameName) => {
  const baseName = path.parse(frameName).name;
  const exactMatches = inputFiles.filter(
    (fileName) => path.parse(fileName).name.toLowerCase() === baseName
  );

  if (!exactMatches.length) {
    return null;
  }

  exactMatches.sort((left, right) => {
    const leftRank = preferredExactMatchExtensions.indexOf(path.extname(left).toLowerCase());
    const rightRank = preferredExactMatchExtensions.indexOf(path.extname(right).toLowerCase());
    return leftRank - rightRank;
  });

  return exactMatches[0];
});

for (const fileName of resolvedFiles) {
  if (fileName) {
    usedFiles.add(fileName);
  }
}

const fallbackFiles = inputFiles.filter((fileName) => !usedFiles.has(fileName));
const selectedFiles = resolvedFiles.map((fileName) => fileName ?? fallbackFiles.shift()).filter(Boolean);

for (const [index, sourceFileName] of selectedFiles.entries()) {
  const sourcePath = path.join(resolvedInputDir, sourceFileName);
  const targetPath = path.join(outputDir, frameNames[index]);

  await sharp(sourcePath)
    .rotate()
    .resize({
      width: 1920,
      height: 1080,
      fit: "cover",
      position: "attention"
    })
    .jpeg({
      quality: 82,
      mozjpeg: true,
      progressive: true
    })
    .toFile(targetPath);

  console.log(`${sourceFileName} -> ${path.relative(process.cwd(), targetPath)}`);
}

for (const staleFrameName of frameNames.slice(selectedFiles.length)) {
  await rm(path.join(outputDir, staleFrameName), { force: true });
}

if (inputFiles.length > frameNames.length) {
  console.warn(`Ignored ${inputFiles.length - frameNames.length} extra file(s).`);
}

console.log(`Imported ${selectedFiles.length} storyboard image(s) from ${resolvedInputDir}`);
