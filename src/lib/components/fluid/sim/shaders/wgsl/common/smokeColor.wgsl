fn smokeColor(c: i32, y_ratio: f32) -> vec3<f32> {
    if (c == 0) {
        return vec3<f32>(1.0, y_ratio*y_ratio, 0.5+y_ratio*0.5);
    } else if (c == 1) {
        return vec3<f32>(1.0, 0.8-y_ratio * 0.8, 0.0);
    } else if (c == 2) {
        return vec3<f32>(y_ratio, 0.8 + 0.2 * y_ratio, y_ratio * 0.2);
    } else if (c == 3) {
        return vec3<f32>(y_ratio, 0.5 + y_ratio * 0.5, 0.5 + y_ratio * 0.5);
    } else if (c == 4) {
        return vec3<f32>(1.0, y_ratio * 0.5, y_ratio * 0.5);
    } else if (c == 5) {
        return vec3<f32>(0.4 - 0.2 * y_ratio, 0.5 + 0.5 * y_ratio,1.0 - y_ratio);
    } else if (c == 6) {
        return vec3<f32>(0.7 - y_ratio * 0.5, y_ratio * 0.5, 1.0-y_ratio * 0.7);
    }
    return vec3<f32>(0.0, 0.0, 0.0);
}
