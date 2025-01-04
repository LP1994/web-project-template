chcp 65001

$OutputEncoding = New-Object -typename System.Text.UTF8Encoding

# 要进行生产模式打包的项目路径和npm启动命令。
$nestedArray = @(
    @("G:\WebStormWS\upload-for-multiple", "npm run test"),
    @("G:\WebStormWS\upload-for-single", "npm run test"),
    @("G:\WebStormWS\web-project-template", "npm run test")
)

# 生产模式打包全都完成后，将各个子项目的输出复制到主项目的输出目录中。
$nestedCopyArray = @(
    @("G:\WebStormWS\upload-for-multiple\dist\test", "G:\WebStormWS\web-project-template\dist\test\mf_v2\upload_for_multiple"),
    @("G:\WebStormWS\upload-for-single\dist\test", "G:\WebStormWS\web-project-template\dist\test\mf_v2\upload_for_single")
)

# 通过遍历“$nestedArray”执行各个项目的生产打包。
foreach ($innerArray in $nestedArray) {
    try {
        Set-Location -Path $innerArray[0]

        $output = Invoke-Expression $innerArray[1] -ErrorAction Stop | Out-String
        Write-Output $output
    } catch {
        Write-Host "发生生产打包错误的项目："
        Write-Host "项目路径：$innerArray[0]"
        Write-Host "npm打包命令：$innerArray[1]"
        Write-Output $_
    }

    Write-Host "`n---------------------------------------------------------------------------`n`n"
}

# 通过遍历“$nestedCopyArray”，将生产模式打包全都完成后的各个子项目的输出复制到主项目的输出目录中。
foreach ($innerCopyArray in $nestedCopyArray) {
    try {
        if (-not (Test-Path $innerCopyArray[1])) {
            New-Item -ItemType Directory -Path $innerCopyArray[1]
        }

        $copyMyPath = $innerCopyArray[0] + "\*"
        Copy-Item -Path $copyMyPath -Destination $innerCopyArray[1] -Recurse -Force -ErrorAction Stop
    } catch {
        Write-Host "发生复制错误的项目："
        Write-Host "从：$innerArray[0]"
        Write-Host "复制到：$innerArray[1]"
        Write-Output $_
    }
}

Write-Host "已全部将生产模式打包完成后的各个子项目的输出复制到主项目的输出目录中！"

Write-Host "`n`n"
Write-Host "当前执行命令的“PowerShell”的版本为："
$PSVersionTable.PSVersion
Write-Host "`n"

Write-Host "执行完成！按 Ctrl+C 退出。"
while ($true) {
    $null = Read-Host
}
