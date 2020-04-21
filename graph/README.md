# graph

This construction is a simple help which lets us take a set of nodes and traverse them. 

It assumes:
- a directed acyclic graph between the nodes (DAG)
- each node has a unique NodeId / key
- that you have an particular entry-point
- that each node is an Object of form:

  ```
  {
    key: NodeId,          // uniquely identifies this node - it's "nodeId"
    thread: {
      root: NodeId,       // the id of he first message in this tangle
      previous: [NodeId]  // Array of most recent (valid) nodes we're extending from
    },
    ...                   // other properties encoding your transformation
  }
  ```

The `thread.previous` property is integral to determining how the graph might be traversed.
Each of these constitutes a 'backlink' to a node(s) which came immediately prior to it.

## API

### `Graph(entryNode, otherNodes, opts) => graph`

where:
- `entryNode` *Object* - a singular Node from which to start from
- `otherNodes` *Array* - a collection of other nodes that might be reached from `entryNode`
- `opts` *Object* (optional) - a way to pass in functions to change defualt behaviour
  - `opts.getThread` *Function* - which takes a `node` and is expected to return `{ root, previous }`
  
### `graph.getNode(NodeId) => Node`

### `graph.getEntryNode() => Node`

### `graph.getLinks(NodeId) => [NodeId]`

Gets the ids of nodes which this node links to

### `graph.getReverseLinks(NodeId) => [NodeId]`

Gets the ids of nodes which linked to this node

### `graph.isBranchNode(NodeId) => Boolean`

Tells you if this is a node from which the tangle will diverge.

### `graph.isMergeNode(NodeId) => Boolean`

Tells you if this is a node which brings together two (or more) branches of the tangle.

### `graph.isHeadNode(NodeId) => Boolean`

Tells you if this node is at a terminus of the graph.
Node can be said to be a head / tip / leaf

### `graph.prune([NodeId]) => null`

Takess an array of nodes which you want to remove from the graph, and prunes them
**and all nodes downstream of those nodes**.

### `graph.getRaw() => { map, ReverseMap }`

Accesses objects which represent flat maps of the "forward links" and "reverse links" that
make up the graph.



