import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const ALLOWED_CHARS = 'liam';

function subsetAndBase64() {
	const inputFile = join(__dirname, 'font.ttf');
	const tempWoffFile = join(__dirname, 'font.subset.woff');
	const outputFile = join(__dirname, 'inlined.ts');

	if (!existsSync(inputFile)) {
		console.error(`Error: ${inputFile} not found`);
		process.exit(1);
	}

	console.log('Subsetting font...');
	try {
		// We use pyftsubset (from fonttools)
		execSync(
			`pyftsubset "${inputFile}" --text="${ALLOWED_CHARS}" --flavor=woff --output-file="${tempWoffFile}" --no-hinting --desubroutinize`
		);
	} catch (err) {
		console.error(
			'Failed to run pyftsubset. Make sure fonttools is installed (pip install fonttools)',
			err
		);
		process.exit(1);
	}

	const encoded = readFileSync(tempWoffFile).toString('base64');

	const tsContent = `// Auto-generated. Do not edit manually.
export const MEGRIM_BASE64 = "data:font/woff;base64,${encoded}";
`;

	writeFileSync(outputFile, tsContent);

	if (existsSync(tempWoffFile)) {
		unlinkSync(tempWoffFile);
	}

	console.log(`Successfully generated ${outputFile} (${encoded.length} bytes)`);
}

// Check if running directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
	subsetAndBase64();
}

export { subsetAndBase64 };
