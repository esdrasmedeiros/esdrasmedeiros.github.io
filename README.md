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
- `assets/counterexample.png`: static preview of the polyhedral counterexample for browsers without JavaScript.
- `assets/models/bitoro4.ply`: original counterexample mesh; its coordinates and triangles are embedded in `assets/site.js` so the viewer also works when opened locally.
- `assets/surface.svg`: illustration used by the multi-triangulation publication entry.
- `papers/`: locally hosted research papers.
- Project software, documentation, and videos are maintained in their dedicated repositories.

Publication records are present in the HTML. JavaScript initially displays the five records marked `featured`; visitors can expand the list or filter by research area. Without JavaScript, all publications remain visible. The illustration updates only on interaction; it does not animate automatically.

The hero viewer displays the genus-two counterexample from *Two Counterexamples of Global Differential Geometry for Polyhedra* (Barros, Medeiros, and Silva). The original `bitoro4.ply` was recovered from `Dropbox/projects/MaximalPoissonSampling/src/models/`; its 24 vertices and 52 triangles match the paper's appendix. Every vertex has negative discrete Gaussian curvature. The description below the viewer links to the local paper PDF. Mesh, Points, drag, Rotate, and zoom controls retain the original geometry; the static fallback is rendered by the same viewer at double resolution. The canvas renderer culls back faces using the mesh's outward winding and depth-tests faces and edges per pixel. Faces are translucent, with dark visible edges and faint occluded edges composited beneath the front surface. Shading uses face normals; triangle drawing order does not affect visibility. The mesh is rendered at twice the display resolution in each dimension and downsampled with high-quality filtering for antialiasing. Edge strokes are two CSS pixels wide, including on mobile. Zoom in (+) and Zoom out (−) change the centered view from 50% to 250% in 25% steps; the current zoom is shown between the buttons. Zoom applies to both mesh and point modes, preserves the viewing angle, and keeps edge thickness constant.

Publication entries with an image use `has-thumbnail`, independently of the `featured` selection. Publication thumbnails from the supplied archive are included in `assets/figures/`, keeping the original figure-to-paper associations. Static figures use lossless WebP images at the original resolution. The supplied `pablo.png` is preserved unchanged for the hierarchical parameterization paper. The Counterexamples paper retains its original animated GIF, including all frames and timing. Publication thumbnails are 230 × 200 pixels on desktop and 130 × 130 pixels on mobile; narrow screens place the text below the image.

Publication rows use fixed grid areas for the thumbnail, year, and details, so entries with and without figures remain aligned. Stylesheet URLs include a content version to prevent older cached layout rules from being used with new markup; update that version in the homepage header when changing `assets/style.css`.

## Content sources

Research PDFs and figures were imported from the supplied `../Webpage` archive. Software, documentation, and videos have been moved to the project repositories listed below. Teaching materials have been removed. The portrait was removed. Existing biography and current research information were retained from the original homepage.

The bibliography was cross-checked against [Esdras Medeiros’s Google Scholar profile](https://scholar.google.com/citations?user=mTiVl44AAAAJ&hl=pt-BR) on November 17, 2026. The site lists 17 distinct works, consolidating duplicate language and book records in Scholar. The 2018 journal issue year is used for *Good Random Multi-Triangulation of Surfaces*; Scholar lists its 2017 online publication year.

The OCM book, *Olimpíadas Cearenses de Matemática de 2014 a 2024* (SBM, 2025), was added using the [official publisher announcement](https://sbm.org.br/publicacoes/olimpiadas-cearenses-de-matematica-de-2014-a-2024/) and [SBM store listing](https://loja.sbm.org.br/olimpiadas-cearenses-de-matematica-de-2014-a-2024.html). Its cover thumbnail comes from the store’s product image. The Books filter includes this volume and *Fotografia 3D*.

The GEncode entries include their original abstracts from the supplied PDFs. The hierarchical parameterization abstract is translated into English from the [SBC proceedings](https://sol.sbc.org.br/index.php/sibgrapi_estendido/article/view/8315). All 15 paper entries include their full abstracts, expanded by default using native HTML controls that let readers collapse them. Older abstracts come from `../Webpage/publications.html`; newer abstracts come from the linked arXiv records, the [biodiversity journal page](https://periodicos.ufsm.br/cienciaflorestal/article/view/53310), and the [indexed multi-triangulation abstract](https://pubmed.ncbi.nlm.nih.gov/28504940/). Both the OCM book and Fotografia 3D include English abstracts translated from descriptions supplied by the author. All 17 publication entries now have an abstract. The hierarchical parameterization and biodiversity abstracts are presented in English translation. Both book entries retain their publication and store links. Award labels link to the [IMPA award record](https://www.visgraf.impa.br/visgraf20anos/visgraf-20anos.pdf) for SIBGRAPI 2005 and [Sinésio Pesco’s publication list](https://sites.google.com/view/sinesiopesco/publications) for SIBGRAPI WIP 2019. The 2006 GEncode journal entry explicitly attributes the award to the conference version.

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

The site palette follows `assets/mylogo.png`: navy text and controls, slate-blue accents, and warm off-white backgrounds. The interactive surface and static fallback share the blue palette; original publication figures retain their own colors.

The header and favicon use `assets/mylogo-transparent.png`, a full-resolution transparent version of the supplied logo. The original `assets/mylogo.png` is retained. White mesh lines and vertices inside the navy silhouette remain opaque.
