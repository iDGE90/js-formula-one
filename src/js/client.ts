import ClientOptions from './models/client-options';

export default class Client {

  // Execute a get request
  public get(url: string, options?: ClientOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

      xhr.open('GET', this.setUrlParams(url, options));

      this.setRequestHeaders(xhr, options);

      xhr.onload = () => {
        xhr.status >= 200 && xhr.status < 300
          ? resolve(JSON.parse(xhr.response))
          : reject(JSON.parse(xhr.response));
      };

      xhr.onerror = () => reject(xhr.response);

      xhr.send();
    });
  }

  // Set Request headers on XMLHttpRequest
  private setRequestHeaders(xhr: XMLHttpRequest, options?: ClientOptions): void {
    if (!options || !options.headers) return;

    const headers = options.headers;

    Object.keys(headers).forEach(key => {
      xhr.setRequestHeader(key, headers[key]);
    });
  }

  // Set query params on the request url
  private setUrlParams(url: string,  options?: ClientOptions): string {
    if (!options || !options.params) return url;

    let fullUrl = url;
    const params = options.params;

    Object.keys(params).forEach((key, index) => {
      const sign = index === 0 ? '?' : '&';

      fullUrl += `${sign}${key}=${params[key]}`;
    });

    return fullUrl;
  }

}