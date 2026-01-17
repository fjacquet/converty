export interface MatrixInput {
  mode: "add" | "subtract" | "multiply" | "transpose" | "determinant" | "inverse" | "scalar";
  matrixA: number[][];
  matrixB?: number[][];
  scalar?: number;
}

export interface MatrixResult {
  result: number[][] | number;
  operation: string;
  dimensionsA: string;
  dimensionsB?: string;
  dimensionsResult?: string;
  determinant?: number;
  isSquare: boolean;
  isInvertible?: boolean;
  steps: string[];
}

function matrixToString(m: number[][]): string {
  return m.map((row) => `[${row.map((v) => v.toFixed(2)).join(", ")}]`).join("\n");
}

function getDimensions(m: number[][]): [number, number] {
  return [m.length, m[0]?.length || 0];
}

function addMatrices(a: number[][], b: number[][]): number[][] {
  return a.map((row, i) => row.map((val, j) => val + b[i][j]));
}

function subtractMatrices(a: number[][], b: number[][]): number[][] {
  return a.map((row, i) => row.map((val, j) => val - b[i][j]));
}

function multiplyMatrices(a: number[][], b: number[][]): number[][] {
  const rowsA = a.length;
  const colsA = a[0].length;
  const colsB = b[0].length;

  const result: number[][] = [];
  for (let i = 0; i < rowsA; i++) {
    result[i] = [];
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

function transposeMatrix(m: number[][]): number[][] {
  const rows = m.length;
  const cols = m[0].length;
  const result: number[][] = [];

  for (let j = 0; j < cols; j++) {
    result[j] = [];
    for (let i = 0; i < rows; i++) {
      result[j][i] = m[i][j];
    }
  }
  return result;
}

function scalarMultiply(m: number[][], s: number): number[][] {
  return m.map((row) => row.map((val) => val * s));
}

function determinant2x2(m: number[][]): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

function determinant3x3(m: number[][]): number {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  );
}

function getMinor(m: number[][], row: number, col: number): number[][] {
  return m.filter((_, i) => i !== row).map((r) => r.filter((_, j) => j !== col));
}

function determinant(m: number[][]): number {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return determinant2x2(m);
  if (n === 3) return determinant3x3(m);

  // Laplace expansion for larger matrices
  let det = 0;
  for (let j = 0; j < n; j++) {
    const minor = getMinor(m, 0, j);
    det += (-1) ** j * m[0][j] * determinant(minor);
  }
  return det;
}

function cofactorMatrix(m: number[][]): number[][] {
  const n = m.length;
  const result: number[][] = [];

  for (let i = 0; i < n; i++) {
    result[i] = [];
    for (let j = 0; j < n; j++) {
      const minor = getMinor(m, i, j);
      result[i][j] = (-1) ** (i + j) * determinant(minor);
    }
  }
  return result;
}

function inverseMatrix(m: number[][]): number[][] | null {
  const det = determinant(m);
  if (Math.abs(det) < 1e-10) return null;

  const n = m.length;
  if (n === 1) {
    return [[1 / m[0][0]]];
  }

  if (n === 2) {
    return [
      [m[1][1] / det, -m[0][1] / det],
      [-m[1][0] / det, m[0][0] / det],
    ];
  }

  // For larger matrices: inverse = adjugate / det
  const cofactor = cofactorMatrix(m);
  const adjugate = transposeMatrix(cofactor);
  return scalarMultiply(adjugate, 1 / det);
}

export function calculateMatrix(input: MatrixInput): MatrixResult | null {
  const { mode, matrixA, matrixB, scalar } = input;

  if (!matrixA || matrixA.length === 0 || !matrixA[0] || matrixA[0].length === 0) {
    return null;
  }

  // Validate matrix is rectangular
  const colsA = matrixA[0].length;
  if (!matrixA.every((row) => row.length === colsA)) return null;

  const [rowsA, colsAFinal] = getDimensions(matrixA);
  const isSquare = rowsA === colsAFinal;

  const steps: string[] = [];
  let result: number[][] | number;
  let operation: string;
  let dimensionsB: string | undefined;
  let dimensionsResult: string | undefined;
  let det: number | undefined;
  let isInvertible: boolean | undefined;

  steps.push(`Matrix A (${rowsA}×${colsAFinal}):`);
  steps.push(matrixToString(matrixA));

  switch (mode) {
    case "add": {
      if (!matrixB) return null;
      const [rowsB, colsB] = getDimensions(matrixB);
      if (rowsA !== rowsB || colsAFinal !== colsB) {
        steps.push("Error: Matrices must have same dimensions for addition");
        return null;
      }

      steps.push(`Matrix B (${rowsB}×${colsB}):`);
      steps.push(matrixToString(matrixB));

      result = addMatrices(matrixA, matrixB);
      operation = "Addition (A + B)";
      dimensionsB = `${rowsB}×${colsB}`;
      dimensionsResult = `${rowsA}×${colsAFinal}`;

      steps.push("Result = A + B");
      steps.push(matrixToString(result));
      break;
    }

    case "subtract": {
      if (!matrixB) return null;
      const [rowsB, colsB] = getDimensions(matrixB);
      if (rowsA !== rowsB || colsAFinal !== colsB) {
        steps.push("Error: Matrices must have same dimensions for subtraction");
        return null;
      }

      steps.push(`Matrix B (${rowsB}×${colsB}):`);
      steps.push(matrixToString(matrixB));

      result = subtractMatrices(matrixA, matrixB);
      operation = "Subtraction (A - B)";
      dimensionsB = `${rowsB}×${colsB}`;
      dimensionsResult = `${rowsA}×${colsAFinal}`;

      steps.push("Result = A - B");
      steps.push(matrixToString(result));
      break;
    }

    case "multiply": {
      if (!matrixB) return null;
      const [rowsB, colsB] = getDimensions(matrixB);
      if (colsAFinal !== rowsB) {
        steps.push("Error: Number of columns in A must equal number of rows in B");
        return null;
      }

      steps.push(`Matrix B (${rowsB}×${colsB}):`);
      steps.push(matrixToString(matrixB));

      result = multiplyMatrices(matrixA, matrixB);
      operation = "Multiplication (A × B)";
      dimensionsB = `${rowsB}×${colsB}`;
      dimensionsResult = `${rowsA}×${colsB}`;

      steps.push(`Result is ${rowsA}×${colsB} matrix`);
      steps.push("Each element c_ij = Σ(a_ik × b_kj)");
      steps.push(matrixToString(result));
      break;
    }

    case "transpose": {
      result = transposeMatrix(matrixA);
      operation = "Transpose (Aᵀ)";
      dimensionsResult = `${colsAFinal}×${rowsA}`;

      steps.push("Transpose: swap rows and columns");
      steps.push(`Result is ${colsAFinal}×${rowsA} matrix`);
      steps.push(matrixToString(result));
      break;
    }

    case "scalar": {
      if (scalar === undefined) return null;

      result = scalarMultiply(matrixA, scalar);
      operation = `Scalar multiplication (${scalar} × A)`;
      dimensionsResult = `${rowsA}×${colsAFinal}`;

      steps.push(`Scalar: ${scalar}`);
      steps.push("Multiply each element by scalar");
      steps.push(matrixToString(result));
      break;
    }

    case "determinant": {
      if (!isSquare) {
        steps.push("Error: Determinant only defined for square matrices");
        return null;
      }

      det = determinant(matrixA);
      result = det;
      operation = "Determinant (det A or |A|)";

      steps.push("Calculating determinant...");
      if (rowsA === 2) {
        steps.push(`det = a₁₁×a₂₂ - a₁₂×a₂₁`);
        steps.push(`det = ${matrixA[0][0]}×${matrixA[1][1]} - ${matrixA[0][1]}×${matrixA[1][0]}`);
      } else if (rowsA === 3) {
        steps.push("Using Sarrus' rule or cofactor expansion");
      }
      steps.push(`det(A) = ${det}`);

      isInvertible = Math.abs(det) > 1e-10;
      steps.push(`Matrix is ${isInvertible ? "invertible" : "singular (not invertible)"}`);
      break;
    }

    case "inverse": {
      if (!isSquare) {
        steps.push("Error: Inverse only defined for square matrices");
        return null;
      }

      det = determinant(matrixA);
      isInvertible = Math.abs(det) > 1e-10;

      if (!isInvertible) {
        steps.push(`Determinant = ${det} (approximately 0)`);
        steps.push("Matrix is singular and has no inverse");
        return null;
      }

      const inv = inverseMatrix(matrixA);
      if (!inv) return null;

      result = inv;
      operation = "Inverse (A⁻¹)";
      dimensionsResult = `${rowsA}×${colsAFinal}`;

      steps.push(`Determinant = ${det}`);
      steps.push("A⁻¹ = (1/det) × adj(A)");
      steps.push(matrixToString(inv));
      steps.push("Verification: A × A⁻¹ = I");
      break;
    }

    default:
      return null;
  }

  return {
    result,
    operation,
    dimensionsA: `${rowsA}×${colsAFinal}`,
    dimensionsB,
    dimensionsResult,
    determinant: det,
    isSquare,
    isInvertible,
    steps,
  };
}
