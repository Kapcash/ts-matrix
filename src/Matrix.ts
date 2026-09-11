import Vector from './Vector';

export default class Matrix {

    /** Number of rows of the matrix */
    private _rows: number;
    /** Number of columns of the matrix */
    private _columns: number;
    /** Values of the matrix as a two dimensional array */
    private _values: number[][];

    constructor(rows: number, columns: number, values?: number[][]) {
        this._rows = Math.max(rows, 1);
        this._columns = Math.max(columns, 1);
        // Create matrix filled with 0 by default
        this._values = new Array<number[]>(this._rows).fill([]).map(() => new Array<number>(this._columns).fill(0));

        if (values) {
            this.values = values;
        }
    }

    get rows(): number {
        return this._rows;
    }
    get columns(): number {
        return this._columns;
    }
    get values(): number[][] {
        return this._values;
    }

    /**
     * Set values into the matrix.
     * If the parameters matrix is to wide, the values are cropped to the current matrix size.
     * It the parameters matrix is to small, remaining cells will be filled with 0.
     * @param newValues Arrays of new values.
     */
    set values(newValues: number[][]) {
        if (newValues.length === 0) return;
        const minRow = Math.min(newValues.length, this.rows);
        const minCol = Math.min(newValues[0].length, this.columns);
        for (let r = 0; r < minRow; r++) {
            for (let c = 0; c < minCol; c++) {
                this.values[r][c] = newValues[r][c];
            }
        }
    }

    /**
     * Get a matrix value, from its position
     * @param row Matrix line, from 0 to `rows`
     * @param col Matric column, from 0 to `columns`
     */
    at(row: number, col: number): number {
        return this.values[row][col];
    }

    /**
     * Sets all matrix values to 0
     */
    reset(): void {
        this.values = this.values.map((row) => row.map(() => 0));
    }

    /**
     * Get a copy of this matrix
     * @return A new matrix with the same values
     */
    copy(): Matrix {
        return new Matrix(this.rows, this.columns, this.values);
    }

    /**
     * Computes the trace of the matrix, i.e. the sum of its diagonal values
     * @throws Error if the matrix is not squared
     */
    trace(): number {
        if (this.rows !== this.columns) throw new Error("Dimension error! The matrix isn't squared!");
        let sum = 0;
        for (let i = 0; i < this.rows; i++) {
            sum += this.at(i, i);
        }
        return sum;
    }

    /**
     * Add an new column to the matrix, filled with 0
     */
    addAColumn(): Matrix {
        return new Matrix(this.rows, this.columns + 1, this.values);
    }

    /**
     * Add an new row to the matrix, filled with 0
     */
    addARow(): Matrix {
        return new Matrix(this.rows + 1, this.columns, this.values);
    }

    /**
     * Check if two matrix are equals, value by value
     * @param mat The matrix against to check equality
     * @param threshold The maximum allowed difference between two values to still be considered equal (default: 0, i.e. exact equality)
     */
    equals(mat: Matrix, threshold = 0): boolean {
        // Reduce on rows -> reduce on columns -> if a value != then false!
        return (this.rows === mat.rows && this.columns === mat.columns)
            && this.values.reduce(// Rows
                (eql: boolean, row, i) => eql && row.reduce(// Columns (real values)
                        (eql2: boolean, val, j) => eql2 && Math.abs(mat.at(i, j) - val) <= threshold, eql)
                , true);
    }

    /**
     * Sets the matrix as an identity matrix
     */
    setAsIdentity() {
        if (this.rows !== this.columns) throw new Error("Dimension error! The matrix isn't squared!");
        this.values.forEach((row, i) => {
            row.forEach((c, j) => {
                this.values[i][j] = i === j ? 1 : 0;
            });
        });
        return this;
    }

    /**
     * Gets an identity matrix (1 on diagonal)
     * @param dimension Dimension of the squared matrix
     */
    static identity(dimension: number): Matrix {
        if (dimension < 1) throw Error('Dimension error! Matrix dimension must be positive.');
        return new Matrix(dimension, dimension).setAsIdentity();
    }

    /**
     * Builds a matrix from a flat, row-major array of values
     * @param values Flat array of values, read row by row
     * @param rows Number of rows
     * @param columns Number of columns
     * @throws Error if values.length !== rows * columns
     * @return A new Matrix built from the given values
     */
    static fromArray(values: number[], rows: number, columns: number): Matrix {
        if (values.length !== rows * columns) throw new Error(`Dimension error! Expected ${rows * columns} values for a ${rows}x${columns} matrix, got ${values.length}.`);

        const rowMajorValues = new Array<number[]>(rows);
        for (let i = 0; i < rows; i++) {
            rowMajorValues[i] = values.slice(i * columns, (i + 1) * columns);
        }

        return new Matrix(rows, columns, rowMajorValues);
    }

    /**
     * Add all matrix values with the same position value of the operand matrix
     * @param mat The operand matrix
     * @throws Error if the two matrices don't have the same dimensions
     * @return A new Matrix with the result values
     */
    add(mat: Matrix): Matrix {
        if (this.rows !== mat.rows || this.columns !== mat.columns) throw new Error("Dimension error! Both matrices must have the same dimensions!");
        return this.operateOnAllValues((val, i, j) => val + mat.at(i, j));
    }

    /**
     * Subtract all matrix values with the same position value of the operand matrix
     * @param mat The operand matrix
     * @throws Error if the two matrices don't have the same dimensions
     * @return A new Matrix with the result values
     */
    subtract(mat: Matrix): Matrix {
        if (this.rows !== mat.rows || this.columns !== mat.columns) throw new Error("Dimension error! Both matrices must have the same dimensions!");
        return this.operateOnAllValues((val, i, j) => val - mat.at(i, j));
    }

    /**
     * Multiply all matrix values by the given number
     * @param scale The number to multiply with the values
     * @return A new Matrix with the result values
     */
    scale(scale: number): Matrix {
        return this.operateOnAllValues((val) => val * scale);
    }

    /**
     * Run a function on all matrix values, as a map.
     * @param operation The mapping method
     * @return a new Matrix with the operation done on all its values
     */
    private operateOnAllValues(operation: (val: number, row: number, col: number) => number): Matrix {
        return new Matrix(this.rows, this.columns, this.values.map((row, i) => row.map((val, j) => operation(val, i, j))));
    }

    /**
     * Computes the product with another matrix
     * @param mat The second operand matrix
     * @throws Error if matrixA.columns != matrixB.rows
     * @return A new Matrix, result of the multiplication
     */
    multiply(mat: Matrix): Matrix {
        if (this.columns !== mat.rows) throw new Error("Dimension error! The operand matrix must have the same number of rows as 'this' matrix columns!");
        const resMatrix = new Matrix(this.rows, mat.columns);
        resMatrix.values = resMatrix.values.map((row, i) => {
            return row.map((val, j) => {
                return this.values[i].reduce((sum, elm, k) => sum + (elm * mat.at(k, j)), 0);
            });
        });
        return resMatrix;
    }

    /**
     * Computes the product with a vector
     * @param vec The vector to multiply with
     * @throws Error if matrix.columns != vector.rows
     * @return A new Vector, result of the multiplication
     */
    multiplyVector(vec: Vector): Vector {
        if (this.columns !== vec.rows) throw new Error("Dimension error! The vector must have the same number of elements as the matrix columns!");
        
        const resultValues = this.values.map(row => {
            return row.reduce((sum, element, index) => sum + (element * vec.at(index)), 0);
        });
        
        return new Vector(resultValues);
    }

    /**
     * Get the position, from its matrix value
     * @param value The value to search
     * @return The position of the value, or -1 if not found
     */
    indexOf(value: number): [number, number]  {
      for(let i = 0; i < this.rows; i++) {
        for(let j = 0; j < this.columns; j++) {
          if(this.values[i][j] === value) return [i, j];
        }
      }

      return [-1, -1];
    }

    /**
     * Computes the maximum value of the matrix
     * @return The maximum value
     */
    max(): number {
      return this.values.reduce((max, row) => Math.max(max, ...row), -Infinity);
    }

    /**
     * Computes the minimum value of the matrix
     * @return The minimum value
     * @throws Error if the matrix is empty
     */
    min(): number {
      return this.values.reduce((min, row) => Math.min(min, ...row), Infinity);
    }

    /**
     * Rounds all matrix values to the nearest integer
     * @return A new matrix with the rounded values
     */
    round(): Matrix {
      return new Matrix(this.rows, this.columns, this.values.map(row => row.map(val => Math.round(val))));
    }

    /**
     * Computes the determinant of the matrix via LU decomposition with partial
     * pivoting, in O(n^3) instead of the O(n!) of a cofactor expansion.
     * @throws Error if the matrix is not squared
     */
    determinant(): number {
        if (this.rows !== this.columns) throw new Error("Dimension error! The matrix isn't squared!");

        const n = this.rows;
        const a = this.values.map((row) => [...row]);
        let sign = 1;

        for (let k = 0; k < n; k++) {
            let pivotRow = k;
            let maxAbs = Math.abs(a[k][k]);
            for (let i = k + 1; i < n; i++) {
                if (Math.abs(a[i][k]) > maxAbs) {
                    maxAbs = Math.abs(a[i][k]);
                    pivotRow = i;
                }
            }
            // No non-zero pivot left in this column: the matrix is singular.
            if (maxAbs === 0) return 0;

            if (pivotRow !== k) {
                [a[k], a[pivotRow]] = [a[pivotRow], a[k]];
                sign = -sign;
            }

            for (let i = k + 1; i < n; i++) {
                const factor = a[i][k] / a[k][k];
                for (let j = k; j < n; j++) {
                    a[i][j] -= factor * a[k][j];
                }
            }
        }

        let det = sign;
        for (let i = 0; i < n; i++) det *= a[i][i];
        return det;
    }

    /**
     * Gets a cofactor matrix
     * @param row The row to omit in the matrix
     * @param col The column to omit in the matrix
     * @return The cofactor matrix sized (r-1)x(c-1)
     */
    getCofactor(row: number, col: number): Matrix {
        return new Matrix(this.rows - 1, this.columns - 1, this.values
            .filter((v, i) => i !== row) // Remove the unnecessary row
            .map((c) => c.filter((v, i) => i !== col)));
    }

    /**
     * Computes a transposed the matrix
     * @return A new matrix sized (columns) x (rows)
     */
    transpose(): Matrix {
        return new Matrix(this.columns, this.rows, new Array<number[]>(this.columns).fill([])
            .map((row, i) => new Array<number>(this.rows).fill(0).map((c, j) => this.at(j, i))));
    }

    /**
     * Computes the inversed matrix via Gauss-Jordan elimination with partial
     * pivoting, in O(n^3) instead of the O(n!) of a cofactor/adjugate approach.
     * @return A new matrix inversed
     * @throws Error if the matrix is not squared, or is singular (not invertible)
     */
    inverse(): Matrix {
        if (this.rows !== this.columns) throw new Error("Dimension error! The matrix isn't squared!");

        const n = this.rows;
        // Augmented matrix [A | I], reduced in place to [I | A^-1]
        const a = this.values.map((row, i) => [
            ...row,
            ...new Array<number>(n).fill(0).map((_, j) => (i === j ? 1 : 0)),
        ]);

        for (let k = 0; k < n; k++) {
            let pivotRow = k;
            let maxAbs = Math.abs(a[k][k]);
            for (let i = k + 1; i < n; i++) {
                if (Math.abs(a[i][k]) > maxAbs) {
                    maxAbs = Math.abs(a[i][k]);
                    pivotRow = i;
                }
            }
            if (maxAbs === 0) throw new Error("Determinant is 0, can't compute inverse.");

            if (pivotRow !== k) [a[k], a[pivotRow]] = [a[pivotRow], a[k]];

            const pivot = a[k][k];
            for (let j = 0; j < 2 * n; j++) a[k][j] /= pivot;

            for (let i = 0; i < n; i++) {
                if (i === k) continue;
                const factor = a[i][k];
                for (let j = 0; j < 2 * n; j++) {
                    a[i][j] -= factor * a[k][j];
                }
            }
        }

        return new Matrix(n, n, a.map((row) => row.slice(n)));
    }

    toString(): string {
        return `[${this.values.map(row => `[${row.join(', ')}]`).join(',\n')}]`;
    }
}
