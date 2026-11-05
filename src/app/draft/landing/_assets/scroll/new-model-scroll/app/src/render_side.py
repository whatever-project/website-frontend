import bpy
import math
import os
import shutil
from mathutils import Vector, Matrix

ROOT = '/mnt/agents/output'
APP = os.path.join(ROOT, 'app')
bpy.ops.wm.open_mainfile(filepath=os.path.join(APP, 'assets', 'Fantasy_Parchment_Scroll.blend'))
scene = bpy.context.scene
cam = scene.camera
az = math.radians(28)
el = math.radians(8)
target = Vector((0.0, 0.0, 0.05))
direction = Vector((math.sin(az) * math.cos(el), math.sin(el), math.cos(az) * math.cos(el)))
cam.location = target + direction * 12
forward = (target - cam.location).normalized()
right = forward.cross(Vector((0, 1, 0))).normalized()
up = right.cross(forward).normalized()
cam.rotation_euler = Matrix((right, up, -forward)).transposed().to_euler()
cam.data.type = 'ORTHO'
cam.data.ortho_scale = 6.05
scene.render.resolution_x = 1400
scene.render.resolution_y = 1600
scene.render.resolution_percentage = 100
scene.cycles.samples = 64
scene.render.filepath = os.path.join(ROOT, 'Fantasy_Parchment_Scroll_Side.png')
bpy.ops.render.render(write_still=True)
shutil.copy2(scene.render.filepath, os.path.join(APP, 'assets', 'Fantasy_Parchment_Depth.png'))
shutil.copy2(scene.render.filepath, os.path.join(APP, 'assets', 'Fantasy_Parchment_Scroll_Side.png'))
print('SIDE_RENDER_COMPLETE')
