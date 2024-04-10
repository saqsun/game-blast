/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/naming-convention */

export default {
    atlases: {
        blast: {
            json: require('/assets/atlas/blast.json'),
            image: require('/assets/atlas/blast.png'),
        },
        ui: {
            json: require('/assets/atlas/ui.json'),
            image: require('/assets/atlas/ui.png'),
        },
    },

    fonts: { Marvin: require('/assets/font/Marvin.woff2') },

    bitmapFonts: require('/assets/font/bitmaps.json'),

    images: {},

    jsons: {},

    particles: {
        'rocket-ignite': require('/assets/particles/rocket-ignite.json'),
    },

    sounds: {
        burst: require('/assets/sound/burst.mp3'),
        sfx: require('/assets/sound/sfx.mp3'),
    },
};
