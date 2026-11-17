# Builds ../index.html, a complete page (with viewport meta so phones lay it out correctly).
# Run from this folder: python3 build.py
import glob
q=''.join(open(f).read() for f in sorted(glob.glob('questions/q?.js')))
g=open('game.js').read().replace('//__DEBUG__','')
h=open('head2.html').read()
pre=('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
     '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
     '<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}'
     'body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>\n')
open('../index.html','w').write(pre+h+'\n<script>\n'+q+'\n'+g+'\n</script>\n</body>\n</html>\n')
