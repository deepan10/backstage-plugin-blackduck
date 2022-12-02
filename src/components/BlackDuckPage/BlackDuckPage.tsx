import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableColumn,
  Progress,
  EmptyState,
  MissingAnnotationEmptyState,
} from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import LaunchSharp from '@material-ui/icons/LaunchSharp';
import { useApi } from '@backstage/core-plugin-api';
import { Link } from '@backstage/core-components';

import { Chip } from '@material-ui/core';
import { useEntity } from '@backstage/plugin-catalog-react';

import { blackduckApiRef } from '../../api';
import {
  getProjectAnnotation,
  BLACKDUCK_PROJECT_ANNOTATION,
  isBlackDuckAvailable
} from '../../utils/commonUtil';

const useStyles = makeStyles(theme => ({
  chipLabel: {
    color: theme.palette.common.white,
  },
  chipHigh: {
    margin: 0,
    backgroundColor: '#5a100c',
  },
  chipCritical: {
    margin: 0,
    backgroundColor: '#9c251f',
  },
  chipMedium: {
    margin: 0,
    backgroundColor: '#e78c87',
  },
  chipLow: {
    backgroundColor: theme.palette.grey[500],
  },
  chipNone: {
    backgroundColor: theme.palette.grey[300],
  },
}));

type DenseTableProps = {
  vulnList: any[];
};

export const DenseTable = ({ vulnList }: DenseTableProps) => {
  const classes = useStyles();

  const columns: TableColumn[] = [
    { title: 'Component Name', field: 'componentName' },
    { title: 'Component Version', field: 'componentVersionName' },
    { title: 'Vulnerability Name', field: 'vulnerabilityName' },
    { title: 'Severity', field: 'severity' },
    { title: 'Link', field: 'link' },
  ];

  const data = vulnList.map(item => {
    let gateColor;

    switch (item.vulnerabilityWithRemediation.severity) {
      case 'CRITICAL': {
        gateColor = classes.chipCritical;
        break;
      }
      case 'HIGH': {
        gateColor = classes.chipHigh;
        break;
      }
      case 'MEDIUM': {
        gateColor = classes.chipMedium;
        break;
      }
      case 'LOW': {
        gateColor = classes.chipLow;
        break;
      }
      default: {
        gateColor = classes.chipNone;
        break;
      }
    }

    return {
      componentName: item.componentName,
      componentVersionName: item.componentVersionName,
      vulnerabilityName: item.vulnerabilityWithRemediation.vulnerabilityName,
      severity: (
        <Chip
          label={item.vulnerabilityWithRemediation.severity}
          classes={{ root: gateColor, label: classes.chipLabel }}
        />
      ),
      link: (
        <Link to={item.componentVersion}>
          {' '}
          <LaunchSharp />{' '}
        </Link>
      ),
    };
  });

  return (
    <Table
      title="Vulnerabilities"
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

type PageContentProps = {
  projectName: string;
  projectVersion: string
};

export const PageContent = ({projectName, projectVersion}: PageContentProps) => {
  const blackduckApi = useApi(blackduckApiRef);
  const { value, loading, error } = useAsync(async () => {
    const data: any = await blackduckApi.getVulns(projectName, projectVersion);
    return data;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (!value) {
    return (
      <EmptyState
        missing="info"
        title="No information to display"
        description={`There is no BlackDuck Project ${projectName} with version ${projectVersion} available!`}
      />
    );
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return <DenseTable vulnList={value.items || []} />;
}

export const BlackDuckPageComponent = () => {
  const { entity } = useEntity();  
  const { projectName, projectVersion } = getProjectAnnotation(entity);  
  return isBlackDuckAvailable(entity) ? (
    <PageContent 
      projectName={projectName}
      projectVersion={projectVersion}
    />) : <MissingAnnotationEmptyState annotation={BLACKDUCK_PROJECT_ANNOTATION} />;
};
