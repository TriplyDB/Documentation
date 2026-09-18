# Taking screenshots for the documentation

Almost every image in `docs/assets/` is a screenshot of the TriplyDB console. They are easy to let
rot: before the 2026 refresh three visual eras of the console were live on the site at once, because
screenshots had only ever been added, never re-taken.

This file records how the current set was captured, so the next refresh does not start from zero.

## Where to shoot

| | |
|---|---|
| Instance | `https://demo.triplydb.com` — runs the new console, and its orgs look like customers rather than test junk |
| Account | `John` — a demo user that owns almost nothing, so no real person's name or avatar ends up in the docs |
| Group | `Documentation` — **public**, because a dataset can never be more open than its group, and an internal group greys out "Public" in the create-dataset dialog |

Shoot as `John`, never as your own account: the home screen, the user menu and the "Your datasets"
panel all show whoever is logged in.

**Except the Admin Settings page.** `John` is not an instance admin — its user menu has no "Admin
settings" entry and `/_admin` does not resolve for it — so those screenshots have to be taken from a
real admin session. When you do, hide the whole user chip, not just the "New design" toggle, or a
real person's name ships with the image:

```css
[class*="_bottomSection_"] { visibility: hidden !important; }
```

Afterwards, log back in as `John` before shooting anything else.

### Seeded datasets

| Dataset | Why it exists |
|---|---|
| `Documentation/iris` | 5 graphs, 1,749 statements. Imported from production `Triply/iris`, so it matches the figures the prose quotes. |
| `Documentation/pokemon` | Graphs `data` (28,588) and `vocab` (185) = 28,773. Imported from production `academy/pokemon`. **`exporting-data/index.md` narrates these exact numbers**, so keep them in sync. |
| `Documentation/ld-browser-examples` | Purpose-built for the LD-Browser property shots. One resource carries `rdfs:label`, `rdfs:comment`, `foaf:depiction`, `geo:hasGeometry` and two types at once; separate resources carry `sdo:audio` and `sdo:contentUrl`. Media are stable Wikimedia Commons URLs. |
| `John/my-dataset` | Deliberately empty — it is what the "dataset with no data yet" figure illustrates. |

Datasets are imported by URL from production's public download endpoints, e.g.
`https://api.triplydb.com/datasets/academy/pokemon/download.trig.gz`.

## Conventions

- **Viewport `1280x800` at devicePixelRatio 2**, so a full-page shot is 2560×1600. The docs content
  column is at most ~900–1000 px, so that is a clean 2×.
- **Tall dialogs: raise the viewport to `1280x1200`, do not scroll.** A dialog that scrolls
  internally gets silently clipped by an element screenshot — the first attempt at the create-dataset
  dialog lost the Owner and Dataset name fields that way.
- **Element shots for dialogs and panes**, viewport shots for whole pages. Element shots come out at
  their own natural 2× size (e.g. 1800×1840); that is fine and expected.
- **Light mode**, default zoom, no browser chrome in frame.
- **No borders or shadows baked in.** `docs/css/triply.css` already draws a 1px border and a radius
  around every non-SVG image in the content area.
- **Keep the filename.** Replacing the bytes under the existing name means no Markdown has to change;
  `git status` should show only modifications under `docs/assets/`.

## Before every capture

Run this in the page. It survives SPA route changes but **not** a full page load, so re-run it after
every navigation and before every dialog shot.

```js
() => {
  // Browser spell-check underlines are a capture artifact. Every element, not just
  // inputs: code editors re-render and bring their own.
  document.querySelectorAll('*').forEach(e => { if ('spellcheck' in e) e.spellcheck = false; });

  const ID = 'docs-capture-style';
  document.getElementById(ID)?.remove();
  const s = document.createElement('style');
  s.id = ID;
  s.textContent = `
    /* The transitional "New design / Switch off for classic view" toggle must not
       appear in published docs. Its sibling (the user menu) has to stay visible. */
    [class*="_bottomSection_"] > div:first-child { display: none !important; }
  `;
  document.head.appendChild(s);
  return !!document.getElementById(ID);
}
```

### Annotation boxes

Some older screenshots had red boxes drawn on by hand, and the un-annotated originals were deleted in
the same commit. Draw them at capture time instead — reproducible, pixel-aligned, no image editor:

```js
(selector) => {
  const el = document.querySelector(selector);
  el.style.outline = '3px solid #e5006d';
  el.style.outlineOffset = '2px';
  el.style.borderRadius = '4px';
}
```

## Traps

- **Filter any instance-wide picker before shooting it.** The "Import from a dataset" dropdown lists
  every dataset on the instance — colleagues' personal accounts and customer data included. Type a
  filter term so only `Documentation / …` is visible.
- **`Page.captureScreenshot` times out when the target tab is not in the foreground.** This looks
  like a hang and blocks for two minutes. Select the tab first. It is not an animation problem —
  freezing CSS animations does not help.
- **Not every red squiggle is spell-check.** In the import-error excerpt the wavy underline is the
  editor's own syntax-error marker and should stay. In a plain URL field it is the browser's, and
  should go.
- **When lifting an icon out of a control, check which `<svg>` you grabbed, then open the file and
  look at it.** Each access-level option contains two: the MUI radio indicator first, and the actual
  glyph under `[class*="_cardIcon_"]`. Taking the first one silently produced three identical empty
  circles for private/internal/public, which shipped before anyone noticed.
- **A visualization missing from the SPARQL IDE has not necessarily been removed.** LD-Frame is
  hidden there on purpose — `hiddenVisualizations = ["LDFrame"]` in
  `containers/SparqlIde/SparqlQuery.tsx` — and is offered on saved-query pages instead, where it
  appears only for CONSTRUCT queries (`isConstructResponse`).
- **A native OS file dialog cannot be captured at all.** The "add data from files" figure used to be
  a Windows file picker; it is now the console's own drop-zone pane, which also happens to match the
  prose better.
- **Setting a field's value is not the same as changing it.** Typing into the console's description
  editors through automation can leave the text on screen while React never registers the change —
  the Save button stays disabled and the value is silently dropped on submit. This ate a dataset
  description twice before it was noticed. Set the value through the native setter and then fire
  `input`, `change` **and** `blur`, all bubbling; the Save button going from disabled to enabled is
  the signal that it took. Always confirm against the API afterwards, e.g.
  `curl -s https://api.demo.triplydb.com/datasets/Documentation/pokemon`.
- **Scripted `.click()` inside an injected script is blocked** by the agent permission layer. Use the
  browser tool's own click. Reading and patching DOM attributes is fine.

## Images that are not console screenshots

Leave these alone — they are not part of a console refresh: `extract.png` (OS archive dialog),
`slack-widget.png`, `html-schema.png`, `html-plain.png`, `html-rendered.png`, `ClassDiagram.png`,
`docs/triply-db-on-premise/architecture.png`, `triply-logo.svg`, and everything under `blog/`
(that tree is outside `docs/` and absent from the `mkdocs.yml` nav, so it is not built).

About 17 files in `docs/assets/` are orphans — present on disk, referenced by nothing. Do not spend
time re-shooting them. `--strict` does not flag them, so they have to be found by hand.

## Checking the result

```bash
uvx --with mkdocs-mermaid2-plugin --with mkdocs-redirects --with properdocs-theme-readthedocs \
  properdocs build -f mkdocs.yml --strict
```

`--strict` catches broken *links*, not images, and it does **not** validate the raw `<img src>` tags
used by the `<figure>`-style pages (`uploading-data`, `publishing-data`, `access-control`) — those
pass through MkDocs untouched and only work because those pages sit exactly two levels deep. Check
them by eye.

Raster images are tracked with **git LFS**, so every replacement adds a new object. Run new files
through `oxipng`/`pngquant` before committing; the repo has no optimisation step of its own.
