import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

export const generateUUID = () => {
  const uuid = uuidv4();
  return uuid;
};

export const generateToday = () => {
  const currentDateTime = dayjs().format("YYYY-MM-DD HH:mm");
  return currentDateTime;
};

export const generateFileName = (
  originalFilename,
  newFileName,
  fileCount = 0
) => {
  if (!originalFilename) {
    return;
  } else {
    const fileExtension = originalFilename.split(".").pop();

    return `${newFileName}[${fileCount}].${fileExtension}`;
  }
};

export const handleCategoriesWithGrades = (categories, grades) => {
  let dummy = [];

  categories

    .sort((a, b) => a.contestCategoryIndex - b.contestCategoryIndex)
    .map((category, cIdx) => {
      const matchedGrades = grades
        .filter((grade) => grade.refCategoryId === category.contestCategoryId)
        .sort((a, b) => a.contestGradeIndex - b.contestGradeIndex);
      const newCategoryItem = { ...category, grades: [...matchedGrades] };
      dummy.push({ ...newCategoryItem });
    });

  return dummy;
};

export function getRandomNumber(min, max) {
  // min과 max 사이의 임의의 소수를 얻고, 그 소수를 min과 max 사이의 범위로 변환합니다.
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const handleArrayEdit = (originalArray, newValue, keyName, keyValue) => {
  const newArray = [...originalArray];
  const arrayIndex = newArray.findIndex((f) => f[keyName] === keyValue);

  if (arrayIndex != -1) {
    newArray.splice(arrayIndex, 1, newValue);
  }
  return newArray;
};
