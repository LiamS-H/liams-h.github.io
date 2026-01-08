export type TechType = 'CICD' | 'Framework' | 'Library' | 'Database';

export interface ITechnology {
	name: string;
	type: TechType[];
}

export const technologies = {
	React: { type: ['Framework'] },
	Next: { type: ['Framework'] },
	Redis: { type: ['Database'] },
	MongoDB: { type: ['Database'] },
	Prisma: { type: ['Database'] },
	PostgreSQL: { type: ['Database'] },
	Expo: { type: ['Framework'] },
	Axum: { type: ['Framework'] },
	FastAPI: { type: ['Framework'] },
	'Git/Github': { type: ['CICD'] },
	AWS: { type: ['CICD'] },
	Vercel: { type: ['CICD'] },
	Firebase: { type: ['CICD'] },
	Firestore: { type: ['Database'] },
	Cloudflare: { type: ['CICD'] },
	Docker: { type: ['CICD'] },
	GCloud: { type: ['CICD'] },
	Flask: { type: ['Framework'] },
	Express: { type: ['Framework'] },
	'MySQL/SQLite': { type: ['Database'] },
	'Dnd-Kit': { type: ['Library'] },
	ReactQuery: { type: ['Library'] },
	'GeminiAPI (Agents)': { type: ['Library'] },
	'MCP (Agents)': { type: ['Library'] },
	'wasm-pack': { type: ['Library'] },
	CodeMirror: { type: ['Library'] },
	WebWorkers: { type: ['Library'] },
	Canvas2D: { type: ['Library'] }
};

export type Technology = keyof typeof technologies;
