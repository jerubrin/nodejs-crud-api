const res = Promise.any([
  new Promise((r) => {return r(1)}),
  new Promise((r) => {return r(2)}),
  new Promise((r) => {return r(3)}),
  new Promise((r) => {return r(4)})
]).then(123, 321);

console.log (
  await res
)

Promise.resolve(123).then(res => console.log(res))

const qwe = async function() { return 'qwe' };

console.log(qwe());