import { EPSILON } from './constants';
import Vector from './Vector';

/**
 * Class representing a Quaternion for 3D rotations
 */
export default class Quat {

    /** Values of the quaternion as [x, y, z, w] */
    private _values: number[];

    constructor(values?: [number, number, number, number]) {
        // Create quaternion with identity by default [0, 0, 0, 1]
        this._values = [0, 0, 0, 1];

        if (values) {
            this.xyzw = values;
        }
    }

    get values(): number[] {
        return this._values;
    }

    /**
     * Set values into the quaternion.
     * @param newValues Array of new values [x, y, z, w].
     */
    set values(newValues: number[]) {
        const minSize = Math.min(4, newValues.length);
        for (let i = 0; i < minSize; i++) {
            this._values[i] = newValues[i];
        }
    }

    get x(): number {
        return this._values[0];
    }

    set x(value: number) {
        this._values[0] = value;
    }

    get y(): number {
        return this._values[1];
    }

    set y(value: number) {
        this._values[1] = value;
    }

    get z(): number {
        return this._values[2];
    }

    set z(value: number) {
        this._values[2] = value;
    }
    
    get w(): number {
        return this._values[3];
    }
    
    set w(value: number) {
        this._values[3] = value;
    }

    get xy(): [number, number] {
        return [
            this._values[0],
            this._values[1],
        ];
    }

    set xy(values: [number, number]) {
        this._values[0] = values[0];
        this._values[1] = values[1];
    }

    get xyz(): [number, number, number] {
        return [
            this._values[0],
            this._values[1],
            this._values[2],
        ];
    }

    set xyz(values: [number, number, number]) {
        this._values[0] = values[0];
        this._values[1] = values[1];
        this._values[2] = values[2];
    }

    get xyzw(): [number, number, number, number] {
        return [
            this._values[0],
            this._values[1],
            this._values[2],
            this._values[3],
        ];
    }

    set xyzw(values: [number, number, number, number]) {
        this._values[0] = values[0];
        this._values[1] = values[1];
        this._values[2] = values[2];
        this._values[3] = values[3];
    }

    /**
     * Get an identity quaternion (rotation by 0 degrees)
     * @return A new identity quaternion
     */
    static identity(): Quat {
        return new Quat([0, 0, 0, 1]);
    }

    /**
     * Get a quaternion value at a specific index
     * @param index Index from 0 to 3
     * @return The value at the specified index
     */
    at(index: number): number {
        return this._values[index];
    }

    /**
     * Reset all quaternion values to 0
     */
    reset(): void {
        for (let i = 0; i < 4; i++) {
            this._values[i] = 0;
        }
    }

    /**
     * Copy the quaternion to another quaternion
     * @param dest Destination quaternion (optional)
     * @return The destination quaternion
     */
    copy(dest?: Quat): Quat {
        if (!dest) { dest = new Quat(); }

        for (let i = 0; i < 4; i++) {
            dest._values[i] = this._values[i];
        }

        return dest;
    }

    /**
     * Calculate the roll angle (rotation around x-axis)
     * @return Roll angle in radians
     */
    roll(): number {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const w = this.w;

        return Math.atan2(2.0 * (x * y + w * z), w * w + x * x - y * y - z * z);
    }

    /**
     * Calculate the pitch angle (rotation around y-axis)
     * @return Pitch angle in radians
     */
    pitch(): number {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const w = this.w;

        return Math.atan2(2.0 * (y * z + w * x), w * w - x * x - y * y + z * z);
    }

    /**
     * Calculate the yaw angle (rotation around z-axis)
     * @return Yaw angle in radians
     */
    yaw(): number {
        return Math.asin(2.0 * (this.x * this.z - this.w * this.y));
    }

    /**
     * Check if two quaternions are equal within a threshold
     * @param quat The quaternion to compare against
     * @param threshold The threshold for comparison (default: EPSILON)
     * @return True if quaternions are equal within threshold
     */
    equals(quat: Quat, threshold = EPSILON): boolean {
        for (let i = 0; i < 4; i++) {
            if (Math.abs(this._values[i] - quat.at(i)) > threshold) {
                return false;
            }
        }

        return true;
    }

    /**
     * Set the quaternion as an identity quaternion
     * @return This quaternion for method chaining
     */
    setIdentity(): Quat {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 1;

        return this;
    }

    /**
     * Calculate the w component based on x, y, z components
     * @return This quaternion for method chaining
     */
    calculateW(): Quat {
        const x = this.x;
        const y = this.y;
        const z = this.z;

        this.w = -(Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z)));

        return this;
    }

    /**
     * Compute the inverse of the quaternion
     * @return This quaternion for method chaining
     */
    inverse(): Quat {
        const dot = Quat.dot(this, this);

        if (!dot) {
            this.xyzw = [0, 0, 0, 0];

            return this;
        }

        const invDot = dot ? 1.0 / dot : 0;

        this.x *= -invDot;
        this.y *= -invDot;
        this.z *= -invDot;
        this.w *= invDot;

        return this;
    }

    /**
     * Compute the conjugate of the quaternion
     * @return This quaternion for method chaining
     */
    conjugate(): Quat {
        this._values[0] *= -1;
        this._values[1] *= -1;
        this._values[2] *= -1;

        return this;
    }

    /**
     * Calculate the length (magnitude) of the quaternion
     * @return The length of the quaternion
     */
    length(): number {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        const w = this.w;

        return Math.sqrt(x * x + y * y + z * z + w * w);
    }

    /**
     * Normalize the quaternion to unit length
     * @param dest Destination quaternion (optional)
     * @return The normalized quaternion
     */
    normalize(dest?: Quat): Quat {
        const target = dest || this;

        const x = this.x;
        const y = this.y;
        const z = this.z;
        const w = this.w;

        let length = Math.sqrt(x * x + y * y + z * z + w * w);

        if (!length) {
            target.x = 0;
            target.y = 0;
            target.z = 0;
            target.w = 0;

            return target;
        }

        length = 1 / length;

        target.x = x * length;
        target.y = y * length;
        target.z = z * length;
        target.w = w * length;

        return target;
    }

    /**
     * Add another quaternion to this quaternion
     * @param other The quaternion to add
     * @return This quaternion for method chaining
     */
    add(other: Quat): Quat {
        for (let i = 0; i < 4; i++) {
            this._values[i] += other.at(i);
        }

        return this;
    }

    /**
     * Multiply this quaternion by another quaternion
     * @param other The quaternion to multiply with
     * @return This quaternion for method chaining
     */
    multiply(other: Quat): Quat {
        const q1x = this._values[0];
        const q1y = this._values[1];
        const q1z = this._values[2];
        const q1w = this._values[3];

        const q2x = other.x;
        const q2y = other.y;
        const q2z = other.z;
        const q2w = other.w;

        this.x = q1x * q2w + q1w * q2x + q1y * q2z - q1z * q2y;
        this.y = q1y * q2w + q1w * q2y + q1z * q2x - q1x * q2z;
        this.z = q1z * q2w + q1w * q2z + q1x * q2y - q1y * q2x;
        this.w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;

        return this;
    }

    /**
     * Calculate the dot product of two quaternions
     * @param q1 First quaternion
     * @param q2 Second quaternion
     * @return The dot product
     */
    static dot(q1: Quat, q2: Quat): number {
        return q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
    }

    /**
     * Calculate the sum of two quaternions
     * @param q1 First quaternion
     * @param q2 Second quaternion
     * @return A new quaternion with the sum
     */
    static sum(q1: Quat, q2: Quat): Quat {
        const dest = new Quat();

        dest.x = q1.x + q2.x;
        dest.y = q1.y + q2.y;
        dest.z = q1.z + q2.z;
        dest.w = q1.w + q2.w;

        return dest;
    }

    /**
     * Calculate the product of two quaternions
     * @param q1 First quaternion
     * @param q2 Second quaternion
     * @return A new quaternion with the product
     */
    static product(q1: Quat, q2: Quat): Quat {
        const dest = new Quat();

        const q1x = q1.x;
        const q1y = q1.y;
        const q1z = q1.z;
        const q1w = q1.w;

        const q2x = q2.x;
        const q2y = q2.y;
        const q2z = q2.z;
        const q2w = q2.w;

        dest.x = q1x * q2w + q1w * q2x + q1y * q2z - q1z * q2y;
        dest.y = q1y * q2w + q1w * q2y + q1z * q2x - q1x * q2z;
        dest.z = q1z * q2w + q1w * q2z + q1x * q2y - q1y * q2x;
        dest.w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;

        return dest;
    }

    /**
     * Calculate the cross product of two quaternions
     * @param q1 First quaternion
     * @param q2 Second quaternion
     * @return A new quaternion with the cross product
     */
    static cross(q1: Quat, q2: Quat): Quat {
        const dest = new Quat();

        const q1x = q1.x;
        const q1y = q1.y;
        const q1z = q1.z;
        const q1w = q1.w;

        const q2x = q2.x;
        const q2y = q2.y;
        const q2z = q2.z;
        const q2w = q2.w;

        dest.x = q1w * q2z + q1z * q2w + q1x * q2y - q1y * q2x;
        dest.y = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
        dest.z = q1w * q2x + q1x * q2w + q1y * q2z - q1z * q2y;
        dest.w = q1w * q2y + q1y * q2w + q1z * q2x - q1x * q2z;

        return dest;
    }

    /**
     * Spherical linear interpolation between two quaternions with short path
     * @param q1 First quaternion
     * @param q2 Second quaternion
     * @param time Interpolation parameter (0 to 1)
     * @return A new interpolated quaternion
     */
    static shortMix(q1: Quat, q2: Quat, time: number): Quat {
        const dest = new Quat();

        if (time <= 0.0) {
            dest.xyzw = q1.xyzw;

            return dest;
        } else if (time >= 1.0) {
            dest.xyzw = q2.xyzw;

            return dest;
        }

        let cos = Quat.dot(q1, q2);
        const q2a = q2.copy();

        if (cos < 0.0) {
            q2a.inverse();
            cos = -cos;
        }

        let k0: number;
        let k1: number;

        if (cos > 0.9999) {
            k0 = 1 - time;
            k1 = 0 + time;
        } else {
            const sin: number = Math.sqrt(1 - cos * cos);
            const angle: number = Math.atan2(sin, cos);

            const oneOverSin: number = 1 / sin;

            k0 = Math.sin((1 - time) * angle) * oneOverSin;
            k1 = Math.sin((0 + time) * angle) * oneOverSin;
        }

        dest.x = k0 * q1.x + k1 * q2a.x;
        dest.y = k0 * q1.y + k1 * q2a.y;
        dest.z = k0 * q1.z + k1 * q2a.z;
        dest.w = k0 * q1.w + k1 * q2a.w;

        return dest;
    }

    /**
     * Spherical linear interpolation between two quaternions
     * @param q1 First quaternion
     * @param q2 Second quaternion
     * @param time Interpolation parameter (0 to 1)
     * @return A new interpolated quaternion
     */
    static mix(q1: Quat, q2: Quat, time: number): Quat {
        const dest = new Quat();

        const cosHalfTheta = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;

        if (Math.abs(cosHalfTheta) >= 1.0) {
            dest.xyzw = q1.xyzw;

            return dest;
        }

        const halfTheta = Math.acos(cosHalfTheta);
        const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

        if (Math.abs(sinHalfTheta) < 0.001) {
            dest.x = q1.x * 0.5 + q2.x * 0.5;
            dest.y = q1.y * 0.5 + q2.y * 0.5;
            dest.z = q1.z * 0.5 + q2.z * 0.5;
            dest.w = q1.w * 0.5 + q2.w * 0.5;

            return dest;
        }

        const ratioA = Math.sin((1 - time) * halfTheta) / sinHalfTheta;
        const ratioB = Math.sin(time * halfTheta) / sinHalfTheta;

        dest.x = q1.x * ratioA + q2.x * ratioB;
        dest.y = q1.y * ratioA + q2.y * ratioB;
        dest.z = q1.z * ratioA + q2.z * ratioB;
        dest.w = q1.w * ratioA + q2.w * ratioB;

        return dest;
    }

    /**
     * Create a quaternion from an axis and angle
     * @param axis The rotation axis as a 3D vector
     * @param angle The rotation angle in radians
     * @return A new quaternion representing the rotation
     * @throws Error if the axis vector is not 3D
     */
    static fromAxisAngle(axis: Vector, angle: number): Quat {
        if (axis.rows !== 3) throw new Error('The axis vector must be in 3D!');
        const dest = new Quat();

        angle *= 0.5;
        const sin = Math.sin(angle);

        dest.x = axis.at(0) * sin;
        dest.y = axis.at(1) * sin;
        dest.z = axis.at(2) * sin;
        dest.w = Math.cos(angle);

        return dest;
    }

    toString(): string {
        return `[${this._values.join(', ')}]`;
    }
}
