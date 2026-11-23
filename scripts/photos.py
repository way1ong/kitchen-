#!/usr/bin/env python3
"""Фото-приклади страв з Wikimedia Commons.

Копіює підготовлені WebP (800x533, кадровано до 3:2) у public/photos/ з хешем
вмісту в назві й генерує src/data/photos.ts та docs/PHOTOS.md (автори й ліцензії).

Використання:
    python3 scripts/photos.py <тека з manifest.json і final/*.webp> [names.json]

manifest.json — масив {id, file, title, page, author, license, licenseUrl, note};
names.json (необов'язково) — масив {id, name} з українськими назвами рецептів.
"""
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ALLOWED = ('CC0', 'Public domain', 'CC BY ', 'CC BY-SA ')


def main() -> None:
    src = Path(sys.argv[1])
    names = {}
    if len(sys.argv) > 2:
        names = {r['id']: r['name'] for r in json.loads(Path(sys.argv[2]).read_text(encoding='utf-8'))}
    items = json.loads((src / 'manifest.json').read_text(encoding='utf-8'))

    out = ROOT / 'public' / 'photos'
    out.mkdir(parents=True, exist_ok=True)
    for old in out.glob('*.webp'):
        old.unlink()

    rows = []
    for it in sorted(items, key=lambda x: x['id']):
        lic = it['license'].strip()
        if not (lic in ('CC0', 'Public domain') or lic.startswith(ALLOWED[2:])):
            raise SystemExit(f"{it['id']}: ліцензія «{lic}» не підходить")
        if not it['author'].strip():
            raise SystemExit(f"{it['id']}: немає автора")
        data = (src / 'final' / it['file']).read_bytes()
        name = f"{it['id']}.{hashlib.sha256(data).hexdigest()[:8]}.webp"
        (out / name).write_bytes(data)
        url = (it.get('licenseUrl') or '').replace('http://', 'https://')
        rows.append({**it, 'file': name, 'license': lic, 'licenseUrl': url, 'author': ' '.join(it['author'].split())})

    q = lambda s: json.dumps(s, ensure_ascii=False)  # noqa: E731
    ts = (ROOT / 'src' / 'data' / 'photos.ts').read_text(encoding='utf-8')
    head = ts.split('export const PHOTOS')[0]
    tail = ts.split('export function photoUrl')[1]
    body = ['export const PHOTOS: Record<string, DishPhoto> = {']
    for r in rows:
        body.append(
            f"  {q(r['id'])}: {{\n    file: {q(r['file'])},\n    author: {q(r['author'])},\n"
            f"    license: {q(r['license'])},\n    licenseUrl: {q(r.get('licenseUrl') or '')},\n    page: {q(r['page'])},\n  }},"
        )
    body.append('};\n')
    (ROOT / 'src' / 'data' / 'photos.ts').write_text(head + '\n'.join(body) + '\nexport function photoUrl' + tail, encoding='utf-8')

    md = [
        '# Фото страв',
        '',
        'Фото-приклади до рецептів узято з [Wikimedia Commons](https://commons.wikimedia.org) на вільних ліцензіях.',
        'Кожне фото кадровано до 3:2, зменшено до 800×533 px і збережено у WebP; інших змін немає.',
        'У додатку під фото вказано автора й ліцензію з посиланнями.',
        'Фото — лише приклад: страва за рецептом може виглядати інакше.',
        '',
        'Ваші власні фото (кнопка «Додати своє фото») зберігаються лише на вашому телефоні й сюди не потрапляють.',
        '',
        '| Рецепт | Фото | Автор | Ліцензія |',
        '|---|---|---|---|',
    ]
    for r in rows:
        title = r['title'].removeprefix('File:')
        lic = f"[{r['license']}]({r['licenseUrl']})" if r.get('licenseUrl') else r['license']
        author = r['author'].replace('|', '\\|')
        md.append(f"| {names.get(r['id'], r['id'])} | [{title}]({r['page']}) | {author} | {lic} |")
    (ROOT / 'docs' / 'PHOTOS.md').write_text('\n'.join(md) + '\n', encoding='utf-8')
    print(json.dumps({'photos': len(rows), 'bytes': sum((out / r['file']).stat().st_size for r in rows)}))


if __name__ == '__main__':
    main()
