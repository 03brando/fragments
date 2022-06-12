// tests/memory.test.js

const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  listFragments,
  deleteFragment,
} = require('../src/model/data/memory/index');

describe('src/model/data/memory/index.js check', () => {
  const testFragment = {
    ownerId: '123',
    id: '1',
    fragment: 'test fragment',
  };

  const testFragment2 = {
    ownerId: '789',
    id: '2',
    fragment: 'test fragment2',
  };

  const testFragment3 = {
    ownerId: '123',
    id: '3',
    fragment: 'test fragment3',
  };

  test('writeFragment() returns nothing', async () => {
    const result = await writeFragment(testFragment);
    expect(result).toBe(undefined);
  });

  test('readFragment() returns what we writeFragment() into the db', async () => {
    await writeFragment(testFragment);
    const result = await readFragment(testFragment.ownerId, testFragment.id);
    expect(result).toEqual(testFragment);
  });

  test('readFragment() returns nothing with invalid ID', async () => {
    await writeFragment(testFragment2);
    //pass invalid ID
    const result = await readFragment(testFragment2.ownerId, '99');
    expect(result).toBe(undefined);
  });

  test('writeFragmentData() returns nothing', async () => {
    const result = await writeFragmentData(
      testFragment2.ownerId,
      testFragment2.id,
      testFragment2.fragment
    );
    expect(result).toBe(undefined);
  });

  test('readFragmentData() returns what we writeFragmentData() into the db', async () => {
    await writeFragmentData(testFragment.ownerId, testFragment.id, testFragment.fragment);
    const result = await readFragmentData(testFragment.ownerId, testFragment.id);
    expect(result).toEqual(testFragment.fragment);
  });

  test('readFragmentData() returns nothing with invalid ID', async () => {
    await writeFragmentData(testFragment.ownerId, testFragment.id, testFragment.fragment);
    //pass invalid id
    const result = await readFragmentData(testFragment.ownerId, '77');
    expect(result).toBe(undefined);
  });

  test('listFragments() returns array of fragments', async () => {
    //populate array with 3 fragments
    await writeFragment(testFragment);
    await writeFragmentData(testFragment.ownerId, testFragment.id, testFragment.fragment);

    //should not add testFragment2 to array!! (different ownerID)
    await writeFragment(testFragment2);
    await writeFragmentData(testFragment2.ownerId, testFragment2.id, testFragment2.fragment);

    await writeFragment(testFragment3);
    await writeFragmentData(testFragment3.ownerId, testFragment3.id, testFragment3.fragment);

    const testOwnerID = await listFragments('123');
    expect(Array.isArray(testOwnerID)).toBe(true);
    //should only have IDs 1 and 3 as those fragments have matching ownerIDs
    expect(testOwnerID).toEqual(['1', '3']);

    //add expanded listedFragments to variable
    const testArr = await listFragments('123', true);
    expect(Array.isArray(testArr)).toBe(true);

    //expect array to match testFragment and testFragment3
    expect(testArr).toEqual([
      { ownerId: '123', id: testFragment.id, fragment: testFragment.fragment },
      { ownerId: '123', id: testFragment3.id, fragment: testFragment3.fragment },
    ]);
  });

  test('deleteFragment() throws if there is no matching entry', async () => {
    expect(() => deleteFragment('775', '55')).rejects.toThrow();
  });

  test('deleteFragment() deletes fragments from memory db', async () => {
    //add fragments data and metedata
    await writeFragment(testFragment);
    await writeFragmentData(testFragment.ownerId, testFragment.id, testFragment.fragment);

    await writeFragment(testFragment2);
    await writeFragmentData(testFragment2.ownerId, testFragment2.id, testFragment2.fragment);

    await writeFragment(testFragment3);
    await writeFragmentData(testFragment3.ownerId, testFragment3.id, testFragment3.fragment);

    //delete fragments data and metedata
    await deleteFragment(testFragment.ownerId, testFragment.id);
    expect(await readFragment(testFragment.ownerId, testFragment.id)).toBe(undefined);
    expect(await readFragmentData(testFragment.ownerId, testFragment.id)).toBe(undefined);

    await deleteFragment(testFragment2.ownerId, testFragment2.id);
    expect(await readFragment(testFragment2.ownerId, testFragment2.id)).toBe(undefined);
    expect(await readFragmentData(testFragment2.ownerId, testFragment2.id)).toBe(undefined);

    await deleteFragment(testFragment3.ownerId, testFragment3.id);
    expect(await readFragment(testFragment3.ownerId, testFragment3.id)).toBe(undefined);
    expect(await readFragmentData(testFragment3.ownerId, testFragment3.id)).toBe(undefined);
  });
});
