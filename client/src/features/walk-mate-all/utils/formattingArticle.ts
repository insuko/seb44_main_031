export const TITLE_LENGTH = 67;
export const BODY_LENGTH = 115;

export const sliceContentLengthEndWithDots = (
  content: string,
  desiredLength: number
) => {
  if (content.length <= 66) return content;

  return content.slice(0, desiredLength - 3) + '...';
};

export const getFirstThreeChunks = (string: string) => {
  const chunks = string.split(' ');
  const firstThreeChunks = chunks.slice(0, 3).join(' ');
  return firstThreeChunks;
};
