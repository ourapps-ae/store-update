import Foundation

let data = try Data(contentsOf: URL(fileURLWithPath: "tests/fixtures/versions.json"))
let cases = try JSONSerialization.jsonObject(with: data) as! [[Any]]
for row in cases {
    assert(isNewer(row[0] as! String, than: row[1] as! String) == (row[2] as! Bool))
}
print("\(cases.count) version assertions passed")
