package main

import "fmt"

// Use a helper function so that we can pass in an initialized map.
func fib(N uint) uint64 {
	cache := make(map[uint]uint64)
	cache[0] = 0
	cache[1] = 1
	return helper(N, cache)
}

// This helper function does all the heavy lifting. If our desired fib number
// isn't in the cache, then calculate it first and store it in the cache before
// returning the answer.
func helper(N uint, Cache map[uint]uint64) uint64 {
	i, ok := Cache[N]
	if ok {
		return i
	}
	Cache[N] = helper(N-1, Cache) + helper(N-2, Cache)
	return Cache[N]
}

func main() {
	n := uint(1005)
	fmt.Println(fib(n))
}

// package main

// import (
// 	"fmt"
// 	"math"
// 	"math/cmplx"
// )

// var (
// 	ToBe   bool       = false
// 	MaxInt uint64     = 1<<64 - 1
// 	z      complex128 = cmplx.Sqrt(-5 + 12i)
// )

// func printThis(x float64) float64 {
// 	fmt.Printf(" --- Type: %T Value: %v\n", x, x)
// 	return x * 0.1
// }

// func fib(n int) int {
// 	if n == 0 {
// 		return 0
// 	}
// 	return fib(n-1) + fib(n-2)
// }

// func main() {
// 	// for i in range 100000:
// 	fmt.Printf("Type: %T Value: %v\n", ToBe, ToBe)
// 	fmt.Printf("Type: %T Value: %v\n", MaxInt, MaxInt)
// 	fmt.Printf("Type: %T Value: %v\n", z, z)
// 	fmt.Printf("Now you have %g problems.\n", math.Sqrt(7))
// 	printThis(10395810835)
// 	sum := 0
// 	for i := 0; i < 1000000; i++ {
// 		sum += i
// 	}
// 	fmt.Println(sum)
// 	fmt.Println(fib(4))
// }
