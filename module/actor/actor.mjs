// module/actor/actor.mjs

export class MazesActor extends Actor {
    prepareDerivedData() {
        const system = this.system;
        // Character fields
        if (!system.hearts) system.hearts = { value: 4, max: 4 };
        if (!system.stars) system.stars = { value: 4, max: 4 };
        if (system.gears === undefined) system.gears = 0;
        if (system.lore === undefined) system.lore = 0;
        if (system.wealth === undefined) system.wealth = 0;
        if (!system.lifestyle) system.lifestyle = "copper";
        if (!system.concept) system.concept = "";
        if (!system.notes) system.notes = "";
        if (!system.roleId) system.roleId = null;
        if (!system.aspectId) system.aspectId = null;
        if (!system.classId) system.classId = null;
        if (!system.edgeId) system.edgeId = null;

        // Conditions
        if (!system.conditions) {
            system.conditions = {
                stressed: false,
                tired: false,
                hurt: false,
                hungry: false,
                burdened: false,
                veteran: false,
                marked: false,
                wounded: false,
                down: false,
                woundedDetail: "",
                custom1: { name: "", text: "" },
                custom2: { name: "", text: "" },
                custom3: { name: "", text: "" }
            };
        }

        // Hazard fields
        if (this.type === "hazard") {
            if (system.danger === undefined) system.danger = 1;
            if (!system.edges) system.edges = [];
            if (!system.description) system.description = "";
        }
    }

    // Helper methods
    getRole() {
        const id = this.system.roleId;
        return id ? game.items.get(id) : null;
    }
    getAspect() {
        const id = this.system.aspectId;
        return id ? game.items.get(id) : null;
    }
    getClass() {
        const id = this.system.classId;
        return id ? game.items.get(id) : null;
    }
    getEdge() {
        const id = this.system.edgeId;
        return id ? game.items.get(id) : null;
    }
    getDieSizeString() {
        const role = this.getRole();
        return role ? (role.system.dieSize || "d4") : "d4";
    }
}