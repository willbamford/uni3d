function requestFileSystem () {
  return new Promise((resolve, reject) => {
    window.webkitRequestFileSystem(
      window.PERSISTENT, 1024 * 1024 * 1024,
      resolve,
      reject
    )
  })
}

export default requestFileSystem
