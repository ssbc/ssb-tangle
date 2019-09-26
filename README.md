# ssb-thread-tangle

> WIP - this is not yet production ready, it's an active exploration

TODO: 
- [x] build raw graph from collection of messages
- [x] build a lookup for node keys > full node data
- [ ] prune graph
  - [x] find dangling nodes
  - [ ] find nodes which break "always extend thread" rule
  - [ ] find nodes which break "merge hydras" rule (particpating on branchs)
  - [ ] find invalid merges
  - [x] function for pruning graph given invalid nodes (and all downstream nodes)

Questions:
- should 

