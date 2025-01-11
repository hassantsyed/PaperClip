import { Resource } from "./interfaces";

export const getResourceTitle = (resource: Resource): string => {
  switch (resource.resourceType) {
    case 'pdf':
    case 'youtube':
      return resource.title;
    case 'link':
      return resource.title || resource.url;
    case 'file':
      return resource.filename;
    default:
      return 'Untitled Resource';
  }
};
