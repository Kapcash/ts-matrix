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

  it('adds', () => {
    const q1 = new Quat([1.0, 2.0, 3.0, 4.0]);
    const q2 = new Quat([2.0, 3.0, 4.0, 5.0]);

    const result = q1.add(q2);

    expect(result.x).toBeCloseTo(3.0, EPSILON);
    expect(result.y).toBeCloseTo(5.0, EPSILON);
    expect(result.z).toBeCloseTo(7.0, EPSILON);
    expect(result.w).toBeCloseTo(9.0, EPSILON);
  });

  it('multiplies', () => {
    const q1 = new Quat([1.0, 3.0, 4.0, 5.0]);
    const q2 = new Quat([5.0, 6.0, 7.0, 8.0]);

    const result = q1.multiply(q2);

    expect(result.x).toBeCloseTo(30.0, EPSILON);
    expect(result.y).toBeCloseTo(67.0, EPSILON);
    expect(result.z).toBeCloseTo(58.0, EPSILON);
    expect(result.w).toBeCloseTo(-11.0, EPSILON);
  });

  it('normalizes', () => {
    const quaternion = new Quat([1.0, 2.0, 3.0, 4.0]);

    quaternion.normalize();

    expect(quaternion.x).toBeCloseTo(0.18257, EPSILON);
    expect(quaternion.y).toBeCloseTo(0.36515, EPSILON);
    expect(quaternion.z).toBeCloseTo(0.54772, EPSILON);
    expect(quaternion.w).toBeCloseTo(0.73029, EPSILON);
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

});
