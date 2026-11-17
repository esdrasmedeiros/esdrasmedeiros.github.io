# Esdras Medeiros — academic website

A static, responsive website for GitHub Pages. No build step, package installation, external fonts, or third-party JavaScript is required.

## Preview

From this directory, run:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>.

## Editing

- `index.html`: biography, research areas, publication records, and project links.
- `assets/style.css`: responsive layout and visual styles.
- `assets/site.js`: publication filters, mobile navigation, and the canvas surface illustration.
- `assets/surface.svg`: static surface illustration for browsers without JavaScript.
- `slBenchmarkProjectPage/`, `tops/`, `teaching/`, and `videos/`: project and resource pages.

Publication records are present in the HTML. JavaScript initially displays the four records marked `featured`; visitors can expand the list or filter by research area. Without JavaScript, all publications remain visible. The illustration updates only on interaction; it does not animate automatically.

Publication entries with an image use `has-thumbnail`, independently of the `featured` selection. Publication thumbnails from the supplied archive are included in `assets/figures/`, keeping the original figure-to-paper associations. Static figures use optimized WebP images; the Counterexamples paper retains its original animated GIF, including all frames and timing.

## Content sources

Research PDFs, software, figures, videos, TOPs documentation, and selected teaching materials were imported from the supplied `../Webpage` archive. The portrait was removed. Existing biography and current research information were retained from the original homepage.

The bibliography was cross-checked against [Esdras Medeiros’s Google Scholar profile](https://scholar.google.com/citations?user=mTiVl44AAAAJ&hl=pt-BR) on November 17, 2026. The site lists 16 distinct works, consolidating duplicate language and book records in Scholar. The 2018 journal issue year is used for *Good Random Multi-Triangulation of Surfaces*; Scholar lists its 2017 online publication year.

Additional references:

- [ProofDiff project and publication details](https://visualdslab.com/papers/ProofDiff/).
- [Mathematics assessment preprint and author names](https://arxiv.org/abs/2003.01864).
- [Biodiversity article](https://doi.org/10.5902/1980509853310).
- [Hierarchical parameterization workshop paper](https://doi.org/10.5753/sibgrapi.est.2019.8315).
- [IMPA-hosted structured light survey](https://www.visgraf.impa.br/Data/RefBib/PS_PDF/rita-survey/survey.pdf), whose PDF was missing from the supplied archive.

Software links are included only for available artifacts: the imported blue-noise ZIP, the TOPs source archive, and the verified [structured-light repository](https://github.com/esdrasmedeiros/structured-light-benchmark) and its original source release. Downloads preserve the historical research software; archive integrity checks do not imply compatibility with current systems.

The two original MP4 demonstrations were extracted from the 108 MB video archive and remuxed for progressive playback without re-encoding. Each individual file is under 100 MiB. Videos use `preload="none"` and load only on request. Teaching materials contain course notes, exercises, and an OpenGL example; student assessment records were not imported.

Original TOPs API documentation retains its historical appearance; the project landing page uses the new site design.
