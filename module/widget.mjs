// module/widget.mjs
import { mergeObject } from "./helpers.mjs";

export class MazesWidget extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/mazes/templates/widget.hbs",
            classes: ["mazes-widget"],
            width: 280,
            height: 250,            // fixed height, not "auto"
            resizable: false,       // disables the resize handle
            minimizable: false,     // we have our own minimize button
            position: { left: 20, bottom: 20 },
            // Additional constraints to prevent resizing
            minHeight: 250,
            maxHeight: 250,
            minWidth: 280,
            maxWidth: 280,
        });
    }

    static instance = null;

    constructor(options = {}) {
        super(options);
        this._minimized = false;
        this._state = game.settings.get("mazes", "widgetState") || {
            minimized: false,
            darkness: 0,
            players: 0,
            treasure: 0,
            supply: 0
        };
        this._minimized = this._state.minimized || false;
        MazesWidget.instance = this;
    }

    static getInstance() {
        return MazesWidget.instance;
    }

    getData() {
        const data = super.getData();
        data.minimized = this._minimized;
        data.state = this._state;

        const darkness = this._state.darkness || 0;
        data.darknessLabel = darkness <= 3 ? "Bright" : darkness <= 6 ? "Torchlit" : "Dark";

        const players = this._state.players || 0;
        const treasure = this._state.treasure || 0;
        data.treasureLabel = players === 0 ? "No players" : treasure < players ? "Skint" : treasure > players * 2 ? "Encumbered" : "Comfortable";

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find(".widget-toggle").on("click", () => this.toggleMinimize());

        const updateField = (field, delta) => {
            this._state[field] = Math.max(0, (this._state[field] || 0) + delta);
            this.saveState();
            this.render();
        };

        html.find(".darkness-inc").on("click", () => updateField("darkness", 1));
        html.find(".darkness-dec").on("click", () => updateField("darkness", -1));
        html.find(".players-inc").on("click", () => updateField("players", 1));
        html.find(".players-dec").on("click", () => updateField("players", -1));
        html.find(".treasure-inc").on("click", () => updateField("treasure", 1));
        html.find(".treasure-dec").on("click", () => updateField("treasure", -1));
        html.find(".supply-inc").on("click", () => updateField("supply", 1));
        html.find(".supply-dec").on("click", () => updateField("supply", -1));

        html.find(".widget-input").on("change", (event) => {
            const field = $(event.currentTarget).data("field");
            const value = parseInt($(event.currentTarget).val()) || 0;
            if (field) {
                this._state[field] = Math.max(0, value);
                this.saveState();
                this.render();
            }
        });
    }

    toggleMinimize() {
        this._minimized = !this._minimized;
        this._state.minimized = this._minimized;
        this.saveState();
        this.render();
    }

    toggleVisibility() {
        if (!this.rendered) {
            this.render(true);
            return;
        }
        const el = this.element;
        if (el) {
            if (el.css("display") === "none") {
                el.css("display", "");
            } else {
                el.css("display", "none");
            }
        }
    }

    saveState() {
        game.settings.set("mazes", "widgetState", this._state);
    }

    get title() {
        return "Mazes Widget";
    }
}

export function registerWidget() {
    if (MazesWidget.instance) {
        MazesWidget.instance.render(true);
        return;
    }
    const widget = new MazesWidget();
    widget.render(true);
}

// Keyboard shortcut handler
document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === "M") {
        event.preventDefault();
        const widget = MazesWidget.getInstance();
        if (widget) {
            widget.toggleVisibility();
        } else {
            new MazesWidget().render(true);
        }
    }
});