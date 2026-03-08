Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"

$outputDir = Join-Path $PSScriptRoot "..\public\images\storyboard"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$width = 1920
$height = 1080
$accent = [System.Drawing.Color]::FromArgb(230, 220, 236, 240)
$accentSoft = [System.Drawing.Color]::FromArgb(160, 190, 208, 214)
$whiteSoft = [System.Drawing.Color]::FromArgb(245, 246, 247)
$mist = [System.Drawing.Color]::FromArgb(193, 196, 200)
$steel = [System.Drawing.Color]::FromArgb(123, 127, 133)
$graphite = [System.Drawing.Color]::FromArgb(43, 46, 51)
$graphiteDeep = [System.Drawing.Color]::FromArgb(28, 31, 37)
$rand = [System.Random]::new(42)

function New-ArgbBrush([int]$a, [int]$r, [int]$g, [int]$b) {
  return [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb($a, $r, $g, $b))
}

function New-RoundedPath([float]$x, [float]$y, [float]$w, [float]$h, [float]$radius) {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $diameter = $radius * 2

  $path.AddArc($x, $y, $diameter, $diameter, 180, 90)
  $path.AddArc($x + $w - $diameter, $y, $diameter, $diameter, 270, 90)
  $path.AddArc($x + $w - $diameter, $y + $h - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($x, $y + $h - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()

  return $path
}

function Set-Quality($graphics) {
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
}

function Draw-Grid($graphics) {
  $pen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(20, 245, 246, 247), 1)

  for ($x = 0; $x -le $width; $x += 72) {
    $graphics.DrawLine($pen, $x, 0, $x, $height)
  }

  for ($y = 0; $y -le $height; $y += 72) {
    $graphics.DrawLine($pen, 0, $y, $width, $y)
  }

  $pen.Dispose()
}

function Draw-SnowParticles($graphics, [int]$count, [int]$maxSize) {
  for ($i = 0; $i -lt $count; $i++) {
    $size = $rand.Next(2, $maxSize)
    $alpha = $rand.Next(22, 110)
    $x = $rand.Next(-40, $width + 40)
    $y = $rand.Next(-40, $height + 40)
    $brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
    $graphics.FillEllipse($brush, $x, $y, $size, $size)
    $brush.Dispose()
  }
}

function Draw-DarkBackground($graphics) {
  $rect = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
  $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $rect,
    [System.Drawing.Color]::FromArgb(255, 52, 56, 64),
    [System.Drawing.Color]::FromArgb(255, 30, 33, 39),
    90
  )
  $graphics.FillRectangle($brush, $rect)
  $brush.Dispose()

  $ellipse1 = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $ellipse1.AddEllipse(460, 180, 1000, 520)
  $pathBrush1 = [System.Drawing.Drawing2D.PathGradientBrush]::new($ellipse1)
  $pathBrush1.CenterColor = [System.Drawing.Color]::FromArgb(58, 245, 246, 247)
  $pathBrush1.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 245, 246, 247))
  $graphics.FillPath($pathBrush1, $ellipse1)
  $pathBrush1.Dispose()
  $ellipse1.Dispose()

  $ellipse2 = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $ellipse2.AddEllipse(640, 620, 640, 220)
  $pathBrush2 = [System.Drawing.Drawing2D.PathGradientBrush]::new($ellipse2)
  $pathBrush2.CenterColor = [System.Drawing.Color]::FromArgb(40, 245, 246, 247)
  $pathBrush2.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 245, 246, 247))
  $graphics.FillPath($pathBrush2, $ellipse2)
  $pathBrush2.Dispose()
  $ellipse2.Dispose()

  Draw-Grid $graphics
  Draw-SnowParticles $graphics 80 12
}

function Draw-SnowScene($graphics, [bool]$withMask) {
  $skyRect = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
  $skyBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    $skyRect,
    [System.Drawing.Color]::FromArgb(255, 110, 162, 208),
    [System.Drawing.Color]::FromArgb(255, 233, 240, 247),
    90
  )
  $graphics.FillRectangle($skyBrush, $skyRect)
  $skyBrush.Dispose()

  $mountainBack = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 144, 160, 179))
  $mountainMid = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 118, 132, 150))
  $mountainFront = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 90, 103, 120))
  $snowBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 245, 247, 249))

  $graphics.FillPolygon($mountainBack, @(
      [System.Drawing.Point]::new(0, 520),
      [System.Drawing.Point]::new(180, 300),
      [System.Drawing.Point]::new(360, 430),
      [System.Drawing.Point]::new(620, 250),
      [System.Drawing.Point]::new(900, 420),
      [System.Drawing.Point]::new(1200, 260),
      [System.Drawing.Point]::new(1500, 410),
      [System.Drawing.Point]::new(1740, 300),
      [System.Drawing.Point]::new(1920, 500),
      [System.Drawing.Point]::new(1920, 1080),
      [System.Drawing.Point]::new(0, 1080)
    ))

  $graphics.FillPolygon($mountainMid, @(
      [System.Drawing.Point]::new(0, 650),
      [System.Drawing.Point]::new(210, 470),
      [System.Drawing.Point]::new(480, 620),
      [System.Drawing.Point]::new(740, 420),
      [System.Drawing.Point]::new(1030, 600),
      [System.Drawing.Point]::new(1360, 430),
      [System.Drawing.Point]::new(1660, 620),
      [System.Drawing.Point]::new(1920, 480),
      [System.Drawing.Point]::new(1920, 1080),
      [System.Drawing.Point]::new(0, 1080)
    ))

  $graphics.FillPolygon($snowBrush, @(
      [System.Drawing.Point]::new(0, 760),
      [System.Drawing.Point]::new(320, 700),
      [System.Drawing.Point]::new(520, 620),
      [System.Drawing.Point]::new(860, 700),
      [System.Drawing.Point]::new(1200, 610),
      [System.Drawing.Point]::new(1460, 690),
      [System.Drawing.Point]::new(1700, 640),
      [System.Drawing.Point]::new(1920, 700),
      [System.Drawing.Point]::new(1920, 1080),
      [System.Drawing.Point]::new(0, 1080)
    ))

  $graphics.FillPolygon($mountainFront, @(
      [System.Drawing.Point]::new(0, 860),
      [System.Drawing.Point]::new(200, 800),
      [System.Drawing.Point]::new(500, 760),
      [System.Drawing.Point]::new(780, 800),
      [System.Drawing.Point]::new(1120, 730),
      [System.Drawing.Point]::new(1450, 810),
      [System.Drawing.Point]::new(1700, 750),
      [System.Drawing.Point]::new(1920, 820),
      [System.Drawing.Point]::new(1920, 1080),
      [System.Drawing.Point]::new(0, 1080)
    ))

  $snowPathPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(160, 232, 238, 244), 4)
  $graphics.DrawBezier($snowPathPen, 120, 720, 420, 640, 900, 710, 1320, 590)
  $graphics.DrawBezier($snowPathPen, 960, 720, 1130, 670, 1500, 760, 1830, 680)
  $graphics.DrawBezier($snowPathPen, 110, 850, 380, 780, 760, 890, 1200, 820)
  $snowPathPen.Dispose()

  foreach ($skier in @(
      @{ X = 1180; Y = 700; C = [System.Drawing.Color]::FromArgb(255, 222, 176, 64) },
      @{ X = 1010; Y = 735; C = [System.Drawing.Color]::FromArgb(255, 88, 169, 210) },
      @{ X = 890; Y = 705; C = [System.Drawing.Color]::FromArgb(255, 214, 96, 110) },
      @{ X = 1260; Y = 770; C = [System.Drawing.Color]::FromArgb(255, 90, 100, 112) }
    )) {
    $brush = [System.Drawing.SolidBrush]::new($skier.C)
    $graphics.FillEllipse($brush, $skier.X, $skier.Y, 12, 12)
    $graphics.FillRectangle($brush, $skier.X + 3, $skier.Y + 10, 4, 20)
    $brush.Dispose()
  }

  $gloveBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(220, 20, 22, 28))
  $graphics.FillEllipse($gloveBrush, 60, 840, 160, 180)
  $graphics.FillEllipse($gloveBrush, 1700, 840, 160, 180)
  $gloveBrush.Dispose()

  $skiBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 34, 37, 43))
  $accentBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 216, 68, 58))
  $graphics.FillPolygon($skiBrush, @(
      [System.Drawing.Point]::new(878, 780),
      [System.Drawing.Point]::new(924, 780),
      [System.Drawing.Point]::new(972, 1080),
      [System.Drawing.Point]::new(926, 1080)
    ))
  $graphics.FillPolygon($skiBrush, @(
      [System.Drawing.Point]::new(984, 780),
      [System.Drawing.Point]::new(1030, 780),
      [System.Drawing.Point]::new(1068, 1080),
      [System.Drawing.Point]::new(1022, 1080)
    ))
  $graphics.FillPolygon($accentBrush, @(
      [System.Drawing.Point]::new(896, 846),
      [System.Drawing.Point]::new(916, 812),
      [System.Drawing.Point]::new(936, 846)
    ))
  $graphics.FillPolygon($accentBrush, @(
      [System.Drawing.Point]::new(1002, 846),
      [System.Drawing.Point]::new(1022, 812),
      [System.Drawing.Point]::new(1042, 846)
    ))
  $skiBrush.Dispose()
  $accentBrush.Dispose()

  Draw-SnowParticles $graphics 40 10

  if ($withMask) {
    $maskBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(214, 18, 20, 24))
    $graphics.FillEllipse($maskBrush, -120, -40, 460, 1220)
    $graphics.FillEllipse($maskBrush, 1580, -40, 460, 1220)
    $graphics.FillRectangle($maskBrush, 0, 0, 1920, 90)
    $maskBrush.Dispose()

    $borderPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 42, 45, 52), 22)
    $path = New-RoundedPath 140 120 1640 760 160
    $graphics.DrawPath($borderPen, $path)
    $path.Dispose()
    $bridgeBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 40, 44, 50))
    $graphics.FillPolygon($bridgeBrush, @(
        [System.Drawing.Point]::new(850, 880),
        [System.Drawing.Point]::new(970, 880),
        [System.Drawing.Point]::new(1015, 1060),
        [System.Drawing.Point]::new(805, 1060)
      ))
    $bridgeBrush.Dispose()
    $borderPen.Dispose()
  }

  $mountainBack.Dispose()
  $mountainMid.Dispose()
  $mountainFront.Dispose()
  $snowBrush.Dispose()
}

function Draw-Hud($graphics, [int]$alpha, [bool]$compact) {
  $pen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb($alpha, 233, 242, 244), 3)
  $titleBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb($alpha, 245, 246, 247))
  $textBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb($alpha - 16, 245, 246, 247))
  $smallFont = [System.Drawing.Font]::new("Segoe UI", 20, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $bigFont = [System.Drawing.Font]::new("Segoe UI Semibold", 34, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)

  $left = New-RoundedPath 290 110 500 240 36
  $right = New-RoundedPath 1160 110 470 200 36
  $graphics.DrawPath($pen, $left)
  $graphics.DrawPath($pen, $right)
  $graphics.DrawLine($pen, 850, 210, 1085, 210)
  $graphics.FillEllipse($titleBrush, 930, 199, 60, 6)

  $graphics.DrawString("Speed:", $smallFont, $textBrush, 380, 155)
  $graphics.DrawString("28 km/h", $bigFont, $titleBrush, 380, 190)
  $graphics.DrawString("Temperature:", $smallFont, $textBrush, 380, 255)
  $graphics.DrawString("-4°C", $bigFont, $titleBrush, 380, 288)
  $graphics.DrawString("Direction:", $smallFont, $textBrush, 880, 155)
  $graphics.DrawString("NE", $bigFont, $titleBrush, 952, 188)
  $graphics.DrawString("Altitude:", $smallFont, $textBrush, 1330, 155)
  $graphics.DrawString("2140 m", $bigFont, $titleBrush, 1330, 188)

  if (-not $compact) {
    $chipPath = New-RoundedPath 790 820 340 64 28
    $chipBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(90, 38, 44, 54))
    $graphics.FillPath($chipBrush, $chipPath)
    $graphics.DrawPath($pen, $chipPath)
    $graphics.DrawString("HUD Active", $smallFont, $titleBrush, 895, 837)
    $chipBrush.Dispose()
    $chipPath.Dispose()
  }

  $pen.Dispose()
  $titleBrush.Dispose()
  $textBrush.Dispose()
  $smallFont.Dispose()
  $bigFont.Dispose()
  $left.Dispose()
  $right.Dispose()
}

function Draw-GoggleFront($graphics, [float]$x, [float]$y, [float]$w, [float]$h, [bool]$showStrap, [bool]$showHudStrip) {
  $outerPath = New-RoundedPath $x $y $w $h 150
  $frameBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.RectangleF]::new($x, $y, $w, $h),
    [System.Drawing.Color]::FromArgb(255, 88, 95, 105),
    [System.Drawing.Color]::FromArgb(255, 28, 31, 37),
    90
  )
  $graphics.FillPath($frameBrush, $outerPath)

  $borderPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 120, 128, 140), 10)
  $graphics.DrawPath($borderPen, $outerPath)

  $innerPath = New-RoundedPath ($x + 46) ($y + 56) ($w - 92) ($h - 132) 120
  $lensBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.RectangleF]::new($x + 46, $y + 56, $w - 92, $h - 132),
    [System.Drawing.Color]::FromArgb(220, 205, 214, 220),
    [System.Drawing.Color]::FromArgb(170, 44, 48, 56),
    90
  )
  $graphics.FillPath($lensBrush, $innerPath)
  $lensPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(210, 160, 172, 180), 3)
  $graphics.DrawPath($lensPen, $innerPath)

  $bridgeBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 42, 45, 52))
  $graphics.FillPolygon($bridgeBrush, @(
      [System.Drawing.PointF]::new($x + $w * 0.42, $y + $h * 0.78),
      [System.Drawing.PointF]::new($x + $w * 0.58, $y + $h * 0.78),
      [System.Drawing.PointF]::new($x + $w * 0.63, $y + $h * 1.03),
      [System.Drawing.PointF]::new($x + $w * 0.37, $y + $h * 1.03)
    ))

  $highlightBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(82, 245, 246, 247))
  $graphics.FillEllipse($highlightBrush, $x + 150, $y + 40, $w - 300, 90)

  if ($showStrap) {
    $strapBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
      [System.Drawing.RectangleF]::new($x + $w * 0.74, $y + $h * 0.26, 460, 180),
      [System.Drawing.Color]::FromArgb(255, 58, 62, 70),
      [System.Drawing.Color]::FromArgb(255, 24, 27, 32),
      0
    )
    $graphics.FillRectangle($strapBrush, $x + $w * 0.74, $y + $h * 0.26, 520, 180)
    $strapBrush.Dispose()
  }

  if ($showHudStrip) {
    $hudPath = New-RoundedPath ($x + $w * 0.82) ($y + $h * 0.34) 460 110 28
    $hudBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(110, 36, 44, 50))
    $hudPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 183, 238, 242), 4)
    $hudFont = [System.Drawing.Font]::new("Segoe UI", 22, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $graphics.FillPath($hudBrush, $hudPath)
    $graphics.DrawPath($hudPen, $hudPath)
    $graphics.DrawString("Speed 28 km/h    Temp -4°C", $hudFont, [System.Drawing.Brushes]::White, $x + $w * 0.85, $y + $h * 0.375)
    $graphics.DrawString("Direction NE     Altitude 2140 m", $hudFont, [System.Drawing.Brushes]::White, $x + $w * 0.85, $y + $h * 0.42)
    $hudFont.Dispose()
    $hudBrush.Dispose()
    $hudPen.Dispose()
    $hudPath.Dispose()
  }

  $bridgeBrush.Dispose()
  $highlightBrush.Dispose()
  $lensPen.Dispose()
  $lensBrush.Dispose()
  $frameBrush.Dispose()
  $borderPen.Dispose()
  $outerPath.Dispose()
  $innerPath.Dispose()
}

function Draw-GoggleAngled($graphics) {
  $state = $graphics.Save()
  $graphics.TranslateTransform(780, 240)
  $graphics.RotateTransform(-5)
  $graphics.ScaleTransform(0.92, 1)
  Draw-GoggleFront $graphics 0 0 780 520 $true $true
  $housingBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 38, 42, 48))
  $graphics.FillRectangle($housingBrush, 690, 60, 120, 400)
  $graphics.FillEllipse($housingBrush, 670, 40, 120, 120)
  $graphics.FillEllipse($housingBrush, 670, 360, 120, 120)
  $housingBrush.Dispose()
  $graphics.Restore($state)
}

function Draw-OpticalLayers($graphics, [int]$mode) {
  $baseX = 340
  $baseY = 245
  $layerW = 980
  $layerH = 520
  $offsets = @(
    @{ Name = "Frame"; X = 0; Y = 0; A = 255; Stroke = [System.Drawing.Color]::FromArgb(160, 170, 180); Fill = [System.Drawing.Color]::FromArgb(64, 70, 76, 84) },
    @{ Name = "Outer Protective Lens"; X = 90; Y = 16; A = 160; Stroke = [System.Drawing.Color]::FromArgb(220, 235, 240); Fill = [System.Drawing.Color]::FromArgb(34, 245, 246, 247) },
    @{ Name = "Optical Lens"; X = 180; Y = 36; A = 130; Stroke = [System.Drawing.Color]::FromArgb(205, 228, 232); Fill = [System.Drawing.Color]::FromArgb(28, 245, 246, 247) },
    @{ Name = "Reflective Layer"; X = 280; Y = 58; A = 116; Stroke = [System.Drawing.Color]::FromArgb(205, 240, 243); Fill = [System.Drawing.Color]::FromArgb(36, 232, 239, 242) },
    @{ Name = "Inner Protective Layer"; X = 380; Y = 80; A = 108; Stroke = [System.Drawing.Color]::FromArgb(195, 220, 224); Fill = [System.Drawing.Color]::FromArgb(28, 245, 246, 247) }
  )

  if ($mode -eq 1) {
    $offsets[1].X = 48
    $offsets[1].Y = 10
    $offsets[2].X = 110
    $offsets[2].Y = 24
    $offsets[3].X = 175
    $offsets[3].Y = 40
    $offsets[4].X = 242
    $offsets[4].Y = 56
  }

  foreach ($layer in $offsets) {
    $path = New-RoundedPath ($baseX + $layer.X) ($baseY + $layer.Y) $layerW $layerH 132
    $pen = [System.Drawing.Pen]::new($layer.Stroke, 5)
    $fillBrush = [System.Drawing.SolidBrush]::new($layer.Fill)
    $graphics.FillPath($fillBrush, $path)
    $graphics.DrawPath($pen, $path)

    $innerPath = New-RoundedPath ($baseX + $layer.X + 54) ($baseY + $layer.Y + 60) ($layerW - 108) ($layerH - 136) 108
    $innerPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb([math]::Min($layer.A, 170), 240, 243, 245), 2)
    $graphics.DrawPath($innerPen, $innerPath)

    if ($layer.Name -eq "Reflective Layer") {
      $linePen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(150, 220, 235, 240), 3)
      for ($i = 0; $i -lt 7; $i++) {
        $graphics.DrawLine($linePen, $baseX + $layer.X + 480 + ($i * 10), $baseY + $layer.Y + 170, $baseX + $layer.X + 700, $baseY + $layer.Y + 170 + ($i * 18))
        $graphics.DrawLine($linePen, $baseX + $layer.X + 700, $baseY + $layer.Y + 170 + ($i * 18), $baseX + $layer.X + 700, $baseY + $layer.Y + 330)
      }
      $linePen.Dispose()
    }

    $innerPath.Dispose()
    $innerPen.Dispose()
    $fillBrush.Dispose()
    $pen.Dispose()
    $path.Dispose()
  }
}

function Draw-Callout($graphics, [string]$title, [float]$x, [float]$y, [float]$tx, [float]$ty) {
  $pen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(160, 245, 246, 247), 2)
  $textBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(230, 245, 246, 247))
  $font = [System.Drawing.Font]::new("Segoe UI", 22, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $graphics.DrawLine($pen, $x, $y, $tx, $ty)
  $graphics.DrawLine($pen, $tx, $ty, $tx + 180, $ty)
  $graphics.DrawString($title, $font, $textBrush, $tx, $ty - 34)
  $font.Dispose()
  $textBrush.Dispose()
  $pen.Dispose()
}

function New-Frame([string]$fileName, [scriptblock]$draw) {
  $bitmap = [System.Drawing.Bitmap]::new($width, $height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  Set-Quality $graphics
  & $draw $graphics
  $graphics.Dispose()
  $bitmap.Save((Join-Path $outputDir $fileName), [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}

New-Frame "frame-01-pov.png" {
  param($graphics)
  Draw-SnowScene $graphics $false
  $vignette = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $vignette.AddEllipse(-120, -30, 2160, 1160)
  $vignetteBrush = [System.Drawing.Drawing2D.PathGradientBrush]::new($vignette)
  $vignetteBrush.CenterColor = [System.Drawing.Color]::FromArgb(0, 0, 0, 0)
  $vignetteBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(190, 18, 20, 24))
  $graphics.FillPath($vignetteBrush, $vignette)
  Draw-Hud $graphics 214 $true
  $vignetteBrush.Dispose()
  $vignette.Dispose()
}

New-Frame "frame-02-zoomout.png" {
  param($graphics)
  Draw-SnowScene $graphics $true
  Draw-Hud $graphics 190 $true
}

New-Frame "frame-03-reveal.png" {
  param($graphics)
  Draw-DarkBackground $graphics
  Draw-GoggleFront $graphics 360 220 930 560 $true $true
}

New-Frame "frame-04-rotate.png" {
  param($graphics)
  Draw-DarkBackground $graphics
  Draw-GoggleAngled $graphics
}

New-Frame "frame-05-separate.png" {
  param($graphics)
  Draw-DarkBackground $graphics
  Draw-OpticalLayers $graphics 1
}

New-Frame "frame-06-exploded.png" {
  param($graphics)
  Draw-DarkBackground $graphics
  Draw-OpticalLayers $graphics 2
  Draw-Callout $graphics "Outer Protective Lens" 620 360 180 150
  Draw-Callout $graphics "Optical Lens" 845 325 640 140
  Draw-Callout $graphics "Reflective Layer" 1120 360 1120 140
  Draw-Callout $graphics "Inner Protective Layer" 1540 420 1440 240
  Draw-Callout $graphics "Frame" 1020 760 1220 900
}

Get-ChildItem $outputDir -Filter "test.png" -ErrorAction SilentlyContinue | Remove-Item -Force
Write-Output "Storyboard frames generated in $outputDir"
