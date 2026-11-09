package ae.update

fun isNewer(latest: String, current: String): Boolean {
    if (current.startsWith("0.0.0")) return false
    val a = latest.split("-")[0].split(".").map { it.toIntOrNull() ?: 0 }
    val b = current.split("-")[0].split(".").map { it.toIntOrNull() ?: 0 }
    for (i in 0 until maxOf(a.size, b.size)) {
        val x = a.getOrElse(i) { 0 }
        val y = b.getOrElse(i) { 0 }
        if (x != y) return x > y
    }
    return false
}
