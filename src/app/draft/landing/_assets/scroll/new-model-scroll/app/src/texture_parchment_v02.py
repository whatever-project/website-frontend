import bpy
import hashlib
import math
import os
import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import gaussian_filter, zoom

ROOT = '/mnt/agents/output'
APP = os.path.join(ROOT, 'app')
ASSETS = os.path.join(APP, 'assets')
TEX = os.path.join(ASSETS, 'textures')
SOURCE_BLEND = os.path.join(ASSETS, 'Fantasy_Parchment_Scroll_Textured.blend')
OUTPUT_BLEND = os.path.join(ASSETS, 'Fantasy_Parchment_Scroll_Textured_v02.blend')
OUTPUT_GLB = os.path.join(ROOT, 'Fantasy_Parchment_Scroll_Textured_v02.glb')
PROTECTED_GLBS = [
    os.path.join(ROOT, 'Fantasy_Parchment_Scroll.glb'),
    os.path.join(ROOT, 'Fantasy_Parchment_Scroll_Corrected.glb'),
    os.path.join(ROOT, 'Fantasy_Parchment_Scroll_Textured.glb'),
]
protected_hashes = {p: hashlib.sha256(open(p, 'rb').read()).hexdigest() for p in PROTECTED_GLBS}
rng = np.random.default_rng(82027)


def noise2(w, h, gx, gy):
    grid = rng.random((gy, gx), dtype=np.float32)
    return zoom(grid, (h / gy, w / gx), order=3)[:h, :w]


def save_rgb(path, array):
    Image.fromarray(np.uint8(np.clip(array, 0, 255)), 'RGB').save(path, optimize=True)


def make_paper_maps():
    w, h = 2074, 2560
    broad = noise2(w, h, 17, 23) - 0.5
    organic = noise2(w, h, 58, 76) - 0.5
    fine = noise2(w, h, 430, 560) - 0.5
    tooth = noise2(w, h, 880, 1080) - 0.5
    micro = gaussian_filter(rng.random((h, w), dtype=np.float32), sigma=0.42) - 0.5
    horizontal = gaussian_filter(rng.random((h, w), dtype=np.float32), sigma=(0.35, 1.65)) - 0.5

    # Short cellulose fibers, not stains or decorative marks.
    dark_img = Image.new('L', (w, h), 0)
    light_img = Image.new('L', (w, h), 0)
    dark_draw = ImageDraw.Draw(dark_img)
    light_draw = ImageDraw.Draw(light_img)
    for i in range(4200):
        x = float(rng.uniform(8, w - 8))
        y = float(rng.uniform(8, h - 8))
        angle = float(rng.normal(0.0, 0.24)) + (math.pi / 2 if i % 4 == 0 else 0.0)
        length = float(rng.uniform(8, 30))
        bend = float(rng.uniform(-1.6, 1.6))
        dx = math.cos(angle) * length * 0.5
        dy = math.sin(angle) * length * 0.5
        points = [(x - dx, y - dy), (x, y + bend), (x + dx, y + dy)]
        value = int(rng.uniform(28, 88))
        if i % 2:
            dark_draw.line(points, fill=value, width=1)
        else:
            light_draw.line(points, fill=value, width=1)
    dark_fiber = gaussian_filter(np.asarray(dark_img, dtype=np.float32) / 255.0, 0.30)
    light_fiber = gaussian_filter(np.asarray(light_img, dtype=np.float32) / 255.0, 0.30)

    # No vignette, edge aging, contact shadows, bands, stains, or burned edges.
    tone = 7.0 * broad + 6.0 * organic + 10.0 * fine + 6.0 * tooth + 5.5 * micro
    tone += 3.2 * horizontal + 12.0 * light_fiber - 14.0 * dark_fiber
    beige = np.array([225, 203, 160], dtype=np.float32)
    color = beige[None, None, :] + tone[..., None] * np.array([1.0, 0.93, 0.78])[None, None, :]
    save_rgb(os.path.join(TEX, 'parchment_v02_basecolor.png'), color)

    # Continuous UV-space relief follows both the flat sheet and curved rolls.
    height = 0.20 * fine + 0.15 * tooth + 0.09 * micro + 0.04 * organic
    height += 0.09 * horizontal + 0.16 * (light_fiber - dark_fiber)
    dy, dx = np.gradient(height.astype(np.float32))
    normal = np.stack((-dx * 2.4, -dy * 2.4, np.ones_like(dx)), axis=-1)
    normal /= np.linalg.norm(normal, axis=-1, keepdims=True)
    save_rgb(os.path.join(TEX, 'parchment_v02_normal.png'), (normal * 0.5 + 0.5) * 255)


make_paper_maps()
bpy.ops.wm.open_mainfile(filepath=SOURCE_BLEND)
scene = bpy.context.scene
paper = bpy.data.objects['Fantasy_Parchment_Scroll']
mesh = paper.data
before_coords = [tuple(v.co) for v in mesh.vertices]
before_faces = [tuple(p.vertices) for p in mesh.polygons]
before_uvs = [tuple(d.uv) for d in mesh.uv_layers.active.data]
before_matrix = paper.matrix_world.copy()

material = mesh.materials[0]
material.name = 'Warm natural parchment • visible cellulose grain v02'
nodes = material.node_tree.nodes
bsdf = nodes.get('Principled BSDF')
bsdf.inputs['Metallic'].default_value = 0.0
bsdf.inputs['Roughness'].default_value = 0.92
bsdf.inputs['Specular IOR Level'].default_value = 0.15
bsdf.inputs['Subsurface Weight'].default_value = 0.0
bsdf.inputs['Sheen Weight'].default_value = 0.0
for node in nodes:
    if node.type == 'TEX_IMAGE':
        is_normal = 'normal' in node.image.name.lower()
        filename = 'parchment_v02_normal.png' if is_normal else 'parchment_v02_basecolor.png'
        image = bpy.data.images.load(os.path.join(TEX, filename), check_existing=False)
        image.colorspace_settings.name = 'Non-Color' if is_normal else 'sRGB'
        node.image = image
    elif node.type == 'NORMAL_MAP':
        node.inputs['Strength'].default_value = 0.28
for image in list(bpy.data.images):
    if image.users == 0 and image.source == 'FILE':
        bpy.data.images.remove(image)

assert [tuple(v.co) for v in mesh.vertices] == before_coords
assert [tuple(p.vertices) for p in mesh.polygons] == before_faces
assert [tuple(d.uv) for d in mesh.uv_layers.active.data] == before_uvs
assert paper.matrix_world == before_matrix

# Keep exactly the same neutral inspection rig and color management as v01.
world = scene.world
world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.22, 0.22, 0.22, 1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.75
sun = bpy.data.objects['Soft upper-left key']
sun.data.energy = 1.7
sun.data.angle = math.radians(28)
sun.data.color = (1.0, 1.0, 1.0)
scene.view_settings.exposure = 0.25
scene.render.resolution_x = 1500
scene.render.resolution_y = 1800
scene.render.resolution_percentage = 100
scene.cycles.samples = 96
scene.render.filepath = os.path.join(ROOT, 'Fantasy_Parchment_Scroll_Textured_v02_Front.png')

bpy.ops.object.select_all(action='DESELECT')
paper.select_set(True)
bpy.context.view_layer.objects.active = paper
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=OUTPUT_BLEND)
bpy.ops.export_scene.gltf(
    filepath=OUTPUT_GLB,
    export_format='GLB',
    use_selection=True,
    export_apply=True,
    export_animations=False,
    export_cameras=False,
    export_lights=False,
    export_extras=True,
)
for path, digest in protected_hashes.items():
    assert hashlib.sha256(open(path, 'rb').read()).hexdigest() == digest
bpy.ops.render.render(write_still=True)
print('TEXTURE_V02_UPDATE_COMPLETE')
