# ssb-thread-tangle

> WIP - this is not yet production ready, it's an active exploration

TODO: 
- [x] build raw graph from collection of messages
- [x] build a lookup for node keys > full node data
- [ ] prune graph
  - [x] find dangling nodes
  - [x] find nodes which break "always extend thread" rule
    - (first pass done which catches worst cases)
    - now calling this "catching time travellers"
  - [] find nodes which break "merge hydras" rule (particpating on branchs)
    - (turns our this is a corollary of "always extend thread" rule and quite hard to code an algorithm for, the partial solution in the always-extend case protects us from some of these messages though. It's particularly weak in the case that there are longer diverging branches before a merge) 
  - [ ] find invalid merges
  - [x] function for pruning graph given invalid nodes (and all downstream nodes)
- [ ] walk the graph and derive a final state
  - [ ] reduce multiple final states for a 'hydra' graph
  - [x] build for the "SET" / overwrite-style merge strategy (message summarises what everything to this point reduces to)
  - [ ] build for hte "PATCH" style merge strategy (message summarises what the branched segment reduces to)
  - [ ] handle auto-merges
  - [ ] handle merging different properties (e.g. auto-merge on one prop, conflict on another)
  - [ ] make a function which takes the final monoid transformation and Acts with it to produce a "real-world" state
    - this is needed for the case that we are modeling "sets" - the transformation state isn't idempotent but the actualised state is.
