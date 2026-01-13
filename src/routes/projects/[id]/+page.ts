import { error } from '@sveltejs/kit';
import { projects, type ProjectID } from '$lib/data/projects';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const project = projects[params.id as ProjectID];

	if (!project) {
		throw error(404, 'Not found');
	}

	return {
		project
	};
};
