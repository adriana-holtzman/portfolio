# portfolio
My name is Adriana Holtzman. This website displays an overview of my projects, experiences, and interests.
https://adriana-holtzman.github.io/portfolio/index.html

## Editing the site

All the writing lives in Markdown under `src/`. [Eleventy](https://www.11ty.dev/) turns it into HTML.

| What | Where |
| --- | --- |
| Intro bullets, photo, emails, social links | `src/index.md` |
| Research entries | `src/home/research/*.md` |
| Project entries | `src/home/projects/*.md` |
| Machining & fabrication gallery | `src/home/gallery.md` |
| Full project pages | `src/projects/*.md` |
| Nav bar, footer date | `src/_data/site.json` |
| Page layouts (HTML) | `src/_includes/` |

**Add a research or project entry:** copy one of the files in `src/home/research/` or `src/home/projects/`, then change the title, `order` (its position in the list), and `image` (or `video`), which is a file in `img/`.

**Topics:** each entry has a `topics:` list, like `topics: [Embedded, Hardware]`. The filter buttons above Research are made from these automatically, with the most common topic first. To share a filtered view, add the topic to the link, for example `index.html?topic=Embedded`.

**Add a full project page:** copy `src/projects/synth.md`. It becomes `projects/<filename>.html`.

## Running locally

```sh
npm install   # first time only
npm start     # http://localhost:8080, reloads on save
```

`npm run build` writes the finished site to `_site/`. Pushing to `main` deploys it through GitHub Actions.
