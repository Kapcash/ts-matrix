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
import { Vector, Matrix } from 'ts-matrix';
```

Then use the methods as you want :)

```typescript
const v1 = new Vector([1, 2]);
const v2 = new Vector([3, 1]);
v1.add(v2);
// ==> [4, 3]
```

Most operation return a new Vector instance.

If you use typescript, the declarations files are available with self documentation.

---------------------------------------------------------------------------------------

## Documentation

### Vectors

Instance methods

| method | description |
|--------|-------------|
| at(row: number) | Get the value of a cell |
| rows() | Returns Vector's size |
| values() | Returns Vector values as an array |
| indexOf(value: number) | Returns the index of the value within the Vector, or -1 if it's not found. |
| reset() | Sets all matrix values to 0 |
| addAValue() | Add a new 0 to the Vector |
| addARow() | Add a new empty row to the Matrix |
| equals(vector: Vector) | Checks equality between two vectors |
| negate() | Negates the Vector (change all cells arithmetic sign). Returns a new instance. |
| length() | Returns the vectors length |
| squaredLength() | Returns the vectors squared length |
| add(vector: Vector) | Adds all given values to the current Vector instance. Both vectors must have the same dimension. |
| subtract(vector: Vector) | Subtracts all given values to the current Vector instance. Both vectors must have the same dimension. |
| multiply(vector: Vector) | Multiplies all given values to the current Vector instance. Both vectors must have the same dimension. |
| divide(vector: Vector) | Divides all given values to the current Vector instance. Both vectors must have the same dimension. |
| scale(scale: number) | Multiply all vector values by the given scale. |
| normalize(scale: number) | Computes the normalized Vector. |
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
| rows() | Returns the number of rows |
| cols() | Returns the number of columns |
| values() | Returns matrix values as a bi-dimentional array |
| indexOf(value: number) | Returns the position - as a tuple - of the value within the Matrix, or [-1, -1] if it's not found. |
| reset()         | Sets all matrix values to 0 |
| addAColumn()    | Add a new empty column to the Matrix |
| addARow()       | Add a new empty row to the Matrix |
| equals(matrix: Matrix)          | Checks equality between two matrices |
| setAsIdentity() | Fills a squared matrix with the identity values (diagnonal 1) |
| multiply(matrix: Matrix)        | Multiply two matrices. Returns a new instance. |
| determinant     | Compute the determinant of the matrix. |
| getCofactor(row: number, col: number)     | Compute the cofactor of the matrix. Returns a new instance. |
| transpose()       | Transpose the matrix. Returns a new instance. |
| inverse()         | Inverse the matrix. Returns a new instance. |
| min() | Returns the lowest value from the Matrix |
| max() | Returns the highest value from the Matrix |
| round() | Rounds all matrix values to the nearest integer |
| toString()     | Returns a visual representation of the Matrix as a string |

Static methods

| method | description |
|--------|-------------|
| identity(dimension: number) | Returns a new squared identity Matrix |

# Contributing

Any contribution is welcome, whether it is an issue, PullRequest, or just a comment!

*Made with love by Florent Catiau-Tristant (@kapcash)*

<a href="https://www.buymeacoffee.com/kapcash" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>