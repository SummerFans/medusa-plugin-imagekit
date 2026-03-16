import { MedusaError, MedusaService } from "@medusajs/framework/utils";
import { Logger } from "@medusajs/medusa";
import { ImagekitOptions, UsageStatisticsData } from "../../providers/file-imagekit/types";
import ImageKit from "@imagekit/nodejs";

type InjectedDependencies = {
  logger: Logger;
};

class ImagekitModuleService extends MedusaService({}) {
  protected _logger: Logger;
  protected _options: ImagekitOptions;
  protected _imagekit: ImageKit;

  constructor(container: InjectedDependencies, options: ImagekitOptions) {
    super(...arguments);


    this._options = options;
    this._logger = container.logger;

//   privateKey: string;
//   password: string | null;
//   webhookSecret: string | null;

//   baseURL: string;
//   maxRetries: number;
//   timeout: number;
//   logger: Logger;
//   logLevel: LogLevel | undefined;
//   fetchOptions: MergedRequestInit | undefined;

    this._imagekit = new ImageKit({
      // publicKey: this._options.publicKey,
      privateKey: this._options.privateKey,
      // urlEndpoint: `https://ik.imagekit.io/${this._options.imagekitID}/`
    });
  }

  async usageStatistics(startData: string, endData: string): Promise<UsageStatisticsData> {
    const url = `https://api.imagekit.io/v1/accounts/usage?startDate=${startData}&endDate=${endData}`;
    this._logger.debug(url)
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(this._options.privateKey + ':').toString('base64')}`
      }
    };

    try {
      const response = await fetch(url, options);

      if (response.status !== 200) {
        const data = await response.json();
        throw new MedusaError('imagekit.error', data.message)
      }

      const data = await response.json() as UsageStatisticsData;
      return data
    } catch (error) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, error.message)
    }
  }

  
}

export default ImagekitModuleService;