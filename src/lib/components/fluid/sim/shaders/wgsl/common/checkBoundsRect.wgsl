fn checkBoundsRect(pos: vec2<f32>, rect: rect) -> bool {
    let x = rect.x * U.res.x;
    let y = rect.y * U.res.y;
    let w = rect.w * U.res.x;
    let h = rect.h * U.res.y;
    return x < pos.x && pos.x < x + w && y < pos.y && pos.y < y + h;
}
