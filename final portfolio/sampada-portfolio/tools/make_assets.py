# Builds optimized screen images + composed mockup covers from the original Figma exports.
# Usage: python3 tools/make_assets.py /path/to/projects
import sys, os, re
from PIL import Image, ImageDraw, ImageFilter, ImageChops
SRC = sys.argv[1] if len(sys.argv) > 1 else 'projects'
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets')
S = 2  # supersample factor for frames

def slug(s): return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

def load(folder, name):
    return Image.open(os.path.join(SRC, folder, name)).convert('RGBA')

def flat(im, bg=(255,255,255)):
    b = Image.new('RGBA', im.size, bg + (255,)); b.alpha_composite(im); return b

def rr_mask(size, r):
    m = Image.new('L', (size[0]*4, size[1]*4), 0)
    ImageDraw.Draw(m).rounded_rectangle([0,0,size[0]*4-1,size[1]*4-1], r*4, fill=255)
    return m.resize(size, Image.LANCZOS)

def phone(screen, sw, tilt=0):
    """Phone with bezel. sw = final screen width in px. Returns RGBA (with transparent bg)."""
    sh = round(sw * screen.height / screen.width)
    w, h = sw*S, sh*S
    pad = round(sw*0.032)*S
    FW, FH = w+2*pad, h+2*pad
    fr = Image.new('RGBA', (FW, FH), (0,0,0,0))
    d = ImageDraw.Draw(fr)
    R = round(sw*0.17)*S
    d.rounded_rectangle([0,0,FW-1,FH-1], R, fill=(10,10,16,255), outline=(86,84,112,255), width=S*2)
    d.rounded_rectangle([S*2,S*2,FW-1-S*2,FH-1-S*2], R-S*2, outline=(26,26,38,255), width=S*2)
    scr = flat(screen).resize((w, h), Image.LANCZOS)
    m = rr_mask((w, h), round(sw*0.125)*S)
    fr.paste(scr, (pad, pad), m)
    # dynamic island
    iw, ih = round(sw*0.27)*S, round(sw*0.075)*S
    d.rounded_rectangle([FW//2-iw//2, pad+round(sw*0.028)*S, FW//2+iw//2, pad+round(sw*0.028)*S+ih], ih//2, fill=(4,4,8,255))
    if tilt:
        fr = fr.rotate(tilt, resample=Image.BICUBIC, expand=True)
    return fr.resize((fr.width//S, fr.height//S), Image.LANCZOS)

def browser(shot, w, vh=None, top=0, bar=True):
    """Browser window. shot cropped from `top` to give viewport aspect; w = final width."""
    barh = round(w*0.034) if bar else 0
    sc = (w - 2) / shot.width
    vp_h = vh if vh else round(shot.height*sc)
    crop_h = round(vp_h/sc)
    view = flat(shot).crop((0, top, shot.width, min(shot.height, top+crop_h)))
    view = view.resize((w-2, round(view.height*sc)), Image.LANCZOS)
    H = barh + view.height + 2
    big = Image.new('RGBA', (w*S, H*S), (0,0,0,0))
    d = ImageDraw.Draw(big)
    d.rounded_rectangle([0,0,w*S-1,H*S-1], round(w*0.012)*S, fill=(22,22,32,255), outline=(86,84,112,255), width=S*2)
    if bar:
        r = round(barh*0.17)*S
        for i, c in enumerate([(255,95,87),(254,188,46),(40,200,64)]):
            cx = round(barh*0.55)*S + i*round(barh*0.52)*S; cy = barh*S//2
            d.ellipse([cx-r,cy-r,cx+r,cy+r], fill=c)
        d.rounded_rectangle([w*S//2-round(w*0.15)*S, round(barh*0.25)*S, w*S//2+round(w*0.15)*S, round(barh*0.75)*S], round(barh*0.25)*S, fill=(40,40,56,255))
    big = big.resize((w, H), Image.LANCZOS)
    m = rr_mask((w, H), round(w*0.012))
    out = Image.new('RGBA', (w, H), (0,0,0,0))
    out.paste(big, (0,0))
    out.paste(view, (1, barh+1))
    out.putalpha(ImageChops.multiply(out.getchannel('A'), m))
    return out

def laptop(shot, w):
    """MacBook-style laptop; screen aspect 16:10 expected."""
    bz = round(w*0.014)
    sw = w - 2*bz; sh = round(sw*shot.height/shot.width)
    lid_h = sh + 2*bz
    base_h = round(w*0.022)
    big = Image.new('RGBA', (w*S, (lid_h+base_h)*S), (0,0,0,0)); d = ImageDraw.Draw(big)
    d.rounded_rectangle([0,0,w*S-1,lid_h*S+round(w*0.01)*S], round(w*0.018)*S, fill=(10,10,16,255), outline=(86,84,112,255), width=S*2)
    # base
    d.rounded_rectangle([-round(w*0.0)*S, lid_h*S, w*S-1, (lid_h+base_h)*S-1], round(w*0.01)*S, fill=(150,150,172,255))
    d.rounded_rectangle([w*S//2-round(w*0.07)*S, lid_h*S, w*S//2+round(w*0.07)*S, lid_h*S+round(w*0.006)*S], round(w*0.003)*S, fill=(110,110,132,255))
    big = big.resize((w, lid_h+base_h), Image.LANCZOS)
    scr = flat(shot).resize((sw, sh), Image.LANCZOS)
    big.paste(scr, (bz, bz))
    return big

def shadowed(im, blur=28, off=(0,26), op=150, glow=None):
    pad = blur*3
    L = Image.new('RGBA', (im.width+2*pad, im.height+2*pad), (0,0,0,0))
    a = im.getchannel('A').point(lambda v: int(v*op/255))
    sh = Image.new('RGBA', im.size, (0,0,0,255)); sh.putalpha(a)
    L.paste(sh, (pad+off[0], pad+off[1]), sh)
    L = L.filter(ImageFilter.GaussianBlur(blur))
    if glow:
        g = Image.new('RGBA', im.size, glow+(255,)); g.putalpha(im.getchannel('A').point(lambda v: int(v*0.35)))
        G = Image.new('RGBA', L.size, (0,0,0,0)); G.paste(g, (pad, pad), g); G = G.filter(ImageFilter.GaussianBlur(40))
        L.alpha_composite(G)
    L.alpha_composite(im, (pad, pad))
    return L, pad

def bg(size, accent, glow_at=(0.5, 0.0), second=None):
    W, H = size
    base = Image.new('RGB', size, (6,6,12))
    def blob(color, cx, cy, rx, ry, strength):
        m = Image.new('L', size, 0); d = ImageDraw.Draw(m)
        d.ellipse([cx-rx, cy-ry, cx+rx, cy+ry], fill=int(255*strength))
        m = m.filter(ImageFilter.GaussianBlur(min(rx, ry)*0.6))
        layer = Image.new('RGB', size, color); base.paste(layer, (0,0), m)
    blob((34,28,104), W*glow_at[0], H*glow_at[1], W*0.62, H*0.55, 0.95)
    blob(accent, W*0.5, H*0.95, W*0.55, H*0.35, 0.42)
    if second: blob(second, W*0.9, H*0.1, W*0.25, H*0.3, 0.35)
    # fine hairline frame
    d = ImageDraw.Draw(base)
    return base.convert('RGBA')

def put(canvas, im, cx, cy, **kw):
    L, pad = shadowed(im, **kw)
    canvas.alpha_composite(L, (round(cx - im.width/2 - pad), round(cy - im.height/2 - pad)))

W, H = 1600, 1000
def save(c, name):
    c.convert('RGB').save(os.path.join(OUT, 'covers', name+'.webp'), quality=90, method=6)
    c.convert('RGB').save(os.path.join(OUT, 'covers', name+'.jpg'), quality=88)

# ---------- 1. Optimised screen images ----------
for folder in sorted(os.listdir(SRC)):
    p = os.path.join(SRC, folder)
    if not os.path.isdir(p): continue
    od = os.path.join(OUT, 'img', slug(folder)); os.makedirs(od, exist_ok=True)
    for f in sorted(os.listdir(p)):
        if not f.lower().endswith('.png'): continue
        im = Image.open(os.path.join(p, f)).convert('RGBA')
        if im.width > 1500 and im.height > 3000 and 'yummy' in folder:
            im = im.resize((860, round(im.height*860/im.width)), Image.LANCZOS)  # POS exports are 4x; 2x is plenty
        n = slug(os.path.splitext(f)[0])
        n = {'l01f517-order': 'home', 'menu-managemnt': 'menu-management'}.get(n, n)
        im.save(os.path.join(od, n+'.webp'), quality=92, method=6, exact=False)
print('screens written')

# ---------- 2. Covers ----------
def row(folder, names, sw, xs, ys, tilts, accent, **bgk):
    c = bg((W, H), accent, **bgk)
    order = sorted(range(len(names)), key=lambda i: -abs(i - (len(names)-1)/2))  # centre drawn last
    ph = [phone(load(folder, n), sw[i], tilts[i]) for i, n in enumerate(names)]
    for i in order:
        put(c, ph[i], xs[i], ys[i], blur=26, off=(0, 30), op=170)
    return c

# Yummy POS (dark app) – five phones fan
c = row('yummy pos', ['#L01f517 Order.png','Orders.png','Order.png','dishes.png','checkout.png'],
        [300,300,360,300,300], [330,560,800,1040,1270], [540,500,490,500,540], [-7,-3.5,0,3.5,7], (255,106,43))
save(c, 'yummy-pos')

# TripMate – three phones + login behind
c = row('tripmate', ['home.png','iPhone 13 & 14 - 20.png','iPhone 13 & 14 - 23.png','iPhone 13 & 14 - 19.png'],
        [300,350,350,300], [330,640,980,1290], [520,490,490,520], [-5,-2,2,5], (30,90,230))
save(c, 'tripmate')

# Beauticaa
c = row('Beauticaa', ['iPhone 13 & 14 - 5.png','Home page.png','iPhone 13 & 14 - 31.png','foundation.png'],
        [300,350,350,300], [330,640,980,1290], [520,490,490,520], [-5,-2,2,5], (140,60,170))
save(c, 'beauticaa')

# Food delivery
c = row('food delivery app', ['home page.png','Frame 1984079406.png','Read.png','Tracking page.png'],
        [280,330,330,280], [330,640,980,1290], [520,490,490,520], [-5,-2,2,5], (240,90,40))
save(c, 'food-delivery-app')

# Medical reminder
c = row('medical reminder app', ['sign up with email.png','home.png','profile.png','All.png'],
        [300,350,350,300], [330,640,980,1290], [520,490,490,520], [-5,-2,2,5], (50,170,250))
save(c, 'medical-reminder-app')

# Fashion Icon – two browsers overlapping
c = bg((W, H), (150,110,70))
d5 = load('fashion icon', 'Desktop - 5.png'); d4 = load('fashion icon', 'Desktop - 4.png'); d7 = load('fashion icon', 'Desktop - 7.png')
b7 = browser(d7, 760, vh=520); b4 = browser(d4, 840, vh=560, top=0); b5 = browser(d5, 1040, vh=680, top=0)
put(c, b7, 1180, 700, blur=26, off=(0,30), op=170)
put(c, b4, 440, 640, blur=26, off=(0,30), op=170)
put(c, b5, 800, 440, blur=30, off=(0,34), op=190)
save(c, 'fashion-icon')

# Drum dashboard – laptop + close-up crop
mac = load('some sample design', 'MacBook Pro 16_ - 10.png')
c = bg((W, H), (90,90,230), glow_at=(0.45, 0.0))
lap = laptop(mac, 1180)
put(c, lap, 740, 520, blur=34, off=(0,40), op=190)
crop = flat(mac).crop((310, 322, 1692, 498))
cw = 660; crop = crop.resize((cw, round(crop.height*cw/crop.width)), Image.LANCZOS)
cb = Image.new('RGBA', (cw+16, crop.height+16), (0,0,0,0)); dd = ImageDraw.Draw(cb)
dd.rounded_rectangle([0,0,cb.width-1,cb.height-1], 14, fill=(255,255,255,255), outline=(86,84,112,255), width=2)
cb.paste(crop, (8,8))
put(c, cb, 1230, 850, blur=24, off=(0,24), op=190)
save(c, 'drum-dashboard')
print('covers written')
