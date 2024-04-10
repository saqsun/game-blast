// import fs from 'fs-extra';
import { Lame } from 'node-lame';
import pt from 'path';
import utils from '../utils';

export default async (): Promise<void> => {
    const inputPath = pt.join('raw-assets', 'sound');
    const outputPath = pt.join('assets', 'sound');
    const inputFiles = utils.getFiles(inputPath, { pattern: utils.globs.audio });

    // clean output directory
    utils.cleanDirectory(outputPath, inputFiles.length > 0);

    for await (const file of inputFiles) {
        await new Lame({
            output: pt.join(outputPath, pt.basename(file)),
            ...Object.assign({ bitrate: 64 }),
        })
            .setFile(file)
            .encode();
    }

    // remove output directory if no sound found
    if (inputFiles.length === 0) {
        utils.removeDir(outputPath);
    }
};
