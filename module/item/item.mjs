// module/item/item.mjs

export class MazesItem extends Item {
    prepareSystemData() {
        const system = this.system;
        const type = this.type;
        if (type === "role") {
            if (!system.dieSize) system.dieSize = "d4";
            if (!system.heartsMax) system.heartsMax = 4;
            if (!system.starsMax) system.starsMax = 4;
            if (!system.description) system.description = "";
        } else if (["aspect", "class", "edge"].includes(type)) {
            if (!system.description) system.description = "";
        }
    }

    getSheetTitle() {
        const map = { role: "Role", aspect: "Aspect", class: "Class", edge: "Edge" };
        return map[this.type] || "Item";
    }
}