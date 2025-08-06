import pocketbase from "pocketbase";

const pbUrl = import.meta.env.VITE_POCKETBASE_API_URL;
export const db = new pocketbase(pbUrl);

export const getFilePreview = ({
  fileName,
  collectionName,
  recordId,
}: {
  fileName: string;
  collectionName: string;
  recordId: string;
}) => {
  return `${pbUrl}/api/files/${collectionName}/${recordId}/${fileName}`;
};
