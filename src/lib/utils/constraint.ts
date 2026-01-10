export function constrainRects<T extends { x: number; y: number; width: number; height: number }>(
	inner: T,
	outer: T
) {
	const new_x = Math.max(outer.x, inner.x);
	inner.width += inner.x - new_x;
	inner.x = new_x;
	inner.width = Math.min(outer.x + outer.width, inner.x + inner.width) - inner.x;

	const new_y = Math.max(outer.y, inner.y);
	inner.height += inner.y - new_y;
	inner.y = new_y;
	inner.height = Math.min(outer.y + outer.height, inner.y + inner.height) - inner.y;
}
