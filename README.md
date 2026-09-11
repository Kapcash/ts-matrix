# ts-matrix: A Typescript vector and matrix math library

`ts-matrix` is a collection of vector, matrix and quaternion classes written in Typescript with *no dependencies*.

## How to install it

Using `npm` or `yarn`

```bash
npm install --save ts-matrix
yarn add ts-matrix
```

Or add the [unpkg](https://unpkg.com/) cdn link to your html

```html
<script src="https://unpkg.com/ts-matrix">
```

The library is built as an ECMAScript module (`.mjs` file), but it also exports a UMD version if needed.

## Usage

Import the module, from Typescript or ES6 javascript.

```typescript
import { Vector, Matrix, Quat, EPSILON } from 'ts-matrix';
```

Then use the methods as you want :)

```typescript
const v1 = new Vector([1, 2]);
const v2 = new Vector([3, 1]);
v1.add(v2);
// ==> [4, 3]
```

`Vector`, `Matrix` and `Quat` are all immutable: every arithmetic operation returns a new instance rather than mutating the receiver (the only exceptions are the explicitly in-place helpers `reset()`, `setAsIdentity()`/`setIdentity()`).

If you use typescript, the declarations files are available with self documentation.

---------------------------------------------------------------------------------------

## Documentation

### Vectors

Instance methods

| method | description |
|--------|-------------|
| at(row: number) | Get the value of a cell |
| rows | Returns Vector's size |
| values | Returns Vector values as an array |
| indexOf(value: number) | Returns the index of the value within the Vector, or -1 if it's not found. |
| reset() | Sets all vector values to 0, in place |
| addAValue() | Add a new 0 to the Vector. Returns a new instance. |
| copy() | Returns a new vector with the same values |
| equals(vector: Vector, threshold?: number) | Checks equality between two vectors, optionally within a threshold (default: 0, i.e. exact equality) |
| negate() | Negates the Vector (change all cells arithmetic sign). Returns a new instance. |
| length() | Returns the vectors length |
| squaredLength() | Returns the vectors squared length |
| add(vector: Vector) | Adds all given values to the current Vector instance. Both vectors must have the same dimension. Returns a new instance. |
| subtract(vector: Vector) | Subtracts all given values to the current Vector instance. Both vectors must have the same dimension. Returns a new instance. |
| multiply(vector: Vector) | Multiplies all given values to the current Vector instance. Both vectors must have the same dimension. Returns a new instance. |
| divide(vector: Vector) | Divides all given values to the current Vector instance. Both vectors must have the same dimension. Returns a new instance. |
| multiplyMatrix(matrix: Matrix) | Computes the product of this vector (as a row vector) with a matrix. Returns a new instance. |
| scale(scale: number) | Multiply all vector values by the given scale. |
| normalize() | Computes the normalized Vector. Returns a zero vector if this vector has a length of 0. |
| dot(vector: Vector) | Computes the dot product between two Vectors. |
| cross(vector: Vector) | Computes the cross product between two Vectors. Returns new instance |
| mix(vector: Vector, time: number) | Computes the mix product between two Vectors. Returns new instance |
| angleFrom(vector: Vector) | Returns the angle between two Vectors between 0 and +π inclusive |
| distanceFrom(vector: Vector) | Returns the distance (absolute value) between two Vectors |
| min() | Returns the lowest value from the Vector |
| max() | Returns the highest value from the Vector |
| round() | Rounds all vector values to the nearest integer |
| toString() | Returns a visual representation of the Vector as a string |


Static methods

| method | description |
|--------|-------------|
| get360angle(VectorA: Vector, VectorB: Vector) | Compute the angle between two Vectors. Both vectors must be of dimension 3 exactly. The returned angle is signed, thus -180º < angle < 180º |

---------------------------------------------------------------------------------------

### Matrices

Instance methods

| method | description |
|--------|-------------|
| at(row: number, col: number) | Get the value of a cell |
| rows | Returns the number of rows |
| columns | Returns the number of columns |
| values | Returns matrix values as a bi-dimentional array |
| indexOf(value: number) | Returns the position - as a tuple - of the value within the Matrix, or [-1, -1] if it's not found. |
| reset()         | Sets all matrix values to 0, in place |
| copy()          | Returns a new matrix with the same values |
| addAColumn()    | Add a new empty column to the Matrix. Returns a new instance. |
| addARow()       | Add a new empty row to the Matrix. Returns a new instance. |
| equals(matrix: Matrix, threshold?: number)          | Checks equality between two matrices, optionally within a threshold (default: 0, i.e. exact equality) |
| setAsIdentity() | Fills a squared matrix with the identity values (diagonal 1), in place |
| add(matrix: Matrix)      | Adds two matrices. Both must have the same dimensions. Returns a new instance. |
| subtract(matrix: Matrix) | Subtracts two matrices. Both must have the same dimensions. Returns a new instance. |
| scale(scale: number)     | Multiply all matrix values by the given scale. Returns a new instance. |
| multiply(matrix: Matrix)        | Multiply two matrices. Returns a new instance. |
| multiplyVector(vector: Vector)  | Computes the product of this matrix with a vector. Returns a new instance. |
| determinant()     | Compute the determinant of the matrix. |
| trace()           | Compute the sum of the diagonal values. Throws if the matrix isn't squared. |
| getCofactor(row: number, col: number)     | Compute the cofactor of the matrix. Returns a new instance. |
| transpose()       | Transpose the matrix. Returns a new instance. |
| inverse()         | Inverse the matrix. Returns a new instance. Throws if the matrix isn't squared, or is singular. |
| min() | Returns the lowest value from the Matrix |
| max() | Returns the highest value from the Matrix |
| round() | Rounds all matrix values to the nearest integer |
| toString()     | Returns a visual representation of the Matrix as a string |

Static methods

| method | description |
|--------|-------------|
| identity(dimension: number) | Returns a new squared identity Matrix |
| fromArray(values: number[], rows: number, columns: number) | Builds a new Matrix from a flat, row-major array of values |

---------------------------------------------------------------------------------------

### Quaternions

`Quat` represents a rotation in 3D space as `[x, y, z, w]`, and follows the same immutability convention as `Vector` and `Matrix`.

Instance methods

| method | description |
|--------|-------------|
| at(index: number) | Get the value at index 0-3 |
| values | Returns the quaternion values as an array `[x, y, z, w]` |
| x, y, z, w | The individual components |
| xy, xyz, xyzw | Tuples of the first 2, 3, or all 4 components |
| reset() | Sets all quaternion values to 0, in place |
| copy() | Returns a new quaternion with the same values |
| equals(quat: Quat, threshold?: number) | Checks equality between two quaternions within a threshold (defaults to `EPSILON`) |
| setIdentity() | Sets this quaternion to the identity rotation, in place |
| calculateW() | Computes `w` from `x`, `y`, `z`, assuming a unit quaternion. Returns a new instance. |
| inverse() | Computes the inverse of the quaternion. Returns a new instance. |
| conjugate() | Computes the conjugate of the quaternion. Returns a new instance. |
| length() | Returns the magnitude of the quaternion |
| normalize() | Computes the normalized quaternion. Returns a zero quaternion if this quaternion has a length of 0. |
| add(other: Quat) | Adds two quaternions. Returns a new instance. |
| multiply(other: Quat) | Computes the Hamilton product of two quaternions. Returns a new instance. |
| roll() | Rotation angle around the x-axis, in radians |
| pitch() | Rotation angle around the y-axis, in radians |
| yaw() | Rotation angle around the z-axis, in radians |
| toString() | Returns a visual representation of the quaternion as a string |

Static methods

| method | description |
|--------|-------------|
| identity() | Returns a new identity quaternion |
| dot(q1: Quat, q2: Quat) | Computes the dot product of two quaternions |
| sum(q1: Quat, q2: Quat) | Computes the sum of two quaternions |
| product(q1: Quat, q2: Quat) | Computes the Hamilton product of two quaternions |
| cross(q1: Quat, q2: Quat) | Computes `(q1 * q2 - q2 * q1) / 2`, which reduces to the vector cross product of `q1` and `q2`'s `[x, y, z]` parts when both have a 0 `w` |
| mix(q1: Quat, q2: Quat, time: number) | Spherical linear interpolation (slerp) between two quaternions |
| shortMix(q1: Quat, q2: Quat, time: number) | Slerp between two quaternions, always taking the shortest path around the hypersphere |
| fromAxisAngle(axis: Vector, angle: number) | Builds a quaternion representing a rotation of `angle` radians around a 3D `axis` |

# Contributing

Any contribution is welcome, whether it is an issue, PullRequest, or just a comment!

*Made with love by Florent Catiau-Tristant (@kapcash)*

<a href="https://www.buymeacoffee.com/kapcash" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>