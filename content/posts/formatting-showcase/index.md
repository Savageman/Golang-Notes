---
title: "Formatting Showcase: Every Element in blog.css"
date: 2026-04-10
author: "Julian Espérat"
tags: ["Showcase", "Formatting", "Go", "Design System", "Reference"]
summary: "A draft reference page demonstrating every visual element available in this blog template — headings, callouts, code blocks, lists, figures, inline code, and more."
draft: true
---

<div class="section" id="intro">

This page exists to show **every formatting option** available in the blog
template. Use it as a reference when writing new posts. It covers
[inline links](#), *italic text*, **bold text**, and `inline code` — all
in the opening paragraph so the **drop cap** renders on the first letter.

A second paragraph in the intro demonstrates that normal body text flows
at `1.05rem` with a line-height of `1.75`. You can mix in references to
things like the `--forest` CSS variable or a function call like
`ring.Get(key)` without breaking the reading rhythm.

</div>

<div class="section" id="headings-and-text">
<h2><a href="#headings-and-text" class="anchor">Headings, text, and <code>inline code</code> in titles</a></h2>

This is an `h2` section heading. The anchor link icon appears on hover
and clicking it highlights the section background in sage. Headings can
contain `inline code` as shown above.

### Subtitles use `h3`

Subtitles are rendered as small-caps uppercase labels. They group related
content within a section and participate in the scroll-reveal animation
independently.

### Another subtitle for comparison

This second subtitle demonstrates vertical spacing between consecutive
`h3` groups. Each subtitle and its following content are wrapped into a
`.subsection` by JavaScript at page load.

</div>

<div class="section" id="inline-formatting">
<h2><a href="#inline-formatting" class="anchor">Inline formatting</a></h2>

Standard Markdown inline formatting works as expected:

- **Bold text** uses `<strong>` and renders in `--charcoal`.
- *Italic text* uses `<em>`, also in `--charcoal`.
- `Inline code` gets a pill-shaped background with `--ivory` fill and `--sand` border.
- [Links](#) are `--forest` coloured with a `--sage` underline that transitions on hover.
- Combining them: **a bold [link with `code`](#) inside *italic* text**.

</div>

<div class="section" id="lists">
<h2><a href="#lists" class="anchor">Lists</a></h2>

### Unordered list

- First item with some body text to show line wrapping behaviour across
  multiple lines in the rendered output.
- Second item with `inline code` and a [link](#).
- Third item with **bold** and *italic* formatting.

### Ordered list

1. Deploy the sidecar with reporting **enabled** but routing **disabled**.
2. Enable for *internal* traffic only (roughly 15% of load).
3. Ramp external traffic from 5% to 100% over 48 hours.
4. Remove the legacy code path after one full week of stability.

</div>

<div class="section" id="code-blocks">
<h2><a href="#code-blocks" class="anchor">Code blocks</a></h2>

Fenced code blocks get Chroma syntax highlighting, a language badge in the
top-left corner, and a copy button in the top-right.

```go
// Package ring implements bounded-load consistent hashing.
package ring

import (
	"hash/crc32"
	"sort"
	"sync"
)

// Ring distributes keys across nodes with a load ceiling.
type Ring struct {
	mu       sync.RWMutex
	nodes    []Node
	vnodes   int
	epsilon  float64
	hashFn   func([]byte) uint32
}

// Get returns the least-loaded node for the given key.
func (r *Ring) Get(key string) (Node, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if len(r.nodes) == 0 {
		return Node{}, ErrEmptyRing
	}

	hash := r.hashFn([]byte(key))
	idx := sort.Search(len(r.nodes), func(i int) bool {
		return r.nodes[i].hash >= hash
	}) % len(r.nodes)

	for i := 0; i < len(r.nodes); i++ {
		node := r.nodes[(idx+i)%len(r.nodes)]
		if node.Load() < r.maxLoad() {
			return node, nil
		}
	}
	return r.nodes[idx], nil // fallback
}

func (r *Ring) maxLoad() float64 {
	avg := float64(r.totalLoad()) / float64(len(r.nodes))
	return avg * (1.0 + r.epsilon)
}
```

A short snippet to show minimal code blocks:

```go {hl_lines=[1]}
func ListenAndServe(addr string, handler Handler) error
```

Highlighted lines draw attention to new or important code — use `hl_lines` in the fence attributes:

```go {hl_lines=[3,5,"7-9"]}
func (r *Ring) Get(key string) (Node, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()           // highlighted

	hash := r.hashFn([]byte(key))  // highlighted
	idx := sort.Search(len(r.nodes), func(i int) bool {
		return r.nodes[i].hash >= hash  // highlighted
	}) % len(r.nodes)                   // range
	return r.nodes[idx], nil
}
```

</div>

<div class="section" id="callouts">
<h2><a href="#callouts" class="anchor">Callouts</a></h2>

Six callout types are available via the `callout` shortcode. Each has a
coloured left border stripe, optional title, body, and optional footer.

### Quote

{{< callout type="quote" footer="— Grace Hopper" >}}
"The most dangerous phrase in the language is: we've always done it this way."
{{< /callout >}}

### Informational

{{< callout type="info" title="Further reading" footer="— Documentation team" >}}
The bounded-load algorithm is described in
[Consistent Hashing with Bounded Loads](#) (Mirrokni et al., 2017).
The `maxLoad` ceiling is `(1 + ε) × average` — see *Theorem 3.2*.
{{< /callout >}}

### Warning

{{< callout type="warning" title="Caveat" footer="— Platform Engineering" >}}
Setting `ε` below `0.1` causes cascading spillover under burst traffic.
Nodes reject keys faster than [gossip](#) can propagate load state.
{{< /callout >}}

### Success

{{< callout type="success" title="Milestone" footer="— SRE weekly report" >}}
Zero sessions lost during node changes — `redirect_miss` stayed below
**0.02%**. See the [dashboard](#) for live metrics.
{{< /callout >}}

### Error

{{< callout type="error" title="Known issue" footer="— Filed as INFRA-4821" >}}
Gossip protocol `v1.2` has a [race condition](#) on simultaneous node
joins. Upgrade to **v1.3+** before enabling auto-scaling.
{{< /callout >}}

### Note

{{< callout type="note" title="Editor's note" footer="— Editorial team" >}}
Some metric values like `max_load_factor` have been *rounded for clarity*.
This article was adapted from an internal [post-mortem](#).
{{< /callout >}}

</div>

<div class="section" id="images">
<h2><a href="#images" class="anchor">Images and figures</a></h2>

Use a `<figure>` with the `article-figure` class for captioned images.
The image spans the full content width and the caption is styled as a
small sans-serif label.

<figure class="article-figure">
  <img src="https://placehold.co/1000x300/D5DFC9/2C4A3E?text=Figure+Placeholder" alt="Example figure showing a placeholder image">
  <figcaption>
    Fig. 1 — A placeholder figure demonstrating the article-figure layout
    with a full-width image and a styled caption below.
  </figcaption>
</figure>

</div>

<div class="section" id="combined">
<h2><a href="#combined" class="anchor">Everything combined</a></h2>

This final section mixes elements to show how they flow together.

The `Ring.Get()` function performs a bounded-load lookup. When a node
exceeds its capacity ceiling of `(1 + ε) × average`, the algorithm
continues clockwise to the next node. There are three strategies for
sharing load state:

1. **Centralized table** — [etcd](#) or ZooKeeper holds counters.
2. **Gossip protocol** — peers exchange snapshots every *k* milliseconds.
3. **Power of two choices** — pick the lighter of two random candidates.

```go
if node.Load() < r.maxLoad() {
    return node, nil
}
```

{{< callout type="info" title="Tip" >}}
Use `hugo server -D` to preview draft posts locally. The `-D` flag
includes all content marked `draft: true` in frontmatter.
{{< /callout >}}

After choosing gossip, our **p99 latency** dropped from `38ms` to `11ms`.
The redirect rate settled at *0.02%* — well within the SLA. For the full
implementation, see the [source code](#) and the
[design document](#).

</div>
