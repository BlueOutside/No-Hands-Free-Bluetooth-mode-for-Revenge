(() => {
    const { metro, patcher } = vendetta;
    const { ReactNative: RN } = metro.common;
    
    const moduleName = "NativeAudioManagerModule";
    const functionsToPatch = ["setCommunicationModeOn", "setActiveAudioDevice"];
    let patches = [];

    return {
        onLoad: () => {
            try {
                const registry = RN.TurboModuleRegistry;
                const newModule = registry.get(moduleName);
                const oldModule = RN.NativeModules[moduleName];

                // Filter out null/undefined modules
                const targets = [newModule, oldModule].filter(m => !!m);

                if (targets.length === 0) {
                    console.log("[Bluetooth Fix] Audio module not found.");
                    return;
                }

                for (const target of targets) {
                    for (const func of functionsToPatch) {
                        if (typeof target[func] === "function") {
                            // patcher.instead returns the unpatch function
                            patches.push(patcher.instead(func, target, () => {
                                // Effectively disables the function
                            }));
                        }
                    }
                }
                console.log(`[Bluetooth Fix] Applied ${patches.length} patches.`);
            } catch (e) {
                console.error("[Bluetooth Fix] Load Error:", e);
            }
        },
        onUnload: () => {
            patches.forEach(unpatch => unpatch());
            patches = [];
            console.log("[Bluetooth Fix] Unloaded and patches removed.");
        }
    };
})()
