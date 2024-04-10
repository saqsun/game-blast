void (async () => {
    //
    const { splash, app } = gameblast;
    //
    const [startupModule] = await Promise.all([import('./game/state/commands/startup'), app.load()]);
    await app.start();
    //
    const { startupCommand } = startupModule;
    await startupCommand();
    //
    await splash.hide();
    //
})();
