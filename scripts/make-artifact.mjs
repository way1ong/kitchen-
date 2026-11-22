// Готує сторінку для перегляду на claude.ai: без <html>/<head>/<body>
// (платформа додає їх сама), CSS вбудовано, React — з cdnjs (UMD 18.3.1).
import { readFileSync, writeFileSync } from 'node:fs';

const dir = 'dist-artifact';
const html = readFileSync(`${dir}/index.html`, 'utf8');
const css = html.match(/href="\.\/(assets\/[^"]+\.css)"/)?.[1];
const js = html.match(/src="\.\/(assets\/[^"]+\.js)"/)?.[1];
if (!css || !js) throw new Error('Не знайдено CSS або JS у dist-artifact/index.html');

const page = `<title>Готую сам</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Здорове меню на тиждень за рівнями складності, калорії під графік роботи, список покупок і підказки готовності без орієнтиру на колір.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600&family=Rubik:wght@500;700&display=swap">
<style>
${readFileSync(`${dir}/${css}`, 'utf8')}
</style>
<div id="root"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script type="module" src="${js}"></script>
`;
writeFileSync(`${dir}/artifact.html`, page);
console.log(JSON.stringify({ page: `${dir}/artifact.html`, js: `${dir}/${js}`, published: js }));
