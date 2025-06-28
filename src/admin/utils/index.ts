import { UsageStatisticsData } from "../../providers/file-imagekit/types";

/**
 * 格式化字节大小为更易读的单位
 * @param bytes 字节大小
 * @param decimals 保留的小数位数，默认为2
 * @returns 格式化后的字符串
 */
function formatBytes(bytes: number, decimals: number = 0): { value: string, unit: string } {
  if (bytes === 0) return { value: '0', unit: 'Bytes' };

  const k = 1024;
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // 处理小数位数
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));

  return {
    value: value.toString(),
    unit: units[i]
  };
}
export function formatUsageStatistics(data: UsageStatisticsData): any[] {

  return Object.keys(data).map((v) => {

    switch (v) {
      case 'bandwidthBytes':

        let bwb = formatBytes(data[v], 2);

        return {
          name: 'Bandwidth',
          value: bwb.value,
          unit: bwb.unit
        }
      case 'mediaLibraryStorageBytes':
        let msb = formatBytes(data[v], 2);
        return {
          name: 'Current Media library storage',
          value: msb.value,
          unit: msb.unit
        }
      case 'videoProcessingUnitsCount':
        return {
          name: 'Video processing units',
          value: data[v]
        }
      case 'extensionUnitsCount':
        return {
          name: 'Extension units',
          value: data[v]
        }
      case 'originalCacheStorageBytes':
        let ocsb = formatBytes(data[v], 2);
        return {
          name: 'Current Original cache storage',
          value: ocsb.value,
          unit: ocsb.unit
        }
    }
  })

}