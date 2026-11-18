# ================================
# 自动化脚本：编译 → 复制 .wasm → 清理
# ================================

# 将“项目目录”设置成当前命令执行时的路径。
$ProjectDir = (Get-Location).Path

# 被具体参考使用时，需要修改的变量！！！
# 设置生成的 .wasm 文件名，只要文件名即可，不用加最终的“.wasm”后缀
$WasmFileName = "MathTool"

# 被具体参考使用时，需要修改的变量！！！
# 设置输出目录out
$OutDir = "$ProjectDir\..\..\..\build\rust\math_tool\out"

# 被具体参考使用时，需要修改的变量！！！
# 设置最终保存 .wasm 的目录
$DistDir = "$ProjectDir\..\..\..\build\rust\math_tool"

# 被具体参考使用时，需要修改的变量！！！
# 执行“cargo build”之后自动生成的“Cargo.lock”路径。
$Cargo_lock = "$ProjectDir\Cargo.lock"

# 确保 最终保存 .wasm 的目录存在
if (
Test-Path -LiteralPath $DistDir -PathType Container
)
{
    # 删除目录中的所有文件和子文件夹，包括隐藏文件、系统文件。
    Get-ChildItem -LiteralPath $DistDir -Force |
            Remove-Item -Recurse -Force
}
else
{
    # 如果输出目录不存在，则创建该目录。
    New-Item -ItemType Directory -Path $DistDir -Force | Out-Null
}

# 确保 out 目录存在
if (
Test-Path -LiteralPath $OutDir -PathType Container
)
{
    # 删除目录中的所有文件和子文件夹，包括隐藏文件、系统文件。
    Get-ChildItem -LiteralPath $OutDir -Force |
            Remove-Item -Recurse -Force
}
else
{
    # 如果输出目录不存在，则创建该目录。
    New-Item -ItemType Directory -Path $OutDir -Force | Out-Null
}

# 如果 Cargo.lock 文件存在，则删除该文件。
if (
Test-Path -LiteralPath $Cargo_lock -PathType Leaf
)
{
    Remove-Item -LiteralPath $Cargo_lock -Force
}

# 切换到“项目目录”
Set-Location $ProjectDir

Write-Host "=== 格式化Rust代码 ==="
cargo fmt
Write-Host "`n"

Write-Host "=== cargo build --release --target wasm32-unknown-unknown ==="
cargo build --release --target wasm32-unknown-unknown --target-dir $OutDir
Write-Host "`n"

Write-Host "完成！最终的 .wasm 文件在：$DistDir"
# --strip-debug：删除调试信息，包括 Wasm 名称段。注意：这里删除的是调试名称信息，不会因为 --strip-debug 而删除 WebAssembly 导出段中的 Add、Sub、Mul 等导出函数名称。
# --strip-producers：删除 Wasm producers 元数据段。
wasm-opt "$OutDir\wasm32-unknown-unknown\release\$WasmFileName.wasm" -Oz --strip-debug --strip-producers -o "$DistDir\$WasmFileName.wasm"
Write-Host "`n"

if (
Test-Path -LiteralPath $OutDir -PathType Container
)
{
    Remove-Item -LiteralPath $OutDir -Recurse -Force
}

if (
Test-Path -LiteralPath $Cargo_lock -PathType Leaf
)
{
    Remove-Item -LiteralPath $Cargo_lock -Force
}

Write-Host "当前执行命令的“wasm-opt”的版本为："
wasm-opt --version
Write-Host "`n"

Write-Host "当前执行命令的“wasm-opt”程序所在目录为："
where.exe wasm-opt
Write-Host "`n"

Write-Host "当前执行命令的PowerShell的版本为："
$PSVersionTable.PSVersion
Write-Host "`n"

Write-Host "执行完成！按 Ctrl+C 退出。"
while ($true)
{
    $null = Read-Host
}
