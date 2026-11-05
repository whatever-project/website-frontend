import bpy
import math
import os
import shutil
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, zoom
from mathutils import Vector, Matrix

ROOT = '/mnt/agents/output'
APP = os.path.join(ROOT, 'app')
ASSETS = os.path.join(APP, 'assets')
TEX = os.path.join(ASSETS, 'textures')
BLEND = os.path.join(ASSETS, 'Fantasy_Parchment_Scroll.blend')
GLB = os.path.join(ROOT, 'Fantasy_Parchment_Scroll.glb')
WIDTH_FACTOR = 1.35
ORIGINAL_TEXTURE_WIDTH = 1536
TEXTURE_HEIGHT = 2560
TEXTURE_WIDTH = round(ORIGINAL_TEXTURE_WIDTH * WIDTH_FACTOR)
rng = np.random.default_rng(20261103)


def noise2(w, h, gx, gy):
    grid = rng.random((gy, gx), dtype=np.float32)
    return zoom(grid, (h / gy, w / gx), order=3)[:h, :w]


def save_rgb(path, array):
    Image.fromarray(np.uint8(np.clip(array, 0, 255)), 'RGB').save(path, optimize=True)


def make_wider_textures():
    """Rebuild the existing maps at 1.35× horizontal resolution, not by stretching."""
    w, h = TEXTURE_WIDTH, TEXTURE_HEIGHT
    u = np.linspace(0, 1, w, dtype=np.float32)[None, :]
    v = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    broad = noise2(w, h, round(7 * WIDTH_FACTOR), 11) - 0.5
    mid = noise2(w, h, round(38 * WIDTH_FACTOR), 65) - 0.5
    fine = noise2(w, h, round(220 * WIDTH_FACTOR), 360) - 0.5
    horizontal = gaussian_filter(rng.random((h, w), dtype=np.float32), sigma=(0.38, 5.5)) - 0.5
    grain_lines = np.sin(v * math.pi * 940 + 0.32 * (broad - 0.5))
    tone = 4.5 * broad + 2.0 * mid + 1.2 * fine + 7.0 * horizontal + 0.55 * grain_lines
    edge_dist = np.minimum(u, 1 - u)
    end_dist = np.minimum(v, 1 - v)
    edge_age = np.exp(-edge_dist * 52.0 * WIDTH_FACTOR) * (0.48 + 0.045 * mid)
    end_age = np.exp(-end_dist * 44.0) * 0.30
    age = np.clip(edge_age + end_age, 0, 0.52)
    ivory = np.array([244, 233, 201], dtype=np.float32)
    warm_edge = np.array([158, 114, 66], dtype=np.float32)
    color = ivory[None, None, :] + tone[..., None] * np.array([1.0, 0.88, 0.64])[None, None, :]
    color = color * (1 - age[..., None]) + warm_edge[None, None, :] * age[..., None]
    save_rgb(os.path.join(TEX, 'parchment_basecolor.png'), color)

    height = 0.12 * fine + 0.20 * horizontal + 0.012 * grain_lines
    dy, dx = np.gradient(height.astype(np.float32))
    normal = np.stack((-dx * 2.2, -dy * 2.2, np.ones_like(dx)), axis=-1)
    normal /= np.linalg.norm(normal, axis=-1, keepdims=True)
    save_rgb(os.path.join(TEX, 'parchment_normal.png'), (normal * 0.5 + 0.5) * 255)


make_wider_textures()
bpy.ops.wm.open_mainfile(filepath=BLEND)
scene = bpy.context.scene
paper = bpy.data.objects['Fantasy_Parchment_Scroll']
mesh = paper.data
original_width = max(v.co.x for v in mesh.vertices) - min(v.co.x for v in mesh.vertices)
original_height = max(v.co.y for v in mesh.vertices) - min(v.co.y for v in mesh.vertices)

# Existing grid layout from the saved source: bottom curl, flat center, top curl.
NU = 72
N_BOTTOM = 50
N_FLAT = 184
TOP_START = N_BOTTOM + N_FLAT + 1
assert len(mesh.vertices) == 19783

for vertex in mesh.vertices:
    row, _ = divmod(vertex.index, NU + 1)
    vertex.co.x *= WIDTH_FACTOR
    if row >= TOP_START:
        # Reverse only the upper curl: away from the front-facing viewer.
        vertex.co.z = -abs(vertex.co.z)
mesh.update()

# Replace the existing image datablocks with wider, same-scale grain maps.
material = mesh.materials[0]
for node in material.node_tree.nodes:
    if node.type == 'TEX_IMAGE':
        filename = 'parchment_normal.png' if 'normal' in node.image.name.lower() else 'parchment_basecolor.png'
        image = bpy.data.images.load(os.path.join(TEX, filename), check_existing=False)
        image.colorspace_settings.name = 'Non-Color' if 'normal' in filename else 'sRGB'
        node.image = image
for image in list(bpy.data.images):
    if image.users == 0 and image.source == 'FILE':
        bpy.data.images.remove(image)

new_width = max(v.co.x for v in mesh.vertices) - min(v.co.x for v in mesh.vertices)
new_height = max(v.co.y for v in mesh.vertices) - min(v.co.y for v in mesh.vertices)
assert abs(new_width / original_width - WIDTH_FACTOR) < 1e-6
assert abs(new_height - original_height) < 1e-6
paper['ui_safe_center'] = 'Central flat region: 3.39 wide × 3.68 high; full flat sheet: approximately 4.28 wide × 4.60 high.'
paper['modification'] = 'Existing sheet widened by 35%; original height and 0.022-unit paper thickness preserved. Top curl reversed backward; bottom curl remains forward.'
paper['curl_directions'] = 'Top: negative depth / backward. Bottom: positive depth / forward.'

cam = scene.camera
cam.location = (0.0, -0.10, 12.0)
target = Vector((0.0, -0.05, 0.05))
cam.rotation_euler = (target - cam.location).to_track_quat('-Z', 'Y').to_euler()
cam.data.type = 'ORTHO'
cam.data.ortho_scale = 5.95
scene.render.resolution_x = 1500
scene.render.resolution_y = 1800
scene.render.resolution_percentage = 100
scene.cycles.samples = 80
scene.render.filepath = os.path.join(ROOT, 'Fantasy_Parchment_Scroll.png')

bpy.ops.object.select_all(action='DESELECT')
paper.select_set(True)
bpy.context.view_layer.objects.active = paper
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=BLEND)
bpy.ops.export_scene.gltf(
    filepath=GLB,
    export_format='GLB',
    use_selection=True,
    export_apply=True,
    export_animations=False,
    export_cameras=False,
    export_lights=False,
    export_extras=True,
)
shutil.copy2(GLB, os.path.join(ASSETS, 'Fantasy_Parchment_Scroll.glb'))
bpy.ops.render.render(write_still=True)
shutil.copy2(scene.render.filepath, os.path.join(ASSETS, 'Fantasy_Parchment_Scroll.png'))

# Slight side angle, still orthographic and upright, to verify opposite curl directions.
az = math.radians(28)
el = math.radians(8)
target = Vector((0.0, 0.0, 0.05))
direction = Vector((math.sin(az) * math.cos(el), math.sin(el), math.cos(az) * math.cos(el)))
cam.location = target + direction * 12
forward = (target - cam.location).normalized()
right = forward.cross(Vector((0, 1, 0))).normalized()
up = right.cross(forward).normalized()
cam.rotation_euler = Matrix((right, up, -forward)).transposed().to_euler()
cam.data.ortho_scale = 6.05
scene.render.resolution_x = 1400
scene.render.resolution_y = 1600
scene.render.filepath = os.path.join(ROOT, 'Fantasy_Parchment_Scroll_Side.png')
bpy.ops.render.render(write_still=True)
shutil.copy2(scene.render.filepath, os.path.join(ASSETS, 'Fantasy_Parchment_Depth.png'))
shutil.copy2(scene.render.filepath, os.path.join(ASSETS, 'Fantasy_Parchment_Scroll_Side.png'))
print('MODIFICATION_COMPLETE', {'width': new_width, 'height': new_height, 'texture_size': (TEXTURE_WIDTH, TEXTURE_HEIGHT)})
