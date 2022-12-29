import { DataSource, DataSourceOptions } from 'typeorm';
import config from './conf';

/**
 * @fileoverview This file is used by the typeorm cli to generate the
 * schemas migrations.
 */

// eslint-disable-next-line prettier/prettier
const overrideHost = process.env.NODE_ENV === 'dev' ? 'host.docker.internal' : undefined;

const dataSource = new DataSource(config(undefined, overrideHost));
const dataSourceFactory = async (
  dataSourceOptions: DataSourceOptions,
): Promise<DataSource> => {
  const dataSources = new DataSource(
    dataSourceOptions || config(undefined, overrideHost),
  );
  return dataSources;
};

export default dataSource;
export { dataSourceFactory };
