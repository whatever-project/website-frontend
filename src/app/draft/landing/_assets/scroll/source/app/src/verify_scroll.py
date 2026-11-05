import bpy
import math
import os
import json
from mathutils import Vector, Matrix

ROOT = '/mnt/agents/output'
APP = os.path.join(ROOT, 'app')
OUT = os.path.join(APP, 'inspect3d')
os.makedirs(OUT, exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=os.path.join(APP, 'assets', 'Fantasy_Parchment_Scroll.blend'))
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 24
scene.cycles.use_denoising = True
scene.render.resolution_x = 800
scene.render.resolution_y = 800
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGB'
cam = scene.camera
cam.data.type = 'ORTHO'
cam.data.ortho_scale = 6.15
cam.data.clip_start = 0.05
cam.data.clip_end = 300
# The portrait backdrop is useful for the hero render but would occlude rear orbit views.
bpy.data.objects['Neutral shadow catcher • excluded from GLB'].hide_render = True


def shot(name, target, azimuth=0, elevation=12, distance=14, scale=6.15):
    az = math.radians(azimuth)
    el = math.radians(elevation)
    t = Vector(target)
    direction = Vector((math.sin(az) * math.cos(el), math.sin(el), math.cos(az) * math.cos(el)))
    cam.location = t + direction * distance
    forward = (t - cam.location).normalized()
    up_reference = Vector((0, 0, 1)) if abs(elevation) == 90 else Vector((0, 1, 0))
    right = forward.cross(up_reference).normalized()
    up = right.cross(forward).normalized()
    cam.rotation_euler = Matrix((right, up, -forward)).transposed().to_euler()
    cam.data.ortho_scale = scale
    scene.render.filepath = os.path.join(OUT, name + '.png')
    bpy.ops.render.render(write_still=True)


for k in range(8):
    shot(f'orbit_{k:02d}', (0, 0, 0.15), k * 45, 15)
shot('top', (0, 0, 0.15), 0, 90)

# Five close views of the single meaningful object, concentrated on its paper curls.
shot('close_top_left', (0, 2.30, 0.18), -35, 10, 12, 3.75)
shot('close_top_front', (0, 2.30, 0.18), 0, 8, 12, 3.75)
shot('close_bottom_left', (0, -2.30, 0.28), -35, -8, 12, 3.75)
shot('close_bottom_front', (0, -2.30, 0.28), 0, -5, 12, 3.75)
shot('close_bottom_right', (0, -2.30, 0.28), 35, 10, 12, 3.75)

paper = bpy.data.objects['Fantasy_Parchment_Scroll']
source_meshes = [o for o in bpy.data.collections['PARCHMENT • single editable sheet'].objects if o.type == 'MESH']
center_vertices = [v for v in paper.data.vertices if abs(v.co.x) <= 1.6956 and abs(v.co.y) <= 1.84]
row_width = 73
bottom_tip = [paper.data.vertices[i].co.z for i in range(row_width)]
top_start = len(paper.data.vertices) - row_width
top_tip = [paper.data.vertices[top_start + i].co.z for i in range(row_width)]
report = {
    'source_mesh_objects': len(source_meshes),
    'source_vertices': len(paper.data.vertices),
    'source_polygons': len(paper.data.polygons),
    'width': max(v.co.x for v in paper.data.vertices) - min(v.co.x for v in paper.data.vertices),
    'height': max(v.co.y for v in paper.data.vertices) - min(v.co.y for v in paper.data.vertices),
    'paper_thickness': paper.modifiers['Visible rolled-paper thickness'].thickness,
    'top_tip_mean_depth': sum(top_tip) / len(top_tip),
    'bottom_tip_mean_depth': sum(bottom_tip) / len(bottom_tip),
    'center_vertex_count': len(center_vertices),
    'center_max_abs_depth': max(abs(v.co.z) for v in center_vertices),
    'geometry_depth': max(v.co.z for v in paper.data.vertices) - min(v.co.z for v in paper.data.vertices),
    'packed_images': [{'name': im.name, 'packed': bool(im.packed_file), 'size': list(im.size)} for im in bpy.data.images if im.source == 'FILE'],
    'source_animations': len(bpy.data.actions),
}
assert len(source_meshes) == 1
assert 4.27 < report['width'] < 4.29
assert 5.26 < report['height'] < 5.28
assert abs(report['paper_thickness'] - 0.022) < 1e-6
assert report['top_tip_mean_depth'] < -0.4
assert report['bottom_tip_mean_depth'] > 0.7
assert len(center_vertices) > 1000
assert report['center_max_abs_depth'] < 1e-6
assert report['geometry_depth'] > 0.6
assert report['source_animations'] == 0
assert all(item['packed'] for item in report['packed_images'])
assert all(item['size'] == [2074, 2560] for item in report['packed_images'])

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT, 'Fantasy_Parchment_Scroll.glb'))
meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
report['glb_mesh_objects'] = len(meshes)
report['glb_vertices'] = sum(len(o.data.vertices) for o in meshes)
report['glb_polygons'] = sum(len(o.data.polygons) for o in meshes)
report['glb_materials'] = len({m.name for o in meshes for m in o.data.materials if m})
report['glb_actions'] = len(bpy.data.actions)
assert len(meshes) == 1
assert report['glb_vertices'] > 10000
assert report['glb_polygons'] > 10000
assert report['glb_materials'] == 1
assert report['glb_actions'] == 0
with open(os.path.join(OUT, 'integrity.json'), 'w') as handle:
    json.dump(report, handle, indent=2)
print('INTEGRITY_OK', json.dumps(report))
