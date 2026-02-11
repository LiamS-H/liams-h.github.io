var pos = vec2<f32>(f32(global_id.x),f32(global_id.y));

if (pos.x == 0 || pos.y == 0 || pos.x >= U.res.x - 1 || pos.y >= U.res.y - 1) {
    return;
}

let index = idx(pos.x, pos.y);
