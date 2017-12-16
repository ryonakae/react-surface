export class BuildOptions {
  constructor (
    public outputFolder: string = 'dist',
    public environment: string = 'development',

    // Optional features.
    public index: boolean = false,
    public sourceMaps = false,
    public debug: boolean = false,
    public cache: boolean = false,
    public hmr: boolean = false,
    public stats: boolean = false,
    public vendor: boolean = false
  ) {}
}
