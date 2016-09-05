# uni3d
Universal 3D rendering demo using regl, getres and headless-gl

## Notes

FFMPEG GIF encoding article:
http://blog.pkh.me/p/21-high-quality-gif-with-ffmpeg.html

FFMPEG Flags:
http://ubwg.net/b/full-list-of-ffmpeg-flags-and-options

I.e. `ffmpeg -h full`


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
