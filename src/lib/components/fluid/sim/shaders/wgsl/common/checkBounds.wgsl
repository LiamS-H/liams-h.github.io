fn checkBounds(x: f32, y: f32) -> bool {
    return x >= U.res.x - 1 || y >= U.res.y - 1 || x == 0 || y == 0;
}
