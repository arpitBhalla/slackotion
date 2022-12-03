enum Commands {
  save = "/save",
  select = "/select",
  logout = "/logout",
}

export default Commands;

// @index('./*', f => `export * from '${f.path}'`)
export * from "./logout";
export * from "./save";
export * from "./select";
// @endindex
