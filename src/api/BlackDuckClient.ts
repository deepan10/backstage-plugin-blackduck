import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { BlackDuckApi } from './BlackDuckApi';

export class BlackDuckClient implements BlackDuckApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;

  public constructor(options: {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
  }) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
  }

  public async getVulns(
    projectName: string,
    projectVersion: string,
  ): Promise<any> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('blackduck')}`;
    const vulnURL = `${baseUrl}/vulns/${projectName}/${projectVersion}`;
    const { token: idToken } = await this.identityApi.getCredentials();
    const response = await fetch(vulnURL, {
      headers: {
        'Content-Type': 'application/json',
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json();
  }

  public async getRiskProfile(
    projectName: string,
    projectVersion: string,
  ): Promise<any> {
    const baseUrl = `${await this.discoveryApi.getBaseUrl('blackduck')}`;
    const vulnURL = `${baseUrl}/risk-profile/${projectName}/${projectVersion}`;
    const { token: idToken } = await this.identityApi.getCredentials();
    const response = await fetch(vulnURL, {
      headers: {
        'Content-Type': 'application/json',
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json();
  }
  
}
