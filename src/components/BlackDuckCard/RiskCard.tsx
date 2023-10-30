import React from 'react';
import { blackduckApiRef } from '../../api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';

import {
  InfoCard,
  TabbedCard,
  CardTab,
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
      display: false,
      text: 'Risk Profile',
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

type CardContentProps = {
  projectName: string;
  projectVersion: string
};

export const CardContent = ({ projectName, projectVersion }: CardContentProps) => {
  const blackduckApi = useApi(blackduckApiRef);
  const { value, loading, error } = useAsync(async () => {
    const data: any = await blackduckApi.getRiskProfile(projectName, projectVersion);
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
  const vulnerabilityData = Object.values(value.categories.VULNERABILITY).slice(0, -1)
  const operationalData = Object.values(value.categories.OPERATIONAL).slice(0, -1)
  const licenseData = Object.values(value.categories.LICENSE).slice(0, -1)

  const data = {
    labels,
    datasets: [
      {
        data: vulnerabilityData,
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

  const dataOps = {
    labels,
    datasets: [
      {
        data: operationalData,
        borderColor: ['#5a100c', '#9c251f', '#e78c87', '#9a9b9c', '#dddddd'],
        backgroundColor: [
          '#5a100c',
          '#9c251f',
          '#e78c87',
          '#9a9b9c',
          '#dddddd',
        ],
      }
    ],
  };

  const dataLis = {
    labels,
    datasets: [
      {
        data: licenseData,
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
    <TabbedCard title="BlackDuck Risk Profile">
      <CardTab label="Security Risk">
        <Bar options={options} data={data} />
      </CardTab>
      <CardTab label="Operational Risk">
        <Bar options={options} data={dataOps} />
      </CardTab>
      <CardTab label="License Risk">
        <Bar options={options} data={dataLis} />
      </CardTab>
    </TabbedCard>
  );
}

export const RiskCardComponent = () => {
  const { entity } = useEntity();
  const { projectName, projectVersion } = getProjectAnnotation(entity)
  return isBlackDuckAvailable(entity) ? (
    <CardContent
      projectName={projectName}
      projectVersion={projectVersion}
    />) : <MissingAnnotationEmptyState annotation={BLACKDUCK_PROJECT_ANNOTATION} />;
};
