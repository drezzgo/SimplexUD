let cantidadRestricciones = 3;
let restricciones = [];
let equivalenciasRestricciones = [];
let resultadoRestricciones = [];

let entrada = 'max = 22x1 + 45x2 \n1x1 - 3x2 <= 42\n1x1 + 2x2 <= 40\n0.5x1 + 1x2 <= 15';

let partes = entrada.trim().split('\n');
console.log(partes);

for (let i = 0; i < partes.length; i++) {
    partes[i] = partes[i].trim().replace("max = ", "").replace("min = ", "").replace("x1", "").replace("x2", "").replace("- ", "-").replace(" + ", " ");
    console.log("Parte "+i+" : "+partes[i]);

    partes[i] = partes[i].split(" ");
    console.log(partes[i]);

    let coeficienteX1 = parseFloat(partes[i][0]);
    let coeficienteX2 = parseFloat(partes[i][1]);
    restricciones.push([coeficienteX1, coeficienteX2]);
    
    let equivalencia;
    let resultado;
    if (i!=0) {
        let equivalencia = partes[i][2];
        let resultado = parseFloat(partes[i][3]);
        equivalenciasRestricciones.push(equivalencia);
        resultadoRestricciones.push(resultado);
    }
}

console.log("Restricciones: ", restricciones);
console.log("Equivalencias: ", equivalenciasRestricciones);
console.log("Resultados: ", resultadoRestricciones);




