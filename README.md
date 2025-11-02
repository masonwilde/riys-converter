# riys-converter

A browser-based audio and video file converter that runs entirely client-side using FFMPEG.wasm. No server required - all processing happens in your browser using your local resources.

## Features

- Client-side media conversion (audio and video)
- No file uploads to external servers
- Privacy-focused - your files never leave your device
- Powered by FFMPEG.wasm

## Development

```bash
npm install
npm run dev     # Start development server
npm run build   # Build for production
```

## Tech Stack

- [Vite](https://vitejs.dev/) - Build tool and dev server
- [FFmpeg.wasm](https://ffmpegwasm.netlify.app/) - Client-side media processing
- Vanilla JavaScript, HTML, and CSS

## Credits

This project uses [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm), which is built on top of [FFmpeg](https://ffmpeg.org/).

- FFmpeg.wasm JavaScript wrapper - [MIT License](https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/LICENSE)
- FFmpeg core (WebAssembly) - [LGPL 2.1+](https://www.ffmpeg.org/legal.html)

## License

MIT
