# ================================
# 自动化脚本：Rust + wasm-bindgen + wasm-pack
# ================================

# 将“项目目录”设置成当前命令执行时的路径。
$ProjectDir = (Get-Location).Path

# 被具体参考使用时，需要修改的变量！！！
# 设置用于“--target web”的输出目录
$OutWebDir = "$ProjectDir\dist\web"

# 被具体参考使用时，需要修改的变量！！！
# 设置用于“--target bundler”的输出目录
$OutBundlerDir = "$ProjectDir\dist\bundler"

# 被具体参考使用时，需要修改的变量！！！
# 执行“wasm-pack build”之后自动生成的“target”目录。
$targetDir = "$ProjectDir\target"

# 被具体参考使用时，需要修改的变量！！！
# 执行“wasm-pack build”之后自动生成的“Cargo.lock”路径。
$Cargo_lock = "$ProjectDir\Cargo.lock"

# 确保用于“--target web”的输出目录存在，并清空其中的所有内容。
if (
Test-Path -LiteralPath $OutWebDir -PathType Container
)
{
    # 删除目录中的所有文件和子文件夹，包括隐藏文件、系统文件。
    Get-ChildItem -LiteralPath $OutWebDir -Force |
            Remove-Item -Recurse -Force
}
else
{
    # 如果输出目录不存在，则创建该目录。
    New-Item -ItemType Directory -Path $OutWebDir -Force | Out-Null
}

# 确保用于“--target bundler”的输出目录存在，并清空其中的所有内容。
if (
Test-Path -LiteralPath $OutBundlerDir -PathType Container
)
{
    # 删除目录中的所有文件和子文件夹，包括隐藏文件、系统文件。
    Get-ChildItem -LiteralPath $OutBundlerDir -Force |
            Remove-Item -Recurse -Force
}
else
{
    # 如果输出目录不存在，则创建该目录。
    New-Item -ItemType Directory -Path $OutBundlerDir -Force | Out-Null
}

# 如果 target 目录存在，则删除整个目录及其所有内容。
if (
Test-Path -LiteralPath $targetDir -PathType Container
)
{
    Remove-Item -LiteralPath $targetDir -Recurse -Force
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

Write-Host "=== wasm-pack build --release --no-gitignore --no-pack --target web ==="
wasm-pack build --release --no-gitignore --no-pack --target web --out-dir $OutWebDir
Write-Host "`n"
Write-Host "--target web 最终输出见：$OutWebDir"
Write-Host "`n"

# 如果 target 目录存在，则删除整个目录及其所有内容。
if (
Test-Path -LiteralPath $targetDir -PathType Container
)
{
    Remove-Item -LiteralPath $targetDir -Recurse -Force
}

# 如果 Cargo.lock 文件存在，则删除该文件。
if (
Test-Path -LiteralPath $Cargo_lock -PathType Leaf
)
{
    Remove-Item -LiteralPath $Cargo_lock -Force
}

Write-Host "=== wasm-pack build --release --no-gitignore --no-pack --target bundler ==="
wasm-pack build --release --no-gitignore --no-pack --target bundler --out-dir $OutBundlerDir
Write-Host "`n"
Write-Host "--target bundler 最终输出见：$OutBundlerDir"
Write-Host "`n"

# 如果 target 目录存在，则删除整个目录及其所有内容。
if (
Test-Path -LiteralPath $targetDir -PathType Container
)
{
    Remove-Item -LiteralPath $targetDir -Recurse -Force
}

# 如果 Cargo.lock 文件存在，则删除该文件。
if (
Test-Path -LiteralPath $Cargo_lock -PathType Leaf
)
{
    Remove-Item -LiteralPath $Cargo_lock -Force
}

Write-Host "当前执行命令的PowerShell的版本为："
$PSVersionTable.PSVersion
Write-Host "`n"

Write-Host "执行完成！按 Ctrl+C 退出。"
while ($true)
{
    $null = Read-Host
}
