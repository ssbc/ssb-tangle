# ssb-tangle

This is a collection of tools for processing thread-like tangles in scuttlebutt.
This pattern is a way to causally order messages, which is hard in a p2p system, because there is no central source of truth (like a single database which tracks when messages were created)

The simple solution is for each message to reference the messages that happened before it in the thread.

```
   A     (the root message)
  / \
 B   C   (two concurrent replies)
  \ /
   D     (a message merging those two contexts together)
   |
   E     (the current end-point of the thread)
```

e.g. the messages before `E` were : `[A, B, C, D]`

This would get out of hand pretty quickly as threads get longer, so instead we record just the message(s) immediately prior to the one we're posting. e.g.
- `A` - no previous messages : null
- `B` - previous messages: `[A]` (B didn't know about C at the time)
- `C` - previous messages: `[A]` (C didn't know about B at the time)
- `D` - previous messages: `[B, C]`
- `E` - previous messages: `[D]`

We call these links back to previous messages "backlinks", and they allow us to construct a graph like the one above of where messages were relative to on another in time.

e.g. we know the messages before `E` because we can walk up along the backlinks 
```
E > D > B > A
      > C > A
```

This pattern was first used in thread-conversations, but it's much more widely applicable - e.g. changes to a gathering (when is it, who's attending), chess moves, etc.

This library formalises some of the ideas by thinking about each message in a thread-tangle as a "transformation" - a signal to change the state somehow, where that means "what a reply on" or "move Knight to C5"

The formalisation is through defining **strategies** which specify things like how to combine a series of messages (transformations), and how to determine iif a merging-message is valid.

## API

### strategy/compose

```
const Compose = require('ssb-tangle/strategy/compose')
const Overwrite = require('ssb-tangle/strategy/overwrite')
const Set = require('ssb-tangle/strategy/simple-set')

const compostion = {
  preferredName: Overwrite(),
  altNames: Set()
}

const strategy = Compose(compostion)

const T1 = {
  preferredName: { set: 'andromeda' }
  altnames: { ziva: 1, goomba: 0 }
}

strategy.reify(T1)
// => { 
//   preferredName: 'andromeda',
//   altNames: ['ziva'],
// }
strategy.concat(T1, T2)
strategy.pureTransformation(T2)
```

`Compose` takes an Object which maps field names to a strategy for that field, and returns a higher-order strategy.

Functions attached to this strategy are:
- `reify(T) => realState`
  - takes a transformation and maps it into a useable real state
  - this is useful because some strategy like "simple-set" have transformations with a somewhat abstract state to access some nice conflict-avoidant properties
  - _"reify" means "to make something abstract into something material/ concrete"_
- `concat(T1, T2) => T3`
  - combine two transformations (NOTE: order matters) and produce a third one

- `pureTransformation(obj) => T`
  - takes an Object and produces a transformations from it
  - leaves off any friends which aren't mentioned in the strategy
  - any fields from the strategy not represented in `obj` get filled with the "identity element" that field (a noop transformation)

### graph-tools/reduce

```js
reduce(entryNode, otherNodes, strategy, opts)
// => headState
```

where
- `entryNode` *Object* is a the first node at the start of your tangle
- `otherNodes` *Array* is a list of other nodes (in the same format as `entryNode`) which may be part of the tangle
- `strategy` is a something derived from `strategy/compose`
- `opts` *Object* (optional) allows you to provide further options for how to reduce:
  - `getThread` *Function* for mapping the a given node to it's "thread info" about position in the tangle. Takes `node` and is expected to return `{ root: Key, previous: [Key] }`
  - `getTransformation` *Function* for mapping a given node to the part containing the Transformation. Takes `node` and expected to return `T` (an Object)

```js
const reduce = require('ssb-tangle/graph-tools/reduce')

// say we have 3 messages posted one after another like this:
//    A   (the root message)
//    |
//    B
//    |
//    C

const A = {
  key: '%A...',
  value: {
    content: {
      preferredName: { set: 'ziva' }
      tangles: {
        profile { root: null , previous: null }
      }
    }
  }
}

const B = {
  key: '%B...',
  value: {
    content: {
      preferredName: { set: 'Ziva!' },
      altNames: { goomba: 1 }
      tangles: {
        profile { root: '%A...' , previous: ['%A...'] }
      }
    }
  }
}

const C = {
  key: '%C...',
  value: {
    content: {
      altNames: { goomba: -1, andromeda: 1 }
      tangles: {
        profile { root: '%A...' , previous: ['%B...'] }
      }
    }
  }
}

const strategy = // the strategy we composed in the last method say

reduce(A, [B, C], strategy, {
  getThread: m => m.value.content.tangles.profile,
  getTransformation: m.value.content
})
// =>
// {
//   '%C...: {
//     preferredName: { set: 'ziva' },
//     altNames: { andromeda: 1 }
//   }
// }
```

`reduce` gives you the output of walking the tangle so far. It's important to know there might be multiple outputs (because the thread can diverge if people post online concurrently).
This is why the return value is an Object which maps keys (representing the different end-points/ tips of the graph histroy) to what the cumulative transform to that point.

You can take any of the cumulative transforms so far and use `strategy.reify` on it to see what the transform mapped into a user-facing state would be.

### graph-tools/get-heads

Useful for calculating the keys of the current leading heads of your tangle.
Mainly used to calculate `previous` when publishing new tangle messages.

Note this is just a thin wrapper over `reduce`, and if you already have the output of that (because you've calculated the transformation state) you should probably use that instead.

```js
reduce(entryNode, otherNodes, opts)
// => headState
```

where
- `entryNode` *Object* is a the first node at the start of your tangle
- `otherNodes` *Array* is a list of other nodes (in the same format as `entryNode`) which may be part of the tangle
- `opts` *Object* (optional) allows you to provide further options for how to reduce:
  - `getThread` *Function* for mapping the a given node to it's "thread info" about position in the tangle. Takes `node` and is expected to return `{ root: Key, previous: [Key] }`
  - `getTransformation` *Function* for mapping a given node to the part containing the Transformation. Takes `node` and expected to return `T` (an Object)
  - `strategy` is a something derived from `strategy/compose` (this may be needed later to decide whether to include nodes in head calculation)

## Development

> WIP - not all aspects of this are production ready yet

TODO: 
- [x] build a "graph" primitive with a range of helper methods on it
  - [ ] prune graph
    - [x] find dangling nodes
    - [x] find nodes which break "always extend thread" rule
      - (first pass done which catches worst cases)
      - now calling this "catching time travellers"
    - [ ] find nodes which break "merge hydras" rule (particpating on branchs)
      - _UPDATE: turns our this is a corollary of "always extend thread" rule and quite hard to code an algorithm for, the partial solution in the always-extend case protects us from some of these messages though. It's particularly weak in the case that there are longer diverging branches before a merge_
    - [x] function for pruning graph given invalid nodes (and all downstream nodes)
- [x] graph reduce (simple)
  - [x] build atomic strategies
    - [x] an Overwrite strategy
    - [x] a Set based strategy
  - [x] write a "Compose" function which converts a collection of strategies into a higher-order strategy
    - [x] Concat
    - [x] Reify
  - [x] walk the graph and reduce to one 1 or more reduce multiple final states
- [x] merging graph reduce
  - [ ] write a "compose" function which converts a collection of strategies into a higher-order strategy
    - [ ] IsConflict (needs tests)
    - [ ] IsValidMerge (needs tests)
    - [ ] Merge
  - [ ] extend atomic strategies
    - [ ] Overwrite
    - [ ] Simple set
  - [ ] handle merges:
    - [ ] happy auto-merges
    - [ ] conflicts with well defined merge-messages
    - [ ] conflicts with invalid merge-message
  - [ ] walk the graph and reduce to one 1 or more reduce multiple final states
