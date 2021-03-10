/* eslint-disable consistent-return */
import React from 'react';
import renderer from 'react-test-renderer';
import LazyFactory from '../lib';

const LazyTextDisplay = LazyFactory<{ text: Promise<string> | string }>(
  async ({ text }) => {
    const resolvedText = `${await text}`;
    return <>{resolvedText}</>;
  },
);

const LazyTextDisplayAllowedVoid = LazyFactory<{ text: Promise<string> | string }>(
  async ({ text }) => {
    const resolvedText = `${await text}`;
    if (resolvedText !== 'undefined') {
      return <>{resolvedText}</>;
    }
  },
);

const getTimeout = (time = 1000) => new Promise((res, rej) => {
  setTimeout(() => {
    res(undefined);
  }, time);
});

describe('Testing on LazyTextDisplay', () => {
  it('Should work on resolving promise (contains string after resolving)', async () => {
    const component = renderer.create(
      <LazyTextDisplay text={Promise.resolve('Foo')} />,
    );

    await getTimeout();

    renderer.act(() => {
      const treeAfter = component.toJSON();
      expect(treeAfter).toContain('Foo');
    });

    expect.hasAssertions();
  }, 5000);

  it('Should work on resolving promise (contains string after resolving)', async () => {
    const component = renderer.create(
      <LazyTextDisplayAllowedVoid text={Promise.resolve('Foo')} />,
    );

    await getTimeout();

    renderer.act(() => {
      const treeAfter = component.toJSON();
      expect(treeAfter).toContain('Foo');
    });

    expect.hasAssertions();
  }, 5000);

  it('Should work on resolving promise (contains string after resolving)', async () => {
    const component = renderer.create(
      <LazyTextDisplayAllowedVoid text={Promise.resolve('undefined')} />,
    );

    await getTimeout();

    renderer.act(() => {
      const treeAfter = component.toJSON();
      expect(treeAfter).not.toContain('undefined');
    });

    expect.hasAssertions();
  }, 5000);

  // TODO: Set up rejecting test case
  // it('Should work on rejecting promise', async () => {
  //   const component = renderer.create(
  //     <LazyTextDisplay text={(async () => {
  //       throw new Error('Rejecting');
  //     })()} />,
  //   );

  //   await getTimeout();

  //   renderer.act(() => {
  //     const treeAfter = component.toJSON();
  //     expect(treeAfter).toStrictEqual('');
  //   });

  //   expect.hasAssertions();
  // }, 5000);

  it('Should work on resolving promise (empty while resolving)', () => {
    const component = renderer.create(
      <LazyTextDisplay text={Promise.resolve('Foo')} />,
    );

    const tree = component.toJSON();
    expect(tree).toContain('');
  });

  it('Should work on resolving promise (empty while resolving)', () => {
    const component = renderer.create(
      <LazyTextDisplayAllowedVoid text={Promise.resolve('Foo')} />,
    );

    const tree = component.toJSON();
    expect(tree).toContain('');
  });
});
