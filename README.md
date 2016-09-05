# uni3d
Universal 3D rendering demo using regl, getres and headless-gl

## Notes

For WebM had to:
```
brew reinstall ffmpeg --with-libvpx
```

```
brew install imagemagick
```

FFMPEG GIF encoding article:
http://blog.pkh.me/p/21-high-quality-gif-with-ffmpeg.html

FFMPEG options:
http://ubwg.net/b/full-list-of-ffmpeg-flags-and-options

I.e. `ffmpeg -h full`

FFMPEG H.264 guide:
https://trac.ffmpeg.org/wiki/Encode/H.264

Supported formats:
https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats

Could investigate ImageMagick GIF creation e.g.
```
convert -loop 0 -delay 5 -colors 75 frames/*.png -fuzz "40%" output.gif
```

Canvid:
```
https://github.com/gka/canvid
```

Original:
```
ffmpeg -f image2 -i bunny%d.jpg ffmpeg.gif
```

No trans:
```
ffmpeg -f image2 -i bunny%d.jpg -vf scale=300:-1 -gifflags -transdiff -y bunny-notrans.gif
```

Trans (optimised):
```
ffmpeg -f image2 -i bunny%d.jpg -vf scale=300:-1 -gifflags +transdiff -y bunny-trans.gif
```

To memory?
```
ffmpeg -y -i input -c:v libx264 -preset medium -b:v 555k -pass 1 -c:a libfdk_aac -b:a 128k -f mp4 /dev/null && \
ffmpeg -i input -c:v libx264 -preset medium -b:v 555k -pass 2 -c:a libfdk_aac -b:a 128k output.mp4
```

Montage (tiled)
```
montage -border 0 -geometry 256x -tile 6x -quality 75% bunny*.jpg montage.jpg
```
