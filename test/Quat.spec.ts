import Quat from '../src/Quat';
import Vector from '../src/Vector';

import { EPSILON } from '../src/constants';

describe('Quat.ts', () => {
  it('resets', () => {
    const q = new Quat([1.0, 2.0, 3.0, 4.0]);

    q.reset();

    expect(q.x).eq(0);
    expect(q.y).eq(0);
    expect(q.z).eq(0);
  });

  it('copies', () => {
    const q1 = new Quat([1.0, 2.0, 3.0, 4.0]);
    const q2 = q1.copy();

    expect(q2.x).eq(q1.x);
    expect(q2.y).eq(q1.y);
    expect(q2.z).eq(q1.z);
    expect(q2.w).eq(q1.w);
  });

  it('compares', () => {
    const q1 = new Quat([1.0, 2.0, 3.0, 4.0]);
    const q2 = new Quat([1.0, 2.0, 3.0, 4.0]);
    const q3 = new Quat([2.0, 3.0, 4.0, 5.0]);

    expect(q1.equals(q2)).toBeTruthy();
    expect(q1.equals(q3)).toBeFalsy();
  });

  it('adds without mutating the operands', () => {
    const q1 = new Quat([1.0, 2.0, 3.0, 4.0]);
    const q2 = new Quat([2.0, 3.0, 4.0, 5.0]);

    const result = q1.add(q2);

    expect(result.x).toBeCloseTo(3.0, EPSILON);
    expect(result.y).toBeCloseTo(5.0, EPSILON);
    expect(result.z).toBeCloseTo(7.0, EPSILON);
    expect(result.w).toBeCloseTo(9.0, EPSILON);
    expect(q1.xyzw).toEqual([1.0, 2.0, 3.0, 4.0]);
    expect(q2.xyzw).toEqual([2.0, 3.0, 4.0, 5.0]);
  });

  it('multiplies without mutating the operands', () => {
    const q1 = new Quat([1.0, 3.0, 4.0, 5.0]);
    const q2 = new Quat([5.0, 6.0, 7.0, 8.0]);

    const result = q1.multiply(q2);

    expect(result.x).toBeCloseTo(30.0, EPSILON);
    expect(result.y).toBeCloseTo(67.0, EPSILON);
    expect(result.z).toBeCloseTo(58.0, EPSILON);
    expect(result.w).toBeCloseTo(-11.0, EPSILON);
    expect(q1.xyzw).toEqual([1.0, 3.0, 4.0, 5.0]);
    expect(q2.xyzw).toEqual([5.0, 6.0, 7.0, 8.0]);
  });

  it('normalizes without mutating the receiver', () => {
    const quaternion = new Quat([1.0, 2.0, 3.0, 4.0]);

    const normalized = quaternion.normalize();

    expect(normalized.x).toBeCloseTo(0.18257, EPSILON);
    expect(normalized.y).toBeCloseTo(0.36515, EPSILON);
    expect(normalized.z).toBeCloseTo(0.54772, EPSILON);
    expect(normalized.w).toBeCloseTo(0.73029, EPSILON);
    expect(quaternion.xyzw).toEqual([1.0, 2.0, 3.0, 4.0]);
  });

  it('computes the cross product matching the vector cross product for pure quaternions', () => {
    const q1 = new Quat([1, 2, 3, 0]);
    const q2 = new Quat([4, 5, 6, 0]);
    const expected = new Vector([1, 2, 3]).cross(new Vector([4, 5, 6]));

    const result = Quat.cross(q1, q2);

    expect(result.x).toBeCloseTo(expected.at(0), EPSILON);
    expect(result.y).toBeCloseTo(expected.at(1), EPSILON);
    expect(result.z).toBeCloseTo(expected.at(2), EPSILON);
    expect(result.w).toBe(0);
  });

  it('shortMix always returns a unit quaternion, even across the shortest path', () => {
    const q1 = Quat.identity();
    // 270 degrees around Z: dot(q1, q2) < 0, forcing the shortest-path branch
    const q2 = Quat.fromAxisAngle(new Vector([0, 0, 1]), 1.5 * Math.PI);

    const mid = Quat.shortMix(q1, q2, 0.5);

    expect(mid.length()).toBeCloseTo(1.0, EPSILON);
  });

  it('shortMix clamps time to the endpoints', () => {
    const q1 = new Quat([0, 0, 0, 1]);
    const q2 = Quat.fromAxisAngle(new Vector([0, 0, 1]), Math.PI / 2);

    expect(Quat.shortMix(q1, q2, 0).xyzw).toEqual(q1.xyzw);
    expect(Quat.shortMix(q1, q2, -1).xyzw).toEqual(q1.xyzw);
    expect(Quat.shortMix(q1, q2, 1).xyzw).toEqual(q2.xyzw);
    expect(Quat.shortMix(q1, q2, 2).xyzw).toEqual(q2.xyzw);
  });

  it('shortMix takes the direct (non-antipodal) branch when quaternions are close', () => {
    const q1 = Quat.identity();
    const q2 = Quat.fromAxisAngle(new Vector([0, 0, 1]), 0.0001);

    const mid = Quat.shortMix(q1, q2, 0.5);

    expect(mid.length()).toBeCloseTo(1.0, EPSILON);
  });

  it('gets an identity quaternion', () => {
    expect(Quat.identity().xyzw).toEqual([0, 0, 0, 1]);
  });

  it('gets a value at an index', () => {
    const q = new Quat([1, 2, 3, 4]);

    expect(q.at(0)).toBe(1);
    expect(q.at(1)).toBe(2);
    expect(q.at(2)).toBe(3);
    expect(q.at(3)).toBe(4);
  });

  it('sets values in bulk, cropping to its fixed size of 4', () => {
    const q = new Quat([1, 2, 3, 4]);

    q.values = [10, 20];
    expect(q.xyzw).toEqual([10, 20, 3, 4]);

    q.values = [100, 200, 300, 400, 500];
    expect(q.xyzw).toEqual([100, 200, 300, 400]);
  });

  it('exposes xy and xyz slices', () => {
    const q = new Quat([1, 2, 3, 4]);

    expect(q.xy).toEqual([1, 2]);
    expect(q.xyz).toEqual([1, 2, 3]);
  });

  it('sets itself as identity in place and returns itself', () => {
    const q = new Quat([1, 2, 3, 4]);

    const result = q.setIdentity();

    expect(result).toBe(q);
    expect(q.xyzw).toEqual([0, 0, 0, 1]);
  });

  it('calculates w from x, y and z without mutating the receiver', () => {
    const q = new Quat([0.3, 0.4, 0.5, 999]);

    const result = q.calculateW();

    expect(result.x).toBe(0.3);
    expect(result.y).toBe(0.4);
    expect(result.z).toBe(0.5);
    expect(result.w).toBeCloseTo(-Math.sqrt(0.5), EPSILON);
    expect(q.w).toBe(999);
  });

  it('calculates w as -1 for a zero x/y/z', () => {
    expect(new Quat([0, 0, 0, 0]).calculateW().w).toBe(-1);
  });

  it('inverses without mutating the receiver', () => {
    const q = new Quat([1, 2, 3, 4]);
    const dot = 1 + 4 + 9 + 16;

    const result = q.inverse();

    expect(result.x).toBeCloseTo(-1 / dot, EPSILON);
    expect(result.y).toBeCloseTo(-2 / dot, EPSILON);
    expect(result.z).toBeCloseTo(-3 / dot, EPSILON);
    expect(result.w).toBeCloseTo(4 / dot, EPSILON);
    expect(q.xyzw).toEqual([1, 2, 3, 4]);
  });

  it('inverses a zero quaternion to a zero quaternion', () => {
    expect(new Quat([0, 0, 0, 0]).inverse().xyzw).toEqual([0, 0, 0, 0]);
  });

  it('conjugates without mutating the receiver', () => {
    const q = new Quat([1, 2, 3, 4]);

    const result = q.conjugate();

    expect(result.xyzw).toEqual([-1, -2, -3, 4]);
    expect(q.xyzw).toEqual([1, 2, 3, 4]);
  });

  it('computes its length', () => {
    expect(new Quat([1, 2, 2, 4]).length()).toBe(5);
  });

  it('normalizes a zero quaternion to a zero quaternion instead of NaN', () => {
    expect(new Quat([0, 0, 0, 0]).normalize().xyzw).toEqual([0, 0, 0, 0]);
  });

  it('computes roll, pitch and yaw for the identity quaternion', () => {
    const q = Quat.identity();

    expect(q.roll()).toBe(0);
    expect(q.pitch()).toBe(0);
    expect(q.yaw()).toBe(0);
  });

  it('computes roll, pitch and yaw for a non-trivial quaternion', () => {
    const q = new Quat([0.5, 0.5, 0.5, 0.5]);

    expect(q.roll()).toBeCloseTo(Math.PI / 2, EPSILON);
    expect(q.pitch()).toBeCloseTo(Math.PI / 2, EPSILON);
    expect(q.yaw()).toBeCloseTo(0, EPSILON);
  });

  it('compares within a custom threshold', () => {
    const q1 = new Quat([1, 2, 3, 4]);
    const q2 = new Quat([1.001, 2, 3, 4]);

    expect(q1.equals(q2)).toBeFalsy();
    expect(q1.equals(q2, 0.01)).toBeTruthy();
  });

  it('mix returns a clone of q1 when the quaternions are equal', () => {
    const q1 = Quat.identity();

    expect(Quat.mix(q1, q1, 0.5).xyzw).toEqual(q1.xyzw);
  });

  it('mix falls back to a plain average when the half-angle is near 0', () => {
    const q1 = Quat.identity();
    const q2 = Quat.fromAxisAngle(new Vector([0, 0, 1]), 0.001);

    const mid = Quat.mix(q1, q2, 0.5);

    expect(mid.x).toBe(0);
    expect(mid.y).toBe(0);
    expect(mid.z).toBeCloseTo((0 + Math.sin(0.0005)) / 2, EPSILON);
    expect(mid.w).toBeCloseTo((1 + Math.cos(0.0005)) / 2, EPSILON);
  });

  it('mix interpolates along the great circle for well-separated quaternions', () => {
    const q1 = Quat.identity();
    const q2 = Quat.fromAxisAngle(new Vector([0, 0, 1]), Math.PI / 2);

    const mid = Quat.mix(q1, q2, 0.5);

    expect(mid.length()).toBeCloseTo(1.0, EPSILON);
  });

  it('creates a quaternion from an axis and angle', () => {
    const q = Quat.fromAxisAngle(new Vector([0, 0, 1]), Math.PI / 2);

    expect(q.x).toBeCloseTo(0, EPSILON);
    expect(q.y).toBeCloseTo(0, EPSILON);
    expect(q.z).toBeCloseTo(Math.sin(Math.PI / 4), EPSILON);
    expect(q.w).toBeCloseTo(Math.cos(Math.PI / 4), EPSILON);
  });

  it('throws when the axis is not a 3D vector', () => {
    expect(() => Quat.fromAxisAngle(new Vector([1, 2]), Math.PI)).toThrow();
  });

  it('stringifies', () => {
    expect(new Quat([1, 2, 3, 4]).toString()).toBe('[1, 2, 3, 4]');
  });

});
