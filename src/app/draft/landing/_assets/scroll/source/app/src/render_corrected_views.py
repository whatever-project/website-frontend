import bpy
import math
import os
from mathutils import Vector, Matrix

ROOT = '/mnt/agents/output'
APP = os.path.join(ROOT, 'app')
bpy.ops.wm.open_mainfile(filepath=os.path.join(APP, 'assets', 'Fantasy_Parchment_Scroll_Corrected.blend'))
scene = bpy.context.scene
cam = scene.camera
cam.data.type = 'ORTHO'
cam.data.ortho_scale = 6.05
scene.cycles.samples = 64
scene.render.resolution_percentage = 100


def render_view(filename, azimuth, elevation, width=1400, height=1600):
    az = math.radians(azimuth)
    el = math.radians(elevation)
    target = Vector((0.0, -0.05, 0.0))
    direction = Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))
    cam.location = target + direction * 12
    forward = (target - cam.location).normalized()
    right = forward.cross(Vector((0, 0, 1))).normalized()
    up = right.cross(forward).normalized()
    cam.rotation_euler = Matrix((right, up, -forward)).transposed().to_euler()
    scene.render.resolution_x = width
    scene.render.resolution_y = height
    scene.render.filepath = os.path.join(ROOT, filename)
    bpy.ops.render.render(write_still=True)


render_view('Fantasy_Parchment_Scroll_Corrected_Side.png', 76, 5, 1200, 1600)
render_view('Fantasy_Parchment_Scroll_Corrected_ThreeQuarter.png', 42, 12)
print('CORRECTED_VIEWS_COMPLETE')
