#  Strategy

A strategy is a way of describing "transformations" and how to apply them to one another

A valid strategy is an Object which provides the following:
- `isTransformation` *Function* - takes a transformation and tells you whether it is a valid for this strategy
- `reify` *Function* - takes a transformation and maps it into a "real" state which can be used in e.g. human interfaces
- `concat` *Function* - takes two transformations `(a, b)` and concatenates (applies) `b` to `a`. Note order matters
- `identity` *Function* - an getter which return an element which represents the identity-transformation. 


... more to follow


## Requirements

Rules must:
- **have a unique `identity` element**
  ```js
  concat(identity(), a) === a
  concat(a, identity()) === a
  ```
- **be associative** 
  ```js
  concat(concat(a, b), c) === concat(a, concat(b, c))
  ```

An `identity` element is important because we need to be able to clearly communicate "I don't want to perform a change"

Associativity is important because in scuttlebutt we may have many contributions from different people across time, and being able to group chunks of transformations in a free-form way greatly increases our flexibility.
(e.g. it allows us to summarise a bunch of transformations and save that. this is something useful for writing merge messages)

_p.s. a Set which has an associative concat and an identity element is called a "monoid"_

BONUS:
- if your strategy is _commutative_, merging gets REALLY easy
  ```js
  concat(a, b) === concat(b, a)
  ```
