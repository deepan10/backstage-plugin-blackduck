import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const blackduckPlugin = createPlugin({
  id: 'blackduck',
  routes: {
    root: rootRouteRef,
  },
});

export const BlackduckPage = blackduckPlugin.provide(
  createRoutableExtension({
    name: 'BlackduckPage',
    component: () =>
      import('./components/BlackDuckPage').then(m => m.BlackDuckPageComponent),
    mountPoint: rootRouteRef,
  }),
);

export const BlackduckCard = blackduckPlugin.provide(
  createRoutableExtension({
    name: 'BlackduckCard',
    component: () =>
      import('./components/BlackDuckCard').then(m => m.BlackDuckCardComponent),
    mountPoint: rootRouteRef,
  }),
);