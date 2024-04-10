# Simple Blast Game

This Game is a classic arcade-style game where players click on tiles to destroy them. By creating power-ups, players can destroy more tiles and advance through the game. The game features two power-ups: the cross bomb and the radial bomb, which enhance the player's ability to clear tiles.

## Key Features

-   **Multi-Orientation**: Play the game in both portrait and landscape orientations for a versatile gaming experience.
-   **Adaptive Design**: The game's layout and UI elements adjust dynamically to fit various screen sizes and resolutions, ensuring a seamless experience across devices.
-   **Cross-Platform Functionality**: Enjoy the game on multiple platforms, including desktops, tablets, and smartphones, thanks to its cross-platform compatibility.

## Tested Devices

The Game has been tested on the following devices:

-   iPhone 7, iOS 15.7.9
-   iPhone 11, iOS 17.3.1
-   Mi A3, Android 11
-   Galaxy A14, Android 12

## Prerequisites

Before running the game, make sure you have the following dependencies installed:

-   **Lame**: Lame is required for audio encoding. Install it using your package manager of choice.

    ```bash
    # For macOS using Homebrew
    $ brew install lame

    # For Ubuntu/Debian
    $ sudo apt-get install lame
    ```

-   **pnpm**: pnpm package manager

    ```bash
    $ curl -fsSL https://get.pnpm.io/install.sh | sh -
    ```

    If you don't have curl installed, you would like to use wget:

    ```bash
    $ wget -qO- https://get.pnpm.io/install.sh | sh -
    ```

Once you have installed Lame and pnpm, you can proceed with the installation and usage steps as mentioned below.

## Installation

To install dependencies and run the game, follow these steps:

1. Clone the repository:

    ```bash
    $ git clone https://github.com/saqsun/game-blast.git
    ```

2. Navigate to the project directory:

    ```bash
    $ cd game-blast
    ```

3. Install dependencies:

    ```bash
    $ pnpm install
    ```

4. Assemble assets:

    ```bash
    $ pnpm assetassemble
    ```

5. Start the game:

    ```bash
    $ pnpm start
    ```

    Or build the game for production:

    ```bash
    $ pnpm build
    ```

## Game Preview

You can play a preview of the game directly from the GitHub Pages:

[Game Preview](https://saqsun.github.io/game-blast/)

## License

This project is licensed under the [MIT License](LICENSE).
