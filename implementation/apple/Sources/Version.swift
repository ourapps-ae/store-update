import Foundation

// Development versions never request an update; suffixes do not affect ordering.
func isNewer(_ latest: String, than current: String) -> Bool {
    if current.hasPrefix("0.0.0") { return false }
    let a = latest.split(separator: "-")[0].split(separator: ".").map { Int($0) ?? 0 }
    let b = current.split(separator: "-")[0].split(separator: ".").map { Int($0) ?? 0 }
    for i in 0..<max(a.count, b.count) {
        let x = i < a.count ? a[i] : 0
        let y = i < b.count ? b[i] : 0
        if x != y { return x > y }
    }
    return false
}

let currentVersion = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "0.0.0"
