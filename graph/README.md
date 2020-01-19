All of these graph methods assume you're passing in nodes of the form:

```
{
  key: NodeId,          // a property which uniquely identifies this node - it's "nodeId"
  thread: {
    root: NodeId,       // the id of he first message in this tangle
    previous: [NodeId]  // Array of most recent (valid) nodes we're extending from
  },
  ...                   // other properties encoding your transformation
}
```

In scuttlebutt the NodeIds are the hash addresses of the messages


The `graph-tools/reduce` method optionally lets you pass in methods to change how this methods read each node:
- `opts.getThread` *Function* - which takes a `node` and is expected to return `{ root, previous }`
- `opts.getTransformation` *Function* - which takes a `node` and returns `T` an Object containing the properties as described by your strategy. Any extra properties in the object will be ignored
 
TODO - add a method like `getNodeId` which lets you point to a different property other than `node.key` for the unique identifier
