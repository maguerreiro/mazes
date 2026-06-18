// module/actor/hazard-sheet.mjs
import { mergeObject } from "../helpers.mjs";

export class MazesHazardSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 720,
            height: 650,
            resizable: true,
            classes: ["mazes", "hazard-sheet"],
            template: "systems/mazes/templates/actor/hazard-sheet.hbs",
            title: "Hazard"
        });
    }

    getData(options) {
        const context = super.getData(options);
        const actor = this.actor;
        context.name = actor.name || "Hazard";
        context.system = actor.system;
        context.conditions = actor.system.conditions || {};

        const edgeItems = [];
        const edgeIds = actor.system.edges || [];
        for (const id of edgeIds) {
            const item = game.items.get(id);
            if (item) edgeItems.push(item);
        }
        context.edges = edgeItems;

        context.isOwner = actor.isOwner;
        context.editable = actor.isOwner;
        context.activeTab = this._activeTab || "sheet";
        context.tabs = [
            { id: "sheet", label: "Sheet" },
            { id: "conditions", label: "Conditions" }
        ];
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        const actor = this.actor;

        html.find(".tab-button").on("click", (event) => {
            const tab = $(event.currentTarget).data("tab");
            this._activeTab = tab;
            this.render();
        });

        html.find(".condition-toggle").on("click", (event) => {
            const key = $(event.currentTarget).data("key");
            const current = actor.system.conditions[key] || false;
            actor.update({ [`system.conditions.${key}`]: !current });
        });

        html.find(".custom-condition-name").on("change", (event) => {
            const index = $(event.currentTarget).data("index");
            const value = $(event.currentTarget).val();
            actor.update({ [`system.conditions.custom${index}.name`]: value });
        });
        html.find(".custom-condition-text").on("change", (event) => {
            const index = $(event.currentTarget).data("index");
            const value = $(event.currentTarget).val();
            actor.update({ [`system.conditions.custom${index}.text`]: value });
        });

        html.find(".resource-input").on("change", (event) => {
            const field = $(event.currentTarget).data("field");
            const value = parseFloat($(event.currentTarget).val()) || 0;
            actor.update({ [`system.${field}`]: value });
        });
        html.find(".resource-value-input").on("change", (event) => {
            const field = $(event.currentTarget).data("field");
            const value = parseFloat($(event.currentTarget).val()) || 0;
            actor.update({ [`system.${field}.value`]: value });
        });
        html.find(".resource-max-input").on("change", (event) => {
            const field = $(event.currentTarget).data("field");
            const value = parseFloat($(event.currentTarget).val()) || 0;
            actor.update({ [`system.${field}.max`]: value });
        });

        html.find(".actor-name-input").on("change", (event) => {
            const value = $(event.currentTarget).val();
            actor.update({ name: value });
        });

        html.find(".desc-toggle").on("click", (event) => {
            const target = $(event.currentTarget).data("target");
            const content = html.find(`.desc-content-${target}`);
            const icon = $(event.currentTarget).find(".desc-icon");
            content.slideToggle(200);
            icon.text(content.is(":visible") ? "▼" : "▶");
        });

        html.find(".edit-edge-btn").on("click", (event) => {
            const edgeId = $(event.currentTarget).data("id");
            const item = game.items.get(edgeId);
            if (item) item.sheet.render(true);
        });

        html.find(".edge-drop-zone").on("dragover", (event) => event.preventDefault());
        html.find(".edge-drop-zone").on("drop", (event) => {
            event.preventDefault();
            const data = JSON.parse(event.originalEvent.dataTransfer.getData("text/plain"));
            if (data.type === "Item" && data.documentType === "edge") {
                const item = game.items.get(data.id);
                if (item) {
                    const current = actor.system.edges || [];
                    if (!current.includes(item.id)) {
                        current.push(item.id);
                        actor.update({ "system.edges": current });
                    }
                }
            }
        });
        html.find(".edge-item .edge-name").on("dblclick", (event) => {
            const id = $(event.currentTarget).closest(".edge-item").data("id");
            const current = actor.system.edges || [];
            const updated = current.filter(e => e !== id);
            actor.update({ "system.edges": updated });
        });

        html.find(".hazard-description-editor").on("change", (event) => {
            const value = $(event.currentTarget).val();
            actor.update({ "system.description": value });
        });
    }

    get title() {
        return this.actor.name || "Hazard";
    }
}