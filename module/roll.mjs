export function registerWidgetCommand() {
    Hooks.on("chatMessage", async (log, text, data) => {
        if (text === "/mazes-widget") {
            const { MazesWidget } = await import("./widget.mjs");
            const widget = MazesWidget.getInstance();
            if (widget) {
                widget.render(true);
            } else {
                new MazesWidget().render(true);
            }
            return false;
        }
        return true;
    });
}