const run = async () => {
  console.log('hello world!')

  if (process.env.TEST) {
    console.log(`The env variable test=${process.env.TEST}`)
  }
}

run()
