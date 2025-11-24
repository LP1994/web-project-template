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

# 确保 最终保存 .wasm 的目录存在
if (
-not (Test-Path $DistDir)
)
{
    New-Item -ItemType Directory -Path $DistDir | Out-Null
}

# 确保 out 目录存在
if (
-not (Test-Path $OutDir)
)
{
    New-Item -ItemType Directory -Path $OutDir | Out-Null
}

# 切换到“项目目录”
Set-Location $ProjectDir

Write-Host "=== 编译 Rust 项目为 wasm32-unknown-unknown ==="
Write-Host "`n"
cargo build --target-dir $OutDir --release --target wasm32-unknown-unknown

Write-Host "`n"
Write-Host "=== 复制 .wasm 文件到 $DistDir ==="
Get-ChildItem "$OutDir\wasm32-unknown-unknown\release\$WasmFileName.wasm" | ForEach-Object {
    Copy-Item $_.FullName -Destination $DistDir -Force
}

Write-Host "`n"
Write-Host "=== 清空：$OutDir ==="
cargo clean --target-dir $OutDir

Write-Host "`n"
Write-Host "=== 删除：$ProjectDir\Cargo.lock ==="
Remove-Item "$ProjectDir\Cargo.lock" -Force
Write-Host "`n"

Write-Host "=== 完成！最终的 .wasm 文件在 $DistDir ==="
Write-Host "`n"

Write-Host "当前执行命令的PowerShell的版本为："
$PSVersionTable.PSVersion
Write-Host "`n"

Write-Host "执行完成！按 Ctrl+C 退出。"
while ($true)
{
    $null = Read-Host
}
