const nubeconfig = [
    { x: -11, y: 13, z: 0, escalado: 0.7 },
    { x: 11, y: -13, z: 0, escalado: 0.5 },
];

const estrellasConfig = [
    { x: -70, y: 21, z: -30, color: 0xFE797B, rotationX: 0, rotationY: Math.PI / 7, rotationZ: Math.PI / 2, escalado: 0.6, responsiveposicionx: -21, responsiveposiciony: 23},
    { x: -75, y: -32, z: -30, color:0xFFB750, rotationX: 0, rotationY: Math.PI / 7, rotationZ: Math.PI / 2, escalado: 0.7, responsiveposicionx: -25, responsiveposiciony: -32},
    { x: -55, y: 16, z: -30, color: 0xFFEA56, rotationX: 0, rotationY: Math.PI / 7, rotationZ: Math.PI / 2, escalado: 0.8, responsiveposicionx: -15, responsiveposiciony: 18},
    { x: -46, y: -17, z: -30, color: 0xFE797B, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.5, responsiveposicionx: -16, responsiveposiciony: -15},
    { x: -30, y: 5, z: -30, color: 0xFE797B, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.5, responsiveposicionx: -5, responsiveposiciony: 3},
    { x: -50, y: 0, z: -30, color: 0xFFB750, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.7, responsiveposicionx: -15, responsiveposiciony: 4},
    { x: -33, y: -32, z: -30, color: 0x36CEDC, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.7, responsiveposicionx: -3, responsiveposiciony: -30},
    { x: -35, y: 20, z: -30, color: 0x8FE968, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.8, responsiveposicionx: -5, responsiveposiciony: 21},
    { x: 10, y: 25, z: -30, color: 0x8FE968, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.6, responsiveposicionx: 3, responsiveposiciony: 30},
    { x: 0, y: 15, z: -30, color: 0x8FE968, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.5, responsiveposicionx: 0, responsiveposiciony: 12},
    { x: 7, y: -3, z: -30, color: 0x36CEDC, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.5, responsiveposicionx: 10, responsiveposiciony: -8},
    { x: 10, y: -18, z: -30, color: 0x36CEDC, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.5, responsiveposicionx: 0, responsiveposiciony: -18},
    { x: 10, y: -32, z: -30, color: 0x36CEDC, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.5, responsiveposicionx: 20, responsiveposiciony: -32},
    { x: 34, y: -3, z: -30, color: 0xA587CA, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.5, responsiveposicionx: -5, responsiveposiciony: -8},
    { x: 55, y: -3, z: -30, color: 0xA587CA, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.8, responsiveposicionx: 23, responsiveposiciony: 0},
    { x: 35, y: 20, z: -30, color: 0xA587CA, rotationX: 0, rotationY: - Math.PI / 6, rotationZ: Math.PI / 2, escalado: 0.8, responsiveposicionx: 10, responsiveposiciony: 21},
    { x: 55, y: 15, z: -30, color: 0xFFEA56, rotationX: 0, rotationY: 3 * Math.PI / 4, rotationZ: Math.PI / 2, escalado: 0.8, responsiveposicionx: 15, responsiveposiciony: 17},
    { x: 50, y: -20, z: -30, color: 0xA587CA, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.5, responsiveposicionx: 13, responsiveposiciony: -18},
    { x: 70, y: 10, z: -30, color: 0xA587CA, rotationX: 0, rotationY: 3 * Math.PI / 3.5, rotationZ: Math.PI / 2, escalado: 0.8, responsiveposicionx: 21, responsiveposiciony: 15},
];

const circulosConfig = [
    { x: -60, y: 20, z: -20, color: 0x8FE968, radio: 0.2, responsiveposicionx: -20, responsiveposiciony: 21}, //verde
    { x: -55, y: 0, z: -20, color: 0xFE797B, radio: 1.5, responsiveposicionx: -20, responsiveposiciony: 0}, //rojo
    { x: -54, y: -10, z: -20, color: 0xFE797B, radio: 0.4, responsiveposicionx: -17, responsiveposiciony: -10 },
    { x: -50, y: 25, z: -20, color: 0x8FE968, radio: 0.3, responsiveposicionx: -15, responsiveposiciony: 25 },
    { x: -50, y: 5, z: -20, color: 0xFE797B, radio: 0.2, responsiveposicionx: -16, responsiveposiciony: 10},
    { x: -50, y: -25, z: -20, color: 0xA587CA, radio: 0.2, responsiveposicionx: -20, responsiveposiciony: -27},//rosado
    { x: -45, y: -8, z: -20, color: 0xFE797B, radio: 0.4, responsiveposicionx: -5, responsiveposiciony: -3},
    { x: -40, y: 8, z: -20, color: 0xFE797B, radio: 0.2, responsiveposicionx: -20, responsiveposiciony: 8 },
    { x: -40, y: 25, z: -20, color: 0x8FE968, radio: 0.2, responsiveposicionx: -9, responsiveposiciony: 25 },
    { x: -40, y: -18, z: -20, color: 0xA587CA, radio: 0.5, responsiveposicionx: -14, responsiveposiciony: -18},
    { x: -37, y: -22, z: -20, color: 0x36CEDC, radio: 0.2, responsiveposicionx: -17, responsiveposiciony: -22 }, // celeste
    { x: -33, y: -25, z: -20, color: 0x36CEDC, radio: 0.2, responsiveposicionx: -7, responsiveposiciony: -22 },
    { x: -30, y: -20, z: -20, color: 0x36CEDC, radio: 0.2, responsiveposicionx: -5, responsiveposiciony: -17 },
    { x: -30, y: 0, z: -20, color: 0xFE797B, radio: 0.2, responsiveposicionx: -12, responsiveposiciony: 0 },
    { x: -32, y: 10, z: -20, color: 0xFE797B, radio: 0.2, responsiveposicionx: -12, responsiveposiciony: 8 },
    { x: -34, y: -10, z: -20, color: 0xA587CA, radio: 0.2, responsiveposicionx: -3, responsiveposiciony: -10 },
    { x: -30, y: 20, z: -20, color: 0x8FE968, radio: 0.3, responsiveposicionx: 0, responsiveposiciony: 20 },
    { x: -28, y: -5, z: -20, color: 0xFE797B, radio: 0.2, responsiveposicionx: -8, responsiveposiciony: -7 },
    { x: -22, y: 10, z: -20, color: 0xA587CA, radio: 0.2, responsiveposicionx: -22, responsiveposiciony: 10 },
    { x: -25, y: 22, z: -20, color: 0x8FE968, radio: 0.2, responsiveposicionx: -5, responsiveposiciony: 22 },
    { x: -20, y: -15, z: -20, color: 0x36CEDC, radio: 0.2, responsiveposicionx: -20, responsiveposiciony: -15 },
    { x: -18, y: 3, z: -20, color: 0xA587CA, radio: 0.2, responsiveposicionx: -18, responsiveposiciony: 3 },
    { x: -15, y: -3, z: -20, color: 0xFE797B, radio: 0.2, responsiveposicionx: -15, responsiveposiciony: -3 },
    { x: -10, y: -26, z: -20, color: 0x36CEDC, radio: 0.2, responsiveposicionx: -10, responsiveposiciony: -26},
    { x: -10, y: -10, z: -20, color: 0x36CEDC, radio: 0.2, responsiveposicionx: -10, responsiveposiciony: -10},
    { x: -10, y: 10, z: -20, color: 0x8FE968, radio: 0.2, responsiveposicionx: -7, responsiveposiciony: 10},
    { x: -8, y: 20, z: -20, color: 0x8FE968, radio: 2.5, responsiveposicionx: -8, responsiveposiciony: 18},
    { x: -6, y: 5, z: -20, color: 0x8FE968, radio: 0.2, responsiveposicionx: -2, responsiveposiciony: 5},
    { x: -4, y: -5, z: -20, color: 0x36CEDC, radio: 0.2, responsiveposicionx: 0, responsiveposiciony: -5},
    { x: 0, y: -28, z: -20, color: 0x36CEDC, radio: 0.2, responsiveposicionx: 0, responsiveposiciony: -27},
    { x: 8, y: 13, z: -20, color: 0x8FE968, radio: 0.2, responsiveposicionx: 8, responsiveposiciony: 13},
    { x: 6, y: 5, z: -20, color: 0x8FE968, radio: 0.3, responsiveposicionx: 6, responsiveposiciony: 5},
    { x: -2, y: -18, z: -20, color: 0x36CEDC, radio: 1.5, responsiveposicionx: -2, responsiveposiciony: -18},
    { x: 10, y: 26, z: -20, color: 0x8FE968, radio: 0.2, responsiveposicionx: 10, responsiveposiciony: 26},
    { x: 18, y: 20, z: -20, color: 0x8FE968, radio: 0.3, responsiveposicionx: 14, responsiveposiciony: 17},
    { x: 13, y: -20, z: -20, color: 0x36CEDC, radio: 0.3, responsiveposicionx: 13, responsiveposiciony: -20},
    { x: 17, y: -7, z: -20, color: 0xA587CA, radio: 0.3, responsiveposicionx: 17, responsiveposiciony: -7}, //morado
    { x: 20, y: 5, z: -20, color: 0xA587CA, radio: 0.2, responsiveposicionx: 20, responsiveposiciony: 5},
    { x: 22, y: -17, z: -20, color: 0x36CEDC, radio: 0.4, responsiveposicionx: 20, responsiveposiciony: -17},
    { x: 26, y: -15, z: -20, color: 0x36CEDC, radio: 0.3, responsiveposicionx: 16, responsiveposiciony: -15 },
    { x: 30, y: -25, z: -20, color: 0xA587CA, radio: 1.2, responsiveposicionx: 8, responsiveposiciony: -25 },
    { x: 33, y: -13, z: -20, color: 0xA587CA, radio: 0.5, responsiveposicionx: 6, responsiveposiciony: -12 },
    { x: 35, y: 0, z: -20, color: 0xA587CA, radio: 2.0, responsiveposicionx: 12, responsiveposiciony: 4},
    { x: 40, y: -10, z: -20, color: 0xA587CA, radio: 0.3, responsiveposicionx: 12, responsiveposiciony: -10 },
    { x: 40, y: 10, z: -20, color: 0xA587CA, radio: 0.2, responsiveposicionx: 3, responsiveposiciony: 14},
    { x: 47, y: 25, z: -20, color: 0xA587CA, radio: 1.2, responsiveposicionx: 19, responsiveposiciony: 25 },
    { x: 50, y: -16, z: -20, color: 0x36CEDC, radio: 0.3, responsiveposicionx: 3, responsiveposiciony: -20 },
    { x: 55, y: -13, z: -20, color: 0x36CEDC, radio: 0.3, responsiveposicionx: 2, responsiveposiciony: -1},
    { x: 60, y: 25, z: -20, color: 0xA587CA, radio: 0.4, responsiveposicionx: 20, responsiveposiciony: 20},
    { x: 60, y: -25, z: -20, color: 0x36CEDC, radio: 0.4, responsiveposicionx: 20, responsiveposiciony: -25},
];

const crucesConfig = [
    { x: -50, y: -25, z: -20, color: 0xFE797B, altura: 3, ancho: 3, grosor: 0.1, rotx: 0, roty: 0, rotz: 0, responsiveposicionx: -15, responsiveposiciony: -25},
    { x: -50, y: 15, z: -20, color: 0xFE797B, altura: 2, ancho: 2, grosor: 0.1, rotx: 0, roty: 0, rotz: Math.PI/4, responsiveposicionx: -20, responsiveposiciony: 8},
    { x: -30, y: 25, z: -20, color: 0x8FE968, altura: 1.5, ancho: 1.5, grosor: 0.1, rotx: 0, roty: 0, rotz: 0, responsiveposicionx: -20, responsiveposiciony: 25},
    { x: -20, y: -10, z: -20, color: 0x8FE968, altura: 2.5, ancho: 1.5, grosor: 0.1, rotx: 0, roty: 0, rotz: 0, responsiveposicionx: -19, responsiveposiciony: -10},
    { x: -15, y: -20, z: -20, color: 0x36CEDC, altura: 2.5, ancho: 1.5, grosor: 0.1, rotx: 0, roty: 0, rotz: 0, responsiveposicionx: -10, responsiveposiciony: -18},
    { x: -15, y: 16, z: -20, color: 0x8FE968, altura: 1, ancho: 1, grosor: 0.1, rotx: 0, roty: 0, rotz: 0, responsiveposicionx: -15, responsiveposiciony: 16},
    { x: 20, y: -20, z: -20, color: 0x36CEDC, altura: 3, ancho: 3, grosor: 0.1, rotx: 0, roty: 0, rotz: Math.PI/4, responsiveposicionx: 8, responsiveposiciony: -20},
    { x: 28, y: 10, z: -20, color: 0x8FE968, altura: 1.5, ancho: 1.5, grosor: 0.1, rotx: 0, roty: 0, rotz: 0, responsiveposicionx: 10, responsiveposiciony: 10},
    { x: 35, y: 22, z: -20, color: 0xFE797B, altura: 3, ancho: 3, grosor: 0.1, rotx: 0, roty: 0, rotz: 0, responsiveposicionx: 14, responsiveposiciony: 22},
    { x: 50, y: -25, z: -20, color: 0x36CEDC, altura: 1, ancho: 1, grosor: 0.1, rotx: 0, roty: 0, rotz: Math.PI/4, responsiveposicionx: 18, responsiveposiciony: -12},
    { x: 60, y: 0, z: -20, color: 0xFE797B, altura: 1, ancho: 1, grosor: 0.1, rotx: 0, roty: 0, rotz: 0, responsiveposicionx: 13, responsiveposiciony: 0},
];

const lineasConfig = [
    { x: -70, y: 32, z: -30, altura: 15, responsiveposicionx: -21, responsiveposiciony: 32},
    { x: -55, y: 32, z: -30, altura: 25, responsiveposicionx: -15, responsiveposiciony: 32},
    { x: -35, y: 32, z: -30, altura: 18, responsiveposicionx: -5, responsiveposiciony: 32},
    { x: 35, y: 32, z: -30, altura: 18, responsiveposicionx: 10, responsiveposiciony: 32},
    { x: 55, y: 32, z: -30, altura: 25, responsiveposicionx: 15, responsiveposiciony: 32},
    { x: 70, y: 28, z: -30, altura: 30, responsiveposicionx: 21, responsiveposiciony: 32},
];

const TermometroConfig = [
    { x: 25, y: 0, z: 0, rotationx: 0, rotationy: 0, rotationz: 0, responsiveposicionx: 8.5, responsiveposiciony: 3},
    { x: 20, y: -10, z: 0, rotationx: Math.PI, rotationy: 0, rotationz: 0, responsiveposicionx: 8, responsiveposiciony: -10},
    { x: -25, y: -8, z: 0, rotationx: Math.PI, rotationy: 0, rotationz: 0, responsiveposicionx: -8.5, responsiveposiciony: -8},
    { x: -18, y: 8, z: 0, rotationx: 0, rotationy: 0, rotationz: 0, responsiveposicionx: -9, responsiveposiciony: 6},
];

const nubeconfigLandinPage = [
    { x: -11, y: 13, z: -10, escalado: 0.7 },
    { x: 11, y: -13, z: -10, escalado: 0.5 },
];

const estrellasConfigLandinPage = [
    { x: -70, y: 21, z: -56, color: 0xFE797B, rotationX: 0, rotationY: Math.PI / 7, rotationZ: Math.PI / 2, escalado: 0.6, responsiveposicionx: -21, responsiveposiciony: 23},
    { x: -75, y: -32, z: -56, color:0xFFB750, rotationX: 0, rotationY: Math.PI / 7, rotationZ: Math.PI / 2, escalado: 0.7, responsiveposicionx: -25, responsiveposiciony: -32},
    { x: -55, y: 16, z: -56, color: 0xFFEA56, rotationX: 0, rotationY: Math.PI / 7, rotationZ: Math.PI / 2, escalado: 0.8, responsiveposicionx: -15, responsiveposiciony: 18},
    { x: -46, y: -17, z: -56, color: 0xFE797B, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.5, responsiveposicionx: -16, responsiveposiciony: -15},
    { x: -30, y: 5, z: -56, color: 0xFE797B, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.5, responsiveposicionx: -5, responsiveposiciony: 3},
    { x: -50, y: 0, z: -56, color: 0xFFB750, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.7, responsiveposicionx: -15, responsiveposiciony: 4},
    { x: -33, y: -32, z: -56, color: 0x36CEDC, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.7, responsiveposicionx: -3, responsiveposiciony: -30},
    { x: -35, y: 20, z: -56, color: 0x8FE968, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.8, responsiveposicionx: -5, responsiveposiciony: 21},
    { x: 10, y: 25, z: -56, color: 0x8FE968, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.6, responsiveposicionx: 3, responsiveposiciony: 30},
    { x: 0, y: 15, z: -56, color: 0x8FE968, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.5, responsiveposicionx: 0, responsiveposiciony: 12},
    { x: 7, y: -3, z: -56, color: 0x36CEDC, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.5, responsiveposicionx: 10, responsiveposiciony: -8},
    { x: 10, y: -18, z: -56, color: 0x36CEDC, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.5, responsiveposicionx: 0, responsiveposiciony: -18},
    { x: 10, y: -32, z: -56, color: 0x36CEDC, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.5, responsiveposicionx: 20, responsiveposiciony: -32},
    { x: 34, y: -3, z: -56, color: 0xA587CA, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.5, responsiveposicionx: -5, responsiveposiciony: -8},
    { x: 55, y: -3, z: -56, color: 0xA587CA, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.8, responsiveposicionx: 23, responsiveposiciony: 0},
    { x: 35, y: 20, z: -56, color: 0xA587CA, rotationX: 0, rotationY: - Math.PI / 6, rotationZ: Math.PI / 2, escalado: 0.8, responsiveposicionx: 10, responsiveposiciony: 21},
    { x: 55, y: 15, z: -56, color: 0xFFEA56, rotationX: 0, rotationY: 3 * Math.PI / 4, rotationZ: Math.PI / 2, escalado: 0.8, responsiveposicionx: 15, responsiveposiciony: 17},
    { x: 50, y: -20, z: -56, color: 0xA587CA, rotationX: 0, rotationY: Math.PI, rotationZ: Math.PI / 2, escalado: 0.5, responsiveposicionx: 13, responsiveposiciony: -18},
    { x: 70, y: 10, z: -56, color: 0xA587CA, rotationX: 0, rotationY: 3 * Math.PI / 3.5, rotationZ: Math.PI / 2, escalado: 0.8, responsiveposicionx: 21, responsiveposiciony: 15},
];

const lineasConfigLandinPage = [
    { x: -70, y: 32, z: -56, altura: 15, responsiveposicionx: -21, responsiveposiciony: 32},
    { x: -55, y: 32, z: -56, altura: 25, responsiveposicionx: -15, responsiveposiciony: 32},
    { x: -35, y: 32, z: -56, altura: 18, responsiveposicionx: -5, responsiveposiciony: 32},
    { x: 35, y: 32, z: -56, altura: 18, responsiveposicionx: 10, responsiveposiciony: 32},
    { x: 55, y: 32, z: -56, altura: 25, responsiveposicionx: 15, responsiveposiciony: 32},
    { x: 70, y: 28, z: -56, altura: 30, responsiveposicionx: 21, responsiveposiciony: 32},
];

const TermometroConfigLandinPage = [
    { x: 25, y: 0, z: -7, rotationx: 0, rotationy: 0, rotationz: 0, responsiveposicionx: 8.5, responsiveposiciony: 3},
    { x: 20, y: -10, z: -7, rotationx: Math.PI, rotationy: 0, rotationz: 0, responsiveposicionx: 8, responsiveposiciony: -10},
    { x: -25, y: -8, z: -7, rotationx: Math.PI, rotationy: 0, rotationz: 0, responsiveposicionx: -8.5, responsiveposiciony: -8},
    { x: -18, y: 8, z: -7, rotationx: 0, rotationy: 0, rotationz: 0, responsiveposicionx: -9, responsiveposiciony: 6},
];

const circulosConfigLandinPage = [
    { x: -60, y: 20, z: -40, color: 0x8FE968, radio: 0.2, responsiveposicionx: -20, responsiveposiciony: 21}, //verde
    { x: -55, y: 0, z: -40, color: 0xFE797B, radio: 1.5, responsiveposicionx: -20, responsiveposiciony: 0}, //rojo
    { x: -54, y: -10, z: -40, color: 0xFE797B, radio: 0.4, responsiveposicionx: -17, responsiveposiciony: -10 },
    { x: -50, y: 25, z: -40, color: 0x8FE968, radio: 0.3, responsiveposicionx: -15, responsiveposiciony: 25 },
    { x: -50, y: 5, z: -40, color: 0xFE797B, radio: 0.2, responsiveposicionx: -16, responsiveposiciony: 10},
    { x: -50, y: -25, z: -40, color: 0xA587CA, radio: 0.2, responsiveposicionx: -20, responsiveposiciony: -27},//rosado
    { x: -45, y: -8, z: -40, color: 0xFE797B, radio: 0.4, responsiveposicionx: -5, responsiveposiciony: -3},
    { x: -40, y: 8, z: -40, color: 0xFE797B, radio: 0.2, responsiveposicionx: -20, responsiveposiciony: 8 },
    { x: -40, y: 25, z: -40, color: 0x8FE968, radio: 0.2, responsiveposicionx: -9, responsiveposiciony: 25 },
    { x: -40, y: -18, z: -40, color: 0xA587CA, radio: 0.5, responsiveposicionx: -14, responsiveposiciony: -18},
    { x: -37, y: -22, z: -40, color: 0x36CEDC, radio: 0.2, responsiveposicionx: -17, responsiveposiciony: -22 }, // celeste
    { x: -33, y: -25, z: -40, color: 0x36CEDC, radio: 0.2, responsiveposicionx: -7, responsiveposiciony: -22 },
    { x: -30, y: -20, z: -40, color: 0x36CEDC, radio: 0.2, responsiveposicionx: -5, responsiveposiciony: -17 },
    { x: -30, y: 0, z: -40, color: 0xFE797B, radio: 0.2, responsiveposicionx: -12, responsiveposiciony: 0 },
    { x: -32, y: 10, z: -40, color: 0xFE797B, radio: 0.2, responsiveposicionx: -12, responsiveposiciony: 8 },
    { x: -34, y: -10, z: -40, color: 0xA587CA, radio: 0.2, responsiveposicionx: -3, responsiveposiciony: -10 },
    { x: -30, y: 20, z: -40, color: 0x8FE968, radio: 0.3, responsiveposicionx: 0, responsiveposiciony: 20 },
    { x: -28, y: -5, z: -40, color: 0xFE797B, radio: 0.2, responsiveposicionx: -8, responsiveposiciony: -7 },
    { x: -22, y: 10, z: -40, color: 0xA587CA, radio: 0.2, responsiveposicionx: -22, responsiveposiciony: 10 },
    { x: -25, y: 22, z: -40, color: 0x8FE968, radio: 0.2, responsiveposicionx: -5, responsiveposiciony: 22 },
    { x: -20, y: -15, z: -40, color: 0x36CEDC, radio: 0.2, responsiveposicionx: -20, responsiveposiciony: -15 },
    { x: -18, y: 3, z: -40, color: 0xA587CA, radio: 0.2, responsiveposicionx: -18, responsiveposiciony: 3 },
    { x: -15, y: -3, z: -40, color: 0xFE797B, radio: 0.2, responsiveposicionx: -15, responsiveposiciony: -3 },
    { x: -10, y: -26, z: -40, color: 0x36CEDC, radio: 0.2, responsiveposicionx: -10, responsiveposiciony: -26},
    { x: -10, y: -10, z: -40, color: 0x36CEDC, radio: 0.2, responsiveposicionx: -10, responsiveposiciony: -10},
    { x: -10, y: 10, z: -40, color: 0x8FE968, radio: 0.2, responsiveposicionx: -7, responsiveposiciony: 10},
    { x: -8, y: 20, z: -40, color: 0x8FE968, radio: 2.5, responsiveposicionx: -8, responsiveposiciony: 18},
    { x: -6, y: 5, z: -40, color: 0x8FE968, radio: 0.2, responsiveposicionx: -2, responsiveposiciony: 5},
    { x: -4, y: -5, z: -40, color: 0x36CEDC, radio: 0.2, responsiveposicionx: 0, responsiveposiciony: -5},
    { x: 0, y: -28, z: -40, color: 0x36CEDC, radio: 0.2, responsiveposicionx: 0, responsiveposiciony: -27},
    { x: 8, y: 13, z: -40, color: 0x8FE968, radio: 0.2, responsiveposicionx: 8, responsiveposiciony: 13},
    { x: 6, y: 5, z: -40, color: 0x8FE968, radio: 0.3, responsiveposicionx: 6, responsiveposiciony: 5},
    { x: -2, y: -18, z: -40, color: 0x36CEDC, radio: 1.5, responsiveposicionx: -2, responsiveposiciony: -18},
    { x: 10, y: 26, z: -40, color: 0x8FE968, radio: 0.2, responsiveposicionx: 10, responsiveposiciony: 26},
    { x: 18, y: 20, z: -40, color: 0x8FE968, radio: 0.3, responsiveposicionx: 14, responsiveposiciony: 17},
    { x: 13, y: -20, z: -40, color: 0x36CEDC, radio: 0.3, responsiveposicionx: 13, responsiveposiciony: -20},
    { x: 17, y: -7, z: -40, color: 0xA587CA, radio: 0.3, responsiveposicionx: 17, responsiveposiciony: -7}, //morado
    { x: 20, y: 5, z: -40, color: 0xA587CA, radio: 0.2, responsiveposicionx: 20, responsiveposiciony: 5},
    { x: 22, y: -17, z: -40, color: 0x36CEDC, radio: 0.4, responsiveposicionx: 20, responsiveposiciony: -17},
    { x: 26, y: -15, z: -40, color: 0x36CEDC, radio: 0.3, responsiveposicionx: 16, responsiveposiciony: -15 },
    { x: 30, y: -25, z: -40, color: 0xA587CA, radio: 1.2, responsiveposicionx: 8, responsiveposiciony: -25 },
    { x: 33, y: -13, z: -40, color: 0xA587CA, radio: 0.5, responsiveposicionx: 6, responsiveposiciony: -12 },
    { x: 35, y: 0, z: -40, color: 0xA587CA, radio: 2.0, responsiveposicionx: 12, responsiveposiciony: 4},
    { x: 40, y: -10, z: -40, color: 0xA587CA, radio: 0.3, responsiveposicionx: 12, responsiveposiciony: -10 },
    { x: 40, y: 10, z: -40, color: 0xA587CA, radio: 0.2, responsiveposicionx: 3, responsiveposiciony: 14},
    { x: 47, y: 25, z: -40, color: 0xA587CA, radio: 1.2, responsiveposicionx: 19, responsiveposiciony: 25 },
    { x: 50, y: -16, z: -40, color: 0x36CEDC, radio: 0.3, responsiveposicionx: 3, responsiveposiciony: -20 },
    { x: 55, y: -13, z: -40, color: 0x36CEDC, radio: 0.3, responsiveposicionx: 2, responsiveposiciony: -1},
    { x: 60, y: 25, z: -40, color: 0xA587CA, radio: 0.4, responsiveposicionx: 20, responsiveposiciony: 20},
    { x: 60, y: -25, z: -40, color: 0x36CEDC, radio: 0.4, responsiveposicionx: 20, responsiveposiciony: -25},
];

const crucesConfigLandinPage = [
    { x: -50, y: -25, z: -40, color: 0xFE797B, altura: 3, ancho: 3, grosor: 0.1, rotx: 0, roty: 0, rotz: 0, responsiveposicionx: -15, responsiveposiciony: -25},
    { x: -50, y: 15, z: -40, color: 0xFE797B, altura: 2, ancho: 2, grosor: 0.1, rotx: 0, roty: 0, rotz: Math.PI/4, responsiveposicionx: -20, responsiveposiciony: 8},
    { x: -30, y: 25, z: -40, color: 0x8FE968, altura: 1.5, ancho: 1.5, grosor: 0.1, rotx: 0, roty: 0, rotz: 0, responsiveposicionx: -20, responsiveposiciony: 25},
    { x: -20, y: -10, z: -40, color: 0x8FE968, altura: 2.5, ancho: 1.5, grosor: 0.1, rotx: 0, roty: 0, rotz: 0, responsiveposicionx: -19, responsiveposiciony: -10},
    { x: -15, y: -20, z: -40, color: 0x36CEDC, altura: 2.5, ancho: 1.5, grosor: 0.1, rotx: 0, roty: 0, rotz: 0, responsiveposicionx: -10, responsiveposiciony: -18},
    { x: -15, y: 16, z: -40, color: 0x8FE968, altura: 1, ancho: 1, grosor: 0.1, rotx: 0, roty: 0, rotz: 0, responsiveposicionx: -15, responsiveposiciony: 16},
    { x: 20, y: -20, z: -40, color: 0x36CEDC, altura: 3, ancho: 3, grosor: 0.1, rotx: 0, roty: 0, rotz: Math.PI/4, responsiveposicionx: 8, responsiveposiciony: -20},
    { x: 28, y: 10, z: -40, color: 0x8FE968, altura: 1.5, ancho: 1.5, grosor: 0.1, rotx: 0, roty: 0, rotz: 0, responsiveposicionx: 10, responsiveposiciony: 10},
    { x: 35, y: 22, z: -40, color: 0xFE797B, altura: 3, ancho: 3, grosor: 0.1, rotx: 0, roty: 0, rotz: 0, responsiveposicionx: 14, responsiveposiciony: 22},
    { x: 50, y: -25, z: -40, color: 0x36CEDC, altura: 1, ancho: 1, grosor: 0.1, rotx: 0, roty: 0, rotz: Math.PI/4, responsiveposicionx: 18, responsiveposiciony: -12},
    { x: 60, y: 0, z: -40, color: 0xFE797B, altura: 1, ancho: 1, grosor: 0.1, rotx: 0, roty: 0, rotz: 0, responsiveposicionx: 13, responsiveposiciony: 0},
];

export {nubeconfig, estrellasConfig, circulosConfig, crucesConfig, lineasConfig, TermometroConfig, nubeconfigLandinPage, estrellasConfigLandinPage, lineasConfigLandinPage, TermometroConfigLandinPage, circulosConfigLandinPage, crucesConfigLandinPage};
