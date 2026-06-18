// module/helpers.mjs

/**
 * Safely merge objects using Foundry's utility.
 */
export function mergeObject(target, source, options = {}) {
    return foundry.utils.mergeObject(target, source, options);
}