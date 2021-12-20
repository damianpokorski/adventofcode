interface LinkedListInterface<T> {
  item: T;
  next: LinkedListInterface<T>|null;
}

function reverse<T>(linkedList: LinkedListInterface<T>) {
  let head = linkedList as LinkedListInterface<T>|null;
  let previous = null as LinkedListInterface<T>|null;
  let next = null as LinkedListInterface<T>|null;
  while(head !== null) {
    let current = head;
    head = current.next;
    next = current.next;
    current.next = previous;
    previous = current;
  }

  return previous;
}

function getLastElement<T>(list: LinkedListInterface<T>): LinkedListInterface<T> {
  let current = list;
  while(current.next !== null) {
    current = current.next;
  }
  // current = last point
  return current;
}

function addToLinkedList<T>(list: LinkedListInterface<T>, newElement: LinkedListInterface<T>) {
  getLastElement(list).next = newElement;
  return list
}

class LinkedListEntry<T> implements LinkedListInterface<T> {
  next: LinkedListInterface<T>|null = null;
  item: T;
  constructor(value: T) {
    this.item = value;
  }
}

const start = new LinkedListEntry("Cats");
const b = new LinkedListEntry("Dogs");
const c = new LinkedListEntry("Ducks");
const d = new LinkedListEntry("Pumas");
const e = new LinkedListEntry("Chickens");

// a.next = b;
// b.next = c;
// c.next = d;
// d.next = e;
addToLinkedList(start, b);
addToLinkedList(start, c);
addToLinkedList(start, d);
addToLinkedList(start, e);

let point = reverse(start) as LinkedListInterface<string>|null ;
// let sum = 0;

while(point !== null) {
  console.log(point.item);
  // sum += point.item;
  point = point.next;
}
// console.log(sum);

