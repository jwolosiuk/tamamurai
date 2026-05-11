# tamamurai

A minimalist pixel-art samurai tamagotchi. He meditates most of the day. Sometimes he eats, sleeps, trains. Observe, don't manage.

## Running

Open `index.html` in a browser. That's it — no build, no dependencies.

```
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

Or drop the directory onto GitHub Pages / Cloudflare Pages.

## Philosophy

A classic tamagotchi is chaotic — it demands constant attention. This one is the opposite: a daily rhythm, one decision every 15 minutes, the samurai chooses what to do based on the time of day and his own needs.

- **22:00–06:00** — sleeps (energy regenerates).
- **06:30–07:00** — morning training.
- **hunger > 75** — eats a bowl of rice.
- **the rest of the day** — meditates.

The three buttons (Feed / Train / Rest) are nudges, not control — the samurai will refuse if the situation doesn't fit.

## State

Saved in `localStorage` under the key `tamamurai.state`. The state persists between sessions — when you come back, the samurai catches up on the missed 15-minute slots (capped at ~2 weeks).

## Debug / reset

In the DevTools console:

```js
tamamurai.state          // current state
tamamurai.forceTick()    // force a tick now
tamamurai.rewind(8)      // rewind lastDecisionAt by 8h and reload (catch-up test)
tamamurai.reset()        // clear localStorage and reload
```

## Structure

- `index.html` — markup
- `style.css` — styling (palette inspired by woodblock prints: cream paper, ink, vermilion)
- `main.js` — state machine + sprite data + render

Sprites are 16×16 ASCII grids encoded in `main.js`. Easy to edit — palette in `PALETTE`, sprites in `SPRITES`.

## Out of scope (deliberately)

- Multi-tamagotchi / peer-to-peer.
- LLM-generated thoughts (the saying pool is static).
- Backend / cross-device sync.
- Build pipeline.
