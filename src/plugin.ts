import {
  createApiFactory,
  createPlugin,
  discoveryApiRef,
  identityApiRef,
  createRoutableExtension
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

import { blackduckApiRef, BlackDuckClient } from './api';

export const blackduckPlugin = createPlugin({
  id: 'blackduck',
  apis: [
    createApiFactory({
      api: blackduckApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef,
      },
      factory: ({ discoveryApi, identityApi }) =>
        new BlackDuckClient({
          discoveryApi,
          identityApi,
        }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const BlackDuckPage = blackduckPlugin.provide(
  createRoutableExtension({
    name: 'BlackDuckPage',
    component: () =>
      import('./components/BlackDuckPage').then(m => m.BlackDuckPageComponent),
    mountPoint: rootRouteRef,
  }),
);

export const BlackDuckCard = blackduckPlugin.provide(
  createRoutableExtension({
    name: 'BlackDuckCard',
    component: () =>
      import('./components/BlackDuckCard').then(m => m.BlackDuckCardComponent),
    mountPoint: rootRouteRef,
  }),
);

export const RiskCard = blackduckPlugin.provide(
  createRoutableExtension({
    name: 'RiskCard',
    component: () =>
      import('./components/BlackDuckCard').then(m => m.RiskCardComponent),
    mountPoint: rootRouteRef,
  }),
);
