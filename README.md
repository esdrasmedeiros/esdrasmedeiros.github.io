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
- `papers/`: locally hosted research papers.
- Project software, documentation, and videos are maintained in their dedicated repositories.

Publication records are present in the HTML. JavaScript initially displays the five records marked `featured`; visitors can expand the list or filter by research area. Without JavaScript, all publications remain visible. The illustration updates only on interaction; it does not animate automatically.

Publication entries with an image use `has-thumbnail`, independently of the `featured` selection. Publication thumbnails from the supplied archive are included in `assets/figures/`, keeping the original figure-to-paper associations. Static figures use optimized WebP images; the Counterexamples paper retains its original animated GIF, including all frames and timing.

Publication rows use fixed grid areas for the thumbnail, year, and details, so entries with and without figures remain aligned. Stylesheet URLs include a content version to prevent older cached layout rules from being used with new markup; update that version in the homepage header when changing `assets/style.css`.

## Content sources

Research PDFs and figures were imported from the supplied `../Webpage` archive. Software, documentation, and videos have been moved to the project repositories listed below. Teaching materials have been removed. The portrait was removed. Existing biography and current research information were retained from the original homepage.

The bibliography was cross-checked against [Esdras Medeiros’s Google Scholar profile](https://scholar.google.com/citations?user=mTiVl44AAAAJ&hl=pt-BR) on November 17, 2026. The site lists 17 distinct works, consolidating duplicate language and book records in Scholar. The 2018 journal issue year is used for *Good Random Multi-Triangulation of Surfaces*; Scholar lists its 2017 online publication year.

The OCM book, *Olimpíadas Cearenses de Matemática de 2014 a 2024* (SBM, 2025), was added using the [official publisher announcement](https://sbm.org.br/publicacoes/olimpiadas-cearenses-de-matematica-de-2014-a-2024/) and [SBM store listing](https://loja.sbm.org.br/olimpiadas-cearenses-de-matematica-de-2014-a-2024.html). Its cover thumbnail comes from the store’s product image. The Books filter includes this volume and *Fotografia 3D*.

Additional references:

- [ProofDiff project and publication details](https://visualdslab.com/papers/ProofDiff/).
- [Mathematics assessment preprint and author names](https://arxiv.org/abs/2003.01864).
- [Biodiversity article](https://doi.org/10.5902/1980509853310).
- [Hierarchical parameterization workshop paper](https://doi.org/10.5753/sibgrapi.est.2019.8315).
- [IMPA-hosted structured light survey](https://www.visgraf.impa.br/Data/RefBib/PS_PDF/rita-survey/survey.pdf), whose PDF was missing from the supplied archive.

## Project repositories

- [Structured Light Benchmark](https://github.com/esdrasmedeiros/structured-light-benchmark): project information, papers, and source release. The former local `slBenchmarkProjectPage/` directory has been removed.
- [TOPs](https://github.com/esdrasmedeiros/tops): original source distribution, paper, and documentation. [Browse the documentation](https://esdrasmedeiros.github.io/tops/), published from that repository’s `docs/` directory.
- [Fast Adaptive Blue Noise](https://github.com/esdrasmedeiros/fastAdaptiveBlueNoise): original Linux binary distribution, sample data, paper, and [supplementary videos](https://github.com/esdrasmedeiros/fastAdaptiveBlueNoise/tree/main/videos). The supplied archive does not include implementation source code.

The website links directly to these repositories. The former local `tops/`, `software/`, and `videos/` copies and all teaching pages have been removed. Original licenses and notices are preserved in the project repositories.
