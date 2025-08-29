import { format } from "date-fns";

type Options = {
  date: Date | string | undefined;
  formatType?: string;
};
export const dateFormatter = ({ date, formatType = "PP" }: Options) => {
  try {
    if (!date) return null;
    return format(new Date(date), formatType);
  } catch (error) {
    console.log(error);
    return null;
  }
};
