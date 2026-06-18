// module/actor/character-sheet.mjs
import { mergeObject } from "../helpers.mjs";

export class MazesCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 780,
            height: 700,
            resizable: true,
            classes: ["mazes", "character-sheet"],
            template: "systems/mazes/templates/actor/character-sheet.hbs",
            title: "Character"
        });
    }

    getData(options) {
        const context = super.getData(options);
        const actor = this.actor;
        context.name = actor.name || "Character";
        context.system = actor.system;
        context.role = actor.getRole();
        context.aspect = actor.getAspect();
        context.class = actor.getClass();
        context.edge = actor.getEdge();
        context.dieSize = actor.getDieSizeString();
        context.conditions = actor.system.conditions || {};
        context.isOwner = actor.isOwner;
        context.editable = actor.isOwner;
        context.activeTab = this._activeTab || "sheet";
        context.tabs = [
            { id: "sheet", label: "Sheet" },
            { id: "conditions", label: "Conditions" },
            { id: "notes", label: "Notes" }
        ];
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        const actor = this.actor;

        // Tab switching
        html.find(".tab-button").on("click", (event) => {
            const tab = $(event.currentTarget).data("tab");
            this._activeTab = tab;
            this.render();
        });

        // Condition toggles
        html.find(".condition-toggle").on("click", (event) => {
            const key = $(event.currentTarget).data("key");
            const current = actor.system.conditions[key] || false;
            actor.update({ [`system.conditions.${key}`]: !current });
        });

        // Custom condition fields
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
        html.find(".wounded-detail").on("change", (event) => {
            const value = $(event.currentTarget).val();
            actor.update({ "system.conditions.woundedDetail": value });
        });

        // Resource inputs
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

        // Name, concept, lifestyle
        html.find(".actor-name-input").on("change", (event) => {
            const value = $(event.currentTarget).val();
            actor.update({ name: value });
        });
        html.find(".concept-input").on("change", (event) => {
            const value = $(event.currentTarget).val();
            actor.update({ "system.concept": value });
        });
        html.find(".lifestyle-input").on("change", (event) => {
            const value = $(event.currentTarget).val();
            actor.update({ "system.lifestyle": value });
        });

        // Notes editor (simple textarea)
        html.find(".notes-editor").on("change", (event) => {
            const value = $(event.currentTarget).val();
            actor.update({ "system.notes": value });
        });

        // Description toggles for items
        html.find(".desc-toggle").on("click", (event) => {
            const target = $(event.currentTarget).data("target");
            const content = html.find(`.desc-content-${target}`);
            const icon = $(event.currentTarget).find(".desc-icon");
            content.slideToggle(200);
            icon.text(content.is(":visible") ? "▼" : "▶");
        });

        // Drag & drop for item slots
        html.find(".item-slot").on("dragover", (event) => event.preventDefault());
        html.find(".item-slot").on("drop", (event) => {
            event.preventDefault();
            const slot = $(event.currentTarget).data("slot");
            const data = JSON.parse(event.originalEvent.dataTransfer.getData("text/plain"));
            if (data.type === "Item" && data.documentType === slot) {
                const item = game.items.get(data.id);
                if (item) actor.update({ [`system.${slot}Id`]: item.id });
            }
        });
        html.find(".item-slot .item-name").on("dblclick", (event) => {
            const slot = $(event.currentTarget).closest(".item-slot").data("slot");
            actor.update({ [`system.${slot}Id`]: null });
        });

        // Edit description button
        html.find(".edit-desc-btn").on("click", (event) => {
            const slot = $(event.currentTarget).data("slot");
            const item = actor[`get${slot.charAt(0).toUpperCase() + slot.slice(1)}`]();
            if (item) item.sheet.render(true);
        });

        // Action buttons – simple chat message
        html.find(".action-button, .effect-button, .chaos-button").on("click", (event) => {
            const action = $(event.currentTarget).data("action") || "Action";
            ChatMessage.create({
                content: `<b>${action}</b> rolled (automation disabled)`,
                speaker: ChatMessage.getSpeaker({ actor })
            });
        });
    }

    get title() {
        return this.actor.name || "Character";
    }
}