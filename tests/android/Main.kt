import ae.update.isNewer

fun main() {
    check(isNewer("0.6.10", "0.6.9"))
    check(!isNewer("0.6.9", "0.6.10"))
    check(!isNewer("1.2.3", "1.2.3"))
    check(!isNewer("1.2.3-beta", "1.2.3"))
    check(isNewer("1.2.4-dev", "1.2.3-final"))
    check(!isNewer("99.1.0", "0.0.0-dev"))
    check(!isNewer("99.1.0", "0.0.01"))
    check(!isNewer("1.2", "1.2.0"))
    check(isNewer("1.3", "1.2.99"))
    check(isNewer("2.bad.0", "1.9.9"))
    println("10 version assertions passed")
}
