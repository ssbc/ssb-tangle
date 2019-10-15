All of these graph methods assume you're passing in nodes which have : 
- a `key` property which is unique
- a `thread` property which stores `first` (nodeId) and `previous` (Array of nodeIds)

In scuttlebutt the nodeIds are the hash addresses of the messages

You can an `opts` Object to some methods:
- `getThread` which takes a node and returns `{ first, previous }`
- `getTransformation` which extracts the Transformation Object from a node
- `getNodeId` TODO - currently this is just `node.key`

