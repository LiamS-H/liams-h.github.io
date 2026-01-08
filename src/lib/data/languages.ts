const languages = {
	Python: { years: '5+', colorNum: 2 },
	TypeScript: { years: '3+', colorNum: 3 },
	JavaScript: { years: '3+', colorNum: 1 },
	Rust: { years: '2+', colorNum: 4 },
	'C/C++': { years: '2+', colorNum: 5 },
	Java: { years: '1+', colorNum: 6 }
} as const;

export type Language = keyof typeof languages;
