class Splash implements ISplash {
    private readonly _splash: HTMLDivElement;

    public constructor() {
        this._splash = document.getElementById('splash_screen') as HTMLDivElement;
        this.show();
    }

    public async show(): Promise<void> {
        await this._createBrandLogo();
    }

    public async hide(): Promise<void> {
        this._splash.remove();
    }

    private async _createBrandLogo(): Promise<void> {
        return new Promise((resolve) => {
            const brand = new Image();
            brand.onload = () => {
                brand.classList.add('brand-logo');
                this._splash.appendChild(brand);
                resolve();
            };
            brand.src = logoSrc;
        });
    }
}

const logoSrc =
    'data:image/svg+xml;base64,77u/PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMDAgMTUwJz48cGF0aCBmaWxsPSdub25lJyBzdHJva2U9JyNGRjE1NkQnIHN0cm9rZS13aWR0aD0nMTUnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgc3Ryb2tlLWRhc2hhcnJheT0nMzAwIDM4NScgc3Ryb2tlLWRhc2hvZmZzZXQ9JzAnIGQ9J00yNzUgNzVjMCAzMS0yNyA1MC01MCA1MC01OCAwLTkyLTEwMC0xNTAtMTAwLTI4IDAtNTAgMjItNTAgNTBzMjMgNTAgNTAgNTBjNTggMCA5Mi0xMDAgMTUwLTEwMCAyNCAwIDUwIDE5IDUwIDUwWic+PGFuaW1hdGUgYXR0cmlidXRlTmFtZT0nc3Ryb2tlLWRhc2hvZmZzZXQnIGNhbGNNb2RlPSdzcGxpbmUnIGR1cj0nMicgdmFsdWVzPSc2ODU7LTY4NScga2V5U3BsaW5lcz0nMCAwIDEgMScgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnPjwvYW5pbWF0ZT48L3BhdGg+PC9zdmc+';

gameblast.splash = new Splash();
