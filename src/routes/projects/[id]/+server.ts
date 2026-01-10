import { project_ids } from '$lib/data/projects.js';

export async function entries() {
	return project_ids.map((id) => ({ id }));
}
