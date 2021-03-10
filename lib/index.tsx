import React, { Suspense } from 'react';

export default function LazyFactory<Props extends {}>(
  C: (p: Props) => Promise<JSX.Element | void>,
): (p: Props & { fallback?: React.ReactNode }) => JSX.Element {
  return (p: Props & { fallback?: React.ReactNode }) => {
    const Component = React.lazy(() => new Promise<{ default: React.ComponentType<{}> }>(
      // TODO [FUTURE]: Resolve this
      // eslint-disable-next-line no-async-promise-executor
      async (resolve, reject) => {
        try {
          const Resolved = await C(p);
          // Checking to make sure output is not void
          if (Resolved) {
            resolve({ default: () => Resolved });
          }
          reject('Resolved to falsy value');
        } catch (e) {
          reject(e);
        }
      },
    ));
    return (
      <Suspense fallback={p.fallback ?? ''}>
        <Component />
      </Suspense>
    );
  };
}
