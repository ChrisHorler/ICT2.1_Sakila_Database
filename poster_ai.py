# poster_ai.py
import os, re, io, base64, random, argparse, textwrap, requests, mysql.connector
from PIL import Image, ImageDraw, ImageFont
from tqdm import tqdm

TITLE_FONTS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
]
BODY_FONTS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/TTF/DejaVuSans.ttf",
]

def load_font(paths, size):
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size=size)
            except Exception:
                pass
    return ImageFont.load_default()

def sanitize(name: str) -> str:
    s = re.sub(r"[^\w\s.-]", "", name, flags=re.UNICODE).strip()
    s = re.sub(r"\s+", "_", s)
    return s[:128] or "untitled"

CATEGORY_STYLE = {
    "Action": "cinematic action scene, dynamic composition, dramatic lighting, film still",
    "Comedy": "bright, whimsical, upbeat, film still",
    "Drama": "moody, natural light, shallow depth of field, film still",
    "Horror": "dark, ominous, high contrast, eerie atmosphere, film still",
    "Sci-Fi": "futuristic, neon accents, sci-fi environment, film still",
    "Animation": "stylized, vibrant, illustration-like, film still",
    "Family": "warm, inviting, wholesome, film still",
    "Documentary": "realistic, natural tones, candid, film still",
    "Classics": "retro film grain, muted colors, vintage cinema still",
}
NEGATIVE = ("text, watermark, logo, extra fingers, deformed hands, bad anatomy, lowres, "
            "blurry, worst quality, jpeg artifacts")

def fetch_films(conn, limit=0):
    sql = """
    SELECT 
      f.film_id, f.title, f.description, f.release_year, f.rating,
      SUBSTRING_INDEX(GROUP_CONCAT(c.name ORDER BY c.name SEPARATOR ','), ',', 1) AS main_category
    FROM film f
    LEFT JOIN film_category fc ON fc.film_id = f.film_id
    LEFT JOIN category c ON c.category_id = fc.category_id
    GROUP BY f.film_id
    ORDER BY f.film_id
    """
    args = None
    if limit and limit > 0:
        sql += " LIMIT %s"
        args = (limit,)
    cur = conn.cursor(dictionary=True)
    cur.execute(sql, args)
    rows = cur.fetchall()
    cur.close()
    return rows

STOPWORDS = {
    "the","a","an","and","or","of","in","on","at","to","for","with","by",
    "from","about","into","over","after","before","under","between","without",
    "within","up","down","out","off","as","is","are","be","being","been"
}

def extract_keywords(text, max_words=6):
    # Simple, dependency-free keyword picker from the title
    if not text:
        return []
    words = re.findall(r"[A-Za-z0-9]+", text)
    scored = []
    for w in words:
        lw = w.lower()
        if lw in STOPWORDS or len(lw) <= 2:
            continue
        # score by length + position (earlier words matter a bit more)
        scored.append((lw, len(lw)))
    # unique while keeping order by first appearance
    seen, uniq = set(), []
    for w, _ in scored:
        if w not in seen:
            seen.add(w); uniq.append(w)
    return uniq[:max_words]

def build_prompt(title, description, category, title_weight=1.3, desc_weight=0.9):
    """Favor the title (~60%) over description (~40%) via emphasis."""
    style = CATEGORY_STYLE.get(category or "", "cinematic film still, dramatic lighting")
    # Title keywords emphasized
    t_keywords = extract_keywords(title, max_words=8)
    if t_keywords:
        emphasized = " ".join(f"({kw}:{title_weight})" for kw in t_keywords)
    else:
        emphasized = f"({title}:{title_weight})"

    # Trim description and lightly down-weight it
    desc = (description or "").strip()
    desc = re.sub(r"\s+", " ", desc)[:180]
    desc_part = f"(context: {desc}:{desc_weight})" if desc else ""

    # Ask for a poster-like *scene* but no text
    prompt = (
        f"{style}. Visual concept scene evoking the film title. "
        f"Primary focus: {emphasized}. {desc_part} No text on image."
    )
    return prompt.strip()


def sd_txt2img(sd_url, prompt, w, h, steps=18, cfg=5.5, seed=-1, sampler="DPM++ 2M Karras"):
    payload = {
        "prompt": prompt,
        "negative_prompt": NEGATIVE,
        "width": w,
        "height": h,
        "steps": steps,
        "cfg_scale": cfg,
        "sampler_name": sampler,
        "seed": seed,
        "restore_faces": False,
        "batch_size": 1
    }
    r = requests.post(f"{sd_url.rstrip('/')}/sdapi/v1/txt2img", json=payload, timeout=180)
    r.raise_for_status()
    data = r.json()
    if not data.get("images"):
        raise RuntimeError("Stable Diffusion returned no image.")
    b64 = data["images"][0].split(",", 1)[-1]
    return Image.open(io.BytesIO(base64.b64decode(b64))).convert("RGB")

def layout_poster(img, title, description, year=None, rating=None, category=None):
    w, h = img.size
    draw = ImageDraw.Draw(img)
    # header + footer overlays
    def band(hh, alpha):
        from PIL import Image as _I
        b = _I.new("RGBA", (w, hh), (0,0,0,alpha))
        if img.mode == "RGBA": img.alpha_composite(b, (0, 0))
        else: img.paste(b, (0, 0), b)
    header_h = int(h * 0.18)
    footer_h = int(h * 0.12)
    band(header_h, 150)
    band(footer_h, 170);  # pasted at y=0 then we overwrite text near bottom anyway

    title_font = load_font(TITLE_FONTS, size=max(36, int(h * 0.065)))
    body_font  = load_font(BODY_FONTS,  size=max(16, int(h * 0.025)))
    meta_font  = load_font(BODY_FONTS,  size=max(14, int(h * 0.022)))

    margin = int(w * 0.06)
    max_title_w = w - 2*margin
    est_chars = max(16, int(max_title_w / (title_font.size * 0.6)))
    title_lines = textwrap.wrap(title, width=est_chars)[:3]
    title_text = "\n".join(title_lines)

    bbox = draw.multiline_textbbox((0,0), title_text, font=title_font, spacing=4, align="center")
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    tx, ty = (w - tw)//2, (header_h - th)//2
    draw.multiline_text((tx+2, ty+2), title_text, font=title_font, fill=(0,0,0), spacing=4, align="center")
    draw.multiline_text((tx, ty), title_text, font=title_font, fill=(235,235,235), spacing=4, align="center")

    meta_bits = [str(x) for x in (year, rating, category) if x]
    meta = "  •  ".join(meta_bits) if meta_bits else "Sakila"
    mb = draw.textbbox((0,0), meta, font=meta_font)
    mx = (w - (mb[2]-mb[0])) // 2
    my = h - int(footer_h*0.35) - (mb[3]-mb[1])//2
    draw.text((mx+1, my+1), meta, font=meta_font, fill=(0,0,0))
    draw.text((mx, my), meta, font=meta_font, fill=(235,235,235))

    blurb_area_w = int(w * 0.88)
    blurb_x = (w - blurb_area_w)//2
    blurb_y = h - footer_h + int(footer_h*0.15)
    desc = re.sub(r"\s+", " ", (description or ""))[:220]
    blurb_lines = textwrap.wrap(desc, width=max(24, int(blurb_area_w/(body_font.size*0.55))))[:2]
    draw.multiline_text((blurb_x, blurb_y), "\n".join(blurb_lines), font=body_font, fill=(220,220,220), spacing=2)
    return img

def main():
    ap = argparse.ArgumentParser(description="Generate AI movie posters from the Sakila DB.")
    ap.add_argument("--db-host", default="127.0.0.1")
    ap.add_argument("--db-port", type=int, default=3306)
    ap.add_argument("--db-user", required=True)
    ap.add_argument("--db-pass", required=True)
    ap.add_argument("--db-name", default="sakila")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--out", default="posters")
    ap.add_argument("--sd-url", default="http://127.0.0.1:7860")
    ap.add_argument("--w", type=int, default=768)
    ap.add_argument("--h", type=int, default=1152)
    ap.add_argument("--steps", type=int, default=18)
    ap.add_argument("--cfg", type=float, default=5.5)
    ap.add_argument("--sampler", default="DPM++ 2M Karras")
    ap.add_argument("--skip-existing", action="store_true")
    ap.add_argument("--no-overlay", action="store_true",help="Save raw AI images without title/description overlays")
    ap.add_argument("--title-weight", type=float, default=1.3, help="Emphasis weight for title keywords")
    ap.add_argument("--desc-weight", type=float, default=0.9, help="Emphasis weight for description context")
    args = ap.parse_args()


    os.makedirs(args.out, exist_ok=True)

    conn = mysql.connector.connect(
        host=args.db_host, port=args.db_port,
        user=args.db_user, password=args.db_pass,
        database=args.db_name, charset="utf8mb4", use_unicode=True, autocommit=True
    )

    try:
        films = fetch_films(conn, limit=args.limit)
        for film in tqdm(films, desc="Generating posters"):
            title = film["title"] or "Untitled"
            out_name = f"{sanitize(title)}.png"
            out_path = os.path.join(args.out, out_name)
            if args.skip_existing and os.path.exists(out_path):
                continue

            prompt = build_prompt(title, film.get("description"), film.get("main_category"),
                                  title_weight=args.title_weight, desc_weight=args.desc_weight)
            seed = random.randint(1, 2_147_483_647)
            img = sd_txt2img(args.sd_url, prompt, args.w, args.h,
                             steps=args.steps, cfg=args.cfg,
                             seed=seed, sampler=args.sampler)

            if args.no_overlay:
                out_img = img
            else:
                out_img = layout_poster(img, title, film.get("description"),
                                        film.get("release_year"),
                                        film.get("rating"),
                                        film.get("main_category"))

            out_img.save(out_path, "PNG", optimize=True)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
