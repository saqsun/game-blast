import { readFileSync } from 'fs';
import pt from 'path';
import sharp from 'sharp';
import utils from '../utils';

export default async (): Promise<void> => {
    const inputPath = pt.join('raw-assets', 'image');
    const outputPath = pt.join('assets', 'image');

    const inputFiles = utils.getFiles(inputPath, { pattern: utils.globs.image });

    // clean output directory
    utils.cleanDirectory(outputPath, inputFiles.length > 0);

    for await (const entry of inputFiles) {
        const { name, ext } = pt.parse(entry);
        const image = readFileSync(entry);
        await sharp(image)
            .jpeg({ quality: 70, force: false })
            .png({ compressionLevel: 9, force: false })
            .toFile(pt.join(outputPath, `${name}${ext}`));
    }

    // remove output directory if no image found
    if (inputFiles.length === 0) {
        utils.removeDir(outputPath);
    }
};
