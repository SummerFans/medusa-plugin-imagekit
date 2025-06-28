import { FileTypes } from "@medusajs/framework/types";
import { AbstractFileProviderService, isDefined, MedusaError } from "@medusajs/framework/utils";
import { Logger } from "@medusajs/medusa";
import ImageKit from "imagekit";
import { Readable } from "stream";
import { v4 as uuidv4 } from 'uuid'
import { ImagekitOptions } from "./types";

type InjectedDependencies = {
  logger: Logger;
};


export class ImagekitFileService extends AbstractFileProviderService {
  static identifier = "file-imagekit";
  protected _option: ImagekitOptions;
  protected _logger: Logger;
  protected _imagekit: ImageKit;

  static validateOptions(options: ImagekitOptions): void {
    if (!isDefined(options.publicKey)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA, "Required option `publicKey` is missing in Imagekit plugin")
    }
    if (!isDefined(options.privateKey)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA, "Required option `privateKey` is missing in Imagekit plugin")
    }
    if (!isDefined(options.imagekitID)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA, "Required option `imagekitID` is missing in Imagekit plugin")
    }
  }

  constructor(
    { logger }: InjectedDependencies,
    { publicKey, privateKey, imagekitID, folder }: ImagekitOptions
  ) {
    super();

    this._logger = logger;
    this._option = { publicKey, privateKey, imagekitID, folder };

    this._imagekit = new ImageKit({
      publicKey: this._option.publicKey,
      privateKey: this._option.privateKey,
      urlEndpoint: `https://ik.imagekit.io/${imagekitID}/`
    });
  }


  async upload(
    file: FileTypes.ProviderUploadFileDTO
  ): Promise<FileTypes.ProviderFileResultDTO> {

    if (!file) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `No file provided`)
    }
    try {
      const content = Buffer.from(file.content, 'binary');

      const extension = file.filename.split('.').pop();
      const fileName = `${uuidv4()}.${extension}`;

      const { fileId, url } = await this._imagekit.upload({
        fileName,
        file: content,
        folder: this._option.folder || '/medusa/'
      })

      this._logger.debug('complate upload \r\n')

      return { url: url, key: fileId };
    } catch (e) {
      throw new MedusaError("imagekit.upload.error", e?.message)
    }
  }

  async delete(files: FileTypes.ProviderDeleteFileDTO | FileTypes.ProviderDeleteFileDTO[]): Promise<void> {

    if (!Array.isArray(files)) {
      await this._imagekit.deleteFile(files.fileKey);
      this._logger.debug("complate delete imagekit fileKey:" + files.fileKey);
    } else {
      throw new MedusaError("imagekit.upload.error", "batch deletion is not supported")
    }
  }

  async getPresignedDownloadUrl(fileData: FileTypes.ProviderGetFileDTO): Promise<string> {
    const { url } = await this._imagekit.getFileDetails(fileData.fileKey);
    return url
  }
}