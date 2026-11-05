import bpy
import hashlib
import json
import math
import os
import struct
from mathutils import Vector, Matrix

ROOT = '/mnt/agents/output'
APP = os.path.join(ROOT, 'app')
OUT = os.path.join(APP, 'inspect-corrected')
os.makedirs(OUT, exist_ok=True)
ORIGINAL = os.path.join(ROOT, 'Fantasy_Parchment_Scroll.glb')
CORRECTED = os.path.join(ROOT, 'Fantasy_Parchment_Scroll_Corrected.glb')
assert hashlib.sha256(open(ORIGINAL, 'rb').read()).hexdigest() == '29604a0da745d10dba3261d2611cb2392ed81d0c8013c1aeaaf37d33ee585719'

with open(CORRECTED, 'rb') as handle:
    handle.read(12)
    json_length, _ = struct.unpack('<II', handle.read(8))
    gltf = json.loads(handle.read(json_length))
position_accessor = next(a for a in gltf['accessors'] if a.get('type') == 'VEC3' and 'min' in a and 'max' in a)
minimum = position_accessor['min']
maximum = position_accessor['max']
assert maximum[1] - minimum[1] > 5.26  # glTF Y is vertical.
assert maximum[2] - minimum[2] > 1.32  # glTF Z is paper depth.
assert maximum[0] - minimum[0] > 4.27

bpy.ops.wm.open_mainfile(filepath=os.path.join(APP, 'assets', 'Fantasy_Parchment_Scroll_Corrected.blend'))
scene = bpy.context.scene
paper = bpy.data.objects['Fantasy_Parchment_Scroll']
mesh = paper.data
bottom_width = max(v.co.x for v in mesh.vertices if v.index < 50 * 73) - min(v.co.x for v in mesh.vertices if v.index < 50 * 73)
flat_width = max(v.co.x for v in mesh.vertices if 50 * 73 <= v.index < 235 * 73) - min(v.co.x for v in mesh.vertices if 50 * 73 <= v.index < 235 * 73)
assert bottom_width > flat_width * 1.045
assert len(mesh.uv_layers) == 1
assert len(bpy.data.actions) == 0
assert paper.modifiers['Visible rolled-paper thickness'].thickness > 0.021

scene.render.engine = 'CYCLES'
scene.cycles.samples = 24
scene.cycles.use_denoising = True
scene.render.resolution_x = 800
scene.render.resolution_y = 800
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGB'
bpy.data.objects['Neutral shadow catcher • excluded from GLB'].hide_render = True
cam = scene.camera
cam.data.type = 'ORTHO'
cam.data.ortho_scale = 6.15


def shot(name, target, azimuth=0, elevation=12, scale=6.15):
    az = math.radians(azimuth)
    el = math.radians(elevation)
    t = Vector(target)
    direction = Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))
    cam.location = t + direction * 14
    forward = (t - cam.location).normalized()
    up_reference = Vector((1, 0, 0)) if abs(elevation) == 90 else Vector((0, 0, 1))
    right = forward.cross(up_reference).normalized()
    up = right.cross(forward).normalized()
    cam.rotation_euler = Matrix((right, up, -forward)).transposed().to_euler()
    cam.data.ortho_scale = scale
    scene.render.filepath = os.path.join(OUT, name + '.png')
    bpy.ops.render.render(write_still=True)


for k in range(8):
    shot(f'orbit_{k:02d}', (0, -0.05, 0), k * 45, 15)
shot('top', (0, -0.05, 0), 0, 90)
shot('close_top_left', (0, 0.18, 2.30), -35, 10, 4.8)
shot('close_top_front', (0, 0.18, 2.30), 0, 8, 4.8)
shot('close_bottom_left', (0, -0.28, -2.30), -35, -8, 4.8)
shot('close_bottom_front', (0, -0.28, -2.30), 0, -5, 4.8)
shot('close_bottom_right', (0, -0.28, -2.30), 35, 10, 4.8)

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=CORRECTED)
meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
assert len(meshes) == 1
assert len(bpy.data.actions) == 0
world_vertices = [o.matrix_world @ v.co for o in meshes for v in o.data.vertices]
imported_bounds = {
    'width': max(v.x for v in world_vertices) - min(v.x for v in world_vertices),
    'depth': max(v.y for v in world_vertices) - min(v.y for v in world_vertices),
    'height': max(v.z for v in world_vertices) - min(v.z for v in world_vertices),
}
assert imported_bounds['width'] > 4.27
assert imported_bounds['height'] > 5.26
assert imported_bounds['depth'] > 1.32
print('CORRECTED_GLTF_BOUNDS', {'min': minimum, 'max': maximum})
print('REIMPORT_OK', imported_bounds, {'bottom_roll_width': bottom_width, 'flat_sheet_width': flat_width, 'mesh_objects': len(meshes)})
