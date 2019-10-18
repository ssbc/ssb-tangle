module.exports = function IsConflict (composition) {
  return function (heads) {
    // heads = an Array of Transformations you're considering merging
    //         each entry is the accumulated Transformation of each tip of a graph

    return Object.entries(composition).some(([field, strategy]) => {
      return strategy.isConflict(heads)
    })
  }
}

// TODO write tests
