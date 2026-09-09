/*!
 * buffer 模块的 TypeScript 移植（feross/buffer 的浏览器版本，MIT）。
 * 保持原逻辑与运行时行为完全一致，仅把 CommonJS 改为 ES 模块并补充类型标注。
 *
 * 关键点：原版通过 __proto__ 把原生 Uint8Array 的实例"增强"为 Buffer 实例，
 * 这里用 Object.setPrototypeOf 等价实现；Buffer 既是一个可调用构造函数，也通过
 * interface/namespace 声明合并对外提供类型。
 */
import * as base64 from './base64-js';
import { read as ieee754Read, write as ieee754Write } from './ieee754';

/** Buffer 实例类型（结构化类型：不再 extends Uint8Array，避开不同 TS 版本下 Uint8Array 泛型差异导致的兼容问题） */
export interface Buffer {
    readonly _isBuffer: true;

    // ---- Uint8Array 基础成员 ----
    readonly length: number;
    readonly byteLength: number;
    readonly byteOffset: number;
    readonly buffer: ArrayBuffer;
    [index: number]: number;
    readonly [Symbol.toStringTag]: string;
    subarray(begin?: number, end?: number): Uint8Array;
    set(array: ArrayLike<number>, offset?: number): void;
    forEach(callbackfn: (value: number, index: number, array: Uint8Array) => void, thisArg?: any): void;
    map(callbackfn: (value: number, index: number, array: Uint8Array) => number, thisArg?: any): Uint8Array;
    filter(callbackfn: (value: number, index: number, array: Uint8Array) => any, thisArg?: any): Uint8Array;
    some(callbackfn: (value: number, index: number, array: Uint8Array) => unknown, thisArg?: any): boolean;
    every(callbackfn: (value: number, index: number, array: Uint8Array) => unknown, thisArg?: any): boolean;
    find(predicate: (value: number, index: number, array: Uint8Array) => unknown, thisArg?: any): number | undefined;
    findIndex(predicate: (value: number, index: number, array: Uint8Array) => unknown, thisArg?: any): number;
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: Uint8Array) => number, initialValue?: number): number;
    entries(): IterableIterator<[number, number]>;
    keys(): IterableIterator<number>;
    values(): IterableIterator<number>;
    [Symbol.iterator](): IterableIterator<number>;

    // ---- Node Buffer 自有方法 ----
    write(string: any, offset?: any, length?: any, encoding?: any): number;
    toString(encoding?: any, start?: number, end?: number): string;
    slice(start?: number, end?: number): Buffer;
    copy(target: Buffer, targetStart?: number, sourceStart?: number, sourceEnd?: number): number;
    fill(value: any, start?: any, end?: any, encoding?: any): this;
    indexOf(val: any, byteOffset?: any, encoding?: any): number;
    lastIndexOf(val: any, byteOffset?: any, encoding?: any): number;
    includes(val: any, byteOffset?: any, encoding?: any): boolean;
    equals(other: Buffer): boolean;
    compare(target: Buffer, start?: number, end?: number, thisStart?: number, thisEnd?: number): number;
    swap16(): Buffer;
    swap32(): Buffer;
    swap64(): Buffer;
    inspect(): string;
    toJSON(): { type: string; data: number[] };
    readUIntLE(offset: number, byteLength: number, noAssert?: boolean): number;
    readUIntBE(offset: number, byteLength: number, noAssert?: boolean): number;
    readUInt8(offset: number, noAssert?: boolean): number;
    readUInt16LE(offset: number, noAssert?: boolean): number;
    readUInt16BE(offset: number, noAssert?: boolean): number;
    readUInt32LE(offset: number, noAssert?: boolean): number;
    readUInt32BE(offset: number, noAssert?: boolean): number;
    readIntLE(offset: number, byteLength: number, noAssert?: boolean): number;
    readIntBE(offset: number, byteLength: number, noAssert?: boolean): number;
    readInt8(offset: number, noAssert?: boolean): number;
    readInt16LE(offset: number, noAssert?: boolean): number;
    readInt16BE(offset: number, noAssert?: boolean): number;
    readInt32LE(offset: number, noAssert?: boolean): number;
    readInt32BE(offset: number, noAssert?: boolean): number;
    readFloatLE(offset: number, noAssert?: boolean): number;
    readFloatBE(offset: number, noAssert?: boolean): number;
    readDoubleLE(offset: number, noAssert?: boolean): number;
    readDoubleBE(offset: number, noAssert?: boolean): number;
    writeUIntLE(value: number, offset: number, byteLength: number, noAssert?: boolean): number;
    writeUIntBE(value: number, offset: number, byteLength: number, noAssert?: boolean): number;
    writeUInt8(value: number, offset: number, noAssert?: boolean): number;
    writeUInt16LE(value: number, offset: number, noAssert?: boolean): number;
    writeUInt16BE(value: number, offset: number, noAssert?: boolean): number;
    writeUInt32LE(value: number, offset: number, noAssert?: boolean): number;
    writeUInt32BE(value: number, offset: number, noAssert?: boolean): number;
    writeIntLE(value: number, offset: number, byteLength: number, noAssert?: boolean): number;
    writeIntBE(value: number, offset: number, byteLength: number, noAssert?: boolean): number;
    writeInt8(value: number, offset: number, noAssert?: boolean): number;
    writeInt16LE(value: number, offset: number, noAssert?: boolean): number;
    writeInt16BE(value: number, offset: number, noAssert?: boolean): number;
    writeInt32LE(value: number, offset: number, noAssert?: boolean): number;
    writeInt32BE(value: number, offset: number, noAssert?: boolean): number;
    writeFloatLE(value: number, offset: number, noAssert?: boolean): number;
    writeFloatBE(value: number, offset: number, noAssert?: boolean): number;
    writeDoubleLE(value: number, offset: number, noAssert?: boolean): number;
    writeDoubleBE(value: number, offset: number, noAssert?: boolean): number;
}

/** Buffer 静态成员的声明合并（类型层） */
export declare namespace Buffer {
    function from(value: any, encodingOrOffset?: any, length?: any): Buffer;
    function alloc(size: number, fill?: any, encoding?: any): Buffer;
    function allocUnsafe(size: number): Buffer;
    function allocUnsafeSlow(size: number): Buffer;
    function isBuffer(b: any): b is Buffer;
    function isEncoding(encoding: string): boolean;
    function compare(a: Buffer, b: Buffer): number;
    function byteLength(string: any, encoding?: string): number;
    function concat(list: Buffer[], length?: number): Buffer;
    const prototype: any;
    const kMaxLength: number;
    const poolSize: number;
    const TYPED_ARRAY_SUPPORT: boolean;
}

export const INSPECT_MAX_BYTES = 50;

const K_MAX_LENGTH = 0x7fffffff;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 */
(Buffer as any).TYPED_ARRAY_SUPPORT = typedArraySupport();

if (!(Buffer as any).TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
    console.error(
        'This browser lacks typed array (Uint8Array) support which is required by ' +
        '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
    );
}

function typedArraySupport(): boolean {
    // Can typed array instances can be augmented?
    try {
        const arr: any = new Uint8Array(1);
        Object.setPrototypeOf(arr, { __proto__: Uint8Array.prototype, foo: () => 42 });
        return (arr as any).foo() === 42;
    } catch (e) {
        return false;
    }
}

function createBuffer(length: number): Buffer {
    if (length > K_MAX_LENGTH) {
        throw new RangeError('Invalid typed array length');
    }
    // Return an augmented `Uint8Array` instance
    const buf = new Uint8Array(length);
    Object.setPrototypeOf(buf, Buffer.prototype);
    return buf as unknown as Buffer;
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 */
export function Buffer(arg: any, encodingOrOffset?: any, length?: any): Buffer {
    // Common case.
    if (typeof arg === 'number') {
        if (typeof encodingOrOffset === 'string') {
            throw new Error(
                'If encoding is specified then the first argument must be a string'
            );
        }
        return allocUnsafe(arg);
    }
    return from(arg, encodingOrOffset, length);
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    (Buffer as any)[Symbol.species] === Buffer) {
    Object.defineProperty(Buffer, Symbol.species, {
        value: null,
        configurable: true,
        enumerable: false,
        writable: false
    });
}

(Buffer as any).poolSize = 8192; // not used by this implementation

function from(value: any, encodingOrOffset?: any, length?: any): Buffer {
    if (typeof value === 'number') {
        throw new TypeError('"value" argument must not be a number');
    }

    if (isArrayBuffer(value)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
    }

    if (typeof value === 'string') {
        return fromString(value, encodingOrOffset);
    }

    return fromObject(value);
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 */
(Buffer as any).from = function (value: any, encodingOrOffset?: any, length?: any): Buffer {
    return from(value, encodingOrOffset, length);
};

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
Object.setPrototypeOf(Buffer, Uint8Array);

function assertSize(size: any): void {
    if (typeof size !== 'number') {
        throw new TypeError('"size" argument must be a number');
    } else if (size < 0) {
        throw new RangeError('"size" argument must not be negative');
    }
}

function alloc(size: any, fill?: any, encoding?: any): Buffer {
    assertSize(size);
    if (size <= 0) {
        return createBuffer(size);
    }
    if (fill !== undefined) {
        // Only pay attention to encoding if it's a string. This
        // prevents accidentally sending in a number that would
        // be interpretted as a start offset.
        return typeof encoding === 'string'
            ? createBuffer(size).fill(fill, encoding)
            : createBuffer(size).fill(fill);
    }
    return createBuffer(size);
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 */
(Buffer as any).alloc = function (size: any, fill?: any, encoding?: any): Buffer {
    return alloc(size, fill, encoding);
};

function allocUnsafe(size: any): Buffer {
    assertSize(size);
    return createBuffer(size < 0 ? 0 : checked(size) | 0);
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 */
(Buffer as any).allocUnsafe = function (size: any): Buffer {
    return allocUnsafe(size);
};

/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
(Buffer as any).allocUnsafeSlow = function (size: any): Buffer {
    return allocUnsafe(size);
};

function fromString(string: string, encoding?: any): Buffer {
    if (typeof encoding !== 'string' || encoding === '') {
        encoding = 'utf8';
    }

    if (!(Buffer as any).isEncoding(encoding)) {
        throw new TypeError('"encoding" must be a valid string encoding');
    }

    const length = byteLength(string, encoding) | 0;
    let buf = createBuffer(length);

    const actual = buf.write(string, encoding);

    if (actual !== length) {
        // Writing a hex string, for example, that contains invalid characters will
        // cause everything after the first invalid character to be ignored. (e.g.
        // 'abxxcd' will be treated as 'ab')
        buf = buf.slice(0, actual) as Buffer;
    }

    return buf;
}

function fromArrayLike(array: any): Buffer {
    const length = array.length < 0 ? 0 : checked(array.length) | 0;
    const buf = createBuffer(length);
    for (let i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
    }
    return buf;
}

function fromArrayBuffer(array: ArrayBuffer, byteOffset?: any, length?: any): Buffer {
    if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('\'offset\' is out of bounds');
    }

    if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('\'length\' is out of bounds');
    }

    let buf: Uint8Array;
    if (byteOffset === undefined && length === undefined) {
        buf = new Uint8Array(array);
    } else if (length === undefined) {
        buf = new Uint8Array(array, byteOffset);
    } else {
        buf = new Uint8Array(array, byteOffset, length);
    }

    // Return an augmented `Uint8Array` instance
    Object.setPrototypeOf(buf, Buffer.prototype);
    return buf as unknown as Buffer;
}

function fromObject(obj: any): Buffer {
    if ((Buffer as any).isBuffer(obj)) {
        const len = checked(obj.length) | 0;
        const buf = createBuffer(len);

        if (buf.length === 0) {
            return buf;
        }

        obj.copy(buf, 0, 0, len);
        return buf;
    }

    if (obj) {
        if (isArrayBufferView(obj) || 'length' in obj) {
            if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
                return createBuffer(0);
            }
            return fromArrayLike(obj);
        }

        if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
            return fromArrayLike(obj.data);
        }
    }

    throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
}

function checked(length: any): number {
    // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= K_MAX_LENGTH) {
        throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
            'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes');
    }
    return length | 0;
}

export function SlowBuffer(length: any): Buffer {
    if (+length != length) { // eslint-disable-line eqeqeq
        length = 0;
    }
    return (Buffer as any).alloc(+length);
}

(Buffer as any).isBuffer = function isBuffer(b: any): b is Buffer {
    return b != null && b._isBuffer === true;
};

(Buffer as any).compare = function compare(a: Buffer, b: Buffer): number {
    if (!(Buffer as any).isBuffer(a) || !(Buffer as any).isBuffer(b)) {
        throw new TypeError('Arguments must be Buffers');
    }

    if (a === b) return 0;

    let x = a.length;
    let y = b.length;

    for (let i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
        }
    }

    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
};

(Buffer as any).isEncoding = function isEncoding(encoding: string): boolean {
    switch (String(encoding).toLowerCase()) {
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'latin1':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
            return true;
        default:
            return false;
    }
};

(Buffer as any).concat = function concat(list: Buffer[], length?: number): Buffer {
    if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
    }

    if (list.length === 0) {
        return (Buffer as any).alloc(0);
    }

    let i: number;
    if (length === undefined) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
            length += list[i].length;
        }
    }

    const buffer = (Buffer as any).allocUnsafe(length);
    let pos = 0;
    for (i = 0; i < list.length; ++i) {
        const buf = list[i];
        if (!(Buffer as any).isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
        }
        buf.copy(buffer, pos);
        pos += buf.length;
    }
    return buffer;
};

function byteLength(string: any, encoding?: any): number {
    if ((Buffer as any).isBuffer(string)) {
        return string.length;
    }
    if (isArrayBufferView(string) || isArrayBuffer(string)) {
        return string.byteLength;
    }
    if (typeof string !== 'string') {
        string = '' + string;
    }

    const len = string.length;
    if (len === 0) return 0;

    // Use a for loop to avoid recursion
    let loweredCase = false;
    for (;;) {
        switch (encoding) {
            case 'ascii':
            case 'latin1':
            case 'binary':
                return len;
            case 'utf8':
            case 'utf-8':
            case undefined:
                return utf8ToBytes(string).length;
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return len * 2;
            case 'hex':
                return len >>> 1;
            case 'base64':
                return base64ToBytes(string).length;
            default:
                if (loweredCase) return utf8ToBytes(string).length; // assume utf8
                encoding = ('' + encoding).toLowerCase();
                loweredCase = true;
        }
    }
}
(Buffer as any).byteLength = byteLength;

function slowToString(this: Buffer, encoding?: any, start?: any, end?: any): string {
    let loweredCase = false;

    if (start === undefined || start < 0) {
        start = 0;
    }
    if (start > this.length) {
        return '';
    }

    if (end === undefined || end > this.length) {
        end = this.length;
    }

    if (end <= 0) {
        return '';
    }

    end >>>= 0;
    start >>>= 0;

    if (end <= start) {
        return '';
    }

    if (!encoding) encoding = 'utf8';

    while (true) {
        switch (encoding) {
            case 'hex':
                return hexSlice(this, start, end);

            case 'utf8':
            case 'utf-8':
                return utf8Slice(this, start, end);

            case 'ascii':
                return asciiSlice(this, start, end);

            case 'latin1':
            case 'binary':
                return latin1Slice(this, start, end);

            case 'base64':
                return base64Slice(this, start, end);

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return utf16leSlice(this, start, end);

            default:
                if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
                encoding = (encoding + '').toLowerCase();
                loweredCase = true;
        }
    }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance.
Buffer.prototype._isBuffer = true;

const BP: any = Buffer.prototype;

function swap(b: Buffer, n: number, m: number): void {
    const i = b[n];
    b[n] = b[m];
    b[m] = i;
}

BP.swap16 = function swap16(this: Buffer): Buffer {
    const len = this.length;
    if (len % 2 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 16-bits');
    }
    for (let i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
    }
    return this;
};

BP.swap32 = function swap32(this: Buffer): Buffer {
    const len = this.length;
    if (len % 4 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 32-bits');
    }
    for (let i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
    }
    return this;
};

BP.swap64 = function swap64(this: Buffer): Buffer {
    const len = this.length;
    if (len % 8 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 64-bits');
    }
    for (let i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
    }
    return this;
};

BP.toString = function toString(this: Buffer, ...args: any[]): string {
    const length = this.length;
    if (length === 0) return '';
    if (args.length === 0) return utf8Slice(this, 0, length);
    return slowToString.apply(this, args as any) as any;
};

BP.equals = function equals(this: Buffer, b: Buffer): boolean {
    if (!(Buffer as any).isBuffer(b)) throw new TypeError('Argument must be a Buffer');
    if (this === b) return true;
    return (Buffer as any).compare(this, b) === 0;
};

BP.inspect = function inspect(this: Buffer): string {
    let str = '';
    const max = INSPECT_MAX_BYTES;
    if (this.length > 0) {
        str = this.toString('hex', 0, max).match(/.{2}/g)!.join(' ');
        if (this.length > max) str += ' ... ';
    }
    return '<Buffer ' + str + '>';
};

BP.compare = function compare(this: Buffer, target: Buffer, start?: number, end?: number, thisStart?: number, thisEnd?: number): number {
    if (!(Buffer as any).isBuffer(target)) {
        throw new TypeError('Argument must be a Buffer');
    }

    if (start === undefined) {
        start = 0;
    }
    if (end === undefined) {
        end = target ? target.length : 0;
    }
    if (thisStart === undefined) {
        thisStart = 0;
    }
    if (thisEnd === undefined) {
        thisEnd = this.length;
    }

    if (start < 0 || end! > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError('out of range index');
    }

    if (thisStart >= thisEnd && start >= end) {
        return 0;
    }
    if (thisStart >= thisEnd) {
        return -1;
    }
    if (start >= end) {
        return 1;
    }

    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;

    if (this === target) return 0;

    let x = thisEnd - thisStart;
    let y = end - start;
    const len = Math.min(x, y);

    const thisCopy = this.slice(thisStart, thisEnd) as Buffer;
    const targetCopy = target.slice(start, end) as Buffer;

    for (let i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
        }
    }

    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
function bidirectionalIndexOf(buffer: Buffer, val: any, byteOffset: any, encoding?: any, dir?: boolean): number {
    // Empty buffer means no match
    if (buffer.length === 0) return -1;

    // Normalize byteOffset
    if (typeof byteOffset === 'string') {
        encoding = byteOffset;
        byteOffset = 0;
    } else if (byteOffset > 0x7fffffff) {
        byteOffset = 0x7fffffff;
    } else if (byteOffset < -0x80000000) {
        byteOffset = -0x80000000;
    }
    byteOffset = +byteOffset;  // Coerce to Number.
    if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : (buffer.length - 1);
    }

    // Normalize byteOffset: negative offsets start from the end of the buffer
    if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
    if (byteOffset >= buffer.length) {
        if (dir) return -1;
        else byteOffset = buffer.length - 1;
    } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
    }

    // Normalize val
    if (typeof val === 'string') {
        val = (Buffer as any).from(val, encoding);
    }

    if ((Buffer as any).isBuffer(val)) {
        // Special case: looking for empty string/buffer always fails
        if (val.length === 0) {
            return -1;
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
    } else if (typeof val === 'number') {
        val = val & 0xFF; // Search for a byte value [0-255]
        if (typeof Uint8Array.prototype.indexOf === 'function') {
            if (dir) {
                return (Uint8Array.prototype.indexOf as any).call(buffer, val, byteOffset);
            } else {
                return (Uint8Array.prototype.lastIndexOf as any).call(buffer, val, byteOffset);
            }
        }
        return arrayIndexOf(buffer, [val as any], byteOffset, encoding, dir);
    }

    throw new TypeError('val must be string, number or Buffer');
}

function arrayIndexOf(arr: Buffer, val: Buffer | number[], byteOffset: number, encoding: any, dir?: boolean): number {
    let indexSize = 1;
    let arrLength = arr.length;
    let valLength = val.length;

    if (encoding !== undefined) {
        encoding = String(encoding).toLowerCase();
        if (encoding === 'ucs2' || encoding === 'ucs-2' ||
            encoding === 'utf16le' || encoding === 'utf-16le') {
            if (arr.length < 2 || val.length < 2) {
                return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
        }
    }

    function read(buf: Buffer, i: number): number {
        if (indexSize === 1) {
            return buf[i];
        } else {
            return (buf as any).readUInt16BE(i * indexSize);
        }
    }

    let i: number;
    if (dir) {
        let foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val as Buffer, foundIndex === -1 ? 0 : i - foundIndex)) {
                if (foundIndex === -1) foundIndex = i;
                if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
                if (foundIndex !== -1) i -= i - foundIndex;
                foundIndex = -1;
            }
        }
    } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
            let found = true;
            for (let j = 0; j < valLength; j++) {
                if (read(arr, i + j) !== read(val as Buffer, j)) {
                    found = false;
                    break;
                }
            }
            if (found) return i;
        }
    }

    return -1;
}

BP.includes = function includes(this: Buffer, val: any, byteOffset?: any, encoding?: any): boolean {
    return this.indexOf(val, byteOffset, encoding) !== -1;
};

BP.indexOf = function indexOf(this: Buffer, val: any, byteOffset?: any, encoding?: any): number {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};

BP.lastIndexOf = function lastIndexOf(this: Buffer, val: any, byteOffset?: any, encoding?: any): number {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};

function hexWrite(buf: Buffer, string: string, offset: number, length: number): number {
    offset = Number(offset) || 0;
    let remaining = buf.length - offset;
    if (!length) {
        length = remaining;
    } else {
        length = Number(length);
        if (length > remaining) {
            length = remaining;
        }
    }

    // must be an even number of digits
    const strLen = string.length;
    if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

    if (length > strLen / 2) {
        length = strLen / 2;
    }
    let i: number;
    for (i = 0; i < length; ++i) {
        const parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf[offset + i] = parsed;
    }
    return i;
}

function utf8Write(buf: Buffer, string: string, offset: number, length: number): number {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}

function asciiWrite(buf: Buffer, string: string, offset: number, length: number): number {
    return blitBuffer(asciiToBytes(string), buf, offset, length);
}

function latin1Write(buf: Buffer, string: string, offset: number, length: number): number {
    return asciiWrite(buf, string, offset, length);
}

function base64Write(buf: Buffer, string: string, offset: number, length: number): number {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
}

function ucs2Write(buf: Buffer, string: string, offset: number, length: number): number {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}

BP.write = function write(this: Buffer, string: string, offset?: any, length?: any, encoding?: any): number {
    // Buffer#write(string)
    if (offset === undefined) {
        encoding = 'utf8';
        length = this.length;
        offset = 0;
        // Buffer#write(string, encoding)
    } else if (length === undefined && typeof offset === 'string') {
        encoding = offset;
        length = this.length;
        offset = 0;
        // Buffer#write(string, offset[, length][, encoding])
    } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === undefined) encoding = 'utf8';
        } else {
            encoding = length;
            length = undefined;
        }
    } else {
        throw new Error(
            'Buffer.write(string, encoding, offset[, length]) is no longer supported'
        );
    }

    const remaining = this.length - offset;
    if (length === undefined || length > remaining) length = remaining;

    if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
        throw new RangeError('Attempt to write outside buffer bounds');
    }

    if (!encoding) encoding = 'utf8';

    let loweredCase = false;
    for (;;) {
        switch (encoding) {
            case 'hex':
                return hexWrite(this, string, offset, length);

            case 'utf8':
            case 'utf-8':
                return utf8Write(this, string, offset, length);

            case 'ascii':
                return asciiWrite(this, string, offset, length);

            case 'latin1':
            case 'binary':
                return latin1Write(this, string, offset, length);

            case 'base64':
                // Warning: maxLength not taken into account in base64Write
                return base64Write(this, string, offset, length);

            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return ucs2Write(this, string, offset, length);

            default:
                if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
                encoding = ('' + encoding).toLowerCase();
                loweredCase = true;
        }
    }
};

BP.toJSON = function toJSON(this: Buffer): object {
    return {
        type: 'Buffer',
        data: Array.prototype.slice.call((this as any)._arr || this, 0)
    };
};

function base64Slice(buf: Buffer, start: number, end: number): string {
    if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
    } else {
        return base64.fromByteArray(buf.slice(start, end));
    }
}

function utf8Slice(buf: Buffer, start: number, end: number): string {
    end = Math.min(buf.length, end);
    const res: number[] = [];

    let i = start;
    while (i < end) {
        const firstByte = buf[i];
        let codePoint = null;
        let bytesPerSequence = (firstByte > 0xEF) ? 4
            : (firstByte > 0xDF) ? 3
                : (firstByte > 0xBF) ? 2
                    : 1;

        if (i + bytesPerSequence <= end) {
            let secondByte: number;
            let thirdByte: number;
            let fourthByte: number;
            let tempCodePoint: number;

            switch (bytesPerSequence) {
                case 1:
                    if (firstByte < 0x80) {
                        codePoint = firstByte;
                    }
                    break;
                case 2:
                    secondByte = buf[i + 1];
                    if ((secondByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
                        if (tempCodePoint > 0x7F) {
                            codePoint = tempCodePoint;
                        }
                    }
                    break;
                case 3:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
                        if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                            codePoint = tempCodePoint;
                        }
                    }
                    break;
                case 4:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    fourthByte = buf[i + 3];
                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                        tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
                        if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                            codePoint = tempCodePoint;
                        }
                    }
            }
        }

        if (codePoint === null) {
            // we did not generate a valid codePoint so insert a
            // replacement char (U+FFFD) and advance only 1 byte
            codePoint = 0xFFFD;
            bytesPerSequence = 1;
        } else if (codePoint > 0xFFFF) {
            // encode to utf16 (surrogate pair dance)
            codePoint -= 0x10000;
            res.push((codePoint >>> 10) & 0x3FF | 0xD800);
            codePoint = 0xDC00 | (codePoint & 0x3FF);
        }

        res.push(codePoint);
        i += bytesPerSequence;
    }

    return decodeCodePointsArray(res);
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray(codePoints: number[]): string {
    const len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) {
        return (String as any).fromCharCode.apply(String, codePoints); // avoid extra slice()
    }

    // Decode in chunks to avoid "call stack size exceeded".
    let res = '';
    let i = 0;
    while (i < len) {
        res += (String as any).fromCharCode.apply(
            String,
            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        );
    }
    return res;
}

function asciiSlice(buf: Buffer, start: number, end: number): string {
    let ret = '';
    end = Math.min(buf.length, end);

    for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 0x7F);
    }
    return ret;
}

function latin1Slice(buf: Buffer, start: number, end: number): string {
    let ret = '';
    end = Math.min(buf.length, end);

    for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
    }
    return ret;
}

function hexSlice(buf: Buffer, start: number, end: number): string {
    const len = buf.length;

    if (!start || start < 0) start = 0;
    if (!end || end < 0 || end > len) end = len;

    let out = '';
    for (let i = start; i < end; ++i) {
        out += toHex(buf[i]);
    }
    return out;
}

function utf16leSlice(buf: Buffer, start: number, end: number): string {
    const bytes = buf.slice(start, end);
    let res = '';
    for (let i = 0; i < bytes.length; i += 2) {
        res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256));
    }
    return res;
}

BP.slice = function slice(this: Buffer, start?: number, end?: number): Buffer {
    const len = this.length;
    start = ~~(start as any);
    end = end === undefined ? len : ~~(end as any);

    if (start < 0) {
        start += len;
        if (start < 0) start = 0;
    } else if (start > len) {
        start = len;
    }

    if (end < 0) {
        end += len;
        if (end < 0) end = 0;
    } else if (end > len) {
        end = len;
    }

    if (end < start) end = start;

    const newBuf = this.subarray(start, end);
    // Return an augmented `Uint8Array` instance
    Object.setPrototypeOf(newBuf, Buffer.prototype);
    return newBuf as unknown as Buffer;
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset(offset: number, ext: number, length: number): void {
    if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint');
    if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}

BP.readUIntLE = function readUIntLE(this: Buffer, offset: number, byteLength: number, noAssert?: boolean): number {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);

    let val = this[offset];
    let mul = 1;
    let i = 0;
    while (++i < byteLength && (mul *= 0x100)) {
        val += this[offset + i] * mul;
    }

    return val;
};

BP.readUIntBE = function readUIntBE(this: Buffer, offset: number, byteLength: number, noAssert?: boolean): number {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) {
        checkOffset(offset, byteLength, this.length);
    }

    let val = this[offset + --byteLength];
    let mul = 1;
    while (byteLength > 0 && (mul *= 0x100)) {
        val += this[offset + --byteLength] * mul;
    }

    return val;
};

BP.readUInt8 = function readUInt8(this: Buffer, offset: number, noAssert?: boolean): number {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    return this[offset];
};

BP.readUInt16LE = function readUInt16LE(this: Buffer, offset: number, noAssert?: boolean): number {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] | (this[offset + 1] << 8);
};

BP.readUInt16BE = function readUInt16BE(this: Buffer, offset: number, noAssert?: boolean): number {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return (this[offset] << 8) | this[offset + 1];
};

BP.readUInt32LE = function readUInt32LE(this: Buffer, offset: number, noAssert?: boolean): number {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);

    return ((this[offset]) |
        (this[offset + 1] << 8) |
        (this[offset + 2] << 16)) +
        (this[offset + 3] * 0x1000000);
};

BP.readUInt32BE = function readUInt32BE(this: Buffer, offset: number, noAssert?: boolean): number {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);

    return (this[offset] * 0x1000000) +
        ((this[offset + 1] << 16) |
            (this[offset + 2] << 8) |
            this[offset + 3]);
};

BP.readIntLE = function readIntLE(this: Buffer, offset: number, byteLength: number, noAssert?: boolean): number {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);

    let val = this[offset];
    let mul = 1;
    let i = 0;
    while (++i < byteLength && (mul *= 0x100)) {
        val += this[offset + i] * mul;
    }
    mul *= 0x80;

    if (val >= mul) val -= Math.pow(2, 8 * byteLength);

    return val;
};

BP.readIntBE = function readIntBE(this: Buffer, offset: number, byteLength: number, noAssert?: boolean): number {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);

    let i = byteLength;
    let mul = 1;
    let val = this[offset + --i];
    while (i > 0 && (mul *= 0x100)) {
        val += this[offset + --i] * mul;
    }
    mul *= 0x80;

    if (val >= mul) val -= Math.pow(2, 8 * byteLength);

    return val;
};

BP.readInt8 = function readInt8(this: Buffer, offset: number, noAssert?: boolean): number {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    if (!(this[offset] & 0x80)) return (this[offset]);
    return ((0xff - this[offset] + 1) * -1);
};

BP.readInt16LE = function readInt16LE(this: Buffer, offset: number, noAssert?: boolean): number {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    const val = this[offset] | (this[offset + 1] << 8);
    return (val & 0x8000) ? val | 0xFFFF0000 : val;
};

BP.readInt16BE = function readInt16BE(this: Buffer, offset: number, noAssert?: boolean): number {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    const val = this[offset + 1] | (this[offset] << 8);
    return (val & 0x8000) ? val | 0xFFFF0000 : val;
};

BP.readInt32LE = function readInt32LE(this: Buffer, offset: number, noAssert?: boolean): number {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);

    return (this[offset]) |
        (this[offset + 1] << 8) |
        (this[offset + 2] << 16) |
        (this[offset + 3] << 24);
};

BP.readInt32BE = function readInt32BE(this: Buffer, offset: number, noAssert?: boolean): number {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);

    return (this[offset] << 24) |
        (this[offset + 1] << 16) |
        (this[offset + 2] << 8) |
        (this[offset + 3]);
};

BP.readFloatLE = function readFloatLE(this: Buffer, offset: number, noAssert?: boolean): number {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754Read(this, offset, true, 23, 4);
};

BP.readFloatBE = function readFloatBE(this: Buffer, offset: number, noAssert?: boolean): number {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754Read(this, offset, false, 23, 4);
};

BP.readDoubleLE = function readDoubleLE(this: Buffer, offset: number, noAssert?: boolean): number {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754Read(this, offset, true, 52, 8);
};

BP.readDoubleBE = function readDoubleBE(this: Buffer, offset: number, noAssert?: boolean): number {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754Read(this, offset, false, 52, 8);
};

function checkInt(buf: Buffer, value: number, offset: number, ext: number, max: number, min: number): void {
    if (!(Buffer as any).isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length) throw new RangeError('Index out of range');
}

BP.writeUIntLE = function writeUIntLE(this: Buffer, value: number, offset: number, byteLength: number, noAssert?: boolean): number {
    value = +value;
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
    }

    let mul = 1;
    let i = 0;
    this[offset] = value & 0xFF;
    while (++i < byteLength && (mul *= 0x100)) {
        this[offset + i] = (value / mul) & 0xFF;
    }

    return offset + byteLength;
};

BP.writeUIntBE = function writeUIntBE(this: Buffer, value: number, offset: number, byteLength: number, noAssert?: boolean): number {
    value = +value;
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
    }

    let i = byteLength - 1;
    let mul = 1;
    this[offset + i] = value & 0xFF;
    while (--i >= 0 && (mul *= 0x100)) {
        this[offset + i] = (value / mul) & 0xFF;
    }

    return offset + byteLength;
};

BP.writeUInt8 = function writeUInt8(this: Buffer, value: number, offset: number, noAssert?: boolean): number {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
    this[offset] = (value & 0xff);
    return offset + 1;
};

BP.writeUInt16LE = function writeUInt16LE(this: Buffer, value: number, offset: number, noAssert?: boolean): number {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    return offset + 2;
};

BP.writeUInt16BE = function writeUInt16BE(this: Buffer, value: number, offset: number, noAssert?: boolean): number {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
    return offset + 2;
};

BP.writeUInt32LE = function writeUInt32LE(this: Buffer, value: number, offset: number, noAssert?: boolean): number {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
    return offset + 4;
};

BP.writeUInt32BE = function writeUInt32BE(this: Buffer, value: number, offset: number, noAssert?: boolean): number {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
    return offset + 4;
};

BP.writeIntLE = function writeIntLE(this: Buffer, value: number, offset: number, byteLength: number, noAssert?: boolean): number {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        const limit = Math.pow(2, (8 * byteLength) - 1);

        checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }

    let i = 0;
    let mul = 1;
    let sub = 0;
    this[offset] = value & 0xFF;
    while (++i < byteLength && (mul *= 0x100)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
        }
        this[offset + i] = (((value / mul) >> 0) - sub) & 0xFF;
    }

    return offset + byteLength;
};

BP.writeIntBE = function writeIntBE(this: Buffer, value: number, offset: number, byteLength: number, noAssert?: boolean): number {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        const limit = Math.pow(2, (8 * byteLength) - 1);

        checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }

    let i = byteLength - 1;
    let mul = 1;
    let sub = 0;
    this[offset + i] = value & 0xFF;
    while (--i >= 0 && (mul *= 0x100)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
        }
        this[offset + i] = (((value / mul) >> 0) - sub) & 0xFF;
    }

    return offset + byteLength;
};

BP.writeInt8 = function writeInt8(this: Buffer, value: number, offset: number, noAssert?: boolean): number {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
    if (value < 0) value = 0xff + value + 1;
    this[offset] = (value & 0xff);
    return offset + 1;
};

BP.writeInt16LE = function writeInt16LE(this: Buffer, value: number, offset: number, noAssert?: boolean): number {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    return offset + 2;
};

BP.writeInt16BE = function writeInt16BE(this: Buffer, value: number, offset: number, noAssert?: boolean): number {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
    return offset + 2;
};

BP.writeInt32LE = function writeInt32LE(this: Buffer, value: number, offset: number, noAssert?: boolean): number {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
    return offset + 4;
};

BP.writeInt32BE = function writeInt32BE(this: Buffer, value: number, offset: number, noAssert?: boolean): number {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
    if (value < 0) value = 0xffffffff + value + 1;
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
    return offset + 4;
};

function checkIEEE754(buf: Buffer, value: number, offset: number, ext: number, max: number, min: number): void {
    if (offset + ext > buf.length) throw new RangeError('Index out of range');
    if (offset < 0) throw new RangeError('Index out of range');
}

function writeFloat(buf: Buffer, value: number, offset: number, littleEndian: boolean, noAssert?: boolean): number {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
    }
    ieee754Write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
}

BP.writeFloatLE = function writeFloatLE(this: Buffer, value: number, offset: number, noAssert?: boolean): number {
    return writeFloat(this, value, offset, true, noAssert);
};

BP.writeFloatBE = function writeFloatBE(this: Buffer, value: number, offset: number, noAssert?: boolean): number {
    return writeFloat(this, value, offset, false, noAssert);
};

function writeDouble(buf: Buffer, value: number, offset: number, littleEndian: boolean, noAssert?: boolean): number {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
    }
    ieee754Write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
}

BP.writeDoubleLE = function writeDoubleLE(this: Buffer, value: number, offset: number, noAssert?: boolean): number {
    return writeDouble(this, value, offset, true, noAssert);
};

BP.writeDoubleBE = function writeDoubleBE(this: Buffer, value: number, offset: number, noAssert?: boolean): number {
    return writeDouble(this, value, offset, false, noAssert);
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
BP.copy = function copy(this: Buffer, target: Buffer, targetStart?: number, start?: number, end?: number): number {
    if (!start) start = 0;
    if (!end && end !== 0) end = this.length;
    if (targetStart === undefined || targetStart >= target.length) targetStart = target.length;
    if (!targetStart) targetStart = 0;
    if (end > 0 && end < start) end = start;

    // Copy 0 bytes; we're done
    if (end === start) return 0;
    if (target.length === 0 || this.length === 0) return 0;

    // Fatal error conditions
    if (targetStart < 0) {
        throw new RangeError('targetStart out of bounds');
    }
    if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
    if (end < 0) throw new RangeError('sourceEnd out of bounds');

    // Are we oob?
    if (end > this.length) end = this.length;
    if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
    }

    const len = end - start;
    let i;

    if (this === target && start < targetStart && targetStart < end) {
        // descending copy from end
        for (i = len - 1; i >= 0; --i) {
            target[i + targetStart] = this[i + start];
        }
    } else if (len < 1000) {
        // ascending copy from start
        for (i = 0; i < len; ++i) {
            target[i + targetStart] = this[i + start];
        }
    } else {
        Uint8Array.prototype.set.call(
            target,
            this.subarray(start, start + len),
            targetStart
        );
    }

    return len;
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
BP.fill = function fill(this: Buffer, val: any, start?: any, end?: any, encoding?: any): Buffer {
    // Handle string cases:
    if (typeof val === 'string') {
        if (typeof start === 'string') {
            encoding = start;
            start = 0;
            end = this.length;
        } else if (typeof end === 'string') {
            encoding = end;
            end = this.length;
        }
        if (val.length === 1) {
            const code = val.charCodeAt(0);
            if (code < 256) {
                val = code;
            }
        }
        if (encoding !== undefined && typeof encoding !== 'string') {
            throw new TypeError('encoding must be a string');
        }
        if (typeof encoding === 'string' && !(Buffer as any).isEncoding(encoding)) {
            throw new TypeError('Unknown encoding: ' + encoding);
        }
    } else if (typeof val === 'number') {
        val = val & 255;
    }

    // Invalid ranges are not set to a default, so can range check early.
    if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError('Out of range index');
    }

    if (end <= start) {
        return this;
    }

    start = start >>> 0;
    end = end === undefined ? this.length : end >>> 0;

    if (!val) val = 0;

    let i;
    if (typeof val === 'number') {
        for (i = start; i < end; ++i) {
            this[i] = val;
        }
    } else {
        const bytes = (Buffer as any).isBuffer(val)
            ? val
            : new (Buffer as any)(val, encoding);
        const len = bytes.length;
        for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
        }
    }

    return this;
};

// HELPER FUNCTIONS
// ================

const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

function base64clean(str: string): string {
    // Node strips out invalid characters like \n and \t from the string, base64-js does not
    str = str.trim().replace(INVALID_BASE64_RE, '');
    // Node converts strings with length < 2 to ''
    if (str.length < 2) return '';
    // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
    while (str.length % 4 !== 0) {
        str = str + '=';
    }
    return str;
}

function toHex(n: number): string {
    if (n < 16) return '0' + n.toString(16);
    return n.toString(16);
}

function utf8ToBytes(string: string, units?: number): number[] {
    units = units || Infinity;
    let codePoint: number;
    const length = string.length;
    let leadSurrogate = null as number | null;
    const bytes: number[] = [];

    for (let i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i);

        // is surrogate component
        if (codePoint > 0xD7FF && codePoint < 0xE000) {
            // last char was a lead
            if (!leadSurrogate) {
                // no lead yet
                if (codePoint > 0xDBFF) {
                    // unexpected trail
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                    continue;
                } else if (i + 1 === length) {
                    // unpaired lead
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                    continue;
                }

                // valid lead
                leadSurrogate = codePoint;

                continue;
            }

            // 2 leads in a row
            if (codePoint < 0xDC00) {
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
                leadSurrogate = codePoint;
                continue;
            }

            // valid surrogate pair
            codePoint = (((leadSurrogate - 0xD800) << 10) | (codePoint - 0xDC00)) + 0x10000;
        } else if (leadSurrogate) {
            // valid bmp char, but last char was a lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        }

        leadSurrogate = null;

        // encode utf8
        if (codePoint < 0x80) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
        } else if (codePoint < 0x800) {
            if ((units -= 2) < 0) break;
            bytes.push(
                codePoint >> 0x6 | 0xC0,
                codePoint & 0x3F | 0x80
            );
        } else if (codePoint < 0x10000) {
            if ((units -= 3) < 0) break;
            bytes.push(
                codePoint >> 0xC | 0xE0,
                (codePoint >> 0x6) & 0x3F | 0x80,
                codePoint & 0x3F | 0x80
            );
        } else if (codePoint < 0x110000) {
            if ((units -= 4) < 0) break;
            bytes.push(
                codePoint >> 0x12 | 0xF0,
                (codePoint >> 0xC) & 0x3F | 0x80,
                (codePoint >> 0x6) & 0x3F | 0x80,
                codePoint & 0x3F | 0x80
            );
        } else {
            throw new Error('Invalid code point');
        }
    }

    return bytes;
}

function asciiToBytes(str: string): number[] {
    const byteArray: number[] = [];
    for (let i = 0; i < str.length; ++i) {
        // Node's code seems to be doing this and not & 0x7F..
        byteArray.push(str.charCodeAt(i) & 0xFF);
    }
    return byteArray;
}

function utf16leToBytes(str: string, units?: number): number[] {
    units = units === undefined ? Infinity : units;
    let c: number;
    let hi: number;
    let lo: number;
    const byteArray: number[] = [];
    for (let i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break;

        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
    }

    return byteArray;
}

function base64ToBytes(str: string): Uint8Array {
    return base64.toByteArray(base64clean(str));
}

function blitBuffer(src: ArrayLike<number>, dst: Buffer, offset: number, length: number): number {
    let i;
    for (i = 0; i < length; ++i) {
        if ((i + offset >= dst.length) || (i >= src.length)) break;
        dst[i + offset] = src[i];
    }
    return i;
}

// ArrayBuffers from another context (i.e. an iframe) do not pass the `instanceof` check
// but they should be treated as valid. See: https://github.com/feross/buffer/issues/166
function isArrayBuffer(obj: any): boolean {
    return obj instanceof ArrayBuffer ||
        (obj != null && obj.constructor != null && obj.constructor.name === 'ArrayBuffer' &&
            typeof obj.byteLength === 'number');
}

// Node 0.10 supports `ArrayBuffer` but lacks `ArrayBuffer.isView`
function isArrayBufferView(obj: any): boolean {
    return (typeof ArrayBuffer.isView === 'function') && ArrayBuffer.isView(obj);
}

function numberIsNaN(obj: any): boolean {
    return obj !== obj; // eslint-disable-line no-self-compare
}