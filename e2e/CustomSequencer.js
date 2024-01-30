const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  /**
   * Select tests for shard requested via --shard=shardIndex/shardCount
   * Sharding is applied before sorting
   */
  shard(tests, { shardIndex, shardCount }) {
    const shardSize = Math.ceil(tests.length / shardCount);
    const shardStart = shardSize * (shardIndex - 1);
    const shardEnd = shardSize * shardIndex;

    return [...tests]
      .sort((a, b) => (a.path > b.path ? 1 : -1))
      .slice(shardStart, shardEnd);
  }

  /**
   * Sort test to determine order of execution
   * Sorting is applied after sharding
   */
  sort(tests) {
    const copyTests = Array.from(tests);

    return copyTests.sort((testA, testB) => {
      // Extract numbers from the test file paths
      const matchA = testA.path.match(/\b(\d+)_/);
      const matchB = testB.path.match(/\b(\d+)_/);

      // Convert the extracted numbers to integers
      const orderA = matchA ? parseInt(matchA[1], 10) : 0;
      const orderB = matchB ? parseInt(matchB[1], 10) : 0;

      // Sort based on the extracted numbers
      return orderA - orderB;
    });
  }
}

module.exports = CustomSequencer;
