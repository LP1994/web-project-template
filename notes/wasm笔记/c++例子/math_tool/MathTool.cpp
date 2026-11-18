#include <climits>
#include <cfloat>
#include <cmath>
#include <complex>
#include <cstdlib>
#include <cstdint>
#include <cinttypes>
#include <array>
#include <string>

using namespace std;

extern "C" {

double Add( double x, double y ){
  return x + y;
}

double Sub( double x, double y ){
  return x - y;
}

double Mul( double x, double y ){
  return x * y;
}

double Div( double x, double y ){
  return x / y;
}

long int Mod( long int x, long int y ){
  return x % y;
}

double Fib( double index, double initial1, double initial2 ){
  if( index <= 1 ){
    return initial1;
  }
  else if( index == 2 ){
    return initial2;
  }
  else if( index > 1476 ){
    return NAN;
  }
  else{
    return Fib( index - 1, initial2, initial1 + initial2 );
  }
}

}