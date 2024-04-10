import generateAssets from './generators/generate-assets';
import generateAtlases from './generators/generate-atlases';
import generateFonts from './generators/generate-fonts';
import generateImages from './generators/generate-images';
import generateJsons from './generators/generate-jsons';
import generateParticles from './generators/generate-particles';
import generateSounds from './generators/generate-sounds';
import utils from './utils';

(async (): Promise<void> => {
    await generateAtlases();
    utils.print('🏁 Atlases');

    await generateSounds();
    utils.print('🏁 Sounds');

    await generateImages();
    utils.print('🏁 Images');

    await generateJsons();
    utils.print('🏁 Jsons');

    await generateParticles();
    utils.print('🏁 Particles');

    await generateFonts();
    utils.print('🏁 Fonts');

    await generateAssets();
    utils.print('🏁 Assets');

    utils.print('');
})();
