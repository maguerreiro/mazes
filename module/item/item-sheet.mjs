// module/item/item-sheet.mjs
import { mergeObject } from "../helpers.mjs";

export class MazesItemSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 500,
            height: 500,
            resizable: true,
            classes: ["mazes", "item-sheet"],
            template: "systems/mazes/templates/item/item-sheet.hbs",
            title: "Item"
        });
    }

    getData(options) {
        const context = super.getData(options);
        const item = this.item;
        context.name = item.name || item.getSheetTitle();
        context.system = item.system;
        context.type = item.type;
        context.isOwner = item.isOwner;
        context.editable = item.isOwner;
        const labels = { role: "Role", aspect: "Aspect", class: "Class", edge: "Edge" };
        context.typeLabel = labels[item.type] || "Item";
        context.dieSizes = ["d4", "d6", "d8", "d10"];
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        const item = this.item;

        html.find(".item-name-input").on("change", (event) => {
            const value = $(event.currentTarget).val();
            item.update({ name: value });
        });

        html.find(".die-size-select").on("change", (event) => {
            const value = $(event.currentTarget).val();
            item.update({ "system.dieSize": value });
        });

        html.find(".hearts-max-input").on("change", (event) => {
            const value = parseFloat($(event.currentTarget).val()) || 0;
            item.update({ "system.heartsMax": value });
        });

        html.find(".stars-max-input").on("change", (event) => {
            const value = parseFloat($(event.currentTarget).val()) || 0;
            item.update({ "system.starsMax": value });
        });

        html.find(".desc-textarea").on("change", (event) => {
            const value = $(event.currentTarget).val();
            item.update({ "system.description": value });
        });
    }

    get title() {
        return this.item.name || this.item.getSheetTitle();
    }
}