

export interface ImagekitOptions {
  publicKey: string;
  privateKey: string;
  imagekitID: string;
  folder?: string; // defailt: /medusa/
  thumbnail?: boolean; // default true
}

export interface UsageStatisticsData {
  bandwidthBytes: number;
  mediaLibraryStorageBytes: number;
  videoProcessingUnitsCount: number;
  extensionUnitsCount: number;
  originalCacheStorageBytes: number;

  type?: string;
  message?: string;
}
