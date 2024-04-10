import chalk from 'chalk';
import { exec } from 'child_process';
import type { PathOrFileDescriptor } from 'fs';
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmdirSync, unlinkSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import pt from 'path';
import { promisify } from 'util';

const execPromise = promisify(exec);

// prettier-ignore
const globs = {
    dir:    '*/',
    all:    '*',
    audio:  '*.{mp3,ogg,wav}',
    skel:   '*.skel',
    json:   '*.json',
    image:  '*.{jpeg,jpg,png}',
    png:    '*.png',
    jpeg:   '*.{jpeg,jpg}',
    font:   '*.{ttf,otf,woff,woff2}',
    model:  '*.{glb,gltf}',
    frag:   '*.frag',
    vert:   '*.vert',
    nonZip: '*/!(*.zip)'
};

const print = (str = ''): void => {
    console.log(chalk.greenBright(str));
};

const cleanDirectory = function (source: string, createIfNotExist = false): void {
    if (existsSync(source)) {
        emptyDirSync(source);
    } else if (createIfNotExist) {
        mkdirSync(source, { recursive: true });
    }
};

const removeDir = function (source: string): void {
    if (existsSync(source)) {
        emptyDirSync(source);
        rmdirSync(source);
    }
};

const getFiles = function (
    source: string,
    { pattern, recursive, nodir }: { pattern: string; recursive?: boolean; nodir?: boolean },
): string[] {
    return glob.sync(pt.join(`${source}`, recursive ? '**' : '', pattern), { nodir }).sort();
};

const trimExt = function (str: string): string {
    return str.replace(pt.parse(str).ext, '');
};

const removeFile = function (source: string): void {
    existsSync(source) && unlinkSync(source);
};

const removeFiles = function (dir: string, pattern: string): void {
    const files = glob.sync(pt.join(`${dir}`, pattern));
    files.forEach((file) => removeFile(file));
};

const saveFile = (url: PathOrFileDescriptor, data = '', preData = '', postData = ''): void => {
    const content = `${preData}\n${data}\n${postData}`;

    writeFileSync(url, content, 'utf-8');
};

const prettifyFile = async (url: string): Promise<void> => {
    await execPromise(`npx prettier --write ${url}`);
};

const readJsonSync = (source: string): any => {
    return JSON.parse(readFileSync(source, 'utf8'));
};

const charsetASCII =
    ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

function emptyDirSync(source: string): void {
    const files = readdirSync(source);

    for (const file of files) {
        const curPath = pt.join(source, file);

        if (lstatSync(curPath).isDirectory()) {
            emptyDirSync(curPath);
            rmdirSync(curPath);
        } else {
            unlinkSync(curPath);
        }
    }
}

export default {
    globs,
    print,
    trimExt,
    getFiles,
    saveFile,
    prettifyFile,
    removeDir,
    removeFiles,
    cleanDirectory,
    readJsonSync,
    charsetASCII,
};
