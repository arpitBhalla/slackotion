enum Actions {
  select_db = "select_db",
}
export default Actions;

// @index('./*', f => `export * from '${f.path}'`)
export * from "./select";
// @endindex
