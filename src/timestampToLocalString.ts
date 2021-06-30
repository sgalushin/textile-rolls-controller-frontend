export const timestampToLocalString = (timestamp: string) => {
  return new Date(timestamp).toLocaleString("en-us");
};
