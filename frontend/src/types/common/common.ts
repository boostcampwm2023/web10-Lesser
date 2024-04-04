import { FunctionComponent, SVGProps } from "react";

export type SVGReactElement = FunctionComponent<
  SVGProps<SVGSVGElement> & { title?: string | undefined }
>;

type SingleInteger = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0;
type SingleNatural = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type TimeNumber = 0 | 1 | 2 | 3 | 4 | 5;
type ISOStringYear = `${SingleNatural}${SingleInteger}${SingleInteger}${SingleInteger}`;
type ISOStringMonth = `0${SingleNatural}` | `1${0 | 1 | 2}`;
type ISOStringDate = `0${SingleInteger}`;
type ISOStringHour = `${0 | 1}${SingleInteger}` | `2${0 | 1 | 2 | 3}`;
type ISOStringMinuteSecond = `${TimeNumber}${SingleInteger}`;
export type ISOStringType = `${ISOStringYear}-${ISOStringMonth}-${ISOStringDate}T${ISOStringHour}:`;
