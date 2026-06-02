import { toast } from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import LogoSquare from "../../icons/logo_square"
import { useLoaderData } from "react-router-dom"
import UsageStatistics from "../../components/usage-statistics"
import { UsageStatisticsData } from "../../../providers/file-imagekit/types"

declare const __BACKEND_URL__: string;

// 提取URL构建逻辑
const buildApiUrl = (endpoint: string): string => {
  const baseUrl = __BACKEND_URL__ || 'http://localhost:9000';
  return `${baseUrl}/admin/plugin/imagekit/${endpoint}`;
};

// 提取API调用逻辑
const fetchUsageStatistics = async (): Promise<UsageStatisticsData> => {
  const url = buildApiUrl('usage');
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // 验证响应结构
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    // 确保返回的是result字段
    if (!data.result) {
      throw new Error('Missing result field in response');
    }

    return data.result as UsageStatisticsData;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // 根据错误类型返回适当的错误数据
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return {
      bandwidthBytes: 0,
      mediaLibraryStorageBytes: 0,
      videoProcessingUnitsCount: 0,
      extensionUnitsCount: 0,
      originalCacheStorageBytes: 0,
      type: 'error',
      message: `Failed to fetch usage statistics: ${errorMessage}`
    };
  }
};

export async function loader(): Promise<{ useStatistics: UsageStatisticsData }> {
  const useStatistics = await fetchUsageStatistics();
  return { useStatistics };
}

const ImagekitPage = () => {
  const { useStatistics } = useLoaderData() as Awaited<ReturnType<typeof loader>>
  if (useStatistics.message) {
    toast.error(useStatistics?.message)
    return (<div className="flex flex-col items-center">
      <UsageStatistics />
    </div>)
  }

  return (
    <div className="flex flex-col items-center">
      <UsageStatistics data={useStatistics} />
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Imagekit",
  icon: LogoSquare,
})

export default ImagekitPage