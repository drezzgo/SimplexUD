//DEFINICIÓN DE CADA UNA DE LAS VARIABLES 
let $ = {
    maxIter: 50,
    iobj: undefined,
    irows: [],
    variables: [],
    pivots: [],
    target: undefined,
    rVector: undefined,
    matrixA: undefined,
    costVector: [],
    p1CostVector: undefined,
    basicVars: undefined,
    basis: undefined,
    cBFS: undefined,
    dim: undefined,
    rCost: undefined,
    minmaxRCost: undefined,
    minmaxRCostIndex: undefined,
    ratio: undefined,
    leavingIndex: undefined,
    kount: 1,
    objZ: undefined,
    basicKount: 0,
    nonBasicKount: 0,
    artificialKount: 0,
    unbounded: undefined,
    history: [],
}

const lclStorageKey = 'simplex2p'

const findTerms = (row) => {
    // Inicializa un array vacío para almacenar los términos procesados
    let rowTerm = [];
    // Divide la cadena 'row' en subcadenas usando una expresión regular
    // La expresión regular (?=\+|\-) busca posiciones que son seguidas por un '+' o un '-'
    const terms = row.split(/(?=\+|\-)/gm);
    
    // Itera sobre cada término en el array 'terms'
    terms.forEach(term => {
        // Elimina los espacios en blanco al principio y al final del término
        term = term.trim();
        
        // Si el término no es una cadena vacía, lo agrega al array 'rowTerm'
        if (term !== '') rowTerm.push(term);
    });
    
    // Devuelve el array de términos procesados
    alert(rowTerm);
    return rowTerm;

}

//FUNCION ENCUENTRA  LOS COEFICIENTES 
const findCoeff = (row) => {
    // Inicializa un objeto vacío para almacenar las variables y sus coeficientes
    let vars = {};

    // Itera sobre cada término en el array 'row'
    row.forEach(term => {
        // Encuentra la variable (una cadena que empieza con una letra y sigue con cualquier caracter)
        const variable = /[a-z].+/gmi.exec(term)[0];
        
        // Encuentra el índice donde comienza la variable en el término
        const i = term.search(/[a-z].+/gmi);

        // Extrae la parte del término que corresponde al valor del coeficiente
        const value = term.slice(0, i);

        let coeff;

        // Determina el coeficiente basado en el valor extraído
        if (value.includes('-')) {
            // Si el valor contiene un '-', el coeficiente es negativo
            const q = value.replace('-', '').trim();
            if (q === '') {
                coeff = -1; // Caso especial: solo '-' significa un coeficiente de -1
            } else {
                coeff = -1 * parseFloat(q); // Convertir a número y hacer negativo
            }
        } else {
            // Si el valor no contiene un '-', el coeficiente es positivo
            const q = value.replace('+', '').trim();
            if (q === '') {
                coeff = 1; // Caso especial: solo '+' o espacio significa un coeficiente de 1
            } else {
                coeff = parseFloat(q); // Convertir a número
            }
        }
        // Agrega la variable a la lista de variables si no está ya incluida
        if (!$.variables.includes(variable)) $.variables.push(variable);

        // Almacena el coeficiente en el objeto 'vars' con la variable como clave
        vars[variable] = coeff;
    });

    // Devuelve el objeto con las variables y sus coeficientes
    return vars;
}



const parseObj = (iobj) => {
    // Divide la cadena 'iobj' en dos partes utilizando '=' como separador
    // 'mtarget' será la parte antes del '='
    // 'row' será la parte después del '='
    const [mtarget, row] = iobj.split('=');
    
    // Elimina los espacios en blanco al principio y al final de 'mtarget'
    // Convierte 'mtarget' a minúsculas
    const target = mtarget.trim().toLowerCase();
    
    // Procesa 'row' para encontrar términos y coeficientes
    // 'findTerms' divide 'row' en términos individuales
    // 'findCoeff' toma los términos y encuentra los coeficientes
    const objvalue = findCoeff(findTerms(row));
    
    // Devuelve un objeto con dos propiedades:
    // 'target': la cadena procesada antes del '=', en minúsculas y sin espacios en blanco
    // 'objvalue': un objeto que contiene las variables y sus coeficientes
    return { target, objvalue };
}

const parseConstraint = (irows) => {
    let signs = []
    const rows = irows.map(row => {
        const le = row.split('<=')
        if (le.length === 2) {
            signs.push('le')
            return le
        }
        const ge = row.split('>=')
        if (ge.length === 2) {
            signs.push('ge')
            return ge
        }
        signs.push('e')
        return row.split('=')
    })
    const rVector = rows.map(row => parseFloat(row[1].trim()))
    const rowTerms = rows.map(row => findTerms(row[0]))
    const coeffDict = rowTerms.map(row => findCoeff(row))
    return { rVector, coeffDict, signs }
}

const getCostVector = (obj) => {
    $.variables.forEach(v => {
        if (v in obj) {
            $.costVector.push(obj[v])
        } else {
            $.costVector.push(0)
        }
    })
}

const findBNegative = (b) => {
    let arr = []
    b.forEach((v, i) => { if (v < 0) arr.push(i) })
    return arr
}

const removeBNegative = (bIndex, cDict, rVector) => {
    if (bIndex.length !== 0) {
        bIndex.forEach(i => {
            Object.keys(cDict[i]).forEach(k => cDict[i][k] = -1 * cDict[i][k])
            rVector[i] = -1 * rVector[i]
        })
    }
}

const assignZeroCoeff = (cDict) => {
    cDict.forEach((row, i) => {
        $.variables.forEach(v => {
            if (!(v in row)) cDict[i][v] = 0
        })
    })
}

const formMatrixA = (cDict) => cDict.map(row => $.variables.map(v => row[v]))

const findRemaining = (matrix, i) => {
    return matrix.slice(0, i).concat(matrix.slice(i + 1, matrix.length))
}

const addVars = (q, i) => {
    const rowWith1 = [...$.matrixA[i], q === 'exedente' ? -1 : 1]
    $.variables.push(`${q}${i}`)
    const remainingRows = findRemaining($.matrixA, i)
    let newRemainingRows = remainingRows.map(row => [...row, 0])
    newRemainingRows.splice(i, 0, rowWith1)
    $.matrixA = newRemainingRows
    if (q !== 'R') $.costVector.push(0)
    return rowWith1.length - 1
}

const addSlackSurplusArtificial = (signs) => {
    signs.forEach((sign, i) => {
        if (sign === 'le') {
            const pivot = addVars('H', i)
            $.pivots.push(pivot)
            return
        }
        if (sign === 'ge') {
            addVars('exedente', i)
            const pivot = addVars('R', i)
            $.pivots.push(pivot)
            return
        }
    })
}

const standardForm = (iobj, irows) => {
    const { target, objvalue } = parseObj(iobj)
    let { rVector, coeffDict, signs } = parseConstraint(irows)
    getCostVector(objvalue)
    const bNegativeIndex = findBNegative(rVector)
    removeBNegative(bNegativeIndex, coeffDict, rVector)
    assignZeroCoeff(coeffDict)
    $.matrixA = formMatrixA(coeffDict)
    printSubtitle('Convertiendo a su forma estandar ')
    printTableCardStandardForm('Matriz de coeficientes de entrada :')
    $.basicKount = $.variables.length
    printVariables('Basic')
    addSlackSurplusArtificial(signs)
    $.nonBasicKount = $.variables.length - $.basicKount
    $.artificialKount = $.variables.length - ($.basicKount + $.nonBasicKount)
    printTableCardStandardForm('Matriz de coeficientes después de sumar variables de holgura, excedentes y artificiales:')
    printVariables('Non-basic')
    return { target, rVector }
}

const getPhase1CostVector = () => {
    return $.variables.map(v => {
        if (v.includes('R')) return 1
        return 0
    })
}

const getBFS = () => {
    let arr = $.variables.map(v => 0)
    $.pivots.forEach((p, i) => arr[p] = $.rVector[i])
    return arr
}

const dotP = (v1, v2) => {
    if (v1.length !== v2.length) return false
    let s = 0
    v1.forEach((q, i) => s += q * v2[i])
    return s
}

const vDivide = (v1, v2) => {
    if (v1.length !== v2.length) return false
    let arr = []
    v1.forEach((q, i) => arr.push(q / v2[i]))
    return arr
}

const vSubtract = (v1, v2) => {
    if (v1.length !== v2.length) return false
    let arr = []
    v1.forEach((q, i) => arr.push(q - v2[i]))
    return arr
}

const getCJBar = (col, cVector, basis) => {
    let p = []
    for (let i = 0; i < $.dim[0]; i++) {
        p.push($.matrixA[i][col])
    }
    return cVector[col] - dotP(p, basis)
}

const findRCost = (cVector) => {
    let cjBar = []
    for (let j = 0; j < $.dim[1]; j++) {
        cjBar.push(getCJBar(j, cVector, $.basis))
    }
    return cjBar
}

const getBasicVars = () => $.pivots.map(p => $.variables[p])

const getBasis = (cVector) => $.pivots.map(p => cVector[p])

const getDim = () => {
    const m = $.rVector.length
    const n = $.variables.length
    return [m, n]
}

const findLeavingVar = (col) => {
    let p = []
    for (let i = 0; i < $.dim[0]; i++) {
        p.push($.matrixA[i][col])
    }
    $.ratio = vDivide($.rVector, p)
    const filteredRatio = $.ratio.filter(q => q >= 0 && q !== Infinity)
    if (filteredRatio.length === 0) {
        $.unbounded = true
        return -1
    }
    const minRatio = Math.min(...filteredRatio)
    const index = $.ratio.indexOf(minRatio)
    return index
}

const rowOperation = (row, col) => {
    const element = $.matrixA[row][col]
    $.matrixA[row].forEach((q, i) => {
        $.matrixA[row][i] = q / element
    })
    $.rVector[row] = $.rVector[row] / element
    const remainingRows = findRemaining($.matrixA, row)
    const rRemaining = findRemaining($.rVector, row)
    const pivotRow = $.matrixA[row]
    const rPivot = $.rVector[row]

    $.matrixA = remainingRows.map((r, i) => {
        const multiplier = r[col]
        const newRow = $.matrixA[row].map(q => q * multiplier)
        rRemaining[i] = rRemaining[i] - $.rVector[row] * multiplier
        return vSubtract(r, newRow)
    })
    $.matrixA.splice(row, 0, pivotRow)
    $.rVector = rRemaining
    $.rVector.splice(row, 0, rPivot)
}

const updatePivot = (row, col) => {
    $.pivots[row] = col
}

const containsArtificial = () => $.basicVars.some(b => b.includes('R'))

const findTargetRCost = (target, rCost) => {
    if (target === 'min') {
        const min = Math.min(...rCost)
        if (min < 0) return min
        return null
    }
    const max = Math.max(...rCost)
    if (max > 0) return max
    return null
}

const getSoln = (v) => dotP(v, $.cBFS)

const checkHistory = () => {
    const s = `${$.minmaxRCostIndex}${$.leavingIndex}${$.objZ}`
    if ($.history.some(h => h === s)) return false
    return $.history.push(s)
}

const checkDecimals = (n) => {
    const decimals = `${n}`.search(/\.\d{6,}/gmi)
    if (decimals === -1) return n
    return n.toFixed(5)
}

const simplex = (phase) => {
    $.basis = (phase === 1) ? getBasis($.p1CostVector) : getBasis($.costVector)
    $.cBFS = getBFS()
    if ($.kount !== 1) printBFS()
    $.objZ = (phase === 1) ? getSoln($.p1CostVector) : getSoln($.costVector)
    $.rCost = (phase === 1) ? findRCost($.p1CostVector) : findRCost($.costVector)
    $.minmaxRCost = (phase === 1) ? Math.min(...$.rCost) : findTargetRCost($.target, $.rCost)
    const card = printTableCard(phase)
    if (!$.minmaxRCost) return false
    $.minmaxRCostIndex = $.rCost.indexOf($.minmaxRCost)
    $.leavingIndex = findLeavingVar($.minmaxRCostIndex)
    printRatio(card)
    if ($.leavingIndex === -1) {
        const msg = 'All minimum ratios are negative or infinity, hence solution is unbounded.'
        printWarning(msg, card)
        return false
    }
    printEnteringLeavingVar(card)
    const historyNotRepeat = checkHistory()
    if (!historyNotRepeat) {
        const msg = 'Degeneracy exists, stopping.'
        printWarning(msg, card)
        return false
    }
    rowOperation($.leavingIndex, $.minmaxRCostIndex)
    updatePivot($.leavingIndex, $.minmaxRCostIndex)
    return true
}

const removeArtificial = () => {
    let artificialIndex = []
    $.variables = $.variables.filter((v, i) => {
        if (v.includes('R')) {
            artificialIndex.push(i)
            return false
        }
        return true
    })
    artificialIndex.forEach(i => {
        $.pivots = $.pivots.map(p => {
            if (p >= i) return p - 1
            return p
        })
    })
    $.cBFS = $.cBFS.filter((q, i) => !artificialIndex.includes(i))
    $.matrixA = $.matrixA.map(row => {
        return row.filter((q, i) => !artificialIndex.includes(i))
    })
    printWarning('Todas las variables artificiales se eliminan de la base.', output)
}

const phase1 = () => {
    printSubtitle('Fase 1: Eliminar variables artificiales ')
    $.dim = getDim()
    $.p1CostVector = getPhase1CostVector()
    while ($.kount <= $.maxIter) {
        $.basicVars = getBasicVars()
        if (!containsArtificial()) break
        if (!simplex(1)) break
        $.kount++
    }
    if ($.kount === $.maxIter + 1) {
        printWarning(`Iteración máxima alcanzada en la fase 1`, output)
        return
    }
    if ($.unbounded) return
    removeArtificial()
}

const phase2 = () => {
    printSubtitle('Fase 2: Encontrando una solución óptima')
    $.dim = getDim()
    while ($.kount <= $.maxIter) {
        $.basicVars = getBasicVars()
        if (!simplex(2)) break
        $.kount++
    }
    if ($.kount === $.maxIter + 1) {
        printWarning(`Iteración máxima alcanzada en la fase 2 `, output)
        return
    }
}

const startSimplex = () => {
    $.basicVars = getBasicVars()
    if (containsArtificial()) phase1()
    if (!$.unbounded) phase2()
    printAnswer()
}

const getProblem = () => {
    const input = problem.value.trim()
    if (input !== '') {
        calculationStart()
        const lines = input.split('\n')
        lines.forEach((line, i) => {
            if (i === 0) {
                $.iobj = line.trim()
            } else {
                $.irows.push(line.trim())
            }
        })
        const standardFormOutput = standardForm($.iobj, $.irows)
        $.target = standardFormOutput.target
        $.rVector = standardFormOutput.rVector
        startSimplex()
        calculationEnd()
    } else {
        printWarning('empty input', emptyMsg)
    }
}
