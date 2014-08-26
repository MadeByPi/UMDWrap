# UMDWrap

Wrap compiled Haxe JS output for use as a self-contained module compatible with [UMD](https://github.com/umdjs/umd) (Universal Module Definition) patterns.

Fields exposed in Haxe with the `@:expose` metadata will be available in the module. 

Creates modules that will work with AMD (requirejs) or CommonJS, and will expose any exports globally if those options are not available.

See `run-examples.bat` and the `example/` folder for basic usage examples.

If you need it, `nekotools boot UMDWrap.n` will create an executable version of the tool.

Based on templates from [umdjs](https://github.com/umdjs/umd)
