import { TableData } from '../types';

export type DataSourceSelectProps = {
  selectedSource: string;
  onSourceChange: (source: string) => void;
  onDataUpdate?: (data: TableData) => void;
};