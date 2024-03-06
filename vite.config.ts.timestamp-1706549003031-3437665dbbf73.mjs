// vite.config.ts
import { sveltekit } from "file:///home/alex/Documents/Repositories/pokebook/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import topLevelAwait from "file:///home/alex/Documents/Repositories/pokebook/node_modules/vite-plugin-top-level-await/exports/import.mjs";
import { defineConfig } from "file:///home/alex/Documents/Repositories/pokebook/node_modules/vite/dist/node/index.js";
var vite_config_default = defineConfig({
  plugins: [
    sveltekit(),
    topLevelAwait({
      promiseExportName: "__tla",
      promiseImportName: (i) => `__tla_${i}`
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9hbGV4L0RvY3VtZW50cy9SZXBvc2l0b3JpZXMvcG9rZWJvb2tcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2FsZXgvRG9jdW1lbnRzL1JlcG9zaXRvcmllcy9wb2tlYm9vay92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9hbGV4L0RvY3VtZW50cy9SZXBvc2l0b3JpZXMvcG9rZWJvb2svdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBzdmVsdGVraXQgfSBmcm9tICdAc3ZlbHRlanMva2l0L3ZpdGUnO1xuaW1wb3J0IHRvcExldmVsQXdhaXQgZnJvbSAndml0ZS1wbHVnaW4tdG9wLWxldmVsLWF3YWl0JztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuXHRwbHVnaW5zOiBbXG5cdFx0c3ZlbHRla2l0KCksXG5cdFx0dG9wTGV2ZWxBd2FpdCh7XG5cdFx0XHRwcm9taXNlRXhwb3J0TmFtZTogJ19fdGxhJyxcblx0XHRcdHByb21pc2VJbXBvcnROYW1lOiAoaSkgPT4gYF9fdGxhXyR7aX1gXG5cdFx0fSlcblx0XVxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdULFNBQVMsaUJBQWlCO0FBQzFVLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMsb0JBQW9CO0FBRTdCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzNCLFNBQVM7QUFBQSxJQUNSLFVBQVU7QUFBQSxJQUNWLGNBQWM7QUFBQSxNQUNiLG1CQUFtQjtBQUFBLE1BQ25CLG1CQUFtQixDQUFDLE1BQU0sU0FBUyxDQUFDO0FBQUEsSUFDckMsQ0FBQztBQUFBLEVBQ0Y7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=