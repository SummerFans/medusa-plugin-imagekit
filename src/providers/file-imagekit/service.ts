import { FileTypes } from "@medusajs/framework/types";
import { Readable } from "node:stream";
import {
  AbstractFileProviderService,
  isDefined,
  MedusaError,
} from "@medusajs/framework/utils";
import { Logger } from "@medusajs/medusa";
import ImageKit from "@imagekit/nodejs";
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
        MedusaError.Types.INVALID_DATA,
        "Required option `publicKey` is missing in Imagekit plugin",
      );
    }
    if (!isDefined(options.privateKey)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Required option `privateKey` is missing in Imagekit plugin",
      );
    }
    if (!isDefined(options.imagekitID)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Required option `imagekitID` is missing in Imagekit plugin",
      );
    }
  }

  constructor(
    { logger }: InjectedDependencies,
    { publicKey, privateKey, imagekitID, folder, thumbnail }: ImagekitOptions,
  ) {
    super();

    this._logger = logger;
    this._option = { publicKey, privateKey, imagekitID, folder, thumbnail };
    if (thumbnail == undefined) {
      this._option.thumbnail = true;
    }

    this._imagekit = new ImageKit({
      // publicKey: this._option.publicKey,
      privateKey: this._option.privateKey,
      // urlEndpoint: `https://ik.imagekit.io/${imagekitID}/`
    });
  }

  async upload(
    file: FileTypes.ProviderUploadFileDTO,
  ): Promise<FileTypes.ProviderFileResultDTO> {
    if (!file) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `No file provided`);
    }
    try {

      const folder = (this._option.folder || "/medusa").replace(/\/$/gi, "");

      const { fileId, url } = await this._imagekit.files.upload({
        fileName: file.filename,
        file: file.content,
        folder,
      });

      this._logger.debug("completed upload \r\n");

      let newURL = url || "";
      if (this._option.thumbnail) {
        newURL = url?.replace(folder, `${folder}/tr:w-300`) || "";
      }

      return { url: newURL, key: fileId || "" };
    } catch (e) {
      throw new MedusaError("imagekit.upload.error", e?.message);
    }
  }

  async delete(
    files: FileTypes.ProviderDeleteFileDTO | FileTypes.ProviderDeleteFileDTO[],
  ): Promise<void> {
    if (!Array.isArray(files)) {
      await this._imagekit.delete(files.fileKey);
      this._logger.debug("completed delete imagekit fileKey:" + files.fileKey);
    } else {
      throw new MedusaError(
        "imagekit.upload.error",
        "batch deletion is not supported",
      );
    }
  }

  async getPresignedDownloadUrl({
    fileKey,
  }: FileTypes.ProviderGetFileDTO): Promise<string> {
    // const filePath = await this._imagekit.get(fileKey);

    // const signedUrl = await this._imagekit.url({
    //   path: filePath,
    //   signed: true,
    //   expireSeconds: 1296000,
    // });

    return fileKey;
  }
}
