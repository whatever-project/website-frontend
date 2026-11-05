import bpy
import math
import os
import shutil
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, zoom
from mathutils import Vector

ROOT = '/mnt/agents/output'
APP = os.path.join(ROOT, 'app')
ASSETS = os.path.join(APP, 'assets')
TEX = os.path.join(ASSETS, 'textures')
os.makedirs(TEX, exist_ok=True)
rng = np.random.default_rng(20261103)


def noise2(w, h, gx, gy):
    grid = rng.random((gy, gx), dtype=np.float32)
    return zoom(grid, (h / gy, w / gx), order=3)[:h, :w]


def save_rgb(path, array):
    Image.fromarray(np.uint8(np.clip(array, 0, 255)), 'RGB').save(path, optimize=True)


def make_textures():
    w, h = 1536, 2560
    u = np.linspace(0, 1, w, dtype=np.float32)[None, :]
    v = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    broad = noise2(w, h, 7, 11) - 0.5
    mid = noise2(w, h, 38, 65) - 0.5
    fine = noise2(w, h, 220, 360) - 0.5
    horizontal = gaussian_filter(rng.random((h, w), dtype=np.float32), sigma=(0.38, 5.5)) - 0.5
    grain_lines = np.sin(v * math.pi * 940 + 0.32 * (broad - 0.5))

    # Quiet ivory center; warm age is reserved for the silhouette and rolled ends.
    tone = 4.5 * broad + 2.0 * mid + 1.2 * fine + 7.0 * horizontal + 0.55 * grain_lines
    edge_dist = np.minimum(u, 1 - u)
    end_dist = np.minimum(v, 1 - v)
    edge_age = np.exp(-edge_dist * 52.0) * (0.48 + 0.045 * mid)
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


make_textures()

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.scale_length = 0.1
model_col = bpy.data.collections.new('PARCHMENT • single editable sheet')
studio_col = bpy.data.collections.new('STUDIO • inspection only')
scene.collection.children.link(model_col)
scene.collection.children.link(studio_col)


def move_to(obj, collection):
    for old in list(obj.users_collection):
        old.objects.unlink(obj)
    collection.objects.link(obj)


def load_image(filename, colorspace):
    image = bpy.data.images.load(os.path.join(TEX, filename), check_existing=True)
    image.colorspace_settings.name = colorspace
    return image


paper_mat = bpy.data.materials.new('Warm ivory • hand-painted parchment')
paper_mat.use_nodes = True
nodes = paper_mat.node_tree.nodes
links = paper_mat.node_tree.links
bsdf = nodes.get('Principled BSDF')
bsdf.inputs['Roughness'].default_value = 0.87
bsdf.inputs['Metallic'].default_value = 0.0
bsdf.inputs['Specular IOR Level'].default_value = 0.22
bsdf.inputs['Subsurface Weight'].default_value = 0.018
bsdf.inputs['Sheen Weight'].default_value = 0.035
base_node = nodes.new('ShaderNodeTexImage')
base_node.image = load_image('parchment_basecolor.png', 'sRGB')
base_node.label = 'Ivory wash, fine horizontal grain, restrained warm edges'
links.new(base_node.outputs['Color'], bsdf.inputs['Base Color'])
normal_node = nodes.new('ShaderNodeTexImage')
normal_node.image = load_image('parchment_normal.png', 'Non-Color')
normal_map = nodes.new('ShaderNodeNormalMap')
normal_map.inputs['Strength'].default_value = 0.24
links.new(normal_node.outputs['Color'], normal_map.inputs['Color'])
links.new(normal_map.outputs['Normal'], bsdf.inputs['Normal'])

# Continuous cross-section: bottom rolled tip -> flat UI surface -> top rolled tip.
# The 4.60-unit flat span occupies about 88% of the front-facing silhouette.
NU = 72
N_BOTTOM = 50
N_FLAT = 184
N_TOP = 36
HALF_WIDTH = 1.57
FLAT_HALF = 2.30
BOTTOM_RADIUS = 0.40
TOP_RADIUS = 0.24
BOTTOM_TURN = math.radians(205)
TOP_TURN = math.radians(165)
THICKNESS = 0.022

rows = []
for j in range(N_BOTTOM):
    rows.append(('bottom', 1.0 - j / N_BOTTOM))
for j in range(N_FLAT + 1):
    rows.append(('flat', j / N_FLAT))
for j in range(1, N_TOP + 1):
    rows.append(('top', j / N_TOP))

verts, faces = [], []
for j, (kind, t) in enumerate(rows):
    for i in range(NU + 1):
        u = i / NU
        s = 2 * u - 1
        a = abs(s)
        edge = max(0.0, (a - 0.82) / 0.18)
        edge = edge * edge * (3 - 2 * edge)
        radius_variation = 1.0 + 0.018 * math.sin(u * 9.0 + 0.4) + 0.009 * math.sin(u * 23.0)
        side_wave = edge * (0.010 * math.sin(j * 0.105 + (0.8 if s > 0 else 0.0)) + 0.005 * math.sin(j * 0.29))

        if kind == 'flat':
            y = -FLAT_HALF + 2 * FLAT_HALF * t
            z = 0.0
            # Only the outer silhouette breathes; the central 80% stays exactly planar.
            z += edge * 0.009 * math.sin(y * 3.4 + u * 5.0)
            half_width = HALF_WIDTH + side_wave
        else:
            top = kind == 'top'
            radius = (TOP_RADIUS if top else BOTTOM_RADIUS) * radius_variation
            turn = (TOP_TURN if top else BOTTOM_TURN) * (1.0 + 0.016 * math.sin(u * 11.0 + (0.3 if top else 1.4)))
            theta = turn * t
            sign = 1.0 if top else -1.0
            y = sign * (FLAT_HALF + radius * math.sin(theta))
            z = radius * (1.0 - math.cos(theta))
            # Small organic changes live only in the curled margins.
            y += sign * (t ** 2) * (0.016 * math.sin(u * 8.0 + 0.6) + 0.008 * math.sin(u * 19.0))
            z += (t ** 2) * 0.013 * math.sin(u * 13.0 + (0.2 if top else 1.0))
            half_width = HALF_WIDTH * (1.0 - 0.012 * t) + side_wave

        x = s * half_width
        verts.append((x, y, z))

for j in range(len(rows) - 1):
    for i in range(NU):
        a = j * (NU + 1) + i
        faces.append((a, a + 1, a + 1 + NU + 1, a + NU + 1))

mesh = bpy.data.meshes.new('Continuous curled paper grid • flat center')
mesh.from_pydata(verts, [], faces)
mesh.update()
paper = bpy.data.objects.new('Fantasy_Parchment_Scroll', mesh)
model_col.objects.link(paper)
mesh.materials.append(paper_mat)
uv = mesh.uv_layers.new(name='Hand-painted parchment UV')
for polygon in mesh.polygons:
    polygon.use_smooth = True
    for loop_index in polygon.loop_indices:
        vertex_index = mesh.loops[loop_index].vertex_index
        row, column = divmod(vertex_index, NU + 1)
        uv.data[loop_index].uv = (column / NU, row / (len(rows) - 1))

solidify = paper.modifiers.new('Visible rolled-paper thickness', 'SOLIDIFY')
solidify.thickness = THICKNESS
solidify.offset = -0.35
solidify.use_even_offset = True
bevel = paper.modifiers.new('Soft paper cut edge', 'BEVEL')
bevel.width = 0.004
bevel.segments = 2
bevel.limit_method = 'ANGLE'
bevel.angle_limit = 0.65
paper['asset'] = 'Stylized fantasy RPG login parchment'
paper['construction'] = 'One continuous sheet; no rollers, rods, caps, props, text, or animation.'
paper['ui_safe_center'] = 'Central flat region: 2.51 wide × 3.68 high; full flat sheet: 3.14 wide × 4.60 high (about 88% of the front silhouette).'
paper['scale'] = '1 Blender unit = 10 cm. Static asset.'
paper['style'] = 'Warm ivory hand-painted interface parchment with real curled geometry and subtle thickness.'

# Neutral inspection studio, excluded from the reusable asset.
backdrop_mat = bpy.data.materials.new('Studio • warm neutral gray')
backdrop_mat.use_nodes = True
backdrop_bsdf = backdrop_mat.node_tree.nodes.get('Principled BSDF')
backdrop_bsdf.inputs['Base Color'].default_value = (0.105, 0.112, 0.12, 1)
backdrop_bsdf.inputs['Roughness'].default_value = 0.92
bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0, -1.35))
backdrop = bpy.context.object
backdrop.name = 'Neutral shadow catcher • excluded from GLB'
move_to(backdrop, studio_col)
backdrop.data.materials.append(backdrop_mat)

world = bpy.data.worlds.new('Neutral studio world')
scene.world = world
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.19, 0.20, 0.22, 1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.95

sun_data = bpy.data.lights.new('Soft upper-left key', 'SUN')
sun_data.energy = 2.2
sun_data.angle = math.radians(18)
sun = bpy.data.objects.new('Soft upper-left key', sun_data)
studio_col.objects.link(sun)
sun.location = (-3.0, 1.6, 10.0)
sun.rotation_euler = (Vector((0, 0, 0)) - sun.location).to_track_quat('-Z', 'Y').to_euler()

cam_data = bpy.data.cameras.new('Front orthographic inspection')
cam = bpy.data.objects.new('Front orthographic inspection', cam_data)
studio_col.objects.link(cam)
cam.location = (0.0, -0.10, 12.0)
target = Vector((0.0, -0.05, 0.15))
cam.rotation_euler = (target - cam.location).to_track_quat('-Z', 'Y').to_euler()
cam_data.type = 'ORTHO'
cam_data.ortho_scale = 5.70
cam_data.clip_start = 0.05
cam_data.clip_end = 300
scene.camera = cam

scene.render.engine = 'CYCLES'
scene.cycles.samples = 80
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 8
scene.render.resolution_x = 1200
scene.render.resolution_y = 1800
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGB'
scene.render.film_transparent = False
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'
scene.view_settings.exposure = 0.65
scene.render.filepath = os.path.join(ROOT, 'Fantasy_Parchment_Scroll.png')
scene.render.fps = 24
scene.frame_start = scene.frame_end = 1

bpy.ops.object.select_all(action='DESELECT')
paper.select_set(True)
bpy.context.view_layer.objects.active = paper
blend_path = os.path.join(ASSETS, 'Fantasy_Parchment_Scroll.blend')
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=blend_path)

glb_path = os.path.join(ROOT, 'Fantasy_Parchment_Scroll.glb')
bpy.ops.export_scene.gltf(
    filepath=glb_path,
    export_format='GLB',
    use_selection=True,
    export_apply=True,
    export_animations=False,
    export_cameras=False,
    export_lights=False,
    export_extras=True,
)
shutil.copy2(glb_path, os.path.join(ASSETS, 'Fantasy_Parchment_Scroll.glb'))
bpy.ops.render.render(write_still=True)
shutil.copy2(scene.render.filepath, os.path.join(ASSETS, 'Fantasy_Parchment_Scroll.png'))
print('BUILD_COMPLETE', len(verts), 'surface vertices;', len(faces), 'surface quads')
