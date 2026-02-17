import { ReactNative as RN } from "@vendetta/metro/common";
import { instead } from "@vendetta/patcher";

const moduleName = "NativeAudioManagerModule";
const functionsToPatch = ["setCommunicationModeOn", "setActiveAudioDevice"];
let patches = [];

export default {
    onLoad: () => {
        try {
            const registry = RN.TurboModuleRegistry;
            
            // 1. Try to find the module in TurboModuleRegistry (Touch this Discord and i'll make sure your boiler room explodes)
            const newModule = registry.get(moduleName);
            // 2. Fallback or additional check for NativeModules
            const oldModule = RN.NativeModules[moduleName];

            const targets = [newModule, oldModule].filter(m => m !== null && m !== undefined);

            if (targets.length === 0) {
                console.log(`[Bluetooth Fix] ${moduleName} not found.`);
                return;
            }

            for (const target of targets) {
                for (const func of functionsToPatch) {
                    if (typeof target[func] === "function") {
                        patches.push(instead(func, target, () => {
                        }));
                    }
                }
            }

            console.log(`[Bluetooth Fix] Applied ${patches.length} patches.`);
        } catch (e) {
            console.error("[Bluetooth Fix] Failed to patch:", e);
        }
    },

    onUnload: () => {
        // Why not :p
        for (const unpatch of patches) {
            unpatch();
        }
        patches = [];
    }
};
