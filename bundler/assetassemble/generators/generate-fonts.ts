import { readFileSync, writeFileSync } from 'fs';
import pt from 'path';
import subsetFont from 'subset-font';
import utils from '../utils';

export default async (): Promise<void> => {
    const inputPath = pt.join('raw-assets', 'font');
    const outputPath = pt.join('assets', 'font');

    const inputFiles = [
        ...utils.getFiles(inputPath, { pattern: utils.globs.font }),
        ...utils.getFiles(inputPath, { pattern: utils.globs.json }),
    ];
    const charset = utils.charsetASCII;

    // clean output directory
    utils.cleanDirectory(outputPath, inputFiles.length > 0);

    for await (const entry of inputFiles) {
        const { ext, name } = pt.parse(entry);
        if (ext === '.json') {
            const json = utils.readJsonSync(entry);
            writeFileSync(pt.join(outputPath, `${name}${ext}`), JSON.stringify(json));
        } else {
            const buffer = readFileSync(entry);
            const format = 'woff2';
            const subset = await subsetFont(buffer, charset, { targetFormat: format });
            writeFileSync(pt.join(outputPath, `${name}.${format}`), subset);
        }
    }

    // remove output directory if no font found
    if (inputFiles.length === 0) {
        utils.removeDir(outputPath);
    }
};
