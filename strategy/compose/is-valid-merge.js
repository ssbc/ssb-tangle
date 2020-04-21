// WIP
// TODO - write tests for all these functions
// function isValidMerge (composition) {
//   return function (heads, merge) {
//     // heads = an Array of Transformations you're considering merging
//     // merge = a Transformation which is proposed to merge the heads together

//     return Object.entries(composition).every(([field, strategy]) => {
//       const headsTs = heads.map(head => head[field] || strategy.identity())
//       const mergeT = merge[field] || strategy.identity()

//       if (composition.isConflict(headsTs)) return mergeT !== composition.identity()
//       // if there's a conflict, the resolving merge Transformation (mergeT)
//       // must resolve the conflict (i.e. cannot be the identtiy Transformation)

//       return true
//     })
//   }
// }

// TODO
// function isValidTransformation (composition) {
