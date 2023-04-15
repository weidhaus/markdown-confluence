import esbuild from "esbuild";
import process from "process";
import builtins from 'builtin-modules'
import { writeFileSync } from 'fs';
import { mermaidRendererPlugin } from './.build/mermaidRendererPlugin.js'


const banner =
`/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = (process.argv[2] === 'production');

const buildConfig = {
	banner: {
		js: banner,
	},
	entryPoints: ['src/main.ts'],
	bundle: true,
	external: [
		'obsidian',
		'electron',
		'@codemirror/autocomplete',
		'@codemirror/collab',
		'@codemirror/commands',
		'@codemirror/language',
		'@codemirror/lint',
		'@codemirror/search',
		'@codemirror/state',
		'@codemirror/view',
		'@lezer/common',
		'@lezer/highlight',
		'@lezer/lr',
		...builtins
	],
	format: 'cjs',
	target: 'chrome106',
	logLevel: "info",
	sourcemap: prod ? false : 'inline',
	treeShaking: true,
	outdir: prod ? 'dist' : 'dev-vault/.obsidian/plugins/obsidian-confluence',
	mainFields: ['module', 'main'],
	plugins: [mermaidRendererPlugin],
	minify: true,
	metafile: true,
};

if (prod) {
	const buildResult = await esbuild.build(buildConfig);
	writeFileSync("./dist/meta.json", JSON.stringify(buildResult.metafile));
} else {
	const context = await esbuild.context(buildConfig);
	await context.watch();
}