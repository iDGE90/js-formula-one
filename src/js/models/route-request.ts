import QueryParams from '../query-params';

export default interface RouteRequest {
  param: { [key: string]: string };
  query: QueryParams;
  uri: string;
}