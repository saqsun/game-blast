import dirTree from 'directory-tree';
import type { PathLike } from 'fs';
import pt from 'path';
import utils from '../utils';

function getRelativePath(p: PathLike): string {
    return pt.join(pt.sep, p.toString());
}

function saveFile(name: string, data: string): void {
    const url = pt.resolve(pt.join('src', 'assets', `${name}.ts`));
    const content = `export const ${name} = ${data}`;

    const eslintIgnoreString = `
        /* eslint-disable @typescript-eslint/consistent-type-imports */
        /* eslint-disable @typescript-eslint/naming-convention */
    `;
    utils.saveFile(url, content, `${eslintIgnoreString}\n`);
}

function saveAssetsFile(name: string, data: string): void {
    const url = pt.resolve(pt.join('src', 'assets', `${name}.ts`));
    const content = `export default ${data}`;

    const eslintIgnoreString = `
        /* eslint-disable @typescript-eslint/consistent-type-imports */
        /* eslint-disable @typescript-eslint/naming-convention */
    `;
    utils.saveFile(url, content, `${eslintIgnoreString}\n`);
}

export default async (): Promise<void> => {
    const tree = dirTree('assets', { normalizePath: true, extensions: /\.\w+/ });

    let assets = `{
        atlases:    __atlases__
        fonts:      __fonts__
        bitmapFonts:__bitmapFonts__
        images:     __images__
        jsons:      __jsons__
        particles:  __particles__
        sounds:     __sounds__
    }`;

    let textures = '';
    let fonts = '';
    let images = '';
    let jsons = '';
    let particles = '';
    let sounds = '';

    for await (const dir of tree.children ?? []) {
        switch (dir.name) {
            case 'atlas': {
                assets = assets.replace('__atlases__', `{${processAtlasesImport(dir)}},\n\n`);
                textures = processAtlasesExport(dir);
                break;
            }

            case 'font': {
                assets = assets.replace('__fonts__', `{${processFontsImport(dir)}},\n\n`);
                assets = assets.replace('__bitmapFonts__', `${processBitmapFontsImport(dir)},\n\n`);
                fonts = processFontsExport(dir);
                break;
            }

            case 'image': {
                assets = assets.replace('__images__', `{${processImagesImport(dir)}},\n\n`);
                images = processImagesExport(dir);
                break;
            }

            case 'json': {
                assets = assets.replace('__jsons__', `{${processJsonsImport(dir)}},\n\n`);
                jsons = processJsonsExport(dir);
                break;
            }

            case 'particles': {
                assets = assets.replace('__particles__', `{${processParticlesImport(dir)}},\n\n`);
                particles = processParticlesExport(dir);
                break;
            }

            case 'sound': {
                assets = assets.replace('__sounds__', `{${processSoundsImport(dir)}},\n\n`);
                sounds = processSoundsExport(dir);
                break;
            }

            default:
                throw Error(`Unknown asset type ${dir.path}`);
        }
    }

    assets = assets
        //
        .replace('__atlases__', '{},\n')
        .replace('__fonts__', '{},\n')
        .replace('__bitmapFonts__', '{},\n')
        .replace('__images__', '{},\n')
        .replace('__jsons__', '{},\n')
        .replace('__particles__', '{},\n')
        .replace('__sounds__', '{},\n');

    // prettier-ignore
    // eslint-disable-next-line no-lone-blocks
    {
        saveFile('textures',    `{${textures}}`);
        saveFile('fonts',       `{${fonts}}`);
        saveFile('images',      `{${images}}`);
        saveFile('jsons',       `{${jsons}}`);
        saveFile('particles',   `{${particles}}`);
        saveFile('sounds',      `{${sounds}}`);
    }

    saveAssetsFile('index', `${assets}`);

    await utils.prettifyFile(pt.join('src', 'assets'));
};

/* ATLASES */
function processAtlasesImport(dir: dirTree.DirectoryTree): string {
    const relPath = getRelativePath(dir.path);
    const paths = utils.getFiles(dir.path, { pattern: utils.globs.json });

    return paths
        .map((p) => {
            const { name, base } = pt.parse(p);
            const meta = utils.readJsonSync(p).meta;

            const jsonURL = `require('${pt.join(relPath, base)}')`;
            const imageURL = `require('${pt.join(relPath, meta.image)}')`;
            const asset = `'${name}':{\n json: ${jsonURL}, \n image: ${imageURL}}`;

            return asset;
        })
        .join(',');
}

function processAtlasesExport(dir: dirTree.DirectoryTree): string {
    const paths = utils.getFiles(dir.path, { pattern: utils.globs.json });
    const spines = utils.getFiles(pt.join('assets', 'spines'), { pattern: utils.globs.skel });
    const filtered = paths.filter((path) => !spines.find((spine) => pt.parse(spine).name === pt.parse(path).name));
    const jsons = filtered.map((p) => utils.readJsonSync(p));

    return jsons
        .map((json) => {
            return Object.keys(json.frames).map((el) => `'${utils.trimExt(el)}': '${el}'`);
        })
        .join(',');
}

/* IMAGES */
function processImagesImport(dir: dirTree.DirectoryTree): string {
    const relPath = getRelativePath(dir.path);
    const paths = utils.getFiles(dir.path, { pattern: utils.globs.image });

    return paths
        .map((p) => {
            const { name, base } = pt.parse(p);

            const imageURL = `require('${pt.join(relPath, base)}')`;
            const asset = `\n '${name}': ${imageURL}`;

            return asset;
        })
        .join(',');
}

function processImagesExport(dir: dirTree.DirectoryTree): string {
    const paths = utils.getFiles(dir.path, { pattern: utils.globs.image });

    return paths
        .map((p) => {
            const { name } = pt.parse(p);

            return `'${name}': '${name}'`;
        })
        .join(',');
}

/* FONTS */
function processBitmapFontsImport(dir: dirTree.DirectoryTree): string {
    const relPath = getRelativePath(dir.path);
    return `require('${pt.join(relPath, 'bitmaps.json')}')`;
}

function processFontsImport(dir: dirTree.DirectoryTree): string {
    const relPath = getRelativePath(dir.path);
    const paths = utils.getFiles(dir.path, { pattern: utils.globs.font });

    return paths
        .map((p) => {
            const { name, base } = pt.parse(p);

            const fontURL = `require('${pt.join(relPath, base)}')`;
            const asset = `'${name}': ${fontURL}`;

            return asset;
        })
        .join(',');
}

function processFontsExport(dir: dirTree.DirectoryTree): string {
    const paths = utils.getFiles(dir.path, { pattern: utils.globs.font });

    /* css */
    const cssFonts = paths
        .map((p) => {
            const { name } = pt.parse(p);

            return `\n '${name}': '${name}'`;
        })
        .join(',');

    /* bitmap */
    const bitmapsURL = pt.join(dir.path, 'bitmaps.json');
    const bitmapsData = utils.readJsonSync(bitmapsURL);
    const bitmapsKeys = Object.keys(bitmapsData);

    const bmpFonts = bitmapsKeys
        .map((name) => {
            return `\n '${name}': '${name}'`;
        })
        .join(',');

    return `css: {${cssFonts}}, bitmap: {${bmpFonts}}`;
}

/* SOUNDS */
function processSoundsImport(dir: dirTree.DirectoryTree): string {
    const relPath = getRelativePath(dir.path);
    const paths = utils.getFiles(dir.path, { pattern: utils.globs.audio });

    return paths
        .map((p) => {
            const { name, base } = pt.parse(p);

            const soundURL = `require('${pt.join(relPath, base)}')`;
            const asset = `\n '${name}': ${soundURL}`;

            return asset;
        })
        .join(',');
}

function processSoundsExport(dir: dirTree.DirectoryTree): string {
    const paths = utils.getFiles(dir.path, { pattern: utils.globs.audio });

    return paths
        .map((p) => {
            const { name } = pt.parse(p);

            return `'${name}': '${name}'`;
        })
        .join(',');
}

/* PARTICLES */
function processParticlesImport(dir: dirTree.DirectoryTree): string {
    const relPath = getRelativePath(dir.path);
    const paths = utils.getFiles(dir.path, { pattern: utils.globs.json });

    return paths
        .map((p) => {
            const { name, base } = pt.parse(p);

            const particleURL = `require('${pt.join(relPath, base)}')`;
            const asset = `\n '${name}': ${particleURL}`;

            return asset;
        })
        .join(',');
}

function processParticlesExport(dir: dirTree.DirectoryTree): string {
    const paths = utils.getFiles(dir.path, { pattern: utils.globs.json });

    return paths
        .map((p) => {
            const { name } = pt.parse(p);

            return `'${name}': '${name}'`;
        })
        .join(',');
}

/* DATA */
function processJsonsImport(dir: dirTree.DirectoryTree): string {
    const relPath = getRelativePath(dir.path);
    const paths = utils.getFiles(dir.path, { pattern: utils.globs.json });

    return paths
        .map((p) => {
            const { name, base } = pt.parse(p);

            const particleURL = `require('${pt.join(relPath, base)}')`;
            const asset = `\n '${name}': ${particleURL}`;

            return asset;
        })
        .join(',');
}

function processJsonsExport(dir: dirTree.DirectoryTree): string {
    const paths = utils.getFiles(dir.path, { pattern: utils.globs.json });

    return paths
        .map((p) => {
            const { name } = pt.parse(p);

            return `'${name}': '${name}'`;
        })
        .join(',');
}
