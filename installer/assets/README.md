# Installer Assets

This folder contains assets for the NSIS installer.

## Required Files

Before building the installer, ensure these files exist:

- `icon.ico` - Application icon (32x32, 48x48, 128x128, 256x256)
- `header.bmp` - Header image for installer pages (150x57 pixels)
- `wizard.bmp` - Welcome/finish page image (164x314 pixels)

## Generating Icons

You can generate these from the main project logo using:
- Icon: Use a tool like icoconverter.com or ImageMagick
- Bitmaps: Create 150x57 and 164x314 BMP images with your branding

## Placeholder Notice

If building without these assets, the installer will use default NSIS graphics.
