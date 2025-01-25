# FEATURE
 - [X] Pause feature, check that the animation loop gets started / restarted properly
 - [X] Add bounding boxes, define a storage array of structs that store rectangles. For each pixel check for colisions with the struct arract and accurately set the solid field to reflect structs
 - [X] release as open source
 - [X] look into the weird splits at the start
 - [ ] Add text editing and or dragging
 - [X] Add splat (even if just velocity drag) or Add solid to mouse
 - [X] Make motion turned off use a simple gradient.

# FIX
 - [X] scroll appears on right side of screen. Especially at max size. (causes missalignment with registered hitboxes)
 - [X] refine for other devices (specifically portrait widths)
 - [X] fix variable grid size (canvas doesn't match size of window) and maybe allow differing smoke quality from sim quality.
 - [X] simulation runs at drastically different speeds depending on window size
 - [X] simulation doesn't run at certain aspect ratios (ie 1024 1568 grid ratio)
 - [ ] Add timeout to reset sim when tabbed out. (so we don't hog vram)
 - [ ] Speed up fluidRegister
