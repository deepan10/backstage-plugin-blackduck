import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { blackduckPlugin, BlackduckPage } from '../src/plugin';

createDevApp()
  .registerPlugin(blackduckPlugin)
  .addPage({
    element: <BlackduckPage />,
    title: 'Root Page',
    path: '/blackduck'
  })
  .render();
