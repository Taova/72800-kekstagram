function getMessage(a, b){
  var sum = function(x, y) {
    return x + y;
  };

  if (typeof a ==='boolean'){
    return a ? 'Переданное GIF-изображение анимировано и содержит ' + b +' кадров' : 'Переданное GIF-изображение не анимировано';
  }

  if (typeof a === 'number'){
    return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + (b * 4) +' атрибутов';
  }

  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return   "Количество красных точек во всех строчках изображения: " + a.reduce(sum);
    }
    var square = 0;

    for(var i = 0; i < a.length; i++) {
        square +=  a[i] * b[i];
    }
    return "Общая площадь артефактов сжатия: " + square + " пикселей";
  }
}