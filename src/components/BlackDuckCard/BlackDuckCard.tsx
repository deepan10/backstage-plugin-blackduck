import React from 'react';
import { blackduckApiRef } from '../../api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import {
  InfoCard,
  Progress,
  EmptyState,
  MissingAnnotationEmptyState,
} from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getProjectAnnotation, BLACKDUCK_PROJECT_ANNOTATION, isBlackDuckAvailable } from '../../utils/commonUtil';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  indexAxis: 'y' as const,
  elements: {
    bar: {
      borderWidth: 1,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Security Risk',
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
};

const labels = ['Critical', 'High', 'Medium', 'Low', 'None'];

const getSecurityRickCounts = (items: any) => {
  const counter = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
    NONE: 0,
  };
  items?.map((item: any) => {
    switch (item.vulnerabilityWithRemediation.severity) {
      case 'CRITICAL': {
        counter.CRITICAL = counter.CRITICAL + 1;
        break;
      }
      case 'HIGH': {
        counter.HIGH = counter.HIGH + 1;
        break;
      }
      case 'MEDIUM': {
        counter.MEDIUM = counter.MEDIUM + 1;
        break;
      }
      case 'LOW': {
        counter.LOW = counter.LOW + 1;
        break;
      }
      default: {
        counter.NONE = counter.NONE + 1;
        break;
      }
    }
  });

  const counterData: any = [];
  const counterValues = Object.values(counter);
  counterValues.forEach(value => {
    counterData.push(value);
  });
  return counterData;
};

type CardContentProps = {
  projectName: string;
  projectVersion: string
};

export const CardContent = ({projectName, projectVersion}: CardContentProps) => {
  const blackduckApi = useApi(blackduckApiRef);
  const { value, loading, error } = useAsync(async () => {
    const data: any = await blackduckApi.getVulns(projectName, projectVersion);
    return data;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (!value) {
    return (
      <InfoCard title="BlackDuck">
        <EmptyState
          missing="info"
          title="No information to display"
          description={`There is no BlackDuck Project ${projectName} with version ${projectVersion} available!`}
        />
      </InfoCard>
    );
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  const counterData = getSecurityRickCounts(value.items);

  const data = {
    labels,
    datasets: [
      {
        data: counterData,
        borderColor: ['#5a100c', '#9c251f', '#e78c87', '#9a9b9c', '#dddddd'],
        backgroundColor: [
          '#5a100c',
          '#9c251f',
          '#e78c87',
          '#9a9b9c',
          '#dddddd',
        ],
      },
    ],
  };

  return (
    <InfoCard
      title="BlackDuck"
      deepLink={{
        link: `${value._meta.href}?limit=999`,
        title: 'View Details',
      }}
    >
      <Bar options={options} data={data} />
    </InfoCard>
  );
}

export const BlackDuckCardComponent = () => {
  const { entity } = useEntity();    
  const{ projectName, projectVersion } = getProjectAnnotation(entity)
  return isBlackDuckAvailable(entity) ? (
    <CardContent 
      projectName={projectName}
      projectVersion={projectVersion}
    />) : <MissingAnnotationEmptyState annotation={BLACKDUCK_PROJECT_ANNOTATION} />;
};
