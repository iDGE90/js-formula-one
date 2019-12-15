export default interface RouterParameter {
  [key: string]: {
    sn: number;
    regExp: string;
    value: string;
  };
}