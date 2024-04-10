/* eslint-disable */
// @ts-nocheck
import {
    BaseTexture,
    BitmapFont,
    BitmapFontData,
    IBitmapFontOptions,
    ITextStyle,
    TEXT_GRADIENT,
    TextMetrics,
    TextStyle,
    Texture,
    utils,
} from 'pixi.js';

/**
 * Generates the fill style. Can automatically generate a gradient based on the fill style being an array
 * @private
 * @param canvas
 * @param context
 * @param {object} style - The style.
 * @param resolution
 * @param {string[]} lines - The lines of text.
 * @param metrics
 * @returns {string|number|CanvasGradient} The fill style
 */

function generateFillStyle(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    style: TextStyle,
    resolution: number,
    lines: string[],
    metrics: TextMetrics,
): string | CanvasGradient | CanvasPattern {
    // TODO: Can't have different types for getter and setter. The getter shouldn't have the number type as
    //       the setter converts to string. See this thread for more details:
    //       https://github.com/microsoft/TypeScript/issues/2521
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fillStyle: string | string[] | CanvasGradient | CanvasPattern = style.fill as any;

    if (!Array.isArray(fillStyle)) {
        return fillStyle;
    } else if (fillStyle.length === 1) {
        return fillStyle[0];
    }

    // the gradient will be evenly spaced out according to how large the array is.
    // ['#FF0000', '#00FF00', '#0000FF'] would created stops at 0.25, 0.5 and 0.75
    let gradient: string[] | CanvasGradient;

    // a dropshadow will enlarge the canvas and result in the gradient being
    // generated with the incorrect dimensions
    const dropShadowCorrection = style.dropShadow ? style.dropShadowDistance : 0;

    // should also take padding into account, padding can offset the gradient
    const padding = style.padding || 0;

    const width = canvas.width / resolution - dropShadowCorrection - padding * 2;
    const height = canvas.height / resolution - dropShadowCorrection - padding * 2;

    // make a copy of the style settings, so we can manipulate them later
    const fill = fillStyle.slice();
    const fillGradientStops = style.fillGradientStops.slice();

    // wanting to evenly distribute the fills. So an array of 4 colours should give fills of 0.25, 0.5 and 0.75
    if (fillGradientStops.length === 0) {
        const lengthPlus1 = fill.length + 1;

        for (let i = 1; i < lengthPlus1; ++i) {
            fillGradientStops.push(i / lengthPlus1);
        }
    }

    // stop the bleeding of the last gradient on the line above to the top gradient of the this line
    // by hard defining the first gradient colour at point 0, and last gradient colour at point 1
    fill.unshift(fillStyle[0]);
    fillGradientStops.unshift(0);

    fill.push(fillStyle[fillStyle.length - 1]);
    fillGradientStops.push(1);

    if (style.fillGradientType === TEXT_GRADIENT.LINEAR_VERTICAL) {
        // start the gradient at the top center of the canvas, and end at the bottom middle of the canvas
        gradient = context.createLinearGradient(width / 2, padding, width / 2, height + padding);

        // we need to repeat the gradient so that each individual line of text has the same vertical gradient effect
        // ['#FF0000', '#00FF00', '#0000FF'] over 2 lines would create stops at 0.125, 0.25, 0.375, 0.625, 0.75, 0.875

        // There's potential for floating point precision issues at the seams between gradient repeats.
        // The loop below generates the stops in order, so track the last generated one to prevent
        // floating point precision from making us go the teeniest bit backwards, resulting in
        // the first and last colors getting swapped.
        let lastIterationStop = 0;

        // Actual height of the text itself, not counting spacing for lineHeight/leading/dropShadow etc
        const textHeight = metrics.fontProperties.fontSize + style.strokeThickness;

        // textHeight, but as a 0-1 size in global gradient stop space
        const gradStopLineHeight = textHeight / height;

        for (let i = 0; i < lines.length; i++) {
            const thisLineTop = metrics.lineHeight * i;

            for (let j = 0; j < fill.length; j++) {
                // 0-1 stop point for the current line, multiplied to global space afterwards
                let lineStop = 0;

                if (typeof fillGradientStops[j] === 'number') {
                    lineStop = fillGradientStops[j];
                } else {
                    lineStop = j / fill.length;
                }

                const globalStop = thisLineTop / height + lineStop * gradStopLineHeight;

                // Prevent color stop generation going backwards from floating point imprecision
                let clampedStop = Math.max(lastIterationStop, globalStop);

                clampedStop = Math.min(clampedStop, 1); // Cap at 1 as well for safety's sake to avoid a possible throw.
                gradient.addColorStop(clampedStop, fill[j]);
                lastIterationStop = clampedStop;
            }
        }
    } else {
        // start the gradient at the center left of the canvas, and end at the center right of the canvas
        gradient = context.createLinearGradient(padding, height / 2, width + padding, height / 2);

        // can just evenly space out the gradients in this case, as multiple lines makes no difference
        // to an even left to right gradient
        const totalIterations = fill.length + 1;
        let currentIteration = 1;

        for (let i = 0; i < fill.length; i++) {
            let stop: number;

            if (typeof fillGradientStops[i] === 'number') {
                stop = fillGradientStops[i];
            } else {
                stop = currentIteration / totalIterations;
            }
            gradient.addColorStop(stop, fill[i]);
            currentIteration++;
        }
    }

    return gradient;
}

/**
 * Draws the glyph `metrics.text` on the given canvas.
 *
 * Ignored because not directly exposed.
 * @ignore
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} context
 * @param {TextMetrics} metrics
 * @param {number} x
 * @param {number} y
 * @param {number} resolution
 * @param {TextStyle} style
 */

function drawGlyph(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    metrics: TextMetrics,
    x: number,
    y: number,
    resolution: number,
    style: TextStyle,
): void {
    const char = metrics.text;
    const fontProperties = metrics.fontProperties;

    context.translate(x, y);
    context.scale(resolution, resolution);

    const tx = style.strokeThickness / 2;
    const ty = -(style.strokeThickness / 2);

    context.font = style.toFontString();
    context.lineWidth = style.strokeThickness;
    context.textBaseline = style.textBaseline;
    context.lineJoin = style.lineJoin;
    context.miterLimit = style.miterLimit;

    // set canvas text styles
    context.fillStyle = generateFillStyle(canvas, context, style, resolution, [char], metrics);
    context.strokeStyle = style.stroke as string;

    if (style.dropShadow) {
        const dropShadowColor = style.dropShadowColor;
        const rgb = utils.hex2rgb(
            typeof dropShadowColor === 'number' ? dropShadowColor : utils.string2hex(dropShadowColor),
        );
        const dropShadowBlur = style.dropShadowBlur * resolution;
        const dropShadowDistance = style.dropShadowDistance * resolution;

        context.shadowColor = `rgba(${rgb[0] * 255},${rgb[1] * 255},${rgb[2] * 255},${style.dropShadowAlpha})`;
        context.shadowBlur = dropShadowBlur;
        context.shadowOffsetX = Math.cos(style.dropShadowAngle) * dropShadowDistance;
        context.shadowOffsetY = Math.sin(style.dropShadowAngle) * dropShadowDistance;
    } else {
        context.shadowColor = 'black';
        context.shadowBlur = 0;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
    }

    if (style.stroke && style.strokeThickness) {
        context.strokeText(char, tx, ty + metrics.lineHeight - fontProperties.descent);
    }
    if (style.fill) {
        context.fillText(char, tx, ty + metrics.lineHeight - fontProperties.descent);
    }

    context.setTransform(1, 0, 0, 1, 0, 0); // defaults needed for older browsers (e.g. Opera 29)

    context.fillStyle = 'rgba(0, 0, 0, 0)';
}

/**
 * Ponyfill for IE because it doesn't support `Array.from`
 * @param text
 * @private
 */

function splitTextToCharacters(text: string): string[] {
    return Array.from ? Array.from(text) : text.split('');
}

/**
 * Processes the passed character set data and returns a flattened array of all the characters.
 *
 * Ignored because not directly exposed.
 * @ignore
 * @param {string | string[] | string[][] } chars
 * @returns {string[]} the flattened array of characters
 */

function resolveCharacters(chars: string | Array<string | string[]>): string[] {
    // Split the chars string into individual characters
    if (typeof chars === 'string') {
        chars = [chars];
    }

    // Handle an array of characters+ranges
    const result: string[] = [];

    for (let i = 0, j = chars.length; i < j; i++) {
        const item = chars[i];

        // Handle range delimited by start/end chars
        if (Array.isArray(item)) {
            if (item.length !== 2) {
                throw new Error(`[BitmapFont]: Invalid character range length, expecting 2 got ${item.length}.`);
            }

            const startCode = item[0].charCodeAt(0);
            const endCode = item[1].charCodeAt(0);

            if (endCode < startCode) {
                throw new Error('[BitmapFont]: Invalid character range.');
            }

            for (let i = startCode, j = endCode; i <= j; i++) {
                result.push(String.fromCharCode(i));
            }
        }
        // Handle a character set string
        else {
            result.push(...splitTextToCharacters(item));
        }
    }

    if (result.length === 0) {
        throw new Error('[BitmapFont]: Empty set when resolving characters.');
    }

    return result;
}

/**
 * Ponyfill for IE because it doesn't support `codePointAt`
 * @param str
 * @private
 */

function extractCharCode(str: string): number {
    return str.codePointAt ? str.codePointAt(0) : str.charCodeAt(0);
}

/**
 * Generates a bitmap-font for the given style and character set. This does not support
 * kernings yet. With `style` properties, only the following non-layout properties are used:
 *
 * - {@link PIXI.TextStyle#dropShadow|dropShadow}
 * - {@link PIXI.TextStyle#dropShadowDistance|dropShadowDistance}
 * - {@link PIXI.TextStyle#dropShadowColor|dropShadowColor}
 * - {@link PIXI.TextStyle#dropShadowBlur|dropShadowBlur}
 * - {@link PIXI.TextStyle#dropShadowAngle|dropShadowAngle}
 * - {@link PIXI.TextStyle#fill|fill}
 * - {@link PIXI.TextStyle#fillGradientStops|fillGradientStops}
 * - {@link PIXI.TextStyle#fillGradientType|fillGradientType}
 * - {@link PIXI.TextStyle#fontFamily|fontFamily}
 * - {@link PIXI.TextStyle#fontSize|fontSize}
 * - {@link PIXI.TextStyle#fontVariant|fontVariant}
 * - {@link PIXI.TextStyle#fontWeight|fontWeight}
 * - {@link PIXI.TextStyle#lineJoin|lineJoin}
 * - {@link PIXI.TextStyle#miterLimit|miterLimit}
 * - {@link PIXI.TextStyle#stroke|stroke}
 * - {@link PIXI.TextStyle#strokeThickness|strokeThickness}
 * - {@link PIXI.TextStyle#textBaseline|textBaseline}
 * @param name - The name of the custom font to use with BitmapText.
 * @param textStyle - Style options to render with BitmapFont.
 * @param options - Setup options for font or name of the font.
 * @param {string|string[]|string[][]} [options.chars=PIXI.BitmapFont.ALPHANUMERIC] - characters included
 *      in the font set. You can also use ranges. For example, `[['a', 'z'], ['A', 'Z'], "!@#$%^&*()~{}[] "]`.
 *      Don't forget to include spaces ' ' in your character set!
 * @param {number} [options.resolution=1] - Render resolution for glyphs.
 * @param {number} [options.textureWidth=512] - Optional width of atlas, smaller values to reduce memory.
 * @param {number} [options.textureHeight=512] - Optional height of atlas, smaller values to reduce memory.
 * @param {number} [options.padding=4] - Padding between glyphs on texture atlas.
 * @returns Font generated by style options.
 * @example
 * PIXI.BitmapFont.from("TitleFont", {
 *     fontFamily: "Arial",
 *     fontSize: 12,
 *     strokeThickness: 2,
 *     fill: "purple"
 * });
 *
 * const title = new PIXI.BitmapText("This is the title", { fontName: "TitleFont" });
 */

export function fastFrom(
    name: string,
    textStyle?: TextStyle | Partial<ITextStyle>,
    options?: IBitmapFontOptions,
    bruteForceKerning = false,
): BitmapFont {
    if (!name) {
        throw new Error('[BitmapFont] Property `name` is required.');
    }

    const { chars, padding, resolution, textureWidth, textureHeight } = Object.assign(
        {},
        BitmapFont.defaultOptions,
        options,
    );

    const charsList = resolveCharacters(chars);
    const style = textStyle instanceof TextStyle ? textStyle : new TextStyle(textStyle);
    const lineWidth = textureWidth;
    const fontData = new BitmapFontData();

    fontData.info[0] = {
        face: style.fontFamily as string,
        size: style.fontSize as number,
    };
    fontData.common[0] = {
        lineHeight: style.fontSize as number,
    };

    let positionX = 0;
    let positionY = 0;

    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    let baseTexture: BaseTexture;
    let maxCharHeight = 0;
    const baseTextures: BaseTexture[] = [];
    const textures: Texture[] = [];

    for (let i = 0; i < charsList.length; i++) {
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.width = textureWidth;
            canvas.height = textureHeight;

            context = canvas.getContext('2d');
            baseTexture = new BaseTexture(canvas, { resolution });

            baseTextures.push(baseTexture);
            textures.push(new Texture(baseTexture));

            fontData.page.push({
                id: textures.length - 1,
                file: '',
            });
        }

        // Measure glyph dimensions
        const metrics = TextMetrics.measureText(charsList[i], style, false, canvas);
        const width = metrics.width;
        const height = Math.ceil(metrics.height);

        // This is ugly - but italics are given more space so they don't overlap
        const textureGlyphWidth = Math.ceil((style.fontStyle === 'italic' ? 2 : 1) * width);

        // Can't fit char anymore: next canvas please!
        if (positionY >= textureHeight - height * resolution) {
            if (positionY === 0) {
                // We don't want user debugging an infinite loop (or do we? :)
                throw new Error(
                    `[BitmapFont] textureHeight ${textureHeight}px is ` + `too small for ${style.fontSize}px fonts`,
                );
            }

            --i;

            // Create new atlas once current has filled up
            canvas = null;
            context = null;
            baseTexture = null;
            positionY = 0;
            positionX = 0;
            maxCharHeight = 0;

            continue;
        }

        maxCharHeight = Math.max(height + metrics.fontProperties.descent, maxCharHeight);

        // Wrap line once full row has been rendered
        if (textureGlyphWidth * resolution + positionX >= lineWidth) {
            --i;
            positionY += maxCharHeight * resolution;
            positionY = Math.ceil(positionY);
            positionX = 0;
            maxCharHeight = 0;

            continue;
        }

        drawGlyph(canvas, context, metrics, positionX, positionY, resolution, style);

        // Unique (numeric) ID mapping to this glyph
        const id = extractCharCode(metrics.text);

        // Create a texture holding just the glyph
        fontData.char.push({
            id,
            page: textures.length - 1,
            x: positionX / resolution,
            y: positionY / resolution,
            width: textureGlyphWidth,
            height,
            xoffset: 0,
            yoffset: 0,
            xadvance: Math.ceil(
                width - (style.dropShadow ? style.dropShadowDistance : 0) - (style.stroke ? style.strokeThickness : 0),
            ),
        });

        positionX += (textureGlyphWidth + 2 * padding) * resolution;
        positionX = Math.ceil(positionX);
    }

    if (bruteForceKerning) {
        // Brute-force kerning info, this can be expensive b/c it's an O(n²),
        // but we're using measureText which is native and fast.
        for (let i = 0, len = charsList.length; i < len; i++) {
            const first = charsList[i];

            for (let j = 0; j < len; j++) {
                const second = charsList[j];
                const c1 = context.measureText(first).width;
                const c2 = context.measureText(second).width;
                const total = context.measureText(first + second).width;
                const amount = total - (c1 + c2);

                if (amount) {
                    fontData.kerning.push({
                        first: extractCharCode(first),
                        second: extractCharCode(second),
                        amount,
                    });
                }
            }
        }
    }

    const font = new BitmapFont(fontData, textures, true);

    // Make it easier to replace a font
    if (BitmapFont.available[name] !== undefined) {
        BitmapFont.uninstall(name);
    }

    BitmapFont.available[name] = font;

    return font;
}
