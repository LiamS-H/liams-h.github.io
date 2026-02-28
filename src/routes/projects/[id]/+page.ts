import { error } from '@sveltejs/kit';
import { project_ids, projects, type ProjectID } from '$lib/data/projects';
import type { PageLoad } from './$types';

export const prerender = true;

export async function entries() {
	return project_ids.map((id) => ({ id }));
}

export const load: PageLoad = ({ params }) => {
	const project = projects[params.id as ProjectID];

	if (!project) {
		throw error(404, 'Not found');
	}

	return {
		project
	};
};
