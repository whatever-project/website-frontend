import bpy
import math
import os
from mathutils import Vector, Matrix

ROOT = '/mnt/agents/output'
APP = os.path.join(ROOT, 'app')
bpy.ops.wm.open_mainfile(filepath=os.path.join(APP, 'assets', 'Fantasy_Parchment_Scroll_Textured.blend'))
scene = bpy.context.scene
cam = scene.camera
cam.data.type = 'ORTHO'
scene.render.resolution_percentage = 100


def render_view(filename, target, azimuth, elevation, scale, width, height, samples):
    az = math.radians(azimuth)
    el = math.radians(elevation)
    t = Vector(target)
    direction = Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))
    cam.location = t + direction * 12
    forward = (t - cam.location).normalized()
    right = forward.cross(Vector((0, 0, 1))).normalized()
    up = right.cross(forward).normalized()
    cam.rotation_euler = Matrix((right, up, -forward)).transposed().to_euler()
    cam.data.ortho_scale = scale
    scene.cycles.samples = samples
    scene.render.resolution_x = width
    scene.render.resolution_y = height
    scene.render.filepath = os.path.join(ROOT, filename)
    bpy.ops.render.render(write_still=True)


render_view('Fantasy_Parchment_Scroll_Textured_ThreeQuarter.png', (0, -0.05, 0), 42, 12, 6.05, 1400, 1600, 64)
render_view('Fantasy_Parchment_Scroll_Textured_CloseUp.png', (0, -0.03, 0.45), 8, 0, 2.65, 1400, 1400, 112)
print('TEXTURED_VIEWS_COMPLETE')
