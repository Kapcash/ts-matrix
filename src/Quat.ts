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
        this._values = values ? [...values] : [0, 0, 0, 1];
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

    get y(): number {
        return this._values[1];
    }

    get z(): number {
        return this._values[2];
    }

    get w(): number {
        return this._values[3];
    }

    get xy(): [number, number] {
        return [
            this._values[0],
            this._values[1],
        ];
    }

    get xyz(): [number, number, number] {
        return [
            this._values[0],
            this._values[1],
            this._values[2],
        ];
    }

    get xyzw(): [number, number, number, number] {
        return [
            this._values[0],
            this._values[1],
            this._values[2],
            this._values[3],
        ];
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
     * Sets all quaternion values to 0
     */
    reset(): void {
        this.values = [0, 0, 0, 0];
    }

    /**
     * Get a copy of this quaternion
     * @return A new quaternion with the same values
     */
    copy(): Quat {
        return new Quat(this.xyzw);
    }

    /**
     * Calculate the roll angle (rotation around x-axis)
     * @return Roll angle in radians
     */
    roll(): number {
        const { x, y, z, w } = this;

        return Math.atan2(2.0 * (x * y + w * z), w * w + x * x - y * y - z * z);
    }

    /**
     * Calculate the pitch angle (rotation around y-axis)
     * @return Pitch angle in radians
     */
    pitch(): number {
        const { x, y, z, w } = this;

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
     * Sets the quaternion as an identity quaternion
     * @return This quaternion for method chaining
     */
    setIdentity(): Quat {
        this.values = [0, 0, 0, 1];

        return this;
    }

    /**
     * Calculate the w component based on x, y, z components.
     * Note: this always yields a non-positive w (a valid unit quaternion,
     * on the opposite hemisphere from `Quat.identity()`, due to the sign
     * convention below).
     * @return A new quaternion with the computed w component
     */
    calculateW(): Quat {
        const { x, y, z } = this;
        const w = -(Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z)));

        return new Quat([x, y, z, w]);
    }

    /**
     * Compute the inverse of the quaternion
     * @return A new, inversed quaternion
     */
    inverse(): Quat {
        const dot = Quat.dot(this, this);

        if (!dot) {
            return new Quat([0, 0, 0, 0]);
        }

        const invDot = 1.0 / dot;

        return new Quat([
            this.x * -invDot,
            this.y * -invDot,
            this.z * -invDot,
            this.w * invDot,
        ]);
    }

    /**
     * Compute the conjugate of the quaternion
     * @return A new, conjugated quaternion
     */
    conjugate(): Quat {
        return new Quat([-this.x, -this.y, -this.z, this.w]);
    }

    /**
     * Calculate the length (magnitude) of the quaternion
     * @return The length of the quaternion
     */
    length(): number {
        const { x, y, z, w } = this;

        return Math.sqrt(x * x + y * y + z * z + w * w);
    }

    /**
     * Computes the normalized quaternion
     * @return A new, normalized quaternion
     */
    normalize(): Quat {
        const length = this.length();

        if (!length) {
            return new Quat([0, 0, 0, 0]);
        }

        const invLength = 1 / length;

        return new Quat([
            this.x * invLength,
            this.y * invLength,
            this.z * invLength,
            this.w * invLength,
        ]);
    }

    /**
     * Add another quaternion to this quaternion
     * @param other The quaternion to add
     * @return A new quaternion with the sum
     */
    add(other: Quat): Quat {
        return Quat.sum(this, other);
    }

    /**
     * Multiply this quaternion by another quaternion
     * @param other The quaternion to multiply with
     * @return A new quaternion with the product
     */
    multiply(other: Quat): Quat {
        return Quat.product(this, other);
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
        return new Quat([
            q1.x + q2.x,
            q1.y + q2.y,
            q1.z + q2.z,
            q1.w + q2.w,
        ]);
    }

    /**
     * Calculate the product of two quaternions
     * @param q1 First quaternion
     * @param q2 Second quaternion
     * @return A new quaternion with the product
     */
    static product(q1: Quat, q2: Quat): Quat {
        const q1x = q1.x;
        const q1y = q1.y;
        const q1z = q1.z;
        const q1w = q1.w;

        const q2x = q2.x;
        const q2y = q2.y;
        const q2z = q2.z;
        const q2w = q2.w;

        return new Quat([
            q1x * q2w + q1w * q2x + q1y * q2z - q1z * q2y,
            q1y * q2w + q1w * q2y + q1z * q2x - q1x * q2z,
            q1z * q2w + q1w * q2z + q1x * q2y - q1y * q2x,
            q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z,
        ]);
    }

    /**
     * Calculate the cross product of two quaternions, i.e. (q1 * q2 - q2 * q1) / 2.
     * For quaternions with a 0 w component, this is equivalent to the cross
     * product of their [x, y, z] vector parts.
     * @param q1 First quaternion
     * @param q2 Second quaternion
     * @return A new quaternion with the cross product
     */
    static cross(q1: Quat, q2: Quat): Quat {
        return new Quat([
            q1.y * q2.z - q1.z * q2.y,
            q1.z * q2.x - q1.x * q2.z,
            q1.x * q2.y - q1.y * q2.x,
            0,
        ]);
    }

    /**
     * Spherical linear interpolation between two quaternions with short path
     * @param q1 First quaternion
     * @param q2 Second quaternion
     * @param time Interpolation parameter (0 to 1)
     * @return A new interpolated quaternion
     */
    static shortMix(q1: Quat, q2: Quat, time: number): Quat {
        if (time <= 0.0) {
            return new Quat(q1.xyzw);
        } else if (time >= 1.0) {
            return new Quat(q2.xyzw);
        }

        let cos = Quat.dot(q1, q2);
        let q2a = q2;

        if (cos < 0.0) {
            // Negate all 4 components (not just xyz, as Quat#inverse would) to
            // flip q2a to the equivalent rotation on the other side of the
            // hypersphere, which is what actually shortens the path.
            q2a = new Quat([-q2.x, -q2.y, -q2.z, -q2.w]);
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

        return new Quat([
            k0 * q1.x + k1 * q2a.x,
            k0 * q1.y + k1 * q2a.y,
            k0 * q1.z + k1 * q2a.z,
            k0 * q1.w + k1 * q2a.w,
        ]);
    }

    /**
     * Spherical linear interpolation between two quaternions
     * @param q1 First quaternion
     * @param q2 Second quaternion
     * @param time Interpolation parameter (0 to 1)
     * @return A new interpolated quaternion
     */
    static mix(q1: Quat, q2: Quat, time: number): Quat {
        const cosHalfTheta = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;

        if (Math.abs(cosHalfTheta) >= 1.0) {
            return new Quat(q1.xyzw);
        }

        const halfTheta = Math.acos(cosHalfTheta);
        const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

        if (Math.abs(sinHalfTheta) < 0.001) {
            return new Quat([
                q1.x * 0.5 + q2.x * 0.5,
                q1.y * 0.5 + q2.y * 0.5,
                q1.z * 0.5 + q2.z * 0.5,
                q1.w * 0.5 + q2.w * 0.5,
            ]);
        }

        const ratioA = Math.sin((1 - time) * halfTheta) / sinHalfTheta;
        const ratioB = Math.sin(time * halfTheta) / sinHalfTheta;

        return new Quat([
            q1.x * ratioA + q2.x * ratioB,
            q1.y * ratioA + q2.y * ratioB,
            q1.z * ratioA + q2.z * ratioB,
            q1.w * ratioA + q2.w * ratioB,
        ]);
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

        const halfAngle = angle * 0.5;
        const sin = Math.sin(halfAngle);

        return new Quat([
            axis.at(0) * sin,
            axis.at(1) * sin,
            axis.at(2) * sin,
            Math.cos(halfAngle),
        ]);
    }

    toString(): string {
        return `[${this._values.join(', ')}]`;
    }
}
