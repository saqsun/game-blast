// import fs from 'fs-extra';
import { writeFileSync } from 'fs';
import pt from 'path';
import utils from '../utils';

export default async (): Promise<void> => {
    const inputPath = pt.join('raw-assets', 'particles');
    const outputPath = pt.join('assets', 'particles');
    const inputFiles = utils.getFiles(inputPath, { pattern: utils.globs.json });

    // clean output directory
    utils.cleanDirectory(outputPath, inputFiles.length > 0);

    for await (const file of inputFiles) {
        const json = utils.readJsonSync(file);
        writeFileSync(pt.join(outputPath, `${pt.parse(file).name}.json`), JSON.stringify(json));
    }

    // remove output directory if no sound found
    if (inputFiles.length === 0) {
        utils.removeDir(outputPath);
    }
};
