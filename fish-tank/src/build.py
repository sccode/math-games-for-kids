# Builds ../index.html from head2.html + question banks + game.js. Run from this folder: python3 build.py
import glob
q=''.join(open(f).read() for f in sorted(glob.glob('questions/q?.js')))
g=open('game.js').read().replace('//__DEBUG__','')
h=open('head2.html').read()
open('../index.html','w').write(h+'\n<script>\n'+q+'\n'+g+'\n</script>\n')
