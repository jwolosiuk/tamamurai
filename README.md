# tamamurai

Minimalistyczny pixel-art samuraj-tamagotchi. Większość dnia medytuje. Czasem je, śpi, trenuje. Obserwuj, nie zarządzaj.

## Uruchomienie

Otwórz `index.html` w przeglądarce. To wszystko — zero buildu, zero zależności.

```
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

Albo wrzuć katalog na GitHub Pages / Cloudflare Pages.

## Filozofia

Klasyczne tamagotchi jest chaotyczne — wymaga ciągłej uwagi. Ten jest odwrotnością: rytm dobowy, decyzja raz na 15 minut, samuraj sam wybiera co robi w zależności od pory dnia i swoich potrzeb.

- **22:00–06:00** — śpi (regeneruje energię).
- **06:30–07:00** — poranny trening.
- **głód > 75** — je miskę ryżu.
- **reszta dnia** — medytuje.

3 przyciski (Nakarm / Trening / Odpocznij) to nudge, nie kontrola — samuraj odmówi jeśli sytuacja nie pasuje.

## Stan

Zapisywany w `localStorage` pod kluczem `tamamurai.state`. Stan żyje dalej między sesjami — po powrocie samuraj nadrabia zaległe 15-minutowe sloty (max 2 tygodnie).

## Debug / reset

W DevTools console:

```js
tamamurai.state          // bieżący stan
tamamurai.forceTick()    // wymuś tick teraz
tamamurai.rewind(8)      // cofnij lastDecisionAt o 8h i przeładuj (test catch-upu)
tamamurai.reset()        // wyczyść localStorage i przeładuj
```

## Struktura

- `index.html` — markup
- `style.css` — wygląd (paleta inspirowana drzeworytem: kremowe tło, tusz, cynober)
- `main.js` — state machine + sprite data + render

Sprite'y to ASCII grids 16×16 zakodowane w `main.js`. Łatwe do edycji — palette w `PALETTE`, sprite'y w `SPRITES`.

## Out of scope (świadomie)

- Multi-tamagotchi / peer-to-peer.
- LLM-generowane myśli (paleta fraz jest statyczna).
- Backend / sync między urządzeniami.
- Build pipeline.
