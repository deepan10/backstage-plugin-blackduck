import { Entity } from '@backstage/catalog-model';

export const BLACKDUCK_PROJECT_ANNOTATION = 'blackduck/project';

export const isBlackDuckAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[BLACKDUCK_PROJECT_ANNOTATION]);

export const getProjectAnnotation = (
  entity: Entity,
): {
  projectName: string;
  projectVersion: string;
} => {
  let projectName = undefined;
  let projectVersion = undefined;
  const annotation: any = entity?.metadata.annotations?.[BLACKDUCK_PROJECT_ANNOTATION];
  if (annotation) {
    [projectName, projectVersion] = annotation.split('/');
  }
  return { projectName, projectVersion };
};
