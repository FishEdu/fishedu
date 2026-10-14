from pathlib import Path

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFont


WIDTH = 960
HEIGHT = 544
FPS = 12
DURATION_SECONDS = 6
OUTPUT_PATH = Path(__file__).resolve().parents[2] / "output" / "video" / "podstawy-wedkarstwa.mp4"
THUMBNAIL_PATH = Path(__file__).resolve().parents[2] / "output" / "images" / "podstawy-wedkarstwa-thumbnail.png"


def load_font(size: int, bold: bool = False):
    font_name = "arialbd.ttf" if bold else "arial.ttf"
    return ImageFont.truetype(Path("C:/Windows/Fonts") / font_name, size=size)


def make_frame(frame_index: int):
    progress = frame_index / (FPS * DURATION_SECONDS - 1)
    y = np.arange(HEIGHT, dtype=np.float32)[:, None]
    x = np.arange(WIDTH, dtype=np.float32)[None, :]

    wave = np.sin(x / 46 + progress * 12) * 7 + np.sin(y / 21 + progress * 8) * 4
    image = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)
    image[:, :, 0] = np.clip(18 + wave, 0, 255)
    image[:, :, 1] = np.clip(99 + y / 16 + wave, 0, 255)
    image[:, :, 2] = np.clip(137 + y / 11 + wave * 2, 0, 255)

    canvas = Image.fromarray(image)
    draw = ImageDraw.Draw(canvas)
    title_font = load_font(58, bold=True)
    body_font = load_font(27)

    draw.rounded_rectangle((92, 112, 868, 426), radius=20, fill=(255, 255, 255, 235))
    draw.ellipse((138, 166, 238, 266), fill=(54, 105, 221))
    draw.line((160, 215, 213, 215), fill=(255, 255, 255), width=9)
    draw.polygon(((211, 215), (184, 191), (184, 239)), fill=(255, 255, 255))
    draw.text((276, 164), "FishEdu", font=title_font, fill=(27, 42, 63))
    draw.text((276, 246), "Podstawy wędkowania", font=body_font, fill=(62, 83, 107))
    draw.text((276, 290), "Przykładowy materiał wideo", font=body_font, fill=(62, 83, 107))
    draw.rounded_rectangle((276, 350, 558, 392), radius=12, fill=(54, 105, 221))
    draw.text((300, 358), "Lekcja demonstracyjna", font=load_font(18, bold=True), fill=(255, 255, 255))

    return np.asarray(canvas)


def generate_video():
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    THUMBNAIL_PATH.parent.mkdir(parents=True, exist_ok=True)
    with imageio.get_writer(OUTPUT_PATH, fps=FPS, codec="libx264", quality=7) as writer:
        for frame_index in range(FPS * DURATION_SECONDS):
            writer.append_data(make_frame(frame_index))
    Image.fromarray(make_frame(0)).save(THUMBNAIL_PATH)
    print(OUTPUT_PATH)
    print(THUMBNAIL_PATH)


if __name__ == "__main__":
    generate_video()
