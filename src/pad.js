function pad2 (number) {
  if (number <= 99) {
    number = ('0' + number).slice(-2)
  }
  return number
}

function pad4 (number) {
  if (number <= 9999) {
    number = ('000' + number).slice(-4)
  }
  return number
}

export {
  pad2,
  pad4
}
