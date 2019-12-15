import RouterParameter from './router-parameter';

export default interface InternalRoute {
  uri: string;
  component: any;
  parameters: Array<RouterParameter>;
  regExp: RegExp;
  current: boolean;
}