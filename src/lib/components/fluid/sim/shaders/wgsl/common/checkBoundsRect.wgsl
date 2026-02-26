fn checkBoundsRect(pos: vec2<f32>, rect: rect) -> f32 {
    let x = rect.x * U.res.x;
    let y = rect.y * U.res.y;
    let w = rect.w * U.res.x;
    let h = rect.h * U.res.y;
    let r = min(rect.radius * U.res.x, min(w, h) * 0.5);

    let center = vec2<f32>(x + w * 0.5, y + h * 0.5);
    let b = vec2<f32>(w * 0.5, h * 0.5);
    let p = pos - center;
    
    let q = abs(p) - b + r;
    let d = length(max(q, vec2<f32>(0.0))) + min(max(q.x, q.y), 0.0) - r;
    
    // Antialiasing: clamp coverage based on distance to edge
    // 0.5 offset to align with pixel centers, 1.0 width for smooth transition
    return clamp(0.5 - d, 0.0, 1.0);
}
