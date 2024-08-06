import { BacklogCategoryColor } from "../types/common/backlog";
import getRandomNumber from "./getRandomNumber";

const getNewColor = (colors: string[]) =>
  colors[getRandomNumber(0, colors.length - 1)] as BacklogCategoryColor;

export default getNewColor;
