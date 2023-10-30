import { createApiRef } from '@backstage/core-plugin-api';

/** @public */
export const blackduckApiRef = createApiRef<BlackDuckApi>({
  id: 'plugin.blackduck.service',
});

/** @public */
export interface BlackDuckApi {
  getVulns(projectName: string, projectVersion: string): Promise<any>;
};

export interface BlackDuckApi {
  getRiskProfile(projectName: string, projectVersion: string): Promise<any>;
};