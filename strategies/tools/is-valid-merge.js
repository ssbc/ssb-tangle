// WIP
// TODO - write tests for all these functions
function isValidMerge (strategies) {
  return function (heads, merge) {
    // heads = an Array of Transformations you're considering merging
    // merge = a Transformation which is proposed to merge the heads together

    return Object.entries(strategies).every(([prop, strategy]) => {
      const headsTs = heads.map(head => head[prop] || strategy.identity)
      const mergeT = merge[prop] || strategy.identity

      if (strategy.isConflict(headsTs)) return mergeT !== strategy.identity
      // if there's a conflict, the resolving merge Transformation (mergeT)
      // must resolve the conflict (i.e. cannot be the identtiy Transformation)

      return true
    })
  }
}

// TODO
// function isValidTransformation (strategies) {
