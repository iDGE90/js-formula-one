export default interface ClientOptions {
  headers?: ClientOptionsHeaders;
  params?: ClientOptionsParams;
}

export type ClientOptionsHeaders = { [key: string]: string; };
export type ClientOptionsParams = { [key: string]: string | number; };