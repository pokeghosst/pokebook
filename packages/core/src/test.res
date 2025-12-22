let doc = YjsPoemDoc.make()

doc.transact(() => {
  let t = doc.name()
  t.insert(0, "hello")
})

Console.log(doc.name().toString())
