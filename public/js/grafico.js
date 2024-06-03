const funObj = document.getElementById('FunObj')
const Restricciones = document.getElementById('Restricciones')

let irestricciones =[]; 
let CostoT=[];
let Res_Sin_Signo=[];
let vector_inecuacion=[];
let CoefX1=[];
let CoefX2=[];
let terminosX1=[];
let terminosX2=[];
let TerminoX1FunObj;
let TerminoX2FunObj;
let X1_FunObj;
let X2_FunObj;
let zValue=[];

let signos_operacion=[];
// Restricciones iniciales

function ObtenerProblema() {
   
    const entrada_funcion_obj = funObj.value.trim(); // Obtiene y recorta el valor del problema ingresado
    const Entrada_Restricciones = Restricciones.value.trim(); // Obtiene y recorta el valor del problema ingresado
    
    const Restriccion_Separada = Entrada_Restricciones.split('\n'); // Divide el input en líneas

    Restriccion_Separada.forEach((line, i) => {
        irestricciones.push(line.trim()); 
    });
    console.log(irestricciones);

    AnalizarRestricciones(irestricciones);
    AnalizarFunObj(entrada_funcion_obj);
   /* alert("Costos");
    alert(CostoT);
    alert("Restricciones");
    alert(Res_Sin_Signo)
    alert("Inecuaciones");
    alert(vector_inecuacion);*/
    AnalizarTerminos(Res_Sin_Signo)
    /*alert("TERMINOS X1");
    alert(terminosX1);
    alert("TERMINOS X2");
    alert(terminosX2);
    alert("Signos");
    alert(signos_operacion);
    alert("COEFICIENTES X1")
    alert(CoefX1);
    alert("TERMINOS X2");
    alert(CoefX2);

    alert("Terminos_X1_Funcion_Objetivo");
    alert(TerminoX1FunObj)
    alert("Terminos X2 Funcion Objetivo");
    alert(TerminoX2FunObj)

    alert("Coeficiente x1 Funcion Objetivo");
    alert(X1_FunObj)
    alert("Coeficiente x2 Funcion Objetivo");
    alert(X2_FunObj)*/
    Z_OPtimo()
    GraficarRestricciones()
}
function AnalizarFunObj(entrada_funcion_obj){

    let TerminoX1_FunObj;
    let TerminoX2_FunObj;

    let CoeficienteX1_FunObj;
    let CoeficienteX2_FunObj

        if (entrada_funcion_obj.charAt(0) === "-") {
            console.log("El primer caracter de", entrada_funcion_obj, "es -"); ////Si el primer coeficiente es Negativo
            entrada_funcion_obj=entrada_funcion_obj.slice(1);

            
            if(entrada_funcion_obj.includes('+')){

                separacion = entrada_funcion_obj.split('+');//la restriccion tiene una mas entre dos variables

                TerminoX1_FunObj=separacion[0].trim();
                TerminoX2_FunObj=separacion[1].trim();

                

                 CoeficienteX1_FunObj=sacarCoef(TerminoX1_FunObj);
                 CoeficienteX2_FunObj=sacarCoef(TerminoX2_FunObj);
                CoeficienteX1_FunObj=CoeficienteX1_FunObj*(-1);
               

            }else if(entrada_funcion_obj.includes('-')){
                
                separacion = entrada_funcion_obj.split('-');//la restriccion tiene una resta entre dos variables
               
                TerminoX1_FunObj=separacion[0].trim();
                TerminoX2_FunObj=separacion[1].trim();
                
                 CoeficienteX1_FunObj=sacarCoef(TerminoX1_FunObj);
                 CoeficienteX2_FunObj=sacarCoef(TerminoX2_FunObj);
                
                CoeficienteX1_FunObj=CoeficienteX1_FunObj*(-1);
                CoeficienteX2_FunObj=CoeficienteX2_FunObj*(-1);
                
                
                
            }else{
                   alert("tienes que incluir las 2 variables")

            }////////
                


////////////////////////////////////////////////hasta aqui va lo del primer termino negativo
        }else{

            console.log("El primer caracter de", entrada_funcion_obj, "es +");////Si el primer coeficiente es Positivo

            if(entrada_funcion_obj.includes('+')){

            separacion = entrada_funcion_obj.split('+');//la restriccion tiene una mas entre dos variables

            
            TerminoX1_FunObj=separacion[0].trim();
            TerminoX2_FunObj=separacion[1].trim();

           
            //let CoeficienteX1_FunObj=TerminoX1_FunObj.match(/(\d+)x\d+/)[1];
             CoeficienteX1_FunObj=sacarCoef(TerminoX1_FunObj);
             CoeficienteX2_FunObj=sacarCoef(TerminoX2_FunObj);
           

            }else if(entrada_funcion_obj.includes('-')){
            
            separacion = entrada_funcion_obj.split('-');//la restriccion tiene una resta entre dos variable

            TerminoX1_FunObj=separacion[0].trim();
            TerminoX2_FunObj=separacion[1].trim();
            
             CoeficienteX1_FunObj=sacarCoef(TerminoX1_FunObj);
             CoeficienteX2_FunObj=sacarCoef(TerminoX2_FunObj);

            CoeficienteX2_FunObj=CoeficienteX2_FunObj*(-1);

           
            
            }else{
                alert("tienes que incluir las 2 variables");
            }////////
            
            
            
            
        }
        
        TerminoX1FunObj=TerminoX1_FunObj;
        TerminoX2FunObj=TerminoX2_FunObj;
        X1_FunObj=CoeficienteX1_FunObj;
        X2_FunObj=CoeficienteX2_FunObj;
}

function AnalizarRestricciones(irestricciones){
   

    let Costo = []; // Vector para almacenar los Costos
    let coeff_var= [];
    let SignoDesigualdad=[];
    irestricciones.forEach((restriccion) => {

        if (restriccion.includes('<=')) {

            SignoDesigualdad.push("<=");
            separacion = restriccion.split('<='); // Dividir la restricción en partes utilizando "<="

        } else if (restriccion.includes('>=')) {
            
            SignoDesigualdad.push(">=");
            separacion = restriccion.split('>='); // Dividir la restricción en partes utilizando ">="

        } else if (restriccion.includes('=')) {
            
            SignoDesigualdad.push("=");
            separacion = restriccion.split('='); // Dividir la restricción en partes utilizando "="
        }

        if (separacion.length === 2) {
            Costo.push(separacion[1].trim()); // Agregar la parte que sigue al "<=" al vector resultado
            coeff_var.push(separacion[0].trim()); // Agregar la parte anterior del "<=" al vector resultado
        }
    });


    
    CostoT=Costo.map(element => {

        return parseFloat(element);
    });
    Res_Sin_Signo=coeff_var;
    vector_inecuacion=SignoDesigualdad;
    

}

function AnalizarTerminos(Res_Sin_Signo){

    let terminos_x1=[];
    let terminos_x2=[];
    let coeficientes_x1=[];
    let coeficientes_x2=[];
    let signos=[];
    

            Res_Sin_Signo.forEach((Linea) => {

                if (Linea.charAt(0) === "-") {
                    console.log("El primer caracter de", Linea, "es -"); ////Si el primer coeficiente es Negativo
                    Linea=Linea.slice(1);

                    
                    if(Linea.includes('+')){

                        separacion = Linea.split('+');//la restriccion tiene una mas entre dos variables
    
                        terminos_x1.push(separacion[0].trim());
                        terminos_x2.push(separacion[1].trim());
                        signos.push("+");

                        
                        let X1=sacarCoef(separacion[0].trim());
                        let X2=sacarCoef(separacion[1].trim());
                        X1=X1*(-1);
                        coeficientes_x1.push(X1);
                        coeficientes_x2.push(X2);
    
                    }else if(Linea.includes('-')){
                        
                        separacion = Linea.split('-');//la restriccion tiene una resta entre dos variables
                        terminos_x1.push(separacion[0].trim());
                        terminos_x2.push(separacion[1].trim());
                        signos.push("-");
                        

                        let X1=sacarCoef(separacion[0].trim());
                        let X2=sacarCoef(separacion[1].trim());
                        
                        X1=X1*(-1);
                        X2=X2*(-1);
                        coeficientes_x1.push(X1);
                        coeficientes_x2.push(X2);
                        
                    }else{
                            if(Linea.includes('x1')){
                                terminos_x1.push(Linea.trim());
                                terminos_x2.push(0);
                                signos.push("+")

                                let X1=sacarCoef(Linea.trim());
                                X1=X1*(-1);
                                coeficientes_x1.push(X1);
                                coeficientes_x2.push(0);

                            }else if(Linea.includes('x2')){
                                terminos_x1.push(0);
                                terminos_x2.push(Linea.trim());
                                signos.push("+")

                                let X2=sacarCoef(Linea.trim());
                                X2=X2*(-1);
                                coeficientes_x2.push(X2);
                                coeficientes_x1.push(0);

                            }else{
                                alert("No ingreso ninguna variable en la restriccion"+Linea)
                            }
    
                    }////////
                        


////////////////////////////////////////////////hasta aqui va lo del primer termino negativo
                }else{

                    console.log("El primer caracter de", Linea, "es +");////Si el primer coeficiente es Positivo

                    if(Linea.includes('+')){

                    separacion = Linea.split('+');//la restriccion tiene una mas entre dos variables

                    terminos_x1.push(separacion[0].trim());
                    terminos_x2.push(separacion[1].trim());
                    console.log("X1", separacion[0].trim());
                    signos.push("+");
                    
                    let X1=sacarCoef(separacion[0].trim());
                    
                    let X2=sacarCoef(separacion[1].trim());
                    coeficientes_x1.push(X1);
                    coeficientes_x2.push(X2);

                   

                    }else if(Linea.includes('-')){
                    
                    separacion = Linea.split('-');//la restriccion tiene una resta entre dos variables
                    terminos_x1.push(separacion[0].trim());
                    terminos_x2.push(separacion[1].trim());
                    signos.push("-");

                    let X1=sacarCoef(separacion[0].trim());
                    let X2=sacarCoef(separacion[1].trim());
                    X2=X2*(-1);
                    coeficientes_x1.push(X1);
                    coeficientes_x2.push(X2);
                    
                    }else{
                        if(Linea.includes('x1')){
                            terminos_x1.push(Linea.trim());
                            terminos_x2.push(0);
                            signos.push("+")

                            let X1=sacarCoef(Linea.trim());
                            coeficientes_x1.push(X1);
                            coeficientes_x2.push(0);

                        }else if(Linea.includes('x2')){
                            terminos_x1.push(0);
                            terminos_x2.push(Linea.trim());
                            signos.push("+")

                            let X2=sacarCoef(Linea.trim());
                            coeficientes_x2.push(X2);
                            
                            coeficientes_x1.push(0);
                        }else{
                            alert("No ingreso ninguna variable en la restriccion"+Linea)
                        }

                    }////////
                    
                    
                    
                    
                }
                
            });


    terminosX1=terminos_x1;
    terminosX2=terminos_x2;
    signos_operacion=signos;

    CoefX1=coeficientes_x1;
    CoefX2=coeficientes_x2;
}

function sacarCoef(Terminos){

    const coeficiente_ind=Terminos.match(/(\d+)x\d+/)[1];

    return coeficiente_ind;

}
function calcularInterseccion(coefX1_1, coefX2_1, cost_1, coefX1_2, coefX2_2, cost_2) {
    const denominador = coefX1_1 * coefX2_2 - coefX1_2 * coefX2_1;
    if (denominador === 0) {
        return null;
    }
    const x = (cost_1 * coefX2_2 - cost_2 * coefX2_1) / denominador;
    const y = (coefX1_1 * cost_2 - coefX1_2 * cost_1) / denominador;
    return { x, y };
}


function Z_OPtimo() {
    let PuntosInterseccion = [];

    for (let i = 0; i < CoefX1.length; i++) {
        for (let j = i + 1; j < CoefX1.length; j++) {
            const interseccion = calcularInterseccion(CoefX1[i], CoefX2[i], CostoT[i], CoefX1[j], CoefX2[j], CostoT[j]);
            if (interseccion && interseccion.x >= 0 && interseccion.y >= 0) {
                PuntosInterseccion.push(interseccion);
            }
        }
    }

    PuntosInterseccion.push({ x: 0, y: 0 });

    CoefX1.forEach((coefX1, i) => {
        if (coefX1 !== 0) {
            let x = CostoT[i] / coefX1;
            if (x >= 0) {
                PuntosInterseccion.push({ x: x, y: 0 });
            }
        }
    });

    CoefX2.forEach((coefX2, i) => {
        if (coefX2 !== 0) {
            let y = CostoT[i] / coefX2;
            if (y >= 0) {
                PuntosInterseccion.push({ x: 0, y: y });
            }
        }
    });

    let SolucionesFactibles = PuntosInterseccion.filter(punto => {
        return CoefX1.every((coefX1, i) => {
            let val = coefX1 * punto.x + CoefX2[i] * punto.y;
            return (vector_inecuacion[i] === '<=' && val <= CostoT[i]) ||
                   (vector_inecuacion[i] === '>=' && val >= CostoT[i]) ||
                   (vector_inecuacion[i] === '=' && val === CostoT[i]);
        });
    });

    let SolucionOptima = SolucionesFactibles.reduce((optima, punto) => {
        const valorZ = X1_FunObj * punto.x + X2_FunObj * punto.y;
        if (valorZ > optima.z) {
            return { x: punto.x, y: punto.y, z: valorZ };
        }
        return optima;
    }, { x: 0, y: 0, z: -Infinity });

    document.getElementById("solucion-optima").innerHTML = `
        <p>Solución óptima:</p>
        <table border='1'>
            <tr>
                <th>x</th>
                <th>y</th>
                <th>Z</th>
            </tr>
            <tr>
                <td>${SolucionOptima.x.toFixed(2)}</td>
                <td>${SolucionOptima.y.toFixed(2)}</td>
                <td>${SolucionOptima.z.toFixed(2)}</td>
            </tr>
        </table>
        <p>El punto de intersección es (${SolucionOptima.x.toFixed(2)}, ${SolucionOptima.y.toFixed(2)})</p>
    `;
}

function calcularIntersecciones(coefX1_1, coefX2_1, rhs1, coefX1_2, coefX2_2, rhs2) {
    const det = coefX1_1 * coefX2_2 - coefX1_2 * coefX2_1;
    
    if (det === 0) {
        return null;
    } else {
        const x = (rhs1 * coefX2_2 - rhs2 * coefX2_1) / det;
        const y = (coefX1_1 * rhs2 - coefX1_2 * rhs1) / det;

       
        zValue = (X1_FunObj * x) + (X2_FunObj * y);
        alert("Z")
        alert(zValue)

        return [x, y,zValue];
    }
}

function GraficarRestricciones() {
    const data = [];
    const intersecciones = [];
    const colores = ['blue', 'red', 'green', 'orange', 'purple', 'yellow', 'cyan']; // Lista de colores
    const interseccionesTable = []; // Array para almacenar los datos de las intersecciones

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    CoefX1.forEach((coefX1, index) => {
        const coefX2 = CoefX2[index];
        const rhs = CostoT[index];

        const xValues = Array.from({ length: 601 }, (_, i) => i / 10 - 11); // Rango de -50 a 50
        const yValues = xValues.map(x => (rhs - coefX1 * x) / coefX2);

        data.push({
            x: xValues,
            y: yValues,
            mode: 'lines',
            name: `${coefX1}x1 + ${coefX2}x2 = ${rhs}`
        });

        xValues.forEach(x => {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
        });

        yValues.forEach(y => {
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        });

        for (let j = index + 1; j < CoefX1.length; j++) {
            const interseccion = calcularIntersecciones(coefX1, coefX2, rhs, CoefX1[j], CoefX2[j], CostoT[j]);
            if (interseccion) {
                const [x, y, zValue] = interseccion; // Modificación: ahora interseccion devuelve el valor de z también
                intersecciones.push({
                    x,
                    y,
                    color: colores[intersecciones.length % colores.length], // Asignar un color único a cada punto de intersección
                    restricciones: `${index + 1} y ${j + 1}`, // Guardar las restricciones asociadas
                    zValue: zValue.toFixed(2) // Añadir el valor de z a la tabla
                });

                // Agregar los datos de la intersección a la tabla
                interseccionesTable.push({
                    interseccion: intersecciones.length,
                    x: x.toFixed(2),
                    y: y.toFixed(2),
                    restricciones: `${index + 1} y ${j + 1}`,
                    zValue: zValue.toFixed(2) // Añadir el valor de z a la tabla
                });

                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    });

    // Construir la tabla HTML
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    headerRow.innerHTML = '<th>Intersección</th><th>x</th><th>y</th><th>Restricciones</th><th>Z Total</th>';
    
    interseccionesTable.forEach(interseccion => {
        const row = table.insertRow();
        row.innerHTML = `<td>${interseccion.interseccion}</td><td>${interseccion.x}</td><td>${interseccion.y}</td><td>${interseccion.restricciones}</td><td>${interseccion.zValue}</td>`;
    });

    // Agregar la tabla al documento
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    resultDiv.appendChild(table);

    // Dibujar el gráfico
    intersecciones.forEach(({x, y, color}) => {
        data.push({
            x: [x],
            y: [y],
            mode: 'markers',
            marker: { color: color, size: 10 }, // Usar el color asignado al punto de intersección
            name: `(${x.toFixed(2)}, ${y.toFixed(2)})`
        });
    });

    

    // Sombrero de áreas factibles
    const feasibleAreas = [];
    for (let i = 0; i < data[0].x.length; i++) {
        let feasible = true;
        for (let j = 0; j < data.length - 1; j++) {
            const restriction = vector_inecuacion[j];
            if (restriction === '<=') {
                if (data[j].y[i] > data[j + 1].y[i]) {
                    feasible = false;
                    break;
                }
            } else if (restriction === '>=') {
                if (data[j].y[i] < data[j + 1].y[i]) {
                    feasible = false;
                    break;
                }
            } else if (restriction === '=') {
                if (data[j].y[i] !== data[j + 1].y[i]) {
                    feasible = false;
                    break;
                }
            }
        }
        if (feasible) {
            feasibleAreas.push({
                x: [...data.map(series => series.x[i]), data[0].x[i]], // Agrega los puntos para cerrar el área
                y: [...data.map(series => series.y[i]), data[0].y[i]], // Agrega los puntos para cerrar el área
                fill: 'toself',
                fillcolor: 'rgba(0, 255, 0, 0.4)', // Ajustar la opacidad para hacer el sombreado más visible
                mode: 'none',
                name: 'Área Factible'
            });
        }
    }
    const layout = {
        title: 'Gráfico de Programación Lineal',
        xaxis: { title: 'x1', range: [minX - 10, maxX + 10] }, // Ajustar el rango del eje x
        yaxis: { title: 'x2', range: [minY - 10, maxY + 10] }, // Ajustar el rango del eje y
        showlegend: true
    };

    Plotly.newPlot('plot', [...data, ...feasibleAreas], layout);
}


