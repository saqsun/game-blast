import { mono } from '../../../mono';
import { MainView } from '../../views';
import { initializeGameModelCommand } from './game/initialize-game-model-command';
import { mapGameActionsCommand } from './game/map-game-actions-command';
import { initializeUIModelCommand } from './ui/initialize-ui-model-command';

export const startupCommand = async (): Promise<void> => {
    const { app } = gameblast;
    const { pixi } = app;
    pixi.stage.addChild(new MainView());

    mono.command.execute(mapGameActionsCommand);

    mono.command.execute(initializeGameModelCommand);
    mono.command.execute(initializeUIModelCommand);
};
