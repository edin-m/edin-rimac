
export interface CompareFunc<Key> {
    // k1 < k2 => -1
    // k1 === k2 => 0
    // k1 > k2 => 1
    (k1: Key, k2: Key): number;
}

// https://algs4.cs.princeton.edu/code/edu/princeton/cs/algs4/BTree.java.html
export class BTree<Key, Value> {
    // max children per B-tree node = M-1
    // (must be even and greater than 2)
    private M: number;

    // root of the B-tree
    private root: BTreeNode<Key, Value>;

    // height of the B-tree
    private _height: number = 0;

    // number of key-value pairs in the B-tree
    private n: number = 0;

    private compareFunc?: CompareFunc<Key>;

    // max children per B-tree node = M-1
    // (must be even and greater than 2)
    constructor(M: number, compareFunc?: CompareFunc<Key>) {
        this.M = M;
        this.root = new BTreeNode(this.M, 0);
        this.compareFunc = compareFunc;
    }

    /**
     * Returns true if this symbol table is empty.
     * @return {@code true} if this symbol table is empty; {@code false} otherwise
     */
    isEmpty(): boolean {
        return this.size() === 0;
    }

    /**
     * Returns the number of key-value pairs in this symbol table.
     * @return the number of key-value pairs in this symbol table
     */
    size(): number {
        return this.n;
    }

    /**
     * Returns the height of this B-tree (for debugging).
     *
     * @return the height of this B-tree
     */
    height(): number {
        return this._height;
    }

    /**
     * Returns the value associated with the given key.
     *
     * @param  key the key
     * @return the value associated with the given key if the key is in the symbol table
     *         and {@code null} if the key is not in the symbol table
     */
    get(key: Key): Value | null {
        return this.search(this.root, key, this._height);
    }

    // external node
    private search(x: BTreeNode<Key, Value>, key: Key, ht: number): Value | null {
        const children = x.children;
        
        if (ht === 0) {
            for (let j = 0; j < x.m; j++) {
                if (this.eq(key, children[j]!.key)) {
                    return children[j]!.val;
                }
            }
        }

        // internal node
        else {
            for (let j = 0; j < x.m; j++) {
                if (!children[j]) continue;

                if (j+1 === x.m || this.less(key, children[j+1]!.key)) {
                    return this.search(children[j]!.next!, key, ht-1);
                }
            }
        }
        return null;
    }
    
    /**
     * Inserts the key-value pair into the symbol table, overwriting the old value
     * with the new value if the key is already in the symbol table.
     * If the value is {@code null}, this effectively deletes the key from the symbol table.
     *
     * @param  key the key
     * @param  val the value
     */
    put(key: Key, val: Value) {
        const u = this.insert(this.root, key, val, this._height);
        this.n++;
        if (u === null) {
            return;
        }

        const t = new BTreeNode<Key, Value>(this.M, 2);
        t.children[0] = new BTreeEntry<Key, Value>(this.root.children[0]!.key, null, this.root);
        t.children[1] = new BTreeEntry<Key, Value>(u.children[0]!.key, null, u);
        this.root = t;
        this._height++;
    }

    
    private insert(h: BTreeNode<Key, Value>, key: Key, val: Value, ht: number): BTreeNode<Key, Value> | null {
        let j;
        const t = new BTreeEntry<Key, Value>(key, val, null);

        // external node
        if (ht === 0) {
            for (j = 0; j < h.m; j++) {
                if (this.less(key, h.children[j]!.key)) {
                    break;
                }
            }
        }
        
        // internal node
        else {
            for (j = 0; j < h.m; j++) {
                if ((j+1) === h.m || this.less(key, h.children[j+1]!.key)) {
                    const u = this.insert(h.children[j++]!.next!, key, val, ht-1);
                    if (u === null) {
                        return null;
                    }
                    t.key = u.children[0]!.key;
                    t.val = null;
                    t.next = u;
                    break;
                }
            }
        }

        for (let i = h.m; i > j; i--) {
            h.children[i] = h.children[i-1];
        }
        h.children[j] = t;
        h.m++;
        if (h.m < this.M) {
            return null;
        }
        else {
            return this.split(h);
        }
    }

    // split node in half
    private split(h: BTreeNode<Key, Value>): BTreeNode<Key, Value> {
        const t = new BTreeNode<Key, Value>(this.M, this.M/2);
        h.m = this.M/2;
        for (let j = 0; j < this.M/2; j++) {
            t.children[j] = h.children[this.M/2+j];
        }
        return t;
    }

    /**
     * Returns a string representation of this B-tree (for debugging).
     *
     * @return a string representation of this B-tree.
     */
    toString(): string {
        return this._toString(this.root, this._height, "") + "\n";
    }

    private _toString(h: BTreeNode<Key, Value> | null, ht: number, indent: string): string {
        if (h === null) return '';
        let s = '';
        const children = h.children;

        if (ht === 0) {
            for (let j = 0; j < h.m; j++) {
                s += indent + 'key:' + children[j]!.key + 
                    ' val:' + children[j]!.val + '\n';
            }
        }
        else {
            for (let j = 0; j < h.m; j++) {
                if (j > 0) {
                    s += indent + 'node(' + children[j]!.key + ')\n';
                }
                s += this._toString(children[j]!.next, ht-1, indent + '    ');
            }
        }
        return s;
    }

    // comparison functions - make Comparable instead of Key to avoid casts
    private less(k1: Key, k2: Key) {
        if (this.compareFunc) {
            return this.compareFunc(k1, k2) < 0;
        }

        return k1 < k2;
    }

    private eq(k1: Key, k2: Key) {
        if (this.compareFunc) {
            return this.compareFunc(k1, k2) === 0;
        }
        return k1 === k2;
    }
}

// helper B-tree node data type
export class BTreeNode<Key, Value> {
    // number of children
    m: number;
    // the array of children
    children: Array<BTreeEntry<Key, Value> | null>;

    constructor(_M: number, k: number) {
        this.children = Array(_M).map(x => null);
        this.m = k;
    }
}

// internal nodes: only use key and next
// external nodes: only use key and value
export class BTreeEntry<Key, Value> {
    key: Key;
    val: Value | null;
    next: BTreeNode<Key, Value> | null;

    constructor(key: Key, val: Value | null, next: BTreeNode<Key, Value> | null) {
        this.key = key;
        this.val = val;
        this.next = next;
    }
}