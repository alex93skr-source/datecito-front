<?php
// Genera public/og.jpg (1200×630) con la marca, para vistas previas en redes y mensajería.
// Se ejecuta con PHP + GD, por ejemplo dentro del contenedor de la API:
//   docker run --rm -v "<raíz del proyecto>:/w" datecito-app php /w/web/scripts/og-image.php
$root = dirname(__DIR__, 2);
$font = $root.'/node_modules/@expo-google-fonts/nunito-sans/800ExtraBold/NunitoSans_800ExtraBold.ttf';
$fontRegular = $root.'/node_modules/@expo-google-fonts/nunito-sans/600SemiBold/NunitoSans_600SemiBold.ttf';
$out = $root.'/web/public/og.jpg';

$w = 1200; $h = 630;
$img = imagecreatetruecolor($w, $h);
$verde = imagecolorallocate($img, 15, 61, 50);
$coral = imagecolorallocate($img, 255, 107, 107);
$crema = imagecolorallocate($img, 249, 243, 236);
$durazno = imagecolorallocate($img, 255, 214, 204);
imagefill($img, 0, 0, $verde);

// Círculo coral con la "d" de la marca
imagefilledellipse($img, 190, 315, 220, 220, $coral);
imagettftext($img, 150, 0, 118, 372, $crema, $font, 'd');
// Corazón sencillo junto a la d
imagefilledellipse($img, 268, 232, 26, 26, $crema);
imagefilledellipse($img, 290, 232, 26, 26, $crema);
imagefilledpolygon($img, [256, 240, 302, 240, 279, 266], $crema);

imagettftext($img, 64, 0, 360, 290, $crema, $font, 'Datecito');
imagettftext($img, 40, 0, 362, 360, $durazno, $font, 'De match a datecito.');
imagettftext($img, 24, 0, 364, 420, $crema, $fontRegular, 'Conoce personas reales cerca de ti');
imagettftext($img, 24, 0, 364, 458, $crema, $fontRegular, 'y conviértelo en un plan.');
imagettftext($img, 20, 0, 364, 540, $durazno, $fontRegular, 'datecito.com');

imagejpeg($img, $out, 88);
echo "og.jpg listo: ".filesize($out)." bytes\n";
