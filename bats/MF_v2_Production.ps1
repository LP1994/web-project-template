# 自动开始生产模式（production）打包，在全部完成后，将各个远端模块提供者项目（子项目）的输出复制到远端模块使用者项目（主项目）的输出目录中。

chcp 65001

Write-Host "`n`n自动开始生产模式（production）打包，在全部完成后，将各个远端模块提供者项目（子项目）的输出复制到远端模块使用者项目（主项目）的输出目录中。`n`n`n`n"

$OutputEncoding = New-Object -typename System.Text.UTF8Encoding

# 要进行生产模式打包的项目路径和npm启动命令。
$nestedArray = @(
    @("G:\WebStormWS\upload-for-multiple", "npm run production"),
    @("G:\WebStormWS\upload-for-single", "npm run production"),
    @("G:\WebStormWS\web-project-template", "npm run production")
)

# 生产模式打包全都完成后，将各个子项目的输出复制到主项目的输出目录中。
$nestedCopyArray = @(
    @("G:\WebStormWS\upload-for-multiple\dist\production", "G:\WebStormWS\web-project-template\dist\production\mf_v2\upload_for_multiple"),
    @("G:\WebStormWS\upload-for-single\dist\production", "G:\WebStormWS\web-project-template\dist\production\mf_v2\upload_for_single")
)

$isSuccess = $true

# 通过遍历“$nestedArray”执行各个项目的生产打包。
function StartRun
{
    foreach ($innerArray in $nestedArray)
    {
        try
        {
            Set-Location -Path $innerArray[0]

            $output = Invoke-Expression $innerArray[1] -ErrorAction Stop | Out-String
            Write-Host $output

            Write-Host "`n`n`n`n------------"$innerArray[0]"------生产模式（production）打包完成:"$innerArray[1]"------------`n`n`n`n"

            # throw "An error occurred, terminating execution!!!!!!!!!!!!!!!!!"
        }
        catch
        {
            $isSuccess = $false

            Write-Host "发生生产模式（production）打包错误的项目："
            Write-Host "项目路径："$innerArray[0]
            Write-Host "npm打包命令："$innerArray[1]
            Write-Host $_

            break

            # 退出并返回代码：1，1表示遇到错误、非正常退出！"exit 1"会导致终止命令的执行，并且直接关闭窗口！
            # exit 1
        }
    }

    return $isSuccess
}

# 通过遍历“$nestedCopyArray”，将生产模式打包全都完成后的各个子项目的输出复制到主项目的输出目录中。
function StartCopy
{
    foreach ($innerCopyArray in $nestedCopyArray)
    {
        try
        {
            if (-not (Test-Path $innerCopyArray[1]))
            {
                New-Item -ItemType Directory -Path $innerCopyArray[1]
            }

            $copyMyPath = $innerCopyArray[0] + "\*"

            Copy-Item -Path $copyMyPath -Destination $innerCopyArray[1] -Recurse -Force -ErrorAction Stop

            Write-Host "`n`n------------已成功将"$innerCopyArray[0]"下的所有都复制到"$innerCopyArray[1]"下------------`n`n"
        }
        catch
        {
            $isSuccess = $false

            Write-Host "发生复制错误的项目："
            Write-Host "从："$innerCopyArray[0]
            Write-Host "复制到："$innerCopyArray[1]
            Write-Host $_

            break

            # 退出并返回代码：1，1表示遇到错误、非正常退出！"exit 1"会导致终止命令的执行，并且直接关闭窗口！
            # exit 1
        }
    }

    return $isSuccess
}

if (StartRun)
{
    Write-Host "`n`n已完成全部的生产模式（production）打包！`n`n"

    if (StartCopy)
    {
        Write-Host "`n`n已将各个远端模块提供者项目（子项目）的输出复制到远端模块使用者项目（主项目）的输出目录中！`n`n"
    }
}

Write-Host "`n"
Write-Host "当前执行命令的PowerShell的版本为："
$PSVersionTable.PSVersion
Write-Host "`n"

Write-Host "执行完成！按 Ctrl+C 退出。"
while ($true)
{
    $null = Read-Host
}
