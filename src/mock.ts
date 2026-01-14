export const generateImage = async (
  image: string,
  _prompt: string
): Promise<string> => {
  await new Promise((r) => setTimeout(r, 1500));
  return image;
};
