cd ../../src/wasm/source_codes/c++/math_tool&emsdk_env.bat&emcc MathTool.cpp -std=c++23 -Os -s WASM=1 -s SIDE_MODULE=1 -o ../../../build/c++/math_tool/MathTool.wasm&pause
