# uni3d
Universal 3D rendering demo using regl, getres and headless-gl

## Notes

FFMPEG GIF encoding article:
http://blog.pkh.me/p/21-high-quality-gif-with-ffmpeg.html

FFMPEG Flags:
http://ubwg.net/b/full-list-of-ffmpeg-flags-and-options

I.e. `ffmpeg -h full`

FFMPEG H.264 Guide:
https://trac.ffmpeg.org/wiki/Encode/H.264

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
