import type { Language } from './languages';
import type { Technology } from './technologies';

interface Intro {
	summary: string;
	hook: string;
	description: string[];
}

interface Project {
	id: ProjectID;
	title: string;
	intro: Intro;
	githubLink?: string;
	liveLink?: string;
	technologies: Technology[];
	languages: Language[];
	paragraphs: string[];
	images: { src: string; alt: string }[];
	colorNum: number;
}

export const project_ids: readonly string[] = [
	'shahrazad',
	'ribbons',
	'confluence',
	'food',
	'scrycards'
] as const;

export type ProjectID = (typeof project_ids)[number];

export const projects: Record<ProjectID, Project> = {
	shahrazad: {
		id: 'shahrazad',
		title: 'Shahrazad',
		intro: {
			summary: 'Public realtime multiplayer table top game simulator.',
			hook: 'Custom WASM Sync Engine, Rich drag and drop.',
			description: [
				'A table top simulator named after the MTG card and character Shahrazad, from "One Thousand and One Nights."'
			]
		},
		githubLink: 'https://github.com/LiamS-H/shahrazad-app',
		liveLink: 'https://shahrazad.vercel.app',
		technologies: ['Axum', 'Next', 'Vercel', 'Docker', 'Dnd-Kit', 'wasm-pack'],
		languages: ['Rust', 'TypeScript'],
		paragraphs: [
			'My goal was to replace the laggy generic table-top simulator my friends and I were using with a fast app specialized to play Magic The Gathering. No sign-up required, I made it quick and easy to create and play with friends.',
			'Upon joining, all features to play a game of Magic are available. Players can import their decks, draw their starting hands, and start playing cards by dragging them into play. Everything updates in real time and feels far more responsive than alternatives.',
			'The state machine to handle the game logic is written in a shared rust lib. It is compiled natively on the server and runs as a wasm pkg on client. In this way server updates and client updates are running the same code.',
			'State transformations are sent as protobuf over websockets. For non-colliding moves, the server only sends the action, not the full game state. This keeps packets small, while keeping true state on the server.'
		],
		images: [
			{ src: '/ShahrazadLandingPage.png', alt: 'Landing Page' },
			{ src: '/ShahrazadInGame.png', alt: 'In Game' }
		],
		colorNum: 4
	},
	ribbons: {
		id: 'ribbons',
		title: 'DNA Ribbons',
		intro: {
			summary: 'An internal tool for creating genomic ribbon diagrams.',
			hook: 'Web Workers, Canvas, and a Custom graph solver.',
			description: []
		},
		technologies: ['WebWorkers', 'Canvas2D', 'Next', 'Vercel'],
		languages: ['TypeScript'],
		paragraphs: [
			`Made for a biology lab at UC Berkeley, using graph solvers to render beautiful traces of the genes that encode for proteins with similar functions. Data is collected from HMMs (Hidden Markov Models) trained to analyze and isolate genes which encode proteins with similar function.`,
			'A multi-threaded web-application using web workers to parse data and a proprietary graph solver to create beautiful plots. The plots are rendered using the OffscreenCanvas API from a worker thread and kept responsive using a shared memory layer that can stop expensive tasks mid computation when settings are changed.',
			'Many settings are available to manipulate the plots, highting specific HMM groupings, and a responsive drag-and-drop UI allows organisms to be rearranged. Plots can be exported as high quality pngs ready for academic use, though this tool sees most of its use as a quick way to validate, and rapidly prototype, on modifications to the HMM.'
			// 'Further collaboration related to public deployments and integration of the HMM within the visualization tool is in the works.'
		],
		images: [
			{ src: '/RibbonUpload.png', alt: 'File Upload' },
			{ src: '/RibbonDiagram.png', alt: 'Diagram' }
		],
		colorNum: 5
	},
	confluence: {
		id: 'confluence',
		title: 'Confluence',
		intro: {
			summary: 'In browser text editor for writing database queries.',
			hook: 'With custom MCP and tuned LLM for generation.',
			description: [
				'An in-browser text editor with syntax highlighting and autocompletion for the Scryfall query language.'
			]
		},
		liveLink: 'https://cconfluence.vercel.app',
		githubLink: 'https://github.com/LiamS-H/card-confluence2.0',
		technologies: ['CodeMirror', 'GeminiAPI (Agents)', 'Next', 'Vercel'],
		languages: ['TypeScript'],
		paragraphs: [
			'Multiple views are available for code, agent, and split, depending on wether you want to interact with the query document directly.',
			'Front end is developed using Next, mostly for SSR on initial load, the application is primarily a client side React application.',
			'The code document is powered with CodeMirror (what repl.it uses), but is running a custom syntax language. The syntax is defined using the lezer grammar and lezer parser in order to enable syntax highlighting and language features.',
			'There is a custom agent with functions to interface with the document, look up query syntax in the autocomplete lib, and access data from the database directly. This empowers the agent to perform complex natural language queries like, "show me items like this item", or "improve my query by omitting items like this that don\'t belong."'
		],
		images: [
			{ src: '/ConfluenceEditor.png', alt: 'Editor Page' },
			{ src: '/ConfluenceChat.png', alt: 'Chat Feature' }
		],
		colorNum: 3
	},
	food: {
		id: 'food',
		title: 'FoodML',
		intro: {
			summary: 'A machine learning full stack project for estimating caloric data from images.',
			hook: '1st place HackMecedIX.',
			description: []
		},
		languages: ['Python', 'TypeScript'],
		liveLink: 'https://devpost.com/software/foooood',
		technologies: [],
		paragraphs: [],
		images: [],
		colorNum: 2
	},
	scrycards: {
		id: 'scrycards',
		title: 'Scrycards',
		intro: {
			summary:
				'A react component library that wraps a Public API and provides a lightweight cache + components.',
			hook: '',
			description: []
		},
		languages: ['TypeScript'],
		githubLink: 'https://github.com/LiamS-H/react-scrycards',
		technologies: [],
		paragraphs: [],
		images: [],
		colorNum: 1
	}
};
