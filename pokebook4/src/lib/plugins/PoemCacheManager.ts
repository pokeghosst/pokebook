import type { PoemCacheManagerPlugin } from "./PoemCacheManagerPlugin";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pluginPromise: any;

async function getImplementation() {
  if (!pluginPromise) {
    if (window.__TAURI_INTERNALS__) {
      return null;
      // pluginPromise = import('./FilesystemTauri').then((m) => new m.FilesystemTauri());
    } else {
      pluginPromise = import("./PoemCacheManagerWeb").then(
        (m) => new m.PoemCacheManagerWeb()
      );
    }
  }
  return pluginPromise;
}

export const PoemCacheManager = new Proxy(
  {},
  {
    get(_, prop) {
      return async (...args: unknown[]) => {
        const impl = await getImplementation();
        const method = impl[prop];
        if (typeof method === "function") {
          return method.apply(impl, args);
        } else {
          throw new Error(
            `Method ${String(prop)} does not exist on implementation`
          );
        }
      };
    },
  }
) as PoemCacheManagerPlugin;
