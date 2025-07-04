import Matrix from './Matrix';

export default class Vector {

    /** Values of the vector */
    private _values: number[];

    constructor(values?: number[]) {
        // Create matrix filled with 0 by default
        this._values = new Array<number>((values || [0]).length).fill(0);

        if (values) {
            this.values = values;
        }
    }

    get rows() {
        return this.values.length;
    }

    get values() {
        return this._values;
    }

    /**
     * Set values into the vector.
     * If the parameters vector is to wide, the values are cropped to the current vector size.
     * It the parameters vector is to small, remaining cells will be filled with 0.
     * @param newValues Arrays of new values.
     */
    set values(newValues: number[]) {
        const minSize = Math.min(this.values.length, newValues.length);
        for (let i = 0; i < minSize; i++) {
            this.values[i] = newValues[i];
        }
    }

    /**
     * Calculates the angle in radians between vector and the receiver.
     * @param vector The operand vector
     * @return An angle, between 0 and +π inclusive.
     */
    angleFrom(vector: Vector): number {
      if (this.rows !== vector.rows) throw new Error('To calculate the angle, vectors must have the same dimension!');
      const dot = this.dot(vector);
      const cos = dot / (this.length() * vector.length());
      return Math.acos(cos);
    }

    /**
     * Calculates the distance between vector and the receiver.
     * Equivalent to |receiver - vector|
     * @param vector The operand vector
     * @return The distance (absolute value) between the two vectors
     */  
    distanceFrom(vector: Vector): number {
      if(this.rows !== vector.rows) throw new Error('To calculate the distance, vectors must have the same dimension!');
      return this.subtract(vector).length();
    }

    /**
     * Get a matrix value, from its position
     * @param row Matrix line, from 0 to `rows`
     */
    at(row: number): number {
        return this.values[row];
    }

    /**
     * Get the position, from its matrix value
     * @param value The value to search
     * @return The position of the value, or -1 if not found
     */
    indexOf(value: number): number  {
      return this.values.indexOf(value);
    }

    /**
     * Sets all matrix values to 0
     */
    reset(): void {
        this.values = this.values.fill(0);
    }

    /**
     * Add an new row to the matrix, filled with 0
     */
    addAValue(): Vector {
        this.values.push(0);
        return new Vector(this.values);
    }

    /**
     * Check if two matrix are equals, value by value
     * @param mat The matrix against to check equality
     */
    equals(vec: Vector): boolean {
        return (this.rows === vec.rows)
            && this.values.reduce((eql: boolean, val, i) => eql && vec.at(i) === val, true);
    }

    /**
     * Negate all values of the vector (get the opposite sign)
     * @return A new vector whose all values have the opposed sign
     */
    negate(): Vector {
        return new Vector(this.values.map((val) => -val));
    }

    /** Get the length of the vector */
    length(): number {
        return Math.sqrt(this.squaredLength());
    }

    /** Get the squared length of the vector */
    squaredLength(): number {
        return this.dot(this);
    }

    /**
     * Add all vector values with the same position value of the operand vector
     * @param vector The operand vector
     * @throws Error if the two vectors don't have the same dimension
     * @return a new Vector with the result values
     */
    add(vector: Vector): Vector {
        if (this.rows !== vector.rows) throw new Error("Vectors don't have the same dimension!");
        return this.operateOnAllValues((val, i) => (val + vector.at(i)));
    }

    /**
     * subtract all vector values with the same position value of the operand vector
     * @param vector The operand vector
     * @throws Error if the two vectors don't have the same dimension
     * @return a new Vector with the result values
     */
    subtract(vector: Vector): Vector {
        if (this.rows !== vector.rows) throw new Error("Vectors don't have the same dimension!");
        return this.operateOnAllValues((val, i) => (val - vector.at(i)));
    }

    /**
     * Multiply all vector values with the same position value of the operand vector
     * @param vector The operand vector
     * @throws Error if the two vectors don't have the same dimension
     * @return a new Vector with the result values
     */
    multiply(vector: Vector): Vector {
        if (this.rows !== vector.rows) throw new Error("Vectors don't have the same dimension!");
        return this.operateOnAllValues((val, i) => (val * vector.at(i)));
    }

    /**
     * Divide all vector values with the same position value of the operand vector
     * Be aware of divisions by 0!
     * @param vector The operand vector
     * @throws Error if the two vectors don't have the same dimension
     * @return a new Vector with the result values
     */
    divide(vector: Vector): Vector {
        if (this.rows !== vector.rows) throw new Error("Vectors don't have the same dimension!");
        return this.operateOnAllValues((val, i) => {
            if (vector.at(i) === 0) return val;
            return (val / vector.at(i));
        });
    }

    /**
     * Computes the product of this vector with a matrix (vector * matrix)
     * The vector is treated as a row vector
     * @param matrix The matrix to multiply with
     * @throws Error if vector.rows != matrix.rows
     * @return A new Vector, result of the multiplication
     */
    multiplyMatrix(matrix: Matrix): Vector {
        if (this.rows !== matrix.rows) throw new Error("Dimension error! The vector must have the same number of elements as the matrix rows!");
        
        const resultValues = new Array<number>(matrix.columns);
        for (let j = 0; j < matrix.columns; j++) {
            resultValues[j] = this.values.reduce((sum, element, index) => sum + (element * matrix.at(index, j)), 0);
        }
        
        return new Vector(resultValues);
    }

    /**
     * Computes the maximum value of the vector
     * @return The maximum value
     * @throws Error if the vector is empty
     */
    max(): number {
      if (this.rows === 0) throw new Error('Cannot get the maximum value of an empty vector!');
      return Math.max(...this.values);
    }

    /**
     * Computes the minimum value of the vector
     * @return The minimum value
     * @throws Error if the vector is empty
     */
    min(): number {
      if (this.rows === 0) throw new Error('Cannot get the minimum value of an empty vector!');
      return Math.min(...this.values);
    }

    /**
     * Rounds all vector values to the nearest integer
     * @return A new vector with the rounded values
     * @throws Error if the vector is empty
     */
    round(): Vector {
      if(this.rows === 0) throw new Error('Cannot round an empty vector!');
      return this.operateOnAllValues((x) => Math.round(x));
    }

    /**
     * Multiply all vector values by the given number
     * @param scale The number to multiply with the values
     */
    scale(scale: number): Vector {
        return this.operateOnAllValues((val) => (val * scale));
    }

    /**
     * Run a function on all vector values, as a map.
     * @param operation The mapping method
     * @return a new Vector with the operation done on all its values
     */
    private operateOnAllValues(operation: (val: number, index: number) => number): Vector {
        return new Vector(this.values.map(operation));
    }

    /**
     * Computes the normalized vector
     * @return The normalized vector
     */
    normalize(): Vector {
        const vectorLength = this.length();
        return this.operateOnAllValues((val) => val / vectorLength);
    }

    /**
     * Computes the dot product of vectors
     * @param vector The operand vector
     */
    dot(vector: Vector): number {
        return this.values.reduce((res, val, i) => res + (val * vector.at(i)), 0);
    }

    /**
     * Computes the cross product of vectors
     * @param vector The operand vector
     */
    cross(vector: Vector): Vector {
        if (this.rows < 3 || vector.rows < 3) throw new Error('Cross product is possible on 3D vectors only');
        const crossValues = new Array<number>(3);
        crossValues[0] = this.at(1) * vector.at(2) - this.at(2) * vector.at(1);
        crossValues[1] = this.at(2) * vector.at(0) - this.at(0) * vector.at(2);
        crossValues[2] = this.at(0) * vector.at(1) - this.at(1) * vector.at(0);
        return new Vector(crossValues);
    }

    mix(vector: Vector, time: number): Vector {
        return new Vector(this.values.map((val, i) => val + time * (vector.at(i) - val)));
    }

    static get360angle(Va: Vector, Vb: Vector) {
        if (Va.rows !== 3 || Vb.rows !== 3) throw new Error('Vectors must be in 3D!. You can add a 1 dimension if it is missing.');
        return -Math.atan2(
          Vb.cross(Va).dot(new Vector([0, 0, 1]).normalize()),
          Va.dot(Vb)
        );
    }

    toString(): string {
        return `[${this.values.join(', ')}]`;
    }
}
