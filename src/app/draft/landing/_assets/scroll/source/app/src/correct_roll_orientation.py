import bpy
import hashlib
import math
import os
from mathutils import Matrix

ROOT = '/mnt/agents/output'
APP = os.path.join(ROOT, 'app')
SOURCE_BLEND = os.path.join(APP, 'assets', 'Fantasy_Parchment_Scroll.blend')
CORRECTED_BLEND = os.path.join(APP, 'assets', 'Fantasy_Parchment_Scroll_Corrected.blend')
SOURCE_GLB = os.path.join(ROOT, 'Fantasy_Parchment_Scroll.glb')
CORRECTED_GLB = os.path.join(ROOT, 'Fantasy_Parchment_Scroll_Corrected.glb')
original_hash = hashlib.sha256(open(SOURCE_GLB, 'rb').read()).hexdigest()

bpy.ops.wm.open_mainfile(filepath=SOURCE_BLEND)
scene = bpy.context.scene
paper = bpy.data.objects['Fantasy_Parchment_Scroll']
mesh = paper.data
NU = 72
N_BOTTOM = 50
TOP_START = 235
original_width = max(v.co.x for v in mesh.vertices) - min(v.co.x for v in mesh.vertices)
original_height = max(v.co.y for v in mesh.vertices) - min(v.co.y for v in mesh.vertices)
original_depth = max(v.co.z for v in mesh.vertices) - min(v.co.z for v in mesh.vertices)
original_faces = [tuple(p.vertices) for p in mesh.polygons]
original_uvs = [tuple(d.uv) for d in mesh.uv_layers.active.data]

# Keep the existing large bottom roll and its curvature. Inset the flat sheet slightly,
# with a smooth transition through the lower curl, so the roll overhangs both sides.
SHEET_SCALE = 0.94
for vertex in mesh.vertices:
    row, _ = divmod(vertex.index, NU + 1)
    if row < N_BOTTOM:
        progress = 1.0 - row / (N_BOTTOM - 1)
        smooth = progress * progress * (3.0 - 2.0 * progress)
        factor = SHEET_SCALE + (1.0 - SHEET_SCALE) * smooth
    else:
        factor = SHEET_SCALE
    vertex.co.x *= factor

# Preserve the original overall width exactly; the existing bottom roll now defines it.
remapped_width = max(v.co.x for v in mesh.vertices) - min(v.co.x for v in mesh.vertices)
normalization = original_width / remapped_width
for vertex in mesh.vertices:
    vertex.co.x *= normalization
mesh.update()
assert [tuple(p.vertices) for p in mesh.polygons] == original_faces
assert [tuple(d.uv) for d in mesh.uv_layers.active.data] == original_uvs

# Convert the source's XY-plane / +Z-front construction to Blender Z-up / -Y-front.
# Blender's glTF exporter then produces standard glTF Y-up / +Z-front coordinates.
rotation = Matrix.Rotation(math.radians(90), 4, 'X')
for obj in scene.objects:
    obj.matrix_world = rotation @ obj.matrix_world

paper['orientation_correction'] = 'Corrected export basis: glTF +Y is vertical, +Z faces the viewer. Existing bottom roll remains at -Y and protrudes toward +Z.'
paper['roll_placement'] = 'Existing large roll at bottom, smoothly widened relative to the inset flat sheet; no added objects or changed curl radius.'
paper['source_preservation'] = 'Original face order, UV coordinates, materials, curl curvature, overall bounds, and paper thickness preserved.'

bpy.ops.object.select_all(action='DESELECT')
paper.select_set(True)
bpy.context.view_layer.objects.active = paper
scene.render.resolution_x = 1500
scene.render.resolution_y = 1800
scene.render.resolution_percentage = 100
scene.cycles.samples = 80
scene.render.filepath = os.path.join(ROOT, 'Fantasy_Parchment_Scroll_Corrected_Front.png')
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=CORRECTED_BLEND)
bpy.ops.export_scene.gltf(
    filepath=CORRECTED_GLB,
    export_format='GLB',
    use_selection=True,
    export_apply=True,
    export_animations=False,
    export_cameras=False,
    export_lights=False,
    export_extras=True,
)
assert hashlib.sha256(open(SOURCE_GLB, 'rb').read()).hexdigest() == original_hash
bpy.ops.render.render(write_still=True)
print('CORRECTION_COMPLETE', {
    'width': max(v.co.x for v in mesh.vertices) - min(v.co.x for v in mesh.vertices),
    'height': max(v.co.y for v in mesh.vertices) - min(v.co.y for v in mesh.vertices),
    'depth': max(v.co.z for v in mesh.vertices) - min(v.co.z for v in mesh.vertices),
    'original_glb_sha256': original_hash,
})
