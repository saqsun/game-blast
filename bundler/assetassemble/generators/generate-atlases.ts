import type {
    BitmapFilterType,
    PackerExporterType,
    PackerType,
    ScaleMethod,
    TextureFormat,
    TexturePackerOptions,
    TrimMode,
} from 'free-tex-packer-core';
import { packAsync } from 'free-tex-packer-core';
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import pt from 'path';
import sharp from 'sharp';
import utils from '../utils';

const packDefaultOptions: TexturePackerOptions = {
    textureName: 'pack',
    width: 2048,
    height: 2048,
    fixedSize: false,
    powerOfTwo: false,
    padding: 2,
    extrude: 1,
    allowRotation: true,
    detectIdentical: true,
    allowTrim: true,
    trimMode: 'trim' as TrimMode.TRIM,
    alphaThreshold: 0,
    removeFileExtension: false,
    prependFolderName: true,
    textureFormat: 'png' as TextureFormat,
    base64Export: false,
    scale: 1,
    scaleMethod: 'BILINEAR' as ScaleMethod.BILINEAR,
    tinify: false,
    tinifyKey: '',
    packer: 'OptimalPacker' as PackerType.OPTIMAL_PACKER,
    exporter: 'Pixi' as PackerExporterType.PIXI,
    filter: 'none' as BitmapFilterType.NONE,
};

export default async (): Promise<void> => {
    const inputPath = pt.join('raw-assets', 'atlas');
    const outputPath = pt.join('assets', 'atlas');

    const atlasKeys = utils.getFiles(inputPath, { pattern: utils.globs.dir }).map((p) => pt.parse(p).base);

    // cleanup output directory
    utils.cleanDirectory(outputPath, atlasKeys.length > 0);

    for await (const key of atlasKeys) {
        const atlasRoot = pt.join(inputPath, key);
        const files = glob.sync(`${atlasRoot}/**/*`, { nodir: true });

        const images = files.map((f) => {
            return { path: pt.relative(inputPath, f), contents: readFileSync(f) };
        });

        const pack = await packAsync(images, { ...packDefaultOptions, textureName: `${key}` });
        for await (const { name, buffer } of pack) {
            const ext = pt.extname(name);
            if (ext === '.json') {
                writeFileSync(pt.join(outputPath, name), buffer.toString());
            } else {
                await sharp(buffer)
                    .jpeg({ quality: 70, force: false })
                    .png({ compressionLevel: 9, force: false })
                    .toFile(pt.join(outputPath, name));
            }
        }
    }

    // remove output directory if no atlas found
    if (atlasKeys.length === 0) {
        utils.removeDir(outputPath);
    }
};
