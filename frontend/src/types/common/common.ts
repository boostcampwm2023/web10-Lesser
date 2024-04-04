import { FunctionComponent, SVGProps } from "react";

export type SVGReactElement = FunctionComponent<
  SVGProps<SVGSVGElement> & { title?: string | undefined }
>;
