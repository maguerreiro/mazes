// mazes.mjs
import { MazesActor } from "./module/actor/actor.mjs";
import { MazesCharacterSheet } from "./module/actor/character-sheet.mjs";
import { MazesHazardSheet } from "./module/actor/hazard-sheet.mjs";
import { MazesItem } from "./module/item/item.mjs";
import { MazesItemSheet } from "./module/item/item-sheet.mjs";
import { registerWidget } from "./module/widget.mjs";   // import widget registration
import { registerWidgetCommand } from "./module/roll.mjs"; // for chat command

// Attach sheets to actor class
MazesActor.characterSheet = MazesCharacterSheet;
MazesActor.hazardSheet = MazesHazardSheet;
MazesItem.sheet = MazesItemSheet;

Hooks.on("init", function () {
    console.log("Mazes RPG | Initializing system");

    game.settings.register("mazes", "widgetState", {
        name: "Widget State",
        scope: "client",
        config: false,
        type: Object,
        default: {
            minimized: false,
            darkness: 0,
            players: 0,
            treasure: 0,
            supply: 0
        }
    });

    CONFIG.Actor.documentClass = MazesActor;
    CONFIG.Item.documentClass = MazesItem;

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("mazes", MazesActor.characterSheet, {
        types: ["character"],
        label: "Mazes RPG Character",
        makeDefault: true
    });
    Actors.registerSheet("mazes", MazesActor.hazardSheet, {
        types: ["hazard"],
        label: "Mazes RPG Hazard",
        makeDefault: true
    });

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("mazes", MazesItem.sheet, {
        types: ["role", "aspect", "class", "edge"],
        label: "Mazes RPG Item",
        makeDefault: true
    });

    // Register chat command for widget (Ctrl+Shift+M also handled in widget module)
    registerWidgetCommand();

});

Hooks.on("ready", function () {
    // Initialize widget after world loads
    registerWidget();
});

