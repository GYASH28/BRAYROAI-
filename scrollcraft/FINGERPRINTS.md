# Fingerprints

Every site you build with **scrollcraft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| brayroai-signal-fold | Split stage | Fixed compact top controls + responsive chapter rail + moving seam | Divided practical-light installation with split wordmark | pin > flow > pin/pointer > flow > scrub > flow > pin; 7 acts; 11.9vh desktop | Divider exits to edge; trace resolves into wordmark; one underlined email CTA | Persistent signal trace stamps every chapter and assembles BRAYROAI at the final resolve | Photographic architectural studio; glass, paper, cobalt and signal orange | 4500 |
| brayroai-directors-cut | Rhythmic cutlist | Loud floating glass broadcast bar with active cut, timecode and progress | Reconstructed founder hero, monochrome until a live colour matte is directed or locked | 13 hard flow/reveal cuts; no pin; no dwell; 12.5vh desktop | Abrupt cobalt commercial end card with outlined wordmark field and one underlined CTA | Director's colour matte follows the pointer, reveals the original grade and can be locked with a changed hero statement | Monochrome fashion campaign, signal-orange/cobalt broadcast graphics, glass and neumorphic production surfaces | 4500 |
| brayroai-proof-mark | Editorial proof gallery | Original compact masthead with chapter index | Preserved founder portrait, monochrome colour toggle and opening light sweep | pin > horizontal pan > three decision spreads > pin assembly > founder > offers > contact; 7 chapters | Direct contact chapter followed by oversized orange editorial footer and route archive | The original hand-drawn arrow draws the visitor through real project crops that assemble into a finished screen | Warm paper, monochrome founder photography, real project interfaces and vermilion ink | 4173 |

| brayroai-material-intelligence | Material gallery / catalog | Indexed studio masthead, object links and full route archive | Unequal elliptical anodised core with grouped chrome/ceramic collars and live light | Studio flow >2.7vh pinned client exhibit > lateral capability collection > React practice > photographic person > scope ledger > inquiry; approximately10.2vh | Cobalt inquiry plate, dark material colophon and full route archive | A range, pointer and scroll unfold the collars; a reflected light field follows the object | Owner tile identity, ink/bone grounds, amber/cobalt light, original material photographs, actual client screens and founder photography |5180 |

---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- **brayroai-signal-fold** takes the split-stage grammar, a moving architectural seam, the seven-act 11.9vh band, the trace-to-wordmark resolution, and the persistent proof-signal signature. A later build should not reuse this combination.
- **brayroai-directors-cut** takes the rhythmic commercial cutlist, the floating broadcast-timecode chrome, the thirteen-cut 12.5vh band, the abrupt cobalt end card, and the live director's colour-matte signature. It shares only BRAYROAI's real brand assets and project proof with Signal Fold.
- **brayroai-proof-mark** takes the editorial proof-gallery grammar, the horizontal project pan, the hand-drawn arrow assembling real work, and the orange archive footer. It shares the original founder hero and its colour toggle with earlier BRAYROAI work, but uses a different chapter rhythm and close.

- **brayroai-material-intelligence** takes the openable unequal material sculpture, grouped collars, studio object index and inquiry/colophon close. It retains the owner brand, arrow as a link mark, real project evidence and founder assets. Fingerprint differences:6/6 against Signal Fold,6/6 against Director's Cut,5/6 against Proof Mark. First shipped to main and canonical Vercel on1 October2026 (25e6b2f).

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scrollcraft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
