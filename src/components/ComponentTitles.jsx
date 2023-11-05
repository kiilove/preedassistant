import { defaultTitleHeight } from "../constSizes";

export const TitleBasicType = ({ titleText }) => {
  return (
    <div
      className="flex w-full justify-start items-center text-lg font-semibold text-blue-900"
      style={{ height: defaultTitleHeight }}
    >
      {titleText}
    </div>
  );
};
