Keep the full-resolution source photos outside the workspace when possible.
Import them into this folder with:

npm.cmd run import:storyboard -- "D:\slider-fotolar"

The importer:
- takes the first 7 supported image files in filename order
- resizes them to 1920x1080
- writes optimized JPG files named frame-01.jpg through frame-07.jpg

Supported source formats:
jpg, jpeg, png, webp, avif, tif, tiff

If you still need a temporary in-workspace drop zone, use raw-images\ or
source-images\. VS Code is configured to ignore those folders.

The existing generated storyboard artwork can still be recreated with:

npm.cmd run generate:storyboard

That command now regenerates the built-in reference JPG frames used by the site.
