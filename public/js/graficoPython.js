let cantidadRestricciones = 3;
let restricciones = {};
let equivalenciasRestricciones = {};
let resultadoRestricciones = {};

let entrada = 'max = 22x1 + 45x2 \n1x1 - 3x2 <= 42\n1x1 + 2x2 <= 40\n0.5x1 + 1x2 <= 15';

let partes = entrada.trim().split('\n');
console.log(partes);

for (let i = 0; i < partes.length; i++) {
    partes[i] = partes[i].replace("max = ", "").replace("min = ", "").replace("x1", "").replace("x2", "").replace("- ", "-");
    console.log("Parte "+i+" : "+partes[i])

    partes[i] = partes[i].split(" ")
    console.log("Parte "+i+" : "+partes[i]+"\n")

    coeficienteX1 = int(partes[0])
}




